"use client"

import Link from "next/link";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
     <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-white/60">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <span>© {currentYear} Diploma Prep Hub. All rights reserved.</span>
                <span className="hidden md:inline">|</span>
                <a className="hover:text-white transition-colors" href="mailto:support@diplomaprephub.com">support@diplomaprephub.com</a>
                 <span className="hidden md:inline">|</span>
                <a className="hover:text-white transition-colors" href="tel:+911234567890">+91 12345 67890</a>
            </div>
        </div>
    </footer>
  )
}
