import React from 'react';
import { UserRole } from '../../types/index.ts';
import { store } from '../../services/store.ts';
import { ShieldCheck, User, Users, Landmark, Headphones, Globe, RotateCcw } from 'lucide-react';

interface RoleQuickBarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onReset: () => void;
}

export const RoleQuickBar: React.FC<RoleQuickBarProps> = ({
  currentRole,
  onRoleChange,
  onReset,
}) => {
  const roles: { role: UserRole; label: string; icon: React.ReactNode; userDesc: string }[] = [
    { role: 'public', label: 'Public Visitor', icon: <Globe className="w-3.5 h-3.5" />, userDesc: 'Landing & Search' },
    { role: 'citizen', label: 'Citizen', icon: <User className="w-3.5 h-3.5" />, userDesc: 'John Mwangi (Lost ID)' },
    { role: 'finder', label: 'Finder', icon: <Users className="w-3.5 h-3.5" />, userDesc: 'Faith Chebet (Good Samaritan)' },
    { role: 'admin', label: 'Admin', icon: <ShieldCheck className="w-3.5 h-3.5" />, userDesc: 'Brian Ochieng (Super Admin)' },
    { role: 'finance_admin', label: 'Finance', icon: <Landmark className="w-3.5 h-3.5" />, userDesc: 'Amina Hassan (M-Pesa & Payouts)' },
    { role: 'support', label: 'Support', icon: <Headphones className="w-3.5 h-3.5" />, userDesc: 'Kevin Kiprono (Fraud & Tickets)' },
  ];

  return (
    <div className="bg-[#123C30] text-white border-b border-[#146B50] text-xs py-1.5 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-[#D6F36A] bg-[#146B50]/60 px-2 py-0.5 rounded-md">
            Role Sandbox
          </span>
          <span className="hidden md:inline text-[#E8F4ED]/80 text-[11px]">
            Switch personas to preview role-specific dashboards & access controls:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none max-w-full">
          {roles.map((r) => {
            const isActive = currentRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => {
                  store.switchRole(r.role);
                  onRoleChange(r.role);
                }}
                title={r.userDesc}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#D6F36A] text-[#123C30] shadow-sm font-semibold'
                    : 'bg-[#146B50]/40 text-[#E8F4ED] hover:bg-[#146B50] hover:text-white'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}

          <button
            onClick={onReset}
            title="Reset sandbox data to default seed records"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-[#89968E] hover:text-white hover:bg-[#146B50]/50 transition-colors ml-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
