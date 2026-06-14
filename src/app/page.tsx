"use client";

import { useState } from "react";
import { 
  Search, TrendingUp, AlertCircle, Activity, Zap, 
  BarChart3, PieChart, Layers, ShieldCheck, 
  Scale, Target, Swords, Eye, ArrowUpRight, ArrowDownRight,
  Info, CheckCircle2, XCircle, UserCheck, HelpCircle, Users, BarChart, Loader2
} from "lucide-react";

export default function Dashboard() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isFetchingTrending, setIsFetchingTrending] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [screenerReason, setScreenerReason] = useState("");
  const fetchAnalysis = async (searchTicker: string) => {
    if (!searchTicker) return;
    setLoading(true);
    setData(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: searchTicker }),
      });
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setData(result);
      setActiveTab("overview");
    } catch (err: any) {
      alert(err.message || "Something went wrong. Make sure to use .TO for TSX stocks.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalysis(ticker);
  };

  const handleTrendingSearch = async () => {
    setIsFetchingTrending(true);
    try {
      const res = await fetch("/api/trending");
      const result = await res.json();
      if (result.ticker) {
        setTicker(result.ticker);
        fetchAnalysis(result.ticker);
      }
    } catch (error) {
      alert("Could not fetch trending stocks. Try searching manually.");
    } finally {
      setIsFetchingTrending(false);
    }
  };

  const handleScreener = async () => {
    setIsScanning(true);
    setScreenerReason("");
    try {
      const res = await fetch("/api/screener");
      const result = await res.json();
      if (result.ticker) {
        setTicker(result.ticker);
        setScreenerReason(result.reason || "");
        await fetchAnalysis(result.ticker);
      } else {
        alert("Could not find a match right now. Try again!");
      }
    } catch (error) {
      alert("AI Screener encountered an error.");
    } finally {
      setIsScanning(false);
    }
  };

  const Tooltip = ({ content, children }: { content: string, children: React.ReactNode }) => (
    <div className="relative flex items-center group/tooltip cursor-help">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-neutral-800 text-neutral-200 text-xs rounded-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all whitespace-nowrap shadow-xl z-50 pointer-events-none border border-neutral-700">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-neutral-800"></div>
      </div>
    </div>
  );

  const MetricCard = ({ label, value, icon: Icon, sublabel, tooltip }: any) => (
    <Tooltip content={tooltip}>
      <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/50 flex flex-col items-center justify-center text-center hover:border-emerald-500/30 transition-colors w-full">
        <div className="flex items-center gap-1.5 mb-2 text-neutral-500">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
          <HelpCircle className="w-3 h-3 text-neutral-600" />
        </div>
        <span className="text-lg font-bold text-neutral-100">{value}</span>
        {sublabel && <span className="text-[9px] text-neutral-600 mt-1 uppercase font-bold tracking-tighter">{sublabel}</span>}
      </div>
    </Tooltip>
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

  const renderTabNavigation = () => (
    <div className="flex overflow-x-auto gap-2 bg-neutral-900/50 p-2 rounded-2xl border border-neutral-800 mb-8 max-w-2xl mx-auto">
      {[
        { id: "overview", label: "Overview & ELI5", icon: Eye },
        { id: "deep-dive", label: "Deep Dive Analysis", icon: Layers },
        { id: "sentiment", label: "Insiders & Analysts", icon: BarChart }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === tab.id 
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
              : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50"
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );

  // === GOOGLE STYLE LANDING PAGE ===
  if (!data && !loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neutral-900/50 blur-[120px] rounded-full -z-10"></div>
        
        <div className="w-full max-w-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
          
          {/* Classic Google Colors Logo: Blue, Red, Yellow, Green */}
          <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-10 select-none">
            <span className="text-[#4285F4]">O</span>
            <span className="text-[#EA4335]">g</span>
            <span className="text-[#FBBC05]">i</span>
            <span className="text-[#34A853]">e</span>
          </h1>

          <form onSubmit={handleSearch} className="w-full relative group">
            <div className="absolute inset-0 bg-neutral-800/50 rounded-full blur-xl group-hover:bg-neutral-800 transition-all duration-500 -z-10"></div>
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5 group-hover:text-neutral-300 transition-colors z-10" />
            <input
              type="text"
              placeholder="Search for a ticker (e.g., AAPL, TD.TO)..."
              className="w-full bg-neutral-900/80 backdrop-blur-md border border-neutral-700/50 hover:border-neutral-600 focus:border-neutral-500 rounded-full py-4 pl-14 pr-6 text-lg font-medium text-neutral-100 focus:outline-none focus:ring-4 focus:ring-neutral-800/50 transition-all placeholder:text-neutral-500 shadow-2xl relative z-10"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              autoFocus
            />
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 w-full">
            <button 
              onClick={handleSearch}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl text-sm font-bold text-neutral-300 transition-all shadow-lg w-full sm:w-auto"
            >
              Analyze Stock
            </button>
            <button 
              onClick={handleTrendingSearch}
              disabled={isFetchingTrending || isScanning}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-xl text-sm font-bold text-neutral-300 transition-all flex justify-center items-center gap-2 shadow-lg w-full sm:w-auto disabled:opacity-50"
            >
              {isFetchingTrending ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4 text-emerald-500" />}
              Trending Active
            </button>
            <button 
              onClick={handleScreener}
              disabled={isScanning || isFetchingTrending}
              className="px-6 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-500/50 rounded-xl text-sm font-black text-indigo-400 transition-all flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.2)] w-full sm:w-auto disabled:opacity-50"
            >
              {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {isScanning ? "AI Scanning TSX..." : "Find Undervalued Gem"}
            </button>
          </div>

          <p className="mt-12 text-xs text-neutral-600 font-medium tracking-wide">
             Institutional Grade Intelligence • Simplified for Everyone
          </p>
        </div>
      </div>
    );
  }

  // === DASHBOARD VIEW ===
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header (Top-left logo style) */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-in slide-in-from-top-4 duration-500">
          <div 
             className="flex items-center cursor-pointer select-none group"
             onClick={() => { setData(null); setTicker(""); }}
          >
            <h1 className="text-3xl font-black tracking-tighter">
              <span className="text-[#4285F4]">O</span>
              <span className="text-[#EA4335]">g</span>
              <span className="text-[#FBBC05]">i</span>
              <span className="text-[#34A853]">e</span>
            </h1>
            <span className="ml-3 px-2 py-0.5 bg-neutral-900 text-neutral-400 text-[10px] font-bold tracking-widest rounded uppercase border border-neutral-800 group-hover:border-neutral-700 transition-colors">Intelligence</span>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-[400px]">
            <div className="relative flex items-center group">
              <div className="absolute inset-0 bg-neutral-900/50 rounded-full blur-xl group-focus-within:bg-neutral-800/50 transition-all"></div>
              <Search className="absolute left-4 text-neutral-500 w-4 h-4 group-focus-within:text-neutral-300 transition-colors z-10" />
              <input
                type="text"
                placeholder="Search ticker..."
                className="w-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-full py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-700 transition-all placeholder:text-neutral-600 relative z-10"
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
              <h3 className="text-xl font-bold tracking-tight">{isScanning ? "AI Screener Active" : "Gathering Intelligence"}</h3>
              <p className="text-neutral-500 animate-pulse font-medium max-w-xs mx-auto">
                {isScanning ? "Scouring the TSX for undervalued gems using Benjamin Graham's intrinsic value formula..." : "Reviewing transcripts, sector dynamics, and calculating valuations..."}
              </p>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {renderTabNavigation()}

            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Executive Overview */}
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
                  
                  {screenerReason && (
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 mb-8 flex gap-4 items-start">
                       <Zap className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                       <div>
                         <h4 className="text-sm font-black text-indigo-300 uppercase tracking-widest mb-1">AI Screener Alert</h4>
                         <p className="text-sm text-indigo-100/80 font-medium leading-relaxed">{screenerReason}</p>
                       </div>
                    </div>
                  )}

                  <div className="space-y-6">
                    <p className="text-lg text-neutral-300 leading-relaxed font-medium">
                      {data.analysis.introduction}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-neutral-800/50">
                      <MetricCard label="P/E Ratio" value={data.financials.peRatio} icon={Activity} tooltip="Price-to-Earnings: How many years it takes to earn back its stock price." />
                      <MetricCard label="Rev Growth" value={data.financials.revenueGrowth} icon={BarChart3} tooltip="How fast their sales are growing compared to last year." />
                      <MetricCard label="Div Yield" value={data.financials.dividendYield} icon={Zap} tooltip="The cash percentage they pay you every year just for holding the stock." />
                      <MetricCard label="Market Cap" value={data.financials.marketCap} icon={Layers} tooltip="The total price tag to buy the entire company right now." />
                    </div>
                  </div>
                </div>

                {/* ELI5 Breakdown */}
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

                {/* Intrinsic Value */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-neutral-900 p-10 rounded-[2.5rem] border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">
                      <ShieldCheck className="w-5 h-5" /> Realistic Intrinsic Value
                    </h3>
                    <p className="text-neutral-400 max-w-lg leading-relaxed">
                      <strong className="text-neutral-200">Methodology:</strong> {data.analysis.intrinsicValue.logic}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-5xl font-black text-white">{data.analysis.intrinsicValue.value} <span className="text-2xl text-emerald-500">{data.currency}</span></span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DEEP DIVE */}
            {activeTab === "deep-dive" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
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

                  {/* End Sector Dynamics */}
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
            )}

            {/* TAB: SENTIMENT */}
            {activeTab === "sentiment" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Wall Street Recommendations */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-10 shadow-2xl">
                   <SectionHeader icon={TrendingUp} title="Wall Street Sentiment" subtitle="Current analyst recommendations" color="blue" />
                   
                   <div className="bg-neutral-950 p-8 rounded-3xl border border-neutral-800 text-center mb-8">
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-500 block mb-2">Consensus Rating</span>
                      <h3 className="text-5xl font-black text-blue-400 capitalize">{data.marketSentiment.recommendation.replace('_', ' ')}</h3>
                      {data.marketSentiment.targetMeanPrice && (
                        <p className="mt-4 text-neutral-400 font-medium">Average Target Price: <strong className="text-white">${data.marketSentiment.targetMeanPrice}</strong></p>
                      )}
                   </div>

                   {data.marketSentiment.trend && (
                     <div className="space-y-4">
                       <h4 className="text-xs font-black uppercase tracking-widest text-neutral-500 mb-4">Latest Month Breakdown</h4>
                       {[
                         { label: "Strong Buy", count: data.marketSentiment.trend.strongBuy, color: "bg-emerald-500" },
                         { label: "Buy", count: data.marketSentiment.trend.buy, color: "bg-emerald-400" },
                         { label: "Hold", count: data.marketSentiment.trend.hold, color: "bg-amber-500" },
                         { label: "Sell", count: data.marketSentiment.trend.sell, color: "bg-red-400" },
                         { label: "Strong Sell", count: data.marketSentiment.trend.strongSell, color: "bg-red-500" }
                       ].map((item, i) => item.count > 0 && (
                         <div key={i} className="flex items-center gap-4">
                            <div className="w-24 text-right text-xs font-bold text-neutral-400">{item.label}</div>
                            <div className="flex-1 bg-neutral-950 rounded-full h-3 overflow-hidden">
                               <div className={`h-full ${item.color}`} style={{ width: (item.count / 30) * 100 + "%" }}></div>
                            </div>
                            <div className="w-8 text-sm font-black">{item.count}</div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>

                {/* Insider Trading */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-10 shadow-2xl">
                   <SectionHeader icon={Users} title="Corporate Insider Trading" subtitle="Recent buys/sells by executives" color="purple" />
                   
                   <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-2xl flex gap-3 items-start mb-8">
                     <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                     <p className="text-xs text-purple-200/80 leading-relaxed font-medium">
                       Tracking trades made by corporate insiders (CEOs, CFOs, Board Members). Note: Tracking politicians requires specialized API keys, so we focus exclusively on actual corporate executives here.
                     </p>
                   </div>

                   <div className="space-y-3">
                      {data.insiderTrades.length === 0 ? (
                        <p className="text-neutral-500 text-center py-8">No recent insider trading activity found.</p>
                      ) : (
                        data.insiderTrades.map((trade: any, i: number) => (
                          <div key={i} className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                             <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                               <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <h4 className="text-sm font-bold text-neutral-200">{trade.filerName}</h4>
                                    {trade.date && <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded-full text-[9px] font-bold tracking-widest text-neutral-400 uppercase">{trade.date}</span>}
                                  </div>
                                  <p className="text-[10px] text-neutral-500">{trade.transactionText}</p>
                               </div>
                               <div className="text-left sm:text-right flex-shrink-0">
                                  <span className="block text-sm font-black text-white">
                                    {trade.shares ? trade.shares.toLocaleString() : 0} Shares
                                  </span>
                                  <span className="block text-[10px] text-neutral-400 mt-1">
                                    Value: ${trade.value ? trade.value.toLocaleString() : 0}
                                  </span>
                               </div>
                             </div>
                             {trade.simpleExplanation && (
                               <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl p-3 flex gap-3">
                                 <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                 <p className="text-xs text-neutral-300 font-medium leading-relaxed">{trade.simpleExplanation}</p>
                               </div>
                             )}
                          </div>
                        ))
                      )}
                   </div>
                </div>

              </div>
            )}
            {/* The Great Debate (Moved to Sentiment Tab) */}
            {activeTab === "sentiment" && (
                <div className="bg-neutral-900 border border-neutral-800 rounded-[3rem] p-10 shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.5)] mt-8">
                  <div className="flex flex-col items-center justify-center text-center mb-12">
                      <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full mb-4 border border-emerald-500/20">
                        <Swords className="w-10 h-10" />
                      </div>
                      <h2 className="text-4xl font-black tracking-tighter text-white">The Analyst Debate</h2>
                      <p className="text-neutral-500 font-medium mt-2 max-w-lg italic">"Strong Opinions, Lightly Held" — Battle of the Consensus</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-800 hidden lg:block"></div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Super Bull Strategy</h3>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem] relative">
                            <p className="text-neutral-200 leading-relaxed font-medium italic">
                              {data.analysis.debate.bull}
                            </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-3 justify-end lg:justify-start">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter order-2 lg:order-1">Super Bear Warning</h3>
                            <XCircle className="w-6 h-6 text-red-500 order-1 lg:order-2" />
                        </div>
                        <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-[2rem] relative">
                            <p className="text-neutral-200 leading-relaxed font-medium italic text-right lg:text-left">
                              {data.analysis.debate.bear}
                            </p>
                        </div>
                      </div>
                  </div>

                  <div className="mt-12 pt-12 border-t border-neutral-800">
                      <div className="bg-neutral-950 w-full border border-neutral-800 rounded-[2.5rem] p-8">
                        <div className="flex gap-6 items-start">
                            <div className="p-4 bg-neutral-900 rounded-2xl flex-shrink-0 border border-neutral-800">
                              <Scale className="w-8 h-8 text-neutral-400" />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-neutral-200 mb-2 tracking-tight">Neutral Observer Judgment</h4>
                              <p className="text-neutral-400 leading-relaxed font-medium">
                                {data.analysis.debate.observer}
                              </p>
                            </div>
                        </div>
                      </div>
                  </div>
                </div>
            )}

            {/* Hidden Risks Footer */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-8 items-center mb-24 mt-12">
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
        ) : null}
      </div>
    </div>
  );
}
