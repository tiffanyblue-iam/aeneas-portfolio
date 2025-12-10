// app/modes.ts

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

        // 네온 코어 (민트)
        coreColor: "rgba(22,140,126,0.9)",

        // 상태 · 라벨 계열 (민트 라이트)
        dotClass: "bg-[#7FEAD4]",
        routeTextClass: "text-[#7FEAD4]",
        buttonBorderClass: "border-[#7FEAD4]",
        buttonTextClass: "text-[#7FEAD4]",
        chipBorderClass: "border-[#7FEAD4]",
        chipShadowClass: "shadow-[0_0_26px_rgba(127,234,212,0.7)]",

        // 탭 배경 (패널 카드와 맞춘 깊은 민트)
        tabBg: "#4C9990",
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

        coreColor: "rgba(56,189,248,0.85)",

        dotClass: "bg-[#4BA3E8]",
        routeTextClass: "text-[#4BA3E8]",
        buttonBorderClass: "border-[#4BA3E8]",
        buttonTextClass: "text-[#CFE9FF]",
        chipBorderClass: "border-[#4BA3E8]",
        chipShadowClass: "shadow-[0_0_26px_rgba(75,163,232,0.7)]",

        tabBg: "#255B8F", // 살짝 톤다운된 블루
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

        coreColor: "rgba(252,211,77,0.8)",

        dotClass: "bg-[#E6C25A]",
        routeTextClass: "text-[#E6C25A]",
        buttonBorderClass: "border-[#E6C25A]",
        buttonTextClass: "text-[#FFEEC0]",
        chipBorderClass: "border-[#E6C25A]",
        chipShadowClass: "shadow-[0_0_26px_rgba(230,194,90,0.7)]",

        tabBg: "#8C6A24", // 톤다운 골드
    },
};

