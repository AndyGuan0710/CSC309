import {Image} from "react-bootstrap";
import React from "react";


const Imagee = ({url, classname, alt}) => {
    if (!alt){
        alt = "#"
    }

    return <img src={"http://localhost:8000"+url} alt={alt} className={classname}/>


}

export default Imagee