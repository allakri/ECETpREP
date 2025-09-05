"use client";

import { Users, FileText, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CountUp = ({ end }: { end: number }) => {
    const [count, setCount] = useState(0);
    const duration = 2000;

    useEffect(() => {
        let start = 0;
        const startTimestamp = performance.now();
        
        const step = (timestamp: number) => {
            const progress = timestamp - startTimestamp;
            const percentage = Math.min(progress / duration, 1);
            setCount(Math.floor(percentage * (end - start) + start));
            if (progress < duration) {
                requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(step);
    }, [end]);

    return <span>{count.toLocaleString()}</span>;
};

const stats = [
    {
        icon: Users,
        value: 107000,
        label: "Visitors",
    },
    {
        icon: FileText,
        value: 38000,
        label: "Tests Taken",
    },
    {
        icon: HelpCircle,
        value: 450000,
        label: "Questions Solved",
    }
]

export function Stats() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return(
        <div className="bg-secondary/20 py-12 sm:py-16">
            <div className="container mx-auto px-4">
                 <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ staggerChildren: 0.2 }}
                >
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div 
                                key={index} 
                                className="flex flex-col items-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Icon className="h-10 w-10 text-primary mb-3" />
                                <p className="text-4xl font-bold font-headline text-primary">
                                    {isMounted ? <CountUp end={stat.value} /> : '0'}+
                                </p>
                                <p className="text-lg text-muted-foreground">{stat.label}</p>
                            </motion.div>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    )
}
