"use client";

export default function StageDetails() {
  return (
    <section id="stage-details" className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿En qué etapa te encuentras?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Identifica dónde estás en tu viaje y descubre cómo te podemos ayudar
          </p>
        </div>

        {/* Stage Category Cards - 3 Horizontal Boxes */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-destructive to-destructive/80 p-6 rounded-xl shadow-lg border-2 border-destructive/50 text-center">
            <h3 className="text-xl font-bold text-destructive-foreground mb-2">
              Etapa 1-3
            </h3>
            <p className="text-destructive-foreground/90 font-semibold">
              Antes del Viaje
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary-glow p-6 rounded-xl shadow-lg border-2 border-primary/50 text-center">
            <h3 className="text-xl font-bold text-primary-foreground mb-2">
              Etapa 4
            </h3>
            <p className="text-primary-foreground/90 font-semibold">
              Durante la aventura
            </p>
          </div>

          <div className="bg-gradient-to-br from-accent to-accent/80 p-6 rounded-xl shadow-lg border-2 border-accent/50 text-center">
            <h3 className="text-xl font-bold text-accent-foreground mb-2">
              META FINAL
            </h3>
            <p className="text-accent-foreground/90 font-semibold">
              Después
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Etapa 1 */}
          <div className="bg-card p-8 rounded-2xl shadow-[var(--shadow-soft)] border border-primary/20 relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <span className="text-2xl font-bold text-primary-foreground">01</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">Etapa 1: ¡Aun no califico!</h3>
                <p className="text-lg font-semibold text-muted-foreground italic">Preparándote para tu gran aventura</p>
              </div>
            </div>
            <div className="ml-0 md:ml-18 space-y-3 mb-6">
              <p className="text-base text-foreground">
                <strong>¿Estás aquí?</strong> Aún no tienes pasaporte ni un documento que refleje que tienes los fondos suficientes para estudiar en USA.
              </p>
              <p className="text-base text-primary font-semibold">
                ¡Te queremos ayudar!
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ <strong>Clases de inglés online:</strong> Avanza en tu nivel de inglés antes de tu viaje</li>
                <li>✓ <strong>Programa de afiliados:</strong> Genera ingresos para pasar a la etapa 2</li>
              </ul>
            </div>
          </div>

          {/* Etapa 2 */}
          <div className="bg-card p-8 rounded-2xl shadow-[var(--shadow-soft)] border border-primary/20 relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <span className="text-2xl font-bold text-primary-foreground">02</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">Etapa 2: ¡Tengo todo para comenzar!</h3>
                <p className="text-lg font-semibold text-muted-foreground italic">Iniciando tu proceso migratorio</p>
              </div>
            </div>
            <div className="ml-0 md:ml-18 space-y-3 mb-6">
              <p className="text-base text-foreground">
                <strong>¿Estás aquí?</strong> Ya tienes tus documentos listos y estás listo para aplicar a una escuela y obtener tu visa F-1.
              </p>
              <p className="text-base text-primary font-semibold">
                ¡Te acompañamos en todo!
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ <strong>Aplicación a escuela:</strong> Te ayudamos a elegir y aplicar a la escuela ideal</li>
                <li>✓ <strong>Proceso SEVIS:</strong> Gestionamos tu documentación I-20</li>
                <li>✓ <strong>Preparación para cita consular:</strong> Te preparamos para tu entrevista de visa</li>
              </ul>
            </div>
          </div>

          {/* Etapa 3 */}
          <div className="bg-card p-8 rounded-2xl shadow-[var(--shadow-soft)] border border-primary/20 relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <span className="text-2xl font-bold text-primary-foreground">03</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">Etapa 3: Visa Aprobada - y ahora que sigue?</h3>
                <p className="text-lg font-semibold text-muted-foreground italic">Organizando tu viaje a Estados Unidos</p>
              </div>
            </div>
            <div className="ml-0 md:ml-18 space-y-3 mb-6">
              <p className="text-base text-foreground">
                <strong>¿Estás aquí?</strong> Ya tienes tu visa aprobada y estás organizando tu viaje a Estados Unidos.
              </p>
              <p className="text-base text-primary font-semibold">
                ¡Estamos contigo hasta el final!
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ <strong>Búsqueda de vivienda:</strong> Te ayudamos a encontrar el lugar perfecto para vivir</li>
                <li>✓ <strong>Compra de vuelos:</strong> Asesoría para conseguir las mejores opciones</li>
                <li>✓ <strong>Checklist de viaje:</strong> Todo lo que necesitas antes de partir</li>
              </ul>
            </div>
          </div>

          {/* Etapa 4 */}
          <div className="bg-card p-8 rounded-2xl shadow-[var(--shadow-soft)] border border-primary/20 relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <span className="text-2xl font-bold text-primary-foreground">04</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">Etapa 4: Llegamos a USA!</h3>
                <p className="text-lg font-semibold text-muted-foreground italic">Tus primeros días en Estados Unidos</p>
              </div>
            </div>
            <div className="ml-0 md:ml-18 space-y-3 mb-6">
              <p className="text-base text-foreground">
                <strong>¿Estás aquí?</strong> Ya llegaste a Estados Unidos y estás en tus primeros días adaptándote.
              </p>
              <p className="text-base text-primary font-semibold">
                ¡No estás solo en esta nueva etapa!
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ <strong>Recogida en aeropuerto:</strong> Te recibimos cuando llegues (Utah)</li>
                <li>✓ <strong>Trámites iniciales:</strong> Apertura de cuenta bancaria, número de seguro social, etc.</li>
                <li>✓ <strong>Udreamms App:</strong> Accede a nuestra app con recursos para estudiantes en USA</li>
              </ul>
            </div>
          </div>

          {/* META FINAL */}
          <div className="bg-card p-8 rounded-2xl shadow-[var(--shadow-soft)] border border-primary/20 relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <span className="text-2xl font-bold text-primary-foreground">🎯</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">META FINAL: Estudiar y Vivir en USA</h3>
                <p className="text-lg font-semibold text-muted-foreground italic">Ya estás establecido y disfrutando de tu vida en USA</p>
              </div>
            </div>
            <div className="ml-0 md:ml-18 space-y-3">
              <p className="text-base text-foreground">
                <strong>¿Estás aquí?</strong> Ya estás establecido y disfrutando de tu experiencia como estudiante en USA.
              </p>
              <p className="text-base text-primary font-semibold">
                ¡Sigue aprovechando al máximo!
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ <strong>Oportunidades de trabajo:</strong> Encuentra trabajos part-time permitidos con tu visa</li>
                <li>✓ <strong>Networking:</strong> Conecta con otros estudiantes internacionales</li>
                <li>✓ <strong>Viajes y aventuras:</strong> Descubre Estados Unidos mientras estudias</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
