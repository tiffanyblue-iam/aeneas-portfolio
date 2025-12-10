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
    tabBg: string;            // 상단 탭 배경컬러
};

export const MODES: Record<ModeId, ModeConfig> = {
    // ───────────────── BRAND CORE ─────────────────
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

        // ★ 브랜드 메인 그린: #4C9990 계열로 통일
        coreColor: "rgba(76,153,144,0.9)",
        // 네온 림
        dotClass: "bg-[#7FEAD4]",
        routeTextClass: "text-[#7FEAD4]",
        buttonBorderClass: "border-[#7FEAD4]",
        buttonTextClass: "text-[#7FEAD4]",
        chipBorderClass: "border-[#7FEAD4]",
        chipShadowClass: "shadow-[0_0_26px_rgba(127,234,212,0.7)]",       // 중앙 네온
        dotClass: "bg-[#4C9990]",                   // 작은 상태 점
        routeTextClass: "text-[#4C9990]",           // ROUTE 상태 텍스트
        buttonBorderClass: "border-[#4C9990]",      // 버튼 테두리
        buttonTextClass: "text-[#CFF6EC]",          // 버튼 텍스트(살짝 밝은 민트)
        chipBorderClass: "border-[#4C9990]/90",     // 상단 칩 테두리
        chipShadowClass: "shadow-[0_0_26px_rgba(76,153,144,0.7)]", // 칩 글로우
        tabBg: "#4C9990",                           // 탭 배경
    },

    // ───────────────── WEB EXPERIENCE ─────────────────
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

        // 그린보다 살짝 딥한 블루 (#3B82C2 라인으로 톤다운)
        coreColor: "rgba(59,130,194,0.9)",
        dotClass: "bg-[#3B82C2]",
        routeTextClass: "text-[#3B82C2]",
        buttonBorderClass: "border-[#3B82C2]",
        buttonTextClass: "text-[#C7E3FF]",
        chipBorderClass: "border-[#3B82C2]/90",
        chipShadowClass: "shadow-[0_0_26px_rgba(59,130,194,0.7)]",
        tabBg: "#3B82C2",
    },

    // ───────────────── VISUAL SYSTEMS ─────────────────
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

        // 그린·블루보다 한 톤 아래로 눌린 골드 (#D0B15A)
        coreColor: "rgba(208,177,90,0.9)",
        dotClass: "bg-[#D0B15A]",
        routeTextClass: "text-[#D0B15A]",
        buttonBorderClass: "border-[#D0B15A]",
        buttonTextClass: "text-[#F8EAC1]",
        chipBorderClass: "border-[#D0B15A]/90",
        chipShadowClass: "shadow-[0_0_26px_rgba(208,177,90,0.7)]",
        tabBg: "#D0B15A",
    },
};
