import "./add_menu.css"
import $ from 'jquery';
import React, {useEffect, useState} from "react";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import {useNavigate, useParams} from "react-router-dom";
import Imagee from "../../Common/Image";
import menulogo from './../../Common/images/log_in.png';
import back from './../../Common/images/b12.jpg';
import icon from "../../Common/images/menu_logo.png";
const MenuAdd = () => {
    // document.body.style.backgroundImage = null
    let navigate = useNavigate();

    let nameCheck = (event) =>{

        if (event.target.value === ''){
            $("#nameN").html("Menu name should not be empty")
        }else{
            $("#nameN").html("")
        }
    }
    let priceCheck = (event) =>{

        if (! /^\d+.?\d+$/.test(event.target.value)){
            $("#priceN").html("Please enter a valid number")
        }else{
            $("#priceN").html("")
        }
    }
    let imageCheck = (event) =>{

        if (event.target.files.length===0){
            $("#imageN").html("Menu image is required")
        }else{
            $("#imageN").html("")
        }
    }
    let bodyCheck = (event) =>{

        if (event.target.value === ''){
            $("#descriptionN").html("Menu description should not be empty")
        }else{
            $("#descriptionN").html("")
        }
    }
    let menuSubmit = (event) => {
        let name_check = document.getElementById("dishname").value !== ''
        let price_check = /^\d+.?\d+$/.test(document.getElementById("price").value)
        let image_check = document.getElementById("menu_images").files.length !== 0
        let body_check = document.getElementById("description").value !==''
        if(!name_check){
            $("#nameN").html("Menu name should not be empty")
        }
        if (!price_check){
            $("#priceN").html("Please enter a valid number")
        }
        if (!image_check){
            $("#imageN").html("Menu image is required")
        }
        if (!body_check){
            $("#descriptionN").html("Menu description should not be empty")
        }
        if (!(name_check && price_check && image_check && body_check)){
            return
        }
        const formData = new FormData();
        formData.append('name', document.getElementById("dishname").value);
        formData.append('price', document.getElementById("price").value);
        formData.append('menu_image', document.getElementById("menu_images").files[0]);
        formData.append('description', document.getElementById("description").value);
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

        fetch("http://127.0.0.1:8000/restaurant/menu/add/", requestOptions)
            .then(response => response.json())
            .then(jason => console.log(jason))
            .then(()=>navigate('/navbar/restaurant/#line'))

    }

    let backTo = (event) =>{
        return navigate('/navbar/restaurant/#line')
    }


    return<>
        <div id = "body3">
            <br/><br/><br/>
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
                            <label className="control-label col-sm-10" htmlFor="dishname">Dish Name: <span id="nameN" style={{color:"red"}}/></label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="dishname" placeholder="Enter Dish Name"
                                       name="dishname" onChange={nameCheck}/>
                            </div>
                        </div>





                        <div className="form-group">
                            <label className="control-label col-sm-10" htmlFor="price">Price: <span id="priceN" style={{color:"red"}}/></label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="price" placeholder="Enter Dish Price"
                                       name="price" onChange={priceCheck}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="control-label col-sm-10" htmlFor="price">Upload Picture: <span id="imageN" style={{color:"red"}}/></label>
                            <div className="col-sm-10">
                                <input type="file" multiple="multiple" accept="image/*" id="menu_images" onChange={imageCheck}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="control-label col-sm-10" htmlFor="description" >Description: <span id="descriptionN" style={{color:"red"}}/></label>
                            <div className="col-sm-10">
                                <textarea className="form-control" rows="5" id="description"
    placeholder="Enter Menu Description Here" onChange={bodyCheck}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button type="submit" className="btn btn-default" onClick={menuSubmit}>Submit</button>
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
export default MenuAdd