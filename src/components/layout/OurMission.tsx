import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Goal, Rocket, Users } from "lucide-react";

export function OurMission() {
    return (
        <div className="bg-background py-12">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold font-headline text-primary tracking-tight">
                        Our Mission: Your Success
                    </h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        We are passionate about empowering the next generation of engineers. Learn more about our story and our commitment to your future.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                                <Rocket className="h-8 w-8" />
                            </div>
                            <CardTitle className="font-headline text-xl">Our Story</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            Founded by educators and technologists, we wanted to make high-quality ECET preparation accessible to all, helping students achieve their engineering dreams.
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                         <CardHeader>
                            <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                                <Goal className="h-8 w-8" />
                            </div>
                            <CardTitle className="font-headline text-xl">Our Goal</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            Our goal is to provide the best mock tests, instant AI feedback, and 24/7 doubt clarification to give you the competitive edge you need to succeed.
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                         <CardHeader>
                            <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                                <Users className="h-8 w-8" />
                            </div>
                            <CardTitle className="font-headline text-xl">Why We Build</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground">
                            We build because we believe in fair chances. We are thrilled to create a platform that levels the playing field and helps students from all backgrounds excel.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
