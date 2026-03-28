"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { axiosInstance } from "@/app/lib/axios";
import axios from "axios";
export default function ExhibitionPage() {


    const [form, setForm] = useState({
        name: "",
        location: "",
        date: "",
        image: null
    });

    // console.log(form);


    const [preview, setPreview] = useState(null);
    const [data, setData] = useState([]);

    const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post("/api/upload", formData);
            console.log(res.data);
            return res.data.url;

        } catch (err) {
            console.log(err);
        }
    };
    

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const newItem = {
            ...form,
            id: Date.now(),
            image: preview
        };

        setData([newItem, ...data]);

        setForm({
            name: "",
            location: "",
            date: "",
            image: null
        });

        setPreview(null);
        const imgUrl = axios.post("/api/upload", form).then(res => res.data.url).catch(err => console.log(err));
        console.log(imgUrl);
        // axiosInstance.post("/exhibition", newItem)
        //     .then(res => console.log(res.data))
        //     .catch(err => console.log(err));
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

                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-primaryColor"
                    />

                    <input
                        type="text"
                        placeholder="Location"

                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-primaryColor"
                    />

                    <input
                        type="text"
                        placeholder="Description"

                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-primaryColor"
                    />

                    {/* IMAGE UPLOAD */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-600">Upload Exhibition logo</label>

                        <input
                            type="file"
                            accept="image/*"

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
                                <span>{item.date}</span>

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
                                    <td>{item.date}</td>

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