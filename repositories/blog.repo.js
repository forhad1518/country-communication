import blog from "../models/blog";

export const createBlog = async (data) => {
    try {
        const newBlog = new blog(data);
        await newBlog.save();
        return newBlog;
    } catch (error) {
        throw new Error("Error creating blog: " + error.message);
    }
};

export const getAllBlogs = async () => {
    try {
        const blogs = await blog.find().sort({ createdAt: -1 });
        return blogs;
    } catch (error) {
        throw new Error("Error fetching blogs: " + error.message);
    }
};

export const getBlogById = async (id) => {
    try {
        const foundBlog = await blog.findById(id);
        if (!foundBlog) {
            throw new Error("Blog not found");
        }
        return foundBlog;
    } catch (error) {
        throw new Error("Error fetching blog: " + error.message);
    }
};

export const updateBlog = async (id, data) => {
    try {
        const updatedBlog = await blog.findByIdAndUpdate(id, data, { new: true });
        if (!updatedBlog) {
            throw new Error("Blog not found");
        }
        return updatedBlog;
    } catch (error) {
        throw new Error("Error updating blog: " + error.message);
    }
};

export const deleteBlog = async (id) => {
    try {
        const deletedBlog = await blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            throw new Error("Blog not found");
        }
        return deletedBlog;
    } catch (error) {
        throw new Error("Error deleting blog: " + error.message);
    }
};