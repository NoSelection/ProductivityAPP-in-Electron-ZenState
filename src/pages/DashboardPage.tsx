import React from 'react';

export const DashboardPage: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto w-full flex flex-col gap-12">
            {/* Hero Section */}
            <div className="relative p-8 lg:p-12 rounded-3xl overflow-hidden group">
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--prismatic-2)]/10 via-[#0a0a0f] to-[var(--prismatic-1)]/5 backdrop-blur-xl border border-white/5" />

                {/* Animated Glow Orbs */}
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-[var(--prismatic-2)]/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[var(--prismatic-1)]/10 blur-[80px] rounded-full mix-blend-screen" />

                <div className="relative z-10 flex flex-col gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-[var(--prismatic-2)] animate-pulse shadow-[0_0_10px_var(--prismatic-2)]" />
                            <span className="font-mono-tech text-xs tracking-widest text-[var(--prismatic-2)]/70 uppercase">Command Interface</span>
                        </div>
                        <h1 className="font-display text-5xl lg:text-7xl font-bold text-white tracking-tight">
                            SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--prismatic-2)] to-[var(--prismatic-1)]">ONLINE</span>
                        </h1>
                    </div>

                    <p className="text-white/60 text-lg lg:text-xl max-w-xl leading-relaxed">
                        Welcome back, Operator. All systems are nominal. <br />
                        <span className="text-[var(--prismatic-2)]">Neural synchronization complete.</span>
                    </p>

                    {/* Action Line */}
                    <div className="h-px w-full max-w-md bg-gradient-to-r from-[var(--prismatic-2)]/50 to-transparent mt-4" />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Focus Time', value: '00:00', unit: 'HRS', color: 'text-[var(--prismatic-2)]', border: 'border-[var(--prismatic-2)]/20', bg: 'bg-[var(--prismatic-2)]/5' },
                    { label: 'Tasks Active', value: '0', unit: 'QUESTS', color: 'text-[var(--prismatic-1)]', border: 'border-[var(--prismatic-1)]/20', bg: 'bg-[var(--prismatic-1)]/5' },
                    { label: 'Streak', value: '1', unit: 'DAY', color: 'text-[var(--prismatic-3)]', border: 'border-[var(--prismatic-3)]/20', bg: 'bg-[var(--prismatic-3)]/5' },
                ].map((stat) => (
                    <div key={stat.label} className={`p-6 rounded-2xl bg-black/40 border hover:border-white/20 transition-all duration-300 group hover:-translate-y-1 ${stat.border}`}>
                        <div className="text-white/40 font-mono-tech text-xs uppercase tracking-widest mb-3 flex items-center justify-between">
                            {stat.label}
                            <div className={`w-1.5 h-1.5 rounded-full ${stat.bg.replace('/5', '')}`} />
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={`font-display text-4xl font-bold ${stat.color} drop-shadow-lg`}>{stat.value}</span>
                            <span className="text-white/20 font-bold text-xs">{stat.unit}</span>
                        </div>
                        {/* Interactive Hover Line */}
                        <div className={`mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500 ${stat.bg.replace('/5', '')}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};
