using Microsoft.EntityFrameworkCore;
using Backend.Models.Cource;
using Backend.DTO.Cource;
using Backend.Models;
using Backend.Utils;

namespace Backend.Services.Cource
{
    public class ModuleService
    {
        private readonly DBContextModel db;

        public ModuleService(
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<List<ModuleModel>>> GetAllOnCourceModule(string Id)
        {
            var cource = await db.Cources.FirstOrDefaultAsync(u => u.Id == Id);

            if (cource == null)
            {
                return ServiceResult<List<ModuleModel>>
                       .Fail("There are no cource with this id", 404);
            }

            if (cource.ModulesId.Count <= 0)
            {
                return ServiceResult<List<ModuleModel>>
                       .Fail("There are no modules yet", 404);
            }

            var modules = await db.Modules
                .Where(m => cource.ModulesId.Contains(m.Id))
                .ToListAsync();

            if (!modules.Any())
            {
                return ServiceResult<List<ModuleModel>>
                       .Fail("There are no modules yet", 404);
            }

            return ServiceResult<List<ModuleModel>>.Ok(modules, "All modules get successfully");
        }

        public async Task<ServiceResult<ModuleModel>> CreateModule(CreateModuleDTO dTO)
        {
            if (string.IsNullOrEmpty(dTO.Title) ||
                string.IsNullOrEmpty(dTO.Description)
            )
            {
                return ServiceResult<ModuleModel>
                       .Fail("All fields are required", 400);
            }

            ModuleModel module = new ModuleModel
            {
                Id = Guid.NewGuid().ToString(),
                Title = dTO.Title,
                Description = dTO.Description,
                LessonsId = dTO.LessonsId,
                UpdatedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
            };

            await db.Modules.AddAsync(module);
            await db.SaveChangesAsync();

            return ServiceResult<ModuleModel>.Ok(module, "Module created successfully");
        }

        public async Task<ServiceResult<ModuleModel>> UpdateMoudle(UpdateMoudleDTO dTO)
        {
            if (string.IsNullOrEmpty(dTO.Id))
            {
                return ServiceResult<ModuleModel>
                       .Fail("Id is required", 400);
            }

            var module = await db.Modules
                               .FirstOrDefaultAsync(c => c.Id == dTO.Id);

            if (module == null)
            {
                return ServiceResult<ModuleModel>
                       .Fail("Module does not exist with this id", 404);
            }

            module.Title = dTO.Title ?? module.Title;
            module.Description = dTO.Description ?? module.Description;
            module.LessonsId = dTO.LessonsId ?? module.LessonsId;
            module.UpdatedAt = DateTime.UtcNow;

            db.Modules.Update(module);
            await db.SaveChangesAsync();

            return ServiceResult<ModuleModel>.Ok(module, "Module updated successfully");
        }

        public async Task<ServiceResult<string>> DeleteModule(string Id)
        {
            if (string.IsNullOrEmpty(Id))
            {
                return ServiceResult<string>
                       .Fail("Id is required", 400);
            }

            var module = await db.Modules
                               .FirstOrDefaultAsync(c => c.Id == Id);

            if (module == null)
            {
                return ServiceResult<string>
                       .Fail("Module does not exist with this id", 404);
            }

            var courses = await db.Cources
                .Where(c => c.ModulesId != null && c.ModulesId.Contains(Id))
                .ToListAsync();

            foreach (var course in courses)
            { course.ModulesId.Remove(Id); }

            db.Modules.Remove(module);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("You deleted module " + module.Title, "Module deleted successfully");
        }
    }
}
