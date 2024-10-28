"use client"
import { createTask } from '@/app/action';
import React, { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from '../global/SubmitButton';

export const CreateTask = () => {
    const initialState = { message: "", status: undefined, errors: {}};
    const [state, formAction] = useActionState(createTask, initialState);
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        if (state.status === "success") {
            toast.success(state.message);
        } else if (state.status === "error") {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="default" size="sm">Create Task</Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-full lg:max-w-[800px] max-h-[100vh] overflow-y-auto p-4">
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold">Assign new task</SheetTitle>
                    </SheetHeader>
                    <form action={formAction}>
                        <div className="grid gap-4 py-4">
                            <div className="grid items-center gap-2">
                                <Label htmlFor="title" className="text-left">Title</Label>
                                <Input id="title" name="title" placeholder="Todo Sidebar" />
                                {state.errors?.title && (
                                    <p className="text-destructive">{state.errors.title}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <Label>Assignee</Label>
                                <Input id="assignee" name="assignee" placeholder="John Doe" />
                                {state.errors?.assignee && (
                                    <p className="text-destructive">{state.errors.assignee}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <Label>Project Name</Label>
                                <Input id="project" name="project" placeholder="Bug Tracker" />
                                {state.errors?.project && (
                                    <p className="text-destructive">{state.errors.project}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="priority" className="text-left">Priority</Label>
                                <input type="hidden" name="priority" value={selectedPriority || ""} />
                                <Select onValueChange={(value) => setSelectedPriority(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Priority" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card">
                                        <SelectGroup>
                                            <SelectItem key="1" value="HIGH">High</SelectItem>
                                            <SelectItem key="2" value="MEDIUM">Medium</SelectItem>
                                            <SelectItem key="3" value="LOW">Low</SelectItem>
                                            <SelectItem key="4" value="CRITICAL">Critical</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {state.errors?.priority && (
                                    <p className="text-destructive">{state.errors.priority}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <Label htmlFor="status" className="text-left">Status</Label>
                                <input type="hidden" name="status" value={selectedType || ""} />
                                <Select onValueChange={(value) => setSelectedType(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card">
                                        <SelectGroup>
                                            <SelectItem key="1" value="OPEN">Open</SelectItem>
                                            <SelectItem key="2" value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem key="3" value="REVIEW">Review</SelectItem>
                                            <SelectItem key="4" value="DONE">Done</SelectItem>
                                            <SelectItem key="5" value="CLOSED">Closed</SelectItem>
                                            <SelectItem key="6" value="REOPENED">Reopened</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {state.errors?.status && (
                                    <p className="text-destructive">{state.errors.status}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-y-2">
                                <input type="hidden" name="dueDate" value={date ? date.toISOString() : ""} />
                                <Label htmlFor="dueDate" className="text-left">Due Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>


                            <div className="grid items-center gap-4">
                                <Label htmlFor="description" className="text-left">Description</Label>
                                <Textarea className="min-h-[200px]" id="description" name="description" placeholder="Task description here." />
                                {state.errors?.description && (
                                    <p className="text-destructive">{state.errors.description}</p>
                                )}
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <SubmitButton text="Create Task" />
                            </SheetClose>
                        </SheetFooter>
                    </form>
                </SheetContent>
            </Sheet>
        </div>
    );
};