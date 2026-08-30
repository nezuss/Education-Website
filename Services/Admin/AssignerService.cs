using Backend.Models;
using Backend.DTO.Admin;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Admin
{
    public class AssignerService
    {
        private readonly DBContextModel db;

        public AssignerService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<string>> AssignTeacherToCource(AssignTeacherToCourceDTO dTO)
        {
            var teacher = await db.Users.FirstOrDefaultAsync(u => u.Id == dTO.TeacherId);

            if (teacher == null)
                return ServiceResult<string>.Fail("There is no teacher with this id", 404);

            var role = await db.Roles.FirstOrDefaultAsync(r => r.Id == teacher.RoleId);

            if (role == null)
                return ServiceResult<string>.Fail("There is no teacher role with this id", 404);
            if (role.Name != "Teacher")
                return ServiceResult<string>.Fail("This role doesnt's have teacher permissions", 403);

            var cource = await db.Cources.FirstOrDefaultAsync(c => c.Id == dTO.CourceId);

            if (cource == null)
                return ServiceResult<string>.Fail("There is no cource with this id", 404);

            cource.AssignedTeacherId = teacher.Id;

            db.Cources.Update(cource);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Teacher assigned",
                                            "You successfully assigned teacher to cource");
        }

        public async Task<ServiceResult<string>> AssignModuleToCource(AssignModuleToCourceDTO dTO)
        {
            var module = await db.Modules.FirstOrDefaultAsync(m => m.Id == dTO.ModuleId);

            if (module == null)
                return ServiceResult<string>.Fail("There is no module with this id", 404);

            var cource = await db.Cources.FirstOrDefaultAsync(c => c.Id == dTO.CourceId);

            if (cource == null)
                return ServiceResult<string>.Fail("There is no cource with this id", 404);
            if (cource.ModulesId.Contains(dTO.ModuleId))
                return ServiceResult<string>.Fail("This module already assigned to this cource", 400);

            cource.ModulesId.Add(dTO.ModuleId);

            db.Cources.Update(cource);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Module assigned",
                                            "You successfully assigned module to cource");
        }

        public async Task<ServiceResult<string>> AssignLessonToModule(AssignLessonToModuleDTO dTO)
        {
            var lesson = await db.Lessons.FirstOrDefaultAsync(l => l.Id == dTO.LessonId);

            if (lesson == null)
                return ServiceResult<string>.Fail("There is no lesson with this id", 404);

            var module = await db.Modules.FirstOrDefaultAsync(m => m.Id == dTO.ModuleId);

            if (module == null)
                return ServiceResult<string>.Fail("There is no module with this id", 404);
            if (module.LessonsId.Contains(dTO.LessonId))
                return ServiceResult<string>.Fail("This lesson already assigned to this module", 400);

            module.LessonsId.Add(dTO.LessonId);

            db.Modules.Update(module);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Lesson assigned",
                                            "You successfully assigned lesson to module");
        }

        public async Task<ServiceResult<string>> AssignMaterialToLesson(AssignMaterialToLessonDTO dTO)
        {
            var material = await db.Materials.FirstOrDefaultAsync(m => m.Id == dTO.MaterialId);

            if (material == null)
                return ServiceResult<string>.Fail("There is no material with this id", 404);

            var lesson = await db.Lessons.FirstOrDefaultAsync(l => l.Id == dTO.LessonId);

            if (lesson == null)
                return ServiceResult<string>.Fail("There is no lesson with this id", 404);
            if (lesson.MaterialsId.Contains(dTO.MaterialId))
                return ServiceResult<string>.Fail("This material already assigned to this lesson", 400);

            lesson.MaterialsId.Add(dTO.MaterialId);

            db.Lessons.Update(lesson);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Material assigned",
                                            "You successfully assigned material to lesson");
        }
    }
}
