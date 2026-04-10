import { useState } from "react";
import { Pill, Search, Activity, ShieldCheck, TrendingUp, AlertCircle, Sparkles, Loader2, History } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { analyzeSupplements } from "@/services/geminiService";

export default function App() {
  const [input, setInput] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeSupplements(input);
      // Clean up any potential <br> tags from the response
      const cleanedResult = result?.replace(/<br\s*\/?>/gi, "\n") || "";
      setAnalysis(cleanedResult || "분석 결과를 가져오지 못했습니다.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const examples = [
    "비타민C 1000mg, 비타민D 2000IU, 아연 10mg",
    "오메가3 1000mg, 루테인 20mg, 지아잔틴 4mg",
    "밀크씨슬 130mg, 비타민B1 10mg, 비타민B2 10mg",
    "유산균 100억 CFU, 프락토올리고당 3000mg"
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              NutriInsight <span className="text-indigo-600">Pro</span>
            </h1>
          </div>
          <Badge variant="secondary" className="font-medium bg-indigo-50 text-indigo-700 border-indigo-100">
            제약 유통 전문가 리포트
          </Badge>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input */}
        <div className="lg:col-span-5 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
              <Search className="w-5 h-5 text-indigo-600" />
              분석 대상 입력
            </h2>
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-700">제품명 및 성분 정보</CardTitle>
                <CardDescription className="text-slate-500">유통 전문가의 인사이트가 필요한 제품을 입력하세요.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="relative">
                  <Textarea
                    placeholder="예: 고려은단 비타민C 1000, 센트룸 멀티비타민..."
                    className="min-h-[150px] resize-none border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  {input && (
                    <button 
                      onClick={() => setInput("")}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <AlertCircle className="w-4 h-4 rotate-45" />
                    </button>
                  )}
                </div>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-md transition-all shadow-md"
                  onClick={handleAnalyze}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      전문가 리포트 생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      프리미엄 분석 시작
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </section>

          <section>
            <h3 className="text-sm font-bold text-slate-500 mb-3 flex items-center gap-2">
              <History className="w-4 h-4" />
              분석 예시
            </h3>
            <div className="flex flex-wrap gap-2">
              {examples.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(ex)}
                  className="text-xs bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 px-3 py-2 rounded-md transition-all text-slate-600 font-medium"
                >
                  {ex}
                </button>
              ))}
            </div>
          </section>

          <div className="bg-indigo-900 rounded-xl p-5 text-white shadow-lg">
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2 text-indigo-100">
              <TrendingUp className="w-4 h-4 text-indigo-300" />
              전문가 인사이트 포인트
            </h4>
            <ul className="text-xs space-y-3 text-indigo-200">
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-400">01.</span>
                원료 순도 및 유통 신선도 정밀 체크
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-400">02.</span>
                포장 형태에 따른 성분 안정성 분석
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-indigo-400">03.</span>
                NB vs PB 가성비 및 마케팅 함정 파악
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
            <Activity className="w-5 h-5 text-indigo-600" />
            프리미엄 분석 리포트
          </h2>
          
          <div className="min-h-[500px] relative">
            <AnimatePresence mode="wait">
              {!analysis && !isLoading && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50"
                >
                  <div className="bg-indigo-50 p-4 rounded-full mb-4">
                    <Pill className="w-8 h-8 text-indigo-300" />
                  </div>
                  <h3 className="text-slate-900 font-bold mb-2">리포트 생성 대기</h3>
                  <p className="text-slate-500 text-sm max-w-xs">
                    제품명을 입력하시면 10년 차 유통 전문가의 실무 데이터 기반 리포트가 생성됩니다.
                  </p>
                </motion.div>
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-2xl z-20"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="font-bold text-slate-900">실무 데이터 대조 및 분석 중...</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 bg-red-50 border border-red-100 rounded-2xl"
                >
                  <div className="flex items-center gap-3 text-red-700 mb-2">
                    <AlertCircle className="w-5 h-5" />
                    <h3 className="font-bold">분석 실패</h3>
                  </div>
                  <p className="text-sm text-red-600">{error}</p>
                </motion.div>
              )}

              {analysis && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-indigo-200" />
                      <span className="font-bold tracking-tight">Expert Verified Report</span>
                    </div>
                  </div>
                  <ScrollArea className="h-[600px] p-8">
                    <div className="markdown-body prose prose-indigo max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
                    </div>
                    <Separator className="my-8" />
                    <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Legal Disclaimer</p>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        본 리포트는 제약 유통 전문가의 실무 경험과 식약처 가이드라인을 바탕으로 작성되었습니다. 
                        건강기능식품은 질병의 치료를 목적으로 하는 의약품이 아니며, 섭취 전 반드시 전문가와 상의하십시오.
                      </p>
                    </div>
                  </ScrollArea>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2026 NutriInsight Pro. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <span>MFDS Compliance</span>
            <span>Distribution Insight</span>
            <span>Premium Analysis</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
