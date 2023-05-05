import React, { useEffect, useState } from "react";
import axios from 'axios';
// import logo from "./Medidata_Logo_white.png";
// src\images\Medidata_Logo_white.png
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBFooter,
    MDBNavbar,
    MDBNavbarBrand,
    MDBSpinner,
}
    from 'mdb-react-ui-kit';

import { useNavigate } from "react-router-dom";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cloudBoltToken, setCloudBoltToken] = useState(sessionStorage.getItem("api_CloudBoltToken"));
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    var temp = "";
    const urlHeaderData = new Headers();

    urlHeaderData.append('Content-Type', 'application/json');
    urlHeaderData.append('Accept', 'application/json');



    useEffect(() => {
        console.log('cloudBoltToken changed:', cloudBoltToken);
        if (cloudBoltToken) {
            console.log("Succesfully redirect karo");
            if (!sessionStorage.getItem("api_CloudBoltToken")) {
                sessionStorage.setItem("api_CloudBoltToken", cloudBoltToken);
                console.log(sessionStorage.getItem("api_CloudBoltToken"));
                navigate("/inputform");
            }
            else {
                navigate("/");
            }
        }
    }, [cloudBoltToken]);

    const handleSubmit = async (event) => {
        setIsLoading(true);
        event.preventDefault();
        console.log(`${username} ${password}`);
        try {

            const cloudBoltApiUrl = 'https://hdcgreeniaas.lab1.hdc.mdsol.com/api/v3/cmp/apiToken/';
            const cloudBoltResponse = await axios.post(cloudBoltApiUrl, {
                "username": username,
                "password": password,
                "domain": "lab1.hdc.mdsol.com"
            }, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                    "Accept": "*/*"
                }
            });
            console.log(cloudBoltResponse);
            temp = cloudBoltResponse.data.token;
            setCloudBoltToken(temp);

        }
        catch (error) {
            if (error.response) {
                console.log(error.response);
                if (error.response.status == 400) {
                    alert("Server responded : Wrong user Credentials");
                    isLoading = false;
                }
            } else if (error.request) {
                alert("network error");
            } else {
                console.log(error);
                alert("Error please see console ");
            }

        }

    }
    return (


        <>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: '0 auto' }}>
                <MDBNavbar className=" " style={{ backgroundColor: 'rgba(51, 81, 119, 1)', margin: '0' }}>
                    <MDBContainer fluid>
                        <MDBNavbarBrand href='#'>
                            <img
                                // src={require('./Medidata_Logo_white.png')}
                                src='https://mdsol.github.io/medidata_design_system/static/media/Medidata_Logo_white.169a9612.png'
                                height='25'
                                alt=''
                                loading='lazy'
                            />
                        </MDBNavbarBrand>
                    </MDBContainer>
                </MDBNavbar>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, margin: '0' }}>
                    <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1" style={{ margin: '0' }}>
                        <MDBCard className='p-5 shadow-5' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)', margin: '0' }}>
                            <h2 className="fw-bold text-center">TS - URL Deployment Tool</h2>
                            <MDBCardBody className='p-1 text-center'>
                                <h4 className="fw-bold mb-4 mt-2">Welcome</h4>
                                <MDBInput wrapperClass=' mt-2' label='Lab Username' id='username' type='text'
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    required />
                                <MDBInput wrapperClass='mb-4 mt-4' label='Password' id='password' type='password'
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                                {isLoading ? (
                                    <MDBBtn disabled className='w-100  mt-3' size='lg'>
                                        <MDBSpinner grow size='sm' role='status' tag='span' className='me-2' />
                                        Loading...
                                    </MDBBtn>
                                ) : (
                                    <MDBBtn className='w-100  mt-3' size='lg' onClick={handleSubmit}>LOGIN IN</MDBBtn>
                                )}
                            </MDBCardBody>
                        </MDBCard>
                    </MDBContainer>

                    <MDBFooter style={{ margin: '0' }}>
                        <div className='text-center p-2' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', 'fontSize': '12px' }}>
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

export default Login;