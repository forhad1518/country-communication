import cloudinary from "@/app/lib/cloudinary";

export async function POST(req) {
    let urls = []
    try {
        const data = await req.formData();
        const files = data.getAll("files");
        const fileNames = data.getAll("fileNames");

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = fileNames[i];

            if (!file) {
                return Response.json({ success: false, message: "No file" });
            }

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "portfolio-multiple", public_id: fileName },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            urls.push(result.secure_url);
        }

        return Response.json({
            success: true,
            urls,
        });
    } catch (err) {
        return Response.json({ success: false, message: err.message });
    }
}