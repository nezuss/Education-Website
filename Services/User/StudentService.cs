using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Models.Cource;
using Backend.Models.Cource.MaterialAnswers;
using Backend.Responses.Cource;
using Backend.Utils;

namespace Backend.Services.User
{
    public class StudentService
    {
        private readonly DBContextModel db;

        public StudentService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<List<SubmissionResponse>>> GetSubmissions(string Id)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == Id);

            if (user == null)
            {
                return ServiceResult<List<SubmissionResponse>>
                       .Fail("User not found with this id", 404);
            }

            List<MaterialSubmissionModel> submissions = await db.MaterialSubmissions.AsNoTracking()
                                                                                    .Where(ms => ms.UserId == Id)
                                                                                    .OrderByDescending(ms => ms.CreatedAt)
                                                                                    .ToListAsync();

            if (submissions == null || (submissions.Count() <= 0))
            {
                return ServiceResult<List<SubmissionResponse>>
                       .Fail("You don't have any submissions", 404);
            }

            var response = await SubmissionResponseBuilder.Build(db, submissions);

            return ServiceResult<List<SubmissionResponse>>.Ok(response, "Submissions successfully get");
        }

        public async Task<ServiceResult<LessonCompletionResponse>> CompleteLesson(string lessonId, string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return ServiceResult<LessonCompletionResponse>
                       .Fail("User Id is required", 401);
            }

            if (string.IsNullOrEmpty(lessonId))
            {
                return ServiceResult<LessonCompletionResponse>
                       .Fail("Lesson id is required", 400);
            }

            var user = await db.Users.AsNoTracking()
                                     .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return ServiceResult<LessonCompletionResponse>
                       .Fail("User not found with this id", 404);
            }

            var lesson = await db.Lessons.AsNoTracking()
                                         .FirstOrDefaultAsync(l => l.Id == lessonId);

            if (lesson == null)
            {
                return ServiceResult<LessonCompletionResponse>
                       .Fail("There are no lesson with this id", 404);
            }

            // * Find the cource of this lesson the student is enrolled in
            var moduleIds = await db.Modules.AsNoTracking()
                                            .Where(m => m.LessonsId != null && m.LessonsId.Contains(lessonId))
                                            .Select(m => m.Id)
                                            .ToListAsync();

            var enrolledCourcesId = user.EnrolledCourcesId ?? new List<string>();
            CourceModel? cource = null;

            foreach (var moduleId in moduleIds)
            {
                cource = await db.Cources.AsNoTracking()
                                         .FirstOrDefaultAsync(c => c.ModulesId != null &&
                                                                   c.ModulesId.Contains(moduleId) &&
                                                                   enrolledCourcesId.Contains(c.Id));
                if (cource != null) break;
            }

            if (cource == null)
            {
                return ServiceResult<LessonCompletionResponse>
                       .Fail("You are not enrolled in the course that contains this lesson", 403);
            }

            var existedCompletion = await db.LessonCompletions.AsNoTracking()
                                                              .FirstOrDefaultAsync(lc => lc.UserId == userId && lc.LessonId == lessonId);

            if (existedCompletion != null)
            {
                return ServiceResult<LessonCompletionResponse>.Ok(new LessonCompletionResponse
                {
                    Id = existedCompletion.Id,
                    LessonId = existedCompletion.LessonId,
                    CourseId = existedCompletion.CourseId,
                    CompletedAt = existedCompletion.CompletedAt,
                    AlreadyCompleted = true,
                }, "Lesson already completed");
            }

            // * All tests or assignments of the lesson must be reviewed
            var materialIds = lesson.MaterialsId ?? new List<string>();

            var submittableIds = await db.Materials.AsNoTracking()
                                                   .Where(m => materialIds.Contains(m.Id) &&
                                                               (m.Type == "Assignment" || m.Type == "Test"))
                                                   .Select(m => m.Id)
                                                   .ToListAsync();

            if (submittableIds.Count > 0)
            {
                var completedIds = await db.MaterialSubmissions.AsNoTracking()
                                                               .Where(s => s.UserId == userId &&
                                                                           submittableIds.Contains(s.RelatedMaterialId) &&
                                                                           s.Status == "Reviewed" && s.Rate > 0)
                                                               .Select(s => s.RelatedMaterialId)
                                                               .Distinct()
                                                               .ToListAsync();

                int pendingCount = submittableIds.Count(id => !completedIds.Contains(id));

                if (pendingCount > 0)
                {
                    return ServiceResult<LessonCompletionResponse>
                           .Fail($"Complete all tests and assignments of this lesson first ({pendingCount} not completed or not reviewed yet)", 400);
                }
            }

            var completion = new LessonCompletionModel
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                LessonId = lessonId,
                CourseId = cource.Id,
                CompletedAt = DateTime.UtcNow,
            };

            await db.LessonCompletions.AddAsync(completion);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                // * Concurrent request already recorded this completion
                db.ChangeTracker.Clear();

                var savedCompletion = await db.LessonCompletions.AsNoTracking()
                                                                .FirstOrDefaultAsync(lc => lc.UserId == userId && lc.LessonId == lessonId);
                if (savedCompletion == null) throw;

                completion = savedCompletion;
            }

            var response = new LessonCompletionResponse
            {
                Id = completion.Id,
                LessonId = completion.LessonId,
                CourseId = completion.CourseId,
                CompletedAt = completion.CompletedAt,
                AlreadyCompleted = false,
            };

            return ServiceResult<LessonCompletionResponse>.Ok(response, "Lesson completed successfully");
        }
    }
}
