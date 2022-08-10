import "./feed.css"
import React, {useEffect, useState} from "react";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import {useNavigate, useParams} from "react-router-dom";
import b1 from "./../../Common/images/b2.png"
import $ from "jquery";
import {Button} from "react-bootstrap";
import TimeAgo from "../../Common/TimeAgo";
import {noop} from "bootstrap/js/src/util";
import navbar from "../../Common/Navbar";

const Blogs = ({blogs, colors}) => {
    let navigate = useNavigate();
    const {refresh, setRefresh} = useContext(APIContext)
    if(blogs.length === 0){
        return<h1 style={{color:"white"}}> They haven't post any blog yet.</h1>
    }
    let blog_ld = (event) => {
        if (!(localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null')){
            return
        }
        let target = event.target
        if (target.className.includes("fa-heart")) {
            target = target.parentElement
        }

        let id = target.id
        console.log(target, target.id)
        let act = "like"
        // if (target.querySelector('i')){
        //     act = "like"
        // }
        // else{
        //     act = "dislike"
        // }
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access")
            },
            body: JSON.stringify({action: act})
        };

        fetch("http://127.0.0.1:8000/restaurant/blog/ld/" + id + "/", requestOptions)
            .then(response => response.json())
            .then(jason => console.log(jason))
            .then(() => setRefresh(refresh + 1))
    }

    for(let i = 0; i < blogs.length; i++){
        let belong = blogs[i].belong
        let j
        for (j = belong.length -1 ; j >= 0; j -- ){
            if (! /^[0-9]$/.test(belong[j])){break}
        }
        blogs[i].restaurantName =belong.slice(0, j)
        blogs[i].restaurantId =belong.slice(j+1)

    }
    let goRestaurant = (event) =>{
        let target = event.target
        if (target.className.includes("name")){
            target = target.parentElement
        }
        document.body.style = null
        return navigate("/navbar/restaurant/" + target.name)
    }
    return <>
        {blogs.map(blog => (

                <article className="postcard light orange blogCard" key={blog.id} >
                    <a className="postcard__img_link"  >
                        <img src={blog.blog_image} alt="Image Title" className="postcard__img"/>
                    </a>
                    <div className="postcard__text t-dark">
                        <h1 className="postcard__title">{blog.blog_title}
                        </h1>
                        {/*<h5 className="postcard__name"><button>{blog.restaurantName}</button></h5>*/}
                        <button name= {blog.restaurantId} style={{width:"20%"}} className="commentLikeButton button9" onClick={goRestaurant}>
                            <h5 className="postcard__name" >{blog.restaurantName}</h5></button>
                        <div className="postcard__subtitle small">
                            <time dateTime="2021-02-08 12:00:00">
                                <i className="fas fa-calendar-alt mr-2"/> <TimeAgo time={blog.create_time}/>
                            </time>
                        </div>
                        <div className="postcard__bar"/>
                        <div className="postcard__preview-txt">{blog.blog_body}
                        </div>
                        <ul className="postcard__tagbox">
                                <h5><button onClick={blog_ld} id={blog.id} className="feedBlogButton" style={{background:"transparent",
                                    border:"none",
                                    outline:"none",
                                    cursor:"pointer",}}>
                                    <i className="fa-solid fa-heart"  style={{color:colors[blog.id][0]}}/></button>
                                    <span className="likes">{blog.like} Likes</span></h5>
                        </ul>
                    </div>
                </article>
        ))}
    </>
}



const FeedBlogs = () => {
    document.body.style = "background: url("+b1+");  font-family: 'Playfair Display', serif;\n" +
        "  font-size: 18px;\n" +
        "  font-weight: initial;\n" +
        "  text-rendering: optimizeLegibility;\n" +
        "  padding-top: 5rem;background-position: center;\n" +
        "  background-repeat: no-repeat;\n" +
        "  background-size: cover;\n" +
        "  background-attachment: fixed; "
    const [blogs, setBlogs] = useState([]);
    const [pageInfo, setPageInfo] = useState([1, false]);
    const {refresh, setRefresh} = useContext(APIContext)
    let navigate = useNavigate();
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
            headers: {'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem("access"),},}
    } else {navigate("/navbar/login/")}

    useEffect(() => {
        let pageString = "?page=" + pageInfo[0]
        fetch("http://127.0.0.1:8000/restaurant/feed/blogs/all/" + pageString, profile_options)
            .then(response => response.json())
            .then(jason => {setBlogs(jason.results);
                            setPageInfo([pageInfo[0], jason.next !== null])
                console.log(jason)
            } )
            .catch()
    }, [setRefresh, refresh])
    let goManage = (event) =>{
        document.body.style = null
        return navigate("/navbar/restaurant/feed/manage/")
    }
    if (blogs.length === 0){
        return<>
            <div className="mask" id="mask11" style={{backgroundColor: "rgba(0, 0, 0, 0.1)"}}>
                <section className="light">
                    <div className="container py-2">
                        <h1 className="page_title"><i className="fa-solid fa-champagne-glasses"/><span className="just">No blogs available.</span>
                        </h1>

                    </div>
                    <button className="buttonPN " style={{color:"brown", marginLeft:"30%"}} onClick={goManage}>Manage Your Feeds</button>
                </section>
            </div>
        </>
    }

    let goBack = ()=>{return navigate('/')}
    let blog
    let blogColors = {}
    for(let i = 0; i< blogs.length;i++){
        blog = blogs[i]
        if (blog.current_user_action === "dislike"){
            blogColors[blog.id] = ["black", "red"]
        }else if (blog.current_user_action === "like"){
            blogColors[blog.id] = ["red", "black"]
        }else{
            blogColors[blog.id] = ["black", "black"]
        }
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


// console.log(pageInfo, blogColors)
    return<>
        <div className="mask" id="mask11" style={{backgroundColor: "rgba(0, 0, 0, 0.1)"}}>
        <section className="light">
            <div className="container py-2">
                <h1 className="page_title"><i className="fa-solid fa-champagne-glasses"/><span className="just">They Posted . . .</span>
                </h1>
                <div id="PNButton"  style={{marginLeft:"0"}}>
                    <button className="buttonPN" onClick={goPrevious}
                            style={{marginBottom:"2%", marginLeft:"0%", marginRight:"0%", marginTop:"2%"}}> <b>Previous</b></button>
                    <button className="buttonPN" style={{color:"brown"}} onClick={goManage}>Manage Your Feeds</button>
                    <button className="buttonPN" onClick={goNext}
                            style={{marginBottom:"2%", marginLeft:"0%", marginRight:"0%" , marginTop:"2%"}}> <b>Next</b> </button>
                </div>
                 <Blogs blogs={blogs} colors={blogColors}/>
                <div id="PNButton"  style={{marginLeft:"0"}}>
                    <button className="buttonPN" onClick={goPrevious}
                            style={{marginBottom:"2%", marginLeft:"10%", marginRight:"10%", marginTop:"2%"}}> <b>Previous</b></button>
                    <button className="buttonPN" onClick={goNext}
                            style={{marginBottom:"2%", marginLeft:"10%", marginRight:"10%", marginTop:"2%"}}> <b>Next</b> </button>
                </div>

            </div>
        </section>
            </div>
        </>
}
export default FeedBlogs