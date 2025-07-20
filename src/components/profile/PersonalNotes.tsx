
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const NOTES_STORAGE_KEY = 'ecet-personal-notes';

export function PersonalNotes() {
    const [notes, setNotes] = useState("");
    const { toast } = useToast();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        try {
            const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
            if (savedNotes) {
                setNotes(savedNotes);
            }
        } catch (error) {
            console.error("Could not load notes from localStorage", error);
        }
    }, []);
    
    const handleSaveNotes = () => {
        try {
            localStorage.setItem(NOTES_STORAGE_KEY, notes);
            toast({
                title: "Notes Saved",
                description: "Your personal notes have been successfully saved.",
            });
        } catch (error) {
            console.error("Could not save notes to localStorage", error);
            toast({
                variant: "destructive",
                title: "Error Saving Notes",
                description: "There was a problem saving your notes.",
            });
        }
    };
    
    if (!isMounted) {
        return null; // Or a skeleton loader
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Personal Notes</CardTitle>
                <CardDescription>
                    Jot down important formulas, concepts, or reminders. Your notes are saved locally in your browser.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Start typing your notes here..."
                    rows={15}
                    className="text-base"
                />
                <Button onClick={handleSaveNotes}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Notes
                </Button>
            </CardContent>
        </Card>
    );
}
