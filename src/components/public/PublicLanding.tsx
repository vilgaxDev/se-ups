import React, { useState } from 'react';
import { Button } from '../ui/Button.tsx';
import { Badge } from '../ui/Badge.tsx';
import { store } from '../../services/store.ts';
import { FoundIdRecord } from '../../types/index.ts';
import {
  Search,
  ShieldCheck,
  PlusCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Smartphone,
  Building2,
  Users,
  ChevronDown,
  HelpCircle,
  FileText,
  MapPin,
  Clock,
} from 'lucide-react';

interface PublicLandingProps {
  onSearch: (idNumber: string) => void;
  onOpenSubmitModal: () => void;
  onNavigatePortal: (role: 'citizen' | 'finder' | 'admin') => void;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({
  onSearch,
  onOpenSubmitModal,
  onNavigatePortal,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.replace(/\D/g, '');
    if (clean.length < 6) {
      alert('Please enter a valid Kenyan National ID number (at least 6 digits)');
      return;
    }
    onSearch(clean);
  };

  const faqs = [
    {
      q: 'How does Pata ID protect my personal information?',
      a: 'In strict compliance with the Kenya Data Protection Act 2019, Pata ID never stores front or back photographs of National IDs. All ID numbers are verified using deterministic keyed cryptographic hashing. Finders never see claimant contact details, and claimant phone numbers remain confidential.',
    },
    {
      q: 'Why is there a KSh 150 contact-unlock fee?',
      a: 'The KSh 150 fee ensures a sustainable, fraud-free ecosystem: KSh 100 is paid directly to the Good Samaritan finder via M-Pesa to reward their honesty and effort. The remaining KSh 50 covers SMS notifications, database infrastructure, and partner verification.',
    },
    {
      q: 'Where do handovers take place?',
      a: 'We strongly recommend utilizing official Huduma Centre Lost & Found desks (e.g. GPO Nairobi, City Square, Mombasa, Kisumu, Nakuru, Eldoret) or local Police Stations. Direct meetups should always occur in public, well-lit venues.',
    },
    {
      q: 'When does a finder receive their KSh 100 reward?',
      a: 'The moment the owner unlocks contact details and verifies the match, KSh 100 is credited immediately to the finder’s Pata ID reward balance and can be disbursed directly to M-Pesa.',
    },
    {
      q: 'Is Pata ID an official government agency?',
      a: 'No. Pata ID is a private, community-driven digital recovery network designed to connect citizens who have lost documents with good citizens who find them before replacement costs and delays at the National Registration Bureau occur.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-10 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F4ED] border border-[#146B50]/20 text-[#123C30] text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#167447] animate-pulse" />
          <span>Kenyan Digital Identity Recovery Network</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#123C30] leading-[1.15]">
          Lost your National ID? <br className="hidden sm:inline" />
          <span className="text-[#146B50]">Find it here.</span> Safely & Fast.
        </h1>

        <p className="text-base sm:text-lg text-[#627168] max-w-2xl mx-auto leading-relaxed">
          Skip replacement queues and weeks of waiting. Search Kenya's secure identity recovery database,
          or submit a found ID and earn a <strong className="text-[#123C30]">KSh 100 M-Pesa reward</strong>.
        </p>

        {/* Primary National ID Search Bar */}
        <div className="max-w-xl mx-auto pt-2">
          <form
            onSubmit={handleSearchSubmit}
            className="p-2 sm:p-2.5 bg-white rounded-2xl border-2 border-[#146B50] shadow-lg flex flex-col sm:flex-row items-stretch gap-2 transition-all focus-within:ring-4 focus-within:ring-[#146B50]/15"
          >
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-[#146B50] shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter 7 or 8-digit National ID (e.g. 32849102)"
                className="w-full text-base font-semibold text-[#17251F] placeholder:text-[#89968E] placeholder:font-normal outline-none bg-transparent"
              />
            </div>
            <Button
              type="submit"
              variant="lime"
              size="lg"
              className="shrink-0 text-sm font-bold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Search My ID
            </Button>
          </form>

          {/* Quick Demo Search Hints */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-[#627168]">
            <span>Try searching sample IDs:</span>
            <button
              onClick={() => {
                setSearchInput('32849102');
                onSearch('32849102');
              }}
              className="font-bold text-[#146B50] hover:underline cursor-pointer bg-[#E8F4ED] px-2 py-0.5 rounded"
            >
              32849102 (Westlands match)
            </button>
            <button
              onClick={() => {
                setSearchInput('29381045');
                onSearch('29381045');
              }}
              className="font-bold text-[#146B50] hover:underline cursor-pointer bg-[#E8F4ED] px-2 py-0.5 rounded"
            >
              29381045 (CBD match)
            </button>
          </div>
        </div>

        {/* Secondary Action: Submit Found ID */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onOpenSubmitModal}
            leftIcon={<PlusCircle className="w-4 h-4 text-[#146B50]" />}
            className="bg-white border-[#E3EAE4]"
          >
            Found an ID? Submit & Earn KSh 100
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => onNavigatePortal('citizen')}
            leftIcon={<Users className="w-4 h-4 text-[#146B50]" />}
          >
            Open Citizen Dashboard
          </Button>
        </div>
      </section>

      {/* Live Recent Recoveries Counter Banner */}
      <section className="bg-white rounded-2xl border border-[#E3EAE4] p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#EDF1ED]">
          <div className="p-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#123C30]">1,480+</p>
            <p className="text-xs text-[#627168] mt-1 font-medium">IDs Reunited</p>
          </div>
          <div className="p-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#146B50]">KSh 148,000</p>
            <p className="text-xs text-[#627168] mt-1 font-medium">Paid to Good Samaritans</p>
          </div>
          <div className="p-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#123C30]">47 Counties</p>
            <p className="text-xs text-[#627168] mt-1 font-medium">Countrywide Coverage</p>
          </div>
          <div className="p-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#167447]">100% Secure</p>
            <p className="text-xs text-[#627168] mt-1 font-medium">DPA 2019 Compliant</p>
          </div>
        </div>
      </section>

      {/* How It Works: 3 Deliberate Steps */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="lime" size="sm">
            Simple 3-Step Process
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#123C30]">
            How Identity Recovery Works
          </h2>
          <p className="text-xs sm:text-sm text-[#627168]">
            Designed to protect your privacy while ensuring finders are fairly compensated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="p-6 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-3 relative hover:border-[#146B50] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#E8F4ED] text-[#146B50] font-black text-base flex items-center justify-center">
              1
            </div>
            <h3 className="text-base font-bold text-[#123C30]">
              Deposit or Search
            </h3>
            <p className="text-xs text-[#627168] leading-relaxed">
              Finders submit the full name, ID number, and drop-off point. Citizens search using
              their National ID number. No ID photographs are ever uploaded.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#146B50] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Keyed deterministic protection
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-3 relative hover:border-[#146B50] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#EDF8C9] text-[#123C30] font-black text-base flex items-center justify-center">
              2
            </div>
            <h3 className="text-base font-bold text-[#123C30]">
              Unlock Contact (KSh 150)
            </h3>
            <p className="text-xs text-[#627168] leading-relaxed">
              When a verified match is found, the rightful owner pays KSh 150 via M-Pesa STK push.
              This prevents prank calls and secures the finder's telephone number.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#146B50] flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> Instant Safaricom Daraja STK
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 bg-white rounded-2xl border border-[#E3EAE4] shadow-xs space-y-3 relative hover:border-[#146B50] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#E8F4ED] text-[#146B50] font-black text-base flex items-center justify-center">
              3
            </div>
            <h3 className="text-base font-bold text-[#123C30]">
              Safe Handover & Reward
            </h3>
            <p className="text-xs text-[#627168] leading-relaxed">
              Meet safely at a designated Huduma Centre or public location. The finder receives KSh 100
              credited directly to their M-Pesa. Everyone wins.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#146B50] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Official Huduma Centre Desks
            </div>
          </div>
        </div>
      </section>

      {/* Transparent Business Model Section */}
      <section className="bg-[#123C30] text-white rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="max-w-2xl space-y-2">
          <Badge variant="lime" size="sm">
            Ethical Revenue Model
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Clear, Transparent Fee Structure
          </h2>
          <p className="text-xs sm:text-sm text-[#E8F4ED]/80 leading-relaxed">
            We believe in complete transparency. Every KSh 150 recovery transaction is audited and split
            to ensure finders are rewarded and our security operations remain free of government subsidies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#146B50]/60 border border-[#19865F] p-5 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6F36A]">
              Claimant Fee
            </span>
            <p className="text-3xl font-black text-white">KSh 150</p>
            <p className="text-xs text-[#E8F4ED]/80">
              Paid by the owner only when an exact verified match is located in our database.
            </p>
          </div>

          <div className="bg-[#146B50]/60 border border-[#19865F] p-5 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6F36A]">
              Finder Reward
            </span>
            <p className="text-3xl font-black text-[#D6F36A]">KSh 100</p>
            <p className="text-xs text-[#E8F4ED]/80">
              Disbursed directly to the Good Samaritan via M-Pesa B2C once contact is unlocked.
            </p>
          </div>

          <div className="bg-[#146B50]/60 border border-[#19865F] p-5 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6F36A]">
              Platform & SMS
            </span>
            <p className="text-3xl font-black text-white">KSh 50</p>
            <p className="text-xs text-[#E8F4ED]/80">
              Maintains high-speed infrastructure, Daraja API gateway fees, and automated SMS alerts.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#123C30]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#627168]">
            Everything you need to know about Kenya's National ID recovery service.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E3EAE4] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-[#123C30] hover:bg-[#F5F8F3] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#146B50] transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#627168] leading-relaxed border-t border-[#EDF1ED] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Public Footer */}
      <footer className="pt-10 border-t border-[#E3EAE4] space-y-8 text-xs text-[#627168]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#146B50] flex items-center justify-center">
                <img src="/logo.svg" alt="Pata ID" className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base text-[#123C30]">Pata ID</span>
            </div>
            <p className="leading-relaxed">
              Kenya’s dedicated peer-to-peer lost and found National ID recovery platform.
              Reconnecting Kenyans with their vital documents safely.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#123C30] uppercase tracking-wider text-[11px] mb-3">
              Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigatePortal('citizen')}
                  className="hover:text-[#146B50] hover:underline"
                >
                  Citizen Lost ID Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePortal('finder')}
                  className="hover:text-[#146B50] hover:underline"
                >
                  Good Samaritan Finder Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigatePortal('admin')}
                  className="hover:text-[#146B50] hover:underline"
                >
                  Platform Operations & Audit
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#123C30] uppercase tracking-wider text-[11px] mb-3">
              Compliance & Legal
            </h4>
            <ul className="space-y-2">
              <li>Data Protection Act 2019 Compliant</li>
              <li>Office of Data Protection Commissioner (ODPC) Ref: ODPC/2026/PATAID</li>
              <li>Zero ID Photos Stored</li>
              <li>Deterministic SHA-256 Keyed Lookup</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#123C30] uppercase tracking-wider text-[11px] mb-3">
              Support & Helpline
            </h4>
            <p>Bishop Magua Centre, Ngong Road, Nairobi</p>
            <p className="mt-1 font-semibold text-[#146B50]">+254 700 889 900</p>
            <p>support@pataid.co.ke</p>
            <p className="mt-2 text-[10px] text-[#89968E]">
              Mon - Sat: 8:00 AM - 6:00 PM EAT
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#EDF1ED] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#89968E]">
          <p>© {new Date().getFullYear()} Pata ID Kenya. All rights reserved.</p>
          <p>
            Disclaimer: Pata ID is an independent recovery registry. We are not an official government
            ID issuance department.
          </p>
        </div>
      </footer>
    </div>
  );
};
