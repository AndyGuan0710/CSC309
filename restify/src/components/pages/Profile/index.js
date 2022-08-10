import  './style-edit-profile.css'
import React, {useEffect, useState} from "react";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import {useNavigate, useParams} from "react-router-dom";

const Rating = ({rate}) => {
    let rate_light = []
    let rate_dark = []
    for(let i = 0; i<rate; i++){rate_light.push(1)}
    for(let i = 0; i<5-rate; i++){rate_dark.push(1)}
    return<>
        {rate_light.map((light, index)=> (
            <span className="fa fa-star checked" key={index}/>
        ))}
        {rate_dark.map((dark, index) => (
            <span className="fa fa-star" key={index+5}/>
        ))}
    </>
}

const IsOwner = ({isOwner, restaurant}) => {
    let navigate = useNavigate();
    let toMyRestaurant = (event)=>{
        return navigate("/navbar/restaurant")
    }
    let toCreateRestaurant = (event)=>{
        return navigate("/navbar/restaurant/add/")
    }

    if (isOwner){
       return<>
           <li className="mt-3">
               <h3 className="restaurant text-muted font-size-sm">My Restaurant</h3>
           </li>
           <li className="mt-3">
               <h5 className="restaurant text-muted font-size-sm" style={{margin:"4%"}}>{restaurant.name}</h5>
               <Rating rate={restaurant.rating}/>
               <h5 className="restaurant text-muted font-size-sm" style={{margin:"4%"}}>Followers: {restaurant.followers}</h5>

               <div className="m-auto">
                   <button type="button" className="btn btn-outline-dark" onClick={toMyRestaurant}>Restaurant Detail</button>
               </div>
           </li>
       </>
    } else{return <div className=" m-auto">
        <button type="button" className="btn btn-outline-dark" style={{height:"100px", width:"300px", fontSize:"30px"}} onClick={toCreateRestaurant}>Create Restaurant</button>
    </div>}
}

const Profile = () => {
    let navigate = useNavigate();
    const [profile, setProfile] = useState({});
    const [restaurant, setRestaurant] = useState({});
    const {refresh, setRefresh} = useContext(APIContext)
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
    useEffect(() => {

        fetch("http://127.0.0.1:8000/accounts/profile/", profile_options)
            .then(response => response.json())
            .then(jason => setProfile(jason) )
            .catch()
        fetch("http://127.0.0.1:8000/restaurant/my/short/", profile_options)
            .then(response => response.json())
            .then(jason => setRestaurant(jason) )
            .catch()
    }, [setRefresh, refresh])
    if (! profile.id){
        return <></>
    }
    console.log(profile)
    let toEditProfile =()=>{
        return navigate("/navbar/profile/edit/")
    }
    let div = document.getElementById("restaurantInformation")





    return <>
        <div className="two">
            <br/><br/><br/><br/><br/>
        <div className="container edit_profile">
            <div className="main-body">
                <div className="row gutters-sm">
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <img src={profile.avatar} alt="avatar" className="" width="150" style={{height:"9.5vw", objectFit:"cover"}}/>

                                        <div className="mt-3">
                                            <h4>{profile.username}</h4>
                                            <p className="text-secondary mb-1"/>
                                            <p className="text-muted font-size-sm">{profile.address}<br/></p>
                                            {/*<button className="btn btn-outline-dark">Message</button>*/}
                                        </div>
                                </div>
                            </div>
                        </div>
                        <div className="card mt-3 lign-items-center justify-content-center text-center" id="restaurantInformation" style={{height:"34.2vh"}}>
                            <ul>



                                <IsOwner isOwner={profile.is_owner} restaurant={restaurant}/>


                            </ul>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="card mb-3" id="right_card">
                            <div className="card-body">

                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">Username</h6>
                                    </div>
                                    <div className="col-sm-6 text-secondary">
                                        {profile.username}
                                    </div>

                                </div>
                                <hr/>

                                <div className="row">
                                    <div className="col-sm-3">
                                        <h6 className="mb-0">First Name</h6>
                                    </div>
                                    <div className="col-sm-6 text-secondary">
                                        {profile.first_name}
                                    </div>

                                </div>
                                <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <h6 className="mb-0">Last Name</h6>
                                        </div>
                                        <div className="col-sm-6 text-secondary">
                                            {profile.last_name}
                                        </div>

                                    </div>
                                    <hr/>
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <h6 className="mb-0">Email</h6>
                                            </div>
                                            <div className="col-sm-6 text-secondary">
                                                {profile.email}
                                            </div>

                                        </div>
                                        <hr/>
                                            <div className="row">
                                                <div className="col-sm-3">
                                                    <h6 className="mb-0">Phone</h6>
                                                </div>
                                                <div className="col-sm-6 text-secondary">
                                                    {profile.phone_number}
                                                </div>

                                            </div>
                                            <hr/>

                                                    <div className="row">
                                                        <div className="col-sm-3">
                                                            <h6 className="mb-0">Address</h6>
                                                        </div>
                                                        <div className="col-sm-6 text-secondary">
                                                            {profile.address}
                                                        </div>

                                                    </div>
                                                    <hr/>
                                <br/>
                                                        <div className="row">
                                                            <div className="col-sm-12 text-center">
                                                                <button className="btn btn-outline-dark" onClick={toEditProfile}
                                                                        style={{width:"40%",height:"100%", fontSize:"30px"}}>Edit Profile</button>
                                                            </div>
                                                        </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
        </div>
    </>
}
export default Profile