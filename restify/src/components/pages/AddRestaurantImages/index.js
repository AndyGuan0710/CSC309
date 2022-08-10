import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import $ from "jquery";
import formLogo from "../../Common/images/p1.jpg";
import icon from "../../Common/images/menu_logo.png";

const AddRestaurantImages = ()=>{
    let navigate = useNavigate();


    let backTo = (event) =>{
        return navigate('/navbar/restaurant/#line')
    }

    let imageSubmit = (event) =>{
        let image = document.getElementById("restaurant_image")
        if (image.files.length===0){
            $("#imageN").html("Menu image is required")
            return
        }
        const formData = new FormData();
        formData.append('image', image.files[0]);
        const requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: localStorage.getItem("username"), password: localStorage.getItem("password")})
        };

        fetch("http://127.0.0.1:8000/accounts/api/token/", requestOption)
            .then(response => response.json())
            .then(jason => {
                localStorage.setItem("access", jason.access)
            })
            .catch()
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access")},
            body: formData
        };

        fetch("http://127.0.0.1:8000/restaurant/image/add/", requestOptions)
            .then(response => response.json())
            .then(jason => console.log(jason))
            .then(()=>navigate('/navbar/restaurant/'))



    }

    let imageCheck = (event) =>{
        if (event.target.files.length===0){
            $("#imageN").html("Menu image is required")
        }else{
            $("#imageN").html("")
        }
    }

    return<>
        <div id = "body3">
            <br/><br/><br/><br/><br/><br/>
            <div className="container contact">
                <div className="row">
                    <div className="col-md-3">
                        <div className="contact-info">
                            <img src={icon}  alt="image" id="menu_logo"/>

                            <h2>Add Your New Menu here.</h2>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="contact-form">




                            <div className="form-group">
                                <label className="control-label col-sm-10" htmlFor="price">Upload New Picture: <span id="imageN" style={{color:"red"}}/></label>

                                <div className="col-sm-10" style={{margin:"5%"}}>
                                    <input type="file" accept="image/*" multiple="multiple" id="restaurant_image" onChange={imageCheck}/>
                                </div>
                            </div>


                            <div className="form-group">
                                <div className="col-sm-offset-2 col-sm-10">
                                    <button type="submit" className="btn btn-default" onClick={imageSubmit}>Submit</button>
                                </div>
                            </div>

                        </div>

                        <br/>

                    </div>
                    <div className="d-flex align-items-center justify-content-center">


                        <button className="button0" onClick={backTo}>Back</button>

                    </div>
                </div>
            </div>
        </div>
    </>
}
export default AddRestaurantImages