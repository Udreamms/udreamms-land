"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Plus, Search, Globe, Mic, ArrowUp, Loader2 } from "lucide-react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { firebaseApp } from "../../firebaseapp"; // Ensure this path is correct

const communityProjects = [
    { name: 'AI Spark Toolkit Guide', remixes: 11, category: 'Website' },
    { name: 'Trade Tune Journal', remixes: 22, category: 'Website' },
    { name: 'M&A Gateway', remixes: 12, category: 'Website' },
];

const filterCategories = ['Featured', 'Discover', 'Internal Tools', 'Website', 'Personal', 'Consumer App', 'B2B App', 'Prototype'];

export default function WebDesignContent() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [activeFilter, setActiveFilter] = useState('Featured');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filteredCommunityProjects, setFilteredCommunityProjects] = useState(communityProjects);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateProjectAndNavigate = async (projectName: string) => {
    if (!currentUser) {
      alert("Please log in to create a project.");
      router.push('/login');
      return;
    }
    
    setIsCreatingProject(true);

    try {
      const response = await fetch('/api/genkit/createProjectFlow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: {
            projectName: projectName,
            ownerId: currentUser.uid
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create project.');
      }

      const data = await response.json();
      const { projectId } = data.result;
      
      router.push(`/cto/web-design/editor/${projectId}`);

    } catch (error) {
      console.error("Error creating project:", error);
      alert("There was an error creating your project. Please try again.");
      setIsCreatingProject(false);
    }
  };

  return (
    <main className="w-full p-8 bg-black text-white flex-1">
        <div className="w-full max-w-7xl mx-auto">
            {/* --- Header and Prompt Input --- */}
            <div className="text-center mt-20 mb-12">
              <h1 className="text-5xl font-bold mb-2">Build with <span className="text-purple-400">Royalty</span></h1>
              <p className="text-lg text-gray-400">Create apps and websites by chatting with AI</p>
            </div>
            {/* ... (rest of the prompt UI is the same) ... */}

            <div className="w-full max-w-7xl mx-auto mt-16">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">From the Community</h2>
                </div>
                <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-4">
                    {filterCategories.map(category => (
                        <Button key={category} variant={activeFilter === category ? "secondary" : "ghost"} onClick={() => setActiveFilter(category)} className="whitespace-nowrap rounded-full px-4">
                            {category}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredCommunityProjects.map((project) => (
                      <div 
                        key={project.name}
                        className="bg-neutral-900 text-white rounded-lg overflow-hidden group border border-neutral-800 cursor-pointer"
                        onClick={() => handleCreateProjectAndNavigate(project.name)}
                      >
                          <div className="relative h-48 w-full bg-neutral-800 flex items-center justify-center">
                            {isCreatingProject && <Loader2 className="h-8 w-8 animate-spin text-purple-400"/>}
                          </div>
                          <div className="p-4">
                              <p className="font-semibold text-sm truncate group-hover:underline">{project.name}</p>
                              <p className="text-xs text-gray-400">{project.remixes} Remixes</p>
                          </div>
                      </div>
                    ))}
                </div>
            </div>
        </div>
      </main>
  );
}
