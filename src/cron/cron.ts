import NewsAPI from "../apis/fetchNews";
import { deleteRecords, insertNews, lastInsertedRecordTime } from "../orm/orm";
import { getPastTime } from "../utils/dateLib";

export async function updateDatabase(): Promise<number> {
    const lastRecordTime = await lastInsertedRecordTime();
    const news = new NewsAPI();
    const fromDate = lastRecordTime;
    const toDate = "";
    const articles = await news.getTodaysNews(fromDate,toDate);
    //update short_desc with gen AI summary
    await insertNews(articles);
    return articles.length;
}

export async function removedOldArticles(): Promise<number> {
    const lastRecordTime = await lastInsertedRecordTime();
    const timeToStartDelete = getPastTime(lastRecordTime,1);
    console.log(lastRecordTime);
    console.log(timeToStartDelete);
    const deletedArticles = await deleteRecords(timeToStartDelete);
    return deletedArticles;
}