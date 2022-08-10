import './style-sign_log.css'
import $ from 'jquery';
// import './navbar1.css'
import Helmet from "react-helmet"
import {Image} from "react-bootstrap";
import {Link, Outlet, useNavigate} from "react-router-dom";
import  icon from './../../Common/images/log_in.png';
import Login_form from "./Login_form";
import {useContext, useEffect, useState} from "react";
import Input from "../../Common/Input";
import Submit from "../../Common/Submit";
import {APIContext} from "../../../Contexts/APIContext";
export var current_access


const Login = () => {
    let navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    function username_check(){
        let username_validation = true
        let username = document.getElementById("username")

        if (! username.value){
            username_validation = false
        }
        if (username.value.length < 6 || ! /^[a-zA-Z]+$/.test(username.value)){
            username_validation = false
        }

        return username_validation
    }


    function password_check() {
        let password_validation = true
        let password = document.getElementById("password")
        if (password.value.length < 8) {
            password_validation = false
        }
        return password_validation
    }

        useEffect(() => {
        // console.log(username, password)
    }, [username, password])

    const update_username = () => {

        let value = $( "#username").val()
        setUsername(value)
    }
    const update_password = () => {

        let value = $( "#password").val()
        setPassword(value)
    }
    const login = () => {

        if (!(username_check() || password_check())){
            $("#login_notification").html("Username or Password is invalid")
        }

        else {
            let user_name = $("#username").val()
            let pass_word = $("#password").val()
            // console.log( user_name, pass_word)
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},

                body: JSON.stringify({username: user_name, password: pass_word})
            };

            fetch("http://127.0.0.1:8000/accounts/login/", requestOptions)
                .then(response => {
                    if(response.ok){
                    console.log(response.json())
                    $("#login_notification").html("")


                        let accessapi = fetch("http://127.0.0.1:8000/accounts/api/token/", requestOptions);
                        accessapi = accessapi.then(response => response.json())

                        accessapi = accessapi.then(jason => {
                            localStorage.setItem("access", jason.access)
                            localStorage.setItem("username", user_name)
                            localStorage.setItem("password", pass_word)
                            return jason.access;
                        })



                        accessapi.then(acces =>{
                            console.log(acces, 111)
                            const profile_options = {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + acces
                                },
                            }



                            fetch("http://127.0.0.1:8000/accounts/profile/", profile_options)
                                .then(response => response.json())
                                .then(jason => {console.log(jason)
                                    localStorage.setItem("userid", jason.id)
                                    localStorage.setItem("avatar", jason.avatar)
                                    localStorage.setItem("address", jason.address)
                                }).then(()=>{navigate("/")})

                        });
                    }
                else{
                    if(response.status === 400){$("#login_notification").html("Username or Password is invalid")}
                    console.log(response)
                }})




        }
    }

    let toRegister = (event)=>{
        navigate("/navbar/register/")
    }


    return <>
        <div className="one">

        <div className="wrapper fadeInDown" id="wrapper">

            <div id="formContent">

                <div className="fadeIn first">
                    <img src={icon} id="icon" alt="User Icon"/>
                </div>

                    <Input type="text" id="username" update = {update_username} classes="fadeIn second" name="username" placeholder="username"/>
                    <Input type="password" id="password" update = {update_password} classes="fadeIn third" name="password" placeholder="password"/>
                    <Submit type="submit" classes="btn btn-primary btn-lg" value="Log In" id ="login-submit" name="login-submit" click = {login}/>
                    {/*<button value="Log In" onClick={login}>dsffddf</button>*/}
                    {/*<Submit classes="btn btn-primary btn-lg" value="Log In" id ="login-submit" name="login-submit" click = {login}/>*/}
                    <p id="login_notification" style={{color:"red"}}/>

                <div className="container">
                    <div className="row">

                        {/*<div className="col-sm" id="formFooter">*/}
                        {/*    <a className="underlineHover" >Forgot Password?</a>*/}
                        {/*</div>*/}

                        <div className="col-sm" id="register">
                            <button className="blogLikeButton" style={{width:"100%"}}><a className="underlineHover"  onClick={toRegister}>New Here?</a></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>



        {/*<form action="#">*/}
        {/*    <Input type="text" id="username" update = {update_username}  name="username" placeholder="username"/>*/}
        {/*    <Input type="text" id="password" update = {update_password}  name="password" placeholder="password"/>*/}
        {/*    <Submit classes="btn btn-primary btn-lg" value="Log In" id ="login-submit" name="login-submit" click = {login}/>*/}

        {/*    <p id="login_notification"/>*/}

        {/*</form>*/}
        {/*<button value="Log In" onClick={login}>dsffddf</button>*/}


    </>
}

export default Login

