import "./Add_blog_restaurant.css"

import $ from 'jquery';
import React, {useEffect, useState} from "react";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import {useNavigate, useParams} from "react-router-dom";
import Imagee from "../../Common/Image";
import blogLogo from './../../Common/images/p1.jpg';

const AddBlog = () =>{
    let navigate = useNavigate();
    let restaurantId = useParams().restaurantId;
    let blogTitle=(event)=>{
        if(event.target.value === ''){
            $("#titleN").html("Blog title should not be empty")
        }else {
            $("#titleN").html("")
        }
    }
    let blogImage=(event)=>{
        if(event.target.files.length === 0){
            $("#imageN").html("Blog image should not be empty")
        }else {
            $("#imageN").html("")
        }
    }
    let blogBody=(event)=>{
        if(event.target.value === ''){
            $("#bodyN").html("Blog body should not be empty")
        }else {
            $("#bodyN").html("")
        }
    }
    let Add_blog=(event)=> {
        let title = document.getElementById("blogTitle")
        let image = document.getElementById("blogImage")
        let body = document.getElementById("blogBody")

        if (title.value === '') {
            $("#titleN").html("Blog title should not be empty")
        }
        if (image.files.length === 0) {
            $("#imageN").html("Blog image should not be empty")
        }
        if (body.value === "") {
            $("#bodyN").html("Blog body should not be empty")
        }
        if (title.value === '' || image.files.length === 0 || body.value === "") {
            return
        }
        const formData = new FormData();
        formData.append('blog_image', image.files[0]);
        formData.append('blog_body', body.value);
        formData.append('blog_title', title.value);
        const requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: localStorage.getItem("username"),
                password: localStorage.getItem("password")
            })
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
                'Authorization': 'Bearer ' + localStorage.getItem("access")
            },
            body: formData
        };

            fetch("http://127.0.0.1:8000/restaurant/blog/add/", requestOptions)
                .then(response => response.json())
                .then(jason => {

                    let id = jason.id
                    let p = fetch("http://127.0.0.1:8000/restaurant/blog/" + id + "/")
                        .then(response => response.json())
                      return  p.then(jason => {
                          let belong = ''
                          for (let i = jason.belong.length - 1;i>=0; i--) {
                              if (jason.belong[i] === " ") {
                                  break
                              }
                              // console.log(jason.belong, belong)
                              belong = jason.belong[i] + belong
                          }
                          return belong})
                })
                .then(id => {
                    localStorage.setItem("blogIsOwner", "true")
                    navigate('/navbar/restaurant/'+id+'/blog/all/')
                })
        }
    //     fetch("http://127.0.0.1:8000/restaurant/blog/" + 10 + "/")
    //         .then(response => response.json())
    //         .then(jason => {
    //             let belong = ''
    //             for (let i = jason.belong.length - 1;i>=0; i--){
    //                 if ( jason.belong[i] === " "){
    //                     break
    //                 }
    //                 // console.log(jason.belong, belong)
    //                 belong = jason.belong[i]+belong
    //             }
    //             console.log(belong, jason)
    //         })
    //
    // }
    let backTo = (event) =>{
        return navigate('/navbar/restaurant/'+restaurantId+"/blog/all/")
    }
    return<>
        <div className="container contact">
            <br/>
                <br/>
                    <br/>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="contact-inf">
                                    <img src={blogLogo}  alt="image" id="small_image"/>
                                        <h3>Add Blog</h3>
                                        <h4>Post a Wonderful Blog Post!</h4>
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="contact-for">
                                    <div className="form-group">
                                        <label className="control-label col-sm-10" htmlFor="fname">Title:
                                            <span id="titleN" style={{color:"red"}}/> </label>
                                        <div className="col-sm-10">
                                            <input type="text" className="form-control" id="blogTitle"
                                                   placeholder="Add your title" name="fname" onChange={blogTitle}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label col-sm-10" htmlFor="customFile">Choose Image:
                                            <span id="imageN"  style={{color:"red"}}/></label>
                                        <div className="col-sm-10">
                                            <input type="file" className="form-control" id="blogImage" accept="image/*" onChange={blogImage}/>
                                        </div>
                                    </div>
                                    <br/>

                                                        <div className="form-group">
                                                            <label className="control-label col-sm-10" htmlFor="comment">Blog
                                                                Body: <span id="bodyN"  style={{color:"red"}}/></label>
                                                            <div className="col-sm-10">
                                                                <textarea className="form-control" rows="5"
    id="blogBody" onChange={blogBody}/>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="col-sm-offset-2 col-sm-10">
                                                                <button type="submit"
                                                                        className="btn btn-default" onClick={Add_blog}>Submit
                                                                </button>
                                                            </div>
                                                        </div>
                                    <button className="button0" onClick={backTo}>Back</button>
                                </div>
                            </div>
                        </div>




        </div>
    </>

}
export default AddBlog