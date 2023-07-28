eval(props.get("commonUtilsJsContent"));

var jsonData = JSON.parse(vars.get("jsonData"));
var dataObj = vars.getObject("dataObj");
var requestType = vars.get("requestType");
var requestBody = JSON.parse(props.get(requestType + "Body"));

vars.remove("signature");
log.info("set request body");
log.info("see current jsonData before handling: "+JSON.stringify(jsonData));
log.info("see current requestBody before handling: "+JSON.stringify(requestBody));
log.info("see current dataObj before handling: "+JSON.stringify(dataObj));
log.info("see signature before handling: "+vars.get("signature"));


if(requestType == "refundRequestV2"){
		var timeStr =new Date().getTime()+"";
	     var timeSuffix = timeStr.substr(timeStr.length-3);
	     log.info("see value  ----------refund time------------>"+timeStr);
		vars.put("refundrefnum", vars.get("nttrefid") + timeSuffix);
}

if(requestType == "refundRequest"){
		var timeStr =new Date().getTime()+"";
	     var timeSuffix = timeStr.substr(timeStr.length-3);
	     log.info("see value  ----------refund time------------>"+timeStr);
		vars.put("refundrefnum", vars.get("nttrefid") + timeSuffix);
}

if(requestType == "initiateRefundRequestV2"){
	vars.put("refundrefnum", vars.get("nttrefid") + "-R2");
}

if(requestType == "capturesV2ApiKey"){
		var timeStr =new Date().getTime()+"";
	     var timeSuffix = timeStr.substr(timeStr.length-3);

        var captureIdTmp= vars.get("nttrefid") || vars.get("resultTxnid") || "error"
		vars.put("captureId", captureIdTmp + timeSuffix);
		log.info("see value  ----------captureId------------>"+refundIdTmp + timeSuffix);
}

if(requestType == "refundsV2ApiKey"){
		var timeStr =new Date().getTime()+"";
	     var timeSuffix = timeStr.substr(timeStr.length-3);

        var refundIdTmp= vars.get("nttrefid") || vars.get("resultTxnid") || "error"
		vars.put("refundId", refundIdTmp + timeSuffix);
		log.info("see value  ----------refundId------------>"+refundIdTmp + timeSuffix);
}

// 2021.08.12 add v2capture handling
if(!requestType.contains("ApiKey")){
   commonUtils.setMerchantConfig(jsonData.merchantId);
}

if(requestType.contains("ApiKey")){
   commonUtils.setApiKeyConfig(jsonData.merchantId,requestType);
}

commonUtils.setGenralParameters();
commonUtils.setDataObjIntoVars(dataObj);                   //dataObj  --------   json requestBody     存放到vars中
commonUtils.removeUnusedKey(requestBody);			    //如果requestBody中的某个字段在vars中找不到，删除
commonUtils.setVarsKeyIntoRequestBody(requestBody);

log.info("see current requestBody after common handling: "+JSON.stringify(requestBody));
log.info("see signature after common handling: "+vars.get("signature"));


//if(requestType.contains("ApiKey")){
//  delete requestBody["apikey"];
//  delete requestBody["signatureKey"];
  
//  log.info("after delete apikey,apikey:"+vars.get("apikey"));
//}

if(requestBody.txnid=="generate"){
	var timeStr =new Date().getTime()+"";
	requestBody.txnid=timeStr;
	vars.put("generate_txnid",timeStr);
}else if(requestBody.txnid=="reuse"){
	requestBody.txnid=vars.get("generate_txnid");
}

if(requestBody.transactionId=="generate"){
	var timeStr =new Date().getTime()+"";
	requestBody.transactionId=timeStr;
	vars.put("generate_transactionId",timeStr);
}

if(requestBody.transactionId=="reuse"){
    log.info("see value  ----------generate_transactionId------------>"+vars.get("generate_transactionId"));
	requestBody.transactionId=vars.get("generate_transactionId") || vars.get("resultTxnid") || "error";
}


log.info("see value  ----------p_gatewayReferenceId2-----requestBody.gatewayReferenceId------->"+requestBody.gatewayReferenceId);
if(requestBody.gatewayReferenceId=="reuse"){
    log.info("see value  ----------p_gatewayReferenceId2------------>"+vars.get("p_gatewayReferenceId"));
	requestBody.gatewayReferenceId=vars.get("p_gatewayReferenceId") || vars.get("nttrefid") || "error";
}

if(requestBody.memberId=="generate"){
	var timeStr =new Date().getTime()+"";
	requestBody.memberId=timeStr;
	vars.put("generate_memberId",timeStr);
}else if(requestBody.memberId=="reuse"){
	requestBody.memberId=vars.get("generate_memberId");
}

log.info("refundrefnum:"+dataObj.refundrefnum);

if(dataObj.refundrefnum){
	log.info("refundrefnumlngth------------>"+dataObj.refundrefnum.length);
	if(dataObj.refundrefnum.length > 21 && dataObj.refundrefnum.length<26){
		var timeStrs =new Date().getTime()+""+"123";
		var refundObj = vars.get("nttrefid") + timeStrs;
		log.info("refundrefnumlngth1------------>"+refundObj);
		 requestBody["refundrefnum"] = refundObj.substr(refundObj.length-dataObj.refundrefnum.length);
		 log.info("refundrefnumlngth2------------>"+requestBody["refundrefnum"]);
	}
	
	//if(dataObj.refundrefnum.length > 25){
	//	var timeStrs =new Date().getTime()+""+"1234";
	//	var refundObj = vars.get("nttrefid") + timeStrs;
	//	log.info("refundrefnumlngth>25------------>"+refundObj);
	//	 requestBody["refundrefnum"] = refundObj;
	//	 log.info("refundrefnumlngth>25------------>"+requestBody["refundrefnum"]);
	//}
}

log.info("2021.06.11_requestType: "+requestType);
log.info("2021.06.requestBody: "+requestBody);

if(requestType.contains("ApiKey") && dataObj.apikey){
	vars.put("apikey", dataObj.apikey);
	delete requestBody["apikey"];
	log.info("2021081701:"+vars.get("apikey"));
}

if(dataObj.pass){
	requestBody["pass"] = dataObj.pass;
}

log.info("see signature before signatureData: "+vars.get("signature"));
var signatureData = commonUtils.generateSignatureData(requestType, requestBody);

log.info("see signature after signatureData: "+vars.get("signature"));

log.info("see value  ----------signatureKey------------>"+jsonData.merchantId);
log.info("see value  ----------signatureKey------------>"+props.get("nttSignatureKey"));

if(undefined!=jsonData["signatureKey"]){
	vars.remove("signatureKey");
	vars.put("signatureKey",jsonData["signatureKey"]);
}

vars.put("signatureData", signatureData);


vars.put("requestURL", props.get(requestType + "URL"));

log.info("requestURL:", props.get(requestType + "URL"));

log.info("sedataObj1------------>"+dataObj.pass);


log.info("see signature before dataObj.signature: "+vars.get("signature"));
log.info("the signature from requestBody : "+dataObj.signature);
if(dataObj.signature){
	log.info("2021/09/01 signature1");
	requestBody["signature"] = dataObj.signature;
}else{
	log.info("2021/09/01 signature2");
	requestBody["signature"] = null;
}

log.info("see signature before ApiKey check: "+vars.get("signature"));
log.info("see request signature before ApiKey check: "+dataObj.signature);

vars.put("signature", dataObj.signature);
log.info("see signature after ApiKey check: "+vars.get("signature"));

if(requestType == "createPaymentLinkV2ApiKey" && vars.get("token") && requestBody["tokens"]){
	log.info("see current tokens before tokens handling: "+JSON.stringify(requestBody["tokens"]));
	log.info("see current token before tokens handling: "+vars.get("token"));
	var tokensString= JSON.stringify(requestBody["tokens"]);
   if(tokensString.indexOf("reuse") != -1){
        tokensString=tokensString.replace("reuse",vars.get("token"));
        requestBody["tokens"]=JSON.parse(tokensString);
        log.info("see current tokens before tokens handling: "+tokensString);
  }
}

if(requestType == "createPaymentLink" && vars.get("token") && requestBody["tokens"]){
	log.info("see current tokens before tokens handling: "+JSON.stringify(requestBody["tokens"]));
	log.info("see current token before tokens handling: "+vars.get("token"));
	var tokensString= JSON.stringify(requestBody["tokens"]);
   if(tokensString.indexOf("reuse") != -1){
        tokensString=tokensString.replace("reuse",vars.get("token"));
        requestBody["tokens"]=JSON.parse(tokensString);
        log.info("see current tokens before tokens handling: "+tokensString);
  }
}

if(requestType == "paymentRequest" && dataObj.cardAuthentication.dsTxnId == "{{dsTxnId}}" && dataObj.cardAuthentication.verificationValue == "{{verificationValue}}" && dataObj.cardAuthentication.threeDSServerTransID== "{{threeDSServerTransID}}" && dataObj.cardAuthentication.acsTransID =="{{acsTransID}}"){
	
	dataObj.cardAuthentication.dsTxnId = vars.get("dsTxnId");
	dataObj.cardAuthentication.verificationValue = vars.get("verificationValue");
	dataObj.cardAuthentication.threeDSServerTransID = vars.get("threeDSServerTransID");
	dataObj.cardAuthentication.acsTransID = vars.get("acsTransID");
	log.info("Go to XQY 3DS 2.0");
  
}


if(requestType == "paymentRequest" && requestBody.carddata=="reuse"){	
	requestBody.carddata=vars.get("resultcarddata");
	log.info("see value  ----------carddata------------>"+vars.get("resultcarddata"));
}


if(requestBody["ru"] &&(dataObj.ru == "https://uat.ndhkpay.com/NTT_Pages/return" || dataObj.ru == "https://sit.ndhkpay.com/NTT_Pages/return")){
	var env = props.get("envirnoment");
	if(env == "SIT"){
		requestBody["ru"] = "https://sit.ndhkpay.com/NTT_Pages/return";
	}else {
		requestBody["ru"] = "https://uat.ndhkpay.com/NTT_Pages/return";
	}
}

if(requestBody["ru"] &&(dataObj.ru == "https://uat.ndhkpay.com/payment-page" || dataObj.ru == "https://sit.ndhkpay.com/payment-page")){
	var env = props.get("envirnoment");
	if(env == "SIT"){
		requestBody["ru"] = "https://sit.ndhkpay.com/payment-page";
	}else {
		requestBody["ru"] = "https://uat.ndhkpay.com/payment-page";
	}
}

if(requestBody["returnUrl"] &&(dataObj.returnUrl == "https://uat.ndhkpay.com/payment-page" || dataObj.returnUrl == "https://sit.ndhkpay.com/payment-page")){
	var env = props.get("envirnoment");
	if(env == "SIT"){
		requestBody["returnUrl"] = "https://sit.ndhkpay.com/payment-page";
	}else {
		requestBody["returnUrl"] = "https://uat.ndhkpay.com/payment-page";
	}
}

if(requestBody["cancelUrl"] &&(dataObj.cancelUrl == "https://uat.ndhkpay.com/payment-page" || dataObj.cancelUrl == "https://sit.ndhkpay.com/payment-page")){
	var env = props.get("envirnoment");
	if(env == "SIT"){
		requestBody["cancelUrl"] = "https://sit.ndhkpay.com/payment-page";
	}else {
		requestBody["cancelUrl"] = "https://uat.ndhkpay.com/payment-page";
	}
}

//现在时间+1天
var strTime = new Date();
	strTime=strTime.setDate(strTime.getDate()+1);
	strTime=new Date(strTime);
	//strTime=strTime.setHours(strTime.getHours()+3);
	//strTime=new Date(strTime);
var currentTime = strTime.getFullYear() + '-';
log.info("strTime.getMonth(): "+strTime.getMonth());

	if((strTime.getMonth()+1) < 10){
		currentTime+= "0"+(strTime.getMonth() + 1) + '-';
	}else{
    	currentTime += strTime.getMonth() + 1 + '-';
    }
	if((strTime.getDate()) < 10){
		currentTime+= "0"+(strTime.getDate()) + ' ';
	}else {
        currentTime += strTime.getDate() + ' ';
    }	
	if(strTime.getHours() < 10){
		currentTime+= "0"+strTime.getHours() + ':';
	}else{
    	currentTime += strTime.getHours() + ':';
    }
	if(strTime.getMinutes() < 10){
		currentTime+= "0"+strTime.getMinutes() + ':';
	}else{
   	    currentTime += strTime.getMinutes() + ':';
    }
    if(strTime.getSeconds() < 10){
		currentTime+= "0"+strTime.getSeconds();
	}else{
   	    currentTime += strTime.getSeconds();
    }

if(dataObj.expirydate == "CurrentTime"){
	requestBody["expirydate"] = currentTime;
}
if(dataObj.expiryDate == "CurrentTime"){
	requestBody["expiryDate"] = currentTime;
}

if(dataObj.urlExpiryDate == "CurrentTime"){
	requestBody["urlExpiryDate"] = currentTime;
}

//现在时间+3小时
var strTime = new Date();
	strTime=strTime.setHours(strTime.getHours()+3);
	strTime=new Date(strTime);
var specialCurrentTime = strTime.getFullYear() + '-';
log.info("strTime.getMonth(): "+strTime.getMonth());

	if((strTime.getMonth()+1) < 10){
		specialCurrentTime+= "0"+(strTime.getMonth() + 1) + '-';
	}else{
    	specialCurrentTime += strTime.getMonth() + 1 + '-';
    }
	if((strTime.getDate()) < 10){
		specialCurrentTime+= "0"+(strTime.getDate()) + ' ';
	}else {
        specialCurrentTime += strTime.getDate() + ' ';
    }	
	if(strTime.getHours() < 10){
		specialCurrentTime+= "0"+strTime.getHours() + ':';
	}else{
    	specialCurrentTime += strTime.getHours() + ':';
    }
	if(strTime.getMinutes() < 10){
		specialCurrentTime+= "0"+strTime.getMinutes() + ':';
	}else{
   	    specialCurrentTime += strTime.getMinutes() + ':';
    }
    if(strTime.getSeconds() < 10){
		specialCurrentTime+= "0"+strTime.getSeconds();
	}else{
   	    specialCurrentTime += strTime.getSeconds();
    }

if(dataObj.expirydate == "specialCurrentTime"){
	requestBody["expirydate"] = specialCurrentTime;
}
if(dataObj.expiryDate == "specialCurrentTime"){
	requestBody["expiryDate"] = specialCurrentTime;
}

//现在时间+2分钟
var strTime = new Date();
	strTime=strTime.setMinutes(strTime.getMinutes()+2);
	strTime=new Date(strTime);
var expiryTime = strTime.getFullYear() + '-';
log.info("strTime.getMonth(): "+strTime.getMonth());

	if((strTime.getMonth()+1) < 10){
		expiryTime+= "0"+(strTime.getMonth() + 1) + '-';
	}else{
    	expiryTime += strTime.getMonth() + 1 + '-';
    }
	if((strTime.getDate()) < 10){
		expiryTime+= "0"+(strTime.getDate()) + ' ';
	}else {
        expiryTime += strTime.getDate() + ' ';
    }	
	if(strTime.getHours() < 10){
		expiryTime+= "0"+strTime.getHours() + ':';
	}else{
    	expiryTime += strTime.getHours() + ':';
    }
	if(strTime.getMinutes() < 10){
		expiryTime+= "0"+strTime.getMinutes() + ':';
	}else{
   	    expiryTime += strTime.getMinutes() + ':';
    }
    if(strTime.getSeconds() < 10){
		expiryTime+= "0"+strTime.getSeconds();
	}else{
   	    expiryTime += strTime.getSeconds();
    }

if(dataObj.expirydate == "expiryTime"){
	requestBody["expirydate"] = expiryTime;
}
if(dataObj.expiryDate == "expiryTime"){
	requestBody["expiryDate"] = expiryTime;
}
if(dataObj.urlExpiryDate == "expiryTime"){
	requestBody["urlExpiryDate"] = expiryTime;
}


var datetime = new Date(vars.get("datetime"));
log.info("see value-------datetime1------->"+datetime);
	datetime = datetime.setMinutes(datetime.getMinutes()-3);
	datetime = new Date(datetime);
	
	var datetime1 = datetime.getFullYear() + '-';

	if((datetime.getMonth()+1) < 10){
		datetime1+= "0"+(datetime.getMonth() + 1) + '-';
	}else{
    	datetime1 += datetime.getMonth() + 1 + '-';
    }
	if((datetime.getDate()) < 10){
		datetime1+= "0"+(datetime.getDate()) + ' ';
	}else {
        datetime1 += datetime.getDate() + ' ';
    }	
	if(datetime.getHours() < 10){
		datetime1+= "0"+datetime.getHours() + ':';
	}else{
    	datetime1 += datetime.getHours() + ':';
    }
	if(datetime.getMinutes() < 10){
		datetime1+= "0"+datetime.getMinutes() + ':';
	}else{
   	    datetime1 += datetime.getMinutes() + ':';
    }
    if(datetime.getSeconds() < 10){
		datetime1+= "0"+datetime.getSeconds();
	}else{
   	    datetime1 += datetime.getSeconds();
    }

	log.info("see value-------datetime2------->"+datetime1);
	
if(dataObj.startDateTime == "reuse"){	
	requestBody["startDateTime"] = datetime1;
	log.info("see value-------datetime------->"+datetime1);
}		

var token = vars.get("access_token");
if(typeof(token) == "undefined" || token == '' || token == null){
	var dataObjToken = dataObj.accessToken;
	if(typeof(dataObjToken) == "undefined" || dataObjToken == '' || dataObjToken == null){
		vars.putObject("access_token", "");
	}else{
		vars.put("access_token", dataObjToken);
	}
}else{
	if(token.contains("Bearer")){
		vars.put("access_token", token);
	}else{
		vars.put("access_token", "Bearer"+" "+token);
	}
}


var headerToken = requestBody.headerToken;
var headerSignature = requestBody.headerSignature;
var bodySignature = requestBody.bodySignature;
var bodyCarddata = requestBody.bodyCarddata;
log.info("see value  ----------headerToken------------>"+headerToken);
log.info("see value  ----------headerSignature------------>"+headerSignature);
log.info("see value  ----------bodySignature------------>"+bodySignature);
log.info("see value  ----------bodyCarddata------------>"+bodyCarddata);
vars.put("headerToken",headerToken);
vars.put("headerSignature",headerSignature);
vars.put("bodySignature",bodySignature);
vars.put("bodyCarddata",bodyCarddata);
if(false == bodySignature){
	delete requestBody["signature"];
}
if(false == bodyCarddata){
    delete requestBody["carddata"];
    delete requestBody["cardData"];
}
delete requestBody["headerToken"];
delete requestBody["headerSignature"];
delete requestBody["bodySignature"];
delete requestBody["bodyCarddata"];
delete requestBody["apikey"];

log.info("after delete headerSignature,headerSignature:"+vars.get("headerSignature"));

if(true == headerSignature){
	if(requestType == "portalCreatePaymentLinkV2ApiKey"){
		vars.put("headerSignatureData", "/api/v2/portalPaymentLinks");
	    log.info("see value  ----------headerSignatureData------------>"+vars.get("headerSignatureData"));
    }else if(requestType == "portalTransactionsV2ApiKey"){
		vars.put("headerSignatureData", "/api/v2/portalTransactions");
	    log.info("see value  ----------headerSignatureData------------>"+vars.get("headerSignatureData"));
    }else{
    	vars.put("headerSignatureData", JSON.stringify(requestBody));
	    log.info("see value  ----------headerSignatureData------------>"+vars.get("headerSignatureData"));
    }
}
vars.put("requestLogin",requestBody.login);
vars.putObject("requestBody", requestBody);
log.info("see value  ----------requestBody------------>"+vars.get("requestBody"));

log.info(requestBody);
log.info("see signature in the last: "+vars.get("signature"));

if(requestType == "paymentRequest" || requestType == "createPaymentLink" || requestType == "portalCreatePaymentLink"){
	log.info("see value  ----------setRequestBody------------>"+jsonData.merchantId);
	log.info("see value  ----------setRequestBody------------>"+requestBody["channelType"]);
	vars.put("merchantId",jsonData.merchantId);
	vars.put("channelType",requestBody["channelType"]);
}
