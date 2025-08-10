
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

const commonSubjects = {
    mathematics: { 
        subject: "Mathematics (50 marks)", 
        topics: [
            "Matrices",
            "Trigonometry",
            "Analytical Geometry",
            "Differentiation and its Application",
            "Integration and its application",
            "Differential Equation",
            "Laplace Transforms",
            "Fourier Series",
        ] 
    },
    physics: { 
        subject: "Physics (25 marks)", 
        topics: [
            "Units, Dimensions and Measurements",
            "Vectors",
            "Mechanics",
            "Properties of Matter",
            "Conservation Laws and Energy Sources",
            "Heat",
            "Simple Harmonic Motion",
            "Sound",
            "Magnetism and Electricity",
            "Optics",
            "Modern Physics",
            "Semiconductor Physics",
        ] 
    },
    chemistry: { 
        subject: "Chemistry (25 marks)", 
        topics: [
            "Fundamentals of Chemistry",
            "Solutions and Colloids",
            "Acids and Bases",
            "Environmental Science",
            "Water Technology",
            "Electrochemistry",
            "Metallurgy",
            "Corrosion",
            "Polymers",
            "Fuels and Lubricants",
            "Electrochemical Cell and Batteries",
            "Environmental Studies",
        ] 
    }
};

export const courses: Course[] = [
    {
        title: "Civil Engineering",
        slug: "civil-engineering",
        description: "Foundations of infrastructure and construction.",
        icon: Building,
        tags: ["Strength of Materials", "Hydraulics", "Surveying"],
        syllabus: [
            commonSubjects.mathematics,
            commonSubjects.physics,
            commonSubjects.chemistry,
            {
                subject: "Civil Engineering (100 marks)",
                topics: [
                    "Engineering Mechanics",
                    "Strength of Materials",
                    "Reinforced Concrete Structure",
                    "Surveying",
                    "Hydraulics",
                    "Irrigation Engineering",
                    "Transportation Engineering",
                    "Water Supply and Sanitary Engineering",
                    "Building Materials and Construction Practices",
                ]
            }
        ]
    },
    {
        title: "Computer Science",
        slug: "computer-science",
        description: "Core of software, data, and algorithms.",
        icon: Code,
        tags: ["Data Structures", "Operating Systems", "DBMS"],
        syllabus: [
            commonSubjects.mathematics,
            commonSubjects.physics,
            commonSubjects.chemistry,
            {
                subject: "Computer Science Engineering (100 marks)",
                topics: [
                    "Digital Electronics",
                    "Computer Architecture",
                    "Programming and Data Structures",
                    "Object Oriented Programming Through C++",
                    "Relational Database Management System",
                    "Computer Hardware and Networking",
                    "Operating Systems",
                    "Java Programming",
                    "Python Programming",
                    "Web Technologies",
                ]
            }
        ]
    },
    {
        title: "Electronics & Communication",
        slug: "electronics-communication",
        description: "Principles of communication and electronics.",
        icon: Radio,
        tags: ["Analog Electronics", "Digital Electronics", "Communication Systems"],
        syllabus: [
            commonSubjects.mathematics,
            commonSubjects.physics,
            commonSubjects.chemistry,
            { 
                subject: "Electronics and Communication Engineering (100 Marks)", 
                topics: [
                    "Electronic Devices and Circuits",
                    "Circuit Theory",
                    "Industrial Electronics",
                    "Communication Systems",
                    "Digital Electronics",
                    "Microcontrollers, Programming, Interfacing & Applications",
                    "Consumer Electronics",
                    "Data Communications and Computer Networks",
                ] 
            }
        ]
    },
    {
        title: "Electrical & Electronics",
        slug: "electrical-electronics",
        description: "Circuits, machines, and power systems.",
        icon: Zap,
        tags: ["Electrical Circuits", "Power Systems", "Control Systems"],
        syllabus: [
            commonSubjects.mathematics,
            commonSubjects.physics,
            commonSubjects.chemistry,
            {
                subject: "Electrical & Electronics Engineering (100 marks)",
                topics: [
                    "Basic Electrical Engineering",
                    "Electrical and Electronic Measuring Instrument",
                    "D.C Machines",
                    "A.C Circuits",
                    "A.C Machines",
                    "A.C Motors",
                    "Electrical Power Systems",
                    "Protection of Power Systems",
                    "Electrical Estimation and Utilization",
                    "Basic Electronics",
                    "Digital Electronics",
                    "Power Electronics",
                    "PLC and C Language",
                    "Electrical Vehicles",
                ]
            }
        ]
    },
    {
        title: "Mechanical Engineering",
        slug: "mechanical-engineering",
        description: "Mechanics, thermodynamics, and design.",
        icon: HardHat,
        tags: ["Thermodynamics", "Theory of Machines", "Fluid Mechanics"],
        syllabus: [
            commonSubjects.mathematics,
            commonSubjects.physics,
            commonSubjects.chemistry,
            {
                subject: "Mechanical Engineering (100 marks)",
                topics: [
                    "Basic Manufacturing Technology",
                    "Advanced Manufacturing Technology",
                    "Engineering Materials",
                    "CAD/CAM",
                    "Industrial Management",
                    "Thermodynamics",
                    "Heat Power Engineering",
                    "Refrigeration and Air Conditioning",
                    "Fluid Mechanics and Hydraulic Machinery",
                    "Solid Mechanics",
                    "Design of Machine Elements",
                ]
            }
        ]
    },
     {
        title: "Pharmacy",
        slug: "pharmacy",
        description: "Science and technique of preparing drugs.",
        icon: FlaskConical,
        tags: ["Pharmaceutics", "Pharmacology", "Chemistry"],
        syllabus: [
            { 
                subject: "Pharmaceutics", 
                topics: [
                    "Introduction to dosage forms", 
                    "Sources of drugs information", 
                    "Metrology and calculations", 
                    "Packing of pharmaceuticals", 
                    "Size reduction and separation",
                    "Mixing and homogenization",
                    "Clarification and filtration",
                    "Extraction and galenicals",
                    "Heat processes",
                    "Distillation and concentration",
                    "Sterilization",
                    "Processing of tablets and capsules",
                    "Processing of liquid orals, sterile products and powders"
                ] 
            },
            { 
                subject: "Pharmaceutical Chemistry", 
                topics: [
                    "Acids, bases and buffers",
                    "Antioxidants and preservatives",
                    "Gastrointestinal agents",
                    "Topical agents",
                    "Dental products",
                    "Inorganic pharmaceuticals",
                    "Classification of drugs",
                    "Drugs acting on central nervous system",
                    "Drugs acting on autonomic nervous system",
                    "Cardiovascular drugs",
                    "Diuretics",
                    "Hypoglycemic agents",
                    "Analgesics and anti-inflammatory agents",
                    "Antibiotics",
                    "Antiseptics and disinfectants",
                    "Vitamins and enzymes"
                ] 
            },
            { 
                subject: "Pharmacognosy", 
                topics: [
                    "Definition and scope of Pharmacognosy",
                    "Classification of crude drugs",
                    "Quality control of crude drugs",
                    "Plant products",
                    "Primary metabolites",
                    "Secondary metabolites",
                    "Herbal cosmetics",
                    "Plant tissue culture",
                    "Marine drugs",
                    "Ayurvedic system of medicine"
                ] 
            },
            { 
                subject: "Pharmacology", 
                topics: [
                    "General Pharmacology",
                    "Drugs acting on the central nervous system",
                    "Drugs acting on the peripheral nervous system",
                    "Drugs acting on the cardiovascular system",
                    "Drugs acting on the respiratory system",
                    "Drugs acting on the gastrointestinal tract",
                    "Hormones and hormone antagonists",
                    "Chemotherapy",
                    "Toxicology"
                ] 
            }
        ]
    },
     {
        title: "Chemical Engineering",
        slug: "chemical-engineering",
        description: "Chemical processes, design, and operation.",
        icon: TestTube,
        tags: ["Thermodynamics", "Fluid Mechanics", "Heat Transfer"],
        syllabus: [
            commonSubjects.mathematics,
            commonSubjects.physics,
            commonSubjects.chemistry,
            { 
                subject: "Chemical Engineering (100 marks)", 
                topics: [
                    "Fluid Mechanics and Particle Technology", 
                    "Process Heat Transfer", 
                    "Chemical Process Calculations", 
                    "Chemical Engineering Thermodynamics",
                    "Inorganic Chemical Technology",
                    "Organic Chemical Technology",
                    "Mass Transfer Operations",
                    "Instrumentation and Process Control",
                    "Chemical Reaction Engineering",
                    "Environmental Engineering and Pollution Control"
                ] 
            },
        ]
    },
    {
        title: "Metallurgical Engineering",
        slug: "metallurgical-engineering",
        description: "Science of metals and their properties.",
        icon: Pickaxe,
        tags: ["Physical Metallurgy", "Mechanical Metallurgy", "Thermodynamics"],
        syllabus: [
            commonSubjects.mathematics,
            commonSubjects.physics,
            commonSubjects.chemistry,
            { 
                subject: "Metallurgical Engineering (100 marks)", 
                topics: [
                    "Foundry Technology", 
                    "Welding Technology", 
                    "Mechanical Working of Metals",
                    "Heat Treatment Technology",
                    "Physical Metallurgy",
                    "Material Testing",
                    "Fuels, Refractories and Pyrometry",
                    "Metallurgical Thermodynamics",
                    "Iron and Steel Making",
                    "Non-ferrous Extractive Metallurgy",
                    "Corrosion and its Prevention"
                ] 
            },
        ]
    },
    {
        title: "B.Sc. (Mathematics)",
        slug: "bsc-mathematics",
        description: "Advanced mathematical concepts and theories.",
        icon: Sigma,
        tags: ["Algebra", "Calculus", "Differential Equations"],
        syllabus: [
            { 
                subject: "Mathematics", 
                topics: [
                    "Differential Equations of First Order and First Degree",
                    "Differential Equations of the First Order but not of the First Degree",
                    "Higher Order Linear Differential Equations",
                    "System of Linear Equations",
                    "Complex Numbers",
                    "Vector Differentiation",
                    "Vector Integration",
                    "The Plane",
                    "The Straight Line",
                    "The Sphere"
                ] 
            },
            { 
                subject: "Analytical Ability", 
                topics: [
                    "Data Sufficiency",
                    "Sequences and Series",
                    "Data Analysis",
                    "Coding and Decoding Problems",
                    "Date, Time & Arrangement Problems"
                ] 
            },
            { 
                subject: "Communicative English", 
                topics: [
                    "Grammar",
                    "Vocabulary",
                    "Reading Comprehension",
                    "Idioms and Phrases"
                ] 
            },
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
