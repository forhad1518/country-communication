import { createPortfolio } from "../repositories/portfolio.repo";
import { slugify } from "../utils/slugify";

export const createPortfolioService = async (data) => {
    try {
        const slug = slugify(data.title);
        const portfolioData = { ...data, slug };
        const newPortfolio = await createPortfolio(portfolioData);
        return newPortfolio;
    } catch (error) {
        throw new Error("Error creating portfolio: " + error.message);
    }
};  