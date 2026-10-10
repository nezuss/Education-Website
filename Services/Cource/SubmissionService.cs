using Microsoft.EntityFrameworkCore;
using Backend.Models.Cource.MaterialAnswers;
using Backend.DTO.Cource.Submission;
using Backend.Models;
using Backend.Responses.Cource;
using Backend.Utils;
using Microsoft.AspNetCore.StaticFiles;

namespace Backend.Services.Cource
{
    public class SubmissionService
    {
        private readonly DBContextModel db;
        private readonly IWebHostEnvironment env;

        public SubmissionService
        (
            DBContextModel _db, IWebHostEnvironment _env
        )
        {
            db = _db;
            env = _env;
        }

        // * Private storage for submission files
        public static string GetStorageFolder(string contentRootPath)
        {
            return Path.Combine(contentRootPath, "PrivateUploads", "submissions");
        }

        public async Task<ServiceResult<SubmissionResponse>> GetDetails(string Id, string UserId)
        {
            if (string.IsNullOrEmpty(Id))
            {
                return ServiceResult<SubmissionResponse>
                       .Fail("Submission id is required", 400);
            }

            if (string.IsNullOrEmpty(UserId))
            {
                return ServiceResult<SubmissionResponse>
                       .Fail("User id is required", 401);
            }

            var submission = await db.MaterialSubmissions.AsNoTracking()
                                   .FirstOrDefaultAsync(ms => ms.Id == Id);

            if (submission == null)
            {
                return ServiceResult<SubmissionResponse>
                       .Fail("There are no submission with this id", 404);
            }

            bool hasAccess = await HasAccess(submission, UserId);

            if (!hasAccess)
            {
                return ServiceResult<SubmissionResponse>
                       .Fail("You do not have permission to view this submission", 403);
            }

            var response = await SubmissionResponseBuilder.Build(db, new List<MaterialSubmissionModel> { submission });

            return ServiceResult<SubmissionResponse>.Ok(response[0], "Submission details get successfully");
        }

        public async Task<ServiceResult<SubmissionFileResponse>> GetFile(string Id, string UserId)
        {
            if (string.IsNullOrEmpty(Id))
            {
                return ServiceResult<SubmissionFileResponse>
                       .Fail("Submission id is required", 400);
            }

            if (string.IsNullOrEmpty(UserId))
            {
                return ServiceResult<SubmissionFileResponse>
                       .Fail("User id is required", 401);
            }

            var submission = await db.MaterialSubmissions.AsNoTracking()
                                                         .FirstOrDefaultAsync(ms => ms.Id == Id);

            if (submission == null)
            {
                return ServiceResult<SubmissionFileResponse>
                       .Fail("There are no submission with this id", 404);
            }

            if (submission is not AssignmentSubmissionModel assignmentSubmission)
            {
                return ServiceResult<SubmissionFileResponse>
                       .Fail("This submission has no file", 400);
            }

            if (!await HasAccess(submission, UserId))
            {
                return ServiceResult<SubmissionFileResponse>
                       .Fail("You do not have permission to download this file", 403);
            }

            string? filePath = null;
            string fileName = "";

            // * Get submission file
            string storageFolder = GetStorageFolder(env.ContentRootPath);
            if (Directory.Exists(storageFolder))
            {
                filePath = Directory.GetFiles(storageFolder, $"{submission.Id}_*").FirstOrDefault();
                if (filePath != null)
                    fileName = Path.GetFileName(filePath).Substring(submission.Id.Length + 1);
            }

            if (filePath == null)
            {
                return ServiceResult<SubmissionFileResponse>
                       .Fail("Submission file not found", 404);
            }

            if (!new FileExtensionContentTypeProvider().TryGetContentType(fileName, out var contentType))
                contentType = "application/octet-stream";

            var response = new SubmissionFileResponse
            {
                FilePath = filePath,
                FileName = fileName,
                ContentType = contentType,
            };

            return ServiceResult<SubmissionFileResponse>.Ok(response, "Submission file get successfully");
        }

        public async Task<ServiceResult<MaterialSubmissionModel>> SendFeedback(string id, SendFeedbackDTO dTO)
        {
            if (string.IsNullOrEmpty(id))
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("Submission id is required", 400);
            }

            if (dTO == null || string.IsNullOrWhiteSpace(dTO.Feedback))
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("Feedback cannot be empty", 400);
            }

            var submission = await db.MaterialSubmissions.FirstOrDefaultAsync(ms => ms.Id == id);

            if (submission == null)
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("There are no submission with this id", 404);
            }
  
            submission.Feedback = dTO.Feedback;
            submission.UpdatedAt = DateTime.UtcNow;

            db.MaterialSubmissions.Update(submission);
            await db.SaveChangesAsync();

            return ServiceResult<MaterialSubmissionModel>.Ok(submission, "Feedback sent successfully");
        }

        public async Task<ServiceResult<MaterialSubmissionModel>> RequestRevision(string id, RequestRevisionDTO dTO)
        {
            if (string.IsNullOrEmpty(id))
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("Submission id is required", 400);
            }

            if (dTO == null || string.IsNullOrWhiteSpace(dTO.Message))
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("Message cannot be empty", 400);
            }

            var submission = await db.MaterialSubmissions.FirstOrDefaultAsync(ms => ms.Id == id);

            if (submission == null)
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("There are no submission with this id", 404);
            }

            if (submission.Status == "Reviewed")
            {
                return ServiceResult<MaterialSubmissionModel>
                       .Fail("Cannot request revision for already reviewed submission", 400);
            }
          
            submission.RevisionMessage = dTO.Message;
            submission.Status = "NeedsRevision";
            submission.UpdatedAt = DateTime.UtcNow;

            db.MaterialSubmissions.Update(submission);
            await db.SaveChangesAsync();

            return ServiceResult<MaterialSubmissionModel>.Ok(submission, "Revision requested successfully");
        }

        // * Check if user have an access
        private async Task<bool> HasAccess(MaterialSubmissionModel submission, string UserId)
        {
            bool hasAccess = submission.UserId == UserId;

            if (!hasAccess)
            {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Id == UserId);
                if (user != null && !string.IsNullOrEmpty(user.RoleId))
                {
                    var role = await db.Roles.FirstOrDefaultAsync(r => r.Id == user.RoleId);
                    if (role != null)
                    {
                        if (role.Name == "Admin")
                        {
                            hasAccess = true;
                        }
                        else if (role.Name == "Teacher")
                        {
                            var lesson = await db.Lessons.FirstOrDefaultAsync(l => l.MaterialsId != null && l.MaterialsId.Contains(submission.RelatedMaterialId));
                            if (lesson != null)
                            {
                                var module = await db.Modules.FirstOrDefaultAsync(m => m.LessonsId != null && m.LessonsId.Contains(lesson.Id));
                                if (module != null)
                                {
                                    var cource = await db.Cources.FirstOrDefaultAsync(c => c.ModulesId != null && c.ModulesId.Contains(module.Id));
                                    if (cource != null && cource.AssignedTeacherId == UserId)
                                    {
                                        hasAccess = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return hasAccess;
        }
    }
}
