import NewsAPI from "../apis/fetchNews";
import { insertNews, lastInsertedRecordTime } from "../orm/orm";

export default async function updateDatabase(): Promise<number> {
    const lastRecordTime = await lastInsertedRecordTime();
    const news = new NewsAPI();
    const fromDate = lastRecordTime;
    const toDate = "";
    const articles = await news.getTodaysNews(fromDate,toDate);
    await insertNews(articles);
    return articles.length;
}