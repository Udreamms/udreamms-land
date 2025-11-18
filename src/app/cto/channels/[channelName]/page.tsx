
"use client";

import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '../../../../components/Sidebar';
import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, Loader, Check } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../components/ui/card';

type AccountInfo = {
  name: string;
  id: string;
  avatar: string;
  platform: string;
};

const MOCK_ACCOUNTS: { [key: string]: Omit<AccountInfo, 'avatar'> } = {
  whatsapp: { name: 'WhatsApp Business', id: '+1 555-0101', platform: 'WhatsApp' },
  tiktok: { name: 'TikTok Creative', id: '@creative_tok', platform: 'TikTok' },
  facebook: { name: 'Facebook Page Admin', id: 'fb.page.admin', platform: 'Facebook Messenger' },
  instagram: { name: 'Insta Brand Official', id: '@instabrand_official', platform: 'Instagram' },
  telegram: { name: 'Tele-Support Bot', id: '@telesupport_bot', platform: 'Telegram' },
  google: { name: 'Google Business Profile', id: 'business.google.com', platform: 'Google Business' },
  slack: { name: 'Slack Workspace', id: 'acme-corp.slack.com', platform: 'Slack' },
  discord: { name: 'Discord Server', id: 'discord.gg/acme', platform: 'Discord' },
  viber: { name: 'Viber Out Business', id: '+1 555-0102', platform: 'Viber' },
  telnyx: { name: 'Telnyx Account', id: 'user@telnyx.com', platform: 'Telnyx' },
  twilio: { name: 'Twilio Account', id: 'ACxxxxxxxxx', platform: 'Twilio' },
  sms: { name: 'Firebase SMS User', id: '+1 555-0103', platform: 'Firebase SMS' },
  gmail: { name: 'Gmail Account', id: 'user@gmail.com', platform: 'Gmail' },
  smtp: { name: 'SMTP Server', id: 'smtp.example.com', platform: 'SMTP' },
  webchat: { name: 'Website Visitor', id: 'guest-12345', platform: 'Website Chat' },
  fcm: { name: 'FCM Project', id: 'project-id', platform: 'Firebase Cloud Messaging' },
  github: { name: 'GitHub Repository', id: 'owner/repo', platform: 'GitHub' },
  custom: { name: 'Custom Integration', id: 'integration-xyz', platform: 'Custom Channel' },
  default: { name: 'Sovereign User', id: '@sovereign_user', platform: 'Sovereign' },
};

const MOCK_URLS: { [key: string]: string } = {
  whatsapp: 'https://business.whatsapp.com/',
  tiktok: 'https://www.tiktok.com/login',
  facebook: 'https://www.facebook.com/login/',
  instagram: 'https://www.instagram.com/accounts/login/',
  telegram: 'https://web.telegram.org/',
  google: 'https://accounts.google.com/',
  slack: 'https://slack.com/signin',
  discord: 'https://discord.com/login',
  viber: 'https://account.viber.com/',
  telnyx: 'https://portal.telnyx.com/#/login/sign-in',
  twilio: 'https://www.twilio.com/login',
  gmail: 'https://accounts.google.com/',
  github: 'https://github.com/login',
  default: '#',
};

export default function ChannelConnectionPage() {
  const params = useParams();
  const router = useRouter();
  const { channelName } = params;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState(1);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const handleBack = () => {
      if (currentStep === 2) {
          setCurrentStep(1);
          setConnectionStatus('idle');
          setAccountInfo(null);
      } else {
          router.back();
      }
  }

  const handleConnect = () => {
      setConnectionStatus('testing');
      setTimeout(() => {
           const channelKey = typeof channelName === 'string' ? channelName.toLowerCase().split('-')[0] : 'default';
           const accountDetails = MOCK_ACCOUNTS[channelKey] || MOCK_ACCOUNTS.default;

          setAccountInfo({
              ...accountDetails,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(accountDetails.name)}&background=random&color=fff`,
          });
          setConnectionStatus('success');
          setCurrentStep(2);
      }, 2000);
  }
  
    const handleSwitchAccount = () => {
        const channelKey = typeof channelName === 'string' ? channelName.toLowerCase().split('-')[0] : 'default';
        const url = MOCK_URLS[channelKey] || MOCK_URLS.default;
        if (url !== '#') {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };


  const handleResetAndTryAgain = () => {
      setConnectionStatus('idle');
      setCurrentStep(1);
      setAccountInfo(null);
  }

  const Step = ({ stepNumber, label, isActive, isCompleted }: { stepNumber: number, label: string, isActive: boolean, isCompleted: boolean }) => (
    <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center rounded-full h-8 w-8 shrink-0 ${isActive ? 'bg-blue-500 text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-neutral-700 text-neutral-400'}`}>
            {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
        </div>
        <div>
            <h3 className={`font-semibold ${isActive ? 'text-white' : 'text-neutral-400'}`}>{label}</h3>
        </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-8 space-y-8">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={handleBack} className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700">
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Connect to {channelName}</h1>
        </div>

        <div className="flex gap-8 max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="flex flex-col gap-y-2 w-1/3 py-8">
                <Step stepNumber={1} label="Connect Account" isActive={currentStep === 1} isCompleted={currentStep > 1} />
                <div className="h-8 w-px bg-neutral-700 ml-4"></div>
                <Step stepNumber={2} label="Confirm Account" isActive={currentStep === 2} isCompleted={currentStep > 2} />
            </div>

            {/* Steps Content */}
            <div className="flex-1">
                {currentStep === 1 && (
                    <Card className="bg-neutral-900 border-neutral-800 text-white">
                        <CardHeader>
                            <CardTitle>Authorize Connection</CardTitle>
                            <CardDescription>
                                Authorize Sovereign to connect with your {channelName} account. You will be redirected to the {channelName} website to complete the authentication.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Button onClick={handleConnect} disabled={connectionStatus === 'testing'}>
                                        {connectionStatus === 'testing' 
                                            ? <><Loader className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</>
                                            : `Connect with ${channelName}`
                                        }
                                    </Button>
                                </div>
                                 <div className="border-t border-neutral-700 pt-4">
                                    <p className="text-sm text-neutral-400 mb-2">Need to use a different account?</p>
                                    <Button variant="outline" onClick={handleSwitchAccount}>
                                        Switch account on {channelName}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {currentStep === 2 && accountInfo && (
                    <Card className="bg-neutral-900 border-neutral-800">
                        <CardHeader>
                            <CardTitle>Confirm Account</CardTitle>
                            <CardDescription>Is this the correct {accountInfo.platform} account you'd like to connect?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 rounded-md border border-neutral-700 p-4">
                                <img src={accountInfo.avatar} alt="account avatar" className="h-12 w-12 rounded-full" />
                                <div>
                                    <p className="font-bold text-white">{accountInfo.name}</p>
                                    <p className="text-sm text-neutral-400">{accountInfo.id}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                             <Button variant="outline" onClick={handleResetAndTryAgain}>Wrong Account</Button>
                             <Button onClick={() => router.push('/cto/channels')}>Confirm & Finish</Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
