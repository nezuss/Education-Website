using Backend.Models;
using Backend.DTO.Admin;
using Backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Admin
{
    public class PromocodeService
    {
        private readonly DBContextModel db;

        public PromocodeService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<List<Promocode>>> GetAllPromocodes()
        {
            var promocodes = await db.Promocodes.ToListAsync();

            if (promocodes == null)
                return ServiceResult<List<Promocode>>.Fail("There is no promocodes yet", 404);

            return ServiceResult<List<Promocode>>.Ok(promocodes,
                                                     "Promocodes get successfully");
        }

        public async Task<ServiceResult<string>> CreatePromocode(CreatePromocodeDTO dTO)
        {
            if (dTO == null || dTO.Promocode == null || dTO.WillExpireAt == null)
                return ServiceResult<string>.Fail("All filds are required", 400);

            var existedPromocode = await db.Promocodes.FirstOrDefaultAsync(p => p.Promocode == dTO.Promocode);

            if (existedPromocode != null)
                return ServiceResult<string>.Fail("This promocode already exists", 400);

            var promocode = new Promocode()
            {
                Promocode = dTO.Promocode,
                WillExpireAt = dTO.WillExpireAt,
            };

            db.Promocodes.Add(promocode);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Promo added",
                                            "Promocode created successfully");
        }

        public async Task<ServiceResult<string>> UpdatePromocode(UpdatePromocodeDTO dTO)
        {
            if (dTO == null || dTO.Promocode == null || dTO.WillExpireAt == null)
                return ServiceResult<string>.Fail("All filds are required", 400);

            var promocode = await db.Promocodes.FirstOrDefaultAsync(p => p.Promocode == dTO.Promocode);

            if (promocode != null)
                return ServiceResult<string>.Fail("This promocode already exists", 400);

            promocode.Promocode = promocode.Promocode;
            promocode.WillExpireAt = dTO.WillExpireAt;

            db.Promocodes.Update(promocode);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Promo added",
                                            "Promocode created successfully");
        }

        public async Task<ServiceResult<string>> DeletePromocode(DeletePromocodeDTO dTO)
        {
            if (dTO == null || dTO.Promocode == null)
                return ServiceResult<string>.Fail("All filds are required", 400);

            var promocode = await db.Promocodes.FirstOrDefaultAsync(p => p.Promocode == dTO.Promocode);

            if (promocode == null)
                return ServiceResult<string>.Fail("This promocode does not exists", 404);

            db.Promocodes.Delete(promocode);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("Promo deleted",
                                            "Promocode deleted successfully");
        }
    }
}
