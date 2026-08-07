import exhibition from "../models/exhibition";

// Helper to safely convert date strings to Date objects
const parseDates = (data) => {
  if (data.startDate && typeof data.startDate === "string") {
    data.startDate = new Date(data.startDate);
  }
  if (data.endDate && typeof data.endDate === "string") {
    data.endDate = new Date(data.endDate);
  }
  return data;
};

export async function createExhibition(data) {
  try {
    // Ensure dates are actual Date objects before saving
    const processedData = parseDates(data);
    const newExhibition = new exhibition(processedData);
    const savedExhibition = await newExhibition.save();
    return savedExhibition;
  } catch (error) {
    throw new Error("Error creating exhibition: " + error.message);
  }
}

export async function getAllExhibitions() {
  try {
    const exhibitions = await exhibition.find().sort({ createdAt: -1 });
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
    // Convert date strings to Date objects if present
    const processedData = parseDates(data);
    const updatedExhibition = await exhibition.findByIdAndUpdate(
      id,
      processedData,
      {
        new: true,
        runValidators: true,
      },
    );
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
}
