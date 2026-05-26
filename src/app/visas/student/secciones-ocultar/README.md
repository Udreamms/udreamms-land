# Secciones ocultas — Visa estudiante

Componentes **no usados** en la página activa (`/visas/student`). Incluye showcases de planes, funnels largos y calculadora.

## Cómo reactivar

```tsx
import CalculatorSection from "./secciones-ocultar/CalculatorSection";

<CalculatorSection onComplete={handleQuoteComplete} />
```

## Grupos

- **Funnel / copy:** `AgitationSection`, `SolutionSection`, `SystemGapSection`, `ScarcitySection`, `FAQSection`, `GuaranteeSection`, `QuizSection`
- **Planes (showcase):** `EssentialPlanShowcase`, `ProPlanShowcase`, `ElitePlanShowcase`, `AllInclusivePlanShowcase`
- **Social / video:** `SocialProofSection`, `SuccessVideoSection`, `VideoTestimonials`, `YouTubeSocialSection`, `YouTubeSubscription`, `JoinOurStudents`
- **Producto / app:** `UdreammsAppPromo`, `StudentMarketing`, `EnglishSchoolsShowcase`, `ExperienceSection`, `BenefitsSection`, `WhyChooseUs`, `StudentRequirements`
- **Conversión:** `CalculatorSection`, `QuoteCalculator`, `CtaSection`

**Activo hoy** en `_components/`: `HeroSection`, `PlansSection`, `ValuePropsSection`, `BookPromoSection`, `StatsBar`, `SuccessStoriesSection`, `FinalAdventureCTA`, `UpsellModal`, `Animations`.
