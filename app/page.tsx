// app/page.tsx
"use client";

import Image from "next/image";
import { useState, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import VisualPanelTabs from "./VisualPanelTabs";
import { MODES, type ModeId } from "./modes";
import ExperienceLabSlider, { type LabItem } from "./components/ExperienceLabSlider";



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
  id: string;
  kicker: string;
  title: string;
  period: string;
  clientType: string;
  tools: string;
  role: string;
  context: React.ReactNode; // ✅ string -> React.ReactNode 로 변경! (태그 허용)
  goal: string[];
  process: { label: string; body: string }[];
  outcome: string;
};

// ───────────────────────
//  프로젝트 텍스트 내용 (Updated: V6.5 Zigzag Refined)
// ───────────────────────
const PROJECT_DETAILS: Record<ProjectId, ProjectDetail> = {
  zigzag: {
    id: "zigzag",
    kicker: "FASHION COMMERCE · UX / BRANDING",
    title: "지그재그 패션 쇼핑몰 런칭",
    period: "2023.03 – 2023.11 (약 10개월)",
    clientType: "Z세대 타깃 패션 쇼핑몰",
    tools: "Photoshop, Illustrator, Figma, HTML/CSS",
    role: "시장 조사 · 스튜디오/모델 섭외 · 촬영 콘셉트 기획 · 상세페이지 구조 설계 및 퍼블리싱",
    // ✅ [수정됨] 문구 간소화 & 하이라이트 적용
    context: (
      <>
        클라이언트는 10대 후반~20대 초반 여성을 타깃으로 했지만,
        기존 상세페이지는 20대 중후반 기준으로 구성되어{" "}
        <span className="bg-[#fff3b0] px-1 py-0.5 rounded-sm font-bold text-black box-decoration-clone">
          톤과 구조 모두 타깃과 어긋난 상태
        </span>
        였습니다. 내부에 브랜딩·기획 리소스가 없어,{" "}
        <span className="bg-[#fff3b0] px-1 py-0.5 rounded-sm font-bold text-black box-decoration-clone">
          시장 조사부터 촬영 시스템·상세 구조까지
        </span>{" "}
        처음부터 판을 새로 짜야 했습니다.
      </>
    ),
    goal: [
      "10대 후반~20대 초반 Z세대에 맞는 브랜드 톤과 촬영 콘셉트를 새로 정의할 것",
      "지그재그 환경에 맞는 상세페이지 구조를 템플릿화해, 촬영·디자인을 반복 제작 가능하게 할 것",
      "상품별 상세 템플릿을 구조화해 전환율과 재구매를 끌어올리고, 동일 인력으로 시즌 제작 물량을 커버할 것",
      "지그재그 랭킹·경쟁사 리서치 기반으로 ‘어디서 차별화할지’ 포지션을 명확히 할 것",
    ],
    process: [
      {
        label: "01 · MARKET SCAN & POSITIONING",
        body: "지그재그 상위 랭킹·리뷰·10대 커뮤니티를 분석해 타깃 인사이트를 정리하고, ‘10대 후반 전용 포지션’ 영역을 정의했습니다.",
      },
      {
        label: "02 · SHOOTING SYSTEM",
        body: "스튜디오와 모델을 직접 섭외하고, 룩 구성·포즈/구도·컷 수를 표준화한 촬영 가이드·체크리스트 패키지를 제작했습니다.",
      },
      {
        label: "03 · TEMPLATE & ROLL-OUT",
        body: "‘핵심 정보 카드 → 전체 실루엣 → 디테일’ 순의 모듈형 상세 템플릿을 HTML/CSS로 구현하고, 운영팀이 복제해 쓸 수 있도록 인수인계했습니다.",
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
    role: "사이트 UI 디자인 · 프로모션 배너 · 퍼블리싱 · SEO 구조 설계 및 운영",
    context: (
      <>
        일본 고객을 대상으로 하는 지마켓 글로벌/라쿠텐 스토어는
        한국식 상세 구조를 그대로 가져와 일본 사용자에게 낯설었습니다.
        게다가 라쿠텐 입점·운영은{" "}
        <span className="bg-[#fff3b0] px-1 py-0.5 rounded-sm font-bold text-black box-decoration-clone">
          기존 사업체가 중도 포기한 상태
        </span>
        였고, 저는 구조를 처음부터 다시 잡는 리빌드 역할을 맡았습니다.{" "}
        <span className="bg-[#fff3b0] px-1 py-0.5 rounded-sm font-bold text-black box-decoration-clone">
          일본 시장 특성과 라쿠텐 UX/SEO 룰
        </span>
        을 먼저 이해한 뒤, 일본 사용자가 편하게 느끼는 정보 구조와
        내부 운영 여건이 동시에 맞는 레이아웃을 설계해야 했습니다.
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
        body: "라쿠텐 상위 스토어의 카테고리 구조·키워드·쿠폰/혜택 노출 방식을 분석해, 우리 상품군과 매칭한 레퍼런스 맵을 만들었습니다.",
      },
      {
        label: "02 · UX & LAYOUT",
        body: "리스트·상세·기획전을 일본 사용자가 익숙한 순서(가격·쿠폰·리뷰·혜택) 기준으로 재배치하고, 공통 레이아웃 가이드를 정의했습니다.",
      },
      {
        label: "03 · SEO & OPERATION",
        body: "카테고리별 필수 키워드 세트를 만들고 타이틀·설명·배너 카피에 반영했습니다. 운영 중에도 검색 리포트를 보며 노출/클릭을 주기적으로 튜닝했습니다.",
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
    role: "브랜드 코어 정의 · 웹 IA/와이어 설계 · 인스타/피드 시각 언어 설계 · 제휴 제안서/리포트 템플릿 제작",
    context: (
      <>
        프로젝트는{" "}  라우트웨이컨설팅 주식회사가 운영하던 사이드 프로젝트{" "}
        RouteWorld에서 시작되었습니다. 뷰티에서 여행, 다시{" "}
        <span className="bg-[#fff3b0] px-1 py-0.5 rounded-sm font-bold text-black box-decoration-clone">
          여행+라이프스타일 커머스
        </span>
        로 사업 축이 바뀌며 톤과 구조가 흔들리는 상황이었습니다.
        저는{" "}
        <span className="bg-[#fff3b0] px-1 py-0.5 rounded-sm font-bold text-black box-decoration-clone">
          계속 바뀌는 구조 위에도 유지되는 브랜드 코어와 운영 시스템
        </span>
        을 설계하고, 어떤 캠페인이 와도 흔들리지 않는 기준선을 만들었습니다.
        사업 종료 과정까지 포함해 브랜드를 핸들링한 경험이
        이 프로젝트의 핵심입니다.
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
        body: "대표·리더 인터뷰와 기존 캠페인/피드를 정리해 ‘무엇을 팔고 싶은지 vs 실제로 팔리고 있는 것’을 분리했습니다. 그 위에 ‘도시에 닿는 가장 빠른 여행’이라는 코어 문장과 호텔·체험·콘텐츠를 잇는 여정 맵을 만들었습니다.",
      },
      {
        label: "02 · SYSTEM & TEAM WORKFLOW",
        body: "캠페인 흐름을 브리핑 → 제작 → 리뷰 3단계로 단순화하고, Notion 태스크보드와 Figma 템플릿으로 역할·산출물을 규격화했습니다. 팀원들이 같은 포맷으로 카드·배너·피드를 만들 수 있는 기준선을 세웠습니다.",
      },
      {
        label: "03 · EXTERNAL COLLAB & POSITIONING",
        body: "호텔/체험 제휴사용 소개 데크와 제안서 템플릿을 제작해, 쇼핑몰 명의나 조건이 바뀌어도 브랜드 설명 구조는 유지되도록 설계했습니다. 외부 파트너와의 커뮤니케이션에서 브랜드 코어·타깃·딜 구조를 한 장표로 설명할 수 있게 정리했습니다.",
      },
    ],
    outcome:
      "뷰티 → 여행 → 여행+라이프스타일로 사업 축이 여러 번 바뀌는 동안에도,\n브랜드 코어 문장과 여정 맵, 제안서·피드 템플릿을 기준으로 캠페인과 제휴사가 바뀌어도 설명 구조를 유지할 수 있었습니다.\n리더·사업자 구성이 바뀌고 결국 RouteWorld 사업이 정리되는 과정까지,\n브랜드 기준선과 산출물 시스템을 문서와 템플릿으로 남겨 이후 AENEAS Studio 포트폴리오 설계의 기반이 되었습니다.",
  },
};



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
      src: "/work/travel/03-feed-concept.png",
      title: "인스타 피드 기획 시리즈",
      caption: "흥미로운 주제로 구성된 피드 기획 시리즈.",
    },
    {
      src: "/work/travel/04-feed-system.jpg",
      title: "브랜드 피드 스타일 정리",
      caption: "피드·슬라이드·배너에 공통 적용한 타이포/레이아웃 규칙.",
    },
    {
      src: "/work/travel/05-feed-system.jpg",
      title: "체험 피드 스타일 정리",
      caption: "체험 피드·슬라이드·배너에 공통 적용한 타이포/레이아웃 규칙.",
    },
    {
      src: "/work/travel/06-feed-system.png",
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

type Accent = "emerald" | "sky" | "amber" | "orange";
type BoardVariant = "wide" | "narrow";

type BoardProps = {
  letters: LetterStone[];
  card: ReactNode;
  variant: BoardVariant;
  accent: Accent;
  active: boolean;
  onClick: () => void;
};


/** ─────────────────────────────────
 * [Updated V4.1] TileBoard - Brightness & Visibility
 * - Default: #1E1E20 (너무 어둡지 않은 차콜 그레이)
 * - Hover: #252528 (확실히 밝아짐) + 강한 Border Glow
 * - Layout: V4.0의 패딩/간격 유지
 * ──────────────────────────────── */
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

  const cardWidthPercent = variant === "narrow" ? 70 : 76;

  const getStyles = (color: Accent) => {
    // ✅ 공통 서브텍스트 스타일 (하단 텍스트: 레귤러 + 투명도 80% + 호버시 화이트)
    const subtitleStyle = "[&>span:last-child]:font-normal [&>span:last-child]:opacity-80 group-hover:[&>span:last-child]:text-white group-hover:[&>span:last-child]:opacity-100 transition-colors duration-300";

    switch (color) {
      case "emerald":
        return {
          activeRing: "ring-2 ring-emerald-400 shadow-[0_0_60px_rgba(52,211,153,0.5)]",
          hoverStyle: "hover:border-emerald-400/80 hover:shadow-[0_20px_50px_-10px_rgba(52,211,153,0.4)]",
          text: "text-emerald-400",
          textGlow: "drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]",
          // ✅ roleText에 subtitleStyle 추가
          roleText: `text-emerald-400/90 ${subtitleStyle}`,
          btnText: "text-emerald-300",
        };
      case "sky":
        return {
          activeRing: "ring-2 ring-sky-400 shadow-[0_0_60px_rgba(56,189,248,0.5)]",
          hoverStyle: "hover:border-sky-400/80 hover:shadow-[0_20px_50px_-10px_rgba(56,189,248,0.4)]",
          text: "text-sky-400",
          textGlow: "drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]",
          roleText: `text-sky-400/90 ${subtitleStyle}`,
          btnText: "text-sky-300",
        };
      case "amber":
        return {
          activeRing: "ring-2 ring-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.5)]",
          hoverStyle: "hover:border-amber-400/80 hover:shadow-[0_20px_50px_-10px_rgba(251,191,36,0.4)]",
          text: "text-amber-400",
          textGlow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]",
          roleText: `text-amber-400/90 ${subtitleStyle}`,
          btnText: "text-amber-200",
        };
      case "orange":
        return {
          activeRing: "ring-2 ring-orange-500 shadow-[0_0_70px_rgba(249,115,22,0.6)]",
          hoverStyle: "hover:border-orange-400/80 hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.4)]",
          text: "text-orange-500",
          textGlow: "drop-shadow-[0_0_10px_rgba(249,115,22,0.9)]",
          roleText: `text-orange-400/90 ${subtitleStyle}`,
          btnText: "text-orange-200",
        };
    }
  };

  const s = getStyles(accent);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full cursor-pointer rounded-[24px] 
        border border-white/15 px-10 py-16  // ✅ 기본 보더도 조금 더 잘 보이게 (10% -> 15%)
        shadow-[0_22px_60px_rgba(0,0,0,0.6)]
        transition-all duration-300 ease-out // 반응 속도 약간 빠르게 (500 -> 300)
        z-0 hover:z-10
        ${active
          ? `${s.activeRing} scale-[1.01] bg-[#121212]` // Active: 가장 어둡고 깊게
          : `bg-[#1E1E20] hover:bg-[#252528] hover:-translate-y-2 ${s.hoverStyle}` // ✅ Default: #1E1E20 (밝음) -> Hover: #252528 (더 밝음)
        }`}
    >
      {/* 배경 노이즈 레이어 */}
      <div className="absolute inset-0 rounded-[24px] overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative h-full w-full z-10">
        {/* Grid Gap */}
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

              // ⬛️ [Keycap] 흑돌
              if (char) {
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-center aspect-square rounded-[8px]
                      border border-white/20
                      bg-gradient-to-br from-[#404045] to-[#222222] // ✅ 흑돌 그라데이션도 한 톤 Up
                      
                      text-[16px] md:text-[18px] font-bold tracking-widest
                      
                      ${active
                        ? `${s.text} ${s.textGlow}`
                        : "text-zinc-50 group-hover:text-white" // ✅ 기본 텍스트도 더 밝은 zinc-50
                      }
                      
                      shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.35)]
                      transition-all duration-300
                      group-hover:-translate-y-[1px] group-hover:shadow-[0_6px_12px_rgba(0,0,0,0.7)]`}
                  >
                    {char}
                  </div>
                );
              }

              // ⬜️ [Keycap] 백돌 (세라믹 화이트)
              return (
                <div
                  key={key}
                  className="aspect-square rounded-[8px]
                    /* ✅ 백돌 밝기 유지 (충분히 밝음) */
                    bg-[radial-gradient(130%_130%_at_30%_20%,#e4e4e7_0%,#a1a1aa_50%,#52525b_100%)]
                    opacity-[0.9] group-hover:opacity-[1]
                    border border-white/30
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_3px_6px_rgba(0,0,0,0.8)]
                    transition-opacity duration-500"
                />
              );
            })
          )}
        </div>

        {/* 🔘 [Label Card] */}
        <div
          className="pointer-events-none absolute left-1/2 bottom-8 -translate-x-1/2 z-20"
          style={{ width: `${cardWidthPercent}%` }}
        >
          <div
            className={`pointer-events-auto flex items-center justify-between
              rounded-[14px] 
              bg-black/45 border border-white/35 backdrop-blur-sm 
              px-6 py-4
              shadow-[0_8px_32px_rgba(0,0,0,0.5)]
              transition-all duration-300
              hover:bg-black/60 hover:border-white/30 cursor-pointer`}
          >
            <div className="text-left leading-tight">
              {/* ✅ flex-col gap-1: 상하 간격
                 ✅ font-semibold: 기본(상단) 텍스트 굵기
                 ✅ ${s.roleText}: 여기서 하단 텍스트(Regular, Opacity)와 호버 효과(White)를 제어함
              */}
              <div className={`flex flex-col gap-1 tracking-widest uppercase
                font-semibold
                text-[13px] sm:text-[14px]
                drop-shadow-md`}
              >
                {card}
              </div>
            </div>

            <span className={`ml-4 hidden sm:inline-flex items-center 
              text-[11px] font-bold tracking-[0.2em] uppercase transition-colors 
              
              bg-white/20 border border-white/30
              px-4 py-2 rounded-[8px] 
              shadow-sm backdrop-blur
              group-hover:bg-white/10 group-hover:border-white/60 text-white`}
            >
              OPEN ↗
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
  const router = useRouter();

  // ── 기계 전원 상태 ─────────────────
  const [powerOn, setPowerOn] = useState(false);

  // ── 모드 / 프로젝트 상태 ─────────────
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

  // ───────────────────────────────────────────────
  // DETAIL CARD – main tone (#4C9990) unified
  // ───────────────────────────────────────────────

  const MAIN_ACCENT = "#4C9990";
  const MAIN_RGB = "76,153,144";

  // ✅ 페이퍼(패널) 베이스는 항상 동일한 다크 그레이
  const DETAIL_BASE_BG = "from-[#171717] via-[#0B0B0B]/98 to-black";

  // ✅ 외곽/상단에만 얹는 하이라이트(톤다운 메인)
  const detailAccentClass = `from-[${MAIN_ACCENT}]/18 via-[${MAIN_ACCENT}]/4`;

  // ✅ 내부 페이퍼(실제 카드 바탕) – 중립 다크 고정 + 상단만 메인 기운
  const detailInnerBgClass = `from-[${MAIN_ACCENT}]/10 ${DETAIL_BASE_BG}`;

  // ✅ 타이틀 톤(메인 계열로만 살짝)
  const detailTitleColorClass = "text-[#CDEBE7]";

  // ✅ 토글/버튼 톤(메인 계열로만) 
  const detailToggleAccentClass = `border-[${MAIN_ACCENT}]/70 text-[#CDEBE7] hover:bg-[${MAIN_ACCENT}]/8`;


  // 비주얼 뷰용 산출물
  const currentVisuals = activeProject
    ? PROJECT_VISUALS[activeProject]
    : [];

  /** ─────────────────────────────────
   *  Studio Lab / Proposals Data
   *  ──────────────────────────────── */


  const LAB_ITEMS: LabItem[] = [
    {
      id: "global-vcc",
      kind: "freelance",
      badge: "FREELANCE · WEB",
      title: "Global VCC · 화상 영어 플랫폼 리뉴얼",
      lead: "비교→선택→신청을 한 화면에서 끝내는 3단 흐름.",
      period: "2024 (약 2개월)",
      role: "IA · UX/UI · 퍼블리싱",
      beforeImg: "lab/globalvcc_before.png",
      afterImg: "lab/globalvcc_after.png",
      problem: ["선택 기준 분산", "신청 단계 이탈"],
      solution: ["3단 플로우 통합", "견적/옵션을 플로우에 결합"],
      impact: ["결정 속도 개선", "모바일 상태 피드백 정돈"],
      keyNotes: ["항목 고정", "이탈 포인트 제거", "상태 피드백 정리"],
      conclusion: ["복잡함을 ‘선택 순서’로 바꿔 전환을 만든 리빌딩."],
      href: "https://tiffanyblue-iam.github.io/Project-VCC-website/",
      cta: "사이트 보기",
    },
    {
      id: "lawdidim",
      kind: "freelance",
      badge: "FREELANCE · WEB",
      title: "LawDidim · 회생·파산 랜딩",
      lead: "불안 사용자에게 ‘최소 정보 → 즉시 행동’ 구조.",
      period: "2024 (약 1.5개월)",
      role: "UX · 디자인 · 카피",
      beforeImg: "lab/lawdidim_before.png",
      afterImg: "lab/lawdidim_after.png",
      problem: ["정보 부족으로 인한 이탈", "상담 연결 부재"],
      solution: ["핵심 안내 우선 배치", "상담 연결 추가"],
      impact: ["문의 허들 감소", "상담 연결 부재"],
      keyNotes: ["판단 문장", "상담 연결", "CTA 반복"],
      conclusion: ["‘안심’이 먼저 보이게 만든 상담 퍼널."],
      href: "https://www.lawdidim.com/",
      cta: "사이트 보기",
    },
    {
      id: "mare-design",
      kind: "freelance",
      badge: "PERSONAL · FRAMER",
      title: "Mare Design · Portfolio Hub",
      lead: "Framer 기반의 소규모 브랜드·개인 사업자를 위한 빠르게 만들고 바로 쓰는 포트폴리오 허브",
      period: "2025 (Personal)",
      role: "기획 · 구조 설계 · UI · Framer 구현",
      afterImg: "lab/mare_design.png", // ✅ 너가 캡쳐해서 넣을 파일
      problem: ["지금 보여줄 수 있는 정리된 페이지가 없음, 개인 브랜드 표현 일관성", "지금 보여줄 수 있는 정리된 페이지가 없음"],
      solution: ["Framer 기반 단일 페이지로 정보 통합", "텍스트·이미지 교체만으로 즉시 수정 가능", "브랜드 톤을 해치지 않는 최소 UI 설계"],
      impact: ["처음 보는 사람도 한눈에 이해하는 구조", "제안·미팅 시 바로 공유 가능한 링크 확보", "운영 중에도 직접 수정 가능한 포트폴리오 완성"],
      keyNotes: ["컴포넌트 기반", "시각적 위계", "빠른 iteration"],
      conclusion: ["정신없는 작업 기록’을 ‘검증 가능한 포트폴리오’로 정리한 사이트."],
      href: "https://mare-design.framer.website/",
      cta: "사이트 보기",
    },
    {
      id: "josun-routeworld",
      kind: "proposal",
      badge: "PROPOSAL · DECK",
      title: "Josun Palace × Routeworld · 공동구매 제안서",
      lead: "비수기 재고를 ‘폐쇄형 랜딩 + 공동구매’로 전환.",
      period: "2023 (약 1주)",
      role: "구조 설계 · 슬라이드",
      afterImg: "lab/routeworld_josun-palace.png",
      problem: ["비수기 재고 압박", "프리미엄 톤 유지 필요"],
      solution: ["폐쇄형 랜딩 + 단순 퍼널", "혜택을 ‘이유있는 할인’로 정리"],
      impact: ["ADR 관점 방어", "실행 플로우 명확화"],
      keyNotes: ["유입→전환 단순화", "톤 유지", "운영 리스크 고려"],
      conclusion: ["‘브랜드 유지’와 ‘판매 전환’을 같이 잡는 구조."],
      href: "/lab/routeworld_josun-palace.pdf",
      cta: "PDF 제안서 열기",
    },
  ];





  // ★ 패널 공통 배경 (전원 ON/OFF 공통으로 쓰는 다크 그레이)
  const SHELL_BASE_BG =
    "radial-gradient(circle at 50% 120%, #111111ff 0%, #111111ff 40%, #000000 100%)";

  // ★ 전원 ON일 때만 위에 얹을 오로라 레이어
  const SHELL_AURORA_ON = [
    "radial-gradient(circle at 15% -20%, rgba(16,185,129,0.46), transparent 55%)",
    "radial-gradient(circle at 85% -10%, rgba(52,211,153,0.28), transparent 60%)",
  ].join(", ");

  // ───────────────── CONSTELLATION AURORA BG ─────────────────
  const CONSTELLATION_AURORA_ON = [
    // 상단 좌측 – 부드러운 민트
    "radial-gradient(circle at 8% -18%, rgba(110, 231, 183, 0.25), transparent 35%)",

    // 상단 중앙 – 은은한 시안/블루
    "radial-gradient(circle at 50% -22%, rgba(56, 189, 248, 0.25), transparent 45%)",

    // 상단 우측 – 살짝 퍼플
    "radial-gradient(circle at 92% -10%, rgba(167, 139, 250, 0.26), transparent 45%)",

    // 하단 좌측 – 따뜻한 에메랄드 꼬리
    "radial-gradient(circle at 15% 115%, rgba(34, 197, 94, 0.22), transparent 45%)",

    // 하단 중앙 – 핑크빛 오로라
    "radial-gradient(circle at 50% 120%, rgba(244, 114, 182, 0.20), transparent 50%)",

    // 하단 우측 – 딥 퍼플/블루로 마무리
    "radial-gradient(circle at 85% 118%, rgba(30, 64, 175, 0.35), transparent 45%)",
  ].join(", ");

  const CONSTELLATION_AURORA_OFF =
    "linear-gradient(180deg, #111111ff 0%, #0e0e0eff 40%, #000000 100%)";

  // ───────────────── SCROLL LOCK ─────────────────
  useEffect(() => {
    if (activeProjectDetail) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProjectDetail]);


  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#050505] text-zinc-50 transition-colors duration-1000">

      {/* ▼▼▼ [수정됨] 배경 레이어: 붉은기/탁함 완전 제거 -> '아이스 블루 & 크리스탈 화이트' ▼▼▼ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

        {/* 1. 기본 베이스: 깊은 어둠 */}
        <div className="absolute inset-0 bg-[#000000]" />

        {/* 2. 전원 ON: Crystal Cool Light */}
        <div
          className="absolute inset-0 transition-all duration-[2000ms] ease-in-out"
          style={{
            opacity: powerOn ? 1 : 0,
            transform: powerOn ? "scale(1)" : "scale(1.1)",
            filter: "blur(30px)",              // 블러를 약간 줄여서(140->100) 빛을 좀 더 선명하게 모음
            mixBlendMode: "screen",             // 스크린 모드: 쿨톤이 더 쨍하게 먹힘
            background: `
              /* 1. 좌측 상단 코어: '아이스 블루 화이트' (Ice Blue White)
                 - R200 G240 B255 -> 파란색 값을 높여서 붉은/갈색 느낌을 물리적으로 차단
                 - Opacity를 0.3까지 올려서 '회색'이 아니라 '빛'으로 보이게 함 */
              radial-gradient(at 15% 15%, rgba(222, 237, 255, 0.3) 0px, transparent 35%),
              
              /* 1-1. 좌측 하이라이트: '창백한 시안' (Pale Cyan) 
                 - 중심부에 차가운 냉기를 더함 */
              radial-gradient(at 5% 10%, rgba(224, 255, 255, 0.25) 0px, transparent 45%),

              /* 2. 우측 상단: '쿨 민트' (Cool Mint) - 기존보다 노란기를 빼고 청록쪽으로 이동 */
              radial-gradient(at 90% 15%, rgba(72, 247, 223, 0.18) 0px, transparent 40%),
              
              /* 3. 중앙: 완전한 어둠 (유지) */
              radial-gradient(at 50% 50%, rgba(0, 0, 0, 0) 0px, transparent 100%)
            `
          }}
        />

        {/* 3. Vignette: 가장자리는 어둡게 */}
        <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_120%)] transition-opacity duration-1000 ${powerOn ? 'opacity-70' : 'opacity-100'}`} />

        {/* 4. Texture: 노이즈 질감 */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
      </div >


      {/* 북극성 & 북두칠성 – 장식 레이어 */}
      <div className="north-star" aria-hidden="true" />

      {/* 여기에 big-dipper 추가 */}
      <div className="big-dipper" aria-hidden="true">
        <span className="big-dipper-star s1" />
        <span className="big-dipper-star s2" />
        <span className="big-dipper-star s3" />
        <span className="big-dipper-star s4" />
        <span className="big-dipper-star s5" />
        <span className="big-dipper-star s6" />
        <span className="big-dipper-star s7" />
      </div>

      {/* 1. 페이지 전체를 감싸는 레이아웃 래퍼 */}
      <div className="relative min-h-screen overflow-hidden">
        {/* 1-1. 그린 오로라 – powerOn 일 때만 켜짐 */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-700"
          style={{
            opacity: powerOn ? 1 : 0, // OFF일 땐 완전 꺼짐
            background: [
              // 네온 민트 – 조금 더 강하게 & 한 번 더 추가
              "radial-gradient(circle at 40% -15%, rgba(22,140,126,0.65) 0%, transparent 55%)",
              "radial-gradient(circle at 80% -20%, rgba(127,234,212,0.45) 0%, transparent 65%)",
              "radial-gradient(circle at 50% 110%, rgba(16,185,129,0.55) 0%, transparent 60%)",
            ].join(", "),
            mixBlendMode: "screen",
            filter: "blur(12px)", // 조금 더 퍼뜨리기
          }}
        />

        {/* 2. 실제 컨텐츠 */}
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
                <span className="mb-1 text-[22px] font-medium tracking-[0.28em] text-zinc-500">
                  Studio
                </span>
              </div>

              <h1 className="max-w-5xl text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
                <span>Brands that walk through the desert</span>
                <br className="hidden md:block" />
                <span
                  className="inline-block mt-2"
                  style={{
                    color: powerOn ? "#bbf7d0" : "#e5e7eb", // ON일 때만 연두빛
                    textShadow: powerOn
                      ? "0 0 24px rgba(74,222,128,1), 0 0 80px rgba(22,163,74,0.9)"
                      : "0 0 6px rgba(15,23,42,0.9)",       // OFF일 땐 거의 안 보이는 그림자
                    transform: powerOn ? "translateY(0)" : "translateY(3px)",
                    transition:
                      "color 500ms ease, text-shadow 700ms ease, transform 500ms ease",
                  }}
                >
                  into their next green place.
                </span>
              </h1>

              <p className={`max-w-4xl text-zinc-300 ${TYPE.heroBody}`}>
                <span className="text-zinc-50">명확한 이야기, 선명한 UX,</span>{" "}
                그리고<br />
                <span className="text-zinc-50">런칭 플랜</span>이 필요한
                브랜드를 위한 Aeneas Studio.{" "}<br />사막을 건너 다음 그린 플레이스에 도착할 때까지 함께
                걷습니다.
              </p>

              <div className="flex flex-wrap gap-3 text-zinc-200">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 ${TYPE.chip}`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Web Design
                </span>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 ${TYPE.chip}`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  UX/UI
                </span>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 ${TYPE.chip}`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Brand Systems
                </span>
              </div>


              <p
                className={`${TYPE.sectionKicker} tracking-[0.28em] text-zinc-300`}
                style={{
                  fontFamily:
                    '"Subway Ticker Grid", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: "clamp(11px, 2.1vw, 12px)",
                  lineHeight: 2.2,
                  color: "#ff6060ff",
                  textShadow: "0 0 14px rgba(222, 91, 74, 1)"
                }}
              >
                Figma, Framer, Webflow <br />
                UX/UI Design & Prototyping <br />
                Brand Identity & Visual System <br />
                HTML/CSS/JavaScript (Hands-on)
              </p>

            </header>

            {/* 2) DEVICE SHELL : CONSTELLATION + VISUAL PANEL */}
            <section className="mt-36">
              {/* ▶ 패널 기준으로 절대좌표 잡는 래퍼 */}
              <div className="relative max-w-5xl mx-auto">

                {/* ── POWER BUTTON (위치 고정) ───────────────── */}
                <button
                  type="button"
                  aria-pressed={powerOn}
                  onClick={() => setPowerOn(prev => !prev)}
                  className="group absolute flex items-center justify-center rounded-full"
                  style={{
                    // 예전처럼 패널 모서리에 딱 붙게
                    right: 32,          // 패널 오른쪽에서 살짝 안쪽
                    top: -40,           // 패널 위로 살짝 튀어나오게
                    width: 81,
                    height: 81,
                    backgroundColor: "#0b0b0b",
                    boxShadow:
                      "0 10px 22px rgba(0,0,0,0.9), inset 0 1px 2px rgba(255,255,255,0.15)",
                  }}
                >
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 72,
                      height: 72,
                      background:
                        "radial-gradient(circle at 30% 20%, #3a3a3a 0, #161616 55%, #050505 100%)",
                      border: "4px solid #171717",
                      boxShadow:
                        "inset 1px 1px 2px rgba(255,255,255,0.4), 0 0 0 2px rgba(255,255,255,0.1)",
                    }}
                  >
                    {/* 파워 아이콘 */}
                    <span className="relative inline-block h-8 w-8">
                      {/* 동그란 링 */}
                      <span
                        className="block h-full w-full rounded-full border-[4px]"
                        style={{
                          borderColor: powerOn ? "#E5F9F0" : "#555555",
                          boxShadow: powerOn
                            ? "0 0 10px rgba(150,255,210,0.85)"
                            : "none",
                        }}
                      />
                      {/* 위쪽 막대 */}
                      <span
                        className="absolute left-1/2 -translate-x-1/2 -top-[5px] h-4 w-[4px] rounded-full"
                        style={{
                          backgroundColor: powerOn ? "#E5F9F0" : "#555555",
                          boxShadow: powerOn
                            ? "0 0 8px rgba(150,255,210,0.85)"
                            : "none",
                        }}
                      />
                    </span>
                  </span>
                </button>

                {/* ── PRESS 캡슐 (전원 바로 위, 항상 둥둥 / OFF 에만 표시) ───────── */}
                {!powerOn && (
                  <motion.div
                    initial={{ opacity: 1, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute flex items-center justify-center rounded-full px-5 py-1.5"
                    style={{
                      right: 26,         // 버튼과 같은 x축 정렬
                      top: -100,          // 버튼 위로 띄우기
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(15,23,42,0.9) 0, rgba(15,23,42,0.7) 60%, transparent 100%)",
                      boxShadow:
                        "0 0 42px rgba(56,189,248,0.85), 0 0 0 3px rgba(15,23,42,0.7)",
                    }}
                  >
                    <span className="text-[12px] font-semibold tracking-[0.32em] text-cyan-90 uppercase">
                      PRESS
                    </span>
                    {/* 아래로 향하는 작은 삼각형 */}
                    <span
                      className="absolute left-1/2 translate-x-[-50%]"
                      style={{
                        bottom: -8,
                        width: 0,
                        height: 0,
                        borderLeft: "6px solid transparent",
                        borderRight: "6px solid transparent",
                        borderTop: "8px solid #f97373", // 살짝 네온 레드
                        filter: "drop-shadow(0 0 6px rgba(248,113,113,0.9))",
                      }}
                    />
                  </motion.div>
                )}

                {/* 2. 실제 기계 프레임 – overflow-hidden 유지 */}
                {/* ▼▼▼ [수정 2] 기계 패널: 오로라 대신 '흑돌(Black Stone)' 그라데이션 적용 ▼▼▼ */}
                <div
                  className="rounded-[28px] overflow-hidden border transition-all duration-700"
                  style={{
                    // ✅ Power ON: 흑돌 그라데이션 (Selected Works 느낌)
                    // ✅ Power OFF: 기존의 어두운 메탈 느낌
                    background: powerOn
                      ? "linear-gradient(145deg, #1E1E20 0%, #0a0a0a 100%)"
                      : CONSTELLATION_AURORA_OFF,

                    borderColor: powerOn ? "#333333" : "#171717",

                    boxShadow: powerOn
                      ? "0 0 60px -10px rgba(50,255,150,0.1), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 40px rgba(0,0,0,0.8)" // 켜졌을 때: 미세한 그린 글로우 + 깊은 내부 그림자
                      : "0 32px 80px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -18px 40px rgba(0,0,0,0.9)",
                  }}
                >

                  {/* 상단 : CONSTELLATION MAP 영역 */}
                  <div className="px-4 py-6 md:px-10 md:pt-8 md:pb-6">
                    <section className="mt-4 md:mt-10">
                      {/* 바깥 프레임 */}
                      <div
                        className="relative rounded-[20px] overflow-hidden transition-colors duration-500"
                        style={{
                          // ✅ 켜졌을 때 내부 프레임도 살짝 더 밝은 차콜로 변경하여 입체감 줌
                          backgroundColor: powerOn ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.32)",
                          border: "1px solid rgba(120,120,120,0.6)",
                          boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.1), 0 0 0 1px rgba(0,0,0,0.8)",
                        }}
                      >
                        {/* 안쪽 살짝 들어간 프레임 */}
                        <div
                          className="m-3 md:m-4 rounded-[16px] px-4 py-6 md:px-8 md:py-8"
                          style={{
                            backgroundColor: "rgba(0,0,0,0.55)",
                            boxShadow:
                              "-4px -4px 12px rgba(255,255,255,0.05), 0 0 0 0.5px rgba(0,0,0,0.85)",
                          }}
                        >
                          {/* 헤더 */}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 mb-5 md:mb-7">
                            <div className="space-y-1">
                              <p
                                className={`${TYPE.sectionKicker} tracking-[0.28em] text-zinc-300`}
                                style={{
                                  fontFamily:
                                    '"Subway Ticker Grid", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                  fontSize: "clamp(11px, 2.1vw, 15px)",
                                  lineHeight: 1.1,
                                  color: "#B0B0B0",
                                }}
                              >
                                AENEAS CONSTELLATION
                              </p>
                              <p className={`${TYPE.sectionBody} text-zinc-500`}>
                                사막에서 그린 플레이스로 향하는 세 가지 별자리 모드입니다.
                              </p>
                            </div>
                            <span className="self-start md:self-auto rounded-full border border-zinc-200/35 px-3 py-1 text-[11px] tracking-[0.18em] text-zinc-200">
                              MODES · 03
                            </span>
                          </div>

                          {/* 라인 + 점 */}
                          <div className="mt-6">
                            <div className="relative h-14 px-[6%]">
                              {/* ─ 라인 ─ */}
                              <div
                                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] transition-all duration-700"
                                style={{
                                  background: powerOn
                                    ? "linear-gradient(90deg, rgba(56,189,248,0) 0%, rgba(148,163,184,0.4) 15%, rgba(148,163,184,0.9) 50%, rgba(148,163,184,0.4) 85%, rgba(56,189,248,0) 100%)"
                                    : "linear-gradient(90deg, transparent, rgba(101, 104, 110, 0.9), transparent)",
                                  boxShadow: powerOn
                                    ? "0 0 20px rgba(52,211,153,0.55)"
                                    : "0 0 0 rgba(0,0,0,0)",
                                }}
                              />

                              {/* ─ 노드들 ─ */}
                              <div className="relative z-10 flex h-full items-center justify-between">

                                {/* 01 BRAND CORE 노드 */}
                                <div
                                  className="relative h-5 w-5 rounded-full border-[3px] transition-all duration-700"
                                  style={{
                                    background: powerOn
                                      ? "radial-gradient(circle, #6ee7b7 0%, #22c55e 55%, #022c22 100%)"
                                      : "#020617",
                                    borderColor: powerOn
                                      ? "rgba(74,222,128,1)"            // ON일 때 밝은 네온 보더
                                      : "rgba(45, 54, 75, 0.9)",           // OFF일 때 거의 라인색과 비슷한 어두운 보더
                                    boxShadow: powerOn
                                      ? "0 0 0 1px rgba(15,23,42,1), 0 0 18px rgba(52,211,153,1)"
                                      : "0 0 0 1px rgba(15,23,42,0.9)", // OFF일 땐 살짝만 림
                                  }}
                                />

                                {/* 02 WEB EXPERIENCE 노드 */}
                                <div
                                  className="relative h-5 w-5 rounded-full border-[3px] transition-all duration-700"
                                  style={{
                                    background: powerOn
                                      ? "radial-gradient(circle, #bfdbfe 0%, #3b82f6 55%, #0b1120 100%)"
                                      : "#020617",
                                    borderColor: powerOn
                                      ? "rgba(59,130,246,1)"
                                      : "rgba(45, 54, 75, 0.9)",
                                    boxShadow: powerOn
                                      ? "0 0 0 1px rgba(15,23,42,1), 0 0 18px rgba(59,130,246,1)"
                                      : "0 0 0 1px rgba(15,23,42,0.9)",
                                  }}
                                />

                                {/* 03 VISUAL SYSTEMS 노드 */}
                                <div
                                  className="relative h-5 w-5 rounded-full border-[3px] transition-all duration-700"
                                  style={{
                                    background: powerOn
                                      ? "radial-gradient(circle, #facc15 0%, #eab308 55%, #422006 100%)"
                                      : "#020617",
                                    borderColor: powerOn
                                      ? "rgba(250,204,21,1)"
                                      : "rgba(45, 54, 75, 0.9)",
                                    boxShadow: powerOn
                                      ? "0 0 0 1px rgba(15,23,42,1), 0 0 18px rgba(250,204,21,1)"
                                      : "0 0 0 1px rgba(15,23,42,0.9)",
                                  }}
                                />
                              </div>
                            </div>


                            {/* 모드 카드 3개 – 모바일: 1열, 데스크톱: 3열 */}
                            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                              {/* BRAND CORE */}
                              <button
                                type="button"
                                onClick={() => setActiveMode("brand")}
                                className="text-left rounded-[16px] px-5 py-4 border transition-all"
                                style={
                                  activeMode === "brand"
                                    ? powerOn
                                      ? {
                                        // ON + 선택됨
                                        backgroundColor: "#171717",
                                        borderColor: "#7FEAD4",
                                        boxShadow: "0 0 26px rgba(127,234,212,0.6)",
                                      }
                                      : {
                                        // OFF + 선택됨 (색은 죽이되 살짝만 강조)
                                        backgroundColor: "#171717",
                                        borderColor: "#3F3F46",
                                        boxShadow: "0 0 12px rgba(15,23,42,0.9)",
                                      }
                                    : {
                                      // 미선택 공통
                                      backgroundColor: "rgba(0,0,0,0.35)",
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

                                </p>
                              </button>

                              {/* WEB EXPERIENCE */}
                              <button
                                type="button"
                                onClick={() => setActiveMode("web")}
                                className="text-left rounded-[16px] px-5 py-4 border transition-all"
                                style={
                                  activeMode === "web"
                                    ? powerOn
                                      ? {
                                        backgroundColor: "#171717",
                                        borderColor: "#7EC8FF",
                                        boxShadow: "0 0 26px rgba(126,200,255,0.6)",
                                      }
                                      : {
                                        backgroundColor: "#171717",
                                        borderColor: "#3F3F46",
                                        boxShadow: "0 0 12px rgba(15,23,42,0.9)",
                                      }
                                    : {
                                      backgroundColor: "rgba(0,0,0,0.35)",
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

                                </p>
                              </button>

                              {/* VISUAL SYSTEMS */}
                              <button
                                type="button"
                                onClick={() => setActiveMode("visual")}
                                className="text-left rounded-[16px] px-5 py-4 border transition-all"
                                style={
                                  activeMode === "visual"
                                    ? powerOn
                                      ? {
                                        backgroundColor: "#171717",
                                        borderColor: "#F9E08A",
                                        boxShadow: "0 0 26px rgba(249,224,138,0.6)",
                                      }
                                      : {
                                        backgroundColor: "#171717",
                                        borderColor: "#3F3F46",
                                        boxShadow: "0 0 12px rgba(15,23,42,0.9)",
                                      }
                                    : {
                                      backgroundColor: "rgba(0,0,0,0.35)",
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

                                </p>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>


                  {/* ── MACHINE STRIP ───────────────── */}
                  <div className="px-4 md:px-10 my-6 md:my-10">
                    <div
                      className="
                        relative flex flex-col sm:flex-row
                        items-stretch sm:items-center
                        justify-between
                        rounded-[16px]
                        px-4 sm:px-8
                        py-3 sm:py-0
                        min-w-0 overflow-hidden
                        sm:h-14
                      "
                      style={{
                        background: [
                          "linear-gradient(90deg, #191919 0%, #272727 16%, #313131ff 32%, #0B0B0B 92%)",
                          "radial-gradient(circle at 50% 120%, rgba(18,18,20,0.96) 0%, rgba(12,12,14,0.96) 55%, rgba(0,0,0,0.98) 100%)",
                        ].join(", "),
                        border: "5px solid #171717",
                        boxShadow: [
                          "inset -1px -1px 4px rgba(0,0,0,0.25)",
                          "inset 0 1px 4px -1px rgba(255,255,255,0.25)",
                          "0 0 0 1.5px rgba(255,255,255,0.1)",
                        ].join(", "),
                      }}
                    >
                      {/* 왼쪽: 세로 슬롯들 */}
                      <div className="flex-1 min-w-0 flex gap-[5px] overflow-hidden">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <span
                            key={i}
                            className={`${i >= 18 ? "hidden sm:block" : "block"} rounded-full`}
                            style={{
                              width: 6,
                              height: 26,
                              backgroundColor: "#1f1f22",
                              boxShadow:
                                "inset 0 1px 4px rgba(0,0,0,0.35), 0 1px 4px rgba(255,255,255,0.08)",
                            }}
                          />
                        ))}
                      </div>

                      {/* 오른쪽: 상태 캡슐 */}
                      <div
                        className="
                          mt-3 sm:mt-0 sm:ml-6
                          flex items-center justify-center
                          rounded-[10px]
                          w-full sm:w-[144px] max-w-[200px]
                          h-7
                          mx-auto sm:mx-0
                          shrink-0
                        "
                        style={{
                          background:
                            "linear-gradient(100deg, #2A2A2A 0%, #121212 60%, #050505 100%)",
                          boxShadow:
                            "inset 0 1px 3px rgba(255,255,255,0.22), 0 0 0 1px rgba(255,255,255,0.4)",
                        }}
                      >
                        <span
                          className="mr-3 block rounded-full"
                          style={{
                            width: 6,
                            height: 26,
                            backgroundColor: powerOn ? "#E9F3FF" : "#9FA3B2",
                            boxShadow: powerOn
                              ? "0 0 14px rgba(190,220,255,1)"
                              : "0 0 6px rgba(120,130,160,0.6)",
                          }}
                        />
                        <span className="w-[90px] text-center text-[11px] uppercase tracking-[0.3em] text-zinc-300 font-[SubwayTickerGrid]">
                          {powerOn ? "ONLINE" : "STANDBY"}
                        </span>
                      </div>
                    </div>
                  </div>


                  {/* VISUAL PANEL */}
                  <div className="mt-16">
                    <VisualPanelTabs
                      activeMode={activeMode}
                      onChangeMode={setActiveMode}
                      powerOn={powerOn}
                    />
                  </div>
                </div>
              </div>
            </section >

            {/* 3) SELECTED WORK SECTION - [Updated Layout 2x2] */}
            <section className="full-bleed mt-30 border-t border-white/7 pt-10">

              <header className="mb-14 text-center space-y-4 max-w-5xl mx-auto">
                <span className="inline-block px-5 py-2 rounded-full bg-zinc-50 text-black text-[14px] font-bold tracking-widest uppercase">
                  System Archives
                </span>
                <h2 className="text-[36px] md:text-[68px] font-bold leading-tight tracking-tight text-zinc-100">
                  SELECTED WORKS
                </h2>
                <p className="mx-auto max-w-2xl text-[20px] text-zinc-400 leading-relaxed">
                  프로젝트의 설계 구조를 확인하려면 키보드를 눌러 접속하세요.
                </p>
              </header>

              {/* ▼▼▼ 바둑판 영역 (The Machine Panel) */}
              <div
                className={`
              mt-10 relative left-1/2 right-1/2
              -ml-[50vw] -mr-[50vw]
              transition-all duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
              ${activeProjectDetail ? "blur-[2px] opacity-40 scale-[0.98]" : "opacity-100 scale-100"}
            `}
              >
                <div className="w-screen px-4 md:px-10 lg:px-16 overflow-x-hidden">
                  <div className="max-w-[1400px] mx-auto">

                    {/* ✅ [V5.3 The Machine Panel] 활성 시 날카롭게 빛나는 엣지 */}
                    <div
                      className={`
                    rounded-[40px] 
                    border transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] relative overflow-hidden
                    
                    ${activeProjectDetail
                          // ▶ Power On 상태:
                          // 1. border-white/30: 테두리가 더 밝고 날카로워짐
                          // 2. bg-black/80: 패널이 더 어두워지며 컨텐츠 집중
                          // 3. shadow: 바깥쪽으로 퍼지는 미세한 쿨톤 글로우 + 안쪽 상단의 날카로운 림 라이트(inset)
                          // 4. scale-[1.02]: 아주 살짝 앞으로 튀어나옴
                          ? "border-white/30 bg-black/80 shadow-[0_0_60px_-15px_rgba(120,140,255,0.1),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-xl scale-[1.02]"

                          // ▶ Default 상태:
                          // 은은한 테두리와 묵직한 기본 그림자
                          : "border-white/5 bg-white/[0.02] shadow-2xl backdrop-blur-sm scale-100"
                        }
                    px-6 md:px-12 py-16 md:py-24 
                  `}
                    >
                      {/* (옵션) 활성 시 패널 표면을 타고 흐르는 미세한 빛 반사 */}
                      <div className={`absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent pointer-events-none rounded-[40px] transition-opacity duration-700 ${activeProjectDetail ? 'opacity-100' : 'opacity-0'}`} />

                      <div className="relative z-10 grid gap-10 lg:gap-14 md:grid-cols-2">

                        {/* 1. DETAIL POSITIONING (Orange) */}
                        <TileBoard
                          letters={[
                            { row: 1, col: 2, char: "D" },
                            { row: 1, col: 3, char: "E" },
                            { row: 1, col: 4, char: "T" },
                            { row: 1, col: 5, char: "A" },
                            { row: 1, col: 6, char: "I" },
                            { row: 1, col: 7, char: "L" },
                          ]}
                          variant="wide"
                          accent="orange"
                          active={false}
                          onClick={() => window.location.href = "/work/detail-positioning"}
                          card={
                            <>
                              <span className={`${TYPE.projectKicker} text-orange-500`}>
                                STRATEGIC UX
                              </span>
                              <span className={`font-light opacity-90`}>
                                REPOSITIONING
                              </span>
                            </>
                          }
                        />

                        {/* 2. ZIGZAG (Emerald) */}
                        <TileBoard
                          letters={[
                            { row: 1, col: 2, char: "Z" },
                            { row: 1, col: 3, char: "I" },
                            { row: 1, col: 4, char: "G" },
                            { row: 1, col: 5, char: "Z" },
                            { row: 1, col: 6, char: "A" },
                            { row: 1, col: 7, char: "G" },
                          ]}
                          variant="wide"
                          accent="emerald"
                          active={activeProject === "zigzag"}
                          onClick={() => setActiveProject("zigzag")}
                          card={
                            <>
                              <span className={`${TYPE.projectKicker} text-emerald-500`}>
                                FASHION COMMERCE
                              </span>
                              <span className={`font-light opacity-90`}>
                                UX / BRANDING
                              </span>
                            </>
                          }
                        />

                        {/* 3. TRAVEL (Amber) */}
                        <TileBoard
                          letters={[
                            { row: 1, col: 2, char: "T" },
                            { row: 1, col: 3, char: "R" },
                            { row: 1, col: 4, char: "A" },
                            { row: 1, col: 5, char: "V" },
                            { row: 1, col: 6, char: "E" },
                            { row: 1, col: 7, char: "L" },
                          ]}
                          variant="wide"
                          accent="amber"
                          active={activeProject === "travel"}
                          onClick={() => setActiveProject("travel")}
                          card={
                            <>
                              <span className={`${TYPE.projectKicker} text-amber-400`}>
                                TRAVEL / LIFESTYLE
                              </span>
                              <span className={`font-light opacity-90`}>
                                BRAND &amp; WEB
                              </span>
                            </>
                          }
                        />

                        {/* 4. GMARKET (Sky) */}
                        <TileBoard
                          letters={[
                            { row: 1, col: 1, char: "G" },
                            { row: 1, col: 2, char: "M" },
                            { row: 1, col: 3, char: "A" },
                            { row: 1, col: 4, char: "R" },
                            { row: 1, col: 5, char: "K" },
                            { row: 1, col: 6, char: "E" },
                            { row: 1, col: 7, char: "T" },
                            { row: 2, col: 2, char: "R" },
                            { row: 2, col: 3, char: "A" },
                            { row: 2, col: 4, char: "K" },
                            { row: 2, col: 5, char: "U" },
                            { row: 2, col: 6, char: "T" },
                            { row: 2, col: 7, char: "E" },
                            { row: 2, col: 8, char: "N" },
                          ]}
                          variant="wide"
                          accent="sky"
                          active={activeProject === "gmarket"}
                          onClick={() => setActiveProject("gmarket")}
                          card={
                            <>
                              <span className={`${TYPE.projectKicker} text-sky-400`}>
                                GLOBAL MARKETPLACE
                              </span>
                              <span className={`font-light opacity-90`}>
                                UX / SEO
                              </span>
                            </>
                          }
                        />

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* ▲▲▲ 바둑판 영역 끝 */}


              {/* ▼▼▼ 디테일 패널 (V12.1 Typography Refined: Less Bold, Better Hierarchy) */}
              <AnimatePresence>
                {activeProjectDetail && (
                  <>
                    {/* BACKDROP */}
                    <motion.div
                      key="detail-backdrop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm"
                      onClick={() => setActiveProject(null)}
                    />

                    {/* STAGE */}
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6 pointer-events-none">
                      <motion.div
                        key="detail-panel"
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "100%", opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-6xl h-full md:h-[95vh] pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* PANEL BODY */}
                        <div className="relative h-full w-full bg-white md:rounded-[20px] shadow-2xl overflow-hidden flex flex-col font-sans text-zinc-900 selection:bg-[#fff3b0] selection:text-black">

                          {/* Paper Texture */}
                          <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-multiply" />

                          {/* Close Button */}
                          <button
                            type="button"
                            onClick={() => setActiveProject(null)}
                            className="absolute right-6 top-6 z-30 flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 transition-colors shadow-sm border border-zinc-200 text-lg"
                          >
                            ✕
                          </button>

                          {/* SCROLL AREA */}
                          <div className="flex-1 overflow-y-auto overscroll-contain px-8 md:px-16 py-12 md:py-20 space-y-20">

                            {/* 1. Header: 타이틀 & 메타데이터 */}
                            <header className="space-y-10 border-b border-zinc-900/10 pb-12">
                              <div className="space-y-4">
                                <span className={`inline-block text-[13px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600`}>
                                  {activeProjectDetail.clientType}
                                </span>
                                {/* ✅ [수정] 타이틀 사이즈 축소 (7xl -> 5xl) / 굵기 조정 (black -> extrabold) */}
                                <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-950 tracking-tight leading-[1.1] break-keep">
                                  {activeProjectDetail.title}
                                </h2>
                              </div>

                              {/* 메타 정보 */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 bg-zinc-50 rounded-2xl border border-zinc-200">
                                <div>
                                  <span className="block text-[12px] font-bold uppercase text-zinc-400 tracking-widest mb-2">Period</span>
                                  {/* ✅ [수정] 텍스트 굵기 Medium으로 완화 */}
                                  <span className="text-[16px] font-medium text-zinc-800">{activeProjectDetail.period}</span>
                                </div>
                                <div>
                                  <span className="block text-[12px] font-bold uppercase text-zinc-400 tracking-widest mb-2">Role</span>
                                  {/* ✅ [수정] 텍스트 굵기 Medium으로 완화 */}
                                  <span className="text-[16px] font-medium text-zinc-800">{activeProjectDetail.role}</span>
                                </div>
                                <div className="md:col-span-2">
                                  <span className="block text-[12px] font-bold uppercase text-zinc-400 tracking-widest mb-3">Tools</span>
                                  <div className="flex flex-wrap gap-2">
                                    {parseTools(activeProjectDetail.tools).map((tool) => (
                                      <span key={tool.name} className="text-zinc-700 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg text-[13px] font-medium shadow-sm">
                                        {tool.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </header>


                            {/* 2. Context (문제 정의) */}
                            <section>
                              <h3 className="text-[14px] font-extrabold text-zinc-950 uppercase tracking-widest mb-6 border-l-4 border-zinc-900 pl-4">
                                Context & Problem
                              </h3>
                              {/* 본문은 가독성을 위해 Medium 유지 */}
                              <div className="text-[18px] md:text-[20px] leading-[1.75] text-zinc-800 font-medium whitespace-pre-line">
                                {activeProjectDetail.context}
                              </div>
                            </section>


                            {/* 3. Key Visuals */}
                            {currentVisuals.length > 0 && (
                              <section>
                                <h3 className="text-[14px] font-extrabold text-zinc-950 uppercase tracking-widest mb-8 border-l-4 border-zinc-900 pl-4">
                                  Key Visuals
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  {currentVisuals.slice(0, 2).map((visual, idx) => (
                                    <div key={idx} className="group cursor-pointer flex flex-col gap-4" onClick={() => setActiveVisual(visual)}>
                                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-zinc-300 group-hover:scale-[1.01]">
                                        <Image src={visual.src} alt={visual.title} fill className="object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[2px]">
                                          <span className="bg-white text-zinc-900 px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform">ZOOM VIEW</span>
                                        </div>
                                      </div>
                                      <div className="px-1">
                                        <p className="text-[16px] font-bold text-zinc-900 leading-tight mb-1.5">{visual.title}</p>
                                        <p className="text-[14px] text-zinc-500 leading-relaxed font-medium">{visual.caption}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </section>
                            )}


                            {/* 4. Outcome */}
                            <section className="bg-[#111] text-zinc-100 p-10 md:p-14 rounded-[32px] shadow-2xl relative overflow-hidden">
                              <div className="relative z-10">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.25em] mb-6">
                                  Final Outcome
                                </h3>
                                {/* ✅ [수정] 폰트 사이즈 2단계 축소 (24px -> 20px) */}
                                <p className="text-[16px] md:text-[20px] leading-relaxed whitespace-pre-line font-medium text-zinc-50">
                                  {activeProjectDetail.outcome}
                                </p>
                              </div>
                              <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br opacity-20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3
                  ${activeProjectDetail.id === "zigzag" ? "from-emerald-500 to-transparent"
                                  : activeProjectDetail.id === "gmarket" ? "from-sky-500 to-transparent"
                                    : "from-amber-500 to-transparent"}`}
                              />
                            </section>


                            {/* 5. Strategy & Process */}
                            <section className="grid md:grid-cols-[1fr_1.5fr] gap-12 md:gap-20 border-t border-zinc-100 pt-16">
                              <div>
                                <h3 className="text-[14px] font-extrabold text-zinc-950 uppercase tracking-widest mb-6 border-l-4 border-zinc-900 pl-4">
                                  Goals
                                </h3>
                                <ul className="space-y-5">
                                  {activeProjectDetail.goal.map((g) => (
                                    <li key={g} className="flex items-start gap-4 text-zinc-800 leading-relaxed text-[16px] font-medium">
                                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 bg-zinc-900" />
                                      {g}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h3 className="text-[14px] font-extrabold text-zinc-950 uppercase tracking-widest mb-6 border-l-4 border-zinc-900 pl-4">
                                  Process
                                </h3>
                                <div className="space-y-5">
                                  {activeProjectDetail.process.map((step) => (
                                    <div key={step.label} className="bg-white p-7 rounded-2xl border border-zinc-200 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)] hover:border-zinc-300 transition-colors">
                                      <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                                        {step.label}
                                      </p>
                                      {/* ✅ [수정] 프로세스 본문: Bold -> Medium으로 완화 */}
                                      <p className="text-zinc-900 text-[16px] leading-relaxed font-medium">
                                        {step.body}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </section>


                            {/* 6. More Visuals (2x2 Layout) */}
                            {currentVisuals.length > 2 && (
                              <section className="pt-10 border-t border-zinc-100">
                                <h3 className="text-[14px] font-extrabold text-zinc-950 uppercase tracking-widest mb-10 border-l-4 border-zinc-900 pl-4">
                                  More Visuals
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  {currentVisuals.slice(2).map((visual, idx) => (
                                    <div key={idx} className="group cursor-pointer flex flex-col gap-4" onClick={() => setActiveVisual(visual)}>
                                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200 shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:border-zinc-300 group-hover:scale-[1.01]">
                                        <Image src={visual.src} alt={visual.title} fill className="object-cover transition-opacity hover:opacity-90" />
                                      </div>
                                      <div className="px-1">
                                        <p className="text-[16px] font-bold text-zinc-800 truncate pl-1 mb-1">{visual.title}</p>
                                        <p className="text-[14px] text-zinc-500 pl-1 font-medium">{visual.caption}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </section>
                            )}

                            <div className="flex justify-center pt-16 pb-8 opacity-20">
                              <div className="w-2 h-2 rounded-full bg-zinc-900" />
                            </div>

                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </>
                )}
              </AnimatePresence>

              {/* ▼▼▼ [NEW] 확대 모달 (V6.3 Lightbox with Navigation) */}
              <AnimatePresence>
                {activeVisual && (
                  <>
                    <motion.div
                      key="overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="fixed inset-0 z-[80] bg-white/95 backdrop-blur-xl" // 배경을 밝은 화이트+블러로 변경
                      onClick={() => setActiveVisual(null)}
                    />

                    <motion.div
                      key="panel"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", damping: 30, stiffness: 300 }}
                      className="fixed inset-0 z-[90] flex flex-col items-center justify-center p-4 pointer-events-none"
                    >
                      <div
                        className="relative w-full max-w-7xl h-[85vh] flex flex-col items-center pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                      >

                        {/* 이미지 컨테이너 */}
                        <div className="relative flex-1 w-full flex items-center justify-center">
                          <Image
                            src={activeVisual.src}
                            alt={activeVisual.title}
                            fill
                            className="object-contain drop-shadow-2xl"
                            sizes="90vw"
                          />
                        </div>

                        {/* 하단 캡션 */}
                        <div className="mt-6 text-center max-w-2xl px-4">
                          <h4 className="text-lg font-bold text-zinc-900 mb-2">{activeVisual.title}</h4>
                          <p className="text-sm text-zinc-500 font-medium">{activeVisual.caption}</p>
                        </div>

                        {/* Navigation Buttons */}
                        {/* Prev Button */}
                        <button
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-12 p-4 text-zinc-400 hover:text-zinc-900 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentIdx = currentVisuals.findIndex(v => v.src === activeVisual.src);
                            const prevIdx = (currentIdx - 1 + currentVisuals.length) % currentVisuals.length;
                            setActiveVisual(currentVisuals[prevIdx]);
                          }}
                        >
                          <span className="text-4xl font-light">‹</span>
                        </button>

                        {/* Next Button */}
                        <button
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-12 p-4 text-zinc-400 hover:text-zinc-900 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentIdx = currentVisuals.findIndex(v => v.src === activeVisual.src);
                            const nextIdx = (currentIdx + 1) % currentVisuals.length;
                            setActiveVisual(currentVisuals[nextIdx]);
                          }}
                        >
                          <span className="text-4xl font-light">›</span>
                        </button>

                        {/* Close Button */}
                        <button
                          onClick={() => setActiveVisual(null)}
                          className="absolute top-0 right-0 -mt-12 mr-0 text-sm font-bold text-zinc-400 hover:text-zinc-900 tracking-widest flex items-center gap-2"
                        >
                          CLOSE ✕
                        </button>

                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              {/* ▲▲▲ 확대 모달 끝 */}


              {/* ▲▲▲ 디테일 영역 끝*/}
            </section>

            {/* 4) STUDIO LAB + STUDIO STATUS + FOOTER 그룹 */}
            <div className="full-bleed space-y-0 relative z-20">

              {/* 4) [WHITE] STUDIO LABORATORY (bg2) - ✅ 수정 3: 글래스모피즘 & 뒤 배경 비침 */}
              <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white/90 backdrop-blur-3xl py-24 md:py-32 overflow-hidden border-t border-white/10">

                {/* 배경 체크 패턴 */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:32px_32px]" />

                {/* 뒤쪽 오로라가 살짝 비치도록 함 */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/40 to-white/65" />

                <div className="relative z-10 mx-auto max-w-7xl px-6">
                  <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-300/50 pb-8">
                    <div className="text-left">
                      <span className="inline-block px-5 py-2 rounded-full bg-zinc-900 text-white text-[14px] font-bold tracking-widest uppercase">Experimental Zone</span>
                      <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tighter text-zinc-900 mt-2">STUDIO<br /><span className="text-zinc-400">LABORATORY</span></h2>
                    </div>
                    <p className="max-w-sm md:text-right text-zinc-500 font-medium leading-relaxed text-sm">프리랜서 작업과 제안서를 모아,<br />문제를 정의하고 경험을 설계하는 방식을 실험하는 구역입니다.</p>
                  </header>

                  <div className="p-3 md:p-6 rounded-[36px] bg-[#F8F8F8] border border-white/90 shadow-2xl">
                    <div className="rounded-[24px] overflow-hidden bg-white border border-zinc-200 shadow-inner">

                      {/* ▼▼▼ [수정됨] Lab 헤더: 블랙 터미널 스타일 + 신호등 컬러 복구 ▼▼▼ */}
                      <div className="flex items-center justify-between px-5 py-3 bg-[#1A1A1A] border-b border-zinc-800 ">
                        <div className="flex gap-2">
                          <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" /> {/* Red */}
                          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" /> {/* Yellow */}
                          <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" /> {/* Green */}
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase opacity-80">
                          AENEAS_LAB_OS_V15.0
                        </span>
                      </div>
                      {/* ▲▲▲ 수정 끝 ▲▲▲ */}

                      <div className="py-10 md:py-12 bg-white">
                        <ExperienceLabSlider items={LAB_ITEMS} mainColor="#1a1a1a" theme="light" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ▼▼▼ [V8.1 FINAL FOOTER] The Dark Terminal */}
              <footer className="relative w-full py-24 md:py-32 px-6 md:px-12 bg-[#050505] text-white border-t border-zinc-900">

                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-16">

                  {/* Left: Signal & CTA */}
                  <div className="space-y-10">

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <p className="text-xs font-bold text-emerald-500 tracking-[0.2em] uppercase">
                        Signal Status: Online
                      </p>
                    </div>

                    {/* Typography */}
                    <div className="space-y-2">
                      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[0.9]">
                        READY TO<br />
                        <span className="text-zinc-600">COLLABORATE?</span>
                      </h2>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      <a
                        href="mailto:lightblue1369@gmail.com"
                        className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold text-md hover:bg-zinc-200 transition-all active:scale-95"
                      >
                        <span>Send Signal</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>

                      {/* Download CV -> Profile Deck (혹은 삭제 가능) */}
                      <a
                        href="#"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-zinc-700 text-zinc-400 font-medium hover:border-white hover:text-white transition-colors"
                      >
                        Profile Deck
                      </a>
                    </div>
                  </div>

                  {/* Right: Info */}
                  <div className="text-left md:text-right space-y-8">
                    <div className="text-zinc-600 text-[11px] tracking-widest uppercase font-bold space-y-1">
                      <p>© 2024 AENEAS Studio.</p>
                      <p>System Engineered with Next.js & React</p>
                    </div>
                  </div>

                </div>
              </footer>

            </div>

          </div>
        </main>
      </div >
    </div >
  );

}
