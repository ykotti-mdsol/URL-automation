import React from "react";
import { useNavigate} from 'react-router-dom';

import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBFooter,
    MDBNavbar,
    MDBNavbarBrand,
    MDBCardTitle,
    MDBCardSubTitle,
    MDBCardText
}
    from 'mdb-react-ui-kit';


const Error = ()=>{
    const navigate = useNavigate();
    const handleSubmit = () => {
        navigate('/');
      };

    return(
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
                       
                    </MDBContainer>
                </MDBNavbar>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
             
                    <MDBContainer fluid className="d-flex align-items-center justify-content-center flex-grow-1">
                        
                        <MDBCard className='p-5 shadow-9' style={{ width: '40%', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)', marginTop: '5%', marginBottom: '5%' }} id="Fcard">
                            <MDBCardBody className='p-1 text-center'>
                            <MDBCardTitle className="text-center"><h2 className="fw-bold">TS - URL Deployment Tool</h2></MDBCardTitle>
                            <img height="120" src="https://media4.giphy.com/media/KFtoeyGbuENeJrnv2j/giphy.gif?cid=6c09b952bd6ae2bc0f660a8ac1cf862d44f72c5216221c3f&ep=v1_internal_gifs_gifId&rid=giphy.gif&ct=s "/>
                              <MDBCardSubTitle  className="text-center mb-4 py-3" style={{color:'red'}}><h4 className="fw-bold"> Oops Error!</h4></MDBCardSubTitle>  
                                <MDBCardText className="text-center ">Sorry!!  Your OrderID: with this Template: is not created.</MDBCardText>

                                <MDBBtn className='  mt-3' size='lg'onClick={handleSubmit} >Try Again</MDBBtn>
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