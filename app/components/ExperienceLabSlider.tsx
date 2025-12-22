"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type LabKind = "freelance" | "proposal" | "report";

export type LabItem = {
    id: string;
    kind: LabKind;
    badge: string;
    title: string;
    period?: string;
    role: string;

    /** ✅ 결론(요약) — 우측으로 이동해서 보여줄 값 */
    summary?: string;

    href?: string;
    cta?: string;

    // /public 기준 경로: "lab/xxx.png"
    beforeImg?: string;
    afterImg?: string;

    // 좌측 블록
    problem?: string[];
    solution?: string[];
    result?: string[];

    // 우측 Key Notes
    detail?: string[];

    accent?: string;
};

type Props = {
    items: LabItem[];
    autoMs?: number;
    className?: string;
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

function sanitizePublicPath(p?: string) {
    if (!p) return "";
    return p.replace(/^\/+/, "");
}

function kindLabel(kind: LabKind) {
    return kind === "freelance"
        ? "Client work"
        : kind === "proposal"
            ? "Deck / Proposal"
            : "Report";
}

function MiniBlock({
    title,
    items,
    accent,
}: {
    title: string;
    items?: string[];
    accent: string;
}) {
    const list = (items ?? []).filter(Boolean).slice(0, 2);
    if (!list.length) return null;

    return (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                    {title}
                </p>
                <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: accent, opacity: 0.65 }}
                />
            </div>

            <div className="space-y-2">
                {list.map((t, i) => (
                    <div key={i} className="flex gap-3">
                        <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/20" />
                        <p className="text-[13px] leading-relaxed text-zinc-300">{t}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** 50%/50% 이미지 카드 + hover(확대/scan) + click(라이트박스 오픈) */
function FigureCard({
    label,
    src,
    onOpen,
    accent,
    className = "",
}: {
    label: string;
    src?: string;
    onOpen: (src: string, label: string) => void;
    accent: string;
    className?: string;
}) {
    const safe = sanitizePublicPath(src);
    const hasImage = Boolean(safe);

    return (
        <button
            type="button"
            onClick={() => hasImage && onOpen(safe, label)}
            disabled={!hasImage}
            className={[
                "group relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-black/35 text-left",
                hasImage ? "cursor-zoom-in" : "cursor-default",
                className,
            ].join(" ")}
            aria-label={hasImage ? `${label} image open` : `${label} no image`}
        >
            <div className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full border border-white/12 bg-black/55 px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-200">
                {label}
            </div>

            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="scanlines" />
                <div className="scan-sweep" />
            </div>

            <div className="relative h-full w-full">
                {hasImage ? (
                    <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                        <Image
                            src={`/${safe}`}
                            alt={`${label} preview`}
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover"
                            priority={false}
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 grid place-items-center text-zinc-500 text-[12px]">
                        No image
                    </div>
                )}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-4 pb-3 pt-10">
                <span className="text-[11px] tracking-[0.14em] uppercase text-zinc-500">
                    {label} preview
                </span>
                {hasImage ? (
                    <span
                        className="text-[11px] tracking-[0.14em] uppercase"
                        style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                        Click to zoom
                    </span>
                ) : null}
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/10 to-transparent opacity-25" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/85 to-transparent" />
            <div
                className="pointer-events-none absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `0 0 80px ${accent}33` }}
            />
        </button>
    );
}

function Lightbox({
    src,
    label,
    onClose,
}: {
    src: string;
    label: string;
    onClose: () => void;
}) {
    const safe = sanitizePublicPath(src);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[999]">
            <button
                type="button"
                onClick={onClose}
                className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
                aria-label="Close lightbox"
            />
            <div className="absolute inset-0 grid place-items-center p-4">
                <div
                    className="relative h-[86vh] w-[92vw] max-w-[1200px] overflow-hidden rounded-2xl border border-white/12"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(15,15,15,0.94) 0%, rgba(7,7,7,0.94) 100%)",
                        boxShadow:
                            "0 40px 120px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 1px rgba(255,255,255,0.12)",
                    }}
                >
                    <div className="absolute left-4 top-4 z-10 inline-flex items-center rounded-full border border-white/12 bg-black/55 px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-200">
                        {label}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/12 text-zinc-100"
                        style={{
                            background:
                                "radial-gradient(circle at 30% 15%, rgba(255,255,255,0.12), transparent 55%), linear-gradient(180deg, rgba(16,16,16,0.95), rgba(6,6,6,0.95))",
                            boxShadow:
                                "0 18px 40px rgba(0,0,0,0.65), inset 0 1px 1px rgba(255,255,255,0.14)",
                        }}
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    <div className="relative h-full w-full">
                        <Image
                            src={`/${safe}`}
                            alt={`${label} enlarged`}
                            fill
                            sizes="92vw"
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="pointer-events-none absolute inset-0 ring-1 ring-white/5" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white/10 to-transparent opacity-35" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
            </div>
        </div>
    );
}

function ConclusionBox({
    accent,
    text,
}: {
    accent: string;
    text?: string;
}) {
    if (!text) return null;

    return (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                    Conclusion
                </p>
                <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: accent, opacity: 0.65 }}
                />
            </div>

            <p className="text-[13px] leading-relaxed text-zinc-300">
                {text}
            </p>
        </div>
    );
}

function KeyNotesBox({
    accent,
    notes,
}: {
    accent: string;
    notes?: string[];
}) {
    const list = (notes ?? []).filter(Boolean).slice(0, 3);

    return (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                    Key Notes
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            </div>

            {list.length ? (
                <div className="space-y-2">
                    {list.map((t, i) => (
                        <div key={i} className="flex gap-3">
                            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/25" />
                            <p className="text-[13px] leading-relaxed text-zinc-300">{t}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-[13px] text-zinc-500">—</p>
            )}
        </div>
    );
}

export default function ExperienceLabSlider({
    items,
    autoMs = 11000,
    className = "",
}: Props) {
    const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);
    const count = safeItems.length;

    const [idx, setIdx] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [lb, setLb] = useState<{ src: string; label: string } | null>(null);

    const dirRef = useRef<1 | -1>(1);

    const current = safeItems[clampIdx(idx, count)];
    const accent = current?.accent ?? defaultAccent(current?.kind ?? "freelance");

    const go = (nextIdx: number, dir: 1 | -1) => {
        dirRef.current = dir;
        setIdx(clampIdx(nextIdx, count));
    };

    const prev = () => go(idx - 1, -1);
    const next = () => go(idx + 1, 1);

    useEffect(() => {
        if (!count || hovered || lb) return;
        const t = window.setInterval(() => {
            setIdx((v) => clampIdx(v + 1, count));
            dirRef.current = 1;
        }, Math.max(2500, autoMs));
        return () => window.clearInterval(t);
    }, [count, hovered, autoMs, lb]);

    if (!count) return null;

    return (
        <div
            className={`relative mx-auto max-w-6xl overflow-visible ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {lb ? <Lightbox src={lb.src} label={lb.label} onClose={() => setLb(null)} /> : null}

            {/* NAV */}
            <div className="absolute right-3 top-[-16px] md:right-5 md:top-[-18px] z-50">
                <div
                    className="flex items-center gap-2 rounded-full border border-white/12 px-2 py-2"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(20,20,20,0.92) 0%, rgba(7,7,7,0.92) 100%)",
                        boxShadow:
                            "0 24px 52px rgba(0,0,0,0.78), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 1px rgba(255,255,255,0.14)",
                        backdropFilter: "blur(6px)",
                    }}
                >
                    <button
                        type="button"
                        onClick={prev}
                        aria-label="Previous"
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/14 text-zinc-100 transition"
                        style={{
                            background:
                                "radial-gradient(circle at 30% 15%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(180deg, rgba(16,16,16,0.95), rgba(6,6,6,0.95))",
                            boxShadow:
                                "0 0 24px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 1px rgba(255,255,255,0.14)",
                        }}
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={next}
                        aria-label="Next"
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/14 text-zinc-100 transition"
                        style={{
                            background:
                                "radial-gradient(circle at 30% 15%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(180deg, rgba(16,16,16,0.95), rgba(6,6,6,0.95))",
                            boxShadow:
                                "0 0 24px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 1px rgba(255,255,255,0.14)",
                        }}
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* MACHINE PLATE */}
            <div
                className="relative mx-auto rounded-[28px] border border-white/10 p-4 sm:p-5 md:p-6 overflow-hidden"
                style={{
                    background: [
                        "radial-gradient(circle at 50% -10%, rgba(255,255,255,0.07), transparent 55%)",
                        "radial-gradient(circle at 10% 0%, rgba(76,153,144,0.12), transparent 55%)",
                        "radial-gradient(circle at 90% 0%, rgba(76,153,144,0.10), transparent 60%)",
                        "radial-gradient(circle at 50% 120%, rgba(24,24,27,0.92) 0%, rgba(9,9,11,0.92) 58%, rgba(0,0,0,0.98) 100%)",
                    ].join(", "),
                    boxShadow:
                        "inset 1px 1px 2px rgba(255,255,255,0.16), 0 28px 90px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
            >
                <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/5" />
                <div className="pointer-events-none absolute inset-[10px] rounded-[22px] ring-1 ring-white/5" />
                <div className="pointer-events-none absolute inset-[18px] rounded-[18px] ring-1 ring-white/5" />
                <div className="noise pointer-events-none absolute inset-0 opacity-[0.08]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/10 to-transparent opacity-35" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent" />

                <div className="relative z-10">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-[11px] tracking-[0.28em] uppercase text-zinc-500">
                            Experience Lab <span className="text-zinc-600">•</span>
                            <span className="ml-2" style={{ color: accent }}>
                                ●
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3 items-stretch">
                        {/* LEFT: 타이틀 + Problem/Solution/Impact */}
                        <div
                            className="relative rounded-2xl border border-white/12 bg-black/35 p-5 overflow-hidden"
                            style={{
                                boxShadow:
                                    "inset 1px 1px 2px rgba(255,255,255,0.12), inset -2px -2px 10px rgba(0,0,0,0.65), 0 18px 44px rgba(0,0,0,0.70)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/5" />
                            <div className="pointer-events-none absolute inset-[10px] rounded-[14px] ring-1 ring-white/5" />

                            <div className="mb-4 flex items-center justify-between gap-2">
                                <span className="inline-flex items-center rounded-full border border-zinc-700/70 bg-black/50 px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-300">
                                    {current.badge}
                                </span>
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                            </div>

                            <h3 className="text-[17px] md:text-[18px] font-semibold text-zinc-50 leading-snug">
                                {current.title}
                            </h3>

                            {/* ✅ summary(결론)은 우측으로 이동했으니 여기서는 표시 안 함 */}

                            <div className="mt-4 space-y-3">
                                <MiniBlock title="Problem" items={current.problem} accent={accent} />
                                <MiniBlock title="Solution" items={current.solution} accent={accent} />
                                <MiniBlock title="Impact" items={current.result} accent={accent} />
                            </div>
                        </div>

                        {/* CENTER: 50/50 */}
                        <div
                            className="relative rounded-2xl border border-white/12 bg-black/30 p-4 overflow-hidden h-full"
                            style={{
                                boxShadow:
                                    "inset 1px 1px 2px rgba(255,255,255,0.10), inset -2px -2px 10px rgba(0,0,0,0.65), 0 18px 44px rgba(0,0,0,0.70)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/5" />
                            <div className="pointer-events-none absolute inset-[10px] rounded-[14px] ring-1 ring-white/5" />

                            <div className="relative z-10 h-full flex flex-col gap-3 min-h-[520px] md:min-h-[560px]">
                                <div className="flex-1 min-h-0">
                                    <FigureCard
                                        label="BEFORE"
                                        src={current.beforeImg}
                                        accent={accent}
                                        onOpen={(src, label) => setLb({ src, label })}
                                        className="h-full"
                                    />
                                </div>
                                <div className="flex-1 min-h-0">
                                    <FigureCard
                                        label="AFTER"
                                        src={current.afterImg}
                                        accent={accent}
                                        onOpen={(src, label) => setLb({ src, label })}
                                        className="h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: 상단 스펙 → 결론 → 키노트 */}
                        <div
                            className="relative rounded-2xl border border-white/12 bg-black/35 p-5 overflow-hidden flex flex-col"
                            style={{
                                boxShadow:
                                    "inset 1px 1px 2px rgba(255,255,255,0.12), inset -2px -2px 10px rgba(0,0,0,0.65), 0 18px 44px rgba(0,0,0,0.70)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/5" />
                            <div className="pointer-events-none absolute inset-[10px] rounded-[14px] ring-1 ring-white/5" />

                            {/* 상단: Client work + 스펙 (박스 없이) */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                                        {kindLabel(current.kind)}
                                    </p>
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ backgroundColor: accent, boxShadow: `0 0 12px ${accent}` }}
                                    />
                                </div>

                                <div className="mt-3 border-t border-white/12" />

                                <div className="mt-3 space-y-2 text-[12px]">
                                    {current.period ? (
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-zinc-500">Period</span>
                                            <span className="text-zinc-200">{current.period}</span>
                                        </div>
                                    ) : null}
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-zinc-500">Role</span>
                                        <span className="text-zinc-200">{current.role}</span>
                                    </div>
                                </div>
                            </div>

                            {/* ✅ 결론(요약) */}
                            <div className="mt-5">
                                <ConclusionBox accent={accent} text={current.summary} />
                            </div>

                            {/* ✅ Key Notes */}
                            <div className="mt-4">
                                <KeyNotesBox accent={accent} notes={current.detail} />
                            </div>

                            {/* bottom fixed: pager/dots + CTA */}
                            <div className="mt-auto pt-5">
                                <div className="border-t border-white/12 pt-4 flex items-center justify-between">
                                    <span className="text-[12px] text-zinc-500">
                                        {idx + 1} / {count}
                                    </span>

                                    <div className="flex items-center gap-1.5">
                                        {safeItems.map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => go(i, i > idx ? 1 : -1)}
                                                aria-label={`Go to slide ${i + 1}`}
                                                className="h-2 w-2 rounded-full transition"
                                                style={{
                                                    backgroundColor:
                                                        i === idx ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.18)",
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-3 flex justify-end">
                                    {current.href ? (
                                        <a
                                            href={current.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold tracking-[0.14em] uppercase"
                                            style={{
                                                borderColor: "rgba(255,255,255,0.18)",
                                                color: "rgba(255,255,255,0.92)",
                                                background:
                                                    "radial-gradient(circle at 30% 15%, rgba(255,255,255,0.14), transparent 55%), linear-gradient(180deg, rgba(18,18,18,0.95), rgba(7,7,7,0.95))",
                                                boxShadow: [
                                                    "0 0 0 1px rgba(255,255,255,0.08)",
                                                    "inset 0 1px 1px rgba(255,255,255,0.16)",
                                                    `0 0 22px ${accent}`,
                                                    "0 0 52px rgba(0,0,0,0.75)",
                                                ].join(", "),
                                            }}
                                        >
                                            <span
                                                className="h-2 w-2 rounded-full"
                                                style={{ background: accent, boxShadow: `0 0 18px ${accent}` }}
                                            />
                                            <span className="transition-all duration-200 group-hover:font-extrabold">
                                                {current.cta ?? "열어보기"}
                                            </span>
                                            <span className="translate-y-[1px]">↗</span>
                                        </a>
                                    ) : (
                                        <span className="text-[12px] text-zinc-500">준비중</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-white/10" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-white/10" />
            </div>

            <style jsx global>{`
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E");
          background-size: 220px 220px;
          mix-blend-mode: overlay;
        }
        .scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.06),
            rgba(255, 255, 255, 0.06) 1px,
            rgba(0, 0, 0, 0) 5px,
            rgba(0, 0, 0, 0) 8px
          );
          opacity: 0.28;
        }
        .scan-sweep {
          position: absolute;
          inset: -30% 0 auto 0;
          height: 60%;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0)
          );
          animation: scanSweep 1.6s linear infinite;
          opacity: 0.7;
          filter: blur(0.6px);
        }
        @keyframes scanSweep {
          0% {
            transform: translateY(-35%);
          }
          100% {
            transform: translateY(115%);
          }
        }
      `}</style>
        </div>
    );
}
