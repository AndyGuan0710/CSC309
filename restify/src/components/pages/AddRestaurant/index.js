import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import $ from "jquery";
import formLogo from "../../Common/images/p1.jpg";

const AddRestaurant = ()=>{
    const [restaurant, setRestaurant] = useState({});
    let navigate = useNavigate();
    // ['id', 'name', 'address', 'post_code', 'description', 'phone_number', 'logo', 'background_image']
    let nameChange =(event)=>{
        if(event.target.value===''){$("#nameN").html("Restaurant name should not be empty")}
        else{$("#nameN").html("")}
    }
    let addressChange =(event)=>{
        if(event.target.value===''){$("#addressN").html("Restaurant address should not be empty")}
        else{$("#addressN").html("")}
    }
    let postCodeChange =(event)=>{
        if(event.target.value===''){$("#postCodeN").html("Restaurant post code should not be empty")}
        else{$("#postCodeN").html("")}
    }
    let descriptionChange =(event)=>{
        if(event.target.value===''){$("#descriptionN").html("Restaurant description should not be empty")}
        else{$("#descriptionN").html("")}

    }
    let phoneChange =(event)=>{
        if(event.target.value===''){$("#phoneN").html("Restaurant phone number should not be empty")}
        else{$("#phoneN").html("")}

    }
    let logoChange =(event)=> {
        if(event.target.files.length === 0){$("#logoN").html("Restaurant logo should not be empty")}
        else{$("#logoN").html("")}
    }
    let backgroundImageChange =(event)=>{
        if(event.target.files.length === 0){$("#backgroundN").html("Restaurant logo should not be empty")}
        else{$("#backgroundN").html("")}
    }
    let Edit =(event)=>{
        let rName = document.getElementById("name")
        let rAddress = document.getElementById("address")
        let rPostCode = document.getElementById("post_code")
        let rPhoneNumber = document.getElementById("phone_number")
        let rDescription = document.getElementById("description")
        let rLogo = document.getElementById("logo")
        let rBackground = document.getElementById("background")
        if(rName.value===''){$("#nameN").html("Restaurant name should not be empty")}
        if(rAddress.value===''){$("#addressN").html("Restaurant address should not be empty")}
        if(rPostCode.value===''){$("#postCodeN").html("Restaurant post code should not be empty")}
        if(rPhoneNumber.value===''){$("#phoneN").html("Restaurant phone number should not be empty")}
        if(rDescription.value===''){$("#descriptionN").html("Restaurant description should not be empty")}
        if(rLogo.files.length === 0){$("#logoN").html("Restaurant logo should not be empty")}
        if(rBackground.files.length === 0){$("#backgroundN").html("Restaurant logo should not be empty")}
        if(rName.value===''||rAddress.value===''||rPostCode.value===''||rPhoneNumber.value===''||rDescription.value===''||rLogo.files.length===0||rBackground.files.length===0){
            return}
        const formData = new FormData();
        formData.append('name', rName.value);
        formData.append('address', rAddress.value);
        formData.append('post_code', rPostCode.value);
        formData.append('phone_number', rPhoneNumber.value);
        formData.append('description', rDescription.value);
        formData.append('logo', rLogo.files[0]);
        formData.append('background_image', rBackground.files[0]);
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
            method: 'POST',
            headers: {'Authorization': 'Bearer ' + localStorage.getItem("access")},
            body:formData
        };
        fetch("http://127.0.0.1:8000/restaurant/add/", requestOptions)
            .then(response => response.json())
            .then(jason => {
                console.log(jason)
                if(jason.detail && jason.detail.includes("already")){navigate('/')}
                else{navigate("/navbar/restaurant/")}})
    }


    let toBack = (event) =>{
        return navigate("/")
    }



    return<>
        <div className="container contact editRestaurant">
            <br/>
            <br/>
            <div className="row editRestaurant">
                <div className="col-md-3 editRestaurant">
                    <div className="contact-inf editRestaurant">
                        <img src={formLogo}  alt="image" id="small_image"/>

                        <h3 className="editRestaurant hh3">Create Restaurant</h3>
                        <h4 className="editRestaurant">Add Your Restaurant Information!</h4>
                    </div>
                </div>
                <div className="col-md-9 editRestaurant">
                    <div className="contact-for editRestaurant">
                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="name">Restaurant
                                Name: <span id="nameN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="text" className="form-control editRestaurant" id="name"
                                       placeholder="New restaurant name" name="fname" onChange={nameChange}/>
                            </div>
                        </div>
                        <br/>


                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="address">Address:
                                <span id="addressN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="text" className="form-control editRestaurant" id="address"
                                       placeholder="New address" name="fname" onChange={addressChange}/>
                            </div>
                        </div>
                        <br/>


                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="post_code">Postal
                                Code: <span id="postCodeN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant" >
                                <input type="text" className="form-control editRestaurant" id="post_code"
                                       placeholder="New postal code" name="fname" onChange={postCodeChange}/>
                            </div>
                        </div>
                        <br/>

                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant" htmlFor="phone_number">Phone
                                Number: <span id="phoneN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="text" className="form-control editRestaurant" id="phone_number"
                                       placeholder="New Phone Number" name="fname" onChange={phoneChange}/>
                            </div>
                        </div>
                        <br/>


                        <div className="form-group editRestaurant">
                            <label className="form-label col-sm-10 editRestaurant" htmlFor="logo">New
                                Logo: <span id="logoN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="file" className="form-control editRestaurant"
                                       id="logo" accept="image/*" onChange={logoChange}/>
                            </div>
                        </div>

                        <br/>


                        <div className="form-group editRestaurant">
                            <label className="form-label col-sm-10 editRestaurant" htmlFor="background">New
                                Background Image: <span id="backgroundN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                <input type="file" className="form-control editRestaurant"
                                       id="background" accept="image/*" onChange={backgroundImageChange}/>
                            </div>
                        </div>


                        <br/>
                        <div className="form-group editRestaurant">
                            <label className="control-label col-sm-10 editRestaurant"
                                   htmlFor="description">New Restaurant
                                Description: <p id="descriptionN" style={{color:"red"}}/></label>
                            <div className="col-sm-10 editRestaurant">
                                                                    <textarea className="form-control editRestaurant" rows="5"
                                                                              id="description" onChange={descriptionChange}/>
                            </div>
                        </div>
                        <div className="form-group editRestaurant">
                            <div className="col-sm-offset-2 col-sm-10 editRestaurant">
                                <button className="btn btn-default button11" onClick={Edit}>Submit
                                </button>
                                <button className="button0 editRestaurant" onClick={toBack}
                                        style={{width:"15%", height:"10%"}}>Back</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            <div className="d-flex align-items-center justify-content-center editRestaurant">




            </div>
        </div>
    </>
}
export default AddRestaurant