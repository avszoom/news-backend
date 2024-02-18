const NewsAPILibrary = require('newsapi');
import News from "../model/News";
import {getCurrentDate, getPastDate} from '../utils/dateLib';

export default class NewsAPI {
    private news_obj;

    constructor() {
        this.news_obj = new NewsAPILibrary(process.env.NEWS_API_KEY);
    } 

    public async getTodaysNews(fromDate: string, toDate: string): Promise<Array<News>>  {
        console.log(fromDate);
        console.log(toDate);
        const resp = await this.news_obj.v2.everything({
            sources: 'bbc-news,the-verge',
            domains: 'bbc.co.uk, techcrunch.com',
            from: fromDate,
            to: toDate,
            language: 'en',
            sortBy: 'relevancy',
            page: 2
          });
        const news = resp.articles.map((article: any) => {
            return new News(article.source.name, article.author,article.title,article.description,
                article.url,article.urlToImage,article.content,article.publishedAt)
        })
        return news;
    }
}