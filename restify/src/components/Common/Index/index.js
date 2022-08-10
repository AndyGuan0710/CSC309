import React, {useContext, useEffect, useState} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import './style-index.css'
import './navbar1.css'
import Helmet from "react-helmet"
import {Image} from "react-bootstrap";
import {Outlet, useNavigate} from "react-router-dom";
import TimeAgo from "../TimeAgo";

const LogInOut = () =>{
    const {refresh, setRefresh} = useContext(APIContext)
    let navigate = useNavigate();
    const toLogout = (event) => {
        const profile_options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access")
            },
        }
        fetch("http://127.0.0.1:8000/accounts/logout/", profile_options)
            .then(response => {
                console.log(response)
                localStorage.setItem("access", null)
                localStorage.setItem("username", null)
                localStorage.setItem("password", null)
                localStorage.setItem("blogBelong", null)
                localStorage.setItem("blogIsOwner", null)
                localStorage.setItem("avatar", null)
                localStorage.setItem("address", null)
            })
            .then(()=>{
                setRefresh(refresh+1)
                navigate("/")})
    }
    const toLogin = (event) => {
      return navigate("/navbar/login/")
    }
    if (localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null'){
        return  <a className="nav_item right" onClick={toLogout}>LOG OUT</a>
    }else{
        return  <a className="nav_item right" onClick={toLogin} >LOG IN</a>
    }
}

const DropDown = () => {
    let navigate = useNavigate();
    const {refresh, setRefresh} = useContext(APIContext)
    let goProfile =(event)=> {
        if (localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null') {
            navigate("/navbar/profile")
        } else {navigate("/navbar/login/")}
    }
    let goEditProfile =(event)=> {
        if (localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null') {
            navigate("/navbar/profile/edit/")
        } else {navigate("/navbar/login/")}
    }
    if (localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null'){
        return <><div className="dropdown-content">
            <div className="profile">
                <img className="rounded-circle avatar" src={localStorage.getItem("avatar")} alt="user"/>
                <h5 className="name text-white ">{localStorage.getItem("username")}</h5>
            </div>
            <a className="nav_item" onClick={goProfile}>Profile</a>
            <a className="nav_item" onClick={goEditProfile}>Edit Profile</a>

        </div></>
    }else {
        return <></>
    }
}


const Notifications = ({notifications}) => {
    if (!notifications ){
        return<></>
    }
    if (notifications.id){
        return<></>
    }
    if(notifications.length === 0){
        return <><div className="dropdown" >
            <button className="dropbtn" ><i className="fa-regular fa-bell"/></button>
            <div className="dropdown-content" id="notifications">
            <p> No any notifications</p>
                </div>
            </div>
        </>
    }

    if (localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null'){
        return <><div className="dropdown" >
            <button className="dropbtn" ><i className="fa-regular fa-bell"/></button>
            <div className="dropdown-content" id="notifications">
                {notifications.map((notification, index)=> (
                    <div className="notif" key={notification.id}>
                        <div className="row g-0">
                            <div className="col-md-4">
                                <img src={notification.image} className="avatar rounded-circle" alt="user"/>
                            </div>
                            <div className="col-md-8">
                                <div className="">
                                    <p className="">{notification.content}</p>
                                    <p className="time m-0"><small className="text-muted"><TimeAgo time={notification.create_time}/></small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div></>
    }else {
        return <></>
    }
}


const Index = () => {
    let navigate = useNavigate();
    const [search, setSearch] = useState('');
    const {refresh, setRefresh} = useContext(APIContext)
    let toMyRestaurant = (event) => {
        if (localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null'){
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
                    'Authorization': 'Bearer ' + localStorage.getItem("access")
                },
            }
            fetch("http://127.0.0.1:8000/accounts/profile/", profile_options)
                .then(response => response.json())
                .then(jason => {document.body.style = null
                    if (jason.is_owner.toString() === "true"){navigate("/navbar/restaurant/")}
                else{navigate("/navbar/restaurant/add/")}
                })
        }else {navigate("/navbar/login/")}
    }
    let toHome = (event) => {
        document.body.style = null
        return navigate("/")
    }
    let toFeed= (event)=>{
        document.body.style = null
        if (localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null') {
            return navigate("/navbar/restaurant/feed/")
        } else {return navigate("/navbar/login/")}

    }

    let searchChange= (event)=>{
        setSearch(event.target.value)
    }
    let goSearch =(event)=>{
        setRefresh(refresh+1)
        setSearch("")
        document.body.style = null
        let value = document.getElementById("searchQueryInput").value
        if (value){
            navigate("/navbar/restaurant/search/"+ value+"/result/")
        }else{ navigate("/navbar/restaurant/search/all/result/")}
    }
    let toProfile =(event)=>{
        document.body.style = null
        if(localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null'){
            navigate("/navbar/profile")
        }else {navigate("/navbar/login/")}

    }



    const [notifications, setNotifications] = useState({id:1});
    useEffect(() => {
           // localStorage.setItem("username", null)
        if (localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null' ) {
            console.log(localStorage.getItem("username"), localStorage.getItem("password"))
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
            const requestOption = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("access"),
                }
            };

            fetch("http://127.0.0.1:8000/restaurant/notif/all/", requestOption)
                .then(response => response.json())
                .then(jason => {setNotifications(jason.results)})
                .catch()

        }
    }, [setRefresh, refresh])

    function handle(e){
        if(e.key === "Enter"){
            goSearch()
        }

        return false;
    }

    return <>
        <Helmet>
            <title>restify</title>

            {/* The charset, viewport and author meta tags will always have the same value, so we hard code them! */}
            <meta charSet="UTF-8" />
            <script src="https://kit.fontawesome.com/167736d797.js" crossOrigin="anonymous"/>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
    crossOrigin="anonymous"/>

        </Helmet>

        <div id="intro0" className="bg-image shadow-2-strong">
            <div className="mask" id="mask1" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
                <div className="container d-flex align-items-center justify-content-center text-center h-100">
                    <div className="text-white">
                        <div className="container text-center">
                            <div className="discription3 h1">
                                Restify
                            </div>
                        </div>


                        <div className="wrapper" id="wrapper">
                            <div className="searchBar" id="searchBar">
                                <input id="searchQueryInput" type="text" name="searchQueryInput"
                                       placeholder="Search Your Restaurant Here" value={search} onChange={searchChange} onKeyPress={handle} />
                                    <button id="searchQuerySubmit" type="submit" name="searchQuerySubmit" onClick={goSearch}>
                                        <i className="fa-solid fa-magnifying-glass"/></button>
                            </div>
                        </div>


                        <div className="box nav_bar grey borderXwidth fixed-top">
                            <a className="nav_item left" onClick={toHome}>HOME</a>
                            <a className="nav_item left" onClick={toFeed}>FEED</a>
                            <a className="nav_item left" onClick={toMyRestaurant}>MY RESTAURANT</a>


                            <div className="dropdown ">
                                <button className="dropbtn" onClick={toProfile}><i className="fa-regular fa-user" onClick={toProfile}/></button>
                                <DropDown/>

                            </div>

                            <Notifications notifications={notifications}/>
                            {/*<a className="nav_item right" >LOG IN</a>*/}
                            <LogInOut/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
    crossOrigin="anonymous"/>

        <Outlet />
    </>
}
export default Index;