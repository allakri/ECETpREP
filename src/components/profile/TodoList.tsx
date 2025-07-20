
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}

const TODOS_STORAGE_KEY = 'ecet-todo-list';

export function TodoList() {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [newTodo, setNewTodo] = useState("");
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const savedTodos = localStorage.getItem(TODOS_STORAGE_KEY);
            if (savedTodos) {
                setTodos(JSON.parse(savedTodos));
            }
        } catch (error) {
            console.error("Could not load todos from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            try {
                localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
            } catch (error) {
                console.error("Could not save todos to localStorage", error);
            }
        }
    }, [todos, isMounted]);

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodo.trim() === "") {
            toast({
                variant: "destructive",
                title: "Empty Task",
                description: "Please enter a task before adding.",
            });
            return;
        }
        setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
        setNewTodo("");
    };

    const toggleTodo = (id: number) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
        toast({
            title: "Task Deleted",
            description: "The task has been removed from your list.",
        });
    };
    
    if (!isMounted) {
        return null;
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Study Todo List</CardTitle>
                <CardDescription>
                    Organize your study plan. Add, check off, and delete your tasks.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
                    <Input
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        placeholder="e.g., Revise Chapter 3 of Physics"
                    />
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                </form>

                <div className="space-y-3">
                    {todos.length > 0 ? (
                        todos.map(todo => (
                            <div key={todo.id} className="flex items-center gap-3 p-3 bg-card rounded-md border transition-colors hover:bg-muted/50">
                                <Checkbox
                                    id={`todo-${todo.id}`}
                                    checked={todo.completed}
                                    onCheckedChange={() => toggleTodo(todo.id)}
                                />
                                <label
                                    htmlFor={`todo-${todo.id}`}
                                    className={cn(
                                        "flex-1 text-sm cursor-pointer",
                                        todo.completed && "line-through text-muted-foreground"
                                    )}
                                >
                                    {todo.text}
                                </label>
                                <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-4">
                            Your task list is empty. Add a task to get started!
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
