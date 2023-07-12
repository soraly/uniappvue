import CryptoJS from '@/utils/common/crypto-js.js'

let EncryptUtils = {
    AES: {
        aesIvKey: null,
        getAesIvKey: function () {
            if (!this.aesIvKey) {
                let ivArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
                let iv = EncryptUtils.getStrFromBytes(ivArr);
                this.aesIvKey = CryptoJS.enc.Utf8.parse(iv);
            }
            return this.aesIvKey;
        },
        encrypt: function (value, key) {
            return CryptoJS.AES.encrypt(value, key, this.getOption(this.getAesIvKey()));
        },
        decrypt: function (value, key) {
            return CryptoJS.AES.decrypt(value, key, this.getOption(this.getAesIvKey()));
        },
        option: null,
        getOption: function (ivKey) {
            if (!this.option) {
                this.option = {
                    iv: ivKey,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7,
                }
            }

            return this.option;
        },
    },

    encryptAES_StrToStr_test:function(value,key){
        // value=CryptoJS.enc.Utf8.parse(value);
        // key=CryptoJS.enc.Base64.parse(key);
        let result= this.AES.encrypt(value,key);
        return CryptoJS.enc.Base64.stringify(result.ciphertext);
    },

    encryptAES_StrToStr:function(value,key){
        value=CryptoJS.enc.Utf8.parse(value);
        key=CryptoJS.enc.Base64.parse(key);
        let result= this.AES.encrypt(value,key);
        return CryptoJS.enc.Base64.stringify(result.ciphertext);
    },

    encryptAES: function (value, key) {
        return this.AES.encrypt(value, key);
    },
    encryptMac: function (value, key) {
        return CryptoJS.HmacMD5(value, key);
    },
    encryptMacToBase64: function (value, key) {
        let mac = this.encryptMac(value, key);
        return CryptoJS.enc.Base64.stringify(mac);
    },

    rsaKeySize: 1024,


    /*
    DH 算法
    */
    DH: {
        /*
        公钥转换截取 字符串
        */
        beginPubKey: "3056301006072a8648ce3d020106052b8104000a034200",

        /*
        私钥转换截取 字符串 前缀
        */
        beginPriKey: "30740201010420",
        /*
        私钥转换截取 字符串 后缀
        */
        endPriKey: "A00706052B8104000AA144034200",
        ecdh: null,/*DH 对象*/
        getECDH: function () {
            if (!this.ecdh)
                this.ecdh = new elliptic.ec('secp256k1');
            return this.ecdh;
        },
        /*
        创建DH 密钥对
        */
        genKeyPair: function () {
            return this.getECDH().genKeyPair();
        },
        /*
        js DH公钥对象转换为 服务器 base64 公钥字符串
        pub  js DH公钥对象
        */
        encryptPublicKey: function (pub) {
            let pubHexStr = this.beginPubKey + pub.encode('hex');
            let pubByte = CryptoJS.enc.Hex.parse(pubHexStr);
            return CryptoJS.enc.Base64.stringify(pubByte);
        },
        /*
        服务器 公钥字符串 转换为 js 公钥
        pubBase64Str base64 的公钥字符串
        */
        decryptPublicKey: function (pubBase64Str) {
            let byteBase64 = CryptoJS.enc.Base64.parse(pubBase64Str);
            let hexString = CryptoJS.enc.Hex.stringify(byteBase64);
            hexString = hexString.substring(46, hexString.length);
            return this.getECDH().keyFromPublic(hexString, "hex");
        },
        /*
        js DH私钥对象转换为 服务器 base64 公钥字符串
        keyPair  js 密钥对象
        */
        encryptPrivateKey: function (keyPair) {
            let pri = keyPair.getPrivate('hex');
            let pub = keyPair.getPublic('hex');
            let priHexStr = this.beginPriKey + pri + this.endPriKey + pub;
            let priByte = CryptoJS.enc.Hex.parse(priHexStr);
            return CryptoJS.enc.Base64.stringify(priByte);
        },
        /*
        服务器 私钥字符串 转换为 js 密钥
        priBase64Str base64 的私钥字符串
        */
        decryptPrivateKey: function (priBase64Str) {
            let byteBase64 = CryptoJS.enc.Base64.parse(priBase64Str);
            let hexString = CryptoJS.enc.Hex.stringify(byteBase64);
            hexString = hexString.substring(14, hexString.length);
            hexString = hexString.substring(0, 64);
            return this.getECDH().keyFromPrivate(hexString, "hex");
        },


    },
    /*
    创建DH 密钥对
    */
    genDHKeyPair: function () {
        return this.DH.genKeyPair();
    },
    /*
    js DH公钥对象转换为 服务器 base64 公钥字符串
    pub  js DH公钥对象
    */
    encryptDHPublicKey: function (pub) {
        return this.DH.encryptPublicKey(pub);
    },
    /*
    服务器 公钥字符串 转换为 js 公钥
    pubBase64Str base64 的公钥字符串
    */
    decryptDHPublicKey: function (pubBase64Str) {
        return this.DH.decryptPublicKey(pubBase64Str);
    },
    /*
    js DH私钥对象转换为 服务器 base64 公钥字符串
    keyPair  js 密钥对象
    */
    encryptDHPrivateKey: function (keyPair) {
        return this.DH.encryptPrivateKey(keyPair);
    },
    /*
    服务器 私钥字符串 转换为 js 公钥
    priBase64Str base64 的私钥字符串
    */
    decryptDHPrivateKey: function (priBase64Str) {
        return this.DH.decryptPrivateKey(priBase64Str);
    },
    /*
    根据 base64 私钥字符串 和 base64 的公钥字符串
    生成协商密钥 base64 字符串
    */
    deriveDHFromBase64Key: function (priBase64Str, pubBase64Str) {
        let priKey = this.decryptPrivateKey(priBase64Str);
        let key = this.decryptDHPublicKey(pubBase64Str);
        let deriveKey = priKey.derive(key.getPublic());
        let hex = CryptoJS.enc.Hex.parse(comm1.toString(16));
        return CryptoJS.enc.Base64.stringify(hex);
    },
    /*
    根据 密钥对 和 base64 的公钥字符串
    生成协商密钥 base64 字符串
    */
    deriveDHKey: function (keyPair, pubBase64Str) {
        let key = this.decryptDHPublicKey(pubBase64Str);
        let deriveKey = keyPair.derive(key.getPublic());
        let hex = CryptoJS.enc.Hex.parse(comm1.toString(16));
        return CryptoJS.enc.Base64.stringify(hex);
    },


    /*
    字节数组转换为字符串
    */
    getStrFromBytes: function (arr) {
        let r = "";
        /* for (let i in arr) {
             r += String.fromCharCode(i);
         }*/
        for (let i = 0; i < arr.length; i++) {
            r += String.fromCharCode(arr[i]);
        }
        return r;
    },
}
export default EncryptUtils;

