
var commonUtils = {
	setMerchantConfig: function (merchantId) {
		vars.put("login", props.get(merchantId + "Login"));
		vars.put("pass", props.get(merchantId + "Pass"));
		vars.put("signatureKey", props.get(merchantId + "SignatureKey"));
	},
	setApiKeyConfig: function (merchantId, requestType) {
		vars.put("apikey", props.get(merchantId + "ApiKey"));
		log.info("see value  ------merchantId--->" + merchantId);
		log.info("see value  ------apikey--->" + vars.get("apikey"));

		if ("jsonV2TokenApiKey" == requestType || "getV2TokenApiKey" == requestType || "deleteV2TokenApiKey" == requestType || "putV2TokenApiKey" == requestType || "tokenLinksV2ApiKey" == requestType) {
			vars.put("signatureKey", props.get(merchantId + "V2TokensSignatureKey"));
		}
		else if ("capturesV2ApiKey" == requestType) {
			vars.put("signatureKey", props.get(merchantId + "V2CapturesSignatureKey"));
		}
		else if ("refundsV2ApiKey" == requestType) {
			vars.put("signatureKey", props.get(merchantId + "V2RefundsSignatureKey"));
		}
		else if ("jsonTransactionsV2ApiKey" == requestType || "formTransactionsV2ApiKey" == requestType || "createPaymentLinkV2ApiKey" == requestType || "iframeV2ApiKey" == requestType) {
			vars.put("signatureKey", props.get(merchantId + "V2TransactionsSignatureKey"));
		}
		else if ("getTransactionsV2ApiKey" == requestType || "cardVerificationV2ApiKey" == requestType || "3dsV2ApiKey" == requestType || "postAccountV2UpdatesApiKey" == requestType || "putAccountV2UpdatesApiKey" == requestType || "deleteAccountV2UpdatesApiKey" == requestType || "reportsV2ApiKey" == requestType) {
			vars.put("signatureKey", props.get(merchantId + "V2GeneralSignatureKey"));
		}
		else if ("portalCreatePaymentLinkV2ApiKey" == requestType || "portalTransactionsV2ApiKey" == requestType || "portalCapturesV2ApiKey" == requestType || "portalRefundsV2ApiKey" == requestType) {
			vars.put("signatureKey", props.get(merchantId + "V2MerchantPortalSignatureKey"));
		}

		log.info("see value  ------requestType--->" + requestType);
		log.info("see value  ------signatureKey--->" + vars.get("signatureKey"));

	},

	setSpecialApiKeyConfig: function (requestBody, requestType) {
		log.info("see value  ------specialApiKey IN--->" + requestBody);
		if (requestBody.apikey == "OSagNKtjjkpREf4rAK54" && "jsonV2TokenApiKey" == requestType) {
			log.info("see value  ------specialApiKey IF IN--->" + requestBody.apikey);
			vars.put("signatureKey", "6WVwtqJEKOV7Bj3AM3WU5IIQO0ATSXP6");
		}
		if (requestBody.apikey == "0sXWvkMWujs8jYPxG1d1" && "processorTokensApiKey" == requestType) {
			log.info("see value  ------specialApiKey IF IN--->" + requestBody.apikey);
			vars.put("signatureKey", "MpQslkgSd1Kr6zZ1hIPArzym2eHHbMY4");
		}
		if (requestBody.apikey == "0sXWvkMWujs8jYPxG1d1" && "deleteisgTokensApiKey" == requestType) {
			log.info("see value  ------specialApiKey IF IN--->" + requestBody.apikey);
			vars.put("signatureKey", "MpQslkgSd1Kr6zZ1hIPArzym2eHHbMY4");
		}
		if ("NewV23dsKey" == requestType || "NewsV23dsKey" == requestType) {
			log.info("see value  ------XQY NewV23dsKey--->");
			vars.put("apikey", "0sXWvkMWujs8jYPxG1d1");
			vars.put("signatureKey", "40W1jPmFt3PEiehcUbe2bV2Xl2yFb1hh");
		}

		log.info("see value  ------specialApiKey OUT--->" + vars.get("signatureKey"));

	},


	setDataObjIntoVars: function (dataObj) {
		for (var key in dataObj) {
			vars.putObject(key, dataObj[key]);
		}
	},
	removeUnusedKey: function (requestBody) {
		for (var key in requestBody) {
			if (!vars.get(key) && "signature" != key && "paymentMethod" != key && "nickname" != key && "cvv" != key) {
				delete requestBody[key];
			}
		}
	},
	setVarsKeyIntoRequestBody: function (requestBody) {
		for (var key in requestBody) {
			requestBody[key] = vars.getObject(key);
		}
	},
	generateSignatureData: function (requestType, requestBody) {
		log.info("see value  ------commonUtils--requestType-->" + requestType);
		log.info("see value  ------commonUtils--requestBody-->" + requestBody);
		if (requestType == "paymentRequest" || requestType == "formpaymentRequest") {
			return requestBody.login + requestBody.pass + requestBody.txnid + requestBody.amt + requestBody.txncurr;
		} else if (requestType == "refundRequestV2" || requestType == "initiateRefundRequestV2" || requestType == "refundRequest") {
			var signatureBody = requestBody.login + requestBody.pass;
			if (requestBody.nttrefid) {
				signatureBody = signatureBody + requestBody.nttrefid;
			}
			else if (requestBody.txnid) {
				signatureBody = signatureBody + requestBody.txnid;
			}
			if (requestBody.refundrefnum) {
				signatureBody = signatureBody + requestBody.refundrefnum;
			}
			if (requestBody.amt) {
				signatureBody = signatureBody + requestBody.amt;
			}
			log.info("see value  ------REFUND--signatureBody-->" + signatureBody);
			return signatureBody;
		} else if (requestType == "captureRequest" || requestType == "captureRequestV2") {
			if (requestBody.txnid && requestBody.nttrefid) {
				return requestBody.login + requestBody.pass + requestBody.nttrefid;
			} else if (requestBody.txnid) {
				return requestBody.login + requestBody.pass + requestBody.txnid;
			} else if (requestBody.nttrefid) {
				return requestBody.login + requestBody.pass + requestBody.nttrefid;
			} else {
				return null;
			}
		} else if (requestType == "requeryRequestV3" || requestType == "requeryRequestV2" || requestType == "requeryRequest") {
			if (requestBody.txnid && requestBody.nttrefid) {
				return requestBody.login + requestBody.pass + requestBody.nttrefid + requestBody.txnid;
			} else if (requestBody.txnid) {
				return requestBody.login + requestBody.pass + requestBody.txnid;
			} else if (requestBody.nttrefid) {
				return requestBody.login + requestBody.pass + requestBody.nttrefid;
			} else {
				return requestBody.login + requestBody.pass;
			}
		} else if (requestType == "cardVerification") {
			if (requestBody.carddata) {
				return requestBody.login + requestBody.pass + requestBody.carddata + requestBody.txncurr;
			} else {
				log.info("carddataey----------1-->");
				return requestBody.login + requestBody.pass + requestBody.txncurr;
			}
		} else if (requestType == "cardVerificationV2") {
			if (requestBody.carddata) {
				return requestBody.login + requestBody.pass + requestBody.carddata + requestBody.transactionCurrency;
			} else {
				log.info("carddataey----------1-->");
				return requestBody.login + requestBody.pass + requestBody.transactionCurrency;
			}
		}
		else if (requestType == "createPaymentLink") {
			return requestBody.login + requestBody.pass + requestBody.txnid + requestBody.amt + requestBody.txncurr;
		} else if (requestType == "portalCreatePaymentLink") {
			return requestBody.login + requestBody.txnid + requestBody.amt + requestBody.txncurr;
		} else if (requestType == "portalPaymentRequest") {
			return requestBody.login + requestBody.pass + requestBody.txnid + requestBody.amt + requestBody.txncurr;
		} else if (requestType == "tokenizeRequest") {
			return requestBody.login + requestBody.pass + requestBody.card;
		} else if (requestType == "postToken") {
			if (requestBody.carddata != null) {
				return requestBody.login + requestBody.pass + requestBody.carddata;
			} else {
				return requestBody.login + requestBody.pass;
			}

		} else if (requestType == "vcnnewCharge") {
			return requestBody.login + requestBody.pass + requestBody.amt + requestBody.txncurr;
		} else if (requestType == "vcnupdateCharge") {
			var sv1;
			sv1 = vars.get("sv");
			log.info("Go to XQY vcnupdateCharge signature" + vars.get("sv"));
			return requestBody.login + requestBody.pass + sv1;
		} else if (requestType == "vcnqueryCharge") {
			var sv1;
			sv1 = vars.get("sv");
			log.info("Go to XQY queryChargeCharge signature" + vars.get("sv"));
			return requestBody.login + requestBody.pass + sv1;
		} else if (requestType == "vcncancelCharge") {
			var sv1;
			sv1 = vars.get("sv");
			log.info("Go to XQY vcncancelCharge signature" + vars.get("sv"));
			return requestBody.login + requestBody.pass + sv1;
		} else if (requestType == "vcncheckCharge") {
			var sv1;
			sv1 = vars.get("sv");
			log.info("Go to XQY vcncheckCharge signature" + vars.get("sv"));
			return requestBody.login + requestBody.pass + sv1;
		} else if (requestType == "portalRefundRequest") {
			return requestBody.login + requestBody.pass + requestBody.nttrefid + requestBody.refundrefnum + requestBody.amt;
		} else if (requestType == "portalCaptureRequest") {
			if (requestBody.txnid && requestBody.nttrefid) {
				return requestBody.login + requestBody.nttrefid + requestBody.txnid;
			} else if (requestBody.txnid) {
				return requestBody.login + requestBody.txnid;
			} else if (requestBody.nttrefid) {
				return requestBody.login + requestBody.nttrefid;
			} else {
				return null;
			}
		}
		else if (requestType == "reporting") {
			return requestBody.login + requestBody.pass + requestBody.reportType + requestBody.startDateTime + requestBody.endDateTime + requestBody.transactionCurrencies + requestBody.transactionType + requestBody.channelType + requestBody.paymentMethod + requestBody.callbackUrl + requestBody.fields;
		} else if (requestType == "jsonTransactionsV2ApiKey" && requestBody.cardAuthentication != null) {
			requestBody.cardAuthentication.specificationVersion = vars.get("specificationVersion22");
			requestBody.cardAuthentication.commerceIndicator = vars.get("commerceIndicator22");			
			requestBody.cardAuthentication.dsTxnId = vars.get("dsTxnId22");
			requestBody.cardAuthentication.PAResStatus = vars.get("PAResStatus22");		
			requestBody.cardAuthentication.eciRaw = vars.get("eciRaw22");
			requestBody.cardAuthentication.acsTransID = vars.get("acsTransID22");
			if (requestBody.cardAuthentication.avv != null) {
				requestBody.cardAuthentication.avv = vars.get("avv22");
			}
			if (requestBody.cardAuthentication.ucafCollectionIndicator != null) {
				requestBody.cardAuthentication.ucafCollectionIndicator = vars.get("ucafCollectionIndicator22");
			}
			if (requestBody.cardAuthentication.cavv != null) {
				requestBody.cardAuthentication.cavv = vars.get("cavv22");
			}
			if (requestBody.cardAuthentication.xid != null) {
				requestBody.cardAuthentication.xid = vars.get("xid22");
			}
			return requestBody;
		} else if (requestType == "jsonTransactionsV2ApiKey" && requestBody.token == null) {
			return requestBody;
		} else if (requestType == "iframeV2ApiKey") {
			return requestBody;
		} else if (requestType == "NewsV13ds") {
			requestBody.threeDSReferenceId = vars.get("threeDSReferenceId1");
			return requestBody;
		} else if (requestType == "NewtV13ds") {
			requestBody.threeDSReferenceId = vars.get("threeDSReferenceId1");
			return requestBody;
		} else if (requestType == "NewsV23dsKey" && requestBody.threeDSReferenceId == "threeDSReferenceId2") {
			requestBody.threeDSReferenceId = vars.get("threeDSReferenceId2");
			return requestBody;
		}
		else if (requestType == "jsonV2TokenApiKey" || requestType == "capturesV2ApiKey" || requestType == "refundsV2ApiKey" || (requestType == "jsonTransactionsV2ApiKey" && (requestBody.token.indexOf("CardTokenReferenceNo") == -1)) || requestType == "cardVerificationV2ApiKey" || requestType == "formTransactionsV2ApiKey" || requestType == "tokenLinksV2ApiKey") {
			return requestBody;
		} else if (requestType == "deleteisgTokensApiKey" && requestBody.token == null) {
			log.info("Go to XQY deleteisgTokensApiKey1 error");
			return requestBody;
		} else if (requestType == "deleteisgTokensApiKey" && (requestBody.token.indexOf("CardTokenReferenceNo") > -1)) {
			requestBody.token = vars.get("CardTokenReferenceNo");
			return requestBody;
		}
		else if (requestType == "deleteisgTokensApiKey" && (requestBody.token.indexOf("CardTokenReferenceNo") == -1)) {
			log.info("Go to XQY deleteisgTokensApiKey error");
			return requestBody;
		} else if (requestType == "jsonTransactionsV2ApiKey" && (requestBody.token.indexOf("CardTokenReferenceNo") > -1)) {
			requestBody.token = vars.get("CardTokenReferenceNo");
			return requestBody;
		} else if (requestType == "jsonTransactionsV2ApiKey" && (requestBody.token.indexOf("hptoken") > -1)) {
			requestBody.token = vars.get("hptoken");
			return requestBody;
		}else if (requestType == "putV2TokenApiKey" && requestBody.token == null) {
			log.info("Go to XQY putV2TokenApiKey error");
			return requestBody;
		} else if (requestType == "putV2TokenApiKey" && (requestBody.token.indexOf("CardTokenReferenceNo") == -1)) {
			log.info("Go to XQY putV2TokenApiKey error");
			return requestBody;
		} else if (requestType == "putV2TokenApiKey" && (requestBody.token.indexOf("CardTokenReferenceNo") > -1)) {
			requestBody.token = vars.get("CardTokenReferenceNo");
			return requestBody;
		} else if (requestType == "customDeclare" || requestType == "customRequery") {
			var nttrefid = "";
			var subOrderId = "";
			var orderAmount = "";
			if (requestBody.nttrefid) {
				nttrefid = requestBody.nttrefid;
			}
			if (requestBody.subOrderId) {
				subOrderId = requestBody.subOrderId;
			}
			if (requestBody.orderAmount) {
				orderAmount = requestBody.orderAmount;
			}
			log.info("see value  ------commonUtils--nttrefid-->" + nttrefid);
			log.info("see value  ------commonUtils--subOrderId-->" + subOrderId);
			log.info("see value  ------commonUtils--orderAmount-->" + orderAmount);
			log.info("see value  ------commonUtils--generateSignatureData-->" + requestBody.login + requestBody.pass + nttrefid + subOrderId + orderAmount);
			return requestBody.login + requestBody.pass + nttrefid + subOrderId + orderAmount;
		} else if (requestType == "getToken" || requestType == "putToken" || requestType == "deleteToken") {
			return requestBody.login + requestBody.pass;
		} else if (requestType == "getTransactionsV2ApiKey") {
			if (requestBody.nttrefid) {
				nttrefid = requestBody.nttrefid;
			}
			if (requestBody.subOrderId) {
				subOrderId = requestBody.subOrderId;
			}
			return requestBody.login + requestBody.pass;
		} else {
			return null;
		}
	},
	generateFormPostSignatureData: function (requestType, requestBody) {
		log.info("see value  ------commonUtils--requestType-->" + requestType);
		log.info("see value  ------commonUtils--requestBody-->" + requestBody);
		log.info("see value  ------commonUtils--dataObj-->" + dataObj);
		if (requestType == "formpaymentRequest") {
			log.info("see value  ------commonUtils--login-->" + dataObj.login);
			return dataObj.login + dataObj.pass + txnid + dataObj.amt + dataObj.txncurr;
		}
	},
	setGenralParameters: function () {
		var generalParameter = props.get("generalParameter");
		if (generalParameter) {
			var generalParameterArray = generalParameter.split(",");
			for (i = 0; i < generalParameterArray.length; i++) {
				var key = generalParameterArray[i];
				vars.put(key, props.get(key));
			}
		}
	},
	getCurrenctSecond: function (timestamp) {
		var datetime = new Date(timestamp);
		var second = datetime.getSeconds();
		var millSecond = datetime.getMilliseconds();
		return second + millSecond;
	}
}