import axios from "axios";
import SinglePortfolio from "./SinglePortfolio";
import { getPortfolioBySlug } from "@/repositories/portfolio.repo";

async function getData(slug: string) {
    try {
       const data = await getPortfolioBySlug(slug);
       return data;
    } catch (err) {
        console.error("Error fetching portfolio:", err);
        return null;
    }
}

// SEO Metadata
export async function generateMetadata({ params }: any) {
    const { slug } = await params;
    const data = await getData(slug);

    return {
        title: `${data.title} | Exhibition Booth Design Bangladesh`,
        description:
            data.projectInfo?.projectOverview ||
            "Professional exhibition booth design and trade show booth services in Bangladesh.",

        keywords: [
            ...data.keywords,
            "exhibition booth design",
            "trade show booth Bangladesh",
            "expo stall design",
            "booth contractor Bangladesh",
        ],

        openGraph: {
            title: data.title,
            description: data.projectInfo?.projectOverview,
            images: [data.designImage],
        },
    };
}

export default async function Page({ params }: any) {
    const { slug } = await params;
    const data = await getData(slug);

    return <SinglePortfolio data={data} />;
}