type headingProps = {
    textUnderline: string,
    text: string
}
export default function Heading1({textUnderline, text}: headingProps){
    return(
        <div>
            <h1 className="text-3xl lg:text-5xl md:text-4xl font-bold my-8 uppercase"><span className="underline decoration-[#009999]">{textUnderline}</span> {text}</h1>
        </div>
    ); 
}