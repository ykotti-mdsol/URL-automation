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
    MDBSpinner
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

            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <MDBNavbar className=" " style={{ backgroundColor: 'rgba(51, 81, 119, 1)' }}>
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
                        <h3 className="fw-bolder mx-auto my-auto text-white">TS - URL Deployment Tool</h3>
                    </MDBContainer>
                </MDBNavbar>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1">
                        <MDBCard className='p-5 shadow-5' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)', marginTop: '5%', marginBottom: '5%' }}>
                            <MDBCardBody className='p-1 text-center'>
                                <h4 className="fw-bold mb-5">Welcome</h4>
                                <MDBInput wrapperClass='mb-4 mt-2' label='Lab Username' id='username' type='text'
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                    placeholder="Username"
                                    required />
                                <MDBInput wrapperClass='mb-4 mt-4' label='Password' id='password' type='password'
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="Password"
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

        // <div className="rootdiv">

        //     <Navbar bg="dark" variant="dark">
        //         <Container >
        //             <Navbar.Brand href="/" >
        //                 <img
        //                     alt="Medidata logo"
        //                     src="https://mdsol.github.io/medidata_design_system/static/media/Medidata_Logo_white.169a9612.png"
        //                     className="logo"
        //                 // className="d-inline-block align-top"
        //                 />
        //             </Navbar.Brand>
        //             <h2 className="Titletext">TS - URL Deployment Tool</h2>
        //             {/* <Navbar.Text className="TitleText">
        //             TS - URL Deployment Tool
        //             </Navbar.Text> */}
        //         </Container>
        //     </Navbar>
        //     <br /><br /><br />

        //     <Card className="card">
        //         {/* <Card.Header as="h4">Login</Card.Header> */}
        //         <h4>Login</h4>
        //         <Card.Body>
        //             <div className="rows">
        //                 <div className="row">
        //                     <img src="./images/4957136.jpg" alt="Login Photo" />
        //                 </div>
        //                 <div className="row">
        //                     <form onSubmit={handleSubmit}>

        //                         <FloatingLabel
        //                             controlId="username"
        //                             label="User name"
        //                             className="mb-3"
        //                         >
        //                             <Form.Control type="text"
        //                                 value={username}
        //                                 onChange={(event) => setUsername(event.target.value)}
        //                                 placeholder="Username"
        //                                 required
        //                             />
        //                         </FloatingLabel>
        //                         <br />
        //                         <FloatingLabel controlId="password" label="Password">
        //                             <Form.Control type="password"
        //                                 value={password}
        //                                 onChange={(event) => setPassword(event.target.value)}
        //                                 placeholder="Password"
        //                                 required />
        //                         </FloatingLabel>
        //                         <br /><br />
        //                         <div className="d-grid gap-2">
        //                             <Button variant="outline-primary" type="submit" size="lg">
        //                                 Login
        //                             </Button>
        //                         </div>

        //                     </form>
        //                 </div>
        //             </div>

        //         </Card.Body>
        //     </Card>
        // </div >




        /* <div className="App">
            <header>
                <nav>
                    <div className="logo">Logo</div>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/about">About</a></li>
                    </ul>
                </nav>
            </header>
            <main>
                <div className="login-card">
                    <h2>Login</h2>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                placeholder="Username"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <button type="submit">Submit</button>
                    </form>

                    {/* <form>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Login</button>
          </form> */
        /* </div>
    </main>
    <footer>
        <div className="company-info">
            <h3>Company Info</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam commodo felis non augue luctus, a lobortis elit commodo.</p>
        </div>
        <div className="links">
            <ul>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
            </ul>
        </div>
    </footer>
</div> */

    );
}

export default Login;