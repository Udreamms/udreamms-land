export type TouristVisaPlanId = 'basico' | 'premium' | 'vip';
export type StudentVisaPlanId = 'esencial' | 'pro' | 'elite' | 'allinclusive';
export type VisaPlanId = TouristVisaPlanId | StudentVisaPlanId;

export function normalizeStudentPlanParam(planParam: string): StudentVisaPlanId | null {
  const normalized = planParam.toLowerCase().replace(/-/g, '') as StudentVisaPlanId;
  const valid: StudentVisaPlanId[] = ['esencial', 'pro', 'elite', 'allinclusive'];
  return valid.includes(normalized) ? normalized : null;
}
