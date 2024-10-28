"use client"
import { deleteTask, State } from '@/app/action'
import React, { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { DeleteButton } from '../global/SubmitButton'

export interface Task {
    id: string
    title: string
    assignee: string
    description: string
    dueDate: string | null
    priority: string
    project: string
    status: string
    createdAt: string
}

interface TaskTableProps {
    task: Task
}

export const DeleteTask = ({ task }: TaskTableProps) => {
    const initialState: State = { message: "", status: undefined };
    const [state, formAction] = useActionState(deleteTask, initialState);
    useEffect(() => {
        console.log("State updated:", state);
        if (state.status === "success") {
            toast.success(state.message);
        } else if (state.status === "error") {
            toast.error(state.message);
        }
    }, [state]);
    return (
        <form action={formAction} className='flex gap-2 items-center cursor-pointer'>
            <input type="hidden" name="taskId" value={task.id} />
            <DeleteButton text='' />
        </form>
    )
}