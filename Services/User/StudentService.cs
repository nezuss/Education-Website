using Microsoft.EntityFrameworkCore;
using Backend.Models;
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
    }
}
