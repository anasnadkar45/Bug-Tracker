import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TaskTable } from '../tasks/TaskTable';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TaskTrend } from './TaskTrend';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface Task {
    id: string;
    title: string;
    assignee: string;
    description: string;
    dueDate: string | null;
    priority: string;
    project: string;
    status: string;
    createdAt: string;
}

interface DashboardProps {
    tasks: Task[];
}

export default async function Dashboard({ tasks }: DashboardProps) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
        redirect('/');
    }

    const completedTasks = tasks.filter(task => task.status === 'DONE').length;
    const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS').length;
    const notStartedTasks = tasks.filter(task => task.status === 'OPEN').length;
    const reviewedTasks = tasks.filter(task => task.status === 'REVIEW').length;
    const closedTasks = tasks.filter(task => task.status === 'CLOSED').length;

    const cardData = [
        { title: "Total Tasks", count: tasks.length },
        { title: "Completed Tasks", count: completedTasks },
        { title: "In Progress Tasks", count: inProgressTasks },
        { title: "Tasks Not Started", count: notStartedTasks },
        { title: "Tasks In Review", count: reviewedTasks },
        { title: "Tasks Closed", count: closedTasks },
    ];

    const bgColors = [
        "bg-primary",  
        "bg-[#243642]", 
        "bg-[#0B192C]",  
        "bg-[#387478]",  
        "bg-[#7E60BF]",  
        "bg-[#B17457]",  
    ];


    const projectCounts = tasks.reduce((acc, task) => {
        acc[task.project] = (acc[task.project] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const topProjects = Object.entries(projectCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    return (
        <div className="container mx-auto p-4">
            {/* Main content */}
            <div className="flex-1 p-8 overflow-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold">Welcome to the Bug Tasker!</h2>
                    <Link href={'/profile'}>
                        <Avatar className='border-2 border-primary'>
                            <AvatarImage src={user.picture as string} alt={user.email as string} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </Link>
                </div>

                {/* Task Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {cardData.map((card, index) => (
                        <Card key={index} className={bgColors[index % bgColors.length]}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-bold">{card.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.count}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Top Projects */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Top Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topProjects.map(([project, count]) => (
                                <div key={project} className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${(count / tasks.length) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{project}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Trend Line for Concurrent Tasks */}
                <TaskTrend tasks={tasks} />

                {/* Recent Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TaskTable tasks={tasks.slice(0, 5)} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}