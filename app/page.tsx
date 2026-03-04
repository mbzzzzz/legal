"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string, content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | undefined;

    if ('files' in e.target && e.target.files) {
      file = e.target.files[0];
    } else if ('dataTransfer' in e && e.dataTransfer.files) {
      e.preventDefault();
      file = e.dataTransfer.files[0];
    }

    if (!file) return;

    setFileName(file.name);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setAnalysisResult(data.analysis || []);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error analyzing document. Please check console.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !fileName) return;

    const newMessages = [...chatMessages, { role: "user", content: chatInput.trim() }];
    setChatMessages(newMessages);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, fileName }),
      });
      const data = await res.json();
      if (data.response) {
        setChatMessages((prev: any) => [...prev, { role: "assistant", content: data.response }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden noise-bg bg-mesh selection:bg-primary/20">
      {/* Dynamic Background Blurs */}
      <div className="fixed top-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -left-20 w-96 h-96 bg-accent-blue/5 rounded-full blur-[150px] pointer-events-none" />
      {/* Floating Nav */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
        <header className="glass-nav rounded-full px-8 py-3 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-[#833cf6] p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">account_balance</span>
            </div>
            <h2 className="text-white text-lg font-extrabold tracking-tight">LegalEase AI</h2>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-slate-400 hover:text-[#833cf6] transition-colors text-sm font-medium" href="#">Intelligence</a>
            <a className="text-slate-400 hover:text-[#833cf6] transition-colors text-sm font-medium" href="#">Sovereignty</a>
            <a className="text-slate-400 hover:text-[#833cf6] transition-colors text-sm font-medium" href="#">Network</a>
            <a className="text-slate-400 hover:text-[#833cf6] transition-colors text-sm font-medium" href="#">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden sm:block text-white text-sm font-semibold px-4 py-2">Log In</button>
            <button className="bg-[#833cf6] hover:bg-[#833cf6]/90 text-white text-sm font-bold px-6 py-2 rounded-full transition-all shadow-lg shadow-[#833cf6]/20">
              Get Started
            </button>
          </div>
        </header>
      </nav>

      <main className="relative pt-40 pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center">

          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#833cf6]/10 border border-[#833cf6]/20 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#833cf6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#833cf6]"></span>
              </span>
              <span className="text-xs font-bold text-[#833cf6] tracking-wider uppercase">System Live: v4.2 Obsidian</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              High-Fidelity Legal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#833cf6] to-[#00d4ff]">Intelligence.</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
              The ultimate analytical layer for complex global litigation. Secure, sovereign, and instantaneous.
            </p>
          </motion.div>

          {/* Central Upload or Results Zone */}
          <div className="w-full max-w-4xl relative">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#833cf6]/20 rounded-full blur-[100px]"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#00d4ff]/10 rounded-full blur-[100px]"></div>

            <AnimatePresence mode="wait">
              {!isAnalyzing && !analysisResult && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onDragOver={onDragOver}
                  onDrop={handleFileUpload}
                  onClick={() => fileInputRef.current?.click()}
                  className="glass-card glow-border rounded-2xl p-12 flex flex-col items-center gap-8 relative z-10 group cursor-pointer transition-all duration-500 hover:bg-white/[0.05]"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.docx,.txt"
                  />
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-[#00d4ff]/50 transition-colors">
                    <span className="material-symbols-outlined text-4xl text-[#00d4ff]">cloud_upload</span>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-white">Document Drop Zone</h3>
                    <p className="text-slate-400 max-w-sm">
                      Drag and drop legal briefs, contracts, or discovery files. Securely encrypted in transit.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-widest">
                    <span className="px-3 py-1 border border-white/5 rounded bg-white/5">PDF</span>
                    <span className="px-3 py-1 border border-white/5 rounded bg-white/5">DOCX</span>
                    <span className="px-3 py-1 border border-white/5 rounded bg-white/5">TXT</span>
                  </div>
                  <button className="bg-white text-slate-900 font-bold px-10 py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Browse Local Files
                  </button>
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card glow-border rounded-2xl p-20 flex flex-col items-center gap-8 relative z-10 text-center"
                >
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-t-2 border-[#833cf6] animate-spin"></div>
                    <span className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-[#00d4ff]">refresh</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Analyzing Intelligence</h3>
                    <p className="text-slate-400">Extracting clauses and cross-referencing legal frameworks...</p>
                  </div>
                </motion.div>
              )}

              {analysisResult && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full space-y-6 relative z-10"
                >
                  <div className="flex items-center justify-between glass-card p-6 rounded-2xl border-[#00d4ff]/20">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-[#00d4ff] text-3xl">check_circle</span>
                      <div>
                        <h4 className="text-white font-bold text-lg">Analysis Complete</h4>
                        <p className="text-slate-400 text-sm italic">{fileName}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setAnalysisResult(null); setFileName(""); }}
                      className="text-xs font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      New Audit
                    </button>
                  </div>

                  <div className="space-y-6">
                    {analysisResult.length === 0 ? (
                      <div className="glass-card p-12 text-center text-slate-500">
                        No critical vulnerabilities detected in the analyzed segments.
                      </div>
                    ) : (
                      analysisResult.map((risk, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`glass-card p-8 rounded-2xl ${risk.riskLevel === 'High' ? 'risk-card-high' : 'risk-card-medium'}`}
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div className="space-y-1">
                              <span className={`tag ${risk.riskLevel === 'High' ? 'tag-high' : 'tag-medium'} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest`}>
                                {risk.riskLevel} Criticality
                              </span>
                              <h4 className="text-xl font-bold text-white tracking-tight">{risk.clauseTitle}</h4>
                            </div>
                            <span className={`material-symbols-outlined text-2xl ${risk.riskLevel === 'High' ? 'text-red-500' : 'text-amber-500'}`}>
                              {risk.riskLevel === 'High' ? 'warning' : 'info'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">lock</span> Raw Extract
                              </label>
                              <div className="bg-black/20 rounded-xl p-4 border border-white/5 text-sm text-slate-300 leading-relaxed font-mono">
                                {risk.originalText}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-[#00d4ff] tracking-[0.2em] flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">bolt</span> Intelligent Counter-Clause
                              </label>
                              <div className="bg-[#833cf6]/5 rounded-xl p-4 border border-[#833cf6]/20 text-sm text-white leading-relaxed relative group">
                                {risk.suggestedCounterClause}
                                <button
                                  onClick={() => navigator.clipboard.writeText(risk.suggestedCounterClause)}
                                  className="absolute bottom-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 rounded-lg border border-white/10 hover:bg-white/10"
                                  title="Copy to clipboard"
                                >
                                  <span className="material-symbols-outlined text-xs">content_copy</span>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-6 border-t border-white/5">
                            <p className="text-xs text-slate-400 leading-relaxed">
                              <strong className="text-slate-300">Analysis:</strong> {risk.riskDescription}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Features / Stats */}
          {!analysisResult && !isAnalyzing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-32">
              <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-[#833cf6]/30 transition-colors">
                <span className="material-symbols-outlined text-[#833cf6] text-3xl">shield_lock</span>
                <h4 className="text-lg font-bold text-white">Zero-Knowledge Privacy</h4>
                <p className="text-slate-400 text-sm leading-relaxed">Your data remains yours. We use differential privacy to ensure no documents are ever stored or used for training.</p>
              </div>
              <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-[#00d4ff]/30 transition-colors">
                <span className="material-symbols-outlined text-[#00d4ff] text-3xl">bolt</span>
                <h4 className="text-lg font-bold text-white">Instant Cross-Reference</h4>
                <p className="text-slate-400 text-sm leading-relaxed">Automatically scan your documents against global case law, statutes, and regulatory frameworks in seconds.</p>
              </div>
              <div className="glass-card p-8 rounded-2xl space-y-4 hover:border-[#833cf6]/30 transition-colors">
                <span className="material-symbols-outlined text-[#833cf6] text-3xl">contract_edit</span>
                <h4 className="text-lg font-bold text-white">Predictive Auditing</h4>
                <p className="text-slate-400 text-sm leading-relaxed">Identify high-risk clauses and potential legal loopholes before they become liabilities for your firm.</p>
              </div>
            </div>
          )}

          {/* Metric Dashboard */}
          <div className="w-full mt-32 border-t border-white/5 pt-20">
            <div className="flex flex-wrap justify-center gap-16 md:gap-32">
              <div className="text-center">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Assets Analyzed</p>
                <h2 className="text-4xl font-bold text-white">14.2M<span className="text-[#833cf6]">+</span></h2>
              </div>
              <div className="text-center">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Analysis Precision</p>
                <h2 className="text-4xl font-bold text-white">99.98<span className="text-[#00d4ff]">%</span></h2>
              </div>
              <div className="text-center">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-2">Average Latency</p>
                <h2 className="text-4xl font-bold text-white">1.4<span className="text-[#833cf6]">s</span></h2>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 opacity-20 hover:opacity-40 transition-opacity">
            <span className="text-white text-xs font-black tracking-widest">GDPR COMPLIANT</span>
            <span className="text-white text-xs font-black tracking-widest">ISO 27001</span>
            <span className="text-white text-xs font-black tracking-widest">SOC2 TYPE II</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <a className="hover:text-white transition-colors" href="#">Security</a>
            <a className="hover:text-white transition-colors" href="#">Privacy</a>
            <a className="hover:text-white transition-colors" href="#">Terms</a>
            <a className="hover:text-white transition-colors" href="#">Sovereignty</a>
          </div>
          <p className="text-slate-600 text-[10px] font-bold tracking-widest uppercase">
            © 2026 LEGALEASE AI. OBSIDIAN LAYER.
          </p>
        </div>
      </footer>

      {/* Floating Chat UI */}
      {analysisResult && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="glass-card w-80 md:w-96 rounded-2xl mb-4 overflow-hidden flex flex-col glow-border shadow-2xl"
                style={{ height: '450px' }}
              >
                {/* Chat Header */}
                <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#00d4ff] text-xl">forum</span>
                    <h3 className="text-white text-sm font-bold tracking-tight">Talk to Contract</h3>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                      <span className="material-symbols-outlined text-4xl mb-2 text-[#833cf6]">description</span>
                      <p className="text-xs text-slate-300">Ask questions about this specific document.</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-xl px-4 py-2 text-sm leading-relaxed ${msg.role === 'user'
                            ? 'bg-[#833cf6] text-white rounded-br-none'
                            : 'bg-white/10 text-slate-200 border border-white/5 rounded-bl-none'
                          }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))
                  )}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 text-slate-200 border border-white/5 rounded-xl rounded-bl-none px-4 py-2 text-sm flex items-center gap-2">
                        <span className="animate-spin material-symbols-outlined text-[#00d4ff] text-sm">cycle</span>
                        <span className="opacity-75 text-xs">Thinking...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-3 bg-black/40 border-t border-white/10">
                  <form onSubmit={handleChatSubmit} className="relative">
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 transition-colors placeholder-slate-500"
                      placeholder="Ask a question..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      disabled={isChatLoading}
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !chatInput.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[#00d4ff] hover:text-white disabled:opacity-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">send</span>
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-[#833cf6] hover:bg-[#833cf6]/80 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-[#833cf6]/20 transition-all hover:scale-105 border border-white/10"
            >
              <span className="material-symbols-outlined text-2xl">chat</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
}
