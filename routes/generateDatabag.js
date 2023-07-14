const express = require('express');
const router = express.Router();
const axios = require("axios");

const {modifyJsonBody,modifyJsonLRemoraBody} = require("../Utils/utils");

const raveClassic = require("../jsonBody/rave_classic.json");
const raveRemora = require("../jsonBody/rave_remora.json");

const rave_classic_global_data = require("../jsonBody/rave-classic-sandbox.json");
const rave_remora_global_data = require("../jsonBody/rave-remora-sandbox.json");

const legacyClassic = require("../jsonBody/legacy_classic.json");
const legacyRemora = require("../jsonBody/legacy_remora.json");

const legacy_data = require("../Utils/legacy_data.json");
const rave_classic_git_data = require("../Utils/rave_classic_git_data.json");
const rave_remora_git_data = require("../Utils/rave_remora_git_data.json");

const config = process.env
const {insertData,findByUser} = require('../lib/db.js');
// const db = require('../lib/db.js');

router.post("/new",async (req,res) => {
    let URLToShowInLogs;
    const body = req.body;
    var {orderId,productVersion,dbServerName,app,version,token,currentUser,currentDateTime} = body;
    
    try{
        // console.log(raveClassic.body.general);

        if(orderId==null || orderId=="" || token==null || token=="" || dbServerName==null || dbServerName==""|| app==null || app==""|| version==null || version==""){
            return res.status(400).send("Mandatory fields are absent.");
        }
        orderId = orderId.trim();
        dbServerName = dbServerName.trim().toLowerCase();
        if(productVersion!=null && productVersion!=''){
            productVersion = productVersion.trim().toLowerCase();
        }        
        const config = { 'Authorization': `Bearer `+token };

        const {status,data} = await axios.get('https://hdcgreeniaas.lab1.hdc.mdsol.com/api/v3/cmp/resources/'+orderId+'/',{
            headers:{ Authorization: `Bearer `+token }
        });

        if(status>210){
            console.log("Invalid Order ID:".status)
            return res.status(400).send("Invalid Order ID")
        }

        console.log("OrderID:",orderId,", Product version:",productVersion,", DB Server name:",dbServerName);

        const SANDBOX_URL_NAME = data['_links']['self']['title'];
        const URL_NAME = SANDBOX_URL_NAME.substring(0,SANDBOX_URL_NAME.length-10);
        const servers = data['_links']['servers'];

        if(servers.length==0){
            return res.status(400).send("Can't find the Server Name");
        }

        const WEB_SERVER_NAME = servers.find(e=>e['title'].includes('web'))['title'];
        const APP_SERVER_NAME = servers.find(e=>e['title'].includes('app'))['title'];
        
        console.log(SANDBOX_URL_NAME,WEB_SERVER_NAME,APP_SERVER_NAME,app,version);
        
        var url = null;
        var reqBody = null;
        var apiToken = null;

        if(app=="Rave"){
            apiToken = process.env.CYCLOPS_RAVE_API_KEY;
            if(version=="Classic"){
                URLToShowInLogs = "rave-classic/" + SANDBOX_URL_NAME + "/edit";
                // console.log(URLToShowInLogs);
                const globalData = await axios.get("https://cyclopsui-sandbox.imedidata.net/api/v0/templates/rave/rave-classic",{
                    headers:{ 'access-token': apiToken }
                });

                if(globalData.status>=400){
                    return res.status(globalData.status).send(globalData.data)
                }

                const newBodyData = modifyJsonBody(globalData['data']);
                const git_fields =  rave_classic_git_data.find(e=>e.key==productVersion);
                // console.log(git_fields);

                url = "https://cyclopsui-sandbox.imedidata.net/api/v0/url-configurations/rave/rave-classic/"+SANDBOX_URL_NAME;
                reqBody = raveClassic;
                reqBody.body.servers[0]['server-name'] = APP_SERVER_NAME;
                reqBody.body.servers[1]['server-name'] = WEB_SERVER_NAME;
                reqBody.body.servers[1]['roles'][0]['core-box'] = APP_SERVER_NAME;
                reqBody.body.servers[2]['server-name'] = dbServerName;
                reqBody.body.servers[3]['roles'][0]['viewers'][0]['viewer-name'] = URL_NAME+"_1";
                reqBody.body.servers[3]['roles'][0]['viewers'][0]['unique-name'] = URL_NAME+"_1";
                
                const globals = newBodyData;

                Object.keys(globals).forEach(element => {
                    if (typeof globals[element] === 'string' && globals[element].includes("INSTANCENAME")){
                        globals[element] = globals[element].replace("INSTANCENAME",URL_NAME)
                    }else if (typeof globals[element] === 'string' && globals[element].includes("INSTANCE")){
                        globals[element] = globals[element].replace("INSTANCE",URL_NAME)
                    }

                    if(typeof globals[element] === 'string' && globals[element].includes("REPLACE WITH")){
                        // console.log(element,globals[element]);
                        globals[element] = "";
                    }
                    if(typeof globals[element] === 'string' && globals[element].includes("<stage>")){
                        globals[element] = globals[element].replace("<stage>","sandbox");
                    }
                    if(typeof globals[element] === 'string' && globals[element].includes("<STAGE>")){
                        globals[element] = globals[element].replace("<STAGE>","SANDBOX");
                    }
                    if( element in rave_classic_global_data){
                        globals[element] = rave_classic_global_data[element];
                        //console.log(element,":",globals[element]);
                    }
                });
                globals['RAVE_SQL_SERVER_NAME'] = dbServerName;
                globals['RAVE_REPORTING_DB_SERVER_NAME'] = dbServerName;
                globals['RAVE_REPORTING_URL'] = "https://hgsbxraverpt030.mdsol.com";
                
                globals['DEPLOY_ARTIFACTS_ITEMS'] = git_fields.value.DEPLOY_ARTIFACTS_ITEMS;
                globals['PIR_LINK'] = git_fields.value.PIR_LINK;
                globals['RAVE_BUILD_ASSEMBLY_VERSION'] = git_fields.value.RAVE_BUILD_ASSEMBLY_VERSION;
                globals['RAVE_BUILD_COMMIT_ID'] = git_fields.value.RAVE_BUILD_COMMIT_ID;
                globals['RAVE_BUILD_PRODUCT_NAME'] = git_fields.value.RAVE_BUILD_PRODUCT_NAME;
                globals['RAVE_PRODUCT_VERSION'] = git_fields.value.RAVE_PRODUCT_VERSION;

                globals['DEPLOY_ADDON_JREVIEW_RAVE']=false;
                globals['DEPLOY_ADDON_PTCLOUD'] = false;
                globals['RAVE_OLD_REPORTING_SERVER_NAME'] = 'hdcsboxrptv016';
                reqBody.body.global = globals
                // console.log(reqBody.body.global);

            }else if(version=="Remora"){
                URLToShowInLogs = "rave-remora/" + SANDBOX_URL_NAME + "/edit";
                // console.log(URLToShowInLogs);
                const globalData = await axios.get("https://cyclopsui-sandbox.imedidata.net/api/v0/templates/rave/rave-remora",{
                    headers:{ 'access-token': apiToken }
                });

                if(globalData.status>=400){
                    return res.status(globalData.status).send(globalData.data)
                }

                const newBodyData = modifyJsonBody(globalData['data']);
                const git_fields =  rave_remora_git_data.find(e=>e.key==productVersion);
                // console.log(git_fields);

                url = "https://cyclopsui-sandbox.imedidata.net/api/v0/url-configurations/rave/rave-remora/"+SANDBOX_URL_NAME;
                reqBody = raveRemora;
                reqBody.body.servers[0]['server-name'] = APP_SERVER_NAME;
                reqBody.body.servers[1]['server-name'] = WEB_SERVER_NAME;
                reqBody.body.servers[1]['roles'][0]['core-box'] = APP_SERVER_NAME;
                reqBody.body.servers[2]['server-name'] = dbServerName;
                reqBody.body.servers[3]['roles'][0]['viewers'][0]['viewer-name'] = URL_NAME+"_1";
                reqBody.body.servers[3]['roles'][0]['viewers'][0]['unique-name'] = URL_NAME+"_1";
                const globals = newBodyData;
                Object.keys(globals).forEach(element => {
                    if (typeof globals[element] === 'string' && globals[element].includes("INSTANCENAME")){
                        globals[element] = globals[element].replace("INSTANCENAME",URL_NAME)
                    }else if (typeof globals[element] === 'string' && globals[element].includes("INSTANCE")){
                        globals[element] = globals[element].replace("INSTANCE",URL_NAME)
                    }

                    if(typeof globals[element] === 'string' && globals[element].includes("REPLACE WITH")){
                        // console.log(element,globals[element]);
                        globals[element] = "";
                    }
                    if(typeof globals[element] === 'string' && globals[element].includes("<stage>")){
                        globals[element] = globals[element].replace("<stage>","sandbox");
                    }
                    if(typeof globals[element] === 'string' && globals[element].includes("<STAGE>")){
                        globals[element] = globals[element].replace("<STAGE>","SANDBOX");
                    }
                    if( element in rave_remora_global_data){
                        globals[element] = rave_remora_global_data[element];
                        //console.log(element,":",globals[element]);
                    }
                });
                globals['RAVE_SQL_SERVER_NAME'] = dbServerName;
                globals['RAVE_REPORTING_DB_SERVER_NAME'] = dbServerName;
                globals['DEPLOY_ARTIFACTS_ITEMS'] = git_fields.value.DEPLOY_ARTIFACTS_ITEMS;
                globals['PIR_LINK'] = git_fields.value.PIR_LINK;
                globals['RAVE_REPORTING_URL'] = "https://hgsbxraverpt030.mdsol.com";
                globals['RAVE_BUILD_ASSEMBLY_VERSION'] = git_fields.value.RAVE_BUILD_ASSEMBLY_VERSION;
                globals['RAVE_BUILD_COMMIT_ID'] = git_fields.value.RAVE_BUILD_COMMIT_ID;
                globals['RAVE_BUILD_PRODUCT_NAME'] = git_fields.value.RAVE_BUILD_PRODUCT_NAME;
                globals['RAVE_PRODUCT_VERSION'] = git_fields.value.RAVE_PRODUCT_VERSION;
                
                globals['DEPLOY_ADDON_JREVIEW_RAVE']=false;
                globals['DEPLOY_ADDON_PTCLOUD'] = false;
                globals['RAVE_OLD_REPORTING_SERVER_NAME'] = 'hdcsboxrptv016';
                reqBody.body.global = globals
                // console.log(reqBody.body.global);

            }else{
                url = null;
            }

        }else if(app=="Legacy"){
            apiToken = process.env.CYCLOPS_LEGACY_API_KEY;
            if(version=="Classic"){
                URLToShowInLogs = productVersion + "/" + SANDBOX_URL_NAME + "/edit";
                // console.log(URLToShowInLogs);
                const globalData = await axios.get("https://cyclopsui-sandbox.imedidata.net/api/v0/templates/rave-legacy/"+productVersion,{
                    headers:{ 'access-token': apiToken }
                });

                if(globalData.status>=400){
                    return res.status(globalData.status).send(globalData.data)
                }

                const newBodyData = modifyJsonBody(globalData['data']);

                prodVerSlice = productVersion.split('-')[0];

                url = "https://cyclopsui-sandbox.imedidata.net/api/v0/url-configurations/rave-legacy/"+productVersion+"/"+SANDBOX_URL_NAME;
                reqBody = legacyClassic;
                reqBody.body.servers[0]['server-name'] = APP_SERVER_NAME;
                reqBody.body.servers[1]['server-name'] = WEB_SERVER_NAME;
                reqBody.body.servers[1]['roles'][0]['core-box'] = APP_SERVER_NAME;
                reqBody.body.servers[2]['server-name'] = dbServerName;
                reqBody.body.servers[3]['roles'][0]['viewers'][0]['viewer-name'] = URL_NAME+"_1";
                reqBody.body.servers[3]['roles'][0]['viewers'][0]['unique-name'] = URL_NAME+"_1";
                const globals = newBodyData;
                Object.keys(globals).forEach(element => {
                    if (typeof globals[element] === 'string' && globals[element].includes("INSTANCENAME")){
                        globals[element] = globals[element].replace("INSTANCENAME",URL_NAME)
                    }else if (typeof globals[element] === 'string' && globals[element].includes("INSTANCE")){
                        globals[element] = globals[element].replace("INSTANCE",URL_NAME)
                    }

                    if(typeof globals[element] === 'string' && globals[element].includes("REPLACE WITH")){
                        // console.log(element,globals[element]);
                        globals[element] = "";
                    }
                    if(typeof globals[element] === 'string' && globals[element].includes("VERSION_LINK")){
                        // console.log(element,globals[element]);
                        globals[element] = globals[element].replace("VERSION_LINK",prodVerSlice);
                    }
                });
                globals['RAVE_SQL_SERVER_NAME'] = dbServerName;
                globals['RAVE_REPORTING_DB_SERVER_NAME'] = dbServerName;
                globals['RAVE_PRODUCT_VERSION'] = prodVerSlice;
                globals['RAVE_REPORTING_URL'] = "http://hgsbxraverpt030.mdsol.com";
                const tempList = globals['RAVE_BUILD_PRODUCT_NAME'].split(' ');
                tempList[tempList.length - 1] = prodVerSlice;
                globals['RAVE_BUILD_PRODUCT_NAME'] = tempList.join(' ');
                var selectedData = null;
                legacy_data.forEach(data=>{
                    if(data['version']===prodVerSlice){
                        selectedData = data;
                    }
                });
                if(selectedData !=null){
                    globals['DEPLOY_ARTIFACTS_LOCATION'] = selectedData['version']+"\\"+selectedData['artifact'];
                    globals['EXECUTE_GENERIC_TASK_LOCATION'] = "\\\\lab1.hdc.mdsol.com\\softwareinstallations\\SDLC\\Rave\\release\\"+selectedData['version']+"\\"+selectedData['artifact'];
                }
                globals['DEPLOY_ADDON_JREVIEW_RAVE']=false;
                globals['DEPLOY_ADDON_PTCLOUD'] = false;

                reqBody.body.global = globals

            }else if(version=="Remora"){
                URLToShowInLogs = productVersion + "/" + SANDBOX_URL_NAME + "/edit";
                // console.log(URLToShowInLogs);
                const globalData = await axios.get("https://cyclopsui-sandbox.imedidata.net/api/v0/templates/rave-legacy/"+productVersion,{
                    headers:{ 'access-token': apiToken }
                });

                if(globalData.status>=400){
                    return res.status(globalData.status).send(globalData.data)
                }

                const newBodyData = modifyJsonBody(globalData['data']);

                prodVerSlice = productVersion.split('-')[1];

                url = "https://cyclopsui-sandbox.imedidata.net/api/v0/url-configurations/rave-legacy/"+productVersion+"/"+SANDBOX_URL_NAME;
                reqBody = legacyRemora;
                reqBody.body.servers[0]['server-name'] = APP_SERVER_NAME;
                reqBody.body.servers[1]['server-name'] = WEB_SERVER_NAME;
                reqBody.body.servers[1]['roles'][0]['core-box'] = APP_SERVER_NAME;
                reqBody.body.servers[2]['server-name'] = dbServerName;
                reqBody.body.servers[3]['roles'][0]['viewers'][0]['viewer-name'] = URL_NAME+"_1";
                reqBody.body.servers[3]['roles'][0]['viewers'][0]['unique-name'] = URL_NAME+"_1";
                const globals = newBodyData;
                Object.keys(globals).forEach(element => {
                    if (typeof globals[element] === 'string' && globals[element].includes("INSTANCENAME")){
                        globals[element] = globals[element].replace("INSTANCENAME",URL_NAME)
                    }else if (typeof globals[element] === 'string' && globals[element].includes("INSTANCE")){
                        globals[element] = globals[element].replace("INSTANCE",URL_NAME)
                    }

                    if(typeof globals[element] === 'string' && globals[element].includes("REPLACE WITH")){
                        // console.log(element,globals[element]);
                        globals[element] = "";
                    }
                    if(typeof globals[element] === 'string' && globals[element].includes("VERSION_LINK")){
                        // console.log(element,globals[element]);
                        globals[element] = globals[element].replace("VERSION_LINK",prodVerSlice);
                    }
                });
                globals['RAVE_SQL_SERVER_NAME'] = dbServerName;
                globals['RAVE_REPORTING_DB_SERVER_NAME'] = dbServerName;
                globals['RAVE_PRODUCT_VERSION'] = prodVerSlice;
                globals['RAVE_REPORTING_URL'] = "https://hgsbxraverpt030.mdsol.com";
                const tempList = globals['RAVE_BUILD_PRODUCT_NAME'].split(' ');
                tempList[tempList.length - 1] = prodVerSlice;
                globals['RAVE_BUILD_PRODUCT_NAME'] = tempList.join(' ');
                var selectedData = null;
                legacy_data.forEach(data=>{
                    if(data['version']===prodVerSlice){
                        selectedData = data;
                    }
                });
                if(selectedData !=null){
                    globals['DEPLOY_ARTIFACTS_ITEMS'] = selectedData['artifactItems'];
                    globals['EXECUTE_GENERIC_TASK_LOCATION'] = "\\\\lab1.hdc.mdsol.com\\softwareinstallations\\SDLC\\Rave\\release\\"+selectedData['version']+"\\"+selectedData['artifact'];
                }
                globals['DEPLOY_ADDON_JREVIEW_RAVE']=false;
                globals['DEPLOY_ADDON_PTCLOUD'] = false;
                reqBody.body.global = globals

            }else{
                url = null;
            }
        }else{
            url = null;
        }

        if(url == null && reqBody == null && apiToken==null){
            console.log("Invalid app or version name");
            return res.status(400).send("Invalid app or version name");
        }
        const dataBagRes = await axios.post(url,reqBody,{
            headers:{ 'access-token': apiToken }
        });

        console.log("Created Databag..!");
        const creation_status = dataBagRes.status < 300 ? 'success' : 'fail';
        console.log(creation_status);
        URLToShowInLogs = "https://cyclopsui-sandbox.imedidata.net/#/url-configurations/" + URLToShowInLogs ;
        insertData(currentUser,orderId,app,version,productVersion,dbServerName,URLToShowInLogs,currentDateTime,creation_status);

        return res.status(dataBagRes.status).send(dataBagRes.data);
    }catch(e){
        console.log("Exception");
        const creation_status ='Failed';
        console.log(creation_status);
        URLToShowInLogs = "https://cyclopsui-sandbox.imedidata.net/#/url-configurations/" + URLToShowInLogs ;
        insertData(currentUser,orderId,app,version,productVersion,dbServerName,URLToShowInLogs,currentDateTime,creation_status);
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
        // console.log(e);
        // res.status(400).send(e);
    }
});
router.post("/add/:username", async(req, res) => {

    const name = req.params.username;
   findByUser(name,(err,results)=>{
    if(err){
        return res.status(500).send("Error");
    }
    res.json(results);
   })
});

module.exports = router