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
    // 0. 기본 우주 배경 (항상 어두운 하늘)
    <div className="aeneas-bg min-h-screen text-zinc-50 bg-[#050505]">

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
                <div
                  className="rounded-[28px] overflow-hidden border"
                  style={{
                    background: powerOn ? CONSTELLATION_AURORA_ON : CONSTELLATION_AURORA_OFF,
                    borderColor: "#171717",
                    boxShadow: [
                      "0 32px 80px rgba(0,0,0,0.95)",
                      "inset 0 1px 0 rgba(255,255,255,0.08)",
                      "inset 0 -18px 40px rgba(0,0,0,0.9)",
                      "inset 1px 1px 2px rgba(255,255,255,0.25)",
                    ].join(", "),
                  }}
                >

                  {/* 상단 : CONSTELLATION MAP 영역 */}
                  <div className="px-4 py-6 md:px-10 md:pt-8 md:pb-6">
                    <section className="mt-4 md:mt-10">
                      {/* 바깥 프레임 */}
                      <div
                        className="relative rounded-[20px] overflow-hidden"
                        style={{
                          // 살짝 투명한 다크 그레이
                          backgroundColor: "rgba(0,0,0,0.32)",
                          border: "1px solid rgba(120,120,120,0.6)",
                          boxShadow:
                            "inset 1px 1px 2px rgba(255,255,255,0.25), 0 0 0 1px rgba(0,0,0,0.9)", // ← 남색 대신 순수 블랙
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

            {/* 2) SELECTED WORK SECTION - [Updated Layout 2x2] */}
            <section className="full-bleed mt-30 border-t border-white/7 pt-10">

              <header className="mb-14 text-center space-y-4 max-w-5xl mx-auto">
                <p className="text-[14px] tracking-[0.3em] uppercase text-orange-500/90 font-bold">
                  System Archives
                </p>
                <h2 className="text-[36px] md:text-[72px] font-bold leading-tight tracking-tight text-zinc-100">
                  Selected Works
                </h2>
                <p className="mx-auto max-w-2xl text-[24px] text-zinc-400 leading-relaxed">
                  프로젝트의 설계 구조를 확인하려면 키보드를 눌러 접속하세요.
                </p>
              </header>

              {/* ▼▼▼ 바둑판 영역 – 가로 풀폭 */}
              <div
                className={`
                  mt-10 relative left-1/2 right-1/2
                  -ml-[50vw] -mr-[50vw]
                  transition-all duration-500
                  ${activeProjectDetail ? "blur-[3px] opacity-40" : ""}
                `}
              >
                <div className="w-screen px-4 md:px-10 lg:px-16 overflow-x-hidden">
                  <div className="max-w-[1400px] mx-auto">

                    {/* ✅ [FIX] 부모 컨테이너 패딩 대폭 확대 
                        - py-8 -> py-24 (96px) : 상하 여백 확보 (잘림 방지 핵심)
                        - px-6 -> px-12 : 좌우 여백 확보
                        - rounded-8 -> rounded-[32px] : 부드러운 모서리
                    */}
                    <div className="rounded-[32px] border border-white/7 bg-white/5 px-8 md:px-12 py-24 shadow-[0_26px_70px_rgba(0,0,0,0.85)]">

                      {/* ✅ [FIX] 그리드 간격 확대 (gap-10) */}
                      <div className="grid gap-10 lg:gap-12 md:grid-cols-2">

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
                          onClick={() => window.location.href = "/work/detail-positioning"} // router 대신 window 이동 (또는 상단 router 사용)
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
                          variant="wide" // 2열 레이아웃이므로 wide로 통일해도 무방
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


              {/* ▼▼▼ 디테일 패널 */}
              <AnimatePresence>
                {activeProjectDetail && (
                  <>
                    {/* BACKDROP */}
                    <motion.div
                      key="detail-backdrop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2 }}
                      className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-[3px]"
                      onClick={() => setActiveProject(null)}
                    />

                    {/* STAGE */}
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
                      <motion.div
                        key="detail-panel"
                        initial={{ y: "120%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "12%", opacity: 0 }}
                        transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-5xl h-[80vh]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* PANEL BODY */}
                        <div className="relative h-full rounded-[26px] overflow-hidden bg-[#0B0E13] border border-white/14 shadow-[0_48px_160px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)]">
                          {/* 표면 하이라이트 */}
                          <div
                            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_18%,rgba(0,0,0,0)_60%)]"
                          />

                          {/* 미세 스캔 라인 */}
                          <div
                            className="pointer-events-none absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.6)_0px,rgba(255,255,255,0.6)_1px,transparent_1px,transparent_24px)]"
                          />

                          {/* 닫기 버튼 */}
                          <button
                            type="button"
                            onClick={() => setActiveProject(null)}
                            className="absolute right-5 top-5 z-20 h-9 w-9 rounded-full border border-white/20 bg-black/80 text-zinc-200 hover:bg-black/90"
                          >
                            ×
                          </button>

                          <div
                            className={`rounded-[24px] border border-white/16 bg-[#0B0D10]
                            shadow-[0_40px_120px_rgba(0,0,0,0.85)]
                            ${activeProjectDetail.id === "zigzag"
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
                            <div className="relative z-10 overflow-y-auto overscroll-contain scroll-smooth px-8 pb-10 space-y-7 md:space-y-8"
                              style={{ height: "calc(80vh - 200px)" }}
                            >
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
                      </motion.div>
                    </div>
                  </>
                )}
              </AnimatePresence>

              {/* ▼▼▼ 확대 모달 – 디테일 패널과 "분리" */}
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
                      transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-8"
                      onClick={() => setActiveVisual(null)}
                    >
                      <div
                        className="relative w-full max-w-6xl h-[88vh] rounded-3xl border border-white/16 bg-gradient-to-b from-zinc-900/95 to-black shadow-[0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveVisual(null)}
                          className="absolute right-4 top-4 z-[95] rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-zinc-100 shadow-lg hover:bg-black/90 md:right-6 md:top-5"
                        >
                          닫기 ✕
                        </button>

                        <div className="relative h-full w-full">
                          <Image
                            src={activeVisual.src}
                            alt={activeVisual.title}
                            fill
                            className="object-contain"
                            sizes="(min-width: 1024px) 80vw, 100vw"
                          />

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
              {/* ▲▲▲ 확대 모달 끝 */}


              {/* ▲▲▲ 디테일 영역 끝*/}
            </section>

            {/* 3) STUDIO LAB + STUDIO STATUS 그룹  */}
            < div className="full-bleed space-y-0" >
              {/* STUDIO LAB */}
              < section className="mt-30" >
                {/* 뷰포트 풀폭 래핑 */}
                < div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]" >
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

                      {/* 카드 데크(배경 플레이트) – 기계 패널 느낌 3겹 프레임 */}
                      <div className="mt-30 mx-auto max-w-6xl">
                        {/* 카드 그리드 – 프리랜서 2 + 제안서 1 */}
                        <ExperienceLabSlider items={LAB_ITEMS} mainColor="#4C9990" autoMs={6500} />

                      </div>

                      {/* STUDIO STATUS */}
                      < section className="mt-0 border-t border-white/7 pt-8 md:pt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between w-full max-w-5xl mx-auto" >
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-emerald-400 tracking-[0.25em] uppercase">
                            Studio Status
                          </p>
                          <p className={`${TYPE.statusBody} text-zinc-300`}>

                            <span className="text-zinc-50">
                              브랜드·웹 리빌딩
                            </span>
                            에 집중합니다. <br />
                            <a href="https://github.com/tiffanyblue-iam/aeneas-portfolio" target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-zinc-400 transition-colors text-[14px] underline">
                              GitHub 레포지토리
                            </a>
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <a
                            href="mailto:lightblue1369@gmail.com"
                            className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-2 text-sm font-medium text-zinc-900 hover:bg-emerald-300 transition-colors"
                          >
                            프로젝트 상의하기
                          </a>
                          <a
                            href="https://github.com/tiffanyblue-iam/aeneas-portfolio" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-6 py-2 text-sm font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900 transition-colors"
                          >
                            작업 노트 보기
                          </a>
                        </div>
                      </section >
                    </div >


                    <footer className="mt-40 border-t border-white/5 pt-10 flex flex-wrap items-center justify-between gap-2 w-full max-w-5xl mx-auto">
                      <span className={`${TYPE.footer} text-zinc-500`}>
                        © {new Date().getFullYear()} AENEAS Studio. All rights reserved.
                      </span>
                      <span className={`${TYPE.footer} text-zinc-500`}>
                        Based in Seoul · Working remotely.
                      </span>
                    </footer>
                  </div >
                </div >
              </section>
            </div >
          </div>
        </main>
      </div>
    </div >
  );

}
