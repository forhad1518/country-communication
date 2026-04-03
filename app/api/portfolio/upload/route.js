import cloudinary from "@/app/lib/cloudinary";

export async function POST(req) {
    try {
        const data = await req.formData();
        const file = data.get("file");
        const fileName = data.get("fileName");

        if (!file) {
            return Response.json({ success: false, message: "No file" });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "portfolio" , public_id: fileName},
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return Response.json({
            success: true,
            url: result.secure_url,
        });

    } catch (err) {
        return Response.json({ success: false, message: err.message });
    }
}