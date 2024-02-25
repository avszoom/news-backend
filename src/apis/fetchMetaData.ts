import { GoogleGenerativeAI } from "@google/generative-ai";

export type ArticleMetaData = {
    title: string,
    desc: string,
    country: string,
    is_updated: number,
    id: number,
};

export default async function fetchMetaData(title:string, desc: string, long_desc: string,id: number): Promise<ArticleMetaData> {
    const key = process.env.GOOGLE_API_KEY ?? "";
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const prompt = `
        You are an editor. Consider an article with title: ${title} ,short description: 
        ${desc} and long description as ${long_desc}. Generate a fresh title and detail description for news which is accurate but same 
        time very catchy to read. Return response as json as below - {title: '', desc: '', country: '', category: ''}
    `
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const json = response.text().replace(/```json|```/g, '').trim();
    const res = JSON.parse(json) as ArticleMetaData;
    res.id = id;
    return res;
}