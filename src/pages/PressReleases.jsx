import NewsListPage from "../components/NewsListPage.jsx";
import { newsItems } from "../data/news.js";

export default function PressReleases() {
  return (
    <NewsListPage
      breadcrumbLabel="보도자료"
      heading="News & events."
      searchPlaceholder="보도자료 내 검색"
      items={newsItems}
      getItemPath={(item) => `/press/${item.id}`}
    />
  );
}
