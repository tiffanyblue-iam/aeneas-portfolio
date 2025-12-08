// app/VisualPanelTabs.tsx
"use client";

import { MODES, ModeId } from "./modes";

type VisualPanelTabsProps = {
    activeMode: ModeId;
    onChangeMode: (id: ModeId) => void;
};

const MODE_DETAILS: Record<
    ModeId,
    { bullets: string[] }
> = {
    brand: {
        bullets: [
            "네이밍·슬로건·톤앤매너를 한 세트로 정리합니다.",
            "대표 슬라이드 · 소개 페이지에 들어갈 첫 문장을 설계합니다.",
            "디자인 이전에 ‘왜 이 브랜드인가’를 먼저 합의합니다.",
        ],
    },
    web: {
        bullets: [
            "와이어프레임 → UX 카피 → UI 컴포넌트 순서로 정리합니다.",
            "Framer · Webflow · Next.js 등 실제 구현까지를 고려합니다.",
            "운영 팀이 업데이트하기 쉬운 구조와 퍼널을 함께 설계합니다.",
        ],
    },
    visual: {
        bullets: [
            "리포트·피치덱·인스타 피드에 반복 노출될 레이아웃을 만듭니다.",
            "타이포·컬러·컴포넌트 사용 규칙을 가이드로 정리합니다.",
            "디자이너가 없을 때도 팀이 자체 제작할 수 있는 수준을 목표로 합니다.",
        ],
    },
};

export default function VisualPanelTabs({
    activeMode,
    onChangeMode,
}: VisualPanelTabsProps) {
    const mode = MODES[activeMode];
    const detail = MODE_DETAILS[activeMode];

    return (
        <section className="mt-16">
            <div className="relative w-full">
                {/* 바깥 기계식 쉘 */}
                <div
                    className="
            relative
            rounded-[5px]
            border-[2px] border-black/80
            bg-black/95
            shadow-[0_26px_60px_rgba(0,0,0,0.9)]
            overflow-hidden
          "
                >
                    {/* ─── 헤더 + 탭 레일 ─────────────────────── */}
                    <div className="relative border-b border-zinc-800 px-6 pt-4 pb-3 bg-black/70">
                        <div className="flex items-center justify-between gap-4">
                            <div className="inline-flex items-center gap-2">
                                <span className="h-7 w-7 rounded-full border border-slate-400 flex items-center justify-center text-[11px] tracking-[0.18em]">
                                    N
                                </span>
                                <span className="uppercase tracking-[0.22em] text-[11px] md:text-xs text-zinc-400">
                                    CONSTELLATION PANEL
                                </span>
                            </div>

                            {/* 탭 레일 */}
                            <div className="relative inline-flex rounded-full bg-zinc-900/90 p-1 border border-zinc-700/80 shadow-[0_0_18px_rgba(0,0,0,0.8)]">
                                {(
                                    [
                                        ["brand", "BRAND CORE"],
                                        ["web", "WEB EXPERIENCE"],
                                        ["visual", "VISUAL SYSTEMS"],
                                    ] as [ModeId, string][]
                                ).map(([id, label]) => {
                                    const isActive = activeMode === id;
                                    return (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => onChangeMode(id)}
                                            className={`px-6 py-2 text-[11px] md:text-xs tracking-[0.18em] rounded-full uppercase transition-all
                        ${isActive
                                                    ? "bg-white text-zinc-900 shadow-[0_0_24px_rgba(0,0,0,0.9)]"
                                                    : "text-zinc-400 hover:text-zinc-50"
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    );
                                })}

                                <div className="pointer-events-none absolute inset-y-[2px] left-2 right-2 border-b border-white/5" />
                            </div>
                        </div>
                    </div>

                    {/* ─── ACTIVE 칩 ─────────────────────────── */}
                    <div className="relative px-6 pt-4 pb-5 border-b border-zinc-800 bg-black/85">
                        <div
                            className={`
                inline-flex items-center gap-3 rounded-2xl px-5 py-2.5 bg-black
                border ${mode.chipBorderClass} ${mode.chipShadowClass}
              `}
                        >
                            <span
                                className={`h-2.5 w-2.5 rounded-full ${mode.dotClass} shadow-[0_0_10px_rgba(255,255,255,0.4)]`}
                            />
                            <span className="text-[15px] md:text-[16px] font-medium text-slate-50">
                                {mode.chipLabel}
                            </span>
                        </div>
                    </div>

                    {/* ─── 메인 패널 : 1/3 이미지 · 2/3 텍스트 ─────── */}
                    <div className="relative px-6 pt-6 pb-6 flex flex-col md:flex-row gap-8 md:items-stretch">
                        {/* 1/3 – 레이더 패널 (텍스트 카드와 동일 높이) */}
                        <div className="relative flex-1 md:basis-1/3 flex items-stretch px-2 pb-2">
                            <div
                                className="
                  relative w-full
                  rounded-2xl border border-zinc-700
                  bg-gradient-to-b from-zinc-950 via-black to-zinc-950
                  shadow-[0_18px_40px_rgba(0,0,0,0.9)]
                  min-h-[260px] md:min-h-[320px]
                "
                            >
                                {/* 모서리 클램프 */}
                                <div className="absolute -top-1 left-7 h-3.5 w-7 rounded-b-md bg-zinc-900 border border-zinc-700" />
                                <div className="absolute -top-1 right-7 h-3.5 w-7 rounded-b-md bg-zinc-900 border border-zinc-700" />
                                <div className="absolute -bottom-1 left-7 h-3.5 w-7 rounded-t-md bg-zinc-900 border border-zinc-700" />
                                <div className="absolute -bottom-1 right-7 h-3.5 w-7 rounded-t-md bg-zinc-900 border border-zinc-700" />

                                {/* 안쪽 패널 */}
                                <div className="absolute inset-5 rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black flex items-center justify-center">
                                    <div className="absolute inset-[16%] rounded-xl border border-zinc-800/80" />
                                    <div className="absolute inset-[30%] rounded-full border border-zinc-700/70" />
                                    <div className="absolute inset-[42%] rounded-full border border-zinc-600/70" />

                                    <div className="absolute w-px h-28 bg-zinc-600/80" />
                                    <div className="absolute h-px w-28 bg-zinc-600/80" />

                                    <div
                                        className="absolute h-18 w-18 rounded-full border border-white/20 shadow-[0_0_28px_rgba(0,0,0,0.9)]"
                                        style={{
                                            backgroundImage: `radial-gradient(circle at center, ${mode.coreColor}, transparent 70%)`,
                                        }}
                                    />

                                    <span className="relative z-10 text-[11px] tracking-[0.28em] text-slate-50 uppercase text-center">
                                        {mode.titleInTarget}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2/3 – 텍스트 패널 (가독성 업 + 동일 높이) */}
                        <div className="flex-[2] md:basis-2/3 rounded-2xl border border-zinc-700 bg-zinc-950/80 px-7 py-7 flex flex-col gap-4 text-[15px] md:text-[16px] min-h-[260px] md:min-h-[320px]">
                            <p className="tracking-[0.22em] text-[11px] md:text-[12px] text-zinc-500 uppercase">
                                {mode.sectionLabel}
                            </p>
                            <h3 className="text-xl md:text-2xl font-semibold tracking-tight">
                                {mode.heading}
                            </h3>

                            <p className="text-[15px] md:text-[17px] text-zinc-200 leading-relaxed md:leading-8">
                                {mode.body}
                            </p>

                            <ul className="mt-1 space-y-2 text-[14px] md:text-[15px] text-zinc-400 leading-relaxed md:leading-7">
                                {detail.bullets.map((item, idx) => (
                                    <li key={idx} className="flex gap-2">
                                        <span className="mt-[7px] h-[3px] w-[3px] rounded-full bg-zinc-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* 하단 Focus / Status – 최하단 고정 */}
                            <div className="mt-auto pt-4 flex items-center justify-between text-[13px] md:text-[14px] text-zinc-500">
                                <span className="font-medium">
                                    Focus · <span className="text-zinc-200">{mode.focus}</span>
                                </span>
                                <span className="inline-flex items-center gap-1 font-semibold">
                                    <span className={`h-1.5 w-1.5 rounded-full ${mode.dotClass}`} />
                                    {mode.statusLabel}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ─── 하단 MODE / ROUTE / 버튼 (1:1:1 + 하단 정렬) ───── */}
                    <div className="border-t border-zinc-800 px-6 py-5 flex flex-col md:flex-row md:items-end md:gap-4 bg-black/85">
                        {/* MODE */}
                        <div className="flex-1 md:basis-1/3 flex flex-col gap-1.5">
                            <p className="text-[11px] text-zinc-500 tracking-[0.16em] uppercase">
                                MODE
                            </p>
                            <div className="flex items-center justify-between rounded-xl border border-zinc-600 px-4 py-2.5 bg-zinc-950 text-[13px] md:text-[14px]">
                                <span>Concept Lab Studio</span>
                                <span
                                    className={`h-2.5 w-2.5 rounded-full ${mode.dotClass} shadow-[0_0_8px_rgba(16,185,129,0.85)]`}
                                />
                            </div>
                        </div>

                        {/* ROUTE */}
                        <div className="flex-1 md:basis-1/3 flex flex-col gap-1.5 mt-4 md:mt-0">
                            <p className="text-[11px] text-zinc-500 tracking-[0.16em] uppercase">
                                ROUTE
                            </p>
                            <div className="flex items-center justify-between rounded-xl border border-zinc-600 px-4 py-2.5 bg-zinc-950 text-[13px] md:text-[14px]">
                                <span>{mode.routeLabel}</span>
                                <span
                                    className={`text-[10px] md:text-[11px] tracking-[0.18em] uppercase ${mode.routeTextClass}`}
                                >
                                    {mode.statusLabel}
                                </span>
                            </div>
                        </div>

                        {/* 버튼들 */}
                        <div className="flex-1 md:basis-1/3 flex gap-3 text-[13px] md:text-[14px] mt-4 md:mt-0">
                            <button className="flex-1 rounded-full border border-zinc-600 px-4 py-2.5 text-zinc-200 bg-zinc-950 hover:border-zinc-400 hover:text-zinc-50 transition-colors">
                                View System Map
                            </button>
                            <button
                                className={`flex-1 rounded-full px-4 py-2.5 font-medium transition-colors border bg-zinc-950 hover:bg-white/5 ${mode.buttonBorderClass} ${mode.buttonTextClass}`}
                            >
                                Start Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
