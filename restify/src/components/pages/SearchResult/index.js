import "./style-search.css"
import React, {useEffect, useState} from "react";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import {useNavigate, useParams} from "react-router-dom";
import b1 from "../../Common/images/new4.jpeg";
import $ from 'jquery';

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
            <span className="fa fa-star" key={index+5} />
        ))}
    </>
}
const FollowElement = ({color}) => {
    if (color === "black"){
        return <>Unfollowed</>
    }else{return <>Followed</>}
}

const RestaurantCards = ({restaurants, colors, follows}) => {
    const {refresh, setRefresh} = useContext(APIContext)
    let navigate = useNavigate();
    let RestaurantDetail = (event)=>{
        document.body.style = null
        return navigate("/navbar/restaurant/" + event.target.name + "/")
    }
    let RestaurantLd = (event)=>{
        if (!(localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null')){
            return
        }
        let target = event.target
        if (target.className.includes("thumbs")){
            target = target.parentElement
        }
        let id = target.name
        let act
        if (target.querySelector('i').className.includes("up")){
            act = "like"
        } else{act = "dislike"}
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access")},
            body: JSON.stringify({action: act})
        };
        fetch("http://127.0.0.1:8000/restaurant/ld/" + id +"/", requestOptions)
            .then(response => response.json())
            .then(jason => {console.log(jason)
                setRefresh(refresh+1)})
    }
    let RestaurantFollow = (event)=>{
        if (!(localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null')){
            return
            // return navigate("/navbar/login")
        }
        console.log("create")
        let target = event.target
        if (target.className.includes("heart")){
            target = target.parentElement
        }
        let id = target.name
        let act
        if (target.querySelector('i').style.color === 'black'){
            act = "add"
        } else{act = "delete"}
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access")},
            body: JSON.stringify({action: act})
        };
        fetch("http://127.0.0.1:8000/restaurant/feed/add/" + id +"/", requestOptions)
            .then(response => response.json())
            .then(jason => {console.log(jason)
                setRefresh(refresh+1)})
    }

    return<>
        {restaurants.map(restaurant => (
    <div className="card mb-4  col-lg-10   m-auto resultCard" key={restaurant.id}>
            <div className="row no-gutters">
                <div className="col-md-4">
                    <img src={restaurant.background_image} alt="Image Title" className="restaurant_card_image img-fluid" style={{height:"15vw", objectFit:"cover"}}/>
                </div>
                <div className="col-md-6">
                    <div className="card-body">

                        <h4 className="card-title">{restaurant.name}</h4>

                        <div className="rating_stars">
                            <Rating rate={restaurant.rating}/>
                        </div>
                        <p className="card-text">
                            <b className="">Address:</b> {restaurant.address}<br/>
                            <b> Contact number:</b> {restaurant.phone_number}<br/>
                        </p>
                        <button className="btn btn-outline-info" name={restaurant.id} onClick={RestaurantDetail}
                        style={{margin:"0"}}>Details
                        </button>

                    </div>

                    <div style={{ fontSize:"20px"}}>
                        <button className="restaurantLikeButton" name={restaurant.id} onClick={RestaurantLd}>
                            <i className="fa-solid fa-thumbs-up" style={{color:colors[restaurant.id][0]}} /> {restaurant.like}
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button className="restaurantLikeButton" name={restaurant.id} onClick={RestaurantLd} >
                            <i className="fa-solid fa-thumbs-down" style={{color:colors[restaurant.id][1]}} /> {restaurant.dislike }
                        </button>

                    </div>

                </div>
                <div className="col-md-2">
                    <span style={{float:"right", fontSize:"20px"}}>
                        <button className="restaurantLikeButton" name={restaurant.id} onClick={RestaurantFollow}>
                        <i className="fa-solid fa-heart" style={{color:follows[restaurant.id]}} />
                    </button><FollowElement color={follows[restaurant.id]}/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </div>

            </div>
        </div>
        ))}
        </>
}

const SearchResult = () => {
    const [restaurants, setRestaurants] = useState({});
    const {refresh, setRefresh} = useContext(APIContext)
    const [pageInfo, setPageInfo] = useState([1, false]);
    document.body.style = "background: url("+b1+");height: 100vh;\n" +
        "    background-position: center;\n" +
        "    background-repeat: no-repeat;\n" +
        "    background-size: cover;\n" +
        "    background-attachment: fixed;"

    let searchInput = useParams().searchInput;
    let profile_options;
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
        profile_options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access"),},}
    } else{localStorage.setItem("access", null)
        profile_options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }}

    // let pageString = "?page=" + pageInfo[0]
    // fetch("http://127.0.0.1:8000/restaurant/feed/blogs/all/" + pageString, profile_options)
    //     .then(response => response.json())
    //     .then(jason => {setBlogs(jason.results);
    //         setPageInfo([pageInfo[0], jason.next !== null])
    //         console.log(jason)
    //     } )
    //     .catch()
    useEffect(() => {
        let pageString = "?page=" + pageInfo[0]
        fetch("http://127.0.0.1:8000/restaurant/search/result/" + searchInput + "/" + pageString, profile_options)
            .then(response => {
                if (response.ok){
                    return response.json()
                }})
            .then(jason => {
                setRestaurants(jason.results);
                 $("#resultNumber").html("" + jason.count + " Results Found.")
                setPageInfo([pageInfo[0], jason.next !== null])
                console.log(jason)
            } )
            .catch()
    }, [setRefresh, refresh])

    if(! restaurants.length){
        return<>
            <div className="mask" id="mask11" style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}>
                <br/><br/>
                <div className="container d-flex align-items-center justify-content-center text-center m-auto">
                    <div>
                        <br/>
                        <br/>
                        <div className="container">
                            <div id="resultfound">
                                <h2>No Results Found.</h2>
                            </div>
                            <br/>

                        </div>
                        <br/><br/>
                    </div>
                </div>
                <br/><br/><br/>
            </div>
    </>}

    let restaurant
    let restaurantColors = {}
    let restaurantFollows = {}
    for(let i = 0; i< restaurants.length;i++){
        restaurant = restaurants[i]
        if (restaurant.current_user_action === "dislike"){
            restaurantColors[restaurant.id] = ["black", "blue"]
        }else if (restaurant.current_user_action === "like"){
            restaurantColors[restaurant.id] = ["blue", "black"]
        }else{
            restaurantColors[restaurant.id] = ["black", "black"]
        }
        if(restaurant.follow === 'true'){
            restaurantFollows[restaurant.id] = "red"
        }else {restaurantFollows[restaurant.id] = 'black';}
    }


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


    return<>
            <div className="mask" id="mask11" style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}}>
                <br/><br/>
            <div className="container d-flex align-items-center justify-content-center text-center m-auto">
                <div>
                    <br/>
                        <br/>
                            <div className="container">
                                <div id="resultfound">
                                    <h2 id="resultNumber" />
                                </div>

                                <div id="PNButton"  style={{marginLeft:"0"}}>
                                    <button className="buttonPN" onClick={goPrevious}
                                            style={{marginBottom:"2%", marginLeft:"5%", marginRight:"5%", marginTop:"2%"}}> <b>Previous</b></button>
                                    <button className="buttonPN" onClick={goNext}
                                            style={{marginBottom:"2%", marginLeft:"5%", marginRight:"5%", marginTop:"2%"}}> <b>Next</b> </button>
                                </div>

                                <RestaurantCards restaurants={restaurants} colors={restaurantColors} follows={restaurantFollows}/>

                                <div id="PNButton"  style={{marginLeft:"0"}}>
                                    <button className="buttonPN" onClick={goPrevious}
                                            style={{marginBottom:"2%", marginLeft:"5%", marginRight:"5%", marginTop:"2%"}}> <b>Previous</b></button>
                                    <button className="buttonPN" onClick={goNext}
                                            style={{marginBottom:"2%", marginLeft:"5%", marginRight:"5%", marginTop:"2%"}}> <b>Next</b> </button>
                                </div>
                            </div>
                            <br/><br/>
                </div>
            </div>
            <br/><br/><br/>
            </div>
    </>
}
export default SearchResult