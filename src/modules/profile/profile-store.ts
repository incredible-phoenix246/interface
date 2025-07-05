import create from 'zustand';

export interface Connection {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  username?: string;
}

export interface ReferralCode {
  code: string;
  used: boolean;
}

interface SignatureRequest {
  type: 'username' | 'referralCode';
  data: string;
  isOpen: boolean;
}

interface ProfileState {
  // Profile data
  username: string;
  firstName: string;
  lastName: string;
  points: number;
  referrals: number;
  avatar: string;

  // Connections
  connections: Connection[];

  // Referral codes
  referralCodes: ReferralCode[];
  maxReferralCodes: number;

  // UI state
  signatureRequest: SignatureRequest;
  customReferralDialog: boolean;
  customReferralCode: string;

  // Actions
  updateProfile: (data: {
    avatar?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    referralCodes?: ReferralCode[];
    points?: number;
    referrals?: number;
  }) => void;
  toggleConnection: (id: string) => void;
  generateReferralCode: () => void;
  createCustomReferralCode: (code: string) => void;
  openSignatureRequest: (type: 'username' | 'referralCode', data: string) => void;
  closeSignatureRequest: () => void;
  setCustomReferralDialog: (open: boolean) => void;
  setCustomReferralCode: (code: string) => void;
  deleteReferralCode: (index: number) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  // Initial state
  username: 'Codemon',
  firstName: 'Aired',
  lastName: 'Bayo',
  points: 1500,
  referrals: 0,
  avatar: '/placeholder.svg?height=80&width=80',

  connections: [
    // { id: 'wallet', name: 'Wallet', icon: '💎', connected: true, username: '0x3de...84bft' },
    {
      id: 'twitter',
      name: 'X (Formerly Twitter)',
      icon: '𝕏',
      connected: true,
      username: 'codemon',
    },
    { id: 'discord', name: 'Discord', icon: '💬', connected: true, username: 'codemon' },
  ],

  referralCodes: [],
  maxReferralCodes: 5,

  signatureRequest: {
    type: 'username',
    data: '',
    isOpen: false,
  },
  customReferralDialog: false,
  customReferralCode: '',

  // Actions
  updateProfile: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  toggleConnection: (id) =>
    set((state) => ({
      connections: state.connections.map((conn) =>
        conn.id === id ? { ...conn, connected: !conn.connected } : conn
      ),
    })),

  generateReferralCode: () => {
    const state = get();
    if (state.referralCodes.length >= state.maxReferralCodes) return;

    const newCode = `EDGEN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    set((state) => ({
      referralCodes: [...state.referralCodes, { code: newCode, used: false }],
    }));
  },

  createCustomReferralCode: (code) => {
    set((state) => ({
      referralCodes: [...state.referralCodes, { code, used: false }],
      customReferralDialog: false,
      customReferralCode: '',
    }));
  },

  openSignatureRequest: (type, data) =>
    set({
      signatureRequest: { type, data, isOpen: true },
    }),

  closeSignatureRequest: () =>
    set((state) => ({
      signatureRequest: { ...state.signatureRequest, isOpen: false },
    })),

  setCustomReferralDialog: (open) => set({ customReferralDialog: open }),

  setCustomReferralCode: (code) => set({ customReferralCode: code }),

  deleteReferralCode: (index) =>
    set((state) => ({
      referralCodes: state.referralCodes.filter((_, i) => i !== index),
    })),
}));
