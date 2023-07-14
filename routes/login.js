const express = require('express')
const router = express.Router()
const axios = require("axios");
const jwt = require('jsonwebtoken');

const config = process.env

router.post("/token",async (req,res) => {
    try{
        const body = req.body;
        const {email,password} = body;

        const {status,data} = await axios.post('https://hdcgreeniaas.lab1.hdc.mdsol.com/api/v3/cmp/apiToken/',{
                username: email,
                password: password,
                domain:"lab1.hdc.mdsol.com"
            });
        
        console.log("Login token generated for:",email);

        return res.status(status).send(data);
    }catch(e){
        console.log("Exception");
        if(e instanceof axios.AxiosError){
            const {status,statusText,data} = e.response;
            data['status'] = status;
            data['statusText'] = statusText;
            console.log(status,statusText, data);
            res.status(status).send(data);
        }else{
            console.log(e);
            res.status(400).send(e);
        }
    }
})


router.post("/validate",async (req,res) => {
    try{
        const body = req.body;
        const {orderId,productVersion,dbServerName} = body;

        console.log(orderId,productVersion,dbServerName);

        if(orderId==null || orderId=="" || productVersion==null || productVersion=="" || dbServerName==null || dbServerName==""){
            return res.status(400).send("Invalid Input.");
        }

        //const decodedData = jwt.decode()

        // const config = {
        //     headers: { Authorization: `Bearer ${token}` }
        // };
        // const {status,data} = await axios.get('https://mnmapi.hdc.mdsol.com/falcon/api/v1/servers/'+dbServerName+'/details',{},config);

        res.status(200).send("data");
    }catch(e){
        console.log("Exception");
        if(e instanceof axios.AxiosError){
            const {status,statusText,data} = e.response;
            data['status'] = status;
            data['statusText'] = statusText;
            console.log(status,statusText, data);
            res.status(status).send(data);
        }else{
            console.log(e);
            res.status(400).send(e);
        }
    }
})

module.exports = router