import { Shield, Users, Globe, GraduationCap } from "lucide-react";

export default function Stats() {
  return (
    <section className="py-16 bg-card border-y">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            La diferencia Udreamms
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Impulsamos el sueño de estudiar en Estados Unidos con el respaldo de instituciones líderes y un acompañamiento humano y cercano.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-primary">+30</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Años de Experiencia</h3>
            <p className="text-muted-foreground">
              Trabajamos junto a instituciones con más de 30 años en el mercado educativo internacional.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-primary">100+</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Estudiantes Acompañados</h3>
            <p className="text-muted-foreground">
              Han confiado en nosotros para iniciar su proceso de estudios en EE. UU.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-primary">+15</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Estados en el País</h3>
            <p className="text-muted-foreground">
              Presencia y aliados en más de 15 estados de Estados Unidos.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-primary">95%</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Tasa de Éxito</h3>
            <p className="text-muted-foreground">
              En la aprobación de admisiones y procesos estudiantiles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
