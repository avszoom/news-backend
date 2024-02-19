import News from "../model/News";
import { sql } from '@vercel/postgres';

type PublishTime = {
    max: string;
};

export async function insertNews(news: Array<News>) {
    await sql.query(
        `INSERT INTO news (source, author, title, short_desc, article_url,media_url,
            content,publish_time)
         SELECT source, author, title, short_desc, article_url,media_url,
         content,publish_time FROM json_populate_recordset(NULL::news, $1)`,
        [JSON.stringify(news)]
      );
    console.log("inserted");
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

export async function deleteRecords(publish_time: string): Promise<number> {
    const recordDeleted = await sql`delete from news where publish_time < ${publish_time}`;
    return recordDeleted.rowCount;
}