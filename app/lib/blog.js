import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "content/blog");

export function getAllPosts() {
    const files = fs.readdirSync(postsDirectory);

    return files.map((file) => {
        const slug = file.replace(".md", "");
        const fullPath = path.join(postsDirectory, file);
        const content = fs.readFileSync(fullPath, "utf8");
        const matterResult = matter(content);

        return {
            slug,
            ...matterResult.data,
        };
    });
}

export async function getPost(slug) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const content = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(content);

    const processed = await remark()
        .use(html)
        .process(matterResult.content);

    return {
        slug,
        contentHtml: processed.toString(),
        ...matterResult.data,
    };
}