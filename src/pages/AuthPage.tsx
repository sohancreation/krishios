import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sprout, Lock, Loader2, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SignupWizard } from '@/components/auth/SignupWizard';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AuthPage() {
  const { user, loading: authLoading, signIn, resetPassword } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const { toast } = useToast();

  const isBn = language === 'bn';

  const copy = {
    brand: 'কৃষিOS',
    error: isBn ? 'ত্রুটি' : 'Error',
    provideEmail: isBn ? 'অনুগ্রহ করে ইমেইল দিন' : 'Please enter your email',
    resetSentTitle: isBn ? '✅ ইমেইল পাঠানো হয়েছে' : '✅ Email sent',
    resetSentDescription: isBn
      ? 'পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।'
      : 'A password reset link has been sent to your email.',
    haveAccount: isBn ? 'ইতোমধ্যে অ্যাকাউন্ট আছে? লগইন করুন' : 'Already have an account? Log in',
    subtitleLogin: isBn ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'Log in to your account',
    subtitleForgot: isBn ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset your password',
    emailSent: isBn ? 'ইমেইল পাঠানো হয়েছে!' : 'Email sent!',
    emailSentBody: isBn
      ? 'ঠিকানায় পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে। অনুগ্রহ করে আপনার ইমেইল চেক করুন।'
      : 'A password reset link has been sent. Please check your inbox.',
    email: isBn ? 'ইমেইল' : 'Email',
    sendReset: isBn ? 'রিসেট লিংক পাঠান' : 'Send reset link',
    backToLogin: isBn ? 'লগইনে ফিরে যান' : 'Back to login',
    password: isBn ? 'পাসওয়ার্ড' : 'Password',
    forgotPassword: isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot password?',
    login: isBn ? '🔑 লগইন করুন' : '🔑 Log in',
    createAccount: isBn ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create a new account',
  };

  useEffect(() => {
    if (!user) {
      setOnboardingChecked(true);
      return;
    }

    const checkOnboarding = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      setOnboardingCompleted(data?.onboarding_completed ?? false);
      setOnboardingChecked(true);

      if (data && !data.onboarding_completed) {
        setIsSignUp(true);
      }
    };

    checkOnboarding();
  }, [user]);

  if (authLoading || !onboardingChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && onboardingCompleted) return <Navigate to={justSignedUp ? '/?new_signup=true' : '/'} replace />;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({ title: copy.error, description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast({ title: copy.error, description: copy.provideEmail, variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email.trim());
    if (error) {
      toast({ title: copy.error, description: error.message, variant: 'destructive' });
    } else {
      setResetSent(true);
      toast({ title: copy.resetSentTitle, description: copy.resetSentDescription });
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="absolute top-4 right-4 z-20 flex items-center rounded-lg border border-border bg-card p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setLanguage('bn')}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${isBn ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          বাংলা
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${!isBn ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          EN
        </button>
      </div>

      {isSignUp ? (
        <div className="w-full">
          <SignupWizard onOnboardingComplete={() => { setOnboardingCompleted(true); setJustSignedUp(true); }} onBackToLogin={() => setIsSignUp(false)} />
          <div className="text-center mt-4">
            {!user && (
              <button type="button" onClick={() => setIsSignUp(false)} className="text-sm text-primary hover:underline">
                {copy.haveAccount}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sprout className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">{copy.brand}</h1>
            <p className="text-muted-foreground mt-1">{isForgotPassword ? copy.subtitleForgot : copy.subtitleLogin}</p>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            {isForgotPassword ? (
              <div className="space-y-4">
                {resetSent ? (
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{copy.emailSent}</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{email}</span> {copy.emailSentBody}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>{copy.email}</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="pl-10" required />
                      </div>
                    </div>
                    <Button onClick={handleForgotPassword} className="w-full" disabled={loading || !email.trim()}>
                      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                      {copy.sendReset}
                    </Button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(false); setResetSent(false); }}
                  className="w-full flex items-center justify-center gap-1 text-sm text-primary hover:underline mt-2"
                >
                  <ArrowLeft className="w-4 h-4" /> {copy.backToLogin}
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{copy.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{copy.password}</Label>
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-primary hover:underline">
                      {copy.forgotPassword}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {copy.login}
                </Button>
              </form>
            )}

            {!isForgotPassword && (
              <div className="mt-4 text-center">
                <button type="button" onClick={() => setIsSignUp(true)} className="text-sm text-primary hover:underline">
                  {copy.createAccount}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
