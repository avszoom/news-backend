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

export async function deleteRecords(rowsToKeep: number): Promise<number> {
    const recordDeleted = await sql`delete from news
    WHERE news.id NOT IN (
        SELECT id
        FROM (
            SELECT id
            FROM news
            ORDER BY publish_time DESC
            LIMIT ${rowsToKeep}
        ) AS subquery
    );`;
    return recordDeleted.rowCount;
}