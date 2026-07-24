import { useRef } from "react";
import useNavDarkZone from "../hooks/useNavDarkZone.js";

export default function Hero() {
  const darkZoneRef = useRef(null);
  useNavDarkZone(darkZoneRef);

  return (
    <header id="home" style={{ position: "relative", background: "#fff", paddingTop: 64 }}>
      <div
        ref={darkZoneRef}
        className="bf-hero-zone"
        style={{
          background: "#0A0A0A",
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 48px",
        }}
      >
        <div
          className="bf-hero-box"
          style={{
            position: "relative",
            width: "min(92vw, 2200px, calc((100vh - 264px) * 1460 / 660))",
            aspectRatio: "1460/660",
            borderRadius: 0,
            overflow: "hidden",
            background: "#0A0A0A",
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          >
            <source src="/videos/파도타기영상.mp4" type="video/mp4" />
          </video>
          {/* headline */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <h1
              className="bf-hero-h"
              style={{
                margin: 0,
                textAlign: "center",
                color: "#fff",
                fontWeight: 500,
                fontSize: "clamp(20px, 3.4vw, 44px)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                opacity: 0,
                animation: "revU 1s .15s ease both",
              }}
            >
              신뢰할 수 있는 디지털자산의 기반을 만듭니다.
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
