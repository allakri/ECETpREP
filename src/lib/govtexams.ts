
import { HardHat, University, Shield, Building, LucideIcon } from "lucide-react";

export interface GovtExam {
    name: string;
    organization: string;
    mockTestsAvailable: number;
    duration: string;
    idealFor: string[];
}

export interface ExamCategory {
    title: string;
    icon: LucideIcon;
    exams: GovtExam[];
}

export const govtExams: ExamCategory[] = [
    {
        title: "Technical Government Exams",
        icon: HardHat,
        exams: [
            {
                name: "RRB JE",
                organization: "Railway Recruitment Board",
                mockTestsAvailable: 50,
                duration: "2 hours",
                idealFor: ["Civil", "Mech", "Elec"]
            },
            {
                name: "SSC JE",
                organization: "Staff Selection Commission",
                mockTestsAvailable: 45,
                duration: "2 hours",
                idealFor: ["Civil", "Mech", "Elec"]
            },
            {
                name: "ISRO Technician",
                organization: "Indian Space Research Organisation",
                mockTestsAvailable: 30,
                duration: "1.5 hours",
                idealFor: ["ECE", "Mech", "CS"]
            },
            {
                name: "DRDO CEPTAM",
                organization: "Defence Research and Development Organisation",
                mockTestsAvailable: 25,
                duration: "2 hours",
                idealFor: ["All Branches"]
            },
        ]
    },
    {
        title: "Non-Technical Govt Exams",
        icon: University,
        exams: [
            {
                name: "SSC CHSL",
                organization: "Staff Selection Commission",
                mockTestsAvailable: 100,
                duration: "1 hour",
                idealFor: ["All Branches"]
            },
            {
                name: "AP/TS Police Constable",
                organization: "State Level Police Recruitment Board",
                mockTestsAvailable: 60,
                duration: "3 hours",
                idealFor: ["All Branches"]
            }
        ]
    },
    {
        title: "Public Sector Exams (PSUs)",
        icon: Building,
        exams: [
            {
                name: "APTRANSCO AE",
                organization: "Transmission Corporation of Andhra Pradesh",
                mockTestsAvailable: 20,
                duration: "2 hours",
                idealFor: ["Elec"]
            },
            {
                name: "NTPC Diploma Trainee",
                organization: "National Thermal Power Corporation",
                mockTestsAvailable: 35,
                duration: "2 hours",
                idealFor: ["Mech", "Elec", "C&I"]
            }
        ]
    }
];

