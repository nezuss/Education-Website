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

export async function getCourseStats(courseId: string, studentId?: string): Promise<CourseStats> {
    const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : "";
    return request<CourseStats>(`/api/cource/stats/total-cource/${encodeURIComponent(courseId)}${query}`);
}

export async function getModuleStats(moduleId: string, studentId?: string): Promise<ModuleStats> {
    const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : "";
    return request<ModuleStats>(`/api/cource/stats/total-module/${encodeURIComponent(moduleId)}${query}`);
}
