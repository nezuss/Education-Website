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
