import axios from "axios";

type uploadType = "single" | "multiple";

const uploadFiles = async ({type, files, slug, api} : {type: uploadType, files: File | File [], slug: string, api: string}) => {
    const formData = new FormData();
    if(type === "single") {
        const file = files as File;
        formData.append("file", file);
        formData.append("fileName", `${Date.now()}_${slug}`);
    } else {
        (files as File[]).forEach((file, index) => {
            formData.append("files", file);
            formData.append(`fileNames[${index}]`, `${Date.now()}_${slug}_${index}`);
        });
    }
   const response = await axios.post(api, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    if(type === "single") return response.data.url;
    else return response.data.urls;
};

export default uploadFiles;