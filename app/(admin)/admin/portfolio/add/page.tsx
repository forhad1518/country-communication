"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import slugify from "@/utils/slugify";
import axios from "axios";
import uploadFiles from "@/helpers/upload.image";
import SubmitLoading from "@/components/skeleton/SubmitLoading";
import parseKeywords from "@/utils/parseKeyword";

export default function AddPortfolio() {
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState<any>({
    design: null,
    live: null,
    gallery: [],
    renders: [],
    real: [],
    mood: [],
    client: null,
  });

  const handleImage = (e: any, type: string) => {
    const files = e.target.files;
    if (!files) return;

    if (type === "design" || type === "live" || type === "client") {
      setPreview((p: any) => ({
        ...p,
        [type]: URL.createObjectURL(files[0]),
      }));
    } else {
      const imgs = Array.from(files).map((f: any) =>
        URL.createObjectURL(f)
      );
      setPreview((p: any) => ({ ...p, [type]: imgs }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const slug = slugify(formData.get("title") as string);
      const keyword = parseKeywords(formData.get("keywords") as string);

      // uploads
      const designImage = await uploadFiles({
        type: "single",
        files: formData.get("designImage") as File,
        slug: `${slug}_design`,
        api: "/api/upload/image",
      });

      const liveImage = await uploadFiles({
        type: "single",
        files: formData.get("liveImage") as File,
        slug: `${slug}_live`,
        api: "/api/upload/image",
      });

      const gallery = await uploadFiles({
        type: "multiple",
        files: formData.getAll("galleryImages") as File[],
        slug: `${slug}_gallery`,
        api: "/api/upload/image",
      });

      const renders = await uploadFiles({
        type: "multiple",
        files: formData.getAll("renders") as File[],
        slug: `${slug}_renders`,
        api: "/api/upload/image",
      });

      const realImages = await uploadFiles({
        type: "multiple",
        files: formData.getAll("realImages") as File[],
        slug: `${slug}_real`,
        api: "/api/upload/image",
      });

      const moodboard = await uploadFiles({
        type: "multiple",
        files: formData.getAll("moodboard") as File[],
        slug: `${slug}_mood`,
        api: "/api/upload/image",
      });

      const clientImage = await uploadFiles({
        type: "single",
        files: formData.get("clientImage") as File,
        slug: `${slug}_client`,
        api: "/api/upload/image",
      });

      const data = {
        title: formData.get("title"),
        exhibition_name: formData.get("exhibition"),

        projectInfo: {
          clientName: formData.get("clientName"),
          boothSize: formData.get("boothSize"),
          location: formData.get("location"),
          buildTime: formData.get("buildTime"),
          overview: formData.get("overview"),
        },

        objective: formData.get("objective"),
        challenges: formData.get("challenges"),

        process: {
          renders,
          realImages,
          moodboard,
          processText: formData.get("processText"),
        },

        materials: formData.getAll("materials"),
        technologies: formData.getAll("technologies"),

        execution: formData.get("execution"),

        results: {
          visitors: formData.get("visitors"),
          engagement: formData.get("engagement"),
          testimonial: formData.get("testimonial"),
          clientName: formData.get("testimonialName"),
          clientImage,
        },

        keywords: keyword,
        designImage,
        liveImage,
        gallery,
        slug,
      };

      await axios.post("/api/portfolio", data);

      form.reset();
      setPreview({
        design: null,
        live: null,
        gallery: [],
        renders: [],
        real: [],
        mood: [],
        client: null,
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <SubmitLoading />;

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-2xl border shadow-sm space-y-8">

      <h1 className="text-2xl font-semibold text-gray-800">
        Add Portfolio
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* BASIC INFO */}
        <Section title="Basic Information">
          <Grid>
            <Input name="title" label="Title" required />
            <Select name="exhibition" label="Exhibition" required>
              <option value="">Select Exhibition</option>
              <option>Dubai Expo 2024</option>
              <option>CES 2024</option>
            </Select>

            <Input name="clientName" label="Client Name" required />
            <Input name="boothSize" label="Booth Size" required />
            <Input name="location" label="Location" />
            <Input name="buildTime" label="Build Time (Hours)" />
          </Grid>

          <Textarea name="overview" label="Project Overview" />
        </Section>

        {/* BRIEF */}
        <Section title="Brief & Challenge">
          <Textarea name="objective" label="Client Objective" />
          <Textarea name="challenges" label="Challenges" />
        </Section>

        {/* PROCESS */}
        <Section title="Design Process">
          <File name="renders" label="3D Renders" multiple onChange={(e: any) => handleImage(e, "renders")} previewList={preview.renders} />
          <File name="realImages" label="Real Images" multiple onChange={(e: any) => handleImage(e, "real")} previewList={preview.real} />
          <File name="moodboard" label="Moodboard / Sketch" multiple onChange={(e: any) => handleImage(e, "mood")} previewList={preview.mood} />
          <Textarea name="processText" label="Process Description" />
        </Section>

        {/* MATERIAL */}
        <Section title="Materials & Technology">
          <Select name="materials" label="Materials" multiple>
            <option>Wood</option>
            <option>Metal</option>
            <option>Fabric</option>
          </Select>

          <Select name="technologies" label="Technology" multiple>
            <option>LED</option>
            <option>VR</option>
            <option>Lighting</option>
          </Select>
        </Section>

        {/* EXECUTION */}
        <Section title="Execution">
          <Textarea name="execution" label="On-site Execution Details" />
        </Section>

        {/* RESULTS */}
        <Section title="Results & Testimonials">
          <Input name="visitors" label="Visitors" type="number" />
          <Input name="engagement" label="Engagement Data" />
          <Textarea name="testimonial" label="Client Review" />
          <Input name="testimonialName" label="Client Name" />
          <File name="clientImage" label="Client Image" onChange={(e: any) => handleImage(e, "client")} preview={preview.client} />
        </Section>

        {/* IMAGES */}
        <Section title="Images">
          <File name="designImage" label="Design Image" required onChange={(e: any) => handleImage(e, "design")} preview={preview.design} />
          <File name="liveImage" label="Live Image" required onChange={(e: any) => handleImage(e, "live")} preview={preview.live} />
          <File name="galleryImages" label="Gallery Images" multiple onChange={(e: any) => handleImage(e, "gallery")} previewList={preview.gallery} />
        </Section>

        {/* SEO */}
        <Section title="SEO">
          <Input name="keywords" label="Keywords" />
        </Section>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition">
            Submit Portfolio
          </button>
        </div>

      </form>
    </div>
  );
}

/* COMPONENTS */

const Section = ({ title, children }: any) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
      {title}
    </h2>
    {children}
  </div>
);

const Grid = ({ children }: any) => (
  <div className="grid md:grid-cols-2 gap-5">{children}</div>
);

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input {...props} className="mt-1 w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <textarea {...props} rows={4} className="mt-1 w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
  </div>
);

const Select = ({ label, children, ...props }: any) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <select {...props} className="mt-1 w-full border p-3 rounded-lg focus:ring-2 focus:ring-primary outline-none">
      {children}
    </select>
  </div>
);

const File = ({ label, preview, previewList, ...props }: any) => (
  <div>
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input type="file" {...props} className="mt-1 w-full border p-3 rounded-lg" />

    {preview && <Image src={preview} alt="" width={100} height={80} className="mt-2 rounded" />}

    {previewList && (
      <div className="flex flex-wrap gap-2 mt-2">
        {previewList.map((img: string, i: number) => (
          <Image key={i} src={img} alt="" width={80} height={60} className="rounded" />
        ))}
      </div>
    )}
  </div>
);