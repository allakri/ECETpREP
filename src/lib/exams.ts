import { FlaskConical, CircuitBoard, Building, Code, TestTube, Zap, HardHat, Pickaxe, Radio, Sigma } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Exam {
  name: string;
  slug: string;
  icon: LucideIcon;
  subjects: string[];
  testCount: number;
}

export const exams: Exam[] = [
    { 
      name: "Pharmacy", 
      slug: "pharmacy", 
      icon: FlaskConical,
      subjects: ["Pharmaceutics", "Pharmaceutical Chemistry", "Pharmacognosy", "Pharmacology"],
      testCount: 15,
    },
    { 
      name: "Civil Engineering", 
      slug: "civil-engineering", 
      icon: Building,
      subjects: ["Mathematics", "Physics", "Chemistry", "Strength of Materials", "Surveying"],
      testCount: 20,
    },
    { 
      name: "Computer Science", 
      slug: "computer-science", 
      icon: Code,
      subjects: ["Mathematics", "Physics", "Data Structures", "Algorithms", "Operating Systems"],
      testCount: 25,
    },
    { 
      name: "Chemical Engineering", 
      slug: "chemical-engineering", 
      icon: TestTube,
      subjects: ["Mathematics", "Physics", "Chemistry", "Thermodynamics", "Fluid Mechanics"],
      testCount: 10,
    },
    { 
      name: "Electrical & Electronics", 
      slug: "electrical-electronics", 
      icon: Zap,
      subjects: ["Mathematics", "Physics", "Electrical Circuits", "Power Systems", "Control Systems"],
      testCount: 22,
    },
    { 
      name: "Mechanical Engineering", 
      slug: "mechanical-engineering", 
      icon: HardHat,
      subjects: ["Mathematics", "Physics", "Thermodynamics", "Theory of Machines", "Fluid Mechanics"],
      testCount: 28,
    },
    { 
      name: "Metallurgical Engineering", 
      slug: "metallurgical-engineering", 
      icon: Pickaxe,
      subjects: ["Mathematics", "Physics", "Chemistry", "Physical Metallurgy", "Thermodynamics"],
      testCount: 8,
    },
    { 
      name: "Electronics & Communication", 
      slug: "electronics-communication", 
      icon: Radio,
      subjects: ["Mathematics", "Physics", "Analog Electronics", "Digital Electronics", "Communication Systems"],
      testCount: 18,
    },
    { 
      name: "B.Sc. (Mathematics)", 
      slug: "bsc-mathematics", 
      icon: Sigma,
      subjects: ["Algebra", "Calculus", "Differential Equations", "Linear Algebra", "Real Analysis"],
      testCount: 14,
    },
];
