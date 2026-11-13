import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog.tsx';
import { Button } from '../ui/Button.tsx';
import { Input, Select, Textarea } from '../ui/Input.tsx';
import { KENYA_COUNTIES, POPULAR_HANDOVER_CENTRES } from '../../data/kenyaLocations.ts';
import { FoundIdRecord } from '../../types/index.ts';
import { store } from '../../services/store.ts';
import { useToast } from '../ui/Toast.tsx';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Gift,
  Building2,
  Lock,
} from 'lucide-react';

interface SubmitFoundIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (record: FoundIdRecord) => void;
}

export const SubmitFoundIdModal: React.FC<SubmitFoundIdModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [fullNameOnId, setFullNameOnId] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [county, setCounty] = useState(KENYA_COUNTIES[0].name);
  const [subCounty, setSubCounty] = useState(KENYA_COUNTIES[0].subCounties[0]);
  const [exactLocation, setExactLocation] = useState('');
  const [handoverPreference, setHandoverPreference] = useState<'direct' | 'huduma_centre' | 'police_station'>('huduma_centre');
  const [handoverDetails, setHandoverDetails] = useState('GPO Huduma Centre Nairobi (Lost & Found Desk)');
  const [finderName, setFinderName] = useState('');
  const [finderPhone, setFinderPhone] = useState('');
  const [finderMpesaName, setFinderMpesaName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Update subcounties when county changes
  const handleCountyChange = (newCounty: string) => {
    setCounty(newCounty);
    const found = KENYA_COUNTIES.find((c) => c.name === newCounty);
    if (found && found.subCounties.length > 0) {
      setSubCounty(found.subCounties[0]);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!fullNameOnId.trim() || fullNameOnId.trim().length < 3) {
        toast({ type: 'error', message: 'Please enter the full name printed on the ID card' });
        return;
      }
      const cleanId = idNumber.replace(/\D/g, '');
      if (cleanId.length < 6 || cleanId.length > 9) {
        toast({ type: 'error', message: 'Kenyan National ID number must be between 6 and 9 digits' });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!exactLocation.trim()) {
        toast({ type: 'error', message: 'Please enter where you found the ID (e.g. Sarit Centre, bus stop, street)' });
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!finderName.trim()) {
        toast({ type: 'error', message: 'Please enter your name as the finder' });
        return;
      }
      const cleanPhone = finderPhone.replace(/\D/g, '');
      if (cleanPhone.length < 9) {
        toast({ type: 'error', message: 'Please enter a valid Kenyan phone number (e.g. 0712345678)' });
        return;
      }
      if (!finderMpesaName.trim()) {
        setFinderMpesaName(finderName);
      }
      setStep(4);
    }
  };

  const handleSubmit = () => {
    if (!agreedToTerms) {
      toast({ type: 'error', message: 'Please confirm the identity accuracy and privacy agreement' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const record = store.submitFoundId({
          fullNameOnId: fullNameOnId.trim().toUpperCase(),
          idNumber: idNumber.trim(),
          county,
          subCounty,
          exactLocation: exactLocation.trim(),
          handoverPreference,
          handoverDetails: handoverDetails.trim(),
          finderName: finderName.trim(),
          finderPhone: finderPhone.trim(),
          finderMpesaName: finderMpesaName.trim() || finderName.trim(),
        });

        toast({
          type: 'success',
          title: 'Found ID Submitted Successfully!',
          message: `ID #${record.maskedIdNumber} is registered. You will earn KSh 100 once verified and claimed!`,
        });

        setIsSubmitting(false);
        onSuccess(record);
        onClose();
        // Reset form
        setStep(1);
        setFullNameOnId('');
        setIdNumber('');
        setExactLocation('');
        setFinderName('');
        setFinderPhone('');
      } catch (err: any) {
        toast({ type: 'error', message: err.message || 'Failed to submit found ID' });
        setIsSubmitting(false);
      }
    }, 600);
  };

  const currentCountyData = KENYA_COUNTIES.find((c) => c.name === county) || KENYA_COUNTIES[0];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Submit a Found Kenyan National ID"
      description="Help a fellow Kenyan recover their lost document and earn a KSh 100 finder reward upon recovery."
      maxWidth="lg"
    >
      {/* Progress Steps Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EDF1ED]">
        {[
          { num: 1, label: 'ID Details' },
          { num: 2, label: 'Location' },
          { num: 3, label: 'Finder & Handover' },
          { num: 4, label: 'Review & Reward' },
        ].map((s) => {
          const isCurrent = step === s.num;
          const isDone = step > s.num;
          return (
            <div key={s.num} className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isCurrent
                    ? 'bg-[#146B50] text-white ring-2 ring-[#D6F36A]'
                    : isDone
                    ? 'bg-[#167447] text-white'
                    : 'bg-[#E3EAE4] text-[#627168]'
                }`}
              >
                {isDone ? '✓' : s.num}
              </div>
              <span
                className={`text-[11px] font-medium hidden sm:inline ${
                  isCurrent ? 'text-[#123C30] font-bold' : 'text-[#89968E]'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step 1: ID Details */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="p-3 bg-[#E8F4ED] rounded-xl text-xs text-[#123C30] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#146B50] shrink-0" />
            <span>
              <strong>Zero Photo Policy:</strong> Under the Kenya Data Protection Act 2019, never
              upload ID photos. We only collect the name and ID number for keyed verification.
            </span>
          </div>

          <Input
            label="Full Name Exactly as Written on ID"
            placeholder="e.g. OTIENO BRIAN OCHIENG"
            value={fullNameOnId}
            onChange={(e) => setFullNameOnId(e.target.value)}
            required
            hint="Include all given names as they appear on the front of the National ID"
          />

          <Input
            label="National ID Number"
            placeholder="e.g. 34821904"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            required
            hint="Standard 7 or 8 digits (or 6 digits for older ID cards)"
          />

          <div className="flex justify-end pt-3">
            <Button
              variant="primary"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Location
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Location Found */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="County"
              options={KENYA_COUNTIES.map((c) => ({ label: c.name, value: c.name }))}
              value={county}
              onChange={(e) => handleCountyChange(e.target.value)}
              required
            />

            <Select
              label="Sub-County / Area"
              options={currentCountyData.subCounties.map((sub) => ({ label: sub, value: sub }))}
              value={subCounty}
              onChange={(e) => setSubCounty(e.target.value)}
              required
            />
          </div>

          <Input
            label="Specific Landmark or Street Found"
            placeholder="e.g. Inside Matatu 237 heading to Thika, or outside Sarit Centre Java"
            value={exactLocation}
            onChange={(e) => setExactLocation(e.target.value)}
            required
            hint="Help the owner recognize the exact circumstances where they dropped it"
          />

          <div className="flex items-center justify-between pt-3">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Finder Details
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Finder & Handover Preference */}
      {step === 3 && (
        <div className="space-y-4">
          <Input
            label="Your Full Name (Finder)"
            placeholder="e.g. Faith Chebet"
            value={finderName}
            onChange={(e) => setFinderName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Your Phone Number"
              placeholder="e.g. 0722 123 456"
              value={finderPhone}
              onChange={(e) => setFinderPhone(e.target.value)}
              required
              hint="Strictly masked from public search until verified payment"
            />

            <Input
              label="M-Pesa Registered Name (For Reward)"
              placeholder="e.g. FAITH CHEBET"
              value={finderMpesaName}
              onChange={(e) => setFinderMpesaName(e.target.value)}
              hint="KSh 100 reward will be sent to this M-Pesa account"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#123C30]">
              Handover Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 'huduma_centre',
                  label: 'Huduma Centre',
                  desc: 'Deposit at official desk',
                  icon: <Building2 className="w-4 h-4 text-[#146B50]" />,
                },
                {
                  id: 'direct',
                  label: 'Direct Safe Meetup',
                  desc: 'Public cafe or mall',
                  icon: <Lock className="w-4 h-4 text-[#146B50]" />,
                },
                {
                  id: 'police_station',
                  label: 'Police Station',
                  desc: 'Desk OB drop-off',
                  icon: <ShieldCheck className="w-4 h-4 text-[#146B50]" />,
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setHandoverPreference(opt.id as any);
                    if (opt.id === 'huduma_centre') {
                      setHandoverDetails('GPO Huduma Centre Nairobi (Lost & Found Desk)');
                    } else if (opt.id === 'police_station') {
                      setHandoverDetails('Central Police Station Lost & Found Desk');
                    } else {
                      setHandoverDetails('Public meeting at Sarit Centre Java or Westgate Mall');
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    handoverPreference === opt.id
                      ? 'border-[#146B50] bg-[#E8F4ED] ring-1 ring-[#146B50]'
                      : 'border-[#E3EAE4] bg-white hover:bg-[#F5F8F3]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">{opt.icon}</div>
                  <p className="text-xs font-bold text-[#123C30]">{opt.label}</p>
                  <p className="text-[10px] text-[#627168]">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Handover Point Specific Details"
            value={handoverDetails}
            onChange={(e) => setHandoverDetails(e.target.value)}
            required
            hint="Exact desk, counter, or public spot for handover"
          />

          <div className="flex items-center justify-between pt-3">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Review & Submit
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Reward Agreement */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E3EAE4] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#89968E]">
              Summary of Submission
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#89968E]">Name on ID:</span>
                <p className="font-bold text-[#123C30]">{fullNameOnId}</p>
              </div>
              <div>
                <span className="text-[#89968E]">National ID #:</span>
                <p className="font-bold text-[#123C30]">
                  {idNumber.slice(0, 4)}**** (Masked)
                </p>
              </div>
              <div>
                <span className="text-[#89968E]">Location:</span>
                <p className="font-semibold text-[#17251F]">
                  {subCounty}, {county}
                </p>
              </div>
              <div>
                <span className="text-[#89968E]">Handover:</span>
                <p className="font-semibold text-[#17251F]">{handoverDetails}</p>
              </div>
            </div>
          </div>

          {/* Reward Agreement Card */}
          <div className="p-4 rounded-xl bg-[#EDF8C9] border border-[#D6F36A] flex items-start gap-3">
            <Gift className="w-5 h-5 text-[#146B50] shrink-0 mt-0.5" />
            <div className="text-xs text-[#123C30]">
              <p className="font-bold">Your Finder Reward: KSh 100</p>
              <p className="mt-0.5 leading-relaxed text-[#17251F]">
                When the owner verifies their ID and completes recovery, KSh 100 will be credited
                directly to your M-Pesa balance. Pata ID retains KSh 50 for platform verification and SMS alerts.
              </p>
            </div>
          </div>

          {/* Terms Checkbox */}
          <label className="flex items-start gap-2.5 text-xs text-[#627168] cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-[#146B50] focus:ring-[#146B50]"
            />
            <span>
              I confirm that I am in physical possession of this National ID card and agree to hand
              it over safely to the verified owner in accordance with the Kenya Data Protection Act 2019.
            </span>
          </label>

          <div className="flex items-center justify-between pt-3">
            <Button
              variant="outline"
              onClick={() => setStep(3)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
            <Button
              variant="lime"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm & Submit ID
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
};
