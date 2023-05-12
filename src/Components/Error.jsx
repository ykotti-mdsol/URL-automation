import React from "react";
import { useNavigate } from 'react-router-dom';
import medidataLogo from "../assets/Medidata_Logo_white.png";
import errorLogo from "../assets/error.webp"
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBFooter,
    MDBNavbar,
    MDBNavbarBrand,
    MDBCardSubTitle,
    MDBCardText
}
    from 'mdb-react-ui-kit';

const Error = () => {
    let navigate = useNavigate();
    const handleSubmit = () => {
        sessionStorage.removeItem("api_CloudBoltToken");
        navigate('/');
    };

    return (
        <>

            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <MDBNavbar className=" " style={{ backgroundColor: 'rgba(51, 81, 119, 1)' }}>
                    <MDBContainer fluid>
                        <MDBNavbarBrand href='#'>
                            <img
                                src={medidataLogo}
                                height='25'
                                alt=''
                                loading='lazy'
                            />
                        </MDBNavbarBrand>

                    </MDBContainer>
                </MDBNavbar>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1">
                        <MDBCard className='p-5 shadow-9' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)', marginTop: '5%', marginBottom: '5%' }} id="Fcard">
                            <h2 className="fw-bold text-center">TS - URL Deployment Tool </h2>
                            <MDBCardBody className='p-1 text-center'>
                                <img style={{ maxWidth: "100%", width: "20%", height: "auto" }}src={errorLogo} />
                                <h3 className="text-center mb-4 py-3 fw-bold " style={{ color: 'red' }}>Oops Error!</h3>
                                <MDBCardText className="text-center ">Sorry!!  Your OrderID: with this Template: is not created.</MDBCardText>
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