import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog.tsx';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { FoundIdRecord, Payment } from '../../types/index.ts';
import { store } from '../../services/store.ts';
import { useToast } from '../ui/Toast.tsx';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  Building2,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface MpesaUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: FoundIdRecord | null;
  onUnlocked: (record: FoundIdRecord, payment: Payment) => void;
}

export const MpesaUnlockModal: React.FC<MpesaUnlockModalProps> = ({
  isOpen,
  onClose,
  record,
  onUnlocked,
}) => {
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('0712345678');
  const [provider, setProvider] = useState<'mpesa' | 'intasend' | 'pawapay'>('mpesa');
  const [stkState, setStkState] = useState<'idle' | 'push_sent' | 'verifying' | 'completed'>('idle');
  const [countdown, setCountdown] = useState(15);
  const [unlockedResult, setUnlockedResult] = useState<{ record: FoundIdRecord; payment: Payment } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setStkState('idle');
      setUnlockedResult(null);
      setCountdown(15);
    }
  }, [isOpen]);

  // STK Push countdown timer
  useEffect(() => {
    let timer: any;
    if (stkState === 'push_sent' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (stkState === 'push_sent' && countdown === 0) {
      // Simulate user entering PIN
      setStkState('verifying');
      setTimeout(() => {
        completePayment();
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [stkState, countdown]);

  if (!record) return null;

  const handleSendStkPush = () => {
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 9) {
      toast({ type: 'error', message: 'Please enter a valid Safaricom M-Pesa phone number' });
      return;
    }
    setStkState('push_sent');
    setCountdown(6); // 6 seconds simulation
  };

  const completePayment = () => {
    try {
      const res = store.processContactUnlockPayment(record.id, phoneNumber, provider);
      setUnlockedResult({
        record: res.unlockedRecord,
        payment: res.payment,
      });
      setStkState('completed');
      onUnlocked(res.unlockedRecord, res.payment);
      toast({
        type: 'success',
        title: 'M-Pesa Payment Confirmed!',
        message: `KSh 150 paid. Finder contact details for ID #${record.maskedIdNumber} are now unlocked!`,
      });
    } catch (err: any) {
      toast({ type: 'error', message: err.message || 'Payment processing failed' });
      setStkState('idle');
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={
        stkState === 'completed'
          ? 'Contact Unlocked — Ready for Recovery!'
          : 'Unlock Finder Contact Details'
      }
      maxWidth="md"
    >
      {stkState === 'completed' && unlockedResult ? (
        /* Unlocked details view */
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#E8F4ED] border border-[#167447]/30 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#167447] shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-bold text-[#123C30]">
                Payment Verified • Ref: {unlockedResult.payment.transactionReference}
              </p>
              <p className="text-[#627168] mt-0.5">
                KSh 150 received. KSh 100 has been credited to the finder's reward balance.
              </p>
            </div>
          </div>

          {/* Finder Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#146B50]/30 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDF1ED]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#89968E]">
                  Finder Name
                </span>
                <p className="text-base font-extrabold text-[#123C30]">
                  {unlockedResult.record.finderName}
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#D6F36A] text-[#123C30]">
                Verified Finder
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-[#F5F8F3] rounded-xl">
                <span className="text-[#627168] font-medium">Telephone Number:</span>
                <span className="font-extrabold text-sm text-[#146B50]">
                  {unlockedResult.record.finderPhone}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#F5F8F3] rounded-xl">
                <span className="text-[#627168] font-medium">Handover Point:</span>
                <span className="font-bold text-[#123C30] text-right">
                  {unlockedResult.record.handoverDetails}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`tel:${unlockedResult.record.finderPhone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#146B50] text-white font-bold text-xs hover:bg-[#123C30] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call Finder</span>
              </a>
              <a
                href={`https://wa.me/${unlockedResult.record.finderPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                  unlockedResult.record.finderName
                )},%20I%20am%20the%20owner%20of%20National%20ID%20${unlockedResult.record.maskedIdNumber}%20on%20Pata%20ID.%20When%20can%20we%20coordinate%20handover?`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#167447] text-white font-bold text-xs hover:bg-[#0f5332] transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Safety Advice */}
          <div className="p-3 bg-[#F5F8F3] rounded-xl border border-[#E3EAE4] text-[11px] text-[#627168] space-y-1">
            <p className="font-bold text-[#123C30] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#146B50]" />
              Safe Handover Protocol:
            </p>
            <p>1. Always meet in a well-lit, public location or at the recommended Huduma Centre desk.</p>
            <p>2. Inspect your National ID card before concluding the meetup.</p>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        /* Payment flow */
        <div className="space-y-4">
          <div className="p-3 bg-[#F5F8F3] rounded-xl border border-[#E3EAE4] flex items-center justify-between text-xs">
            <div>
              <span className="text-[#89968E]">Target Document:</span>
              <p className="font-bold text-[#123C30]">
                National ID #{record.maskedIdNumber} ({record.fullNameOnId})
              </p>
            </div>
            <div className="text-right">
              <span className="text-[#89968E]">Fee:</span>
              <p className="font-black text-sm text-[#146B50]">KSh 150</p>
            </div>
          </div>

          {stkState === 'idle' && (
            <div className="space-y-4">
              {/* Provider Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#123C30]">
                  Select Payment Gateway
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mpesa', name: 'M-Pesa STK', sub: 'Instant Prompt' },
                    { id: 'intasend', name: 'IntaSend', sub: 'Card / M-Pesa' },
                    { id: 'pawapay', name: 'PawaPay', sub: 'Mobile Money' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setProvider(p.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        provider === p.id
                          ? 'border-[#146B50] bg-[#E8F4ED] ring-1 ring-[#146B50]'
                          : 'border-[#E3EAE4] bg-white hover:bg-[#F5F8F3]'
                      }`}
                    >
                      <p className="text-xs font-bold text-[#123C30]">{p.name}</p>
                      <p className="text-[10px] text-[#627168]">{p.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="M-Pesa Phone Number"
                placeholder="0712 345 678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                leftIcon={<Smartphone className="w-4 h-4" />}
                hint="An STK push payment prompt will appear instantly on this phone."
                required
              />

              {/* Business split transparency */}
              <div className="p-3 bg-[#E8F4ED] rounded-xl text-xs text-[#123C30] space-y-1">
                <div className="flex justify-between font-semibold">
                  <span>Finder Reward:</span>
                  <span className="text-[#167447]">KSh 100</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Pata ID Platform & SMS:</span>
                  <span>KSh 50</span>
                </div>
                <div className="border-t border-[#146B50]/20 pt-1 flex justify-between font-bold text-sm">
                  <span>Total Due:</span>
                  <span>KSh 150</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="lime"
                  onClick={handleSendStkPush}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Pay KSh 150 via M-Pesa
                </Button>
              </div>
            </div>
          )}

          {stkState === 'push_sent' && (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#EDF8C9] border-2 border-[#D6F36A] flex items-center justify-center mx-auto text-[#146B50] animate-pulse">
                <Smartphone className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#123C30]">
                  M-Pesa STK Push Sent!
                </h4>
                <p className="text-xs text-[#627168]">
                  Check your phone (<strong>{phoneNumber}</strong>) and enter your M-Pesa PIN to
                  authorize KSh 150 to Paybill <strong>522522</strong> (PATAID).
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F8F3] border border-[#E3EAE4] text-xs font-semibold text-[#146B50]">
                <Clock className="w-4 h-4 animate-spin text-[#146B50]" />
                <span>Awaiting PIN confirmation ({countdown}s)...</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={completePayment}
                  className="text-xs text-[#146B50] underline font-medium hover:text-[#123C30]"
                >
                  Simulate PIN Entered (Instant Bypass)
                </button>
              </div>
            </div>
          )}

          {stkState === 'verifying' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-[#146B50] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-bold text-[#123C30]">
                Verifying Daraja Webhook & Unlocking Contact...
              </p>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
};
