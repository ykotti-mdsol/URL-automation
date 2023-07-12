import React, { useEffect, useRef, useState } from "react";
import medidataLogo from "../assets/Medidata_Logo_white.png";
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBIcon,
    MDBFooter,
    MDBNavbar,
    MDBNavbarBrand,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBSpinner,
    MDBNavbarItem,
    MDBNavbarToggler,
    MDBCollapse,
    MDBNavbarNav,
    MDBNavbarLink,
}
    from 'mdb-react-ui-kit';
import { useLocation, useNavigate } from "react-router-dom";
import PageNotFound from "./PageNotFound";
import axios from "axios";

const SelectOption = () => {

    let navigate = useNavigate();

    const handleSubmitCreateDatabag = () => {
        navigate("/login");
    };
    const handleSubmitDeploy = () => {
        navigate("/deploy");
    };
    const handelTest = async() =>{
        try{
            const url = "http://localhost:5000/test/new"; 
            const bodyData = {};
            const response = await axios.post(url, bodyData);
        }catch(error)
        {
            console.log(error);
        }
    }
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: '0 auto' }}>
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
                    </MDBContainer>
                </MDBNavbar>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, margin: '0' }}>
                    <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1" style={{ margin: '0' }}>
                        <MDBCard className='p-5 shadow-9' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', margin: '0' }} id="Fcard">
                            <h2 className="fw-bold text-center">TS - URL Deployment Tool </h2>
                            <MDBCardBody className='p-1'>
                                <MDBBtn className='w-100  mt-5' size='lg' onClick={handleSubmitCreateDatabag}>Create DataBag</MDBBtn>
                                <br />
                                <MDBBtn className='w-100  mt-4' size='lg' onClick={handleSubmitDeploy}>Deploy URL</MDBBtn>
                                <br />
                                <MDBBtn className='w-100  mt-4' size='lg' onClick={handelTest}>Test</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBContainer>

                    <MDBFooter style={{ margin: '0' }}>
                        <div className='text-center p-1 ' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', 'fontSize': '12px' }}>
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
};
export default SelectOption;