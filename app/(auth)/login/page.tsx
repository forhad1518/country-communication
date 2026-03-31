"use client";
import { useState } from "react";
import "@/app/globals.css";

export default function UserAuth() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({email: "", password: ""});

    const validate = () => {
        let err = { email: "", password: ""};

        if (!/\S+@\S+\.\S+/.test(form.email))
            err.email = "Invalid email";
        if (form.password.length < 6)
            err.password = "Password must be at least 6 chars";

        setErrors(err);
        return Object.keys(err).length === 0;
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!validate()) return;

        console.log(form);

        // future api call
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-white px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-5">

                <h1 className="text-3xl font-semibold text-center text-primary">Login</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="******"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm">{errors.password}</p>
                        )}
                    </div>

                    <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-hover transition cursor-pointer">
                        Login
                    </button>
                </form>

            </div>
        </div>
    );
}