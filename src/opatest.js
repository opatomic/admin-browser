
var BigInteger = Opatomic.BigInteger;
var BigDec = Opatomic.BigDec;

var OPATESTCASESNEW = [
	"SADD set1 a b c", 3,
	"SADD set2 b c d", 3,
	"SUNION set1 set2", ["a","b","c","d"],
	"SINTER set1 set2", ["b", "c"],
	"SDIFF set1 set2", ["a"]
];

var OPATESTCASES = [
	"ECHO hello", "hello",

	"SET sv true", 1,
	"GET sv", true,
	"SET sv false", 1,
	"GET sv", false,
	"SET sv null", 1,
	"GET sv", null,
	"SET sv 0", 1,
	"GET sv", 0,
	"SET sv -2.3", 1,
	"GET sv", -2.3,
	"SET sv 2.45e-1234567", 1,
	"GET sv", new BigDec("2.45e-1234567"),
	"DEL sv", 1,

	"DEL i1", 0,
	"INCR i1", 1,
	"INCR i1 1", 2,
	"INCR i1 2", 4,
	"INCR i1 0.123", 4.123,
	"INCR i1 -4.123", 0,
	"DEL i1", 1,

	"DEL set1 set2 set3", 0,
	"SADD set1 a b c", 3,
	"SUNION set1 set2", ["a","b","c"],
	"SUNION set2 set1", ["a","b","c"],
	"SINTER set1 set2", [],
	"SINTER set2 set1", [],
	"SDIFF set1 set2", ["a","b","c"],
	"SDIFF set2 set1", [],
	"SADD set2 b c d", 3,
	"SUNION set1 set2", ["a","b","c","d"],
	"SUNION set2 set1", ["a","b","c","d"],
	"SINTER set1 set2", ["b", "c"],
	"SINTER set2 set1", ["b", "c"],
	"SDIFF set1 set2", ["a"],
	"SDIFF set2 set1", ["d"],
	"SADD set3 a", 1,
	"SDIFF set1 set2 set3", [],
	"SDIFF set1 NONE set2 set3", [],
	"SDIFF set1 NONE", ["a","b","c"],
	"SINTERSTORE out set1 set2", 2,
	"SRANGE out LIMIT 10", ["b", "c"],
	"SINTERSTORE out set1 set2 none", 0,
	"SRANGE out LIMIT 10", [],
	"KEYS LIMIT 20", ["set1","set2","set3"],
	"DBSIZE", 3,
	"SUNIONSTORE out set1 set2", 4,
	"SRANGE out LIMIT 10", ["a","b","c","d"],
	"DBSIZE", 4,
	"DEL out", 1,
	"DBSIZE", 3,
	"SUNIONSTORE out none set1 set2", 4,
	"SRANGE out LIMIT 10", ["a","b","c","d"],
	"DEL out", 1,
	"SUNIONSTORE out set1 set2 none", 4,
	"SRANGE out LIMIT 10", ["a","b","c","d"],
	"DEL out", 1,
	"DEL set1 set2 set3", 3,

	"DEL zs1 zs2 zs3", 0,
	"ZCARD zs1", 0,
	"ZADD zs1 10 a", 1,
	"ZADD zs1 11 b", 1,
	"ZADD zs1 12 c", 1,
	"ZRANGE zs1 0 -1", ["a","b","c"],
	"ZADD zs1 -12.123 c", 0,
	"ZRANGE zs1 0 -1", ["c","a","b"],
	"ZRANGE zs1 0 -1 WITHSCORES", ["c",-12.123,"a",10,"b",11],
	"ZADD zs1 13 d 14 e 15 f 12 c", 3,
	"ZRANGE zs1 0 -1", ["a","b","c","d","e","f"],
	"ZADD zs1 -1 d -2.2 e -3.3 f", 0,
	"ZRANGE zs1 0 -1", ["f","e","d","a","b","c"],
	"ZCARD zs1", 6,
	"ZINCRBY zs1 -1.1 f", -4.4,
	"ZUNIONSTORE zs2 1 none", 0,
	"EXISTS zs2", 0,
	"ZUNIONSTORE zs2 2 zs1 zs2", 6,
	"ZREM zs1 a b c d e f", 6,
	"EXISTS zs1", 0,
	"ZREM zs1 a b c d e f", 0,

	"ZINCRBY zs3 1 a", 1,
	"ZINCRBY zs3 1 b", 1,
	"ZINCRBY zs3 1 a", 2,
	"ZREM zs3 b a", 2,
	"ZINCRBY zs3 1 a", 1,
	"ZINCRBY zs3 1 b", 1,
	"ZINCRBY zs3 1 a", 2,
	"DEL zs2 zs3", 2,

	"DEL list1 list2 none", 0,
	"LPUSHHX list1 a", 0,
	"LPUSHTX list1 a", 0,
	"LPUSHH list1 c b a", 3,
	"LPUSHT list1 d e f g", 7,
	"LRANGE list1 0 -1", ["a","b","c","d","e","f","g"],
	"LRANGE list1 1 -1", ["b","c","d","e","f","g"],
	"LRANGE list1 1 -2", ["b","c","d","e","f"],
	"LRANGE list1 1 0", [],
	"LRANGE list1 -2 -1", ["f","g"],
	"LRANGE list1 -3 -4", [],
	"LRANGE list1 10 11", [],
	"LRANGE list1 2 2", ["c"],
	"LRANGE list1 2 1", [],
	"LRANGE none 0 -1", [],
	"LINDEX list1 0", "a",
	"LINDEX list1 1", "b",
	"LINDEX list1 6", "g",
	"LINDEX list1 7", undefined,
	"LINDEX list1 8", undefined,
	"LINDEX list1 -1", "g",
	"LINDEX list1 -2", "f",
	"LINDEX list1 -7", "a",
	"LINDEX list1 -8", undefined,
	"LINDEX none 0", undefined,
	"LPOPTPUSHH list1 list2", "g",
	"LPOPTPUSHH list1 list2", "f",
	"LPOPTPUSHH list1 list2", "e",
	"LPOPTPUSHH none list2", undefined,
	"LLEN list1", 4,
	"LLEN list2", 3,
	"LLEN none", 0,
	"LRANGE list1 0 -1", ["a","b","c","d"],
	"LRANGE list2 0 -1", ["e","f","g"],
	"LPOPT list2", "g",
	"LPOPT list2", "f",
	"LPOPT list2", "e",
	"LPOPT list2", undefined,
	"LPOPH list1", "a",
	"LPOPH list1", "b",
	"LINSERT list1 0 a b", 4,
	"LINSERT list1 4 e f g", 7,
	"LTRIM list1 1 -1", 6,
	"LRANGE list1 0 -1", ["b","c","d","e","f","g"],
	"LINSERT list1 -1 g h i j", 10,
	"LSET list1 -1 k", 1,
	"LSET list1 -20 k", -1,
	"LSET list1 20 k", -1,
	"LSET list1 10 k", -1,
	"LSET list1 9 k", 1,
	"LSET none 0 k", 0,
	"LRANGE list1 0 -1", ["b","c","d","e","f","g","h","i","j","k"],
	// TODO: more LINSERT LREMRANGE LSET LTRIM
	"DEL list1", 1,


	"MSET m1 f1 v1 f2 v2 f3 v3", 3,
	"MSETNX none f1 v11", 1,
	"MDEL none f1", 1,
	"MSETNX m1 f1 v11", 0,
	"MSETNX m1 f4 v4", 1,
	"MVALS m1", ["v1","v2","v3","v4"],
	"MVALS none", [],
	"MKEYS m1 LIMIT 10", ["f1","f2","f3","f4"],
	"MKEYS none LIMIT 10", [],
	"MEXISTS none f1", 0,
	"MEXISTS m1 f0", 0,
	"MEXISTS m1 f1", 1,
	"MGET none f1", undefined,
	"MGET m1 f0", undefined,
	"MGET m1 f1", "v1",
	"MLEN none", 0,
	"MLEN m1", 4,
	"MSET m1 f1 v11 f2 v21 f3 v31 f5 v51", 1,
	"MINCR m1 f0", 1,
	"MINCR m1 f0", 2,
	"MINCR m1 f0 -1.1", 0.9,
	"MINCR m1 f0 1.1", 2,
	"MDEL m1 f0 fnone f5", 2,
	"MDEL none a b", 0,
	"MDEL m1 f0 fnone f5", 0,
	"MINCR m1 f0 -1", -1,
	"MDEL m1 f0", 1,
	"MLEN m1", 4,
	"MRANGE m1 START 9 DESC", [],
	// TODO: MKEYS with range arguments
	"DEL m1", 1,

	"BAPPEND b1 ~base640123456789abcdef", 12,
	"BGETRANGE b1 0 -1", buffFromBase64("0123456789abcdef"),
	"BAPPEND b1 ~base640123456789abcdef", 24,
	"BGETRANGE b1 0 -1", buffFromBase64("0123456789abcdef0123456789abcdef"),
	"BAPPEND b1 ~base640123456789abcdef", 36,
	"BAPPEND b1 ~base640123456789abcdef", 48,
	"BAPPEND b1 ~base640123456789abcdef", 60,
	"DEL b1", 1,

	"BATCH [[INCR exp1] [INCR exp1] [EXPIRE NONE 2000] [EXPIRE exp1 2000] [EXPIRE exp1 1000] ]", [1,2,0,1,1],
];


// ECHO [33,"hi",-5.06e-34,[[]], U null,    false -.;.\\. true, 18446744073709566,"xk\njrkj\telrj\\wl\bkejrfwklejrkwjer",[247923798734982734 ~binhello [child1 [b1 b2 123 123.4] [boo] child2]]]

function OpaByteArrayOutputStream(size) {
	this.mTmpBuff = new Uint8Array(1);
	this.mBuff = new Uint8Array(size ? size : 256);
	this.mLen = 0;
}
var P = OpaByteArrayOutputStream.prototype;

P.write = function(b) {
	// TODO: check type of argument
	if (!b) {
		return;
	}
	if (this.mLen + b.length > this.mBuff.length) {
		var newSize = this.mBuff.length * 2;
		while (newSize < this.mLen + b.length) {
			newSize = newSize * 2;
		}
		var newBuff = new Uint8Array(newSize);
		newBuff.set(this.mBuff);
		this.mBuff = newBuff;
	}
	this.mBuff.set(b, this.mLen);
	this.mLen += b.length;
}

P.write1 = function(v) {
	this.mTmpBuff[0] = v;
	this.write(this.mTmpBuff);
}

P.toByteArray = function() {
	return this.mBuff.subarray(0, this.mLen);
}



function buffFromBase64(str) {
	return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

function opaCompare(o1, o2) {
	var t1 = Opatomic.opaType(o1);
	var t2 = Opatomic.opaType(o2);
	switch (t1) {
		case 'undefined':
			if (t2 == 'undefined') {
				return 0;
			}
			return -1;
		case 'null':
			if (t2 == 'undefined') {
				return 1;
			} else if (t2 == 'null') {
				return 0;
			}
			return -1;
		case 'boolean':
			if (t2 == 'undefined' || t2 == 'null') {
				return 1;
			} else if (t2 == 'boolean' && t1 === t2) {
				return 0;
			}
			return -1;
		case 'number':
			if (t2 == 'number') {
				if (o1 < o2) {
					return -1;
				}
				return o1 == o2 ? 0 : 1;
			} else if (t2 == 'undefined' || t2 == 'null' || t2 == 'boolean') {
				return 1;
			}
			// fall thru
		case 'BigInteger':
			return opaCompare(new BigDec(o1.toString()), o2);
		case "BigDec":
			if (t2 == 'BigDec') {
				return o1.compareTo(o2);
			} else if (t2 == 'number' || t2 == 'BigInteger') {
				return o1.compareTo(new BigDec(o2.toString()));
			} else if (t2 == 'undefined' || t2 == 'null' || t2 == 'boolean') {
				return 1;
			}
			return -1;
		case 'Uint8Array':
			if (t2 == 'Uint8Array') {
				var dv1 = new DataView(o1.buffer, o1.byteOffset, o1.byteLength);
				var dv2 = new DataView(o2.buffer, o2.byteOffset, o2.byteLength);
				var minLen = o1.byteLength < o2.byteLength ? o1.byteLength : o2.byteLength;
				for (var i = 0; i < minLen; ++i) {
					if (dv1.getUint8(i) !== dv2.getUint8(i)) {
						return dv1.getUint8(i) < dv2.getUint8(i) ? -1 : 1;
					}
				}
				return o1.byteLength == o2.byteLength ? 0 : (o1.byteLength < o2.byteLength ? -1 : 1);
			} else if (t2 == 'string' || t2 == 'Array') {
				return -1;
			}
			return 1;
		case 'string':
			if (t2 == 'string') {
				// TODO: is this correct?
				return o1.localeCompare(o2);
			} else if (t2 == 'Array') {
				return -1;
			}
			return 1;
		case 'Array':
			if (t2 == 'Array') {
				var imin = Math.min(o1.length, o2.length);
				for (var i = 0; i < imin; ++i) {
					var cmp = opaCompare(o1[i], o2[i]);
					if (cmp != 0) {
						return cmp;
					}
				}
				return o1.length == o2.length ? 0 : (o1.length < o2.length ? -1 : 1);
			} else {
				return 1;
			}
	}
	throw "unhandled case in switch";
}










function opaTestParseObj(o) {
	try {
		var bytes = opaRpcEncode(o);
		var pp = new Opatomic.PartialParser();
		var b = new Opatomic.PartialParser.Buff();
		b.len = 1;
		b.data = bytes;
		for (var i = 0; i < bytes.length; ++i) {
			b.idx = i;
			b.len = 1;
			//b[0] = bytes[i];
			var check = pp.parseNext(b);
			if (check != null) {
				if (i != bytes.length - 1) {
					throw "finish parse early";
				}
				if (opaCompare(o, check) != 0) {
					throw "objects not equal " + Opatomic.stringify(o) + " != " + Opatomic.stringify(check);
				}
			} else {
				if (i == bytes.length - 1) {
					throw "obj not parsed";
				}
			}
		}
		//console.log("success " + bytes[1] + " " + JSON.stringify(o));
	} catch (e) {
		console.log("error " + e + " " + JSON.stringify(o));
	}
}

function opaTestParse(o) {
	var testDec = true;

	if (!testDec) {
		console.log("TODO: test decimals");
	}

	opaTestParseObj(["hello"]);
	opaTestParseObj([["hello"],0,-1,1,83489234,[],"",null,false, true, "str", new Uint8Array(0), new Uint8Array(2)]);

	opaTestParseObj([undefined]);
	opaTestParseObj([null]);
	opaTestParseObj([false]);
	opaTestParseObj([true]);
	opaTestParseObj([0]);
	opaTestParseObj([""]);
	opaTestParseObj([new Uint8Array(0)]);
	opaTestParseObj([new Uint8Array(1)]);
	opaTestParseObj([[]]);

	opaTestParseObj([new BigInteger("2147483648")]);
	opaTestParseObj([new BigInteger("2147483647")]);
	opaTestParseObj([new BigInteger("2147483646")]);
	opaTestParseObj([new BigInteger("-2147483648")]);
	opaTestParseObj([new BigInteger("-2147483647")]);
	opaTestParseObj([new BigInteger("-2147483646")]);
	opaTestParseObj([new BigInteger("9223372036854775806")]);

	opaTestParseObj([new BigInteger(Number.MIN_SAFE_INTEGER.toString())]);
	opaTestParseObj([new BigInteger((Number.MAX_SAFE_INTEGER + 1).toString())]);
	opaTestParseObj([new BigInteger(Number.MAX_SAFE_INTEGER.toString())]);
	opaTestParseObj([new BigInteger((Number.MAX_SAFE_INTEGER - 1).toString())]);
	opaTestParseObj([new BigInteger("-9223372036854775808")]);
	opaTestParseObj([new BigInteger("-9223372036854775807")]);
	opaTestParseObj([new BigInteger("-9223372036854775806")]);
	opaTestParseObj([new BigInteger("9223372036854775806")]);
	opaTestParseObj([new BigInteger("9223372036854775807")]);
	opaTestParseObj([new BigInteger("9223372036854775808")]);

	if (testDec) {
		opaTestParseObj([new BigDec("123e42")]);
		opaTestParseObj([new BigDec("123e-42")]);
		opaTestParseObj([new BigDec("-123e42")]);
		opaTestParseObj([new BigDec("-123e-42")]);
	}

	opaTestParseObj([new BigDec("98237947237489237497239847892374987238947")]);
	opaTestParseObj([new BigDec("-98237947237489237497239847892374987238947")]);

	opaTestParseObj([new BigDec("98237947237489237497239847892374987238947e876238762")]);
	opaTestParseObj([new BigDec("98237947237489237497239847892374987238947e-876238762")]);
	opaTestParseObj([new BigDec("-98237947237489237497239847892374987238947e876238762")]);
	opaTestParseObj([new BigDec("-98237947237489237497239847892374987238947e-876238762")]);

	var mans = ["0","1",
		"2147483646","2147483647","2147483648","2147483649",
		"4294967294","4294967295","4294967296","4294967297",
		"9223372036854775806","9223372036854775807","9223372036854775808","9223372036854775809",
		"18446744073709551614","18446744073709551615","18446744073709551616","18446744073709551617"
	];
	var exps = ["0","1","2","3",
		"2147483646","2147483647"
	];
	for (var i = 0; i < mans.length; ++i) {
		opaTestParseObj([new BigDec(mans[i])]);
		opaTestParseObj([new BigDec("-" + mans[i])]);
		if (testDec) {
			for (var j = 0; j < exps.length; ++j) {
				opaTestParseObj([new BigDec(mans[i] + "e" + exps[j])]);
				opaTestParseObj([new BigDec(mans[i] + "e-" + exps[j])]);
				opaTestParseObj([new BigDec("-" + mans[i] + "e" + exps[j])]);
				opaTestParseObj([new BigDec("-" + mans[i] + "e-" + exps[j])]);
			}
		}
	}

	//testBD();

	opaBenchParser();

	console.log("done");
}

function opaRpcEncode(val) {
	var out = new OpaByteArrayOutputStream();
	var s = new Opatomic.Serializer(out);
	s.writeObject(val);
	s.flush();
	return out.toByteArray();
}

function opaBenchParserObj(o, its) {
	var bytes = opaRpcEncode(o);
	var pp = new Opatomic.PartialParser();
	var b = new Opatomic.PartialParser.Buff();
	b.data = bytes;
	var t = new Date().getTime();
	for (var i = 0; i < its; ++i) {
		b.idx = 0;
		b.len = bytes.length;
		var obj = pp.parseNext(b);
		if (obj == null) {
			throw "obj not parsed"
		}
	}
	return (new Date().getTime()) - t;
}

function ensureEqual(a, b) {
	if (opaCompare(a, b) != 0) {
		throw "objects not equal " + a.toString() + " != " + b.toString();
	}
}

function testBDstr(s) {
	ensureEqual(Big(s), new BigDec(s));
	ensureEqual(new BigDec(s), Big(s));
	if (s.charAt(0) != "-") {
		testBDstr("-" + s);
	}
	ensureEqual(Big(s).add(Big(s)), (new BigDec(s)).add(new BigDec(s)));
	ensureEqual(Big(s).sub(Big(s)), (new BigDec(s)).subtract(new BigDec(s)));
	ensureEqual(Big(s).mul(Big(s)), (new BigDec(s)).multiply(new BigDec(s)));
}

function testBD2(a, b) {
	ensureEqual(Big(a), new BigDec(a));
	ensureEqual(Big(b), new BigDec(b));
}

function testBD() {
/*
	var nums1 = ["0","1",
		"2147483646","2147483647","2147483648","2147483649",
		"4294967294","4294967295","4294967296","4294967297",
		"9223372036854775806","9223372036854775807","9223372036854775808","9223372036854775809",
		"18446744073709551614","18446744073709551615","18446744073709551616","18446744073709551617"
	];
	var nums2;
	for (var i = 0; i < nums1.length; ++i) {
		//nums2.push(Big(nums1[i]));
		//nums2.push(Big("-" + nums1[i]));
		nums2.push(Big(nums1[i]));
		nums2.push(Big("-" + nums1[i]));
		for (var j = 0; j < nums1.length; ++j) {
			nums2.push(Big(nums1[i] + "e" + nums1[j]));
			nums2.push(Big(nums1[i] + "e-" + nums1[j]));
			nums2.push(Big("-" + nums1[i] + "e" + nums1[j]));
			nums2.push(Big("-" + nums1[i] + "e-" + nums1[j]));
		}
	}
	for (var i = 0; i < nums2.length) {
		for (var j = 0; j < nums2.length; ++j) {
			var bd1 = new BigDec(new BigInteger(nums2[i].toString()));
		}
	}
	*/

	//ensureEqual(Big("0").minus(Big("123e4")), (new BigDec("0")).subtract(new BigDec("123e4")));
	//ensureEqual(Big("123e-2"), new BigDec("123e-2"));
	testBDstr("123e4");
	testBDstr("123e-4");
	testBDstr("123e+4");
	//testBDstr("123e");
	testBDstr("123e0");
	testBDstr("123e000000");
	testBDstr("123e0000004");
	testBDstr(".123");
	testBDstr("123.");
	testBDstr("0.123");
	testBDstr("123.0");
	testBDstr("123.0000000000");
	testBDstr("0000000000000.123");
	testBDstr("0e4");
	testBDstr("0e+4");
	testBDstr("0e-4");
	testBDstr("0e0");

	testBD2("123", "123");
	testBD2("123e2", "123e-2");
}

function opaBenchParser(o, its) {
	var its = 1000000;
	console.log("time: " + opaBenchParserObj([2147483646], its));
	console.log("time: " + opaBenchParserObj([0], its));
	console.log("time: " + opaBenchParserObj([2147483646], its));
	console.log("time: " + opaBenchParserObj([0], its));
	console.log("time: " + opaBenchParserObj([1], its));
	console.log("time: " + opaBenchParserObj([256], its));
	console.log("time: " + opaBenchParserObj([64 * 1024 + 1], its));
	console.log("time: " + opaBenchParserObj([new BigInteger("9223372036854775806")], its));
	//console.log("time: " + opaBenchParserObj([new BigInteger("89237487234723984789237489237849723984728347982378947")], its));
	//console.log("time: " + opaBenchParserObj([new BigDec("1.23")], its));
	console.log("time: " + opaBenchParserObj([new BigDec("-123e-567")], its));
	console.log("time: " + opaBenchParserObj([new BigDec("-9223372036854775806e-567")], its));
	//console.log("time: " + opaBenchParserObj([new BigDec("-89237487234723984789237489237849723984728347982378947e-8764")], its));

	var bd = new BigDec(new BigInteger("89237487234723984789237489237849723984728347982378947"), -4567);
	console.log(bd.toString());
	console.log(bd.add(bd).toString());
	console.log(bd.subtract(bd).toString());
	console.log(bd.multiply(bd).toString());
}

