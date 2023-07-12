import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import medidataLogo from "../assets/Medidata_Logo_white.png";
import successLogo from "../assets/success.gif";
import Timer from "./Timer";
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

const Success = () => {
    let navigate = useNavigate();
    const location = useLocation();
    let secondsRef = useRef(0);
    if (location.state == null) {
        secondsRef.current = 300;
    } else {
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
        navigate("/login");
    };
    const handleSubmit = () => {
        handleGetTotalSeconds();
        if (secondsRef.current > 0) {
            navigate('/InputForm', {
                state: {
                    remainingSeconds: secondsRef.current
                }
            })
        } else {
            sessionStorage.removeItem("api_CloudBoltToken");
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
                        <MDBNavbarItem className="d-flex align-items-center">
                            <Timer ref={timerRef} expiryTimestamp={time} />
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
                        <MDBCard className='p-5 shadow-9' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', margin: '0' }} id="Fcard">
                            <h2 className="fw-bold text-center">TS - URL Deployment Tool </h2>
                            <MDBCardBody className='p-1 text-center'>
                                <img style={{ maxWidth: "100%", width: "20%", height: "auto" }} src={successLogo}></img>
                                <h4 className="text-center mb-4 py-3 fw-bold" style={{ color: 'green' }}>Congratulation!! </h4>
                                <MDBCardText className="text-center"> Your OrderID: {location.state.orderId ?? "N.A"} with this DB: {location.state.dbName ?? "N.A"} has been successfully created.</MDBCardText>
                                <MDBBtn className='mt-3' size='lg' onClick={handleSubmit} >Create  new</MDBBtn>
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
}
export default Success;