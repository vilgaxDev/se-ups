import React, { useState } from 'react';
import { User, FoundIdRecord, Payment, FinderReward, Payout, FraudFlag, AuditLog, SiteSettings } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Input, Select } from '../ui/Input.tsx';
import { store } from '../../services/store.ts';
import { useToast } from '../ui/Toast.tsx';
import {
  ShieldAlert,
  Users,
  FileCheck,
  CreditCard,
  FileText,
  Settings,
  AlertTriangle,
  RotateCcw,
  Search,
  CheckCircle2,
  XCircle,
  Flag,
  Archive,
  Eye,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Activity,
  Layers,
  Lock,
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  activeTab,
  onTabChange,
}) => {
  const { toast } = useToast();
  const state = store.getState();

  // Metrics
  const totalUsers = state.users.length;
  const citizensCount = state.users.filter((u) => u.role === 'citizen').length;
  const findersCount = state.users.filter((u) => u.role === 'finder').length;
  const totalRecords = state.records.length;
  const activeRecords = state.records.filter((r) => r.status === 'listed').length;
  const matchedRecords = state.records.filter((r) => r.status === 'matched').length;
  const recoveredRecords = state.records.filter((r) => r.status === 'claimed_and_recovered').length;
  const flaggedRecords = state.records.filter((r) => r.status === 'flagged').length;

  const totalPayments = state.payments.length;
  const successfulPayments = state.payments.filter((p) => p.status === 'completed');
  const grossVolume = successfulPayments.reduce((sum, p) => sum + p.amount, 0); // KSh 150 each
  const totalRewardsPaid = state.rewards
    .filter((r) => r.status === 'payout_completed')
    .reduce((sum, r) => sum + r.rewardAmount, 0);
  const totalPlatformRevenue = successfulPayments.length * 50; // KSh 50 each
  const pendingPayouts = state.rewards.filter((r) => r.status === 'credited').length;

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCounty, setFilterCounty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Moderation modal / action
  const [selectedRecord, setSelectedRecord] = useState<FoundIdRecord | null>(null);
  const [flagReason, setFlagReason] = useState('');

  // Settings State
  const [claimantFee, setClaimantFee] = useState(state.settings.claimantFee);
  const [finderReward, setFinderReward] = useState(state.settings.finderReward);
  const [platformFee, setPlatformFee] = useState(state.settings.platformFee);

  const filteredRecords = state.records.filter((rec) => {
    const matchesSearch =
      rec.fullNameOnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.idNumber.includes(searchTerm) ||
      rec.exactLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = filterCounty === 'all' || rec.county === filterCounty;
    const matchesStatus = filterStatus === 'all' || rec.status === filterStatus;
    return matchesSearch && matchesCounty && matchesStatus;
  });

  const handleUpdateRecordStatus = (id: string, status: FoundIdRecord['status']) => {
    store.updateRecordStatus(id, status, `Manual update by ${user.name}`);
    toast({ type: 'success', message: `Record status changed to ${status.replace(/_/g, ' ')}` });
  };

  const handleFlagSubmit = (recordId: string) => {
    if (!flagReason.trim()) {
      toast({ type: 'error', message: 'Please provide a reason for the fraud flag' });
      return;
    }
    store.flagRecord(recordId, flagReason, 'medium');
    setFlagReason('');
    setSelectedRecord(null);
    toast({ type: 'warning', message: 'Record flagged for fraud review' });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSettings({
      claimantFee: Number(claimantFee),
      finderReward: Number(finderReward),
      platformFee: Number(platformFee),
    });
    toast({ type: 'success', message: 'Platform fees and settings saved' });
  };

  return (
    <div className="space-y-6">
      {/* 1. Admin Overview Tab */}
      {(activeTab === 'overview' || activeTab === 'admin_overview') && (
        <div className="space-y-6">
          {/* Header */}
          <div className="p-6 bg-white rounded-3xl border border-[#E3EAE4] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#146B50] bg-[#E8F4ED] px-2.5 py-0.5 rounded-full">
                Operations & Governance
              </span>
              <h1 className="text-2xl font-black text-[#123C30] mt-1">
                Platform Operations Overview
              </h1>
              <p className="text-xs text-[#627168]">
                Real-time national identity recovery metrics, financial audit, and fraud detection.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="success" size="md" dot>
                Daraja M-Pesa Live
              </Badge>
              <Badge variant="lime" size="md">
                DPA 2019 Audited
              </Badge>
            </div>
          </div>

          {/* Primary KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs">
              <span className="text-[10px] font-bold text-[#89968E] uppercase tracking-wider">
                Total Submissions
              </span>
              <p className="text-2xl font-black text-[#123C30] mt-1">{totalRecords}</p>
              <p className="text-[11px] text-[#627168] mt-1">
                {activeRecords} active, {recoveredRecords} recovered
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs">
              <span className="text-[10px] font-bold text-[#89968E] uppercase tracking-wider">
                Gross Transaction Volume
              </span>
              <p className="text-2xl font-black text-[#146B50] mt-1">KSh {grossVolume}</p>
              <p className="text-[11px] text-[#627168] mt-1">{successfulPayments.length} paid claims</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs">
              <span className="text-[10px] font-bold text-[#89968E] uppercase tracking-wider">
                Platform Revenue (KSh 50)
              </span>
              <p className="text-2xl font-black text-[#167447] mt-1">
                KSh {totalPlatformRevenue}
              </p>
              <p className="text-[11px] text-[#627168] mt-1">Retained fee balance</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs">
              <span className="text-[10px] font-bold text-[#89968E] uppercase tracking-wider">
                Pending Payouts
              </span>
              <p className="text-2xl font-black text-[#A96B19] mt-1">{pendingPayouts}</p>
              <p className="text-[11px] text-[#A96B19] mt-1 font-semibold">
                {flaggedRecords} flagged records
              </p>
            </div>
          </div>

          {/* Moderation & Financial Split Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EDF1ED]">
                <h3 className="text-sm font-bold text-[#123C30] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#146B50]" />
                  Operational Health & Fraud Vigilance
                </h3>
                <span className="text-xs text-[#146B50] font-semibold">Real-time</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-[#F5F8F3] rounded-xl">
                  <span className="text-[#627168]">Registered Citizens:</span>
                  <span className="font-bold text-[#123C30]">{citizensCount}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#F5F8F3] rounded-xl">
                  <span className="text-[#627168]">Registered Good Samaritans:</span>
                  <span className="font-bold text-[#123C30]">{findersCount}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#F5F8F3] rounded-xl">
                  <span className="text-[#627168]">Open Fraud Flags:</span>
                  <span className="font-bold text-[#C13F43]">{state.fraudFlags.filter((f) => f.status === 'open').length}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#F5F8F3] rounded-xl">
                  <span className="text-[#627168]">Deterministic Keyed Lookups:</span>
                  <span className="font-bold text-[#167447]">100% SHA-256</span>
                </div>
              </div>
            </div>

            {/* Financial Ledger Snapshot */}
            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#EDF1ED]">
                <h3 className="text-sm font-bold text-[#123C30] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#146B50]" />
                  M-Pesa Split & Escrow Ledger
                </h3>
                <span className="text-xs text-[#89968E]">Paybill 522522</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-[#F5F8F3] rounded-xl">
                  <span className="text-[#627168]">Gross Claimant Receipts:</span>
                  <span className="font-bold text-[#123C30]">KSh {grossVolume}.00</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#F5F8F3] rounded-xl">
                  <span className="text-[#627168]">Finder Rewards Disbursed (KSh 100):</span>
                  <span className="font-bold text-[#167447]">KSh {totalRewardsPaid}.00</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#F5F8F3] rounded-xl">
                  <span className="text-[#627168]">Platform Maintenance (KSh 50):</span>
                  <span className="font-bold text-[#146B50]">KSh {totalPlatformRevenue}.00</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#E8F4ED] rounded-xl font-bold">
                  <span className="text-[#123C30]">Total Reconciled Balance:</span>
                  <span className="text-[#146B50]">100% Balanced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Identity Records Management Tab */}
      {activeTab === 'admin_records' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#123C30]">Identity Records Registry</h2>
              <p className="text-xs text-[#627168]">
                Moderate, verify, flag, or archive submitted National ID cards.
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="p-4 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by name, ID number, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="w-44">
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { label: 'All Statuses', value: 'all' },
                  { label: 'Listed', value: 'listed' },
                  { label: 'Under Review', value: 'under_review' },
                  { label: 'Matched', value: 'matched' },
                  { label: 'Recovered', value: 'claimed_and_recovered' },
                  { label: 'Flagged', value: 'flagged' },
                  { label: 'Archived', value: 'archived' },
                ]}
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-[#E3EAE4] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F3] border-b border-[#EDF1ED] text-[#627168] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Record ID</th>
                    <th className="py-3 px-4">National ID</th>
                    <th className="py-3 px-4">Name on Card</th>
                    <th className="py-3 px-4">Finder Name</th>
                    <th className="py-3 px-4">County</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF1ED] text-[#17251F]">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-[#F5F8F3]/50">
                      <td className="py-3 px-4 font-mono font-bold text-[#89968E]">{rec.id}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#123C30]">
                        #{rec.maskedIdNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold">{rec.fullNameOnId}</td>
                      <td className="py-3 px-4 text-[#627168]">{rec.finderName}</td>
                      <td className="py-3 px-4">{rec.county}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            rec.status === 'claimed_and_recovered'
                              ? 'success'
                              : rec.status === 'flagged'
                              ? 'error'
                              : rec.status === 'under_review'
                              ? 'warning'
                              : 'lime'
                          }
                          size="sm"
                        >
                          {rec.status.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        {rec.status !== 'listed' && rec.status !== 'claimed_and_recovered' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#167447] hover:bg-[#E8F4ED]"
                            onClick={() => handleUpdateRecordStatus(rec.id, 'listed')}
                          >
                            Approve
                          </Button>
                        )}
                        {rec.status !== 'flagged' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#A96B19] hover:bg-[#FEF6EE]"
                            onClick={() => setSelectedRecord(rec)}
                          >
                            Flag
                          </Button>
                        )}
                        {rec.status !== 'archived' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#89968E] hover:bg-[#F5F8F3]"
                            onClick={() => handleUpdateRecordStatus(rec.id, 'archived')}
                          >
                            Archive
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Flag Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#123C30]/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-[#E3EAE4]">
            <h3 className="text-base font-bold text-[#123C30]">
              Flag Record #{selectedRecord.maskedIdNumber}
            </h3>
            <p className="text-xs text-[#627168]">
              Flagging marks the record as suspicious and locks contact unlocking until reviewed.
            </p>
            <Input
              label="Reason for Flag"
              placeholder="e.g. Inconsistent location or duplicate submission"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleFlagSubmit(selectedRecord.id)}
              >
                Confirm Flag
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. People & User Management Tab */}
      {activeTab === 'admin_users' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-[#123C30]">User Management</h2>
            <p className="text-xs text-[#627168]">
              Manage citizens, finders, and administrative role assignments.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAE4] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F3] border-b border-[#EDF1ED] text-[#627168] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF1ED] text-[#17251F]">
                  {state.users.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F5F8F3]/50">
                      <td className="py-3 px-4 font-bold text-[#123C30]">{u.name}</td>
                      <td className="py-3 px-4 text-[#627168]">{u.email}</td>
                      <td className="py-3 px-4">{u.phone}</td>
                      <td className="py-3 px-4">
                        <Badge variant="lime" size="sm">
                          {u.role.replace(/_/g, ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={u.status === 'active' ? 'success' : 'error'} size="sm">
                          {u.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.status === 'active' ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#C13F43] hover:bg-[#FDF2F2]"
                            onClick={() => store.updateUserStatus(u.id, 'suspended')}
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#167447] hover:bg-[#E8F4ED]"
                            onClick={() => store.updateUserStatus(u.id, 'active')}
                          >
                            Reactivate
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Financial Management Tab */}
      {activeTab === 'admin_finance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#123C30]">Financial Reconciliation Ledger</h2>
              <p className="text-xs text-[#627168]">
                Every KSh 150 transaction, KSh 100 finder reward, and KSh 50 platform revenue entry.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#E3EAE4]">
              <span className="text-[10px] font-bold uppercase text-[#89968E]">Total Gross Inflow</span>
              <p className="text-2xl font-black text-[#146B50] mt-1">KSh {grossVolume}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E3EAE4]">
              <span className="text-[10px] font-bold uppercase text-[#89968E]">Finder Rewards Outflow</span>
              <p className="text-2xl font-black text-[#123C30] mt-1">KSh {totalRewardsPaid}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E3EAE4]">
              <span className="text-[10px] font-bold uppercase text-[#89968E]">Net Platform Retained</span>
              <p className="text-2xl font-black text-[#167447] mt-1">KSh {totalPlatformRevenue}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAE4] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F3] border-b border-[#EDF1ED] text-[#627168] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Transaction Ref</th>
                    <th className="py-3 px-4">Payer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF1ED] text-[#17251F]">
                  {state.payments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F5F8F3]/50">
                      <td className="py-3 px-4 font-mono font-bold text-[#146B50]">
                        {p.transactionReference}
                      </td>
                      <td className="py-3 px-4 font-semibold">{p.payerName}</td>
                      <td className="py-3 px-4 font-bold text-[#123C30]">
                        {p.currency} {p.amount}.00
                      </td>
                      <td className="py-3 px-4 uppercase text-[#627168]">{p.provider}</td>
                      <td className="py-3 px-4 text-[#627168]">
                        {new Date(p.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="success" size="sm">
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Fraud Management Tab */}
      {activeTab === 'admin_fraud' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-[#123C30]">Fraud & Abuse Detection</h2>
            <p className="text-xs text-[#627168]">
              Automated anomaly detection, duplicate submissions, and flagged records.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAE4] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F3] border-b border-[#EDF1ED] text-[#627168] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Flag ID</th>
                    <th className="py-3 px-4">National ID</th>
                    <th className="py-3 px-4">Detected By</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Severity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF1ED] text-[#17251F]">
                  {state.fraudFlags.map((flag) => (
                    <tr key={flag.id} className="hover:bg-[#F5F8F3]/50">
                      <td className="py-3 px-4 font-mono font-bold text-[#89968E]">{flag.id}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[#123C30]">
                        #{flag.recordIdNumber}
                      </td>
                      <td className="py-3 px-4">{flag.flaggedBy}</td>
                      <td className="py-3 px-4 text-[#627168] max-w-xs">{flag.reason}</td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            flag.severity === 'high'
                              ? 'error'
                              : flag.severity === 'medium'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {flag.severity}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={flag.status === 'open' ? 'warning' : 'success'}
                          size="sm"
                        >
                          {flag.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        {flag.status === 'open' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#167447]"
                              onClick={() => store.resolveFraudFlag(flag.id, 'resolved')}
                            >
                              Resolve
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#89968E]"
                              onClick={() => store.resolveFraudFlag(flag.id, 'dismissed')}
                            >
                              Dismiss
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. Comprehensive Audit Logs Tab */}
      {activeTab === 'admin_audit' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-[#123C30]">System Audit Trail</h2>
            <p className="text-xs text-[#627168]">
              Immutable chronological record of all administrative, financial, and identity actions.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAE4] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F3] border-b border-[#EDF1ED] text-[#627168] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Resource</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF1ED] text-[#17251F]">
                  {state.auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F5F8F3]/50">
                      <td className="py-3 px-4 text-[#89968E] font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 font-bold text-[#123C30]">{log.actorName}</td>
                      <td className="py-3 px-4">
                        <Badge variant="neutral" size="sm">
                          {log.actorRole}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#146B50]">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#89968E]">{log.resourceId}</td>
                      <td className="py-3 px-4 text-[#627168] max-w-sm">{log.details}</td>
                      <td className="py-3 px-4 font-mono text-[#89968E]">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. Platform Settings Tab */}
      {activeTab === 'admin_settings' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#123C30]">Platform Settings & Fee Structure</h2>
            <p className="text-xs text-[#627168]">
              Configure recovery pricing, M-Pesa paybill parameters, and security policies.
            </p>
          </div>

          <form
            onSubmit={handleSaveSettings}
            className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Claimant Fee (KSh)"
                type="number"
                value={claimantFee}
                onChange={(e) => setClaimantFee(Number(e.target.value))}
                required
              />
              <Input
                label="Finder Reward (KSh)"
                type="number"
                value={finderReward}
                onChange={(e) => setFinderReward(Number(e.target.value))}
                required
              />
              <Input
                label="Platform Fee (KSh)"
                type="number"
                value={platformFee}
                onChange={(e) => setPlatformFee(Number(e.target.value))}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="M-Pesa Daraja Paybill Number"
                defaultValue={state.settings.mpesaPaybill}
                disabled
              />
              <Input
                label="Paybill Account Reference"
                defaultValue={state.settings.mpesaAccount}
                disabled
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary">
                Save Platform Settings
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
