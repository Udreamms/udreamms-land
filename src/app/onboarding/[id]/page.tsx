'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Globe, FileText, Send, MapPin, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function OnboardingPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        primaryLanguage: '',
        address: '', // Country of Residence
        nationality: '',
        hasPassport: '',
        serviceType: ''
    });

    const [available, setAvailable] = useState(true);

    useEffect(() => {
        const fetchContact = async () => {
            if (!params.id) return;
            try {
                const docRef = doc(db, 'contacts', params.id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // Split contactName into first and last if possible
                    const fullName = data.contactName || '';
                    const nameParts = fullName.split(' ');
                    const firstName = nameParts[0] || '';
                    const lastName = nameParts.slice(1).join(' ') || '';

                    setFormData({
                        firstName,
                        lastName,
                        email: data.email || '',
                        contactNumber: data.contactNumber || '',
                        primaryLanguage: data.primaryLanguage || '',
                        address: data.address || '',
                        nationality: data.nationality || '',
                        hasPassport: data.passport ? 'yes' : 'no', // Simple heuristic
                        serviceType: data.serviceType || ''
                    });
                } else {
                    setAvailable(false);
                }
            } catch (error) {
                console.error("Error fetching contact:", error);
                setAvailable(false);
            } finally {
                setLoading(false);
            }
        };

        fetchContact();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Reconstruct full name
            const contactName = `${formData.firstName} ${formData.lastName}`.trim();

            const updateData: any = {
                contactName,
                email: formData.email,
                contactNumber: formData.contactNumber,
                primaryLanguage: formData.primaryLanguage,
                address: formData.address, // Using address for Country of Residence for now
                nationality: formData.nationality,
                serviceType: formData.serviceType,
                // If yes, we might want to flag it, but for now just saving the text if needed or ignoring
                // passport: formData.hasPassport === 'yes' ? 'Valid' : 'None' 
            };

            // Only update passport field if we have a definitive yes/no that translates to something useful
            // Or maybe we don't overwrite passport string with "yes/no". 
            // Let's assume we update it if it's currently empty, otherwise leave it.
            // For this specific requirement, I'll update minimal set.

            const docRef = doc(db, 'contacts', params.id as string);
            await updateDoc(docRef, updateData);

            setSuccess(true);
            setTimeout(() => {
                // Optional: redirect or just show success
            }, 2000);

        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!available) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white p-4 text-center">
                <div>
                    <h1 className="text-3xl font-bold mb-4">Enlace Expirado o Inválido</h1>
                    <p className="text-neutral-400">Lo sentimos, no pudimos encontrar tu registro. Por favor contacta a soporte.</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-[#111] border border-white/10 rounded-3xl p-12 text-center shadow-2xl"
                >
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">¡Todo Listo!</h2>
                    <p className="text-neutral-400 mb-8 leading-relaxed">
                        Tu perfil ha sido actualizado correctamente. Nuestro equipo revisará tu información en breve.
                    </p>
                    <Button
                        className="w-full h-12 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold"
                        onClick={() => window.close()}
                    >
                        Cerrar Ventana
                    </Button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-rose-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-rose-600/20 blur-[120px] rounded-full opacity-40 mix-blend-screen"></div>
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full opacity-30"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 space-y-4"
                >
                    <div className="inline-flex items-center justify-center p-4 bg-white/[0.03] rounded-3xl border border-white/5 shadow-2xl mb-4 backdrop-blur-xl">
                        <Send className="w-8 h-8 text-rose-500 rotate-12" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Comienza tu Aventura
                    </h1>
                    <p className="text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed">
                        Completa este breve formulario y da el primer paso hacia tu sueño americano. <span className="text-white font-medium">¡Estamos aquí para ayudarte!</span>
                    </p>
                </motion.div>

                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500/50 to-transparent"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {/* Name */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                <User size={16} className="text-rose-500" /> Nombre
                            </label>
                            <Input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Ej. Juan"
                                className="h-14 bg-white/5 border-white/10 rounded-2xl text-lg focus:border-rose-500/50 transition-all placeholder:text-neutral-700 font-medium"
                                required
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                <User size={16} className="text-rose-500 opacity-0" /> Apellido
                            </label>
                            <Input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Ej. Pérez"
                                className="h-14 bg-white/5 border-white/10 rounded-2xl text-lg focus:border-rose-500/50 transition-all placeholder:text-neutral-700 font-medium"
                                required
                            />
                        </div>

                        {/* Contact */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                <Mail size={16} className="text-blue-400" /> Correo Electrónico
                            </label>
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="juan@ejemplo.com"
                                className="h-14 bg-white/5 border-white/10 rounded-2xl text-lg focus:border-blue-500/50 transition-all placeholder:text-neutral-700 font-medium"
                                required
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                <Phone size={16} className="text-emerald-400" /> WhatsApp / Teléfono
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pr-3 border-r border-white/10">
                                    <span className="text-xl">🇺🇸</span>
                                    {/* <span className="text-sm font-bold text-neutral-400">+1</span> */}
                                </div>
                                <Input
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    placeholder="+1 234 567 890" // Placeholder generic
                                    className="h-14 pl-16 bg-white/5 border-white/10 rounded-2xl text-lg focus:border-emerald-500/50 transition-all placeholder:text-neutral-700 font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {/* Location & Details */}
                        <div className="space-y-4">
                            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                <Globe size={16} className="text-purple-400" /> Idioma preferido
                            </label>
                            <div className="relative">
                                <select
                                    name="primaryLanguage"
                                    value={formData.primaryLanguage}
                                    onChange={handleChange}
                                    className="h-14 w-full bg-black/20 border border-white/10 rounded-2xl text-lg px-4 appearance-none focus:outline-none focus:border-purple-500/50 text-white transition-all cursor-pointer"
                                >
                                    <option value="" className="bg-neutral-900">Selecciona un idioma</option>
                                    <option value="Español" className="bg-neutral-900">Español</option>
                                    <option value="Inglés" className="bg-neutral-900">Inglés</option>
                                    <option value="Portugués" className="bg-neutral-900">Portugués</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={20} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                <MapPin size={16} className="text-amber-400" /> País de Residencia
                            </label>
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Ej. México, Colombia..."
                                className="h-14 bg-white/5 border-white/10 rounded-2xl text-lg focus:border-amber-500/50 transition-all placeholder:text-neutral-700 font-medium"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                <Globe size={16} className="text-cyan-400" /> Nacionalidad
                            </label>
                            <Input
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                placeholder="Ej. Mexicana"
                                className="h-14 bg-white/5 border-white/10 rounded-2xl text-lg focus:border-cyan-500/50 transition-all placeholder:text-neutral-700 font-medium"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                <FileText size={16} className="text-indigo-400" /> ¿Tienes pasaporte válido?
                            </label>
                            <div className="relative">
                                <select
                                    name="hasPassport"
                                    value={formData.hasPassport}
                                    onChange={handleChange}
                                    className="h-14 w-full bg-black/20 border border-white/10 rounded-2xl text-lg px-4 appearance-none focus:outline-none focus:border-indigo-500/50 text-white transition-all cursor-pointer"
                                >
                                    <option value="" className="bg-neutral-900">Selecciona una opción</option>
                                    <option value="yes" className="bg-neutral-900">Sí, tengo pasaporte vigente</option>
                                    <option value="no" className="bg-neutral-900">No, aún no tengo</option>
                                    <option value="expired" className="bg-neutral-900">Vencido / Por renovar</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={20} />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className="text-sm font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                                <Send size={16} className="text-pink-400" /> ¿A qué tipo de visa deseas aplicar?
                            </label>
                            <div className="relative">
                                <select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    className="h-14 w-full bg-black/20 border border-white/10 rounded-2xl text-lg px-4 appearance-none focus:outline-none focus:border-pink-500/50 text-white transition-all cursor-pointer"
                                >
                                    <option value="" className="bg-neutral-900">Selecciona el tipo de visa</option>
                                    <option value="Turismo" className="bg-neutral-900">Visa de Turismo B1/B2</option>
                                    <option value="Estudiante" className="bg-neutral-900">Visa de Estudiante F1/M1</option>
                                    <option value="Trabajo" className="bg-neutral-900">Visa de Trabajo</option>
                                    <option value="Residencia" className="bg-neutral-900">Residencia / Green Card</option>
                                    <option value="Otro" className="bg-neutral-900">Otro trámite</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-col-reverse md:flex-row items-center gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full md:w-auto h-12 rounded-xl border-white/10 bg-transparent text-white hover:bg-white/5 font-bold"
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full md:flex-1 h-14 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white shadow-xl shadow-rose-600/20 font-black tracking-wide text-lg transition-all transform hover:scale-[1.02]"
                        >
                            {submitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Enviando...
                                </span>
                            ) : (
                                "Enviar Aplicación"
                            )}
                        </Button>
                    </div>
                </motion.form>

                <p className="text-center text-neutral-600 text-xs mt-8 font-medium uppercase tracking-widest">
                    Secured by Udreamms Platform · {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
