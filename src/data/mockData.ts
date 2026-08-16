export type Course = { id: string; title: string; direction: string; description: string; mentor: string; modules: string[]; price: number; };
export const courses: Course[] = [
    { id: "circular-design", title: "Circular Design", direction: "Circular design", description: "Проєктування продуктів і сервісів з урахуванням повторного використання ресурсів.", mentor: "Олена Марченко", modules: ["Основи circular design", "Життєвий цикл продукту", "Практичний проєкт"], price: 3200 },
    { id: "sustainable-materials", title: "Sustainable Materials", direction: "Sustainable design", description: "Матеріали, їхній вплив на довкілля та усвідомлений вибір для дизайн-проєктів.", mentor: "Максим Коваль", modules: ["Властивості матеріалів", "Оцінка впливу", "Матеріальна карта"], price: 2800 },
    { id: "eco-branding", title: "Eco Branding", direction: "Eco branding", description: "Як створювати чесні бренди та комунікації для сталих продуктів.", mentor: "Анна Левченко", modules: ["Стратегія бренду", "Візуальна мова", "Презентація концепту"], price: 2600 },
];
export const activeCourse = courses[0];
export const submissions = [
    { id: "project-12", student: "Ірина Петренко", assignment: "Проєкт: редизайн упаковки", status: "На перевірці", submitted: "Сьогодні" },
    { id: "project-13", student: "Дмитро Бондар", assignment: "Матеріальна карта", status: "Потребує доопрацювання", submitted: "Учора" },
    { id: "project-14", student: "Марія Коваль", assignment: "Проєкт: редизайн упаковки", status: "Нове", submitted: "14 серпня" },
];
