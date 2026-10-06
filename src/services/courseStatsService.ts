import { request } from "./api/apiClient";

export type CourseStats = {
    courceId: string;
    title: string;
    progressPercentage: number;
    totalModules: number;
    completedModules: number;
    totalLessons: number;
    completedLessons: number;
    totalMaterials: number;
    totalSubmittableMaterials: number;
    completedSubmittableMaterials: number;
};

export type ModuleStats = {
    moduleId: string;
    title: string;
    progressPercentage: number;
    totalLessons: number;
    completedLessons: number;
    totalMaterials: number;
    totalSubmittableMaterials: number;
    completedSubmittableMaterials: number;
};

export async function getCourseStats(courseId: string): Promise<CourseStats> {
    return request<CourseStats>(`/api/cource/stats/total-cource/${encodeURIComponent(courseId)}`);
}

export async function getModuleStats(moduleId: string): Promise<ModuleStats> {
    return request<ModuleStats>(`/api/cource/stats/total-module/${encodeURIComponent(moduleId)}`);
}
