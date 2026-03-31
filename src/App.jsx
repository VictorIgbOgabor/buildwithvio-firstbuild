import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBitjQdgwlfsRcBgEHWncr6AXDl6r2X25w",
  authDomain: "vio-assistant-a8528.firebaseapp.com",
  projectId: "vio-assistant-a8528",
  storageBucket: "vio-assistant-a8528.firebasestorage.app",
  messagingSenderId: "200802733203",
  appId: "1:200802733203:web:fb3a16724f6193769c1166"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function BuildWithVioLanding() {
  const canvasRef = useRef(null);
  const now = new Date();
  const isNewMonth = now.getMonth() === 3 && now.getDate() <= 3;
  const [showSplash, setShowSplash] = useState(isNewMonth);
  const [step, setStep] = useState("hero");
  const [inputVal, setInputVal] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [typedResponse, setTypedResponse] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "BUILDWITHVIO01>{}</>const async ship deploy";
    const fontSize = 13;
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(0).map(() => Math.random() * -80);

    const draw = () => {
      ctx.fillStyle = "rgba(8,8,8,0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.65 ? "rgba(255,107,0,0.55)" : "rgba(0,102,255,0.35)";
        ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.45;
      });
    };

    const interval = setInterval(draw, 55);
    return () => { clearInterval(interval); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    if (!aiResponse) return;
    setTypedResponse("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < aiResponse.length) {
        setTypedResponse(aiResponse.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setStep("form"), 600);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [aiResponse]);

  const handleAskAI = async () => {
    if (!inputVal.trim()) return;
    setStep("loading");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are the voice of BUILDWITHVIO First Build, a hands-on developer cohort run by Victor Ogabor, a self-taught Nigerian developer who built a live WhatsApp AI chatbot entirely from his Android phone with no laptop and no mentor. When someone tells you what they want to build, write 2 to 3 punchy, energetic sentences that connect their specific project to what First Build teaches: real tools, deployment, APIs, code structure, and shipping real things. Be bold, specific, and speak directly to the builder. Always end with exactly this sentence: "This is exactly what First Build is for." Keep the total response under 75 words. Do not use the word fluff. Do not use dashes.`,
          messages: [{ role: "user", content: `I want to build: ${inputVal}` }]
        })
      });
      const data = await res.json();
      const text = data.content.find(b => b.type === "text")?.text || "";
      setAiResponse(text);
      setStep("response");
    } catch {
      setAiResponse(`Building ${inputVal} means learning to structure code that works, connect real APIs, and deploy something live. First Build takes you through every step with your hands on the keyboard the whole time. This is exactly what First Build is for.`);
      setStep("response");
    }
  };

  const handleJoin = async () => {
    if (!name.trim() || !whatsapp.trim()) return;
    try {
      await addDoc(collection(db, "firstbuild-leads"), {
        name,
        whatsapp,
        project: inputVal,
        time: new Date().toISOString()
      });
    } catch {}
    setStep("done");
  };

  const isResponseVisible = step === "response" || step === "form" || step === "done";

  if (showSplash) {
    return (
      <div style={{ position: "relative", minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "24px 20px", fontFamily: "'JetBrains Mono', monospace" }}>
        <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.55 }} />
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: "560px" }}>
          <div style={{ fontSize: "72px", marginBottom: "8px", animation: "floatUp 1s ease forwards" }}>🎉</div>
          <p style={{ color: "rgba(255,107,0,0.7)", fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px" }}>April 2026</p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 13vw, 96px)", color: "#FF6B00", lineHeight: 0.9, margin: "0 0 12px", textShadow: "0 0 80px rgba(255,107,0,0.3)" }}>
            Happy New<br />Month
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", letterSpacing: "2px", lineHeight: "2", margin: "20px 0 40px" }}>
            April is a new page.<br />
            Make it count. Build something real.
          </p>
          <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.5), rgba(0,102,255,0.5), transparent)", marginBottom: "40px" }} />
          <button
            onClick={() => setShowSplash(false)}
            style={{ background: "#FF6B00", color: "#000", border: "none", padding: "16px 40px", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: "700", letterSpacing: "3px", cursor: "pointer", textTransform: "uppercase" }}
          >
            Let us Build
          </button>
          <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px", letterSpacing: "2px", marginTop: "40px" }}>BUILDWITHVIO . BY VICTOR OGABOR</p>
        </div>
        <style>{`
          @keyframes floatUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#080808", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "24px 20px", fontFamily: "'JetBrains Mono', monospace" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.55 }} />

      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "620px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        <div style={{ background: "rgba(255,107,0,0.12)", border: "1px solid rgba(255,107,0,0.35)", color: "#FF6B00", fontSize: "10px", letterSpacing: "4px", padding: "5px 16px", marginBottom: "28px", textTransform: "uppercase" }}>
          Cohort 01 . 2026
        </div>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(68px, 14vw, 110px)", color: "#FF6B00", lineHeight: 0.88, letterSpacing: "2px", textAlign: "center", margin: 0, textShadow: "0 0 80px rgba(255,107,0,0.25)" }}>
          BUILDWITHVIO
        </h1>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(30px, 6.5vw, 50px)", color: "transparent", WebkitTextStroke: "1.5px #0066FF", letterSpacing: "8px", textAlign: "center", margin: "6px 0 20px" }}>
          FIRST BUILD
        </h2>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", letterSpacing: "3px", textAlign: "center", marginBottom: "44px", textTransform: "uppercase" }}>
          Stop watching tutorials. Start shipping real projects.
        </p>

        <div style={{ width: "100%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,107,0,0.5), rgba(0,102,255,0.5), transparent)", marginBottom: "40px" }} />

        {step !== "done" && (
          <>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "14px", textAlign: "center" }}>
              What do you want to build?
            </p>
            <div style={{ display: "flex", width: "100%", gap: 0 }}>
              <input
                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,107,0,0.28)", borderRight: "none", color: "#fff", padding: "14px 18px", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", outline: "none", opacity: isResponseVisible ? 0.45 : 1 }}
                placeholder="a chatbot, a portfolio, an e-commerce store..."
                value={inputVal}
                onChange={e => !isResponseVisible && setInputVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && step === "hero" && handleAskAI()}
                disabled={isResponseVisible}
              />
              <button
                style={{ background: step === "loading" ? "rgba(255,107,0,0.5)" : "#FF6B00", color: "#000", border: "none", padding: "14px 22px", fontSize: "11px", fontFamily: "'JetBrains Mono', monospace", fontWeight: "700", letterSpacing: "2px", cursor: isResponseVisible ? "default" : "pointer", textTransform: "uppercase", opacity: isResponseVisible ? 0.45 : 1 }}
                onClick={() => step === "hero" && handleAskAI()}
                disabled={isResponseVisible}
              >
                {step === "loading" ? "..." : "Build It"}
              </button>
            </div>
          </>
        )}

        {step === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginTop: "32px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 8, height: 8, background: "#FF6B00", borderRadius: "50%", animation: `pulse 0.9s ease-in-out ${i * 0.18}s infinite alternate` }} />
              ))}
            </div>
            <p style={{ color: "rgba(255,107,0,0.55)", fontSize: "10px", letterSpacing: "3px", margin: 0 }}>ANALYZING YOUR BUILD...</p>
          </div>
        )}

        {isResponseVisible && step !== "done" && (
          <div style={{ background: "rgba(0,102,255,0.07)", border: "1px solid rgba(0,102,255,0.22)", padding: "22px 24px", width: "100%", marginTop: "28px", boxSizing: "border-box" }}>
            <div style={{ color: "#0066FF", fontSize: "9px", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "12px" }}>VIO says</div>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "13px", lineHeight: "1.85", margin: 0 }}>
              {typedResponse}
              {step === "response" && <span style={{ color: "#FF6B00", animation: "blink 0.9s infinite" }}>_</span>}
            </p>
          </div>
        )}

        {step === "form" && (
          <div style={{ width: "100%", marginTop: "28px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 6px" }}>Lock in your spot</p>
            <input
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "14px 18px", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", outline: "none", width: "100%", boxSizing: "border-box" }}
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "14px 18px", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", outline: "none", width: "100%", boxSizing: "border-box" }}
              placeholder="WhatsApp number (e.g. 08012345678)"
              value={whatsapp}
              onChange={e => setWhatsapp(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleJoin()}
            />
            <button
              style={{ background: "#FF6B00", color: "#000", border: "none", padding: "16px", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", fontWeight: "700", letterSpacing: "3px", cursor: "pointer", textTransform: "uppercase", width: "100%", marginTop: "4px" }}
              onClick={handleJoin}
            >
              Join First Build
            </button>
          </div>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "32px 0 16px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid #FF6B00", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "28px" }}>
              ✓
            </div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "52px", color: "#FF6B00", margin: "0 0 16px", letterSpacing: "2px" }}>You are in.</h3>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", letterSpacing: "2px", lineHeight: "2", margin: 0 }}>
              Welcome to BUILDWITHVIO First Build.<br />
              Victor will reach out on WhatsApp soon.<br />
              Get ready to ship something real.
            </p>
          </div>
        )}

        <p style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px", letterSpacing: "2px", marginTop: "48px", textAlign: "center" }}>
          BUILDWITHVIO . BY VICTOR OGABOR
        </p>
      </div>

      <style>{`
        @keyframes pulse { from { opacity: 0.25; transform: scale(0.75); } to { opacity: 1; transform: scale(1.25); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        input::placeholder { color: rgba(255,255,255,0.18); }
        input:focus { border-color: rgba(255,107,0,0.55) !important; }
      `}</style>
    </div>
  );
}
