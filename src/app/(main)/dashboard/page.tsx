import Dashboard from '@/app/components/dashboard/Dashboard';
import prisma from '@/app/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

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

const page = async () => {
  const tasks = await getTasksData();
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    redirect('/');
  }
  return (
    <Dashboard tasks={tasks} />
  )
}

export default page