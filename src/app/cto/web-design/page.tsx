'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, ArrowUp, Link as LinkIcon, Users, ArrowRight } from 'lucide-react';
import { getFirestore, collection, addDoc, query, onSnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseApp } from '../../../../firebaseapp';

interface Project {
  id: string;
  name: string;
  createdAt: Timestamp;
  imageUrl?: string; 
}

// Mock data for project images, since we don't have real thumbnails yet
const placeholderImages = [
  '/placeholder-1.png',
  '/placeholder-2.png',
  '/placeholder-3.png',
  '/placeholder-4.png',
  '/placeholder-5.png',
  '/placeholder-6.png',
];

export default function WebDesignPage() {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectPrompt, setNewProjectPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userProjects: Project[] = [];
        let imageIndex = 0;
        querySnapshot.forEach((doc) => {
          userProjects.push({ 
            id: doc.id, 
            imageUrl: placeholderImages[imageIndex % placeholderImages.length],
            ...doc.data() 
          } as Project);
          imageIndex++;
        });
        setProjects(userProjects);
      });
      return () => unsubscribe();
    }
  }, [user, db]);

  const handleCreateProject = async () => {
    if (!newProjectPrompt.trim() || !user) return;
  
    setIsLoading(true);
    try {
      const projectName = newProjectPrompt.split(' ').slice(0, 5).join(' ') + '...';
  
      const projectDocRef = await addDoc(collection(db, 'projects'), {
        name: projectName,
        userId: user.uid,
        createdAt: Timestamp.now(),
      });
  
      await addDoc(collection(db, 'projects', projectDocRef.id, 'chat_history'), {
        sender: 'user',
        text: newProjectPrompt,
        timestamp: Timestamp.now(),
        userId: user.uid,
      });
  
      setNewProjectPrompt('');
      router.push(`/cto/web-design/editor/${projectDocRef.id}`);
  
    } catch (error) {
      console.error("Error creating project: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const timeAgo = (date: any) => {
    if (!date) {
      return 'date unknown';
    }
  
    // Convert Firestore Timestamp to JavaScript Date
    const jsDate = date.toDate ? date.toDate() : date;
  
    // Check if it's a valid Date object
    if (!(jsDate instanceof Date) || isNaN(jsDate.getTime())) {
      return 'invalid date';
    }
  
    const seconds = Math.floor((new Date().getTime() - jsDate.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };


  return (
    <div className="w-full bg-black text-white min-h-screen p-8">
      <header className="text-center pt-12 pb-16">
        <h1 className="text-5xl font-bold mb-4">Build something <span className="text-pink-500">Lovable</span></h1>
        <p className="text-gray-400 text-lg">Create apps and websites by chatting with AI</p>
        <div className="max-w-2xl mx-auto mt-8">
          <div className="relative bg-gray-900 border border-gray-700 rounded-lg p-2">
            <Input
              placeholder="Ask Lovable to create a personal website..."
              className="bg-transparent w-full border-none focus:ring-0 pl-10 pr-20 text-lg"
              value={newProjectPrompt}
              onChange={(e) => setNewProjectPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="bg-gray-700 p-1 rounded-md hover:bg-gray-600"><Plus size={16}/></button>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <Button onClick={handleCreateProject} disabled={isLoading} size="icon" className="bg-white text-black rounded-full w-8 h-8">
                    <ArrowUp size={18}/>
                 </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-10">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Lovable</h2>
            <a href="#" className="text-sm flex items-center gap-1 text-gray-400 hover:text-white">
              View all <ArrowRight size={16}/>
            </a>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input placeholder="Search projects..." className="bg-gray-800 border-gray-700 rounded-lg pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                <SelectValue placeholder="Last edited" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="last-edited">Last edited</SelectItem>
                <SelectItem value="created-date">Created date</SelectItem>
              </SelectContent>
            </Select>
             <Select>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                <SelectValue placeholder="All creators" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="all">All creators</SelectItem>
                <SelectItem value="me">By me</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {projects.map((project) => (
              <div key={project.id} onClick={() => router.push(`/cto/web-design/editor/${project.id}`)} className="cursor-pointer group">
                <Card className="bg-gray-800 border-gray-700 rounded-lg overflow-hidden h-full flex flex-col">
                   <div className="w-full aspect-video bg-gray-700 overflow-hidden">
                     {project.imageUrl && <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>}
                   </div>
                  <CardContent className="p-4 flex-grow flex flex-col justify-between">
                     <div>
                        <h3 className="font-bold text-lg">{project.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">Edited {timeAgo(project.createdAt)}</p>
                      </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
            {projects.length === 0 && !isLoading && (
                 <div className="text-center py-16 text-gray-500">
                    <p>No projects yet. Create your first one above!</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
