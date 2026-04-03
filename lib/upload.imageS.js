import axios from "axios";

const handleImageS = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await axios.post("/api/upload", formData);
        return res.data.url;

    } catch (err) {
        console.log(err);
    }
};

export default handleImageS;
