import { useEffect } from "react";
import { useLocation } from "react-router-dom";
// 버전 전환: CrystalCubeField3D(두께 기반 유리) / GlassCubeField3D(유리 재질+Bloom) / CoinCubeField3D(코인 큐브) / BlockField3D(최초 버전)
import BlockField3D from "../components/CrystalCubeField3D.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import Solutions from "../components/Solutions.jsx";
import Sectors from "../components/Sectors.jsx";
import Tech from "../components/Tech.jsx";
import Group from "../components/Group.jsx";
import Network from "../components/Network.jsx";
import News from "../components/News.jsx";
import { scrollToAnchor } from "../lib/scroll.js";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const id = location.state?.scrollTo;
    if (id) requestAnimationFrame(() => scrollToAnchor(id));
  }, [location.state]);

  return (
    <>
      <BlockField3D />
      <Hero />
      <About />
      <Solutions />
      <Sectors />
      <Tech />
      <Group />
      <Network />
      <News />
    </>
  );
}
