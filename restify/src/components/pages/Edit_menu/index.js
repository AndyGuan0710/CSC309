
import React, {useEffect, useState} from "react";
import {useContext} from "react";
import {APIContext} from "../../../Contexts/APIContext";
import {useNavigate, useParams} from "react-router-dom";
import Imagee from "../../Common/Image";
import icon from "../../Common/images/menu_logo.png";
import $ from "jquery";

const MenuEdit = () => {
    const [menu, setMenu] = useState({});
    const [menudata, setMenudata] = useState({id: 0, name:'', price:0, image:null, description:''});
    let navigate = useNavigate();
    let menuID = useParams().menu_id;
    const {setRefresh} = useContext(APIContext)


    let nameCheck = (event) =>{

        if (event.target.value === ''){
            $("#nameN").html("Menu name should not be empty")
        }else{
            $("#nameN").html("")
        }
        setMenudata({...menudata, name: event.target.value})
    }
    let priceCheck = (event) =>{

        if (! /^\d+.?\d+$/.test(event.target.value)){
            $("#priceN").html("Please enter a valid number")
        }else{
            $("#priceN").html("")
        }
        setMenudata({...menudata, price: event.target.value})
    }
    let imageCheck = (event) =>{

        if (event.target.files.length!==0) {
            setMenudata({...menudata, image: event.target.files[0]})
        }
    }
    let bodyCheck = (event) =>{

        if (event.target.value === ''){
            $("#descriptionN").html("Menu description should not be empty")
        }else{
            $("#descriptionN").html("")
        }
        setMenudata({...menudata, description: event.target.value})
    }
    let backTo = (event) =>{
        return navigate('/navbar/restaurant/')
    }


    let menuSubmit = (event) => {
        let name_check = menudata.name !== ''
        let price_check = /^\d+.?\d+$/.test(menudata.price)
        let image_check = document.getElementById("menu_images").files.length !== 0
        let body_check = menudata.description !== ''
        // console.log(name_check, price_check, image_check, body_check)
        if (!(name_check && price_check && body_check)){
            return
        }
        const formData = new FormData();
        formData.append('name', menudata.name);
        formData.append('price', menudata.price);
        if (image_check){
            formData.append('menu_image', document.getElementById("menu_images").files[0]);
        }
        formData.append('description', menudata.description);
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access")},
            body: formData
        };
        fetch("http://127.0.0.1:8000/restaurant/menu/edit/"+menudata.id+'/', requestOptions)
            .then(response => {
                console.log(response)
                if(response.ok)
                    navigate('/navbar/restaurant/#line')
                    return response.json()})
            // .then(()=>navigate('/navbar/restaurant/#line'))

        // function delay(time) {
        //     return new Promise(resolve => setTimeout(resolve, time));
        // }
        // delay(200).then(() => console.log('ran after 5 second1 passed')).then(()=>navigate('/navbar/restaurant/#line'))

    }

    if(! menu.id){
        const requestOption = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: localStorage.getItem("username"), password: localStorage.getItem("password")})
        };

        fetch("http://127.0.0.1:8000/accounts/api/token/", requestOption)
            .then(response => response.json())
            .then(jason => {
                localStorage.setItem("access", jason.access)
            })
            .catch()
        const requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("access")},
        };
        fetch("http://127.0.0.1:8000/restaurant/menu/edit/"+menuID+"/", requestOptions)
            .then(response => response.json())
            .then(jason => {
                setMenu(jason)
            setMenudata({id:jason.id, name: jason.name, image: jason.menu_image, description: jason.description, price:jason.price})})
    }

    // useEffect(() => {
    //     fetch("http://127.0.0.1:8000/restaurant/menu/edit/2/", requestOptions)
    //         .then(response => response.json())
    //         .then(jason => {setMenu(jason)})
    // }, [])



    if (menu === {}){
        return<></>
    }





    return<>
        <div id="body3">
            <br/><br/>
        <div className="container contact">
            <div className="row">
                <div className="col-md-3">
                    <div className="contact-info">
                        <img src={icon}  alt="image" id="menu_logo"/>

                        <h2>Edit Your New Menu here.</h2>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="contact-form">
                        <div className="form-group">
                            <label className="control-label col-sm-10" htmlFor="dishname">New Dish Name: <span id="nameN" style={{color:"red"}}/></label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="dishname" placeholder="Enter Dish Name"
                                       name="dishname" onChange={nameCheck}  value={menudata.name}/>
                            </div>
                        </div>



                        <div className="form-group">
                            <label className="control-label col-sm-10" htmlFor="price">New Price: <span id="priceN" style={{color:"red"}}/></label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="price" placeholder="Enter Dish Price"
                                       name="price" onChange={priceCheck} value={menudata.price}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="control-label col-sm-10" htmlFor="price">New Picture: <span id="imageN" style={{color:"red"}}/></label>
                            <div className="col-sm-10">
                                <input type="file" multiple="multiple" id="menu_images" accept="image/*" onChange={imageCheck} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="control-label col-sm-10" htmlFor="description" >New Description: <span id="descriptionN" style={{color:"red"}}/></label>
                            <div className="col-sm-10">
                                <textarea className="form-control" rows="5" id="description"
                                          placeholder="Enter Menu Description Here"
                                          onChange={bodyCheck} value={menudata.description}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button type="submit" className="btn btn-default" onClick={menuSubmit}>Submit</button>
                            </div>
                        </div>

                    </div>

                    <br/>

                </div>
                <div className="d-flex align-items-center justify-content-center">


                    <button className="button0" onClick={backTo}>Back</button>

                </div>
            </div>
        </div>
        </div>
    </>
}
export default MenuEdit