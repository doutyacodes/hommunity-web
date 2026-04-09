"use client";

import { useState } from "react";
import { ChevronRight, Plus, X, Check, GripVertical, HelpCircle, Hash, AlignLeft, ChevronDown, ToggleLeft } from "lucide-react";

type QuestionType = "text" | "number" | "select" | "boolean";

interface Question {
  id: string;
  question: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  order: number;
}

const initialQuestions: Question[] = [
  { id: "q1", question: "Number of people in your household", type: "number", required: true, order: 1 },
  { id: "q2", question: "Do you have any pets?", type: "boolean", required: true, order: 2 },
  { id: "q3", question: "Pet type and breed (if applicable)", type: "text", required: false, order: 3 },
  { id: "q4", question: "Vehicle registration number (car/bike)", type: "text", required: false, order: 4 },
  { id: "q5", question: "Number of parking spaces needed", type: "number", required: false, order: 5 },
  { id: "q6", question: "Primary language preference for notices", type: "select", required: false, options: ["English", "Spanish", "French", "Arabic", "Mandarin"], order: 6 },
];

const typeConfig: Record<QuestionType, { label: string; color: string; icon: React.ElementType }> = {
  text: { label: "Text", color: "#a4c9ff", icon: AlignLeft },
  number: { label: "Number", color: "#40e56c", icon: Hash },
  select: { label: "Select", color: "#c8c6c5", icon: ChevronDown },
  boolean: { label: "Yes/No", color: "#4d93e5", icon: ToggleLeft },
};

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [modal, setModal] = useState(false);
  const [newQ, setNewQ] = useState<Partial<Question>>({ type: "text", required: false });
  const [optionInput, setOptionInput] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const addQuestion = () => {
    if (!newQ.question?.trim()) return;
    const q: Question = {
      id: `q${Date.now()}`,
      question: newQ.question!,
      type: newQ.type as QuestionType || "text",
      required: !!newQ.required,
      options: options.length > 0 ? options : undefined,
      order: questions.length + 1,
    };
    setQuestions(prev => [...prev, q]);
    setModal(false);
    setNewQ({ type: "text", required: false });
    setOptions([]);
    setOptionInput("");
  };

  const toggleRequired = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, required: !q.required } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id).map((q, i) => ({ ...q, order: i + 1 })));
  };

  const addOption = () => {
    if (optionInput.trim()) {
      setOptions(prev => [...prev, optionInput.trim()]);
      setOptionInput("");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <section className="mb-8">
        <nav className="flex items-center gap-2 text-[10px] font-bold text-[#a4c9ff] uppercase tracking-widest mb-2">
          <span>Console</span>
          <ChevronRight size={10} />
          <span className="text-[#8b919d]">Custom Questions</span>
        </nav>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tighter text-[#e5e2e1] font-headline">
              Resident Intake Questions
            </h2>
            <p className="text-[#8b919d] mt-1 text-sm">Define custom data collection fields shown during resident onboarding.</p>
          </div>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm px-5 py-2.5 rounded-xl shadow-[0_8px_20px_-4px_rgba(164,201,255,0.3)] hover:shadow-[0_12px_28px_-4px_rgba(164,201,255,0.4)] active:scale-95 transition-all font-headline"
          >
            <Plus size={15} />
            Add Question
          </button>
        </div>
      </section>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {[
          { label: "Total Questions", value: questions.length, color: "#a4c9ff" },
          { label: "Required", value: questions.filter(q => q.required).length, color: "#ffb4ab" },
          { label: "Optional", value: questions.filter(q => !q.required).length, color: "#40e56c" },
          { label: "Types Used", value: new Set(questions.map(q => q.type)).size, color: "#c8c6c5" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="bg-[#1c1b1b] rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider">{s.label}</p>
            <p
              className="text-3xl font-black mt-1 font-headline"
              style={{ color: s.color }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 bg-[#40e56c]/5 rounded-2xl border border-[#40e56c]/10 mb-7">
        <HelpCircle size={15} className="text-[#40e56c] shrink-0 mt-0.5" />
        <p className="text-xs text-[#c1c7d3]">
          These questions are displayed during resident onboarding and approval. Drag to reorder. Required questions must be answered before submission.
        </p>
      </div>

      {/* Questions list */}
      <div className="space-y-2">
        {questions.map((q, i) => {
          const cfg = typeConfig[q.type];
          return (
            <div
              key={q.id}
              className={[
                "bg-[#1c1b1b] rounded-2xl p-4 hover:bg-[#201f1f] transition-all duration-200 group animate-in fade-in slide-in-from-bottom-4",
                dragOver === q.id ? "ring-1 ring-[#a4c9ff]/40" : "",
              ].join(" ")}
              style={{ animationDelay: `${i * 40}ms` }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(q.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={() => setDragOver(null)}
            >
              <div className="flex items-center gap-4">
                {/* Drag handle */}
                <div
                  className="text-[#414751] hover:text-[#8b919d] cursor-grab active:cursor-grabbing transition-colors shrink-0"
                  draggable
                >
                  <GripVertical size={16} />
                </div>

                {/* Order number */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
                  style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}
                >
                  {q.order}
                </div>

                {/* Type badge */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0"
                  style={{ backgroundColor: `${cfg.color}10` }}
                >
                  <cfg.icon size={12} style={{ color: cfg.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>

                {/* Question text */}
                <p className="flex-1 text-sm text-[#e5e2e1] font-medium">{q.question}</p>

                {/* Options preview */}
                {q.options && (
                  <div className="hidden md:flex items-center gap-1 flex-wrap max-w-[200px]">
                    {q.options.slice(0, 3).map((o) => (
                      <span key={o} className="text-[9px] bg-[#131313] text-[#8b919d] px-2 py-0.5 rounded">{o}</span>
                    ))}
                    {q.options.length > 3 && (
                      <span className="text-[9px] text-[#8b919d]">+{q.options.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Required toggle */}
                <button
                  onClick={() => toggleRequired(q.id)}
                  className={[
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shrink-0",
                    q.required
                      ? "bg-[#ffb4ab]/10 text-[#ffb4ab]"
                      : "bg-[#131313] text-[#8b919d] hover:text-[#c1c7d3]",
                  ].join(" ")}
                >
                  {q.required ? "Required" : "Optional"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="w-7 h-7 rounded-lg bg-[#131313] flex items-center justify-center text-[#8b919d] hover:text-[#ffb4ab] hover:bg-[#93000a]/30 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {questions.length === 0 && (
          <div className="bg-[#1c1b1b] rounded-3xl p-16 text-center">
            <HelpCircle size={40} className="text-[#414751] mx-auto mb-4" />
            <p className="text-[#8b919d] font-bold">No questions configured yet</p>
            <button onClick={() => setModal(true)} className="mt-4 text-[#a4c9ff] text-sm font-bold hover:underline">
              Add your first question →
            </button>
          </div>
        )}
      </div>

      {/* Add Question Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="glass-modal rounded-3xl p-8 w-full max-w-lg shadow-[0_20px_60px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#e5e2e1] font-headline">
                Add New Question
              </h3>
              <button
                onClick={() => { setModal(false); setOptions([]); setOptionInput(""); }}
                className="w-8 h-8 rounded-lg bg-[#0e0e0e] flex items-center justify-center text-[#8b919d] hover:text-[#e5e2e1]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Question text */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Question *</label>
                <input
                  value={newQ.question || ""}
                  onChange={(e) => setNewQ(p => ({ ...p, question: e.target.value }))}
                  className="w-full bg-[#353534] border-0 rounded-xl py-3.5 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm"
                  placeholder="e.g. How many people live in your unit?"
                />
              </div>

              {/* Type selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Answer Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(typeConfig) as [QuestionType, typeof typeConfig[QuestionType]][]).map(([type, cfg]) => (
                    <button
                      key={type}
                      onClick={() => setNewQ(p => ({ ...p, type }))}
                      className={[
                        "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                        newQ.type === type
                          ? "border-[#a4c9ff]/40 bg-[#a4c9ff]/5"
                          : "border-transparent bg-[#131313] hover:border-white/10",
                      ].join(" ")}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${cfg.color}15` }}
                      >
                        <cfg.icon size={15} style={{ color: cfg.color }} />
                      </div>
                      <span
                        className="text-sm font-bold"
                        style={{ color: newQ.type === type ? cfg.color : "#c1c7d3" }}
                      >
                        {cfg.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options for select type */}
              {newQ.type === "select" && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#8b919d] uppercase tracking-wider block">Options</label>
                  <div className="flex gap-2">
                    <input
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addOption()}
                      className="flex-1 bg-[#353534] border-0 rounded-xl py-3 px-5 text-[#e5e2e1] placeholder:text-[#8b919d]/50 focus:ring-2 focus:ring-[#a4c9ff]/40 outline-none text-sm"
                      placeholder="Add an option..."
                    />
                    <button
                      onClick={addOption}
                      className="px-4 bg-[#353534] hover:bg-[#2a2a2a] text-[#a4c9ff] font-bold rounded-xl transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {options.map((opt) => (
                      <span
                        key={opt}
                        className="flex items-center gap-1.5 px-3 py-1 bg-[#353534] text-[#c1c7d3] text-xs rounded-lg"
                      >
                        {opt}
                        <button
                          onClick={() => setOptions(prev => prev.filter(o => o !== opt))}
                          className="text-[#8b919d] hover:text-[#ffb4ab] transition-colors"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Required toggle */}
              <div className="flex items-center justify-between p-4 bg-[#0e0e0e] rounded-2xl">
                <div>
                  <p className="text-sm font-bold text-[#e5e2e1]">Required Question</p>
                  <p className="text-xs text-[#8b919d] mt-0.5">Residents must answer this before submitting</p>
                </div>
                <button
                  onClick={() => setNewQ(p => ({ ...p, required: !p.required }))}
                  className={[
                    "w-12 h-6 rounded-full transition-all duration-300 relative",
                    newQ.required ? "bg-[#a4c9ff]" : "bg-[#353534]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300",
                      newQ.required ? "left-6.5" : "left-0.5",
                    ].join(" ")}
                    style={{ left: newQ.required ? "calc(100% - 22px)" : "2px" }}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => { setModal(false); setOptions([]); setOptionInput(""); }}
                className="flex-1 py-3 bg-[#0e0e0e] text-[#e5e2e1] font-bold text-sm rounded-xl hover:bg-[#1c1b1b] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addQuestion}
                className="flex-1 py-3 bg-gradient-to-br from-[#a4c9ff] to-[#4d93e5] text-[#00315d] font-black text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 font-headline"
              >
                <Check size={15} />
                Add Question
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
