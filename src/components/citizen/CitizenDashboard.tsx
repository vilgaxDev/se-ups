import React, { useState } from 'react';
import { User, FoundIdRecord, IdMatch, RecoveryRequest, Payment } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Input } from '../ui/Input.tsx';
import { store } from '../../services/store.ts';
import { useToast } from '../ui/Toast.tsx';
import {
  Search,
  CheckCircle2,
  Clock,
  Phone,
  ShieldCheck,
  CreditCard,
  Building2,
  Lock,
  ExternalLink,
  Download,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface CitizenDashboardProps {
  user: User;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onInitiateUnlock: (record: FoundIdRecord) => void;
  onSearchId: (idNumber: string) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  user,
  activeTab,
  onTabChange,
  onInitiateUnlock,
  onSearchId,
}) => {
  const { toast } = useToast();
  const state = store.getState();

  const userRequests = state.requests.filter((r) => r.citizenId === user.id);
  const userMatches = state.matches.filter((m) => m.citizenId === user.id);
  const userPayments = state.payments.filter((p) => p.payerId === user.id);

  // Search input inside Citizen portal
  const [citizenSearchInput, setCitizenSearchInput] = useState('');
  const [profileName, setProfileName] = useState(user.name);
  const [profilePhone, setProfilePhone] = useState(user.phone);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [supportMessage, setSupportMessage] = useState('');

  const handleCreateNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = citizenSearchInput.replace(/\D/g, '');
    if (clean.length < 6) {
      toast({ type: 'error', message: 'Please enter a valid National ID number (at least 6 digits)' });
      return;
    }
    const req = store.createRecoveryRequest(clean, user.name, user.phone);
    setCitizenSearchInput('');
    toast({
      type: 'success',
      title: 'Search Alert Created',
      message: `We are actively monitoring submissions for ID #${req.idNumber}. You will be notified the instant it is handed in.`,
    });
    onSearchId(clean);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    user.name = profileName;
    user.phone = profilePhone;
    user.email = profileEmail;
    toast({ type: 'success', message: 'Profile details saved successfully' });
  };

  const handleDataExportRequest = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
      user,
      requests: userRequests,
      payments: userPayments,
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `pata_id_data_export_${user.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast({ type: 'success', message: 'Data export downloaded (Kenya DPA 2019 Article 26)' });
  };

  return (
    <div className="space-y-6">
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E3EAE4] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#146B50] bg-[#E8F4ED] px-3 py-1 rounded-full">
                Citizen Identity Account
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123C30]">
                Welcome back, {user.name.split(' ')[0]}
              </h1>
              <p className="text-xs sm:text-sm text-[#627168] max-w-xl">
                Track your lost National ID recovery requests, review real-time match alerts,
                and safely coordinate handovers with Good Samaritan finders.
              </p>
            </div>

            <Button
              variant="lime"
              size="lg"
              onClick={() => onTabChange('citizen_search')}
              leftIcon={<Search className="w-4 h-4" />}
            >
              Search for My ID
            </Button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs">
              <span className="text-[11px] font-bold text-[#89968E] uppercase tracking-wider">
                Active Recovery Requests
              </span>
              <p className="text-2xl font-black text-[#123C30] mt-1">{userRequests.length}</p>
              <p className="text-[11px] text-[#627168] mt-1">Monitored 24/7 across Kenya</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs">
              <span className="text-[11px] font-bold text-[#89968E] uppercase tracking-wider">
                Matches Located
              </span>
              <p className="text-2xl font-black text-[#146B50] mt-1">{userMatches.length}</p>
              <p className="text-[11px] text-[#167447] mt-1 font-semibold">
                {userMatches.filter((m) => m.status === 'unlocked').length} contact details unlocked
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs">
              <span className="text-[11px] font-bold text-[#89968E] uppercase tracking-wider">
                Recovery Payments
              </span>
              <p className="text-2xl font-black text-[#123C30] mt-1">
                KSh {userPayments.reduce((sum, p) => sum + p.amount, 0)}
              </p>
              <p className="text-[11px] text-[#627168] mt-1">M-Pesa verified transactions</p>
            </div>
          </div>

          {/* Active Potential Matches Alert Section */}
          {userMatches.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#123C30]">
                  Potential Matches for Your Document
                </h3>
                <span className="text-xs text-[#146B50] font-semibold">
                  {userMatches.length} match(es) detected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userMatches.map((match) => {
                  const record = state.records.find((r) => r.id === match.recordId);
                  if (!record) return null;
                  const isUnlocked = match.status === 'unlocked' || record.status === 'claimed_and_recovered';

                  return (
                    <div
                      key={match.id}
                      className="p-5 bg-white rounded-2xl border-2 border-[#146B50]/30 shadow-xs space-y-3 relative"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant={isUnlocked ? 'success' : 'lime'} size="sm">
                            {isUnlocked ? 'Contact Unlocked' : 'Match Found — Awaiting Payment'}
                          </Badge>
                          <h4 className="text-base font-bold text-[#123C30] mt-1.5">
                            ID #{record.maskedIdNumber}
                          </h4>
                          <p className="text-xs text-[#627168]">
                            Registered to: <strong>{record.fullNameOnId}</strong>
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#146B50] bg-[#E8F4ED] px-2 py-0.5 rounded">
                          100% Match
                        </span>
                      </div>

                      <div className="text-xs space-y-1.5 text-[#627168] pt-1 border-t border-[#EDF1ED]">
                        <p>
                          <strong>Location Found:</strong> {record.subCounty}, {record.county}
                        </p>
                        <p>
                          <strong>Handover Point:</strong> {record.handoverDetails}
                        </p>
                        {isUnlocked ? (
                          <div className="p-2.5 bg-[#E8F4ED] rounded-xl text-xs space-y-1 text-[#123C30]">
                            <p className="font-bold flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-[#146B50]" />
                              Finder Phone: {record.finderPhone} ({record.finderName})
                            </p>
                            <p className="text-[11px] text-[#627168]">
                              Call or WhatsApp the finder to coordinate safe pickup.
                            </p>
                          </div>
                        ) : (
                          <p className="text-[#A96B19] font-medium flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Finder telephone locked until KSh 150 M-Pesa fee
                          </p>
                        )}
                      </div>

                      <div className="pt-2">
                        {isUnlocked ? (
                          <a
                            href={`tel:${record.finderPhone.replace(/\s+/g, '')}`}
                            className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#146B50] text-white text-xs font-bold hover:bg-[#123C30] transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call Finder ({record.finderName})
                          </a>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => onInitiateUnlock(record)}
                            leftIcon={<CreditCard className="w-3.5 h-3.5" />}
                          >
                            Unlock Contact (KSh 150)
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Useful Next Actions Card */}
          <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#123C30]">Safety Recommendations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#627168]">
              <div className="p-3 bg-[#F5F8F3] rounded-xl">
                <p className="font-bold text-[#123C30] mb-0.5">1. Never send advance money directly</p>
                <p>Only pay through Pata ID’s verified M-Pesa escrow to ensure finder contact unlocking.</p>
              </div>
              <div className="p-3 bg-[#F5F8F3] rounded-xl">
                <p className="font-bold text-[#123C30] mb-0.5">2. Meet at official Huduma Centres</p>
                <p>Desks at GPO, City Square, Kibra, and countrywide branches offer a secure handover environment.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search for My ID Tab */}
      {activeTab === 'citizen_search' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-[#123C30]">Search or Set Recovery Alert</h2>
            <p className="text-xs text-[#627168]">
              Check our live database. If your ID isn't found right away, we will keep an active alert
              and notify you via SMS/Email the moment it is turned in.
            </p>
          </div>

          <form
            onSubmit={handleCreateNewRequest}
            className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-4"
          >
            <Input
              label="Your National ID Number"
              placeholder="e.g. 32849102"
              value={citizenSearchInput}
              onChange={(e) => setCitizenSearchInput(e.target.value)}
              required
              hint="7 or 8 digits as registered on your document"
            />

            <Button
              type="submit"
              variant="lime"
              size="lg"
              className="w-full font-bold"
              leftIcon={<Search className="w-4 h-4" />}
            >
              Search & Monitor This ID
            </Button>
          </form>

          {/* Active Watched IDs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#123C30]">Your Monitored ID Numbers</h3>
            {userRequests.length === 0 ? (
              <p className="text-xs text-[#89968E]">No active search alerts yet.</p>
            ) : (
              userRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-white rounded-xl border border-[#E3EAE4] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-[#123C30]">National ID #{req.idNumber}</span>
                    <p className="text-[11px] text-[#627168]">
                      Monitoring since {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={req.status === 'match_found' ? 'lime' : 'neutral'} size="sm">
                    {req.status === 'match_found' ? 'Match Available!' : 'Active Monitoring'}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* My Recovery Requests Tab */}
      {activeTab === 'citizen_requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#123C30]">My Recovery Requests</h2>
              <p className="text-xs text-[#627168]">All lost ID searches linked to your account.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTabChange('citizen_search')}
              leftIcon={<Search className="w-3.5 h-3.5" />}
            >
              Add New ID
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAE4] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F3] border-b border-[#EDF1ED] text-[#627168] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">National ID</th>
                    <th className="py-3 px-4">Citizen Name</th>
                    <th className="py-3 px-4">Date Monitored</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF1ED] text-[#17251F]">
                  {userRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#F5F8F3]/50">
                      <td className="py-3 px-4 font-bold text-[#123C30]">#{req.idNumber}</td>
                      <td className="py-3 px-4">{req.citizenName}</td>
                      <td className="py-3 px-4 text-[#627168]">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            req.status === 'unlocked'
                              ? 'success'
                              : req.status === 'match_found'
                              ? 'lime'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {req.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {req.matchedRecordId ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              const rec = state.records.find((r) => r.id === req.matchedRecordId);
                              if (rec) onInitiateUnlock(rec);
                            }}
                          >
                            View Match
                          </Button>
                        ) : (
                          <span className="text-[11px] text-[#89968E]">Scanning...</span>
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

      {/* Payments Tab */}
      {activeTab === 'citizen_payments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#123C30]">Payment History</h2>
              <p className="text-xs text-[#627168]">
                Audited M-Pesa receipts for contact unlocking fees.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAE4] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F3] border-b border-[#EDF1ED] text-[#627168] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Transaction Ref</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Payer Phone</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF1ED] text-[#17251F]">
                  {userPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#89968E]">
                        No payment transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    userPayments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-[#F5F8F3]/50">
                        <td className="py-3 px-4 font-mono font-bold text-[#146B50]">
                          {pay.transactionReference}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#123C30]">
                          {pay.currency} {pay.amount}.00
                        </td>
                        <td className="py-3 px-4 uppercase font-semibold text-[#627168]">
                          {pay.provider}
                        </td>
                        <td className="py-3 px-4">{pay.payerPhone}</td>
                        <td className="py-3 px-4 text-[#627168]">
                          {new Date(pay.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="success" size="sm">
                            {pay.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === 'citizen_account' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#123C30]">My Profile & Privacy</h2>
            <p className="text-xs text-[#627168]">
              Manage your telephone number, notification settings, and data rights.
            </p>
          </div>

          <form
            onSubmit={handleSaveProfile}
            className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-4"
          >
            <Input
              label="Full Name"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
            />
            <Input
              label="Telephone Number"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              required
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary">
                Save Profile
              </Button>
            </div>
          </form>

          {/* Privacy & DPA Rights Card */}
          <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-[#123C30] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#146B50]" />
              Kenya Data Protection Act 2019 Rights
            </h3>
            <p className="text-xs text-[#627168] leading-relaxed">
              Under Sections 26 and 40 of the Kenya Data Protection Act 2019, you have the right
              to request an export of all personal data held, or request deletion of your account
              and recovery search history once an ID is reclaimed.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDataExportRequest}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Export My Data (JSON)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#C13F43] hover:bg-[#FDF2F2]"
                onClick={() => toast({ type: 'info', message: 'Account deletion request queued for moderation review' })}
              >
                Request Account Deletion
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Tab */}
      {activeTab === 'citizen_help' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-[#123C30]">Help & Support Desk</h2>
            <p className="text-xs text-[#627168]">
              Have questions about handovers, disputed matches, or M-Pesa receipts? We're here to help.
            </p>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-4">
            <Input
              label="Your Message or Inquiry"
              placeholder="e.g. Need assistance with handover at Nairobi GPO..."
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={() => {
                if (!supportMessage.trim()) return;
                toast({
                  type: 'success',
                  title: 'Support Ticket Submitted',
                  message: 'A support specialist will contact you on your registered telephone number shortly.',
                });
                setSupportMessage('');
              }}
            >
              Send Support Request
            </Button>
          </div>

          <div className="p-4 bg-[#E8F4ED] rounded-xl border border-[#146B50]/20 text-xs text-[#123C30] space-y-1">
            <p className="font-bold">Official Hotline:</p>
            <p>Direct Phone: +254 700 889 900</p>
            <p>Emergency Lost ID WhatsApp: +254 700 889 901</p>
          </div>
        </div>
      )}
    </div>
  );
};
