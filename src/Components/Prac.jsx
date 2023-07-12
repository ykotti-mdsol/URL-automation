import React, { useState } from "react";
import axios from 'axios';

const Prac = () => {
    const [urlName, seturlName] = useState('');
    const handlevalues = async (e) => {

        const RLClassicApiUrl = `https://cyclopsui-sandbox.imedidata.net/api/v0/url-configurations/rave-legacy/2021.2.1-Sandbox/hgsbxrave491.mdsol.com`;

        const cr = await axios.post(RLClassicApiUrl,
            {

               




            }, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json',
                "Accept": "*/*"
            }
        });
        temp = RLClassicApiUrl.data;
        console.log(temp);

    }
    return (
        <>
        <button onClick={handlevalues}>click</button>
        </>
    );
}

export default Prac;