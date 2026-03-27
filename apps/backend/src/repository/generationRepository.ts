import { applicationGenerationTable, applicationPlanTable, db } from "@apptly/db/src"
import { eq } from "drizzle-orm/sql/expressions/conditions"

export const createApplicationPlan = async (appId: string, plan: string) => {
    return db.insert(applicationPlanTable).values({
        applicationId: appId,
        plan,
    }).returning({ id: applicationPlanTable.id })
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

export const updateGenerationProgress = async (generationId: string) => {
    return db.update(applicationGenerationTable)
        .set({  status: "in_progress", updatedAt: new Date() })
        .where(eq(applicationGenerationTable.id, generationId))
        .execute();
}

export const getPlanById = async (planId: string) => {
    return db.select({ plan: applicationPlanTable.plan })
        .from(applicationPlanTable)
        .where(eq(applicationPlanTable.id, planId))
}