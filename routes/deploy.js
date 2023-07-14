const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const axios = require("axios");

const config = process.env

router.post("/new",async (req,res) => {
    const body = req.body;
    const app = body.app; // rave or rave-legacy
    const version = body.version; // rave or remora
    const url = body.url; // hgsbxrave491.mdsol.com
    //const url = "hgsbxrave491.mdsol.com";
    const raveTemp = (app=="rave")?version=="rave"?"rave-classic":"rave-remora":null;
    //const template = raveTemp!=null?raveTemp:body.template; // rave-classic or rave-remora or 20201.2.0-Sandbox
    const userName = body.userName ;
    const template = body.template;
    console.log(body);
    console.log(body.template);
    console.log(template);
    const command = "cd\\ \n cd “\\\\lab1\\softwareinstallations\\Shared Resources\\TS_Cerebro_copy” \n ./Cerebro"

    const powerShellExec = exec(command, {'shell':'powershell.exe'}, (error, stdout, stderr)=> {
        console.log("Output:",stdout)
        console.log("Error",error)
        console.log("Output Error:",stderr)
        //res.status(200).send("Done");
    });

    if(app=="rave-legacy"){
        // powerShellExec.stdin.write("whoami");
        powerShellExec.stdin.write("deployment\n");
        powerShellExec.stdin.write(app+"\n");
        powerShellExec.stdin.write(version+"\n");
        powerShellExec.stdin.write(url+"\n");
        powerShellExec.stdin.write(template+"\n");
        powerShellExec.stdin.write("n\n");
        console.log("Legacy");
    }else{
        // powerShellExec.stdin.write(userName+"\n");
        powerShellExec.stdin.write("deployment\n");
        powerShellExec.stdin.write(app+"\n");
        powerShellExec.stdin.write(app+"\n");
        powerShellExec.stdin.write(version+"\n");
        powerShellExec.stdin.write(url+"\n");
        powerShellExec.stdin.write(raveTemp+"\n");
        powerShellExec.stdin.write(template+"\n");
        powerShellExec.stdin.write("n\n");
        console.log("Rave");
    }
    res.status(200).send("Done");
})

module.exports = router