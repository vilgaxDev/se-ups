import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog.tsx';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { FoundIdRecord } from '../../types/index.ts';
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Lock,
  Phone,
  CheckCircle2,
  Building2,
  AlertTriangle,
} from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  idNumber: string;
  result: { found: boolean; record?: FoundIdRecord; matchStatus?: string } | null;
  onInitiateUnlock: (record: FoundIdRecord) => void;
  onCreateAlert: (idNumber: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  idNumber,
  result,
  onInitiateUnlock,
  onCreateAlert,
}) => {
  const [alertSubmitted, setAlertSubmitted] = useState(false);

  if (!result) return null;

  const record = result.record;
  const isRecovered = record?.status === 'claimed_and_recovered';

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={result.found ? 'National ID Match Located!' : 'No Matching Record Found Yet'}
      maxWidth="lg"
    >
      {result.found && record ? (
        <div className="space-y-5">
          {/* Status Banner */}
          <div className="p-3.5 rounded-xl bg-[#E8F4ED] border border-[#167447]/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#167447] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#123C30]">
                A lost ID matching #{idNumber} has been handed in!
              </p>
              <p className="text-xs text-[#627168] mt-0.5">
                The finder deposited details of this ID and it is safely awaiting recovery.
              </p>
            </div>
          </div>

          {/* Found ID Specimen Preview Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E3EAE4] shadow-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#EDF1ED]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#89968E]">
                  Registered Name on ID
                </span>
                <p className="text-base font-extrabold text-[#123C30] tracking-tight">
                  {record.fullNameOnId}
                </p>
              </div>
              <Badge variant={isRecovered ? 'success' : 'lime'} size="md">
                {isRecovered ? 'Already Recovered' : 'Available for Recovery'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#627168]">
                <MapPin className="w-4 h-4 text-[#146B50] shrink-0" />
                <span>
                  <strong>Location:</strong> {record.subCounty}, {record.county}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#627168]">
                <Calendar className="w-4 h-4 text-[#146B50] shrink-0" />
                <span>
                  <strong>Date Handed In:</strong>{' '}
                  {new Date(record.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#627168]">
                <Building2 className="w-4 h-4 text-[#146B50] shrink-0" />
                <span>
                  <strong>Handover Point:</strong> {record.handoverDetails}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#627168]">
                <Lock className="w-4 h-4 text-[#A96B19] shrink-0" />
                <span>
                  <strong>Finder Phone:</strong> {record.finderPhone}
                </span>
              </div>
            </div>
          </div>

          {/* Privacy & Fee Notice */}
          {!isRecovered ? (
            <div className="p-4 rounded-xl bg-[#F5F8F3] border border-[#E3EAE4] text-xs text-[#627168] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#123C30]">
                <ShieldCheck className="w-4 h-4 text-[#146B50]" />
                <span>M-Pesa Contact Unlock (KSh 150)</span>
              </div>
              <p className="leading-relaxed">
                To eliminate fraudulent claims and reward the Good Samaritan finder, unlocking the
                verified telephone number and coordinating handover requires a standard recovery
                fee of <strong>KSh 150</strong>.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#146B50] font-semibold pt-1">
                <span>• KSh 100 awarded directly to the Finder</span>
                <span>• KSh 50 platform verification fee</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#E8F4ED] border border-[#167447]/30 text-xs text-[#123C30]">
              <p className="font-bold">Contact Details Already Unlocked</p>
              <p className="mt-1">
                You can reach the finder at <strong>{record.finderPhone}</strong> ({record.finderName}).
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Close
            </Button>
            {!isRecovered && (
              <Button
                variant="primary"
                onClick={() => onInitiateUnlock(record)}
                className="w-full sm:w-auto"
                leftIcon={<Phone className="w-4 h-4" />}
              >
                Unlock Finder Details (KSh 150)
              </Button>
            )}
          </div>
        </div>
      ) : (
        /* Not found state */
        <div className="space-y-5 text-center py-4">
          <div className="w-14 h-14 rounded-full bg-[#FEF6EE] border border-[#A96B19]/20 flex items-center justify-center mx-auto text-[#A96B19]">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-base font-bold text-[#123C30]">
              ID #{idNumber} is not yet in our database
            </h4>
            <p className="text-xs text-[#627168] leading-relaxed">
              Don't worry! New found IDs are submitted daily across Nairobi, Mombasa, Kisumu, Nakuru,
              and countrywide. Create a free <strong>Instant Recovery Alert</strong>, and we'll
              notify you the second someone submits your ID.
            </p>
          </div>

          {alertSubmitted ? (
            <div className="p-3.5 rounded-xl bg-[#E8F4ED] border border-[#167447]/30 text-xs text-[#167447] font-semibold max-w-sm mx-auto">
              ✓ Alert activated! We will notify you immediately when your ID is submitted.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button variant="outline" onClick={onClose}>
                Back to Search
              </Button>
              <Button
                variant="lime"
                onClick={() => {
                  onCreateAlert(idNumber);
                  setAlertSubmitted(true);
                }}
              >
                Set Free Recovery Alert
              </Button>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
};
