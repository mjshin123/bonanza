import NewsListPage from "../components/NewsListPage.jsx";
import { noticeItems } from "../data/notices.js";

export default function Notices() {
  return (
    <NewsListPage
      documentTitle="공지사항 | Bonanza Factory"
      breadcrumbLabel="공지사항"
      heading="Notice."
      searchPlaceholder="공지사항 내 검색"
      items={noticeItems}
      getItemPath={(item) => `/공지사항/${item.id}`}
    />
  );
}
