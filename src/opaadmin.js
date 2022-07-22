"use strict";

var WSCONN;
var RECONNECT = {};
/**
 * @type {?Opatomic.Client}
 */
var OPAC;
var SUBS = {};
/**
 * @const {number}
 */
var ERRCODE_AUTH = -53;

/**
 * @type {number}
 */
var GTIMERLEN = 200;
var GCHARTS = {};
var GBWINLAST;
var GBWOUTLAST;
var GSTATSTIME;
var GTIMEOUT;

var ACELOADED = false;
var UPLOTLOADED = false;
var LUAEDITOR;




/**
 * @param {number} size
 * @return {string}
 */
function prettySize(size) {
	if (size >= 1099511627776) {
		return (Math.round(size / 1099511627776 * 100) / 100) + " TB";
	} else if (size >= 1073741824) {
		return (Math.round(size / 1073741824 * 100) / 100) + " GB";
	} else if (size >= 1048576) {
		return (Math.round(size / 1048576 * 100) / 100) + " MB";
	} else if (size >= 1024) {
		return (Math.round(size / 1024 * 100) / 100) + " KB";
	} else {
		return size + " B";
	}
}

/**
 * @param {number} size
 * @return {string}
 */
function prettyNum(size) {
	if (size >= 1000000000000) {
		return (Math.round(size / 1000000000000 * 10) / 10) + "T";
	} else if (size >= 1000000000) {
		return (Math.round(size / 1000000000 * 10) / 10) + "G";
	} else if (size >= 1000000) {
		return (Math.round(size / 1000000 * 10) / 10) + "M";
	} else if (size >= 1000) {
		return (Math.round(size / 1000 * 10) / 10) + "K";
	} else {
		return (Math.round(size * 10) / 10) + "";
	}
}

/**
 * @param {number} t
 * @return {string}
 */
function prettyUptime(t) {
	var msperm = 1000 * 60;
	var msperh = msperm * 60;
	var msperd = msperh * 24;
	var val;
	if (t >= msperd) {
		val = Math.floor(t / msperd);
		return val + "d " + prettyUptime(t - (val * msperd));
	} else if (t >= msperh) {
		val = Math.floor(t / msperh);
		return val + "h " + prettyUptime(t - (val * msperh));
	} else if (t >= msperm) {
		val = Math.floor(t / msperm);
		return val + "m " + prettyUptime(t - (val * msperm));
	} else {
		val = Math.floor(t / 1000);
		return val + "s";
	}
}

function chartSplits(scaleMax) {
	var e = parseFloat(scaleMax).toExponential();
	var epos = e.indexOf("e");
	var c = parseFloat(e.substring(0, epos));
	e = parseInt(e.substring(epos + 2), 10) - 1;
	e = Math.pow(10, e);
	c *= 10;
	c = Math.ceil(c);
	var div = 0;
	while (div == 0) {
		if ((c % 3) == 0) {
			div = 3;
		} else if ((c % 4) == 0) {
			div = 4;
		} else if ((c % 5) == 0) {
			div = 5;
		} else {
			++c;
		}
	}
	var splits = [0];
	var splitSize = c / div * e;
	for (var i = 1; i <= div; ++i) {
		splits.push(splitSize * i);
	}
	return splits;
}

function newChart(id, label, numPoints, color) {
	var dataObj = [
		new Array(numPoints),
		new Array(numPoints)
	];
	for (var i = 0; i < numPoints; ++i) {
		dataObj[0][i] = i;
		dataObj[1][i] = 0;
	}

	var opts = {
		title: label,
		width: 300,
		height: 150,
		legend: { show: false },
		cursor: { show: false },
		axes: [
			{ show: false, grid: { show: false } },
			{
				values: function(self, ticks) { return ticks.map(function(rawValue) { return prettyNum(rawValue); }); },
				splits: function(self, axisIdx, scaleMin, scaleMax, foundIncr, pctSpace) { return chartSplits(scaleMax); }
			}
		],
		scales: {
			x: { time: false },
			y: {
				range: function(self, dataMin, dataMax) { return [0, dataMax]; }
			}
		},
		series: [{}, { stroke: color }]
	};
	// eslint-disable-next-line new-cap
	var c = new uPlot(opts, dataObj, document.getElementById(id));
	GCHARTS[id] = {
		data: dataObj,
		chart: c
	};
}

/**
 * @return {boolean}
 */
function uplotSupported() {
	var w = window;
	/**
	 * @param {!Object} o
	 * @param {string} p
	 * @return {boolean}
	 */
	function hop(o, p) {
		return Object.prototype.hasOwnProperty.call(o, p);
	}
	if (!hop(w, "Path2D") || !hop(w, "Promise") || !hop(w, "devicePixelRatio") || !hop(w, "Intl") || !hop(w, "Map")) {
		return false;
	}
	if (!hop(Math, "log10") || !hop(Math, "log2") || !hop(Array.prototype, "find")) {
		return false;
	}
	// TODO: this is not a complete check for the Intl components needed
	if (!hop(Intl, "NumberFormat") || !hop(Intl, "DateTimeFormat")) {
		return false;
	}
	// TODO: check for setLineDash()
	return true;
}

function loadScript(url, onload) {
	var el = document.createElement("script");
	if (onload) {
		el.onload = onload;
		el.onreadystatechange = onload;
	}
	el.src = url;
	document.body.appendChild(el);
}

function initCharts() {
	if (UPLOTLOADED) {
		return;
	}
	if (!uplotSupported()) {
		var el = document.getElementById("netrecvChart");
		if (el) {
			el.textContent = "Your browser does not support uPlot. Graphs are disabled.";
		}
		return;
	}
	loadScript("uplot/uPlot.iife.min.js", function() {
		if (typeof uPlot !== "undefined") {
			newChart("netrecvChart", "net.recv", 120, "blue");
			newChart("netsentChart", "net.sent", 120, "blue");
			newChart("latencyChart", "latency (ms)", 120, "blue");
			newChart("heapChart", "heap", 120, "blue");
			newChart("dbszChart", "DB size", 120, "blue");
			UPLOTLOADED = true;
		}
	});
}

function loadAceEditor() {
	if (ACELOADED) {
		return;
	}
	ACELOADED = true;
	loadScript("ace-min-noconflict/ace.js", function() {
		loadScript("ace-min-noconflict/ext-language_tools.js", function() {
			document.getElementById("scriptInput").innerHTML = "";
			document.getElementById("acejsVer").textContent = "v" + ace.version;
			LUAEDITOR = ace.edit("scriptInput");
			LUAEDITOR.getSession().setMode("ace/mode/lua");
			LUAEDITOR.setOptions({ enableBasicAutocompletion: true, enableSnippets: true });
		});
	});
}

function disableButtons(disabled) {
	var ids = ["disconnectButton", "cmdButton", "scriptButton", "subscribeButton", "testButton"];
	for (var i = 0; i < ids.length; ++i) {
		document.getElementById(ids[i]).disabled = disabled;
	}
}

// eslint-disable-next-line no-unused-vars
function initPage() {
	disableButtons(true);
	initCharts();

	RECONNECT.doit = document.getElementById("reconnectCheckbox").checked;
	document.getElementById("timerLen").textContent = GTIMERLEN.toString();
	document.getElementById("opacjsVer").textContent = "v" + Opatomic.version;

	// TODO: show version of Chart.js library; as of now, this cannot be determined from library itself.
	//   should contact via github to request a "version" property in the library?

	// TODO: add example script to editor

	if (window.location.hostname) {
		var protocol = window.location.protocol == "https:" ? "wss://" : "ws://";
		var port = window.location.port ? ":" + window.location.port : "";
		document.getElementById("ws_url").value = protocol + window.location.hostname + port;
	}

	document.getElementById("scriptInput").innerHTML = "<textarea id=\"scriptTextEditor\" style=\"width:100%;height:100%;\"></textarea>";

	if (document.getElementById("tab2").checked) {
		loadAceEditor();
	}
	if (document.getElementById("tab5").checked) {
		document.getElementById("tab5Label").style.removeProperty("display");
	}
}

function addChartPoint(chartName, val) {
	var tabVisible = document.getElementById("tab3").checked;
	var chart = GCHARTS[chartName];
	if (chart) {
		var data = chart.data[1];
		data.push(val);
		data.shift();
		if (tabVisible) {
			chart.chart.setData(chart.data);
		}
	}
}

/**
 * @param {string} s
 * @return {string}
 */
function escEntities(s) {
	// TODO: faster replacement function?
	// note: replace '&' first!!
	// note: regex is needed to replace ALL occurrences
	s = s.replace(/&/g, "&amp;");
	s = s.replace(/</g, "&lt;");
	s = s.replace(/>/g, "&gt;");
	s = s.replace(/"/g, "&quot;");
	s = s.replace(/'/g, "&#039;");
	return s;
}

/**
 * @param {*} v
 * @return {string}
 */
function strifyAndEsc(v) {
	return escEntities(Opatomic.stringify(v));
}

/**
 * @param {string} name
 * @param {string} val
 * @return {string}
 */
function infoRow(name, val) {
	if (val) {
		return "<tr><td>" + escEntities(name) + "</td><td>" + escEntities(val) + "</td></tr>";
	}
	return "";
}

function resSetText(result, rkey, elid, fconv) {
	if (rkey in result) {
		document.getElementById(elid).textContent = fconv ? fconv(result[rkey]) : result[rkey];
	}
}

/**
 * @param {*} errResponse
 * @param {number} intcode
 * @return {boolean}
 */
function isErrCode(errResponse, intcode) {
	return errResponse == intcode || (Array.isArray(errResponse) && errResponse[0] == intcode);
}

/**
 * @param {*} errResponse
 * @return {boolean}
 */
function isClosedErr(errResponse) {
	return isErrCode(errResponse, Opatomic.OpaDef.ERR_CLOSED);
}

function updateCharts() {
	var callTime = new Date().getTime();
	OPAC.callA("INFO", null, function(err, response) {
		if (!response || err) {
			// an error might occur when client is closed with an outstanding INFO request
			if (!isClosedErr(err)) {
				// TODO: handle err better
				if (console) {
					console.log("unsupported response in updateCharts()");
				}
			}
			return;
		}
		var currTime = new Date().getTime();
		var timeElapsed = GSTATSTIME ? (currTime - GSTATSTIME) / 1000 : 1;
		GSTATSTIME = currTime;

		var runtime = currTime - callTime;
		var result = {};
		for (var i = 0; i < response.length; ++i) {
			var idx = response[i].indexOf("=");
			if (idx > 0) {
				result[response[i].substring(0, idx)] = response[i].substring(idx + 1);
			}
		}

		if (result["s.opadbg"] == 1) {
			document.getElementById("tab5Label").style.removeProperty("display");
		} else {
			document.getElementById("tab5Label").style.display = "none";
		}

		if ("net.recv" in result) {
			if (GBWINLAST) {
				addChartPoint("netrecvChart", (result["net.recv"] - GBWINLAST) / timeElapsed);
			}
			GBWINLAST = result["net.recv"];
		}

		if ("net.sent" in result) {
			if (GBWOUTLAST) {
				addChartPoint("netsentChart", (result["net.sent"] - GBWOUTLAST) / timeElapsed);
			}
			GBWOUTLAST = result["net.sent"];
		}

		addChartPoint("latencyChart", runtime);

		if ("db.totUsed" in result && "dbszChart" in GCHARTS) {
			addChartPoint("dbszChart", result["db.totUsed"]);
		}
		if ("mem.totAlloc" in result && "heapChart" in GCHARTS) {
			addChartPoint("heapChart", result["mem.totAlloc"]);
		}

		var str = "";
		str += infoRow("version", result["exe.opadVersion"]);
		str += infoRow("db size", prettySize(result["db.totUsed"]));
		str += infoRow("oplog len", prettySize(result["db.oplogLen"]));
		str += infoRow("undo log len", prettySize(result["db.undoLogBuffLen"]));
		document.getElementById("sysInfoTable").innerHTML = str;

		resSetText(result, "db.totUsed", "stat_dbsz", prettySize);
		resSetText(result, "mem.totAlloc", "stat_mem", prettySize);
		resSetText(result, "net.conns", "stat_clients", prettyNum);
		resSetText(result, "s.uptime", "stat_uptime", prettyUptime);

		// note: browsers may set timeouts to be 1 second when window is not in focus
		GTIMEOUT = setTimeout(updateCharts, GTIMERLEN);
	});
}

/**
 * @param {number|string} space
 * @param {number} depth
 * @return {string}
 */
function indent(space, depth) {
	// TODO: this function is copied from library; expose & use library version; remove this function
	var indentStr = "";
	var i;
	if (typeof space === "number") {
		for (i = 0; i < space * depth; ++i) {
			indentStr += " ";
		}
	} else if (typeof space === "string") {
		for (i = 0; i <= depth; ++i) {
			indentStr += space;
		}
	}
	return indentStr;
}

/**
 * @param {*} obj
 * @param {number|string} space
 * @param {number=} depth
 * @return {string}
 */
function prettyResponse2(obj, space, depth) {
	switch (Opatomic.opaType(obj)) {
		case "undefined":
			return '<span class="undef">undefined</span>';
		case "null":
			return '<span class="null">null</span>';
		case "boolean":
			return '<span class="bool">' + Opatomic.stringify(obj) + "</span>";
		case "SORTMAX":
			return '<span class="sortmax">SORTMAX</span>';
		case "number":
		case "BigInteger":
		case "BigDec":
			return '<span class="num">' + Opatomic.stringify(obj) + "</span>";
		case "Uint8Array":
		case "Buffer":
			return '<span class="blob">' + strifyAndEsc(obj) + "</span>";
		case "string":
			return '<span class="str">' + strifyAndEsc(obj) + "</span>";
		case "Array":
			if (obj.length == 0) {
				return "[]";
			}
			depth = depth ? depth : 0;
			var strs = [];
			for (var i = 0; i < obj.length; ++i) {
				strs[i] = prettyResponse2(obj[i], space, depth + 1);
			}
			if (!space) {
				return "[" + strs.join(",") + "]";
			}
			var indent1 = indent(space, depth);
			var indent2 = indent(space, depth + 1);
			return "[\n" + indent2 + strs.join(",\n" + indent2) + "\n" + indent1 + "]";
	}
	throw new Error("unhandled case in switch");
}

/**
 * @param {*} result
 * @param {*} err
 * @return {string}
 */
function prettyResponse(result, err) {
	if (err) {
		return '<span class="error">ERROR: </span>' + prettyResponse2(err, 4);
	} else {
		var text = prettyResponse2(result, 4);
		if (text.length > 1024000) {
			// TODO: add config option to change this threshold
			text = '<span class="error">Result too big</span>';
		}
		return text;
	}
}

/**
 * @param {number} ch
 * @return {boolean}
 */
function isdigit(ch) {
	// 0=0x30 9=0x39
	return ch <= 0x39 && ch >= 0x30;
}

/**
 * @param {number} ch
 * @return {boolean}
 */
function isalphanum(ch) {
	// a=97 z=122 A=65 Z=90
	return (ch >= 97 && ch <= 122) || (ch >= 65 && ch <= 90) || (isdigit(ch));
}

/**
 * @param {string} s
 * @return {boolean}
 */
function isNumStr(s) {
	// first char must be '-' or digit; if first is '-' then 2nd must be digit
	var ch = s.charCodeAt(0);
	if (ch == 0x2D) {
		ch = s.charCodeAt(1);
	}
	if (!isdigit(ch)) {
		return false;
	}
	var decpos = -1;
	var epos = -1;
	for (var i = 1; i < s.length; ++i) {
		ch = s.charCodeAt(i);
		if (!isdigit(ch)) {
			if (epos == -1 && (ch == 0x65 || ch == 0x45)) {
				// 1 'e' or 'E' is allowed
				epos = i;
				if (i + 1 < s.length) {
					ch = s.charCodeAt(i + 1);
					if (ch == 0x2b || ch == 0x2d) {
						// '+' or '-' is allowed after 'e' or 'E'; skip if present
						++i;
					}
				}
				if (i + 1 >= s.length) {
					// e or E must be followed by a digit
					return false;
				}
			} else if (ch == 0x2e && decpos == -1 && epos == -1) {
				// 1 '.' is allowed and it must come before the 'E'
				// TODO: if a decimal is present, then it must be followed by a digit?
				decpos = i;
			} else {
				return false;
			}
		}
	}
	return true;
}

/**
 * @param {string} str
 * @param {number} idx
 * @param {number} chToFind
 * @return {number}
 */
function findQuoteEnd(str, idx, chToFind) {
	for (; idx < str.length; ++idx) {
		var ch = str.charCodeAt(idx);
		// 92 is backslash character '\'
		if (ch == 92) {
			++idx;
			continue;
		} else if (ch == chToFind) {
			++idx;
			break;
		}
	}
	return idx;
}

/**
 * @param {number} ch
 * @return {number}
 */
function getHexChar1(ch) {
	if (isdigit(ch)) {
		return ch - 48;
	} else if (ch >= 97 && ch <= 122) {
		return ch - 87;
	} else if (ch <= 90 && ch >= 65) {
		return ch - 55;
	}
	throw new Error("invalid escape sequence");
}

/**
 * @param {Uint8Array} str
 * @param {number} i
 * @return {number}
 */
function getHexChar4(str, i) {
	var uchar = getHexChar1(str[i++]);
	uchar = uchar << 4 | getHexChar1(str[i++]);
	uchar = uchar << 4 | getHexChar1(str[i++]);
	uchar = uchar << 4 | getHexChar1(str[i]);
	return uchar;
}

/**
 * @param {number} ch
 * @return {boolean}
 */
function isValidEscapeChar(ch) {
	if (isalphanum(ch)) {
		// b=98 f=102 n=110 r=114 t=116 u=117 x=120
		return ch == 98 || ch == 102 || ch == 110 || ch == 114 || ch == 116 || ch == 117 || ch == 120;
	} else if (ch <= 20) {
		// can escape space but not other control chars
		return ch == 10 || ch == 13 || ch == 9 || ch == 20;
	} else {
		return ch != 0x7f;
	}
}

/**
 * @param {string} str
 * @return {!Uint8Array}
 */
function convEscapedStr(str) {
	var bytes = (new TextEncoder("utf-8")).encode(str);
	var out = new Uint8Array(bytes.length);
	var pos = 0;
	for (var i = 0; i < bytes.length; ++i) {
		var ch = bytes[i];
		// check whether character is escape backslash \ (ascii code 92)
		if (ch == 92) {
			++i;
			if (i >= bytes.length || !isValidEscapeChar(bytes[i])) {
				throw new Error("invalid escape sequence");
			}
			ch = String.fromCharCode(bytes[i]);
			if (ch == "x") {
				if (i + 2 >= bytes.length) {
					throw new Error("invalid escape sequence");
				}
				out[pos++] = (getHexChar1(bytes[i + 1]) << 4) | getHexChar1(bytes[i + 2]);
				i += 2;
			} else if (ch == "u") {
				if (i + 4 >= bytes.length) {
					throw new Error("invalid escape sequence");
				}
				var uchar = getHexChar4(bytes, i + 1);
				i += 4;
				if (uchar < 0x80) {
					out[pos++] = uchar & 0xFF;
				} else if (uchar < 0x0800) {
					out[pos++] = 0xC0 | ((uchar >> 6) & 0x1F);
					out[pos++] = 0x80 | (uchar & 0x3F);
				} else if (uchar < 0xD800 || uchar > 0xDFFF) {
					out[pos++] = 0xE0 | ((uchar >> 12) & 0x0F);
					out[pos++] = 0x80 | ((uchar >> 6) & 0x3F);
					out[pos++] = 0x80 | (uchar & 0x3F);
				} else {
					// surrogate pair
					if (uchar >= 0xDC00 || i + 6 >= bytes.length || bytes[++i] != 92 || bytes[++i] != 117) {
						throw new Error("invalid surrogate pair");
					}
					var uchar2 = getHexChar4(bytes, i + 1);
					if (uchar2 < 0xDC00 || uchar2 > 0xDFFF) {
						throw new Error("invalid surrogate pair");
					}
					i += 4;
					var code = (((uchar & 0x3FF) << 10) | (uchar2 & 0x3FF)) + 0x10000;
					out[pos++] = 0xF0 | (code >> 18);
					out[pos++] = 0x80 | ((code >> 12) & 0x3F);
					out[pos++] = 0x80 | ((code >> 6) & 0x3F);
					out[pos++] = 0x80 | (code & 0x3F);
				}
			} else if (ch == "n") {
				out[pos++] = 10;
			} else if (ch == "r") {
				out[pos++] = 13;
			} else if (ch == "t") {
				out[pos++] = 9;
			} else if (ch == "b") {
				out[pos++] = 8;
			} else if (ch == "f") {
				out[pos++] = 12;
			} else {
				out[pos++] = bytes[i];
			}
		} else {
			out[pos++] = ch;
		}
	}
	return pos > 0 ? out.subarray(0, pos) : out;
}

/**
 * @param {string} str
 * @param {boolean} isBin
 * @return {!Uint8Array|string}
 */
function unescapeStr(str, isBin) {
	// the value returned here may not be valid utf-8 (from \x escape sequences)
	var bytes = convEscapedStr(str);
	return isBin ? bytes : (new TextDecoder()).decode(bytes);
}

/**
 * @param {string} str
 * @return {*}
 */
function convertUserToken(str) {
	if (str == "undefined") {
		return undefined;
	} else if (str == "null") {
		return null;
	} else if (str == "false") {
		return false;
	} else if (str == "true") {
		return true;
	} else if (str == "SORTMAX") {
		return Opatomic.OpaDef.SORTMAX_OBJ;
	} else if (str == "-0") {
		return -0;
	} else if (str.length == 0) {
		return str;
	} else if (isNumStr(str)) {
		return new Opatomic.BigDec(str);
	} else {
		if (str.length <= 9) {
			var lower = str.toLowerCase();
			if (lower == "-infinity" || lower == "-inf") {
				return -Infinity;
			} else if (lower == "infinity" || lower == "inf" || lower == "+infinity" || lower == "+inf") {
				return Infinity;
			}
		}
		return unescapeStr(str, false);
	}
}

/**
 * @param {string} str
 * @param {number} idx
 * @return {number}
 */
function findTokenEnd(str, idx) {
	while (idx < str.length) {
		var ch = str.charCodeAt(idx);
		//  isalphanum(ch) || ch > 0x7f || ch == '_' || ch == '.' || ch == '-' || ch == '+'
		if (isalphanum(ch) || ch > 0x7f || ch == 95  || ch == 46  || ch == 45  || ch == 43) {
			++idx;
		} else if (ch == 92 && idx + 1 < str.length) {
			idx += 2;
		} else {
			return idx;
		}
	}
	return idx;
}

/**
 * @param {string} str
 * @param {number} idx
 * @param {!Array} args
 * @param {boolean} stopAtArrayEnd
 * @return {number}
 */
function parseArgs2(str, idx, args, stopAtArrayEnd) {
	var strEnd;
	while (idx < str.length) {
		switch (str.charAt(idx)) {
			case "\"":
			case "'":
				strEnd = findQuoteEnd(str, idx + 1, str.charCodeAt(idx));
				if (strEnd < idx + 2 || (stopAtArrayEnd && strEnd >= str.length)) {
					throw new Error("string end quote not found");
				}
				args.push(unescapeStr(str.substring(idx + 1, strEnd - 1), str.charAt(idx) == "'"));
				idx = strEnd;
				break;
			case "/":
				if (idx + 1 < str.length) {
					if (str.charAt(idx + 1) == "/") {
						idx = str.indexOf("\n", idx);
						if (idx < 0) {
							idx = str.length;
						}
						continue;
					} else if (str.charAt(idx + 1) == "*") {
						idx = str.indexOf("*/", idx);
						if (idx < 0) {
							throw new Error("end of comment \"*/\" not found");
						}
						idx += 2;
						continue;
					}
				}
				throw new Error("the / character must be inside quotes, escaped, or used as comment");
			case "[":
				var subarray = [];
				idx = parseArgs2(str, idx + 1, subarray, true);
				args.push(subarray);
				break;
			case "]":
				if (stopAtArrayEnd) {
					return idx + 1;
				}
				throw new Error("extra array end token ']'");
			case ",":
			case " ":
			case "\t":
			case "\r":
			case "\n":
				// skip comma and whitespace
				++idx;
				break;
			default:
				strEnd = findTokenEnd(str, idx);
				if (strEnd == idx) {
					throw new Error("reserved/special/control characters must be inside quotes or escaped");
				}
				args.push(convertUserToken(str.substring(idx, strEnd)));
				idx = strEnd;
				break;
		}
	}
	if (stopAtArrayEnd) {
		throw new Error("array end token ']' not found");
	}
	return idx;
}

/**
 * @param {string} str
 * @return {!Array}
 */
function parseArgs(str) {
	var a = [];
	parseArgs2(str, 0, a, false);
	return a;
}

/**
 * @param {*} msg
 */
function showSubMsg(msg) {
	var msgtext = prettyResponse(msg, null);
	var el = document.getElementById("pubsubMessages");
	el.innerHTML += msgtext + "\n";
}

/**
 * @param {!Array} chans
 */
function subscribe2(chans) {
	document.getElementById("pubsubMessages").innerHTML = "";
	SUBS.chans = chans;
	OPAC.call("SUBSCRIBE", chans);
}

// eslint-disable-next-line no-unused-vars
function subscribe() {
	var userTypedStr = document.getElementById("subInput").value;
	if (!SUBS.id) {
		SUBS.id = "_pubsub";
		OPAC.registerCB(SUBS.id, function(err, result) {
			if (err) {
				if (console && !isClosedErr(err)) {
					console.log("error received in sub callback: " + Opatomic.stringify(err));
				}
				//TODO: show error
			} else {
				showSubMsg(result);
			}
		});
	}
	var chans = parseArgs(userTypedStr);
	if (SUBS.chans) {
		// TODO: status messages indicating progress of each op
		OPAC.call("PUNSUBSCRIBE");
		OPAC.call("UNSUBSCRIBE", null, function(err, result) {
			if (err) {
				console.log(err);
				// TODO: show an error message on page for user
			} else {
				subscribe2(chans);
			}
		});
	} else {
		subscribe2(chans);
	}
}

/**
 * @param {string} cmdString
 * @param {!Opatomic.ResponseCallback} cb
 */
function sendCommand(cmdString, cb) {
	try {
		cmdString = cmdString.trim();
		var args = parseArgs(cmdString);
		if (args.length == 0 || typeof args[0] != "string") {
			throw new Error("invalid command");
		}
		var cmd = args.shift();

		OPAC.call(cmd, args, cb);
	} catch (e) {
		// note: must delay printing error message in case there were
		// successful commands sent to server before this one.
		OPAC.call("PING", null, function(err, result) {
			cb(null, "Exception occurred in sendCommand(): " + e);
		});
	}
}

function sendLine(line, callTime) {
	sendCommand(line, function(err, result) {
		document.getElementById("execTime").textContent = ((new Date().getTime()) - callTime) + " ms";
		document.getElementById("results").innerHTML += "<pre>&gt; " + escEntities(line) + "</pre><pre><code class=\"pretty\">" + prettyResponse(result, err) + "</code></pre>";
	});
}

/**
 * @param {string} cmdString
 */
function parseAndSend(cmdString) {
	try {
		var lines = cmdString.trim().split("\n");
		document.getElementById("results").innerHTML = "";
		var callTime = new Date().getTime();
		for (var i = 0; i < lines.length; ++i) {
			var line = lines[i].trim();
			if (line.length == 0) {
				continue;
			}
			sendLine(line, callTime);
		}
		OPAC.flush();
	} catch (e) {
		if (console) {
			console.log(e);
		}
	}
}

// eslint-disable-next-line no-unused-vars
function cmdStrKey(e, el) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13) {
		if (e.ctrlKey) {
			// ctrl+enter - submit form
			parseAndSend(document.getElementById("cmdInput").value);
		}
		// enter is handled by form's onsubmit
	}
}

function sendScript2(script, keysStr, argsStr) {
	var keys = parseArgs(keysStr);
	var args = parseArgs(argsStr);
	var callTime = new Date().getTime();
	OPAC.call("EVAL", [script, keys, args], function(err, result) {
		document.getElementById("scriptTime").textContent = ((new Date().getTime()) - callTime) + " ms";
		document.getElementById("scriptResponse").innerHTML = prettyResponse(result, err);
	});
}

// eslint-disable-next-line no-unused-vars
function sendScript() {
	var src = LUAEDITOR ? LUAEDITOR.getValue() : document.getElementById("scriptTextEditor").value;
	sendScript2(src, document.getElementById("scriptKeys").value, document.getElementById("scriptArgs").value);
}

function disconnect() {
	RECONNECT.url = null;
	RECONNECT.pass = null;
	if (WSCONN) {
		WSCONN.close();
	}
}

function reconnectIfNeeded() {
	if (!RECONNECT.doit || !RECONNECT.url) {
		return;
	}

	// TODO: implement a backoff algorithm to reconnect less frequently over time

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				// note: this will log an error to console every time it fails; no clue how to prevent this
				//   "Firefox can't establish a connection to the server at ws://localhost:8080/."
				connect(RECONNECT.url, RECONNECT.pass);
				if (!WSCONN) {
					RECONNECT.timeout = setTimeout(reconnectIfNeeded, 1000);
				}
			} else {
				RECONNECT.timeout = setTimeout(reconnectIfNeeded, 1000);
			}
		}
	};
	xhr.timeout = 2000;
	// TODO: request a smaller page or maybe just HEAD to use less network traffic
	xhr.open("GET", window.location.pathname);
	xhr.send();
}

function closeClient() {
	document.getElementById("ws_connected").style.display = "none";
	document.getElementById("ws_disconnected").style.display = "inline";
	document.getElementById("ws_disconnected").innerHTML = "Disconnected";
	disableButtons(true);
	clearTimeout(GTIMEOUT);
	if (OPAC) {
		OPAC.onClose();
		OPAC = null;
	}
	if (RECONNECT.timeout) {
		clearTimeout(RECONNECT.timeout);
	}
}

function setStatusConnected() {
	document.getElementById("ws_disconnected").style.display = "none";
	document.getElementById("ws_connected").innerHTML = "Connected";
	document.getElementById("ws_connected").style.display = "inline";
}

/**
 * @param {string} url
 * @param {string} pass
 */
function connect2(url, pass) {
	if (WSCONN) {
		WSCONN.close();
		WSCONN = null;
		for (var cid in GCHARTS) {
			var arr = GCHARTS[cid].data;
			for (var i = 0; i < arr[1].length; ++i) {
				arr[1][i] = 0;
			}
		}
		GBWINLAST = undefined;
		GBWOUTLAST = undefined;
		GSTATSTIME = undefined;
		if (GTIMEOUT) {
			clearTimeout(GTIMEOUT);
		}
	}
	closeClient();
	// TODO: error message if cannot connect
	var websock = new WebSocket(url);
	websock.binaryType = "arraybuffer";
	document.getElementById("ws_disconnected").innerHTML = "Connecting...";
	OPAC = Opatomic.newClient(websock);
	SUBS = {};
	WSCONN = websock;
	websock.onopen = function(msg) {
		document.getElementById("pubsubMessages").innerHTML = "";
		disableButtons(false);
		RECONNECT.url = url;
		RECONNECT.pass = pass;
		if (pass && pass != "") {
			OPAC.call("AUTH", [pass], function(err, result) {
				if (!err || isErrCode(err, ERRCODE_AUTH)) {
					setStatusConnected();
				}
				if (!err) {
					updateCharts();
				} else {
					if (console) {
						console.log("AUTH failed: " + err);
					}
					document.getElementById("ws_connected").innerHTML += " <span style=\"color:red\">(AUTH fail)</span>";
				}
			});
		} else {
			// PING to determine whether AUTH is needed
			OPAC.call("PING", null, function(err, result) {
				if (!err || isErrCode(err, ERRCODE_AUTH)) {
					setStatusConnected();
				}
				if (!err) {
					updateCharts();
				} else {
					if (isErrCode(err, ERRCODE_AUTH)) {
						if (console) {
							console.log("AUTH required!");
						}
						document.getElementById("ws_connected").innerHTML += " <span style=\"color:red\">(AUTH req'd)</span>";
					} else {
						if (console) {
							console.log("unexpected error response for PING command: " + err);
						}
						disconnect();
					}
				}
			});
		}
	};
	websock.onclose = function(msg) {
		if (WSCONN === websock) {
			closeClient();
			clearTimeout(RECONNECT.timeout);
			RECONNECT.timeout = setTimeout(reconnectIfNeeded, 1000);
		}
	};
}

/**
 * @param {string} url
 * @param {string} pass
 */
function connect(url, pass) {
	try {
		connect2(url, pass);
	} catch (e) {
		// If exception occurs during connect, then form will be submitted because onsubmit() will not return false.
		//  Instead, catch all exceptions here.
		// testing note: this exception can be triggered in firefox by loading this admin panel
		//  over https:// but trying to connect over ws://
		// TODO: show error message on page somewhere
		console.log(e);
	}
}

/**
 * @param {string} cmd
 * @param {string} expect
 * @param {boolean} islast
 * @param {!Array<!Array>} results
 * @param {number} callTime
 */
function runTestCase(cmd, expect, islast, results, callTime) {
	sendCommand(cmd, function(err, result) {
		results.push([cmd, expect, result, err]);
		if (!islast) {
			return;
		}
		if (callTime) {
			document.getElementById("testExecTime").textContent = ((new Date().getTime()) - callTime) + " ms";
		}

		var allText = "";

		for (var i = 0; i < results.length; ++i) {
			var iresult = results[i];
			allText += "<pre>" + "&gt; " + escEntities(iresult[0]) + "</pre>";
			if (iresult[3]) {
				allText += "<pre style=\"color:red\">" + strifyAndEsc(iresult[3]) + "</pre>";
			} else if (opaCompare(iresult[1], iresult[2]) != 0) {
				allText += "<pre style=\"color:red\">Expected: " + strifyAndEsc(iresult[1]) + "\nReceived:" + strifyAndEsc(iresult[2]) + "</pre>";
			} else {
				allText += "<pre>" + strifyAndEsc(iresult[2]) + "</pre>";
			}
		}

		document.getElementById("testResults").innerHTML = allText;

	});
}

function runTestCasesUnsafe() {
	var results = [];
	var tests = OPATESTCASES;
	var callTime = new Date().getTime();
	for (var idx = 0; idx < tests.length - 1; idx += 2) {
		runTestCase(tests[idx], tests[idx + 1], idx == tests.length - 2, results, callTime);
	}
}

// eslint-disable-next-line no-unused-vars
function runTestCases() {
	document.getElementById("testResults").innerHTML = "";
	if (document.getElementById("testAllowNonEmpty").checked) {
		runTestCasesUnsafe();
	} else {
		sendCommand("DBSIZE", function(err, result) {
			if (err) {
				document.getElementById("testResults").innerHTML = "<pre style=\"color:red\">err: " + strifyAndEsc(err) + "</pre>";
			} else if (result !== 0) {
				document.getElementById("testResults").innerHTML = "<pre style=\"color:red\">DB is not empty</pre>";
			} else {
				runTestCasesUnsafe();
			}
		});
	}
}

// eslint-disable-next-line no-unused-vars
function changeTimerLen() {
	var newVal = prompt("Refresh every ___ milliseconds", GTIMERLEN.toString());
	newVal = parseInt(newVal, 10);
	if (Number.isInteger(newVal)) {
		GTIMERLEN = newVal;
		document.getElementById("timerLen").textContent = GTIMERLEN.toString();
	}
}

