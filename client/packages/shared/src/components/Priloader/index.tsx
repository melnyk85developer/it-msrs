import React from "react"
//@ts-ignore
import preloader from "../../assets/loader.gif"

const Preloader: React.FC = () => {
    return <img src={preloader} className="preloader" alt="preloader"/>
}

export default Preloader;