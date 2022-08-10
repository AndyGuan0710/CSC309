// import './style-sign_log.css'
import Input from "../../Common/Input";
import Submit from "../../Common/Submit";
import $ from 'jquery';
import image from "../../Common/Image";
import  background from './../../Common/images/b12.jpg';
import b1 from "../../Common/images/b12.jpg"
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";

const Register = () => {
    let navigate = useNavigate();
    const {refresh, setRefresh} = useContext(APIContext)
    document.body.style = 'background: url('+b1+');font-family: "Poppins", sans-serif;' +
            '  min-height: 100vh;font-family: "Poppins", sans-serif;\n' +
            '  height: auto; '

    function username_check(){
        let username_validation = true
        let username = document.getElementById("register_username")
        const username_placeholder = document.getElementById("username_notification")

        if (! username.value){username_validation = false}
        if (username.value.length < 6 || ! /^[a-zA-Z0-9_]+$/.test(username.value)){
            username_validation = false}
        if (! username_validation){username_placeholder.innerHTML = "Username is invalid"}
        else{username_placeholder.innerHTML = ""}
        return username_validation
    }

    function password_check(){
        let password1_validation = true
        let password2_validation = true
        let password1 = document.getElementById("password1")
        let password2 = document.getElementById("password2")
        const password1_placeholder = document.getElementById("password1_notification")
        const password2_placeholder = document.getElementById("password2_notification")
        if (password1.value.length < 8){password1_validation = false}
        if (password2.value !== password1.value){password2_validation = false}
        if (! password1_validation){password1_placeholder.innerHTML = "Password is invalid"}
        else{password1_placeholder.innerHTML = ""}
        if (! password2_validation){password2_placeholder.innerHTML = "Passwords don't match"}
        else{password2_placeholder.innerHTML = ""}
        if (password1_validation && password2_validation){return "11"}
        else if(!password1_validation && !password2_validation){return "00"}
        else if(password1_validation){return "10"}
        else{return "01"}
    }

    function email_check(){
        let email_validation = true
        let email = document.getElementById("email")
        const email_placeholder = document.getElementById("email_notification")
        if (! /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.value)){
            email_validation = false}
        if (! email.value){email_validation = true}
        if (! email_validation){email_placeholder.innerHTML = "Email is invalid"}
        else{email_placeholder.innerHTML = ""}
        return email_validation
    }

    let avatarChange = (event) => {
        if(event.target.files.length === 0){$("#avatarN").html("A avatar is required")}
        else{$("#avatarN").html("")}
    }
    let phoneChange = (event) => {
        // if(event.target.value === ""){$("#phoneN").html("A avatar is required")}
        // else{$("#phoneN").html("")}
    }
    let firstnameChange = (event) => {
        if(event.target.value === ""){$("#firstnameN").html("Firstname is required")}
        else{$("#firstnameN").html("")}
    }
    let lastnameChange = (event) => {
        if(event.target.value === ""){$("#lasttnameN").html("Lastname is required")}
        else{$("#lastnameN").html("")}
    }
    let addressChange = (event) => {
        // if(event.target.value === ""){$("#lasttnameN").html("Lastname is required")}
        // else{$("#lastnameN").html("")}
    }


    function register() {
        let register_validation = true
        const register_placeholder = document.getElementById("notification")
        let password_validation = true
        username_check()
        email_check()
        let firstname = document.getElementById("first_name").value
        let lastname = document.getElementById("last_name").value
        let address = document.getElementById("address").value
        let phone_number = document.getElementById("phone_number").value
        let avatar = document.getElementById("avatar")
        if (avatar.files.length === 0){$("#avatarN").html("A avatar is required")}
        if (firstname === ''){$("#firstnameN").html("Firstname is required")}
        if (lastname === ''){$("#lastnameN").html("Lastname is required")}
        if (password_check() !== "11") {
            password_validation = false
        }
        if (!(username_check() && password_validation && email_check() && avatar.files.length !== 0 && firstname && lastname)) {
            register_validation = false
        }
        if (!register_validation) {
            register_placeholder.innerHTML = "At least one field is invalid. Please correct it before proceeding"
            return
        } else {
            register_placeholder.innerHTML = ""
        }
        console.log(register_validation)
        if (register_validation) {
            let username_1 = document.getElementById("register_username").value
            let password1_1 = document.getElementById("password1").value
            let password2_1 = document.getElementById("password2").value
            let email_1 = document.getElementById("email").value

            let data = {
                username: username_1, password: password1_1, password2: password2_1,
                email: email_1};
            const formData = new FormData();
            formData.append('username', username_1);
            formData.append('address', address);
            formData.append('phone_number', phone_number);
            formData.append('avatar', avatar.files[0]);
            formData.append('password', password1_1);
            formData.append('password2', password2_1);
            formData.append('email', email_1);
            formData.append('first_name',firstname);
            formData.append('last_name',lastname);
            // const requestOption = {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify({username: localStorage.getItem("username"), password: localStorage.getItem("password")})
            // };
            //
            // fetch("http://127.0.0.1:8000/accounts/api/token/", requestOption)
            //     .then(response => response.json())
            //     .then(jason => {
            //         localStorage.setItem("access", jason.access)
            //     })
            //     .catch()
            const requestOptions = {
                method: 'POST',
                body:formData
            };
            fetch("http://127.0.0.1:8000/accounts/register/", requestOptions)
                .then(response => {
                    if(response.ok){
                        console.log(response.json())
                        $("#notification").html("")
                    return navigate("/navbar/login")}
                    else{
                        if(response.status === 400){$("#notification").html("Username exist")}
                    console.log(response)
                }})

            }
    }


    return <>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        <br/><br/><br/><br/>

        <div className="wrapper fadeInDown" id="wrapper">

            <div id="formContent">

                <div>
                    <p className="text-center h3 fw-bold mb-2 mx-1 mx-md-4 mt-4">Sign Up</p>
                </div>

                <form className="mx-1 mx-md-4">

                    <div className="d-flex flex-row align-items-center mb-0">
                        <i className="fas fa fa-user fa-lg me-3 fa-fw"/>
                        <div className="form-outline flex-fill mb-0">
                            <label className="form-label" htmlFor="register_username">Username: <span className="notification" id="username_notification" style={{color:"red"}}/></label>
                            <Input type="text"  id="register_username" update = {username_check} style={null} classes="form-control text-center w-75 m-auto" name="username" placeholder=""/>

                        </div>
                    </div>

                    <div className="d-flex flex-row align-items-center mb-0">
                        <i className="fas fa-file-image fa-lg me-3 fa-fw"/>
                        <div className="form-outline flex-fill mb-0">
                            <label className="form-label" htmlFor="avatar">Avatar: <span className="notification" id="avatarN" style={{color:"red"}}/></label>
                            <input type="file" id="avatar" className="form-control text-center w-75 m-auto" onChange={avatarChange}/>

                        </div>
                    </div>

                    <div className="d-flex flex-row align-items-center mb-0">
                        <i className="fas fa-bookmark fa-lg me-3 fa-fw"/>
                        <div className="form-outline flex-fill mb-0">
                            <label className="form-label" htmlFor="first_name">First Name: <span className="notification" id="firstnameN" style={{color:"red"}}/></label>
                            <input type="text" id="first_name" className="form-control text-center w-75 m-auto" onChange={firstnameChange}/>

                        </div>
                    </div>

                    <div className="d-flex flex-row align-items-center mb-0">
                        <i className="fas fa-edit fa-lg me-3 fa-fw"/>
                        <div className="form-outline flex-fill mb-0">
                            <label className="form-label" htmlFor="last_name">Last Name: <span className="notification" id="lastnameN" style={{color:"red"}}/></label>
                            <input type="text" id="last_name" className="form-control text-center w-75 m-auto" onChange={lastnameChange}/>

                        </div>
                    </div>

                    <div className="d-flex flex-row align-items-center mb-0">
                        <i className="fas fa-address-book fa-lg me-3 fa-fw"/>
                        <div className="form-outline flex-fill mb-0">
                            <label className="form-label" htmlFor="address">Address: (not required) <span className="notification" id="addressN" style={{color:"red"}}/></label>
                            <input type="text" id="address" className="form-control text-center w-75 m-auto" onChange={addressChange}/>

                        </div>
                    </div>

                    <div className="d-flex flex-row align-items-center mb-0">
                        <i className="fas fa-phone fa-lg me-3 fa-fw"/>
                        <div className="form-outline flex-fill mb-0">
                            <label className="form-label" htmlFor="phone_number">Phone Number:(not required) <span className="notification" id="phoneN" style={{color:"red"}}/></label>
                            <input type="number" id="phone_number" className="form-control text-center w-75 m-auto" onChange={phoneChange}/>

                        </div>
                    </div>


                    <div className="d-flex flex-row align-items-center mb-0">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw"/>
                        <div className="form-outline flex-fill mb-0">
                            <label className="form-label" htmlFor="email">Your Email: (not required) <span className="notification" id="email_notification" style={{color:"red"}}/></label>
                            <Input type="email"  id="email" update = {email_check} classes="form-control text-center w-75 m-auto" name="email" />

                        </div>
                    </div>

                    <div className="d-flex flex-row align-items-center mb-0">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"/>
                        <div className="form-outline flex-fill mb-0">
                            <label className="form-label" htmlFor="password">Password: <span className="notification" id="password1_notification" style={{color:"red"}}/></label>
                            <Input type="password"  id="password1" update = {password_check} classes="form-control text-center w-75 m-auto" name="password1" />

                        </div>
                    </div>

                    <div className="d-flex flex-row align-items-center mb-0">
                        <i className="fas fa-key fa-lg me-3 fa-fw"/>
                        <div className="form-outline flex-fill mb-0">
                            <label className="form-label" htmlFor="repeat">Repeat password:  <span className="notification" id="password2_notification" style={{color:"red"}}/></label>
                            <Input type="password"  id="password2" update = {password_check} classes="form-control text-center w-75 m-auto" name="password2" />

                        </div>
                    </div>
                    <br/>

                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        {/*<Submit type="submit" classes="btn btn-primary btn-lg" value="Register" id ="register" name="register" click = {register}/>*/}

                        <button type="button"  className="btn btn-primary btn-lg" onClick={register}>Register</button><br/>

                    </div>
                    <span style={{color:"red"}} className="notification" id="notification"/>

                </form>

                <br/>
            </div>
            <br/><br/><br/><br/>
        </div>
        <br/><br/><br/><br/>
    </>
}

export default Register