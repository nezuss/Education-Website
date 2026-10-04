export type Course = {
    id: string;
    title: string;
    direction: string;
    description: string;
    mentor: string;
    assignedTeacherId?: string;
    modules: string[];
    price: number;
    rating?: number;
    reviews?: number;
    studentsCount?: number;
    bannerUrl?: string;
    totalLearningPeriodWeeks?: number;
    projectsReadyForPortfolio?: number;
};
