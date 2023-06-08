import React, { useEffect, useState } from "react";
import axios from 'axios';
import medidataLogo from "../assets/Medidata_Logo_white.png";
import loginLogo from "../assets/login.jpg";
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
    MDBIcon,
}
    from 'mdb-react-ui-kit';

import { useNavigate } from "react-router-dom";

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [cloudBoltToken, setCloudBoltToken] = useState(sessionStorage.getItem("api_CloudBoltToken"));
    const [isLoading, setIsLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    let navigate = useNavigate();
    var temp = "";
    const urlHeaderData = new Headers();
    urlHeaderData.append('Content-Type', 'application/json');
    urlHeaderData.append('Accept', 'application/json');

    useEffect(() => {
        if (cloudBoltToken) {
            if (!sessionStorage.getItem("api_CloudBoltToken")) {
                sessionStorage.setItem("api_CloudBoltToken", cloudBoltToken);
                navigate("/inputform");
            }
            else {
                sessionStorage.removeItem("api_CloudBoltToken");
                navigate("/login");
                setIsLoading(false);
            }
        }
    }, [cloudBoltToken]);

    const handleSubmit = async (event) => {
        if (!username || !password) {
            console.log("User pass not written");
            return;
        }
        setIsLoading(true);
        event.preventDefault();
        try {
            const cloudBoltApiUrl = "http://10.194.40.99:3550/login/token";//'https://hdcgreeniaas.lab1.hdc.mdsol.com/api/v3/cmp/apiToken/';
            const cloudBoltResponse = await axios.post(cloudBoltApiUrl, {
                "email": username,
                "password": password
            }, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                    "Accept": "*/*"
                }
            });
            temp = cloudBoltResponse.data.token;
            setCloudBoltToken(temp);

        }
        catch (error) {
            if (error.response) {
                if (error.response.status == 400) {
                    alert("Server responded : Wrong user Credentials");
                    setIsLoading(false);
                }
            } else if (error.request) {
                alert("network error");
                setIsLoading(false);
            } else {
                console.log(error);
                alert("Error please see console ");
                setIsLoading(false);
            }
        }
    }
    const handleVisible = () => {
        setIsVisible(!isVisible);
    }

    return (

        <>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: '0 auto' }}>
                <MDBNavbar className=" " style={{ backgroundColor: 'rgba(51, 81, 119, 1)', margin: '0' }}>
                    <MDBContainer fluid>
                        <MDBNavbarBrand href='#'>
                            <img
                                src={medidataLogo}
                                height='25'
                                alt='Medidata Logo'
                                loading='lazy'
                            />
                        </MDBNavbarBrand>
                    </MDBContainer>
                </MDBNavbar>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, margin: '0' }}>
                    <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1" style={{ margin: '0' }}>
                        <MDBCard className='p-5 shadow-9' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', margin: '0' }} id="Fcard">
                            <h2 className="fw-bold text-center">TS - URL Deployment Tool</h2>
                            <MDBCardBody className='p-1 text-center mt-2'>
                                <img
                                    src={loginLogo}
                                    className="p-1"
                                    object-fit='contain'
                                    height='80'
                                    alt='Login Logo'
                                    loading='lazy'
                                />

                                <form >
                                    <div className="mt-4">
                                        <MDBInput label='Lab1 Username' id='username' type='text'
                                            value={username}
                                            onChange={(event) => setUsername(event.target.value)}
                                            required
                                            autoFocus
                                        />
                                        <div className="d-flex align-items-center mt-4 mb-4">
                                            <div className="flex-grow-1">
                                                <MDBInput label="Password" type={isVisible ? "text" : "password"}
                                                    className="flex-grow-1 mr-2"
                                                    value={password}
                                                    onChange={(event) => setPassword(event.target.value)}
                                                    required
                                                />
                                            </div>
                                            <MDBBtn type="button" onClick={(e)=>{e.preventDefault(); handleVisible();}}>
                                                {isVisible ? (<MDBIcon fas icon="eye" />) : (<MDBIcon fas icon="eye-slash" />)}</MDBBtn>
                                        </div>
                                    </div>
                                    {isLoading ? (
                                        <MDBBtn disabled className='w-100  mt-3' size='lg'>
                                            <MDBSpinner grow size='sm' role='status' tag='span' className='me-2' />
                                            Loading...
                                        </MDBBtn>
                                    ) : (
                                        <MDBBtn className='w-100  mt-3' size='lg' onClick={handleSubmit}>LOGIN</MDBBtn>
                                    )}
                                </form>

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
            </div >

        </>
    );
}

export default Login;