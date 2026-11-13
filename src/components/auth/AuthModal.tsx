import React, { useState } from 'react';
import { Dialog } from '../ui/Dialog.tsx';
import { Button } from '../ui/Button.tsx';
import { Input, Select } from '../ui/Input.tsx';
import { store } from '../../services/store.ts';
import { UserRole } from '../../types/index.ts';
import { useToast } from '../ui/Toast.tsx';
import { Smartphone, Lock, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  onAuthSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'citizen',
  onAuthSuccess,
}) => {
  const { toast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('john.mwangi@example.co.ke');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (isRegister) {
        if (!name.trim() || !phone.trim() || !emailOrPhone.trim()) {
          toast({ type: 'error', message: 'Please fill in all registration fields' });
          return;
        }
        const newUser = store.registerUser(name, emailOrPhone, phone, role);
        toast({ type: 'success', message: `Welcome to Pata ID, ${newUser.name}!` });
        onAuthSuccess(newUser);
        onClose();
      } else {
        const user = store.loginUser(emailOrPhone);
        if (user) {
          toast({ type: 'success', message: `Logged in as ${user.name}` });
          onAuthSuccess(user);
          onClose();
        } else {
          toast({
            type: 'error',
            message: 'User not found. Try one of the quick role demo accounts or register below.',
          });
        }
      }
    }, 500);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isRegister ? 'Create Pata ID Account' : 'Sign in to Pata ID'}
      description="Access your Kenyan digital identity recovery dashboard."
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {isRegister && (
          <>
            <Input
              label="Full Name"
              placeholder="e.g. John Mwangi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Telephone Number"
              placeholder="e.g. 0712 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Smartphone className="w-4 h-4" />}
              required
            />
            <Select
              label="Account Type"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              options={[
                { label: 'Citizen (Searching for Lost ID)', value: 'citizen' },
                { label: 'Good Samaritan (Found an ID)', value: 'finder' },
              ]}
            />
          </>
        )}

        <Input
          label={isRegister ? 'Email Address' : 'Email or Registered Phone'}
          placeholder={isRegister ? 'john@example.co.ke' : 'john.mwangi@example.co.ke'}
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          required
        />

        <Input
          label="Password / Secret PIN"
          type="password"
          placeholder="••••••••"
          defaultValue="pataid123"
          required
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <Button
          type="submit"
          variant="lime"
          className="w-full font-bold"
          isLoading={isLoading}
        >
          {isRegister ? 'Complete Registration' : 'Sign In'}
        </Button>

        <div className="pt-2 text-center text-xs text-[#627168]">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-[#146B50] font-bold hover:underline"
              >
                Sign in here
              </button>
            </p>
          ) : (
            <p>
              New to Pata ID?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-[#146B50] font-bold hover:underline"
              >
                Create an account
              </button>
            </p>
          )}
        </div>
      </form>
    </Dialog>
  );
};
