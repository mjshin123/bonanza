import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import SeoManager from "./components/SeoManager.jsx";
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

function RedirectWithId({ to }) {
  const { id } = useParams();
  return <Navigate to={`${to}/${id}`} replace />;
}

export default function App() {
  useScrollReveal();

  return (
    <NavThemeProvider>
      <div style={{ position: "relative", overflow: "clip" }}>
        <SeoManager />
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<CompanyIntro />} />
          <Route path="/group" element={<GroupIntro />} />
          <Route path="/transight" element={<SolutionIntro slug="transight" />} />
          <Route path="/transafer" element={<SolutionIntro slug="transafer" />} />
          <Route path="/compliance-suite" element={<ComplianceInfra />} />
          <Route path="/history" element={<History />} />
          <Route path="/press" element={<PressReleases />} />
          <Route path="/press/:id" element={<PressReleaseDetail />} />
          <Route path="/notice" element={<Notices />} />
          <Route path="/notice/:id" element={<NoticeDetail />} />

          {/* 예전 한글·대소문자 주소로 공유된 링크는 새 주소로 넘김 */}
          <Route path="/회사소개" element={<Navigate to="/about" replace />} />
          <Route path="/계열사-소개" element={<Navigate to="/group" replace />} />
          <Route path="/연혁" element={<Navigate to="/history" replace />} />
          <Route path="/보도자료" element={<Navigate to="/press" replace />} />
          <Route path="/보도자료/:id" element={<RedirectWithId to="/press" />} />
          <Route path="/공지사항" element={<Navigate to="/notice" replace />} />
          <Route path="/공지사항/:id" element={<RedirectWithId to="/notice" />} />
          <Route path="/compliance-infra" element={<Navigate to="/compliance-suite" replace />} />
          <Route path="/ComplianceInfra" element={<Navigate to="/compliance-suite" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </NavThemeProvider>
  );
}
