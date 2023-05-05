import React, { useEffect, useState } from "react";
import './InputForm.css';
import axios from "axios";
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


const InputForm = () => {


    const [orderId, setOrderId] = useState('');
    const [productVersion, setProductVersion] = useState('');
    const [DBServer, setDBServer] = useState('');
    const [raveLegacyOption, setRaveLegacyOption] = useState(false);
    const [raveOption, setRaveOption] = useState(false);
    const [classicOption, setClassicOption] = useState(false);
    const [remoraOption, setRemoraOption] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [seconds, setseconds] = useState(60000);
    const apiCloudBoltToken = sessionStorage.getItem("api_CloudBoltToken");
    const navigate = useNavigate();

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
            sessionStorage.removeItem("api_FalconToken");
            navigate("/");
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(`${orderId} ${productVersion} ${DBServer}`);
        console.log(`classic : ${classicOption}`);
        console.log(`Remora : ${remoraOption}`);
        console.log(`RaveLegacy : ${raveLegacyOption}`);
        console.log(`Rave : ${raveOption}`);
        const orderIDUrl = `https://hdcgreeniaas.lab1.hdc.mdsol.com/api/v3/cmp/resources/${orderId}/`;
        console.log(orderIDUrl);

        const authString = `Bearer ${apiCloudBoltToken}`;
        console.log(authString);

        try {
            const response = await axios.get(orderIDUrl, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                    "Accept": "*/*",
                    "Authorization": authString

                }
            });
            console.log(response);
            console.log(response.data._links.servers);

        } catch (error) {
            if (error.response) {
                console.log(error.response);
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

            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: '0 auto' }}>
                <MDBNavbar style={{ backgroundColor: 'rgba(51, 81, 119, 1)', margin: '0' }}>
                    <MDBContainer fluid>
                        <MDBNavbarBrand href='#'>
                            <img
                                src='https://mdsol.github.io/medidata_design_system/static/media/Medidata_Logo_white.169a9612.png'
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
                                    <MDBDropdownItem link href="/login" >Log Out</MDBDropdownItem>
                                </MDBDropdownMenu>
                            </MDBDropdown>
                        </MDBNavbarItem>
                    </MDBContainer>
                </MDBNavbar>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, margin: '0' }}>
                    <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1" style={{ margin: '0' }}>
                        <MDBCard className='p-5 shadow-5' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)', margin: '0' }}>
                            <h2 className="fw-bold text-center">TS - URL Deployment Tool</h2>
                            <MDBCardBody className='p-1 '>

                                <MDBInput wrapperClass='mb-3 mt-3' label='Order ID' id='orderId' type='text' size='lg'
                                    onChange={(e) => setOrderId(e.target.value)}
                                    required
                                />
                                <h5 className="mb-2 " >Select App</h5>
                                <div className="d-flex  text-start">

                                    <div className=" " style={{ minWidth: '40%' }}>
                                        <MDBCheckbox name='raveLegacyOption' id='raveLegacyOption' value='raveLegacy' label='Rave Legacy'
                                            checked={raveLegacyOption}
                                            onChange={handleRaveLegacyOption}
                                        />
                                    </div>
                                    <div className=" " style={{ minWidth: '40%' }}>
                                        <MDBCheckbox name='raveOption' id='raveOption' value='raveOption' label='Rave'
                                            checked={raveOption}
                                            onChange={handelRaveOption} />
                                    </div>
                                </div>
                                <h5 className="mt-2 mb-2">Select its corresponding version</h5>
                                <div className="d-flex text-start">
                                    <div style={{ minWidth: '40%' }}>
                                        <MDBCheckbox name='classicOption' id='classicOption' value='classicOption' label='Classic'
                                            checked={classicOption}
                                            onChange={handleClasssicOption}
                                        />
                                    </div>
                                    <div style={{ minWidth: '40%' }}>
                                        <MDBCheckbox name='remoraOption' id='remoraOption' value='remoraOption' label='Remora'
                                            checked={remoraOption}
                                            onChange={handelRemoraOption}
                                        />
                                    </div>
                                </div>
                                {raveLegacyOption && (
                                    <MDBInput wrapperClass='mb-4 mt-3' label='Product Version' id='productVersion' type='text' size='lg'
                                        value={productVersion}
                                        onChange={(e) => setProductVersion(e.target.value)}
                                        required
                                    />
                                )

                                }
                                <MDBInput wrapperClass='mb-4 mt-3' label='DB Server' id='DBServer' type='text' size='lg'
                                    value={DBServer}
                                    onChange={(e) => setDBServer(e.target.value)}
                                    required
                                />
                                {isLoading ? (
                                    <MDBBtn disabled className='w-100  mt-3' size='lg'>
                                        <MDBSpinner grow size='sm' role='status' tag='span' className='me-2' />
                                        Loading...
                                    </MDBBtn>
                                ) : (
                                    <MDBBtn className='w-100  mt-3' size='lg' onClick={handleSubmit}>Submit</MDBBtn>
                                )}
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

    )
};
export default InputForm;