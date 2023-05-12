import React, { useEffect, useState } from "react";
import axios from "axios";
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
}
    from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import PageNotFound from "./PageNotFound";

const InputForm = () => {

    const [orderId, setOrderId] = useState('');
    const [productVersion, setProductVersion] = useState('');
    const [DBServer, setDBServer] = useState('');
    const [raveLegacyOption, setRaveLegacyOption] = useState(false);
    const [raveOption, setRaveOption] = useState(false);
    const [classicOption, setClassicOption] = useState(false);
    const [remoraOption, setRemoraOption] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [seconds, setseconds] = useState(300);
    const apiCloudBoltToken = sessionStorage.getItem("api_CloudBoltToken");
    let navigate = useNavigate();

    useEffect(() => {
        let interval = null;
        if (seconds > 0) {
            interval = setInterval(() => {
                setseconds(seconds - 1);
            }, 1000);
        } else {
            clearInterval(interval);
            alert("Session expired");
            sessionStorage.removeItem("api_CloudBoltToken");
            navigate("/login");
        }
        return () => clearInterval(interval);
    }, [seconds]);

    const formatTime = (time) => {
        return time < 10 ? `0${time}` : time;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const handleRaveLegacyOption = () => {
        setRaveLegacyOption(true);
        setRaveOption(false);
    };
    const handelRaveOption = () => {
        setRaveOption(true);
        setRaveLegacyOption(false);
    };
    const handleClasssicOption = () => {
        setClassicOption(true);
        setRemoraOption(false);
    };
    const handelRemoraOption = () => {
        setRemoraOption(true);
        setClassicOption(false);
    };
    const handelLogOut = () => {
        sessionStorage.removeItem("api_CloudBoltToken");
        navigate("/login");
    }
    const handleSubmit = async (e) => {

        if (!orderId || !DBServer || (!(raveLegacyOption && productVersion) && !(!raveLegacyOption && !productVersion))
            || !(raveLegacyOption || raveOption) || !(classicOption || remoraOption)
        ) {
            console.log("Required some fields");
            return;
        }
        e.preventDefault();
        setIsLoading(true);
        const orderIDUrl = `https://hdcgreeniaas.lab1.hdc.mdsol.com/api/v3/cmp/resources/${orderId}/`;
        const authString = `Bearer ${apiCloudBoltToken}`;
        try {
            const response = await axios.get(orderIDUrl, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                    "Accept": "*/*",
                    "Authorization": authString

                }
            });
        } catch (error) {
            if (error.response) {
                if (error.response.status == 401) {
                    alert("Token Expired pls login again");
                }
            } else if (error.request) {
                alert("network error");
            } else {
                console.log(error);
                alert("Error please see console ");
            }
            sessionStorage.removeItem("api_CloudBoltToken");
            navigate("/login");
        }
    };

    return (
        <>
            {apiCloudBoltToken ? (
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
                                <MDBNavbarItem className="d-flex align-items-center">
                                    <div> <h4 className="text-white my-auto" style={{ marginRight: '0px' }}>{`${formatTime(minutes)} : ${formatTime(remainingSeconds)}`}</h4> </div>
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

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, margin: '0' }}>
                            <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1" style={{ margin: '0' }}>
                                <MDBCard className='p-5 shadow-9' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', margin: '0' }} id="Fcard">
                                    <h2 className="fw-bold text-center">TS - URL Deployment Tool </h2>
                                    <MDBCardBody className='p-1'>
                                        <form >
                                            <MDBInput wrapperClass='mt-4' label='Order ID' id='orderId' type='text' size='lg'

                                                onChange={(e) => setOrderId(e.target.value)}
                                                required
                                                value={orderId}
                                                autoComplete="off"
                                            />
                                            <h5 className=" fw-bold mt-4 mb-0" >Select App</h5>
                                            <div className="d-flex  text-start mt-2 mb-0">

                                                <div style={{ minWidth: '40%' }}>
                                                    <MDBCheckbox name='raveLegacyOption' id='raveLegacyOption' value='raveLegacy' label='Rave Legacy'
                                                        checked={raveLegacyOption}
                                                        onChange={handleRaveLegacyOption}
                                                        required={raveOption == false}
                                                    />
                                                </div>
                                                <div style={{ minWidth: '40%' }}>
                                                    <MDBCheckbox name='raveOption' id='raveOption' value='raveOption' label='Rave'
                                                        checked={raveOption}
                                                        onChange={handelRaveOption}
                                                        required={raveLegacyOption == false}
                                                    />

                                                </div>
                                            </div>
                                            <h5 className="mt-3  mb-0 fw-bold">Select its corresponding version</h5>
                                            <div className="d-flex text-start mt-2 mb-0" >
                                                <div style={{ minWidth: '40%' }}>
                                                    <MDBCheckbox name='classicOption' id='classicOption' value='classicOption' label='Classic'
                                                        checked={classicOption}
                                                        onChange={handleClasssicOption}
                                                        required={remoraOption == false}

                                                    />
                                                </div>
                                                <div style={{ minWidth: '40%' }}>
                                                    <MDBCheckbox name='remoraOption' id='remoraOption' value='remoraOption' label='Remora'
                                                        checked={remoraOption}
                                                        onChange={handelRemoraOption}
                                                        required={classicOption == false}
                                                    />
                                                </div>
                                            </div>
                                            {raveLegacyOption && (
                                                <MDBInput wrapperClass='mt-4' label='Product Version' id='productVersion' type='text' size='lg'
                                                    value={productVersion}
                                                    onChange={(e) => setProductVersion(e.target.value)}
                                                    required
                                                    autoComplete="off"
                                                />
                                            )}
                                            <MDBInput wrapperClass=' mt-4 mb-4' label='DB Server' id='DBServer' type='text' size='lg'
                                                value={DBServer}
                                                onChange={(e) => setDBServer(e.target.value)}
                                                required
                                                autoComplete="off"
                                            />
                                            {isLoading ? (
                                                <MDBBtn disabled className='w-100  mt-3' size='lg'>
                                                    <MDBSpinner grow size='sm' role='status' tag='span' className='me-2' />
                                                    Loading...
                                                </MDBBtn>
                                            ) : (
                                                <MDBBtn className='w-100  mt-3' size='lg' onClick={handleSubmit}>Submit</MDBBtn>
                                            )}
                                        </form>
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
            ) : (
                <PageNotFound />
            )
            }

        </>
    );
};
export default InputForm;