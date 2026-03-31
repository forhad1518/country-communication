type buttonType = {
    bText: string
}
function ButtonP({bText}: buttonType){
    return(
        <div>
            <button className="uppercase p-3 px-4 bg-primary hover:bg-primary-hover text-white font-bold rounded mt-3">{bText}</button>
        </div>
    );
}

export default ButtonP;