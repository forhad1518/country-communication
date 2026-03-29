"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { axiosInstance } from "@/app/lib/axios";
// import handleImage from "@/app/lib/upload.imageS"
import axios from "axios";

export default function ExhibitionPage() {

    const [preview, setPreview] = useState(null);
    const [data, setData] = useState([]);

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }

    const handleSubmit = async (e: { preventDefault: () => void; target: { exhibiton_name: { value: any; }; location: { value: any; }; description: { value: any; }; logo: { files: any[]; }; reset: () => void; }; }) => {
        e.preventDefault();

        const exhibitionName = e.target.exhibiton_name.value;
        const location = e.target.location.value;
        const description = e.target.description.value;

        const file = e.target.logo?.files?.[0];
        if (!file) return alert("Please upload an image");

        try {
            // Upload image first
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post("/api/upload", formData);
            const imageUrl = res.data.url;

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
            console.log(response.data.data);
            setPreview(null);
            e.target.reset();

        } catch (error) {
            console.error(error);
            alert("Error occurred");
        }
    };

    return (
        <div className="space-y-8">

            {/* FORM */}
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border">

                <h2 className="text-lg md:text-xl font-semibold mb-5 text-gray-700">
                    Add Exhibition
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="text"
                        placeholder="Exhibition Name"
                        name="exhibiton_name"
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-primaryColor"
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        name="location"
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-primaryColor"
                    />

                    <input
                        type="text"
                        placeholder="Description"
                        name="description"
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-primaryColor"
                    />

                    {/* IMAGE UPLOAD */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">Upload Exhibition logo</label>

                        <input
                            type="file"
                            accept="image/*"
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
                        className="md:col-span-2 bg-primaryColor text-white py-3 rounded-lg hover:bg-primaryColor-hover transition"
                    >
                        Add Exhibition
                    </button>

                </form>
            </div>

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
                        <div key={item.id} className="border p-4 rounded-lg">

                            <div className="flex gap-3 items-center">
                                <Image
                                    src={item.image || "https://via.placeholder.com/80"}
                                    alt="img"
                                    width={70}
                                    height={60}
                                    className="rounded object-cover"
                                />

                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">{item.location}</p>
                                </div>
                            </div>

                            <div className="flex justify-between mt-3 text-sm">
                                <span>{item.description}</span>

                                <div className="space-x-2">
                                    <button className="px-3 py-1 bg-accentColor text-white rounded">
                                        Edit
                                    </button>
                                    <button className="px-3 py-1 bg-red-500 text-white rounded">
                                        Delete
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left min-w-175">

                        <thead>
                            <tr className="text-gray-500 border-b">
                                <th className="py-3">#</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((item, i) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">

                                    <td className="py-3">{i + 1}</td>

                                    <td>
                                        <Image
                                            src={item.image || "https://via.placeholder.com/80"}
                                            alt="img"
                                            width={60}
                                            height={50}
                                            className="rounded object-cover"
                                        />
                                    </td>

                                    <td>{item.name}</td>
                                    <td>{item.location}</td>
                                    <td>{item.description}</td>

                                    <td className="text-center space-x-2">
                                        <button className="px-3 py-1 text-sm bg-accentColor text-white rounded">
                                            Edit
                                        </button>
                                        <button className="px-3 py-1 text-sm bg-red-500 text-white rounded">
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>

            </div>
        </div>
    );
}