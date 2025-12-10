// app/page.tsx
"use client";

import Image from "next/image";
import { useState, useEffect, type ReactNode } from "react";
import VisualPanelTabs from "./VisualPanelTabs";
import { ModeId } from "./modes";
import { motion, AnimatePresence } from "framer-motion";


// 공통 기계식 프레임 토큰

const MACHINE_FRAME_STYLE: React.CSSProperties = {
  backgroundColor: "#171717",
  border: "1px solid #757575",
  boxShadow:
    "inset 1px 1px 2px rgba(255,255,255,0.25), 0 0 0 1px rgba(255,255,255,0.3)",
};

const MACHINE_INNER_STYLE: React.CSSProperties = {
  backgroundColor: "#171717",
  boxShadow:
    "-4px -4px 12px rgba(255,255,255,0.1), 0 0 0 0.5px rgba(0,0,0,0.1)",
};


const ZIGZAG_HIGHLIGHT_KEYS = [
  "톤과 구조 모두 타깃과 어긋나 있었습니다.",
  "시장 조사부터 촬영 시스템·상세 구조까지 처음부터 판을 만들어야 하는 상황이었습니다.",
];

function highlightZigzagContext(text: string): ReactNode {
  let nodes: ReactNode[] = [text];

  ZIGZAG_HIGHLIGHT_KEYS.forEach((key, keyIndex) => {
    const next: ReactNode[] = [];

    nodes.forEach((node, nodeIndex) => {
      // 이미 JSX( span )인 건 그대로 둔다
      if (typeof node !== "string") {
        next.push(node);
        return;
      }

      const parts = node.split(key);

      parts.forEach((part, partIndex) => {
        if (part) next.push(part);

        // 쪼갠 사이마다 하이라이트 span 삽입
        if (partIndex < parts.length - 1) {
          next.push(
            <span
              key={`${keyIndex}-${nodeIndex}-${partIndex}`}
              className="text-[#F6FF6B] underline underline-offset-4 decoration-[#F6FF6B]/70"
            >
              {key}
            </span>
          );
        }
      });
    });

    nodes = next;
  });

  return nodes;
}



/** ─────────────────────────────────
 *  Global Typography Tokens
 *  ──────────────────────────────── */
const TYPE = {
  heroBody: "text-[16px] md:text-[18px] leading-relaxed",
  chip: "text-[13px] md:text-[14px]",
  sectionKicker: "text-[13px] md:text-[14px] tracking-[0.24em] uppercase",
  sectionBody: "text-[14px] md:text-[15px] leading-relaxed",
  panelLabel: "text-[12px] md:text-[13px]",
  panelBody: "text-[14px] md:text-[15px] leading-relaxed",
  projectKicker:
    "text-[14px] md:text-[15px] font-semibold tracking-[0.22em] uppercase",
  projectTitle: "text-[19px] md:text-[21px] font-semibold",
  projectBody: "text-[15px] md:text-[16px] leading-relaxed",
  projectMeta: "text-[13px] md:text-[14px]",
  statusBody: "text-[15px] md:text-[16px]",
  footer: "text-[12px] md:text-[13px]",

  // ✅ Studio Lab용 큰 타이틀
  labTitle: "text-[34px] md:text-[56px] leading-[1.05] font-semibold tracking-tight",
};

// 툴 아이콘 매핑 (현재는 디자인 그대로 두고, 필요하면 나중에 사용)
const TOOL_ICON_MAP: Record<string, string> = {
  Figma: "🎨",
  Photoshop: "🖼",
  Illustrator: "✏️",
  "HTML/CSS": "{;}",
  "Rakuten 관리툴": "🛒",
  Notion: "📒",
  "Webflow/Next.js": "🌐",
};

type ToolInfo = { name: string; icon: string };

function parseTools(tools: string): ToolInfo[] {
  return tools.split(",").map((raw) => {
    const name = raw.trim();
    const icon = TOOL_ICON_MAP[name] ?? "•";
    return { name, icon };
  });
}

/** ─────────────────────────────────
 *  Project Detail Data
 *  ──────────────────────────────── */
type ProjectId = "zigzag" | "gmarket" | "travel";

type ProjectDetail = {
  id: ProjectId;
  kicker: string;
  title: string;
  period?: string;
  clientType?: string;
  tools?: string;
  role: string;
  context: string | ReactNode;
  goal: string[];
  process: { label: string; body: string }[];
  outcome: string;
  links?: { label: string; href: string }[];
};

// ───────────────────────
//  프로젝트 텍스트 내용
// ───────────────────────
const PROJECT_DETAILS: Record<ProjectId, ProjectDetail> = {
  zigzag: {
    id: "zigzag",
    kicker: "FASHION COMMERCE · UX / BRANDING",
    // ✅ 제목 수정
    title: "지그재그 패션 쇼핑몰 런칭",
    period: "2023.03 – 2023.11 (약 10개월)",
    // ✅ 클라이언트 타입에서 '지그재그 입점사' 삭제
    clientType: "Z세대 타깃 패션 쇼핑몰",
    tools: "Photoshop, Illustrator, Figma, HTML/CSS",
    role:
      "시장 조사 · 스튜디오/모델 섭외 · 촬영 콘셉트 기획 · 상세페이지 구조 설계 및 퍼블리싱",
    context: `클라이언트는 10대 후반~20대 초반 여성 타깃을 노리고 있었지만, 
기존 상세페이지는 20대 중후반 기준으로 구성되어 있어 톤과 구조 모두 타깃과 어긋나 있었습니다. 
내부에 브랜딩·기획 리소스가 없어, 시장 조사부터 촬영 시스템·상세 구조까지 처음부터 판을 만들어야 하는 상황이었습니다.`,

    goal: [
      "10대 후반~20대 초반 Z세대에 맞는 브랜드 톤과 촬영 콘셉트를 새로 정의할 것",
      "지그재그 환경에 맞는 상세페이지 구조를 템플릿화해, 촬영·디자인을 반복 제작 가능하게 할 것",
      "상품별 상세 템플릿을 구조화해 전환율과 재구매를 끌어올리고, 동일 인력으로 시즌 제작 물량을 커버할 것",
      "지그재그 랭킹·경쟁사 리서치 기반으로 ‘어디서 차별화할지’ 포지션을 명확히 할 것",
    ],
    process: [
      {
        label: "01 · MARKET SCAN & POSITIONING",
        body:
          "지그재그 상위 랭킹·리뷰·10대 커뮤니티를 분석해 타깃 인사이트를 정리하고, ‘10대 후반 전용 포지션’ 영역을 정의했습니다.",
      },
      {
        label: "02 · SHOOTING SYSTEM",
        body:
          "스튜디오와 모델을 직접 섭외하고, 룩 구성·포즈/구도·컷 수를 표준화한 촬영 가이드·체크리스트 패키지를 제작했습니다.",
      },
      {
        label: "03 · TEMPLATE & ROLL-OUT",
        body:
          "‘핵심 정보 카드 → 전체 실루엣 → 디테일’ 순의 모듈형 상세 템플릿을 HTML/CSS로 구현하고, 운영팀이 복제해 쓸 수 있도록 인수인계했습니다.",
      },
    ],
    outcome:
      "런칭 후 3개월 동안 매출이 약 900% 상승했고,\n지그재그 앱 내 쇼핑 카테고리 상위 TOP3까지 도달했습니다.\n별도 광고 증액 없이도 상세 템플릿과 촬영 시스템만으로 전환율을 끌어올렸고,\n이후 시즌 상품들은 같은 구조를 사용해 제작 리소스를 크게 줄였습니다.",
  },

  gmarket: {
    id: "gmarket",
    kicker: "GLOBAL MARKETPLACE · UX / SEO",
    title: "지마켓 글로벌(일본) · 라쿠텐 환경 대응 운영",
    period: "약 1년 이상 운영",
    clientType: "글로벌 오픈마켓",
    tools: "Photoshop, HTML/CSS, Rakuten 관리툴",
    role:
      "사이트 UI 디자인 · 프로모션 배너 · 퍼블리싱 · SEO 구조 설계 및 운영",
    context: (
      <>
        일본 고객을 대상으로 하는 지마켓 글로벌/라쿠텐 스토어는
        한국에서 쓰던 상세 구조를 거의 그대로 가져온 상태라,
        일본 사용자 입장에서는 정보 순서와 표현 방식이 낯설었습니다.
        게다가 라쿠텐 입점·운영은{" "}
        <span className="text-amber-300">
          기존에 다른 사업체가 진행하다가 중간에 포기된 상태
        </span>
        였고, 저는 그 이후에 합류해 구조를 처음부터 다시 잡는
        리빌드 역할을 맡았습니다. 상품 구조·노출 전략도 카테고리마다
        제각각이라 브랜드 인지와 구매 흐름이 끊기는 상황이었습니다.{" "}
        <span className="text-amber-300">
          국내와는 다른 일본 시장 특성과 라쿠텐 주 고객층의 UX 습관,
          라쿠텐 검색/SEO 룰
        </span>
        을 먼저 이해한 뒤,{" "}
        <span className="text-amber-300">
          일본 사용자가 편하게 느끼는 정보 구조와
          내부 운영 여건이 동시에 맞는 레이아웃
        </span>
        을 설계해야 했습니다.
      </>
    ),
    goal: [
      "라쿠텐 상위 스토어를 분석해 일본 고객이 익숙한 정보 구조와 노출 룰을 파악할 것",
      "리스트·상세·기획전 페이지를 일관된 UX로 재정리해 구매 흐름을 매끄럽게 만들 것",
      "카테고리별 키워드·SEO 룰을 정리해 운영하면서도 유지할 수 있는 체계를 만들 것",
    ],
    process: [
      {
        label: "01 · ENVIRONMENT STUDY",
        body:
          "라쿠텐 상위 스토어의 카테고리 구조·키워드·쿠폰/혜택 노출 방식을 분석해, 우리 상품군과 매칭한 레퍼런스 맵을 만들었습니다.",
      },
      {
        label: "02 · UX & LAYOUT",
        body:
          "리스트·상세·기획전을 일본 사용자가 익숙한 순서(가격·쿠폰·리뷰·혜택) 기준으로 재배치하고, 공통 레이아웃 가이드를 정의했습니다.",
      },
      {
        label: "03 · SEO & OPERATION",
        body:
          "카테고리별 필수 키워드 세트를 만들고 타이틀·설명·배너 카피에 반영했습니다. 운영 중에도 검색 리포트를 보며 노출/클릭을 주기적으로 튜닝했습니다.",
      },
    ],
    outcome:
      "라쿠텐 환경에 맞는 레이아웃과 카테고리별 키워드 세트를 정리한 뒤,\n검색 노출과 기획전 유입이 점차 안정되었습니다.\n운영팀은 제가 만든 공통 템플릿(리스트·상세·기획전)에 맞춰 배너와 페이지를 반복 제작할 수 있게 되었고,\n내부에서는 ‘일본/라쿠텐 UX와 SEO 구조까지 설계할 수 있는 디자이너’로 포지셔닝되었습니다.",
  },

  travel: {
    id: "travel",
    kicker: "TRAVEL / LIFESTYLE · BRAND & WEB",
    title: "여행·라이프스타일 브랜드 리빌딩",
    period: "약 6개월, ongoing",
    clientType: "여행/숙박 커머스",
    tools: "Cafe24, Figma, Notion, Photoshop, Toss",
    role:
      "브랜드 코어 정의 · 웹 IA/와이어 설계 · 인스타/피드 시각 언어 설계 · 제휴 제안서/리포트 템플릿 제작",
    context: (
      <>
        프로젝트는{" "}
        <span className="text-amber-300">라우트웨이컨설팅 주식회사</span>가
        운영하던 사이드 프로젝트{" "}
        <span className="text-amber-300">RouteWorld</span>에서 시작되었습니다.
        초기에는 뷰티 커머스로 출발했지만,
        이후 호텔·여행 상품, 다시{" "}
        <span className="text-amber-300">여행+라이프스타일 커머스</span>로
        사업 축이 크게 바뀌어 왔습니다. 캠페인마다 타깃과 상품이 달라지면서
        톤과 페이지 구조도 함께 흔들렸고, 프리미엄 호텔·리조트 브랜드를
        지향하다가 IPSC 체험, 국내 숙소 등으로 피봇이 잦았습니다. 이런 환경에서
        저는{" "}
        <span className="text-amber-300">
          계속 바뀌는 상품·사업자 구조 위에도 유지되는 브랜드 코어와
          운영 시스템
        </span>
        을 설계하고, 어떤 캠페인이 와도 팀과 외부 파트너가 따라갈 수 있는
        기준선을 만드는 역할을 맡았습니다. 이후 회사 사정으로
        RouteWorld 사업은 정리되었지만,{" "}
        <span className="text-amber-300">
          방향 전환과 종료 과정까지 포함해 브랜드를 어떻게 핸들링했는지
        </span>
        가 이 프로젝트의 중요한 경험으로 남았습니다.
      </>
    ),
    goal: [
      "인플루언서 중심의 산발적인 운영에서, 브랜드·상품·숫자를 기준으로 한 운영 프레임으로 전환할 것",
      "팀원들이 따라올 수 있는 브리프 → 제작 → 리뷰 워크플로우를 만들고 역할과 책임을 명확히 할 것",
      "호텔·체험 제휴사와 에이전시에게도 일관된 언어와 포맷으로 브랜드를 설명할 수 있게 할 것",
      "사업자 형태 조정이 잦은 환경에서도 유지되는 브랜드 코어와 포지셔닝을 정리할 것",
    ],
    process: [
      {
        label: "01 · BRAND CORE & ROUTE",
        body:
          "대표·리더 인터뷰와 기존 캠페인/피드를 정리해 ‘무엇을 팔고 싶은지 vs 실제로 팔리고 있는 것’을 분리했습니다. 그 위에 ‘도시에 닿는 가장 빠른 여행’이라는 코어 문장과 호텔·체험·콘텐츠를 잇는 여정 맵을 만들었습니다.",
      },
      {
        label: "02 · SYSTEM & TEAM WORKFLOW",
        body:
          "캠페인 흐름을 브리핑 → 제작 → 리뷰 3단계로 단순화하고, Notion 태스크보드와 Figma 템플릿으로 역할·산출물을 규격화했습니다. 팀원들이 같은 포맷으로 카드·배너·피드를 만들 수 있는 기준선을 세웠습니다.",
      },
      {
        label: "03 · EXTERNAL COLLAB & POSITIONING",
        body:
          "호텔/체험 제휴사용 소개 데크와 제안서 템플릿을 제작해, 쇼핑몰 명의나 조건이 바뀌어도 브랜드 설명 구조는 유지되도록 설계했습니다. 외부 파트너와의 커뮤니케이션에서 브랜드 코어·타깃·딜 구조를 한 장표로 설명할 수 있게 정리했습니다.",
      },
    ],
    outcome:
      "뷰티 → 여행 → 여행+라이프스타일로 사업 축이 여러 번 바뀌는 동안에도,\n브랜드 코어 문장과 여정 맵, 제안서·피드 템플릿을 기준으로 캠페인과 제휴사가 바뀌어도 설명 구조를 유지할 수 있었습니다.\n리더·사업자 구성이 바뀌고 결국 RouteWorld 사업이 정리되는 과정까지,\n브랜드 기준선과 산출물 시스템을 문서와 템플릿으로 남겨 이후 AENEAS Studio 포트폴리오 설계의 기반이 되었습니다.",
  },
}; // 🔚 PROJECT_DETAILS 끝



// ───────────────────────
//  비주얼(이미지) 타입 & 데이터
// ───────────────────────
type ProjectVisual = {
  src: string;
  title: string;
  caption: string;
};

const PROJECT_VISUALS: Record<ProjectId, ProjectVisual[]> = {
  zigzag: [
    {
      src: "/work/zigzag/01-shooting-guide.jpg",
      title: "촬영 가이드 & 콘셉트 메모",
      caption:
        "런칭 타깃, 포즈, 소품, 조명까지 정의한 사전 기획 문서. 촬영팀과 공유한 기준점입니다.",
    },
    {
      src: "/work/zigzag/02-overview-kv.jpg",
      title: "런칭 키 비주얼",
      caption: "지그재그 패션 카테고리 런칭을 위해 제작한 시즌 키 비주얼.",
    },
    {
      src: "/work/zigzag/03-brand-mood.png",
      title: "브랜드 무드 & 톤",
      caption:
        "Femininity·Lovely·Confident 키워드를 시각 언어로 정리한 브랜드 무드보드.",
    },
    {
      src: "/work/zigzag/04-detail-hoodie.png",
      title: "후드 티 상세 페이지 구조",
      caption:
        "컬러, 핏, 스타일링 포인트를 한 흐름으로 배치한 후드 티셔츠 상세 모듈.",
    },
    {
      src: "/work/zigzag/05-detail-denim-skirt.png",
      title: "데님 스커트 스토리텔링 상세",
      caption:
        "추천 카피, 플라워 비주얼, 착장 컷을 결합해 설득력을 높인 상세 페이지.",
    },
    {
      src: "/work/zigzag/06-detail-training-pants.png",
      title: "트레이닝 팬츠 정보 모듈",
      caption:
        "핏·활동감 이미지와 Comment/Notice 모듈을 분리해 정보 탐색성을 높였습니다.",
    },
  ],

  gmarket: [
    {
      src: "/work/gmarket/01-top-page.jpg",
      title: "라쿠텐 상위 카테고리 레이아웃",
      caption:
        "일본 고객이 익숙한 가격·쿠폰·혜택 순서를 기준으로 재배치한 리스트.",
    },
    {
      src: "/work/gmarket/02-campaign.jpg",
      title: "기획전 배너 & 캠페인",
      caption: "시즌 프로모션용 배너와 랜딩 조합.",
    },
    {
      src: "/work/gmarket/03-seo-structure.jpg",
      title: "SEO 구조 샘플",
      caption: "타이틀·설명·키워드 블록 구조 예시.",
    },
  ],

  travel: [
    {
      src: "/work/travel/01-brand-core.jpg",
      title: "브랜드 코어 정리",
      caption: "‘어떤 여행을 제안하는가’를 한 페이지로 정리한 코어 슬라이드.",
    },
    {
      src: "/work/travel/02-web-wireframe.png",
      title: "호텔·체험 IA & 와이어",
      caption: "여정 단계별로 나눈 IA와 와이어 시안.",
    },
    {
      src: "/work/travel/03-feed-system.jpg",
      title: "인스타 피드 카드 시스템",
      caption: "피드·슬라이드·배너에 공통 적용한 타이포/레이아웃 규칙.",
    },
  ],
};


/** ─────────────────────────────────
 *  바둑판 키보드 보드 공통 설정
 *  ──────────────────────────────── */
const GRID_ROWS = 5;
const GRID_COLS = 10;

type LetterStone = {
  row: number;
  col: number;
  char: string;
};

type Accent = "emerald" | "sky" | "amber";
type BoardVariant = "wide" | "narrow";

type BoardProps = {
  letters: LetterStone[];
  card: ReactNode;
  variant: BoardVariant;
  accent: Accent;
  active: boolean;
  onClick: () => void;
};

function TileBoard({
  letters,
  card,
  variant,
  accent,
  active,
  onClick,
}: BoardProps) {
  const letterMap = new Map<string, string>();
  letters.forEach((l) => {
    letterMap.set(`${l.row}-${l.col}`, l.char);
  });

  // 태그 카드 가로 폭
  const cardWidthPercent = variant === "narrow" ? 64 : 72;

  const ringActive =
    accent === "emerald"
      ? "ring-2 ring-emerald-400/70 shadow-[0_0_40px_rgba(34,197,94,0.45)]"
      : accent === "sky"
        ? "ring-2 ring-sky-400/70 shadow-[0_0_40px_rgba(56,189,248,0.5)]"
        : "ring-2 ring-amber-300/70 shadow-[0_0_40px_rgba(252,211,77,0.55)]";

  const ringHover =
    accent === "emerald"
      ? "hover:ring-[1.5px] hover:ring-emerald-300/65"
      : accent === "sky"
        ? "hover:ring-[1.5px] hover:ring-sky-300/65"
        : "hover:ring-[1.5px] hover:ring-amber-200/70";

  const tagTextColor =
    accent === "emerald"
      ? "text-emerald-300"
      : accent === "sky"
        ? "text-sky-300"
        : "text-amber-200";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-[8px] border border-white/6 bg-black/82 px-6 py-5
        shadow-[0_22px_60px_rgba(0,0,0,0.9)]
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${active
          ? `${ringActive} scale-[1.01]`
          : `${ringHover} scale-[0.995] hover:scale-[1.01] hover:shadow-[0_28px_80px_rgba(0,0,0,0.95)]`
        }`}
    >
      <div className="relative h-full w-full">
        {/* 바둑판 / 키캡 그리드 */}
        <div
          className="grid h-full w-full gap-[6px]"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: GRID_ROWS }).flatMap((_, row) =>
            Array.from({ length: GRID_COLS }).map((_, col) => {
              const key = `${row}-${col}`;
              const char = letterMap.get(key);

              // 흑돌(키캡)
              if (char) {
                return (
                  <div
                    key={key}
                    className="flex items-center justify-center aspect-square rounded-[8px]
                      border border-white/35
                      bg-[radial-gradient(circle_at_25%_12%,rgba(255,255,255,0.45),rgba(40,40,52,0.75)_40%,rgba(0,0,0,1)_88%)]
                      text-[13px] font-medium tracking-[0.32em] uppercase text-zinc-50
                      shadow-[0_10px_22px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.55)]
                      transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                      group-hover:-translate-y-[1px]"
                  >
                    {char}
                  </div>
                );
              }

              // 백돌
              return (
                <div
                  key={key}
                  className="aspect-square rounded-[8px]
                    bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.98),rgba(233,233,240,0.9)_65%,rgba(16,16,24,0.9)_100%)]
                    opacity-[0.7]
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_6px_14px_rgba(0,0,0,0.85)]"
                />
              );
            })
          )}
        </div>

        {/* 타이틀 태그 + CLICK */}
        <div
          className="pointer-events-none absolute left-1/2 bottom-6 -translate-x-1/2"
          style={{ width: `${cardWidthPercent}%` }}
        >
          <div
            className="pointer-events-auto flex items-center justify-between
              rounded-[8px] border border-white/70 bg-white/0
              px-6 py-3
              shadow-[0_18px_40px_rgba(0,0,0,0.75)]
              backdrop-blur-[14px]
              transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
              group-hover:-translate-y-[10px]"
          >
            {/* 왼쪽: 프로젝트 카테고리/타이틀 */}
            <div className="text-left leading-tight">
              <div className={`flex flex-col gap-0.5 ${tagTextColor}`}>{card}</div>
            </div>

            {/* 오른쪽: CLICK 라벨 */}
            <span className="ml-4 inline-flex items-center text-[11px] font-semibold tracking-[0.22em] uppercase text-zinc-600 group-hover:text-zinc-800 transition-colors">
              <span className="mr-[2px] underline underline-offset-2">
                Click
              </span>
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/** ─────────────────────────────────
 *  Home
 *  ──────────────────────────────── */
export default function Home() {

  const [activeMode, setActiveMode] = useState<ModeId>("brand");
  const [activeProject, setActiveProject] = useState<ProjectId | null>(null);

  // 디테일 뷰: 텍스트 케이스 vs 비주얼
  const [detailView, setDetailView] = useState<"case" | "visual">("case");

  // 클릭해서 크게 보는 이미지(없으면 null)
  const [activeVisual, setActiveVisual] =
    useState<ProjectVisual | null>(null);

  useEffect(() => {
    // 프로젝트 바뀔 때마다 설명 뷰 + 확대 이미지 리셋
    setDetailView("case");
    setActiveVisual(null);
  }, [activeProject]);

  // 현재 활성 프로젝트 디테일
  const activeProjectDetail = activeProject
    ? PROJECT_DETAILS[activeProject]
    : null;

  // 디테일 카드 외곽/내부 그라데이션 + 타이틀/버튼 컬러
  const detailAccentClass =
    activeProjectDetail?.id === "zigzag"
      ? "from-emerald-500/22 via-emerald-500/5"
      : activeProjectDetail?.id === "gmarket"
        ? "from-sky-500/24 via-sky-500/6"
        : "from-amber-300/24 via-amber-300/6";

  const detailInnerBgClass =
    activeProjectDetail?.id === "zigzag"
      ? "from-emerald-500/12 via-[#050609]/96 to-black/98"
      : activeProjectDetail?.id === "gmarket"
        ? "from-sky-500/12 via-[#050609]/96 to-black/98"
        : "from-amber-300/14 via-[#050609]/96 to-black/98";

  const detailTitleColorClass =
    activeProjectDetail?.id === "zigzag"
      ? "text-emerald-100"
      : activeProjectDetail?.id === "gmarket"
        ? "text-sky-100"
        : "text-amber-100";

  const detailToggleAccentClass =
    activeProjectDetail?.id === "zigzag"
      ? "border-emerald-400/80 text-emerald-100 hover:bg-emerald-500/10"
      : activeProjectDetail?.id === "gmarket"
        ? "border-sky-400/80 text-sky-100 hover:bg-sky-500/10"
        : "border-amber-300/80 text-amber-100 hover:bg-amber-400/10";

  // 비주얼 뷰용 산출물
  const currentVisuals = activeProject
    ? PROJECT_VISUALS[activeProject]
    : [];

  /** ─────────────────────────────────
   *  Studio Lab / Proposals Data
   *  ──────────────────────────────── */

  type LabItemKind = "freelance" | "proposal" | "report";

  type LabItem = {
    id: string;
    kind: LabItemKind;
    badge: string;
    title: string;
    period?: string;
    role: string;
    summary: string;
    href?: string;   // 🔹 클릭 시 이동할 링크
    cta?: string;    // 🔹 버튼 문구
  };

  const LAB_ITEMS: LabItem[] = [
    {
      id: "global-vcc",
      kind: "freelance",
      badge: "FREELANCE · WEB",
      title: "Global VCC · 화상 영어 플랫폼 리뉴얼",
      period: "2024 (약 3개월)",
      role: "IA 설계 · UX/UI 디자인 · HTML/CSS 퍼블리싱",
      summary:
        "복잡한 학원식 페이지를 ‘선별된 강사/커리큘럼/수강 신청 흐름’ 중심으로 재정리해, 과정·횟수·시간 선택과 견적 박스를 한 화면에서 이해할 수 있는 구조로 리빌딩했습니다.",
      href: "https://tiffanyblue-iam.github.io/Project-VCC-website/",
      cta: "사이트 보기",
    },
    {
      id: "lawdidim",
      kind: "freelance",
      badge: "FREELANCE · WEB",
      title: "LawDidim · 회생·파산 법무사 랜딩",
      period: "2024 (약 2개월)",
      role: "UX 구조 설계 · 웹디자인 · 카피라이팅",
      summary:
        "회생·파산을 고민할 정도로 여유가 없는 사용자의 심리를 전제로, 최소한의 정보와 명확한 안내에 집중한 랜딩 페이지 흐름을 설계했습니다. 성공사례·후기·FAQ를 한 흐름으로 배치해 안심·신뢰를 우선했습니다.",
      href: "https://www.lawdidim.com/",
      cta: "사이트 보기",
    },
    {
      id: "josun-routeworld",
      kind: "proposal",
      badge: "PROPOSAL · DECK",
      title: "Josun Palace × Routeworld · 인플루언서 공동구매 제안서",
      period: "2023 (약 3주)",
      role: "제안 구조 설계 · 슬라이드 디자인",
      summary:
        "조선팰리스 비수기 객실을 메가급 인플루언서 공동구매로 판매하는 구조로, ADR 유지·폐쇄형 랜딩·혜택 중심 패키지 흐름으로 설계한 제안서입니다.",
      // ⬇⬇ 여기 경로를 실제 파일 이름과 맞춰 주는 게 핵심
      href: "/lab/routeworld_josun-palace.pdf",
      cta: "PDF 제안서 열기",
    },
  ];



  return (
    <div className="aeneas-bg min-h-screen text-zinc-50">
      <main className="w-full px-6 md:px-12 py-16 md:py-24 space-y-24 md:space-y-28">
        {/* 1) HERO + CONSTELLATION + PANEL */}
        <div className="w-full max-w-5xl mx-auto space-y-20 md:space-y-24">
          {/* HERO */}
          <header className="space-y-8">
            <div className="flex items-end gap-4">
              <Image
                src="/aeneas-logo-white.png"
                alt="AENEAS Studio logo"
                width={220}
                height={80}
                priority
                className="drop-shadow-[0_0_32px_rgba(0,0,0,0.9)]"
              />
              <span className="mb-1 text-[11px] font-medium tracking-[0.28em] text-zinc-500 uppercase">
                Studio
              </span>
            </div>

            <h1 className="max-w-5xl text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
              Brands that walk through the desert into their next green place.
            </h1>

            <p className={`max-w-4xl text-zinc-300 ${TYPE.heroBody}`}>
              AENEAS Studio는{" "}
              <span className="text-zinc-50">명확한 이야기, 선명한 UX,</span>{" "}
              그리고{" "}
              <span className="text-zinc-50">현실적인 런칭 플랜</span>이 필요한
              브랜드를 위한 작은 스튜디오. <br />첫 번째 데크부터 라이브
              사이트까지, 사막을 건너 다음 그린 플레이스에 도착할 때까지 함께
              걷습니다.
            </p>

            <div className="flex flex-wrap gap-3 text-zinc-200">
              <span
                className={`inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 ${TYPE.chip}`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Brand &amp; Web Direction
              </span>
              <span
                className={`inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 ${TYPE.chip}`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                UX Writing &amp; Deck Systems
              </span>
              <span
                className={`inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 ${TYPE.chip}`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Framer / Webflow / Next.js
              </span>
            </div>
          </header>

          {/* CONSTELLATION MAP */}
          <section className="mt-10">
            {/* 바깥 프레임 – 패널과 동일 톤 */}
            <div
              className="relative rounded-[16px] overflow-hidden"
              style={{
                backgroundColor: "rgba(0,0,0,0.07)", // 블랙 7% 투명
                border: "1px solid #757575",
                boxShadow:
                  "inset 1px 1px 2px rgba(255,255,255,0.25), 0 0 0 1px rgba(255,255,255,0.3)",
              }}
            >
              {/* 안쪽 살짝 들어간 프레임 */}
              <div
                className="m-4 rounded-[14px] px-8 py-8 md:px-10 md:py-10"
                style={{
                  backgroundColor: "rgba(0,0,0,0.07)", // 블랙 7% 투명
                  boxShadow:
                    "-4px -4px 12px rgba(255,255,255,0.1), 0 0 0 0.5px rgba(0,0,0,0.1)",
                }}
              >
                {/* 헤더 */}
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div className="space-y-1">
                    <p className={`${TYPE.sectionKicker} text-zinc-400`}>
                      AENEAS CONSTELLATION
                    </p>
                    <p className={`${TYPE.sectionBody} text-zinc-500`}>
                      사막에서 그린 플레이스로 향하는 세 가지 별자리 모드입니다.
                    </p>
                  </div>
                  <span className="rounded-full border border-zinc-200/35 px-3 py-1 text-[11px] tracking-[0.18em] text-zinc-200">
                    MODES · 03
                  </span>
                </div>

                {/* 라인 + 점 */}
                <div className="mt-6">
                  <div className="relative h-14 px-[6%]">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-zinc-200/55 to-transparent shadow-[0_0_18px_rgba(255,255,255,0.26)]" />
                    <div className="relative z-10 flex h-full items-center justify-between">
                      {/* BRAND CORE */}
                      <div className="flex items-center justify-center">
                        <div className="relative h-4 w-4">
                          {/* 네온 그린 글로우 */}
                          <div
                            className="absolute inset-[-4px] rounded-full blur-[8px]"
                            style={{ backgroundColor: "rgba(127,234,212,0.35)" }} // #7FEAD4, 살짝 투명
                          />
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              backgroundColor: "#7FEAD4",
                              boxShadow: "0 0 16px rgba(127,234,212,0.9)",
                            }}
                          />
                          <div className="absolute inset-[-6px] rounded-full border border-zinc-100/90" />
                        </div>
                      </div>


                      {/* WEB EXPERIENCE – 블루 톤 다운 */}
                      <div className="flex items-center justify-center">
                        <div className="relative h-4 w-4">
                          <div
                            className="absolute inset-[-4px] rounded-full blur-[8px]"
                            style={{ backgroundColor: "rgba(126,200,255,0.32)" }}
                          />
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              backgroundColor: "#7EC8FF",
                              boxShadow: "0 0 16px rgba(126,200,255,0.9)",
                            }}
                          />
                          <div
                            className="absolute inset-[-6px] rounded-full border"
                            style={{ borderColor: "rgba(224,244,255,0.95)" }}
                          />
                        </div>
                      </div>

                      {/* VISUAL SYSTEMS – 옐로우 톤 다운 */}
                      <div className="flex items-center justify-center">
                        <div className="relative h-4 w-4">
                          <div
                            className="absolute inset-[-4px] rounded-full blur-[8px]"
                            style={{ backgroundColor: "rgba(249,224,138,0.32)" }}
                          />
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              backgroundColor: "#F9E08A",
                              boxShadow: "0 0 16px rgba(249,224,138,0.9)",
                            }}
                          />
                          <div
                            className="absolute inset-[-6px] rounded-full border"
                            style={{ borderColor: "rgba(255,245,204,0.95)" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 모드 카드 3개 – 라운드 16px + 통일된 쉘 */}
                  <div className="mt-4 grid grid-cols-3 gap-6">
                    {/* BRAND CORE */}
                    <button
                      type="button"
                      onClick={() => setActiveMode("brand")}
                      className="text-left rounded-[16px] px-5 py-4 border transition-all"
                      style={
                        activeMode === "brand"
                          ? {
                            backgroundColor: "rgba(0,0,0,0.3)",
                            borderColor: "#7FEAD4",
                            boxShadow: "0 0 26px rgba(127,234,212,0.6)",
                          }
                          : {
                            backgroundColor: "rgba(0,0,0,0.6)",
                            borderColor: "#3F3F46",
                          }
                      }
                    >
                      <p
                        className={`${TYPE.panelLabel} font-medium text-zinc-400 mb-1`}
                      >
                        01 · BRAND CORE
                      </p>
                      <h2 className="text-sm md:text-[15px] font-semibold mb-1">
                        Naming &amp; Storyframe
                      </h2>
                      <p className={`${TYPE.panelBody} text-zinc-400`}>
                        브랜드의 첫 문장과 구조를 잡는 모드입니다.
                      </p>
                    </button>

                    {/* WEB EXPERIENCE */}
                    <button
                      type="button"
                      onClick={() => setActiveMode("web")}
                      className="text-left rounded-[16px] px-5 py-4 border transition-all"
                      style={
                        activeMode === "web"
                          ? {
                            backgroundColor: "rgba(0,0,0,0.3)",
                            borderColor: "#7EC8FF",
                            boxShadow: "0 0 26px rgba(126,200,255,0.6)",
                          }
                          : {
                            backgroundColor: "rgba(0,0,0,0.6)",
                            borderColor: "#3F3F46",
                          }
                      }
                    >
                      <p
                        className={`${TYPE.panelLabel} font-medium text-zinc-400 mb-1`}
                      >
                        02 · WEB EXPERIENCE
                      </p>
                      <h2 className="text-sm md:text-[15px] font-semibold mb-1">
                        Site &amp; Funnel Design
                      </h2>
                      <p className={`${TYPE.panelBody} text-zinc-400`}>
                        Figma에서 설계한 여정을 라이브 사이트까지 이어붙입니다.
                      </p>
                    </button>

                    {/* VISUAL SYSTEMS */}
                    <button
                      type="button"
                      onClick={() => setActiveMode("visual")}
                      className="text-left rounded-[16px] px-5 py-4 border transition-all"
                      style={
                        activeMode === "visual"
                          ? {
                            backgroundColor: "rgba(0,0,0,0.3)",
                            borderColor: "#F9E08A",
                            boxShadow: "0 0 26px rgba(249,224,138,0.6)",
                          }
                          : {
                            backgroundColor: "rgba(0,0,0,0.6)",
                            borderColor: "#3F3F46",
                          }
                      }
                    >
                      <p
                        className={`${TYPE.panelLabel} font-medium text-zinc-400 mb-1`}
                      >
                        03 · VISUAL SYSTEMS
                      </p>
                      <h2 className="text-sm md:text-[15px] font-semibold mb-1">
                        Decks &amp; Visual Systems
                      </h2>
                      <p className={`${TYPE.panelBody} text-zinc-400`}>
                        슬라이드·피드·카드까지 반복해서 쓰는 시각 언어를 설계합니다.
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>




          {/* VISUAL PANEL */}
          <section className="mt-16">
            <VisualPanelTabs
              activeMode={activeMode}
              onChangeMode={setActiveMode}
            />
          </section>
        </div>


        {/* 2) SELECTED WORK – 바둑판 3분할 풀폭 + 디테일 패널 */}
        <section className="mt-20 border-t border-white/7 pt-10">
          {/* 위쪽 타이틀 영역 */}
          <header className="mb-10 text-center space-y-3 max-w-5xl mx-auto">
            <p className={`${TYPE.sectionKicker} text-zinc-500`}>Selected Work</p>
            <h2 className="text-2xl md:text-[28px] tracking-tight">
              디자인이 아니라,{" "}
              <span className="text-5xl italic font-semibold">(결과로 설명하는)</span>{" "}
              프로젝트들
            </h2>
            <p
              className={`mx-auto max-w-3xl text-zinc-400 ${TYPE.sectionBody}`}
            >
              각 보드는 한 프로젝트를 위한 작은 시스템 맵입니다.
              <br />
              포인트 흑돌에는 프로젝트명을, 카드에는 타이틀만 남겼습니다.
            </p>
          </header>

          {/* ▼▼▼ 바둑판 영역 – 가로 풀폭 */}
          <div className="mt-8 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
            <div className="w-screen px-6 md:px-12 lg:px-20">
              {/* 바둑판 전체를 감싸는 패널 – 화이트 10% 배경 */}
              <div className="rounded-[8px] border border-white/7 bg-white/5 px-6 py-8 shadow-[0_26px_70px_rgba(0,0,0,0.85)]">
                <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 lg:gap-7">
                  {/* ZIGZAG */}
                  <TileBoard
                    letters={
                      [
                        { row: 1, col: 2, char: "Z" },
                        { row: 1, col: 3, char: "I" },
                        { row: 1, col: 4, char: "G" },
                        { row: 1, col: 5, char: "Z" },
                        { row: 1, col: 6, char: "A" },
                        { row: 1, col: 7, char: "G" },
                      ] as LetterStone[]
                    }
                    variant="wide"
                    accent="emerald"
                    active={activeProject === "zigzag"}
                    onClick={() => setActiveProject("zigzag")}
                    card={
                      <>
                        <span className={`${TYPE.projectKicker} text-emerald-500`}>
                          FASHION COMMERCE
                        </span>
                        <span className={`${TYPE.projectKicker} text-emerald-500`}>
                          UX / BRANDING
                        </span>
                      </>
                    }
                  />

                  {/* GMARKET / RAKUTEN */}
                  <TileBoard
                    letters={
                      [
                        // GMARKET
                        { row: 1, col: 1, char: "G" },
                        { row: 1, col: 2, char: "M" },
                        { row: 1, col: 3, char: "A" },
                        { row: 1, col: 4, char: "R" },
                        { row: 1, col: 5, char: "K" },
                        { row: 1, col: 6, char: "E" },
                        { row: 1, col: 7, char: "T" },
                        // RAKUTEN
                        { row: 2, col: 2, char: "R" },
                        { row: 2, col: 3, char: "A" },
                        { row: 2, col: 4, char: "K" },
                        { row: 2, col: 5, char: "U" },
                        { row: 2, col: 6, char: "T" },
                        { row: 2, col: 7, char: "E" },
                        { row: 2, col: 8, char: "N" },
                      ] as LetterStone[]
                    }
                    variant="narrow"
                    accent="sky"
                    active={activeProject === "gmarket"}
                    onClick={() => setActiveProject("gmarket")}
                    card={
                      <>
                        <span className={`${TYPE.projectKicker} text-sky-400`}>
                          GLOBAL MARKETPLACE
                        </span>
                        <span className={`${TYPE.projectKicker} text-sky-400`}>
                          UX / SEO
                        </span>
                      </>
                    }
                  />

                  {/* TRAVEL */}
                  <TileBoard
                    letters={
                      [
                        { row: 1, col: 2, char: "T" },
                        { row: 1, col: 3, char: "R" },
                        { row: 1, col: 4, char: "A" },
                        { row: 1, col: 5, char: "V" },
                        { row: 1, col: 6, char: "E" },
                        { row: 1, col: 7, char: "L" },
                      ] as LetterStone[]
                    }
                    variant="wide"
                    accent="amber"
                    active={activeProject === "travel"}
                    onClick={() => setActiveProject("travel")}
                    card={
                      <>
                        <span className={`${TYPE.projectKicker} text-amber-400`}>
                          TRAVEL / LIFESTYLE
                        </span>
                        <span className={`${TYPE.projectKicker} text-amber-400`}>
                          BRAND &amp; WEB
                        </span>
                      </>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {/* ▲▲▲ 바둑판 영역 끝 */}


          {/* ▼▼▼ 하단 디테일 – 종이 펼쳐짐 + 비주얼 토글 */}
          <div
            className={`mt-14 max-w-5xl mx-auto overflow-hidden transform-gpu transition-all duration-500 ease-out origin-top
      ${activeProjectDetail
                ? "max-h-[1800px] opacity-100 scale-y-100"
                : "max-h-0 opacity-0 scale-y-95"
              }`}
          >
            {activeProjectDetail && (
              <div
                className={`relative rounded-[26px] bg-gradient-to-b ${detailAccentClass} to-black/96 p-[1.5px]`}
              >
                {/* 우측 상단 X 버튼 */}
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-white/25 bg-black/70 text-[13px] text-zinc-200/80 hover:bg-black/95 hover:text-zinc-50"
                  aria-label="닫기"
                >
                  ×
                </button>

                <div
                  className={`rounded-[24px] border border-white/16 bg-gradient-to-b ${activeProjectDetail.id === "zigzag"
                    ? "from-emerald-500/12 via-[#050609]/96 to-black/98"
                    : activeProjectDetail.id === "gmarket"
                      ? "from-sky-500/12 via-[#050609]/96 to-black/98"
                      : "from-amber-300/14 via-[#050609]/96 to-black/98"
                    } px-8 py-7 shadow-[0_30px_80px_rgba(0,0,0,0.9)]`}
                >
                  {/* 상단 헤더 + 토글 버튼 */}
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <p
                        className={`${TYPE.projectKicker} text-xs text-zinc-300 mb-1`}
                      >
                        {activeProjectDetail.kicker}
                      </p>
                      <h3
                        className={`text-[22px] md:text-[24px] font-semibold ${activeProjectDetail.id === "zigzag"
                          ? "text-emerald-100"
                          : activeProjectDetail.id === "gmarket"
                            ? "text-sky-100"
                            : "text-amber-100"
                          }`}
                      >
                        {activeProjectDetail.title}
                      </h3>

                      <div className="flex flex-wrap gap-3 text-zinc-400 text-[13px] md:text-[14px]">
                        {activeProjectDetail.period && (
                          <span>Period · {activeProjectDetail.period}</span>
                        )}
                        {activeProjectDetail.clientType && (
                          <span>Client · {activeProjectDetail.clientType}</span>
                        )}
                      </div>

                      {/* Tools – 아이콘 배지로 표현 */}
                      {activeProjectDetail.tools && (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {parseTools(activeProjectDetail.tools).map((tool) => (
                            <span
                              key={tool.name}
                              className="inline-flex items-center gap-1 rounded-full bg-white/6 px-2.5 py-1 text-[11px] text-zinc-50"
                            >
                              <span>{tool.icon}</span>
                              <span>{tool.name}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <p className={`${TYPE.projectMeta} text-zinc-400 mt-1`}>
                        Role · {activeProjectDetail.role}
                      </p>
                    </div>

                    {/* 프로젝트 보기 / 설명 보기 토글 – 강조된 pill 버튼 */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDetailView(detailView === "case" ? "visual" : "case")
                        }
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.22em] transition-all ${activeProjectDetail.id === "zigzag"
                          ? "border-emerald-400/80 text-emerald-100 hover:bg-emerald-500/10"
                          : activeProjectDetail.id === "gmarket"
                            ? "border-sky-400/80 text-sky-100 hover:bg-sky-500/10"
                            : "border-amber-300/80 text-amber-100 hover:bg-amber-400/10"
                          }`}
                      >
                        <span>
                          {detailView === "case" ? "프로젝트 보기" : "설명 보기"}
                        </span>
                        <span className="translate-y-[1px]">
                          {detailView === "case" ? "→" : "←"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 내용 영역 */}
                  <div className="space-y-7 md:space-y-8">
                    {/* CASE VIEW – 기존 텍스트 설명 */}
                    {detailView === "case" && (
                      <>
                        {/* Context */}
                        <div className="space-y-3 md:space-y-4">
                          <h4 className="text-sm font-semibold text-zinc-200">
                            Context &amp; Problem
                          </h4>
                          <p className={`${TYPE.projectBody} text-zinc-300`}>
                            {activeProjectDetail.id === "zigzag"
                              ? highlightZigzagContext(activeProjectDetail.context as string)
                              : activeProjectDetail.context}
                          </p>
                        </div>

                        {/* Goals */}
                        <div className="space-y-3 md:space-y-4">
                          <h4 className="text-sm font-semibold text-zinc-200">
                            Goals
                          </h4>
                          <ul className="grid gap-3 md:grid-cols-2 text-[14px] md:text-[15px]">
                            {activeProjectDetail.goal.map((g) => (
                              <li
                                key={g}
                                className="rounded-2xl border border-white/10 bg-zinc-900/60 px-4 py-3 text-zinc-200 leading-relaxed"
                              >
                                • {g}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Process */}
                        <div className="space-y-4 md:space-y-5">
                          <h4 className="text-sm font-semibold text-zinc-200">
                            Process
                          </h4>
                          <div className="grid gap-4 md:grid-cols-3">
                            {activeProjectDetail.process.map((step) => (
                              <div
                                key={step.label}
                                className="rounded-2xl border border-white/12 bg-zinc-900/70 px-4 py-4 space-y-3"
                              >
                                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-zinc-400">
                                  {step.label}
                                </p>
                                <p className="text-[13px] md:text-[14px] text-zinc-300 leading-relaxed">
                                  {step.body}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Outcome */}
                        <div className="space-y-3 md:space-y-4">
                          <h4 className="text-sm font-semibold text-zinc-200">
                            Outcome
                          </h4>
                          <p className={`${TYPE.projectBody} whitespace-pre-line text-zinc-300`}>
                            {activeProjectDetail.outcome}
                          </p>
                        </div>
                      </>
                    )}

                    {/* VISUAL VIEW – 산출물 갤러리 */}
                    {detailView === "visual" && (
                      <div className="mt-2 grid gap-5 md:grid-cols-3">
                        {currentVisuals.map((visual) => (
                          <figure key={visual.title} className="space-y-3">
                            <button
                              type="button"
                              onClick={() => setActiveVisual(visual)}
                              className="group relative block w-full aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:ring-offset-2 focus:ring-offset-black"
                            >
                              <Image
                                src={visual.src}
                                alt={visual.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              />
                              {/* 오버레이 힌트 */}
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
                                <span className="rounded-full border border-white/40 bg-black/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-100">
                                  Click to Zoom
                                </span>
                              </div>
                            </button>

                            <figcaption className="space-y-1">
                              <p className="text-[13px] font-semibold text-zinc-100">
                                {visual.title}
                              </p>
                              <p className="text-[12px] leading-relaxed text-zinc-400">
                                {visual.caption}
                              </p>
                            </figcaption>
                          </figure>
                        ))}
                      </div>
                    )}



                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 확대 모달 – 모든 프로젝트 공통 */}
          <AnimatePresence>
            {activeVisual && (
              <>
                {/* 어두운 배경 */}
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
                  onClick={() => setActiveVisual(null)}
                />

                {/* 메인 패널 */}
                <motion.div
                  key="panel"
                  initial={{ opacity: 0, scale: 0.6, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{
                    delay: 0.5,              // 0.5초 뒤에 시작
                    duration: 0.5,           // 펼쳐지는 시간
                    ease: [0.16, 1, 0.3, 1], // 점점 빨라지는 느낌
                  }}
                  className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8"
                  onClick={() => setActiveVisual(null)}
                >
                  <div
                    className="relative w-full max-w-6xl h-[88vh] rounded-3xl border border-white/16 bg-gradient-to-b from-zinc-900/95 to-black shadow-[0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden"
                    onClick={(e) => e.stopPropagation()} // 안쪽 클릭 시 닫히지 않게
                  >
                    {/* 닫기 버튼 */}
                    <button
                      type="button"
                      onClick={() => setActiveVisual(null)}
                      className="absolute right-4 top-4 z-[95] rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-zinc-100 shadow-lg hover:bg-black/90 md:right-6 md:top-5"
                    >
                      닫기 ✕
                    </button>

                    {/* 이미지 + 설명 */}
                    <div className="relative h-full w-full">
                      <Image
                        src={activeVisual.src}
                        alt={activeVisual.title}
                        fill
                        className="object-contain"
                        sizes="(min-width: 1024px) 80vw, 100vw"
                      />

                      {/* 하단 텍스트 그라데이션 */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 md:p-6">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                          Detail View
                        </p>
                        <p className="text-sm md:text-base font-semibold text-zinc-50">
                          {activeVisual.title}
                        </p>
                        <p className="mt-1 text-xs md:text-sm text-zinc-200">
                          {activeVisual.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ▲▲▲ 디테일 영역 끝 */}
        </section>

        {/* 3) STUDIO LAB + STUDIO STATUS 그룹  */}
        <div className="space-y-0">
          {/* STUDIO LAB */}
          <section className="mt-24">
            {/* 뷰포트 풀폭 래핑 */}
            <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
              <div className="relative w-screen min-h-screen overflow-hidden bg-black">
                {/* 상단~하단 그라데이션 */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />

                {/* 하단 레이어 이미지 */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] opacity-80"
                  style={{
                    backgroundImage: "url('/lab/layer-grid.jpg')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "bottom center",
                    backgroundSize: "contain",
                  }}
                />

                {/* 컨텐츠 래퍼 */}
                <div className="relative z-10 mx-auto max-w-7xl px-8 md:px-16 pt-14 pb-4 space-y-10">
                  {/* 상단 타이틀 */}
                  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    {/* 왼쪽: 라벨 + 큰 타이틀 */}
                    <div className="max-w-xl space-y-4">
                      <p className={`${TYPE.sectionKicker} text-zinc-500`}>
                        STUDIO LAB
                      </p>
                      <h2 className="text-[40px] md:text-[56px] font-semibold leading-tight tracking-tight text-zinc-50">
                        WE LAYER
                        <br />
                        EXPERIENCE LAB
                      </h2>
                    </div>

                    {/* 오른쪽: 설명 + 키워드 */}
                    <div className="max-w-md space-y-3 md:text-right">
                      <p className={`${TYPE.sectionBody} text-zinc-300`}>
                        프리랜서 웹·브랜딩 작업과 제안서를 모아, <br />
                        AENEAS가 문제를 정의하고 경험을 설계하는 방식을 실험하는 구역입니다.
                      </p>
                      <p className="text-[12px] tracking-[0.18em] uppercase text-zinc-500">
                        FREELANCE · PROPOSAL · SYSTEM THINKING
                      </p>
                    </div>
                  </div>

                  {/* 카드 그리드 – 프리랜서 2 + 제안서 1 */}
                  <div className="grid gap-7 md:grid-cols-3 max-w-6xl">
                    {LAB_ITEMS.map((item) => (
                      <article
                        key={item.id}
                        className="flex h-full flex-col rounded-2xl border border-white/12
                  bg-zinc-950/85 px-6 py-6
                  shadow-[0_18px_50px_rgba(0,0,0,0.9)]
                  backdrop-blur-sm"
                      >
                        {/* 상단 배지 + 종류 포인트 컬러 */}
                        <div className="mb-4 flex items-center justify-between gap-2">
                          <span className="inline-flex items-center rounded-full border border-zinc-700/80 bg-black/70 px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase text-zinc-300">
                            {item.badge}
                          </span>
                          <span
                            className={
                              item.kind === "freelance"
                                ? "h-1.5 w-1.5 rounded-full bg-emerald-400"
                                : item.kind === "proposal"
                                  ? "h-1.5 w-1.5 rounded-full bg-sky-400"
                                  : "h-1.5 w-1.5 rounded-full bg-amber-300"
                            }
                          />
                        </div>

                        {/* 타이틀/메타 */}
                        <div className="mb-3 space-y-1">
                          <h3 className="text-[17px] md:text-[19px] font-semibold text-zinc-50 leading-snug">
                            {item.title}
                          </h3>
                          {item.period && (
                            <p className="text-[12px] text-zinc-500">
                              Period · {item.period}
                            </p>
                          )}
                          <p className="text-[12px] text-zinc-400">
                            Role · {item.role}
                          </p>
                        </div>

                        {/* 요약 */}
                        <p className="mb-4 text-[13px] leading-relaxed text-zinc-300">
                          {item.summary}
                        </p>

                        {/* 푸터 */}
                        <div className="mt-auto pt-3 border-t border-white/25 flex items-center justify-between text-[12px] text-zinc-400">
                          <span>
                            {item.kind === "freelance"
                              ? "Client work"
                              : item.kind === "proposal"
                                ? "Deck / Proposal"
                                : "Report"}
                          </span>

                          {item.href ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] font-medium text-zinc-200 hover:text-emerald-300"
                            >
                              {item.cta ?? "열어보기"}
                              <span className="translate-y-[1px]">↗</span>
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[12px] text-zinc-500">
                              케이스 스터디 준비중
                            </span>
                          )}
                        </div>

                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STUDIO STATUS */}
          <section className="mt-0 border-t border-white/7 pt-8 md:pt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between w-full max-w-5xl mx-auto">
            <div className="space-y-2">
              <p className="text-xs font-medium text-emerald-400 tracking-[0.25em] uppercase">
                Studio Status
              </p>
              <p className={`${TYPE.statusBody} text-zinc-300`}>
                1:1 파트너십 위주의 소규모 스튜디오입니다. 2025 상반기에는{" "}
                <span className="text-zinc-50">
                  브랜드·웹 리빌딩 / 포트폴리오 정비
                </span>
                에 집중합니다.
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href="mailto:aeneas.studio@example.com"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-2 text-sm font-medium text-zinc-900 hover:bg-emerald-300 transition-colors"
              >
                프로젝트 상의하기
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 transition-colors"
              >
                작업 노트 보기
              </a>
            </div>
          </section>
        </div>




        <footer className="mt-6 border-t border-white/5 pt-6 flex flex-wrap items-center justify-between gap-2 w-full max-w-5xl mx-auto">
          <span className={`${TYPE.footer} text-zinc-500`}>
            © {new Date().getFullYear()} AENEAS Studio. All rights reserved.
          </span>
          <span className={`${TYPE.footer} text-zinc-500`}>
            Based in Seoul · Working remotely.
          </span>
        </footer>
      </main>
    </div>
  );
}
