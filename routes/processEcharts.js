const express = require('express')
const router = express.Router()
const db = require('../database/db')

router.post('/getHotProcess', (req, res, next) => {
  const sql =
    'SELECT WF_ProcessName as name, count(*) as value  FROM [bpm].[dbo].[BPM_ArchivedData] where WF_DocCreated>=dateadd(month,-1,getdate())  group by WF_ProcessName order by value desc'
  db.bpm(sql, (result) => {
    // console.log(result)
    const arr = [
      '#1890FF',
      '#36CBCB',
      '#4ECB73',
      '#FBD437',
      '#F2637B',
      '#975FE5',
    ]
    let index = Math.floor(Math.random() * arr.length)

    let totalCount = 0
    let hotElement = []
    const resTemp = result.recordset
    resTemp.forEach((element, index) => {
      totalCount += element.value
      if (index < 20) {
        hotElement.push(element)
      }
    })
    // const resTemp = result.recordset
    // let hotElement = resTemp.slice(0, 26)
    // let totalCount = resTemp.reduce((prev, current, index, arr) => {
    //   if (prev.constructor !== Number) {
    //     prev = prev.value
    //   }
    //   return prev + current.value
    // })
    return res.json({
      code: 200,
      msg: 'success',
      totalCount: totalCount,
      data: {
        grid: {
          top: '4%',
          left: '2%',
          right: '4%',
          bottom: '0%',
        },
        series: [
          {
            type: 'wordCloud',
            gridSize: 15,
            sizeRange: [12, 35],
            rotationRange: [0, 0],
            width: '100%',
            height: '100%',
            textStyle: {
              normal: {
                color: arr[index],
              },
            },
            data: hotElement,
          },
        ],
      },
    })
  })
})

router.post('/getMISProcessList', (req, res, next) => {
  const sql = `
		SELECT count(*) as value ,WF_ProcessName as name
		FROM [bpm].[dbo].[BPM_ArchivedData]
		where
		(WF_EndUser like '%梁亮818974%'
			or WF_EndUser like '%池兰芳80876%'
			or [bpm].[dbo].[BPM_ArchivedData].WF_ProcessName like '%资讯部工具外借登记%')
		and [bpm].[dbo].[BPM_ArchivedData].WF_ProcessName not like '%补签%'
		and [bpm].[dbo].[BPM_ArchivedData].WF_ProcessName not like '%请假%'
		and [bpm].[dbo].[BPM_ArchivedData].WF_ProcessName not like '%文件%'
		and WF_DocCreated>=dateadd(month,-1,getdate())
		group by WF_ProcessName
		order by value desc
		`
  db.bpm(sql, (result) => {
    let nameList = []
    let valueList = []
    let totalCount = 0
    const resTemp = result.recordset
    resTemp.forEach((element) => {
      nameList.push(element.name)
      valueList.push(element.value)
      totalCount += element.value
    })

    return res.json({
      code: 200,
      msg: 'success',
      totalCount: totalCount,
      data: {
        grid: {
          top: '4%',
          left: '2%',
          right: '4%',
          bottom: '0%',
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: [
          {
            type: 'category',
            data: nameList,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '已完成',
            type: 'bar',
            barWidth: '60%',
            data: valueList,
          },
        ],
      },
    })
  })
})

router.post('/getProcessNumByYY', (req, res, next) => {
  const sql = `
  select COUNT(*) as num ,convert(varchar(7),WF_DocCreated) as yymm, convert(varchar(4),WF_DocCreated) as yy 
  from BPM_ArchivedData 
  where WF_DocCreated>=convert(varchar(4),convert(int,DATENAME(yyyy,GETDATE()))-1)
  group by convert(varchar(7),WF_DocCreated),convert(varchar(4),WF_DocCreated) 
  order by yymm asc
	`
  db.bpm(sql, (result) => {
    let lastYear = []
    let nowYear = []

    const resTemp = result.recordset
    let last = resTemp[0].yy
    let now = resTemp[13].yy
    resTemp.forEach((element, index) => {
      if (index < 12) {
        lastYear.push(element.num)
      } else {
        nowYear.push(element.num)
      }
    })
    return res.json({
      code: 200,
      msg: 'success',
      data: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: [last, now],
        },
        grid: {
          top: '4%',
          left: '2%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [
              '1月',
              '2月',
              '3月',
              '4月',
              '5月',
              '6月',
              '7月',
              '8月',
              '9月',
              '10月',
              '11月',
              '12月',
            ],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: last,
            type: 'line',
            data: lastYear,
            smooth: true,
            areaStyle: {},
          },
          {
            name: now,
            type: 'line',
            data: nowYear,
            smooth: true,
            areaStyle: {},
          },
        ],
      },
    })
  })
})

module.exports = router
