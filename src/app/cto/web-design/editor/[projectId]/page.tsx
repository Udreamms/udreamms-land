'use client';

import { httpsCallable } from 'firebase/functions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Code, PanelRight, Heart, ArrowUp, Loader2, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useState, useRef, useEffect, KeyboardEvent, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFirestore, doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { firebaseApp } from '../../../../../../firebaseapp.js';
import { getFunctions } from 'firebase/functions';

// --- Firebase Instances ---
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const functions = getFunctions(firebaseApp);

// --- Callable Cloud Function ---
const projectAgent = httpsCallable(functions, 'projectAgent');

// --- TYPES ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ProjectFile {
    name: string;
    content: string;
}

interface ProjectData {
    name: string;
    messages: Message[];
    files: ProjectFile[];
}

// --- EDITOR PAGE COMPONENT ---
export default function FusedEditorPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  // --- STATE ---
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // --- Instant Preview Logic ---
  const updateIframeContent = useCallback((files: ProjectFile[]) => {
    if (iframeRef.current) {
      const indexHtmlFile = files.find(f => f.name === 'index.html');
      const htmlContent = indexHtmlFile ? indexHtmlFile.content : '<p>No index.html file found.</p>';
      
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  }, []);
  
  // --- EFFECTS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!projectId || !currentUser) return;

    const unsubProject = onSnapshot(doc(db, 'projects', projectId), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as ProjectData;
        setProjectData(data);
        if (data.files) {
            updateIframeContent(data.files);
        }
      } else {
        setProjectData(null); // Handle project not found
      }
    });

    return () => unsubProject();
  }, [projectId, currentUser, updateIframeContent]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  }, [projectData?.messages]);

  // --- CORE: Send Message ---
  const handleSendMessage = async () => {
    const userMessageContent = chatInput.trim();
    if (!userMessageContent || isGenerating || !projectData) return;

    const currentMessages = projectData.messages || [];
    setChatInput('');
    setIsGenerating(true);

    try {
        await projectAgent({ 
            projectId, 
            messages: currentMessages, 
            userMessageContent 
        });
        // The onSnapshot listener will handle the UI update.
    } catch (error) {
      console.error("Error calling projectAgent function:", error);
      // The onSnapshot will likely not fire, so we might need a manual error message append.
      // For now, console.error is sufficient.
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!projectData) {
      return <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">Loading project or project not found...</div>;
  }

  return (
    <div className="flex flex-col h-screen text-foreground bg-background overflow-hidden">
      <header className="flex items-center justify-between p-2 border-b bg-card z-10 shrink-0">
        <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-purple-500 fill-current"/>
            <div className="font-semibold text-md truncate" title={projectData.name}>{projectData.name}</div>
        </div>
         <div className="flex items-center gap-2">
            <Button variant={viewport === 'desktop' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewport('desktop')}><Monitor className="h-4 w-4" /></Button>
            <Button variant={viewport === 'tablet' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewport('tablet')}><Tablet className="h-4 w-4" /></Button>
            <Button variant={viewport === 'mobile' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewport('mobile')}><Smartphone className="h-4 w-4" /></Button>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" /*onClick={() => router.push(...)}*/>
                <Code className="h-4 w-4 mr-2"/> Code View
            </Button>
            <Button size="sm">Publish</Button>
            <Button variant="ghost" size="icon" onClick={() => setIsChatVisible(!isChatVisible)}><PanelRight className="h-5 w-5" /></Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 bg-gray-900 flex items-center justify-center p-4">
             <div className={`bg-white rounded-lg shadow-xl transition-all duration-300 ${viewport === 'desktop' ? 'w-full h-full' : ''} ${viewport === 'tablet' ? 'w-[768px] h-[1024px]' : ''} ${viewport === 'mobile' ? 'w-[375px] h-[667px]' : ''}`}>
                <iframe ref={iframeRef} title="Preview" className="w-full h-full border-0 bg-white rounded-lg"></iframe>
            </div>
        </main>

        {isChatVisible && (
            <aside className="w-[450px] flex flex-col bg-card text-card-foreground border-l">
                <div className="p-4 border-b flex items-center gap-3"><Sparkles className="h-6 w-6 text-purple-500"/><h2 className="text-lg font-semibold">AI Assistant</h2></div>
                <div ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto space-y-6">
                    {(projectData.messages || []).map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'items-start'}`}>
                            {msg.role === 'assistant' && <div className="bg-purple-500/20 p-2 rounded-full mr-3"><Sparkles className="h-4 w-4 text-purple-500"/></div>}
                            <div className={`max-w-xs md:max-w-sm lg:max-w-md p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>{msg.content}</div>
                        </div>
                    ))}
                    {isGenerating && (
                         <div className="flex items-start gap-3"><div className="bg-purple-500/20 p-2 rounded-full mr-3"><Sparkles className="h-4 w-4 text-purple-500"/></div><div className="max-w-xs p-3 rounded-xl text-sm bg-muted animate-pulse">Thinking...</div></div>
                    )}
                </div>
                <div className="p-4 border-t bg-card">
                     <div className="bg-muted/30 rounded-xl p-2">
                        <Input placeholder="Ask Lovable to make changes..." className="w-full bg-transparent border-none focus:ring-0 resize-none text-base h-10" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={handleKeyDown} disabled={isGenerating}/>
                        <div className="flex justify-end items-center mt-1">
                            <Button size="icon" className="bg-foreground/90 hover:bg-foreground text-background rounded-md w-8 h-8" onClick={handleSendMessage} disabled={isGenerating || !chatInput.trim()}><ArrowUp className="h-5 w-5" /></Button>
                        </div>
                    </div>
                </div>
            </aside>
        )}
      </div>
    </div>
  );
}
