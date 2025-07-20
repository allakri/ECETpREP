import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Bot, FileText, UserPlus } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "1. Register & Login",
    description: "Create your account in seconds to get access to a personalized dashboard and track your progress.",
  },
  {
    icon: FileText,
    title: "2. Select an Exam",
    description: "Choose from a wide range of mock tests for your branch, including previous years' papers and custom tests.",
  },
  {
    icon: Bot,
    title: "3. Get AI Feedback",
    description: "After each test, receive instant, AI-powered feedback identifying your weak areas and suggesting improvements.",
  },
  {
    icon: Award,
    title: "4. Achieve Your Goal",
    description: "Use the insights to focus your studies, clear doubts with our AI tutor, and build the confidence to succeed.",
  },
];

export function HowItWorks() {
    return (
        <div className="bg-background py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold font-headline text-primary tracking-tight">
                        A Clear Path to Success
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Our platform is designed to be simple and effective. Here’s how you can get started on your journey to acing the ECET.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <Card key={index} className="text-center border-none shadow-none bg-transparent">
                            <CardHeader>
                                <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="text-muted-foreground">
                                {step.description}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
