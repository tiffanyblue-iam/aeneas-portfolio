"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type LabKind = "freelance" | "proposal" | "report";

export type LabItem = {
    id: string;
    kind: LabKind;

    // left top badge + title
    badge: string;
    title: string;

    // right specs
    period?: string;
    role?: string;

    // short lead sentence (좌측 상단 한 줄 소개)
    lead?: string;

    // left blocks
    problem?: string[];
    solution?: string[];
    impact?: string[];

    // right blocks
    keyNotes?: string[];
    conclusion?: string[]; // (= 결론/정리)

    // assets
    beforeImg?: string; // "lab/xxx.png" (public 기준)
    afterImg?: string;

    // CTA
    href?: string;
    cta?: string;

    // optional accent
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
    // main toned-down: #4C9990
    if (kind === "freelance") return "#4C9990";
    if (kind === "proposal") return "#60A5FA";
    return "#FBBF24";
}

function toImageSrc(src?: string) {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return src.startsWith("/") ? src : `/${src}`;
}

/** BEFORE/AFTER 카드: hover 확대 + scanline, 클릭 시 줌(모달) */
function FigureCard({
    label,
    src,
    onZoom,
}: {
    label: "BEFORE" | "AFTER";
    src?: string;
    onZoom: (src: string, label: string) => void;
}) {
    const s = toImageSrc(src);
    const hasImage = Boolean(s);

    return (
        <button
            type="button"
            onClick={() => hasImage && onZoom(s, label)}
            className="group relative w-full flex-1 overflow-hidden rounded-2xl border border-white/10 bg-black/40 text-left"
            style={{
                boxShadow:
                    "inset 1px 1px 2px rgba(255,255,255,0.10), inset -2px -2px 10px rgba(0,0,0,0.65), 0 14px 34px rgba(0,0,0,0.65)",
            }}
        >
            {/* label */}
            <div className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full border border-white/12 bg-black/55 px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-200">
                {label}
            </div>

            {/* hover scanline */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="scanlines" />
                <div className="scan-sweep" />
            </div>

            {/* image */}
            <div className="relative h-full w-full">
                {hasImage ? (
                    <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
                        <Image
                            src={s}
                            alt={`${label} preview`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            priority={false}
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 grid place-items-center text-zinc-500 text-[12px]">
                        No image
                    </div>
                )}

                {/* bottom fade */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* click hint */}
            <div className="pointer-events-none absolute bottom-3 right-4 text-[11px] tracking-[0.18em] uppercase text-zinc-400/80">
                Click to zoom
            </div>

            {/* inset ring */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
        </button>
    );
}

function Block({
    title,
    items,
}: {
    title: string;
    items?: string[];
}) {
    if (!items || items.length === 0) return null;

    return (
        <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
            <div className="flex items-center justify-between">
                <p className="text-[11px] tracking-[0.18em] uppercase text-zinc-400">
                    {title}
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-white/18" />
            </div>
            <div className="mt-3 space-y-2">
                {items.slice(0, 3).map((t, i) => (
                    <div key={i} className="flex gap-3">
                        <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/25" />
                        <p className="text-[13px] leading-relaxed text-zinc-200/90">
                            {t}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ExperienceLabSlider({
    items,
    autoMs = 14000, // ✅ 더 느리게
    className = "",
}: Props) {
    const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);
    const count = safeItems.length;

    const [idx, setIdx] = useState(0);
    const [hovered, setHovered] = useState(false);
    const [zoom, setZoom] = useState<{ src: string; label: string } | null>(null);

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
        if (!count || hovered || zoom) return;
        const t = window.setInterval(() => {
            setIdx((v) => clampIdx(v + 1, count));
            dirRef.current = 1;
        }, Math.max(4000, autoMs));
        return () => window.clearInterval(t);
    }, [count, hovered, autoMs, zoom]);

    if (!count) return null;

    const kindLabel =
        current.kind === "freelance"
            ? "Client work"
            : current.kind === "proposal"
                ? "Deck / Proposal"
                : "Report";

    return (
        <div
            className={`relative mx-auto max-w-6xl overflow-visible ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* ✅ NAV 버튼: 플레이트 밖(안 잘림) */}
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

            {/* ✅ 기계 플레이트 */}
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
                {/* inset rings */}
                <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/5" />
                <div className="pointer-events-none absolute inset-[10px] rounded-[22px] ring-1 ring-white/5" />
                <div className="pointer-events-none absolute inset-[18px] rounded-[18px] ring-1 ring-white/5" />

                {/* noise */}
                <div className="noise pointer-events-none absolute inset-0 opacity-[0.08]" />

                {/* top/bottom lighting */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/10 to-transparent opacity-35" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent" />

                <div className="relative z-10">
                    {/* top label */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-[11px] tracking-[0.28em] uppercase text-zinc-500">
                            Experience Lab <span className="text-zinc-600">•</span>
                            <span className="ml-2" style={{ color: accent }}>
                                ●
                            </span>
                        </div>
                    </div>

                    {/* 3 columns */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {/* LEFT: title + problem/solution/impact */}
                        <div
                            className="relative rounded-2xl border border-white/12 bg-black/35 p-5 overflow-hidden"
                            style={{
                                boxShadow:
                                    "inset 1px 1px 2px rgba(255,255,255,0.12), inset -2px -2px 10px rgba(0,0,0,0.65), 0 18px 44px rgba(0,0,0,0.70)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/5" />

                            <div className="mb-3 flex items-center justify-between gap-2">
                                <span className="inline-flex items-center rounded-full border border-zinc-700/70 bg-black/50 px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-300">
                                    {current.badge}
                                </span>
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                            </div>

                            <h3 className="text-[17px] md:text-[18px] font-semibold text-zinc-50 leading-snug">
                                {current.title}
                            </h3>

                            {current.lead && (
                                <p className="mt-3 text-[13px] leading-relaxed text-zinc-200/85">
                                    {current.lead}
                                </p>
                            )}

                            <div className="mt-4 space-y-3">
                                <Block title="Problem" items={current.problem} />
                                <Block title="Solution" items={current.solution} />
                                <Block title="Impact" items={current.impact} />
                            </div>
                        </div>

                        {/* CENTER: images (50/50 full) */}
                        <div
                            className="relative rounded-2xl border border-white/12 bg-black/30 p-4 overflow-hidden flex flex-col gap-3"
                            style={{
                                boxShadow:
                                    "inset 1px 1px 2px rgba(255,255,255,0.10), inset -2px -2px 10px rgba(0,0,0,0.65), 0 18px 44px rgba(0,0,0,0.70)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/5" />
                            <div className="flex-1 flex flex-col gap-3 min-h-[520px]">
                                <FigureCard
                                    label="BEFORE"
                                    src={current.beforeImg}
                                    onZoom={(src, label) => setZoom({ src, label })}
                                />
                                <FigureCard
                                    label="AFTER"
                                    src={current.afterImg}
                                    onZoom={(src, label) => setZoom({ src, label })}
                                />
                            </div>
                        </div>

                        {/* RIGHT: client work + specs(박스 없이) + key notes + conclusion + CTA */}
                        <div
                            className="relative rounded-2xl border border-white/12 bg-black/35 p-5 overflow-hidden flex flex-col"
                            style={{
                                boxShadow:
                                    "inset 1px 1px 2px rgba(255,255,255,0.12), inset -2px -2px 10px rgba(0,0,0,0.65), 0 18px 44px rgba(0,0,0,0.70)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/5" />

                            {/* top: client work + specs */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-[11px] tracking-[0.18em] uppercase text-zinc-400">
                                        {kindLabel}
                                    </p>
                                </div>

                                <div className="text-right">
                                    {current.period && (
                                        <div className="text-[12px] text-zinc-300">
                                            <span className="text-zinc-500 mr-2">Period</span>
                                            {current.period}
                                        </div>
                                    )}
                                    {current.role && (
                                        <div className="mt-1 text-[12px] text-zinc-300">
                                            <span className="text-zinc-500 mr-2">Role</span>
                                            {current.role}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* divider line under top */}
                            <div className="mt-4 h-px w-full bg-white/10" />

                            {/* content blocks */}
                            <div className="mt-4 space-y-3">
                                <Block title="Key notes" items={current.keyNotes} />
                                <Block title="Conclusion" items={current.conclusion} />
                                {/* (원하면 conclusion 대신 impact를 우측으로 보내도 됨) */}
                            </div>

                            {/* bottom: dots + CTA */}
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
                                                        i === idx
                                                            ? "rgba(255,255,255,0.65)"
                                                            : "rgba(255,255,255,0.18)",
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
                                            className="group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[12px] font-semibold tracking-[0.14em]"
                                            style={{
                                                borderColor: "rgba(255,255,255,0.18)",
                                                color: "rgba(255,255,255,0.92)",
                                                background:
                                                    "radial-gradient(circle at 30% 15%, rgba(255,255,255,0.14), transparent 55%), linear-gradient(180deg, rgba(18,18,18,0.95), rgba(7,7,7,0.95))",
                                                boxShadow: [
                                                    "0 0 0 1px rgba(255,255,255,0.08)",
                                                    "inset 0 1px 1px rgba(255,255,255,0.16)",
                                                    `0 0 26px ${accent}`, // ✅ 글로우 더 강하게
                                                    "0 18px 40px rgba(0,0,0,0.70)",
                                                ].join(", "),
                                            }}
                                        >
                                            <span
                                                className="h-2 w-2 rounded-full"
                                                style={{
                                                    background: accent,
                                                    boxShadow: `0 0 18px ${accent}`,
                                                }}
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

                {/* plate top/bottom lines */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-white/10" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-white/10" />
            </div>

            {/* ✅ zoom modal */}
            {zoom && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-4"
                    onClick={() => setZoom(null)}
                >
                    <div
                        className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black/60"
                        style={{
                            boxShadow:
                                "0 30px 90px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.10)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                            <div className="text-[12px] tracking-[0.18em] uppercase text-zinc-300">
                                {zoom.label}
                            </div>
                            <button
                                type="button"
                                className="h-9 w-9 grid place-items-center rounded-full border border-white/12 text-zinc-200 hover:text-white"
                                onClick={() => setZoom(null)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="relative aspect-[16/9] w-full">
                            <Image src={zoom.src} alt="Zoomed preview" fill className="object-contain" />
                        </div>
                    </div>
                </div>
            )}

            {/* global effects */}
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
            rgba(255, 255, 255, 0.10),
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
