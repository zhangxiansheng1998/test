var jsonBody = JSON.parse(prev.getResponseDataAsString());
var st1;
var st2;
var st3;
var st4;
var st5;
var st6;
var st7;
var threeDSServerTransID;


if (vars.get("requestType").equals("jsonTransactionsV2ApiKey") && jsonBody.datetime) {
	vars.put("datetime", jsonBody.datetime)
	log.info("see value-------jsonBody.datetime------->" + jsonBody.datetime);
}

if (jsonBody.nttrefid) {
	vars.put("nttrefid", jsonBody.nttrefid)
}
if (jsonBody.txnid) {
	vars.put("resultTxnid", jsonBody.txnid)
}

if (jsonBody.transactionId) {
	vars.put("transactionId", jsonBody.transactionId)
}

if (jsonBody.gatewayReferenceId) {
	vars.put("p_gatewayReferenceId", jsonBody.gatewayReferenceId);
	log.info("see value  ----------p_gatewayReferenceId------------>" + jsonBody.gatewayReferenceId);
}
if (jsonBody.gatewayReferenceId) {
	vars.put("nttrefid", jsonBody.gatewayReferenceId)
	vars.put("gatewayReferenceId", jsonBody.gatewayReferenceId);
	log.info("see value  ----------gatewayReferenceId------------>" + jsonBody.gatewayReferenceId);
}

if (jsonBody.captureReferenceId) {
	vars.put("captureReferenceId", jsonBody.captureReferenceId)
	log.info("see value  ----------captureReferenceId------------>" + jsonBody.gatewayReferenceId);
}
if (jsonBody.refundId) {
	vars.put("refundId", jsonBody.refundId)
	log.info("see value  ----------refundId------------>" + jsonBody.refundId);
}

if (jsonBody.reportId) {
    vars.put("reportId", jsonBody.reportId)
}


if (vars.get("requestType").equals("paymentRequest") && jsonBody.ru && jsonBody.channelType == "doku2" && jsonBody.respcode != "00") {
	if (jsonBody.ru.indexOf("https://") >= 0) {
		vars.put("redirect_url", jsonBody.ru);
	}
}

if (vars.get("requestType").equals("paymentRequest") && jsonBody.ru && jsonBody.channelType == "omise" && jsonBody.respcode != "00") {
	if (jsonBody.ru.indexOf("https://") >= 0) {
		vars.put("redirect_url", jsonBody.ru)
	}
}

if (vars.get("requestType").indexOf("3dsV1") > -1) {
	st1 = prev.getResponseDataAsString()
	st2 = st1.split(',');
    st3 = st2[0].split('{');
	st4 = st3[2].split(':');
	st5 = st4[2].split('=');
	st6 = st5[1].split('"');
	st7 = "https://simulator.ps.paysec-3dssvgw.com/api/v2/auth/brw/threeDsMethod?threeDSServerTransID=" + st6[0];
	vars.put("redirect_url", st7);
	vars.put("threeDSServerTransID", st6[0]);
}

if (jsonBody.redirect_url) {
	vars.put("redirect_url", jsonBody.redirect_url)
} else {
	log.info("see value-------jsonBody.redirect_url------->" + jsonBody.redirect_url);
}

if (jsonBody.redirectUrl) {
	vars.put("redirect_url", jsonBody.redirectUrl)
}

if (vars.get("requestType").equals("paymentRequest") && jsonBody.ru && jsonBody.channelType == "doku2" && jsonBody.paymentMethod == "shopee" && jsonBody.txnid == 'SpecialTxnidForRU') {
	if (jsonBody.ru.indexOf("https://") >= 0) {
		vars.put("redirect_url", jsonBody.ru)
	}
}

if (vars.get("requestType").equals("tokenizeRequest") && jsonBody.result) {
	vars.put("token", jsonBody.result)
}

if (vars.get("requestType").equals("formTokenizeRequest") && jsonBody.result) {
	vars.put("token", jsonBody.result)
}


if (vars.get("requestType").equals("jsonV2TokenApiKey") && jsonBody.token) {
	vars.put("token", jsonBody.token)
}

if (vars.get("requestType").equals("jsonTransactionsV2ApiKey") && jsonBody.tokenization.token) {
	vars.put("token", jsonBody.tokenization.token)
	log.info("see value-------jsonBody.token------->" + jsonBody.tokenization.token);
}

if (vars.get("requestType").equals("paymentRequest") && jsonBody.tokenization.token) {
	vars.put("token", jsonBody.tokenization.token)
	log.info("see value-------jsonBody.token------->" + jsonBody.tokenization.token);
}

if (vars.get("requestType").equals("createPaymentLink") && jsonBody.result) {
	if (jsonBody.result.indexOf("https://") >= 0) {
		vars.put("redirect_url", jsonBody.result)
	}
}



if (vars.get("requestType").equals("portalCreatePaymentLink") && jsonBody.result) {
	if (jsonBody.result.indexOf("https://") >= 0) {
		vars.put("redirect_url", jsonBody.result)
	}
}

if (vars.get("requestType").equals("cardVerificationV2") && jsonBody.tokenization.token) {
    vars.put("token", jsonBody.tokenization.token)
}
if (jsonBody.channelType == "gmo" && jsonBody.paymentMethod == "cvs" && jsonBody.responseCode == "02") {
	if (jsonBody.returnUrl.indexOf("https://") >= 0) {
		vars.put("redirect_url", jsonBody.returnUrl)
	}
}

if (vars.get("requestType").equals("cardVerificationV2") && jsonBody.tokenization.token) {
    vars.put("token", jsonBody.tokenization.token)
}

if (vars.get("requestType").equals("reportsV2ApiKey") && jsonBody.reportId) {
    vars.put("reportId", jsonBody.reportId)
}

if (vars.get("requestType").equals("encrypt") && jsonBody.result) {
    vars.put("resultcarddata", jsonBody.result)
	log.info("see value  ----------generate carddata------------>" + vars.get("resultcarddata"));
}

var requestType = vars.get("requestType");
if (requestType == "refundRequestV2" || requestType == "captureRequestV2" || requestType == "requeryRequestV3" || requestType == "refundRequest" || requestType == "captureRequest" || requestType == "requeryRequestV2" || requestType == "requeryRequest" || requestType == "getToken" || requestType == "putToken" || requestType == "deleteToken") {
	log.info("see value  ----------reponseSignature1------------>" + vars.get("signatureData") + "***" + jsonBody.respcode);
	log.info("see value  ----------reponseSignature2------------>" + jsonBody.signature);
	if (jsonBody.signature) {
		vars.put("reponseSignature", vars.get("signatureData") + jsonBody.respcode);
	}

}