"use client";

const steps = [
  {
    number: "1",
    title: "Register",
    description: "Create your account to get started.",
  },
  {
    number: "2",
    title: "Pick Exam",
    description: "Choose your ECET branch and start a mock test.",
  },
  {
    number: "3",
    title: "Get Feedback",
    description: "Receive instant AI-powered analysis.",
  },
  {
    number: "4",
    title: "Succeed",
    description: "Achieve your dream of an engineering degree.",
  },
];

export function HowItWorks() {
    return (
       <section className="py-20 lg:py-28 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">How The Platform Works</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Get started on your path to success in just a few simple steps.</p>
                </div>
                <div className="relative mt-16">
                    <div className="absolute left-1/2 top-8 w-0.5 h-[calc(100%-4rem)] bg-border hidden md:block"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {steps.map((step) => (
                             <div key={step.number} className="flex flex-col items-center text-center gap-4 bg-background p-4">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold border-4 border-card">
                                    {step.number}
                                </div>
                                <h3 className="text-xl font-bold text-foreground mt-2">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
