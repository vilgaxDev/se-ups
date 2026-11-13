export type UserRole = 'public' | 'citizen' | 'finder' | 'admin' | 'finance_admin' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'suspended';
  createdAt: string;
  avatarUrl?: string;
}

export type RecordStatus = 
  | 'under_review' 
  | 'listed' 
  | 'matched' 
  | 'claimed_and_recovered' 
  | 'flagged' 
  | 'archived';

export type HandoverPreference = 'direct' | 'huduma_centre' | 'police_station';

export interface FoundIdRecord {
  id: string;
  finderId: string;
  finderName: string;
  finderPhone: string; // Strictly confidential, masked until payment
  finderMpesaName: string;
  idNumber: string; // e.g., "34821904"
  idHash: string; // Deterministic keyed hash for lookup
  maskedIdNumber: string; // e.g., "3482****"
  fullNameOnId: string;
  dateOfBirth?: string;
  county: string;
  subCounty: string;
  exactLocation: string;
  handoverPreference: HandoverPreference;
  handoverDetails: string;
  status: RecordStatus;
  createdAt: string;
  moderationNotes?: string;
  matchId?: string;
  claimedByCitizenId?: string;
  unlockedAt?: string;
}

export interface IdMatch {
  id: string;
  recordId: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  idNumber: string;
  matchConfidence: number; // e.g. 100 for exact national ID match
  status: 'pending_payment' | 'unlocked' | 'recovery_confirmed' | 'disputed';
  createdAt: string;
  unlockedAt?: string;
}

export interface RecoveryRequest {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenPhone: string;
  idNumber: string;
  idHash: string;
  matchedRecordId?: string;
  status: 'searching' | 'match_found' | 'unlocked' | 'completed';
  createdAt: string;
}

export interface Payment {
  id: string;
  transactionReference: string; // e.g. "MPESA-QHK9283719"
  amount: number; // 150
  currency: string; // "KSh"
  provider: 'mpesa' | 'intasend' | 'pawapay';
  payerPhone: string;
  payerId: string;
  payerName: string;
  recordId: string;
  matchId: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  verifiedAt?: string;
  finderRewardId?: string;
}

export interface FinderReward {
  id: string;
  finderId: string;
  finderName: string;
  recordId: string;
  paymentId: string;
  rewardAmount: number; // 100
  platformFee: number; // 50
  grossFee: number; // 150
  status: 'credited' | 'payout_pending' | 'payout_completed';
  payoutId?: string;
  createdAt: string;
  paidAt?: string;
}

export interface Payout {
  id: string;
  finderId: string;
  finderName: string;
  amount: number;
  currency: string;
  mpesaNumber: string;
  mpesaTransactionId: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export interface FraudFlag {
  id: string;
  recordId: string;
  recordIdNumber: string;
  flaggedBy: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface SiteSettings {
  claimantFee: number;
  finderReward: number;
  platformFee: number;
  mpesaPaybill: string;
  mpesaAccount: string;
  maintenanceMode: boolean;
  autoUnlockContact: boolean;
  contactEmergencyHelpline: string;
  dataProtectionNotice: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  read: boolean;
  createdAt: string;
  actionLink?: string;
}
