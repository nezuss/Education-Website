using Microsoft.EntityFrameworkCore;
using Backend.DTO.Cource.MaterialAnswers;
using Backend.Models;
using Backend.Models.Cource.MaterialAnswers;
using Backend.Models.Cource.Materials;
using Backend.Utils;

namespace Backend.Services.Cource
{
    public class SubmitMaterialAnswerService
    {
        private readonly DBContextModel db;

        public SubmitMaterialAnswerService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<object>> GetSubmissionStatus(string materialId, string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return ServiceResult<object>.Fail("User Id is required", 401);

            var submission = await db.MaterialSubmissions
                .Where(s => s.RelatedMaterialId == materialId && s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefaultAsync();

            if (submission != null)
            {
                bool isNeedsRevision = submission.Status == "NeedsRevision";
                return ServiceResult<object>.Ok(new
                {
                    isSubmitted = !isNeedsRevision,
                    hasSubmission = true,
                    needsRevision = isNeedsRevision,
                    canResubmit = isNeedsRevision,
                    submission = submission
                }, "Submission found");
            }

            return ServiceResult<object>.Ok(new
            {
                isSubmitted = false,
                hasSubmission = false,
                needsRevision = false,
                canResubmit = false
            }, "No submission found");
        }

        public async Task<ServiceResult<object>> SubmitTest(SubmitTestAnswerDTO dTO, string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return ServiceResult<object>.Fail("User Id is required", 401);

            if (dTO == null || string.IsNullOrEmpty(dTO.TestId))
            {
                return ServiceResult<object>
                       .Fail("Test Id is required", 400);
            }

            var testMaterial = await db.Materials.FirstOrDefaultAsync(m => m.Id == dTO.TestId);
            if (testMaterial == null)
                return ServiceResult<object>.Fail("Test material not found", 404);

            // * Check if user is enrolled to the course
            var lesson = await db.Lessons.FirstOrDefaultAsync(l => l.MaterialsId != null && l.MaterialsId.Contains(dTO.TestId));
            if (lesson != null)
            {
                var module = await db.Modules.FirstOrDefaultAsync(m => m.LessonsId != null && m.LessonsId.Contains(lesson.Id));
                if (module != null)
                {
                    var course = await db.Cources.FirstOrDefaultAsync(c => c.ModulesId != null && c.ModulesId.Contains(module.Id));
                    if (course != null)
                    {
                        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
                        if (user == null || user.EnrolledCourcesId == null || !user.EnrolledCourcesId.Contains(course.Id))
                        {
                            return ServiceResult<object>
                                   .Fail("You are not enrolled in this course.", 403);
                        }
                    }
                }
            }

            var latestSubmission = await db.MaterialSubmissions
                .Where(s => s.RelatedMaterialId == dTO.TestId && s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefaultAsync();

            if (latestSubmission != null && latestSubmission.Status != "NeedsRevision")
                return ServiceResult<object>.Fail("You have already submitted this test.", 400);

            // * Auto grading submitted test
            var testWithQuestions = await db.Materials.OfType<TestMaterialModel>()
                .Include(t => t.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(m => m.Id == dTO.TestId);

            int totalQuestions = testWithQuestions?.Questions?.Count ?? 0;
            int correctCount = 0;

            var submittedAnswersMap = dTO.Answers?
                .GroupBy(a => a.QuestionId)
                .ToDictionary(g => g.Key, g => g.First().AnswerId)
                ?? new Dictionary<string, string>();

            if (testWithQuestions?.Questions != null)
                foreach (var question in testWithQuestions.Questions)
                    if (submittedAnswersMap.TryGetValue(question.Id, out var answerId))
                    {
                        var answer = question.Answers?.FirstOrDefault(a => a.Id == answerId);
                        if (answer != null && answer.IsCorrect) correctCount++;
                    }

            int calculatedRate = totalQuestions > 0 
                ? (int)Math.Round((double)correctCount / totalQuestions * 12) 
                : 12;

            if (calculatedRate < 1 && correctCount > 0)
                calculatedRate = 1;

            double percentage = totalQuestions > 0 
                ? Math.Round((double)correctCount / totalQuestions * 100, 1) 
                : 100;

            string autoFeedback = $"Automatic check: correct {correctCount} from {totalQuestions}. Rate: {calculatedRate}/12.";

            var submission = new TestSubmissionModel
            {
                Id = Guid.NewGuid().ToString(),
                RelatedMaterialId = dTO.TestId,
                UserId = userId,
                Rate = calculatedRate,
                Status = "Reviewed",
                Feedback = autoFeedback,
                ReviewerId = "0",
                ReviewerName = "Autocheck",
                ReviewerAvatarUrl = "",
                ReviewerAt = DateTime.UtcNow,
                SubmittedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Answers = dTO.Answers?.Select(a => new TestQuestionAnswerModel
                {
                    Id = Guid.NewGuid().ToString(),
                    QuestionId = a.QuestionId,
                    AnswerId = a.AnswerId
                }).ToList() ?? new List<TestQuestionAnswerModel>()
            };

            db.MaterialSubmissions.Add(submission);
            await db.SaveChangesAsync();

            return ServiceResult<object>.Ok(submission, "Test answers have been submitted and automatically checked");
        }

        public async Task<ServiceResult<object>> SubmitAssignment(IFormFile file, string assignmentId, string userId, string storageFolder, string scheme, string host)
        {
            if (string.IsNullOrEmpty(userId))
                return ServiceResult<object>.Fail("User Id is required", 401);

            if (file == null || file.Length == 0)
            {
                return ServiceResult<object>
                       .Fail("File is required and cannot be empty", 400);
            }

            // * Changing the file size limit to 150mb
            const long maxFileSize = 150 * 1024 * 1024;
            if (file.Length > maxFileSize)
            {
                return ServiceResult<object>
                       .Fail("File size exceeds maximum limit of 150mb", 400);
            }

            var assignmentMaterial = await db.Materials.FirstOrDefaultAsync(m => m.Id == assignmentId);
            if (assignmentMaterial == null)
                return ServiceResult<object>.Fail("Assignment material not found", 404);

            // * Check if user is enrolled to the course
            var lesson = await db.Lessons.FirstOrDefaultAsync(l => l.MaterialsId != null && l.MaterialsId.Contains(assignmentId));
            if (lesson != null)
            {
                var module = await db.Modules.FirstOrDefaultAsync(m => m.LessonsId != null && m.LessonsId.Contains(lesson.Id));
                if (module != null)
                {
                    var course = await db.Cources.FirstOrDefaultAsync(c => c.ModulesId != null && c.ModulesId.Contains(module.Id));
                    if (course != null)
                    {
                        var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
                        if (user == null || user.EnrolledCourcesId == null || !user.EnrolledCourcesId.Contains(course.Id))
                        {
                            return ServiceResult<object>
                                   .Fail("You are not enrolled in this course.", 403);
                        }
                    }
                }
            }

            var latestSubmission = await db.MaterialSubmissions
                .Where(s => s.RelatedMaterialId == assignmentId && s.UserId == userId)
                .OrderByDescending(s => s.CreatedAt)
                .FirstOrDefaultAsync();

            if (latestSubmission != null && latestSubmission.Status != "NeedsRevision")
                return ServiceResult<object>.Fail("You have already submitted this assignment.", 400);

            // * Supported file extensions
            var allowedExtensions = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
            {
                ".zip", ".rar", ".7z", ".tar", ".gz", ".tgz",
                ".pdf", ".png", ".jpg", ".jpeg", ".webp",
                ".txt", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"
            };

            var extension = Path.GetExtension(file.FileName);
            if (!string.IsNullOrEmpty(extension) && !allowedExtensions.Contains(extension))
            {
                return ServiceResult<object>
                       .Fail($"File extension '{extension}' is not allowed. Please upload a project archive (.zip, .rar, .7z) or document/image.", 400);
            }

            if (!Directory.Exists(storageFolder))
                Directory.CreateDirectory(storageFolder);

            string submissionId = Guid.NewGuid().ToString();
            string safeFileName = Path.GetFileName(file.FileName);
            string filePath = Path.Combine(storageFolder, submissionId + "_" + safeFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(fileStream);

            string fileUrl = $"{scheme}://{host}/submissions/{submissionId}/file";

            var submission = new AssignmentSubmissionModel
            {
                Id = submissionId,
                RelatedMaterialId = assignmentId,
                UserId = userId,
                FileUrl = fileUrl,
                Rate = -1,
                Status = "Submitted",
                SubmittedAt = DateTime.UtcNow,
                ReviewerId = "",
                ReviewerName = "",
                ReviewerAvatarUrl = "",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.MaterialSubmissions.Add(submission);
            await db.SaveChangesAsync();

            return ServiceResult<object>.Ok(submission, "Assignment has been submitted successfully");
        }
    }
}
