"use client";

import { useState } from "react";
import { 
  Search, TrendingUp, AlertCircle, Newspaper, Activity, Zap, 
  BarChart3, PieChart, DollarSign, Layers, ShieldCheck, 
  Scale, Target, Swords, Eye, ArrowUpRight, ArrowDownRight,
  Info, CheckCircle2, XCircle, UserCheck
} from "lucide-react";

export default function Dashboard() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (err: any) {
      alert(err.message || "Something went wrong. Make sure to use .TO for TSX stocks.");
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ label, value, icon: Icon, sublabel }: any) => (
    <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/50 flex flex-col items-center justify-center text-center hover:border-emerald-500/30 transition-colors">
      <div className="flex items-center gap-2 mb-2 text-neutral-500">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
      </div>
      <span className="text-lg font-bold text-neutral-100">{value}</span>
      {sublabel && <span className="text-[9px] text-neutral-600 mt-1 uppercase font-bold tracking-tighter">{sublabel}</span>}
    </div>
  );

  const SectionHeader = ({ icon: Icon, title, subtitle, color = "emerald" }: any) => (
    <div className="flex items-center gap-4 mb-6">
      <div className={`p-3 bg-${color}-500/10 text-${color}-400 rounded-2xl border border-${color}-500/20`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-neutral-100 tracking-tight">{title}</h2>
        <p className="text-xs text-neutral-500 font-medium">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold tracking-widest rounded uppercase border border-emerald-500/20">Institutional Grade</span>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-neutral-100 to-neutral-500 bg-clip-text text-transparent tracking-tighter">
              Equity Intelligence Engine
            </h1>
            <p className="text-neutral-500 font-medium">Deep-dive fundamental analysis & analyst debate platform.</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <div className="relative flex items-center group">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-xl group-focus-within:bg-emerald-500/20 transition-all"></div>
              <Search className="absolute left-4 text-neutral-500 w-5 h-5 group-focus-within:text-emerald-500 transition-colors z-10" />
              <input
                type="text"
                placeholder="Ticker (e.g., RY.TO, SU.TO, TD.TO)"
                className="w-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-neutral-600 relative z-10"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
              />
            </div>
          </form>
        </header>

        {/* State Management */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-48 space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-10 animate-pulse"></div>
              <div className="relative flex items-center justify-center">
                 <Activity className="w-16 h-16 text-emerald-500 animate-spin transition-all" style={{ animationDuration: '3s' }} />
                 <div className="absolute w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold tracking-tight">Gathering Intelligence</h3>
              <p className="text-neutral-500 animate-pulse font-medium max-w-xs mx-auto">Reviewing transcripts, sector dynamics, and calculating valuations...</p>
            </div>
          </div>
        ) : !data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
             {[
               { icon: Eye, title: "Deep Visibility", text: "We analyze beyond the balance sheet into management transcripts and sector trends." },
               { icon: Target, title: "Price Accuracy", text: "Multi-model price targets calculated through rerating & sector-specific multiples." },
               { icon: Swords, title: "Expert Debates", text: "Every stock is put through a simulated debate between a Super Bull and a Super Bear." }
             ].map((feature, i) => (
                <div key={i} className="bg-neutral-900/30 border border-neutral-800/50 p-8 rounded-[2.5rem] hover:border-neutral-700 transition-all group">
                   <feature.icon className="w-10 h-10 text-neutral-600 mb-6 group-hover:text-emerald-500 transition-colors" />
                   <h3 className="text-lg font-bold text-neutral-200 mb-2 tracking-tight">{feature.title}</h3>
                   <p className="text-sm text-neutral-500 leading-relaxed font-medium">{feature.text}</p>
                </div>
             ))}
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* Executive Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl">
                  <div className="absolute -top-24 -right-24 p-64 bg-emerald-500/5 rounded-full blur-[100px] -z-10 group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
                  
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-5">
                      <div className="p-5 bg-emerald-500/10 text-emerald-400 rounded-3xl border border-emerald-500/20">
                        <Activity className="w-10 h-10" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-neutral-100 tracking-tighter">{data.name}</h2>
                        <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500 font-bold uppercase tracking-widest">
                          <span>{data.ticker}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-neutral-800"></span>
                          <span className="text-emerald-500">{data.currentPrice} {data.currency}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-lg text-neutral-300 leading-relaxed font-medium">
                      {data.analysis.introduction}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-6 mt-6 border-t border-neutral-800/50">
                      <MetricCard label="P/E Ratio" value={data.financials.peRatio} icon={Activity} />
                      <MetricCard label="Revenue Growth" value={data.financials.revenueGrowth} icon={BarChart3} />
                      <MetricCard label="Div Yield" value={data.financials.dividendYield} icon={Zap} />
                      <MetricCard label="Market Cap" value={data.financials.marketCap} icon={Layers} />
                    </div>
                  </div>
                </div>

                {/* Gen-Z Investor Lounge */}
                <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] p-10 relative overflow-hidden group">
                   <div className="absolute -bottom-12 -right-12 p-32 bg-indigo-500/10 rounded-full blur-[60px] -z-10"></div>
                   <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl">
                         <Zap className="w-6 h-6" />
                      </div>
                      <div>
                         <h2 className="text-xl font-bold text-indigo-100 tracking-tight">The ELI5 Breakdown</h2>
                         <p className="text-xs text-indigo-400/80 font-bold uppercase tracking-widest">Products & Cash Flow in Simple Terms</p>
                      </div>
                   </div>
                   <p className="text-lg text-neutral-300 leading-relaxed font-medium italic">
                      "{data.analysis.twentyYearOldView}"
                   </p>
                </div>

                {/* Sector Dynamics */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-10 shadow-2xl">
                  <SectionHeader icon={PieChart} title="Sector Dynamics" subtitle="Ecosystem structure and market shifts" color="cyan" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div className="space-y-4">
                       <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500"><ArrowDownRight className="w-4 h-4 text-red-500" /> Sector Headwinds</h4>
                       <p className="text-sm text-neutral-400 leading-relaxed bg-neutral-950/50 p-6 rounded-3xl border border-neutral-800/50 min-h-[120px]">{data.analysis.sectorDynamics.headwinds}</p>
                    </div>
                    <div className="space-y-4">
                       <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-500"><ArrowUpRight className="w-4 h-4 text-emerald-500" /> Sector Tailwinds</h4>
                       <p className="text-sm text-neutral-400 leading-relaxed bg-neutral-950/50 p-6 rounded-3xl border border-neutral-800/50 min-h-[120px]">{data.analysis.sectorDynamics.tailwinds}</p>
                    </div>
                  </div>
                  <div className="mt-8 bg-cyan-500/5 border border-cyan-500/20 rounded-3xl p-6 flex gap-4 items-start">
                     <Info className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                     <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Current Shift</span>
                        <p className="text-sm text-cyan-100/80 leading-relaxed font-medium">{data.analysis.sectorDynamics.majorShifts}</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Analysis */}
              <div className="space-y-8">
                {/* Management Audit */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-8 shadow-xl">
                  <SectionHeader icon={UserCheck} title="Management Audit" subtitle="Capability & Trustworthiness" color="amber" />
                  <div className="space-y-6 mt-4">
                    <div className="bg-neutral-950 p-6 rounded-3xl border border-neutral-800">
                      <div className="flex items-center justify-between mb-4">
                         <span className="text-xs font-bold text-neutral-500 uppercase">Capability Score</span>
                         <span className="text-lg font-black text-amber-500">{data.analysis.managementAudit.capabilityScore} / 10</span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">{data.analysis.managementAudit.trustworthiness}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">Turnaround Plan</h4>
                      <p className="text-sm text-neutral-300 leading-relaxed">{data.analysis.managementAudit.turnaroundPlan}</p>
                    </div>
                  </div>
                </div>

                {/* Price Targets */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-[60px] -z-10"></div>
                  <SectionHeader icon={Target} title="Valuation" subtitle="12-Month Projected Growth" color="emerald" />
                  <div className="space-y-4 mt-4">
                    {/* Intrinsic Value Card */}
                    <div className="bg-gradient-to-br from-emerald-500/20 to-transparent p-6 rounded-3xl border border-emerald-500/30 mb-6">
                       <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                             <ShieldCheck className="w-5 h-5 text-emerald-400" />
                             <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Intrinsic Value</span>
                          </div>
                          <span className="text-2xl font-black text-white">{data.analysis.intrinsicValue.value} {data.currency}</span>
                       </div>
                       <p className="text-[11px] text-neutral-400 leading-relaxed font-medium">
                          <span className="text-emerald-500 font-bold uppercase mr-2">Methodology:</span>
                          {data.analysis.intrinsicValue.logic}
                       </p>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">Price Targets</h4>
                       {data.analysis.priceTargets.map((target: any, i: number) => (
                      <div key={i} className="bg-neutral-950/80 p-5 rounded-3xl border border-neutral-800 hover:border-emerald-500/50 transition-all group">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{target.method}</span>
                            <span className="text-xl font-black text-emerald-400 animate-in fade-in slide-in-from-right-2 duration-1000 delay-500">{target.target} {data.currency}</span>
                         </div>
                         <p className="text-[11px] text-neutral-400 leading-relaxed font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">{target.logic}</p>
                      </div>
                    ))}
                    </div>
                  </div>
                </div>

                {/* Alternative Plays */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-8 shadow-xl">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-4 flex items-center gap-2">
                     <Scale className="w-4 h-4" /> Alternative Sector Plays
                   </h4>
                   <div className="space-y-3">
                     {data.analysis.alternatives.map((alt: any, i: number) => (
                       <div key={i} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex items-center justify-between group cursor-pointer hover:border-neutral-600 transition-all">
                          <div>
                            <span className="text-sm font-black text-neutral-200">{alt.ticker}</span>
                            <p className="text-[10px] text-neutral-500">{alt.reason}</p>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-neutral-700 group-hover:text-emerald-500 transition-all" />
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            {/* The Great Debate */}
            <div className="relative">
               <div className="absolute inset-0 bg-emerald-500/5 blur-[120px] -z-10"></div>
               <div className="bg-neutral-900 border-x border-t border-neutral-800 rounded-t-[3rem] p-12 shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.5)]">
                 <div className="flex flex-col items-center justify-center text-center mb-12">
                    <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full mb-4 border border-emerald-500/20">
                      <Swords className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-white">The Analyst Debate</h2>
                    <p className="text-neutral-500 font-medium mt-2 max-w-lg italic">"Strong Opinions, Lightly Held" — Battle of the Consensus</p>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-800 hidden lg:block"></div>
                    
                    {/* Bull Case */}
                    <div className="space-y-6 animate-in slide-in-from-left-8 duration-1000">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          <h3 className="text-xl font-black text-white uppercase tracking-tighter">Super Bull Strategy</h3>
                       </div>
                       <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem] relative">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <TrendingUp className="w-12 h-12 text-emerald-500" />
                          </div>
                          <p className="text-neutral-200 leading-relaxed font-medium italic">
                            {data.analysis.debate.bull}
                          </p>
                       </div>
                    </div>

                    {/* Bear Case */}
                    <div className="space-y-6 animate-in slide-in-from-right-8 duration-1000">
                       <div className="flex items-center gap-3 justify-end lg:justify-start">
                          <h3 className="text-xl font-black text-white uppercase tracking-tighter order-2 lg:order-1">Super Bear Warning</h3>
                          <XCircle className="w-6 h-6 text-red-500 order-1 lg:order-2" />
                       </div>
                       <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[2rem] relative">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <ArrowDownRight className="w-12 h-12 text-red-500" />
                          </div>
                          <p className="text-neutral-200 leading-relaxed font-medium italic text-right lg:text-left">
                            {data.analysis.debate.bear}
                          </p>
                       </div>
                    </div>
                 </div>

                 {/* The Verdict */}
                 <div className="mt-20 pt-16 border-t border-neutral-800 flex flex-col items-center">
                    <div className="bg-neutral-950 md:max-w-3xl w-full border border-neutral-800 rounded-[2.5rem] p-10 relative shadow-inner group">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-emerald-500 text-black rounded-full text-xs font-black tracking-widest uppercase">
                          The Verdict
                       </div>
                       <div className="flex gap-6 items-start">
                          <div className="p-4 bg-neutral-900 rounded-2xl flex-shrink-0 border border-neutral-800">
                            <Scale className="w-8 h-8 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-neutral-200 mb-3 tracking-tight">Neutral Observer Judgment</h4>
                            <p className="text-neutral-400 leading-relaxed font-medium">
                               {data.analysis.debate.observer}
                            </p>
                          </div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Hidden Risks Footer */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-8 items-center mb-24">
               <div className="p-6 bg-red-500/20 text-red-400 rounded-3xl">
                  <AlertCircle className="w-10 h-10" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-neutral-100 tracking-tighter uppercase">Audit Warning: Hidden Financial Risks</h3>
                  <p className="text-neutral-400 font-medium leading-relaxed max-w-3xl">
                    {data.analysis.thesis.hiddenRisks}
                  </p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
