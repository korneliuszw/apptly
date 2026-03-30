import { applicationArtifactsTable, applicationGenerationTable, applicationPlanTable, db } from "@apptly/db/src"
import { desc } from "drizzle-orm"
import { and, eq } from "drizzle-orm/sql/expressions/conditions"

export const createApplicationPlan = async (appId: string, plan: string) => {
    return db.insert(applicationPlanTable).values({
        applicationId: appId,
        plan,
    }).returning({ id: applicationPlanTable.id })
}

export const getApplicationPlansWithGenerations = async (applicationId: string) => {
    return db.select({
        id: applicationPlanTable.id,
        plan: applicationPlanTable.plan,
        generations: {
            id: applicationGenerationTable.id,
            status: applicationGenerationTable.status,
            updatedAt: applicationGenerationTable.updatedAt,
            finishedAt: applicationGenerationTable.finishedAt,
        },
        artifacts: {
            id: applicationArtifactsTable.id,
            type: applicationArtifactsTable.type,
            url: applicationArtifactsTable.url,
        },
    }).from(applicationPlanTable)
        .where(eq(applicationPlanTable.applicationId, applicationId))
        .leftJoin(applicationGenerationTable, eq(applicationGenerationTable.applicationPlanId, applicationPlanTable.id))
        .leftJoin(applicationArtifactsTable, eq(applicationArtifactsTable.generationId, applicationGenerationTable.id))
        .orderBy(desc(applicationGenerationTable.createdAt));
}

export const createGeneration = async (planId: string, containerId: string) => {
    return db.insert(applicationGenerationTable).values({
        applicationPlanId: planId,
        status: "pending",
        containerId,
    }).returning({ id: applicationGenerationTable.id })
}

export const completeGeneration = async (generationId: string, success: boolean) => {
    return db.update(applicationGenerationTable)
        .set({
            status: success ? "completed" : "failed",
            finishedAt: new Date(),
        })
        .where(eq(applicationGenerationTable.id, generationId))
        .execute();
}

export const updateGenerationProgress = async (generationId: string, content: string) => {
    return db.update(applicationGenerationTable)
        .set({  status: "in_progress", updatedAt: new Date(), content: content })
        .where(and(eq(applicationGenerationTable.id, generationId)))
        .execute();
}

export const getPlanById = async (planId: string) => {
    return db.select({ plan: applicationPlanTable.plan })
        .from(applicationPlanTable)
        .where(eq(applicationPlanTable.id, planId))
}


export const createGenerationArtifact = async (generationId: string, type: "apk" | "code", url: string) => {
    return db.insert(applicationArtifactsTable).values({
        generationId,
        type,
        url,
    }).returning({ id: applicationArtifactsTable.id })
}

export const getGenerationContainerId = async (generationId: string) => {
    const result = await db.select({ containerId: applicationGenerationTable.containerId })
        .from(applicationGenerationTable)
        .where(eq(applicationGenerationTable.id, generationId))
        .limit(1);
    return result.length > 0 ? result[0].containerId : null;
}

export const getGenerationArtifacts = async (generationId: string) => {
    return db.select({ id: applicationArtifactsTable.id, type: applicationArtifactsTable.type, url: applicationArtifactsTable.url })
        .from(applicationArtifactsTable)
        .where(eq(applicationArtifactsTable.generationId, generationId))
}

export const markContainerAsDead = async (containerId: string) => {
    return db.update(applicationGenerationTable)
        .set({ containerAlive: false, updatedAt: new Date() })
        .where(eq(applicationGenerationTable.containerId, containerId))
        .execute();
}