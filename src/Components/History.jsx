import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import medidataLogo from "../assets/Medidata_Logo_white.png";
import axios from 'axios';
import Timer from './Timer';
import "./navbar.css";
import { MDBDataTable, MDBDataTableV5 } from 'mdbreact';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBFooter,
    MDBNavbar,
    MDBNavbarBrand,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter
}
    from 'mdb-react-ui-kit';


const History = () => {
    const location = useLocation();
    let navigate = useNavigate();
    let getRemainingSeconds;
    let secondsRef = useRef(0);
    let setTimerTime = 300;
    let da;
    // console.log(location.state)
    if (location.state == null) {
        getRemainingSeconds = setTimerTime;
    } else {
        getRemainingSeconds = location.state.remainingSeconds;
        da = location.state.dataresult;
    }
    // console.log(getRemainingSeconds);
    const time = new Date();
    time.setSeconds(time.getSeconds() + getRemainingSeconds);

    const handelLogOut = () => {
        sessionStorage.removeItem("api_CloudBoltToken");
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUserPassword");
        navigate("/login");
    };

    const timerRef = useRef(null);

    const handleGetTotalSeconds = () => {
        if (timerRef.current) {
            let totalSeconds = timerRef.current.returnTotalSeconds();
            secondsRef.current = totalSeconds;
        }
    };

    const data = {
        columns: [
            // { label: 'Username', field: 'username', sort: 'asc', width: 150 },
            { label: 'Resource ID', field: 'resourceid', sort: 'asc', width: 200 },
            { label: 'App', field: 'app', sort: 'asc', width: 100 },
            { label: 'Version', field: 'version', sort: 'asc', width: 100 },
            { label: 'Product Version', field: 'productversion', sort: 'asc', width: 270 },
            { label: 'DB Server Name', field: 'database', sort: 'asc', width: 150 },
            { label: 'URL', field: 'url', sort: 'asc', width: 400 },
            { label: 'Creation Date & Time', field: 'creationtime', sort: 'asc', width: 200 },
            { label: 'Creation Status', field: 'creationstatus', sort: 'asc', width: 150 },

        ],
        rows: da.map((id, index) => ({
            // username: id[1],
            resourceid: id[2],
            app: id[3],
            version: id[4],
            productversion: id[5],
            database: id[6],
            url: id[7],
            creationtime: id[8],
            creationstatus: id[9]
        }))
    };
    const handleCreateDatabag = () => {
        handleGetTotalSeconds();
        navigate("/inputform", {
            state: {
                remainingSeconds: secondsRef.current
            }
        })
    };
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
            })

        } catch (e) {
            console.log(e);
        }

    }
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: '0px' }}>

                <MDBNavbar style={{ backgroundColor: 'rgba(51, 81, 119, 1)', margin: '0px', padding: '0px' }}>
                    <MDBContainer fluid>
                        <MDBNavbarBrand href='#'>
                            <img
                                src={medidataLogo}
                                height='25'
                                alt=''
                                loading='lazy'
                            />
                        </MDBNavbarBrand>
                        <div className="otherPage ms-auto " onClick={handleCreateDatabag}>
                            <MDBNavbarItem className="d-flex align-items-center">
                                <a className="createDatabagLink m-2 p-1" >Create Databag</a>
                            </MDBNavbarItem>
                        </div>
                        {/* <MDBNavbarItem className="d-flex align-items-center ms-4">
                                <a className="createDatabagLink" onClick={handleDeploy}>Deploy URL</a>
                            </MDBNavbarItem> */}
                        <div onClick={handleHistory} className="activePage ms-2">
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
                    </MDBContainer>
                </MDBNavbar>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1">
                        <MDBCard className='p-5 shadow-9' style={{ width: '90%', background: 'hsla(0, 0%, 100%, 0.8)', margin: '0' }} id="Fcard">
                            <h2 className="fw-bold text-center">TS - URL Deployment Tool </h2>
                            <MDBCardBody className='p-1 text-center' >
                                <div className="table-container">
                                    <MDBDataTableV5 hover entriesOptions={[25, 50, 100]} entries={25} pagesAmount={8}
                                        scrollX
                                        // scrollY
                                        maxHeight="200px"
                                        data={data}
                                    />
                                </div>
                                {/* <div style={{ height: '300px', overflowY: 'auto' }}> */}
                                {/* <div className="table-container">
                                    <MDBTable striped hover responsive allign="left" autoWidth  ref={tableRef} onScroll={handleScroll} className="fixedHeader">
                                        <MDBTableHead dark className={`fixed-header ${scrollTop > 0 ? 'shadow' : ''}`}>
                                            <tr>
                                                <th>Username</th>
                                                <th>Db</th>
                                                <th>Product version</th>
                                                <th>Resource ID</th>
                                                <th>App</th>
                                                <th>Version</th>
                                                <th>URL</th>
                                                <th>Creation Time</th>
                                                <th>Creation Status</th>
                                            </tr>
                                        </MDBTableHead>
                                        <MDBTableBody>
                                            {da.map((id, index) => (
                                                <tr key={index}>
                                                    <td>{id[1]}</td>
                                                    <td>{id[2]}</td>
                                                    <td>{id[3]}</td>
                                                    <td>{id[4]}</td>
                                                    <td>{id[5]}</td>
                                                    <td>{id[6]}</td>
                                                    <td>{id[7]}</td>
                                                    <td>{id[8]}</td>
                                                    <td>{id[9]}</td>
                                                </tr>
                                            ))}
                                        </MDBTableBody>
                                    </MDBTable>
                                </div> */}


                                {/* <table className="table table-striped table-hover">
                                    <thead className="table-info">
                                        <tr>
                                            <th>Username</th>
                                            <th>Db</th>
                                            <th>Product version</th>
                                            <th>Resource ID</th>
                                            <th>App</th>
                                            <th>Version</th>
                                            <th>URL</th>
                                            <th>Creation Time</th>
                                            <th>Creation Status</th>
                                        </tr>
                                    </thead>

                                    {da.map((id, index) => (
                                        <tbody key={index}>
                                            <tr>

                                                <td>{id[1]}</td>
                                                <td>{id[2]}</td>
                                                <td>{id[3]}</td>
                                                <td>{id[4]}</td>
                                                <td>{id[5]}</td>
                                                <td>{id[6]}</td>
                                                <td>{id[7]}</td>
                                                <td>{id[8]}</td>
                                                <td>{id[9]}</td>
                                            </tr>
                                        </tbody>
                                    ))}
                                </table> */}
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

export default History;