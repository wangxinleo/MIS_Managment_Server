const express = require('express')
const router = express.Router()
const db = require('../database/db')
const fxp = require('../middleware/fxp')
const fs = require('fs')
const path = require('path')

// 查询OA权限申请记录
router.post('/getEmpData', (req, res, next) => {
  const reqData = req.body
  // 过滤数组，去除空字符
  reqData.empText = reqData.empText.filter((el) => {
    return el !== ''
  })
  // 处理需要查询的字段
  const slotSql = jointSql(reqData.empText, ['Subject'])
  // sql语句
  const sql =
    `
	select top ` +
    reqData.pageSize +
    ` WF_DocUNID,WF_ProcessUNID,WF_AddName,WF_ProcessName,WF_DocNumber,WF_DocCreated,Subject,COUNT(1) OVER() AS total,XmlData from [BPM_ArchivedData] 
	where WF_DocNumber not in
(select top ` +
    (reqData.page - 1) * reqData.pageSize +
    ` WF_DocNumber from [BPM_ArchivedData]
where WF_ProcessName like '%MIS权限申请流程%' and
	` +
    slotSql +
    `
order by WF_DocCreated desc)
	and WF_ProcessName like '%MIS权限申请流程%' 
	and ` +
    slotSql +
    `
order by WF_DocCreated desc
	`
  // 请求主体
  db.bpm(sql, (result) => {
    // 无数据
    if (result.recordset.length === 0) {
      return res.json({
        code: 204,
        msg: 'OA权限申请记录:查询无数据',
        totalCount: 0,
      })
    }
    // xml转json
    result.recordset.forEach((item) => {
      let obj = {}
      const xml2json = fxp(item.XmlData)
      item.XmlData = xml2json.Items.WFItem
      item.XmlData.forEach((item) => {
        obj[item.name] = item.value
      })
      item.XmlData = obj
    })
    return res.json({
      code: 200,
      msg: '获取OA权限申请记录数据成功',
      page: reqData.page,
      pageSize: reqData.pageSize,
      searchHistroy: reqData.empText,
      totalCount: result.recordset[0].total,
      data: result.recordset,
    })
  })
})
// 查询纸质档案记录
router.post('/getFilesData', (req, res, next) => {
  const reqData = req.body
  let pathArray = []
  // 过滤数组，去除空字符
  reqData.empText = reqData.empText.filter((el) => {
    return el !== ''
  })
  // 返回工作目录路径
  var root = path.join(process.cwd(), '/files/fileList.json')
  // 查询文件
  const filePath = JSON.parse(fs.readFileSync(root, 'utf-8'))
  reqData.empText.forEach((item, index) => {
    const data = filePath.filter((el) => {
      return el.name.indexOf(item) !== -1
    })
    pathArray = pathArray.concat(data)
  })
  // const pathArray = readDirSync(root, reqData.empText, [])
  if (pathArray.length > 0) {
    return res.json({
      code: 200,
      msg: '获取纸质档案记录成功',
      totalCount: pathArray.length,
      data: pathArray,
    })
  } else {
    return res.json({
      code: 204,
      msg: '纸质档案记录:查询无数据',
      totalCount: 0,
    })
  }
})
// 打开纸质档案
router.post('/openFilesUrl', (req, res, next) => {
  const reqData = req.body
  // 读取文件
  const imageData = fs.readFileSync(path.join(process.cwd(), reqData.path))
  // 转图片base64编码
  const imageBase64 = imageData.toString('base64')
  let imagePrefix = ''
  // 判断图片类型
  if (reqData.type == 'png') {
    imagePrefix = 'data:image/png;base64,'
  } else if (reqData.type == 'jpeg') {
    imagePrefix = 'data:image/jpeg;base64,'
  } else {
    imagePrefix = 'data:image/jpg;base64,'
  }
  return res.json({
    code: 200,
    msg: 'success',
    data: imagePrefix + imageBase64,
  })
  // return res.sendFile(path.join(process.cwd(), reqData.path))
})
// 更新纸质档案索引
router.get('/reloadFiles', (req, res, next) => {
  // 返回工作目录路径
  const root = path.join(process.cwd(), '/files')
  // var root = process.cwd()
  // 查询文件
  const pathArray = JSON.stringify(readDirSync(root, null, []))
  fs.writeFile(
    path.join(process.cwd(), '/files/fileList.json'),
    pathArray,
    'utf8',
    (err) => {
      //如果err=null，表示文件使用成功，否则，表示希尔文件失败
      if (err) {
        console.log('更新文件出错了，错误是：' + err)
      } else {
        console.log('更新文件成功')
      }
    }
  )
  return res.json({ data: '更新文件成功' })
})
// 查询功能机申请记录
router.post('/getPhonesData', (req, res, next) => {
  const reqData = req.body
  // 过滤数组，去除空字符
  reqData.empText = reqData.empText.filter((el) => {
    return el !== ''
  })
  // 处理需要查询的字段
  const slotSql = jointSql(reqData.empText, ['employeeCode', 'employeeName'])
  // sql语句
  sql =
    `
	select top ` +
    reqData.pageSize +
    ` COUNT(1) OVER() AS total,* from [MISissuePhones]
	where id not in
(select top ` +
    (reqData.page - 1) * reqData.pageSize +
    ` id from [MISissuePhones]
where 
	` +
    slotSql +
    `
order by id desc)
	and ` +
    slotSql +
    `
order by id desc
	`
  db.bpm(sql, (result) => {
    // 无数据
    if (result.recordset.length === 0) {
      return res.json({
        code: 204,
        msg: '功能机申请记录:查询无数据',
        totalCount: 0,
      })
    }

    return res.json({
      code: 200,
      msg: '获取功能机申请记录数据成功',
      page: reqData.page,
      pageSize: reqData.pageSize,
      searchHistroy: reqData.empText,
      totalCount: result.recordset[0].total,
      data: result.recordset,
    })
  })
})
// 查询功能机所属厂提示信息
router.post('/getAreaOption', (req, res, next) => {
  const sql = `SELECT area FROM [bpm].[dbo].[MISissuePhones] group by area`
  const data = []
  db.bpm(sql, (result) => {
    result.recordset.forEach((item) => {
      data.push(item.area)
    })
    return res.json({
      code: 200,
      msg: '获取所属厂提示信息数据成功',
      data: data,
    })
  })
})
// 查询功能机部门提示信息
router.post('/getDeptOption', (req, res, next) => {
  const sql = `SELECT TOP 1000 [Department] FROM [bpm].[dbo].[MISissuePhones] group by [Department]`
  const data = []
  db.bpm(sql, (result) => {
    result.recordset.forEach((item) => {
      data.push(item.Department)
    })
    return res.json({
      code: 200,
      msg: '获取部门提示信息数据成功',
      data: data,
    })
  })
})
// 新增功能机信息
router.post('/addMISmobileForm', (req, res, next) => {
  const reqData = req.body
  const sql =
    `
	INSERT INTO [bpm].[dbo].[MISissuePhones] VALUES ('` +
    reqData.employeeCode +
    `','` +
    reqData.area +
    `','` +
    reqData.Department +
    `','` +
    reqData.employeeName +
    `','` +
    reqData.issuePhoneNum +
    `','` +
    reqData.issuePhoneSort +
    `','` +
    reqData.isReturn +
    `','` +
    reqData.remark +
    `')
	`
  db.bpm(sql, (result) => {
    return res.json({
      code: 200,
      msg: '功能机记录数据已成功上传',
    })
  })
})
// 修改功能机信息
router.post('/updateMISmobileForm', (req, res, next) => {
  const reqData = req.body
  const sql =
    `
				UPDATE [bpm].[dbo].[MISissuePhones] SET employeeCode = '` +
    reqData.employeeCode +
    `', area = '` +
    reqData.area +
    `',
			Department = '` +
    reqData.Department +
    `', employeeName = '` +
    reqData.employeeName +
    `',
			issuePhoneNum = '` +
    reqData.issuePhoneNum +
    `', issuePhoneSort = '` +
    reqData.issuePhoneSort +
    `',
			isReturn = '` +
    reqData.isReturn +
    `', remark = '` +
    reqData.remark +
    `'
			WHERE id = '` +
    reqData.id +
    `'
				`
  db.bpm(sql, (result) => {
    return res.json({
      code: 200,
      msg: '功能机记录数据已成功修改',
    })
  })
})
// 删除功能机一行记录
router.post('/deletePhonesData', (req, res, next) => {
  const reqData = req.body
  const sql =
    `
	delete from [bpm].[dbo].[MISissuePhones] where id = '` +
    reqData.id +
    `'
	`
  db.bpm(sql, (result) => {
    return res.json({
      code: 200,
      msg: '数据删除成功',
    })
  })
})
// 查找电脑档案记录
router.post('/getComputersData', (req, res, next) => {
  const reqData = req.body
  // 过滤数组，去除空字符
  reqData.empText = reqData.empText.filter((el) => {
    return el !== ''
  })
  // 处理需要查询的字段
  const slotSql = jointSql(reqData.empText, ['userid', 'user'])
  // sql语句
  const sql =
    `select SQL_CALC_FOUND_ROWS * from ac_computer where ` +
    slotSql +
    ` order by time desc limit ` +
    (reqData.page - 1) * reqData.pageSize +
    `,` +
    reqData.pageSize +
    `;` +
    `SELECT FOUND_ROWS() as total;`

  // const total = `SELECT FOUND_ROWS() as total;`
  db.archive(sql, (result) => {
    if (result[1][0].total == 0) {
      return res.json({
        code: 204,
        msg: '电脑档案记录:查询无数据',
        totalCount: 0,
      })
    } else {
      return res.json({
        code: 200,
        msg: '查询电脑档案记录成功',
        page: reqData.page,
        pageSize: reqData.pageSize,
        searchHistroy: reqData.empText,
        totalCount: result[1][0].total,
        data: result[0],
      })
    }
  })
})
// 查询电脑维修记录
router.post('/getMISPCMaintainData', (req, res, next) => {
  const reqData = req.body
  let slotSql = ''
  let andStr = ''
  let Filter = ''
  // 处理需要查询的字段
  if (reqData.empText.length > 0 && reqData.select) {
    slotSql = jointSql(reqData.empText, reqData.select.split(' '))
    andStr = 'and'
  }
  // 筛选的数据
  if (reqData.checkList.length > 0) {
    if (reqData.checkList.indexOf('维修中') !== -1) {
      Filter += " STA = '维修中' and "
    }
    if (reqData.checkList.indexOf('已报废') !== -1) {
      Filter += "Scrap is not null and Scrap <> '' and"
    }
  }
  const sql =
    `
	select top ` +
    reqData.pageSize +
    ` COUNT(1) OVER() AS total,* from [BPM_MISComputerMaintain]
        where [id] not in
(select top ` +
    (reqData.page - 1) * reqData.pageSize +
    ` [id] from [BPM_MISComputerMaintain]
where ` +
    slotSql +
    ` ` +
    andStr +
    Filter +
    ` [StartDate] between '` +
    reqData.startDate +
    `' and '` +
    reqData.overDate +
    `'
order by [StartDate] desc)
and (` +
    slotSql +
    ` ` +
    andStr +
    Filter +
    ` [StartDate] between '` +
    reqData.startDate +
    `' and '` +
    reqData.overDate +
    `')
order by [StartDate] desc
	`
  db.bpm(sql, (result) => {
    // 无数据
    if (result.recordset.length === 0) {
      return res.json({
        code: 204,
        msg: '电脑维修记录:查询无数据',
        totalCount: 0,
      })
    }
    return res.json({
      code: 200,
      msg: '获取电脑维修记录数据成功',
      page: reqData.page,
      pageSize: reqData.pageSize,
      startDate: reqData.startDate,
      overDate: reqData.overDate,
      searchHistroy: reqData.empText,
      select: reqData.select,
      checkList: reqData.checkList,
      totalCount: result.recordset[0].total,
      data: result.recordset,
    })
  })
})

// 需要查询的字段组装成模糊查询的条件
/**
 *
 * @param {*} empData 从前端获取的search关键字
 * @param {*} sereachKeyArr 需要模糊查询的表字段
 */
function jointSql(empData, sereachKeyArr) {
  let slotSql = ''
  const length = empData.length
  sereachKeyArr.forEach((sereachKey, i) => {
    empData.forEach((item, index) => {
      if (index == 0) {
        slotSql += `(` + sereachKey + ` like '%` + item + `%' `
      } else if (index < length) {
        slotSql += `or ` + sereachKey + ` like '%` + item + `%' `
      }
    })
    slotSql += ')'
    if (i < sereachKeyArr.length - 1) {
      slotSql += ' or '
    }
  })
  return slotSql
}
// 遍历目录（同步操作）
function readDirSync(path, searchAarry, pathArray) {
  const temp = fs.readdirSync(path)
  temp.forEach((item, index) => {
    const info = fs.statSync(path + '/' + item)
    if (info.isDirectory()) {
      // 递归查找
      if (searchAarry == null) {
        pathArray = readDirSync(path + '/' + item, null, pathArray)
      } else {
        pathArray = readDirSync(path + '/' + item, searchAarry, pathArray)
      }
    } else {
      // 判断是否包含搜索关键字
      if (searchAarry == null) {
        // 组装数据
        let staticPath = path + '/' + item
        staticPath = staticPath.split('\\')
        let itemArr = item.split('.')
        let obj = {
          name: itemArr[0],
          type: itemArr[itemArr.length - 1],
          path: staticPath[staticPath.length - 1],
        }
        pathArray.push(obj)
      } else {
        searchAarry.forEach((keyStr) => {
          if (item.toLowerCase().indexOf((keyStr + '').toLowerCase()) !== -1) {
            // 组装数据
            let staticPath = path + '/' + item
            staticPath = staticPath.split('\\')
            let itemArr = item.split('.')
            let obj = {
              name: itemArr[0],
              type: itemArr[itemArr.length - 1],
              path: staticPath[staticPath.length - 1],
            }
            pathArray.push(obj)
          }
        })
      }
    }
  })
  return pathArray
}

module.exports = router

/**
__dirname 　　　　表示当前文件所在的目录的绝对路径
__filename 　　　　表示当前文件的绝对路径
module.filename ==== __filename 等价
process.cwd() 　　 返回运行当前脚本的工作目录的路径，一般情况下不变，在process.chdir()后，或者shelljs.cd切换目录后会发生变化
process.chdir() 　　改变工作目录
 *
 */

//  恢复
// 加入定时任务
// // try {

// } catch (error) {

// }
// 刷新文件档案缓存
// 增加入职查询
