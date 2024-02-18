import News from "../model/News";
import { sql } from '@vercel/postgres';

type PublishTime = {
    max: string;
};

export async function insertNews(news: Array<News>) {
    news.forEach(async (news) => {
        await sql`INSERT INTO news (source, author, title, short_desc, article_url,media_url,
            content,publish_time) VALUES (${news.source}, ${news.author}, ${news.title}, ${news.short_desc}, ${news.article_url}
                ,${news.media_url},${news.content},${news.publish_time})`;
    });
}

export async function lastInsertedRecordTime(): Promise<string> {
    const lastRecord = await sql<PublishTime>`select max(publish_time) from news`;
    if(lastRecord.rowCount < 1)
        return "";
    return lastRecord.rows[0]['max'] as string;
}

export async function fetchNews(news_count: number): Promise<News[]> {
    const articles = await sql<News>`select * from news order by publish_time desc limit ${news_count}`;
    return articles.rows;
}