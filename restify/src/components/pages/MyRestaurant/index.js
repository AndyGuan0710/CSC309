import "./restaurant.css"
import React, {useEffect, useState} from "react";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import { useNavigate } from "react-router-dom";
import Imagee from "../../Common/Image";
import TimeAgo from "../../Common/TimeAgo";


const Menu = ({menus}) => {


    let navigate = useNavigate();
    const {refresh, setRefresh} = useContext(APIContext)
    if(!menus.length){return<h1 style={{color:"white"}}>No Menus Yet ~</h1>}
    let menu_edit =(event)=>{
        // console.log(event.target.name)
        return navigate("/navbar/restaurant/menu/edit/" + event.target.name + "/")
    }
    let deleteMenu = (event) => {
        let menuId = event.target.name
        const requestOption = {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access"),
            }
        };
        fetch("http://127.0.0.1:8000/restaurant/menu/delete/"+ menuId +"/", requestOption)
            .then(jason => console.log(jason))
            .then(()=> {setRefresh(refresh +1)})
    }
    return<>
        {menus.map(menu => (
            <div className="mb-2 flex-container rounded " style={{width:'49%'}} key={menu.id}>
                <div className="flex-item-left">
                    <img src={menu.menu_image} alt="#" className="img-fluid" style={{height:"95%"}}/>
                </div>
                <div className="flex-item-middle">
                    <h4>{menu.name}</h4>
                    <p className="card-text n" style={{fontSize:"18px"}}>
                        {menu.description}
                    </p>
                </div>
                <div className="flex-item-right">
                    <div className="edit">
                        <button type="button" className="btn btn-light  button5"
                                id="price1" style={{fontSize:"15px"}}>Price: {menu.price}$
                        </button>
                        <button  className="btn btn-outline-dark" onClick={menu_edit} name={menu.id} style={{width:"70%"}}>Edit</button>
                        <button  className="btn btn-outline-dark" onClick={deleteMenu} name={menu.id}>Delete</button>
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
            .then(jason => console.log(jason))

        setRefresh(refresh+1)

    }


    return<>
        {comments.map((comment) => (
            <div className="card mb-3  col-lg-10" key={comment.id}>
                <div className="row no-gutters">
                    <div className="col-md-4">

                        <img src={comment.comment_image} alt="#" className="card-img img-fluid h-100" style={{height:"15vw", objectFit:"cover"}}/>
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

const Carousel = ({images, restaurant_id}) => {
    let navigate = useNavigate();
    let toADDRestaurantImage = () =>{

        return navigate("/navbar/restaurant/image/add/")
    }
    let toDeleteRestaurantImage = () =>{
        return navigate("/navbar/restaurant/" +restaurant_id+"/image/delete/")
    }
    if (images.length === 0){
        return<>
            <div className="col-6">

                <div style={{marginRight:"23%"}}>

                    <button className="button0" onClick={toADDRestaurantImage}>Add Images</button>
                </div>
            </div>
        </>
    }
    let first = images[0]
    images = images.slice(1)


    return<>
        <div className="col-6">

            <div id="carouselExampleControls" className="carousel slide"
                 data-bs-ride="carousel">
                <div className="carousel-inner">
        <div className="carousel-item active" key="0">
            <Imagee url={first.image} classname="d-block w-100" alt="..."/>
        </div>
        {images.map((image, index) => (
            <div className="carousel-item " key={index+1}>
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
            <div style={{marginRight:"23%"}}>
            <button className="button0" onClick={toDeleteRestaurantImage}>Delete Images</button>
            <button className="button0" onClick={toADDRestaurantImage}>Add Images</button>
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
            <span className="fa fa-star" key={index+5}/>
        ))}
    </>
}





const MyRestaurant = () => {

    const [restaurant, setRestaurant] = useState({});
    const [menu, setMenu] = useState([]);
    const {refresh, setRefresh} = useContext(APIContext)
    const [menuPageInfo, setMenuPageInfo] = useState([1, false]);
    const [commentPageInfo, setCommentPageInfo] = useState([1, false]);
    const [comment, setComment] = useState([]);

    let navigate = useNavigate();
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
    const profile_option = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    useEffect(() => {

        fetch("http://127.0.0.1:8000/restaurant/own/restaurant/", profile_options)
            .then(response => response.json())
            .then(jason => {setRestaurant(jason.results)

                    let menuPageString ="?page=" + menuPageInfo[0]
                    // console.log(menuPageString)
                fetch("http://127.0.0.1:8000/restaurant/" + jason.results.restaurant.id + "/menus/all/" + menuPageString, profile_option)
                    .then(response => {
                        if (response.ok){
                            return response.json()
                        }else {goMenuPrevious()}})
                    .then(jason => {setMenu(jason.results)
                        setMenuPageInfo([menuPageInfo[0], jason.next !== null])
                    } )

                let commentPageString ="?page=" + commentPageInfo[0]
                let option = profile_option
                if(localStorage.getItem("username").toString() !== 'null' && localStorage.getItem("username")){
                    option = profile_options
                }
                fetch("http://127.0.0.1:8000/restaurant/" + jason.results.restaurant.id + "/comments/all/" + commentPageString, option)
                    .then(response => {
                        return response.json()})
                    .then(jason => {setComment(jason.results)
                        setCommentPageInfo([commentPageInfo[0], jason.next !== null])
                    } )


                })

    }, [setRefresh, refresh])


    let menus = menu
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

    console.log(comment, comments_colors)

    let Blogs =() =>{

        localStorage.setItem("blogBelong", restaurant.restaurant.name)
        localStorage.setItem("blogIsOwner", "true")
        return navigate("/navbar/restaurant/"+restaurant.restaurant.id + "/blog/all/")
    }

    let addMenu = ()=>{
        return navigate("/navbar/restaurant/menu/add/")
    }
    let toEditRestaurant = () =>{
        return navigate("/navbar/restaurant/edit/")
    }

    let Delete = (event) => {
        let restaurantId = event.target.name
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
                'Authorization': 'Bearer ' + localStorage.getItem("access"),}
        };
        fetch("http://127.0.0.1:8000/restaurant/delete/"+ restaurantId +"/", requestOption)
            .then(jason => console.log(jason))
            .then(()=> {navigate("/navbar/profile/")})
    }


    if (!restaurant.restaurant){

        return <></>
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
    let goCommentPrevious = (event) =>{
        if (commentPageInfo[0] > 1){
            setCommentPageInfo([commentPageInfo[0] - 1, commentPageInfo[1]])
            setRefresh(refresh+1)
        }
    }



    return <>
        <a id="top"/>

        <div id="intro" className="bg-image shadow-2-strong" style={{backgroundImage:`url("http://localhost:8000${restaurant.restaurant.background_image}")`}}>
            <div className="mask" id="mask1" style={{backgroundColor: 'rgba(0, 0, 0, 0.8)'}}>
                <div className="container d-flex align-items-center justify-content-center text-center h-100">
                    <div className="text-white">

                        <div className="container col-md-2 logo">
                            <Imagee url = {restaurant.restaurant.logo} classname='img-fluid'/>
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

                                            <a href="#Link" id="menu_button" style={{margin:"0"}} >
                                                <button className="button0" style={{margin:"0"}}>Menu</button>
                                            </a>


                                            <button className="button0" onClick={Blogs} style={{margin:"0"}}>Blog</button>

                                            <a href="#Comment" style={{margin:"0"}}>
                                                <button className="button0" style={{margin:"0"}}>Comment</button>
                                            </a>
                                            <button className="button0" onClick={toEditRestaurant} style={{margin:"0"}}>Edit</button>
                                            <button className="button0" onClick={Delete} style={{margin:"0"}} name={restaurant.restaurant.id}>Delete</button>

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
                                            <p className="discription2 ">{restaurant.restaurant.description} </p>
                                        </div>
    {/*                                    <div className="col-6">*/}

    {/*                                        <div id="carouselExampleControls" className="carousel slide"*/}
    {/*                                             data-bs-ride="carousel">*/}
    {/*                                            <div className="carousel-inner">*/}
    {/*                                                <Carousel images={images}/>*/}


    {/*                                            </div>*/}
    {/*                                            <button className="carousel-control-prev" type="button"*/}
    {/*                                                    data-bs-target="#carouselExampleControls" data-bs-slide="prev">*/}
    {/*                                                <span className="carousel-control-prev-icon"*/}
    {/*aria-hidden="true"/>*/}
    {/*                                                <span className="visually-hidden">Previous</span>*/}
    {/*                                            </button>*/}
    {/*                                            <button className="carousel-control-next" type="button"*/}
    {/*                                                    data-bs-target="#carouselExampleControls" data-bs-slide="next">*/}
    {/*                                                <span className="carousel-control-next-icon"*/}
    {/*aria-hidden="true"/>*/}
    {/*                                                <span className="visually-hidden">Next</span>*/}
    {/*                                            </button>*/}
    {/*                                        </div>*/}
    {/*                                    </div>*/}
                                        <Carousel images={images} restaurant_id={restaurant.restaurant.id}/>



                                    </div>
                            </div>
                        </div>

                        <a id="Link"/>


                        <hr className="line my-5" id="line"/>
                        <p className="discription3 text-center">| <b>Menu </b>|</p>


                        <div id="menu" className="bg-image shadow-2-strong">
                            <div>
                                <div className="text-center ">
                                    <div className="row">
                                <Menu menus={menus}/>
                                    </div>
                                </div>
                                <br/>
                                {/*<div id="PNButton"  style={{marginLeft:"0"}}>*/}
                                {/*    <button className="buttonPN" onClick={null}*/}
                                {/*            style={{marginBottom:"2%", marginLeft:"10%", marginRight:"10%", marginTop:"2%"}}> <b>Previous</b></button>*/}
                                {/*    <button className="buttonPN" onClick={null}*/}
                                {/*            style={{marginBottom:"2%", marginLeft:"10%", marginRight:"10%", marginTop:"2%"}}> <b>Next</b> </button>*/}
                                {/*</div>*/}
                                <div className="col-md-12 text-center">
                                    <button className="buttonPN" onClick={goMenuPrevious}
                                            style={{marginBottom:"2%", marginLeft:"5%", marginRight:"5%", marginTop:"2%"}}> <b>Previous</b></button>
                                    <a className="btn btn-outline-light btn-lg m-2 text-center" role="button"
                                       href="#" onClick={addMenu}>Add menu</a>
                                    <button className="buttonPN" onClick={goMenuNext}
                                            style={{marginBottom:"2%", marginLeft:"5%", marginRight:"5%", marginTop:"2%"}}> <b>Next</b> </button>
                                </div>
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

                                    <div className='col-md-12'>
                                    <a href="#top">
                                        <button className="button0 button4 " style={{marginLeft: '85%', width:'12%'}}>Back to top</button>
                                    </a><br/><br/><br/>
                                     </div>

                    </div>
        <br/>

    </>

}

export default MyRestaurant;
