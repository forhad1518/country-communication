"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
// import handleImage from "@/app/lib/upload.imageS"
import axios from "axios";
import SubmitLoading from "@/components/skeleton/SubmitLoading";
import { TableSkeleton } from "@/components/skeleton/TableSkeleton";
import slugify from "@/utils/slugify"
import uploadFiles from "@/helpers/upload.image";

export default function ExhibitionPage() {
    const [Loading, setLoading] = useState(true);
    const [skeletonLoading, setSkeletonLoading] = useState(false);

    const [preview, setPreview] = useState<string | null>(null);
    const [data, setData] = useState<any[]>([]);

    // get all exhibitions
    useEffect(() => {
        setLoading(true);
        const fatchExibitions = async () => {
            try {
                const res = await axios.get("/api/exhibition");
                setData(res.data.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                alert("Error fetching exhibitions");
                setLoading(false);
            }
        }
        fatchExibitions();
    }, [data.length])

    // delete exhibition
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this exhibition?")) return;
        setSkeletonLoading(true);
        try {
            await axios.delete("/api/exhibition", { data: { id } });
            setData(prev => prev.filter(item => item._id !== id));
            setSkeletonLoading(false);
        } catch (error) {
            console.error(error);
            alert("Error deleting exhibition");
            setSkeletonLoading(false);
        }
    };
    // Preview image before upload
    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }
    // submit exhibition data
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSkeletonLoading(true);

        const form = e.currentTarget;
        const formData = new FormData(form);

        const exhibitionName = formData.get("exhibiton_name")?.toString() ?? "";
        const location = formData.get("location")?.toString() ?? "";
        const description = formData.get("description")?.toString() ?? "";

        const file = formData.get("logo") as File | null;
        if (!file) return alert("Please upload an image");

        try {
            // Upload image and get URL
            const imageUrl = await uploadFiles({
                type: "single",
                files: file,
                slug: slugify(exhibitionName),
                api: "/api/upload/image",
                // folder: "exhibition",
            });

            // Prepare final data
            const newData = {
                exhibitionName,
                location,
                description,
                logo: imageUrl,
            };

            // Save in DB
            const response = await axios.post("/api/exhibition", newData);
            setData(prev => [...prev, response.data.data]);
            setPreview(null);
            form.reset();
            setSkeletonLoading(false);

        } catch (error) {
            console.error(error);
            alert("Error occurred");
            setSkeletonLoading(false);
        }
    };

    return (
        <div className="space-y-8">

            {/* FORM */}
            {
                skeletonLoading ? (<SubmitLoading />) : (<div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border">

                    <h2 className="text-lg md:text-xl font-semibold mb-5 text-gray-700">
                        Add Exhibition
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <input
                            type="text"
                            placeholder="Exhibition Name"
                            required={true}
                            name="exhibiton_name"
                            className="border p-3 rounded-lg focus:ring-2 focus:ring-primary"
                        />

                        <input
                            type="text"
                            placeholder="Location"
                            required={true}
                            name="location"
                            className="border p-3 rounded-lg focus:ring-2 focus:ring-primary"
                        />

                        <input
                            type="text"
                            placeholder="Description"
                            required={true}
                            name="description"
                            className="border p-3 rounded-lg focus:ring-2 focus:ring-primary"
                        />

                        {/* IMAGE UPLOAD */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm text-gray-600">Upload Exhibition logo</label>

                            <input
                                type="file"
                                accept="image/*"
                                required={true}
                                name="logo"
                                onChange={(e) => handleImage(e)}
                                className="border p-2 rounded-lg"
                            />

                            {preview && (
                                <Image
                                    src={preview}
                                    alt="preview"
                                    width={100}
                                    height={80}
                                    className="rounded object-cover"
                                />
                            )}
                        </div>

                        <button
                            type="submit"
                            className="md:col-span-2 bg-primary text-white py-3 rounded-lg hover:bg-primary-hover transition cursor-pointer"
                        >
                            Add Exhibition
                        </button>

                    </form>
                </div>)
            }

            {/* TABLE */}
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border">

                <h2 className="text-lg md:text-xl font-semibold mb-5 text-gray-700">
                    All Exhibitions
                </h2>

                {/* MOBILE CARD VIEW */}
                <div className="md:hidden space-y-4">
                    {data.length === 0 && (
                        <p className="text-center text-gray-400">No exhibition added</p>
                    )}

                    {data.map((item, i) => (
                        <div key={item._id} className="border p-4 rounded-lg">

                            <div className="flex gap-3 items-center">
                                <Image
                                    src={item.logo}
                                    alt="img"
                                    width={60}
                                    height={60}
                                    className="rounded object-cover"
                                />

                                <div>
                                    <p className="font-semibold">{item.exhibitionName}</p>
                                    <p className="text-sm text-gray-500">{item.location}</p>
                                </div>
                            </div>

                            <div className="flex justify-between mt-3 text-sm">
                                <span>{item.description}</span>

                                <div className="space-x-2">
                                    <button className="px-3 py-1 bg-accent text-white rounded">
                                        Edit
                                    </button>
                                    <button className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer" onClick={() => handleDelete(item._id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* DESKTOP TABLE */}
                {
                    Loading ? (
                        <TableSkeleton />
                    ) : (<div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left min-w-175">

                            <thead>
                                <tr className="text-gray-500 border-b">
                                    <th className="py-3">#</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Description</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                
                                {data.map((item, i) => (
                                    <tr key={item._id} className="border-b hover:bg-gray-50">

                                        <td className="py-3">{i + 1}</td>

                                        <td>
                                            <Image
                                                src={item.logo}
                                                alt="img"
                                                width={90}
                                                height={50}
                                                className="rounded object-cover h-10"
                                            />
                                        </td>

                                        <td>{item.exhibitionName}</td>
                                        <td>{item.location}</td>
                                        <td>{item.description}</td>

                                        <td className="text-center space-x-2">
                                            <button className="px-3 py-1 text-sm bg-accent text-white rounded">
                                                Edit
                                            </button>
                                            <button className="px-3 py-1 text-sm bg-red-500 text-white rounded cursor-pointer"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>)
                }

            </div>
        </div>
    );
}