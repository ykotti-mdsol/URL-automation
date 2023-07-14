const modifyJsonBody = (val)=>{
    const response = {};
    for(var i of val['fields']){
        const tempList = Object.values(i['default-value']);
        if(tempList.length==1){
            response[i['key']] = tempList[0];
        }else{
            response[i['key']] = tempList;
        }
    }
    return response;
}

const modifyJsonLRemoraBody = (val)=>{
    const response = {};
    for(var i of val['fields']){
        const tempList = Object.values(i['default-value']);
        if(!i['editable?']){
            if(tempList.length==1){
                response[i['key']] = tempList[0];
            }else{
                response[i['key']] = tempList;
            }
        }
    }
    return response;
}

module.exports = {modifyJsonBody,modifyJsonLRemoraBody}