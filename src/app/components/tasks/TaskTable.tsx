"use client"

import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UpdateTask } from './UpdateTask'
import { DeleteTask } from './DeleteTask'

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
    tasks: Task[]
}

interface Timer {
    isActive: boolean
    startTime: number
    elapsedTime: number
    intervalId?: NodeJS.Timeout
}

export function TaskTable({ tasks }: TaskTableProps) {

    const [sortConfig, setSortConfig] = useState<{ key: keyof Task; direction: 'ascending' | 'descending' } | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [tasksPerPage, setTasksPerPage] = useState(10)
    const [timers, setTimers] = useState<Record<string, Timer>>({})

    const startTimer = (taskId: string) => {
        const newTimers = { ...timers }
        newTimers[taskId] = { isActive: true, startTime: Date.now(), elapsedTime: newTimers[taskId]?.elapsedTime || 0 }
        setTimers(newTimers)

        const interval = setInterval(() => {
            setTimers(prevTimers => {
                const updatedTimer = { ...prevTimers[taskId], elapsedTime: Math.floor((Date.now() - newTimers[taskId].startTime) / 1000) + (prevTimers[taskId]?.elapsedTime || 0) }
                return { ...prevTimers, [taskId]: updatedTimer }
            })
        }, 1000)

        newTimers[taskId].intervalId = interval
        setTimers(newTimers)
    }

    const stopTimer = (taskId: string) => {
        const newTimers = { ...timers }
        newTimers[taskId].isActive = false
        clearInterval(newTimers[taskId].intervalId)
        setTimers(newTimers)
    }

    const toggleTimer = (taskId: string) => {
        if (timers[taskId]?.isActive) {
            stopTimer(taskId)
        } else {
            startTimer(taskId)
        }
    }

    const sortedTasks = useMemo(() => {
        const sortableTasks = [...tasks]

        if (sortConfig !== null) {
            sortableTasks.sort((a, b) => {
                const aValue = a[sortConfig.key]
                const bValue = b[sortConfig.key]

                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'ascending'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue)
                }

                if (sortConfig.key === 'dueDate' || sortConfig.key === 'createdAt') {
                    const aDate = aValue ? new Date(aValue).getTime() : 0
                    const bDate = bValue ? new Date(bValue).getTime() : 0
                    return sortConfig.direction === 'ascending' ? aDate - bDate : bDate - aDate
                }

                return 0
            })
        }

        return sortableTasks
    }, [tasks, sortConfig])

    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * tasksPerPage
        return sortedTasks.slice(startIndex, startIndex + tasksPerPage)
    }, [sortedTasks, currentPage, tasksPerPage])

    const totalPages = Math.ceil(sortedTasks.length / tasksPerPage)

    const requestSort = (key: keyof Task) => {
        let direction: 'ascending' | 'descending' = 'ascending'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }

    const getSortIcon = (key: keyof Task) => {
        if (sortConfig?.key === key) {
            return sortConfig.direction === 'ascending' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
        }
        return null
    }

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-red-100 text-red-800'
            case 'medium':
                return 'bg-yellow-100 text-yellow-800'
            case 'low':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800'
            case 'in progress':
                return 'bg-blue-100 text-blue-800'
            case 'not started':
                return 'bg-gray-100 text-gray-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-4">
            <ScrollArea className="h-[calc(100vh-200px)] w-full">
                <div className="rounded-lg border shadow-sm">
                    <div className="p-2">
                        <p className="text-sm text-muted-foreground">
                            Click on the headers below to sort the tasks by Title, Assignee, Project, Priority, Status, Due Date, or Created At.
                        </p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-secondary">
                                {['Title', 'Assignee', 'Project', 'Priority', 'Status', 'Due Date', 'Created At', 'Timer', 'Actions'].map((header, index) => (
                                    <TableHead key={index} className="py-3 px-4">
                                        <button
                                            onClick={() => requestSort(header.toLowerCase().replace(' ', '') as keyof Task)}
                                            className="flex items-center font-semibold"
                                        >
                                            {header}
                                            {getSortIcon(header.toLowerCase().replace(' ', '') as keyof Task)}
                                        </button>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedTasks.map((task) => (
                                <TableRow key={task.id} className="hover:bg-muted transition-colors">
                                    <TableCell className="py-3 px-4 font-medium">{task.title}</TableCell>
                                    <TableCell className="py-3 px-4">{task.assignee || 'Unassigned'}</TableCell>
                                    <TableCell className="py-3 px-4">{task.project || 'N/A'}</TableCell>
                                    <TableCell className="py-3 px-4">
                                        <Badge className={`${getPriorityColor(task.priority)} font-medium`}>
                                            {task.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <Badge className={`${getStatusColor(task.status)} font-medium`}>
                                            {task.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        {format(new Date(task.createdAt), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <div className="flex items-center">
                                            <Button onClick={() => toggleTimer(task.id)} className="mr-2">
                                                {timers[task.id]?.isActive ? 'Stop' : 'Start'} Timer
                                            </Button>
                                            <span>
                                                {timers[task.id]?.elapsedTime ? `${timers[task.id].elapsedTime} sec` : '0 sec'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-3 px-4 flex gap-2 items-center">
                                        <UpdateTask task={task} />
                                        <DeleteTask task={task}/>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </ScrollArea>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">Rows per page</p>
                    <Select
                        value={tasksPerPage.toString()}
                        onValueChange={(value) => {
                            setTasksPerPage(Number(value))
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={tasksPerPage} />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 15, 20].map((num) => (
                                <SelectItem key={num} value={num.toString()}>
                                    {num}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}