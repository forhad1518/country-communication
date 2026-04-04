"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export interface PortfolioItem {
  designImage: string;
  title: string;
  exhibition_name: string;
  projectInfo?: {
    clientName?: string;
  };
}

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioItem[]>([]);
  useEffect(() => {
    // fetch portfolio data from api
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/portfolio");
        setData(res.data.data || []);
      } catch (err) {
        console.error("Error fetching portfolio data:", err);
      }
    };
    fetchData();
  }, [])
  console.log("Fetched portfolio data:", data);
  return (
    <div className="space-y-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">
          All Portfolio
        </h1>

        <Link
          href="/admin/portfolio/add"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover"
        >
          + Add Portfolio
        </Link>
      </div>

      {/* TABLE / CARD */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">

        {/* MOBILE */}
        <div className="md:hidden space-y-4">
          {data.length === 0 && (
            <p className="text-center text-gray-400">No portfolio found</p>
          )}

          {data.map((item, i) => (
            <div key={i} className="border p-4 rounded-lg my-2">

              <div className="flex gap-3">
                <Image
                  src={item.designImage}
                  alt="img"
                  width={80}
                  height={60}
                  className="rounded object-cover"
                />

                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.exhibition_name}</p>
                </div>
              </div>

              <div className="flex justify-between mt-3 text-sm">
                <span>{item.projectInfo?.clientName}</span>

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

        {/* DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left min-w-200">

            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-3">#</th>
                <th>Image</th>
                <th>Title</th>
                <th>Exhibition</th>
                <th>Client</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">

                  <td>{i + 1}</td>

                  <td>
                    <Image
                      src={item.designImage}
                      alt="img"
                      width={60}
                      height={50}
                      className="rounded my-1"
                    />
                  </td>

                  <td>{item.title}</td>
                  <td>{item.exhibition_name}</td>
                  <td>{item.projectInfo?.clientName}</td>

                  <td className="space-x-2">
                    <button className="px-3 py-1 bg-accentColor text-white rounded">
                      Edit
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded">
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