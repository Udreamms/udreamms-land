import Link from "next/link";
import { ChevronDown } from "lucide-react";

export function Header() {
  return (
    <header className="bg-black text-white p-4 px-8 flex justify-between items-center w-full">
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-xl font-bold">Royalty AI</Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-300">
          <Link href="#" className="hover:text-white flex items-center">
            Products <ChevronDown className="h-4 w-4 ml-1" />
          </Link>
          <Link href="#" className="hover:text-white">Build</Link>
          <Link href="#" className="hover:text-white">Research</Link>
          <Link href="#" className="hover:text-white">Responsibility</Link>
          <Link href="#" className="hover:text-white">Societal Impact</Link>
          <Link href="#" className="hover:text-white">About</Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-sm hover:text-white">Log in</Link>
        <Link href="/subscription" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm">Sign up</Link>
      </div>
    </header>
  );
}
