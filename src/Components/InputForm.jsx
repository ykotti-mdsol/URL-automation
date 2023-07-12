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
    MDBNavbarLink,
    MDBNavbarNav,
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
import "./navbar.css";
const InputForm = () => {

    const [orderId, setOrderId] = useState('');
    const [raveLegacyOption, setRaveLegacyOption] = useState(false);
    const [raveOption, setRaveOption] = useState(false);
    const [classicOption, setClassicOption] = useState(false);
    const [remoraOption, setRemoraOption] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [productVersionValue, setProductVersionValue] = useState();
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
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUserPassword");
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
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const currentDateTime = new Date().toLocaleString(undefined, options).replace(',', '');

    const handleGetTotalSeconds = () => {
        if (timerRef.current) {
            let totalSeconds = timerRef.current.returnTotalSeconds();
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
    }
    const handleDeploy = () => {
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

    }
    const handleSubmit = async (e) => {

        if (!orderId || (DBServerRef == null) || (productVersionValue == null)
            || !(raveLegacyOption || raveOption) || !(classicOption || remoraOption)
        ) {
            console.log("Required some fields");
            return;
        }
        e.preventDefault();
        setIsLoading(true);
        const orderIDUrl = "http://10.194.40.99:3550/generateDatabag/new"; //`https://hdcgreeniaas.lab1.hdc.mdsol.com/api/v3/cmp/resources/${orderId}/`;
        // const orderIDUrl = "http://localhost:5000/generateDatabag/new"; //`https://hdcgreeniaas.lab1.hdc.mdsol.com/api/v3/cmp/resources/${orderId}/`;
        const app = raveOption ? "Rave" : raveLegacyOption ? "Legacy" : null;
        const version = classicOption ? "Classic" : remoraOption ? "Remora" : null;
        const productVersionActualValue = productVersionValue ? productVersionValue.value : null;
        const currentUser = sessionStorage.getItem("currentUser");
        const bodyData = {
            "orderId": orderId,
            "productVersion": productVersionActualValue,
            "dbServerName": DBServerRef.current,
            "app": app,
            "version": version,
            "token": apiCloudBoltToken,
            "currentUser": currentUser,
            "currentDateTime": currentDateTime
        };
        try {
            const response = await axios.post(orderIDUrl, bodyData);
            if (response.status < 300) {
                handleGetTotalSeconds();
                const resData = response.data;
                // console.log(resData);
                const url = resData['global']['RAVE_URL_BASE'];
                //console.log(url);
                navigate("/success", {
                    state: {
                        orderId: orderId,
                        version: version,
                        dbName: DBServerRef.current,
                        secondsRemaining: secondsRef.current,
                        url: url,
                        app: app == "Rave" ? "rave" : "rave-legacy",
                        deployVersion: version == "Classic" ? "rave" : "remora",
                        template: productVersionActualValue
                    }
                })
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status == 401) {
                    alert("Session Expired!! Login again!!");
                    sessionStorage.removeItem("api_CloudBoltToken");
                    sessionStorage.removeItem("currentUser");
                    sessionStorage.removeItem("currentUserPassword");
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
                setIsLoading(false);
            } else {
                console.log(error);
                alert("Error please see console ");
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            {apiCloudBoltToken ? (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: '0px' }}>

                        <MDBNavbar style={{ backgroundColor: 'rgba(51, 81, 119, 1)', margin: '0px', padding: '0px' }}>
                            <MDBContainer fluid className="navbarContainer">
                                <MDBNavbarBrand href='#'>
                                    <img
                                        src={medidataLogo}
                                        height='25'
                                        alt=''
                                        loading='lazy'
                                    />
                                </MDBNavbarBrand>
                                {/* <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'> */}
                                <div className="ms-auto activePage " onClick={handleCreateDatabag}>
                                    <MDBNavbarItem className="d-flex align-items-center   ">
                                        <a className="createDatabagLink m-2 p-1" >Create Databag</a>
                                    </MDBNavbarItem>
                                </div>
                                {/* <MDBNavbarItem className="d-flex align-items-center ms-4">
                                        <a className="createDatabagLink" onClick={handleDeploy}>Deploy URL</a>
                                    </MDBNavbarItem> */}
                                <div onClick={handleHistory} className="otherPage ms-2">
                                    <MDBNavbarItem className="d-flex align-items-center " >
                                        <a className="createDatabagLink m-2 p-1" >History</a>
                                    </MDBNavbarItem>
                                </div>
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
                                {/* </MDBNavbarNav> */}
                            </MDBContainer>
                        </MDBNavbar>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, margin: '0' }}>
                            <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1" style={{ margin: '0' }}>
                                <MDBCard className='p-5 shadow-9' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', margin: '0' }} id="Fcard">
                                    <h2 className="fw-bold text-center">TS - URL Deployment Tool </h2>
                                    <MDBCardBody className='p-1'>
                                        <form >
                                            <MDBInput wrapperClass='mt-4' label='Cloudbolt Resource ID' id='orderId' type='text' size='lg'
                                                onChange={(e) => setOrderId(e.target.value)}
                                                required
                                                value={orderId}
                                                autoComplete="off"
                                                autoFocus
                                            />
                                            <h5 className=" fw-bold mt-4 mb-0" >Select App:</h5>
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
                                            <h5 className="mt-3  mb-0 fw-bold">Select its corresponding version:</h5>
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