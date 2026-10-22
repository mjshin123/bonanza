import NewsListPage from "../components/NewsListPage.jsx";
import { noticeItems } from "../data/notices.js";

export default function Notices() {
  return (
    <NewsListPage
      breadcrumbLabel="공지사항"
      heading="Notice."
      searchPlaceholder="공지사항 내 검색"
      items={noticeItems}
      getItemPath={(item) => `/notice/${item.id}`}
    />
  );
}
