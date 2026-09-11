using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Backend.DTO.Cource;
using Backend.Utils;

namespace Backend.Services.Cource
{
    public class CourceStatsService
    {
        private readonly DBContextModel db;

        public CourceStatsService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<CourceStatsDTO>> GetTotalCourceStats(string id, string userId)
        {
            if (string.IsNullOrEmpty(id))
            {
                return ServiceResult<CourceStatsDTO>
                       .Fail("Cource id is required", 400);
            }

            var cource = await db.Cources.FirstOrDefaultAsync(c => c.Id == id);

            if (cource == null)
            {
                return ServiceResult<CourceStatsDTO>
                       .Fail("There are no cource with this id", 404);
            }

            if (!string.IsNullOrEmpty(userId))
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user != null)
                    if (user.EnrolledCourcesId == null || !user.EnrolledCourcesId.Contains(id))
                    {
                        return ServiceResult<CourceStatsDTO>
                               .Fail("You are not enrolled in this course", 403);
                    }
            }

            if (cource.ModulesId == null || !cource.ModulesId.Any())
            {
                return ServiceResult<CourceStatsDTO>.Ok(new CourceStatsDTO
                {
                    CourceId = cource.Id,
                    Title = cource.Title
                }, "Course statistics retrieved successfully");
            }

            var modules = await db.Modules
                .Where(m => cource.ModulesId.Contains(m.Id))
                .ToListAsync();

            var lessonIds = modules
                .Where(m => m.LessonsId != null)
                .SelectMany(m => m.LessonsId!)
                .ToList();

            var lessons = await db.Lessons
                .Where(l => lessonIds.Contains(l.Id))
                .ToListAsync();

            var materialIds = lessons
                .Where(l => l.MaterialsId != null)
                .SelectMany(l => l.MaterialsId!)
                .ToList();

            var materials = await db.Materials
                .Where(m => materialIds.Contains(m.Id))
                .ToListAsync();

            var submissions = await db.MaterialSubmissions
                .Where(s => s.UserId == userId && materialIds.Contains(s.RelatedMaterialId))
                .ToListAsync();

            var submittedMaterialIds = submissions.Select(s => s.RelatedMaterialId).ToHashSet();

            int completedModules = 0;
            int completedLessons = 0;
            int totalSubmittable = 0;
            int completedSubmittable = 0;

            foreach (var module in modules)
            {
                bool moduleCompleted = true;
                bool moduleHasSubmittable = false;

                if (module.LessonsId != null && module.LessonsId.Any())
                {
                    var moduleLessons = lessons.Where(l => module.LessonsId.Contains(l.Id)).ToList();

                    foreach (var lesson in moduleLessons)
                    {
                        bool lessonCompleted = true;
                        bool lessonHasSubmittable = false;

                        if (lesson.MaterialsId != null && lesson.MaterialsId.Any())
                        {
                            var lessonMaterials = materials.Where(m => lesson.MaterialsId.Contains(m.Id)).ToList();

                            foreach (var material in lessonMaterials)
                                if (material.Type == "Assignment" || material.Type == "Test")
                                {
                                    totalSubmittable++;
                                    lessonHasSubmittable = true;
                                    moduleHasSubmittable = true;

                                    if (submittedMaterialIds.Contains(material.Id))
                                        completedSubmittable++;
                                    else lessonCompleted = false;
                                }
                        }

                        if (lessonHasSubmittable && lessonCompleted) completedLessons++;
                        if (!lessonCompleted) moduleCompleted = false;
                    }
                }

                if (moduleHasSubmittable && moduleCompleted) completedModules++;
            }

            double progress = totalSubmittable > 0
                ? Math.Round((double)completedSubmittable / totalSubmittable * 100, 2)
                : 0;

            var stats = new CourceStatsDTO
            {
                CourceId = cource.Id,
                Title = cource.Title,
                ProgressPercentage = progress,
                TotalModules = modules.Count,
                CompletedModules = completedModules,
                TotalLessons = lessons.Count,
                CompletedLessons = completedLessons,
                TotalMaterials = materials.Count,
                TotalSubmittableMaterials = totalSubmittable,
                CompletedSubmittableMaterials = completedSubmittable
            };

            return ServiceResult<CourceStatsDTO>.Ok(stats, "Course statistics retrieved successfully");
        }

        public async Task<ServiceResult<ModuleStatsDTO>> GetTotalModuleStats(string id, string userId)
        {
            if (string.IsNullOrEmpty(id))
            {
                return ServiceResult<ModuleStatsDTO>
                       .Fail("Id is required", 400);
            }

            var module = await db.Modules.FirstOrDefaultAsync(m => m.Id == id);

            if (module == null)
            {
                return ServiceResult<ModuleStatsDTO>
                       .Fail("There are no module with this id", 404);
            }

            if (!string.IsNullOrEmpty(userId))
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user != null)
                {
                    var course = await db.Cources.FirstOrDefaultAsync(c => c.ModulesId != null && c.ModulesId.Contains(id));
                    if (course != null)
                        if (user.EnrolledCourcesId == null || !user.EnrolledCourcesId.Contains(course.Id))
                        {
                            return ServiceResult<ModuleStatsDTO>
                                   .Fail("You are not enrolled in the course that contains this module", 403);
                        }
                }
            }

            if (module.LessonsId == null || !module.LessonsId.Any())
            {
                return ServiceResult<ModuleStatsDTO>.Ok(new ModuleStatsDTO
                {
                    ModuleId = module.Id,
                    Title = module.Title
                }, "Module statistics retrieved successfully");
            }

            var lessons = await db.Lessons
                .Where(l => module.LessonsId.Contains(l.Id))
                .ToListAsync();

            var materialIds = lessons
                .Where(l => l.MaterialsId != null)
                .SelectMany(l => l.MaterialsId!)
                .ToList();

            var materials = await db.Materials
                .Where(m => materialIds.Contains(m.Id))
                .ToListAsync();

            var submissions = await db.MaterialSubmissions
                .Where(s => s.UserId == userId && materialIds.Contains(s.RelatedMaterialId))
                .ToListAsync();

            var submittedMaterialIds = submissions.Select(s => s.RelatedMaterialId).ToHashSet();

            int completedLessons = 0;
            int totalSubmittable = 0;
            int completedSubmittable = 0;

            foreach (var lesson in lessons)
            {
                bool lessonCompleted = true;
                bool lessonHasSubmittable = false;

                if (lesson.MaterialsId != null && lesson.MaterialsId.Any())
                {
                    var lessonMaterials = materials.Where(m => lesson.MaterialsId.Contains(m.Id)).ToList();

                    foreach (var material in lessonMaterials)
                        if (material.Type == "Assignment" || material.Type == "Test")
                        {
                            totalSubmittable++;
                            lessonHasSubmittable = true;

                            if (submittedMaterialIds.Contains(material.Id)) completedSubmittable++;
                            else lessonCompleted = false;
                        }
                }

                if (lessonHasSubmittable && lessonCompleted) completedLessons++;
            }

            double progress = totalSubmittable > 0
                ? Math.Round((double)completedSubmittable / totalSubmittable * 100, 2)
                : 0;

            var stats = new ModuleStatsDTO
            {
                ModuleId = module.Id,
                Title = module.Title,
                ProgressPercentage = progress,
                TotalLessons = lessons.Count,
                CompletedLessons = completedLessons,
                TotalMaterials = materials.Count,
                TotalSubmittableMaterials = totalSubmittable,
                CompletedSubmittableMaterials = completedSubmittable
            };

            return ServiceResult<ModuleStatsDTO>.Ok(stats, "Module statistics retrieved successfully");
        }
    }
}
