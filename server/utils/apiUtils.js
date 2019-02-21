'use strict'
var shortid = require('shortid');

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

exports.generateShortId = function(idPrefix) {
  var prefix = idPrefix ? idPrefix.toLowerCase() + '_' : '';
  var id = prefix + shortid.generate();
  return id;
};


/**
 * Build Error with 404 error code
 * @param {string} errorMsg
 * @param {string} errorStack
 * @return {Error}
 */
exports.build404Error = function(errorMsg, errorStack) {
  if (!errorStack) errorStack = null;
  return apiUtils.buildErrorMsg(apiConstants.ERROR_CODE_NO_MODEL_FOUND, errorMsg, errorStack);
}

/**
 * Build Error with 400 error code
 * @param {string} errorMsg
 * @param {string} errorStack
 * @return {Error}
 */
exports.build400Error = function(errorMsg, errorStack) {
  if (!errorStack) errorStack = null;
  var errorInstance = apiUtils.buildErrorMsg(apiConstants.ERROR_CODE_INVALID_INPUT_PARAMETERS, errorMsg, errorStack);
  errorInstance.name = apiConstants.ERROR_NAME_INVALID_INPUT_PARAMETERS;
  return errorInstance;
}

/**
 * Build Error with 500 error code
 * @param {string} errorMsg
 * @param {string} errorStack
 * @return {Error}
 */
exports.build500Error = function(errorMsg, errorStack) {
  if (!errorStack) errorStack = null;
  return apiUtils.buildErrorMsg(apiConstants.ERROR_CODE_INTERNAL_SERVER_ERROR, errorMsg, errorStack);
}
