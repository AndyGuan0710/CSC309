import $ from 'jquery';
import React, {useEffect, useState} from "react";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import {useNavigate, useParams} from "react-router-dom";
import Imagee from "../../Common/Image";
import formLogo from './../../Common/images/p1.jpg';
import "./edit_restaurant.css"
import blogLogo from "../../Common/images/p1.jpg";

const EditRestaurant = ()=>{
    const [restaurant, setRestaurant] = useState({});
    const [restaurantData, setRestaurantData] = useState(
        {id: -1, name:'', address:"", post_code:'', description:'', phone_number:'', logo:null, background_image:null});
    let navigate = useNavigate();
    // ['id', 'name', 'address', 'post_code', 'description', 'phone_number', 'logo', 'background_image']
    let nameChange =(event)=>{
        if(event.target.value===''){$("#nameN").html("Restaurant name should not be empty")}
        else{$("#nameN").html("")}
        setRestaurantData({...restaurantData, name: event.target.value})
    }
    let addressChange =(event)=>{
        if(event.target.value===''){$("#addressN").html("Restaurant address should not be empty")}
        else{$("#addressN").html("")}
        setRestaurantData({...restaurantData, address: event.target.value})
    }
    let postCodeChange =(event)=>{
        if(event.target.value===''){$("#postCodeN").html("Restaurant post code should not be empty")}
        else{$("#postCodeN").html("")}
        setRestaurantData({...restaurantData, post_code: event.target.value})
    }
    let descriptionChange =(event)=>{
        if(event.target.value===''){$("#descriptionN").html("Restaurant description should not be empty")}
        else{$("#descriptionN").html("")}
        setRestaurantData({...restaurantData, description: event.target.value})
    }
    let phoneChange =(event)=>{
        if(event.target.value===''){$("#phoneN").html("Restaurant phone number should not be empty")}
        else{$("#phoneN").html("")}
        setRestaurantData({...restaurantData, phone_number: event.target.value})
    }
    let logoChange =(event)=> {
        // if(event.target.files.length === 0){$("#logoN").html("Restaurant logo should not be empty")}
        // else{$("#logoN").html("")}
        if (event.target.files.length !== 0) {
            setRestaurantData({...restaurantData, logo: event.target.files[0]})
        }
    }
    let backgroundImageChange =(event)=>{
        // if(event.target.files.length === 0){$("#backgroundN").html("Restaurant logo should not be empty")}
        // else{$("#backgroundN").html("")}
        if (event.target.files.length !== 0) {
            setRestaurantData({...restaurantData, background_image: event.target.files[0]})
        }
    }
    let Edit =(event)=>{
        let rName = document.getElementById("name")
        let rAddress = document.getElementById("address")
        let rPostCode = document.getElementById("post_code")
        let rPhoneNumber = document.getElementById("phone_number")
        let rDescription = document.getElementById("description")
        let rLogo = document.getElementById("logo")
        let rBackground = document.getElementById("background")
        if(rName.value===''){$("#nameN").html("Restaurant name should not be empty")}
        if(rAddress.value===''){$("#addressN").html("Restaurant address should not be empty")}
        if(rPostCode.value===''){$("#postCodeN").html("Restaurant post code should not be empty")}
        if(rPhoneNumber.value===''){$("#phoneN").html("Restaurant phone number should not be empty")}
        if(rDescription.value===''){$("#descriptionN").html("Restaurant description should not be empty")}
        if(rName.value===''|| rAddress.value===''|| rPostCode.value===''|| rPhoneNumber.value===''||rDescription.value===''){
            return}
        const formData = new FormData();
        formData.append('name', restaurantData.name);
        formData.append('address', restaurantData.address);
        formData.append('post_code', restaurantData.post_code);
        formData.append('phone_number', restaurantData.phone_number);
        formData.append('description', restaurantData.description);
        if(rLogo.files.length!==0){formData.append('logo', rLogo.files[0]);}
        if(rBackground.files.length!==0){formData.append('background_image', rBackground.files[0]);}

        const requestOptions = {
            method: 'PUT',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem("access")},
            body:formData
        };
        fetch("http://127.0.0.1:8000/restaurant/edit/", requestOptions)
            .then(response => response.json())
            .then(jason => console.log(jason))
            .then(()=>navigate('/navbar/restaurant/'))
    }

    if(restaurantData.id === -1){
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
            method: 'GET',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem("access")},
        };
        fetch("http://127.0.0.1:8000/restaurant/edit/", requestOptions)
            .then(response => response.json())
            .then(jason => {setRestaurantData({id: jason.id, name:jason.name, address:jason.address, post_code:jason.post_code,
                        description:jason.description, phone_number:jason.phone_number, logo:jason.logo, background_image:jason.background_image})})
    }
    if (restaurantData.id === -1){
        return<></>
    }
    let toBack = (event) =>{
        return navigate("/navbar/restaurant/")
    }
    // console.log(restaurantData)


    return<>
        <div className="container contact editRestaurant">
            <br/>
                <br/>
                        <div className="row editRestaurant">
                            <div className="col-md-3 editRestaurant">
                                <div className="contact-inf editRestaurant">
                                    <img src={formLogo}  alt="image" id="small_image"/>

                                        <h3 className="editRestaurant hh3">Edit Restaurant</h3>
                                        <h4 className="editRestaurant">Improve Your Restaurant Information!</h4>
                                </div>
                            </div>
                            <div className="col-md-9 editRestaurant">
                                <div className="contact-for editRestaurant">
                                    <div className="form-group editRestaurant">
                                        <label className="control-label col-sm-10 editRestaurant" htmlFor="name">Restaurant
                                            Name: <span id="nameN" style={{color:"red"}}/></label>
                                        <div className="col-sm-10 editRestaurant">
                                            <input type="text" className="form-control editRestaurant" id="name"
                                                   placeholder="New restaurant name" name="fname" onChange={nameChange}
                                                   value={restaurantData.name}/>
                                        </div>
                                    </div>
                                    <br/>


                                        <div className="form-group editRestaurant">
                                            <label className="control-label col-sm-10 editRestaurant" htmlFor="address">Address:
                                                <span id="addressN" style={{color:"red"}}/></label>
                                            <div className="col-sm-10 editRestaurant">
                                                <input type="text" className="form-control editRestaurant" id="address"
                                                       placeholder="New address" name="fname" onChange={addressChange}
                                                       value={restaurantData.address}/>
                                            </div>
                                        </div>
                                        <br/>


                                            <div className="form-group editRestaurant">
                                                <label className="control-label col-sm-10 editRestaurant" htmlFor="post_code">Postal
                                                    Code: <span id="postCodeN" style={{color:"red"}}/></label>
                                                <div className="col-sm-10 editRestaurant" >
                                                    <input type="text" className="form-control editRestaurant" id="post_code"
                                                           placeholder="New postal code" name="fname" onChange={postCodeChange}
                                                           value={restaurantData.post_code}/>
                                                </div>
                                            </div>
                                            <br/>

                                                <div className="form-group editRestaurant">
                                                    <label className="control-label col-sm-10 editRestaurant" htmlFor="phone_number">Phone
                                                        Number: <span id="phoneN" style={{color:"red"}}/></label>
                                                    <div className="col-sm-10 editRestaurant">
                                                        <input type="text" className="form-control editRestaurant" id="phone_number"
                                                               placeholder="New Phone Number" name="fname" onChange={phoneChange}
                                                               value={restaurantData.phone_number}/>
                                                    </div>
                                                </div>
                                                <br/>


                                                    <div className="form-group editRestaurant">
                                                        <label className="form-label col-sm-10 editRestaurant" htmlFor="logo">New
                                                            Logo: <span id="logoN"  style={{color:"red"}}/></label>
                                                        <div className="col-sm-10 editRestaurant">
                                                            <input type="file" accept="image/*" className="form-control editRestaurant"
                                                                   id="logo" onChange={logoChange}/>
                                                        </div>
                                                    </div>

                                                    <br/>


                                                        <div className="form-group editRestaurant">
                                                            <label className="form-label col-sm-10 editRestaurant" htmlFor="background">New
                                                                Background Image: <span id="backgroundN" style={{color:"red"}}/></label>
                                                            <div className="col-sm-10 editRestaurant">
                                                                <input type="file" accept="image/*" className="form-control editRestaurant"
                                                                       id="background" onChange={backgroundImageChange}/>
                                                            </div>
                                                        </div>


                                                        <br/>
                                                            <div className="form-group editRestaurant">
                                                                <label className="control-label col-sm-10 editRestaurant"
                                                                       htmlFor="description">New Restaurant
                                                                    Description: <p id="descriptionN" style={{color:"red"}}/></label>
                                                                <div className="col-sm-10 editRestaurant">
                                                                    <textarea className="form-control editRestaurant" rows="5"
    id="description" onChange={descriptionChange} value={restaurantData.description}/>
                                                                </div>
                                                            </div>

                                                            <div className="form-group editRestaurant">
                                                                <div className="col-sm-offset-2 col-sm-10 editRestaurant">
                                                                    <button className="btn btn-default button11" onClick={Edit}>Submit
                                                                    </button>
                                                                    <button className="button0 editRestaurant" onClick={toBack}
                                                                            style={{width:"15%", height:"10%"}}>Back</button>
                                                                </div>
                                                            </div>
                                    <br/>
                                </div>
                            </div>
                        </div>
                        <br/>
                            <div className="d-flex align-items-center justify-content-center editRestaurant">




                            </div>
        </div>
    </>
}
export default EditRestaurant