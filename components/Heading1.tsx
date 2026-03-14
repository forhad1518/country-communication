import "@/app/globals.css";

type headingProps = {
    text: string
}
export default function Heading1({ text }: headingProps) {
    return (
        <div className="inset-0 bg-gradient-to-r from-transparent via-teal-600 to-transparent animate-gradient w-[70%] mx-auto py-4 my-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white">
                {text}
            </h1>
        </div>
    );
}