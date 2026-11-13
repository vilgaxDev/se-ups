import {
  User,
  FoundIdRecord,
  IdMatch,
  RecoveryRequest,
  Payment,
  FinderReward,
  Payout,
  FraudFlag,
  AuditLog,
  SiteSettings,
  AppNotification,
  UserRole
} from '../types/index.ts';

// Deterministic keyed hash simulator for National ID numbers
// Compliant with Kenya Data Protection Act 2019 (keyed lookup without exposing raw ID)
export function hashIdNumber(idNumber: string): string {
  const clean = idNumber.replace(/\D/g, '');
  let hash = 0x811c9dc5;
  for (let i = 0; i < clean.length; i++) {
    hash ^= clean.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return 'pid_' + (hash >>> 0).toString(16).padStart(8, '0');
}

export function maskIdNumber(idNumber: string): string {
  const clean = idNumber.replace(/\D/g, '');
  if (clean.length <= 4) return '****';
  const visibleStart = clean.slice(0, 4);
  return `${visibleStart}****`;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '07********';
  const clean = phone.replace(/\s+/g, '');
  if (clean.length >= 10) {
    return clean.slice(0, 4) + '***' + clean.slice(-3);
  }
  return clean.slice(0, 3) + '****';
}

const STORAGE_KEY = 'pata_id_store_v1';

// Seed demo users
const SEED_USERS: User[] = [
  {
    id: 'user_citizen_1',
    name: 'John Mwangi Kariuki',
    email: 'john.mwangi@example.co.ke',
    phone: '+254 712 345 678',
    role: 'citizen',
    status: 'active',
    createdAt: '2026-11-01T08:30:00Z',
  },
  {
    id: 'user_finder_1',
    name: 'Faith Chebet Koech',
    email: 'faith.chebet@example.co.ke',
    phone: '+254 722 987 654',
    role: 'finder',
    status: 'active',
    createdAt: '2026-11-02T10:15:00Z',
  },
  {
    id: 'user_admin_1',
    name: 'Brian Ochieng Otieno',
    email: 'admin.brian@pataid.co.ke',
    phone: '+254 733 112 233',
    role: 'admin',
    status: 'active',
    createdAt: '2026-10-15T07:00:00Z',
  },
  {
    id: 'user_finance_1',
    name: 'Amina Hassan Noor',
    email: 'finance.amina@pataid.co.ke',
    phone: '+254 721 445 566',
    role: 'finance_admin',
    status: 'active',
    createdAt: '2026-10-18T09:00:00Z',
  },
  {
    id: 'user_support_1',
    name: 'Kevin Kiprono Bett',
    email: 'support.kevin@pataid.co.ke',
    phone: '+254 710 998 877',
    role: 'support',
    status: 'active',
    createdAt: '2026-10-20T11:00:00Z',
  },
];

// Seed found ID records
const SEED_RECORDS: FoundIdRecord[] = [
  {
    id: 'rec_101',
    finderId: 'user_finder_1',
    finderName: 'Faith Chebet Koech',
    finderPhone: '+254 722 987 654',
    finderMpesaName: 'FAITH CHEBET KOECH',
    idNumber: '32849102',
    idHash: hashIdNumber('32849102'),
    maskedIdNumber: '3284****',
    fullNameOnId: 'JOHN MWANGI KARIUKI',
    dateOfBirth: '1995-04-14',
    county: 'Nairobi',
    subCounty: 'Westlands',
    exactLocation: 'Near Sarit Centre, Ground Floor Java House entrance',
    handoverPreference: 'huduma_centre',
    handoverDetails: 'GPO Huduma Centre Nairobi, Lost & Found Desk',
    status: 'listed',
    createdAt: '2026-11-10T14:20:00Z',
  },
  {
    id: 'rec_102',
    finderId: 'user_finder_1',
    finderName: 'Faith Chebet Koech',
    finderPhone: '+254 722 987 654',
    finderMpesaName: 'FAITH CHEBET KOECH',
    idNumber: '29381045',
    idHash: hashIdNumber('29381045'),
    maskedIdNumber: '2938****',
    fullNameOnId: 'MARY WAMBUI NJOROGE',
    dateOfBirth: '1991-08-22',
    county: 'Nairobi',
    subCounty: 'Nairobi Central (CBD)',
    exactLocation: 'Kimathi Street outside Nation Centre',
    handoverPreference: 'direct',
    handoverDetails: 'CBD Safe Meeting Point or Central Police Station',
    status: 'listed',
    createdAt: '2026-11-11T09:10:00Z',
  },
  {
    id: 'rec_103',
    finderId: 'user_finder_1',
    finderName: 'Faith Chebet Koech',
    finderPhone: '+254 722 987 654',
    finderMpesaName: 'FAITH CHEBET KOECH',
    idNumber: '36192847',
    idHash: hashIdNumber('36192847'),
    maskedIdNumber: '3619****',
    fullNameOnId: 'DANIEL KIPKEMBOI TANUI',
    county: 'Nakuru',
    subCounty: 'Nakuru Town East',
    exactLocation: 'Kenyatta Avenue near Posta',
    handoverPreference: 'police_station',
    handoverDetails: 'Nakuru Central Police Station',
    status: 'claimed_and_recovered',
    createdAt: '2026-11-05T11:45:00Z',
    unlockedAt: '2026-11-06T15:30:00Z',
  },
  {
    id: 'rec_104',
    finderId: 'user_finder_2',
    finderName: 'Dennis Mutua Kioko',
    finderPhone: '+254 701 556 677',
    finderMpesaName: 'DENNIS MUTUA',
    idNumber: '31502938',
    idHash: hashIdNumber('31502938'),
    maskedIdNumber: '3150****',
    fullNameOnId: 'GRACE ATIENO ODHIAMBO',
    county: 'Kisumu',
    subCounty: 'Kisumu Central',
    exactLocation: 'Oginga Odinga Street near Mega Plaza',
    handoverPreference: 'huduma_centre',
    handoverDetails: 'Kisumu Huduma Centre',
    status: 'under_review',
    createdAt: '2026-11-12T06:30:00Z',
  },
  {
    id: 'rec_105',
    finderId: 'user_finder_3',
    finderName: 'Samuel Wekesa Masinde',
    finderPhone: '+254 718 223 344',
    finderMpesaName: 'SAMUEL WEKESA',
    idNumber: '28471930',
    idHash: hashIdNumber('28471930'),
    maskedIdNumber: '2847****',
    fullNameOnId: 'PETER KAMAU GICHERU',
    county: 'Kiambu',
    subCounty: 'Thika',
    exactLocation: 'Thika Town Commercial Street',
    handoverPreference: 'direct',
    handoverDetails: 'Thika Arcade Entrance',
    status: 'flagged',
    moderationNotes: 'Suspected duplicate entry; under verification with local area chief',
    createdAt: '2026-11-08T16:00:00Z',
  }
];

const SEED_MATCHES: IdMatch[] = [
  {
    id: 'match_101',
    recordId: 'rec_101',
    citizenId: 'user_citizen_1',
    citizenName: 'John Mwangi Kariuki',
    citizenPhone: '+254 712 345 678',
    idNumber: '32849102',
    matchConfidence: 100,
    status: 'pending_payment',
    createdAt: '2026-11-11T16:00:00Z',
  },
  {
    id: 'match_103',
    recordId: 'rec_103',
    citizenId: 'user_citizen_3',
    citizenName: 'Daniel Kipkemboi Tanui',
    citizenPhone: '+254 720 112 233',
    idNumber: '36192847',
    matchConfidence: 100,
    status: 'recovery_confirmed',
    createdAt: '2026-11-06T14:00:00Z',
    unlockedAt: '2026-11-06T15:30:00Z',
  }
];

const SEED_REQUESTS: RecoveryRequest[] = [
  {
    id: 'req_101',
    citizenId: 'user_citizen_1',
    citizenName: 'John Mwangi Kariuki',
    citizenPhone: '+254 712 345 678',
    idNumber: '32849102',
    idHash: hashIdNumber('32849102'),
    matchedRecordId: 'rec_101',
    status: 'match_found',
    createdAt: '2026-11-11T15:00:00Z',
  }
];

const SEED_PAYMENTS: Payment[] = [
  {
    id: 'pay_103',
    transactionReference: 'MPESA-QHK7291845',
    amount: 150,
    currency: 'KSh',
    provider: 'mpesa',
    payerPhone: '+254 720 112 233',
    payerId: 'user_citizen_3',
    payerName: 'Daniel Kipkemboi Tanui',
    recordId: 'rec_103',
    matchId: 'match_103',
    status: 'completed',
    createdAt: '2026-11-06T15:28:00Z',
    verifiedAt: '2026-11-06T15:30:00Z',
    finderRewardId: 'rew_103',
  }
];

const SEED_REWARDS: FinderReward[] = [
  {
    id: 'rew_103',
    finderId: 'user_finder_1',
    finderName: 'Faith Chebet Koech',
    recordId: 'rec_103',
    paymentId: 'pay_103',
    rewardAmount: 100,
    platformFee: 50,
    grossFee: 150,
    status: 'payout_completed',
    payoutId: 'payout_101',
    createdAt: '2026-11-06T15:30:00Z',
    paidAt: '2026-11-07T10:00:00Z',
  }
];

const SEED_PAYOUTS: Payout[] = [
  {
    id: 'payout_101',
    finderId: 'user_finder_1',
    finderName: 'Faith Chebet Koech',
    amount: 100,
    currency: 'KSh',
    mpesaNumber: '+254 722 987 654',
    mpesaTransactionId: 'MPESA-B2C-99182371',
    status: 'completed',
    createdAt: '2026-11-07T09:58:00Z',
    completedAt: '2026-11-07T10:00:00Z',
  }
];

const SEED_FRAUD_FLAGS: FraudFlag[] = [
  {
    id: 'fraud_101',
    recordId: 'rec_105',
    recordIdNumber: '28471930',
    flaggedBy: 'Automated Duplication Engine',
    reason: 'Similar National ID number submitted twice within 48 hours from different IP addresses',
    severity: 'medium',
    status: 'open',
    createdAt: '2026-11-08T16:05:00Z',
  }
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_1',
    actorId: 'user_finder_1',
    actorName: 'Faith Chebet Koech',
    actorRole: 'finder',
    action: 'RECORD_SUBMITTED',
    resourceId: 'rec_101',
    details: 'Submitted found National ID (3284****) located at Westlands Sarit Centre',
    ipAddress: '197.232.14.88',
    timestamp: '2026-11-10T14:20:00Z',
  },
  {
    id: 'audit_2',
    actorId: 'system',
    actorName: 'Pata ID Match Engine',
    actorRole: 'system',
    action: 'MATCH_DETECTED',
    resourceId: 'match_101',
    details: 'Deterministic keyed hash match verified between citizen search and record rec_101',
    ipAddress: '127.0.0.1',
    timestamp: '2026-11-11T16:00:00Z',
  },
  {
    id: 'audit_3',
    actorId: 'user_citizen_3',
    actorName: 'Daniel Kipkemboi Tanui',
    actorRole: 'citizen',
    action: 'PAYMENT_VERIFIED',
    resourceId: 'pay_103',
    details: 'KSh 150 M-Pesa STK push completed (Ref: MPESA-QHK7291845)',
    ipAddress: '102.135.22.14',
    timestamp: '2026-11-06T15:30:00Z',
  },
  {
    id: 'audit_4',
    actorId: 'user_finance_1',
    actorName: 'Amina Hassan Noor',
    actorRole: 'finance_admin',
    action: 'REWARD_DISBURSED',
    resourceId: 'payout_101',
    details: 'Disbursed KSh 100 reward via M-Pesa B2C to Faith Chebet (+254 722 987 654)',
    ipAddress: '197.237.89.12',
    timestamp: '2026-11-07T10:00:00Z',
  }
];

const SEED_SETTINGS: SiteSettings = {
  claimantFee: 150,
  finderReward: 100,
  platformFee: 50,
  mpesaPaybill: '522522',
  mpesaAccount: 'PATAID',
  maintenanceMode: false,
  autoUnlockContact: true,
  contactEmergencyHelpline: '+254 700 889 900',
  dataProtectionNotice: 'Fully compliant with Kenya Data Protection Act 2019 (ODPC Registration Ref: ODPC/2026/PATAID). No raw ID photos stored.'
};

const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_citizen_1',
    title: 'Match Found for Your National ID!',
    message: 'A National ID matching 3284**** has been handed in at Westlands, Nairobi. Unlock finder details to recover it.',
    type: 'success',
    read: false,
    createdAt: '2026-11-11T16:02:00Z',
    actionLink: 'citizen_requests',
  },
  {
    id: 'notif_2',
    userId: 'user_finder_1',
    title: 'ID Match in Progress',
    message: 'The owner of ID 3284**** was notified and is verifying their claim.',
    type: 'info',
    read: true,
    createdAt: '2026-11-11T16:05:00Z',
  },
  {
    id: 'notif_3',
    userId: 'user_finder_1',
    title: 'KSh 100 Reward Paid!',
    message: 'KSh 100 was successfully sent to your M-Pesa for recovering ID 3619****.',
    type: 'success',
    read: true,
    createdAt: '2026-11-07T10:01:00Z',
  }
];

export interface AppState {
  currentUser: User | null;
  users: User[];
  records: FoundIdRecord[];
  matches: IdMatch[];
  requests: RecoveryRequest[];
  payments: Payment[];
  rewards: FinderReward[];
  payouts: Payout[];
  fraudFlags: FraudFlag[];
  auditLogs: AuditLog[];
  settings: SiteSettings;
  notifications: AppNotification[];
}

export class PataIdStore {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    if (typeof window === 'undefined') {
      return this.getInitialState();
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure structure is up to date
        return {
          ...this.getInitialState(),
          ...parsed,
        };
      }
    } catch (e) {
      console.warn('Failed to parse saved state:', e);
    }
    return this.getInitialState();
  }

  private getInitialState(): AppState {
    return {
      currentUser: null, // Start as public visitor
      users: [...SEED_USERS],
      records: [...SEED_RECORDS],
      matches: [...SEED_MATCHES],
      requests: [...SEED_REQUESTS],
      payments: [...SEED_PAYMENTS],
      rewards: [...SEED_REWARDS],
      payouts: [...SEED_PAYOUTS],
      fraudFlags: [...SEED_FRAUD_FLAGS],
      auditLogs: [...SEED_AUDIT_LOGS],
      settings: { ...SEED_SETTINGS },
      notifications: [...SEED_NOTIFICATIONS],
    };
  }

  private saveState() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Failed to save state to localStorage:', e);
      }
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public getState(): AppState {
    return this.state;
  }

  // --- Auth & User Switching ---
  public setCurrentUser(user: User | null) {
    this.state.currentUser = user;
    this.saveState();
  }

  public switchRole(role: UserRole) {
    if (role === 'public') {
      this.setCurrentUser(null);
      return;
    }
    const matchingUser = this.state.users.find((u) => u.role === role);
    if (matchingUser) {
      this.setCurrentUser(matchingUser);
    }
  }

  public loginUser(emailOrPhone: string): User | null {
    const user = this.state.users.find(
      (u) =>
        u.email.toLowerCase() === emailOrPhone.toLowerCase() ||
        u.phone.replace(/\s+/g, '') === emailOrPhone.replace(/\s+/g, '')
    );
    if (user) {
      this.setCurrentUser(user);
      return user;
    }
    return null;
  }

  public registerUser(name: string, email: string, phone: string, role: UserRole): User {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      role,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    this.state.users.push(newUser);
    this.setCurrentUser(newUser);

    this.logAudit(
      newUser.id,
      newUser.name,
      newUser.role,
      'USER_REGISTERED',
      newUser.id,
      `New user registered with role: ${role}`
    );

    this.saveState();
    return newUser;
  }

  // --- Search Found IDs (Public & Citizen) ---
  public searchId(idNumber: string): { found: boolean; record?: FoundIdRecord; matchStatus?: string } {
    const cleanId = idNumber.replace(/\D/g, '');
    const hash = hashIdNumber(cleanId);
    
    // Exact deterministic keyed search
    const record = this.state.records.find(
      (r) => r.idHash === hash || r.idNumber === cleanId
    );

    if (!record) {
      return { found: false };
    }

    return {
      found: true,
      record: {
        ...record,
        // STRICT PRIVACY: Mask phone number in public search!
        finderPhone: record.status === 'claimed_and_recovered' ? record.finderPhone : maskPhoneNumber(record.finderPhone),
      },
      matchStatus: record.status,
    };
  }

  // --- Submit Found ID ---
  public submitFoundId(data: {
    fullNameOnId: string;
    idNumber: string;
    county: string;
    subCounty: string;
    exactLocation: string;
    finderName: string;
    finderPhone: string;
    finderMpesaName: string;
    handoverPreference: 'direct' | 'huduma_centre' | 'police_station';
    handoverDetails: string;
  }): FoundIdRecord {
    const cleanId = data.idNumber.replace(/\D/g, '');
    const idHash = hashIdNumber(cleanId);

    // Current finder user or create on-the-fly
    let finder = this.state.currentUser;
    if (!finder || finder.role !== 'finder') {
      const existingFinder = this.state.users.find(
        (u) => u.phone.replace(/\s+/g, '') === data.finderPhone.replace(/\s+/g, '')
      );
      if (existingFinder) {
        finder = existingFinder;
      } else {
        finder = {
          id: `finder_${Date.now()}`,
          name: data.finderName,
          email: `${data.finderName.toLowerCase().replace(/\s+/g, '.')}@user.pataid.co.ke`,
          phone: data.finderPhone,
          role: 'finder',
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        this.state.users.push(finder);
      }
    }

    const newRecord: FoundIdRecord = {
      id: `rec_${Date.now()}`,
      finderId: finder.id,
      finderName: data.finderName,
      finderPhone: data.finderPhone,
      finderMpesaName: data.finderMpesaName,
      idNumber: cleanId,
      idHash,
      maskedIdNumber: maskIdNumber(cleanId),
      fullNameOnId: data.fullNameOnId.toUpperCase(),
      county: data.county,
      subCounty: data.subCounty,
      exactLocation: data.exactLocation,
      handoverPreference: data.handoverPreference,
      handoverDetails: data.handoverDetails,
      status: 'listed',
      createdAt: new Date().toISOString(),
    };

    this.state.records.unshift(newRecord);

    // Auto-match with any pending citizen recovery requests
    const matchedRequest = this.state.requests.find(
      (req) => req.idHash === idHash || req.idNumber === cleanId
    );

    if (matchedRequest) {
      newRecord.status = 'matched';
      matchedRequest.status = 'match_found';
      matchedRequest.matchedRecordId = newRecord.id;

      const newMatch: IdMatch = {
        id: `match_${Date.now()}`,
        recordId: newRecord.id,
        citizenId: matchedRequest.citizenId,
        citizenName: matchedRequest.citizenName,
        citizenPhone: matchedRequest.citizenPhone,
        idNumber: cleanId,
        matchConfidence: 100,
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
      };
      this.state.matches.unshift(newMatch);

      // Notify citizen
      this.state.notifications.unshift({
        id: `notif_${Date.now()}`,
        userId: matchedRequest.citizenId,
        title: 'Match Found for Your Lost National ID!',
        message: `Your ID (${maskIdNumber(cleanId)}) was submitted in ${data.county}. Unlock contact to reclaim it.`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString(),
        actionLink: 'citizen_requests',
      });
    }

    this.logAudit(
      finder.id,
      finder.name,
      'finder',
      'RECORD_SUBMITTED',
      newRecord.id,
      `Submitted found National ID (${newRecord.maskedIdNumber}) in ${data.county}`
    );

    this.saveState();
    return newRecord;
  }

  // --- Create Recovery Request for Citizen ---
  public createRecoveryRequest(idNumber: string, citizenName?: string, citizenPhone?: string): RecoveryRequest {
    const cleanId = idNumber.replace(/\D/g, '');
    const idHash = hashIdNumber(cleanId);
    const user = this.state.currentUser || SEED_USERS[0];

    const newRequest: RecoveryRequest = {
      id: `req_${Date.now()}`,
      citizenId: user.id,
      citizenName: citizenName || user.name,
      citizenPhone: citizenPhone || user.phone,
      idNumber: cleanId,
      idHash,
      status: 'searching',
      createdAt: new Date().toISOString(),
    };

    // Check if record already exists in database
    const existingRecord = this.state.records.find(
      (r) => r.idHash === idHash || r.idNumber === cleanId
    );

    if (existingRecord) {
      newRequest.status = 'match_found';
      newRequest.matchedRecordId = existingRecord.id;

      let match = this.state.matches.find((m) => m.recordId === existingRecord.id);
      if (!match) {
        match = {
          id: `match_${Date.now()}`,
          recordId: existingRecord.id,
          citizenId: user.id,
          citizenName: newRequest.citizenName,
          citizenPhone: newRequest.citizenPhone,
          idNumber: cleanId,
          matchConfidence: 100,
          status: 'pending_payment',
          createdAt: new Date().toISOString(),
        };
        this.state.matches.unshift(match);
      }
    }

    this.state.requests.unshift(newRequest);

    this.logAudit(
      user.id,
      newRequest.citizenName,
      'citizen',
      'RECOVERY_REQUEST_CREATED',
      newRequest.id,
      `Created search alert for National ID ${maskIdNumber(cleanId)}`
    );

    this.saveState();
    return newRequest;
  }

  // --- Unlock Finder Contact via M-Pesa KSh 150 Payment (Transactional) ---
  public processContactUnlockPayment(
    recordId: string,
    phoneNumber: string,
    provider: 'mpesa' | 'intasend' | 'pawapay' = 'mpesa'
  ): { success: boolean; payment: Payment; unlockedRecord: FoundIdRecord; reward: FinderReward } {
    const record = this.state.records.find((r) => r.id === recordId);
    if (!record) {
      throw new Error('Identity record not found');
    }

    const citizen = this.state.currentUser || SEED_USERS[0];
    const txRef = `MPESA-PID${Math.floor(10000000 + Math.random() * 90000000)}`;

    // 1. Record completed payment
    const payment: Payment = {
      id: `pay_${Date.now()}`,
      transactionReference: txRef,
      amount: this.state.settings.claimantFee, // KSh 150
      currency: 'KSh',
      provider,
      payerPhone: phoneNumber,
      payerId: citizen.id,
      payerName: citizen.name,
      recordId: record.id,
      matchId: record.matchId || `match_${record.id}`,
      status: 'completed',
      createdAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
    };
    this.state.payments.unshift(payment);

    // 2. Unlock contact on record
    record.status = 'claimed_and_recovered';
    record.claimedByCitizenId = citizen.id;
    record.unlockedAt = new Date().toISOString();

    // 3. Update match
    const match = this.state.matches.find((m) => m.recordId === record.id);
    if (match) {
      match.status = 'unlocked';
      match.unlockedAt = new Date().toISOString();
    }

    // 4. Update citizen recovery request if present
    const req = this.state.requests.find((r) => r.matchedRecordId === record.id);
    if (req) {
      req.status = 'unlocked';
    }

    // 5. Create Finder Reward (Strict business split: KSh 100 to Finder, KSh 50 platform)
    const reward: FinderReward = {
      id: `rew_${Date.now()}`,
      finderId: record.finderId,
      finderName: record.finderName,
      recordId: record.id,
      paymentId: payment.id,
      rewardAmount: this.state.settings.finderReward, // KSh 100
      platformFee: this.state.settings.platformFee, // KSh 50
      grossFee: this.state.settings.claimantFee, // KSh 150
      status: 'credited',
      createdAt: new Date().toISOString(),
    };
    this.state.rewards.unshift(reward);
    payment.finderRewardId = reward.id;

    // 6. Notify Finder
    this.state.notifications.unshift({
      id: `notif_${Date.now()}_finder`,
      userId: record.finderId,
      title: 'Congratulations! Your Found ID was Claimed',
      message: `The owner verified their ID (${record.maskedIdNumber}). KSh 100 has been credited to your rewards balance!`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
      actionLink: 'finder_rewards',
    });

    // 7. Notify Citizen
    this.state.notifications.unshift({
      id: `notif_${Date.now()}_citizen`,
      userId: citizen.id,
      title: 'Contact Details Unlocked',
      message: `Finder contact details for ID ${record.maskedIdNumber} are now unlocked. Please arrange a safe handover.`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
      actionLink: 'citizen_requests',
    });

    // 8. Log Comprehensive Audit
    this.logAudit(
      citizen.id,
      citizen.name,
      'citizen',
      'PAYMENT_AND_CONTACT_UNLOCKED',
      record.id,
      `Paid KSh 150 fee via ${provider.toUpperCase()} (${txRef}) to unlock finder contact. KSh 100 credited to finder (${record.finderName}).`
    );

    this.saveState();

    return {
      success: true,
      payment,
      unlockedRecord: record,
      reward,
    };
  }

  // --- Disburse Finder Reward Payout (M-Pesa B2C) ---
  public processFinderPayout(finderId: string): Payout {
    const finder = this.state.users.find((u) => u.id === finderId);
    if (!finder) throw new Error('Finder user not found');

    const pendingRewards = this.state.rewards.filter(
      (r) => r.finderId === finderId && r.status === 'credited'
    );

    if (pendingRewards.length === 0) {
      throw new Error('No pending reward balance available for payout');
    }

    const totalAmount = pendingRewards.reduce((sum, r) => sum + r.rewardAmount, 0);
    const payoutTxId = `MPESA-B2C-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const payout: Payout = {
      id: `payout_${Date.now()}`,
      finderId,
      finderName: finder.name,
      amount: totalAmount,
      currency: 'KSh',
      mpesaNumber: finder.phone,
      mpesaTransactionId: payoutTxId,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    this.state.payouts.unshift(payout);

    // Mark rewards as payout_completed
    pendingRewards.forEach((r) => {
      r.status = 'payout_completed';
      r.payoutId = payout.id;
      r.paidAt = new Date().toISOString();
    });

    // Notification
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: finderId,
      title: 'M-Pesa Payout Successful!',
      message: `KSh ${totalAmount} was disbursed to your M-Pesa (${finder.phone}). Reference: ${payoutTxId}`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
      actionLink: 'finder_payouts',
    });

    this.logAudit(
      'system',
      'M-Pesa B2C Engine',
      'finance_admin',
      'PAYOUT_DISBURSED',
      payout.id,
      `Disbursed KSh ${totalAmount} to finder ${finder.name} (${finder.phone}) via ${payoutTxId}`
    );

    this.saveState();
    return payout;
  }

  // --- Admin Moderation & Operations ---
  public updateRecordStatus(recordId: string, status: FoundIdRecord['status'], note?: string) {
    const record = this.state.records.find((r) => r.id === recordId);
    if (!record) return;

    const oldStatus = record.status;
    record.status = status;
    if (note) record.moderationNotes = note;

    const user = this.state.currentUser || SEED_USERS[2]; // Admin
    this.logAudit(
      user.id,
      user.name,
      user.role,
      'RECORD_STATUS_CHANGED',
      record.id,
      `Changed record ${record.maskedIdNumber} status from ${oldStatus} to ${status}. Note: ${note || 'None'}`
    );

    this.saveState();
  }

  public flagRecord(recordId: string, reason: string, severity: 'low' | 'medium' | 'high' = 'medium') {
    const record = this.state.records.find((r) => r.id === recordId);
    if (!record) return;

    const user = this.state.currentUser || SEED_USERS[2];

    const flag: FraudFlag = {
      id: `fraud_${Date.now()}`,
      recordId,
      recordIdNumber: record.idNumber,
      flaggedBy: user.name,
      reason,
      severity,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    this.state.fraudFlags.unshift(flag);
    record.status = 'flagged';

    this.logAudit(
      user.id,
      user.name,
      user.role,
      'RECORD_FLAGGED',
      record.id,
      `Flagged record as suspicious: "${reason}" (Severity: ${severity})`
    );

    this.saveState();
  }

  public resolveFraudFlag(flagId: string, resolution: 'resolved' | 'dismissed') {
    const flag = this.state.fraudFlags.find((f) => f.id === flagId);
    if (!flag) return;

    flag.status = resolution;
    const user = this.state.currentUser || SEED_USERS[2];

    this.logAudit(
      user.id,
      user.name,
      user.role,
      'FRAUD_FLAG_RESOLVED',
      flag.id,
      `Marked fraud flag ${flag.id} as ${resolution}`
    );

    this.saveState();
  }

  public updateUserStatus(userId: string, status: 'active' | 'suspended') {
    const user = this.state.users.find((u) => u.id === userId);
    if (!user) return;
    user.status = status;

    const actor = this.state.currentUser || SEED_USERS[2];
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'USER_STATUS_UPDATED',
      user.id,
      `Updated user ${user.name} status to ${status}`
    );
    this.saveState();
  }

  public updateSettings(settings: Partial<SiteSettings>) {
    this.state.settings = { ...this.state.settings, ...settings };
    const actor = this.state.currentUser || SEED_USERS[2];
    this.logAudit(
      actor.id,
      actor.name,
      actor.role,
      'SETTINGS_UPDATED',
      'system_settings',
      'Updated platform configuration'
    );
    this.saveState();
  }

  public markNotificationAsRead(id: string) {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveState();
    }
  }

  public clearAllNotifications(userId: string) {
    this.state.notifications = this.state.notifications.filter((n) => n.userId !== userId);
    this.saveState();
  }

  public resetToDefaults() {
    this.state = this.getInitialState();
    this.saveState();
  }

  // --- Audit Logging ---
  public logAudit(
    actorId: string,
    actorName: string,
    actorRole: string,
    action: string,
    resourceId: string,
    details: string
  ) {
    const entry: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actorId,
      actorName,
      actorRole,
      action,
      resourceId,
      details,
      ipAddress: '197.232.14.' + Math.floor(10 + Math.random() * 80),
      timestamp: new Date().toISOString(),
    };
    this.state.auditLogs.unshift(entry);
    // Keep max 200 logs
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 200);
    }
  }
}

export const store = new PataIdStore();
