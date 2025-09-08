"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Megaphone } from "lucide-react";

export function JoinCommunity() {
    return (
        <section className="py-20 lg:py-28">
            <div className="container mx-auto px-4">
                <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
                     <div className="max-w-2xl mx-auto">
                         <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-headline">Join Our Community</h2>
                         <p className="mt-4 text-lg text-white/60">
                             Connect with fellow students, get your doubts cleared by peers and mentors, and stay updated with the latest exam news on our official Telegram channel.
                         </p>
                         <div className="mt-8">
                             <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                                 <Link href="https://t.me/diplomaprephub" target="_blank" rel="noopener noreferrer">
                                     <Megaphone className="mr-2 h-5 w-5" /> Join on Telegram
                                 </Link>
                             </Button>
                         </div>
                     </div>
                </div>
            </div>
        </section>
    );
}
