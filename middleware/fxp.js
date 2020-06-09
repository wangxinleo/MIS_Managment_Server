const fxp = require('fast-xml-parser')
/**
 * 
 * var options = {
  attributeNamePrefix : "@_",
  attrNodeName: "attr", //default is 'false'
  textNodeName : "#text",
  ignoreAttributes : true,
  ignoreNameSpace : false,
  allowBooleanAttributes : false,
  parseNodeValue : true,
  parseAttributeValue : false,
  trimValues: true,
  cdataTagName: "__cdata", //default is 'false'
  cdataPositionChar: "\\c",
  localeRange: "", //To support non english character in tag/attribute values.
  parseTrueNumberOnly: false,
  attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
  tagValueProcessor : a => he.decode(a) //default is a=>a
};

attributeNamePrefix: 提供预定的字符串作为属性名称前缀, 比如@_， 这时假设解析的属性为name，那么在解析后的JSON中该属性将会解析为@_name
attrNodeName: 将所有属性分组为给定名称的属性， 取代原本的属性名称， 修改为该名称
ignoreAttributes: 忽略解析属性， 配置该项的时候不会解析标签内的属性， 默认为true
ignoreNameSpace: 从标记和属性名称中移除命名空间字符串
allowBooleanAttributes: 标记可以具有不带任何值的属性
parseNodeValue : 将属性的值解析为float、integer或boolean
parseAttributeValue: 将属性的值解析为float、integer或boolean
trimValues: 修剪属性或节点的字符串值
decodeHTMLchar: This options has been removed from 3.3.4. Instead, use - tagValueProcessor, and attrValueProcessor. See above example.
cdataTagName: 如果指定，解析器会将CDATA解析为嵌套标记，而不是将其值添加到父标记中
cdataPositionChar: 它将有助于将JSON转换回XML，而不会失去CData的位置。
localeRange: 解析器将接受标记或属性名中的非英文字符
parseTrueNumberOnly: 如果为真，则像“+123”或“0123”这样的值不会被解析为数字。
tagValueProcessor: 转换期间处理标记值。如HTML解码、单词大写等，仅适用于字符串。
attrValueProcessor: 转换期间处理属性值。如HTML解码、单词大写等，仅适用于字符串
stopNodes: 不需要解析的标记名数组。相反，它们的值被解析为字符串。
 */
const options = {
  attributeNamePrefix: '',
  // 忽略解析属性， 配置该项的时候不会解析标签内的属性， 默认为true
  ignoreAttributes: false,
  // 指定#text的属性值名称
  textNodeName: 'value',
}

module.exports = (xmldata) => {
  const xml2json = fxp.parse(xmldata, options)
  return xml2json
}
