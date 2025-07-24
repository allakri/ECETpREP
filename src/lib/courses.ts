
import { 
    FlaskConical, CircuitBoard, Building, Code, TestTube, Zap, HardHat, Pickaxe, Radio, Sigma, University, LucideIcon 
} from "lucide-react";

interface SyllabusItem {
  subject: string;
  topics: string[];
}

export interface Course {
  title: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
  syllabus: SyllabusItem[];
}

export const courses: Course[] = [
    {
        title: "Civil Engineering",
        slug: "civil-engineering",
        description: "Foundations of infrastructure and construction.",
        icon: Building,
        tags: ["Strength of Materials", "Hydraulics", "Surveying"],
        syllabus: [
            { subject: "Strength of Materials", topics: ["Simple Stresses & Strains", "Bending Moments", "Shear Forces"] },
            { subject: "Theory of Structures", topics: ["Frames", "Trusses", "Arches"] },
            { subject: "Concrete Technology", topics: ["Cement", "Aggregates", "Mix Design"] },
            { subject: "Hydraulics", topics: ["Fluid Properties", "Flow Measurement", "Pipe Flow"] },
            { subject: "Surveying", topics: ["Chain Surveying", "Compass Surveying", "Levelling"] }
        ]
    },
    {
        title: "Computer Science",
        slug: "computer-science",
        description: "Core of software, data, and algorithms.",
        icon: Code,
        tags: ["Data Structures", "Operating Systems", "DBMS"],
        syllabus: [
            { subject: "Digital Electronics", topics: ["Logic Gates", "Boolean Algebra", "Combinational Circuits"] },
            { subject: "Data Structures", topics: ["Arrays", "Stacks", "Queues", "Linked Lists", "Trees"] },
            { subject: "Operating Systems", topics: ["Process Management", "Memory Management", "File Systems"] },
            { subject: "DBMS", topics: ["ER Model", "SQL", "Normalization"] },
            { subject: "C/C++ Programming", topics: ["Pointers", "OOPs Concepts", "File Handling"] }
        ]
    },
    {
        title: "Electronics & Communication",
        slug: "electronics-communication",
        description: "Principles of communication and electronics.",
        icon: Radio,
        tags: ["Analog Electronics", "Digital Electronics", "Communication Systems"],
        syllabus: [
            { subject: "Electronic Devices & Circuits", topics: ["Diodes", "Transistors", "Amplifiers"] },
            { subject: "Communication Systems", topics: ["AM, FM, PM", "Digital Modulation", "Antennas"] },
            { subject: "Digital Electronics", topics: ["Logic Families", "Sequential Circuits", "ADCs/DACs"] },
            { subject: "Microcontrollers", topics: ["8051 Architecture", "Assembly Language", "Interfacing"] }
        ]
    },
    {
        title: "Electrical & Electronics",
        slug: "electrical-electronics",
        description: "Circuits, machines, and power systems.",
        icon: Zap,
        tags: ["Electrical Circuits", "Power Systems", "Control Systems"],
        syllabus: [
            { subject: "Electric Circuits & Machines", topics: ["DC/AC Circuits", "Transformers", "DC & AC Motors"] },
            { subject: "Electrical Measurements", topics: ["Bridges", "Potentiometers", "Measuring Instruments"] },
            { subject: "Power Systems", topics: ["Generation", "Transmission", "Distribution"] },
            { subject: "Power Electronics", topics: ["Thyristors", "Inverters", "Choppers"] }
        ]
    },
    {
        title: "Mechanical Engineering",
        slug: "mechanical-engineering",
        description: "Mechanics, thermodynamics, and design.",
        icon: HardHat,
        tags: ["Thermodynamics", "Theory of Machines", "Fluid Mechanics"],
        syllabus: [
            { subject: "Engineering Mechanics", topics: ["Statics", "Dynamics", "Friction"] },
            { subject: "Thermodynamics", topics: ["Laws of Thermodynamics", "Power Cycles", "Heat Transfer"] },
            { subject: "Fluid Mechanics", topics: ["Fluid Statics", "Fluid Dynamics", "Hydraulic Machines"] },
            { subject: "Manufacturing Technology", topics: ["Casting", "Welding", "Machining"] }
        ]
    },
    {
        title: "Electronics & Instrumentation",
        slug: "electronics-instrumentation",
        description: "Measurement, control, and automation.",
        icon: CircuitBoard,
        tags: ["Instrumentation", "Control Systems", "Digital Electronics"],
        syllabus: [
            { subject: "Electronic Measurements", topics: ["CRO", "Signal Generators", "Transducers"] },
            { subject: "Control Systems", topics: ["Open/Closed Loop", "Time/Frequency Response", "Stability"] },
            { subject: "Industrial Instrumentation", topics: ["Temperature, Pressure, Flow Measurement", "PLCs"] },
            { subject: "Biomedical Instrumentation", topics: ["ECG", "EEG", "Medical Imaging Systems"] }
        ]
    },
     {
        title: "Pharmacy",
        slug: "pharmacy",
        description: "Science and technique of preparing drugs.",
        icon: FlaskConical,
        tags: ["Pharmaceutics", "Pharmacology", "Chemistry"],
        syllabus: [
            { subject: "Pharmaceutics", topics: ["Dosage Forms", "Drug Delivery Systems", "Manufacturing Processes"] },
            { subject: "Pharmaceutical Chemistry", topics: ["Organic Chemistry", "Medicinal Chemistry", "Inorganic Chemistry"] },
            { subject: "Pharmacognosy", topics: ["Crude Drugs", "Plant Alkaloids", "Herbal Formulations"] },
            { subject: "Pharmacology", topics: ["Drug Mechanisms", "Toxicology", "Chemotherapy"] }
        ]
    },
     {
        title: "Chemical Engineering",
        slug: "chemical-engineering",
        description: "Chemical processes, design, and operation.",
        icon: TestTube,
        tags: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer"],
        syllabus: [
            { subject: "Thermodynamics", topics: ["First & Second Law", "Phase Equilibria", "Reaction Equilibria"] },
            { subject: "Fluid Mechanics", topics: ["Flow of Fluids", "Transportation of Fluids", "Flow Measurement"] },
            { subject: "Heat Transfer", topics: ["Conduction", "Convection", "Radiation", "Heat Exchangers"] },
            { subject: "Mass Transfer", topics: ["Distillation", "Absorption", "Extraction"] }
        ]
    },
    {
        title: "Metallurgical Engineering",
        slug: "metallurgical-engineering",
        description: "Science of metals and their properties.",
        icon: Pickaxe,
        tags: ["Physical Metallurgy", "Mechanical Metallurgy", "Thermodynamics"],
        syllabus: [
            { subject: "Physical Metallurgy", topics: ["Crystal Structure", "Phase Diagrams", "Solidification"] },
            { subject: "Mechanical Metallurgy", topics: ["Mechanical Testing", "Deformation", "Fracture"] },
            { subject: "Extractive Metallurgy", topics: ["Iron Making", "Steel Making", "Non-Ferrous Extraction"] },
            { subject: "Material Testing", topics: ["Destructive & Non-Destructive Testing", "Microscopy"] }
        ]
    },
    {
        title: "B.Sc. (Mathematics)",
        slug: "bsc-mathematics",
        description: "Advanced mathematical concepts and theories.",
        icon: Sigma,
        tags: ["Algebra", "Calculus", "Differential Equations"],
        syllabus: [
            { subject: "Matrices", topics: ["Types of Matrices", "Determinants", "Eigenvalues & Eigenvectors"] },
            { subject: "Trigonometry", topics: ["Trigonometric Ratios", "Complex Numbers", "De Moivre's Theorem"] },
            { subject: "Analytical Geometry", topics: ["Straight Lines", "Circles", "Conic Sections"] },
            { subject: "Differential Equations", topics: ["First Order DEs", "Linear DEs", "Higher Order DEs"] },
            { subject: "Integration", topics: ["Indefinite & Definite Integrals", "Applications of Integration"] }
        ]
    },
     {
        title: "Government Exams",
        slug: "government-exams",
        description: "Preparation for public sector jobs.",
        icon: University,
        tags: ["General Studies", "Aptitude", "Reasoning"],
        syllabus: [
            { subject: "Technical Subjects", topics: ["Varies based on specific diploma (Civil, Mech, Elec, etc.)", "Core concepts from diploma curriculum"] },
            { subject: "General Studies", topics: ["General Knowledge", "Current Affairs", "Indian History & Polity"] },
            { subject: "Quantitative Aptitude", topics: ["Number System", "Percentage", "Profit & Loss", "Time & Work"] },
            { subject: "Logical Reasoning", topics: ["Series", "Analogy", "Coding-Decoding", "Blood Relations"] },
            { subject: "General English", topics: ["Comprehension", "Grammar", "Vocabulary"] }
        ]
    },
];
