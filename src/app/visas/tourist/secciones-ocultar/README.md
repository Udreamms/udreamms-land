# Secciones ocultas — Visa turista

Componentes de marketing **no montados** en `page.tsx` actual. Están listos para reactivar sin mezclar con las secciones visibles.

## Cómo volver a mostrar una sección

1. Importa el componente en `../page.tsx`.
2. Añádelo al JSX en el orden deseado.
3. Ejemplo:

```tsx
import FAQSection from "./secciones-ocultar/FAQSection";

// dentro del return:
<FAQSection />
```

## Inventario

| Archivo | Descripción |
|---------|-------------|
| `AgitationSection` | Narrativa de dolor / problema |
| `FAQSection` | Preguntas frecuentes |
| `GuaranteeSection` | Garantía |
| `QuizSection` | Quiz interactivo |
| `ScarcitySection` | Escasez / urgencia |
| `SolutionSection` | Propuesta de solución |
| `SuccessStoriesSection` | Historias de éxito |
| `SystemGapSection` | Brecha del sistema |
| `YouTubeSocialSection` | Red / YouTube |
| `SuccessPipeline` | Pipeline de éxito (antes importado, no renderizado) |
| `SocialProofSection` | Prueba social (antes importado, no renderizado) |

**Dependencia compartida:** animaciones en `../_components/Animations.tsx`.
