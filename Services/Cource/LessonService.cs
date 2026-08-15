using Microsoft.EntityFrameworkCore;
using Backend.Models.Cource;
using Backend.DTO.Cource;
using Backend.Models;
using Backend.Utils;

namespace Backend.Services.Cource
{
    public class LessonService
    {
        private readonly DBContextModel db;

        public LessonService(
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<List<LessonModel>>> GetAllOnModule(string Id)
        {
            var module = await db.Modules.FirstOrDefaultAsync(m => m.Id == Id);

            if (module == null)
            {
                return ServiceResult<List<LessonModel>>
                       .Fail("There is no module with this id", 404);
            }

            if (module.LessonsId == null || !module.LessonsId.Any())
            {
                return ServiceResult<List<LessonModel>>
                       .Fail("There are no lessons yet", 404);
            }

            var lessons = await db.Lessons
                .Where(l => module.LessonsId.Contains(l.Id))
                .ToListAsync();

            if (!lessons.Any())
            {
                return ServiceResult<List<LessonModel>>
                       .Fail("There are no lessons yet", 404);
            }

            return ServiceResult<List<LessonModel>>.Ok(lessons, "All lessons retrieved successfully");
        }

        public async Task<ServiceResult<LessonModel>> CreateLesson(CreateLessonDTO dTO)
        {
            if (string.IsNullOrEmpty(dTO.Title) ||
                string.IsNullOrEmpty(dTO.Description)
            )
            {
                return ServiceResult<LessonModel>
                       .Fail("All fields are required", 400);
            }

            LessonModel lesson = new LessonModel
            {
                Id = Guid.NewGuid().ToString(),
                Title = dTO.Title,
                Description = dTO.Description,
                MaterialsId = dTO.MaterialsId,
                UpdatedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
            };

            await db.Lessons.AddAsync(lesson);
            await db.SaveChangesAsync();

            return ServiceResult<LessonModel>.Ok(lesson, "Lesson created successfully");
        }

        public async Task<ServiceResult<LessonModel>> UpdateLesson(UpdateLessonDTO dTO)
        {
            if (string.IsNullOrEmpty(dTO.Id))
            {
                return ServiceResult<LessonModel>
                       .Fail("Id is required", 400);
            }

            var lesson = await db.Lessons
                               .FirstOrDefaultAsync(c => c.Id == dTO.Id);

            if (lesson == null)
            {
                return ServiceResult<LessonModel>
                       .Fail("Lesson does not exist with this id", 404);
            }

            lesson.Title = dTO.Title ?? lesson.Title;
            lesson.Description = dTO.Description ?? lesson.Description;
            lesson.MaterialsId = dTO.MaterialsId ?? lesson.MaterialsId;
            lesson.UpdatedAt = DateTime.UtcNow;

            db.Lessons.Update(lesson);
            await db.SaveChangesAsync();

            return ServiceResult<LessonModel>.Ok(lesson, "Lesson updated successfully");
        }

        public async Task<ServiceResult<string>> DeleteLesson(string Id)
        {
            if (string.IsNullOrEmpty(Id))
            {
                return ServiceResult<string>
                       .Fail("Id is required", 400);
            }

            var lesson = await db.Lessons
                               .FirstOrDefaultAsync(c => c.Id == Id);

            if (lesson == null)
            {
                return ServiceResult<string>
                       .Fail("Lesson does not exist with this id", 404);
            }

            var modules = await db.Modules
                .Where(m => m.LessonsId != null && m.LessonsId.Contains(Id))
                .ToListAsync();

            foreach (var module in modules)
            {
                module.LessonsId.Remove(Id);
            }

            db.Lessons.Remove(lesson);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("You deleted lesson " + lesson.Title, "Lesson deleted successfully");
        }
    }
}
