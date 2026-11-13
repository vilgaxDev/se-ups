import React, { useState, useEffect } from 'react';
import { UserRole, User, FoundIdRecord, Payment } from './types/index.ts';
import { store, PataIdStore } from './services/store.ts';
import { ToastProvider, useToast } from './components/ui/Toast.tsx';
import { RoleQuickBar } from './components/ui/RoleQuickBar.tsx';
import { DashboardLayout, NavGroup, NavItem } from './components/navigation/DashboardLayout.tsx';
import { PublicLanding } from './components/public/PublicLanding.tsx';
import { CitizenDashboard } from './components/citizen/CitizenDashboard.tsx';
import { FinderDashboard } from './components/finder/FinderDashboard.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { SearchModal } from './components/public/SearchModal.tsx';
import { SubmitFoundIdModal } from './components/public/SubmitFoundIdModal.tsx';
import { MpesaUnlockModal } from './components/modals/MpesaUnlockModal.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { PwaInstallPrompt } from './components/pwa/PwaInstallPrompt.tsx';
import {
  Home,
  Search,
  PlusCircle,
  FileText,
  CreditCard,
  Bell,
  User as UserIcon,
  HelpCircle,
  Gift,
  ShieldCheck,
  Users,
  Activity,
  Layers,
  Settings,
  ShieldAlert,
  Building2,
  DollarSign,
} from 'lucide-react';

function PataIdApp() {
  const { toast } = useToast();
  const [appState, setAppState] = useState(store.getState());
  const [activeTab, setActiveTab] = useState('overview');

  // Modal States
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchIdQuery, setSearchIdQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ found: boolean; record?: FoundIdRecord; matchStatus?: string } | null>(null);

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [targetUnlockRecord, setTargetUnlockRecord] = useState<FoundIdRecord | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setAppState({ ...store.getState() });
    });
    return () => unsubscribe();
  }, []);

  const currentRole: UserRole = appState.currentUser ? appState.currentUser.role : 'public';

  const handleRoleChange = (newRole: UserRole) => {
    setActiveTab('overview');
    toast({
      type: 'info',
      message: `Switched view to ${newRole.toUpperCase().replace('_', ' ')} portal`,
    });
  };

  const handleResetData = () => {
    if (confirm('Reset Pata ID database to default test records?')) {
      store.resetToDefaults();
      toast({ type: 'success', message: 'Database reset to default seed records' });
    }
  };

  // Search Action
  const handlePerformSearch = (idNumber: string) => {
    const res = store.searchId(idNumber);
    setSearchIdQuery(idNumber);
    setSearchResult(res);
    setSearchModalOpen(true);
  };

  const handleInitiateUnlock = (record: FoundIdRecord) => {
    setSearchModalOpen(false);
    setTargetUnlockRecord(record);
    setUnlockModalOpen(true);
  };

  const handleCreateSearchAlert = (idNumber: string) => {
    store.createRecoveryRequest(idNumber);
    toast({
      type: 'success',
      title: 'Recovery Alert Set!',
      message: `We will send an instant SMS alert when ID #${idNumber} is submitted.`,
    });
  };

  // Navigation Definitions by Role
  const getNavGroups = (): NavGroup[] => {
    if (currentRole === 'public') {
      return [
        {
          items: [
            { id: 'overview', label: 'Home', icon: <Home className="w-4 h-4" /> },
            { id: 'search_action', label: 'Search Lost ID', icon: <Search className="w-4 h-4" /> },
            { id: 'submit_action', label: 'Submit Found ID', icon: <PlusCircle className="w-4 h-4" /> },
          ],
        },
        {
          title: 'Portals',
          items: [
            { id: 'portal_citizen', label: 'Citizen Portal', icon: <UserIcon className="w-4 h-4" /> },
            { id: 'portal_finder', label: 'Finder Portal', icon: <Gift className="w-4 h-4" /> },
            { id: 'portal_admin', label: 'Admin Portal', icon: <ShieldCheck className="w-4 h-4" /> },
          ],
        },
      ];
    }

    if (currentRole === 'citizen') {
      const activeMatchCount = appState.matches.filter(
        (m) => m.citizenId === appState.currentUser?.id && m.status === 'pending_payment'
      ).length;

      return [
        {
          items: [
            { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" /> },
            { id: 'citizen_search', label: 'Search for My ID', icon: <Search className="w-4 h-4" /> },
            {
              id: 'citizen_requests',
              label: 'Recovery Requests',
              icon: <FileText className="w-4 h-4" />,
              badge: activeMatchCount > 0 ? `${activeMatchCount} match` : undefined,
              badgeVariant: 'lime',
            },
            { id: 'citizen_payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
          ],
        },
        {
          title: 'Preferences',
          items: [
            { id: 'citizen_account', label: 'My Account', icon: <UserIcon className="w-4 h-4" /> },
            { id: 'citizen_help', label: 'Help & Support', icon: <HelpCircle className="w-4 h-4" /> },
          ],
        },
      ];
    }

    if (currentRole === 'finder') {
      const pendingRewardCount = appState.rewards.filter(
        (r) => r.finderId === appState.currentUser?.id && r.status === 'credited'
      ).length;

      return [
        {
          items: [
            { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" /> },
            { id: 'finder_submit', label: 'Submit Found ID', icon: <PlusCircle className="w-4 h-4" /> },
            {
              id: 'finder_submissions',
              label: 'My Submissions',
              icon: <FileText className="w-4 h-4" />,
              badge: appState.records.filter((r) => r.finderId === appState.currentUser?.id).length,
            },
            {
              id: 'finder_rewards',
              label: 'My Rewards',
              icon: <Gift className="w-4 h-4" />,
              badge: pendingRewardCount > 0 ? `KSh ${pendingRewardCount * 100}` : undefined,
              badgeVariant: 'lime',
            },
            { id: 'finder_payouts', label: 'Payout History', icon: <CreditCard className="w-4 h-4" /> },
          ],
        },
        {
          title: 'Support',
          items: [
            { id: 'finder_account', label: 'Account', icon: <UserIcon className="w-4 h-4" /> },
            { id: 'finder_help', label: 'Help', icon: <HelpCircle className="w-4 h-4" /> },
          ],
        },
      ];
    }

    // Admin / Finance / Support
    return [
      {
        title: 'Operations',
        items: [
          { id: 'admin_overview', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
          {
            id: 'admin_records',
            label: 'Identity Records',
            icon: <Layers className="w-4 h-4" />,
            badge: appState.records.length,
          },
          { id: 'admin_users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
        ],
      },
      {
        title: 'Financial Management',
        items: [
          {
            id: 'admin_finance',
            label: 'Reconciliation Ledger',
            icon: <DollarSign className="w-4 h-4" />,
            badge: `KSh ${appState.payments.length * 150}`,
          },
        ],
      },
      {
        title: 'Security & System',
        items: [
          {
            id: 'admin_fraud',
            label: 'Fraud & Abuse',
            icon: <ShieldAlert className="w-4 h-4" />,
            badge: appState.fraudFlags.filter((f) => f.status === 'open').length || undefined,
            badgeVariant: 'warning',
          },
          { id: 'admin_audit', label: 'Audit Trail', icon: <FileText className="w-4 h-4" /> },
          { id: 'admin_settings', label: 'Platform Settings', icon: <Settings className="w-4 h-4" /> },
        ],
      },
    ];
  };

  const getBottomNavItems = (): NavItem[] => {
    if (currentRole === 'public') {
      return [
        { id: 'overview', label: 'Home', icon: <Home className="w-5 h-5" /> },
        { id: 'search_action', label: 'Search ID', icon: <Search className="w-5 h-5" /> },
        { id: 'submit_action', label: 'Submit ID', icon: <PlusCircle className="w-5 h-5" /> },
        { id: 'login', label: 'Sign In', icon: <UserIcon className="w-5 h-5" /> },
      ];
    }
    if (currentRole === 'citizen') {
      return [
        { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
        { id: 'citizen_search', label: 'Search', icon: <Search className="w-5 h-5" /> },
        { id: 'citizen_requests', label: 'Requests', icon: <FileText className="w-5 h-5" /> },
        { id: 'citizen_payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
      ];
    }
    if (currentRole === 'finder') {
      return [
        { id: 'overview', label: 'Overview', icon: <Home className="w-5 h-5" /> },
        { id: 'finder_submit', label: 'Submit', icon: <PlusCircle className="w-5 h-5" /> },
        { id: 'finder_submissions', label: 'Cards', icon: <FileText className="w-5 h-5" /> },
        { id: 'finder_rewards', label: 'Rewards', icon: <Gift className="w-5 h-5" /> },
      ];
    }
    return [
      { id: 'admin_overview', label: 'Dashboard', icon: <Activity className="w-5 h-5" /> },
      { id: 'admin_records', label: 'Records', icon: <Layers className="w-5 h-5" /> },
      { id: 'admin_finance', label: 'Finance', icon: <DollarSign className="w-5 h-5" /> },
      { id: 'admin_audit', label: 'Audit', icon: <FileText className="w-5 h-5" /> },
    ];
  };

  const handleTabSelect = (tabId: string) => {
    if (tabId === 'search_action') {
      handlePerformSearch('32849102');
      return;
    }
    if (tabId === 'submit_action' || tabId === 'finder_submit') {
      setSubmitModalOpen(true);
      return;
    }
    if (tabId === 'login') {
      setAuthModalOpen(true);
      return;
    }
    if (tabId === 'portal_citizen') {
      store.switchRole('citizen');
      setActiveTab('overview');
      return;
    }
    if (tabId === 'portal_finder') {
      store.switchRole('finder');
      setActiveTab('overview');
      return;
    }
    if (tabId === 'portal_admin') {
      store.switchRole('admin');
      setActiveTab('overview');
      return;
    }
    setActiveTab(tabId);
  };

  const userNotifications = appState.currentUser
    ? appState.notifications.filter((n) => n.userId === appState.currentUser?.id)
    : [];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Top Demo Sandbox Role Switcher */}
      <RoleQuickBar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onReset={handleResetData}
      />

      {/* Main Responsive Layout */}
      <DashboardLayout
        role={currentRole}
        user={appState.currentUser}
        activeTab={activeTab}
        onTabChange={handleTabSelect}
        navGroups={getNavGroups()}
        bottomNavItems={getBottomNavItems()}
        notifications={userNotifications}
        onLogout={() => {
          store.setCurrentUser(null);
          setActiveTab('overview');
          toast({ type: 'info', message: 'Logged out. Now viewing as Public Visitor.' });
        }}
      >
        {/* Role-Specific Content */}
        {currentRole === 'public' && (
          <PublicLanding
            onSearch={handlePerformSearch}
            onOpenSubmitModal={() => setSubmitModalOpen(true)}
            onNavigatePortal={(role) => {
              store.switchRole(role);
              setActiveTab('overview');
            }}
          />
        )}

        {currentRole === 'citizen' && appState.currentUser && (
          <CitizenDashboard
            user={appState.currentUser}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onInitiateUnlock={handleInitiateUnlock}
            onSearchId={handlePerformSearch}
          />
        )}

        {currentRole === 'finder' && appState.currentUser && (
          <FinderDashboard
            user={appState.currentUser}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onOpenSubmitModal={() => setSubmitModalOpen(true)}
          />
        )}

        {(currentRole === 'admin' || currentRole === 'finance_admin' || currentRole === 'support') &&
          appState.currentUser && (
            <AdminDashboard
              user={appState.currentUser}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          )}
      </DashboardLayout>

      {/* Modals & Dialogs */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        idNumber={searchIdQuery}
        result={searchResult}
        onInitiateUnlock={handleInitiateUnlock}
        onCreateAlert={handleCreateSearchAlert}
      />

      <SubmitFoundIdModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSuccess={(record) => {
          // If in finder view, switch tab to submissions
          if (currentRole === 'finder') {
            setActiveTab('finder_submissions');
          }
        }}
      />

      <MpesaUnlockModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        record={targetUnlockRecord}
        onUnlocked={(record, payment) => {
          // Contact unlocked
        }}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(user) => {
          setActiveTab('overview');
        }}
      />

      {/* PWA Install Prompt */}
      <PwaInstallPrompt />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <PataIdApp />
    </ToastProvider>
  );
}
