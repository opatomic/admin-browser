/**
 * @constructor
 * @param {Object} opts
 * @param {Array} data
 * @param {Element} el
 */
var uPlot = function(opts, data, el) {};

/**
 * @const
 */
var OPATESTCASES = [];

/**
 * @param {*} o1
 * @param {*} o2
 * @return {number}
 */
var opaCompare = function(o1, o2) {};

/* ------------------------------------------------------------------ */

/** @const {!Object} */
var ace;

/** @const {string} */
ace.version;

/**
 * @param {(string|!Element)} el
 * @return {!ace.Editor}
 */
ace.edit = function(el) {};

/**
 * @constructor
 * @see https://ace.c9.io/api/classes/Ace.EditSession.html
 */
ace.EditSession = function() {};

/**
 * @return {string}
 */
ace.EditSession.prototype.getValue = function() {};

/**
 * @param {string} event
 * @param {function((Object|number|null))} fxn
 */
ace.EditSession.prototype.on = function(event, fxn) {};

/**
 * @param {string} mode
 */
ace.EditSession.prototype.setMode = function(mode) {};

/**
 * @param {string} text
 */
ace.EditSession.prototype.setValue = function(text) {};

/**
 * @constructor
 * @see https://ace.c9.io/api/classes/Ace.Editor.html
 */
ace.Editor = function() {};

/**
 * @return {string}
 */
ace.Editor.prototype.getValue = function() {};

/**
 * @return {!ace.EditSession}
 */
ace.Editor.prototype.getSession = function() {};

/**
 * @param {Object} opts
 * @return {void}
 */
ace.Editor.prototype.setOptions = function(opts) {};
