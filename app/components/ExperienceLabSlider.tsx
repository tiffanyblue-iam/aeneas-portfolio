"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

export type LabKind = "freelance" | "proposal" | "report";

export type LabItem = {
    id: string;
    kind: LabKind;

    badge: string;
    title: string;

    /** B안 필드 (page.tsx에서 쓰는 것들) */
    lead?: string;
    problem?: string[];
    solution?: string[];
    impact?: string[];
    keyNotes?: string[];
    conclusion?: string[];

    /** 기존 메타 */
    period?: string;
    role?: string;

    /** 링크 */
    href?: string;
    cta?: string;

    /** 이미지: public 기준 "lab/xxx.png" 또는 "/lab/xxx.png" 둘 다 허용 */
    beforeImg?: string;
    afterImg?: string;

    /** 강제 강조색 옵션 */
    accent?: string;
};

type Props = {
    items: LabItem[];
    autoMs?: number;
    className?: string;
    mainColor?: string;
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
    // "//lab/.." 방지 + "/lab/.." or "lab/.." 모두 OK
    const s = src.replace(/^\/+/, "");
    return `/${s}`;
}

/** 이미지 확대 모달 */
function ZoomModal({
    open,
    onClose,
    src,
    label,
}: {
    open: boolean;
    onClose: () => void;
    src: string;
    label: string;
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[999] grid place-items-center bg-black/70 p-4"
            onMouseDown={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/12 bg-black/80"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div className="text-[12px] tracking-[0.18em] uppercase text-zinc-300">
                        {label}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-9 w-9 grid place-items-center rounded-full border border-white/12 text-zinc-200 hover:text-white"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="relative w-full aspect-[16/9] bg-black">
                    <Image
                        src={src}
                        alt={`${label} zoom`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 1024px"
                        className="object-contain"
                        priority={false}
                    />
                </div>
            </div>
        </div>
    );
}

/** 작은 이미지 카드: hover 확대 + scanline + 클릭 확대 */
function FigureCard({
    label,
    rawSrc,
    onClick,
}: {
    label: string;
    rawSrc?: string;
    onClick?: () => void;
}) {
    const hasImage = Boolean(rawSrc);
    const src = normalizePublicSrc(rawSrc);

    return (
        <button
            type="button"
            className="group relative overflow-hidden rounded-2xl border border-white/12 bg-black/45 text-left"
            onClick={hasImage ? onClick : undefined}
            disabled={!hasImage}
            aria-label={hasImage ? `Zoom ${label}` : `${label} no image`}
        >
            {/* header label */}
            <div className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full border border-white/12 bg-black/60 px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-200">
                {label}
            </div>

            {/* scanlines overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="scanlines" />
                <div className="scan-sweep" />
            </div>

            {/* image */}
            <div className="relative h-full w-full">
                {hasImage ? (
                    <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
                        <Image
                            src={src}
                            alt={`${label} preview`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 grid place-items-center text-zinc-500 text-[12px]">
                        No image
                    </div>
                )}
            </div>

            {/* CLICK 라벨 (더 진하게) */}
            <div className="absolute right-3 bottom-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/60 px-3 py-1">
                <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-zinc-200 group-hover:text-white transition-colors">
                    <span className="underline underline-offset-2">Click</span>
                </span>
            </div>

            {/* inset */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/10 to-transparent opacity-25" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent" />
        </button>
    );
}

export default function ExperienceLabSlider({
    items,
    autoMs = 12000,
    className = "",
}: Props) {
    const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);
    const count = safeItems.length;

    const [idx, setIdx] = useState(0);
    const [hovered, setHovered] = useState(false);

    const [zoom, setZoom] = useState<{ open: boolean; src: string; label: string }>({
        open: false,
        src: "",
        label: "",
    });

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
        if (!count || hovered) return;
        const t = window.setInterval(() => {
            setIdx((v) => clampIdx(v + 1, count));
            dirRef.current = 1;
        }, Math.max(3000, autoMs));
        return () => window.clearInterval(t);
    }, [count, hovered, autoMs]);

    if (!count) return null;

    const kindLabel =
        current.kind === "freelance"
            ? "CLIENT WORK"
            : current.kind === "proposal"
                ? "DECK / PROPOSAL"
                : "REPORT";

    const openZoom = (rawSrc: string, label: string) => {
        const src = normalizePublicSrc(rawSrc);
        setZoom({ open: true, src, label });
    };

    return (
        <div
            className={`relative mx-auto max-w-6xl overflow-visible ${className}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* NAV (플레이트 밖으로 올려서 절대 안 잘림) */}
            <div className="absolute right-3 top-[-18px] md:right-5 md:top-[-20px] z-50">
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
                                "radial-gradient(circle at 30% 15%, rgba(255,255,255,0.12), transparent 55%), linear-gradient(180deg, rgba(16,16,16,0.95), rgba(6,6,6,0.95))",
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
                                "radial-gradient(circle at 30% 15%, rgba(255,255,255,0.12), transparent 55%), linear-gradient(180deg, rgba(16,16,16,0.95), rgba(6,6,6,0.95))",
                            boxShadow:
                                "0 0 24px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 1px rgba(255,255,255,0.14)",
                        }}
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* 메인 플레이트 */}
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
                {/* frame lines */}
                <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/5" />
                <div className="pointer-events-none absolute inset-[10px] rounded-[22px] ring-1 ring-white/5" />
                <div className="pointer-events-none absolute inset-[18px] rounded-[18px] ring-1 ring-white/5" />
                <div className="noise pointer-events-none absolute inset-0 opacity-[0.08]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/10 to-transparent opacity-35" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent" />

                <div className="relative z-10">
                    {/* 상단 라벨 */}
                    <div className="mb-4 flex items-center justify-between">
                        <div className="text-[11px] tracking-[0.28em] uppercase text-zinc-500">
                            Experience Lab <span className="text-zinc-600">•</span>
                            <span className="ml-2" style={{ color: accent }}>
                                ●
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {/* LEFT: 타이틀 + 문제/솔루션/임팩트 */}
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

                            <h3 className="text-[18px] font-semibold text-zinc-50 leading-snug">
                                {current.title}
                            </h3>

                            {current.lead ? (
                                <p className="mt-3 text-[13px] leading-relaxed text-zinc-300">
                                    {current.lead}
                                </p>
                            ) : null}

                            <div className="mt-5 space-y-4">
                                <Section stage="problem" title="Problem" items={current.problem} accent={accent} />
                                <Section stage="solution" title="Solution" items={current.solution} accent={accent} />
                                <Section stage="impact" title="Impact" items={current.impact} accent={accent} />
                            </div>
                        </div>

                        {/* CENTER: 이미지 (상/하 50% 꽉 채움) */}
                        <div
                            className="relative rounded-2xl border border-white/12 bg-black/30 p-4 overflow-hidden"
                            style={{
                                boxShadow:
                                    "inset 1px 1px 2px rgba(255,255,255,0.10), inset -2px -2px 10px rgba(0,0,0,0.65), 0 18px 44px rgba(0,0,0,0.70)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/5" />
                            <div className="pointer-events-none absolute inset-[10px] rounded-[14px] ring-1 ring-white/5" />

                            <div className="grid gap-3" style={{ gridTemplateRows: "1fr 1fr", height: "100%" }}>
                                <FigureCard
                                    label="BEFORE"
                                    rawSrc={current.beforeImg}
                                    onClick={() => current.beforeImg && openZoom(current.beforeImg, "BEFORE")}
                                />
                                <FigureCard
                                    label="AFTER"
                                    rawSrc={current.afterImg}
                                    onClick={() => current.afterImg && openZoom(current.afterImg, "AFTER")}
                                />
                            </div>
                        </div>

                        {/* RIGHT: 상단 spec(박스 없이) + 결론/키노트 + 하단 CTA */}
                        <div
                            className="relative rounded-2xl border border-white/12 bg-black/35 p-5 overflow-hidden flex flex-col"
                            style={{
                                boxShadow:
                                    "inset 1px 1px 2px rgba(255,255,255,0.12), inset -2px -2px 10px rgba(0,0,0,0.65), 0 18px 44px rgba(0,0,0,0.70)",
                            }}
                        >
                            <div className="pointer-events-none absolute inset-0 ring-1 ring-white/5" />
                            <div className="pointer-events-none absolute inset-[10px] rounded-[14px] ring-1 ring-white/5" />

                            {/* 상단: CLIENT WORK + 스펙 */}
                            <div className="flex items-center justify-between">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                                    {kindLabel}
                                </p>
                                <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ backgroundColor: accent, boxShadow: `0 0 14px ${accent}` }}
                                />
                            </div>

                            <div className="mt-4 border-t border-white/12 pt-4">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
                                    <div className="text-zinc-500">Period</div>
                                    <div className="text-zinc-200 text-right">{current.period ?? "-"}</div>
                                    <div className="text-zinc-500">Role</div>
                                    <div className="text-zinc-200 text-right">{current.role ?? "-"}</div>
                                </div>
                            </div>

                            {/* 결론 */}
                            {current.conclusion?.length ? (
                                <div className="mt-6">
                                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                                        Conclusion
                                    </p>
                                    <div className="mt-3 rounded-xl border border-white/10 bg-black/35 p-4 text-[13px] leading-relaxed text-zinc-200">
                                        {current.conclusion[0]}
                                    </div>
                                </div>
                            ) : null}

                            {/* 키노트 */}
                            <div className="mt-6">
                                <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                                    Key Notes
                                </p>
                                <div className="mt-3 space-y-3">
                                    {(current.keyNotes?.length ? current.keyNotes : ["핵심 포인트 3줄 요약"]).map(
                                        (t, i) => (
                                            <div key={i} className="flex gap-3">
                                                <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/25" />
                                                <p className="text-[13px] leading-relaxed text-zinc-300">{t}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* 하단: 페이지/닷 + CTA */}
                            <div className="mt-auto pt-6">
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
                                                    `0 0 52px rgba(0,0,0,0.75)`,
                                                ].join(", "),
                                            }}
                                        >
                                            <span
                                                className="h-2 w-2 rounded-full"
                                                style={{ background: accent, boxShadow: `0 0 18px ${accent}` }}
                                            />
                                            <span className="transition-all duration-200 group-hover:font-extrabold">
                                                {current.cta ?? "Open"}
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

                {/* top/bottom line */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-white/10" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-white/10" />
            </div>

            {/* zoom modal */}
            <ZoomModal
                open={zoom.open}
                src={zoom.src}
                label={zoom.label}
                onClose={() => setZoom({ open: false, src: "", label: "" })}
            />

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

function Section({
    stage,
    title,
    items,
    accent,
}: {
    stage: "problem" | "solution" | "impact";
    title: string;
    items?: string[];
    accent?: string;
}) {
    if (!items?.length) return null;

    // 단계별 컬러 톤(너의 기계 패널 톤 유지하면서, 텍스트가 "순서"로 보이게)
    const palette =
        stage === "problem"
            ? {
                chip: "rgba(244,63,94,0.95)", // rose
                ring: "rgba(244,63,94,0.22)",
                bgA: "rgba(244,63,94,0.10)",
                bgB: "rgba(0,0,0,0.18)",
                label: "Issue",
            }
            : stage === "solution"
                ? {
                    chip: "rgba(56,189,248,0.95)", // sky
                    ring: "rgba(56,189,248,0.22)",
                    bgA: "rgba(56,189,248,0.10)",
                    bgB: "rgba(0,0,0,0.18)",
                    label: "Plan",
                }
                : {
                    chip: accent ?? "rgba(76,153,144,0.95)", // accent(emerald-ish)
                    ring: `${accent ?? "rgba(76,153,144,0.95)"}33`,
                    bgA: `${accent ?? "rgba(76,153,144,0.95)"}22`,
                    bgB: "rgba(0,0,0,0.18)",
                    label: "Result",
                };

    return (
        <div
            className="
        relative rounded-2xl border border-white/10 p-4 overflow-hidden
        shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
      "
            style={{
                background: [
                    `linear-gradient(180deg, ${palette.bgA} 0%, ${palette.bgB} 100%)`,
                    "radial-gradient(circle at 18% 12%, rgba(255,255,255,0.08), transparent 55%)",
                    "radial-gradient(circle at 85% 80%, rgba(255,255,255,0.05), transparent 60%)",
                ].join(", "),
                boxShadow: [
                    "inset 1px 1px 2px rgba(255,255,255,0.10)",
                    "inset -2px -2px 10px rgba(0,0,0,0.65)",
                    `0 10px 26px rgba(0,0,0,0.55)`,
                    `0 0 0 1px rgba(255,255,255,0.06)`,
                ].join(", "),
            }}
        >
            {/* 상단 ‘순차’ 라인/글로우 */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
                style={{
                    background: `linear-gradient(90deg, transparent 0%, ${palette.chip} 50%, transparent 100%)`,
                    opacity: 0.85,
                }}
            />
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    boxShadow: `inset 0 0 0 1px ${palette.ring}`,
                }}
            />

            {/* 헤더 */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{
                            backgroundColor: palette.chip,
                            boxShadow: `0 0 18px ${palette.chip}`,
                        }}
                    />
                    <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-300">
                        {title}
                    </p>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                        · {palette.label}
                    </span>
                </div>

                {/* 미세 하이라이트 점 */}
                <span className="h-1.5 w-1.5 rounded-full bg-white/18" />
            </div>

            {/* 리스트 */}
            <div className="mt-3 space-y-2.5">
                {items.slice(0, 3).map((t, i) => (
                    <div key={i} className="flex gap-3">
                        <span
                            className="mt-[7px] h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.22)" }}
                        />
                        <p className="text-[13px] leading-relaxed text-zinc-200/90">
                            {t}
                        </p>
                    </div>
                ))}
            </div>

            {/* 바닥 그라데이션로 “박스 떠있는 느낌” */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/55 to-transparent" />
        </div>
    );
}
