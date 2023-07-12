import React, { useEffect, useRef, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import PageNotFound from "./PageNotFound";
import Timer from './Timer';
import Success from "./Success";
import DBServerList from "../assets/dbServerName.json";
import productVersionList_Legacy_Classic from "../assets/productVersion_legacy_classic.json";
import productVersionList_Legacy_Remora from "../assets/productVersion_legacy_remora.json";
import productVersionList_Rave_Remora from "../assets/productVersion_rave_remora.json";
import productVersionList_Rave_Classic from "../assets/productVersion_rave_classic.json";
import productVersionList_Default_List from "../assets/productVersion_Default_List.json";

const InputForm = () => {

    const [orderId, setOrderId] = useState('');
    const [raveLegacyOption, setRaveLegacyOption] = useState(false);
    const [raveOption, setRaveOption] = useState(false);
    const [classicOption, setClassicOption] = useState(false);
    const [remoraOption, setRemoraOption] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [productVersionValue,setProductVersionValue] = useState();
    const [resetKey, setResetKey] = useState(0);
    const apiCloudBoltToken = sessionStorage.getItem("api_CloudBoltToken");

    let secondsRef = useRef(0);
    let productVersionRef = useRef(null);
    let DBServerRef = useRef(null);
    let navigate = useNavigate();
    let location = useLocation();
    let getRemainingSeconds;
    let setTimerTime = 300;
    if (location.state == null) {
        getRemainingSeconds = setTimerTime;
    } else {
        getRemainingSeconds = location.state.remainingSeconds;
    }
    const time = new Date();
    time.setSeconds(time.getSeconds() + getRemainingSeconds);
    const SelectInputClear = () => {
        setProductVersionValue(null);
        setResetKey(prevKey => prevKey + 1);
    }
    const handleRaveLegacyOption = () => {
        setRaveLegacyOption(true);
        setRaveOption(false);
         SelectInputClear();
    };
    const handelRaveOption = () => {
        setRaveOption(true);
        setRaveLegacyOption(false);
         SelectInputClear();
    };
    const handleClasssicOption = () => {
        setClassicOption(true);
        setRemoraOption(false);
         SelectInputClear();
    };
    const handelRemoraOption = () => {
        setRemoraOption(true);
        setClassicOption(false);
         SelectInputClear();
    };
    const handelLogOut = () => {
        sessionStorage.removeItem("api_CloudBoltToken");
        navigate("/login");
    };
    const handleProductVersionChange = (selectedOption) => {
        productVersionRef.current = selectedOption ? selectedOption.value : null;
    };
    const handleDBServerChange = (selectedOption) => {
        DBServerRef.current = selectedOption ? selectedOption.value : null;
    };
    productVersionList_Default_List.sort(function (a, b) {
        return a.value.localeCompare(b.value);
    });
    productVersionList_Legacy_Classic.sort(function (a, b) {
        return a.value.localeCompare(b.value);
    });
    productVersionList_Legacy_Remora.sort(function (a, b) {
        return a.value.localeCompare(b.value);
    });
    productVersionList_Rave_Classic.sort(function (a, b) {
        return a.value.localeCompare(b.value);
    });
    productVersionList_Rave_Remora.sort(function (a, b) {
        return a.value.localeCompare(b.value);
    });
    DBServerList.sort(function (a, b) {
        return a.value.localeCompare(b.value);
    });
    const timerRef = useRef(null);

    const handleGetTotalSeconds = () => {
        if (timerRef.current) {
            let totalSeconds = timerRef.current.returnTotalSeconds();
            secondsRef.current = totalSeconds;
        }
    };
    const handleSubmit = async (e) => {

        if (!orderId || (DBServerRef==null) || (productVersionValue==null)
            || !(raveLegacyOption || raveOption) || !(classicOption || remoraOption)
        ) {
            console.log("Required some fields");
            return;
        }
        e.preventDefault();
        setIsLoading(true);
        const orderIDUrl = "http://10.194.40.99:3550/generateDatabag/new"; //`https://hdcgreeniaas.lab1.hdc.mdsol.com/api/v3/cmp/resources/${orderId}/`;
        //const orderIDUrl = "http://localhost:4000/generateDatabag/new"; //`https://hdcgreeniaas.lab1.hdc.mdsol.com/api/v3/cmp/resources/${orderId}/`;
        const app = raveOption ? "Rave" : raveLegacyOption ? "Legacy" : null;
        const version = classicOption ? "Classic" : remoraOption ? "Remora" : null;
        const productVersionActualValue = productVersionValue ? productVersionValue.value : null;
        const bodyData = {
            "orderId": orderId,
            "productVersion": productVersionActualValue,
            "dbServerName": DBServerRef.current,
            "app": app,
            "version": version,
            "token": apiCloudBoltToken
        };
        try {
            const response = await axios.post(orderIDUrl, bodyData);
            if (response.status < 300) {
                handleGetTotalSeconds();
                navigate("/success", {
                    state: {
                        orderId: orderId,
                        version: version,
                        dbName: DBServerRef.current,
                        secondsRemaining: secondsRef.current
                    }
                })
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status == 401) {
                    alert("Session Expired!! Login again!!");
                    sessionStorage.removeItem("api_CloudBoltToken");
                    navigate("/login");
                }
                else {
                    handleGetTotalSeconds();
                    navigate("/error", {
                        state: {
                            msg: error.response.statusText,
                            status: error.response.status,
                            orderId: orderId,
                            version: version,
                            dbName: DBServerRef.current,
                            secondsRemaining: secondsRef.current
                        }
                    })
                }
            } else if (error.request) {
                alert("network error");
            } else {
                console.log(error);
                alert("Error please see console ");
            }
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

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, margin: '0' }}>
                            <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1" style={{ margin: '0' }}>
                                <MDBCard className='p-5 shadow-9' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', margin: '0' }} id="Fcard">
                                    <h2 className="fw-bold text-center">TS - URL Deployment Tool </h2>
                                    <MDBCardBody className='p-1'>
                                        <form >
                                            <MDBInput wrapperClass='mt-4' label='Cloudbolt Order ID' id='orderId' type='text' size='lg'
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
                                            <Select className="mt-4"
                                                options={(raveOption && classicOption) ? productVersionList_Rave_Classic
                                                    : (raveOption && remoraOption) ? productVersionList_Rave_Remora
                                                        : (raveLegacyOption && classicOption) ? productVersionList_Legacy_Classic
                                                            : (raveLegacyOption && remoraOption) ? productVersionList_Legacy_Remora
                                                                : productVersionList_Default_List}
                                                key={resetKey}
                                                placeholder="Product Version"
                                                onChange={setProductVersionValue}
                                                isSearchable
                                                isClearable
                                                noOptionsMessage={() => "No Product Version found"}
                                                required
                                            />
                                            <CreatableSelect className="mt-4 mb-4"
                                                options={DBServerList}
                                                placeholder="DB Server"
                                                onChange={handleDBServerChange}
                                                isSearchable
                                                isClearable
                                                noOptionsMessage={() => "No DB Server found"}
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