import React, {Component} from 'react';
import NavBar from "../navigation/NavBar";
import TourItem from "./TouItem";
import './TourList.css';
import Footer from "../navigation/Footer";
import { Link } from 'react-router-dom';
import Axios from "axios";

class TourList extends Component{
    constructor(props){
        super(props);
        this.state={
            tours:[]
        }
    }
    componentDidMount() {
        Axios.get("http://localhost:8080/tours-api/tours").then(response=>{
            this.setState({tours:response.data})

        }).catch(error=>{
            console.log("Data Loading Failed");
        })
    }

    render() {

        return(
            <React.Fragment>


                <div className="breadcrumb-container container-fluid">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/" className="breadcrumb-item-text">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Tours</li>
                        </ol>
                    </nav>

                </div>
                <div className="container-fluid">
                    <div className="row justify-content-end">
                        <div className="col-3 align-right col-lg-2 new-tour-col">
                            <Link to="/manage-tours"> <button className="btn btn-new-tour-item float-right">Add Tour</button></Link>
                        </div>
                    </div>
                </div>

            <div className="tour-list-container container ">
                {
                    this.state.tours.map(tour=>{
                        return (<TourItem key={tour.id} tour={tour} userType={this.props.userType}/>);
                    })
                }

            </div>
                <Footer/>
            </React.Fragment>

        );

    }

}
export default TourList;