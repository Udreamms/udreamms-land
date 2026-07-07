export type TouristVisaPlanId = 'basico' | 'premium' | 'vip';
export type StudentVisaPlanId = 'esencial' | 'pro' | 'elite' | 'allinclusive';
export type DigitalProductId =
  | 'libro-estudiante'
  | 'libro-turista'
  | 'curso-estudiante'
  | 'curso-turista';
export type VisaPlanId = TouristVisaPlanId | StudentVisaPlanId | DigitalProductId | 'cart';

export function normalizeStudentPlanParam(planParam: string): StudentVisaPlanId | null {
  const normalized = planParam.toLowerCase().replace(/-/g, '') as StudentVisaPlanId;
  const valid: StudentVisaPlanId[] = ['esencial', 'pro', 'elite', 'allinclusive'];
  return valid.includes(normalized) ? normalized : null;
}

export function normalizeTouristPlanParam(planParam: string): TouristVisaPlanId | null {
  const normalized = planParam.toLowerCase().replace(/-/g, '') as TouristVisaPlanId;
  const valid: TouristVisaPlanId[] = ['basico', 'premium', 'vip'];
  return valid.includes(normalized) ? normalized : null;
}
