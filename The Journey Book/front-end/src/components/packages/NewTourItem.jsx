import React, {Component} from 'react';
import './NewTourItem.css';
import './TourItem.css';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import NavBar from "../navigation/NavBar";
import Footer from "../navigation/Footer";
import {Link} from "react-router-dom";
import Axios from "axios";
import {CLOUDINARY_IMAGE_UPLOAD_LINK, CLOUDINARY_UPLOAD_PRESET} from "../../Constants";
import Swal from "sweetalert2";
import Foribidden from "../authorization/Foribidden";

class NewTourItem extends Component {
    constructor(props) {
        super(props);
        this.state={
            uploadedImage:'https://res.cloudinary.com/dzbv7qrm5/image/upload/v1612972884/okyjs5twyqrv00780pjg.jpg',
            duration:'',
            route:'',
            included:'',
            notIncluded:'',
            title:'',
            price:'',
            hotel:''

        }

    }

    // Base URL configuration - Change this for production
    BASE_URL = 'https://the-journey-book-backend.onrender.com'; // PRODUCTION
    // BASE_URL = 'http://localhost:8080'; // LOCAL DEVELOPMENT

    uploader =(files)=>{
          console.log("came");
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        Axios.post(CLOUDINARY_IMAGE_UPLOAD_LINK, formData).then(response => {
            this.setState({uploadedImage:response.data.secure_url})

        });
        // this.setState({uploadedImage:})

    }
    handleOnChange = event => {

        this.setState({
            [event.target.name]: event.target.value
        })
    }

    addNewTour =()=>{
        const tour = {
            title:this.state.title,
            hotel:this.state.hotel,
            img:this.state.uploadedImage,
            included:this.state.included,
            notIncluded:this.state.notIncluded,
            price: this.state.price,
            route: this.state.route,
            duration: this.state.duration


        }
        console.log("came")
        Axios.post(`${this.BASE_URL}/tours-api/tours`,tour).then(response=>{
            console.log(response);
            Swal.fire({
                title: 'Tour added successfully',
                text: 'New Tour Added!',
                icon: 'success',

                confirmButtonText: 'OK',

            });
        }).catch(error=>{
            Swal.fire({
                title: 'Tour addition Failed',
                text: 'Please try again later!',
                icon: 'error',

                confirmButtonText: 'OK',

            });
        })
    }

    render() {
      if(this.props.userType === "admin") {
          return (

              <React.Fragment>

                  <div className="breadcrumb-container container-fluid pt-5 pb-4">
                      <nav aria-label="breadcrumb">
                          <ol className="breadcrumb">
                              <li className="breadcrumb-item"><a href="/" className="breadcrumb-item-text">Home</a></li>
                              <li className="breadcrumb-item active" aria-current="page">Manage Tours</li>
                          </ol>
                      </nav>

                  </div>
                  <div className="row justify-content-around tour-item">
                      <div className="col-3">
                          <div className="col-12">
                              <div className="card image-card">
                                  <img className="card-img-top img-frame  " src={this.state.uploadedImage}
                                       alt="Card image cap"/>

                              </div>
                          </div>
                          <div className="col-12">
                              <form>
                                  <div className="form-group">

                                      <input type="file" className="form-control-file mt-3" id="exampleFormControlFile1"
                                             onChange={(event) => {
                                                 this.uploader(event.target.files)
                                             }}/>
                                  </div>
                              </form>
                          </div>
                      </div>
                      <div className="col-8">
                          <form>
                              <div className="form-row ">

                                  <div className="col-md-12">
                                      <label htmlFor="title">Title</label>
                                      <input type="text" name="title" id="title" className="form-control"
                                             placeholder="Title" onChange={this.handleOnChange}/>
                                  </div>

                              </div>
                              <div className="form-row justify-content-between">

                                  <div className="col-md-6">
                                      <label htmlFor="duration">Duration</label>
                                      <input type="text" name="duration" id="duration" className="form-control"
                                             placeholder="Duration" onChange={this.handleOnChange}/>
                                  </div>

                                  <div className="col-md-6">
                                      <label htmlFor="route">Route</label>
                                      <input type="text" name="route" id="route" className="form-control"
                                             placeholder="Route" onChange={this.handleOnChange}/>
                                  </div>
                              </div>
                              <div className="form-row justify-content-between">

                                  <div className="col-md-6">
                                      <label htmlFor="hotel">Hotel</label>
                                      <input id="hotel" name="hotel" type="text" className="form-control"
                                             placeholder="Hotel" onChange={this.handleOnChange}/>
                                  </div>

                                  <div className="col-md-6">
                                      <label htmlFor="price">Price</label>
                                      <input type="text" id="price" name="price" className="form-control"
                                             placeholder="Price" onChange={this.handleOnChange}/>
                                  </div>
                              </div>
                              <div className="form-row">

                                  <div className="col-12">
                                      <label htmlFor="included">Included</label>
                                      <textarea name="included" id="included" type="text" className="form-control"
                                                placeholder="Included" onChange={this.handleOnChange}/>
                                  </div>
                              </div>

                              <div className="form-row">

                                  <div className="col-12">
                                      <label htmlFor="notIncluded">Not Included</label>
                                      <textarea id="notIncluded" name="notIncluded" className="form-control"
                                                placeholder="Not Included" onChange={this.handleOnChange}/>

                                  </div>
                              </div>
                              <div className="form-row mt-4 justify-content-end">

                                  <div className="col-2">
                                      <button className="btn btn-new-tour-item  mb-2 px-4" onClick={() => {
                                          this.addNewTour()
                                      }}>Add Tour
                                      </button>
                                  </div>

                              </div>
                          </form>
                      </div>

                  </div>
                  <Footer/>
              </React.Fragment>

          );
      }else{
          return <Foribidden/>
      }
    }
}

export default NewTourItem;