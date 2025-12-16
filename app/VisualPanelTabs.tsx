// app/VisualPanelTabs.tsx
"use client";

import type React from "react";
import { MODES, type ModeId } from "./modes";

type VisualPanelTabsProps = {
    activeMode: ModeId;
    onChangeMode: (id: ModeId) => void;
    powerOn: boolean; // ✅ 전원 상태 전달
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
    powerOn,
}: VisualPanelTabsProps) {
    const mode = MODES[activeMode];
    const detail = MODE_DETAILS[activeMode];

    // ✅ 네온 색 변수들
    const accent =
        (mode as any).accent ||
        (mode as any).accentDot ||
        (mode as any).tabBg ||
        mode.coreColor ||
        "rgba(148,163,184,0.9)";

    const coreColor = mode.coreColor ?? "rgba(148,163,184,0.6)";
    const solidCore = coreColor.replace("0.6", "1"); // 🔹 에러 원인 해결: solidCore 정의
    const isOn = powerOn;

    return (
        <section className="mt-10 md:mt-12 border-t border-white/5 bg-black/40">
            {/* ─── 헤더 + 탭 레일 ─────────────────────── */}
            <div className="relative border-b border-zinc-900/70 px-4 md:px-6 pt-4 pb-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                    {/* 왼쪽: 타이틀 */}
                    <div className="inline-flex items-center gap-2">
                        <span className="h-7 w-7 rounded-full border border-slate-400 flex items-center justify-center text-[11px] tracking-[0.18em]">
                            N
                        </span>
                        <span
                            className="uppercase tracking-[0.22em] text-[11px] md:text-xs"
                            style={{
                                fontFamily:
                                    '"Subway Ticker Grid", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                letterSpacing: "0.22em",
                                color: isOn ? "#E5E7EB" : "#6B7280", // 🔹 전원 OFF면 패널 그레이 톤
                            }}
                        >
                            CONSTELLATION PANEL
                        </span>
                    </div>

                    {/* 오른쪽: 탭 레일 */}
                    <div
                        className="
  relative inline-flex w-full md:w-auto gap-2 rounded-full p-1 border transition-all duration-500
  overflow-x-auto md:overflow-visible
  whitespace-nowrap
  no-scrollbar
"
                        style={{
                            backgroundColor: isOn
                                ? "rgba(9,9,11,0.92)"
                                : "rgba(9,9,11,0.75)",
                            borderColor: isOn
                                ? "rgba(148,163,184,0.9)"
                                : "rgba(39,39,42,1)",
                            boxShadow: isOn
                                ? "0 0 30px rgba(15,23,42,1)"
                                : "0 0 0 rgba(0,0,0,0)",
                        }}
                    >
                        {(
                            [
                                ["brand", "BRAND CORE"],
                                ["web", "WEB EXPERIENCE"],
                                ["visual", "VISUAL SYSTEMS"],
                            ] as [ModeId, string][]
                        ).map(([id, label]) => {
                            const tabMode = MODES[id];
                            const tabAccent =
                                (tabMode as any).accent ||
                                (tabMode as any).accentDot ||
                                (tabMode as any).tabBg ||
                                accent;
                            const isActive = activeMode === id;

                            let style: React.CSSProperties;

                            if (isActive && isOn) {
                                // 🔋 전원 ON + 선택 탭 → Start Session 과 동일 팔레트
                                style = {
                                    backgroundColor: "#0B0B0B",
                                    color: "#E5E5E5",
                                    borderColor: solidCore,
                                    boxShadow: `0 0 24px ${coreColor}`,
                                };
                            } else if (isActive && !isOn) {
                                // 📴 전원 OFF + 선택 탭 → 어두운 남색 톤만
                                style = {
                                    backgroundColor: "#1a1a1aff",
                                    color: "#E5E5E5",
                                    borderColor: "#3F3F46",
                                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                                };
                            } else {
                                // 비활성 탭
                                style = {
                                    backgroundColor: "transparent",
                                    color: isOn ? "#9CA3AF" : "#4B5563",
                                    borderColor: "rgba(39,39,42,0.8)",
                                    boxShadow: "0 0 0 1px rgba(39,39,42,0.8)",
                                };
                            }


                            return (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => onChangeMode(id)}
                                    className={`
                    px-5 md:px-6 py-2 text-[11px] md:text-xs tracking-[0.18em]
                    rounded-full uppercase transition-all border-[2px]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70
                  `}
                                    style={style}
                                >
                                    {label}
                                </button>
                            );
                        })}

                        {/* 탭 레일 안쪽 보조 라인 */}
                        <div className="pointer-events-none absolute inset-y-[2px] left-2 right-2 border-b border-white/5" />
                    </div>
                </div>
            </div>

            {/* ─── ACTIVE 칩 ─────────────────────────── */}
            <div
                className="relative px-6 pt-4 pb-5 border-b transition-colors duration-700"
                style={{
                    borderColor: powerOn
                        ? "rgba(63,63,70,0.95)"
                        : "rgba(24,24,27,0.9)",
                }}
            >
                <div
                    className={`
            inline-flex items-center gap-3 rounded-2xl px-5 py-2.5
            border transition-all duration-700
            ${powerOn
                            ? `${mode.chipBorderClass} ${mode.chipShadowClass}`
                            : "border-zinc-700/70 shadow-none"
                        }
          `}
                    style={{
                        backgroundColor: powerOn ? "#0B0B0B" : "#1a1a1aff",
                        borderColor: powerOn ? solidCore : "#3F3F46",
                        boxShadow: powerOn ? `0 0 24px ${coreColor}` : "0 0 0 rgba(0,0,0,0)",
                    }}
                >
                    {/* 왼쪽 작은 점 */}
                    <span
                        className={`
              h-2.5 w-2.5 rounded-full transition-all duration-700
              ${powerOn ? `${mode.dotClass} shadow-[0_0_10px_rgba(255,255,255,0.4)]` : "bg-zinc-500 shadow-none"}
            `}
                    />

                    {/* 텍스트 */}
                    <span className="text-[15px] md:text-[16px] font-medium text-slate-50">
                        {mode.chipLabel}
                    </span>
                </div>
            </div>

            {/* ─── 메인 패널 : 1/3 이미지 · 2/3 텍스트 ─────── */}
            <div className="relative px-6 pt-6 pb-6 flex flex-col md:flex-row gap-8 md:items-stretch">
                {/* 1/3 – 레이더 패널 */}
                <div className="relative flex-1 md:basis-1/3 flex items-stretch px-2 pb-2">
                    <div
                        className="relative w-full h-full rounded-[16px] min-h-[320px] md:min-h-[380px] overflow-hidden"
                        style={{
                            backgroundColor: "#171717",
                            border: "5px solid #757575",
                            boxShadow:
                                "inset 1px 1px 2px rgba(255,255,255,0.25), 0 0 0 1px rgba(255,255,255,0.3)",
                        }}
                    >
                        {/* 모서리 클램프 */}
                        <div className="absolute -top-1 left-7 h-3.5 w-7 rounded-b-sm bg-zinc-800 border border-zinc-700" />
                        <div className="absolute -top-1 right-7 h-3.5 w-7 rounded-b-sm bg-zinc-800 border border-zinc-700" />
                        <div className="absolute -bottom-1 left-7 h-3.5 w-7 rounded-t-sm bg-zinc-800 border border-zinc-700" />
                        <div className="absolute -bottom-1 right-7 h-3.5 w-7 rounded-t-sm bg-zinc-800 border border-zinc-700" />

                        <div
                            className="absolute inset-5 rounded-[14px]"
                            style={{
                                backgroundColor: "#171717",
                                boxShadow:
                                    "-4px -4px 12px rgba(255,255,255,0.1), 0 0 0 0.5px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div
                                className="absolute inset-6 rounded-[12px]"
                                style={{
                                    backgroundColor: "#171717",
                                    border: "0.5px solid rgba(255,255,255,0.1)",
                                    boxShadow:
                                        "-4px -4px 12px rgba(255,255,255,0.1), 0 0 0 0.5px rgba(0,0,0,0.1)",
                                }}
                            >
                                <div
                                    className="absolute inset-[16%] rounded-[10px] flex items-center justify-center"
                                    style={{
                                        backgroundColor: "#0B0B0B",
                                        boxShadow:
                                            "inset 0 1px 2px rgba(0,0,0,2), 0 1px 2px rgba(255,255,255,0.1)",
                                    }}
                                >
                                    {/* 내부 원형 */}
                                    <div
                                        className="absolute h-20 w-20 rounded-full"
                                        style={{
                                            backgroundImage: powerOn
                                                ? `radial-gradient(circle at center, ${coreColor}, #171717 70%)`
                                                : "radial-gradient(circle at center, #020617, #050816 70%)",
                                            border: "1px solid #000000",
                                            boxShadow: powerOn
                                                ? `inset 1px 1px 2px rgba(255,255,255,0.25),
                           0 0 0 1px rgba(255,255,255,0.3),
                           0 0 24px ${coreColor}`
                                                : "inset 1px 1px 2px rgba(0,0,0,0.9), 0 0 0 1px #000",
                                        }}
                                    />

                                    {/* 모드 타이틀 */}
                                    <span
                                        className="relative z-10 uppercase text-center"
                                        style={{
                                            fontFamily:
                                                '"Subway Ticker Grid", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                            fontSize: "clamp(20px, 2vw, 36px)",
                                            lineHeight: 1.1,
                                            letterSpacing: "0.3em",
                                            color: "#B0B0B0",
                                        }}
                                    >
                                        {mode.titleInTarget}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2/3 – 텍스트 패널 */}
                <div className="flex-[2] md:basis-2/3 flex">
                    <div
                        className="relative w-full rounded-[16px] min-h-[320px] md:min-h-[380px]"
                        style={{
                            backgroundColor: "#171717",
                            border: "1px solid #757575",
                            boxShadow:
                                "inset 1px 1px 2px rgba(255,255,255,0.25), 0 0 0 1px rgba(255,255,255,0.3)",
                        }}
                    >
                        <div
                            className="rounded-[14px] m-4"
                            style={{
                                backgroundColor: "#171717",
                                boxShadow:
                                    "-4px -4px 12px rgba(255,255,255,0.05), 0 0 0 0.5px rgba(0,0,0,0.1)",
                            }}
                        >
                            <div
                                className="rounded-[12px] flex flex-col gap-6 text-[15px] md:text-[16px]"
                                style={{
                                    backgroundColor: "#171717",
                                    border: "0.5px solid rgba(255,255,255,0.12)",
                                    boxShadow:
                                        "-4px -4px 12px rgba(255,255,255,0.1), 0 0 0 0.5px rgba(0,0,0,0.1)",
                                    padding: "1.75rem",
                                }}
                            >
                                <p className="tracking-[0.22em] text-[11px] md:text-[12px] text-zinc-500 uppercase">
                                    {mode.sectionLabel}
                                </p>

                                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-zinc-50">
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

                                {/* 하단 Focus / Status */}
                                <div
                                    className="mt-auto pt-4 flex items-center justify-between text-[13px] md:text-[14px]"
                                    style={{
                                        color: powerOn ? "#9CA3AF" : "#6B7280",
                                    }}
                                >
                                    <span className="font-medium">
                                        Focus ·{" "}
                                        <span style={{ color: powerOn ? "#E5E7EB" : "#9CA3AF" }}>
                                            {mode.focus}
                                        </span>
                                    </span>

                                    <span className="inline-flex items-center gap-1 font-semibold">
                                        <span
                                            className={`
                        h-1.5 w-1.5 rounded-full transition-all duration-700
                        ${powerOn ? mode.dotClass : "bg-zinc-500"}
                      `}
                                        />
                                        <span
                                            style={{ color: powerOn ? "#E5E7EB" : "#9CA3AF" }}
                                        >
                                            {mode.statusLabel}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── 하단 MODE / ROUTE / 버튼 ───── */}
            <div className="mb-6 border-t border-zinc-800 px-6 py-5 flex flex-col md:flex-row md:items-end md:gap-4">
                {/* MODE */}
                <div className="flex-1 md:basis-1/3 flex flex-col gap-1.5">
                    <p className="text-[11px] text-zinc-500 tracking-[0.16em] uppercase">
                        MODE
                    </p>
                    <div
                        className="flex items-center justify-between rounded-[16px] px-5 py-3 text-[13px] md:text-[14px]"
                        style={{
                            backgroundColor: "#171717",
                            border: "1px solid #757575",
                            boxShadow:
                                "inset 1px 1px 2px rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.3)",
                        }}
                    >
                        <span className="text-zinc-100">Concept Lab Studio</span>
                        <span
                            className={`
                h-2.5 w-2.5 rounded-full transition-all duration-700
                ${powerOn ? mode.dotClass : "bg-zinc-500"}
              `}
                        />
                    </div>
                </div>

                {/* ROUTE */}
                <div className="flex-1 md:basis-1/3 flex flex-col gap-1.5 mt-4 md:mt-0">
                    <p className="text-[11px] text-zinc-500 tracking-[0.16em] uppercase">
                        ROUTE
                    </p>
                    <div
                        className="flex items-center justify-between rounded-[16px] px-5 py-3 text-[13px] md:text-[14px]"
                        style={{
                            backgroundColor: "#171717",
                            border: "1px solid #757575",
                            boxShadow:
                                "inset 1px 1px 2px rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.3)",
                        }}
                    >
                        <span className="text-zinc-100">{mode.routeLabel}</span>
                        <span
                            className={`
                text-[10px] md:text-[11px] tracking-[0.18em] uppercase
                ${mode.routeTextClass}
              `}
                            style={{
                                color: powerOn ? "#E5E7EB" : "#9CA3AF",
                            }}
                        >
                            {mode.statusLabel}
                        </span>
                    </div>
                </div>

                {/* 버튼들 */}
                <div className="flex-1 md:basis-1/3 flex gap-3 text-[13px] md:text-[12px] mt-4 md:mt-0">
                    {/* System Map 버튼 – 항상 패널 톤 */}
                    <button
                        className="flex-1 rounded-[16px] px-5 py-3 font-medium transition-colors"
                        style={{
                            backgroundColor: "#171717",
                            border: "1px solid #757575",
                            boxShadow:
                                "inset 1px 1px 2px rgba(255,255,255,0.15), 0 0 0 1px rgba(255,255,255,0.3)",
                            color: "#E5E5E5",
                        }}
                    >
                        System Map
                    </button>

                    {/* Start Session – powerOn 에만 네온 */}
                    <button
                        className="flex-1 rounded-[16px] px-5 py-3 font-medium transition-colors"
                        style={{
                            backgroundColor: powerOn ? "#0B0B0B" : "#1a1a1aff",
                            border: powerOn
                                ? `5px solid ${solidCore}`
                                : "5px solid #3F3F46",
                            boxShadow: powerOn
                                ? `0 0 24px ${coreColor}`
                                : "0 0 0 rgba(0,0,0,0)",
                            color: powerOn ? "#E5E5E5" : "#9CA3AF",
                            cursor: powerOn ? "pointer" : "default",
                        }}
                    >
                        Start Session
                    </button>
                </div>
            </div>
        </section>
    );
}
