const extensions = [".zip", ".rar", ".7z", ".tar", ".gz", ".tgz", ".pdf", ".png", ".jpg", ".jpeg", ".webp", ".txt", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx"];
export const assignmentFileAccept = extensions.join(",");
export function submissionFileError(file: Pick<File, "name" | "size">): string | undefined {
  if (!file.size) return "Обраний файл порожній. Додайте файл із виконаною роботою.";
  if (file.size > 150 * 1024 * 1024) return "Максимальний розмір файлу — 150 МБ.";
  const extension = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
  if (extension && !extensions.includes(extension)) return "Цей тип файлу не підтримується. Оберіть архів, PDF, зображення, текстовий або офісний документ.";
}
