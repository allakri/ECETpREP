"use client"

import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="flex space-x-4 mb-2 md:mb-0">
          <Link href="#" className="hover:text-white">Privacy Policy</Link>
          <Link href="#" className="hover:text-white">Terms & Conditions</Link>
          <Link href="#" className="hover:text-white">Disclaimer</Link>
          <Link href="#" className="hover:text-white">Refund & Cancellation Policy</Link>
        </div>
        <div className="text-center md:text-right">
          <p>No. of Visitors: 1077492</p>
          <p>No. of Mock Test Visitors: 38144</p>
        </div>
      </div>
    </footer>
  )
}
