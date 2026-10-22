import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import CompanyIntro from "./pages/CompanyIntro.jsx";
import GroupIntro from "./pages/GroupIntro.jsx";
import SolutionIntro from "./pages/SolutionIntro.jsx";
import ComplianceInfra from "./pages/ComplianceInfra.jsx";
import History from "./pages/History.jsx";
import PressReleases from "./pages/PressReleases.jsx";
import PressReleaseDetail from "./pages/PressReleaseDetail.jsx";
import Notices from "./pages/Notices.jsx";
import NoticeDetail from "./pages/NoticeDetail.jsx";
import useScrollReveal from "./hooks/useScrollReveal.js";
import { NavThemeProvider } from "./context/NavThemeContext.jsx";

export default function App() {
  useScrollReveal();

  return (
    <NavThemeProvider>
      <div style={{ position: "relative", overflow: "clip" }}>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/회사소개" element={<CompanyIntro />} />
          <Route path="/계열사-소개" element={<GroupIntro />} />
          <Route path="/TranSight" element={<SolutionIntro slug="transight" />} />
          <Route path="/TranSafer" element={<SolutionIntro slug="transafer" />} />
          <Route path="/ComplianceInfra" element={<ComplianceInfra />} />
          <Route path="/연혁" element={<History />} />
          <Route path="/보도자료" element={<PressReleases />} />
          <Route path="/보도자료/:id" element={<PressReleaseDetail />} />
          <Route path="/공지사항" element={<Notices />} />
          <Route path="/공지사항/:id" element={<NoticeDetail />} />
        </Routes>
        <Footer />
      </div>
    </NavThemeProvider>
  );
}
