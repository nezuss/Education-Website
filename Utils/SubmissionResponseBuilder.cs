using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Models.Cource;
using Backend.Models.Cource.MaterialAnswers;
using Backend.Responses.Cource;

namespace Backend.Utils
{
    public static class SubmissionResponseBuilder
    {
        // * Build full submission response
        public static async Task<List<SubmissionResponse>> Build(DBContextModel db, List<MaterialSubmissionModel> submissions)
        {
            var response = new List<SubmissionResponse>();

            if (submissions == null || submissions.Count == 0)
                return response;

            var testSubmissionIds = submissions.OfType<TestSubmissionModel>()
                                               .Select(s => s.Id)
                                               .ToList();

            var answersMap = testSubmissionIds.Count == 0
                ? new Dictionary<string, List<SubmissionAnswerResponse>>()
                : (await db.TestQuestionAnswers.AsNoTracking()
                                               .Where(a => testSubmissionIds.Contains(a.TestSubmissionId))
                                               .ToListAsync())
                  .GroupBy(a => a.TestSubmissionId)
                  .ToDictionary(g => g.Key, g => g.Select(a => new SubmissionAnswerResponse
                  {
                      QuestionId = a.QuestionId,
                      AnswerId = a.AnswerId
                  }).ToList());

            var lessonByMaterial = new Dictionary<string, LessonModel?>();
            var courceByLesson = new Dictionary<string, CourceModel?>();

            foreach (var submission in submissions)
            {
                if (!lessonByMaterial.TryGetValue(submission.RelatedMaterialId, out var lesson))
                {
                    lesson = await db.Lessons.AsNoTracking()
                                             .FirstOrDefaultAsync(l => l.MaterialsId != null &&
                                                                  l.MaterialsId.Contains(submission.RelatedMaterialId));
                    lessonByMaterial[submission.RelatedMaterialId] = lesson;
                }

                CourceModel? cource = null;

                if (lesson != null && !courceByLesson.TryGetValue(lesson.Id, out cource))
                {
                    var module = await db.Modules.AsNoTracking()
                                                 .FirstOrDefaultAsync(m => m.LessonsId != null &&
                                                                      m.LessonsId.Contains(lesson.Id));

                    if (module != null)
                        cource = await db.Cources.AsNoTracking()
                                                 .FirstOrDefaultAsync(c => c.ModulesId != null &&
                                                                      c.ModulesId.Contains(module.Id));

                    courceByLesson[lesson.Id] = cource;
                }

                bool isReviewed = submission.ReviewerAt != default;

                response.Add(new SubmissionResponse
                {
                    Id = submission.Id,
                    Type = submission.Type,
                    MaterialId = submission.RelatedMaterialId,
                    UserId = submission.UserId,
                    Rate = submission.Rate,
                    Status = submission.Status,
                    Feedback = submission.Feedback,
                    RevisionMessage = submission.RevisionMessage,
                    CourseId = cource?.Id,
                    CourseTitle = cource?.Title,
                    LessonId = lesson?.Id,
                    LessonTitle = lesson?.Title,
                    FileUrl = (submission as AssignmentSubmissionModel)?.FileUrl,
                    Answers = submission is TestSubmissionModel
                        ? answersMap.GetValueOrDefault(submission.Id) ?? new List<SubmissionAnswerResponse>()
                        : null,
                    ReviewerId = isReviewed ? submission.ReviewerId : null,
                    ReviewerName = isReviewed ? submission.ReviewerName : null,
                    ReviewerAvatarUrl = isReviewed ? submission.ReviewerAvatarUrl : null,
                    ReviewerAt = isReviewed ? submission.ReviewerAt : null,
                    SubmittedAt = submission.SubmittedAt,
                    UpdatedAt = submission.UpdatedAt,
                    CreatedAt = submission.CreatedAt,
                });
            }

            return response;
        }
    }
}
