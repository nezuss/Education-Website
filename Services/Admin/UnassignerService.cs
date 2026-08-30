using Backend.Models;
using Backend.DTO.Admin;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Admin
{
    public class UnassignerService
    {
        private readonly DBContextModel db;

        public UnassignerService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<string>> UnassignTeacherFromCource(UnassignTeacherFromCourceDTO dTO)
        {
            var cource = await db.Cources.FirstOrDefaultAsync(c => c.Id == dTO.CourceId);

            if (cource == null)
                return ServiceResult<string>.Fail("There is no cource with this id", 404);
            if (cource.AssignedTeacherId == dTO.TeacherId)
                return ServiceResult<string>.Fail("There is no teacher assigned to this cource with this id", 404);

            cource.AssignedTeacherId = "";

            db.Cources.Update(cource);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Teacher unassigned",
                                            "You successfully unassigned teacher from cource");
        }

        public async Task<ServiceResult<string>> UnassignModuleFromCource(UnassignModuleFromCourceDTO dTO)
        {
            var cource = await db.Cources.FirstOrDefaultAsync(c => c.Id == dTO.CourceId);

            if (cource == null)
                return ServiceResult<string>.Fail("There is no cource with this id", 404);
            if (!cource.ModulesId.Contains(dTO.ModuleId))
                return ServiceResult<string>.Fail("This module is not assigned to this cource", 400);

            cource.ModulesId.Remove(dTO.ModuleId);

            db.Cources.Update(cource);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Module unassigned",
                                            "You successfully unassigned module from cource");
        }

        public async Task<ServiceResult<string>> UnassignLessonFromModule(UnassignLessonFromModuleDTO dTO)
        {
            var module = await db.Modules.FirstOrDefaultAsync(m => m.Id == dTO.ModuleId);

            if (module == null)
                return ServiceResult<string>.Fail("There is no module with this id", 404);
            if (!module.LessonsId.Contains(dTO.LessonId))
                return ServiceResult<string>.Fail("This lesson in not assigned to this module", 400);

            module.LessonsId.Remove(dTO.LessonId);

            db.Modules.Update(module);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Lesson unassigned",
                                            "You successfully unassigned lesson from module");
        }

        public async Task<ServiceResult<string>> UnassignMaterialFromLesson(UnassignMaterialFromLessonDTO dTO)
        {
            var lesson = await db.Lessons.FirstOrDefaultAsync(l => l.Id == dTO.LessonId);

            if (lesson == null)
                return ServiceResult<string>.Fail("There is no lesson with this id", 404);
            if (!lesson.MaterialsId.Contains(dTO.MaterialId))
                return ServiceResult<string>.Fail("This material is not assigned to this lesson", 400);

            lesson.MaterialsId.Remove(dTO.MaterialId);

            db.Lessons.Update(lesson);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Material unassigned",
                                            "You successfully assigned material from lesson");
        }
    }
}
