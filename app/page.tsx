import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        <div>
          <h1 className="text-center text-2xl font-bold">Welcome To Country Communication Home</h1>
          <p className="mt-12.5">
            Country Communinaction is the best EVENT Management Company in Bangladesh
          </p>
        </div>
      </main>
    </div>
  );
}
