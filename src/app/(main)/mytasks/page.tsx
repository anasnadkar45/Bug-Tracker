import { CreateTask } from '@/app/components/tasks/CreateTask';
import prisma from '@/app/lib/db';
import { TaskTable } from '@/app/components/tasks/TaskTable';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

const getTasksData = async (userId: string) => {
    const data = await prisma.task.findMany({
        where: {
            userId: userId,
        },
        select: {
            id: true,
            title: true,
            assignee: true,
            description: true,
            dueDate: true,
            priority: true,
            project: true,
            status: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedData = data.map(task => ({
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: task.createdAt.toISOString(), // Ensure this is a string
    }));

    return formattedData;
};


export default async function Tasks() {
    const {getUser} = getKindeServerSession();
    const user = await getUser();
    if(!user){
        redirect('/');
    }
    const tasks = await getTasksData(user?.id as string);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Tasks</h1>
                <CreateTask />
            </div>
            <TaskTable tasks={tasks} />
        </div>
    );
}