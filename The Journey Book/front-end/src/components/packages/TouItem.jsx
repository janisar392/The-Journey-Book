import React, {Component} from 'react';
import './TourItem.css';
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRecycle} from "@fortawesome/free-solid-svg-icons/faRecycle";
import {faRemoveFormat} from "@fortawesome/free-solid-svg-icons/faRemoveFormat";
import {faTrash} from "@fortawesome/free-solid-svg-icons/faTrash";
import Swal from "sweetalert2";

class TourItem extends Component{
    constructor(props){
        super(props);
        
        // Base URL configuration - Change this for production
        this.BASE_URL = 'https://the-journey-book-backend.onrender.com'; // PRODUCTION
        // this.BASE_URL = 'http://localhost:8080'; // LOCAL DEVELOPMENT
    }
    
    removeTour =(title)=>{
        Axios.delete(`${this.BASE_URL}/tours-api/tours/`+title).then(response=>{

            if(response.status == "200"){
                Swal.fire({
                    title: 'Tour deleted successfully',
                    text: 'Tour Deleted!',
                    icon: 'success',

                    confirmButtonText: 'OK',

                });
            }
        }).catch(error=>{
            Swal.fire({
                title: 'Tour deletion Failed!',
                text: 'Please try again later',
                icon: 'error',

                confirmButtonText: 'OK',

            });
        })
    }
    
    render() {
        const{title,img,price,included,notIncluded,hotel,route,duration} = this.props.tour;
        let deleteBtn = null;
        if(this.props.userType === "admin"){
            deleteBtn = <div className="btn btn-danger ml-4 mt-3 " onClick={()=>{this.removeTour(title)}}><FontAwesomeIcon icon={faTrash}/>Remove</div>;

        }
        return(

            <div className="row justify-content-around tour-item">
                <div className="col-md-3 ">
                <div className="card " >
                    <img className="card-img-top" src={img} alt="Card image cap"/>

                </div>
                </div>
                <div className="col-md-8 mt-4 mt-md-0">
                      <h4 className="package-main-header">{title}</h4>
                       <div className="package-sub-headers">Duration: {duration}</div>
                    <div className="package-sub-headers">Route: {route}</div>
                    <div className="package-sub-headers">Included: {included}</div>
                    <div className="package-sub-headers">Not Included: {notIncluded}</div>
                    <div className="package-sub-headers">Hotel: {hotel}</div>
                    <div className="package-sub-headers">Price: {price}</div>
                    <div className="btn btn-success mt-3 "><FontAwesomeIcon className="mr-2" icon={faEnvelope}/>Book Now</div>
                    {deleteBtn}
                </div>

            </div>


        );
    }
}

export default TourItem;