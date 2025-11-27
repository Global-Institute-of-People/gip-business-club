
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { GearIcon, XCircleIcon } from './Icons';
import { GoogleGenAI, Chat } from "@google/genai";

const PricingModal: React.FC<{ onClose: () => void; onSelectPlan: (planName: string) => void }> = ({ onClose, onSelectPlan }) => {
    const [activeTab, setActiveTab] = useState<'packages' | 'subscriptions'>('packages');

    const packages = [
        {
            name: "VIP CORE PACKAGE",
            price: "1,800",
            description: "U.S. Business Setup & Digital Launch",
            color: "cyan",
            features: [
                { milestone: "Legal Presence", detail: "Business License & LLC Formation (Articles + Operating Agreement).", value: "Establishes credibility and legal protection." },
                { milestone: "Branding Foundation", detail: "Logo, Brand Identity, Social Kit, Visual Identity.", value: "Creates trust and brand recognition." },
                { milestone: "Website Setup", detail: "1–3 Page Responsive Website (WordPress/Webflow) + Inquiry Form.", value: "Professional online presence." },
                { milestone: "Business Email", detail: "Custom domain + Google Workspace setup.", value: "Professional communication setup." },
                { milestone: "Light CRM", detail: "Starter Setup (HubSpot/Notion) with pipeline tracking.", value: "Tracks leads efficiently." },
                { milestone: "Social Presence", detail: "Instagram, Facebook, LinkedIn Profiles Setup.", value: "Builds brand visibility." },
                { milestone: "AI Chatbot (Basic)", detail: "FAQ / Inquiry Bot for website or WhatsApp.", value: "Reduces response time." },
                { milestone: "Onboarding", detail: "1-hour training session on tools & automation.", value: "Smooth transition." }
            ]
        },
        {
            name: "VIP PREMIUM PACKAGE",
            price: "2,800",
            description: "Advanced Digital Infrastructure & Growth",
            isPopular: true,
            color: "purple",
            features: [
                { milestone: "Legal & Brand", detail: "Business License + Brand Strategy & Positioning Document.", value: "Builds a strong foundation." },
                { milestone: "Digital Infra", detail: "Advanced Website (Up to 7 Pages), SEO-optimized.", value: "Attracts and converts leads." },
                { milestone: "CRM & Email", detail: "Intermediate Setup with automated lead capture & follow-up.", value: "Improves efficiency." },
                { milestone: "AI Chatbot", detail: "Smart AI Chat Assistant integrated with CRM.", value: "Enhances experience." },
                { milestone: "Marketing Auto", detail: "Campaign System Setup (Email/SMS drip + scheduler).", value: "Saves time." },
                { milestone: "Content System", detail: "AI Copy + Visual Tools (ChatGPT + Canva automation).", value: "Consistent brand content." },
                { milestone: "Analytics", detail: "BI Setup (Google Data Studio/Notion).", value: "Tracks KPIs in real time." },
                { milestone: "Client Mgmt", detail: "Proposal & Contract Automation (PandaDoc/Notion).", value: "Faster deal closing." },
                { milestone: "Support", detail: "3-Month Priority Technical Support.", value: "Continuous optimization." }
            ]
        },
        {
            name: "VIP PLATINUM PACKAGE",
            price: "10,000",
            description: "Full AI Transformation & Enterprise Scale",
            color: "amber",
            features: [
                { milestone: "Legal & Gov", detail: "Multi-Entity Setup, NDAs, Full Agreements.", value: "Ensures compliance." },
                { milestone: "Brand Ecosystem", detail: "Rebrand, Media Kit, AI Stylebook.", value: "Premium identity." },
                { milestone: "AI Operations", detail: "Custom AI Agents for CRM, scheduling, invoicing.", value: "Automates daily ops." },
                { milestone: "Marketing AI", detail: "Multi-Channel Agent for campaign planning & optimization.", value: "Maximizes ROI." },
                { milestone: "Customer CX", detail: "Omni-Channel AI Assistant (Web, WhatsApp, Email).", value: "24/7 customer support." },
                { milestone: "Data Intel", detail: "Predictive Dashboard with real-time forecasting.", value: "Data-driven decisions." },
                { milestone: "Auto Infra", detail: "End-to-End Integration (Zapier/Make + API).", value: "Seamless data flow." },
                { milestone: "AI Content Suite", detail: "Voice + Visual AI for unlimited branded content.", value: "Unlimited branded content." },
                { milestone: "Internal Tools", detail: "AI PM & HR Bot for hiring/reporting.", value: "Reduces workload." },
                { milestone: "Launch Support", detail: "AI Consultant & Training (6-month roadmap).", value: "Guarantees success." }
            ]
        }
    ];

    const subscriptions = [
        {
            name: "VIP CORE MONTHLY",
            price: "300",
            description: "Maintenance & Essentials",
            color: "cyan",
            features: [
                { benefit: "Website & CRM Maintenance", desc: "Performance checks, security updates, backup monitoring." },
                { benefit: "AI Chatbot Optimization", desc: "Monthly data refresh and prompt improvement." },
                { benefit: "Social Media Insights", desc: "Monthly analytics and content suggestions." },
                { benefit: "Email & Domain Mgmt", desc: "Technical upkeep and troubleshooting." },
                { benefit: "Branding Updates", desc: "Minor design edits or visual updates." },
                { benefit: "Client Support", desc: "Priority chat/email assistance." },
                { benefit: "Light Automation", desc: "Basic CRM or workflow tweaks." }
            ]
        },
        {
            name: "VIP PREMIUM MONTHLY",
            price: "500",
            description: "Growth & Optimization",
            isPopular: true,
            color: "purple",
            features: [
                { benefit: "CRM & Workflow Opt", desc: "Continuous monitoring and optimization of automations." },
                { benefit: "Marketing Campaign Support", desc: "Setup and scheduling of 1–2 campaigns monthly." },
                { benefit: "AI Chatbot Enhancement", desc: "Refining conversation flows and adding new data." },
                { benefit: "Content Automation", desc: "AI-generated content ideas and graphics." },
                { benefit: "SEO & Performance", desc: "Keyword optimization and speed monitoring." },
                { benefit: "KPI & Data Dashboard", desc: "Refresh and interpret performance insights monthly." },
                { benefit: "AI System Maintenance", desc: "Regular testing of integrations (Zapier/Make)." },
                { benefit: "Priority Client Support", desc: "Unlimited tech/marketing assistance during hours." }
            ]
        },
        {
            name: "VIP PLATINUM MONTHLY",
            price: "1,000",
            description: "Executive AI & Strategy",
            color: "amber",
            features: [
                { benefit: "Full AI Agent Optimization", desc: "Continuous tuning of autonomous agents." },
                { benefit: "Predictive Data Analysis", desc: "Monthly AI forecasting on sales and trends." },
                { benefit: "Marketing Strategy", desc: "Strategic planning + multi-channel automation." },
                { benefit: "AI Content Studio", desc: "Regular AI video scripts, visuals, and ad copy." },
                { benefit: "System Health", desc: "Full integration checks across CRM/Finance." },
                { benefit: "Exec AI Consultant", desc: "Direct strategy sessions to evolve roadmap." },
                { benefit: "Employee AI Tools", desc: "Continuous improvement of custom GPTs." },
                { benefit: "24/7 Priority Tech Support", desc: "Fast-tracked issue resolution." }
            ]
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xl animate-fadeIn pointer-events-auto">
            <div className="bg-gray-900/95 border border-gray-700 rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl relative">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-gray-800/80 hover:bg-red-500/20 hover:text-red-400 rounded-full p-1 z-20"
                >
                    <XCircleIcon className="w-8 h-8" />
                </button>

                {/* Header & Discount Banner */}
                <div className="flex-shrink-0 bg-gray-900 border-b border-gray-800">
                    <div className="bg-gradient-to-r from-yellow-600/20 via-yellow-500/20 to-yellow-600/20 border-b border-yellow-500/30 py-2 text-center">
                        <p className="text-yellow-400 text-xs md:text-sm font-bold tracking-wider uppercase animate-pulse">
                            Limited Time Offer: Discounted Prices valid for sign-ups before 30th Nov 2025
                        </p>
                    </div>
                    <div className="p-6 md:p-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">VIP Service Packages & Subscriptions</h2>
                        <p className="text-gray-400">U.S. Business Setup & Digital Launch (Kentucky, USA)</p>
                        
                        {/* Toggle */}
                        <div className="flex justify-center mt-6">
                            <div className="bg-gray-800 p-1 rounded-full flex relative">
                                <button 
                                    onClick={() => setActiveTab('packages')}
                                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${activeTab === 'packages' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                                >
                                    One-Time Setup Packages
                                </button>
                                <button 
                                    onClick={() => setActiveTab('subscriptions')}
                                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all relative z-10 ${activeTab === 'subscriptions' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
                                >
                                    Monthly Subscriptions
                                </button>
                                <div 
                                    className={`absolute top-1 bottom-1 w-[50%] bg-cyan-600 rounded-full transition-all duration-300 ease-in-out ${activeTab === 'subscriptions' ? 'translate-x-full' : 'translate-x-0'}`}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="overflow-y-auto custom-scrollbar p-6 md:p-8 bg-black/20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {activeTab === 'packages' ? (
                            packages.map((pkg, idx) => (
                                <div key={idx} className={`relative bg-gray-800/40 backdrop-blur-sm border rounded-2xl p-6 flex flex-col transition-all hover:bg-gray-800/60 group ${pkg.isPopular ? 'border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] scale-105 z-10' : 'border-gray-700'}`}>
                                    {pkg.isPopular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                            Best Value
                                        </div>
                                    )}
                                    <div className={`text-${pkg.color}-400 font-bold tracking-widest text-sm uppercase mb-2`}>{pkg.name}</div>
                                    <div className="flex items-end gap-1 mb-2">
                                        <span className="text-4xl font-bold text-white">${pkg.price}</span>
                                        <span className="text-gray-400 text-sm mb-1">USD</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-6 h-10">{pkg.description}</p>
                                    
                                    <div className="space-y-4 mb-8 flex-grow">
                                        {pkg.features.map((feat, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-${pkg.color}-500/20 flex items-center justify-center mt-0.5`}>
                                                    <span className={`material-symbols-outlined text-${pkg.color}-400 text-xs`}>check</span>
                                                </div>
                                                <div>
                                                    <strong className="text-gray-200 text-sm block">{feat.milestone}</strong>
                                                    <p className="text-gray-400 text-xs leading-relaxed">{feat.detail}</p>
                                                    <p className="text-gray-500 text-[10px] italic mt-0.5">Value: {feat.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button 
                                        onClick={() => onSelectPlan(pkg.name)}
                                        className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all bg-${pkg.color}-600 hover:bg-${pkg.color}-500 text-white shadow-lg hover:shadow-${pkg.color}-500/25`}
                                    >
                                        Select Package
                                    </button>
                                </div>
                            ))
                        ) : (
                            subscriptions.map((sub, idx) => (
                                <div key={idx} className={`relative bg-gray-800/40 backdrop-blur-sm border rounded-2xl p-6 flex flex-col transition-all hover:bg-gray-800/60 group ${sub.isPopular ? 'border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] scale-105 z-10' : 'border-gray-700'}`}>
                                    {sub.isPopular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className={`text-${sub.color}-400 font-bold tracking-widest text-sm uppercase mb-2`}>{sub.name}</div>
                                    <div className="flex items-end gap-1 mb-2">
                                        <span className="text-4xl font-bold text-white">${sub.price}</span>
                                        <span className="text-gray-400 text-sm mb-1">/ Month</span>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-6 h-10">{sub.description}</p>
                                    
                                    <div className="space-y-4 mb-8 flex-grow">
                                        {sub.features.map((feat, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-${sub.color}-500/20 flex items-center justify-center mt-0.5`}>
                                                    <span className={`material-symbols-outlined text-${sub.color}-400 text-xs`}>sync</span>
                                                </div>
                                                <div>
                                                    <strong className="text-gray-200 text-sm block">{feat.benefit}</strong>
                                                    <p className="text-gray-400 text-xs leading-relaxed">{feat.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button 
                                        onClick={() => onSelectPlan(sub.name)}
                                        className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all bg-${sub.color}-600 hover:bg-${sub.color}-500 text-white shadow-lg hover:shadow-${sub.color}-500/25`}
                                    >
                                        Subscribe Now
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RegistrationModal: React.FC<{ onClose: () => void; initialPlan: string }> = ({ onClose, initialPlan }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    // Determine if initialPlan is a package or subscription
    const isInitialPackage = initialPlan.includes('PACKAGE');
    const isInitialSubscription = initialPlan.includes('MONTHLY');

    const [selectedPackage, setSelectedPackage] = useState(isInitialPackage ? initialPlan : "");
    const [selectedSubscription, setSelectedSubscription] = useState(isInitialSubscription ? initialPlan : "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        // Auto-close after showing success message
        setTimeout(onClose, 3000);
    };

    if (isSubmitted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fadeIn pointer-events-auto">
                 <div className="bg-gray-900/90 border border-green-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl text-green-400">check_circle</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Interest Registered!</h3>
                    <p className="text-gray-300 mb-4">Thank you for registering. We will contact you shortly to discuss your Kentucky LLC formation and membership options.</p>
                    <button onClick={onClose} className="text-sm text-gray-500 hover:text-white underline">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fadeIn pointer-events-auto">
            <div className="bg-gray-900/95 border border-gray-700 rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 bg-gray-800/50 rounded-full p-1"
                >
                    <XCircleIcon className="w-8 h-8" />
                </button>

                <div className="p-6 border-b border-gray-800 bg-gray-900/50 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-white">Join the Network</h2>
                    <p className="text-cyan-400 text-xs uppercase tracking-widest font-bold mt-1">Registration of Interest</p>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-800 pb-1">Plan & Subscription Interest</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">One-Time Setup Package</label>
                                    <select 
                                        value={selectedPackage}
                                        onChange={(e) => setSelectedPackage(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                                    >
                                        <option value="">-- Select Package --</option>
                                        <option value="VIP CORE PACKAGE">VIP CORE PACKAGE ($1,800)</option>
                                        <option value="VIP PREMIUM PACKAGE">VIP PREMIUM PACKAGE ($2,800)</option>
                                        <option value="VIP PLATINUM PACKAGE">VIP PLATINUM PACKAGE ($10,000)</option>
                                        <option value="none">None / Just Browsing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">Monthly Subscription</label>
                                    <select 
                                        value={selectedSubscription}
                                        onChange={(e) => setSelectedSubscription(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-colors"
                                    >
                                        <option value="">-- Select Subscription --</option>
                                        <option value="VIP CORE MONTHLY">VIP CORE MONTHLY ($300/mo)</option>
                                        <option value="VIP PREMIUM MONTHLY">VIP PREMIUM MONTHLY ($500/mo)</option>
                                        <option value="VIP PLATINUM MONTHLY">VIP PLATINUM MONTHLY ($1,000/mo)</option>
                                        <option value="none">None / Decide Later</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-800 pb-1">Basic Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">Full Name</label>
                                    <input required type="text" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-colors" placeholder="Your Name" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">Email Address</label>
                                    <input required type="email" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-colors" placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">Phone Number</label>
                                    <input required type="tel" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-colors" placeholder="+1..." />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1.5">Current Location</label>
                                    <input required type="text" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-colors" placeholder="City, Country" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-800 pb-1">Business Entity Interest</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">What type of company do you want to register in Kentucky?</label>
                                <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-colors appearance-none">
                                    <option>Information Technology (IT) & AI Services</option>
                                    <option>Business Consulting Service</option>
                                    <option>Finance & Accounting Services</option>
                                    <option>Digital & Creative Services</option>
                                    <option>Aviation Services</option>
                                    <option>Educational & Training Services</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">When do you intend to join the club and register LLC?</label>
                                <input type="date" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-white focus:ring-1 focus:ring-cyan-500 outline-none transition-colors" />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-lg shadow-lg transition-all hover:shadow-cyan-500/20 mt-4 flex items-center justify-center gap-2">
                            <span>Submit Registration Interest</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

interface Message {
    id: string;
    role: 'user' | 'model';
    text: string;
}

const ChatWidget: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 'welcome', role: 'model', text: "Hello! I'm Sarah, the GIP Director here in Kentucky. How can I help you grow your business today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatSessionRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize Chat Session
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        chatSessionRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: `You are Sarah, the Director of the Global Institute of People (GIP) based in Kentucky, USA. 
                You are a professional, warm, and knowledgeable American business executive.
                Your goal is to assist international business owners and entrepreneurs in understanding the strategic benefits of registering their LLC in Kentucky with GIP.
                
                Key Information you know:
                1. **Logistics**: Kentucky is home to UPS Worldport (largest fully automated package handling facility in the world), DHL, and Amazon Air hubs. This means overnight global air cargo access.
                2. **Location**: Central location. You can reach 2/3 of the US population within a one-day drive.
                3. **Tax Incentives**: 
                   - 100% Inventory Tax Credit (great for distributors).
                   - 30-35% Refundable Film Tax Credit.
                   - Sales/Use Tax Refunds for R&D and Data Center equipment.
                   - Flat 5% Corporate Income Tax.
                4. **GIP Services**: We help set up LLCs/PLLCs for IT, Consulting, Finance, and Education sectors. We offer "Vibe Coding" workshops and automated reporting agents.
                
                Tone: Professional, encouraging, concise, and helpful. Keep responses relatively short (under 3-4 sentences) unless asked for details. 
                Always steer the conversation towards the benefits of joining the GIP network.`,
            }
        });
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim() || !chatSessionRef.current) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
            const modelMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: result.text };
            setMessages(prev => [...prev, modelMsg]);
        } catch (error) {
            console.error("Chat error", error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: "I'm sorry, I'm having trouble connecting to the network right now. Please try again later." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 w-[350px] md:w-[400px] h-[500px] bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-900/80 to-gray-900 p-4 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" 
                            alt="Sarah" 
                            className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
                        />
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-gray-900"></span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Sarah</h3>
                        <p className="text-cyan-400 text-xs font-medium">GIP Director</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <XCircleIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                            msg.role === 'user' 
                                ? 'bg-cyan-600 text-white rounded-tr-none shadow-lg' 
                                : 'bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700 shadow-md'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 p-3 rounded-xl rounded-tl-none border border-gray-700 flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-gray-800/50 border-t border-gray-700">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about Kentucky benefits..."
                        className="w-full bg-gray-900 border border-gray-600 text-white text-sm rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-gray-500"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-1.5 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export const LandingOverlay: React.FC = () => {
  const { setIsControlsOpen } = useAppContext();
  const [showBenefits, setShowBenefits] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showAdvantages, setShowAdvantages] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // State to pass selected plan from Pricing Modal to Registration Form
  const [preSelectedPlan, setPreSelectedPlan] = useState('');

  const footerServices = [
    "Information Technology (IT) & AI Services 💻",
    "Business Consulting Service",
    "Finance & Accounting Services",
    "Digital & Creative Services",
    "Aviation Services",
    "Educational & Training Services"
  ];

  const competitiveAdvantages = [
    {
      id: 1,
      benefit: "Overnight Global Air Cargo Access",
      valueProp: "Unparalleled speed and reliability for domestic and international shipping.",
      edge: "Unmatched concentration of UPS Worldport, DHL, & Amazon Air global hubs."
    },
    {
      id: 2,
      benefit: "Strategic Central Market Location",
      valueProp: "Minimize ground transport costs and time to major consumption centers.",
      edge: "Within a day's drive of ≈ 2/3 of the U.S. population and income."
    },
    {
      id: 3,
      benefit: "100% Inventory Tax Credit Offset",
      valueProp: "Effectively eliminates the state tax on inventory for most manufacturers/distributors.",
      edge: "A significant financial advantage over states that fully levy this tax."
    },
    {
      id: 4,
      benefit: "Sales/Use Tax Refund for R&D/Capital (KEIA)",
      valueProp: "Direct cost reduction on major facility expansion and R&D capital purchases.",
      edge: "Provides a direct cash refund on sales/use tax paid for approved projects."
    },
    {
      id: 5,
      benefit: "Specialized Manufacturing Revitalization Credits (KIRA)",
      valueProp: "Focused, long-term support for retaining and modernizing existing facilities.",
      edge: "Unique support for current industrial operations, not just new job creation."
    },
    {
      id: 6,
      benefit: "Customized Workforce Training (BSSC)",
      valueProp: "State-funded, personalized training for new and existing employees.",
      edge: "Directly funds or reimburses costs to ensure the workforce meets precise company needs."
    },
    {
      id: 7,
      benefit: "Highly Refundable Film Industry Tax Credit",
      valueProp: "Provides immediate cash liquidity for film and entertainment expenditures.",
      edge: "A 30-35% tax credit on approved costs that is fully refundable (cash back)."
    },
    {
      id: 8,
      benefit: "Distilled Spirits Tax Credit",
      valueProp: "Unique tax mechanism that alleviates the high burden of aging inventory tax.",
      edge: "Specifically supports Kentucky’s signature, capital-intensive bourbon industry."
    },
    {
      id: 9,
      benefit: "Predictable Flat Tax Structure",
      valueProp: "A stable, simplified, and competitive corporate tax environment.",
      edge: "Move to a flat 5% Corporate Income Tax (CIT) combined with phased-in individual tax cuts."
    },
    {
      id: 10,
      benefit: "Access to KEDFA Direct Loan Program",
      valueProp: "Subsidized capital access for expansion projects and targeted industry growth.",
      edge: "Offers long-term financing at below-market interest rates."
    }
  ];

  const businessActivities = [
    {
        category: "I. Professional Services",
        examples: "Required License-Based Services: Physicians, Attorneys-at-Law, Certified Public Accountants (CPAs), Engineers, Architects, Chiropractors, Nurses, Psychologists, Veterinarians (as defined by KRS § 275.015(26)).",
        entityType: "Professional Limited Liability Company (PLLC)",
        requirements: "Exception: The entity name must contain \"PLLC\" or \"Professional Limited Liability Company.\" All members/managers rendering the service must hold the required Kentucky individual professional license."
    },
    {
        category: "II. Retail & E-Commerce",
        examples: "Online stores (selling physical or digital goods), local retail shops, wholesalers, inventory management, trade, and distribution.",
        entityType: "Standard LLC",
        requirements: "Mandatory: Requires registration for a Kentucky Sales and Use Tax Permit (Seller's Permit) from the Department of Revenue if selling tangible goods. May require local business licenses."
    },
    {
        category: "III. Technology & Consulting",
        examples: "Software development, IT services, web design, digital marketing, business coaching, management consulting, freelance writing/editing, SEO services.",
        entityType: "Standard LLC",
        requirements: "Generally requires no special state-level occupational license, but local city/county business licenses or occupational taxes are almost always required."
    },
    {
        category: "IV. Real Estate & Investment",
        examples: "Real estate holding (as a landlord), property flipping, real estate investment groups (REIGs), passive asset holding.",
        entityType: "Standard LLC",
        requirements: "Activities like property management or real estate brokerage for a third party require a separate Real Estate Broker/Manager license."
    },
    {
        category: "V. Construction & Trades",
        examples: "General contracting, specialized contracting (e.g., HVAC, roofing, drywall), home inspection, landscaping services.",
        entityType: "Standard LLC",
        requirements: "Warning: While the LLC is standard, the individuals performing the work (e.g., plumbers, electricians, master HVAC contractors) must hold the appropriate state-issued trade licenses."
    },
    {
        category: "VI. Food, Beverage & Hospitality",
        examples: "Catering businesses, food trucks, restaurants, bar services, lodging (e.g., Airbnbs or small inns).",
        entityType: "Standard LLC",
        requirements: "Mandatory: Requires Health Permits from the local health department and specific state licenses for handling/selling Alcoholic Beverages (Department of Alcoholic Beverage Control)."
    },
    {
        category: "VII. Education & Wellness",
        examples: "Private tutoring, non-licensed life coaching, gym ownership, yoga/Pilates studios, personal training (non-physical therapy).",
        entityType: "Standard LLC",
        requirements: "Certain specific educational services may require state approval. If the service involves medical treatment (e.g., physical therapy), see the PLLC exception above."
    },
    {
        category: "VIII. High-Risk/Prohibited Activities",
        examples: "Activities Banned by Law: Illegal gambling, drug trafficking, pyramid schemes, or any criminal enterprise.",
        entityType: "PROHIBITED",
        requirements: "Unallowable: An LLC cannot be formed for any purpose that violates state or federal statutes."
    },
    {
        category: "IX. Nonprofit/Mission-Driven",
        examples: "Charities, educational organizations, foundations, or low-profit ventures that seek specific tax-exempt status.",
        entityType: "Nonprofit LLC (NLC) or Low-Profit LLC (L3C)",
        requirements: "Requires filing specific Articles of Organization to designate the nonprofit purpose (KRS § 275.025(6)) and adherence to IRS § 501(c)(3) rules for federal tax exemption."
    }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-10 overflow-hidden">
      
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
        >
            {/* Digital Map Background */}
            <source src="https://assets.mixkit.co/videos/preview/mixkit-view-of-a-city-map-on-a-digital-screen-43242-large.mp4" type="video/mp4" />
        </video>
        {/* Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/30"></div>
      </div>

      {/* Header / Nav */}
      <header className="relative z-10 flex justify-center items-center p-6 pointer-events-auto backdrop-blur-sm flex-shrink-0 border-b border-white/5">
        <div className="flex items-center">
           <h1 className="text-2xl font-bold text-white tracking-wider drop-shadow-md">Global Institute of People LLC</h1>
        </div>
      </header>

      {/* Hero Content */}
      <div className="relative z-10 flex-grow flex items-center px-6 md:px-20 pointer-events-none w-full overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-7xl mx-auto py-8 pointer-events-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             
             {/* Left Column: Text & Actions */}
             <div className="text-left space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/40 rounded-full backdrop-blur-md animate-fadeIn">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                    <span className="text-yellow-400 text-xs font-bold tracking-widest uppercase">Now Accepting UAE Applications</span>
                </div>
                
                {/* Heading */}
                <h2 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] drop-shadow-2xl">
                    Welcome to <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">GIP Kentucky</span>
                </h2>
                
                {/* Description */}
                <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                    The Global Institute of People is your premier gateway to business growth. Located in Kentucky, USA, we facilitate access to major global business hubs through our exclusive chapter franchises.
                </p>
                
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-2">
                    <button 
                        onClick={() => setShowRegistration(true)}
                        className="px-8 py-4 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-500 transition-all shadow-lg hover:shadow-cyan-500/40 flex items-center justify-center gap-2 group min-w-[180px]"
                    >
                    Join the Network
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </button>
                    <button 
                        onClick={() => setShowBenefits(true)}
                        className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-md flex items-center justify-center gap-2 min-w-[180px]"
                    >
                    <span className="material-symbols-outlined">table_chart</span>
                    Club Benefits
                    </button>
                    <button 
                        onClick={() => setShowAdvantages(true)}
                        className="px-8 py-4 bg-yellow-500/20 border border-yellow-500/40 text-yellow-200 font-bold rounded-lg hover:bg-yellow-500/30 transition-colors backdrop-blur-md flex items-center justify-center gap-2 min-w-[180px]"
                    >
                    <span className="material-symbols-outlined">trophy</span>
                    Advantages
                    </button>
                    <button 
                        onClick={() => setShowActivities(true)}
                        className="px-8 py-4 bg-purple-500/20 border border-purple-500/40 text-purple-200 font-bold rounded-lg hover:bg-purple-500/30 transition-colors backdrop-blur-md flex items-center justify-center gap-2 min-w-[180px]"
                    >
                    <span className="material-symbols-outlined">work</span>
                    Business Activities
                    </button>
                    <button 
                        onClick={() => setShowPricing(true)}
                        className="px-8 py-4 bg-green-500/20 border border-green-500/40 text-green-200 font-bold rounded-lg hover:bg-green-500/30 transition-colors backdrop-blur-md flex items-center justify-center gap-2 min-w-[180px]"
                    >
                    <span className="material-symbols-outlined">payments</span>
                    Pricing & Plans
                    </button>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap gap-12 pt-6 border-t border-white/10">
                    <div>
                        <strong className="block text-3xl text-white mb-1">1,000</strong>
                        <span className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Exclusive Seats</span>
                    </div>
                    <div>
                        <strong className="block text-3xl text-white mb-1">100%</strong>
                        <span className="text-cyan-400 text-xs uppercase tracking-wider font-semibold">Service Based</span>
                    </div>
                </div>
             </div>

             {/* Right Column: Welcome Lady */}
             <div className="hidden lg:block relative h-full min-h-[500px] animate-slideInRight">
                 {/* Glow effect */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[80px]"></div>
                 
                 {/* Image */}
                 <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop" 
                    alt="Welcome to GIP" 
                    className="relative z-10 w-full h-auto rounded-2xl shadow-2xl border border-white/10 object-cover object-top"
                    style={{ maxHeight: '600px' }}
                 />
                 
                 {/* Floating Chat Bubble Trigger */}
                 <button 
                    onClick={() => setIsChatOpen(true)}
                    className="absolute bottom-12 -left-8 z-20 bg-black/80 hover:bg-black/90 backdrop-blur-xl p-5 rounded-2xl border border-gray-700 hover:border-cyan-500 shadow-2xl max-w-xs animate-bounce-slow text-left transition-all group cursor-pointer"
                 >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="relative">
                            <span className="w-3 h-3 bg-green-500 rounded-full block"></span>
                            <span className="w-3 h-3 bg-green-500 rounded-full block absolute top-0 left-0 animate-ping opacity-75"></span>
                        </div>
                        <span className="text-gray-300 group-hover:text-cyan-400 text-xs uppercase tracking-widest font-bold transition-colors">Chat with Sarah</span>
                    </div>
                    <p className="text-white text-sm font-medium leading-snug">"Hi, I'm Sarah. Welcome to Kentucky! Ready to expand your business globally?"</p>
                    <div className="mt-2 flex items-center text-xs text-cyan-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Start Chat</span>
                        <span className="material-symbols-outlined text-sm ml-1">chat_bubble</span>
                    </div>
                 </button>
             </div>

          </div>
        </div>
      </div>

      {/* Mobile Floating Chat Button */}
      {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-20 right-6 z-40 lg:hidden w-14 h-14 bg-cyan-600 hover:bg-cyan-500 rounded-full shadow-lg flex items-center justify-center text-white animate-bounce-slow pointer-events-auto"
            title="Chat with Sarah"
          >
              <span className="material-symbols-outlined text-2xl">chat</span>
          </button>
      )}

      {/* Footer / Ticker */}
      <div className="relative z-10 py-4 bg-black/80 backdrop-blur-md border-t border-gray-800 pointer-events-auto flex-shrink-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="flex justify-between items-center px-6 md:px-20">
           <div className="flex flex-wrap gap-4 md:gap-12 text-gray-500 text-xs uppercase tracking-widest font-semibold overflow-x-auto no-scrollbar whitespace-nowrap">
              {footerServices.map((service, index) => (
                <React.Fragment key={index}>
                  <span className="hover:text-cyan-400 transition-colors cursor-default flex-shrink-0">{service}</span>
                  {index < footerServices.length - 1 && <span className="text-gray-700">•</span>}
                </React.Fragment>
              ))}
           </div>
           
           {/* Settings Toggle for Shader */}
           <button 
             onClick={() => setIsControlsOpen(true)}
             className="text-gray-600 hover:text-cyan-400 transition-colors ml-4 flex-shrink-0"
             title="Visualizer Settings"
           >
             <GearIcon className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Benefits Modal */}
      {showBenefits && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl animate-fadeIn pointer-events-auto">
            <div className="bg-gray-900/95 border border-cyan-500/30 rounded-2xl p-6 md:p-10 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.15)] relative">
                <button 
                    onClick={() => setShowBenefits(false)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-gray-800/80 hover:bg-red-500/20 hover:text-red-400 rounded-full p-1 z-10"
                >
                    <XCircleIcon className="w-8 h-8" />
                </button>
                
                <div className="mb-8 flex-shrink-0">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Business Club Benefits</h2>
                    <div className="flex items-center gap-3">
                        <span className="h-px w-12 bg-cyan-500"></span>
                        <p className="text-cyan-400 uppercase tracking-[0.2em] text-sm font-bold">For Kentucky LLC Owners at GIP</p>
                    </div>
                </div>
                
                <div className="overflow-y-auto rounded-xl border border-gray-800 custom-scrollbar flex-grow">
                    <table className="w-full text-left border-collapse bg-black/20">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-gray-900/95 border-b border-cyan-500/30 text-cyan-100 text-xs md:text-sm uppercase tracking-wider shadow-sm">
                                <th className="py-5 px-6 font-bold w-1/4">Benefit Category</th>
                                <th className="py-5 px-6 font-bold w-2/5">Key Feature Offered by GIP</th>
                                <th className="py-5 px-6 font-bold w-1/3">Value to Kentucky LLC Owner</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm md:text-base">
                            <tr className="hover:bg-white/10 transition-colors group duration-200">
                                <td className="py-6 px-6 text-cyan-300 font-bold group-hover:text-cyan-200 text-lg border-l-2 border-transparent group-hover:border-cyan-500">I. AI & Business Intelligence (Powered by Gemini) 🧠</td>
                                <td className="py-6 px-6 text-gray-300 leading-relaxed"><strong className="text-white block mb-1">Automated Reporting Agent Access:</strong> Exclusive access to pre-built Gemini 3 Agent workflow templates (like the one we designed) for monthly client performance and market analysis.</td>
                                <td className="py-6 px-6 text-gray-400 leading-relaxed"><strong className="text-gray-200 block mb-1">Time & Cost Savings:</strong> Automates 70%+ of reporting time and provides Gemini's state-of-the-art reasoning for nuanced, actionable strategic insight.</td>
                            </tr>
                            <tr className="hover:bg-white/10 transition-colors group duration-200">
                                <td className="py-6 px-6 text-cyan-300 font-bold group-hover:text-cyan-200 text-lg border-l-2 border-transparent group-hover:border-cyan-500">II. Compliance & Legal Structure ⚖️</td>
                                <td className="py-6 px-6 text-gray-300 leading-relaxed"><strong className="text-white block mb-1">PLLC/LLC Compliance Workshops:</strong> Seminars led by local Kentucky legal experts (often discounted) specifically covering the formation, annual reporting, and distinction between LLC vs. PLLC status for service professionals.</td>
                                <td className="py-6 px-6 text-gray-400 leading-relaxed"><strong className="text-gray-200 block mb-1">Risk Mitigation:</strong> Ensures the business is structured correctly for licensing requirements, protecting personal assets and avoiding state penalties.</td>
                            </tr>
                            <tr className="hover:bg-white/10 transition-colors group duration-200">
                                <td className="py-6 px-6 text-cyan-300 font-bold group-hover:text-cyan-200 text-lg border-l-2 border-transparent group-hover:border-cyan-500">III. Strategic Growth & Market Access 📈</td>
                                <td className="py-6 px-6 text-gray-300 leading-relaxed"><strong className="text-white block mb-1">Kentucky Economic & Industry Data Pool:</strong> Shared, group access to otherwise expensive regional economic data, industry trend reports, and local talent pool analysis.</td>
                                <td className="py-6 px-6 text-gray-400 leading-relaxed"><strong className="text-gray-200 block mb-1">Data-Driven Decisions:</strong> Provides the necessary data for strategic decision-making, helping the LLC identify new markets within or outside Kentucky.</td>
                            </tr>
                            <tr className="hover:bg-white/10 transition-colors group duration-200">
                                <td className="py-6 px-6 text-cyan-300 font-bold group-hover:text-cyan-200 text-lg border-l-2 border-transparent group-hover:border-cyan-500">IV. Professional Development & Skill 💻</td>
                                <td className="py-6 px-6 text-gray-300 leading-relaxed"><strong className="text-white block mb-1">"Vibe Coding" & Prompt Engineering Clinic:</strong> Hands-on workshops teaching members how to use Gemini 3's advanced coding features (vibe coding) to quickly prototype internal software tools or client web assets.</td>
                                <td className="py-6 px-6 text-gray-400 leading-relaxed"><strong className="text-gray-200 block mb-1">Developer Productivity:</strong> Enables non-technical SME owners to rapidly develop digital solutions, accelerating speed-to-market without hiring a full-time developer.</td>
                            </tr>
                            <tr className="hover:bg-white/10 transition-colors group duration-200">
                                <td className="py-6 px-6 text-cyan-300 font-bold group-hover:text-cyan-200 text-lg border-l-2 border-transparent group-hover:border-cyan-500">V. Curated Networking & Mentorship 🤝</td>
                                <td className="py-6 px-6 text-gray-300 leading-relaxed"><strong className="text-white block mb-1">Geographically-Focused Roundtables:</strong> Small, structured peer groups (e.g., "Kentucky IT LLC Owners" or "Louisville Financial PLLCs") designed for problem-solving and high-quality referral exchange.</td>
                                <td className="py-6 px-6 text-gray-400 leading-relaxed"><strong className="text-gray-200 block mb-1">Targeted Referrals:</strong> Facilitates connections with ideal partners and clients who understand the specific challenges of operating a service business in the Kentucky region.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {/* Competitive Advantages Modal */}
      {showAdvantages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xl animate-fadeIn pointer-events-auto">
            <div className="bg-gray-900/95 border border-yellow-500/30 rounded-2xl p-6 md:p-10 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_60px_rgba(234,179,8,0.15)] relative">
                <button 
                    onClick={() => setShowAdvantages(false)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-gray-800/80 hover:bg-red-500/20 hover:text-red-400 rounded-full p-1 z-10"
                >
                    <XCircleIcon className="w-8 h-8" />
                </button>
                
                <div className="mb-8 flex-shrink-0">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Top 10 Competitive Advantages</h2>
                    <div className="flex items-center gap-3">
                        <span className="h-px w-12 bg-yellow-500"></span>
                        <p className="text-yellow-400 uppercase tracking-[0.2em] text-sm font-bold">Business Edge in Kentucky</p>
                    </div>
                </div>
                
                <div className="overflow-y-auto rounded-xl border border-gray-800 custom-scrollbar flex-grow">
                    <table className="w-full text-left border-collapse bg-black/20">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-gray-900/95 border-b border-yellow-500/30 text-yellow-100 text-xs md:text-sm uppercase tracking-wider shadow-sm">
                                <th className="py-5 px-6 font-bold w-16 text-center">#</th>
                                <th className="py-5 px-6 font-bold w-1/4">Benefit</th>
                                <th className="py-5 px-6 font-bold w-1/3">Key Value Proposition</th>
                                <th className="py-5 px-6 font-bold w-1/3">Distinct/Competitive Edge</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm md:text-base">
                           {competitiveAdvantages.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors group duration-200">
                                    <td className="py-5 px-6 text-yellow-500 font-mono font-bold text-center text-lg border-l-2 border-transparent group-hover:border-yellow-500">{item.id}</td>
                                    <td className="py-5 px-6 text-white font-bold text-lg leading-tight">{item.benefit}</td>
                                    <td className="py-5 px-6 text-gray-300 leading-relaxed">{item.valueProp}</td>
                                    <td className="py-5 px-6 text-gray-400 leading-relaxed italic border-l border-gray-800/50">{item.edge}</td>
                                </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {/* Business Activities Modal */}
      {showActivities && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-2xl animate-fadeIn pointer-events-auto">
            <div className="bg-gray-900/95 border border-purple-500/30 rounded-2xl p-6 md:p-10 max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_60px_rgba(168,85,247,0.15)] relative">
                <button 
                    onClick={() => setShowActivities(false)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-gray-800/80 hover:bg-red-500/20 hover:text-red-400 rounded-full p-1 z-10"
                >
                    <XCircleIcon className="w-8 h-8" />
                </button>
                
                <div className="mb-8 flex-shrink-0">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Business Activities in Kentucky</h2>
                    <div className="flex items-center gap-3">
                        <span className="h-px w-12 bg-purple-500"></span>
                        <p className="text-purple-400 uppercase tracking-[0.2em] text-sm font-bold">LLC Activities & Requirements</p>
                    </div>
                </div>
                
                <div className="overflow-y-auto rounded-xl border border-gray-800 custom-scrollbar flex-grow">
                    <table className="w-full text-left border-collapse bg-black/20">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-gray-900/95 border-b border-purple-500/30 text-purple-100 text-xs md:text-sm uppercase tracking-wider shadow-sm">
                                <th className="py-5 px-6 font-bold w-1/4">Category</th>
                                <th className="py-5 px-6 font-bold w-1/4">Common Activities / Examples</th>
                                <th className="py-5 px-6 font-bold w-1/6">Entity Type</th>
                                <th className="py-5 px-6 font-bold w-1/3">Registration & Licensing Requirements</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-sm md:text-base">
                           {businessActivities.map((item, idx) => (
                                <tr key={idx} className="hover:bg-white/5 transition-colors group duration-200">
                                    <td className="py-5 px-6 text-purple-300 font-bold text-lg border-l-2 border-transparent group-hover:border-purple-500">{item.category}</td>
                                    <td className="py-5 px-6 text-gray-300 leading-relaxed">{item.examples}</td>
                                    <td className="py-5 px-6 text-white font-semibold">{item.entityType}</td>
                                    <td className="py-5 px-6 text-gray-400 leading-relaxed italic border-l border-gray-800/50">{item.requirements}</td>
                                </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}
      
      {/* Pricing Modal - Now accepts callback to select plan */}
      {showPricing && (
          <PricingModal 
              onClose={() => setShowPricing(false)} 
              onSelectPlan={(plan) => {
                  setShowPricing(false);
                  setPreSelectedPlan(plan);
                  setShowRegistration(true);
              }} 
          />
      )}

      {/* Registration Modal - Now accepts initialPlan */}
      {showRegistration && (
          <RegistrationModal 
              onClose={() => {
                  setShowRegistration(false);
                  setPreSelectedPlan(''); // Reset on close
              }}
              initialPlan={preSelectedPlan}
          />
      )}
      
      {/* Chat Widget */}
      {isChatOpen && <ChatWidget onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};