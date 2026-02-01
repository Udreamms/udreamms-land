import { Timestamp } from 'firebase/firestore';

export interface Message {
    text: string;
    sender: 'user' | 'agent';
    timestamp: Timestamp;
    fileUrl?: string;
    fileType?: string;
    fileName?: string;
}

export interface CheckIn {
    id: string;
    text: string;
    author: string;
    timestamp: Timestamp;
    completed?: boolean;
}

export interface Note {
    id: string;
    text: string;
    author: string;
    timestamp: Timestamp;
    completed?: boolean;
}

export interface PaymentMethod {
    id: string;
    type: 'visa' | 'mastercard' | 'amex' | 'paypal' | 'bank_transfer' | 'other';
    last4?: string;
    expiry?: string;
    brand?: string;
    isDefault?: boolean;
}

export interface Subscription {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: 'month' | 'year';
    status: 'active' | 'past_due' | 'canceled';
    nextBillingDate: Timestamp;
}

export interface Transaction {
    id: string;
    amount: number;
    currency: string;
    date: Timestamp;
    status: 'completed' | 'pending' | 'failed';
    method: string;
    description: string;
}

export interface AttachedDocument {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: Timestamp;
}

export interface CardData {
    id: string;
    groupId: string;
    contactName?: string;
    contactNumber?: string;
    company?: string;
    email?: string;
    website?: string;
    address?: string;
    messages?: Message[];
    lastReadAt?: Timestamp;
    notes?: Note[];
    checkIns?: CheckIn[];
    paymentStatus?: string;
    checklistStatus?: { [key: string]: boolean };
    city?: string;
    postalCode?: string;
    birthDate?: Timestamp;
    clientType?: 'persona' | 'empresa' | 'estudiante';
    gender?: 'man' | 'woman' | 'other';
    passport?: string;
    passportNumber?: string;
    passportCountry?: string;
    passportIssueDate?: Timestamp;
    passportExpiryDate?: Timestamp;
    passportPlaceOfBirth?: string;
    nationality?: string;
    primaryLanguage?: string;
    additionalLanguages?: string[];
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
    seatPreference?: string;
    mealPreference?: string;
    specialAssistance?: string;
    frequentFlyerPrograms?: any[];
    visaRequired?: boolean;
    visaStatus?: string;
    visaNumber?: string;
    visaExpiryDate?: Timestamp;
    visaCountry?: string;
    travelInsurance?: boolean;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    insuranceCoverage?: number;
    insuranceExpiryDate?: Timestamp;
    travelingWith?: string;
    numberOfTravelers?: number;
    companions?: any[];
    allergies?: string;
    medicalConditions?: string;
    medications?: string;
    budgetRange?: string;
    preferredPaymentMethod?: string;
    requiresFinancing?: boolean;
    interests?: string;
    profession?: string;
    occupation?: string;
    serviceDetails?: string;
    serviceType?: string;
    serviceStartDate?: Timestamp;
    serviceDeliveryDate?: Timestamp;
    backupLink?: string;
    contractLink?: string;
    invoiceLink?: string;
    socials?: { [key: string]: string };
    source?: string;
    documents?: AttachedDocument[];
    paymentMethods?: PaymentMethod[];
    transactions?: Transaction[];
    subscriptions?: Subscription[];
}

export interface ConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupName?: string;
    groups?: any[];
    isGlobalContact?: boolean;
    allConversations?: any[];
    onSelectConversation?: (conv: any) => void;
    stats?: {
        totalConversations: number;
        totalGroups: number;
    };
    card: {
        id: string;
        groupId?: string;
        contactName?: string;
        contactNumber?: string;
        [key: string]: any;
    } | null;
    position?: DOMRect | null;
    hideInternalTray?: boolean;
    hideSidebar?: boolean;
    currentGroupName?: string;
}
