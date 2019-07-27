'use strict'
var shortid = require('shortid');
var errorConstants = require('../constants/errorConstants.js');
var moment = require('moment');

exports.disableRelatedModelRemoteMethod = function (model) {
	var keys = Object.keys(model.definition.settings.relations);
	keys.forEach(relation => {
		model.disableRemoteMethodByName("prototype.__findById__" + relation);
		model.disableRemoteMethodByName("prototype.__destroyById__" + relation);
		model.disableRemoteMethodByName("prototype.__updateById__" + relation);
		model.disableRemoteMethodByName("prototype.__link__" + relation);
		model.disableRemoteMethodByName("prototype.__unlink__" + relation);
		model.disableRemoteMethodByName("prototype.__get__" + relation);
		model.disableRemoteMethodByName("prototype.__create__" + relation);
		model.disableRemoteMethodByName("prototype.__delete__" + relation);
		model.disableRemoteMethodByName("prototype.__update__" + relation);
		model.disableRemoteMethodByName("prototype.__findOne__" + relation);
		model.disableRemoteMethodByName("prototype.__count__" + relation);
		model.disableRemoteMethodByName("prototype.__exists__" + relation);
	})
}

exports.generateShortId = function (idPrefix) {
	var id = "";
	if (idPrefix.toLowerCase() == 'transaction') {
		for (var i = 0; i < 6; i++) //6位随机数，用以加在时间戳后面。
		{
			id += Math.floor(Math.random() * 10);
		}
		id = moment().unix() + id;
	} else {
		var prefix = idPrefix ? idPrefix.toLowerCase() + '_' : '';
		id = prefix + shortid.generate();
	}
	return id;
};

exports.parseToObject = function (data) {
	if (data == null) return data;
	if (data.__data != null)
		data = data.__data;
	for (let key in data) {
		if (data[key] == null)
			delete data[key];
		if (typeof data[key] === "string" || typeof data[key] === "number")
			continue;
		if (data[key] instanceof Array)
			for (let i = 0; i < data[key].length; i++)
				data[key][i] = this.parseToObject(data[key][i]);
		if (typeof (data[key]) == "object" && !(data[key] instanceof Array)) {
			data[key] = this.parseToObject(data[key]);
		}
	}
	return data;
}

/**
 * Build Error Message
 * @param {string} statusCode
 * @param {string} errorMsg
 * @param {string} errorStack
 * @return {Error}
 */
exports.buildErrorMsg = function (statusCode, errorMsg, errorStack) {
	var error = new Error();
	error.status = statusCode;
	error.message = errorMsg;
	error.stack = errorStack;
	return error;
};

/**
 * Build Error with 404 error code
 * @param {string} errorMsg
 * @param {string} errorStack
 * @return {Error}
 */
exports.build404Error = function (errorMsg, errorStack) {
	if (!errorStack) errorStack = null;
	return this.buildErrorMsg(errorConstants.ERROR_CODE_NO_MODEL_FOUND, errorMsg, errorStack);
}

/**
 * Build Error with 400 error code
 * @param {string} errorMsg
 * @param {string} errorStack
 * @return {Error}
 */
exports.build400Error = function (errorMsg, errorStack) {
	if (!errorStack) errorStack = null;
	var errorInstance = this.buildErrorMsg(errorConstants.ERROR_CODE_INVALID_INPUT_PARAMETERS, errorMsg, errorStack);
	errorInstance.name = errorConstants.ERROR_NAME_INVALID_INPUT_PARAMETERS;
	return errorInstance;
}

/**
 * Build Error with 500 error code
 * @param {string} errorMsg
 * @param {string} errorStack
 * @return {Error}
 */
exports.build500Error = function (errorMsg, errorStack) {
	if (!errorStack) errorStack = null;
	return this.buildErrorMsg(errorConstants.ERROR_CODE_INTERNAL_SERVER_ERROR, errorMsg, errorStack);
}
