import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { CheckCircle } from "lucide-react";

export default function InstructionsPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-8">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Instrucciones de Pago
                    </h1>
                    <p className="text-xl text-slate-600 mb-12">
                        Has dado el primer paso hacia tu sueño americano. Sigue las instrucciones a continuación para completar la adquisición de tu plan.
                    </p>
                    
                    <div className="bg-slate-50 p-8 md:p-12 rounded-3xl text-left border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">Próximos pasos:</h2>
                        <ol className="list-decimal list-inside space-y-4 text-lg text-slate-700">
                            <li>Revisa tu correo electrónico para el comprobante de pre-registro.</li>
                            <li>Sigue el enlace de pago seguro incluido en el correo.</li>
                            <li>Una vez confirmado el pago, un asesor de Udreamms se pondrá en contacto contigo en menos de 24 horas.</li>
                            <li>Comenzaremos inmediatamente con la auditoría de tu perfil.</li>
                        </ol>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
