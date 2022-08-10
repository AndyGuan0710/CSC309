import $ from 'jquery';
import  './blog.css'
import React, {useEffect, useState} from "react";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import {useNavigate, useParams} from "react-router-dom";
import TimeAgo from "../../Common/TimeAgo";

const IsOwnerAdd = ({restaurantId}) => {
    let navigate = useNavigate();
    let toAddBlog =()=>{
        return navigate("/navbar/restaurant/"+restaurantId+"/blog/add")
    }
    if (localStorage.getItem("blogIsOwner") === "true"){
        return<button className="button0" onClick={toAddBlog}>Add</button>
    }else{
        return<></>
    }

}
const IsOwnerDelete = ({blogId}) => {
    const {refresh, setRefresh} = useContext(APIContext)
    let deleteBlog=(event)=>{
        let blogID = event.target.name
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
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access"),
            }
        };

        fetch("http://127.0.0.1:8000/restaurant/blog/delete/"+ blogID +"/", requestOption)
            .then(jason => console.log(jason))
            .then(()=> {setRefresh(refresh +1)})
    }

    if (localStorage.getItem("blogIsOwner") === "true"){
        return<button className="button0" onClick={deleteBlog} name={blogId} >Delete</button>
    }else{
        return<></>
    }

}
const Blogs = ({blogs, colors}) =>{
    const {refresh, setRefresh} = useContext(APIContext)

    let blog_ld = (event) => {
        if (!(localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null')){
            return
        }
        let target = event.target
        if (target.className.includes("fa-heart")){
            target = target.parentElement
        }

        let id = target.id
        // console.log(target, target.id)
        let act = "like"
        // if (target.querySelector('i')){
        //     act = "like"
        // }
        // else{
        //     act = "dislike"
        // }

        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access")},
            body: JSON.stringify({action: act})
        };

        fetch("http://127.0.0.1:8000/restaurant/blog/ld/" + id +"/", requestOptions)
            .then(response => response.json())
            .then(jason => console.log(jason))
            .then(()=> setRefresh(refresh +1))

    }
    return<>
    {blogs.map(blog => (
        <>
        <div className="item mb-5" key={blog.id}>
            <div className="row g-3 g-xl-0">
                <div className="col-2 col-xl-3 px-3">
                    <img src={blog.blog_image} alt="#" className="img-fluid post_img"/>

                </div>
                <div className="col">
                    <h3 className="title mb-1"><a className="text-link a" >{blog.blog_title}</a></h3>
                    <div className="meta mb-1"><i className="fas fa-calendar-alt mr-2"/>
                        <span className="date"> <TimeAgo time={blog.create_time}/> </span>
                        <button className="blogLikeButton" onClick={blog_ld} id={blog.id} style={{marginLeft:"10%"}}>
                            <i className="fa-solid fa-heart" style={{color:colors[blog.id][0]}}/></button>
                        <span className="like">{blog.like}</span></div>
                    <div className="intro">{blog.blog_body}
                        <IsOwnerDelete blogId={blog.id}/>
                    </div>

                    {/*<a className="text-link a" href="blog_post.html">Read more &rarr;</a>*/}
                </div>

            </div>

        </div>
        <hr className="line my-5"/>
        </>
    ))}
    </>


}

const AllBlog = () => {
    let profile_options;
    let restaurantID = useParams().restaurantId;
    const [blogs, setBlogs] = useState([]);
    const {refresh, setRefresh} = useContext(APIContext)
    const [pageInfo, setPageInfo] = useState([1, false]);
    let navigate = useNavigate();
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
                'Authorization': 'Bearer ' + localStorage.getItem("access"),
            },
        }

    }
    else {localStorage.setItem("access", null)
        profile_options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }}
    useEffect(() => {
        let pageString = "?page=" + pageInfo[0]
        fetch("http://127.0.0.1:8000/restaurant/" + restaurantID + "/blog/all/" + pageString, profile_options)
            .then(response => {
                if (response.ok){
                    return response.json()
                }else {goPrevious()}
            })
            .then(jason => {setBlogs(jason.results);
                setPageInfo([pageInfo[0], jason.next !== null])
                console.log(jason)
            } )
            .catch()
    }, [setRefresh, refresh])

    let goBack = ()=>{return navigate('/navbar/restaurant/' + restaurantID + '/')}

    if (blogs.length === 0){

        return<>
            <section className="blog-list px-3 py-5 p-md-5">
                <div className="container mt-5">
                    <h1>Blogs of   "{localStorage.getItem("blogBelong")}"</h1>


                    <hr className="line my-5" id="line"/>


                    <h1>No Blog Yet</h1>
                    <nav className="blog-nav nav nav-justified my-5 py-5">

                            <IsOwnerAdd restaurantId={restaurantID}/>

                            <button className="button0" onClick={goBack}>Back</button>

                    </nav>


                </div>

            </section>
        </>
    }



    let blog
    let blogColors = {}
    for(let i = 0; i< blogs.length;i++){
        blog = blogs[i]
        if (blog.current_user_action === "dislike"){
            blogColors[blog.id] = ["white", "red"]
        }else if (blog.current_user_action === "like"){
            blogColors[blog.id] = ["red", "white"]
        }else{
            blogColors[blog.id] = ["white", "white"]
        }
    }
    console.log(blogs, blogColors)

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
        <section className="blog-list px-3 py-5 p-md-5">
            <div className="container mt-5">
                <h1>Blogs of   "{localStorage.getItem("blogBelong")}"</h1>

                <nav className=" nav nav-justified " style={{marginTop:"5%"}}>
                    <button className="nav-link-prev nav-item rounded-left nav_btn a commentLikeButton" id="previous"
                            style={{cursor: 'pointer'}} onClick={goPrevious}><i
                        className="arrow-prev fas fa-long-arrow-alt-left"/>Previous</button>
                    <button className="nav-link-next nav-item  rounded nav_btn a commentLikeButton" id="previous"
                            style={{cursor: 'pointer'}} onClick={goNext}
                    >Next<i className="arrow-next fas fa-long-arrow-alt-right"/></button>
                </nav>

                <hr className="line my-5" id="line"/>


                <Blogs blogs={blogs} colors={blogColors}/>


                <nav className="blog-nav nav nav-justified my-5 py-5">
                    <button className="nav-link-prev nav-item rounded-left nav_btn a commentLikeButton" id="previous"
                       style={{cursor: 'pointer'}} onClick={goPrevious}><i
    className="arrow-prev fas fa-long-arrow-alt-left"/>Previous</button>
                    <div className="d-flex align-items-center justify-content-center">

                        <IsOwnerAdd restaurantId={restaurantID}/>


                        <button className="button0"  style={{color:"brown"}} onClick={goBack}>Back</button>


                    </div>
                    <button className="nav-link-next nav-item  rounded nav_btn a commentLikeButton" id="previous"
                      style={{cursor: 'pointer'}} onClick={goNext}
                    >Next<i className="arrow-next fas fa-long-arrow-alt-right"/></button>
                </nav>


            </div>

        </section>
    </>



}
export default AllBlog