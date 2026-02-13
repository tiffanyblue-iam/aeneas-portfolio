"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export type LabKind = "freelance" | "proposal" | "report";

export type LabItem = {
    id: string;
    kind: LabKind;
    badge: string;
    title: string;
    lead?: string;
    problem?: string[];
    solution?: string[];
    impact?: string[];
    keyNotes?: string[];
    conclusion?: string[];
    period?: string;
    role?: string;
    href?: string;
    cta?: string;
    beforeImg?: string;
    afterImg?: string;
    accent?: string;
};

type Props = {
    items: LabItem[];
    autoMs?: number;
    className?: string;
    mainColor?: string;
    theme?: "dark" | "light";
};

function clampIdx(n: number, len: number) {
    if (len <= 0) return 0;
    return ((n % len) + len) % len;
}

function defaultAccent(kind: LabKind) {
    if (kind === "freelance") return "#4C9990";
    if (kind === "proposal") return "#60A5FA";
    return "#FBBF24";
}

function normalizePublicSrc(src?: string) {
    if (!src) return "";
    const s = src.replace(/^\/+/, "");
    return `/${s}`;
}

function ZoomModal({ open, onClose, src, label }: { open: boolean; onClose: () => void; src: string; label: string }) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-black/80 p-4 backdrop-blur-sm" onMouseDown={onClose}>
            <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/12 bg-zinc-900 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/50">
                    <div className="text-[12px] tracking-[0.18em] uppercase text-zinc-400">{label}</div>
                    <button type="button" onClick={onClose} className="h-8 w-8 grid place-items-center rounded-full bg-white/10 text-zinc-200 hover:bg-white/20 transition">✕</button>
                </div>
                <div className="relative w-full aspect-[16/9] bg-black">
                    <Image src={src} alt={`${label} zoom`} fill className="object-contain" />
                </div>
            </div>
        </div>
    );
}

function FigureCard({ label, rawSrc, onClick, isLight }: { label: string; rawSrc?: string; onClick?: () => void; isLight: boolean }) {
    const hasImage = Boolean(rawSrc);
    const src = normalizePublicSrc(rawSrc);

    return (
        <button
            type="button"
            className={`group relative w-full h-full overflow-hidden rounded-xl border text-left transition-all duration-500
        ${isLight
                    ? "bg-white border-zinc-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    : "bg-black/45 border-white/12 hover:border-white/20 hover:shadow-lg"
                }`}
            onClick={hasImage ? onClick : undefined}
            disabled={!hasImage}
        >
            <div className={`absolute left-3 top-3 z-10 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[8px] font-bold tracking-[0.1em] uppercase shadow-sm backdrop-blur-md
        ${isLight
                    ? "bg-white/90 border-zinc-200 text-zinc-500"
                    : "bg-black/60 border-white/12 text-zinc-200"
                }`}>
                {label}
            </div>

            <div className="relative h-full w-full min-h-[180px]">
                {hasImage ? (
                    <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                        <Image src={src} alt={`${label} preview`} fill className="object-cover" />
                    </div>
                ) : (
                    <div className={`absolute inset-0 grid place-items-center text-[10px] ${isLight ? "text-zinc-400 bg-zinc-50" : "text-zinc-600 bg-zinc-900/50"}`}>
                        No image
                    </div>
                )}
            </div>

            {hasImage && (
                <div className={`absolute right-3 bottom-3 z-10 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300
          ${isLight
                        ? "bg-white/90 border-zinc-200 text-zinc-800 shadow-sm"
                        : "bg-black/60 border-white/12 text-zinc-200"
                    }`}>
                    <span className="text-[8px] font-bold tracking-widest uppercase">Zoom</span>
                </div>
            )}
        </button>
    );
}

export default function ExperienceLabSlider({
    items,
    autoMs = 12000,
    className = "",
    theme = "dark",
}: Props) {
    const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);
    const count = safeItems.length;
    const [idx, setIdx] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [zoom, setZoom] = useState<{ open: boolean; src: string; label: string }>({ open: false, src: "", label: "" });

    const dirRef = useRef<1 | -1>(1);
    const current = safeItems[clampIdx(idx, count)];
    const accent = current?.accent ?? defaultAccent(current?.kind ?? "freelance");
    const isLight = theme === "light";

    const go = (nextIdx: number, dir: 1 | -1) => {
        dirRef.current = dir;
        setIdx(clampIdx(nextIdx, count));
    };
    const prev = () => go(idx - 1, -1);
    const next = () => go(idx + 1, 1);

    // 이미지 확대 핸들러 (ZoomModal 연동)
    const openZoom = (rawSrc: string, label: string) => {
        const src = normalizePublicSrc(rawSrc);
        setZoom({ open: true, src, label });
    };

    useEffect(() => {
        if (!count || hovered) return;
        const t = window.setInterval(() => {
            setIdx((v) => clampIdx(v + 1, count));
            dirRef.current = 1;
        }, Math.max(3000, autoMs));
        return () => window.clearInterval(t);
    }, [count, hovered, autoMs]);

    if (!count) return null;

    const styles = {
        containerBg: isLight
            ? "bg-white border-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            : "bg-gradient-to-b from-white/5 to-transparent border-white/10 shadow-2xl",
        footerBg: isLight
            ? "bg-[#F4F5F7] border-zinc-100"
            : "bg-white/5 border-white/10",
        navBtn: isLight
            ? "bg-white border-zinc-200 text-zinc-400 hover:text-emerald-600 hover:border-emerald-200 hover:shadow-sm shadow-sm"
            : "bg-black/40 border-white/14 text-zinc-100 hover:bg-white/10",
        title: isLight ? "text-zinc-900" : "text-zinc-50",
        textMain: isLight ? "text-zinc-800" : "text-zinc-200",
        textSub: isLight ? "text-zinc-500" : "text-zinc-400",
        badge: isLight
            ? "bg-zinc-100 border-zinc-200 text-zinc-600"
            : "bg-black/50 border-zinc-700 text-zinc-300",
        ctaBtn: isLight
            ? "bg-white border-zinc-200 text-zinc-700 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md shadow-sm font-extrabold"
            : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/30 font-bold",
    };

    const colorfulNavBtnBase = "grid h-8 w-8 place-items-center rounded-full border transition-all duration-300 text-sm shadow-sm hover:shadow hover:-translate-y-0.5";
    const prevBtnStyle = isLight ? `${colorfulNavBtnBase} bg-white border-rose-200 text-rose-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50` : styles.navBtn;
    const nextBtnStyle = isLight ? `${colorfulNavBtnBase} bg-white border-emerald-200 text-emerald-400 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 ml-2` : styles.navBtn;

    return (
        <div
            className={`relative mx-auto max-w-7xl overflow-visible px-4 ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* 1. 상단 헤더 영역 */}
            <div className="relative mb-5 px-1 flex items-end justify-between">

                {/* ✅ [수정] 타이틀 들여쓰기: pl-4 추가하여 왼쪽에서 안으로 밀어넣음 */}
                <div className="pl-4">
                    <div className={`text-[9px] tracking-[0.2em] uppercase font-bold mb-1.5 ${styles.textSub}`}>
                        Current Experiment <span className="mx-2 opacity-50">|</span> <span style={{ color: accent }}>{current.id}</span>
                    </div>
                    <h2 className={`text-xl md:text-2xl font-black tracking-tight leading-none ${styles.title}`}>{current.title}</h2>
                </div>

                <div className="flex items-center">
                    <button type="button" onClick={prev} className={prevBtnStyle}>‹</button>
                    <button type="button" onClick={next} className={nextBtnStyle}>›</button>
                </div>
            </div>

            {/* 2. 메인 컨텐츠 박스 */}
            <div className={`relative rounded-[20px] border overflow-hidden transition-all duration-500 ${styles.containerBg}`}>

                {/* ✅ [수정] 그리드 비율 0.8fr(텍스트 박스 축소) : 1.1fr : 1.1fr (이미지 확대) */}
                {/* 패딩은 p-8 md:p-10 유지 */}
                <div className="p-8 md:p-10 grid lg:grid-cols-[0.8fr_1.1fr_1.1fr] gap-8 min-h-[380px]">

                    {/* COL 1: 텍스트 정보 */}
                    {/* ✅ [수정] 내부 패딩 제거 (pl-0): 텍스트 박스 자체는 왼쪽 정렬 깔끔하게 */}
                    <div className="flex flex-col justify-between space-y-4 pl-0">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold tracking-[0.05em] uppercase ${styles.badge}`}>
                                    {current.badge}
                                </span>
                                <span className="h-1.5 w-1.5 rounded-full shadow-sm" style={{ backgroundColor: accent }} />
                            </div>

                            {/* Lead 텍스트 (16px 유지) */}
                            {current.lead && <p className={`text-[16px] leading-relaxed font-bold mb-6 ${styles.textMain}`}>{current.lead}</p>}

                            <div className="space-y-4">
                                <Section isLight={isLight} title="Problem" items={current.problem} color="rose" />
                                <Section isLight={isLight} title="Solution" items={current.solution} color="sky" />
                                <Section isLight={isLight} title="Impact" items={current.impact} color="emerald" />
                            </div>
                        </div>
                    </div>

                    {/* COL 2: BEFORE 이미지 */}
                    <div className="h-full">
                        <FigureCard label="BEFORE" rawSrc={current.beforeImg} onClick={() => current.beforeImg && openZoom(current.beforeImg, "BEFORE")} isLight={isLight} />
                    </div>

                    {/* COL 3: AFTER 이미지 */}
                    <div className="h-full">
                        <FigureCard label="AFTER" rawSrc={current.afterImg} onClick={() => current.afterImg && openZoom(current.afterImg, "AFTER")} isLight={isLight} />
                    </div>
                </div>

                {/* 하단 영역 */}
                <div className={`px-8 py-6 border-t ${styles.footerBg}`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
                            <div>
                                <span className={`block text-[9px] font-bold uppercase tracking-widest mb-1.5 ${styles.textSub}`}>Period</span>
                                <span className={`text-[13px] font-bold ${styles.textMain}`}>{current.period ?? "-"}</span>
                            </div>
                            <div>
                                <span className={`block text-[9px] font-bold uppercase tracking-widest mb-1.5 ${styles.textSub}`}>Role</span>
                                <span className={`text-[13px] font-bold ${styles.textMain}`}>{current.role ?? "-"}</span>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <span className={`block text-[9px] font-bold uppercase tracking-widest mb-1.5 ${styles.textSub}`}>Conclusion</span>
                                <span className={`text-[13px] font-bold leading-tight ${styles.textMain}`}>"{current.conclusion?.[0] ?? "N/A"}"</span>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            {current.href ? (
                                <a href={current.href} target="_blank" rel="noreferrer" className={`group inline-flex items-center gap-2 rounded-full border px-6 py-3 text-[12px] tracking-[0.05em] uppercase transition-all ${styles.ctaBtn}`}>
                                    <span>{current.cta ?? "Open Site"}</span>
                                    <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                                </a>
                            ) : <span className={`text-[11px] ${styles.textSub}`}>준비중</span>}
                        </div>
                    </div>
                </div>

            </div>

            {/* Zoom Modal */}
            <ZoomModal open={zoom.open} src={zoom.src} label={zoom.label} onClose={() => setZoom({ open: false, src: "", label: "" })} />
        </div>
    );
}

function Section({ isLight, title, items, color }: { isLight: boolean; title: string; items?: string[]; color: "rose" | "sky" | "emerald" }) {
    if (!items?.length) return null;
    const colors = {
        rose: isLight ? { dot: "bg-rose-400", text: "text-zinc-600" } : { dot: "bg-rose-500", text: "text-zinc-300" },
        sky: isLight ? { dot: "bg-sky-400", text: "text-zinc-600" } : { dot: "bg-sky-500", text: "text-zinc-300" },
        emerald: isLight ? { dot: "bg-emerald-400", text: "text-zinc-600" } : { dot: "bg-emerald-500", text: "text-zinc-300" },
    };
    const theme = colors[color];
    return (
        <div>
            <div className="flex items-center gap-1.5 mb-1.5">
                <span className={`h-1 w-1 rounded-full ${theme.dot}`} />
                <p className={`text-[9px] font-bold uppercase tracking-[0.1em] ${isLight ? "text-zinc-400" : "text-zinc-500"}`}>{title}</p>
            </div>
            <div className="space-y-0.5 pl-3 border-l-[1px]" style={{ borderColor: isLight ? "#E4E4E7" : "rgba(255,255,255,0.1)" }}>
                {items.slice(0, 3).map((t, i) => <p key={i} className={`text-[12px] leading-snug font-medium ${theme.text}`}>{t}</p>)}
            </div>
        </div>
    );
}