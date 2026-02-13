"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function DetailPositioningFlow() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const styles = {
        container: {
            backgroundColor: "#F5F5F7",
            minHeight: "100vh",
            color: "#191F28",
            fontFamily: "'Pretendard', sans-serif",
            padding: "120px 24px 160px 24px",
            position: "relative" as const,
        },
        header: {
            maxWidth: "1280px",
            margin: "0 auto 120px auto",
            textAlign: "center" as const,
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: "80px",
            maxWidth: "1100px",
            margin: "0 auto 200px auto",
            alignItems: "start",
        },
        flowChartBox: {
            position: "sticky" as const,
            top: "140px",
            padding: "40px",
            background: "#FFFFFF",
            borderRadius: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
            border: "1px solid #E5E8EB",
        },
        node: {
            border: "1px solid #E0E0E0",
            borderRadius: "12px",
            padding: "24px",
            background: "#FAFAFA",
            marginBottom: "32px",
            position: "relative" as const,
        },
        nodeLabel: {
            fontSize: "12px",
            fontWeight: "700",
            color: "#00B894",
            textTransform: "uppercase" as const,
            marginBottom: "8px",
            display: "block",
            letterSpacing: "0.05em",
        },
        connectorLine: {
            position: "absolute" as const,
            left: "50%",
            bottom: "-32px",
            width: "2px",
            height: "32px",
            background: "#E0E0E0",
        },
        visualCard: {
            background: "#FFFFFF",
            borderRadius: "44px",
            overflow: "hidden",
            boxShadow: "0 40px 100px rgba(0,0,0,0.12)",
            border: "12px solid #1a1a1a",
            height: "860px",
            position: "relative" as const,
            zIndex: 10,
        },
        scrollContainer: {
            width: "100%",
            height: "100%",
            overflowY: "auto" as const,
            overflowX: "hidden" as const,
            scrollBehavior: "smooth" as const,
            scrollbarWidth: "none" as const,
            msOverflowStyle: "none" as const,
        },
        image: {
            width: "100%",
            display: "block",
        }
    };

    return (
        <div style={styles.container}>

            {/* Global Navigation */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300"
                style={{
                    backgroundColor: scrolled ? "rgba(255,255,255,0.9)" : "transparent",
                    backdropFilter: scrolled ? "blur(12px)" : "none",
                    borderBottom: scrolled ? "1px solid rgba(0,0,0,0.05)" : "none",
                }}
            >
                <button
                    onClick={() => router.push('/')}
                    className="group flex items-center gap-3 rounded-full bg-[#121212] px-5 py-2.5 shadow-lg transition-all hover:scale-105 hover:bg-black"
                >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full border border-white/20 text-white/60 text-[10px] group-hover:text-white group-hover:border-white">
                        ←
                    </span>
                    <span className="text-[13px] font-medium text-white/90 tracking-wider group-hover:text-white">
                        MAIN SYSTEM
                    </span>
                </button>

                <div className="hidden md:block text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400">
                    Strategy Log · 001
                </div>
            </motion.header>


            {/* ✅ [Updated] 1. Header: Typography & Copy Refinement */}
            <header style={styles.header}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* 1) Kicker: 폰트 얇게(500), 사이즈 키움(15px) */}
                    <span style={{
                        color: "#00B894",
                        fontWeight: 500, // Bold(700) -> Medium(500)
                        letterSpacing: "0.15em", // 자간을 넓혀 우아하게
                        fontSize: "16px", // 13px -> 15px
                        display: "inline-block",
                        marginBottom: "20px"
                    }}>
                        UX ARCHITECTURE CASE
                    </span>

                    {/* 2) Main Title: 명징하고 포괄적인 키워드 */}
                    <h1 style={{
                        fontSize: "64px", // 타이틀 임팩트 강화 (56 -> 64)
                        fontWeight: 800,
                        color: "#191F28",
                        marginBottom: "36px",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.05
                    }}>
                        이중적 심리를 위한 설계
                    </h1>

                    {/* 3) Sub Text: 정제된 어조 */}
                    <p style={{
                        fontSize: "19px", // 가독성 확보 (18 -> 19)
                        color: "#4E5968", // 가독성 좋은 진한 회색
                        maxWidth: "720px",
                        margin: "0 auto",
                        lineHeight: 1.6,
                        wordBreak: "keep-all" // 한글 줄바꿈 방지
                    }}>
                        세련된 취향과 기술적 두려움의 공존.<br />
                        시니어의 <strong>이중적 심리(Dual Psychology)</strong>를 파고들어 진입 장벽을 직관성으로 허물고,<br />
                        제품의 가치를 단순 소비재에서 <strong>'나를 위한 가치 있는 투자'</strong>로 격상시켰습니다.
                    </p>
                </motion.div>
            </header>


            {/* --- SECTION 1: TARGET (Psychology) --- */}
            <div style={styles.grid}>
                <div style={styles.flowChartBox}>
                    <h3 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>01. The Dual Psychology</h3>
                    <div style={styles.node}>
                        <span style={{ ...styles.nodeLabel, color: "#FF6B6B" }}>⚠ INSIGHT</span>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            치열한 경쟁 시대를 살아온 유복한 시니어.<br />
                            돈은 있지만 평생을 아끼며 살아왔기에,<br />
                            단순한 소비보다는 <strong>'가치 있는 투자'</strong>를 원합니다.
                        </p>
                        <div style={styles.connectorLine}></div>
                    </div>
                    <div style={{ ...styles.node, background: "#F0FAF8", borderColor: "#00B894" }}>
                        <span style={styles.nodeLabel}>⚡ STRATEGY</span>
                        <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Sophistication vs. Fear</p>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            그들은 촌스러운 것은 싫어하지만,<br />
                            동시에 <strong>새로운 기계 연동에 대한 막연한 두려움</strong>을<br />
                            가지고 있습니다. 이 모순을 해결해야 합니다.
                        </p>
                    </div>
                </div>
                <div style={styles.visualCard}>
                    <style jsx>{`
                        div::-webkit-scrollbar { display: none; }
                    `}</style>
                    <div style={styles.scrollContainer}>
                        <img
                            src="/work/detail-positioning/01-hook-hero.jpg"
                            alt="The Active Senior Persona"
                            style={styles.image}
                        />
                    </div>
                </div>
            </div>


            {/* --- SECTION 2: BARRIER (Installation Fear) --- */}
            <div style={styles.grid}>
                <div style={styles.flowChartBox}>
                    <h3 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>02. Removing Fear</h3>
                    <div style={styles.node}>
                        <span style={{ ...styles.nodeLabel, color: "#FF6B6B" }}>⚠ PAIN POINT</span>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            "내가 이걸 설치할 수 있을까?"<br />
                            낯선 기계와의 연동 과정은 가장 큰 심리적 장벽입니다.
                        </p>
                        <div style={styles.connectorLine}></div>
                    </div>
                    <div style={{ ...styles.node, background: "#F0FAF8", borderColor: "#00B894" }}>
                        <span style={styles.nodeLabel}>⚡ UX SOLUTION</span>
                        <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>3-Step Easy Pairing</p>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            복잡한 기술 용어를 배제하고,<br />
                            <strong>[끼우고 - 켜고 - 된다]</strong><br /><br /> 직관적인 <strong>3단계 플로우</strong>로 시각화하여,<br />
                            설치에 대한 막연한 공포감을 제거했습니다.
                        </p>
                    </div>
                </div>
                <div style={styles.visualCard}>
                    <div style={styles.scrollContainer}>
                        <img
                            src="/work/detail-positioning/02-logic-data.jpg"
                            alt="3-Step Connection Guide Visualization"
                            style={styles.image}
                        />
                    </div>
                </div>
            </div>


            {/* --- SECTION 3: DESIRE (My Club) --- */}
            <div style={styles.grid}>
                <div style={styles.flowChartBox}>
                    <h3 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>03. Value Extension</h3>
                    <div style={{ ...styles.node, background: "#F0FAF8", borderColor: "#00B894" }}>
                        <span style={styles.nodeLabel}>⚡ KEY SELLING POINT</span>
                        <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>"With Your Own Club"</p>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            장난감 채가 아닌, 내가 큰돈을 들여 산<br />
                            <strong>'나의 명품 골프채'</strong>에 센서만 달면 된다는 점을 강조했습니다.<br />
                            <br />
                            이는 기계 구매가 아니라,<br />
                            <strong>"내 장비의 활용 가치를 높이는 투자"</strong>로<br />
                            인식을 전환시킵니다.
                        </p>
                    </div>
                </div>
                <div style={styles.visualCard}>
                    <div style={styles.scrollContainer}>
                        <img
                            src="/work/detail-positioning/03-mood-lifestyle.jpg"
                            alt="Attaching Sensor to Own Club"
                            style={styles.image}
                        />
                    </div>
                </div>
            </div>


            {/* --- SECTION 4: CREATIVITY (Zero Budget) --- */}
            <div style={styles.grid}>
                <div style={styles.flowChartBox}>
                    <h3 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>04. Zero-Budget Creative</h3>

                    <div style={styles.node}>
                        <span style={{ ...styles.nodeLabel, color: "#FF6B6B" }}>⚠ RESOURCE LIMIT</span>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            제대로 된 제품 사진조차 없는 열악한 환경.<br />
                            하지만 20년 전 전단지 느낌으로는 설득할 수 없었습니다.
                        </p>
                        <div style={styles.connectorLine}></div>
                    </div>

                    <div style={{ ...styles.node, background: "#F0FAF8", borderColor: "#00B894" }}>
                        <span style={styles.nodeLabel}>⚡ AI GENERATION</span>
                        <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Premium Mood with AI</p>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            비용이 드는 스튜디오 촬영 대신,<br />
                            <strong>Generative AI</strong>를 활용해 이상적인 공간과 고급스러운 무드를 창조했습니다.<br />
                            <br />
                            자본의 한계를 <strong>기술적 크리에이티브</strong>로 극복하여<br />
                            고급 가전과 같은 프리미엄 이미지를 완성했습니다.
                        </p>
                    </div>
                </div>

                <div style={styles.visualCard}>
                    <div style={styles.scrollContainer}>
                        <img
                            src="/work/detail-positioning/04-action-package.jpg"
                            alt="AI Generated Premium Assets"
                            style={styles.image}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div style={{ textAlign: "center", marginTop: "100px", paddingBottom: "100px" }}>
                <p style={{ fontSize: "13px", color: "#999", marginBottom: "20px", letterSpacing: "0.1em" }}>SYSTEM END</p>
                <button
                    onClick={() => router.push('/')}
                    className="inline-flex items-center gap-3 text-[18px] font-bold text-[#191F28] hover:text-[#00B894] transition-colors"
                >
                    Back to Archive <span style={{ fontSize: "20px" }}>→</span>
                </button>
            </div>

        </div>
    );
}