export default class News {
    source: string = "";
    author: string = "";
    title: string = "";
    short_desc: string = "";
    article_url: string = "";
    media_url: string = "";
    content: string = "";
    publish_time: string = "";

    constructor(source: string,author:string,title:string,short_desc:string,article_url:string,media_url:string,content:string,publish_time:string) {
        this.source = source;
        this.article_url = article_url;
        this.author = author;
        this.content = content;
        this.media_url = media_url;
        this.publish_time = publish_time;
        this.short_desc = short_desc;
        this.title = title;
    }
}