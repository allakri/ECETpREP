"use client"

import Link from "next/link";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
     <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-white/60">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <span>© {currentYear} Diploma Prep Hub. All rights reserved.</span>
            </div>
        </div>
    </footer>
  )
}
