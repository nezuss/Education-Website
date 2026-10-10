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
    const data = await request<CourseStats>(`/api/cource/stats/total-cource/${encodeURIComponent(courseId)}`);
    validateStats(data, courseId, "courceId");
    return data;
}

export async function getModuleStats(moduleId: string): Promise<ModuleStats> {
    const data = await request<ModuleStats>(`/api/cource/stats/total-module/${encodeURIComponent(moduleId)}`);
    validateStats(data, moduleId, "moduleId");
    return data;
}

function validateStats(data: CourseStats | ModuleStats, id: string, key: "courceId" | "moduleId") {
    const fields = ["totalLessons", "completedLessons", "totalMaterials", "totalSubmittableMaterials", "completedSubmittableMaterials"] as const;
    const validCount = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
    if (!data || typeof data !== "object" || !(key in data) || (data as unknown as Record<string, unknown>)[key] !== id ||
        typeof data.title !== "string" || !Number.isFinite(data.progressPercentage) || data.progressPercentage < 0 || data.progressPercentage > 100 ||
        fields.some(field => !validCount(data[field])) || data.completedLessons > data.totalLessons ||
        data.completedSubmittableMaterials > data.totalSubmittableMaterials || data.totalSubmittableMaterials > data.totalMaterials ||
        ("courceId" in data && (!validCount(data.totalModules) || !validCount(data.completedModules) || data.completedModules > data.totalModules))) {
        throw new Error("Сервер не повернув коректну статистику навчання. Дані поки недоступні.");
    }
}
