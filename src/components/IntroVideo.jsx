import { useCallback, useRef, useState } from "react";
import useNavDarkZone from "../hooks/useNavDarkZone.js";
import { HeroWithVideo, VideoModal } from "@/components/ui/hero-with-video.jsx";

// section right under the 3D block hero: copy on the left, looping video on the right,
// "소개 영상 보기" opens the full intro video with sound
// right side: TranSafer, then TranSight, then again from the top
const LOOP_VIDEO = ["/videos/transafer.mp4", "/videos/transight.mp4"];
// both clips are 1920×1080 with black bars (logo in the top one): picture is rows 128–951,
// trimmed with a 2px margin → visible band 1920×820
const LOOP_CROP = { width: 1920, height: 1080, top: 130, bottom: 130 };
// 보난자팩토리_홍보영상_본편_FHD(저용량)_[KOR].mp4 re-encoded for the web
// (H.264 CRF 24, AAC 128k, faststart so it starts streaming right away)
const INTRO_VIDEO = "/videos/bonanza-intro-kor.mp4";

export default function IntroVideo() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useNavDarkZone(ref);

  return (
    <>
      <HeroWithVideo
        sectionRef={ref}
        title={
          <>
            위험한 자금 흐름을 먼저 찾아
            <br />
            안전한 거래를 연결합니다
          </>
        }
        lines={["위험 주소 식별부터 추적, 공조, 차단까지.", "하나로 연결하는 가상자산 통합 AML 솔루션."]}
        buttonLabel="소개 영상 보기"
        onPlay={() => setOpen(true)}
        videoSrc={LOOP_VIDEO}
        videoCrop={LOOP_CROP}
        // "SCROLL" cue stays fixed over the block hero and this section, gone once we move on
        scrollHint
      />
      <VideoModal open={open} onClose={close} src={INTRO_VIDEO} title="보난자팩토리 소개 영상" />
    </>
  );
}
