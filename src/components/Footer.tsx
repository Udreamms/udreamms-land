import Link from "next/link";
import { Twitter, Youtube, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-gray-400 pt-16 pb-8 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl text-white font-semibold">Making AI helpful for everyone</h3>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-white"><Twitter /></Link>
            <Link href="#" className="hover:text-white"><Youtube /></Link>
            <Link href="#" className="hover:text-white"><Facebook /></Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8 text-sm">
          <div>
            <h4 className="font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white">Discover AI</Link></li>
              <li><Link href="#" className="hover:text-white">For business</Link></li>
              <li><Link href="#" className="hover:text-white">For education</Link></li>
              <li><Link href="#" className="hover:text-white">For developers</Link></li>
              <li><Link href="#" className="hover:text-white">Explore products</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Build</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white">Get started building</Link></li>
              <li><Link href="#" className="hover:text-white">Code with AI assistance</Link></li>
              <li><Link href="#" className="hover:text-white">Leverage frameworks</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Research</h4>
            <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white">Tackling the most challenging problems</Link></li>
                <li><Link href="#" className="hover:text-white">Health</Link></li>
                <li><Link href="#" className="hover:text-white">Science</Link></li>
                <li><Link href="#" className="hover:text-white">Sustainability</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Responsibility</h4>
            <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white">Responsible AI</Link></li>
                <li><Link href="#" className="hover:text-white">Safety</Link></li>
                <li><Link href="#" className="hover:text-white">Policy</Link></li>
                <li><Link href="#" className="hover:text-white">For organizations</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">About</h4>
            <ul className="space-y-3">
                <li><Link href="#" className="hover:text-white">Our AI Journey</Link></li>
                <li><Link href="#" className="hover:text-white">AI Principles</Link></li>
                <li><Link href="#" className="hover:text-white">For organizations</Link></li>
                <li><Link href="#" className="hover:text-white">Learn AI Skills</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex justify-between items-center text-xs">
          <p>&copy; Google</p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-white">About Google</Link>
            <Link href="#" className="hover:text-white">Google Products</Link>
            <Link href="#" className="hover:text-white">Privacy</Link>
            <Link href="#" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
