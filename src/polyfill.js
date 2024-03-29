'use strict';

(function (undefined) {
	"use strict";
	function polyfill(o, k, v) {
		if (!Object.prototype.hasOwnProperty.call(o, k)) {
			o[k] = v;
		}
	}

	polyfill(Number, "MIN_SAFE_INTEGER", -9007199254740991);
	polyfill(Number, "MAX_SAFE_INTEGER",  9007199254740991);
	polyfill(Number, "isInteger", function(v) {
		return typeof v === 'number' && isFinite(v) && Math.floor(v) === v;
	});
	polyfill(Number, "isSafeInteger", function(v) {
		return Number.isInteger(v) && v >= Number.MIN_SAFE_INTEGER && v <= Number.MAX_SAFE_INTEGER;
	});

	// polyfill for uPlot
	// https://github.com/leeoniya/uPlot/issues/538
	var oMatchMedia = window.matchMedia;
	window.matchMedia = function(query) {
		var mql = oMatchMedia(query);
		if (!mql.addEventListener) {
			mql.addEventListener = function(evName, handler) {
				mql.addListener(handler);
			};
			mql.removeEventListener = function(evName, handler) {
				mql.removeListener(handler);
			};
		}
		return mql;
	};
})();

// from https://github.com/anonyco/FastestSmallestTextEncoderDecoder
// license: CC0 1.0 Universal
(function(q){function x(){}function y(){}var z=String.fromCharCode,v={}.toString,A=v.call(q.SharedArrayBuffer),B=v(),r=q.Uint8Array,t=r||Array,w=r?ArrayBuffer:t,C=w.isView||function(g){return g&&"length"in g},D=v.call(w.prototype);w=y.prototype;var E=q.TextEncoder,a=new (r?Uint16Array:t)(32);x.prototype.decode=function(g){if(!C(g)){var l=v.call(g);if(l!==D&&l!==A&&l!==B)throw TypeError("Failed to execute 'decode' on 'TextDecoder': The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
g=r?new t(g):g||[]}for(var e=l="",b=0,c=g.length|0,u=c-32|0,f,d,h=0,p=0,m,k=0,n=-1;b<c;){for(f=b<=u?32:c-b|0;k<f;b=b+1|0,k=k+1|0){d=g[b]&255;switch(d>>4){case 15:m=g[b=b+1|0]&255;if(2!==m>>6||247<d){b=b-1|0;break}h=(d&7)<<6|m&63;p=5;d=256;case 14:m=g[b=b+1|0]&255,h<<=6,h|=(d&15)<<6|m&63,p=2===m>>6?p+4|0:24,d=d+256&768;case 13:case 12:m=g[b=b+1|0]&255,h<<=6,h|=(d&31)<<6|m&63,p=p+7|0,b<c&&2===m>>6&&h>>p&&1114112>h?(d=h,h=h-65536|0,0<=h&&(n=(h>>10)+55296|0,d=(h&1023)+56320|0,31>k?(a[k]=n,k=k+1|0,n=-1):
(m=n,n=d,d=m))):(d>>=8,b=b-d-1|0,d=65533),h=p=0,f=b<=u?32:c-b|0;default:a[k]=d;continue;case 11:case 10:case 9:case 8:}a[k]=65533}e+=z(a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],a[12],a[13],a[14],a[15],a[16],a[17],a[18],a[19],a[20],a[21],a[22],a[23],a[24],a[25],a[26],a[27],a[28],a[29],a[30],a[31]);32>k&&(e=e.slice(0,k-32|0));if(b<c){if(a[0]=n,k=~n>>>31,n=-1,e.length<l.length)continue}else-1!==n&&(e+=z(n));l+=e;e=""}return l};q.TextDecoder||(q.TextDecoder=x);w.encode=function(g){g=
void 0===g?"":""+g;var l=g.length|0,e=new t((l<<1)+9|0),b,c=0,u=!r;for(b=0;b<l;b=b+1|0,c=c+1|0){var f=g.charCodeAt(b)|0;if(127>=f)e[c]=f;else{if(2047>=f)e[c]=192|f>>6;else{if(55296<=f&&56319>=f){var d=g.charCodeAt(b=b+1|0)|0;if(56320<=d&&57343>=d){if(f=(f<<10)+d-56613888|0,65535<f){e[c]=240|f>>18;e[c=c+1|0]=128|f>>12&63;e[c=c+1|0]=128|f>>6&63;e[c=c+1|0]=128|f&63;continue}}else f=65533}else!u&&b<<1<c&&b<<1<(c-9|0)&&(u=!0,d=new t(3*l),d.set(e),e=d);e[c]=224|f>>12;e[c=c+1|0]=128|f>>6&63}e[c=c+1|0]=128|
f&63}}return r?e.subarray(0,c):e.slice(0,c)};E||(q.TextEncoder=y)})(""+void 0==typeof global?""+void 0==typeof self?this:self:global);//AnonyCo
//# sourceMappingURL=https://cdn.jsdelivr.net/gh/AnonyCo/FastestSmallestTextEncoderDecoder/EncoderDecoderTogether.min.js.map

