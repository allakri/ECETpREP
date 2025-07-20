import { FlaskConical, CircuitBoard, Building, Code, TestTube, Zap, HardHat, Pickaxe, Radio, Sigma } from "lucide-react";
import * as React from "react";

export const exams = [
    { name: "Pharmacy", slug: "pharmacy", icon: <FlaskConical className="h-6 w-6 text-primary/80"/> },
    { name: "Electronics & Instrumentation", slug: "electronics-instrumentation", icon: <CircuitBoard className="h-6 w-6 text-primary/80"/> },
    { name: "Civil Engineering", slug: "civil-engineering", icon: <Building className="h-6 w-6 text-primary/80"/> },
    { name: "Computer Science", slug: "computer-science", icon: <Code className="h-6 w-6 text-primary/80"/> },
    { name: "Chemical Engineering", slug: "chemical-engineering", icon: <TestTube className="h-6 w-6 text-primary/80"/> },
    { name: "Electrical & Electronics", slug: "electrical-electronics", icon: <Zap className="h-6 w-6 text-primary/80"/> },
    { name: "Mechanical Engineering", slug: "mechanical-engineering", icon: <HardHat className="h-6 w-6 text-primary/80"/> },
    { name: "Metallurgical Engineering", slug: "metallurgical-engineering", icon: <Pickaxe className="h-6 w-6 text-primary/80"/> },
    { name: "Electronics & Communication", slug: "electronics-communication", icon: <Radio className="h-6 w-6 text-primary/80"/> },
    { name: "B.Sc. (Mathematics)", slug: "bsc-mathematics", icon: <Sigma className="h-6 w-6 text-primary/80"/> },
];
