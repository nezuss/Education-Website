using Microsoft.EntityFrameworkCore;
using Backend.Models.Cource;
using Backend.DTO.Cource;
using Backend.Models;
using Backend.Utils;

namespace Backend.Services.Cource
{
    public class SubmissionRateService
    {
        private readonly DBContextModel db;

        public SubmissionRateService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<string>> RateSubmission(RateSubmissionDTO dTO, string id)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return ServiceResult<string>
                       .Fail("There are no user with this id", 404);
            }

            var role = await db.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId);

            if (role == null)
            {
                return ServiceResult<string>
                       .Fail("There are no role with this id", 404);
            }
            if (role.Name != "Teacher")
            {
                return ServiceResult<string>
                       .Fail("This role does not have Teacher's permission", 403);
            }

            var submission = await db.MaterialSubmissions.FirstOrDefaultAsync(ms => ms.Id == dTO.SubmissionId);
            
            var course = await (
                from lesson in db.Lessons
                where lesson.MaterialsId.Contains(submission.RelatedMaterialId)
                from module in db.Modules
                where module.LessonsId.Contains(lesson.Id)
                from c in db.Cources
                where c.ModulesId.Contains(module.Id)
                select c
            ).FirstOrDefaultAsync();

            if (course.AssignedTeacherId != user.Id)
            {
                return ServiceResult<string>
                       .Fail("You are not assigned teacher to this cource", 404); 
            }

            if (submission == null)
            {
                return ServiceResult<string>
                       .Fail("There are no submission with this id", 404);
            }
            if (submission.Rate != -1)
            {
                return ServiceResult<string>
                       .Fail("You can not rate already rated submission", 403);
            }
            if (dTO.Rate == null || dTO.Rate < 1 || dTO.Rate > 12)
            {
                return ServiceResult<string>
                       .Fail("Rate cannot be null and should be between 1 and 12", 400);
            }


            submission.Rate = dTO.Rate;
            submission.ReviewerId = user.Id;
            submission.ReviewerName = user.Username;
            submission.ReviewerAvatarUrl = "";
            submission.ReviewerAt = DateTime.UtcNow;
            submission.UpdatedAt = DateTime.UtcNow;

            db.MaterialSubmissions.Update(submission);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Rate setted", "You rated this submission successfully");
        }
    }
}
