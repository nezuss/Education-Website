using Microsoft.EntityFrameworkCore;
using Backend.Models.Cource.MaterialAnswers;
using Backend.DTO.Cource.Submission;
using Backend.Models;
using Backend.Utils;

namespace Backend.Services.Cource
{
    public class SubmissionService
    {
        private readonly DBContextModel db;

        public SubmissionService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<MaterialSubmissionModel>> GetDetails(string Id, string UserId)
        {
            if (string.IsNullOrEmpty(Id))
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("Submission id is required", 400);
            }

            if (string.IsNullOrEmpty(UserId))
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("User id is required", 401);
            }

            var submission = await db.MaterialSubmissions.FirstOrDefaultAsync(ms => ms.Id == Id);

            if (submission == null)
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("There are no submission with this id", 404);
            }

            bool hasAccess = submission.UserId == UserId;

            if (!hasAccess)
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == UserId);
                if (user != null && !string.IsNullOrEmpty(user.RoleId))
                {
                    var role = await db.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId);
                    if (role != null)
                    {
                        if (role.Name == "Admin")
                        {
                            hasAccess = true;
                        }
                        else if (role.Name == "Teacher")
                        {
                            var lesson = await db.Lessons.FirstOrDefaultAsync(l => l.MaterialsId != null && l.MaterialsId.Contains(submission.RelatedMaterialId));
                            if (lesson != null)
                            {
                                var module = await db.Modules.FirstOrDefaultAsync(m => m.LessonsId != null && m.LessonsId.Contains(lesson.Id));
                                if (module != null)
                                {
                                    var cource = await db.Cources.FirstOrDefaultAsync(c => c.ModulesId != null && c.ModulesId.Contains(module.Id));
                                    if (cource != null && cource.AssignedTeacherId == UserId)
                                    {
                                        hasAccess = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            if (!hasAccess)
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("You do not have permission to view this submission", 403);
            }

            if (submission is TestSubmissionModel testSubmission)
            {
                await db.Entry(testSubmission).Collection(t => t.Answers).LoadAsync();
            }

            return ServiceResult<MaterialSubmissionModel>.Ok(submission, "Submission details get successfully");
        }

        public async Task<ServiceResult<MaterialSubmissionModel>> SendFeedback(string id, SendFeedbackDTO dTO)
        {
            if (string.IsNullOrEmpty(id))
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("Submission id is required", 400);
            }

            if (dTO == null || string.IsNullOrWhiteSpace(dTO.Feedback))
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("Feedback cannot be empty", 400);
            }

            var submission = await db.MaterialSubmissions.FirstOrDefaultAsync(ms => ms.Id == id);

            if (submission == null)
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("There are no submission with this id", 404);
            }

            submission.Feedback = dTO.Feedback;
            submission.Status = "Reviewed";
            submission.UpdatedAt = DateTime.UtcNow;

            db.MaterialSubmissions.Update(submission);
            await db.SaveChangesAsync();

            return ServiceResult<MaterialSubmissionModel>.Ok(submission, "Feedback sent successfully");
        }

        public async Task<ServiceResult<MaterialSubmissionModel>> RequestRevision(string id, RequestRevisionDTO dTO)
        {
            if (string.IsNullOrEmpty(id))
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("Submission id is required", 400);
            }

            if (dTO == null || string.IsNullOrWhiteSpace(dTO.Message))
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("Message cannot be empty", 400);
            }

            var submission = await db.MaterialSubmissions.FirstOrDefaultAsync(ms => ms.Id == id);

            if (submission == null)
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("There are no submission with this id", 404);
            }

            submission.RevisionMessage = dTO.Message;
            submission.Status = "NeedsRevision";
            submission.UpdatedAt = DateTime.UtcNow;

            db.MaterialSubmissions.Update(submission);
            await db.SaveChangesAsync();

            return ServiceResult<MaterialSubmissionModel>.Ok(submission, "Revision requested successfully");
        }
    }
}
