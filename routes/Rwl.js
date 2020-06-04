const express = require('express')
const router = express.Router()
const db = require('../database/db')

router.post('/getCY', (req, res, next) => {
  const sql =
    'SELECT WF_ProcessName as name, count(*) as value  FROM [bpm].[dbo].[BPM_ArchivedData] where WF_DocCreated>=dateadd(month,-2,getdate())  group by WF_ProcessName order by value desc'
  db(sql, (result) => {
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
      if (index < 25) {
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
            sizeRange: [12, 50],
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

router.post('/getGZLList', (req, res, next) => {
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
  db(sql, (result) => {
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
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: nameList,
        },
        series: [
          {
            name: 'MIS流程',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: resTemp,
          },
        ],
      },
    })
  })
})

module.exports = router
