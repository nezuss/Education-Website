using Microsoft.EntityFrameworkCore;
using Backend.Models.Cource;
using Backend.DTO.Cource;
using Backend.Models;
using Backend.Utils;

namespace Backend.Services.Cource
{
    public class CourcesService
    {
        private readonly DBContextModel db;

        public CourcesService(
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<List<CourceModel>>> GetCources()
        {
            var cources = await db.Cources.ToListAsync();

            if (cources == null)
            {
                return ServiceResult<List<CourceModel>>
                       .Fail("There are no cources yet", 404);
            }

            return ServiceResult<List<CourceModel>>.Ok(cources, "All cources get successfully");
        }

        public async Task<ServiceResult<List<CourceModel>>> GetEnrolledCources(string Id)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == Id);

            if (user == null)
                return ServiceResult<List<CourceModel>>.Fail("User not found", 404);

            if (user.EnrolledCourcesId == null || !user.EnrolledCourcesId.Any())
                return ServiceResult<List<CourceModel>>.Fail("There are no enrolled cources", 404);

            var cources = await db.Cources
                .Where(c => user.EnrolledCourcesId.Contains(c.Id))
                .ToListAsync();

            return ServiceResult<List<CourceModel>>.Ok(cources, "All enrolled cources get successfully");
        }

        public async Task<ServiceResult<string>> EnrolToCource(string Id, string userId)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return ServiceResult<string>.Fail("User not found", 404);

            var cource = await db.Cources.FirstOrDefaultAsync(c => c.Id == Id);

            if (cource == null)
                return ServiceResult<string>.Fail("Cource not found", 404);

            user.EnrolledCourcesId ??= new List<string>();

            if (user.EnrolledCourcesId.Contains(cource.Id))
                return ServiceResult<string>.Fail("You already enrolled to this cource", 403);

            user.EnrolledCourcesId.Add(cource.Id);

            db.Users.Update(user);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("You enrolled to cource " + cource.Title, "You have been enrolled successfully");
        }

        public async Task<ServiceResult<CourceModel>> CreateCource(CreateCourceDTO dTO)
        {
            if (string.IsNullOrEmpty(dTO.BannerUrl) ||
                string.IsNullOrEmpty(dTO.Title) ||
                string.IsNullOrEmpty(dTO.Description) ||
                dTO.Price <= 0)
            {
                return ServiceResult<CourceModel>
                       .Fail("All fields are required", 400);
            }

            CourceModel cource = new CourceModel
            {
                Id = Guid.NewGuid().ToString(),
                BannerUrl = dTO.BannerUrl,
                Title = dTO.Title,
                Description = dTO.Description,
                Price = dTO.Price,
                ModulesId = dTO.ModulesId,
                TotalLearningPeriodWeeks = dTO.TotalLearningPeriodWeeks,
                ProjectsReadyForPortfolio = dTO.ProjectsReadyForPortfolio,
                UpdatedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
            };

            await db.Cources.AddAsync(cource);
            await db.SaveChangesAsync();

            return ServiceResult<CourceModel>.Ok(cource, "Cources created successfully");
        }

        public async Task<ServiceResult<CourceModel>> UpdateCource(UpdateCourceDTO dTO)
        {
            if (string.IsNullOrEmpty(dTO.Id))
            {
                return ServiceResult<CourceModel>
                       .Fail("Id is required", 400);
            }

            var cource = await db.Cources
                               .FirstOrDefaultAsync(c => c.Id == dTO.Id);

            if (cource == null)
            {
                return ServiceResult<CourceModel>
                       .Fail("Cource does not exist with this id", 404);
            }

            cource.BannerUrl = dTO.BannerUrl ?? cource.BannerUrl;
            cource.Title = dTO.Title ?? cource.Title;
            cource.Description = dTO.Description ?? cource.Description;
            cource.Price = dTO.Price ?? cource.Price;
            cource.ModulesId = dTO.ModulesId ?? cource.ModulesId;
            cource.TotalLearningPeriodWeeks = dTO.TotalLearningPeriodWeeks ?? cource.TotalLearningPeriodWeeks;
            cource.ProjectsReadyForPortfolio = dTO.ProjectsReadyForPortfolio ?? cource.ProjectsReadyForPortfolio;
            cource.UpdatedAt = DateTime.UtcNow;

            db.Cources.Update(cource);
            await db.SaveChangesAsync();

            return ServiceResult<CourceModel>.Ok(cource, "Cources updated successfully");
        }

        public async Task<ServiceResult<CourceModel>> DeleteCource(string Id)
        {
            if (string.IsNullOrEmpty(Id))
            {
                return ServiceResult<CourceModel>
                       .Fail("Id is required", 400);
            }

            var cource = await db.Cources
                               .FirstOrDefaultAsync(c => c.Id == Id);

            if (cource == null)
            {
                return ServiceResult<CourceModel>
                       .Fail("Cource does not exist with this id", 404);
            }

            db.Cources.Remove(cource);
            await db.SaveChangesAsync();

            return ServiceResult<CourceModel>.Ok(cource, "Cources deleted successfully");
        }
    }
}
