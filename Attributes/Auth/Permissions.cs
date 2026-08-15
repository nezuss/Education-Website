namespace Backend.Attributes.Auth
{
    public static class Permissions
    {
        // ? Course
        public const string CourseCreate = "course.create";
        public const string CourseUpdate = "course.update";
        public const string CourseDelete = "course.delete";

        // ? Module
        public const string ModuleCreate = "module.create";
        public const string ModuleUpdate = "module.update";
        public const string ModuleDelete = "module.delete";

        // ? Lesson
        public const string LessonCreate = "module.create";
        public const string LessonUpdate = "module.update";
        public const string LessonDelete = "module.delete";
    }
}
