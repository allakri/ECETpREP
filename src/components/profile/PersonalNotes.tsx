
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Save, Trash2, ArrowLeft, Edit } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from 'date-fns';

interface Note {
    id: number;
    title: string;
    content: string;
    updatedAt: string;
}

const NOTES_STORAGE_KEY = 'ecet-personal-notes-structured';

export function PersonalNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentNote, setCurrentNote] = useState<Partial<Note> | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
            if (savedNotes) {
                setNotes(JSON.parse(savedNotes));
            }
        } catch (error) {
            console.error("Could not load notes from localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            try {
                localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
            } catch (error) {
                console.error("Could not save notes to localStorage", error);
            }
        }
    }, [notes, isMounted]);

    const handleSaveNote = () => {
        if (!currentNote || !currentNote.title?.trim()) {
            toast({ variant: "destructive", title: "Title is required" });
            return;
        }

        const now = new Date().toISOString();
        if (currentNote.id) {
            // Update existing note
            setNotes(notes.map(n => n.id === currentNote.id ? { ...n, ...currentNote, updatedAt: now } as Note : n));
            toast({ title: "Note Updated" });
        } else {
            // Create new note
            const newNote: Note = {
                id: Date.now(),
                title: currentNote.title,
                content: currentNote.content || "",
                updatedAt: now,
            };
            setNotes([...notes, newNote]);
            toast({ title: "Note Created" });
        }
        setIsEditing(false);
        setCurrentNote(null);
    };

    const handleEdit = (note: Note) => {
        setCurrentNote(note);
        setIsEditing(true);
    };
    
    const handleCreateNew = () => {
        setCurrentNote({ title: "", content: "" });
        setIsEditing(true);
    };

    const handleDelete = (id: number) => {
        setNotes(notes.filter(n => n.id !== id));
        toast({ title: "Note Deleted" });
    };

    if (!isMounted) {
        return null; // Or a skeleton loader
    }
    
    if (isEditing) {
        return (
             <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                            <ArrowLeft />
                        </Button>
                        <CardTitle>{currentNote?.id ? "Edit Note" : "Create New Note"}</CardTitle>
                        <Button onClick={handleSaveNote}>
                            <Save className="mr-2 h-4 w-4" /> Save
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input 
                        placeholder="Note Title"
                        value={currentNote?.title || ""}
                        onChange={(e) => setCurrentNote(prev => ({...prev, title: e.target.value}))}
                        className="text-lg font-bold"
                    />
                    <Textarea
                        value={currentNote?.content || ""}
                        onChange={(e) => setCurrentNote(prev => ({...prev, content: e.target.value}))}
                        placeholder="Start typing your notes here..."
                        rows={15}
                        className="text-base"
                    />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Personal Notes</CardTitle>
                        <CardDescription>
                            Organize your study material. Your notes are saved locally.
                        </CardDescription>
                    </div>
                    <Button onClick={handleCreateNew}>
                        <Plus className="mr-2 h-4 w-4" /> Create New
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {notes.length > 0 ? (
                        notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(note => (
                            <div key={note.id} className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-muted/50">
                                <div>
                                    <h3 className="font-semibold text-lg">{note.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Last updated: {format(new Date(note.updatedAt), "PPpp")}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(note)}>
                                        <Edit className="h-5 w-5" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete your note titled "{note.title}".
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(note.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="text-center py-10 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">You don't have any notes yet.</p>
                            <Button variant="link" onClick={handleCreateNew}>Create your first note</Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
