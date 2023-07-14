import React, { useEffect, useState,useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import medidataLogo from "../assets/Medidata_Logo_white.png";
import errorLogo from "../assets/error.gif";
import Timer from "./Timer";
<<<<<<< HEAD
import axios from "axios";
=======
>>>>>>> a1938710be3a105b5143f81c8efabb4f515332ab
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardText,
    MDBIcon,
    MDBFooter,
    MDBNavbar,
    MDBNavbarBrand,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBNavbarItem,
}
    from 'mdb-react-ui-kit';

const Error = () => {
    let navigate = useNavigate();
    const location = useLocation();
    //const [seconds, setSeconds] = useState(location.state.secondsRemaining);
    let secondsRef = useRef(0);
    if(location.state==null){
        secondsRef.current = 300;
    }else{
        secondsRef.current = location.state.secondsRemaining;
    }
    const time = new Date();
    time.setSeconds(time.getSeconds() + secondsRef.current); 
    const timerRef = useRef(null);

  const handleGetTotalSeconds = () => {
    if (timerRef.current) {
      const totalSeconds = timerRef.current.returnTotalSeconds();
      secondsRef.current = totalSeconds;
    }
  };
    const handelLogOut = () => {
        sessionStorage.removeItem("api_CloudBoltToken");
<<<<<<< HEAD
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUserPassword");
        navigate("/login");
    };
    const handleCreateDatabag = ()=>{
        handleGetTotalSeconds();
        navigate("/inputform", {
            state: {
                remainingSeconds: secondsRef.current
            }
        })
    }
    const handleDeploy = () => {
        handleGetTotalSeconds();
        navigate("/deploy", {
            state: {
                remainingSeconds: secondsRef.current
            }
        })
    };
    const handleHistory = async (event) => {

        try {
            const currentUser = sessionStorage.getItem("currentUser");
            const dataurl = "http://10.194.40.99:3550/generateDatabag/add/" + currentUser;
            // const dataurl = "http://localhost:5000/generateDatabag/add/" + currentUser;
            const datares = await axios.post(dataurl);
            var dataresult = datares.data;
            handleGetTotalSeconds();
            navigate('/history', {
                state: {
                    dataresult: dataresult,
                    remainingSeconds: secondsRef.current
                }
            });
        } catch (e) {
            console.log(e);
        }

    }
=======
        navigate("/login");
    };
>>>>>>> a1938710be3a105b5143f81c8efabb4f515332ab
    const handleSubmit = () => {
        handleGetTotalSeconds();
        if (secondsRef.current > 0) {
            navigate('/InputForm', {
                state: {
                    remainingSeconds: secondsRef.current
                }
            })
        }
        else {
            sessionStorage.removeItem("api_CloudBoltToken");
<<<<<<< HEAD
            sessionStorage.removeItem("currentUser");
=======
>>>>>>> a1938710be3a105b5143f81c8efabb4f515332ab
            navigate('/');
        }
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <MDBNavbar style={{ backgroundColor: 'rgba(51, 81, 119, 1)', margin: '0' }}>
                    <MDBContainer fluid>
                        <MDBNavbarBrand href='#'>
                            <img
                                src={medidataLogo}
                                height='25'
                                alt=''
                                loading='lazy'
                            />
                        </MDBNavbarBrand>
<<<<<<< HEAD
                        <MDBNavbarItem className="d-flex align-items-center ms-auto">
                            <a className="createDatabagLink" onClick={handleCreateDatabag}>Create Databag</a>
                        </MDBNavbarItem>
                        {/* <MDBNavbarItem className="d-flex align-items-center ms-4">
                                    <a className="createDatabagLink" onClick={handleDeployLink}>Deploy URL</a>
                                </MDBNavbarItem> */}
                        <MDBNavbarItem className="d-flex align-items-center ms-4">
                            <a className="createDatabagLink" onClick={handleHistory}>History</a>
                        </MDBNavbarItem>
                        <MDBNavbarItem className="d-flex align-items-center ms-4">
                            <Timer ref={timerRef} expiryTimestamp={time} />
=======
                        <MDBNavbarItem className="d-flex align-items-center">
                        <Timer ref={timerRef} expiryTimestamp={time} />
>>>>>>> a1938710be3a105b5143f81c8efabb4f515332ab
                            <MDBDropdown>
                                <MDBDropdownToggle tag='a' className='nav-link' role='button'>
                                    <MDBIcon className="text-light" fas icon="user-alt" size='lg' />
                                </MDBDropdownToggle>
                                <MDBDropdownMenu>
                                    <MDBDropdownItem link onClick={handelLogOut} >Log Out</MDBDropdownItem>
                                </MDBDropdownMenu>
                            </MDBDropdown>
                        </MDBNavbarItem>
                    </MDBContainer>
                </MDBNavbar>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1">
                        <MDBCard className='p-5 shadow-9' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)', marginTop: '5%', marginBottom: '5%' }} id="Fcard">
                            <h2 className="fw-bold text-center">TS - URL Deployment Tool </h2>
                            <MDBCardBody className='p-1 text-center'>
                                <img style={{ maxWidth: "100%", width: "20%", height: "auto" }} src={errorLogo} />
                                <h3 className="text-center mb-4 py-3 fw-bold " style={{ color: 'red' }}>Oops Error!</h3>
                                {location.state.status == 404 ? (<MDBCardText className="text-center ">Sorry!!  Your OrderID: {location.state.orderId ?? "N.A"} or <br /> DB: {location.state.dbName ?? "N.A"} was not found.<br /> ERROR : Please check Order ID or DB Server name and try again. </MDBCardText>)
                                    : (<>{location.state.status == 409 ? (<MDBCardText className="text-center ">Sorry!!  URL Configuration already exists.<br /> Please try with different inputs.</MDBCardText>)
                                        : (<MDBCardText className="text-center ">Sorry!!  Your OrderID: {location.state.orderId ?? "N.A"} with this <br /> DB: {location.state.dbName ?? "N.A"} was not created.<br /> ERROR : {location.state.msg} </MDBCardText>)
                                    }</>)
                                }

                                <MDBBtn className='  mt-3' size='lg' onClick={handleSubmit} >Try Again</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBContainer>

                    <MDBFooter className="fs-6">
                        <div className='text-center p-2' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', 'fontSize': '14px' }}>
                            <a href="http://medidata.com">
                                Medidata Solutions, Inc., a Dassault Systèmes company<br />
                            </a>

                            <a href="https://learn.mdsol.com/display/IMEDIDATAprd/Medidata+Privacy+Policy?lang=en" target="_blank" >Privacy Policy </a>
                            <a href="https://learn.mdsol.com/display/IMEDIDATAprd/iMedidata+Terms+of+Use?lang=en" target="_blank" >Terms of Use</a>
                            <br />
                            Copyright © 1999-2023
                        </div>
                    </MDBFooter>
                </div>
            </div>

        </>
    );
};
export default Error;