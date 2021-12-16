function removeEmptyValues(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, value])=>{
        if (value === null) return false;
        if (value === undefined) return false;
        if (value === "") return false;
        return true;
    }));
}
function difference(arrA, arrB) {
    return arrA.filter((a)=>arrB.indexOf(a) < 0
    );
}
function parse(rawDotenv) {
    const env = {
    };
    for (const line of rawDotenv.split("\n")){
        if (!isVariableStart(line)) continue;
        const key = line.slice(0, line.indexOf("=")).trim();
        let value = line.slice(line.indexOf("=") + 1).trim();
        if (hasSingleQuotes(value)) {
            value = value.slice(1, -1);
        } else if (hasDoubleQuotes(value)) {
            value = value.slice(1, -1);
            value = expandNewlines(value);
        } else value = value.trim();
        env[key] = value;
    }
    return env;
}
function config(options = {
}) {
    const o = Object.assign({
        path: `.env`,
        export: false,
        safe: false,
        example: `.env.example`,
        allowEmptyValues: false,
        defaults: `.env.defaults`
    }, options);
    const conf = parseFile(o.path);
    if (o.defaults) {
        const confDefaults = parseFile(o.defaults);
        for(const key in confDefaults){
            if (!(key in conf)) {
                conf[key] = confDefaults[key];
            }
        }
    }
    if (o.safe) {
        const confExample = parseFile(o.example);
        assertSafe(conf, confExample, o.allowEmptyValues);
    }
    if (o.export) {
        for(const key in conf){
            if (Deno.env.get(key) !== undefined) continue;
            Deno.env.set(key, conf[key]);
        }
    }
    return conf;
}
function parseFile(filepath) {
    try {
        return parse(new TextDecoder("utf-8").decode(Deno.readFileSync(filepath)));
    } catch (e) {
        if (e instanceof Deno.errors.NotFound) return {
        };
        throw e;
    }
}
function isVariableStart(str) {
    return /^\s*[a-zA-Z_][a-zA-Z_0-9 ]*\s*=/.test(str);
}
function hasSingleQuotes(str) {
    return /^'([\s\S]*)'$/.test(str);
}
function hasDoubleQuotes(str) {
    return /^"([\s\S]*)"$/.test(str);
}
function expandNewlines(str) {
    return str.replaceAll("\\n", "\n");
}
function assertSafe(conf, confExample, allowEmptyValues) {
    const currentEnv = Deno.env.toObject();
    const confWithEnv = Object.assign({
    }, currentEnv, conf);
    const missing = difference(Object.keys(confExample), Object.keys(allowEmptyValues ? confWithEnv : removeEmptyValues(confWithEnv)));
    if (missing.length > 0) {
        const errorMessages = [
            `The following variables were defined in the example file but are not present in the environment:\n  ${missing.join(", ")}`,
            `Make sure to add them to your env file.`,
            !allowEmptyValues && `If you expect any of these variables to be empty, you can set the allowEmptyValues option to true.`, 
        ];
        throw new MissingEnvVarsError(errorMessages.filter(Boolean).join("\n\n"));
    }
}
class MissingEnvVarsError extends Error {
    constructor(message){
        super(message);
        this.name = "MissingEnvVarsError";
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
try {
    config({
        export: true
    });
    Deno.env.set("RUNTIME_ENV", "deno");
} catch (e2) {
    console.error(".env file may not be loaded => ", e2.name, ":", e2.message);
}
"use strict";
function toString(type) {
    switch(type){
        case 1:
            return "A";
        case 10:
            return "NULL";
        case 28:
            return "AAAA";
        case 18:
            return "AFSDB";
        case 42:
            return "APL";
        case 257:
            return "CAA";
        case 60:
            return "CDNSKEY";
        case 59:
            return "CDS";
        case 37:
            return "CERT";
        case 5:
            return "CNAME";
        case 49:
            return "DHCID";
        case 32769:
            return "DLV";
        case 39:
            return "DNAME";
        case 48:
            return "DNSKEY";
        case 43:
            return "DS";
        case 55:
            return "HIP";
        case 13:
            return "HINFO";
        case 45:
            return "IPSECKEY";
        case 25:
            return "KEY";
        case 36:
            return "KX";
        case 29:
            return "LOC";
        case 15:
            return "MX";
        case 35:
            return "NAPTR";
        case 2:
            return "NS";
        case 47:
            return "NSEC";
        case 50:
            return "NSEC3";
        case 51:
            return "NSEC3PARAM";
        case 12:
            return "PTR";
        case 46:
            return "RRSIG";
        case 17:
            return "RP";
        case 24:
            return "SIG";
        case 6:
            return "SOA";
        case 99:
            return "SPF";
        case 33:
            return "SRV";
        case 44:
            return "SSHFP";
        case 32768:
            return "TA";
        case 249:
            return "TKEY";
        case 52:
            return "TLSA";
        case 250:
            return "TSIG";
        case 16:
            return "TXT";
        case 252:
            return "AXFR";
        case 251:
            return "IXFR";
        case 41:
            return "OPT";
        case 255:
            return "ANY";
        case 64:
            return "SVCB";
        case 65:
            return "HTTPS";
    }
    return "UNKNOWN_" + type;
}
function toType(name) {
    switch(name.toUpperCase()){
        case "A":
            return 1;
        case "NULL":
            return 10;
        case "AAAA":
            return 28;
        case "AFSDB":
            return 18;
        case "APL":
            return 42;
        case "CAA":
            return 257;
        case "CDNSKEY":
            return 60;
        case "CDS":
            return 59;
        case "CERT":
            return 37;
        case "CNAME":
            return 5;
        case "DHCID":
            return 49;
        case "DLV":
            return 32769;
        case "DNAME":
            return 39;
        case "DNSKEY":
            return 48;
        case "DS":
            return 43;
        case "HIP":
            return 55;
        case "HINFO":
            return 13;
        case "IPSECKEY":
            return 45;
        case "KEY":
            return 25;
        case "KX":
            return 36;
        case "LOC":
            return 29;
        case "MX":
            return 15;
        case "NAPTR":
            return 35;
        case "NS":
            return 2;
        case "NSEC":
            return 47;
        case "NSEC3":
            return 50;
        case "NSEC3PARAM":
            return 51;
        case "PTR":
            return 12;
        case "RRSIG":
            return 46;
        case "RP":
            return 17;
        case "SIG":
            return 24;
        case "SOA":
            return 6;
        case "SPF":
            return 99;
        case "SRV":
            return 33;
        case "SSHFP":
            return 44;
        case "TA":
            return 32768;
        case "TKEY":
            return 249;
        case "TLSA":
            return 52;
        case "TSIG":
            return 250;
        case "TXT":
            return 16;
        case "AXFR":
            return 252;
        case "IXFR":
            return 251;
        case "OPT":
            return 41;
        case "ANY":
            return 255;
        case "*":
            return 255;
        case "SVCB":
            return 64;
        case "HTTPS":
            return 65;
    }
    if (name.toUpperCase().startsWith("UNKNOWN_")) return parseInt(name.slice(8));
    return 0;
}
"use strict";
function toString1(rcode) {
    switch(rcode){
        case 0:
            return "NOERROR";
        case 1:
            return "FORMERR";
        case 2:
            return "SERVFAIL";
        case 3:
            return "NXDOMAIN";
        case 4:
            return "NOTIMP";
        case 5:
            return "REFUSED";
        case 6:
            return "YXDOMAIN";
        case 7:
            return "YXRRSET";
        case 8:
            return "NXRRSET";
        case 9:
            return "NOTAUTH";
        case 10:
            return "NOTZONE";
        case 11:
            return "RCODE_11";
        case 12:
            return "RCODE_12";
        case 13:
            return "RCODE_13";
        case 14:
            return "RCODE_14";
        case 15:
            return "RCODE_15";
    }
    return "RCODE_" + rcode;
}
"use strict";
function toString2(opcode) {
    switch(opcode){
        case 0:
            return "QUERY";
        case 1:
            return "IQUERY";
        case 2:
            return "STATUS";
        case 3:
            return "OPCODE_3";
        case 4:
            return "NOTIFY";
        case 5:
            return "UPDATE";
        case 6:
            return "OPCODE_6";
        case 7:
            return "OPCODE_7";
        case 8:
            return "OPCODE_8";
        case 9:
            return "OPCODE_9";
        case 10:
            return "OPCODE_10";
        case 11:
            return "OPCODE_11";
        case 12:
            return "OPCODE_12";
        case 13:
            return "OPCODE_13";
        case 14:
            return "OPCODE_14";
        case 15:
            return "OPCODE_15";
    }
    return "OPCODE_" + opcode;
}
"use strict";
function toString3(klass) {
    switch(klass){
        case 1:
            return "IN";
        case 2:
            return "CS";
        case 3:
            return "CH";
        case 4:
            return "HS";
        case 255:
            return "ANY";
    }
    return "UNKNOWN_" + klass;
}
function toClass(name) {
    switch(name.toUpperCase()){
        case "IN":
            return 1;
        case "CS":
            return 2;
        case "CH":
            return 3;
        case "HS":
            return 4;
        case "ANY":
            return 255;
    }
    return 0;
}
"use strict";
function toString4(type) {
    switch(type){
        case 1:
            return "LLQ";
        case 2:
            return "UL";
        case 3:
            return "NSID";
        case 5:
            return "DAU";
        case 6:
            return "DHU";
        case 7:
            return "N3U";
        case 8:
            return "CLIENT_SUBNET";
        case 9:
            return "EXPIRE";
        case 10:
            return "COOKIE";
        case 11:
            return "TCP_KEEPALIVE";
        case 12:
            return "PADDING";
        case 13:
            return "CHAIN";
        case 14:
            return "KEY_TAG";
        case 26946:
            return "DEVICEID";
    }
    if (type < 0) {
        return null;
    }
    return `OPTION_${type}`;
}
function toCode(name) {
    if (typeof name === "number") {
        return name;
    }
    if (!name) {
        return -1;
    }
    switch(name.toUpperCase()){
        case "OPTION_0":
            return 0;
        case "LLQ":
            return 1;
        case "UL":
            return 2;
        case "NSID":
            return 3;
        case "OPTION_4":
            return 4;
        case "DAU":
            return 5;
        case "DHU":
            return 6;
        case "N3U":
            return 7;
        case "CLIENT_SUBNET":
            return 8;
        case "EXPIRE":
            return 9;
        case "COOKIE":
            return 10;
        case "TCP_KEEPALIVE":
            return 11;
        case "PADDING":
            return 12;
        case "CHAIN":
            return 13;
        case "KEY_TAG":
            return 14;
        case "DEVICEID":
            return 26946;
        case "OPTION_65535":
            return 65535;
    }
    const m = name.match(/_(\d+)$/);
    if (m) {
        return parseInt(m[1], 10);
    }
    return -1;
}
"use strict";
function toString5(type) {
    switch(type){
        case 0:
            return "mandatory";
        case 1:
            return "alpn";
        case 2:
            return "no-default-alpn";
        case 3:
            return "port";
        case 4:
            return "ipv4hint";
        case 5:
            return "ech";
        case 6:
            return "ipv6hint";
    }
    return "key" + type;
}
function toKey(name) {
    switch(name.toLowerCase()){
        case "mandatory":
            return 0;
        case "alpn":
            return 1;
        case "no-default-alpn":
            return 2;
        case "port":
            return 3;
        case "ipv4hint":
            return 4;
        case "ech":
            return 5;
        case "ipv6hint":
            return 6;
    }
    if (name.toLowerCase().startsWith("key")) return parseInt(name.slice(3));
    throw "Invalid svcparam key";
}
const hexTable = new TextEncoder().encode("0123456789abcdef");
function errInvalidByte(__byte) {
    return new TypeError(`Invalid byte '${String.fromCharCode(__byte)}'`);
}
function errLength() {
    return new RangeError("Odd length hex string");
}
function fromHexChar(__byte) {
    if (48 <= __byte && __byte <= 57) return __byte - 48;
    if (97 <= __byte && __byte <= 102) return __byte - 97 + 10;
    if (65 <= __byte && __byte <= 70) return __byte - 65 + 10;
    throw errInvalidByte(__byte);
}
function encode(src) {
    const dst = new Uint8Array(src.length * 2);
    for(let i = 0; i < dst.length; i++){
        const v = src[i];
        dst[i * 2] = hexTable[v >> 4];
        dst[i * 2 + 1] = hexTable[v & 15];
    }
    return dst;
}
function decode(src) {
    const dst = new Uint8Array(src.length / 2);
    for(let i = 0; i < dst.length; i++){
        const a = fromHexChar(src[i * 2]);
        const b = fromHexChar(src[i * 2 + 1]);
        dst[i] = a << 4 | b;
    }
    if (src.length % 2 == 1) {
        fromHexChar(src[dst.length * 2]);
        throw errLength();
    }
    return dst;
}
const base64abc = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/"
];
function encode1(data) {
    const uint8 = typeof data === "string" ? new TextEncoder().encode(data) : data instanceof Uint8Array ? data : new Uint8Array(data);
    let result = "", i;
    const l = uint8.length;
    for(i = 2; i < l; i += 3){
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 15) << 2 | uint8[i] >> 6];
        result += base64abc[uint8[i] & 63];
    }
    if (i === l + 1) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 3) << 4];
        result += "==";
    }
    if (i === l) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 3) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 15) << 2];
        result += "=";
    }
    return result;
}
function decode1(b64) {
    const binString = atob(b64);
    const size = binString.length;
    const bytes = new Uint8Array(size);
    for(let i = 0; i < size; i++){
        bytes[i] = binString.charCodeAt(i);
    }
    return bytes;
}
const { Deno: Deno1  } = globalThis;
typeof Deno1?.noColor === "boolean" ? Deno1.noColor : true;
new RegExp([
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))", 
].join("|"), "g");
var DiffType;
(function(DiffType) {
    DiffType["removed"] = "removed";
    DiffType["common"] = "common";
    DiffType["added"] = "added";
})(DiffType || (DiffType = {
}));
class AssertionError extends Error {
    name = "AssertionError";
    constructor(message){
        super(message);
    }
}
function unreachable() {
    throw new AssertionError("unreachable");
}
function notImplemented(msg) {
    const message = msg ? `Not implemented: ${msg}` : "Not implemented";
    throw new Error(message);
}
function normalizeEncoding(enc) {
    if (enc == null || enc === "utf8" || enc === "utf-8") return "utf8";
    return slowCases(enc);
}
function slowCases(enc) {
    switch(enc.length){
        case 4:
            if (enc === "UTF8") return "utf8";
            if (enc === "ucs2" || enc === "UCS2") return "utf16le";
            enc = `${enc}`.toLowerCase();
            if (enc === "utf8") return "utf8";
            if (enc === "ucs2") return "utf16le";
            break;
        case 3:
            if (enc === "hex" || enc === "HEX" || `${enc}`.toLowerCase() === "hex") {
                return "hex";
            }
            break;
        case 5:
            if (enc === "ascii") return "ascii";
            if (enc === "ucs-2") return "utf16le";
            if (enc === "UTF-8") return "utf8";
            if (enc === "ASCII") return "ascii";
            if (enc === "UCS-2") return "utf16le";
            enc = `${enc}`.toLowerCase();
            if (enc === "utf-8") return "utf8";
            if (enc === "ascii") return "ascii";
            if (enc === "ucs-2") return "utf16le";
            break;
        case 6:
            if (enc === "base64") return "base64";
            if (enc === "latin1" || enc === "binary") return "latin1";
            if (enc === "BASE64") return "base64";
            if (enc === "LATIN1" || enc === "BINARY") return "latin1";
            enc = `${enc}`.toLowerCase();
            if (enc === "base64") return "base64";
            if (enc === "latin1" || enc === "binary") return "latin1";
            break;
        case 7:
            if (enc === "utf16le" || enc === "UTF16LE" || `${enc}`.toLowerCase() === "utf16le") {
                return "utf16le";
            }
            break;
        case 8:
            if (enc === "utf-16le" || enc === "UTF-16LE" || `${enc}`.toLowerCase() === "utf-16le") {
                return "utf16le";
            }
            break;
        default:
            if (enc === "") return "utf8";
    }
}
const kCustomPromisifiedSymbol = Symbol.for("nodejs.util.promisify.custom");
const kCustomPromisifyArgsSymbol = Symbol.for("nodejs.util.promisify.customArgs");
class NodeInvalidArgTypeError extends TypeError {
    code = "ERR_INVALID_ARG_TYPE";
    constructor(argumentName, type, received){
        super(`The "${argumentName}" argument must be of type ${type}. Received ${typeof received}`);
    }
}
function promisify(original) {
    if (typeof original !== "function") {
        throw new NodeInvalidArgTypeError("original", "Function", original);
    }
    if (original[kCustomPromisifiedSymbol]) {
        const fn = original[kCustomPromisifiedSymbol];
        if (typeof fn !== "function") {
            throw new NodeInvalidArgTypeError("util.promisify.custom", "Function", fn);
        }
        return Object.defineProperty(fn, kCustomPromisifiedSymbol, {
            value: fn,
            enumerable: false,
            writable: false,
            configurable: true
        });
    }
    const argumentNames = original[kCustomPromisifyArgsSymbol];
    function fn(...args) {
        return new Promise((resolve, reject)=>{
            original.call(this, ...args, (err, ...values)=>{
                if (err) {
                    return reject(err);
                }
                if (argumentNames !== undefined && values.length > 1) {
                    const obj = {
                    };
                    for(let i = 0; i < argumentNames.length; i++){
                        obj[argumentNames[i]] = values[i];
                    }
                    resolve(obj);
                } else {
                    resolve(values[0]);
                }
            });
        });
    }
    Object.setPrototypeOf(fn, Object.getPrototypeOf(original));
    Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn,
        enumerable: false,
        writable: false,
        configurable: true
    });
    return Object.defineProperties(fn, Object.getOwnPropertyDescriptors(original));
}
promisify.custom = kCustomPromisifiedSymbol;
Object.prototype.toString;
const osType = (()=>{
    const { Deno  } = globalThis;
    if (typeof Deno?.build?.os === "string") {
        return Deno.build.os;
    }
    const { navigator  } = globalThis;
    if (navigator?.appVersion?.includes?.("Win") ?? false) {
        return "windows";
    }
    return "linux";
})();
class NodeErrorAbstraction extends Error {
    code;
    constructor(name, code, message){
        super(message);
        this.code = code;
        this.name = name;
        this.stack = this.stack && `${name} [${this.code}]${this.stack.slice(20)}`;
    }
    toString() {
        return `${this.name} [${this.code}]: ${this.message}`;
    }
}
class NodeRangeError extends NodeErrorAbstraction {
    constructor(code, message){
        super(RangeError.prototype.name, code, message);
        Object.setPrototypeOf(this, RangeError.prototype);
    }
}
Number.isSafeInteger;
const DEFAULT_INSPECT_OPTIONS = {
    showHidden: false,
    depth: 2,
    colors: false,
    customInspect: true,
    showProxy: false,
    maxArrayLength: 100,
    maxStringLength: Infinity,
    breakLength: 80,
    compact: 3,
    sorted: false,
    getters: false
};
inspect.defaultOptions = DEFAULT_INSPECT_OPTIONS;
inspect.custom = Symbol.for("nodejs.util.inspect.custom");
function inspect(object, ...opts) {
    if (typeof object === "string" && !object.includes("'")) {
        return `'${object}'`;
    }
    opts = {
        ...DEFAULT_INSPECT_OPTIONS,
        ...opts
    };
    return Deno.inspect(object, {
        depth: opts.depth,
        iterableLimit: opts.maxArrayLength,
        compact: !!opts.compact,
        sorted: !!opts.sorted,
        showProxy: !!opts.showProxy
    });
}
class ERR_OUT_OF_RANGE extends RangeError {
    code = "ERR_OUT_OF_RANGE";
    constructor(str, range, received){
        super(`The value of "${str}" is out of range. It must be ${range}. Received ${received}`);
        const { name  } = this;
        this.name = `${name} [${this.code}]`;
        this.stack;
        this.name = name;
    }
}
class ERR_BUFFER_OUT_OF_BOUNDS extends NodeRangeError {
    constructor(name){
        super("ERR_BUFFER_OUT_OF_BOUNDS", name ? `"${name}" is outside of buffer bounds` : "Attempt to access memory outside buffer bounds");
    }
}
const windows = [
    [
        -4093,
        [
            "E2BIG",
            "argument list too long"
        ]
    ],
    [
        -4092,
        [
            "EACCES",
            "permission denied"
        ]
    ],
    [
        -4091,
        [
            "EADDRINUSE",
            "address already in use"
        ]
    ],
    [
        -4090,
        [
            "EADDRNOTAVAIL",
            "address not available"
        ]
    ],
    [
        -4089,
        [
            "EAFNOSUPPORT",
            "address family not supported"
        ]
    ],
    [
        -4088,
        [
            "EAGAIN",
            "resource temporarily unavailable"
        ]
    ],
    [
        -3000,
        [
            "EAI_ADDRFAMILY",
            "address family not supported"
        ]
    ],
    [
        -3001,
        [
            "EAI_AGAIN",
            "temporary failure"
        ]
    ],
    [
        -3002,
        [
            "EAI_BADFLAGS",
            "bad ai_flags value"
        ]
    ],
    [
        -3013,
        [
            "EAI_BADHINTS",
            "invalid value for hints"
        ]
    ],
    [
        -3003,
        [
            "EAI_CANCELED",
            "request canceled"
        ]
    ],
    [
        -3004,
        [
            "EAI_FAIL",
            "permanent failure"
        ]
    ],
    [
        -3005,
        [
            "EAI_FAMILY",
            "ai_family not supported"
        ]
    ],
    [
        -3006,
        [
            "EAI_MEMORY",
            "out of memory"
        ]
    ],
    [
        -3007,
        [
            "EAI_NODATA",
            "no address"
        ]
    ],
    [
        -3008,
        [
            "EAI_NONAME",
            "unknown node or service"
        ]
    ],
    [
        -3009,
        [
            "EAI_OVERFLOW",
            "argument buffer overflow"
        ]
    ],
    [
        -3014,
        [
            "EAI_PROTOCOL",
            "resolved protocol is unknown"
        ]
    ],
    [
        -3010,
        [
            "EAI_SERVICE",
            "service not available for socket type"
        ]
    ],
    [
        -3011,
        [
            "EAI_SOCKTYPE",
            "socket type not supported"
        ]
    ],
    [
        -4084,
        [
            "EALREADY",
            "connection already in progress"
        ]
    ],
    [
        -4083,
        [
            "EBADF",
            "bad file descriptor"
        ]
    ],
    [
        -4082,
        [
            "EBUSY",
            "resource busy or locked"
        ]
    ],
    [
        -4081,
        [
            "ECANCELED",
            "operation canceled"
        ]
    ],
    [
        -4080,
        [
            "ECHARSET",
            "invalid Unicode character"
        ]
    ],
    [
        -4079,
        [
            "ECONNABORTED",
            "software caused connection abort"
        ]
    ],
    [
        -4078,
        [
            "ECONNREFUSED",
            "connection refused"
        ]
    ],
    [
        -4077,
        [
            "ECONNRESET",
            "connection reset by peer"
        ]
    ],
    [
        -4076,
        [
            "EDESTADDRREQ",
            "destination address required"
        ]
    ],
    [
        -4075,
        [
            "EEXIST",
            "file already exists"
        ]
    ],
    [
        -4074,
        [
            "EFAULT",
            "bad address in system call argument"
        ]
    ],
    [
        -4036,
        [
            "EFBIG",
            "file too large"
        ]
    ],
    [
        -4073,
        [
            "EHOSTUNREACH",
            "host is unreachable"
        ]
    ],
    [
        -4072,
        [
            "EINTR",
            "interrupted system call"
        ]
    ],
    [
        -4071,
        [
            "EINVAL",
            "invalid argument"
        ]
    ],
    [
        -4070,
        [
            "EIO",
            "i/o error"
        ]
    ],
    [
        -4069,
        [
            "EISCONN",
            "socket is already connected"
        ]
    ],
    [
        -4068,
        [
            "EISDIR",
            "illegal operation on a directory"
        ]
    ],
    [
        -4067,
        [
            "ELOOP",
            "too many symbolic links encountered"
        ]
    ],
    [
        -4066,
        [
            "EMFILE",
            "too many open files"
        ]
    ],
    [
        -4065,
        [
            "EMSGSIZE",
            "message too long"
        ]
    ],
    [
        -4064,
        [
            "ENAMETOOLONG",
            "name too long"
        ]
    ],
    [
        -4063,
        [
            "ENETDOWN",
            "network is down"
        ]
    ],
    [
        -4062,
        [
            "ENETUNREACH",
            "network is unreachable"
        ]
    ],
    [
        -4061,
        [
            "ENFILE",
            "file table overflow"
        ]
    ],
    [
        -4060,
        [
            "ENOBUFS",
            "no buffer space available"
        ]
    ],
    [
        -4059,
        [
            "ENODEV",
            "no such device"
        ]
    ],
    [
        -4058,
        [
            "ENOENT",
            "no such file or directory"
        ]
    ],
    [
        -4057,
        [
            "ENOMEM",
            "not enough memory"
        ]
    ],
    [
        -4056,
        [
            "ENONET",
            "machine is not on the network"
        ]
    ],
    [
        -4035,
        [
            "ENOPROTOOPT",
            "protocol not available"
        ]
    ],
    [
        -4055,
        [
            "ENOSPC",
            "no space left on device"
        ]
    ],
    [
        -4054,
        [
            "ENOSYS",
            "function not implemented"
        ]
    ],
    [
        -4053,
        [
            "ENOTCONN",
            "socket is not connected"
        ]
    ],
    [
        -4052,
        [
            "ENOTDIR",
            "not a directory"
        ]
    ],
    [
        -4051,
        [
            "ENOTEMPTY",
            "directory not empty"
        ]
    ],
    [
        -4050,
        [
            "ENOTSOCK",
            "socket operation on non-socket"
        ]
    ],
    [
        -4049,
        [
            "ENOTSUP",
            "operation not supported on socket"
        ]
    ],
    [
        -4048,
        [
            "EPERM",
            "operation not permitted"
        ]
    ],
    [
        -4047,
        [
            "EPIPE",
            "broken pipe"
        ]
    ],
    [
        -4046,
        [
            "EPROTO",
            "protocol error"
        ]
    ],
    [
        -4045,
        [
            "EPROTONOSUPPORT",
            "protocol not supported"
        ]
    ],
    [
        -4044,
        [
            "EPROTOTYPE",
            "protocol wrong type for socket"
        ]
    ],
    [
        -4034,
        [
            "ERANGE",
            "result too large"
        ]
    ],
    [
        -4043,
        [
            "EROFS",
            "read-only file system"
        ]
    ],
    [
        -4042,
        [
            "ESHUTDOWN",
            "cannot send after transport endpoint shutdown"
        ]
    ],
    [
        -4041,
        [
            "ESPIPE",
            "invalid seek"
        ]
    ],
    [
        -4040,
        [
            "ESRCH",
            "no such process"
        ]
    ],
    [
        -4039,
        [
            "ETIMEDOUT",
            "connection timed out"
        ]
    ],
    [
        -4038,
        [
            "ETXTBSY",
            "text file is busy"
        ]
    ],
    [
        -4037,
        [
            "EXDEV",
            "cross-device link not permitted"
        ]
    ],
    [
        -4094,
        [
            "UNKNOWN",
            "unknown error"
        ]
    ],
    [
        -4095,
        [
            "EOF",
            "end of file"
        ]
    ],
    [
        -4033,
        [
            "ENXIO",
            "no such device or address"
        ]
    ],
    [
        -4032,
        [
            "EMLINK",
            "too many links"
        ]
    ],
    [
        -4031,
        [
            "EHOSTDOWN",
            "host is down"
        ]
    ],
    [
        -4030,
        [
            "EREMOTEIO",
            "remote I/O error"
        ]
    ],
    [
        -4029,
        [
            "ENOTTY",
            "inappropriate ioctl for device"
        ]
    ],
    [
        -4028,
        [
            "EFTYPE",
            "inappropriate file type or format"
        ]
    ],
    [
        -4027,
        [
            "EILSEQ",
            "illegal byte sequence"
        ]
    ], 
];
const darwin = [
    [
        -7,
        [
            "E2BIG",
            "argument list too long"
        ]
    ],
    [
        -13,
        [
            "EACCES",
            "permission denied"
        ]
    ],
    [
        -48,
        [
            "EADDRINUSE",
            "address already in use"
        ]
    ],
    [
        -49,
        [
            "EADDRNOTAVAIL",
            "address not available"
        ]
    ],
    [
        -47,
        [
            "EAFNOSUPPORT",
            "address family not supported"
        ]
    ],
    [
        -35,
        [
            "EAGAIN",
            "resource temporarily unavailable"
        ]
    ],
    [
        -3000,
        [
            "EAI_ADDRFAMILY",
            "address family not supported"
        ]
    ],
    [
        -3001,
        [
            "EAI_AGAIN",
            "temporary failure"
        ]
    ],
    [
        -3002,
        [
            "EAI_BADFLAGS",
            "bad ai_flags value"
        ]
    ],
    [
        -3013,
        [
            "EAI_BADHINTS",
            "invalid value for hints"
        ]
    ],
    [
        -3003,
        [
            "EAI_CANCELED",
            "request canceled"
        ]
    ],
    [
        -3004,
        [
            "EAI_FAIL",
            "permanent failure"
        ]
    ],
    [
        -3005,
        [
            "EAI_FAMILY",
            "ai_family not supported"
        ]
    ],
    [
        -3006,
        [
            "EAI_MEMORY",
            "out of memory"
        ]
    ],
    [
        -3007,
        [
            "EAI_NODATA",
            "no address"
        ]
    ],
    [
        -3008,
        [
            "EAI_NONAME",
            "unknown node or service"
        ]
    ],
    [
        -3009,
        [
            "EAI_OVERFLOW",
            "argument buffer overflow"
        ]
    ],
    [
        -3014,
        [
            "EAI_PROTOCOL",
            "resolved protocol is unknown"
        ]
    ],
    [
        -3010,
        [
            "EAI_SERVICE",
            "service not available for socket type"
        ]
    ],
    [
        -3011,
        [
            "EAI_SOCKTYPE",
            "socket type not supported"
        ]
    ],
    [
        -37,
        [
            "EALREADY",
            "connection already in progress"
        ]
    ],
    [
        -9,
        [
            "EBADF",
            "bad file descriptor"
        ]
    ],
    [
        -16,
        [
            "EBUSY",
            "resource busy or locked"
        ]
    ],
    [
        -89,
        [
            "ECANCELED",
            "operation canceled"
        ]
    ],
    [
        -4080,
        [
            "ECHARSET",
            "invalid Unicode character"
        ]
    ],
    [
        -53,
        [
            "ECONNABORTED",
            "software caused connection abort"
        ]
    ],
    [
        -61,
        [
            "ECONNREFUSED",
            "connection refused"
        ]
    ],
    [
        -54,
        [
            "ECONNRESET",
            "connection reset by peer"
        ]
    ],
    [
        -39,
        [
            "EDESTADDRREQ",
            "destination address required"
        ]
    ],
    [
        -17,
        [
            "EEXIST",
            "file already exists"
        ]
    ],
    [
        -14,
        [
            "EFAULT",
            "bad address in system call argument"
        ]
    ],
    [
        -27,
        [
            "EFBIG",
            "file too large"
        ]
    ],
    [
        -65,
        [
            "EHOSTUNREACH",
            "host is unreachable"
        ]
    ],
    [
        -4,
        [
            "EINTR",
            "interrupted system call"
        ]
    ],
    [
        -22,
        [
            "EINVAL",
            "invalid argument"
        ]
    ],
    [
        -5,
        [
            "EIO",
            "i/o error"
        ]
    ],
    [
        -56,
        [
            "EISCONN",
            "socket is already connected"
        ]
    ],
    [
        -21,
        [
            "EISDIR",
            "illegal operation on a directory"
        ]
    ],
    [
        -62,
        [
            "ELOOP",
            "too many symbolic links encountered"
        ]
    ],
    [
        -24,
        [
            "EMFILE",
            "too many open files"
        ]
    ],
    [
        -40,
        [
            "EMSGSIZE",
            "message too long"
        ]
    ],
    [
        -63,
        [
            "ENAMETOOLONG",
            "name too long"
        ]
    ],
    [
        -50,
        [
            "ENETDOWN",
            "network is down"
        ]
    ],
    [
        -51,
        [
            "ENETUNREACH",
            "network is unreachable"
        ]
    ],
    [
        -23,
        [
            "ENFILE",
            "file table overflow"
        ]
    ],
    [
        -55,
        [
            "ENOBUFS",
            "no buffer space available"
        ]
    ],
    [
        -19,
        [
            "ENODEV",
            "no such device"
        ]
    ],
    [
        -2,
        [
            "ENOENT",
            "no such file or directory"
        ]
    ],
    [
        -12,
        [
            "ENOMEM",
            "not enough memory"
        ]
    ],
    [
        -4056,
        [
            "ENONET",
            "machine is not on the network"
        ]
    ],
    [
        -42,
        [
            "ENOPROTOOPT",
            "protocol not available"
        ]
    ],
    [
        -28,
        [
            "ENOSPC",
            "no space left on device"
        ]
    ],
    [
        -78,
        [
            "ENOSYS",
            "function not implemented"
        ]
    ],
    [
        -57,
        [
            "ENOTCONN",
            "socket is not connected"
        ]
    ],
    [
        -20,
        [
            "ENOTDIR",
            "not a directory"
        ]
    ],
    [
        -66,
        [
            "ENOTEMPTY",
            "directory not empty"
        ]
    ],
    [
        -38,
        [
            "ENOTSOCK",
            "socket operation on non-socket"
        ]
    ],
    [
        -45,
        [
            "ENOTSUP",
            "operation not supported on socket"
        ]
    ],
    [
        -1,
        [
            "EPERM",
            "operation not permitted"
        ]
    ],
    [
        -32,
        [
            "EPIPE",
            "broken pipe"
        ]
    ],
    [
        -100,
        [
            "EPROTO",
            "protocol error"
        ]
    ],
    [
        -43,
        [
            "EPROTONOSUPPORT",
            "protocol not supported"
        ]
    ],
    [
        -41,
        [
            "EPROTOTYPE",
            "protocol wrong type for socket"
        ]
    ],
    [
        -34,
        [
            "ERANGE",
            "result too large"
        ]
    ],
    [
        -30,
        [
            "EROFS",
            "read-only file system"
        ]
    ],
    [
        -58,
        [
            "ESHUTDOWN",
            "cannot send after transport endpoint shutdown"
        ]
    ],
    [
        -29,
        [
            "ESPIPE",
            "invalid seek"
        ]
    ],
    [
        -3,
        [
            "ESRCH",
            "no such process"
        ]
    ],
    [
        -60,
        [
            "ETIMEDOUT",
            "connection timed out"
        ]
    ],
    [
        -26,
        [
            "ETXTBSY",
            "text file is busy"
        ]
    ],
    [
        -18,
        [
            "EXDEV",
            "cross-device link not permitted"
        ]
    ],
    [
        -4094,
        [
            "UNKNOWN",
            "unknown error"
        ]
    ],
    [
        -4095,
        [
            "EOF",
            "end of file"
        ]
    ],
    [
        -6,
        [
            "ENXIO",
            "no such device or address"
        ]
    ],
    [
        -31,
        [
            "EMLINK",
            "too many links"
        ]
    ],
    [
        -64,
        [
            "EHOSTDOWN",
            "host is down"
        ]
    ],
    [
        -4030,
        [
            "EREMOTEIO",
            "remote I/O error"
        ]
    ],
    [
        -25,
        [
            "ENOTTY",
            "inappropriate ioctl for device"
        ]
    ],
    [
        -79,
        [
            "EFTYPE",
            "inappropriate file type or format"
        ]
    ],
    [
        -92,
        [
            "EILSEQ",
            "illegal byte sequence"
        ]
    ], 
];
const linux = [
    [
        -7,
        [
            "E2BIG",
            "argument list too long"
        ]
    ],
    [
        -13,
        [
            "EACCES",
            "permission denied"
        ]
    ],
    [
        -98,
        [
            "EADDRINUSE",
            "address already in use"
        ]
    ],
    [
        -99,
        [
            "EADDRNOTAVAIL",
            "address not available"
        ]
    ],
    [
        -97,
        [
            "EAFNOSUPPORT",
            "address family not supported"
        ]
    ],
    [
        -11,
        [
            "EAGAIN",
            "resource temporarily unavailable"
        ]
    ],
    [
        -3000,
        [
            "EAI_ADDRFAMILY",
            "address family not supported"
        ]
    ],
    [
        -3001,
        [
            "EAI_AGAIN",
            "temporary failure"
        ]
    ],
    [
        -3002,
        [
            "EAI_BADFLAGS",
            "bad ai_flags value"
        ]
    ],
    [
        -3013,
        [
            "EAI_BADHINTS",
            "invalid value for hints"
        ]
    ],
    [
        -3003,
        [
            "EAI_CANCELED",
            "request canceled"
        ]
    ],
    [
        -3004,
        [
            "EAI_FAIL",
            "permanent failure"
        ]
    ],
    [
        -3005,
        [
            "EAI_FAMILY",
            "ai_family not supported"
        ]
    ],
    [
        -3006,
        [
            "EAI_MEMORY",
            "out of memory"
        ]
    ],
    [
        -3007,
        [
            "EAI_NODATA",
            "no address"
        ]
    ],
    [
        -3008,
        [
            "EAI_NONAME",
            "unknown node or service"
        ]
    ],
    [
        -3009,
        [
            "EAI_OVERFLOW",
            "argument buffer overflow"
        ]
    ],
    [
        -3014,
        [
            "EAI_PROTOCOL",
            "resolved protocol is unknown"
        ]
    ],
    [
        -3010,
        [
            "EAI_SERVICE",
            "service not available for socket type"
        ]
    ],
    [
        -3011,
        [
            "EAI_SOCKTYPE",
            "socket type not supported"
        ]
    ],
    [
        -114,
        [
            "EALREADY",
            "connection already in progress"
        ]
    ],
    [
        -9,
        [
            "EBADF",
            "bad file descriptor"
        ]
    ],
    [
        -16,
        [
            "EBUSY",
            "resource busy or locked"
        ]
    ],
    [
        -125,
        [
            "ECANCELED",
            "operation canceled"
        ]
    ],
    [
        -4080,
        [
            "ECHARSET",
            "invalid Unicode character"
        ]
    ],
    [
        -103,
        [
            "ECONNABORTED",
            "software caused connection abort"
        ]
    ],
    [
        -111,
        [
            "ECONNREFUSED",
            "connection refused"
        ]
    ],
    [
        -104,
        [
            "ECONNRESET",
            "connection reset by peer"
        ]
    ],
    [
        -89,
        [
            "EDESTADDRREQ",
            "destination address required"
        ]
    ],
    [
        -17,
        [
            "EEXIST",
            "file already exists"
        ]
    ],
    [
        -14,
        [
            "EFAULT",
            "bad address in system call argument"
        ]
    ],
    [
        -27,
        [
            "EFBIG",
            "file too large"
        ]
    ],
    [
        -113,
        [
            "EHOSTUNREACH",
            "host is unreachable"
        ]
    ],
    [
        -4,
        [
            "EINTR",
            "interrupted system call"
        ]
    ],
    [
        -22,
        [
            "EINVAL",
            "invalid argument"
        ]
    ],
    [
        -5,
        [
            "EIO",
            "i/o error"
        ]
    ],
    [
        -106,
        [
            "EISCONN",
            "socket is already connected"
        ]
    ],
    [
        -21,
        [
            "EISDIR",
            "illegal operation on a directory"
        ]
    ],
    [
        -40,
        [
            "ELOOP",
            "too many symbolic links encountered"
        ]
    ],
    [
        -24,
        [
            "EMFILE",
            "too many open files"
        ]
    ],
    [
        -90,
        [
            "EMSGSIZE",
            "message too long"
        ]
    ],
    [
        -36,
        [
            "ENAMETOOLONG",
            "name too long"
        ]
    ],
    [
        -100,
        [
            "ENETDOWN",
            "network is down"
        ]
    ],
    [
        -101,
        [
            "ENETUNREACH",
            "network is unreachable"
        ]
    ],
    [
        -23,
        [
            "ENFILE",
            "file table overflow"
        ]
    ],
    [
        -105,
        [
            "ENOBUFS",
            "no buffer space available"
        ]
    ],
    [
        -19,
        [
            "ENODEV",
            "no such device"
        ]
    ],
    [
        -2,
        [
            "ENOENT",
            "no such file or directory"
        ]
    ],
    [
        -12,
        [
            "ENOMEM",
            "not enough memory"
        ]
    ],
    [
        -64,
        [
            "ENONET",
            "machine is not on the network"
        ]
    ],
    [
        -92,
        [
            "ENOPROTOOPT",
            "protocol not available"
        ]
    ],
    [
        -28,
        [
            "ENOSPC",
            "no space left on device"
        ]
    ],
    [
        -38,
        [
            "ENOSYS",
            "function not implemented"
        ]
    ],
    [
        -107,
        [
            "ENOTCONN",
            "socket is not connected"
        ]
    ],
    [
        -20,
        [
            "ENOTDIR",
            "not a directory"
        ]
    ],
    [
        -39,
        [
            "ENOTEMPTY",
            "directory not empty"
        ]
    ],
    [
        -88,
        [
            "ENOTSOCK",
            "socket operation on non-socket"
        ]
    ],
    [
        -95,
        [
            "ENOTSUP",
            "operation not supported on socket"
        ]
    ],
    [
        -1,
        [
            "EPERM",
            "operation not permitted"
        ]
    ],
    [
        -32,
        [
            "EPIPE",
            "broken pipe"
        ]
    ],
    [
        -71,
        [
            "EPROTO",
            "protocol error"
        ]
    ],
    [
        -93,
        [
            "EPROTONOSUPPORT",
            "protocol not supported"
        ]
    ],
    [
        -91,
        [
            "EPROTOTYPE",
            "protocol wrong type for socket"
        ]
    ],
    [
        -34,
        [
            "ERANGE",
            "result too large"
        ]
    ],
    [
        -30,
        [
            "EROFS",
            "read-only file system"
        ]
    ],
    [
        -108,
        [
            "ESHUTDOWN",
            "cannot send after transport endpoint shutdown"
        ]
    ],
    [
        -29,
        [
            "ESPIPE",
            "invalid seek"
        ]
    ],
    [
        -3,
        [
            "ESRCH",
            "no such process"
        ]
    ],
    [
        -110,
        [
            "ETIMEDOUT",
            "connection timed out"
        ]
    ],
    [
        -26,
        [
            "ETXTBSY",
            "text file is busy"
        ]
    ],
    [
        -18,
        [
            "EXDEV",
            "cross-device link not permitted"
        ]
    ],
    [
        -4094,
        [
            "UNKNOWN",
            "unknown error"
        ]
    ],
    [
        -4095,
        [
            "EOF",
            "end of file"
        ]
    ],
    [
        -6,
        [
            "ENXIO",
            "no such device or address"
        ]
    ],
    [
        -31,
        [
            "EMLINK",
            "too many links"
        ]
    ],
    [
        -112,
        [
            "EHOSTDOWN",
            "host is down"
        ]
    ],
    [
        -121,
        [
            "EREMOTEIO",
            "remote I/O error"
        ]
    ],
    [
        -25,
        [
            "ENOTTY",
            "inappropriate ioctl for device"
        ]
    ],
    [
        -4028,
        [
            "EFTYPE",
            "inappropriate file type or format"
        ]
    ],
    [
        -84,
        [
            "EILSEQ",
            "illegal byte sequence"
        ]
    ], 
];
new Map(osType === "windows" ? windows : osType === "darwin" ? darwin : osType === "linux" ? linux : unreachable());
const notImplementedEncodings = [
    "ascii",
    "binary",
    "latin1",
    "ucs2",
    "utf16le", 
];
function checkEncoding(encoding = "utf8", strict = true) {
    if (typeof encoding !== "string" || strict && encoding === "") {
        if (!strict) return "utf8";
        throw new TypeError(`Unknown encoding: ${encoding}`);
    }
    const normalized = normalizeEncoding(encoding);
    if (normalized === undefined) {
        throw new TypeError(`Unknown encoding: ${encoding}`);
    }
    if (notImplementedEncodings.includes(encoding)) {
        notImplemented(`"${encoding}" encoding`);
    }
    return normalized;
}
const encodingOps = {
    utf8: {
        byteLength: (string)=>new TextEncoder().encode(string).byteLength
    },
    ucs2: {
        byteLength: (string)=>string.length * 2
    },
    utf16le: {
        byteLength: (string)=>string.length * 2
    },
    latin1: {
        byteLength: (string)=>string.length
    },
    ascii: {
        byteLength: (string)=>string.length
    },
    base64: {
        byteLength: (string)=>base64ByteLength(string, string.length)
    },
    hex: {
        byteLength: (string)=>string.length >>> 1
    }
};
function base64ByteLength(str, bytes) {
    if (str.charCodeAt(bytes - 1) === 61) bytes--;
    if (bytes > 1 && str.charCodeAt(bytes - 1) === 61) bytes--;
    return bytes * 3 >>> 2;
}
class Buffer extends Uint8Array {
    static alloc(size, fill, encoding = "utf8") {
        if (typeof size !== "number") {
            throw new TypeError(`The "size" argument must be of type number. Received type ${typeof size}`);
        }
        const buf = new Buffer(size);
        if (size === 0) return buf;
        let bufFill;
        if (typeof fill === "string") {
            const clearEncoding = checkEncoding(encoding);
            if (typeof fill === "string" && fill.length === 1 && clearEncoding === "utf8") {
                buf.fill(fill.charCodeAt(0));
            } else bufFill = Buffer.from(fill, clearEncoding);
        } else if (typeof fill === "number") {
            buf.fill(fill);
        } else if (fill instanceof Uint8Array) {
            if (fill.length === 0) {
                throw new TypeError(`The argument "value" is invalid. Received ${fill.constructor.name} []`);
            }
            bufFill = fill;
        }
        if (bufFill) {
            if (bufFill.length > buf.length) {
                bufFill = bufFill.subarray(0, buf.length);
            }
            let offset = 0;
            while(offset < size){
                buf.set(bufFill, offset);
                offset += bufFill.length;
                if (offset + bufFill.length >= size) break;
            }
            if (offset !== size) {
                buf.set(bufFill.subarray(0, size - offset), offset);
            }
        }
        return buf;
    }
    static allocUnsafe(size) {
        return new Buffer(size);
    }
    static byteLength(string, encoding = "utf8") {
        if (typeof string != "string") return string.byteLength;
        encoding = normalizeEncoding(encoding) || "utf8";
        return encodingOps[encoding].byteLength(string);
    }
    static concat(list, totalLength) {
        if (totalLength == undefined) {
            totalLength = 0;
            for (const buf of list){
                totalLength += buf.length;
            }
        }
        const buffer = Buffer.allocUnsafe(totalLength);
        let pos = 0;
        for (const item of list){
            let buf;
            if (!(item instanceof Buffer)) {
                buf = Buffer.from(item);
            } else {
                buf = item;
            }
            buf.copy(buffer, pos);
            pos += buf.length;
        }
        return buffer;
    }
    static from(value, offsetOrEncoding, length) {
        const offset = typeof offsetOrEncoding === "string" ? undefined : offsetOrEncoding;
        let encoding = typeof offsetOrEncoding === "string" ? offsetOrEncoding : undefined;
        if (typeof value == "string") {
            encoding = checkEncoding(encoding, false);
            if (encoding === "hex") {
                return new Buffer(decode(new TextEncoder().encode(value)).buffer);
            }
            if (encoding === "base64") return new Buffer(decode1(value).buffer);
            return new Buffer(new TextEncoder().encode(value).buffer);
        }
        return new Buffer(value, offset, length);
    }
    static isBuffer(obj) {
        return obj instanceof Buffer;
    }
    static isEncoding(encoding) {
        return typeof encoding === "string" && encoding.length !== 0 && normalizeEncoding(encoding) !== undefined;
    }
    boundsError(value, length, type) {
        if (Math.floor(value) !== value) {
            throw new ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
        }
        if (length < 0) throw new ERR_BUFFER_OUT_OF_BOUNDS();
        throw new ERR_OUT_OF_RANGE(type || "offset", `>= ${type ? 1 : 0} and <= ${length}`, value);
    }
    readUIntBE(offset = 0, byteLength) {
        if (byteLength === 3 || byteLength === 5 || byteLength === 6) {
            notImplemented(`byteLength ${byteLength}`);
        }
        if (byteLength === 4) return this.readUInt32BE(offset);
        if (byteLength === 2) return this.readUInt16BE(offset);
        if (byteLength === 1) return this.readUInt8(offset);
        this.boundsError(byteLength, 4, "byteLength");
    }
    readUIntLE(offset = 0, byteLength) {
        if (byteLength === 3 || byteLength === 5 || byteLength === 6) {
            notImplemented(`byteLength ${byteLength}`);
        }
        if (byteLength === 4) return this.readUInt32LE(offset);
        if (byteLength === 2) return this.readUInt16LE(offset);
        if (byteLength === 1) return this.readUInt8(offset);
        this.boundsError(byteLength, 4, "byteLength");
    }
    copy(targetBuffer, targetStart = 0, sourceStart = 0, sourceEnd = this.length) {
        const sourceBuffer = this.subarray(sourceStart, sourceEnd).subarray(0, Math.max(0, targetBuffer.length - targetStart));
        if (sourceBuffer.length === 0) return 0;
        targetBuffer.set(sourceBuffer, targetStart);
        return sourceBuffer.length;
    }
    equals(otherBuffer) {
        if (!(otherBuffer instanceof Uint8Array)) {
            throw new TypeError(`The "otherBuffer" argument must be an instance of Buffer or Uint8Array. Received type ${typeof otherBuffer}`);
        }
        if (this === otherBuffer) return true;
        if (this.byteLength !== otherBuffer.byteLength) return false;
        for(let i = 0; i < this.length; i++){
            if (this[i] !== otherBuffer[i]) return false;
        }
        return true;
    }
    readBigInt64BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigInt64(offset);
    }
    readBigInt64LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigInt64(offset, true);
    }
    readBigUInt64BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigUint64(offset);
    }
    readBigUInt64LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getBigUint64(offset, true);
    }
    readDoubleBE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat64(offset);
    }
    readDoubleLE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat64(offset, true);
    }
    readFloatBE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat32(offset);
    }
    readFloatLE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getFloat32(offset, true);
    }
    readInt8(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt8(offset);
    }
    readInt16BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt16(offset);
    }
    readInt16LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt16(offset, true);
    }
    readInt32BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt32(offset);
    }
    readInt32LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getInt32(offset, true);
    }
    readUInt8(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint8(offset);
    }
    readUInt16BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint16(offset);
    }
    readUInt16LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint16(offset, true);
    }
    readUInt32BE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint32(offset);
    }
    readUInt32LE(offset = 0) {
        return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint32(offset, true);
    }
    slice(begin = 0, end = this.length) {
        return this.subarray(begin, end);
    }
    toJSON() {
        return {
            type: "Buffer",
            data: Array.from(this)
        };
    }
    toString(encoding = "utf8", start = 0, end = this.length) {
        encoding = checkEncoding(encoding);
        const b = this.subarray(start, end);
        if (encoding === "hex") return new TextDecoder().decode(encode(b));
        if (encoding === "base64") return encode1(b);
        return new TextDecoder(encoding).decode(b);
    }
    write(string, offset = 0, length = this.length) {
        return new TextEncoder().encodeInto(string, this.subarray(offset, offset + length)).written;
    }
    writeBigInt64BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigInt64(offset, value);
        return offset + 4;
    }
    writeBigInt64LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigInt64(offset, value, true);
        return offset + 4;
    }
    writeBigUInt64BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigUint64(offset, value);
        return offset + 4;
    }
    writeBigUInt64LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setBigUint64(offset, value, true);
        return offset + 4;
    }
    writeDoubleBE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat64(offset, value);
        return offset + 8;
    }
    writeDoubleLE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat64(offset, value, true);
        return offset + 8;
    }
    writeFloatBE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat32(offset, value);
        return offset + 4;
    }
    writeFloatLE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setFloat32(offset, value, true);
        return offset + 4;
    }
    writeInt8(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt8(offset, value);
        return offset + 1;
    }
    writeInt16BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt16(offset, value);
        return offset + 2;
    }
    writeInt16LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt16(offset, value, true);
        return offset + 2;
    }
    writeInt32BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value);
        return offset + 4;
    }
    writeInt32LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setInt32(offset, value, true);
        return offset + 4;
    }
    writeUInt8(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint8(offset, value);
        return offset + 1;
    }
    writeUInt16BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint16(offset, value);
        return offset + 2;
    }
    writeUInt16LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint16(offset, value, true);
        return offset + 2;
    }
    writeUInt32BE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value);
        return offset + 4;
    }
    writeUInt32LE(value, offset = 0) {
        new DataView(this.buffer, this.byteOffset, this.byteLength).setUint32(offset, value, true);
        return offset + 4;
    }
}
globalThis.atob;
globalThis.btoa;
"use strict";
const ip = {
};
ip.toBuffer = function(ip, buff, offset) {
    offset = ~~offset;
    var result;
    if (this.isV4Format(ip)) {
        result = buff || new Buffer(offset + 4);
        ip.split(/\./g).map(function(__byte) {
            result[offset++] = parseInt(__byte, 10) & 255;
        });
    } else if (this.isV6Format(ip)) {
        var sections = ip.split(":", 8);
        var i;
        for(i = 0; i < sections.length; i++){
            var isv4 = this.isV4Format(sections[i]);
            var v4Buffer;
            if (isv4) {
                v4Buffer = this.toBuffer(sections[i]);
                sections[i] = v4Buffer.slice(0, 2).toString("hex");
            }
            if (v4Buffer && ++i < 8) {
                sections.splice(i, 0, v4Buffer.slice(2, 4).toString("hex"));
            }
        }
        if (sections[0] === "") {
            while(sections.length < 8)sections.unshift("0");
        } else if (sections[sections.length - 1] === "") {
            while(sections.length < 8)sections.push("0");
        } else if (sections.length < 8) {
            for(i = 0; i < sections.length && sections[i] !== ""; i++);
            var argv = [
                i,
                1
            ];
            for(i = 9 - sections.length; i > 0; i--){
                argv.push("0");
            }
            sections.splice.apply(sections, argv);
        }
        result = buff || new Buffer(offset + 16);
        for(i = 0; i < sections.length; i++){
            var word = parseInt(sections[i], 16);
            result[offset++] = word >> 8 & 255;
            result[offset++] = word & 255;
        }
    }
    if (!result) {
        throw Error("Invalid ip address: " + ip);
    }
    return result;
};
ip.toString = function(buff, offset, length) {
    offset = ~~offset;
    length = length || buff.length - offset;
    var result = [];
    if (length === 4) {
        for(var i = 0; i < length; i++){
            result.push(buff[offset + i]);
        }
        result = result.join(".");
    } else if (length === 16) {
        for(var i = 0; i < length; i += 2){
            result.push(buff.readUInt16BE(offset + i).toString(16));
        }
        result = result.join(":");
        result = result.replace(/(^|:)0(:0)*:0(:|$)/, "$1::$3");
        result = result.replace(/:{3,4}/, "::");
    }
    return result;
};
var ipv4Regex = /^(\d{1,3}\.){3,3}\d{1,3}$/;
var ipv6Regex = /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i;
ip.isV4Format = function(ip) {
    return ipv4Regex.test(ip);
};
ip.isV6Format = function(ip) {
    return ipv6Regex.test(ip);
};
function _normalizeFamily(family) {
    return family ? family.toLowerCase() : "ipv4";
}
ip.fromPrefixLen = function(prefixlen, family) {
    if (prefixlen > 32) {
        family = "ipv6";
    } else {
        family = _normalizeFamily(family);
    }
    var len = 4;
    if (family === "ipv6") {
        len = 16;
    }
    var buff = new Buffer(len);
    for(var i = 0, n = buff.length; i < n; ++i){
        var bits = 8;
        if (prefixlen < 8) {
            bits = prefixlen;
        }
        prefixlen -= bits;
        buff[i] = ~(255 >> bits) & 255;
    }
    return ip.toString(buff);
};
ip.mask = function(addr, mask) {
    addr = ip.toBuffer(addr);
    mask = ip.toBuffer(mask);
    var result = new Buffer(Math.max(addr.length, mask.length));
    var i = 0;
    if (addr.length === mask.length) {
        for(i = 0; i < addr.length; i++){
            result[i] = addr[i] & mask[i];
        }
    } else if (mask.length === 4) {
        for(i = 0; i < mask.length; i++){
            result[i] = addr[addr.length - 4 + i] & mask[i];
        }
    } else {
        for(var i = 0; i < result.length - 6; i++){
            result[i] = 0;
        }
        result[10] = 255;
        result[11] = 255;
        for(i = 0; i < addr.length; i++){
            result[i + 12] = addr[i] & mask[i + 12];
        }
        i = i + 12;
    }
    for(; i < result.length; i++){
        result[i] = 0;
    }
    return ip.toString(result);
};
ip.cidr = function(cidrString) {
    var cidrParts = cidrString.split("/");
    var addr = cidrParts[0];
    if (cidrParts.length !== 2) {
        throw new Error("invalid CIDR subnet: " + addr);
    }
    var mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));
    return ip.mask(addr, mask);
};
ip.subnet = function(addr, mask) {
    var networkAddress = ip.toLong(ip.mask(addr, mask));
    var maskBuffer = ip.toBuffer(mask);
    var maskLength = 0;
    for(var i = 0; i < maskBuffer.length; i++){
        if (maskBuffer[i] === 255) {
            maskLength += 8;
        } else {
            var octet = maskBuffer[i] & 255;
            while(octet){
                octet = octet << 1 & 255;
                maskLength++;
            }
        }
    }
    var numberOfAddresses = Math.pow(2, 32 - maskLength);
    return {
        networkAddress: ip.fromLong(networkAddress),
        firstAddress: numberOfAddresses <= 2 ? ip.fromLong(networkAddress) : ip.fromLong(networkAddress + 1),
        lastAddress: numberOfAddresses <= 2 ? ip.fromLong(networkAddress + numberOfAddresses - 1) : ip.fromLong(networkAddress + numberOfAddresses - 2),
        broadcastAddress: ip.fromLong(networkAddress + numberOfAddresses - 1),
        subnetMask: mask,
        subnetMaskLength: maskLength,
        numHosts: numberOfAddresses <= 2 ? numberOfAddresses : numberOfAddresses - 2,
        length: numberOfAddresses,
        contains: function(other) {
            return networkAddress === ip.toLong(ip.mask(other, mask));
        }
    };
};
ip.cidrSubnet = function(cidrString) {
    var cidrParts = cidrString.split("/");
    var addr = cidrParts[0];
    if (cidrParts.length !== 2) {
        throw new Error("invalid CIDR subnet: " + addr);
    }
    var mask = ip.fromPrefixLen(parseInt(cidrParts[1], 10));
    return ip.subnet(addr, mask);
};
ip.not = function(addr) {
    var buff = ip.toBuffer(addr);
    for(var i = 0; i < buff.length; i++){
        buff[i] = 255 ^ buff[i];
    }
    return ip.toString(buff);
};
ip.or = function(a, b) {
    a = ip.toBuffer(a);
    b = ip.toBuffer(b);
    if (a.length === b.length) {
        for(var i = 0; i < a.length; ++i){
            a[i] |= b[i];
        }
        return ip.toString(a);
    } else {
        var buff = a;
        var other = b;
        if (b.length > a.length) {
            buff = b;
            other = a;
        }
        var offset = buff.length - other.length;
        for(var i = offset; i < buff.length; ++i){
            buff[i] |= other[i - offset];
        }
        return ip.toString(buff);
    }
};
ip.isEqual = function(a, b) {
    a = ip.toBuffer(a);
    b = ip.toBuffer(b);
    if (a.length === b.length) {
        for(var i = 0; i < a.length; i++){
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
    if (b.length === 4) {
        var t = b;
        b = a;
        a = t;
    }
    for(var i = 0; i < 10; i++){
        if (b[i] !== 0) return false;
    }
    var word = b.readUInt16BE(10);
    if (word !== 0 && word !== 65535) return false;
    for(var i = 0; i < 4; i++){
        if (a[i] !== b[i + 12]) return false;
    }
    return true;
};
ip.isPrivate = function(addr) {
    return /^(::f{4}:)?10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^(::f{4}:)?169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(addr) || /^f[cd][0-9a-f]{2}:/i.test(addr) || /^fe80:/i.test(addr) || /^::1$/.test(addr) || /^::$/.test(addr);
};
ip.isPublic = function(addr) {
    return !ip.isPrivate(addr);
};
ip.isLoopback = function(addr) {
    return /^(::f{4}:)?127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})/.test(addr) || /^fe80::1$/.test(addr) || /^::1$/.test(addr) || /^::$/.test(addr);
};
ip.loopback = function(family) {
    family = _normalizeFamily(family);
    if (family !== "ipv4" && family !== "ipv6") {
        throw new Error("family must be ipv4 or ipv6");
    }
    return family === "ipv4" ? "127.0.0.1" : "fe80::1";
};
ip.toLong = function(ip) {
    var ipl = 0;
    ip.split(".").forEach(function(octet) {
        ipl <<= 8;
        ipl += parseInt(octet);
    });
    return ipl >>> 0;
};
ip.fromLong = function(ipl) {
    return (ipl >>> 24) + "." + (ipl >> 16 & 255) + "." + (ipl >> 8 & 255) + "." + (ipl & 255);
};
"use strict";
const QUERY_FLAG = 0;
const RESPONSE_FLAG = 1 << 15;
const FLUSH_MASK = 1 << 15;
const NOT_FLUSH_MASK = ~FLUSH_MASK;
const QU_MASK = 1 << 15;
const NOT_QU_MASK = ~QU_MASK;
const name1 = {
};
name1.encode = function(str, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(name1.encodingLength(str));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const n = str.replace(/^\.|\.$/gm, "");
    if (n.length) {
        const list = n.split(".");
        for(let i = 0; i < list.length; i++){
            const len = buf.write(list[i], offset + 1);
            buf[offset] = len;
            offset += len + 1;
        }
    }
    buf[offset++] = 0;
    name1.encode.bytes = offset - oldOffset;
    return buf;
};
name1.encode.bytes = 0;
name1.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const list = [];
    const oldOffset = offset;
    let len = buf[offset++];
    if (len === 0) {
        name1.decode.bytes = 1;
        return ".";
    }
    if (len >= 192) {
        const res = name1.decode(buf, buf.readUInt16BE(offset - 1) - 49152);
        name1.decode.bytes = 2;
        return res;
    }
    while(len){
        if (len >= 192) {
            list.push(name1.decode(buf, buf.readUInt16BE(offset - 1) - 49152));
            offset++;
            break;
        }
        list.push(buf.toString("utf-8", offset, offset + len));
        offset += len;
        len = buf[offset++];
    }
    name1.decode.bytes = offset - oldOffset;
    return list.join(".");
};
name1.decode.bytes = 0;
name1.encodingLength = function(n) {
    if (n === ".") return 1;
    return Buffer.byteLength(n) + 2;
};
const string1 = {
};
string1.encode = function(s, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(string1.encodingLength(s));
    if (!offset) offset = 0;
    const len = buf.write(s, offset + 1);
    buf[offset] = len;
    string1.encode.bytes = len + 1;
    return buf;
};
string1.encode.bytes = 0;
string1.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const len = buf[offset];
    const s = buf.toString("utf-8", offset + 1, offset + 1 + len);
    string1.decode.bytes = len + 1;
    return s;
};
string1.decode.bytes = 0;
string1.encodingLength = function(s) {
    return Buffer.byteLength(s) + 1;
};
const header = {
};
header.encode = function(h, buf, offset) {
    if (!buf) buf = header.encodingLength(h);
    if (!offset) offset = 0;
    const flags = (h.flags || 0) & 32767;
    const type = h.type === "response" ? RESPONSE_FLAG : QUERY_FLAG;
    buf.writeUInt16BE(h.id || 0, offset);
    buf.writeUInt16BE(flags | type, offset + 2);
    buf.writeUInt16BE(h.questions.length, offset + 4);
    buf.writeUInt16BE(h.answers.length, offset + 6);
    buf.writeUInt16BE(h.authorities.length, offset + 8);
    buf.writeUInt16BE(h.additionals.length, offset + 10);
    return buf;
};
header.encode.bytes = 12;
header.decode = function(buf, offset) {
    if (!offset) offset = 0;
    if (buf.length < 12) throw new Error("Header must be 12 bytes");
    const flags = buf.readUInt16BE(offset + 2);
    return {
        id: buf.readUInt16BE(offset),
        type: flags & RESPONSE_FLAG ? "response" : "query",
        flags: flags & 32767,
        flag_qr: (flags >> 15 & 1) === 1,
        opcode: toString2(flags >> 11 & 15),
        flag_aa: (flags >> 10 & 1) === 1,
        flag_tc: (flags >> 9 & 1) === 1,
        flag_rd: (flags >> 8 & 1) === 1,
        flag_ra: (flags >> 7 & 1) === 1,
        flag_z: (flags >> 6 & 1) === 1,
        flag_ad: (flags >> 5 & 1) === 1,
        flag_cd: (flags >> 4 & 1) === 1,
        rcode: toString1(flags & 15),
        questions: new Array(buf.readUInt16BE(offset + 4)),
        answers: new Array(buf.readUInt16BE(offset + 6)),
        authorities: new Array(buf.readUInt16BE(offset + 8)),
        additionals: new Array(buf.readUInt16BE(offset + 10))
    };
};
header.decode.bytes = 12;
header.encodingLength = function() {
    return 12;
};
const runknown = {
};
runknown.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(runknown.encodingLength(data));
    if (!offset) offset = 0;
    buf.writeUInt16BE(data.length, offset);
    data.copy(buf, offset + 2);
    runknown.encode.bytes = data.length + 2;
    return buf;
};
runknown.encode.bytes = 0;
runknown.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const len = buf.readUInt16BE(offset);
    const data = buf.slice(offset + 2, offset + 2 + len);
    runknown.decode.bytes = len + 2;
    return data;
};
runknown.decode.bytes = 0;
runknown.encodingLength = function(data) {
    return data.length + 2;
};
const rns = {
};
rns.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rns.encodingLength(data));
    if (!offset) offset = 0;
    name1.encode(data, buf, offset + 2);
    buf.writeUInt16BE(name1.encode.bytes, offset);
    rns.encode.bytes = name1.encode.bytes + 2;
    return buf;
};
rns.encode.bytes = 0;
rns.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const len = buf.readUInt16BE(offset);
    const dd = name1.decode(buf, offset + 2);
    rns.decode.bytes = len + 2;
    return dd;
};
rns.decode.bytes = 0;
rns.encodingLength = function(data) {
    return name1.encodingLength(data) + 2;
};
const rsoa = {
};
rsoa.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rsoa.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    name1.encode(data.mname, buf, offset);
    offset += name1.encode.bytes;
    name1.encode(data.rname, buf, offset);
    offset += name1.encode.bytes;
    buf.writeUInt32BE(data.serial || 0, offset);
    offset += 4;
    buf.writeUInt32BE(data.refresh || 0, offset);
    offset += 4;
    buf.writeUInt32BE(data.retry || 0, offset);
    offset += 4;
    buf.writeUInt32BE(data.expire || 0, offset);
    offset += 4;
    buf.writeUInt32BE(data.minimum || 0, offset);
    offset += 4;
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rsoa.encode.bytes = offset - oldOffset;
    return buf;
};
rsoa.encode.bytes = 0;
rsoa.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const data = {
    };
    offset += 2;
    data.mname = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    data.rname = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    data.serial = buf.readUInt32BE(offset);
    offset += 4;
    data.refresh = buf.readUInt32BE(offset);
    offset += 4;
    data.retry = buf.readUInt32BE(offset);
    offset += 4;
    data.expire = buf.readUInt32BE(offset);
    offset += 4;
    data.minimum = buf.readUInt32BE(offset);
    offset += 4;
    rsoa.decode.bytes = offset - oldOffset;
    return data;
};
rsoa.decode.bytes = 0;
rsoa.encodingLength = function(data) {
    return 22 + name1.encodingLength(data.mname) + name1.encodingLength(data.rname);
};
const rtxt = {
};
rtxt.encode = function(data, buf, offset) {
    if (!Array.isArray(data)) data = [
        data
    ];
    for(let i = 0; i < data.length; i++){
        if (typeof data[i] === "string") {
            data[i] = Buffer.from(data[i]);
        }
        if (!Buffer.isBuffer(data[i])) {
            throw new Error("Must be a Buffer");
        }
    }
    if (!buf) buf = Buffer.allocUnsafe(rtxt.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    data.forEach(function(d) {
        buf[offset++] = d.length;
        d.copy(buf, offset, 0, d.length);
        offset += d.length;
    });
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rtxt.encode.bytes = offset - oldOffset;
    return buf;
};
rtxt.encode.bytes = 0;
rtxt.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    let remaining = buf.readUInt16BE(offset);
    offset += 2;
    let data = [];
    while(remaining > 0){
        const len = buf[offset++];
        --remaining;
        if (remaining < len) {
            throw new Error("Buffer overflow");
        }
        data.push(buf.slice(offset, offset + len));
        offset += len;
        remaining -= len;
    }
    rtxt.decode.bytes = offset - oldOffset;
    return data;
};
rtxt.decode.bytes = 0;
rtxt.encodingLength = function(data) {
    if (!Array.isArray(data)) data = [
        data
    ];
    let length = 2;
    data.forEach(function(buf) {
        if (typeof buf === "string") {
            length += Buffer.byteLength(buf) + 1;
        } else {
            length += buf.length + 1;
        }
    });
    return length;
};
const rnull = {
};
rnull.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rnull.encodingLength(data));
    if (!offset) offset = 0;
    if (typeof data === "string") data = Buffer.from(data);
    if (!data) data = Buffer.allocUnsafe(0);
    const oldOffset = offset;
    offset += 2;
    const len = data.length;
    data.copy(buf, offset, 0, len);
    offset += len;
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rnull.encode.bytes = offset - oldOffset;
    return buf;
};
rnull.encode.bytes = 0;
rnull.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const len = buf.readUInt16BE(offset);
    offset += 2;
    const data = buf.slice(offset, offset + len);
    offset += len;
    rnull.decode.bytes = offset - oldOffset;
    return data;
};
rnull.decode.bytes = 0;
rnull.encodingLength = function(data) {
    if (!data) return 2;
    return (Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data)) + 2;
};
const rhinfo = {
};
rhinfo.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rhinfo.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    string1.encode(data.cpu, buf, offset);
    offset += string1.encode.bytes;
    string1.encode(data.os, buf, offset);
    offset += string1.encode.bytes;
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rhinfo.encode.bytes = offset - oldOffset;
    return buf;
};
rhinfo.encode.bytes = 0;
rhinfo.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const data = {
    };
    offset += 2;
    data.cpu = string1.decode(buf, offset);
    offset += string1.decode.bytes;
    data.os = string1.decode(buf, offset);
    offset += string1.decode.bytes;
    rhinfo.decode.bytes = offset - oldOffset;
    return data;
};
rhinfo.decode.bytes = 0;
rhinfo.encodingLength = function(data) {
    return string1.encodingLength(data.cpu) + string1.encodingLength(data.os) + 2;
};
const rptr = {
};
const rcname = rptr;
const rdname = rptr;
rptr.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rptr.encodingLength(data));
    if (!offset) offset = 0;
    name1.encode(data, buf, offset + 2);
    buf.writeUInt16BE(name1.encode.bytes, offset);
    rptr.encode.bytes = name1.encode.bytes + 2;
    return buf;
};
rptr.encode.bytes = 0;
rptr.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const data = name1.decode(buf, offset + 2);
    rptr.decode.bytes = name1.decode.bytes + 2;
    return data;
};
rptr.decode.bytes = 0;
rptr.encodingLength = function(data) {
    return name1.encodingLength(data) + 2;
};
const rsrv = {
};
rsrv.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rsrv.encodingLength(data));
    if (!offset) offset = 0;
    buf.writeUInt16BE(data.priority || 0, offset + 2);
    buf.writeUInt16BE(data.weight || 0, offset + 4);
    buf.writeUInt16BE(data.port || 0, offset + 6);
    name1.encode(data.target, buf, offset + 8);
    const len = name1.encode.bytes + 6;
    buf.writeUInt16BE(len, offset);
    rsrv.encode.bytes = len + 2;
    return buf;
};
rsrv.encode.bytes = 0;
rsrv.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const len = buf.readUInt16BE(offset);
    const data = {
    };
    data.priority = buf.readUInt16BE(offset + 2);
    data.weight = buf.readUInt16BE(offset + 4);
    data.port = buf.readUInt16BE(offset + 6);
    data.target = name1.decode(buf, offset + 8);
    rsrv.decode.bytes = len + 2;
    return data;
};
rsrv.decode.bytes = 0;
rsrv.encodingLength = function(data) {
    return 8 + name1.encodingLength(data.target);
};
const rcaa = {
};
rcaa.ISSUER_CRITICAL = 1 << 7;
rcaa.encode = function(data, buf, offset) {
    const len = rcaa.encodingLength(data);
    if (!buf) buf = Buffer.allocUnsafe(rcaa.encodingLength(data));
    if (!offset) offset = 0;
    if (data.issuerCritical) {
        data.flags = rcaa.ISSUER_CRITICAL;
    }
    buf.writeUInt16BE(len - 2, offset);
    offset += 2;
    buf.writeUInt8(data.flags || 0, offset);
    offset += 1;
    string1.encode(data.tag, buf, offset);
    offset += string1.encode.bytes;
    buf.write(data.value, offset);
    offset += Buffer.byteLength(data.value);
    rcaa.encode.bytes = len;
    return buf;
};
rcaa.encode.bytes = 0;
rcaa.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const len = buf.readUInt16BE(offset);
    offset += 2;
    const oldOffset = offset;
    const data = {
    };
    data.flags = buf.readUInt8(offset);
    offset += 1;
    data.tag = string1.decode(buf, offset);
    offset += string1.decode.bytes;
    data.value = buf.toString("utf-8", offset, oldOffset + len);
    data.issuerCritical = !!(data.flags & rcaa.ISSUER_CRITICAL);
    rcaa.decode.bytes = len + 2;
    return data;
};
rcaa.decode.bytes = 0;
rcaa.encodingLength = function(data) {
    return string1.encodingLength(data.tag) + string1.encodingLength(data.value) + 2;
};
const rmx = {
};
rmx.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rmx.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    buf.writeUInt16BE(data.preference || 0, offset);
    offset += 2;
    name1.encode(data.exchange, buf, offset);
    offset += name1.encode.bytes;
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rmx.encode.bytes = offset - oldOffset;
    return buf;
};
rmx.encode.bytes = 0;
rmx.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const data = {
    };
    offset += 2;
    data.preference = buf.readUInt16BE(offset);
    offset += 2;
    data.exchange = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    rmx.decode.bytes = offset - oldOffset;
    return data;
};
rmx.encodingLength = function(data) {
    return 4 + name1.encodingLength(data.exchange);
};
const ra = {
};
ra.encode = function(host, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(ra.encodingLength(host));
    if (!offset) offset = 0;
    buf.writeUInt16BE(4, offset);
    offset += 2;
    ip.toBuffer(host, buf, offset);
    ra.encode.bytes = 6;
    return buf;
};
ra.encode.bytes = 0;
ra.decode = function(buf, offset) {
    if (!offset) offset = 0;
    offset += 2;
    const host = ip.toString(buf, offset, 4);
    ra.decode.bytes = 6;
    return host;
};
ra.decode.bytes = 0;
ra.encodingLength = function() {
    return 6;
};
const raaaa = {
};
raaaa.encode = function(host, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(raaaa.encodingLength(host));
    if (!offset) offset = 0;
    buf.writeUInt16BE(16, offset);
    offset += 2;
    ip.toBuffer(host, buf, offset);
    raaaa.encode.bytes = 18;
    return buf;
};
raaaa.encode.bytes = 0;
raaaa.decode = function(buf, offset) {
    if (!offset) offset = 0;
    offset += 2;
    const host = ip.toString(buf, offset, 16);
    raaaa.decode.bytes = 18;
    return host;
};
raaaa.decode.bytes = 0;
raaaa.encodingLength = function() {
    return 18;
};
const roption = {
};
roption.encode = function(option, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(roption.encodingLength(option));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const code = toCode(option.code);
    buf.writeUInt16BE(code, offset);
    offset += 2;
    if (option.data) {
        buf.writeUInt16BE(option.data.length, offset);
        offset += 2;
        option.data.copy(buf, offset);
        offset += option.data.length;
    } else {
        switch(code){
            case 8:
                const spl = option.sourcePrefixLength || 0;
                const fam = option.family || (ip.isV4Format(option.ip) ? 1 : 2);
                const ipBuf = ip.toBuffer(option.ip);
                const ipLen = Math.ceil(spl / 8);
                buf.writeUInt16BE(ipLen + 4, offset);
                offset += 2;
                buf.writeUInt16BE(fam, offset);
                offset += 2;
                buf.writeUInt8(spl, offset++);
                buf.writeUInt8(option.scopePrefixLength || 0, offset++);
                ipBuf.copy(buf, offset, 0, ipLen);
                offset += ipLen;
                break;
            case 11:
                if (option.timeout) {
                    buf.writeUInt16BE(2, offset);
                    offset += 2;
                    buf.writeUInt16BE(option.timeout, offset);
                    offset += 2;
                } else {
                    buf.writeUInt16BE(0, offset);
                    offset += 2;
                }
                break;
            case 12:
                const len = option.length || 0;
                buf.writeUInt16BE(len, offset);
                offset += 2;
                buf.fill(0, offset, offset + len);
                offset += len;
                break;
            case 14:
                const tagsLen = option.tags.length * 2;
                buf.writeUInt16BE(tagsLen, offset);
                offset += 2;
                for (const tag of option.tags){
                    buf.writeUInt16BE(tag, offset);
                    offset += 2;
                }
                break;
            default:
                throw new Error(`Unknown roption code: ${option.code}`);
        }
    }
    roption.encode.bytes = offset - oldOffset;
    return buf;
};
roption.encode.bytes = 0;
roption.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const option = {
    };
    option.code = buf.readUInt16BE(offset);
    option.type = toString4(option.code);
    offset += 2;
    const len = buf.readUInt16BE(offset);
    offset += 2;
    option.data = buf.slice(offset, offset + len);
    switch(option.code){
        case 8:
            option.family = buf.readUInt16BE(offset);
            offset += 2;
            option.sourcePrefixLength = buf.readUInt8(offset++);
            option.scopePrefixLength = buf.readUInt8(offset++);
            const padded = Buffer.alloc(option.family === 1 ? 4 : 16);
            buf.copy(padded, 0, offset, offset + len - 4);
            option.ip = ip.toString(padded);
            break;
        case 11:
            if (len > 0) {
                option.timeout = buf.readUInt16BE(offset);
                offset += 2;
            }
            break;
        case 14:
            option.tags = [];
            for(let i = 0; i < len; i += 2){
                option.tags.push(buf.readUInt16BE(offset));
                offset += 2;
            }
    }
    roption.decode.bytes = len + 4;
    return option;
};
roption.decode.bytes = 0;
roption.encodingLength = function(option) {
    if (option.data) {
        return option.data.length + 4;
    }
    const code = toCode(option.code);
    switch(code){
        case 8:
            const spl = option.sourcePrefixLength || 0;
            return Math.ceil(spl / 8) + 8;
        case 11:
            return typeof option.timeout === "number" ? 6 : 4;
        case 12:
            return option.length + 4;
        case 14:
            return 4 + option.tags.length * 2;
    }
    throw new Error(`Unknown roption code: ${option.code}`);
};
const ropt = {
};
ropt.encode = function(options, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(ropt.encodingLength(options));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const rdlen = encodingLengthList(options, roption);
    buf.writeUInt16BE(rdlen, offset);
    offset = encodeList(options, roption, buf, offset + 2);
    ropt.encode.bytes = offset - oldOffset;
    return buf;
};
ropt.encode.bytes = 0;
ropt.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const options = [];
    let rdlen = buf.readUInt16BE(offset);
    offset += 2;
    let o = 0;
    while(rdlen > 0){
        options[o++] = roption.decode(buf, offset);
        offset += roption.decode.bytes;
        rdlen -= roption.decode.bytes;
    }
    ropt.decode.bytes = offset - oldOffset;
    return options;
};
ropt.decode.bytes = 0;
ropt.encodingLength = function(options) {
    return 2 + encodingLengthList(options || [], roption);
};
const rdnskey = {
};
rdnskey.PROTOCOL_DNSSEC = 3;
rdnskey.ZONE_KEY = 128;
rdnskey.SECURE_ENTRYPOINT = 32768;
rdnskey.encode = function(key, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rdnskey.encodingLength(key));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const keydata = key.key;
    if (!Buffer.isBuffer(keydata)) {
        throw new Error("Key must be a Buffer");
    }
    offset += 2;
    buf.writeUInt16BE(key.flags, offset);
    offset += 2;
    buf.writeUInt8(rdnskey.PROTOCOL_DNSSEC, offset);
    offset += 1;
    buf.writeUInt8(key.algorithm, offset);
    offset += 1;
    keydata.copy(buf, offset, 0, keydata.length);
    offset += keydata.length;
    rdnskey.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rdnskey.encode.bytes - 2, oldOffset);
    return buf;
};
rdnskey.encode.bytes = 0;
rdnskey.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var key = {
    };
    var length = buf.readUInt16BE(offset);
    offset += 2;
    key.flags = buf.readUInt16BE(offset);
    offset += 2;
    if (buf.readUInt8(offset) !== rdnskey.PROTOCOL_DNSSEC) {
        throw new Error("Protocol must be 3");
    }
    offset += 1;
    key.algorithm = buf.readUInt8(offset);
    offset += 1;
    key.key = buf.slice(offset, oldOffset + length + 2);
    offset += key.key.length;
    rdnskey.decode.bytes = offset - oldOffset;
    return key;
};
rdnskey.decode.bytes = 0;
rdnskey.encodingLength = function(key) {
    return 6 + Buffer.byteLength(key.key);
};
const rrrsig = {
};
rrrsig.encode = function(sig, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rrrsig.encodingLength(sig));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const signature = sig.signature;
    if (!Buffer.isBuffer(signature)) {
        throw new Error("Signature must be a Buffer");
    }
    offset += 2;
    buf.writeUInt16BE(toType(sig.typeCovered), offset);
    offset += 2;
    buf.writeUInt8(sig.algorithm, offset);
    offset += 1;
    buf.writeUInt8(sig.labels, offset);
    offset += 1;
    buf.writeUInt32BE(sig.originalTTL, offset);
    offset += 4;
    buf.writeUInt32BE(sig.expiration, offset);
    offset += 4;
    buf.writeUInt32BE(sig.inception, offset);
    offset += 4;
    buf.writeUInt16BE(sig.keyTag, offset);
    offset += 2;
    name1.encode(sig.signersName, buf, offset);
    offset += name1.encode.bytes;
    signature.copy(buf, offset, 0, signature.length);
    offset += signature.length;
    rrrsig.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rrrsig.encode.bytes - 2, oldOffset);
    return buf;
};
rrrsig.encode.bytes = 0;
rrrsig.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var sig = {
    };
    var length = buf.readUInt16BE(offset);
    offset += 2;
    sig.typeCovered = toString(buf.readUInt16BE(offset));
    offset += 2;
    sig.algorithm = buf.readUInt8(offset);
    offset += 1;
    sig.labels = buf.readUInt8(offset);
    offset += 1;
    sig.originalTTL = buf.readUInt32BE(offset);
    offset += 4;
    sig.expiration = buf.readUInt32BE(offset);
    offset += 4;
    sig.inception = buf.readUInt32BE(offset);
    offset += 4;
    sig.keyTag = buf.readUInt16BE(offset);
    offset += 2;
    sig.signersName = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    sig.signature = buf.slice(offset, oldOffset + length + 2);
    offset += sig.signature.length;
    rrrsig.decode.bytes = offset - oldOffset;
    return sig;
};
rrrsig.decode.bytes = 0;
rrrsig.encodingLength = function(sig) {
    return 20 + name1.encodingLength(sig.signersName) + Buffer.byteLength(sig.signature);
};
const rrp = {
};
rrp.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rrp.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    name1.encode(data.mbox || ".", buf, offset);
    offset += name1.encode.bytes;
    name1.encode(data.txt || ".", buf, offset);
    offset += name1.encode.bytes;
    rrp.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rrp.encode.bytes - 2, oldOffset);
    return buf;
};
rrp.encode.bytes = 0;
rrp.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const data = {
    };
    offset += 2;
    data.mbox = name1.decode(buf, offset) || ".";
    offset += name1.decode.bytes;
    data.txt = name1.decode(buf, offset) || ".";
    offset += name1.decode.bytes;
    rrp.decode.bytes = offset - oldOffset;
    return data;
};
rrp.decode.bytes = 0;
rrp.encodingLength = function(data) {
    return 2 + name1.encodingLength(data.mbox || ".") + name1.encodingLength(data.txt || ".");
};
const typebitmap = {
};
typebitmap.encode = function(typelist, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(typebitmap.encodingLength(typelist));
    if (!offset) offset = 0;
    const oldOffset = offset;
    var typesByWindow = [];
    for(var i = 0; i < typelist.length; i++){
        var typeid = toType(typelist[i]);
        if (typesByWindow[typeid >> 8] === undefined) {
            typesByWindow[typeid >> 8] = [];
        }
        typesByWindow[typeid >> 8][typeid >> 3 & 31] |= 1 << 7 - (typeid & 7);
    }
    for(i = 0; i < typesByWindow.length; i++){
        if (typesByWindow[i] !== undefined) {
            var windowBuf = Buffer.from(typesByWindow[i]);
            buf.writeUInt8(i, offset);
            offset += 1;
            buf.writeUInt8(windowBuf.length, offset);
            offset += 1;
            windowBuf.copy(buf, offset);
            offset += windowBuf.length;
        }
    }
    typebitmap.encode.bytes = offset - oldOffset;
    return buf;
};
typebitmap.encode.bytes = 0;
typebitmap.decode = function(buf, offset, length) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var typelist = [];
    while(offset - oldOffset < length){
        var window = buf.readUInt8(offset);
        offset += 1;
        var windowLength = buf.readUInt8(offset);
        offset += 1;
        for(var i = 0; i < windowLength; i++){
            var b = buf.readUInt8(offset + i);
            for(var j = 0; j < 8; j++){
                if (b & 1 << 7 - j) {
                    var typeid = toString(window << 8 | i << 3 | j);
                    typelist.push(typeid);
                }
            }
        }
        offset += windowLength;
    }
    typebitmap.decode.bytes = offset - oldOffset;
    return typelist;
};
typebitmap.decode.bytes = 0;
typebitmap.encodingLength = function(typelist) {
    var extents = [];
    for(var i = 0; i < typelist.length; i++){
        var typeid = toType(typelist[i]);
        extents[typeid >> 8] = Math.max(extents[typeid >> 8] || 0, typeid & 255);
    }
    var len = 0;
    for(i = 0; i < extents.length; i++){
        if (extents[i] !== undefined) {
            len += 2 + Math.ceil((extents[i] + 1) / 8);
        }
    }
    return len;
};
const rnsec = {
};
rnsec.encode = function(record, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rnsec.encodingLength(record));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    name1.encode(record.nextDomain, buf, offset);
    offset += name1.encode.bytes;
    typebitmap.encode(record.rrtypes, buf, offset);
    offset += typebitmap.encode.bytes;
    rnsec.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rnsec.encode.bytes - 2, oldOffset);
    return buf;
};
rnsec.encode.bytes = 0;
rnsec.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var record = {
    };
    var length = buf.readUInt16BE(offset);
    offset += 2;
    record.nextDomain = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    record.rrtypes = typebitmap.decode(buf, offset, length - (offset - oldOffset));
    offset += typebitmap.decode.bytes;
    rnsec.decode.bytes = offset - oldOffset;
    return record;
};
rnsec.decode.bytes = 0;
rnsec.encodingLength = function(record) {
    return 2 + name1.encodingLength(record.nextDomain) + typebitmap.encodingLength(record.rrtypes);
};
const rnsec3 = {
};
rnsec3.encode = function(record, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rnsec3.encodingLength(record));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const salt = record.salt;
    if (!Buffer.isBuffer(salt)) {
        throw new Error("salt must be a Buffer");
    }
    const nextDomain = record.nextDomain;
    if (!Buffer.isBuffer(nextDomain)) {
        throw new Error("nextDomain must be a Buffer");
    }
    offset += 2;
    buf.writeUInt8(record.algorithm, offset);
    offset += 1;
    buf.writeUInt8(record.flags, offset);
    offset += 1;
    buf.writeUInt16BE(record.iterations, offset);
    offset += 2;
    buf.writeUInt8(salt.length, offset);
    offset += 1;
    salt.copy(buf, offset, 0, salt.length);
    offset += salt.length;
    buf.writeUInt8(nextDomain.length, offset);
    offset += 1;
    nextDomain.copy(buf, offset, 0, nextDomain.length);
    offset += nextDomain.length;
    typebitmap.encode(record.rrtypes, buf, offset);
    offset += typebitmap.encode.bytes;
    rnsec3.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rnsec3.encode.bytes - 2, oldOffset);
    return buf;
};
rnsec3.encode.bytes = 0;
rnsec3.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var record = {
    };
    var length = buf.readUInt16BE(offset);
    offset += 2;
    record.algorithm = buf.readUInt8(offset);
    offset += 1;
    record.flags = buf.readUInt8(offset);
    offset += 1;
    record.iterations = buf.readUInt16BE(offset);
    offset += 2;
    const saltLength = buf.readUInt8(offset);
    offset += 1;
    record.salt = buf.slice(offset, offset + saltLength);
    offset += saltLength;
    const hashLength = buf.readUInt8(offset);
    offset += 1;
    record.nextDomain = buf.slice(offset, offset + hashLength);
    offset += hashLength;
    record.rrtypes = typebitmap.decode(buf, offset, length - (offset - oldOffset));
    offset += typebitmap.decode.bytes;
    rnsec3.decode.bytes = offset - oldOffset;
    return record;
};
rnsec3.decode.bytes = 0;
rnsec3.encodingLength = function(record) {
    return 8 + record.salt.length + record.nextDomain.length + typebitmap.encodingLength(record.rrtypes);
};
const rds = {
};
rds.encode = function(digest, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rds.encodingLength(digest));
    if (!offset) offset = 0;
    const oldOffset = offset;
    const digestdata = digest.digest;
    if (!Buffer.isBuffer(digestdata)) {
        throw new Error("Digest must be a Buffer");
    }
    offset += 2;
    buf.writeUInt16BE(digest.keyTag, offset);
    offset += 2;
    buf.writeUInt8(digest.algorithm, offset);
    offset += 1;
    buf.writeUInt8(digest.digestType, offset);
    offset += 1;
    digestdata.copy(buf, offset, 0, digestdata.length);
    offset += digestdata.length;
    rds.encode.bytes = offset - oldOffset;
    buf.writeUInt16BE(rds.encode.bytes - 2, oldOffset);
    return buf;
};
rds.encode.bytes = 0;
rds.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var digest = {
    };
    var length = buf.readUInt16BE(offset);
    offset += 2;
    digest.keyTag = buf.readUInt16BE(offset);
    offset += 2;
    digest.algorithm = buf.readUInt8(offset);
    offset += 1;
    digest.digestType = buf.readUInt8(offset);
    offset += 1;
    digest.digest = buf.slice(offset, oldOffset + length + 2);
    offset += digest.digest.length;
    rds.decode.bytes = offset - oldOffset;
    return digest;
};
rds.decode.bytes = 0;
rds.encodingLength = function(digest) {
    return 6 + Buffer.byteLength(digest.digest);
};
const rhttpsvcb = {
};
rhttpsvcb.decode = function(buf, offset) {
    if (!offset) offset = 0;
    let oldOffset = offset;
    const rLen = buf.readUInt16BE(offset) + 2;
    console.log("Rdata length : " + rLen);
    offset += 2;
    let data = {
    };
    data.svcPriority = buf.readUInt16BE(offset);
    offset += 2;
    data.targetName = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    data.svcParams = {
    };
    let svcKeyDecode;
    let svcParamKey;
    let svcKeyStr;
    while(offset != oldOffset + rLen){
        svcParamKey = buf.readUInt16BE(offset);
        svcKeyStr = toString5(svcParamKey);
        svcKeyDecode = svcbKeyObj(svcKeyStr);
        offset += 2;
        data.svcParams[svcKeyStr] = svcKeyDecode.decode(buf, offset);
        offset += svcKeyDecode.decode.bytes;
    }
    rhttpsvcb.decode.bytes = offset - oldOffset;
    return data;
};
rhttpsvcb.decode.bytes = 0;
rhttpsvcb.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(rhttpsvcb.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    buf.writeUInt16BE(data.svcPriority, offset);
    offset += 2;
    name1.encode(data.targetName, buf, offset);
    offset += name1.encode.bytes;
    let svcbObj;
    for (let key of Object.keys(data.svcParams)){
        buf.writeUInt16BE(toKey(key), offset);
        offset += 2;
        svcbObj = svcbKeyObj(key);
        svcbObj.encode(data.svcParams[key], buf, offset);
        offset += svcbObj.encode.bytes;
    }
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    rhttpsvcb.encode.bytes = offset - oldOffset;
    return buf;
};
rhttpsvcb.encode.bytes = 0;
rhttpsvcb.encodingLength = function(data) {
    var encLen = 4 + name1.encodingLength(data.targetName);
    let svcbObj;
    for (let key of Object.keys(data.svcParams)){
        svcbObj = svcbKeyObj(key);
        encLen += 2 + svcbObj.encodingLength(data.svcParams[key]);
    }
    console.log(encLen);
    return encLen;
};
const svcAlpn = {
};
svcAlpn.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data = [];
    var length = buf.readUInt16BE(offset);
    offset += 2;
    var valueLength = 0;
    while(length != 0){
        valueLength = buf.readUInt8(offset);
        offset += 1;
        length -= 1;
        data.push(buf.toString("utf-8", offset, offset + valueLength));
        offset += valueLength;
        length -= valueLength;
    }
    svcAlpn.decode.bytes = offset - oldOffset;
    return data;
};
svcAlpn.decode.bytes = 0;
svcAlpn.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcAlpn.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    for (let value of data){
        buf.writeUInt8(Buffer.byteLength(value), offset);
        offset += 1;
        offset += buf.write(value, offset);
    }
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    svcAlpn.encode.bytes = offset - oldOffset;
    return buf;
};
svcAlpn.encode.bytes = 0;
svcAlpn.encodingLength = function(data) {
    var encLen = 2;
    for (let value of data){
        encLen += 1 + Buffer.byteLength(value);
    }
    return encLen;
};
const svcIpv6 = {
};
svcIpv6.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data = [];
    var length = buf.readUInt16BE(offset);
    offset += 2;
    while(length != 0){
        data.push(ip.toString(buf, offset, 16));
        offset += 16;
        length -= 16;
    }
    svcIpv6.decode.bytes = offset - oldOffset;
    return data;
};
svcIpv6.decode.bytes = 0;
svcIpv6.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcIpv6.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    buf.writeUInt16BE(data.length * 16, offset);
    offset += 2;
    for (let value of data){
        ip.toBuffer(value, buf, offset);
        offset += 16;
    }
    svcIpv6.encode.bytes = offset - oldOffset;
    return buf;
};
svcIpv6.encode.bytes = 0;
svcIpv6.encodingLength = function(data) {
    return 2 + data.length * 16;
};
const svcIpv4 = {
};
svcIpv4.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data = [];
    var length = buf.readUInt16BE(offset);
    offset += 2;
    while(length != 0){
        data.push(ip.toString(buf, offset, 4));
        offset += 4;
        length -= 4;
    }
    svcIpv4.decode.bytes = offset - oldOffset;
    return data;
};
svcIpv4.decode.bytes = 0;
svcIpv4.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcIpv4.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    buf.writeUInt16BE(data.length * 4, offset);
    offset += 2;
    for (let value of data){
        ip.toBuffer(value, buf, offset);
        offset += 4;
    }
    svcIpv4.encode.bytes = offset - oldOffset;
    return buf;
};
svcIpv4.encode.bytes = 0;
svcIpv4.encodingLength = function(data) {
    return 2 + data.length * 4;
};
const svcMandatory = {
};
svcMandatory.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data = [];
    var length = buf.readUInt16BE(offset);
    offset += 2;
    while(length != 0){
        data.push(toString5(buf.readUInt16BE(offset)));
        offset += 2;
        length -= 2;
    }
    svcMandatory.decode.bytes = offset - oldOffset;
    return data;
};
svcMandatory.decode.bytes = 0;
svcMandatory.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcMandatory.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    buf.writeUInt16BE(data.length * 2, offset);
    offset += 2;
    for (let value of data){
        buf.writeUInt16BE(toKey(value), offset);
        offset += 2;
    }
    svcMandatory.encode.bytes = offset - oldOffset;
    return buf;
};
svcMandatory.encode.bytes = 0;
svcMandatory.encodingLength = function(data) {
    return 2 + data.length * 2;
};
const svcPort = {
};
svcPort.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data = [];
    var length = buf.readUInt16BE(offset);
    offset += 2;
    while(length != 0){
        data.push(buf.readUInt16BE(offset));
        offset += 2;
        length -= 2;
    }
    svcPort.decode.bytes = offset - oldOffset;
    return data;
};
svcPort.decode.bytes = 0;
svcPort.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcPort.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    buf.writeUInt16BE(data.length * 2, offset);
    offset += 2;
    for (let value of data){
        buf.writeUInt16BE(value, offset);
        offset += 2;
    }
    svcPort.encode.bytes = offset - oldOffset;
    return buf;
};
svcPort.encode.bytes = 0;
svcPort.encodingLength = function(data) {
    return 2 + data.length * 2;
};
const svcEch = {
};
svcEch.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data;
    var length = buf.readUInt16BE(offset);
    offset += 2;
    data = buf.toString("base64", offset, offset + length);
    offset += length;
    svcEch.decode.bytes = offset - oldOffset;
    return data;
};
svcEch.decode.bytes = 0;
svcEch.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcEch.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    offset += 2;
    offset += buf.write(data, offset, "base64");
    buf.writeUInt16BE(offset - oldOffset - 2, oldOffset);
    svcEch.encode.bytes = offset - oldOffset;
    return buf;
};
svcEch.encode.bytes = 0;
svcEch.encodingLength = function(data) {
    return 2 + Buffer.from(data, "base64").byteLength;
};
const svcOther = {
};
svcOther.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    var data;
    var length = buf.readUInt16BE(offset);
    offset += 2;
    data = buf.slice(offset, offset + length);
    offset += length;
    svcOther.decode.bytes = offset - oldOffset;
    return data;
};
svcOther.decode.bytes = 0;
svcOther.encode = function(data, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(svcOther.encodingLength(data));
    if (!offset) offset = 0;
    const oldOffset = offset;
    buf.writeUInt16BE(data.byteLength, offset);
    offset += 2;
    offset += data.copy(buf, offset);
    svcOther.encode.bytes = offset - oldOffset;
    return buf;
};
svcOther.encode.bytes = 0;
svcOther.encodingLength = function(data) {
    return 2 + data.byteLength;
};
const svcbKeyObj = function(type) {
    switch(type.toLowerCase()){
        case "mandatory":
            return svcMandatory;
        case "alpn":
            return svcAlpn;
        case "no-default-alpn":
            return svcAlpn;
        case "port":
            return svcPort;
        case "ipv4hint":
            return svcIpv4;
        case "ech":
            return svcEch;
        case "ipv6hint":
            return svcIpv6;
        default:
            return svcOther;
    }
};
const renc = function(type) {
    switch(type.toUpperCase()){
        case "A":
            return ra;
        case "PTR":
            return rptr;
        case "CNAME":
            return rcname;
        case "DNAME":
            return rdname;
        case "TXT":
            return rtxt;
        case "NULL":
            return rnull;
        case "AAAA":
            return raaaa;
        case "SRV":
            return rsrv;
        case "HINFO":
            return rhinfo;
        case "CAA":
            return rcaa;
        case "NS":
            return rns;
        case "SOA":
            return rsoa;
        case "MX":
            return rmx;
        case "OPT":
            return ropt;
        case "DNSKEY":
            return rdnskey;
        case "RRSIG":
            return rrrsig;
        case "RP":
            return rrp;
        case "NSEC":
            return rnsec;
        case "NSEC3":
            return rnsec3;
        case "DS":
            return rds;
        case "HTTPS":
            return rhttpsvcb;
        case "SVCB":
            return rhttpsvcb;
    }
    return runknown;
};
const answer = {
};
answer.encode = function(a, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(answer.encodingLength(a));
    if (!offset) offset = 0;
    const oldOffset = offset;
    name1.encode(a.name, buf, offset);
    offset += name1.encode.bytes;
    buf.writeUInt16BE(toType(a.type), offset);
    if (a.type.toUpperCase() === "OPT") {
        if (a.name !== ".") {
            throw new Error("OPT name must be root.");
        }
        buf.writeUInt16BE(a.udpPayloadSize || 4096, offset + 2);
        buf.writeUInt8(a.extendedRcode || 0, offset + 4);
        buf.writeUInt8(a.ednsVersion || 0, offset + 5);
        buf.writeUInt16BE(a.flags || 0, offset + 6);
        offset += 8;
        ropt.encode(a.options || [], buf, offset);
        offset += ropt.encode.bytes;
    } else {
        let klass = toClass(a.class === undefined ? "IN" : a.class);
        if (a.flush) klass |= FLUSH_MASK;
        buf.writeUInt16BE(klass, offset + 2);
        buf.writeUInt32BE(a.ttl || 0, offset + 4);
        offset += 8;
        const enc = renc(a.type);
        enc.encode(a.data, buf, offset);
        offset += enc.encode.bytes;
    }
    answer.encode.bytes = offset - oldOffset;
    return buf;
};
answer.encode.bytes = 0;
answer.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const a = {
    };
    const oldOffset = offset;
    a.name = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    a.type = toString(buf.readUInt16BE(offset));
    if (a.type === "OPT") {
        a.udpPayloadSize = buf.readUInt16BE(offset + 2);
        a.extendedRcode = buf.readUInt8(offset + 4);
        a.ednsVersion = buf.readUInt8(offset + 5);
        a.flags = buf.readUInt16BE(offset + 6);
        a.flag_do = (a.flags >> 15 & 1) === 1;
        a.options = ropt.decode(buf, offset + 8);
        offset += 8 + ropt.decode.bytes;
    } else {
        const klass = buf.readUInt16BE(offset + 2);
        a.ttl = buf.readUInt32BE(offset + 4);
        a.class = toString3(klass & NOT_FLUSH_MASK);
        a.flush = !!(klass & FLUSH_MASK);
        const enc = renc(a.type);
        a.data = enc.decode(buf, offset + 8);
        offset += 8 + enc.decode.bytes;
    }
    answer.decode.bytes = offset - oldOffset;
    return a;
};
answer.decode.bytes = 0;
answer.encodingLength = function(a) {
    const data = a.data !== null && a.data !== undefined ? a.data : a.options;
    return name1.encodingLength(a.name) + 8 + renc(a.type).encodingLength(data);
};
const question = {
};
question.encode = function(q, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(question.encodingLength(q));
    if (!offset) offset = 0;
    const oldOffset = offset;
    name1.encode(q.name, buf, offset);
    offset += name1.encode.bytes;
    buf.writeUInt16BE(toType(q.type), offset);
    offset += 2;
    buf.writeUInt16BE(toClass(q.class === undefined ? "IN" : q.class), offset);
    offset += 2;
    question.encode.bytes = offset - oldOffset;
    return q;
};
question.encode.bytes = 0;
question.decode = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const q = {
    };
    q.name = name1.decode(buf, offset);
    offset += name1.decode.bytes;
    q.type = toString(buf.readUInt16BE(offset));
    offset += 2;
    q.class = toString3(buf.readUInt16BE(offset));
    offset += 2;
    const qu = !!(q.class & QU_MASK);
    if (qu) q.class &= NOT_QU_MASK;
    question.decode.bytes = offset - oldOffset;
    return q;
};
question.decode.bytes = 0;
question.encodingLength = function(q) {
    return name1.encodingLength(q.name) + 4;
};
const encode2 = function(result, buf, offset) {
    if (!buf) buf = Buffer.allocUnsafe(encodingLength(result));
    if (!offset) offset = 0;
    const oldOffset = offset;
    if (!result.questions) result.questions = [];
    if (!result.answers) result.answers = [];
    if (!result.authorities) result.authorities = [];
    if (!result.additionals) result.additionals = [];
    header.encode(result, buf, offset);
    offset += header.encode.bytes;
    offset = encodeList(result.questions, question, buf, offset);
    offset = encodeList(result.answers, answer, buf, offset);
    offset = encodeList(result.authorities, answer, buf, offset);
    offset = encodeList(result.additionals, answer, buf, offset);
    encode2.bytes = offset - oldOffset;
    return buf;
};
encode2.bytes = 0;
const decode2 = function(buf, offset) {
    if (!offset) offset = 0;
    const oldOffset = offset;
    const result = header.decode(buf, offset);
    offset += header.decode.bytes;
    offset = decodeList(result.questions, question, buf, offset);
    offset = decodeList(result.answers, answer, buf, offset);
    offset = decodeList(result.authorities, answer, buf, offset);
    offset = decodeList(result.additionals, answer, buf, offset);
    decode2.bytes = offset - oldOffset;
    return result;
};
decode2.bytes = 0;
const encodingLength = function(result) {
    return header.encodingLength(result) + encodingLengthList(result.questions || [], question) + encodingLengthList(result.answers || [], answer) + encodingLengthList(result.authorities || [], answer) + encodingLengthList(result.additionals || [], answer);
};
const streamEncode = function(result) {
    const buf = encode2(result);
    const sbuf = Buffer.allocUnsafe(2);
    sbuf.writeUInt16BE(buf.byteLength);
    const combine = Buffer.concat([
        sbuf,
        buf
    ]);
    streamEncode.bytes = combine.byteLength;
    return combine;
};
streamEncode.bytes = 0;
const streamDecode = function(sbuf) {
    const len = sbuf.readUInt16BE(0);
    if (sbuf.byteLength < len + 2) {
        return null;
    }
    const result = decode2(sbuf.slice(2));
    streamDecode.bytes = decode2.bytes;
    return result;
};
streamDecode.bytes = 0;
function encodingLengthList(list, enc) {
    let len = 0;
    for(let i = 0; i < list.length; i++)len += enc.encodingLength(list[i]);
    return len;
}
function encodeList(list, enc, buf, offset) {
    for(let i = 0; i < list.length; i++){
        enc.encode(list[i], buf, offset);
        offset += enc.encode.bytes;
    }
    return offset;
}
function decodeList(list, enc, buf, offset) {
    for(let i = 0; i < list.length; i++){
        list[i] = enc.decode(buf, offset);
        offset += enc.decode.bytes;
    }
    return offset;
}
class DNSParserWrap {
    constructor(){
    }
    Decode(arrayBuffer) {
        try {
            return decode2(Buffer.from(new Uint8Array(arrayBuffer)));
        } catch (e) {
            console.error("Error At : DNSParserWrap -> Decode");
            throw e;
        }
    }
    Encode(DecodedDnsPacket) {
        try {
            return encode2(DecodedDnsPacket);
        } catch (e) {
            console.error("Error At : DNSParserWrap -> Encode");
            throw e;
        }
    }
}
class DNSBlockOperation {
    checkDomainBlocking(userBlocklistFlagUint, userServiceListUint, flagVersion, blocklistMap, blocklistFilter, domainName) {
        let response;
        try {
            response = checkDomainNameUserFlagIntersection(userBlocklistFlagUint, flagVersion, blocklistMap, blocklistFilter, domainName);
            if (response.isBlocked) {
                return response;
            }
            if (userServiceListUint) {
                let dnSplit = domainName.split(".");
                let dnJoin = "";
                let wildCardResponse;
                while(dnSplit.shift() != undefined){
                    dnJoin = dnSplit.join(".");
                    wildCardResponse = checkDomainNameUserFlagIntersection(userServiceListUint, flagVersion, blocklistMap, blocklistFilter, dnJoin);
                    if (wildCardResponse.isBlocked) {
                        return wildCardResponse;
                    }
                }
            }
        } catch (e) {
            throw e;
        }
        return response;
    }
}
function checkDomainNameUserFlagIntersection(userBlocklistFlagUint, flagVersion, blocklistMap, blocklistFilter, domainName) {
    let response = {
    };
    try {
        response.isBlocked = false;
        response.blockedB64Flag = "";
        response.blockedTag = [];
        if (blocklistMap.has(domainName)) {
            let domainNameInBlocklistUint = blocklistMap.get(domainName);
            let blockedUint = blocklistFilter.flagIntersection(userBlocklistFlagUint, domainNameInBlocklistUint);
            if (blockedUint) {
                response.isBlocked = true;
                response.blockedB64Flag = blocklistFilter.getB64FlagFromUint16(blockedUint, flagVersion);
            } else {
                blockedUint = new Uint16Array(domainNameInBlocklistUint);
                response.blockedB64Flag = blocklistFilter.getB64FlagFromUint16(blockedUint, flagVersion);
            }
        }
    } catch (e) {
        throw e;
    }
    return response;
}
class DNSBlock {
    constructor(){
        this.dnsParser = new DNSParserWrap();
        this.dnsBlockOperation = new DNSBlockOperation();
        this.wCache = null;
    }
    async RethinkModule(param) {
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        response.data.isBlocked = false;
        response.data.blockedB64Flag = "";
        try {
            if (param.userBlocklistInfo.userBlocklistFlagUint.length !== "") {
                let domainNameBlocklistInfo;
                if (param.requestDecodedDnsPacket.questions.length >= 1 && (param.requestDecodedDnsPacket.questions[0].type == "A" || param.requestDecodedDnsPacket.questions[0].type == "AAAA" || param.requestDecodedDnsPacket.questions[0].type == "CNAME" || param.requestDecodedDnsPacket.questions[0].type == "HTTPS" || param.requestDecodedDnsPacket.questions[0].type == "SVCB")) {
                    domainNameBlocklistInfo = param.blocklistFilter.getDomainInfo(param.requestDecodedDnsPacket.questions[0].name);
                    if (domainNameBlocklistInfo.searchResult) {
                        response.data = this.dnsBlockOperation.checkDomainBlocking(param.userBlocklistInfo.userBlocklistFlagUint, param.userBlocklistInfo.userServiceListUint, param.userBlocklistInfo.flagVersion, domainNameBlocklistInfo.searchResult, param.blocklistFilter, param.requestDecodedDnsPacket.questions[0].name);
                        if (response.data.isBlocked && param.isAggCacheReq) {
                            if (this.wCache === null) {
                                this.wCache = caches.default;
                            }
                            toCacheApi(param, this.wCache, domainNameBlocklistInfo);
                        }
                    }
                }
            }
        } catch (e) {
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "DNSBlock RethinkModule";
            console.error("Error At : DNSBlock -> RethinkModule");
            console.error(e.stack);
        }
        return response;
    }
}
function toCacheApi(param, wCache, domainNameBlocklistInfo) {
    const dn = param.requestDecodedDnsPacket.questions[0].name.trim().toLowerCase() + ":" + param.requestDecodedDnsPacket.questions[0].type;
    let wCacheUrl = new URL(new URL(param.request.url).origin + "/" + dn);
    let response = new Response("", {
        headers: {
            "x-rethink-metadata": JSON.stringify({
                ttlEndTime: 0,
                bodyUsed: false,
                blocklistInfo: Object.fromEntries(domainNameBlocklistInfo.searchResult)
            })
        },
        cf: {
            cacheTtl: 604800
        }
    });
    param.event.waitUntil(wCache.put(wCacheUrl, response));
}
class DNSResponseBlock {
    constructor(){
        this.dnsBlockOperation = new DNSBlockOperation();
    }
    async RethinkModule(param) {
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        response.data.isBlocked = false;
        response.data.blockedB64Flag = "";
        try {
            if (param.userBlocklistInfo.userBlocklistFlagUint !== "") {
                if (param.responseDecodedDnsPacket.answers.length > 0 && param.responseDecodedDnsPacket.answers[0].type == "CNAME") {
                    checkCnameBlock(param, response, this.dnsBlockOperation);
                } else if (param.responseDecodedDnsPacket.answers.length > 0 && (param.responseDecodedDnsPacket.answers[0].type == "HTTPS" || param.responseDecodedDnsPacket.answers[0].type == "SVCB")) {
                    checkHttpsSvcbBlock(param, response, this.dnsBlockOperation);
                }
            }
        } catch (e) {
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "DNSResponseBlock RethinkModule";
            console.error("Error At : DNSResponseBlock -> RethinkModule");
            console.error(e.stack);
        }
        return response;
    }
}
function checkHttpsSvcbBlock(param, response, dnsBlockOperation) {
    let targetName = param.responseDecodedDnsPacket.answers[0].data.targetName.trim().toLowerCase();
    if (targetName != ".") {
        let domainNameBlocklistInfo = param.blocklistFilter.getDomainInfo(targetName);
        if (domainNameBlocklistInfo.searchResult) {
            response.data = dnsBlockOperation.checkDomainBlocking(param.userBlocklistInfo.userBlocklistFlagUint, param.userBlocklistInfo.userServiceListUint, param.userBlocklistInfo.flagVersion, domainNameBlocklistInfo.searchResult, param.blocklistFilter, targetName);
        }
    }
}
function checkCnameBlock(param, response, dnsBlockOperation) {
    let cname = param.responseDecodedDnsPacket.answers[0].data.trim().toLowerCase();
    let domainNameBlocklistInfo = param.blocklistFilter.getDomainInfo(cname);
    if (domainNameBlocklistInfo.searchResult) {
        response.data = dnsBlockOperation.checkDomainBlocking(param.userBlocklistInfo.userBlocklistFlagUint, param.userBlocklistInfo.userServiceListUint, param.userBlocklistInfo.flagVersion, domainNameBlocklistInfo.searchResult, param.blocklistFilter, cname);
    }
    if (!response.data.isBlocked) {
        cname = param.responseDecodedDnsPacket.answers[param.responseDecodedDnsPacket.answers.length - 1].name.trim().toLowerCase();
        domainNameBlocklistInfo = param.blocklistFilter.getDomainInfo(cname);
        if (domainNameBlocklistInfo.searchResult) {
            response.data = dnsBlockOperation.checkDomainBlocking(param.userBlocklistInfo.userBlocklistFlagUint, param.userBlocklistInfo.userServiceListUint, param.userBlocklistInfo.flagVersion, domainNameBlocklistInfo.searchResult, param.blocklistFilter, cname);
        }
    }
}
const minlives = 1;
const maxlives = 2 ** 14;
const mincap = 2 ** 5;
const maxcap = 2 ** 32;
const minslots = 2;
class Clock {
    constructor(cap, slotsperhand = 256, maxlife = 16){
        cap = this.bound(cap, mincap, maxcap);
        this.capacity = 2 ** Math.round(Math.log2(cap));
        this.rb = new Array(this.capacity);
        this.rb.fill(null);
        this.store = new Map();
        this.maxcount = this.bound(maxlife, minlives, maxlives);
        this.totalhands = Math.max(minslots, Math.round(this.capacity / slotsperhand));
        this.hands = new Array(this.totalhands);
        for(let i = 0; i < this.totalhands; i++)this.hands[i] = i;
    }
    next(i) {
        const n = i + this.totalhands;
        return (this.capacity + n) % this.capacity;
    }
    cur(i) {
        return (this.capacity + i) % this.capacity;
    }
    prev(i) {
        const p = i - this.totalhands;
        return (this.capacity + p) % this.capacity;
    }
    bound(i, min, max) {
        i = i < min ? min : i;
        i = i > max ? max - 1 : i;
        return i;
    }
    head(n) {
        n = this.bound(n, 0, this.totalhands);
        const h = this.hands[n];
        return this.cur(h);
    }
    incrHead(n) {
        n = this.bound(n, 0, this.totalhands);
        this.hands[n] = this.next(this.hands[n]);
        return this.hands[n];
    }
    decrHead(n) {
        n = this.bound(n, 0, this.totalhands);
        this.hands[n] = this.prev(this.hands[n]);
        return this.hands[n];
    }
    get size() {
        return this.store.size;
    }
    evict(n, c) {
        logd("evict start, head/num/size", this.head(n), n, this.size);
        const start = this.head(n);
        let h = start;
        do {
            const entry = this.rb[h];
            if (entry === null) return true;
            entry.count -= c;
            if (entry.count <= 0) {
                logd("evict", h, entry);
                this.store.delete(entry.key);
                this.rb[h] = null;
                return true;
            }
            h = this.incrHead(n);
        }while (h !== start)
        return false;
    }
    put(k, v, c = 1) {
        const cached = this.store.get(k);
        if (cached) {
            cached.value = v;
            const at = this.rb[cached.pos];
            at.count = Math.min(at.count + c, this.maxcount);
            return true;
        }
        const num = this.rolldice;
        this.evict(num, c);
        const h = this.head(num);
        const hasSlot = this.rb[h] === null;
        if (!hasSlot) return false;
        const ringv = {
            key: k,
            count: Math.min(c, this.maxcount)
        };
        const storev = {
            value: v,
            pos: h
        };
        this.rb[h] = ringv;
        this.store.set(k, storev);
        this.incrHead(num);
        return true;
    }
    val(k, c = 1) {
        const r = this.store.get(k);
        if (!r) return null;
        const at = this.rb[r.pos];
        at.count = Math.min(at.count + c, this.maxcount);
        return r.value;
    }
    get rolldice() {
        const max = this.totalhands;
        return Math.floor(Math.random() * (max - 0)) + 0;
    }
}
function logd() {
}
class LfuCache {
    constructor(id, capacity){
        this.id = id;
        this.cache = new Clock(capacity);
    }
    Get(key) {
        let val = false;
        try {
            val = this.cache.val(key) || false;
        } catch (e) {
            console.log("Error: " + this.id + " -> Get");
            console.log(e.stack);
        }
        return val;
    }
    Put(key, val) {
        try {
            this.cache.put(key, val);
        } catch (e) {
            console.log("Error: " + this.id + " -> Put");
            console.log(e.stack);
        }
    }
}
class LocalCache {
    constructor(cacheName, size){
        this.localCache = new LfuCache(cacheName, size);
    }
    Get(key) {
        return this.localCache.Get(key);
    }
    Put(key, data) {
        try {
            this.localCache.Put(key, data);
        } catch (e) {
            console.error("Error At : LocalCache -> Put");
            console.error(e.stack);
        }
    }
}
const ttlGraceSec = 30;
const lfuSize = 2000;
class DNSResolver {
    constructor(){
        this.dnsParser = new DNSParserWrap();
        this.dnsResCache = false;
        this.wCache = false;
    }
    async RethinkModule(param) {
        let response = emptyResponse();
        try {
            if (!this.dnsResCache) {
                this.dnsResCache = new LocalCache("dns-response-cache", lfuSize);
                if (param.runTimeEnv == "worker") {
                    this.wCache = caches.default;
                }
            }
            response.data = await this.checkLocalCacheBfrResolve(param);
        } catch (e) {
            response = errResponse(e);
            console.error("Error At : DNSResolver -> RethinkModule");
            console.error(e.stack);
        }
        return response;
    }
    async checkLocalCacheBfrResolve(param) {
        let resp = {
        };
        const dn = (param.requestDecodedDnsPacket.questions.length > 0 ? param.requestDecodedDnsPacket.questions[0].name : "").trim().toLowerCase() + ":" + param.requestDecodedDnsPacket.questions[0].type;
        const now = Date.now();
        let cacheRes = this.dnsResCache.Get(dn);
        if (!cacheRes || now >= cacheRes.ttlEndTime) {
            cacheRes = await this.checkSecondLevelCacheBfrResolve(param.runTimeEnv, param.request.url, dn, now);
            if (!cacheRes) {
                cacheRes = {
                };
                resp.responseBodyBuffer = await this.resolveDnsUpdateCache(param, cacheRes, dn, now);
                resp.responseDecodedDnsPacket = cacheRes.decodedDnsPacket;
                this.dnsResCache.Put(dn, cacheRes);
                return resp;
            }
            this.dnsResCache.Put(dn, cacheRes);
        }
        resp.responseDecodedDnsPacket = cacheRes.decodedDnsPacket;
        resp.responseDecodedDnsPacket.id = param.requestDecodedDnsPacket.id;
        resp.responseBodyBuffer = this.loadDnsResponseFromCache(cacheRes.decodedDnsPacket, cacheRes.ttlEndTime, now);
        return resp;
    }
    loadDnsResponseFromCache(decodedDnsPacket, ttlEndTime, now) {
        const outttl = Math.max(Math.floor((ttlEndTime - now) / 1000), 1);
        for (let answer of decodedDnsPacket.answers){
            answer.ttl = outttl;
        }
        return this.dnsParser.Encode(decodedDnsPacket);
    }
    async checkSecondLevelCacheBfrResolve(runTimeEnv, reqUrl, dn, now) {
        if (runTimeEnv !== "worker") {
            return false;
        }
        let wCacheUrl = new URL(new URL(reqUrl).origin + "/" + dn);
        let resp = await this.wCache.match(wCacheUrl);
        if (resp) {
            const metaData = JSON.parse(resp.headers.get("x-rethink-metadata"));
            if (now >= metaData.ttlEndTime) {
                return false;
            }
            let cacheRes = {
            };
            cacheRes.decodedDnsPacket = this.dnsParser.Decode(await resp.arrayBuffer());
            cacheRes.ttlEndTime = metaData.ttlEndTime;
            return cacheRes;
        }
    }
    async resolveDnsUpdateCache(param, cacheRes, dn, now) {
        const upRes = await resolveDnsUpstream(param.request, param.dnsResolverUrl, param.requestBodyBuffer, param.runTimeEnv);
        if (upRes.status >= 500 && upRes.status < 600) {
            console.error("Upstream server error =>", upRes.status, upRes.statusText, await upRes.text());
            throw new Error();
        }
        let responseBodyBuffer = await upRes.arrayBuffer();
        if (!responseBodyBuffer || responseBodyBuffer.byteLength < 12 + 5) throw new Error("Null / inadequate response from upstream");
        let decodedDnsPacket = (()=>{
            try {
                return this.dnsParser.Decode(responseBodyBuffer);
            } catch (e) {
                console.error("@DNSResolver->updateCache: Failed decoding response body buffer =>", responseBodyBuffer);
                throw e;
            }
        })();
        let minttl = 0;
        for (let answer of decodedDnsPacket.answers){
            minttl = minttl <= 0 || minttl > answer.ttl ? answer.ttl : minttl;
        }
        minttl = Math.max(minttl + ttlGraceSec, 60);
        cacheRes.decodedDnsPacket = decodedDnsPacket;
        cacheRes.ttlEndTime = minttl * 1000 + now;
        if (param.runTimeEnv == "worker") {
            let wCacheUrl = new URL(new URL(param.request.url).origin + "/" + dn);
            let response = new Response(responseBodyBuffer, {
                headers: {
                    "Cache-Control": "s-maxage=" + minttl,
                    "Content-Length": responseBodyBuffer.length,
                    "Content-Type": "application/octet-stream",
                    "x-rethink-metadata": JSON.stringify({
                        ttlEndTime: cacheRes.ttlEndTime,
                        bodyUsed: true,
                        blocklistInfo: convertMapToObject(param.blocklistFilter.getDomainInfo(decodedDnsPacket.questions.length > 0 ? decodedDnsPacket.questions[0].name : "").searchResult)
                    })
                },
                cf: {
                    cacheTtl: minttl
                }
            });
            param.event.waitUntil(this.wCache.put(wCacheUrl, response));
        }
        return responseBodyBuffer;
    }
}
function convertMapToObject(map) {
    return map ? Object.fromEntries(map) : false;
}
async function resolveDnsUpstream(request, resolverUrl, requestBodyBuffer, runTimeEnv) {
    try {
        let u = new URL(request.url);
        let dnsResolverUrl = new URL(resolverUrl);
        u.hostname = dnsResolverUrl.hostname;
        u.pathname = dnsResolverUrl.pathname;
        u.port = dnsResolverUrl.port;
        u.protocol = dnsResolverUrl.protocol;
        const headers = {
            Accept: "application/dns-message"
        };
        let newRequest;
        if (request.method === "GET" || runTimeEnv == "worker" && request.method === "POST") {
            u.search = runTimeEnv == "worker" && request.method === "POST" ? "?dns=" + btoa(String.fromCharCode(...new Uint8Array(requestBodyBuffer))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "") : u.search;
            newRequest = new Request(u.href, {
                method: "GET",
                headers: headers
            });
        } else if (request.method === "POST") {
            newRequest = new Request(u.href, {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/dns-message",
                    "Content-Length": requestBodyBuffer.byteLength
                },
                body: requestBodyBuffer
            });
        } else {
            throw new Error("get/post requests only");
        }
        return await fetch(newRequest);
    } catch (e) {
        throw e;
    }
}
function emptyResponse() {
    return {
        isException: false,
        exceptionStack: "",
        exceptionFrom: "",
        data: {
            responseDecodedDnsPacket: null,
            responseBodyBuffer: null
        }
    };
}
function errResponse(e) {
    return {
        isException: true,
        exceptionStack: e.stack,
        exceptionFrom: "DNSResolver RethinkModule",
        data: false
    };
}
const BASE64 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
const config1 = {
    useBinarySearch: true,
    debug: false,
    selectsearch: true,
    fastPos: true
};
const W = 16;
const bufferView = {
    15: Uint16Array,
    16: Uint16Array,
    6: Uint8Array
};
function CHR16(ord) {
    return CHRM(ord, false);
}
function CHRM(ord, b64) {
    return b64 ? BASE64[ord] : String.fromCharCode(ord);
}
const ORD = {
};
for(let i2 = 0; i2 < BASE64.length; i2++){
    ORD[BASE64[i2]] = i2;
}
function DEC16(chr) {
    return DECM(chr, false);
}
function DECM(chr, b64) {
    return b64 ? ORD[chr] : chr.charCodeAt(0);
}
const L1 = 32 * 32;
const TxtEnc = new TextEncoder();
const TxtDec = new TextDecoder();
const DELIM = "#";
const ENC_DELIM = TxtEnc.encode(DELIM);
const periodEncVal = TxtEnc.encode(".");
function BitString(str) {
    this.init(str);
}
BitString.MaskTop = {
    16: [
        65535,
        32767,
        16383,
        8191,
        4095,
        2047,
        1023,
        511,
        255,
        127,
        63,
        31,
        15,
        7,
        3,
        1,
        0, 
    ]
};
BitString.MaskBottom = {
    16: [
        65535,
        65534,
        65532,
        65528,
        65520,
        65504,
        65472,
        65408,
        65280,
        65024,
        64512,
        63488,
        61440,
        57344,
        49152,
        32768,
        0, 
    ]
};
const BitsSetTable256 = [];
function initialize() {
    BitsSetTable256[0] = 0;
    for(let i = 0; i < 256; i++){
        BitsSetTable256[i] = (i & 1) + BitsSetTable256[Math.floor(i / 2)];
    }
}
function countSetBits(n) {
    return BitsSetTable256[n & 255] + BitsSetTable256[n >>> 8 & 255] + BitsSetTable256[n >>> 16 & 255] + BitsSetTable256[n >>> 24];
}
function bit0(n, p, pad) {
    const r = bit0p(n, p);
    if (r.scanned <= 0) return r.scanned;
    if (r.index > 0) return r.scanned;
    if (pad > r.scanned) return r.scanned + 1;
    else return 0;
}
function bit0p(n, p) {
    if (p == 0) return {
        index: 0,
        scanned: 0
    };
    if (n == 0 && p == 1) return {
        index: 1,
        scanned: 1
    };
    let c = 0, i = 0;
    for(c = 0; n > 0 && p > c; n = n >>> 1){
        c = c + (n < (n ^ 1)) ? 1 : 0;
        i += 1;
    }
    return {
        index: p == c ? i : 0,
        scanned: i
    };
}
BitString.prototype = {
    init: function(str) {
        this.bytes = str;
        this.length = this.bytes.length * W;
    },
    getData: function() {
        return this.bytes;
    },
    encode: function(n) {
        const e = [];
        for(let i = 0; i < this.length; i += n){
            e.push(this.get(i, Math.min(this.length, n)));
        }
        return e;
    },
    get: function(p, n, debug = false) {
        if (p % W + n <= W) {
            return (this.bytes[p / W | 0] & BitString.MaskTop[W][p % W]) >> W - p % W - n;
        } else {
            let result = this.bytes[p / W | 0] & BitString.MaskTop[W][p % W];
            let tmpCount = 0;
            const disp1 = this.bytes[p / W | 0];
            const disp2 = BitString.MaskTop[W][p % W];
            const res1 = result;
            const l = W - p % W;
            p += l;
            n -= l;
            while(n >= W){
                tmpCount++;
                result = result << W | this.bytes[p / W | 0];
                p += W;
                n -= W;
            }
            const res2 = result;
            if (n > 0) {
                result = result << n | this.bytes[p / W | 0] >> W - n;
            }
            if (debug == true) {
                console.log("disp1: " + disp1 + " disp2: " + disp2 + " loopcount: " + tmpCount + " res1: " + res1 + " res2: " + res2 + " r: " + result);
            }
            return result;
        }
    },
    count: function(p, n) {
        let count = 0;
        while(n >= 16){
            count += BitsSetTable256[this.get(p, 16)];
            p += 16;
            n -= 16;
        }
        return count + BitsSetTable256[this.get(p, n)];
    },
    pos0: function(i, n) {
        if (n < 0) return 0;
        let step = 16;
        let index = i;
        if (config1.fastPos === false) {
            while(n > 0){
                step = n <= 16 ? n : 16;
                const bits0 = step - countSetBits(this.get(i, step));
                n -= bits0;
                i += step;
                index = i - 1;
            }
            return index;
        }
        while(n > 0){
            const d = this.get(i, step);
            const bits0 = step - countSetBits(d);
            if (n - bits0 < 0) {
                step = Math.max(n, step / 2 | 0);
                continue;
            }
            n -= bits0;
            i += step;
            const diff = n === 0 ? bit0(d, 1, step) : 1;
            index = i - diff;
        }
        return index;
    },
    rank: function(x) {
        let rank = 0;
        for(let i = 0; i <= x; i++){
            if (this.get(i, 1)) {
                rank++;
            }
        }
        return rank;
    }
};
function RankDirectory(directoryData, bitData, numBits, l1Size, l2Size) {
    this.init(directoryData, bitData, numBits, l1Size, l2Size);
}
RankDirectory.prototype = {
    init: function(directoryData, trieData, numBits, l1Size, l2Size) {
        this.directory = new BitString(directoryData);
        this.data = new BitString(trieData);
        this.l1Size = l1Size;
        this.l2Size = l2Size;
        this.l1Bits = Math.ceil(Math.log2(numBits));
        this.l2Bits = Math.ceil(Math.log2(l1Size));
        this.sectionBits = (l1Size / l2Size - 1) * this.l2Bits + this.l1Bits;
        this.numBits = numBits;
    },
    getData: function() {
        return this.directory.getData();
    },
    rank: function(which, x) {
        if (config1.selectsearch) {
            let rank = -1;
            let sectionPos = 0;
            if (x >= this.l2Size) {
                sectionPos = (x / this.l2Size | 0) * this.l1Bits;
                rank = this.directory.get(sectionPos - this.l1Bits, this.l1Bits);
                x = x % this.l2Size;
            }
            const ans = x > 0 ? this.data.pos0(rank + 1, x) : rank;
            if (config1.debug) {
                console.log("ans: " + ans + " " + rank + ":r, x: " + x + " " + sectionPos + ":s " + this.l1Bits + ": l1");
            }
            return ans;
        }
        if (which === 0) {
            return x - this.rank(1, x) + 1;
        }
        let rank = 0;
        let o = x;
        let sectionPos = 0;
        if (o >= this.l1Size) {
            sectionPos = (o / this.l1Size | 0) * this.sectionBits;
            rank = this.directory.get(sectionPos - this.l1Bits, this.l1Bits);
            o = o % this.l1Size;
        }
        if (o >= this.l2Size) {
            sectionPos += (o / this.l2Size | 0) * this.l2Bits;
            rank += this.directory.get(sectionPos - this.l2Bits, this.l2Bits);
        }
        rank += this.data.count(x - x % this.l2Size, x % this.l2Size + 1);
        return rank;
    },
    select: function(which, y) {
        let high = this.numBits;
        let low = -1;
        let val = -1;
        let iter = 0;
        if (config1.selectsearch) {
            return this.rank(0, y);
        }
        while(high - low > 1){
            const probe = (high + low) / 2 | 0;
            const r = this.rank(which, probe);
            iter += 1;
            if (r === y) {
                val = probe;
                high = probe;
            } else if (r < y) {
                low = probe;
            } else {
                high = probe;
            }
        }
        return val;
    }
};
function Tags(flags) {
    this.init();
    this.setupFlags(flags);
}
Tags.prototype = {
    init: function(flags) {
        this.flags = {
        };
        this.rflags = {
        };
        this.fsize = 0;
    },
    setupFlags: function(flags) {
        let i = 0;
        for (const f of flags){
            this.flags[f] = i++;
        }
        this.rflags = flags;
        this.fsize = Math.ceil(Math.log2(flags.length) / 16) + 1;
    },
    flagsToTag: function(flags) {
        const header = flags[0];
        const tagIndices = [];
        const values = [];
        for(let i = 0, mask = 32768; i < 16; i++){
            if (header << i === 0) break;
            if ((header & mask) === mask) {
                tagIndices.push(i);
            }
            mask = mask >>> 1;
        }
        if (tagIndices.length !== flags.length - 1) {
            console.log(tagIndices, flags, "flags and header mismatch (bug in upsert?)");
            return values;
        }
        for(let i1 = 0; i1 < flags.length; i1++){
            const flag = flags[i1 + 1];
            const index = tagIndices[i1];
            for(let j = 0, mask = 32768; j < 16; j++){
                if (flag << j === 0) break;
                if ((flag & mask) === mask) {
                    const pos = index * 16 + j;
                    if (config1.debug) {
                        console.log("pos", pos, "index/tagIndices", index, tagIndices, "j/i", j, i1);
                    }
                    values.push(this.rflags[pos]);
                }
                mask = mask >>> 1;
            }
        }
        return values;
    }
};
function FrozenTrieNode(trie, index) {
    this.trie = trie;
    this.index = index;
    let finCached, whCached, comCached, fcCached, chCached, valCached, flagCached;
    this.final = ()=>{
        if (typeof finCached === "undefined") {
            finCached = this.trie.data.get(this.trie.letterStart + index * this.trie.bitslen + this.trie.extraBit, 1) === 1;
        }
        return finCached;
    };
    this.where = ()=>{
        if (typeof whCached === "undefined") {
            whCached = this.trie.data.get(this.trie.letterStart + index * this.trie.bitslen + 1 + this.trie.extraBit, this.trie.bitslen - 1 - this.trie.extraBit);
        }
        return whCached;
    };
    this.compressed = ()=>{
        if (typeof comCached === "undefined") {
            comCached = this.trie.data.get(this.trie.letterStart + index * this.trie.bitslen, 1) === 1;
        }
        return comCached;
    };
    this.flag = ()=>{
        if (typeof flagCached === "undefined") {
            flagCached = this.compressed() && this.final();
        }
        return flagCached;
    };
    this.letter = ()=>this.where()
    ;
    this.firstChild = ()=>{
        if (!fcCached) fcCached = this.trie.directory.select(0, index + 1) - index;
        return fcCached;
    };
    if (config1.debug) {
        console.log(index + " :i, fc: " + this.firstChild() + " tl: " + this.letter() + " c: " + this.compressed() + " f: " + this.final() + " wh: " + this.where() + " flag: " + this.flag());
    }
    this.childOfNextNode = ()=>{
        if (!chCached) {
            chCached = this.trie.directory.select(0, index + 2) - index - 1;
        }
        return chCached;
    };
    this.childCount = ()=>this.childOfNextNode() - this.firstChild()
    ;
    this.value = ()=>{
        if (typeof valCached === "undefined") {
            const value = [];
            let i = 0;
            let j = 0;
            if (config1.debug) {
                console.log("thisnode: index/vc/ccount ", this.index, this.letter(), this.childCount());
            }
            while(i < this.childCount()){
                const valueChain = this.getChild(i);
                if (config1.debug) {
                    console.log("vc no-flag end vlet/vflag/vindex/val ", i, valueChain.letter(), valueChain.flag(), valueChain.index, value);
                }
                if (!valueChain.flag()) {
                    break;
                }
                if (i % 2 === 0) {
                    value.push(valueChain.letter() << 8);
                } else {
                    value[j] = value[j] | valueChain.letter();
                    j += 1;
                }
                i += 1;
            }
            valCached = value;
        }
        return valCached;
    };
}
FrozenTrieNode.prototype = {
    getChildCount: function() {
        return this.childCount();
    },
    getChild: function(index) {
        return this.trie.getNodeByIndex(this.firstChild() + index);
    }
};
function FrozenTrie(data, rdir, nodeCount) {
    this.init(data, rdir, nodeCount);
}
FrozenTrie.prototype = {
    init: function(trieData, rdir, nodeCount) {
        this.data = new BitString(trieData);
        this.directory = rdir;
        this.extraBit = 1;
        this.bitslen = 9 + this.extraBit;
        this.letterStart = nodeCount * 2 + 1;
    },
    getNodeByIndex: function(index) {
        return new FrozenTrieNode(this, index);
    },
    getRoot: function() {
        return this.getNodeByIndex(0);
    },
    lookup: function(word) {
        const index = word.lastIndexOf(ENC_DELIM[0]);
        if (index > 0) word = word.slice(0, index);
        const debug = config1.debug;
        let node = this.getRoot();
        let child;
        let returnValue = false;
        for(let i = 0; i < word.length; i++){
            let isFlag = -1;
            let that;
            if (periodEncVal[0] == word[i]) {
                if (node.final()) {
                    if (returnValue == false) returnValue = new Map();
                    returnValue.set(TxtDec.decode(word.slice(0, i).reverse()), node.value());
                }
            }
            do {
                that = node.getChild(isFlag + 1);
                if (!that.flag()) break;
                isFlag += 1;
            }while (isFlag + 1 < node.getChildCount())
            const minChild = isFlag;
            if (debug) {
                console.log("            count: " + node.getChildCount() + " i: " + i + " w: " + word[i] + " nl: " + node.letter() + " flag: " + isFlag);
            }
            if (node.getChildCount() - 1 <= minChild) {
                if (debug) {
                    console.log("  no more children left, remaining word: " + word.slice(i));
                }
                return returnValue;
            }
            if (config1.useBinarySearch === false) {
                let j = isFlag;
                for(; j < node.getChildCount(); j++){
                    child = node.getChild(j);
                    if (debug) {
                        console.log("it: " + j + " tl: " + child.letter() + " wl: " + word[i]);
                    }
                    if (child.letter() == word[i]) {
                        if (debug) console.log("it: " + j + " break ");
                        break;
                    }
                }
                if (j === node.getChildCount()) {
                    if (debug) console.log("j: " + j + " c: " + node.getChildCount());
                    return returnValue;
                }
            } else {
                let high = node.getChildCount();
                let low = isFlag;
                while(high - low > 1){
                    const probe = (high + low) / 2 | 0;
                    child = node.getChild(probe);
                    const prevchild = probe > isFlag ? node.getChild(probe - 1) : undefined;
                    if (debug) {
                        console.log("        current: " + child.letter() + " l: " + low + " h: " + high + " w: " + word[i]);
                    }
                    if (child.compressed() || prevchild && prevchild.compressed() && !prevchild.flag()) {
                        const startchild = [];
                        const endchild = [];
                        let start = 0;
                        let end = 0;
                        startchild.push(child);
                        start += 1;
                        do {
                            const temp = node.getChild(probe - start);
                            if (!temp.compressed()) break;
                            if (temp.flag()) break;
                            startchild.push(temp);
                            start += 1;
                        }while (true)
                        if (startchild[start - 1].letter() > word[i]) {
                            if (debug) {
                                console.log("        shrinkh start: " + startchild[start - 1].letter() + " s: " + start + " w: " + word[i]);
                            }
                            high = probe - start + 1;
                            if (high - low <= 1) {
                                if (debug) {
                                    console.log("...h-low: " + (high - low) + " c: " + node.getChildCount(), high, low, child.letter(), word[i], probe);
                                }
                                return returnValue;
                            }
                            continue;
                        }
                        if (child.compressed()) {
                            do {
                                end += 1;
                                const temp = node.getChild(probe + end);
                                endchild.push(temp);
                                if (!temp.compressed()) break;
                            }while (true)
                        }
                        if (startchild[start - 1].letter() < word[i]) {
                            if (debug) {
                                console.log("        shrinkl start: " + startchild[start - 1].letter() + " s: " + start + " w: " + word[i]);
                            }
                            low = probe + end;
                            if (high - low <= 1) {
                                if (debug) {
                                    console.log("...h-low: " + (high - low) + " c: " + node.getChildCount(), high, low, child.letter(), word[i], probe);
                                }
                                return returnValue;
                            }
                            continue;
                        }
                        const nodes = startchild.reverse().concat(endchild);
                        const comp = nodes.map((n)=>n.letter()
                        );
                        const w = word.slice(i, i + comp.length);
                        if (debug) {
                            console.log("it: " + probe + " tl: " + comp + " wl: " + w + " c: " + child.letter());
                        }
                        if (w.length < comp.length) return returnValue;
                        for(let i1 = 0; i1 < comp.length; i1++){
                            if (w[i1] !== comp[i1]) return returnValue;
                        }
                        if (debug) console.log("it: " + probe + " break ");
                        child = nodes[nodes.length - 1];
                        i += comp.length - 1;
                        break;
                    } else {
                        if (child.letter() === word[i]) {
                            break;
                        } else if (word[i] > child.letter()) {
                            low = probe;
                        } else {
                            high = probe;
                        }
                    }
                    if (high - low <= 1) {
                        if (debug) {
                            console.log("h-low: " + (high - low) + " c: " + node.getChildCount(), high, low, child.letter(), word[i], probe);
                        }
                        return returnValue;
                    }
                }
            }
            if (debug) console.log("        next: " + child.letter());
            node = child;
        }
        if (node.final()) {
            if (returnValue == false) returnValue = new Map();
            returnValue.set(TxtDec.decode(word.reverse()), node.value());
        }
        return returnValue;
    }
};
function customTagToFlag(fl, blocklistFileTag) {
    let res = CHR16(0);
    for (const flag of fl){
        const val = blocklistFileTag[flag].value;
        const header = 0;
        const index = val / 16 | 0;
        const pos = val % 16;
        let h = 0;
        h = DEC16(res[header]);
        const dataIndex = countSetBits(h & BitString.MaskBottom[16][16 - index]) + 1;
        let n = (h >>> 15 - index & 1) !== 1 ? 0 : DEC16(res[dataIndex]);
        const upsertData = n !== 0;
        h |= 1 << 15 - index;
        n |= 1 << 15 - pos;
        res = CHR16(h) + res.slice(1, dataIndex) + CHR16(n) + res.slice(upsertData ? dataIndex + 1 : dataIndex);
    }
    return res;
}
function createBlocklistFilter(tdbuf, rdbuf, blocklistFileTag, blocklistBasicConfig) {
    initialize();
    try {
        let tag = {
        };
        let fl = [];
        for(const fileuname in blocklistFileTag){
            if (!blocklistFileTag.hasOwnProperty(fileuname)) continue;
            fl[blocklistFileTag[fileuname].value] = fileuname;
            const v = DELIM + blocklistFileTag[fileuname].uname;
            tag[fileuname] = v.split("").reverse().join("");
        }
        const tags = new Tags(fl);
        const tdv = new bufferView[16](tdbuf);
        const rdv = new bufferView[16](rdbuf);
        const nc = blocklistBasicConfig.nodecount;
        const numbits = blocklistBasicConfig.nodecount * 2 + 1;
        const rd = new RankDirectory(rdv, tdv, numbits, L1, 32);
        const frozentrie = new FrozenTrie(tdv, rd, nc);
        return {
            t: tags,
            ft: frozentrie
        };
    } catch (e) {
        throw e;
    }
}
const ALPHA32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function readChar(chr) {
    chr = chr.toUpperCase();
    const idx = ALPHA32.indexOf(chr);
    if (idx === -1) {
        throw new Error("invalid b32 character: " + chr);
    }
    return idx;
}
function rbase32(input) {
    input = input.replace(/=+$/, "");
    const length = input.length;
    let bits = 0;
    let value = 0;
    let index = 0;
    let output = new Uint8Array(length * 5 / 8 | 0);
    for(var i = 0; i < length; i++){
        value = value << 5 | readChar(input[i]);
        bits += 5;
        if (bits >= 8) {
            output[index++] = value >>> bits - 8 & 255;
            bits -= 8;
        }
    }
    return output;
}
class BlocklistFilter {
    constructor(){
        this.t = null;
        this.ft = null;
        this.blocklistBasicConfig = null;
        this.blocklistFileTag = null;
        this.domainNameCache = null;
        this.wildCardUint = new Uint16Array([
            64544,
            18431,
            8191,
            65535,
            64640,
            1,
            128,
            16320, 
        ]);
    }
    loadFilter(t, ft, blocklistBasicConfig, blocklistFileTag) {
        this.t = t;
        this.ft = ft;
        this.blocklistBasicConfig = blocklistBasicConfig;
        this.blocklistFileTag = blocklistFileTag;
        this.domainNameCache = new LocalCache("Domain-Name-Cache", 5000);
    }
    getDomainInfo(domainName) {
        domainName = domainName.trim().toLowerCase();
        let domainNameInfo = this.domainNameCache.Get(domainName);
        if (!domainNameInfo) {
            domainNameInfo = {
            };
            domainNameInfo.searchResult = this.hadDomainName(domainName);
            this.domainNameCache.Put(domainName, domainNameInfo);
        }
        return domainNameInfo;
    }
    hadDomainName(domainName) {
        const enc = new TextEncoder();
        return this.ft.lookup(enc.encode(domainName).reverse());
    }
    getTag(uintFlag) {
        return this.t.flagsToTag(uintFlag);
    }
    unstamp(flag) {
        return toUint(flag);
    }
    flagIntersection(flag1, flag2) {
        try {
            let flag1Header = flag1[0];
            let flag2Header = flag2[0];
            let intersectHeader = flag1Header & flag2Header;
            if (intersectHeader == 0) {
                return false;
            }
            let flag1Length = flag1.length - 1;
            let flag2Length = flag2.length - 1;
            const intersectBody = [];
            let tmpInterectHeader = intersectHeader;
            let maskHeaderForBodyEmpty = 1;
            let tmpBodyIntersect;
            for(; tmpInterectHeader != 0;){
                if ((flag1Header & 1) == 1) {
                    if ((tmpInterectHeader & 1) == 1) {
                        tmpBodyIntersect = flag1[flag1Length] & flag2[flag2Length];
                        if (tmpBodyIntersect == 0) {
                            intersectHeader = intersectHeader ^ maskHeaderForBodyEmpty;
                        } else {
                            intersectBody.push(tmpBodyIntersect);
                        }
                    }
                    flag1Length = flag1Length - 1;
                }
                if ((flag2Header & 1) == 1) {
                    flag2Length = flag2Length - 1;
                }
                flag1Header = flag1Header >>> 1;
                tmpInterectHeader = tmpInterectHeader >>> 1;
                flag2Header = flag2Header >>> 1;
                maskHeaderForBodyEmpty = maskHeaderForBodyEmpty * 2;
            }
            if (intersectHeader == 0) {
                return false;
            }
            const intersectFlag = new Uint16Array(intersectBody.length + 1);
            let count = 0;
            intersectFlag[count++] = intersectHeader;
            let bodyData;
            while((bodyData = intersectBody.pop()) != undefined){
                intersectFlag[count++] = bodyData;
            }
            return intersectFlag;
        } catch (e) {
            throw e;
        }
    }
    customTagToFlag(tagList) {
        return customTagToFlag(tagList, this.blocklistFileTag);
    }
    getB64FlagFromTag(tagList, flagVersion) {
        try {
            if (flagVersion == "0") {
                return encodeURIComponent(Buffer.from(customTagToFlag(tagList, this.blocklistFileTag)).toString("base64"));
            } else if (flagVersion == "1") {
                return "1:" + encodeURI(btoa(encodeToBinary(customTagToFlag(tagList, this.blocklistFileTag))).replace(/\//g, "_").replace(/\+/g, "-"));
            }
        } catch (e) {
            throw e;
        }
    }
    getB64FlagFromUint16(arr, flagVersion) {
        try {
            if (flagVersion == "0") {
                return encodeURIComponent(Buffer.from(arr).toString("base64"));
            } else if (flagVersion == "1") {
                return "1:" + encodeURI(btoa(encodeUint16arrToBinary(arr)).replace(/\//g, "_").replace(/\+/g, "-"));
            }
        } catch (e) {
            throw e;
        }
    }
}
function encodeUint16arrToBinary(uint16Arr) {
    return String.fromCharCode(...new Uint8Array(uint16Arr.buffer));
}
function encodeToBinary(s) {
    const codeUnits = new Uint16Array(s.length);
    for(let i = 0; i < codeUnits.length; i++){
        codeUnits[i] = s.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}
const b64delim = ":";
const b32delim = "+";
function isB32(s) {
    return s.indexOf(b32delim) > 0;
}
function version(s) {
    if (s && s.length > 1) return s[0];
    else return "0";
}
function toUint(flag) {
    try {
        const response = {
        };
        response.userBlocklistFlagUint = "";
        response.flagVersion = "0";
        flag = flag ? flag.trim() : "";
        if (flag.length <= 0) {
            return response;
        }
        const isFlagB32 = isB32(flag);
        let s = flag.split(isFlagB32 ? b32delim : b64delim);
        let convertor = (x)=>""
        ;
        let f = "";
        const v = version(s);
        if (v == "0") {
            convertor = Base64ToUint;
            f = s[0];
        } else if (v == "1") {
            convertor = isFlagB32 ? Base32ToUint_v1 : Base64ToUint_v1;
            f = s[1];
        } else {
            throw new Error("unknown blocklist stamp version in " + s);
        }
        response.flagVersion = v;
        response.userBlocklistFlagUint = convertor(f) || "";
        return response;
    } catch (e) {
        throw e;
    }
}
function Base64ToUint(b64Flag) {
    const buff = Buffer.from(decodeURIComponent(b64Flag), "base64");
    const str = buff.toString("utf-8");
    const uint = [];
    for(let i = 0; i < str.length; i++){
        uint[i] = str.charCodeAt(i);
    }
    return uint;
}
function Base64ToUint_v1(b64Flag) {
    let str = decodeURI(b64Flag);
    str = decodeFromBinary(atob(str.replace(/_/g, "/").replace(/-/g, "+")));
    const uint = [];
    for(let i = 0; i < str.length; i++){
        uint[i] = str.charCodeAt(i);
    }
    return uint;
}
function Base32ToUint_v1(flag) {
    let str = decodeURI(flag);
    str = decodeFromBinaryArray(rbase32(str));
    const uint = [];
    for(let i = 0; i < str.length; i++){
        uint[i] = str.charCodeAt(i);
    }
    return uint;
}
function decodeFromBinary(b, u8) {
    if (u8) return String.fromCharCode(...new Uint16Array(b.buffer));
    const bytes = new Uint8Array(b.length);
    for(let i = 0; i < bytes.length; i++){
        bytes[i] = b.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
}
function decodeFromBinaryArray(b) {
    return decodeFromBinary(b, true);
}
let debug = false;
class BlocklistWrapper {
    constructor(){
        this.blocklistFilter = new BlocklistFilter();
        this.startTime;
        this.isBlocklistUnderConstruction = false;
        this.exceptionFrom = "";
        this.exceptionStack = "";
    }
    async RethinkModule(param) {
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        if (this.blocklistFilter.t !== null) {
            response.data.blocklistFilter = this.blocklistFilter;
            return response;
        }
        try {
            const now = Date.now();
            if (this.isBlocklistUnderConstruction === false) {
                return await this.initBlocklistConstruction(now, param.blocklistUrl, param.latestTimestamp, param.tdNodecount, param.tdParts);
            } else if (now - this.startTime > param.workerTimeout * 2) {
                return await this.initBlocklistConstruction(now, param.blocklistUrl, param.latestTimestamp, param.tdNodecount, param.tdParts);
            } else {
                let totalWaitms = 0;
                const waitms = 50;
                while(totalWaitms < param.fetchTimeout){
                    if (this.blocklistFilter.t !== null) {
                        response.data.blocklistFilter = this.blocklistFilter;
                        return response;
                    }
                    await sleep(50);
                    totalWaitms += waitms;
                }
                response.isException = true;
                response.exceptionStack = this.exceptionStack ? this.exceptionStack : "Problem in loading blocklistFilter - Waiting Timeout";
                response.exceptionFrom = this.exceptionFrom ? this.exceptionFrom : "blocklistWrapper.js RethinkModule";
            }
        } catch (e) {
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "blocklistWrapper.js RethinkModule";
            console.error("Error At -> BlocklistWrapper RethinkModule");
            console.error(e.stack);
        }
        return response;
    }
    async initBlocklistConstruction(when, blocklistUrl, latestTimestamp, tdNodecount, tdParts) {
        this.isBlocklistUnderConstruction = true;
        this.startTime = when;
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        try {
            let bl = await downloadBuildBlocklist(blocklistUrl, latestTimestamp, tdNodecount, tdParts);
            this.blocklistFilter.loadFilter(bl.t, bl.ft, bl.blocklistBasicConfig, bl.blocklistFileTag);
            if (debug) {
                console.log("done blocklist filter");
                let result = this.blocklistFilter.getDomainInfo("google.com");
                console.log(JSON.stringify(result));
                console.log(JSON.stringify(result.searchResult.get("google.com")));
            }
            this.isBlocklistUnderConstruction = false;
            response.data.blocklistFilter = this.blocklistFilter;
        } catch (e) {
            this.isBlocklistUnderConstruction = false;
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "blocklistWrapper.js initBlocklistConstruction";
            this.exceptionFrom = response.exceptionFrom;
            this.exceptionStack = response.exceptionStack;
            console.error(e.stack);
        }
        return response;
    }
}
async function downloadBuildBlocklist(blocklistUrl, latestTimestamp, tdNodecount, tdParts) {
    try {
        let resp = {
        };
        const baseurl = blocklistUrl + latestTimestamp;
        let blocklistBasicConfig = {
            nodecount: tdNodecount || -1,
            tdparts: tdParts || -1
        };
        tdNodecount == null && console.error("tdNodecount missing! Blocking won't work");
        const buf0 = fileFetch(baseurl + "/filetag.json", "json");
        const buf1 = makeTd(baseurl, blocklistBasicConfig.tdparts);
        const buf2 = fileFetch(baseurl + "/rd.txt", "buffer");
        let downloads = await Promise.all([
            buf0,
            buf1,
            buf2
        ]);
        if (debug) {
            console.log("call createBlocklistFilter");
            console.log(blocklistBasicConfig);
        }
        let trie = createBlocklistFilter(downloads[1], downloads[2], downloads[0], blocklistBasicConfig);
        resp.t = trie.t;
        resp.ft = trie.ft;
        resp.blocklistBasicConfig = blocklistBasicConfig;
        resp.blocklistFileTag = downloads[0];
        return resp;
    } catch (e) {
        throw e;
    }
}
async function fileFetch(url, typ) {
    if (typ !== "buffer" && typ !== "json") {
        throw new Error("Unknown conversion type at fileFetch");
    }
    if (debug) {
        console.log("Start Downloading : " + url);
    }
    const res = await fetch(url, {
        cf: {
            cacheTtl: 1209600
        }
    });
    if (res.status == 200) {
        if (typ == "buffer") {
            return await res.arrayBuffer();
        } else if (typ == "json") {
            return await res.json();
        }
    } else {
        console.error(url, res);
        throw new Error(JSON.stringify([
            url,
            res,
            "response status unsuccessful at fileFetch"
        ]));
    }
}
const sleep = (ms)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, ms);
    });
};
async function makeTd(baseurl, n) {
    if (debug) {
        console.log("Make Td Starts : Tdparts -> " + n);
    }
    if (n <= -1) {
        return fileFetch(baseurl + "/td.txt", "buffer");
    }
    const tdpromises = [];
    for(let i = 0; i <= n; i++){
        const f = baseurl + "/td" + i.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false
        }) + ".txt";
        tdpromises.push(fileFetch(f, "buffer"));
    }
    const tds = await Promise.all(tdpromises);
    if (debug) {
        console.log("all td download successful");
    }
    return new Promise((resolve, reject)=>{
        resolve(concat(tds));
    });
}
function concat(arraybuffers) {
    let sz = arraybuffers.reduce((sum, a)=>sum + a.byteLength
    , 0);
    let buf = new ArrayBuffer(sz);
    let cat = new Uint8Array(buf);
    let offset = 0;
    for (let a of arraybuffers){
        const v = new Uint8Array(a);
        cat.set(v, offset);
        offset += a.byteLength;
    }
    return buf;
}
let debug1 = false;
class DNSAggCache {
    constructor(){
        this.dnsParser = new DNSParserWrap();
        this.dnsBlockOperation = new DNSBlockOperation();
        this.blocklistFilter = new BlocklistFilter();
        this.wCache = null;
    }
    async RethinkModule(param) {
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = null;
        try {
            if (!param.isDnsMsg) {
                return response;
            }
            response.data = await this.aggCache(param);
        } catch (e) {
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "DNSAggCache RethinkModule";
            console.error("Error At : DNSAggCache -> RethinkModule");
            console.error(e.stack);
        }
        return response;
    }
    async aggCache(param) {
        let response = {
        };
        response.reqDecodedDnsPacket = this.dnsParser.Decode(param.requestBodyBuffer);
        response.aggCacheResponse = {
        };
        response.aggCacheResponse.type = "none";
        if (param.isAggCacheReq && this.wCache === null) {
            this.wCache = caches.default;
        }
        if (param.isAggCacheReq) {
            const dn = (response.reqDecodedDnsPacket.questions.length > 0 ? response.reqDecodedDnsPacket.questions[0].name : "").trim().toLowerCase() + ":" + response.reqDecodedDnsPacket.questions[0].type;
            let cacheResponse = await getCacheapi(this.wCache, param.request.url, dn);
            if (debug1) {
                console.log("Cache Api Response");
                console.log(cacheResponse);
            }
            if (cacheResponse) {
                response.aggCacheResponse = await parseCacheapiResponse(cacheResponse, this.dnsParser, this.dnsBlockOperation, this.blocklistFilter, param.userBlocklistInfo, response.reqDecodedDnsPacket);
            }
        }
        return response;
    }
}
async function parseCacheapiResponse(cacheResponse, dnsParser, dnsBlockOperation, blocklistFilter, userBlocklistInfo, reqDecodedDnsPacket) {
    let response = {
    };
    response.type = "none";
    response.data = {
    };
    let metaData = JSON.parse(cacheResponse.headers.get("x-rethink-metadata"));
    if (debug1) {
        console.log("Response Found at CacheApi");
        console.log(JSON.stringify(metaData));
    }
    if ((reqDecodedDnsPacket.questions[0].type == "A" || reqDecodedDnsPacket.questions[0].type == "AAAA" || reqDecodedDnsPacket.questions[0].type == "CNAME" || reqDecodedDnsPacket.questions[0].type == "HTTPS" || reqDecodedDnsPacket.questions[0].type == "SVCB") && metaData.blocklistInfo && userBlocklistInfo.userBlocklistFlagUint !== "") {
        metaData.blocklistInfo = new Map(Object.entries(metaData.blocklistInfo));
        let blockResponse = dnsBlockOperation.checkDomainBlocking(userBlocklistInfo.userBlocklistFlagUint, userBlocklistInfo.userServiceListUint, userBlocklistInfo.flagVersion, metaData.blocklistInfo, blocklistFilter, reqDecodedDnsPacket.questions[0].name.trim().toLowerCase());
        if (blockResponse.isBlocked) {
            response.type = "blocked";
            response.data = blockResponse;
            return response;
        }
    }
    if (metaData.bodyUsed) {
        const now = Date.now();
        if (now <= metaData.ttlEndTime) {
            response.type = "response";
            response.data.decodedDnsPacket = dnsParser.Decode(await cacheResponse.arrayBuffer());
            const outttl = Math.max(Math.floor((metaData.ttlEndTime - now) / 1000), 1);
            for (let answer of response.data.decodedDnsPacket.answers){
                answer.ttl = outttl;
            }
            response.data.bodyBuffer = dnsParser.Encode(response.data.decodedDnsPacket);
        }
    }
    return response;
}
async function getCacheapi(wCache, reqUrl, key) {
    let wCacheUrl = new URL(new URL(reqUrl).origin + "/" + key);
    return await wCache.match(wCacheUrl);
}
let debug2 = false;
let timer = debug2 || false;
let gen = debug2 || true;
let info = gen || true;
let warn = info || true;
let err = warn || true;
function e1() {
    if (err) console.error(...arguments);
}
function d() {
    if (debug2) console.debug(...arguments);
}
function laptime() {
    if (timer) console.timeLog(...arguments);
}
function starttime(name) {
    if (timer) {
        name += id();
        console.time(name);
    }
    return name;
}
function endtime(name) {
    if (timer) console.timeEnd(name);
}
function id() {
    return (Math.random() + 1).toString(36).slice(1);
}
class CurrentRequest {
    constructor(){
        this.blockedB64Flag = "";
        this.decodedDnsPacket = undefined;
        this.httpResponse = undefined;
        this.isException = false;
        this.exceptionStack = undefined;
        this.exceptionFrom = "";
        this.isDnsParseException = false;
        this.isDnsBlock = false;
        this.isInvalidFlagBlock = false;
        this.stopProcessing = false;
        this.dnsParser = new DNSParserWrap();
    }
    dnsExceptionResponse() {
        const singleLog = {
        };
        singleLog.exceptionFrom = this.exceptionFrom;
        singleLog.exceptionStack = this.exceptionStack;
        const dnsEncodeObj = this.dnsParser.Encode({
            type: "response",
            flags: 4098
        });
        this.httpResponse = new Response(dnsEncodeObj);
        setResponseCommonHeader.call(this);
        this.httpResponse.headers.set("x-err", JSON.stringify(singleLog));
    }
    customResponse(data) {
        const dnsEncodeObj = this.dnsParser.Encode({
            type: "response",
            flags: 1
        });
        this.httpResponse = new Response(dnsEncodeObj);
        setResponseCommonHeader.call(this);
        this.httpResponse.headers.set("x-err", JSON.stringify(data));
    }
    dnsResponse(arrayBuffer) {
        this.httpResponse = new Response(arrayBuffer);
        setResponseCommonHeader.call(this);
    }
    dnsBlockResponse() {
        try {
            this.decodedDnsPacket.type = "response";
            this.decodedDnsPacket.rcode = "NOERROR";
            this.decodedDnsPacket.flags = 384;
            this.decodedDnsPacket.flag_qr = true;
            this.decodedDnsPacket.answers = [];
            this.decodedDnsPacket.answers[0] = {
            };
            this.decodedDnsPacket.answers[0].name = this.decodedDnsPacket.questions[0].name;
            this.decodedDnsPacket.answers[0].type = this.decodedDnsPacket.questions[0].type;
            this.decodedDnsPacket.answers[0].ttl = 300;
            this.decodedDnsPacket.answers[0].class = "IN";
            this.decodedDnsPacket.answers[0].data = "";
            this.decodedDnsPacket.answers[0].flush = false;
            if (this.decodedDnsPacket.questions[0].type == "A") {
                this.decodedDnsPacket.answers[0].data = "0.0.0.0";
            } else if (this.decodedDnsPacket.questions[0].type == "AAAA") {
                this.decodedDnsPacket.answers[0].data = "::";
            } else if (this.decodedDnsPacket.questions[0].type == "HTTPS" || this.decodedDnsPacket.questions[0].type == "SVCB") {
                this.decodedDnsPacket.answers[0].data = {
                };
                this.decodedDnsPacket.answers[0].data.svcPriority = 0;
                this.decodedDnsPacket.answers[0].data.targetName = ".";
                this.decodedDnsPacket.answers[0].data.svcParams = {
                };
            }
            this.decodedDnsPacket.authorities = [];
            this.httpResponse = new Response(this.dnsParser.Encode(this.decodedDnsPacket));
            setResponseCommonHeader.call(this);
        } catch (e) {
            e1(JSON.stringify(this.decodedDnsPacket));
            this.isException = true;
            this.exceptionStack = e.stack;
            this.exceptionFrom = "CurrentRequest dnsBlockResponse";
        }
    }
}
function setResponseCommonHeader() {
    this.httpResponse.headers.set("Content-Type", "application/dns-message");
    this.httpResponse.headers.append("Vary", "Origin");
    this.httpResponse.headers.delete("expect-ct");
    this.httpResponse.headers.delete("cf-ray");
    if (this.isDnsBlock) {
        this.httpResponse.headers.set("x-nile-flags", this.blockedB64Flag);
    } else if (this.blockedB64Flag !== "") {
        this.httpResponse.headers.set('x-nile-flag-notblocked', this.blockedB64Flag);
    }
}
let debug3 = false;
class CommandControl {
    constructor(){
        this.latestTimestamp = "";
    }
    async RethinkModule(param) {
        if (debug3) console.log("In CommandControl");
        this.latestTimestamp = param.latestTimestamp;
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        response.data.stopProcessing = false;
        if (param.request.method === "GET") {
            response = this.commandOperation(param.request.url, param.blocklistFilter, param.isDnsMsg);
        }
        return response;
    }
    commandOperation(url, blocklistFilter, isDnsMsg) {
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        try {
            response.data.stopProcessing = true;
            response.data.httpResponse;
            const reqUrl = new URL(url);
            const queryString = reqUrl.searchParams;
            const pathSplit = reqUrl.pathname.split("/");
            let command = pathSplit[1];
            if (!command) {
                const d = reqUrl.host.split(".");
                command = d.length > 3 && d[2] === "rethinkdns" ? d[0] : "";
            }
            const weburl = command == "" ? "https://rethinkdns.com/configure" : "https://rethinkdns.com/configure?s=added#" + command;
            if (command == "listtob64") {
                response.data.httpResponse = listToB64(queryString, blocklistFilter);
            } else if (command == "b64tolist") {
                response.data.httpResponse = b64ToList(queryString, blocklistFilter);
            } else if (command == "dntolist") {
                response.data.httpResponse = domainNameToList(queryString, blocklistFilter, this.latestTimestamp);
            } else if (command == "dntouint") {
                response.data.httpResponse = domainNameToUint(queryString, blocklistFilter);
            } else if (command == "config" || command == "configure") {
                let b64UserFlag = "";
                if (pathSplit.length >= 3) {
                    b64UserFlag = pathSplit[2];
                }
                response.data.httpResponse = configRedirect(b64UserFlag, reqUrl.origin, this.latestTimestamp);
            } else if (!isDnsMsg) {
                response.data.httpResponse = Response.redirect(weburl, 302);
            } else if (queryString.has("dns")) {
                response.data.stopProcessing = false;
            } else {
                response.data.httpResponse = new Response(null, {
                    status: 400,
                    statusText: "Bad Request"
                });
            }
        } catch (e) {
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "CommandControl commandOperation";
            response.data.httpResponse = new Response(JSON.stringify(response.exceptionStack));
            response.data.httpResponse.headers.set("Content-Type", "application/json");
        }
        return response;
    }
}
function configRedirect(b64UserFlag, requestUrlOrigin, latestTimestamp) {
    let base = "https://rethinkdns.com/configure";
    let query = "?v=ext&u=" + requestUrlOrigin + "&tstamp=" + latestTimestamp + "#" + b64UserFlag;
    return Response.redirect(base + query, 302);
}
function domainNameToList(queryString, blocklistFilter, latestTimestamp) {
    let domainName = queryString.get("dn") || "";
    let returndata = {
    };
    returndata.domainName = domainName;
    returndata.version = latestTimestamp;
    returndata.list = {
    };
    var searchResult = blocklistFilter.hadDomainName(domainName);
    if (searchResult) {
        let list;
        let listDetail = {
        };
        for (let entry of searchResult){
            list = blocklistFilter.getTag(entry[1]);
            listDetail = {
            };
            for (let listValue of list){
                listDetail[listValue] = blocklistFilter.blocklistFileTag[listValue];
            }
            returndata.list[entry[0]] = listDetail;
        }
    } else {
        returndata.list = false;
    }
    let response = new Response(JSON.stringify(returndata));
    response.headers.set("Content-Type", "application/json");
    return response;
}
function domainNameToUint(queryString, blocklistFilter) {
    let domainName = queryString.get("dn") || "";
    let returndata = {
    };
    returndata.domainName = domainName;
    returndata.list = {
    };
    var searchResult = blocklistFilter.hadDomainName(domainName);
    if (searchResult) {
        for (let entry of searchResult){
            returndata.list[entry[0]] = entry[1];
        }
    } else {
        returndata.list = false;
    }
    let response = new Response(JSON.stringify(returndata));
    response.headers.set("Content-Type", "application/json");
    return response;
}
function listToB64(queryString, blocklistFilter) {
    let list = queryString.get("list") || [];
    let flagVersion = parseInt(queryString.get("flagversion")) || 0;
    let returndata = {
    };
    returndata.command = "List To B64String";
    returndata.inputList = list;
    returndata.flagVersion = flagVersion;
    returndata.b64String = blocklistFilter.getB64FlagFromTag(list.split(","), flagVersion);
    let response = new Response(JSON.stringify(returndata));
    response.headers.set("Content-Type", "application/json");
    return response;
}
function b64ToList(queryString, blocklistFilter) {
    let b64 = queryString.get("b64") || "";
    let returndata = {
    };
    returndata.command = "Base64 To List";
    returndata.inputB64 = b64;
    let response = blocklistFilter.unstamp(b64);
    if (response.userBlocklistFlagUint.length > 0) {
        returndata.list = blocklistFilter.getTag(response.userBlocklistFlagUint);
        returndata.listDetail = {
        };
        for (let listValue of returndata.list){
            returndata.listDetail[listValue] = blocklistFilter.blocklistFileTag[listValue];
        }
    } else {
        returndata.list = "Invalid B64 String";
    }
    response = new Response(JSON.stringify(returndata));
    response.headers.set("Content-Type", "application/json");
    return response;
}
class UserOperation {
    constructor(){
        this.userConfigCache = false;
        this.blocklistFilter = new BlocklistFilter();
    }
    async RethinkModule(param) {
        return this.loadUser(param);
    }
    loadUser(param) {
        let response = {
        };
        response.isException = false;
        response.exceptionStack = "";
        response.exceptionFrom = "";
        response.data = {
        };
        response.data.userBlocklistInfo = {
        };
        response.data.userBlocklistInfo.dnsResolverUrl = "";
        try {
            if (!param.isDnsMsg) {
                return response;
            }
            if (!this.userConfigCache) {
                this.userConfigCache = new LocalCache("User-Config-Cache", 1000);
            }
            let userBlocklistInfo = {
            };
            userBlocklistInfo.from = "Cache";
            let blocklistFlag = getBlocklistFlag(param.request.url);
            let currentUser = this.userConfigCache.Get(blocklistFlag);
            if (!currentUser) {
                currentUser = {
                };
                currentUser.userBlocklistFlagUint = "";
                currentUser.flagVersion = 0;
                currentUser.userServiceListUint = false;
                let response = this.blocklistFilter.unstamp(blocklistFlag);
                currentUser.userBlocklistFlagUint = response.userBlocklistFlagUint;
                currentUser.flagVersion = response.flagVersion;
                if (currentUser.userBlocklistFlagUint !== "") {
                    currentUser.userServiceListUint = this.blocklistFilter.flagIntersection(currentUser.userBlocklistFlagUint, this.blocklistFilter.wildCardUint);
                } else {
                    blocklistFlag = "";
                }
                userBlocklistInfo.from = "Generated";
                this.userConfigCache.Put(blocklistFlag, currentUser);
            }
            userBlocklistInfo.userBlocklistFlagUint = currentUser.userBlocklistFlagUint;
            userBlocklistInfo.flagVersion = currentUser.flagVersion;
            userBlocklistInfo.userServiceListUint = currentUser.userServiceListUint;
            response.data.userBlocklistInfo = userBlocklistInfo;
            response.data.dnsResolverUrl = param.dnsResolverUrl;
        } catch (e) {
            response.isException = true;
            response.exceptionStack = e.stack;
            response.exceptionFrom = "UserOperation loadUser";
            console.error("Error At : UserOperation -> loadUser");
            console.error(e.stack);
        }
        return response;
    }
}
function getBlocklistFlag(url) {
    let blocklistFlag = "";
    let reqUrl = new URL(url);
    let tmpsplit = reqUrl.pathname.split("/");
    if (tmpsplit.length > 1) {
        if (tmpsplit[1].toLowerCase() == "dns-query") {
            blocklistFlag = tmpsplit[2] || "";
        } else {
            blocklistFlag = tmpsplit[1] || "";
        }
    }
    return blocklistFlag;
}
const blocklistWrapper = new BlocklistWrapper();
const commandControl = new CommandControl();
const userOperation = new UserOperation();
const dnsBlock = new DNSBlock();
const dnsResolver = new DNSResolver();
const dnsResponseBlock = new DNSResponseBlock();
const dnsAggCache = new DNSAggCache();
class RethinkPlugin {
    constructor(event, env){
        this.parameter = new Map(env.getEnvMap());
        this.registerParameter("request", event.request);
        this.registerParameter("event", event);
        this.registerParameter("isDnsMsg", event.request.headers.get("Accept") == "application/dns-message" || event.request.headers.get("Content-Type") == "application/dns-message");
        this.plugin = [];
        this.registerPlugin("userOperation", userOperation, [
            "dnsResolverUrl",
            "request",
            "isDnsMsg"
        ], userOperationCallBack, false);
        this.registerPlugin("AggressiveCaching", dnsAggCache, [
            "userBlocklistInfo",
            "request",
            "requestBodyBuffer",
            "isAggCacheReq",
            "isDnsMsg", 
        ], dnsAggCacheCallBack, false);
        this.registerPlugin("blocklistFilter", blocklistWrapper, [
            "blocklistUrl",
            "latestTimestamp",
            "workerTimeout",
            "tdParts",
            "tdNodecount",
            "fetchTimeout", 
        ], blocklistFilterCallBack, false);
        this.registerPlugin("commandControl", commandControl, [
            "request",
            "blocklistFilter",
            "latestTimestamp"
        ], commandControlCallBack, false);
        this.registerPlugin("dnsBlock", dnsBlock, [
            "requestDecodedDnsPacket",
            "blocklistFilter",
            "userBlocklistInfo",
            "isAggCacheReq",
            "event",
            "request", 
        ], dnsBlockCallBack, false);
        this.registerPlugin("dnsResolver", dnsResolver, [
            "requestBodyBuffer",
            "request",
            "dnsResolverUrl",
            "runTimeEnv",
            "cloudPlatform",
            "requestDecodedDnsPacket",
            "event",
            "blocklistFilter", 
        ], dnsResolverCallBack, false);
        this.registerPlugin("DNSResponseBlock", dnsResponseBlock, [
            "userBlocklistInfo",
            "blocklistFilter",
            "responseDecodedDnsPacket"
        ], dnsResponseBlockCallBack, false);
    }
    registerParameter(key, parameter) {
        this.parameter.set(key, parameter);
    }
    registerPlugin(pluginName, module, parameter, callBack, continueOnStopProcess) {
        this.plugin.push({
            name: pluginName,
            module: module,
            param: parameter,
            callBack: callBack,
            continueOnStopProcess: continueOnStopProcess
        });
    }
    async executePlugin(req) {
        const t = starttime("exec-plugin");
        for (const p of this.plugin){
            if (req.stopProcessing && !p.continueOnStopProcess) {
                continue;
            }
            laptime(t, p.name, "send-req");
            const res = await p.module.RethinkModule(generateParam(this.parameter, p.param));
            laptime(t, p.name, "got-res");
            if (p.callBack) {
                await p.callBack.call(this, res, req);
            }
            laptime(t, p.name, "post-callback");
        }
        endtime(t);
    }
}
function blocklistFilterCallBack(response, currentRequest) {
    d("In blocklistFilterCallBack");
    if (response.isException) {
        loadException(response, currentRequest);
    } else {
        this.registerParameter("blocklistFilter", response.data.blocklistFilter);
    }
}
async function commandControlCallBack(response, currentRequest) {
    d("In commandControlCallBack", JSON.stringify(response.data));
    if (response.data.stopProcessing) {
        currentRequest.httpResponse = response.data.httpResponse;
        currentRequest.stopProcessing = true;
    }
}
async function userOperationCallBack(response, currentRequest) {
    d("In userOperationCallBack", JSON.stringify(response.data));
    if (response.isException) {
        loadException(response, currentRequest);
    } else if (!this.parameter.get("isDnsMsg") && this.parameter.get("request").method === "POST") {
        currentRequest.httpResponse = new Response(null, {
            status: 400,
            statusText: "Bad Request"
        });
        currentRequest.stopProcessing = true;
    } else {
        this.registerParameter("requestBodyBuffer", await getBodyBuffer(this.parameter.get("request"), this.parameter.get("isDnsMsg")));
        this.registerParameter("userBlocklistInfo", response.data.userBlocklistInfo);
        this.registerParameter("dnsResolverUrl", response.data.dnsResolverUrl);
    }
}
function dnsAggCacheCallBack(response, currentRequest) {
    d("In dnsAggCacheCallBack", JSON.stringify(response.data));
    if (response.isException) {
        loadException(response, currentRequest);
    } else if (response.data !== null) {
        this.registerParameter("requestDecodedDnsPacket", response.data.reqDecodedDnsPacket);
        currentRequest.decodedDnsPacket = response.data.reqDecodedDnsPacket;
        if (response.data.aggCacheResponse.type === "blocked") {
            currentRequest.isDnsBlock = response.data.aggCacheResponse.data.isBlocked;
            currentRequest.blockedB64Flag = response.data.aggCacheResponse.data.blockedB64Flag;
            currentRequest.stopProcessing = true;
            currentRequest.dnsBlockResponse();
        } else if (response.data.aggCacheResponse.type === "response") {
            this.registerParameter("responseBodyBuffer", response.data.aggCacheResponse.data.bodyBuffer);
            this.registerParameter("responseDecodedDnsPacket", response.data.aggCacheResponse.data.decodedDnsPacket);
            currentRequest.dnsResponse(response.data.aggCacheResponse.data.bodyBuffer);
            currentRequest.decodedDnsPacket = response.data.aggCacheResponse.data.decodedDnsPacket;
            currentRequest.stopProcessing = true;
        }
    }
}
function dnsBlockCallBack(response, currentRequest) {
    d("In dnsBlockCallBack", JSON.stringify(response.data));
    if (response.isException) {
        loadException(response, currentRequest);
    } else {
        currentRequest.isDnsBlock = response.data.isBlocked;
        currentRequest.blockedB64Flag = response.data.blockedB64Flag;
        if (currentRequest.isDnsBlock) {
            currentRequest.stopProcessing = true;
            currentRequest.dnsBlockResponse();
        }
    }
}
function dnsResolverCallBack(response, currentRequest) {
    d("In dnsResolverCallBack", JSON.stringify(response.data));
    if (response.isException) {
        loadException(response, currentRequest);
    } else {
        this.registerParameter("responseBodyBuffer", response.data.responseBodyBuffer);
        this.registerParameter("responseDecodedDnsPacket", response.data.responseDecodedDnsPacket);
        currentRequest.decodedDnsPacket = response.data.responseDecodedDnsPacket;
    }
}
function dnsResponseBlockCallBack(response, currentRequest) {
    d("In dnsCnameBlockCallBack", JSON.stringify(response.data));
    if (response.isException) {
        loadException(response, currentRequest);
    } else {
        currentRequest.isDnsBlock = response.data.isBlocked;
        currentRequest.blockedB64Flag = response.data.blockedB64Flag;
        if (currentRequest.isDnsBlock) {
            currentRequest.stopProcessing = true;
            currentRequest.dnsBlockResponse();
        } else {
            currentRequest.dnsResponse(this.parameter.get("responseBodyBuffer"));
            currentRequest.stopProcessing = true;
        }
    }
}
function loadException(response, currentRequest) {
    e1(JSON.stringify(response));
    currentRequest.stopProcessing = true;
    currentRequest.isException = true;
    currentRequest.exceptionStack = response.exceptionStack;
    currentRequest.exceptionFrom = response.exceptionFrom;
    currentRequest.dnsExceptionResponse();
}
function generateParam(parameter, list) {
    const param = {
    };
    for (const key of list){
        if (parameter.has(key)) {
            param[key] = parameter.get(key);
        }
    }
    return param;
}
async function getBodyBuffer(request, isDnsMsg) {
    if (!isDnsMsg) {
        return "";
    }
    if (request.method.toUpperCase() === "GET") {
        const QueryString = new URL(request.url).searchParams;
        return base64ToArrayBuffer(decodeURI(QueryString.get("dns")).replace(/-/g, "+").replace(/_/g, "/"));
    } else {
        return await request.arrayBuffer();
    }
}
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for(let i = 0; i < len; i++){
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}
class Env {
    constructor(){
        this.env = new Map();
        this.isLoaded = false;
    }
    loadEnv() {
        try {
            this.env.set("runTimeEnv", RUNTIME_ENV);
            this.env.set("cloudPlatform", CLOUD_PLATFORM);
            this.env.set("blocklistUrl", CF_BLOCKLIST_URL);
            this.env.set("latestTimestamp", CF_LATEST_BLOCKLIST_TIMESTAMP);
            this.env.set("dnsResolverUrl", CF_DNS_RESOLVER_URL);
            this.env.set("onInvalidFlagStopProcessing", CF_ON_INVALID_FLAG_STOPPROCESSING == "true" ? true : false);
            this.env.set("workerTimeout", parseInt(WORKER_TIMEOUT) + parseInt(CF_BLOCKLIST_DOWNLOAD_TIMEOUT));
            this.env.set("fetchTimeout", parseInt(CF_BLOCKLIST_DOWNLOAD_TIMEOUT));
            this.env.set("tdNodecount", parseInt(TD_NODE_COUNT));
            this.env.set("tdParts", parseInt(TD_PARTS));
            this.env.set("isAggCacheReq", IS_AGGRESSIVE_CACHE_REQ == "true" ? true : false);
            this.isLoaded = true;
        } catch (e) {
            if (e instanceof ReferenceError) {
                typeof Deno !== "undefined" ? this.loadEnvDeno() : this.loadEnvNode();
            } else throw e;
        }
    }
    loadEnvDeno() {
        this.env.set("runTimeEnv", Deno.env.get("RUNTIME_ENV"));
        this.env.set("cloudPlatform", Deno.env.get("CLOUD_PLATFORM"));
        this.env.set("blocklistUrl", Deno.env.get("CF_BLOCKLIST_URL"));
        this.env.set("latestTimestamp", Deno.env.get("CF_LATEST_BLOCKLIST_TIMESTAMP"));
        this.env.set("dnsResolverUrl", Deno.env.get("CF_DNS_RESOLVER_URL"));
        this.env.set("onInvalidFlagStopProcessing", Deno.env.get("CF_ON_INVALID_FLAG_STOPPROCESSING"));
        this.env.set("tdNodecount", Deno.env.get("TD_NODE_COUNT"));
        this.env.set("tdParts", Deno.env.get("TD_PARTS"));
        this.env.set("fetchTimeout", Deno.env.get("CF_BLOCKLIST_DOWNLOAD_TIMEOUT"));
        this.env.set("isAggCacheReq", false);
        this.isLoaded = true;
    }
    loadEnvNode() {
        this.env.set("runTimeEnv", process.env.RUNTIME_ENV);
        this.env.set("cloudPlatform", process.env.CLOUD_PLATFORM);
        this.env.set("blocklistUrl", process.env.CF_BLOCKLIST_URL);
        this.env.set("latestTimestamp", process.env.CF_LATEST_BLOCKLIST_TIMESTAMP);
        this.env.set("dnsResolverUrl", process.env.CF_DNS_RESOLVER_URL);
        this.env.set("onInvalidFlagStopProcessing", process.env.CF_ON_INVALID_FLAG_STOPPROCESSING);
        this.env.set("tdNodecount", process.env.TD_NODE_COUNT);
        this.env.set("tdParts", process.env.TD_PARTS);
        this.env.set("fetchTimeout", process.env.CF_BLOCKLIST_DOWNLOAD_TIMEOUT);
        this.env.set("isAggCacheReq", false);
        this.isLoaded = true;
    }
    getEnvMap() {
        return this.env;
    }
    get(key) {
        return this.env.get(key);
    }
    put(key, value) {
        this.env.set(key, value);
    }
}
function fromBrowser(req) {
    if (!req || !req.headers) return false;
    const ua = req.headers.get("User-Agent");
    return ua && ua.startsWith("Mozilla/5.0");
}
function jsonHeaders(res) {
    res.headers.set("Content-Type", "application/json");
}
function dnsHeaders(res) {
    res.headers.set("Content-Type", "application/dns-message");
}
function corsHeaders(res) {
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Headers", "*");
}
function browserHeaders(res) {
    jsonHeaders(res);
    corsHeaders(res);
}
function dohHeaders(req, res) {
    dnsHeaders(res);
    if (fromBrowser(req)) corsHeaders(res);
}
const dns = new DNSParserWrap();
const servfail = dns.Encode({
    type: "response",
    flags: 4098
});
const env = new Env();
if (typeof addEventListener !== "undefined") {
    addEventListener("fetch", (event)=>{
        if (!env.isLoaded) {
            env.loadEnv();
        }
        event.respondWith(handleRequest(event));
    });
}
function handleRequest(event) {
    const processingTimeout = env.get("workerTimeout");
    const respectTimeout = env.get("runTimeEnv") == "worker" && processingTimeout > 0;
    if (!respectTimeout) return proxyRequest(event);
    return Promise.race([
        new Promise((resolve, _)=>{
            resolve(proxyRequest(event));
        }),
        new Promise((resolve, _)=>{
            setTimeout(()=>{
                resolve(servfail1(event));
            }, processingTimeout);
        }), 
    ]);
}
async function proxyRequest(event) {
    try {
        if (event.request.method === "OPTIONS") {
            const res = new Response(null, {
                status: 204
            });
            corsHeaders(res);
            return res;
        }
        if (!env.isLoaded) {
            env.loadEnv();
        }
        const currentRequest = new CurrentRequest();
        const plugin = new RethinkPlugin(event, env);
        await plugin.executePlugin(currentRequest);
        dohHeaders(event.request, currentRequest.httpResponse);
        return currentRequest.httpResponse;
    } catch (err) {
        e1(err.stack);
        return errorOrServfail(event, err);
    }
}
function errorOrServfail(event, err) {
    if (fromBrowser(event)) {
        const res = new Response(JSON.stringify(e.stack));
        browserHeaders(res);
        return res;
    }
    return servfail1(event);
}
function servfail1(event) {
    const res = new Response(servfail);
    dohHeaders(event.request, res);
    return res;
}
const { TERMINATE_TLS , TLS_CRT_PATH , TLS_KEY_PATH  } = Deno.env.toObject();
const l = TERMINATE_TLS == "true" ? Deno.listenTls({
    port: 8080,
    certFile: TLS_CRT_PATH,
    keyFile: TLS_KEY_PATH
}) : Deno.listen({
    port: 8080
});
console.log(`Running HTTP webserver at: http://${l.addr.hostname}:${l.addr.port}/`);
for await (const conn of l){
    handleHttp(conn);
}
async function handleHttp(conn) {
    const httpConn = Deno.serveHttp(conn);
    let requestEvent = null;
    while(true){
        try {
            requestEvent = await httpConn.nextRequest();
        } catch (e) {
            console.warn("error reading http request", e);
        }
        if (requestEvent) {
            try {
                await requestEvent.respondWith(handleRequest(requestEvent));
            } catch (e) {
                console.warn("error handling http request", e);
            }
        }
    }
}
