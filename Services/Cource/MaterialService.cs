using Microsoft.EntityFrameworkCore;
using Backend.Models.Cource;
using Backend.Models.Cource.Materials;
using Backend.DTO.Cource;
using Backend.Models;
using Backend.Utils;
using Microsoft.AspNetCore.Http;

namespace Backend.Services.Cource
{
    public class MaterialService
    {
        private readonly DBContextModel db;

        public MaterialService
        (
            DBContextModel _db
        )
        {
            db = _db;
        }

        public async Task<ServiceResult<List<object>>> GetAllOnLesson(string Id, string userId)
        {
            var lesson = await db.Lessons.FirstOrDefaultAsync(l => l.Id == Id);

            if (lesson == null)
                return ServiceResult<List<object>>.Fail("There is no lesson with this id", 404);

            if (!string.IsNullOrEmpty(userId))
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user != null)
                {
                    var module = await db.Modules.FirstOrDefaultAsync(m => m.LessonsId != null && m.LessonsId.Contains(Id));
                    if (module != null)
                    {
                        var course = await db.Cources.FirstOrDefaultAsync(c => c.ModulesId != null && c.ModulesId.Contains(module.Id));
                        if (course != null)
                            if (user.EnrolledCourcesId == null || !user.EnrolledCourcesId.Contains(course.Id))
                                return ServiceResult<List<object>>.Fail("You are not enrolled in the course that contains this material", 403);
                    }
                }
            }

            if (lesson.MaterialsId == null || !lesson.MaterialsId.Any())
                return ServiceResult<List<object>>.Fail("There are no materials yet", 404);

            var materials = await db.Materials
                .Where(m => lesson.MaterialsId.Contains(m.Id))
                .Include(m => (m as TestMaterialModel).Questions)
                    .ThenInclude(q => q.Answers)
                .ToListAsync();

            if (!materials.Any())
                return ServiceResult<List<object>>.Fail("There are no materials yet", 404);

            var response = materials.Select(m => {
                if (m is VideoMaterialModel v) return new { v.Id, v.Type, v.VideoUrl, v.CreatedAt, v.UpdatedAt } as object;
                if (m is AssignmentMaterialModel a) return new { a.Id, a.Type, a.Description, a.Deadline, a.CreatedAt, a.UpdatedAt } as object;
                if (m is TestMaterialModel t) return new {
                    t.Id, t.Type, t.CreatedAt, t.UpdatedAt,
                    Questions = t.Questions?.Select(q => new {
                        q.Id, q.Text, Answers = q.Answers?.Select(ans => new { ans.Id, ans.Text })
                    })
                } as object;
                if (m is LinkMaterialModel l) return new { l.Id, l.Type, l.Url, l.Title, l.CreatedAt, l.UpdatedAt } as object;
                if (m is TextMaterialModel txt) return new { txt.Id, txt.Type, txt.Content, txt.CreatedAt, txt.UpdatedAt } as object;
                if (m is FileMaterialModel f) return new { f.Id, f.Type, f.FileUrl, f.CreatedAt, f.UpdatedAt } as object;

                return new { m.Id, m.Type, m.CreatedAt, m.UpdatedAt } as object;
            }).ToList();

            return ServiceResult<List<object>>.Ok(response, "All materials retrieved successfully");
        }

        public async Task<ServiceResult<object>> UploadFile(IFormFile file, string webRootPath, string scheme, string host)
        {
            string uploadsFolder = Path.Combine(webRootPath, "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            string uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(fileStream);

            string fileUrl = $"{scheme}://{host}/api/uploads/{uniqueFileName}";

            var createResult = await CreateMaterial(
                new CreateMaterialDTO { Type = "File", FileUrl = fileUrl }
            );

            if (!createResult.Success)
                return ServiceResult<object>.Fail(createResult.Message, createResult.StatusCode);

            var materialData = createResult.Data as dynamic;
            string materialId = materialData.Id;

            await db.SaveChangesAsync();

            return ServiceResult<object>.Ok(new { url = fileUrl, material = createResult.Data }, "File uploaded and attached to lesson successfully");
        }

        public async Task<ServiceResult<object>> CreateMaterial(CreateMaterialDTO dTO)
        {
            if (string.IsNullOrEmpty(dTO.Type))
                return ServiceResult<object>.Fail("Type is required", 400);

            MaterialModel material;

            switch (dTO.Type)
            {
                case "File":
                    material = new FileMaterialModel { FileUrl = dTO.FileUrl };
                    break;
                case "Text":
                    material = new TextMaterialModel { Content = dTO.Content };
                    break;
                case "Assignment":
                    material = new AssignmentMaterialModel { Description = dTO.Description, Deadline = dTO.Deadline ?? DateTime.UtcNow.AddDays(7) };
                    break;
                case "Video":
                    material = new VideoMaterialModel { VideoUrl = dTO.VideoUrl };
                    break;
                case "Link":
                    material = new LinkMaterialModel { Url = dTO.Url, Title = dTO.LinkTitle };
                    break;
                case "Test":
                    var test = new TestMaterialModel();
                    if (dTO.Questions != null)
                        foreach (var qDto in dTO.Questions)
                        {
                            var q = new QuestionModel
                            {
                                Id = Guid.NewGuid().ToString(),
                                Text = qDto.Text,
                                Answers = qDto.Answers.Select(a => new AnswerModel
                                {
                                    Id = Guid.NewGuid().ToString(),
                                    Text = a.Text,
                                    IsCorrect = a.IsCorrect
                                }).ToList()
                            };
                            test.Questions.Add(q);
                        }
                    material = test;
                    break;
                default:
                    return ServiceResult<object>.Fail("Invalid material type", 400);
            }

            material.Id = Guid.NewGuid().ToString();
            material.Type = dTO.Type;
            material.CreatedAt = DateTime.UtcNow;
            material.UpdatedAt = DateTime.UtcNow;

            await db.Materials.AddAsync(material);
            await db.SaveChangesAsync();

            object response = material.Type switch
            {
                "Video" => new { material.Id, material.Type, ((VideoMaterialModel)material).VideoUrl, material.CreatedAt, material.UpdatedAt },
                "Assignment" => new { material.Id, material.Type, ((AssignmentMaterialModel)material).Description, ((AssignmentMaterialModel)material).Deadline, material.CreatedAt, material.UpdatedAt },
                "Test" => new { material.Id, material.Type, material.CreatedAt, material.UpdatedAt, Questions = ((TestMaterialModel)material).Questions?.Select(q => new { q.Id, q.Text, Answers = q.Answers?.Select(ans => new { ans.Id, ans.Text }) }) },
                "Link" => new { material.Id, material.Type, ((LinkMaterialModel)material).Url, Title = ((LinkMaterialModel)material).Title, material.CreatedAt, material.UpdatedAt },
                "Text" => new { material.Id, material.Type, ((TextMaterialModel)material).Content, material.CreatedAt, material.UpdatedAt },
                "File" => new { material.Id, material.Type, ((FileMaterialModel)material).FileUrl, material.CreatedAt, material.UpdatedAt },
                _ => new { material.Id, material.Type, material.CreatedAt, material.UpdatedAt }
            };

            return ServiceResult<object>.Ok(response, "Material created successfully");
        }

        public async Task<ServiceResult<object>> UpdateMaterial(UpdateMaterialDTO dTO)
        {
            if (string.IsNullOrEmpty(dTO.Id))
                return ServiceResult<object>.Fail("Id is required", 400);

            var material = await db.Materials.FirstOrDefaultAsync(m => m.Id == dTO.Id);

            if (material == null)
                return ServiceResult<object>.Fail("Material does not exist with this id", 404);

            if (material is FileMaterialModel fileMaterial)
                fileMaterial.FileUrl = dTO.FileUrl ?? fileMaterial.FileUrl;
            else if (material is TextMaterialModel textMaterial)
                textMaterial.Content = dTO.Content ?? textMaterial.Content;
            else if (material is AssignmentMaterialModel assignmentMaterial)
            {
                if (dTO.Description != null) assignmentMaterial.Description = dTO.Description;
                if (dTO.Deadline != null) assignmentMaterial.Deadline = dTO.Deadline.Value;
            }
            else if (material is VideoMaterialModel videoMaterial)
                if (dTO.VideoUrl != null) videoMaterial.VideoUrl = dTO.VideoUrl;
            else if (material is TestMaterialModel testMaterial)
            {
                if (dTO.Questions != null)
                {
                    var existingQuestions = await db.Questions.Where(q => q.TestMaterialModelId == testMaterial.Id).ToListAsync();
                    db.Questions.RemoveRange(existingQuestions);

                    var newQuestions = new List<QuestionModel>();
                    foreach (var qDto in dTO.Questions)
                    {
                        var q = new QuestionModel
                        {
                            Id = Guid.NewGuid().ToString(),
                            TestMaterialModelId = testMaterial.Id,
                            Text = qDto.Text,
                            Answers = qDto.Answers.Select(a => new AnswerModel
                            {
                                Id = Guid.NewGuid().ToString(),
                                Text = a.Text,
                                IsCorrect = a.IsCorrect
                            }).ToList()
                        };
                        db.Questions.Add(q);
                        newQuestions.Add(q);
                    }

                    testMaterial.Questions = newQuestions;
                }
            }
            else if (material is LinkMaterialModel linkMaterial)
            {
                if (dTO.Url != null) linkMaterial.Url = dTO.Url;
                if (dTO.LinkTitle != null) linkMaterial.Title = dTO.LinkTitle;
            }

            material.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            object response = material.Type switch
            {
                "Video" => new { material.Id, material.Type, ((VideoMaterialModel)material).VideoUrl, material.CreatedAt, material.UpdatedAt },
                "Assignment" => new { material.Id, material.Type, ((AssignmentMaterialModel)material).Description, ((AssignmentMaterialModel)material).Deadline, material.CreatedAt, material.UpdatedAt },
                "Test" => new { material.Id, material.Type, material.CreatedAt, material.UpdatedAt, Questions = ((TestMaterialModel)material).Questions?.Select(q => new { q.Id, q.Text, Answers = q.Answers?.Select(ans => new { ans.Id, ans.Text }) }) },
                "Link" => new { material.Id, material.Type, ((LinkMaterialModel)material).Url, Title = ((LinkMaterialModel)material).Title, material.CreatedAt, material.UpdatedAt },
                "Text" => new { material.Id, material.Type, ((TextMaterialModel)material).Content, material.CreatedAt, material.UpdatedAt },
                "File" => new { material.Id, material.Type, ((FileMaterialModel)material).FileUrl, material.CreatedAt, material.UpdatedAt },
                _ => new { material.Id, material.Type, material.CreatedAt, material.UpdatedAt }
            };

            return ServiceResult<object>.Ok(response, "Material updated successfully");
        }

        public async Task<ServiceResult<string>> DeleteMaterial(string Id)
        {
            if (string.IsNullOrEmpty(Id))
                return ServiceResult<string>.Fail("Id is required", 400);

            var material = await db.Materials.FirstOrDefaultAsync(m => m.Id == Id);

            if (material == null)
                return ServiceResult<string>.Fail("Material does not exist with this id", 404);

            var lessons = await db.Lessons
                .Where(l => l.MaterialsId != null && l.MaterialsId.Contains(Id))
                .ToListAsync();

            foreach (var lesson in lessons) lesson.MaterialsId.Remove(Id);

            db.Materials.Remove(material);
            await db.SaveChangesAsync();

            return ServiceResult<string>.Ok("You deleted material", "Material deleted successfully");
        }
    }
}
