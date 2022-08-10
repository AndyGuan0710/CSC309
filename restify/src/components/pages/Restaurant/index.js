
import React, {useEffect, useRef, useState} from "react";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import {useNavigate, useParams} from "react-router-dom";
import Imagee from "../../Common/Image";
import $form from "bootstrap/js/src/dom/selector-engine";
import TimeAgo from "../../Common/TimeAgo";




const Menu = ({menus}) => {
    if(!menus.length){return<h1 style={{color:"white"}}>No Menus Yet ~</h1>}


    return<>
        {menus.map(menu => (
            <div className="mb-2 flex-container rounded " style={{width:'49%' } } key={menu.id}>
                <div className="flex-item-left" style={{}}>
                    <img src={menu.menu_image} alt="#" className="img-fluid" style={{height:"9vw", objectFit:"cover",  minHeight:"90%"}}/>
                </div>
                <div className="flex-item-middle" >
                    <h4>{menu.name}</h4>
                    <p className="card-text n" style={{fontSize:"18px"}}>
                        {menu.description}
                    </p>
                </div>
                <div className="flex-item-right">
                    <br/>
                    <div className="edit">
                        <button type="button" className="btn btn-light  button5" name={menu.id}
                                id="price1">Price: {menu.price}$
                        </button>

                    </div>
                </div>
            </div>
        ))}
    </>
}

const Comment = ({comments, colors}) => {
    const {refresh, setRefresh} = useContext(APIContext)
    if(!comments.length){return<h1 style={{color:"white"}}>No Comments Yet ~</h1>}
    let comment_ld = (event) => {
        if (!(localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null')){
            return
        }
        let target = event.target
        if (target.className.includes("thumbs")){
            target = target.parentElement
        }
        let id = target.name
        console.log(event.target)
        let act
        if (target.querySelector('i').className.includes("up")){
            act = "like"
        }
        else{
            act = "dislike"
        }
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("access")},
            body: JSON.stringify({action: act})
        };

        fetch("http://127.0.0.1:8000/restaurant/comment/ld/" + id +"/", requestOptions)
            .then(response => response.json())
            .then(jason => {console.log(jason)
                setRefresh(refresh+1)})

    }
    return<>
        {comments.map((comment) => (
            <div className="card mb-3  col-lg-10" key={comment.id}>
                <div className="row no-gutters">
                    <div className="col-md-4">
                        <img src={comment.comment_image} alt="#" className="card-img img-fluid h-10" style={{height:"15vw", objectFit:"cover"}}/>

                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h4 className="card-title">{comment.author}</h4>
                            <div className="rating_stars">
                                <Rating rate={comment.rating}/>
                            </div>
                            <p className="card-text t">{comment.comment_body}</p>
                            <p className="card-text"><small className="text-muted"> <TimeAgo time={comment.comment_time}/></small></p>

                            <div className="thumbs">
                                <button onClick={comment_ld} name={comment.id} className="commentLikeButton" >
                                    <i className="fa-solid fa-thumbs-up"  style={{color:colors[comment.id][0]}}/>
                                </button>
                                <span className="lnum">{comment.like}</span>
                                <button onClick={comment_ld} name={comment.id} style={{color:colors[comment.id][1]}} className="commentLikeButton">
                                    <i className="fa-solid fa-thumbs-down" />
                                </button>
                                <span className="lnum">{comment.dislike}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        ))}
    </>
}

const Carousel = ({images}) => {
    if (images.length === 0) {
        return <></>
    }
    let first = images[0]
    images = images.slice(1)

    return <>
        <div className="col-6">

            <div id="carouselExampleControls" className="carousel slide"
                 data-bs-ride="carousel" >
                <div className="carousel-inner">
                    <div className="carousel-item active" key="0">
                        <Imagee url={first.image} classname="d-block w-100" alt="..."/>

                    </div>
                    {images.map((image, index) => (
                        <div className="carousel-item " key={index + 1}>
                            <Imagee url={image.image} classname="d-block w-100" alt="..."/>
                        </div>
                    ))}

                </div>
                <button className="carousel-control-prev" type="button"
                        data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                                    <span className="carousel-control-prev-icon"
                                                          aria-hidden="true"/>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button"
                        data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                                    <span className="carousel-control-next-icon"
                                                          aria-hidden="true"/>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

        </div>
    </>
}

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
const RatingSystem = () => {
    let stars = [0, 0, 0, 0, 0]
    let starClick = (event) => {
        let elements = event.target.parentElement.children
        let stars = []
        for (let i = 0; i<elements.length;i++){
            if (elements[i].className.includes('star')){
                stars.push(elements[i])
            }
        }
        console.log(event.target, stars)
        let num = parseInt(event.target.id)
        console.log(num)
        for (let i = 0; i<num+1;i++){
            stars[i].className = "fa fa-star checked"
        }
        for (let i = num+1; i<5;i++){
            stars[i].className = "fa fa-star"
        }
    }

    return<>
        {stars.map((light, index)=> (
            <span className="fa fa-star" key={index} id={index.toString()} onClick={starClick}/>
        ))}

    </>
}





const Restaurant = () => {
    const [restaurant, setRestaurant] = useState({});
    const [menu, setMenu] = useState([]);
    const {refresh, setRefresh} = useContext(APIContext)
    const [menuPageInfo, setMenuPageInfo] = useState([1, false]);
    const [commentPageInfo, setCommentPageInfo] = useState([1, false]);
    const [comment, setComment] = useState([]);
    let restaurantID = useParams().restaurantId;
    const ref = useRef();
    // console.log(restaurantID)
    let profile_options
    let navigate = useNavigate();

    if (localStorage.getItem("username").toString() !== 'null' && localStorage.getItem("username") && restaurant.restaurant ){
        console.log(localStorage.getItem("userid").toString(), restaurant.restaurant.belongs.toString())
        if(localStorage.getItem("userid").toString()===restaurant.restaurant.belongs.toString()){
            navigate("/navbar/restaurant/")
        }
    }


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
    else{localStorage.setItem("access", null)
        profile_options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }}

    let profile_option = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    useEffect(() => {
        fetch("http://127.0.0.1:8000/restaurant/" + restaurantID + "/", profile_options)
            .then(response => response.json())
            .then(jason => {setRestaurant(jason.results);
                let menuPageString ="?page=" + menuPageInfo[0]
                // console.log(menuPageString)
                fetch("http://127.0.0.1:8000/restaurant/" + jason.results.restaurant.id + "/menus/all/" + menuPageString, profile_option)
                    .then(response => {
                        return response.json()})
                    .then(jason => {setMenu(jason.results)
                        setMenuPageInfo([menuPageInfo[0], jason.next !== null])
                    } )

                let commentPageString ="?page=" + commentPageInfo[0]
                fetch("http://127.0.0.1:8000/restaurant/" + jason.results.restaurant.id + "/comments/all/" + commentPageString, profile_options)
                    .then(response => {
                        return response.json()})
                    .then(jason => {setComment(jason.results)
                        setCommentPageInfo([commentPageInfo[0], jason.next !== null])
                    } )
                } )

            .catch()
    }, [setRefresh, refresh])

    let menus = []
    let comments = []
    let comments_colors = {}
    let images = []
    if (restaurant){
        menus = menu
        comments = comment
        let com
        for(let i = 0; i< comments.length;i++){
            com = comments[i]
            if (com.current_user_action === "dislike"){
                comments_colors[com.id] = ["black", "blue"]
            }else if (com.current_user_action === "like"){
                comments_colors[com.id] = ["blue", "black"]
            }else{
                comments_colors[com.id] = ["black", "black"]
            }
        }
        // console.log(comments_colors)
if (restaurant.images){
            images = restaurant.images
        }
    }

    if (!restaurant.restaurant){

        return <></>
    }
    console.log(restaurant, 11)
    let addComment = (event) => {

        if (!(localStorage.getItem("username") && localStorage.getItem("username").toString() !== 'null')){
            return
        }

        let elements = event.target.parentElement.parentElement.parentElement.children
        let stars = []
        let noti
        let img = document.getElementsByName("comment_image")[0]
        let body = document.getElementsByName("comment_body")[0]
        for (let i = 0; i<elements.length;i++){
            if (elements[i].className.includes('star')){
                stars.push(elements[i])
            }
            else if(elements[i].className.includes('noti')){
                noti = elements[i]
            }
        }
        let rate = 0
        for (let i = 0; i<5;i++){
            // console.log(stars[i].className)
            if(stars[i].className.includes('checked')){
                rate++
            }
        }
        if (rate === 0){
            noti.innerHTML = "Rating stars must between 1 to 5, not 0."
            return
        }
        else{
            noti.innerHTML = ""
        }
        if (! img.files[0]){
            noti.innerHTML = "You need to select a image."
            return
        }
        else{
            noti.innerHTML = ""
        }
        if (! body.value){
            noti.innerHTML = "Body should not be empty"
            return
        }
        else{
            noti.innerHTML = ""
        }


        console.log(img.files[0])
        const formData = new FormData();
        formData.append('comment_image', img.files[0]);
        formData.append('comment_body', body.value);
        formData.append('rating', rate);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access")},
            body: formData
        };

        fetch("http://127.0.0.1:8000/restaurant/" + restaurantID  +"/comment/add/", requestOptions)
            .then(response => response.json())
            .then(jason => {
                console.log(jason)
                body.value = ''
                for (let i = 0; i<5;i++){
                    // console.log(stars[i].className)
                    if(stars[i].className.includes('checked')){
                        stars[i].className = 'fa fa-star'
                    }
                }
                setRefresh(refresh+1)
            })



    }

    let Blogs =() =>{
        // if (!localStorage.getItem("username")){
        //     localStorage.setItem("blogIsOwner", "false")
        // }
        // else if(localStorage.getItem("userid")===restaurant.restaurant.belongs){
        //     localStorage.setItem("blogIsOwner", "true")
        // }else{
        //     localStorage.setItem("blogIsOwner", "false")
        // }
        localStorage.setItem("blogBelong", restaurant.restaurant.name)
        localStorage.setItem("blogIsOwner", "false")
        return navigate("/navbar/restaurant/"+restaurant.restaurant.id + "/blog/all/")
    }
    let goMenuNext = (event) =>{
        if (menuPageInfo[1]){
            setMenuPageInfo([menuPageInfo[0] +1, menuPageInfo[1]])
            setRefresh(refresh+1)
        }
    }
    let goMenuPrevious = (event) =>{
        if (menuPageInfo[0] > 1){
            setMenuPageInfo([menuPageInfo[0] - 1, menuPageInfo[1]])
            setRefresh(refresh+1)
        }
    }

    let goCommentNext = (event) =>{
        if (commentPageInfo[1]){
            setCommentPageInfo([commentPageInfo[0] + 1, commentPageInfo[1]])
            setRefresh(refresh+1)
        }
    }
    let goCommentPrevious = (event) => {
        if (commentPageInfo[0] > 1) {
            setCommentPageInfo([commentPageInfo[0] - 1, commentPageInfo[1]])
            setRefresh(refresh + 1)
        }
    }




    return <>
        <a id="top"/>

        <div id="intro" className="bg-image shadow-2-strong" style={{backgroundImage:`url("http://localhost:8000${restaurant.restaurant.background_image}")`}}>
            <div className="mask" id="mask1" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
                <div className="container d-flex align-items-center justify-content-center text-center h-100">
                    <div className="text-white">
                        {/*<div className="container col-md-5 logo">*/}
                        {/*    <Imagee url = {restaurant.restaurant.logo} classname='img-fluid'/>*/}
                        {/*    <br/> <br/>*/}
                        {/*    <Rating rate={restaurant.restaurant.rating}/>*/}
                        {/*</div>*/}
                        <div className="container col-md-2 logo">
                            <Imagee url = {restaurant.restaurant.logo} classname='img-fluid '/>

                        </div>
                        <Rating rate={restaurant.restaurant.rating}/>

                        <br/><br/>
                        <h1>{restaurant.restaurant.name}.</h1>
                        <p id="description"/>

                        <br/>
                        <div className="container res_info">
                            <p>
                                <b className="">{restaurant.restaurant.address}, {restaurant.restaurant.post_code}</b> <br/>

                                <b>{restaurant.restaurant.phone_number}</b> <br/>

                            </p>

                        </div>

                        <br/>
                        <br/>
                        <div className="btn-group btn-group-toggle" data-toggle="buttons">

                            <a href="#Link" id="menu_button">
                                <button className="button0">Menu</button>
                            </a>


                            <button className="button0" onClick={Blogs}>Blog</button>


                            <a href="#Comment">
                                <button className="button0">Comment</button>
                            </a>


                        </div>
                        <br/>
                        <br/>
                        <br/>
                    </div>
                </div>
            </div>
        </div>
        <br/>
        <br/>
        <br/>
        <div id="intro1" className="bg-image shadow-2-strong text-center col-lg-11 ">
            <div className="mask" style={{backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
                <div className=" text-white">
                    <br/><br/>
                    <h1 className="discription1">|About Us|</h1>

                    <div className="row">
                        <div className="col-6">
                            <p className="discription2 " style={{fontSize:"30px"}}>{restaurant.restaurant.description} </p>
                        </div>

                                    <Carousel images={images}/>



                    </div>
                </div>
            </div>

            <a id="Link"/>


            <hr className="line my-5" id="line"/>
            <p className="discription3 text-center">| <b>Menu</b>|</p>


            <div id="menu" className="bg-image shadow-2-strong">
                <div>
                    <div className="text-center ">
                        <div className="row">
                            <Menu menus={menus}/>
                        </div>
                    </div>
                    <div id="PNButton"  style={{marginLeft:"0"}}>
                        <button className="buttonPN" onClick={goMenuPrevious}
                                style={{marginBottom:"2%", marginLeft:"10%", marginRight:"10%", marginTop:"2%"}}> <b>Previous</b></button>
                        <button className="buttonPN" onClick={goMenuNext}
                                style={{marginBottom:"2%", marginLeft:"10%", marginRight:"10%", marginTop:"2%"}}> <b>Next</b> </button>
                    </div>
                    <br/>

                </div>
            </div>

            <br/>

            <a id="Comment"/>
            <hr className="line my-5"/>
            <h2 className="discription3 text-center">|Comments|</h2>
            <br/>
            <div className="comment">

                <Comment comments={comments} colors={comments_colors}/>


            </div>
            <div id="PNButton"  style={{marginLeft:"0"}}>
                <button className="buttonPN" onClick={goCommentPrevious}
                        style={{marginBottom:"2%", marginLeft:"10%", marginRight:"10%", marginTop:"2%"}}> <b>Previous</b></button>
                <button className="buttonPN" onClick={goCommentNext}
                        style={{marginBottom:"2%", marginLeft:"10%", marginRight:"10%", marginTop:"2%"}}> <b>Next</b> </button>
            </div>


            <hr className="line my-5"/>
            <br/>

            <div className="row text-white   justify-content-center m-auto text-center">
                <div className="col-md-6">
                    <div className="contact-inf">

                        <h1>Add Comment</h1>

                    </div>
                </div>
                <div className="col-md-7">
                    <div className="">
                        <br/>
                        <span className="rate">
                Rating:
              </span>


                        <RatingSystem/>


                        <div className="form-group">
                            <br/>
                            <label className="form-label" htmlFor="customFile">Choose
                                Images</label>
                            <div className="col-sm-10 m-auto">
                                <input type="file" className="form-control"
                                       id="customFile" name='comment_image' accept="image/*" ref={ref}/>
                            </div>
                        </div>

                        {/*<button className="btn btn-outline-light m-3" id="add_image">Add*/}
                        {/*    image*/}
                        {/*</button>*/}
                        <br/>


                        <div className="form-group ">
                            <label className="control-label col-sm-5" htmlFor="comment">Comment
                                Body:</label>
                            <div className="col-sm-10 m-auto">
                                                                <textarea className="form-control" rows="5"
                                                                          id="comment" name='comment_body'/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10 m-auto">
                                <br/>
                                <button type="submit" className="button0" onClick={addComment}>Submit
                                </button>
                            </div>
                        </div>
                        <p className="comment_notification" style={{fontSize:"25px", color:"red"}}/>
                    </div>
                </div>
            </div>
            <br/>

            <div className='col-md-12'>
                <a href="#top">
                    <button className="button0 button4 " style={{marginLeft: '85%', width:'12%'}}>Back to top</button>

                </a><br/>
            </div>
            <br/>
        </div>
        <br/>

    </>

}

export default Restaurant