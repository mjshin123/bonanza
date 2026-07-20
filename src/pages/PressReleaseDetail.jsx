import NewsDetailPage from "../components/NewsDetailPage.jsx";
import { newsItems } from "../data/news.js";

export default function PressReleaseDetail() {
  return <NewsDetailPage items={newsItems} listPath="/보도자료" documentTitleSuffix="Bonanza Factory" />;
}
