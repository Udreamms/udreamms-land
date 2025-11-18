"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
    MessageCircle, Smartphone, Mail, MessageSquare, Send, Phone, Voicemail, Settings2,
    Rss, Bot, Bell, Globe, Search, User, CheckCircle, AlertTriangle
} from "lucide-react"
import DiscordIcon from "@/components/icons/DiscordIcon"
import InstagramIcon from "@/components/icons/InstagramIcon"
import WhatsappIcon from "@/components/icons/WhatsappIcon"
import FacebookMessengerIcon from "@/components/icons/FacebookMessengerIcon"
import TikTokIcon from "@/components/icons/TikTokIcon"
import GitHubIcon from "@/components/icons/GitHubIcon"
import { motion } from "framer-motion"

const initialChannels = [
    // Business Messaging
    { name: "WhatsApp Business API", description: "Connect the WhatsApp Business API via Facebook to engage with your customers.", icon: <WhatsappIcon className="h-8 w-8 text-green-500" />, badge: "Popular", category: "Business Messaging", path: "/cto/channels/whatsapp", status: "connected" },
    { name: "TikTok", description: "Connect TikTok Business Messaging to engage with a whole new audience.", icon: <TikTokIcon className="h-8 w-8" />, badge: "Beta", category: "Business Messaging", path: "/cto/channels/tiktok", status: "disconnected" },
    { name: "Facebook Messenger", description: "Connect Facebook Messenger to interact with your customers on the world's largest social media platform.", icon: <FacebookMessengerIcon className="h-8 w-8 text-blue-600" />, badge: "Popular", category: "Business Messaging", path: "/cto/channels/facebook", status: "disconnected" },
    { name: "Instagram", description: "Connect Instagram to respond to private messages and build strong brand connections.", icon: <InstagramIcon className="h-8 w-8 text-pink-500" />, category: "Business Messaging", path: "/cto/channels/instagram", status: "disconnected" },
    { name: "Telegram", description: "Connect your Telegram Bot to provide real-time support when customers reach out.", icon: <Send className="h-8 w-8 text-sky-500" />, category: "Business Messaging", path: "/cto/channels/telegram", status: "error" },
    { name: "Google Business Messages", description: "Allow customers to message you directly from Google Search and Maps.", icon: <MessageCircle className="h-8 w-8 text-blue-500" />, category: "Business Messaging", path: "/cto/channels/google-business", status: "disconnected" },
    { name: "Slack", description: "Receive and respond to messages from your Slack channels directly within the platform.", icon: <MessageSquare className="h-8 w-8 text-purple-500" />, category: "Business Messaging", path: "/cto/channels/slack", status: "disconnected" },
    { name: "Discord", description: "Connect your Discord server to send notifications and manage channel messages.", icon: <DiscordIcon className="h-8 w-8 text-indigo-500" />, category: "Business Messaging", path: "/cto/channels/discord", status: "disconnected" },

    // Calling
    { name: "Viber", description: "Connect your Viber Bot to facilitate customer service and interaction on Viber.", icon: <Phone className="h-8 w-8 text-purple-600" />, category: "Calling", path: "/cto/channels/viber", status: "disconnected" },

    // SMS
    { name: "Telnyx (VoIP & SMS)", description: "Connect Telnyx to engage customers through calls and SMS messages.", icon: <Voicemail className="h-8 w-8 text-blue-500" />, badge: "Beta", category: "SMS", path: "/cto/channels/telnyx", status: "disconnected" },
    { name: "Twilio SMS", description: "Connect Twilio to send SMS messages and communicate directly with your customers.", icon: <Rss className="h-8 w-8 text-red-500" />, category: "SMS", path: "/cto/channels/twilio", status: "disconnected" },
    { name: "SMS (Firebase Auth)", description: "Set up Firebase phone authentication to send SMS messages (like verification codes) to your users.", icon: <MessageSquare className="h-8 w-8 text-yellow-500" />, category: "SMS", path: "/cto/channels/sms-firebase", status: "disconnected", buttonText: "Configure" },

    // Email
    { name: "Gmail API", description: "Connect a Google Workspace or Gmail account to send and receive customer emails from the platform.", icon: <Mail className="h-8 w-8 text-red-500" />, category: "Email", path: "/cto/channels/gmail-api", status: "disconnected" },
    { name: "Other Email (SMTP)", description: "Connect other email providers via SMTP to manage your email communications.", icon: <Mail className="h-8 w-8 text-gray-500" />, category: "Email", path: "/cto/channels/smtp", status: "disconnected" },

    // Live Chat
    { name: "Website Chat", description: "Create and add web chat functionality to your website to engage with visitors.", icon: <MessageSquare className="h-8 w-8 text-blue-500" />, category: "Live Chat", path: "/cto/channels/webchat", status: "disconnected" },

    // Others
    { name: "Firebase Cloud Messaging (FCM)", description: "Connect FCM to send push notifications to your mobile and web apps directly from your flows.", icon: <Bell className="h-8 w-8 text-yellow-500" />, category: "All", path: "/cto/channels/fcm", status: "disconnected", buttonText: "Configure" },
    { name: "GitHub", description: "Connect GitHub to receive notifications for issues, pull requests, and commits in your flows.", icon: <GitHubIcon className="h-8 w-8" />, category: "All", path: "/cto/channels/github", status: "disconnected" },
    { name: "Custom Channel", description: "Connect any channel not natively available to extend your messaging capabilities.", icon: <Settings2 className="h-8 w-8 text-orange-500" />, category: "All", path: "/cto/channels/custom", status: "disconnected" },
];

export default function ChannelsContent() {
  const [channels, setChannels] = useState(initialChannels);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categoryMap: { [key: string]: string } = {
    business: "Business Messaging",
    calls: "Calling",
    sms: "SMS",
    email: "Email",
    "live-chat": "Live Chat",
    ads: "Advertising"
  };

  const filteredChannels = channels.filter(channel => {
    const categoryName = categoryMap[activeTab];
    const categoryMatch = activeTab === 'all' || channel.category === categoryName;
    const searchMatch = channel.name.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const getStatusComponent = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="outline" className="border-green-500 text-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Active</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" /> Error</Badge>;
      default:
        return null;
    }
  }

  const getButton = (channel: any) => {
     switch (channel.status) {
      case 'connected':
        return <Button variant="outline">Manage Connection</Button>;
      case 'error':
        return <Button variant="secondary">Reconnect</Button>;
      default:
        return <Button variant="outline">{channel.buttonText || "Connect"}</Button>
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="space-y-8 p-8 flex-1">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
            <Globe className="h-7 w-7"/>
            Channel Catalog
        </h1>
        <p className="text-gray-400 mt-1">
          Manage your messaging channels and discover new ones to help you acquire more customers.
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="bg-neutral-800">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="business">Business Messaging</TabsTrigger>
            <TabsTrigger value="calls">Calling</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="live-chat">Live Chat</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search Channel Catalog..." 
            className="pl-10 bg-neutral-800 border-neutral-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredChannels.map((channel) => (
          <Link href={channel.path} key={channel.name}>
            <motion.div
              className="rounded-lg border bg-neutral-900 text-white shadow-sm flex flex-col justify-between p-6 space-y-4 border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  {channel.icon}
                  <div className="flex gap-2">
                      {getStatusComponent(channel.status)}
                      {channel.badge && (
                      <Badge
                          variant={channel.badge === "Popular" ? "default" : "secondary"}
                          className={channel.badge === 'Popular' ? 'bg-green-900/50 border-green-800/50 text-green-300' : 'bg-blue-900/50 border-blue-800/50 text-blue-300'}
                      >
                          {channel.badge}
                      </Badge>
                      )}
                  </div>
                </div>
                <h3 className="font-semibold">{channel.name}</h3>
                <p className="text-sm text-gray-400">
                  {channel.description}
                </p>
              </div>
              {getButton(channel)}
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  )
}
