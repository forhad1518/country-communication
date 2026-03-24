import portfolio from "../models/portfolio";

export const createBlog = async (data) => {
    try {
        const newPortfolio = new portfolio(data);
        await newPortfolio.save();
        return newPortfolio;
    } catch (error) {
        throw new Error("Error creating portfolio: " + error.message);
    }
};

export const getAllPortfolios = async () => {
    try {
        const portfolios = await portfolio.find().sort({ createdAt: -1 });
        return portfolios;
    } catch (error) {
        throw new Error("Error fetching portfolios: " + error.message);
    }
};

export const getPortfolioById = async (id) => {
    try {
        const foundPortfolio = await portfolio.findById(id);
        if (!foundPortfolio) {
            throw new Error("Portfolio not found");
        }
        return foundPortfolio;
    } catch (error) {
        throw new Error("Error fetching portfolio: " + error.message);
    }
};

export const updatePortfolio = async (id, data) => {
    try {
        const updatedPortfolio = await portfolio.findByIdAndUpdate(id, data, { new: true });
        if (!updatedPortfolio) {
            throw new Error("Portfolio not found");
        }
        return updatedPortfolio;
    } catch (error) {
        throw new Error("Error updating portfolio: " + error.message);
    }
};

export const deletePortfolio = async (id) => {
    try {
        const deletedPortfolio = await portfolio.findByIdAndDelete(id);
        if (!deletedPortfolio) {
            throw new Error("Portfolio not found");
        }
        return deletedPortfolio;
    } catch (error) {
        throw new Error("Error deleting portfolio: " + error.message);
    }
};