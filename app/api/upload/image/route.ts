import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
    try {
        const data = await request.formData();

        const file = data.get("file") as File | null;
        const files = data.getAll("files") as File[];
        const fileName = data.get("fileName") as string;
        const fileNames = data.getAll("fileNames") as string[];

        // MULTIPLE FILES
        if (files && files.length > 0) {
            const urls = await Promise.all(
                files.map(async (file, i) => {
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);

                    const result: any = await new Promise((resolve, reject) => {
                        cloudinary.uploader.upload_stream(
                            {
                                folder: "portfolio-gallery",
                                public_id:
                                    fileNames[i] || `file_${Date.now()}_${i}`,
                            },
                            (error, res) => {
                                if (error) reject(error);
                                else resolve(res);
                            }
                        ).end(buffer);
                    });

                    return result.secure_url;
                })
            );

            return Response.json({ success: true, urls });
        }

        // SINGLE
        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const result: any = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "exhibition",
                        public_id: fileName || `file_${Date.now()}`,
                    },
                    (error, res) => {
                        if (error) reject(error);
                        else resolve(res);
                    }
                ).end(buffer);
            });

            return Response.json({
                success: true,
                url: result.secure_url,
            });
        }

        return Response.json(
            { success: false, message: "No file provided" },
            { status: 400 }
        );
    } catch (err) {
        return Response.json(
            { success: false, message: "File upload failed" },
            { status: 500 }
        );
    }
}