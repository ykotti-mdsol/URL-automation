import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import medidataLogo from "../assets/Medidata_Logo_white.png";
import successLogo from "../assets/success.gif";
import Timer from "./Timer";
import axios from "axios";
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
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter
}
    from 'mdb-react-ui-kit';

const Success = () => {
    const [basicModal, setBasicModal] = useState(false);
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

    const handleCreateDatabag = () => {
        handleGetTotalSeconds();
        navigate("/inputform", {
            state: {
                remainingSeconds: secondsRef.current
            }
        })
    };
    const handleDeployLink = () => {
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

    };
    const handelLogOut = () => {
        sessionStorage.removeItem("api_CloudBoltToken");
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUserPassword");
        navigate("/login");
    };
    const handleSubmit = () => {
        handleGetTotalSeconds();
        if (secondsRef.current > 0) {
            navigate('/inputForm', {
                state: {
                    remainingSeconds: secondsRef.current
                }
            })
        } else {
            sessionStorage.removeItem("api_CloudBoltToken");
            sessionStorage.removeItem("currentUser");
            sessionStorage.removeItem("currentUserPassword");
            navigate('/');
        }
    };

    const toggleShow = () => setBasicModal(!basicModal);

    const handleDeploy = async () => {
        console.log("Deploy clicked");
        toggleShow();
        const app = location.state.app;
        const version = location.state.deployVersion;
        let url = location.state.url;
        url = url.replace("https://", "");
        const template = location.state.template;
        const userName = sessionStorage.getItem("currentUser");

        // const deployURL = "http://10.194.40.99:3550/deployURL/new";
        const deployURL = "http://localhost:5000/deployURL/new";
        const bodyData = {
            "app": app,
            "version": version,
            "url": url,
            "template": template,
            "userName": userName
        };
        try {
            console.log(bodyData);
            const response = await axios.post(deployURL, bodyData);
            console.log(response);
        } catch (e) {
            console.log("Exception");
            if (e instanceof axios.AxiosError) {
                const { status, statusText, data } = e.response;
                data['status'] = status;
                data['statusText'] = statusText;
                console.log(status, statusText, data);
            } else {
                console.log(e);
            }
        }

    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <MDBModal show={basicModal} setShow={setBasicModal} tabIndex='-1'>
                    <MDBModalDialog>
                        <MDBModalContent>
                            <MDBModalHeader>
                                <MDBModalTitle>We initiated the deployment for you.</MDBModalTitle>
                                <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
                            </MDBModalHeader>
                            <MDBModalBody>Please wait 15-20 mins for the results.</MDBModalBody>
                            <MDBModalFooter>
                                <MDBBtn color='secondary' onClick={toggleShow}>
                                    Close
                                </MDBBtn>
                            </MDBModalFooter>
                        </MDBModalContent>
                    </MDBModalDialog>
                </MDBModal>
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
                                <MDBBtn className='mt-3' size='lg' onClick={handleSubmit} >Create  new</MDBBtn><br />
                                {/* <MDBBtn className='mt-3' size='lg' onClick={handleDeploy} >Deploy</MDBBtn> */}
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