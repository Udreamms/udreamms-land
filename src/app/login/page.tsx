'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Phone } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  seed: number;
}

const BlueParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrame = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particleCount = 450;
    particles.current = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 1.5 + 0.5,
      seed: Math.random()
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        p.x += p.vx + Math.sin(Date.now() * 0.001 + p.seed * 10) * 0.2;
        p.y += p.vy + Math.cos(Date.now() * 0.001 + p.seed * 10) * 0.2;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const opacity = 0.1 + p.seed * 0.3;
        ctx.fillStyle = `rgba(168, 85, 247, ${opacity})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-[10] pointer-events-none" />;
};

function LoginContent() {
  const searchParams = useSearchParams();
  const isRegisterParam = searchParams.get('register') === 'true';
  const isLoginParam = searchParams.get('mode') === 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);
  const router = useRouter();

  // Sync state with search params changes
  useEffect(() => {
    if (isRegisterParam || isLoginParam) {
      setShowForm(true);
      setIsRegistering(isRegisterParam);
    } else {
      setShowForm(false);
    }
  }, [isRegisterParam, isLoginParam]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/portal');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const syncUserInFirestore = async (user: any) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      const profileData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        lastLogin: serverTimestamp()
      };

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          ...profileData,
          role: 'client',
          createdAt: serverTimestamp()
        });
      } else {
        await updateDoc(userRef, profileData);
      }
    } catch (err: any) {
      console.error("Error al sincronizar usuario en Firestore: ", err);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Cuenta creada exitosamente');
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        toast.success('Sesión iniciada correctamente');
      }
      if (userCredential?.user) {
        await syncUserInFirestore(userCredential.user);
      }
      router.push('/portal');
    } catch (error: any) {
      toast.error('Error en autenticación: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: any, providerName: string) => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      if (result?.user) {
        await syncUserInFirestore(result.user);
      }
      toast.success(`Iniciaste sesión con ${providerName}`);
      router.push('/portal');
    } catch (error: any) {
      toast.error(`Error con ${providerName}: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden selection:bg-white/10">
      {/* Blue Particles - Background */}
      <BlueParticles />

      {/* Content Container */}
      <div className="relative z-[20] w-full flex flex-col items-center justify-center px-6 pb-24 xl:pb-0 min-h-screen">
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full space-y-4 flex flex-col items-center"
              onMouseEnter={() => setIsHoveringText(true)}
              onMouseLeave={() => setIsHoveringText(false)}
            >
              <div className="flex flex-col items-center text-center max-w-4xl mb-12">
                <div className="flex flex-wrap justify-center gap-x-[0.25em] text-3xl md:text-5xl font-light tracking-tight text-white leading-[1.15] justify-center px-4">
                  {"Bienvenido a Udreamms".split(' ').map((word, wordIndex) => (
                    <motion.span
                      key={`welcome-word-${wordIndex}`}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ delay: 0.2 + (wordIndex * 0.1), duration: 0.8, ease: "easeOut" }}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-x-[0.25em] text-gray-400 text-xs md:text-sm font-light tracking-wide mt-4 uppercase">
                  {"Elige cómo deseas ingresar".split(' ').map((word, wordIndex) => (
                    <motion.span
                      key={`subtitle-word-${wordIndex}`}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ delay: 0.2 + 0.8 + (wordIndex * 0.1), duration: 0.8, ease: "easeOut" }}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => { setShowForm(true); setIsRegistering(true); }}
                className="w-full max-w-sm h-14 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] hover:scale-105 font-light text-xs md:text-sm tracking-widest transition-all duration-300 shadow-lg"
              >
                COMENZAR EN UDREAMMS
              </Button>

              <Button
                variant="outline"
                className="w-full max-w-sm h-14 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] hover:scale-105 font-light text-xs md:text-sm tracking-widest transition-all duration-300 shadow-lg"
                onClick={() => { setShowForm(true); setIsRegistering(false); }}
              >
                YA TENGO MI CUENTA EN UDREAMMS
              </Button>

              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-[9px] md:text-[10px] text-white/40 hover:text-white pt-6 transition-colors tracking-[0.3em] font-semibold uppercase"
              >
                Volver a la página principal
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-7xl px-4 space-y-8"
            >
              <div className="text-center px-4 max-w-2xl mx-auto flex flex-col gap-3 md:gap-4 min-h-[6rem] md:min-h-[8rem] justify-center mb-6">
                {(isRegistering 
                  ? ["Tu futuro comienza hoy con Udreamms", "Creemos tu cuenta para comenzar"]
                  : ["¡Te damos la bienvenida de nuevo!", "Inicia sesión con tu cuenta para continuar"]
                ).map((line, lineIndex) => (
                  <div
                    key={`${isRegistering ? 'reg' : 'log'}-line-${lineIndex}`}
                    className={`flex flex-wrap justify-center gap-x-[0.25em] gap-y-1 text-white/90 font-light tracking-wide ${lineIndex === 0 ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl text-white/60'}`}
                  >
                    {line.split(' ').map((word, wordIndex) => (
                      <motion.span
                        key={`${isRegistering ? 'reg' : 'log'}-word-${lineIndex}-${wordIndex}`}
                        initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ 
                          delay: 0.3 + (lineIndex * 1.0) + (wordIndex * 0.15), 
                          duration: 0.8, 
                          ease: "easeOut" 
                        }}
                        className="inline-block"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>
                ))}
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-4 max-w-sm mx-auto w-full">
                <div className="space-y-1">
                  <Input
                    type="email"
                    placeholder="Usuario (Correo electrónico)"
                    className="bg-white/5 border-white/10 focus:border-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/40 rounded-full h-12 text-white placeholder:text-white/20 transition-all text-xs tracking-widest px-6 text-center"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Input
                    type="password"
                    placeholder="Clave de acceso (Contraseña)"
                    className="bg-white/5 border-white/10 focus:border-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/40 rounded-full h-12 text-white placeholder:text-white/20 transition-all text-xs tracking-widest px-6 text-center"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-full bg-transparent border border-white/40 text-white hover:bg-gradient-to-r hover:from-[#2d1b4e] hover:to-[#9b4dca] hover:text-white hover:border-[#2d1b4e] hover:[transition-property:transform,box-shadow] hover:scale-[1.02] font-light text-sm tracking-wider transition-all duration-300 shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:hover:from-transparent disabled:hover:to-transparent disabled:hover:border-white/40 mt-4"
                  disabled={loading}
                >
                  {loading ? 'Sincronizando...' : (isRegistering ? 'Registrarse' : 'Iniciar Sesión')}
                </Button>
              </form>

              <div className="relative flex items-center py-4 max-w-md mx-auto w-full">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/30 text-[10px] tracking-widest uppercase font-semibold">O continuar con</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <div className="flex flex-row flex-wrap items-center justify-center gap-2 md:gap-3 w-full">
                <Button
                  type="button"
                  onClick={() => handleSocialLogin(new GoogleAuthProvider(), 'Google')}
                  className="h-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center px-4 md:px-5 gap-2 font-medium text-xs md:text-sm whitespace-nowrap"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16" height="16"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                  Google
                </Button>

                <Button
                  type="button"
                  onClick={() => handleSocialLogin(new OAuthProvider('apple.com'), 'Apple')}
                  className="h-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center px-4 md:px-5 gap-2 font-medium text-xs md:text-sm whitespace-nowrap"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="16" height="16"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
                  Apple
                </Button>

                <Button
                  type="button"
                  onClick={() => handleSocialLogin(new OAuthProvider('microsoft.com'), 'Microsoft')}
                  className="h-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center px-4 md:px-5 gap-2 font-medium text-xs md:text-sm whitespace-nowrap"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16"><path fill="currentColor" d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" /></svg>
                  Microsoft
                </Button>

                <Button
                  type="button"
                  onClick={() => handleSocialLogin(new GithubAuthProvider(), 'GitHub')}
                  className="h-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center px-4 md:px-5 gap-2 font-medium text-xs md:text-sm whitespace-nowrap"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" width="16" height="16"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" /></svg>
                  GitHub
                </Button>

                <Button
                  type="button"
                  onClick={() => handleSocialLogin(new FacebookAuthProvider(), 'Facebook')}
                  className="h-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center px-4 md:px-5 gap-2 font-medium text-xs md:text-sm whitespace-nowrap"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" /></svg>
                  Facebook
                </Button>

                <Button
                  type="button"
                  onClick={() => handleSocialLogin(new TwitterAuthProvider(), 'X')}
                  className="h-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center px-4 md:px-5 gap-2 font-medium text-xs md:text-sm whitespace-nowrap"
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path fill="currentColor" d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" /></svg>
                  X (Twitter)
                </Button>

                <Button
                  type="button"
                  onClick={() => toast.info('Autenticación por teléfono próximamente')}
                  className="h-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center justify-center px-4 md:px-5 gap-2 font-medium text-xs md:text-sm whitespace-nowrap"
                  disabled={loading}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Teléfono
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full text-center text-[9px] md:text-[10px] text-white/40 hover:text-white/80 mt-8 transition-colors tracking-[0.3em] font-semibold uppercase"
              >
                Volver
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.6em] uppercase text-white/40 whitespace-nowrap"
      >
        Plataforma Udreamms
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  );
}
