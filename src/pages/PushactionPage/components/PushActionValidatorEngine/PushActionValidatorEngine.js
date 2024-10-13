export default function validate (values, privateKeyList) {
    let errors = {};    
    
    if (!values.smartContractName || values.smartContractName.length === 0) {
        errors.smartContractName = 'Smart协议名称为必填项目';
    }

    if (!values.actionType || values.actionType.length === 0 || values.actionType === "选择操作类型") {
        errors.actionType = '操作类型为必填项目';
    }

    if(!values.permission || values.permission.length === 0) {
        errors.permission = '权限为必填项目';
    }
    else {
        let errorString = "";
        let reasons = [];

        let privateKey = privateKeyList.find(key => key.account+"@"+key.permission === values.permission);
        if(!privateKey.private_key) {
            reasons.push("所选权限暂无私钥");
        }

        if(reasons.length > 0)
            errors.permission = errorString + reasons.join(', ');
    }
    
    if (!values.payload || values.payload.length === 0) {
        errors.payload = '有效负载为必填项目';
    }
    else {
        let errorString = "";
        let reasons = [];

        if(!tryParseJSON(values.payload))
            reasons.push("有效负载必须是有效的 JSON 字符串");

        if(reasons.length > 0)
            errors.payload = errorString + reasons.join(', ');
    }
    
    return errors;
}

function tryParseJSON (jsonString) {
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};
