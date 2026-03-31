import exhibition from "../models/exhibition";

export async function createExhibition(data) {
    try {
        const newExhibition = new exhibition(data);
        const savedExhibition = await newExhibition.save();
        return savedExhibition;
    } catch (error) {
        throw new Error("Error creating exhibition: " + error.message);
    }
}

export async function getAllExhibitions() {
    try {
        const exhibitions = await exhibition.find();
        return exhibitions;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getExhibitionById(id) {
    try {
        const foundExhibition = await exhibition.findById(id);
        if (!foundExhibition) {
            throw new Error("Exhibition not found");
        }
        return foundExhibition;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function updateExhibition(id, data) {
    try {
        const updatedExhibition = await exhibition.findByIdAndUpdate(id, data, { new: true });
        if (!updatedExhibition) {
            throw new Error("Exhibition not found");
        }
        return updatedExhibition;
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function deleteExhibition(id) {
    try {
        const deletedExhibition = await exhibition.findByIdAndDelete(id);
        if (!deletedExhibition) {
            throw new Error("Exhibition not found");
        }
        return deletedExhibition;
    } catch (error) {
        throw new Error(error.message);
    }
};