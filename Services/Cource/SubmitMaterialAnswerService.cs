using Microsoft.EntityFrameworkCore;
using Backend.DTO.Cource.MaterialAnswers;
using Backend.Models;
using Backend.Models.Cource.MaterialAnswers;
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
                .FirstOrDefaultAsync(s => s.RelatedMaterialId == materialId && s.UserId == userId);

            if (submission != null)
                return ServiceResult<object>.Ok(new { isSubmitted = true, submission = submission }, "Submission found");

            return ServiceResult<object>.Ok(new { isSubmitted = false }, "No submission found");
        }

        public async Task<ServiceResult<object>> SubmitTest(SubmitTestAnswerDTO dTO, string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return ServiceResult<object>.Fail("User Id is required", 401);

            var testMaterial = await db.Materials.FirstOrDefaultAsync(m => m.Id == dTO.TestId);
            if (testMaterial == null)
                return ServiceResult<object>.Fail("Test material not found", 404);

            var existingSubmission = await db.MaterialSubmissions
                .FirstOrDefaultAsync(s => s.RelatedMaterialId == dTO.TestId && s.UserId == userId);

            if (existingSubmission != null)
                return ServiceResult<object>.Fail("You have already submitted this test.", 400);

            var submission = new TestSubmissionModel
            {
                Id = Guid.NewGuid().ToString(),
                RelatedMaterialId = dTO.TestId,
                UserId = userId,
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

            return ServiceResult<object>.Ok(submission, "Test answers have been submitted successfully");
        }

        public async Task<ServiceResult<object>> SubmitAssignment(IFormFile file, string assignmentId, string userId, string webRootPath, string scheme, string host)
        {
            if (string.IsNullOrEmpty(userId))
                return ServiceResult<object>.Fail("User Id is required", 401);

            var assignmentMaterial = await db.Materials.FirstOrDefaultAsync(m => m.Id == assignmentId);
            if (assignmentMaterial == null)
                return ServiceResult<object>.Fail("Assignment material not found", 404);

            var existingSubmission = await db.MaterialSubmissions
                .FirstOrDefaultAsync(s => s.RelatedMaterialId == assignmentId && s.UserId == userId);

            if (existingSubmission != null)
                return ServiceResult<object>.Fail("You have already submitted this assignment.", 400);

            string uploadsFolder = Path.Combine(webRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(fileStream);

            string fileUrl = $"{scheme}://{host}/api/uploads/{uniqueFileName}";

            var submission = new AssignmentSubmissionModel
            {
                Id = Guid.NewGuid().ToString(),
                RelatedMaterialId = assignmentId,
                UserId = userId,
                FileUrl = fileUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            db.MaterialSubmissions.Add(submission);
            await db.SaveChangesAsync();

            return ServiceResult<object>.Ok(submission, "Assignment has been submitted successfully");
        }
    }
}
