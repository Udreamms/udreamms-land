export interface AttachedDoc {
  name: string;
  type: string;
  dataUrl: string;
  url?: string;
  size?: number;
  uploadedAt?: string;
}

export interface ApplicantInfo {
  id: string;
  name: string;
  photoUrl: string | null;
  passportDoc: AttachedDoc | null;
  bankStatementDoc: AttachedDoc | null;
  sevisDoc: AttachedDoc | null;
  i20Doc: AttachedDoc | null;
  ds160Doc: AttachedDoc | null;
  acceptanceLetterDoc: AttachedDoc | null;
  affidavitDoc: AttachedDoc | null;
  embassyAppointmentDoc: AttachedDoc | null;
  status: 'completado' | 'en_progreso' | 'pendiente';
}

export interface ActiveApplicantState {
  visaType: 'estudiante' | 'turista';
  applicantId: string;
}

export interface StageInfo {
  number: string;
  label: string;
  color: string;
  dot: string;
  desc?: string;
}
