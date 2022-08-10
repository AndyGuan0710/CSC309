import $ from 'jquery';
import React, {useEffect, useState} from "react";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import {useNavigate, useParams} from "react-router-dom";
import Imagee from "../../Common/Image";
import formLogo from './../../Common/images/p1.jpg';

const EditProfile = ()=>{
    const [profile, setProfile] = useState({});
    const [profileData, setProfileData] = useState(
        {id: -1, username:'', address:"", email:'', phone_number:'',
            avatar:null, first_name:'', last_name:'', password1: '', password2:''});

    let navigate = useNavigate();

    let usernameChange = (event) => {
        if(event.target.value===''){$("#usernameN").html("Username should not be empty")}
        else{$("#usernameN").html("")}
        setProfileData({...profileData, username: event.target.value})
    }
    let addressChange = (event) => {

        setProfileData({...profileData, address: event.target.value})
    }
    let emailChange = (event) => {
        setProfileData({...profileData, email: event.target.value})
    }
    let avatarChange = (event) => {
        if(event.target.files.length === 0){
            setProfileData({...profileData,avatar: event.target.files[0]})
        }
    }
    let phoneChange = (event) => {
        // if(event.target.value===''){$("#phoneN").html("Email should not be empty")}
        // else{$("#phoneN").html("")}
        setProfileData({...profileData, phone_number: event.target.value})
    }
    let passwordChange = (event) => {
        if(event.target.id === 'password1'){setProfileData({...profileData, password1: event.target.value})}
        else if (event.target.id === 'password2'){setProfileData({...profileData, password2: event.target.value})}
        let pass1 = document.getElementById("password1")
        let pass2 = document.getElementById("password2")
        if(pass1.value !== pass2.value){$("#password2N").html("Password does not match")}
        else{$("#password2N").html("")}
        if(pass1.value.length>0 && pass1.value.length < 8){$("#password1N").html("Password is too short")}
        else{$("#password1N").html("")}
    }
    let firstnameChange = (event) => {
        setProfileData({...profileData, first_name: event.target.value})
    }
    let lastnameChange = (event) => {
        setProfileData({...profileData, last_name: event.target.value})
    }
    let Edit = (event) => {
        let username = document.getElementById("username").value
        let address = document.getElementById("address").value
        let avatar = document.getElementById("avatar")
        let phone_number = document.getElementById("phone_number").value
        let first_name = document.getElementById("first_name").value
        let last_name = document.getElementById("last_name").value
        let email = document.getElementById("email").value
        let password1 = document.getElementById("password1").value
        let password2 = document.getElementById("password2").value
        let usernameCheck = username !== ''
        let addressCheck = address !== ''
        let passwordCheck = !(password1 !== password2 || (password1.length>0 && password2.length < 8))
        if(!usernameCheck){$("#usernameN").html("Username should not be empty")}
        if(!addressCheck){$("#usernameN").html("Username should not be empty")}
        if (!(usernameCheck && addressCheck && passwordCheck)){return}
        const formData = new FormData();
        formData.append('username', username);
        formData.append('address', address);
        formData.append('phone_number', phone_number);
        formData.append('first_name', first_name);
        formData.append('last_name', last_name);
        formData.append('email', email);
        if (password1.length>0) {
            formData.append('password', password1);
            formData.append('password2', password2);
        }
        if(avatar.files.length > 0){formData.append('avatar', avatar.files[0]); }
        // else{formData.append('avatar', null);}
        const requestOptions = {
            method: 'PUT',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem("access")},
            body:formData
        };
        fetch("http://127.0.0.1:8000/accounts/profile/edit/", requestOptions)
            .then(response => response.json())
            .then(jason => console.log(jason))
            .then(()=>navigate('/navbar/profile/'))
            .catch()
    }
    let toBack = (event) => {
        return navigate("/navbar/profile/")
    }
    if(profileData.id === -1){
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
        const profile_options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access")},}
        fetch("http://127.0.0.1:8000/accounts/profile/", profile_options)
            .then(response => response.json())
            .then(jason => {
                setProfile(jason)
                setProfileData({id: jason.id, username:jason.username, address:jason.address, email:jason.email,
                    phone_number:jason.phone_number, avatar:jason.avatar, first_name:jason.first_name, last_name:jason.last_name})
            })
            .catch()
    }





    return<>
        <div className="container contact editRestaurant">
            <br/>
            <br/>
            <div className="row editRestaurant">
                <div className="col-md-3 editRestaurant">
                    <div className="contact-inf editRestaurant">
                        <img src={formLogo}  alt="image" id="small_image"/>

                        <h3 className="editRestaurant hh3">Edit Profile</h3>
                        <h4 className="editRestaurant">Change you profile information</h4>
                    </div>
                </div>
                <div className="col-md-9 editRestaurant">
                    <div className="contact-for editRestaurant">
                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="username">
                                Username: <span id="usernameN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="text" className="form-control editRestaurant" id="username"
                                       placeholder="New username" name="fname" onChange={usernameChange}
                                       value={profileData.username}/>
                            </div>
                        </div>
                        <br/>


                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="address">Address:
                                <span id="addressN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="text" className="form-control editRestaurant" id="address"
                                       placeholder="New address" name="fname" onChange={addressChange}
                                       value={profileData.address}/>
                            </div>
                        </div>
                        <br/>

                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="email">Email:
                                <span id="addressN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="email" className="form-control editRestaurant" id="email"
                                       placeholder="New email address" name="fname" onChange={emailChange}
                                       value={profileData.email}/>
                            </div>
                        </div>
                        <br/>


                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="first_name">
                                First Name: <span id="firstNameN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant" >
                                <input type="text" className="form-control editRestaurant" id="first_name"
                                       placeholder="New firstname" name="fname" onChange={firstnameChange}
                                       value={profileData.first_name}/>
                            </div>
                        </div>
                        <br/>

                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="last_name">
                                Last Name: <span id="lastNameN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant" >
                                <input type="text" className="form-control editRestaurant" id="last_name"
                                       placeholder="New lastname" name="fname" onChange={lastnameChange}
                                       value={profileData.last_name}/>
                            </div>
                        </div>
                        <br/>

                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="phone_number">
                                Phone Number: <span id="phoneN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="text" className="form-control editRestaurant" id="phone_number"
                                       placeholder="New Phone Number" name="fname" onChange={phoneChange}
                                       value={profileData.phone_number}/>
                            </div>
                        </div>
                        <br/>




                        <div className="form-group editRestaurant">
                            <label className="form-label col-sm-10 editRestaurant" htmlFor="avatar">New
                                Avatar: <span id="avatarN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="file" className="form-control editRestaurant"
                                       id="avatar" onChange={avatarChange} accept="image/*"/>
                            </div>
                        </div>
                        <br/>

                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="password1">
                                Password: <span id="password1N" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="text" className="form-control editRestaurant" id="password1"
                                       placeholder="New password" name="fname" onChange={passwordChange}
                                       value={profileData.password1}/>
                            </div>
                        </div>
                        <br/>
                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="password2">
                                Repeat Password: <span id="password2N" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="text" className="form-control editRestaurant" id="password2"
                                       placeholder="New password" name="fname" onChange={passwordChange}
                                       value={profileData.password2}/>
                            </div>
                        </div>

                        <br/>
                        <div className="form-group editRestaurant">
                            <div className="col-sm-offset-2 col-sm-10 editRestaurant">
                                <button className="btn btn-default button11" onClick={Edit}>Submit
                                </button>
                                <button className="button0 editRestaurant" onClick={toBack}
                                        style={{width:"15%", height:"10%"}}>Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
        </div>
    </>
}

export default EditProfile