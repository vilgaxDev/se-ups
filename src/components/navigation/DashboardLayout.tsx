import React, { useState, useEffect } from 'react';
import { UserRole, User, AppNotification } from '../../types/index.ts';
import {
  Menu,
  X,
  Bell,
  LogOut,
  ChevronRight,
  Shield,
  Smartphone,
  CheckCircle,
} from 'lucide-react';
import { Badge } from '../ui/Badge.tsx';
import { store } from '../../services/store.ts';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
  badgeVariant?: 'success' | 'warning' | 'info' | 'lime';
}

export interface NavGroup {
  title?: string;
  items: NavItem[];
}

interface DashboardLayoutProps {
  role: UserRole;
  user: User | null;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  navGroups: NavGroup[];
  bottomNavItems?: NavItem[];
  notifications: AppNotification[];
  onLogout: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role,
  user,
  activeTab,
  onTabChange,
  navGroups,
  bottomNavItems = [],
  notifications,
  onLogout,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close mobile drawer on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const roleLabel = {
    public: 'Visitor',
    citizen: 'Citizen Portal',
    finder: 'Finder Portal',
    admin: 'Super Admin',
    finance_admin: 'Finance Admin',
    support: 'Support Staff',
  }[role];

  return (
    <div className="min-h-screen bg-[#F5F8F3] text-[#17251F] flex flex-col antialiased">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E3EAE4] px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="lg:hidden p-2 -ml-2 rounded-xl text-[#123C30] hover:bg-[#F5F8F3] transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo and Brand */}
          <div
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[#146B50] flex items-center justify-center shadow-xs">
              <img src="/logo.svg" alt="Pata ID logo" className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-[#123C30]">
                  PATA<span className="text-[#146B50]"> ID</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EDF8C9] text-[#123C30] border border-[#D6F36A]">
                  KE
                </span>
              </div>
              <p className="text-[10px] font-medium text-[#627168] -mt-0.5 hidden sm:block">
                National Identity Recovery
              </p>
            </div>
          </div>
        </div>

        {/* Center / Role Badge */}
        <div className="hidden sm:flex items-center gap-2">
          <Badge variant="lime" size="sm" dot>
            {roleLabel}
          </Badge>
          <span className="text-xs text-[#89968E]">|</span>
          <span className="text-xs text-[#627168] font-medium flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#146B50]" />
            DPA 2019 Secured
          </span>
        </div>

        {/* Right Actions: Notifications & User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl text-[#627168] hover:text-[#17251F] hover:bg-[#F5F8F3] transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#146B50] ring-2 ring-white" />
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E3EAE4] p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-[#EDF1ED]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#123C30]">Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="success" size="sm">
                        {unreadCount} new
                      </Badge>
                    )}
                  </div>
                  {user && (
                    <button
                      onClick={() => store.clearAllNotifications(user.id)}
                      className="text-xs text-[#146B50] hover:underline cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[#EDF1ED] max-h-72 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#89968E]">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          store.markNotificationAsRead(notif.id);
                          if (notif.actionLink) onTabChange(notif.actionLink);
                          setNotifDropdownOpen(false);
                        }}
                        className={`py-3 px-2 rounded-xl transition-colors cursor-pointer ${
                          notif.read ? 'hover:bg-[#F5F8F3]' : 'bg-[#E8F4ED]/40 hover:bg-[#E8F4ED]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-[#123C30]">{notif.title}</p>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-[#146B50] shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-[#627168] mt-1 line-clamp-2">{notif.message}</p>
                        <span className="text-[10px] text-[#89968E] mt-1.5 block">
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Logout */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E3EAE4]">
              <div className="w-8 h-8 rounded-full bg-[#146B50] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                {user.name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-[#123C30] truncate max-w-[120px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-[#89968E] capitalize">{user.role.replace('_', ' ')}</p>
              </div>
              <button
                onClick={onLogout}
                title="Switch or log out"
                className="p-1.5 rounded-lg text-[#89968E] hover:text-[#C13F43] hover:bg-[#FDF2F2] transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onTabChange('login')}
              className="text-xs font-semibold text-[#146B50] hover:text-[#123C30] px-3 py-1.5 rounded-lg border border-[#146B50] hover:bg-[#E8F4ED] transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Body with Desktop Sidebar + Content */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-[#E3EAE4] transition-all duration-200 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Collapse Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-[#EDF1ED]">
            {!sidebarCollapsed && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#89968E]">
                Navigation
              </span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-lg text-[#89968E] hover:text-[#17251F] hover:bg-[#F5F8F3] mx-auto cursor-pointer"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`}
              />
            </button>
          </div>

          {/* Navigation Groups */}
          <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {group.title && !sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#89968E] mb-2">
                    {group.title}
                  </p>
                )}
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#146B50] text-white shadow-xs'
                          : 'text-[#627168] hover:bg-[#F5F8F3] hover:text-[#123C30]'
                      } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                    >
                      <span className={isActive ? 'text-white' : 'text-[#146B50]'}>
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                      {!sidebarCollapsed && item.badge !== undefined && (
                        <Badge
                          variant={isActive ? 'lime' : item.badgeVariant || 'neutral'}
                          size="sm"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer Info */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-[#EDF1ED] bg-[#F5F8F3]/50">
              <div className="flex items-center gap-2 text-[11px] font-medium text-[#627168]">
                <Smartphone className="w-4 h-4 text-[#146B50]" />
                <span>Pata ID PWA v1.0</span>
              </div>
              <p className="text-[10px] text-[#89968E] mt-1">
                M-Pesa Verified Recovery Network
              </p>
            </div>
          )}
        </aside>

        {/* Mobile Slide-in Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-[#123C30]/50 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
              <div className="p-4 flex items-center justify-between border-b border-[#E3EAE4]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#146B50] flex items-center justify-center">
                    <img src="/logo.svg" alt="Pata ID" className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-sm text-[#123C30]">Pata ID Menu</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#89968E] hover:text-[#17251F] hover:bg-[#F5F8F3]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Drawer Role Badge */}
              <div className="p-3 bg-[#E8F4ED]/50 border-b border-[#E3EAE4] flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#627168]">Active Role</p>
                  <p className="text-xs font-bold text-[#146B50]">{roleLabel}</p>
                </div>
                {user && (
                  <span className="text-xs text-[#123C30] font-medium">{user.name.split(' ')[0]}</span>
                )}
              </div>

              {/* Navigation Items */}
              <div className="flex-1 p-3 overflow-y-auto space-y-4">
                {navGroups.map((group, idx) => (
                  <div key={idx} className="space-y-1">
                    {group.title && (
                      <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#89968E]">
                        {group.title}
                      </p>
                    )}
                    {group.items.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onTabChange(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#146B50] text-white shadow-xs'
                              : 'text-[#627168] hover:bg-[#F5F8F3] hover:text-[#123C30]'
                          }`}
                        >
                          <span className={isActive ? 'text-white' : 'text-[#146B50]'}>
                            {item.icon}
                          </span>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge !== undefined && (
                            <Badge
                              variant={isActive ? 'lime' : item.badgeVariant || 'neutral'}
                              size="sm"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Mobile Drawer Footer */}
              <div className="p-4 border-t border-[#EDF1ED] space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-[#C13F43] bg-[#FDF2F2] hover:bg-[#fae6e6]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Exit Session</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (First-class mobile UX) */}
      {bottomNavItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E3EAE4] py-2 px-3 flex items-center justify-around z-30 safe-bottom shadow-lg">
          {bottomNavItems.slice(0, 4).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
                  isActive ? 'text-[#146B50]' : 'text-[#89968E] hover:text-[#17251F]'
                }`}
              >
                <div className="relative">
                  {item.icon}
                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#146B50] text-[9px] font-bold text-white flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-[#146B50] absolute -bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
