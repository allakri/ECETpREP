import { FlaskConical, CircuitBoard, Building, Code, TestTube, Zap, HardHat, Pickaxe, Radio, Sigma } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Exam {
  name: string;
  slug: string;
  icon: LucideIcon;
  subjects: string[];
}

export const exams: Exam[] = [
    { 
      name: "Pharmacy", 
      slug: "pharmacy", 
      icon: FlaskConical,
      subjects: ["Pharmaceutics", "Pharmaceutical Chemistry", "Pharmacognosy", "Pharmacology"]
    },
    { 
      name: "Electronics & Instrumentation", 
      slug: "electronics-instrumentation", 
      icon: CircuitBoard,
      subjects: ["Mathematics", "Physics", "Chemistry", "Instrumentation", "Digital Electronics"]
    },
    { 
      name: "Civil Engineering", 
      slug: "civil-engineering", 
      icon: Building,
      subjects: ["Mathematics", "Physics", "Chemistry", "Strength of Materials", "Surveying"]
    },
    { 
      name: "Computer Science", 
      slug: "computer-science", 
      icon: Code,
      subjects: ["Mathematics", "Physics", "Data Structures", "Algorithms", "Operating Systems"]
    },
    { 
      name: "Chemical Engineering", 
      slug: "chemical-engineering", 
      icon: TestTube,
      subjects: ["Mathematics", "Physics", "Chemistry", "Thermodynamics", "Fluid Mechanics"]
    },
    { 
      name: "Electrical & Electronics", 
      slug: "electrical-electronics", 
      icon: Zap,
      subjects: ["Mathematics", "Physics", "Electrical Circuits", "Power Systems", "Control Systems"]
    },
    { 
      name: "Mechanical Engineering", 
      slug: "mechanical-engineering", 
      icon: HardHat,
      subjects: ["Mathematics", "Physics", "Thermodynamics", "Theory of Machines", "Fluid Mechanics"]
    },
    { 
      name: "Metallurgical Engineering", 
      slug: "metallurgical-engineering", 
      icon: Pickaxe,
      subjects: ["Mathematics", "Physics", "Chemistry", "Physical Metallurgy", "Thermodynamics"]
    },
    { 
      name: "Electronics & Communication", 
      slug: "electronics-communication", 
      icon: Radio,
      subjects: ["Mathematics", "Physics", "Analog Electronics", "Digital Electronics", "Communication Systems"]
    },
    { 
      name: "B.Sc. (Mathematics)", 
      slug: "bsc-mathematics", 
      icon: Sigma,
      subjects: ["Algebra", "Calculus", "Differential Equations", "Linear Algebra", "Real Analysis"]
    },
];