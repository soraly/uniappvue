/**
 * 默认值模板
 * 定义src的默认值(当提供的数据为null或undefined则启用默认值), 且自动转换为默认值的类型. 会删除原始数据有且模板中不存在的属性, 添加模板上有且原始数据不存在的属性
 * @example 基本类型
 * defaultTemplate(10,undefined); //10
 * defaultTemplate(10,20); //20
 * defaultTemplate(10,'20'); //20
 * defaultTemplate(false,null); //false
 * defaultTemplate(false,true); //true
 * defaultTemplate(false,'true'); //true
 * @example 原样返回
 * defaultTemplate(null,10); //10
 * defaultTemplate(null,'10'); //'10'
 * defaultTemplate(null,{a:1}); //{a:1}
 * @example 数组默认值
 * defaultTemplate([10],[null,'20',20]); //[10,20,20]
 * @example 对象默认值
 * defaultTemplate({a:10,b:false,c:20},{a:'20',b:null,d:'test'}); //{a:20,b:false,c:20}
 * defaultTemplate({a:10,'?':true},{b:'false',c:null,d:false}); //{a:10,b:false,c:true,d:false}
 * @example 自定义处理函数
 * defaultTemplate(function(data){return data*2;},20); //40
 * @param def 模板, null或undefined表示原样返回, 数组中的对象表示对每个元素的模板, 对象中的 " ? " 键表示适配所有键
 * @param src 原数据
 * @return 处理后的数据
 */
export default function defaultTemplate(def, src) {
	if (def == null) {
		return src
	} else if (typeof def === 'function') {
		return def(src)
	} else if (isBaseType(def)) {
		return src != null && isBaseType(src) ? convert(def)(src) : def
	} else if (Array.isArray(def)) {
		if (Array.isArray(src)) {
			if (def.length) {
				const arr = new Array(src.length)
				const def1 = def[0]
				for (let i = 0; i < src.length; ++i) {
					arr[i] = defaultTemplate(def1, src[i])
				}
				return arr
			}
			return src
		}
		return []
	} else {
		const keys = Object.keys(def)
		const obj = {}
		if (isObject(src)) {
			const srcKeys = Object.keys(src)
			let isAllTemplate = false
			let allTemplate
			//倒序遍历, 方便从数组后面移除元素(更快)
			for (let i = keys.length - 1; i >= 0; --i) {
				const key = keys[i]
				if (key === '?') {
					isAllTemplate = true
					allTemplate = def[key]
					continue
				}
				//元素大概率在后面, 所以采用lastIndexOf方法
				const index = srcKeys.lastIndexOf(key)
				if (index !== -1) {
					srcKeys.splice(index, 1)
					obj[key] = defaultTemplate(def[key], src[key])
				} else {
					obj[key] = defaultTemplate(def[key], undefined)
				}
			}
			if (isAllTemplate) {
				for (let i = 0; i < srcKeys.length; ++i) {
					const key = srcKeys[i]
					obj[key] = defaultTemplate(allTemplate, src[key])
				}
			}
		} else {
			for (let i = keys.length - 1; i >= 0; --i) {
				const key = keys[i]
				if (key === '?') continue
				obj[key] = defaultTemplate(def[key], undefined)
			}
		}
		return obj
	}
}
/**
 * 判断基本类型(可以直接赋值)
 * null, undefined, boolean, number, string, function, bigint, symbol皆属于基本类型, 可以直接赋值
 * @param val 测试值
 * @return 测试结果
 */
function isBaseType(val) {
	return (
		val == null ||
		typeof val === 'boolean' ||
		typeof val === 'number' ||
		typeof val === 'string' ||
		typeof val === 'function' ||
		typeof val === 'bigint' ||
		val.constructor === Symbol
	)
}
/**
 * 判断普通对象(不包括数组)
 * 除了isBaseType判断为true和数组的值
 * @param val 测试值
 * @return 测试结果
 */
function isObject(val) {
	return !(isBaseType(val) || Array.isArray(val))
}

/**
 * 返回转换为指定实例的类型的转换器
 * @param type 目标类型的实例
 * @return 转换器
 */
function convert(type) {
	if (typeof type === 'boolean') {
		return function (val) {
			if (typeof val === 'string' && val.toLowerCase() === 'false') return false
			return Boolean(val)
		}
	} else if (typeof type === 'number') {
		return function (val) {
			const val2 = Number(val)
			return isFinite(val2) ? val2.toFixed(2) : type
		}
	} else if (typeof type === 'string') {
		return function (val) {
			return `${val}`
		}
	} else {
		return function (val) {
			return val
		}
	}
}
