import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from "react-router-dom";
import moment from 'moment';
import { getServiceRequestList } from '../store/Slices/services/RequestServiceSclice';
import { pay } from '../store/Slices/payments/paymentSlice';
import {Loading} from '../front-end/common/Loading';
import {useStripe, useElements, CardElement} from '@stripe/react-stripe-js';
// import Echo from "laravel-echo"
// import io from "socket.io-client";
export const ServicesHistory = (props) => {

    const {location, history} = props;
    // const location = useLocation();

    const [state, setState] = useState({
        payable: '',
        error: ''
    });
    const stripe = useStripe();
    const elements = useElements();
    const [checkoutError, setCheckoutError] = useState();

    const dispatch = useDispatch();

    const loading = useSelector((state) => state?.serviceRequest?.list?.loading);
    const error = useSelector((state) => state?.serviceRequest?.list?.error);
    const message = useSelector((state) => state?.serviceRequest?.list?.message);
    const serviceRequestList = useSelector((state) => state?.serviceRequest?.list?.data);


    const payLoading = useSelector((state) => state?.paymentReducer?.loading);
    const payError = useSelector((state) => state?.paymentReducer?.error);
    const payMessage = useSelector((state) => state?.paymentReducer?.message);
    const payData = useSelector((state) => state?.paymentReducer?.data);

    useEffect(() => {
        dispatch(getServiceRequestList(location.search));
      return () => {
      };
    }, []);

    useEffect(() => {
        // window.io = io;
        // const liveOption = {
        //     host: "http://api.farenow.com:6001",
        //     broadcaster: 'socket.io',
        //     client : window.io,
        // };
        // const localOption = {
        //     host: "http://localhost:6001",
        //     broadcaster: 'socket.io',
        //     client : window.io,
        // };
        // // 'auth': {headers: {Authorization: localStorage.userToken }}
        // // 'rejectUnauthorized': false,
        // if (typeof window.io != 'undefined') {
        //     window.Echo = new Echo(localOption);

            
        //     window.Echo.connector.socket.on('connect', function(){
        //         console.log("connect");
        //     });

        //     // window.Echo.connector.socket.on('disconnect', function(){
        //     //     console.log("disconnect");
        //     // });

            
        //     window.Echo.channel('newMessage-3-2')
        //     .listen('MessageEvent', (message) => {
        //         console.log(message);  
        //     });  
        //     console.log(window.Echo);
        // } 
    });


    useEffect(() => {
      dispatch(getServiceRequestList(location.search));
    }, [location.search]);

    /**
     * get payable object and set state
     * 
     * @param {object} payable 
     */
    const handlePaymentClick = (payable) => {
        setState((state)=>({...state, payable}));
    }

    /**
     * close modal and remove payable state
     */
    const handleCloseClick = () => {
        setState((state)=>({...state, payable: ''}));
    }

    /**
     * handle card details change
     * 
     * @param {object} event 
     */
    const handleCardDetailsChange = (event) => {
        console.log();
        if(event.error){
            setCheckoutError(event.error.message)
        } else {
            // setState((state) => ({ ...state, error: { ...state.error, stripeErr: undefined } }))
            setCheckoutError();
        } 
    };

    const handlePayClick = async () => {
        const cardElement = elements.getElement('card');
        try {
            const { error, token } = await stripe.createToken(
                elements.getElement(CardElement)
            );
            if(token && state.payable !== undefined){
                dispatch(pay({token: token.id, payable_id: state.payable.id}));
            }
            if(error){
                setState((state) => ({ ...state, error: { ...state.error, stripeErr: error.message } }))
            }
        } catch (error) {
            setState((state) => ({ ...state, error: { ...state.error, stripeErr: error.message } }))
        }  
    }

    return (
        <>
            <div className="breadcrumb-dash">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Services History</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashborad-box order-history pb-5" style={{ backgroundImage: `url("/assets/img/apply-bg.jpg")` }}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="page-title">Services History</div>
                            {loading && <Loading/>}
                            {
                                (loading == false && error == true && message) && 
                                <div className="col-12  alert alert-danger text-center" role="alert" style={{fontSize: 15}}>
                                    {message}
                                </div>
                            }
                        </div>
                        {serviceRequestList?.data && serviceRequestList?.data?.map((serviceRequest, index)=>(
                        <div className="col-md-6" key={index}>
                            <div className="order-card d-flex align-items-center justify-content-between">
                                <div className="order-des-b">
                                    <div className="title">{`${serviceRequest?.provider?.first_name} ${serviceRequest?.provider?.last_name}`}</div>
                                    {serviceRequest?.sub_service && <div className="service-label">{serviceRequest.sub_service}</div>}
                                    <div className="star-rating-area d-flex align-items-center justify-content-start">
                                        <div className="rating-static clearfix mr-3" rel={serviceRequest?.user_feeback?.rating}>
                                            <label className="full" title="{{ 'Awesome - 5 stars' | translate }}" ></label>
                                            <label className="half" title="{{ 'Excellent - 4.5 stars' | translate }}" ></label>
                                            <label className="full" title="{{ 'Excellent - 4 stars' | translate }}" ></label>
                                            <label className="half" title="{{ 'Better - 3.5 stars' | translate }}" ></label>
                                            <label className="full" title="{{ 'Good - 3 stars' | translate }}" ></label>
                                            <label className="half" title="{{ 'Good - 2.5 stars' | translate }}" ></label>
                                            <label className="full" title="{{ 'Fair - 2 stars' | translate }}" ></label>
                                            <label className="half" title="{{ 'Fair - 1.5 stars' | translate }}" ></label>
                                            <label className="full" title="{{ 'Bad - 1 star' | translate }}" ></label>
                                            <label className="half" title="{{ 'Bad - 0.5 stars' | translate }}" ></label>
                                        </div>
                                        {/* <div className="ratilike ng-binding">5</div> */}
                                    </div>
                                    <div className="order-time">{moment(serviceRequest?.created_at).fromNow()}</div>
                                </div>
                                <div className="order-btn-b">
                                    <div className="btn-price-serv mb-3">{
                                        (()=>{
                                            if(serviceRequest.working_status == null){
                                                return "Not Started yet!"
                                            }

                                            if(serviceRequest.working_status == 'STARTED'){
                                                return "Started"
                                            }

                                            if(serviceRequest.working_status == 'PAUSED'){
                                                return "Paused"
                                            }

                                            if(serviceRequest.working_status == 'ENDED' && serviceRequest.is_completed == true){
                                                return "Completed" 
                                            }

                                        })()
                                        // serviceRequest?.payable_amount != null ? "$"+(parseInt(serviceRequest?.payable_amount) + parseInt(serviceRequest?.paid_amount)) : "$"+serviceRequest?.paid_amount
                                    }</div>
                                    <Link to={`/profile/${serviceRequest?.provider?.id}`} className="btn-view-profile">View Profile</Link>
                                    {
                                    serviceRequest.paid_amount &&
                                        (()=>{
                                            if(serviceRequest?.payment_status == false && serviceRequest?.payable){
                                                return (
                                                    <div
                                                        type="button"
                                                        className="btn-price-serv"
                                                        style={{backgroundColor: 'red'}}
                                                        onClick={()=>handlePaymentClick(serviceRequest?.payable)}
                                                        data-backdrop="static"
                                                        data-keyboard="false" 
                                                        data-toggle="modal" 
                                                        data-target="#payable"
                                                    >{
                                                        serviceRequest?.payable_amount != null ? "$"+(parseInt(serviceRequest?.payable_amount) + parseInt(serviceRequest?.paid_amount)) : "$"+serviceRequest?.paid_amount
                                                    }</div>
                                                )
                                            } else {
                                                return (
                                                    <div className="btn-price-serv">{
                                                        serviceRequest?.payable_amount != null ? "$"+(parseInt(serviceRequest?.payable_amount) + parseInt(serviceRequest?.paid_amount)) : "$"+serviceRequest?.paid_amount
                                                    }</div>
                                                )
                                            }
                                        })()
                                    }
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                    <nav aria-label="...">
                        {serviceRequestList?.last_page && <center className="display-4 m-2">There are total pages {serviceRequestList?.last_page}</center>}
                        <ul className="pagination pagination-lg justify-content-center">
                            { 
                                <li className={`page-item ${serviceRequestList?.prev_page_url == null && "disabled"}`}>
                                    {location.search == serviceRequestList?.prev_page_url ? (
                                    <span className="page-link" style={{cursor: "pointer"}}>Previous</span>
                                ) : (
                                    <Link className="page-link" to={location => `${location.pathname}${serviceRequestList?.prev_page_url}`} >Previous</Link>
                                )}
                                </li>
                            }
                            {serviceRequestList?.current_page ? (
                                <li className={`page-item active`}>
                                    <span className={`page-link`} style={{cursor: "pointer"}}>{serviceRequestList?.current_page}</span>
                                </li>
                            ): (
                                ""
                            )}
                            {
                                (()=>{
                                    // const { current_page, last_page } = serviceRequestList !== null && serviceRequestList !== undefined;
                                    // if(last_page - current_page > 5){
                                    //     return [...Array(5).keys()].map(((pageNo, num)=>(
                                    //         <li key={num} className={`page-item ${num == 0 ? 'active' : ""}`}>
                                    //             <span className={`page-link`} style={{cursor: "pointer"}}>{num}</span>
                                    //         </li>
                                    //     )));
                                    // }
                                    // if(current_page !== undefined && last_page !== undefined && last_page == current_page ){
                                    //     return(
                                    //         <li className={`page-item active`}>
                                    //             <span className={`page-link`} style={{cursor: "pointer"}}>{last_page}</span>
                                    //         </li>
                                    //     )
                                    // }
                                })()
                            }
                            {/* {serviceRequestList?.current_page == 1 ? (
                                <li className={`page-item ${serviceRequestList?.current_page == 1 ? 'active': ''}`}>
                                    <span className={`page-link`} style={{cursor: "pointer"}}>1</span>
                                </li>
                            ) : (
                                <li className={`page-item ${serviceRequestList?.current_page == 1 ? 'active': ''}`}>
                                    <Link className="page-link" to={location => `${location.pathname}${serviceRequestList?.next_page_url}`} >1</Link>
                                </li>
                            )}
                            {serviceRequestList?.current_page == serviceRequestList?.last_page ? (
                                <li className={`page-item ${serviceRequestList?.current_page == serviceRequestList?.last_page ? 'active': ''}`}>
                                    <span className={`page-link`} style={{cursor: "pointer"}}>{serviceRequestList?.last_page}</span>
                                </li>
                            ) : (
                                <li className={`page-item ${serviceRequestList?.current_page == serviceRequestList?.last_page ? 'active': ''}`}>
                                    <Link className="page-link" to={location => `${location.pathname}${serviceRequestList?.next_page_url}`} >{serviceRequestList?.last_page}</Link>
                                </li>
                            )} */}
                            
                            {/* <li className="page-item"><a className="page-link" href="#">3</a></li> */}
                            <li className={`page-item ${serviceRequestList?.current_page == serviceRequestList?.last_page && "disabled active"}`}>
                                {location.search == serviceRequestList?.next_page_url ? (
                                    <span className="page-link" style={{cursor: "pointer"}}>Next</span>
                                ) : (
                                    <Link className="page-link" to={location => `${location.pathname}${serviceRequestList?.next_page_url}`} >Next</Link>
                                )}
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>


            <div className="modal fade bd-example-modal-md" id="payable" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-md" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title display-4" id="exampleModalLongTitle">Pending Payment</h5>
                            {/* <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button> */}
                        </div>
                        <div className="modal-body">
                            {/* <div className="row">
                            </div> */}
                            <div className="row m-2">
                                <div className="col-12">
                                    <center className="col-12">
                                        {
                                            (()=>{
                                                if(checkoutError){
                                                    return (
                                                        <div className="col-12  alert alert-danger text-center" role="alert" style={{fontSize: 15}}>
                                                            {checkoutError}
                                                        </div>)
                                                }
                                                if(payLoading == false){
                                                    if(payMessage){
                                                        return (
                                                            <div className={`col-12  alert alert-${payError == false ? 'success' : 'danger'} text-center`} role="alert" style={{fontSize: 15}}>
                                                                {payMessage}
                                                            </div>)
                                                    }
                                                }
                                                 
                                                if(payMessage == true){
                                                    return (
                                                        <div className="col-12  alert alert-info text-center" role="alert" style={{fontSize: 15}}>
                                                            <i className="fa fa-spinner fa-spin"></i> Processing...
                                                        </div>
                                                    )
                                                }
                                            })()
                                        }
                                        <div className="text-center" style={{fontSize: '2.5rem'}}>
                                            {"Please Enter Card details"}
                                        </div>
                                        <CardElement onChange={handleCardDetailsChange} className="m-5"/>
                                        <hr />
                                        <div className="row justify-content-md-between mt-3">
                                            <div className="col-6" style={{fontSize: '2rem'}}>Payable Amount</div>
                                            <div className="col-6" style={{fontSize: '2rem'}}>{`$${state?.payable?.amount}`}</div>
                                        </div>
                                    </center>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button  type="button" className="button-common"data-dismiss="modal" onClick={handleCloseClick}>Close</button>
                            <button
                                onClick={handlePayClick}
                                disabled={state?.payable?.amount == null || checkoutError != null}
                                // data-dismiss="modal"
                                type="button"
                                className="button-common-2"
                            >Pay
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

{/* <div className="col-md-6">
    <div className="order-card d-flex align-items-center justify-content-between">
        <div className="order-des-b">
            <div className="title">Ekstrom Bothman</div>
            <div className="service-label">House Cleaner</div>
            <div className="star-rating-area d-flex align-items-center justify-content-start">
                <div className="rating-static clearfix mr-3" rel="4">
                    <label className="full" title="{{ 'Awesome - 5 stars' | translate }}" ></label>
                    <label className="half" title="{{ 'Excellent - 4.5 stars' | translate }}" ></label>
                    <label className="full" title="{{ 'Excellent - 4 stars' | translate }}" ></label>
                    <label className="half" title="{{ 'Better - 3.5 stars' | translate }}" ></label>
                    <label className="full" title="{{ 'Good - 3 stars' | translate }}" ></label>
                    <label className="half" title="{{ 'Good - 2.5 stars' | translate }}" ></label>
                    <label className="full" title="{{ 'Fair - 2 stars' | translate }}" ></label>
                    <label className="half" title="{{ 'Fair - 1.5 stars' | translate }}" ></label>
                    <label className="full" title="{{ 'Bad - 1 star' | translate }}" ></label>
                    <label className="half" title="{{ 'Bad - 0.5 stars' | translate }}" ></label>
                </div> */}
                {/* <div className="ratilike ng-binding">5</div> */}
    //         </div>
    //         <div className="order-time">19, january 2020  - 12:00 PM</div>
    //     </div>
    //     <div className="order-btn-b">
    //         <button className="btn-view-profile">View Profile</button>
    //         <div className="btn-price-serv">22222222222222</div>
    //     </div>
    // </div>
    // </div>
    // <div className="col-md-6">
    // <div className="order-card d-flex align-items-center justify-content-between">
    //     <div className="order-des-b">
    //         <div className="title">Ekstrom Bothman</div>
    //         <div className="service-label">House Cleaner</div>
    //         <div className="star-rating-area d-flex align-items-center justify-content-start">
    //             <div className="rating-static clearfix mr-3" rel="4">
    //                 <label className="full" title="{{ 'Awesome - 5 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Excellent - 4.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Excellent - 4 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Better - 3.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Good - 3 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Good - 2.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Fair - 2 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Fair - 1.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Bad - 1 star' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Bad - 0.5 stars' | translate }}" ></label>
    //             </div>
                {/* <div className="ratilike ng-binding">5</div> */}
    //         </div>
    //         <div className="order-time">19, january 2020  - 12:00 PM</div>
    //     </div>
    //     <div className="order-btn-b">
    //         <button className="btn-view-profile">View Profile</button>
    //         <div className="btn-price-serv">$600</div>
    //     </div>
    // </div>
    // </div>
    // <div className="col-md-6">
    // <div className="order-card d-flex align-items-center justify-content-between">
    //     <div className="order-des-b">
    //         <div className="title">Ekstrom Bothman</div>
    //         <div className="service-label">House Cleaner</div>
    //         <div className="star-rating-area d-flex align-items-center justify-content-start">
    //             <div className="rating-static clearfix mr-3" rel="4">
    //                 <label className="full" title="{{ 'Awesome - 5 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Excellent - 4.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Excellent - 4 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Better - 3.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Good - 3 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Good - 2.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Fair - 2 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Fair - 1.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Bad - 1 star' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Bad - 0.5 stars' | translate }}" ></label>
    //             </div>
                {/* <div className="ratilike ng-binding">5</div> */}
    //         </div>
    //         <div className="order-time">19, january 2020  - 12:00 PM</div>
    //     </div>
    //     <div className="order-btn-b">
    //         <button className="btn-view-profile">View Profile</button>
    //         <div className="btn-price-serv">$600</div>
    //     </div>
    // </div>
    // </div>
    // <div className="col-md-6">
    // <div className="order-card d-flex align-items-center justify-content-between">
    //     <div className="order-des-b">
    //         <div className="title">Ekstrom Bothman</div>
    //         <div className="service-label">House Cleaner</div>
    //         <div className="star-rating-area d-flex align-items-center justify-content-start">
    //             <div className="rating-static clearfix mr-3" rel="4">
    //                 <label className="full" title="{{ 'Awesome - 5 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Excellent - 4.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Excellent - 4 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Better - 3.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Good - 3 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Good - 2.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Fair - 2 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Fair - 1.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Bad - 1 star' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Bad - 0.5 stars' | translate }}" ></label>
    //             </div>
                {/* <div className="ratilike ng-binding">5</div> */}
    //         </div>
    //         <div className="order-time">19, january 2020  - 12:00 PM</div>
    //     </div>
    //     <div className="order-btn-b">
    //         <button className="btn-view-profile">View Profile</button>
    //         <div className="btn-price-serv">$600</div>
    //     </div>
    // </div>
    // </div>
    // <div className="col-md-6">
    // <div className="order-card d-flex align-items-center justify-content-between">
    //     <div className="order-des-b">
    //         <div className="title">Ekstrom Bothman</div>
    //         <div className="service-label">House Cleaner</div>
    //         <div className="star-rating-area d-flex align-items-center justify-content-start">
    //             <div className="rating-static clearfix mr-3" rel="4">
    //                 <label className="full" title="{{ 'Awesome - 5 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Excellent - 4.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Excellent - 4 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Better - 3.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Good - 3 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Good - 2.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Fair - 2 stars' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Fair - 1.5 stars' | translate }}" ></label>
    //                 <label className="full" title="{{ 'Bad - 1 star' | translate }}" ></label>
    //                 <label className="half" title="{{ 'Bad - 0.5 stars' | translate }}" ></label>
    //             </div>
                {/* <div className="ratilike ng-binding">5</div> */}
    //         </div>
    //         <div className="order-time">19, january 2020  - 12:00 PM</div>
    //     </div>
    //     <div className="order-btn-b">
    //         <button className="btn-view-profile">View Profile</button>
    //         <div className="btn-price-serv">$600</div>
    //     </div>
    // </div>
// </div>
