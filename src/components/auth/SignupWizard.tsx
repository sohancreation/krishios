import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sprout, User, Phone, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Mail, Lock, Camera, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DISTRICTS, DISTRICTS_UPAZILAS } from '@/data/bangladeshLocations';
import { useLanguage } from '@/contexts/LanguageContext';

const STEPS = [
  { title: 'অ্যাকাউন্ট তৈরি', titleEn: 'Create Account', icon: '👤' },
  { title: 'কৃষকের ধরন', titleEn: 'Farmer Type', icon: '🌾' },
  { title: 'খামারের তথ্য', titleEn: 'Farm Info', icon: '🏡' },
  { title: 'চাষের ধরন', titleEn: 'Farming Method', icon: '🌿' },
  { title: 'সমস্যা চিহ্নিত', titleEn: 'Challenges', icon: '⚠️' },
];

const FARMER_TYPES = [
  { value: 'crop', icon: '🌾', label: 'ফসল', labelEn: 'Crops' },
  { value: 'cattle', icon: '🐄', label: 'গবাদিপশু', labelEn: 'Cattle' },
  { value: 'poultry', icon: '🐓', label: 'পোল্ট্রি', labelEn: 'Poultry' },
  { value: 'mixed', icon: '🌿', label: 'মিশ্র', labelEn: 'Mixed' },
];

const LAND_SIZES = [
  { value: 'under_1', label: '১ বিঘার কম', labelEn: 'Under 1 bigha' },
  { value: '1_to_5', label: '১–৫ বিঘা', labelEn: '1-5 bigha' },
  { value: '5_to_20', label: '৫–২০ বিঘা', labelEn: '5-20 bigha' },
  { value: 'over_20', label: '২০+ বিঘা', labelEn: '20+ bigha' },
  { value: 'no_land', label: 'শুধু খামার (জমি নেই)', labelEn: 'Farm only (no land)' },
];

const LAND_OWNERSHIP = [
  { value: 'own', label: '🏠 নিজের', labelEn: '🏠 Own' },
  { value: 'lease', label: '📝 লিজ', labelEn: '📝 Lease' },
  { value: 'mixed', label: '🔀 মিশ্র', labelEn: '🔀 Mixed' },
];

const IRRIGATION_SOURCES = [
  { value: 'tubewell', label: '🚰 টিউবওয়েল', labelEn: '🚰 Tube well' },
  { value: 'pond', label: '🌊 পুকুর/খাল', labelEn: '🌊 Pond/Canal' },
  { value: 'rain', label: '🌧️ বৃষ্টি নির্ভর', labelEn: '🌧️ Rain-fed' },
  { value: 'unknown', label: '❓ জানি না', labelEn: '❓ Not sure' },
];

const FARMING_METHODS = [
  { value: 'organic', label: '🌿 জৈব', labelEn: '🌿 Organic' },
  { value: 'chemical', label: '🧪 কেমিক্যাল', labelEn: '🧪 Chemical' },
  { value: 'mixed', label: '🔀 মিশ্র', labelEn: '🔀 Mixed' },
];

const CHALLENGES = [
  { value: 'low_yield', label: '📉 কম ফলন', labelEn: '📉 Low yield' },
  { value: 'disease', label: '🦠 রোগ', labelEn: '🦠 Disease' },
  { value: 'market_price', label: '💰 বাজার মূল্য', labelEn: '💰 Market price' },
  { value: 'high_cost', label: '💸 বেশি খরচ', labelEn: '💸 High costs' },
  { value: 'water', label: '💧 পানি সমস্যা', labelEn: '💧 Water shortage' },
  { value: 'livestock_disease', label: '🐄 পশুর অসুখ', labelEn: '🐄 Livestock disease' },
];

interface SignupWizardProps {
  onOnboardingComplete?: () => void;
  onBackToLogin?: () => void;
}

export function SignupWizard({ onOnboardingComplete }: SignupWizardProps) {
  const { user, signUp } = useAuth();
  const { language } = useLanguage();
  const [step, setStep] = useState(user ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');

  const [farmerTypes, setFarmerTypes] = useState<string[]>([]);
  const [landSize, setLandSize] = useState('');
  const [landOwnership, setLandOwnership] = useState('');
  const [irrigationSource, setIrrigationSource] = useState('');
  const [farmingMethod, setFarmingMethod] = useState('');
  const [challenges, setChallenges] = useState<string[]>([]);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const isBn = language === 'bn';
  const txt = {
    error: isBn ? 'ত্রুটি' : 'Error',
    imageOnly: isBn ? 'শুধুমাত্র ছবি আপলোড করুন' : 'Please upload an image file only',
    imageSize: isBn ? 'ছবি ২MB এর কম হতে হবে' : 'Image size must be under 2MB',
    accountCreatedTitle: isBn ? '✅ অ্যাকাউন্ট তৈরি হয়েছে!' : '✅ Account created!',
    accountCreatedDesc: isBn ? 'এখন আপনার কৃষি প্রোফাইল সম্পন্ন করুন।' : 'Now complete your farming profile.',
    accountCreateFailed: isBn ? 'অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে' : 'Failed to create account',
    saveFailed: isBn ? 'তথ্য সংরক্ষণে সমস্যা হয়েছে' : 'Failed to save profile information',
    welcome: isBn ? 'কৃষিOS-এ স্বাগতম' : 'Welcome to KrishiOS',
    subtitle: isBn ? 'আপনার কৃষি সহায়ক তৈরি করুন ~১ মিনিটে' : 'Set up your farming assistant in about 1 minute',
    avatarOptional: isBn ? 'প্রোফাইল ছবি যোগ করুন (ঐচ্ছিক)' : 'Add profile photo (optional)',
    fullName: isBn ? 'পুরো নাম *' : 'Full Name *',
    fullNamePlaceholder: isBn ? 'আপনার নাম' : 'Your full name',
    email: isBn ? 'ইমেইল *' : 'Email *',
    phone: isBn ? 'মোবাইল নম্বর *' : 'Mobile Number *',
    password: isBn ? 'পাসওয়ার্ড *' : 'Password *',
    confirmPassword: isBn ? 'পুনরায় পাসওয়ার্ড *' : 'Confirm Password *',
    passwordsNoMatch: isBn ? 'পাসওয়ার্ড মিলছে না' : 'Passwords do not match',
    district: isBn ? 'জেলা *' : 'District *',
    districtPlaceholder: isBn ? 'জেলা নির্বাচন করুন' : 'Select district',
    upazila: isBn ? 'উপজেলা *' : 'Upazila *',
    upazilaPlaceholder: isBn ? 'উপজেলা নির্বাচন করুন' : 'Select upazila',
    farmerTypeQuestion: isBn ? 'আপনি কী ধরনের কৃষক? (একাধিক নির্বাচন করা যাবে)' : 'What type of farmer are you? (multiple allowed)',
    landSizeQuestion: isBn ? 'আপনার মোট জমি/খামারের আকার কত? *' : 'What is your total land/farm size? *',
    ownershipQuestion: isBn ? 'জমি/খামার আপনার নিজের নাকি লিজ? *' : 'Do you own the land/farm or lease it? *',
    irrigationQuestion: isBn ? 'সেচ বা পানির উৎস কী? *' : 'What is your irrigation/water source? *',
    farmingMethodQuestion: isBn ? 'আপনি কোন পদ্ধতিতে চাষ করেন?' : 'Which farming method do you follow?',
    challengeQuestion: isBn ? 'আপনার সবচেয়ে বড় সমস্যা কী? (একাধিক নির্বাচন করা যাবে)' : 'What are your biggest challenges? (multiple allowed)',
    back: isBn ? 'পিছনে' : 'Back',
    createAccount: isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create account',
    next: isBn ? 'পরবর্তী' : 'Next',
    finish: isBn ? 'সম্পন্ন করুন' : 'Finish',
  };

  const getLabel = <T extends { label: string; labelEn: string }>(item: T) => (isBn ? item.label : item.labelEn);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const toggleArrayItem = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: txt.error, description: txt.imageOnly, variant: 'destructive' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: txt.error, description: txt.imageSize, variant: 'destructive' });
      return;
    }
    setAvatarLoading(true);
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
      setAvatarLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const canProceed = () => {
    switch (step) {
      case 0:
        return fullName.trim() && email.trim() && isValidEmail(email) && password.length >= 6 && password === confirmPassword && phone.trim().length >= 11 && district && upazila;
      case 1:
        return farmerTypes.length > 0;
      case 2:
        return landSize && landOwnership && irrigationSource;
      case 3:
        return !!farmingMethod;
      case 4:
        return challenges.length > 0;
      default:
        return false;
    }
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    try {
      const { error } = await signUp(email.trim(), password, fullName);
      if (error) {
        toast({ title: txt.error, description: error.message, variant: 'destructive' });
        setLoading(false);
        return;
      }
      toast({ title: txt.accountCreatedTitle, description: txt.accountCreatedDesc });
      setStep(1);
    } catch (err: any) {
      toast({ title: txt.error, description: err.message || txt.accountCreateFailed, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        let avatarUrl: string | null = null;
        if (avatarFile) {
          const ext = avatarFile.name.split('.').pop();
          const path = `${session.user.id}/avatar.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from('profile-pictures')
            .upload(path, avatarFile, { upsert: true });
          if (!uploadError) {
            const { data: signedUrlData } = await supabase.storage
              .from('profile-pictures')
              .createSignedUrl(path, 60 * 60 * 24 * 365);
            if (signedUrlData?.signedUrl) {
              avatarUrl = signedUrlData.signedUrl;
            }
          }
        }

        const profileData: Record<string, any> = {
          full_name: fullName,
          phone,
          email,
          district,
          upazila,
          farmer_type: farmerTypes,
          land_size_category: landSize,
          land_ownership: landOwnership,
          irrigation_source: irrigationSource,
          farming_method: farmingMethod,
          biggest_challenges: challenges,
          onboarding_completed: true,
        };
        if (avatarUrl) profileData.avatar_url = avatarUrl;

        const { error } = await supabase.from('profiles').update(profileData).eq('user_id', session.user.id);

        if (error) {
          await supabase.from('profiles').insert({
            user_id: session.user.id,
            ...profileData,
          });
        }
      }

      onOnboardingComplete?.();
    } catch {
      toast({ title: txt.error, description: txt.saveFailed, variant: 'destructive' });
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (step === 0) {
      handleCreateAccount();
    } else if (step === 4) {
      handleFinishOnboarding();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3 shadow-lg">
          <Sprout className="w-7 h-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{txt.welcome}</h1>
        <p className="text-muted-foreground text-sm mt-1">{txt.subtitle}</p>
      </div>

      <div className="flex items-center gap-1 mb-6 px-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1.5 w-full rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
            <span className={`text-[10px] ${i === step ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
              {s.icon}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {STEPS[step].icon} {isBn ? STEPS[step].title : STEPS[step].titleEn}
        </h2>

        {step === 0 && (
          <div className="space-y-3">
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold overflow-hidden border-2 border-border">
                  {avatarLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  ) : avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground">{txt.avatarOptional}</p>
            </div>
            <div>
              <Label>{txt.fullName}</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder={txt.fullNamePlaceholder} className="pl-10" required />
              </div>
            </div>
            <div>
              <Label>{txt.email}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="pl-10" required />
              </div>
            </div>
            <div>
              <Label>{txt.phone}</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className="pl-10" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{txt.password}</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <Label>{txt.confirmPassword}</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="pl-10 pr-10" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive">{txt.passwordsNoMatch}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{txt.district}</Label>
                <Select value={district} onValueChange={(val) => { setDistrict(val); setUpazila(''); }}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={txt.districtPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {DISTRICTS.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{txt.upazila}</Label>
                <Select value={upazila} onValueChange={setUpazila} disabled={!district}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder={txt.upazilaPlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {(DISTRICTS_UPAZILAS[district] || []).map(u => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">{txt.farmerTypeQuestion}</p>
            <div className="grid grid-cols-2 gap-3">
              {FARMER_TYPES.map(ft => (
                <button
                  key={ft.value}
                  type="button"
                  onClick={() => toggleArrayItem(farmerTypes, setFarmerTypes, ft.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${farmerTypes.includes(ft.value)
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-xl block mb-1">{ft.icon}</span>
                  <span className="text-sm font-medium">{getLabel(ft)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">{txt.landSizeQuestion}</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {LAND_SIZES.map(ls => (
                  <button
                    key={ls.value}
                    type="button"
                    onClick={() => setLandSize(ls.value)}
                    className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${landSize === ls.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {getLabel(ls)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">{txt.ownershipQuestion}</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {LAND_OWNERSHIP.map(lo => (
                  <button
                    key={lo.value}
                    type="button"
                    onClick={() => setLandOwnership(lo.value)}
                    className={`p-3 rounded-xl border-2 text-center text-sm transition-all ${landOwnership === lo.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {getLabel(lo)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">{txt.irrigationQuestion}</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {IRRIGATION_SOURCES.map(item => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setIrrigationSource(item.value)}
                    className={`p-3 rounded-xl border-2 text-center text-sm transition-all ${irrigationSource === item.value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {getLabel(item)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">{txt.farmingMethodQuestion}</p>
            <div className="grid grid-cols-1 gap-3">
              {FARMING_METHODS.map(fm => (
                <button
                  key={fm.value}
                  type="button"
                  onClick={() => setFarmingMethod(fm.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${farmingMethod === fm.value
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-lg font-medium">{getLabel(fm)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">{txt.challengeQuestion}</p>
            <div className="grid grid-cols-2 gap-3">
              {CHALLENGES.map(ch => (
                <button
                  key={ch.value}
                  type="button"
                  onClick={() => toggleArrayItem(challenges, setChallenges, ch.value)}
                  className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${challenges.includes(ch.value)
                    ? 'border-primary bg-primary/10 shadow-sm'
                    : 'border-border hover:border-primary/50'
                  }`}
                >
                  {getLabel(ch)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 0 && step > (user ? 1 : 0) && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-1" /> {txt.back}
            </Button>
          )}
          {step === 0 && (
            <Button onClick={handleNext} disabled={loading || !canProceed()} className="flex-1">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              {txt.createAccount}
            </Button>
          )}
          {step > 0 && step < 4 && (
            <Button onClick={handleNext} disabled={!canProceed()} className="flex-1">
              {txt.next} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          {step === 4 && (
            <Button onClick={handleNext} disabled={loading || !canProceed()} className="flex-1">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
              {txt.finish}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
