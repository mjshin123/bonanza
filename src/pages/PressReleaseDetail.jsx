import NewsDetailPage from "../components/NewsDetailPage.jsx";
import { newsItems } from "../data/news.js";

export default function PressReleaseDetail() {
  return <NewsDetailPage items={newsItems} listPath="/press" />;
}
