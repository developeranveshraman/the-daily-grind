/**
 * COUNTER JOURNAL DESIGN NOTE: The chat is a compact, friendly counter-side
 * assistant—useful when summoned, quiet when not needed, never ornamental.
 */
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { answerQuestion, quickReplies } from "@/utils/chatbot";

type Message = { from: "bot" | "visitor"; text: string };
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ from: "bot", text: "Hi — ask me about the menu, allergens, hours, or finding the café." }]);
  const liveRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (open) liveRef.current?.scrollTo({ top: liveRef.current.scrollHeight, behavior: "smooth" }); }, [messages, open, typing]);
  const send = (prompt = input) => {
    const question = prompt.trim(); if (!question || typing) return;
    setMessages((current) => [...current, { from: "visitor", text: question }]); setInput(""); setTyping(true);
    window.setTimeout(() => { const reply = answerQuestion(question); setMessages((current) => [...current, { from: "bot", text: reply.text }]); setTyping(false); }, 520);
  };
  return <div className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">{open && <section className="mb-3 flex h-[470px] w-[min(92vw,370px)] flex-col overflow-hidden border border-[#3a2a1e]/20 bg-[#faf6f1] shadow-2xl animate-in slide-in-from-bottom-5 duration-300" aria-label="Daily Grind FAQ assistant"><header className="flex items-center justify-between bg-[#3a2a1e] px-4 py-3 text-[#faf6f1]"><div><p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#eacba2]">Counter assistant</p><h2 className="font-display text-xl">Ask the Daily Grind</h2></div><button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center" aria-label="Close chat"><X size={18} /></button></header><div ref={liveRef} className="flex-1 space-y-3 overflow-auto p-4" aria-live="polite" aria-label="Chat messages">{messages.map((message, index) => <div key={`${message.from}-${index}`} className={`max-w-[88%] px-3 py-2.5 text-sm leading-5 ${message.from === "visitor" ? "ml-auto bg-[#c97b3d] text-white" : "border border-[#3a2a1e]/12 bg-white text-[#3a2a1e]"}`}>{message.text}</div>)}{typing && <div className="w-fit border border-[#3a2a1e]/12 bg-white px-3 py-2 text-xs text-[#645447]">Typing…</div>}</div><div className="border-t border-[#3a2a1e]/10 p-3"><div className="mb-2 flex gap-1.5 overflow-x-auto">{quickReplies.map((reply) => <button key={reply} onClick={() => send(reply)} className="shrink-0 border border-[#3a2a1e]/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.09em] text-[#645447] hover:border-[#c97b3d] hover:text-[#c97b3d]">{reply}</button>)}</div><form onSubmit={(event) => { event.preventDefault(); send(); }} className="flex gap-2"><label className="sr-only" htmlFor="chat-input">Ask a question</label><input id="chat-input" value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 border border-[#3a2a1e]/20 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-[#c97b3d]" placeholder="Ask a question…" /><button className="grid h-10 w-10 place-items-center bg-[#c97b3d] text-white hover:bg-[#3a2a1e]" aria-label="Send question"><Send size={16} /></button></form></div></section>}<button onClick={() => setOpen((value) => !value)} className="flex h-14 items-center gap-2 bg-[#3a2a1e] px-4 text-xs font-bold uppercase tracking-[0.13em] text-[#faf6f1] shadow-xl transition hover:-translate-y-1 hover:bg-[#c97b3d]" aria-label={open ? "Close chat" : "Open FAQ chat"}><MessageCircle size={19} aria-hidden="true" /><span className="hidden sm:inline">Ask a question</span></button></div>;
}
