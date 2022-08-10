import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import $ from "jquery";
import formLogo from "../../Common/images/p1.jpg";
import icon from "../../Common/images/menu_logo.png";
import {APIContext} from "../../../Contexts/APIContext";
import {Button} from "react-bootstrap";

const Images = ({images})=> {
    const {refresh, setRefresh} = useContext(APIContext)
    let Delete =(event) =>{
        let imageId = event.target.id
        const requestOption = {
            method: 'DELETE',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem("access"),
            }
        };
        fetch("http://127.0.0.1:8000/restaurant/image/delete/"+ imageId +"/", requestOption)
            .then(jason => console.log(jason))
            .then(()=> {setRefresh(refresh +1)})

    }
    return<>
        {images.map((image, index)=> (
            <div className="card" style={{width: "25rem", marginRight:"3%", marginLeft:"3%", marginTop:"2%"}} key={image.id}>
                <img className="card-img-top img-fluid" src={image.image} alt="Card image cap" style={{height:"70%"}}/>
                <div className="card-body text-center">
                    <Button id={image.id} onClick={Delete}>Delete</Button>
                </div>
            </div>
        ))}
    </>
}


const DeleteRestaurantImages = ()=> {
    let restaurantID = useParams().restaurantId;
    let navigate = useNavigate();
    const [images, setImages] = useState([]);
    const {refresh, setRefresh} = useContext(APIContext)
    const [pageInfo, setPageInfo] = useState([1, false]);
    let backTo = (event) =>{
        return navigate('/navbar/restaurant/#line')
    }

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},

        body: JSON.stringify({username: localStorage.getItem("username"), password: localStorage.getItem("password")})
    };

    fetch("http://127.0.0.1:8000/accounts/api/token/", requestOptions)
        .then(response => response.json())
        .then(jason => {
            localStorage.setItem("access", jason.access)
        })
        .catch()


    let profile_options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
        },
    }
    useEffect(() => {
        let pageString = "?page=" + pageInfo[0]
        fetch("http://127.0.0.1:8000/restaurant/" + restaurantID + "/image/all/" + pageString, profile_options)
            .then(response => response.json())
            .then(jason => {setImages(jason.results);
                setPageInfo([pageInfo[0], jason.next !== null])
                // console.log(jason)
            } )
            .catch()
    }, [setRefresh, refresh])

    console.log(images)


    let goNext = (event) =>{

        if (pageInfo[1]){
            setPageInfo([pageInfo[0] +1, pageInfo[1]])
            setRefresh(refresh+1)
        }
    }
    let goPrevious = (event) =>{
        if (pageInfo[0] > 1){
            setPageInfo([pageInfo[0] - 1, pageInfo[1]])
            setRefresh(refresh+1)
        }
    }

    let goAddImage = (event) =>{
        return navigate("/navbar/restaurant/image/add/")
    }

    if (images.length === 0){
        return<></>
    }
    return<>

            <br/><br/><br/><br/><br/><br/>
            <div className="container contact">
                <div className="row">
                    <div className="col-md-3">
                        <div className="contact-info">
                            <img src={icon}  alt="image" id="menu_logo"/>

                            <h2>Delete Your Restaurant Images here.</h2>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="contact-form">
                            <div className="form-group">
                                <label className="control-label col-sm-10" ><b>Pictures: </b><span id="imageN" style={{color:"red"}}/></label>
                            </div>
                            <div className="row"  >

                            <Images images={images}/>



                            </div>

                            <div id="PNButton"  style={{marginLeft:"10.5%"}}>
                                <button className="buttonMM" onClick={goPrevious}
                                        style={{marginBottom:"2%" , marginTop:"2%"}}> <b>Previous</b></button>
                                <button className="buttonMM" onClick={goAddImage}
                                         style={{ }}>Add Image</button>
                                <button className="buttonMM" onClick={goNext}
                                        style={{marginBottom:"2%", marginTop:"2%"}}> <b>Next</b> </button>
                            </div>

                        </div>
                    </div>

                    <div id="PNButton col-sm-12"  style={{ float:"right"}}>

                        <button className="buttonPN" onClick={backTo}
                                style={{marginBottom:"2%", marginLeft:"5%", marginRight:"5%", marginTop:"1%", width:"20%", float:"right"}}>Back </button>

                    </div>
                    <br/>
                </div>
            </div>

    </>
}
export default DeleteRestaurantImages