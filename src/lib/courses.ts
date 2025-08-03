
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
            { 
                subject: "MATHEMATICS (50 Marks)", 
                topics: [
                    "MATRICES: Matrix types, algebra, determinants, system of linear equations.",
                    "TRIGONOMETRY: Compound angles, transformations, properties of triangles, inverse trigonometric functions, complex numbers.",
                    "ANALYTICAL GEOMETRY: Straight lines, circles, conic sections (parabola, ellipse, hyperbola).",
                    "DIFFERENTIATION AND ITS APPLICATIONS: Functions, limits, standard differentiation techniques, applications in geometry and physics.",
                    "INTEGRATION AND ITS APPLICATIONS: Indefinite and definite integrals, applications to find areas and volumes.",
                    "DIFFERENTIAL EQUATIONS: First order and second order linear differential equations with constant coefficients.",
                    "LAPLACE TRANSFORMS: LT of elementary functions, properties, inverse Laplace transforms, and applications.",
                    "FOURIER SERIES: Euler’s formulae, series for even and odd functions, half-range series."
                ] 
    },
            { 
                subject: "PHYSICS (25 Marks)", 
                topics: [
                    "UNITS, DIMENSIONS AND MEASUREMENTS: Physical quantities, S.I. units, dimensional analysis.",
                    "VECTORS: Scalar and vector products, Lami's theorem, parallelogram law.",
                    "MECHANICS: Friction, projectile motion, circular motion.",
                    "PROPERTIES OF MATTER: Elasticity, surface tension, viscosity, Bernoulli’s theorem.",
                    "CONSERVATION LAWS AND ENERGY SOURCES: Work, power, energy, conservation of energy.",
                    "HEAT: Thermal expansion, gas laws, thermodynamics.",
                    "SIMPLE HARMONIC MOTION: SHM conditions, expressions, simple pendulum.",
                    "SOUND: Stationary waves, beats, Doppler effect, acoustics.",
                    "MAGNETISM AND ELECTRICITY: Coulomb’s law, Kirchhoff’s laws, transformers, magnetic materials.",
                    "OPTICS: Reflection, refraction, interference, photoelectric effect.",
                    "MODERN PHYSICS: LASER, optical fibers, nanotechnology, superconductivity.",
                    "SEMICONDUCTOR PHYSICS: Energy bands, P-type and N-type semiconductors, PN junction diode."
                ] 
            },
            { 
                subject: "CHEMISTRY (25 Marks)", 
                topics: [
                    "FUNDAMENTALS OF CHEMISTRY: Atomic structure, chemical bonding, oxidation-reduction.",
                    "SOLUTIONS AND COLLOIDS: Molarity, normality, colloids and their properties.",
                    "ACIDS AND BASES: Theories, pH, buffer solutions.",
                    "ENVIRONMENTAL SCIENCE: Ecosystems, biodiversity, pollution.",
                    "WATER TECHNOLOGY: Hardness of water, softening methods, municipal water treatment.",
                    "ELECTROCHEMISTRY: Electrolysis, Faraday's laws.",
                    "METALLURGY: Extraction of metals, alloys.",
                    "CORROSION: Theories and prevention.",
                    "POLYMERS: Polymerization, plastics, rubbers, fibers.",
                    "FUELS AND LUBRICANTS: Classification, calorific value, gaseous fuels.",
                    "ELECTROCHEMICAL CELL AND BATTERIES: Galvanic cell, batteries, fuel cells.",
                    "ENVIRONMENTAL STUDIES: Air, water, and soil pollution."
                ] 
            },
            { 
                subject: "ELECTRONICS AND COMMUNICATION ENGINEERING (100 Marks)", 
                topics: [
                    "ELECTRONIC DEVICES AND CIRCUITS: Diodes, transistors, amplifiers, oscillators, operational amplifiers.",
                    "CIRCUIT THEORY: KCL, KVL, network theorems, resonance, transmission lines.",
                    "INDUSTRIAL ELECTRONICS: Thyristors, UPS, SMPS, transducers, PLCs, SCADA.",
                    "COMMUNICATION SYSTEMS: Analog and digital modulation, transmitters, receivers, multiplexing.",
                    "DIGITAL ELECTRONICS: Number systems, logic gates, combinational and sequential circuits, memories.",
                    "MICROCONTROLLERS, PROGRAMMING, INTERFACING & APPLICATIONS: 8051 architecture, instruction set, interfacing.",
                    "CONSUMER ELECTRONICS: Television systems (Color, DTH, HDTV), scanning and synchronization.",
                    "DATA COMMUNICATIONS AND COMPUTER NETWORKS: OSI model, network topologies, TCP/IP, security."
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
