import NewsDetailPage from "../components/NewsDetailPage.jsx";
import { noticeItems } from "../data/notices.js";

export default function NoticeDetail() {
  return <NewsDetailPage items={noticeItems} listPath="/notice" />;
}
