import axios from "axios";

type uploadType = "single" | "multiple";

const uploadFiles = async ({type, files, slug, api} : {type: uploadType, files: File | File [], slug: string, api: string}) => {
    
}