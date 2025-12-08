// app/modes.ts

export type ModeId = "brand" | "web" | "visual";

type ModeConfig = {
    id: ModeId;
    tabLabel: string;
    chipLabel: string;
    sectionLabel: string;
    heading: string;
    body: string;
    focus: string;
    statusLabel: string;
    routeLabel: string;
    titleInTarget: string;
    coreColor: string;        // 중앙 네온 코어 색 (rgba)
    dotClass: string;         // 작은 상태 점 색
    routeTextClass: string;   // ROUTE 상태 텍스트 색
    buttonBorderClass: string;
    buttonTextClass: string;
    chipBorderClass: string;  // 상단 칩 테두리 색
    chipShadowClass: string;  // 상단 칩 그림자 색
};

export const MODES: Record<ModeId, ModeConfig> = {
    brand: {
        id: "brand",
        tabLabel: "BRAND CORE",
        chipLabel: "Brand Core – Naming & Storyframe",
        sectionLabel: "01 · BRAND CORE",
        heading: "Naming & Storyframe Lab",
        body:
            "브랜드의 첫 문장, 첫 슬로건, 첫 데크를 설계하는 모드입니다. " +
            "이름·톤·구조를 정리한 뒤 나머지 디자인을 쌓아 올립니다.",
        focus: "Story / Naming",
        statusLabel: "ACTIVE",
        routeLabel: "Desert → Name & Storyframe",
        titleInTarget: "BRAND CORE",
        coreColor: "rgba(16,185,129,0.6)",
        dotClass: "bg-emerald-400",
        routeTextClass: "text-emerald-300",
        buttonBorderClass: "border-emerald-400",
        buttonTextClass: "text-emerald-200",
        chipBorderClass: "border-emerald-400/80",
        chipShadowClass: "shadow-[0_0_26px_rgba(16,185,129,0.7)]",
    },
    web: {
        id: "web",
        tabLabel: "WEB EXPERIENCE",
        chipLabel: "Web Experience – Site & Funnel Design",
        sectionLabel: "02 · WEB EXPERIENCE",
        heading: "Site & Funnel Design",
        body:
            "Figma에서 설계한 여정을 Framer·Webflow·Next.js로 옮기고, " +
            "작은 팀이 운영하기 쉬운 구조와 퍼널을 설계하는 모드입니다.",
        focus: "UX / Flows",
        statusLabel: "READY",
        routeLabel: "Desert → Web Experience",
        titleInTarget: "WEB EXPERIENCE",
        coreColor: "rgba(56,189,248,0.6)",
        dotClass: "bg-sky-400",
        routeTextClass: "text-sky-300",
        buttonBorderClass: "border-sky-400",
        buttonTextClass: "text-sky-200",
        chipBorderClass: "border-sky-400/80",
        chipShadowClass: "shadow-[0_0_26px_rgba(56,189,248,0.7)]",
    },
    visual: {
        id: "visual",
        tabLabel: "VISUAL SYSTEMS",
        chipLabel: "Visual Systems – Decks & Visual Stories",
        sectionLabel: "03 · VISUAL SYSTEMS",
        heading: "Decks & Visual Systems",
        body:
            "리포트, 피치덱, 인스타 시리즈까지 반복해서 쓸 수 있는 시각 언어를 세팅합니다. " +
            "카드·슬라이드·피드 단위로 디자인 시스템을 구성합니다.",
        focus: "Deck / Feed",
        statusLabel: "QUEUED",
        routeLabel: "Desert → Visual Systems",
        titleInTarget: "VISUAL SYSTEMS",
        coreColor: "rgba(252,211,77,0.7)",
        dotClass: "bg-amber-300",
        routeTextClass: "text-amber-200",
        buttonBorderClass: "border-amber-300",
        buttonTextClass: "text-amber-100",
        chipBorderClass: "border-amber-300/80",
        chipShadowClass: "shadow-[0_0_26px_rgba(252,211,77,0.7)]",
    },
};
