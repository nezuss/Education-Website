export type Course = {
    id: string;
    title: string;
    direction: string;
    description: string;
    mentor: string;
    modules: string[];
    price: number;
    bannerUrl?: string;
    totalLearningPeriodWeeks?: number;
    projectsReadyForPortfolio?: number;
};
