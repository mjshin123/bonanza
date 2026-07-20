import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
