"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SilvieraDetailFlow() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const slide = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth * 0.8;
            sliderRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

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
        sliderSection: {
            maxWidth: "1280px",
            margin: "0 auto 160px auto",
            position: "relative" as const,
        },
        sliderContainer: {
            display: "flex",
            gap: "24px",
            overflowX: "auto" as const,
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none" as const,
            msOverflowStyle: "none" as const,
            paddingBottom: "20px",
        },
        slideItem: {
            flex: "0 0 auto",
            width: "320px",
            height: "460px",
            scrollSnapAlign: "center",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        slideButton: {
            position: "absolute" as const,
            top: "50%",
            transform: "translateY(-50%)",
            width: "56px",
            height: "56px",
            backgroundColor: "#FFFFFF",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            cursor: "pointer",
            zIndex: 10,
            border: "none",
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
            height: "100%",
            objectFit: "cover" as const,
            display: "block",
        }
    };

    return (
        <div style={styles.container}>
            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>

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

                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-500">
                        Strategy Log · 002
                    </div>
                    <button
                        onClick={() => router.push('/work/detail-positioning')}
                        className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#191F28] shadow-sm ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-50 hover:scale-105"
                    >
                        이전 상세페이지
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </motion.header>


            <header style={styles.header}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <span style={{
                        color: "#00B894",
                        fontWeight: 500,
                        letterSpacing: "0.15em",
                        fontSize: "16px",
                        display: "inline-block",
                        marginBottom: "20px"
                    }}>
                        CONVERSION STRATEGY CASE
                    </span>
                    <h1 style={{
                        fontSize: "64px",
                        fontWeight: 800,
                        color: "#191F28",
                        marginBottom: "36px",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.05
                    }}>
                        과학적 증명과 우아함의 융합
                    </h1>
                    <p style={{
                        fontSize: "19px",
                        color: "#4E5968",
                        maxWidth: "760px",
                        margin: "0 auto",
                        lineHeight: 1.6,
                        wordBreak: "keep-all"
                    }}>
                        남성 중심의 탈모 시장에서 여성만이 겪는 <strong>'정수리 볼륨 저하'</strong>라는 페인포인트를 타겟팅했습니다.<br />
                        31년 연구소의 기술력(EGCG)과 압도적인 데이터(리뷰/판매량)를 전면에 내세워,<br />
                        타겟의 불안을 확신으로 바꾼 <strong>전환(Conversion) 중심의 설계</strong>입니다.
                    </p>
                </motion.div>
            </header>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} style={styles.sliderSection}>
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#191F28" }}>Key Visual & Advertising Assets</h2>
                    <p style={{ fontSize: "14px", color: "#8B95A1", marginTop: "8px" }}>자사몰 메인 배너 및 광고 소재 아카이브</p>
                </div>

                <button onClick={() => slide('left')} style={{ ...styles.slideButton, left: "-28px" }}>←</button>
                <button onClick={() => slide('right')} style={{ ...styles.slideButton, right: "-28px" }}>→</button>

                <div ref={sliderRef} className="hide-scrollbar" style={styles.sliderContainer}>
                    {[
                        "banner1.png",
                        "banner2.jpg",
                        "banner3.jpg",
                        "banner4.jpg",
                        "banner5.png",
                        "banner6.jpg",
                        "banner7.jpg",
                        "banner8.jpg",
                        "banner9.png",
                        "banner10.jpg"
                    ].map((fileName, index) => (
                        <div key={index} style={styles.slideItem}>
                            <img
                                src={`/work/detail-positioning/silviera/${fileName}`}
                                alt={`Banner ${index + 1}`}
                                style={styles.image}
                            />
                        </div>
                    ))}
                </div>
            </motion.div>


            <div style={styles.grid}>
                <div style={styles.flowChartBox}>
                    <h3 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>01. Target Empathy</h3>
                    <div style={styles.node}>
                        <span style={{ ...styles.nodeLabel, color: "#FF6B6B" }}>⚠ INSIGHT</span>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            "모임 갈 때마다 신경 쓰이는 정수리."<br />
                            중년 여성의 큰 스트레스지만, 독한 남성용 탈모약은 거부감이 듭니다.
                        </p>
                        <div style={styles.connectorLine}></div>
                    </div>
                    <div style={{ ...styles.node, background: "#F0FAF8", borderColor: "#00B894" }}>
                        <span style={styles.nodeLabel}>⚡ STRATEGY</span>
                        <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Lifestyle Anti-aging</p>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            "딸 성화에 뿌려본" 같은 일상적 카피와 모녀 모델을 교차 배치하여 의약품의 무거운 느낌을 덜어내고, <strong>프리미엄 안티에이징 케어</strong>로 타겟을 확장했습니다.
                        </p>
                    </div>
                </div>
                <div style={styles.visualCard}>
                    <div style={styles.scrollContainer}>
                        <img src="/work/detail-positioning/silviera/01-target.jpg" alt="Target Empathy" style={styles.image} />
                    </div>
                </div>
            </div>


            <div style={styles.grid}>
                <div style={styles.flowChartBox}>
                    <h3 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>02. Social Proof</h3>
                    <div style={styles.node}>
                        <span style={{ ...styles.nodeLabel, color: "#FF6B6B" }}>⚠ PAIN POINT</span>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            수많은 탈모 제품에 속아온 소비자들은 더 이상 감성적인 문구만으로는 지갑을 열지 않습니다.
                        </p>
                        <div style={styles.connectorLine}></div>
                    </div>
                    <div style={{ ...styles.node, background: "#F0FAF8", borderColor: "#00B894" }}>
                        <span style={styles.nodeLabel}>⚡ UX SOLUTION</span>
                        <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Data-Driven Trust</p>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            <strong>"10초에 1병", "누적 17만 개", "12,037개 리뷰 평점 5.0"</strong><br />
                            철저하게 숫자로 증명된 강력한 사회적 증거(Social Proof)를 전면에 내세워 이탈률을 방어했습니다.
                        </p>
                    </div>
                </div>
                <div style={styles.visualCard}>
                    <div style={styles.scrollContainer}>
                        <img src="/work/detail-positioning/silviera/02-proof.jpg" alt="Social Proof Data" style={styles.image} />
                    </div>
                </div>
            </div>


            <div style={styles.grid}>
                <div style={styles.flowChartBox}>
                    <h3 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>03. The Core Solution</h3>
                    <div style={{ ...styles.node, background: "#F0FAF8", borderColor: "#00B894" }}>
                        <span style={styles.nodeLabel}>⚡ KEY SELLING POINT</span>
                        <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Authority & Ingredients</p>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            <strong>'전남바이오 31년 연구소장'</strong>이라는 강력한 권위와 <strong>'녹차 EGCG 원물 93%'</strong>라는 직관적인 성분을 매칭시켰습니다.<br /><br />
                            싱그러운 녹차밭 비주얼을 활용해 항산화(좀비세포 박멸) 효과를 시각적으로 극대화했습니다.
                        </p>
                    </div>
                </div>
                <div style={styles.visualCard}>
                    <div style={styles.scrollContainer}>
                        <img src="/work/detail-positioning/silviera/03-solution.jpg" alt="Ingredients and Authority" style={styles.image} />
                    </div>
                </div>
            </div>


            <div style={styles.grid}>
                <div style={styles.flowChartBox}>
                    <h3 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "40px" }}>04. Removing Risk</h3>
                    <div style={styles.node}>
                        <span style={{ ...styles.nodeLabel, color: "#FF6B6B" }}>⚠ RESOURCE LIMIT</span>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            "효과가 없으면 어쩌지?"<br />
                            여성 타겟 특유의 꼼꼼함은 구매 직전 마지막 망설임을 만들어냅니다.
                        </p>
                        <div style={styles.connectorLine}></div>
                    </div>
                    <div style={{ ...styles.node, background: "#F0FAF8", borderColor: "#00B894" }}>
                        <span style={styles.nodeLabel}>⚡ CREATIVE DIRECTION</span>
                        <p style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Triggering Conversion</p>
                        <p style={{ fontSize: "15px", color: "#555", lineHeight: 1.5 }}>
                            <strong>"2주의 미학, 불만족 시 100% 환불"</strong><br /><br />
                            단순히 제품이 좋다는 것을 넘어, 파격적인 개런티를 전면에 내세워 구매 전환(Conversion)의 마지막 허들을 완벽하게 제거했습니다.
                        </p>
                    </div>
                </div>
                <div style={styles.visualCard}>
                    <div style={styles.scrollContainer}>
                        <img src="/work/detail-positioning/silviera/04-risk.jpg" alt="100% Refund Guarantee" style={styles.image} />
                    </div>
                </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "120px", paddingBottom: "100px", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}>

                <button
                    onClick={() => router.push('/work/detail-positioning')}
                    style={{
                        padding: "16px 32px",
                        backgroundColor: "#191F28",
                        color: "#FFFFFF",
                        borderRadius: "100px",
                        fontSize: "15px",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "12px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        cursor: "pointer"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                    이전 상세페이지로 돌아가기
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div style={{ marginTop: "40px" }}>
                    <p style={{ fontSize: "12px", color: "#999", marginBottom: "16px", letterSpacing: "0.1em" }}>SYSTEM END</p>
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 text-[15px] font-bold text-[#8B95A1] hover:text-[#191F28] transition-colors"
                    >
                        Back to Archive
                    </button>
                </div>
            </div>

        </div>
    );
}