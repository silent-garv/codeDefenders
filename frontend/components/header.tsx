import type React from "react"
import Link from "next/link"
import { Profile } from "@/components/auth/profile"

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          My App
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        {/* Replace the user avatar div with: */}
        <Profile />
      </div>
    </header>
  )
}

export default Header
