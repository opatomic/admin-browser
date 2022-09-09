
/**
 * @const
 */
var Opatomic = {};

/** @const {string} */
Opatomic.version;

Opatomic.OpaDef = {};

/** @const {!Object} */
Opatomic.OpaDef.SORTMAX_OBJ;
/** @const {number} */
Opatomic.OpaDef.ERR_CLOSED;

/**
 * @param {*} o
 * @return {string}
 */
Opatomic.opaType = function(o) {};

/**
 * @param {*} obj
 * @param {(number|string)=} space
 * @return {string}
 */
Opatomic.stringify = function(obj, space) {};

/**
 * Configurable client options
 * @constructor
 */
Opatomic.ClientConfig = function() {};

/**
 * @typedef {function(*, *=):void}
 */
Opatomic.ResponseCallback;

/**
 * @constructor
 */
Opatomic.Client = function() {};

/**
 * Sends the specified command and args to the server. Invokes the specified callback when a response is received.
 * @param {string} cmd - The command to run
 * @param {?Array=} args - The parameters for the command
 * @param {?Opatomic.ResponseCallback=} cb - A callback function to invoke when the response is received
 */
Opatomic.Client.prototype.call = function(cmd, args, cb) {};

/**
 * Sends the specified command and args to the server with an async id. Using an async id indicates to the
 * server that the operation response can be sent out of order. Invokes the specified callback when a
 * response is received.
 * @param {string} cmd - The command to run
 * @param {?Array} args - The parameters for the command
 * @param {!Opatomic.ResponseCallback} cb - A callback function to invoke when the response is received
 */
Opatomic.Client.prototype.callA = function(cmd, args, cb) {};

/**
 * Register a callback to an async id that can be used by callID().
 * @param {string} id - Async ID: must be a string.
 * @param {?Opatomic.ResponseCallback} cb - A callback function to invoke when each response is received.
                                   Use null to remove registered callback.
 */
Opatomic.Client.prototype.registerCB = function(id, cb) {};

/**
 * Run specified command on the server with a specified async id. Any responses to the command
 * will invoke the callback that was given as a parameter to registerCB().
 * @param {string} id - Async id
 * @param {string} cmd - The command to run
 * @param {?Array=} args - The parameters for the command
 */
Opatomic.Client.prototype.callID = function(id, cmd, args) {};

/**
 * @param {!WebSocket} s
 * @param {?Opatomic.ClientConfig=} cfg - Client options. See ClientConfig for details.
 * @return {!Opatomic.Client}
 */
Opatomic.newClient = function(s, cfg) {};

/* ------------------------------------------------------------------ */

/**
 * @constructor
 * @param {number|string|Array=} a
 * @param {number=} b
 */
Opatomic.BigInteger = function(a,b) {};

/**
 * @type {!Opatomic.BigInteger}
 * @const
 */
Opatomic.BigInteger.ZERO;

/**
 * @type {!Opatomic.BigInteger}
 * @const
 */
Opatomic.BigInteger.ONE;

/**
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.abs = function() {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.add = function(val) {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.and = function(val) {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.andNot = function(val) {};

/**
 * @return {number}
 */
Opatomic.BigInteger.prototype.bitCount = function() {};

/**
 * @return {number}
 */
Opatomic.BigInteger.prototype.bitLength = function() {};

/**
 * @return {number}
 */
Opatomic.BigInteger.prototype.byteValue = function() {};

/**
 * @param {number} n
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.clearBit = function(n) {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {number}
 */
Opatomic.BigInteger.prototype.compareTo = function(val) {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.divide = function(val) {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Array<!Opatomic.BigInteger>}
 */
Opatomic.BigInteger.prototype.divideAndRemainder = function(val) {};

/**
 * @param {number} n
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.flipBit = function(n) {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.gcd = function(val) {};

/**
 * @return {!number}
 */
Opatomic.BigInteger.prototype.getLowestSetBit = function() {};

/**
 * @return {number}
 */
Opatomic.BigInteger.prototype.intValue = function() {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.max = function(val) {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.min = function(val) {};

/**
 * @param {!Opatomic.BigInteger} m
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.mod = function(m) {};

/**
 * @param {!Opatomic.BigInteger} m
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.modInverse = function(m) {};

/**
 * @param {!Opatomic.BigInteger} exponent
 * @param {!Opatomic.BigInteger} m
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.modPow = function(exponent, m) {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.multiply = function(val) {};

/**
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.negate = function() {};

/**
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.not = function() {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.or = function(val) {};

/**
 * @param {number} exponent
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.pow = function(exponent) {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.remainder = function(val) {};

/**
 * @param {number} n
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.setBit = function(n) {};

/**
 * @param {number} n
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.shiftLeft = function(n) {};

/**
 * @param {number} n
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.shiftRight = function(n) {};

/**
 * @return {number}
 */
Opatomic.BigInteger.prototype.shortValue = function() {};

/**
 * @return {number}
 */
Opatomic.BigInteger.prototype.signum = function() {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.subtract = function(val) {};

/**
 * @param {number} n
 * @return {boolean}
 */
Opatomic.BigInteger.prototype.testBit = function(n) {};

/**
 * @return {!Array<number>}
 */
Opatomic.BigInteger.prototype.toByteArray = function() {};

/**
 * @param {number=} radix
 * @return {string}
 * @override
 */
Opatomic.BigInteger.prototype.toString = function(radix) {};

/**
 * @param {!Opatomic.BigInteger} val
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigInteger.prototype.xor = function(val) {};

/* ------------------------------------------------------------------ */

/** @enum {number} */
Opatomic.RoundingMode = {
	UP: 0,
	DOWN: 1,
	CEILING: 2,
	FLOOR: 3,
	HALF_UP: 4,
	HALF_DOWN: 5,
	HALF_EVEN: 6,
	UNNECESSARY: 7
};

/**
 * @constructor
 * @param {!Opatomic.BigInteger|string|number} a
 * @param {number=} b
 */
Opatomic.BigDec = function(a,b) {};

/**
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.abs = function() {};

/**
 * @param {!Opatomic.BigDec} augend
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.add = function(augend) {};

/**
 * @return {number}
 */
Opatomic.BigDec.prototype.byteValue = function() {};

/**
 * @return {number}
 */
Opatomic.BigDec.prototype.byteValueExact = function() {};

/**
 * @param {!Opatomic.BigDec} val
 * @return {number}
 */
Opatomic.BigDec.prototype.compareTo = function(val) {};

/**
 * @param {!Opatomic.BigDec} divisor
 * @param {(!Opatomic.RoundingMode|number)=} b
 * @param {!Opatomic.RoundingMode=} c
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.divide = function(divisor, b, c) {};

/**
 * @param {!Opatomic.BigDec} divisor
 * @return {!Array<!Opatomic.BigDec>}
 */
Opatomic.BigDec.prototype.divideAndRemainder = function(divisor) {};

/**
 * @param {!Opatomic.BigDec} divisor
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.divideToIntegralValue = function(divisor) {};

/**
 * @param {*} x
 * @return {boolean}
 */
Opatomic.BigDec.prototype.equals = function(x) {};

/**
 * @return {number}
 */
Opatomic.BigDec.prototype.intValue = function() {};

/**
 * @return {number}
 */
Opatomic.BigDec.prototype.intValueExact = function() {};

/**
 * @param {!Opatomic.BigDec} val
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.max = function(val) {};

/**
 * @param {!Opatomic.BigDec} val
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.min = function(val) {};

/**
 * @param {number} n
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.movePointLeft = function(n) {};

/**
 * @param {number} n
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.movePointRight = function(n) {};

/**
 * @param {!Opatomic.BigDec} multiplicand
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.multiply = function(multiplicand) {};

/**
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.negate = function() {};

/**
 * @param {number} n
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.pow = function(n) {};

/**
 * @return {number}
 */
Opatomic.BigDec.prototype.precision = function() {};

/**
 * @param {!Opatomic.BigDec} divisor
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.remainder = function(divisor) {};

/**
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.round = function() {};

/**
 * @return {number}
 */
Opatomic.BigDec.prototype.scale = function() {};

/**
 * @param {number} n
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.scaleByPowerOfTen = function(n) {};

/**
 * @param {number} newScale
 * @param {!Opatomic.RoundingMode=} rm
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.setScale = function(newScale, rm) {};

/**
 * @return {number}
 */
Opatomic.BigDec.prototype.shortValue = function() {};

/**
 * @return {number}
 */
Opatomic.BigDec.prototype.shortValueExact = function() {};

/**
 * @return {number}
 */
Opatomic.BigDec.prototype.signum = function() {};

/**
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.stripTrailingZeros = function() {};

/**
 * @param {!Opatomic.BigDec} subtrahend
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.subtract = function(subtrahend) {};

/**
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigDec.prototype.toBigInteger = function() {};

/**
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigDec.prototype.toBigIntegerExact = function() {};

/**
 * @return {string}
 */
Opatomic.BigDec.prototype.toEngineeringString = function() {};

/**
 * @return {string}
 */
Opatomic.BigDec.prototype.toPlainString = function() {};

/**
 * @return {!Opatomic.BigDec}
 */
Opatomic.BigDec.prototype.ulp = function() {};

/**
 * @return {!Opatomic.BigInteger}
 */
Opatomic.BigDec.prototype.unscaledValue = function() {};



