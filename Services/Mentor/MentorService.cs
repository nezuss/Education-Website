using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.Models.Cource;
using Backend.Responses.Mentor;
using Backend.Utils;

namespace Backend.Services.Mentor
{
    public class MentorService
    {
        private readonly DBContextModel db;

        public MentorService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<List<MentorCourcesResponse>>> GetCourses(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return ServiceResult<List<MentorCourcesResponse>>
                       .Fail("User Id is required", 401);
            }

            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return ServiceResult<List<MentorCourcesResponse>>
                       .Fail("User not found with this id", 404);
            }

            var role = await db.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId);

            if (role == null)
            {
                return ServiceResult<List<MentorCourcesResponse>>
                       .Fail("There are no role with this id", 404);
            }

            if (role.Name != "Teacher" && role.Name != "Mentor")
            {
                return ServiceResult<List<MentorCourcesResponse>>
                       .Fail("This role does not have Teacher's permission", 403);
            }

            var cources = await db.Cources
                .Where(c => c.AssignedTeacherId == userId)
                .ToListAsync();

            if (cources == null || cources.Count <= 0)
            {
                return ServiceResult<List<MentorCourcesResponse>>
                       .Fail("You don't have any assigned cources", 404);
            }

            var response = new List<MentorCourcesResponse>();

            foreach (var cource in cources)
            {
                int notRatedCount = 0;

                if (cource.ModulesId != null && cource.ModulesId.Any())
                {
                    var modules = await db.Modules.Where(m => cource.ModulesId.Contains(m.Id))
                                                  .ToListAsync();

                    var lessonIds = modules.Where(m => m.LessonsId != null)
                                           .SelectMany(m => m.LessonsId!)
                                           .ToList();

                    if (lessonIds.Any())
                    {
                        var lessons = await db.Lessons.Where(l => lessonIds.Contains(l.Id))
                                                      .ToListAsync();

                        var materialIds = lessons.Where(l => l.MaterialsId != null)
                                                 .SelectMany(l => l.MaterialsId!)
                                                 .ToList();

                        if (materialIds.Any())
                            notRatedCount = await db.MaterialSubmissions
                                .CountAsync(ms => materialIds.Contains(ms.RelatedMaterialId) && ms.Rate == -1);
                    }
                }

                response.Add(new MentorCourcesResponse
                {
                    CourceId = cource.Id,
                    StudentsCount = cource.StudentsCount,
                    NotRatedSubmissionsCount = notRatedCount
                });
            }

            return ServiceResult<List<MentorCourcesResponse>>.Ok(response, "Mentor cources get successfully");
        }

        public async Task<ServiceResult<List<SubmissionsResponse>>> GetSubmissions(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                return ServiceResult<List<SubmissionsResponse>>
                       .Fail("User Id is required", 401);
            }

            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return ServiceResult<List<SubmissionsResponse>>
                       .Fail("User not found with this id", 404);
            }

            var role = await db.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId);

            if (role == null)
            {
                return ServiceResult<List<SubmissionsResponse>>
                       .Fail("There are no role with this id", 404);
            }

            if (role.Name != "Teacher")
            {
                return ServiceResult<List<SubmissionsResponse>>
                       .Fail("This role does not have Teacher's permission", 403);
            }

            var cources = await db.Cources.Where(c => c.AssignedTeacherId == userId)
                                          .ToListAsync();

            if (cources == null || cources.Count <= 0)
            {
                return ServiceResult<List<SubmissionsResponse>>
                       .Fail("You don't have any assigned cources", 404);
            }

            var materialToCourceMap = new Dictionary<string, string>();

            foreach (var cource in cources)
            {
                if (cource.ModulesId == null || !cource.ModulesId.Any())
                    continue;

                var modules = await db.Modules.Where(m => cource.ModulesId.Contains(m.Id))
                                              .ToListAsync();

                var lessonIds = modules.Where(m => m.LessonsId != null)
                                       .SelectMany(m => m.LessonsId!)
                                       .ToList();

                if (!lessonIds.Any()) continue;

                var lessons = await db.Lessons.Where(l => lessonIds.Contains(l.Id))
                                              .ToListAsync();

                var materialIds = lessons.Where(l => l.MaterialsId != null)
                                         .SelectMany(l => l.MaterialsId!)
                                         .ToList();

                foreach (var matId in materialIds)
                    materialToCourceMap[matId] = cource.Id;
            }

            if (!materialToCourceMap.Any())
            {
                return ServiceResult<List<SubmissionsResponse>>
                       .Fail("You don't have any submissions", 404);
            }

            var allMaterialIds = materialToCourceMap.Keys.ToList();
            var submissions = await db.MaterialSubmissions.AsNoTracking()
                                                          .Where(s => allMaterialIds.Contains(s.RelatedMaterialId))
                                                          .OrderByDescending(s => s.CreatedAt)
                                                          .ToListAsync();

            if (submissions == null || submissions.Count <= 0)
            {
                return ServiceResult<List<SubmissionsResponse>>
                       .Fail("You don't have any submissions", 404);
            }

            var studentIds = submissions.Select(s => s.UserId).Distinct().ToList();
            var students = await db.Users.AsNoTracking()
                                         .Where(u => studentIds.Contains(u.Id))
                                         .ToDictionaryAsync(u => u.Id);

            var groupedSubmissions = submissions.GroupBy(s => s.UserId);
            var response = new List<SubmissionsResponse>();

            foreach (var group in groupedSubmissions)
            {
                students.TryGetValue(group.Key, out var student);
                var studentSubmissionList = group.ToList();
                materialToCourceMap.TryGetValue(studentSubmissionList.First().RelatedMaterialId, out var cId);

                response.Add(new SubmissionsResponse
                {
                    Student = new StudentModel
                    {
                        Id = student?.Id ?? group.Key,
                        CourceId = cId ?? "",
                        Username = student?.Username ?? "Unknown",
                        Email = student?.Email ?? ""
                    },
                    Submissions = studentSubmissionList
                });
            }

            return ServiceResult<List<SubmissionsResponse>>.Ok(response, "Submissions successfully get");
        }

        public async Task<ServiceResult<List<StudentsLIstResponce>>> GetStudents(string userId, string courseId, int page, int pageSize)
        {
            if (string.IsNullOrEmpty(courseId) || page == null || pageSize == null)
            {
                return ServiceResult<List<StudentsLIstResponce>>
                       .Fail("All fileds are required", 404);
            }
          
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return ServiceResult<List<StudentsLIstResponce>>
                       .Fail("There is no user with this id", 404);
            }

            var role = await db.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId);

            if (role.Name != "Teacher" && role.Name != "Admin")
            {
                return ServiceResult<List<StudentsLIstResponce>>
                       .Fail("You are not a teacher", 403);
            }

            var cource = await db.Cources.FirstOrDefaultAsync(r => r.Id == courseId);

            if (cource == null)
            {
                return ServiceResult<List<StudentsLIstResponce>>
                       .Fail("There is no cource with this id", 404);
            }

            var studentData = await db.Users
                .Where(u => u.EnrolledCourcesId.Contains(courseId))
                .Select(u => new
                {
                    u.Username,
                    LatestActivity = db.MaterialSubmissions
                        .Where(s => s.UserId == u.Id)
                        .OrderByDescending(s => s.SubmittedAt)
                        .Select(s => (DateTime?)s.SubmittedAt)
                        .FirstOrDefault(),
                    WorksOnReview = db.MaterialSubmissions
                        .Count(s => s.UserId == u.Id && s.Rate == -1)
                })
                .ToListAsync();
            List<StudentsLIstResponce> students = studentData
                .Select(u => new StudentsLIstResponce
                {
                    Username = u.Username,
                    CourceId = courseId,
                    Progress = 0,
                    LastActivity = u.LatestActivity?.ToString("yyyy-MM-dd HH:mm:ss") ?? "No activity",
                    TotalAmountOfWorksOnReview = u.WorksOnReview
                })
                .ToList();

            if (students == null || students.Count() <- 0)
            {
                return ServiceResult<List<StudentsLIstResponce>>
                       .Fail("There is no students", 404);
            }
          
            return ServiceResult<List<StudentsLIstResponce>>.Ok(students, "Students get successfully");
        }
    }
}
