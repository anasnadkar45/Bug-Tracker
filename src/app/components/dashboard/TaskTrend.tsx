"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Task } from '../tasks/UpdateTask';
import { Chart as ChartJS, LineElement, PointElement, LinearScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale);

interface TaskTrendProps {
    tasks: Task[];
}

const getDailyTaskCounts = (tasks: Task[]) => {
    const dailyCounts: Record<string, number> = {};

    tasks.forEach(task => {
        const date = new Date(task.createdAt).toISOString().split('T')[0]; // Format date to YYYY-MM-DD
        dailyCounts[date] = (dailyCounts[date] || 0) + 1; // Increment count for that day
    });

    return dailyCounts;
};

export const TaskTrend: React.FC<TaskTrendProps> = ({ tasks }) => {
    const dailyTaskCounts = getDailyTaskCounts(tasks);
    const labels = Object.keys(dailyTaskCounts);
    const dataValues = Object.values(dailyTaskCounts);

    // Prepare x-axis labels as numerical values
    const numericalLabels = labels.map((_, index) => index + 1); // Generate numbers 1 to n

    // Chart data
    const data = {
        labels: numericalLabels, // Use numerical labels for x-axis
        datasets: [
            {
                label: 'Tasks Created',
                data: dataValues,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.4)',
                borderColor: '#fff',
                tension: 0.1,
            },
        ],
    };

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Daily Tasks Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <Line data={data} options={{
                    scales: {
                        x: {
                            type: 'linear', // Use linear scale for x-axis
                            position: 'bottom',
                        },
                    },
                    color:'white',
                }} />
            </CardContent>
        </Card>
    );
};