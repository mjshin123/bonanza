import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Download } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

const ASSET_ROOT = "/downloads/ci";

const logoSets = [
  {
    name: "보난자팩토리",
    englishName: "Bonanza Factory",
    folder: "Bonanza Factory",
    assets: [
      { label: "국문 로고", preview: "Bonanza Factory_국문.png", downloads: [{ file: "Bonanza Factory_국문.png", type: "PNG" }, { file: "Bonanza Factory_국문.jpg", type: "JPG", folder: "JPG" }] },
      { label: "가로형 로고", preview: "Bonanza Factory_좌우.png", downloads: [{ file: "Bonanza Factory_좌우.png", type: "PNG" }, { file: "Bonanza Factory_좌우.jpg", type: "JPG", folder: "JPG" }] },
      { label: "국문 로고 (화이트)", preview: "Bonanza Factory_국문.png", folder: "white", theme: "dark", downloads: [{ file: "Bonanza Factory_국문.png", type: "PNG", folder: "white" }] },
      { label: "가로형 로고 (화이트)", preview: "Bonanza Factory_좌우.png", folder: "white", theme: "dark", downloads: [{ file: "Bonanza Factory_좌우.png", type: "PNG", folder: "white" }] },
    ],
  },
  {
    name: "보난자",
    englishName: "Bonanza",
    folder: "Bonanza",
    assets: [
      { label: "국문 로고", preview: "Bonanza_국문.png", downloads: [{ file: "Bonanza_국문.png", type: "PNG" }, { file: "Bonanza_국문.jpg", type: "JPG", folder: "JPG" }] },
      { label: "가로형 로고", preview: "Bonanza.png", downloads: [{ file: "Bonanza.png", type: "PNG" }, { file: "Bonanza.jpg", type: "JPG", folder: "JPG" }] },
      { label: "국문 로고 (화이트)", preview: "Bonanza_국문.png", folder: "white", theme: "dark", downloads: [{ file: "Bonanza_국문.png", type: "PNG", folder: "white" }] },
      { label: "가로형 로고 (화이트)", preview: "Bonanza.png", folder: "white", theme: "dark", downloads: [{ file: "Bonanza.png", type: "PNG", folder: "white" }] },
    ],
  },
];

function assetPath(set, asset) {
  return encodeURI(`${ASSET_ROOT}/${set.folder}/${asset.folder ?? "PNG"}/${asset.file}`);
}

function LogoCard({ set, asset, isEnglish, open, onToggle }) {
  const preview = assetPath(set, { file: asset.preview, folder: asset.folder });
  return (
    <article className="bf-ci-card">
      <div className={`bf-ci-preview ${asset.theme === "dark" ? "is-dark" : ""}`}>
        <img src={preview} alt={`${set.name} ${asset.label}`} />
      </div>
      <div className="bf-ci-cardbody">
        <h3>{asset.label}</h3>
        <div className="bf-ci-download-wrap">
          <button type="button" className="bf-ci-download" onClick={onToggle} aria-expanded={open}>
            <Download width={16} height={16} />
            {isEnglish ? "Download" : "다운로드"}
            <ChevronDown width={14} height={14} />
          </button>
          {open && (
            <div className="bf-ci-download-menu">
              {asset.downloads.map((download) => {
                const src = assetPath(set, download);
                return <a key={download.file} href={src} download={download.file}>{download.type} <span>{download.file}</span></a>;
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function CiGuide() {
  const { isEnglish } = useLanguage();
  const [openDownload, setOpenDownload] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bf-ci-page">
      <header className="bf-ci-header bf-pad">
        <div className="bf-ci-inner">
          <div className="bf-ci-breadcrumb">
            <Link to="/">{isEnglish ? "Home" : "홈"}</Link><ChevronRight width={15} height={15} /><span>{isEnglish ? "Company" : "기업 개요"}</span><ChevronRight width={15} height={15} /><strong>{isEnglish ? "CI Guide" : "CI 소개"}</strong>
          </div>
          <div className="bf-ci-eyebrow">CORPORATE IDENTITY</div>
          <h1 className="bf-accent">{isEnglish ? "Bonanza Factory CI" : <>보난자팩토리의<br />CI를 소개합니다</>}</h1>
          <p>{isEnglish ? "Download official logo files and learn about the primary color that represents Bonanza Factory." : "보난자팩토리의 공식 로고 파일과 브랜드를 대표하는 전용 색상을 안내합니다."}</p>
        </div>
      </header>

      <main className="bf-ci-inner bf-ci-main">
        <section className="bf-ci-section">
          <div className="bf-ci-sectionhead">
            <div><span>01</span><h2>{isEnglish ? "Logo Downloads" : "CI 다운로드"}</h2></div>
            <p>{isEnglish ? "Choose the appropriate logo type and file format for your intended use. White logos are intended for dark backgrounds." : "사용 환경에 맞는 로고 유형과 파일 형식을 선택해 주세요. 화이트 로고는 어두운 배경에서 사용합니다."}</p>
          </div>
          {logoSets.map((set) => (
            <div key={set.folder} className="bf-ci-logogroup">
              <h2>{isEnglish ? set.englishName : set.name}</h2>
              <div className="bf-ci-grid">
                {set.assets.map((asset) => {
                  const id = `${set.folder}-${asset.label}`;
                  return <LogoCard key={id} set={set} asset={asset} isEnglish={isEnglish} open={openDownload === id} onToggle={() => setOpenDownload(openDownload === id ? null : id)} />;
                })}
              </div>
            </div>
          ))}
        </section>

        <section className="bf-ci-section">
          <div className="bf-ci-sectionhead">
            <div><span>02</span><h2>{isEnglish ? "Primary Color" : "전용 색상"}</h2></div>
            <p>{isEnglish ? "Bonanza Blue is the core color of the brand. Use the RGB value for digital media and CMYK or Pantone values for print." : "보난자 블루는 브랜드를 대표하는 핵심 색상입니다. 디지털 매체에는 RGB 값을, 인쇄물에는 CMYK 또는 팬톤 값을 사용해 주세요."}</p>
          </div>
          <div className="bf-ci-colorcard">
            <div className="bf-ci-color-swatch"><span>Bonanza<br />Blue</span></div>
            <div className="bf-ci-color-values">
              <div><span>RGB</span><strong>22 / 64 / 219</strong><em>#1640DB</em></div>
              <div><span>CMYK</span><strong>90 / 70 / 0 / 0</strong><em>Print</em></div>
              <div><span>PANTONE</span><strong>2387 C</strong><em>Spot color</em></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
