'use client';

import { useState, useEffect } from 'react';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { firebaseApp } from '../../../../firebaseapp.js';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useParams } from 'next/navigation'; // Import the useParams hook

interface ProjectData {
    name: string;
    code?: string; 
}

export default function PreviewPage() {
    const params = useParams(); // Get params using the hook
    const projectId = params.projectId as string; // Access projectId from params

    const [projectData, setProjectData] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    const db = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribeAuth();
    }, [auth]);

    useEffect(() => {
        if (!user) {
            // Still loading the user, or user is not logged in.
            // We can wait, or show a message. Let's wait for the user state to resolve.
            return;
        }
        if (!projectId) {
            setError("Project ID is missing.");
            setLoading(false);
            return;
        }

        const projectDocRef = doc(db, 'projects', projectId);
        
        const unsubscribeSnapshot = onSnapshot(projectDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setProjectData(docSnap.data() as ProjectData);
            } else {
                setError("Project not found.");
            }
            setLoading(false);
        }, (err) => {
            console.error("Error fetching project for preview:", err);
            setError("You do not have permission to view this project.");
            setLoading(false);
        });

        return () => unsubscribeSnapshot();

    }, [db, projectId, user]);

    if (loading) {
        return <div style={{ fontFamily: 'sans-serif', color: '#888', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Preview...</div>;
    }

    if (error) {
        return <div style={{ fontFamily: 'sans-serif', color: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Error: {error}</div>;
    }

    return (
        <div dangerouslySetInnerHTML={{ __html: projectData?.code || '' }} />
    );
}
