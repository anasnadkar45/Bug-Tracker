// Tasks.tsx
import { CreateTask } from '@/app/components/tasks/CreateTask';
import prisma from '@/app/lib/db';
import { TaskTable } from '@/app/components/tasks/TaskTable';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';

const getTasksData = async () => {
  const data = await prisma.task.findMany({
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

  // Convert dueDate and createdAt from Date to string
  const formattedData = data.map(task => ({
    ...task,
    dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    createdAt: task.createdAt.toISOString(), // Ensure this is a string
  }));

  return formattedData;
};


export default async function Tasks() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    redirect('/');
  }

  const tasks = await getTasksData();

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <CreateTask />
      </div>
      <TaskTable tasks={tasks} />
    </div>
  );
}