import React, { useState } from 'react';
import { User, FoundIdRecord, FinderReward, Payout } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { Input } from '../ui/Input.tsx';
import { store } from '../../services/store.ts';
import { useToast } from '../ui/Toast.tsx';
import {
  PlusCircle,
  Gift,
  CheckCircle2,
  Clock,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  Building2,
  DollarSign,
  AlertCircle,
  Download,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface FinderDashboardProps {
  user: User;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onOpenSubmitModal: () => void;
}

export const FinderDashboard: React.FC<FinderDashboardProps> = ({
  user,
  activeTab,
  onTabChange,
  onOpenSubmitModal,
}) => {
  const { toast } = useToast();
  const state = store.getState();

  const userRecords = state.records.filter((r) => r.finderId === user.id);
  const userRewards = state.rewards.filter((r) => r.finderId === user.id);
  const userPayouts = state.payouts.filter((p) => p.finderId === user.id);

  // Rewards calculation
  const totalEarned = userRewards.reduce((sum, r) => sum + r.rewardAmount, 0);
  const pendingRewardBalance = userRewards
    .filter((r) => r.status === 'credited')
    .reduce((sum, r) => sum + r.rewardAmount, 0);
  const totalPaidOut = userPayouts
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const [isProcessingPayout, setIsProcessingPayout] = useState(false);

  const handleRequestPayout = () => {
    if (pendingRewardBalance <= 0) {
      toast({ type: 'info', message: 'You have no pending reward balance to disburse.' });
      return;
    }

    setIsProcessingPayout(true);
    setTimeout(() => {
      try {
        const payout = store.processFinderPayout(user.id);
        setIsProcessingPayout(false);
        toast({
          type: 'success',
          title: 'M-Pesa Payout Successful!',
          message: `KSh ${payout.amount} disbursed to ${payout.mpesaNumber}. Ref: ${payout.mpesaTransactionId}`,
        });
      } catch (err: any) {
        setIsProcessingPayout(false);
        toast({ type: 'error', message: err.message || 'Payout failed' });
      }
    }, 1200);
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
                Good Samaritan Network
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123C30]">
                Jambo, {user.name.split(' ')[0]}
              </h1>
              <p className="text-xs sm:text-sm text-[#627168] max-w-xl">
                Thank you for helping reunite fellow Kenyans with their lost National IDs.
                Manage your submissions, track recoveries, and withdraw your KSh 100 rewards.
              </p>
            </div>

            <Button
              variant="lime"
              size="lg"
              onClick={onOpenSubmitModal}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Submit Found ID
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs">
              <span className="text-[10px] font-bold text-[#89968E] uppercase tracking-wider">
                Total Submitted IDs
              </span>
              <p className="text-2xl font-black text-[#123C30] mt-1">{userRecords.length}</p>
              <p className="text-[11px] text-[#627168] mt-1">Listed on registry</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs">
              <span className="text-[10px] font-bold text-[#89968E] uppercase tracking-wider">
                Successful Recoveries
              </span>
              <p className="text-2xl font-black text-[#167447] mt-1">
                {userRecords.filter((r) => r.status === 'claimed_and_recovered').length}
              </p>
              <p className="text-[11px] text-[#627168] mt-1">Claimants reunited</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs">
              <span className="text-[10px] font-bold text-[#89968E] uppercase tracking-wider">
                Pending Reward Balance
              </span>
              <p className="text-2xl font-black text-[#146B50] mt-1">
                KSh {pendingRewardBalance}
              </p>
              <p className="text-[11px] text-[#146B50] font-semibold mt-1">Ready for M-Pesa</p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs">
              <span className="text-[10px] font-bold text-[#89968E] uppercase tracking-wider">
                Total Rewards Earned
              </span>
              <p className="text-2xl font-black text-[#123C30] mt-1">
                KSh {totalEarned}
              </p>
              <p className="text-[11px] text-[#627168] mt-1">KSh 100 per verified ID</p>
            </div>
          </div>

          {/* Pending Payout Action Card */}
          {pendingRewardBalance > 0 && (
            <div className="p-5 sm:p-6 bg-[#EDF8C9] border-2 border-[#D6F36A] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#123C30]">
                  <Sparkles className="w-4 h-4 text-[#146B50]" />
                  M-Pesa Reward Ready for Payout!
                </span>
                <p className="text-xs text-[#17251F]">
                  You have <strong>KSh {pendingRewardBalance}</strong> in verified finder rewards.
                  Disburse directly to your M-Pesa number (<strong>{user.phone}</strong>).
                </p>
              </div>

              <Button
                variant="primary"
                onClick={handleRequestPayout}
                isLoading={isProcessingPayout}
                leftIcon={<Smartphone className="w-4 h-4" />}
                className="shrink-0"
              >
                Withdraw KSh {pendingRewardBalance} via M-Pesa
              </Button>
            </div>
          )}

          {/* Recent Submissions List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#123C30]">Your Submitted IDs</h3>
              <button
                onClick={() => onTabChange('finder_submissions')}
                className="text-xs text-[#146B50] font-semibold hover:underline"
              >
                View all ({userRecords.length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRecords.map((rec) => {
                const isRecovered = rec.status === 'claimed_and_recovered';
                return (
                  <div
                    key={rec.id}
                    className="p-5 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge
                          variant={
                            isRecovered
                              ? 'success'
                              : rec.status === 'matched'
                              ? 'lime'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {rec.status.replace(/_/g, ' ')}
                        </Badge>
                        <h4 className="text-base font-bold text-[#123C30] mt-1.5">
                          #{rec.maskedIdNumber}
                        </h4>
                        <p className="text-xs text-[#627168]">
                          Name: <strong>{rec.fullNameOnId}</strong>
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#146B50] bg-[#E8F4ED] px-2 py-0.5 rounded">
                        {isRecovered ? 'Reward Credited' : 'KSh 100 Reward Eligible'}
                      </span>
                    </div>

                    <div className="text-xs text-[#627168] space-y-1 pt-1 border-t border-[#EDF1ED]">
                      <p>
                        <strong>Found:</strong> {rec.exactLocation} ({rec.subCounty}, {rec.county})
                      </p>
                      <p>
                        <strong>Handover:</strong> {rec.handoverDetails}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === 'finder_submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#123C30]">My Submissions</h2>
              <p className="text-xs text-[#627168]">
                All National ID cards you have submitted to Pata ID.
              </p>
            </div>
            <Button
              variant="lime"
              size="sm"
              onClick={onOpenSubmitModal}
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Submit New ID
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAE4] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F3] border-b border-[#EDF1ED] text-[#627168] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">National ID</th>
                    <th className="py-3 px-4">Name on Card</th>
                    <th className="py-3 px-4">County / Area</th>
                    <th className="py-3 px-4">Date Handed In</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Reward</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF1ED] text-[#17251F]">
                  {userRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#89968E]">
                        No IDs submitted yet. Click "Submit New ID" to register a found card.
                      </td>
                    </tr>
                  ) : (
                    userRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#F5F8F3]/50">
                        <td className="py-3 px-4 font-mono font-bold text-[#123C30]">
                          #{rec.maskedIdNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold">{rec.fullNameOnId}</td>
                        <td className="py-3 px-4 text-[#627168]">
                          {rec.subCounty}, {rec.county}
                        </td>
                        <td className="py-3 px-4 text-[#627168]">
                          {new Date(rec.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              rec.status === 'claimed_and_recovered'
                                ? 'success'
                                : rec.status === 'matched'
                                ? 'lime'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {rec.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#167447]">
                          {rec.status === 'claimed_and_recovered' ? 'KSh 100 (Credited)' : 'Pending Claim'}
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

      {/* Rewards Tab */}
      {activeTab === 'finder_rewards' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#123C30]">Rewards Ledger</h2>
              <p className="text-xs text-[#627168]">
                Transparent breakdown: KSh 100 awarded per verified ID recovery.
              </p>
            </div>
            {pendingRewardBalance > 0 && (
              <Button
                variant="lime"
                size="md"
                onClick={handleRequestPayout}
                isLoading={isProcessingPayout}
                leftIcon={<Smartphone className="w-4 h-4" />}
              >
                Withdraw KSh {pendingRewardBalance} to M-Pesa
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-[#E3EAE4]">
              <span className="text-[10px] font-bold uppercase text-[#89968E]">Pending Balance</span>
              <p className="text-2xl font-black text-[#146B50] mt-1">KSh {pendingRewardBalance}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E3EAE4]">
              <span className="text-[10px] font-bold uppercase text-[#89968E]">Total Paid Out</span>
              <p className="text-2xl font-black text-[#123C30] mt-1">KSh {totalPaidOut}</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#E3EAE4]">
              <span className="text-[10px] font-bold uppercase text-[#89968E]">All-Time Rewards</span>
              <p className="text-2xl font-black text-[#123C30] mt-1">KSh {totalEarned}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAE4] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F3] border-b border-[#EDF1ED] text-[#627168] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Reward ID</th>
                    <th className="py-3 px-4">Target Record</th>
                    <th className="py-3 px-4">Gross Claim Fee</th>
                    <th className="py-3 px-4">Your Reward</th>
                    <th className="py-3 px-4">Platform Fee</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF1ED] text-[#17251F]">
                  {userRewards.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-[#89968E]">
                        No rewards recorded yet. Once a claimant verifies your submitted ID, KSh 100 will be credited.
                      </td>
                    </tr>
                  ) : (
                    userRewards.map((rew) => (
                      <tr key={rew.id} className="hover:bg-[#F5F8F3]/50">
                        <td className="py-3 px-4 font-mono font-bold">{rew.id}</td>
                        <td className="py-3 px-4 font-mono text-[#627168]">{rew.recordId}</td>
                        <td className="py-3 px-4 font-semibold">KSh {rew.grossFee}</td>
                        <td className="py-3 px-4 font-bold text-[#167447]">KSh {rew.rewardAmount}</td>
                        <td className="py-3 px-4 text-[#89968E]">KSh {rew.platformFee}</td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={rew.status === 'payout_completed' ? 'success' : 'lime'}
                            size="sm"
                          >
                            {rew.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-[#627168]">
                          {new Date(rew.createdAt).toLocaleDateString()}
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

      {/* Payout History Tab */}
      {activeTab === 'finder_payouts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#123C30]">M-Pesa B2C Payout Receipts</h2>
              <p className="text-xs text-[#627168]">
                Instant disbursements sent directly to your registered M-Pesa line.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E3EAE4] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F5F8F3] border-b border-[#EDF1ED] text-[#627168] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">M-Pesa Transaction ID</th>
                    <th className="py-3 px-4">Amount Disbursed</th>
                    <th className="py-3 px-4">Recipient Phone</th>
                    <th className="py-3 px-4">Completed Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDF1ED] text-[#17251F]">
                  {userPayouts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-xs text-[#89968E]">
                        No payout disbursements yet.
                      </td>
                    </tr>
                  ) : (
                    userPayouts.map((pay) => (
                      <tr key={pay.id} className="hover:bg-[#F5F8F3]/50">
                        <td className="py-3 px-4 font-mono font-bold text-[#146B50]">
                          {pay.mpesaTransactionId}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#123C30]">
                          {pay.currency} {pay.amount}.00
                        </td>
                        <td className="py-3 px-4">{pay.mpesaNumber}</td>
                        <td className="py-3 px-4 text-[#627168]">
                          {new Date(pay.completedAt || pay.createdAt).toLocaleString()}
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
    </div>
  );
};
