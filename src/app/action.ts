"use server";
import { z } from 'zod';
import prisma from './lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { revalidatePath } from 'next/cache';

export type State = {
    status: "error" | "success" | undefined;
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;
};

const taskSchema = z.object({
    title: z
        .string()
        .min(3, { message: "The title must have a minimum length of 3 characters" }),
    description: z
        .string()
        .min(3, { message: "Description is required" }),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    status: z.enum(["OPEN", "IN_PROGRESS", "REVIEW", "DONE", "CLOSED", "REOPENED"]),
    assignee: z.string().min(3, { message: "Assignee name must have a minimum length of 3 characters" }),
    project: z.string().min(3, { message: "Project name must have a minimum length of 3 characters" }),
    dueDate: z.string().refine(date => !isNaN(Date.parse(date)), {
        message: "Invalid date",
    }),
});

export async function createTask(state: State | { status: string; message: string; }, formData: FormData): Promise<State | { status: string; message: string; }> {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return {
            status: "error",
            message: "User not found. Please log in to assign a task.",
        };
    }

    const validateFields = taskSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        status: formData.get("status"),
        assignee: formData.get("assignee"),
        project: formData.get("project"),
        dueDate: formData.get("dueDate"),
    });

    if (!validateFields.success) {
        const state: State = {
            status: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: "Oops, I think there is a mistake with your inputs.",
        };

        console.log(state);
        return state;
    }

    try {
        await prisma.task.create({
            data: {
                userId: user.id,
                title: validateFields.data.title,
                description: validateFields.data.description,
                priority: validateFields.data.priority,
                status: validateFields.data.status,
                assignee: validateFields.data.assignee,
                project: validateFields.data.project,
                dueDate: validateFields.data.dueDate ? new Date(validateFields.data.dueDate) : "",
            },
        });

        revalidatePath(`/tasks`);

        const state: State = {
            status: "success",
            message: "Task has been created successfully",
        };

        return state;
    } catch (error) {
        console.error("Error creating task:", error);
        return {
            status: "error",
            message: "An error occurred while creating the task. Please try again later.",
        };
    }
}

export async function updateTask(state: State | { status: string; message: string; }, formData: FormData): Promise<State | { status: string; message: string; }> {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return {
            status: "error",
            message: "User not found. Please log in to assign a task.",
        };
    }

    const validateFields = taskSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        status: formData.get("status"),
        assignee: formData.get("assignee"),
        project: formData.get("project"),
        dueDate: formData.get("dueDate"),
    });

    if (!validateFields.success) {
        const state: State = {
            status: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: "Oops, I think there is a mistake with your inputs.",
        };

        console.log(state);
        return state;
    }

    const taskId = formData.get('taskId') as string;
    try {
        await prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                userId: user.id,
                title: validateFields.data.title,
                description: validateFields.data.description,
                priority: validateFields.data.priority,
                status: validateFields.data.status,
                assignee: validateFields.data.assignee,
                project: validateFields.data.project,
                dueDate: validateFields.data.dueDate ? new Date(validateFields.data.dueDate) : "",
            },
        });

        revalidatePath(`/tasks`);

        const state: State = {
            status: "success",
            message: "Task has been updated successfully",
        };

        return state;
    } catch (error) {
        console.error("Error updating task:", error);
        return {
            status: "error",
            message: "An error occurred while updating the task. Please try again later.",
        };
    }
}

export async function deleteTask(state: State | { status: string; message: string; }, formData: FormData): Promise<State | { status: string; message: string; }> {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return {
            status: "error",
            message: "User not found. Please log in to assign a task.",
        };
    }

    const taskId = formData.get('taskId') as string;

    try {
        await prisma.task.delete({
            where: {
                id: taskId,
            },
        });

        revalidatePath(`/tasks`);

        const state: State = {
            status: "success",
            message: "Task has been deleted successfully",
        };

        return state;
    } catch (error) {
        console.error("Error deleting task:", error);
        return {
            status: "error",
            message: "An error occurred while deleting the task. Please try again later.",
        };
    }
}