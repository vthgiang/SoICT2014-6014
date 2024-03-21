import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DatePicker, LazyLoadComponent, SelectBox } from '../../../common-components'

import { ViewAllTasks, ViewAllOverTime, TrendWorkChart } from './combinedContent'
import { ViewAllCommendation, ViewAllDiscipline } from '../../dashboard-unit/components/combinedContent'

import { DisciplineActions } from '../../human-resource/commendation-discipline/redux/actions'
import { AnnualLeaveActions } from '../../human-resource/annual-leave/redux/actions'
import { WorkPlanActions } from '../../human-resource/work-plan/redux/actions'
import { TimesheetsActions } from '../../human-resource/timesheets/redux/actions'
import { taskManagementActions } from '../../task/task-management/redux/actions'
import { createKpiSetActions } from '../../kpi/employee/creation/redux/actions'
import { UserActions } from '../../super-admin/user/redux/actions'
import { filterDifference } from '../../../helpers/taskModuleHelpers'
import cloneDeep from 'lodash/cloneDeep'

import c3 from 'c3'
import 'c3/c3.css'

/**
 * Function format dữ liệu Date thành string
 * @param {*} date : Ngày muốn format
 * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
 */
const formatDate = (date, monthYear = false) => {
  if (date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    if (monthYear === true) {
      return [month, year].join('-')
    } else return [day, month, year].join('-')
  }
  return date
}

const getUnitName = (arrUnit, idUnit) => {
  let unitName
  if (arrUnit?.length && idUnit) {
    for (let i = 0; i < arrUnit.length; i++) {
      if (arrUnit[i]._id === idUnit) {
        unitName = arrUnit[i].name
        break
      }
    }
  }
  return unitName
}

function ComponentInfor(props) {
  const { department } = props

  const [state, setState] = useState(() => {
    const currentRole = localStorage.getItem('currentRole')
    let organizationalUnitsOfUser = null
    props.organizationalUnitsOfUser.forEach((x) => {
      if (x.deputyManagers.includes(currentRole) || x.managers.includes(currentRole) || x.employees.includes(currentRole)) {
        organizationalUnitsOfUser = x._id
      }
    })
    return {
      month: formatDate(Date.now(), true),
      monthShow: formatDate(Date.now(), true),
      organizationalUnits: [organizationalUnitsOfUser],
      employeeTaskInCurrentUnit: [],
      loadingScreen: true
    }
  })

  const refTaskChart = React.createRef()
  const refDataCommendationChart = React.createRef()
  const refDataDisciplineChart = React.createRef()
  const refHoursOffChart = React.createRef()
  const refOverTimeChart = React.createRef()

  useEffect(() => {
    const { month, organizationalUnits } = state
    let partMonth = month.split('-')
    let monthNew = [partMonth[1], partMonth[0]].join('-')
    if (department?.list?.length) {
      let orgUnitIds = []
      department.list.forEach((x) => {
        orgUnitIds = [...orgUnitIds, x._id]
      })
      if (orgUnitIds?.length) {
        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        props.getAllEmployeeOfUnitByIds({ organizationalUnitIds: orgUnitIds })
        props.getTaskInOrganizationUnitByMonth(orgUnitIds, monthNew, monthNew)

        /* Lấy dánh sách khen thưởng, kỷ luật */
        props.getListPraise({ organizationalUnits: orgUnitIds, month: monthNew })
        props.getListDiscipline({ organizationalUnits: orgUnitIds, month: monthNew })

        /* Lấy dữ liệu tăng ca của nhân viên trong công ty */
        props.getTimesheets({ organizationalUnits: orgUnitIds, startDate: monthNew, endDate: monthNew, trendOvertime: true })
      }
    }

    /* Lấy dữ liệu kết quả kpi của nhân viên */
    props.getAllEmployeeKpiSetByMonth(undefined, localStorage.getItem('userId'), monthNew, monthNew)

    /* Lấy dữ liệu tăng ca của nhân viên trong công ty */
    props.getTimesheets({
      organizationalUnits: organizationalUnits,
      startDate: monthNew,
      endDate: monthNew,
      trendOvertime: true,
      callApiByDashboardPersional: 'curent_unit'
    })

    /* Lấy số ngày nghỉ phép còn lại của nhân viên */
    props.getNumberAnnaulLeave({ numberAnnulLeave: true, year: partMonth[1] })
    props.getListWorkPlan({ year: partMonth[1] })
  }, [])

  /**
   * Function bắt sự kiện thay đổi đơn vị
   * @param {*} value : Array id đơn vị
   */
  const handleSelectOrganizationalUnit = (value) => {
    setState({
      ...state,
      organizationalUnits: value
    })
  }

  /**
   * Function bắt sự kiện thay đổi tháng
   * @param {*} value : Giá trị tháng
   */
  const handleSelectMonth = (value) => {
    setState({
      ...state,
      month: value
    })
  }

  /** Bắt sự kiện phân tích dữ liệu */
  const handleUpdateData = () => {
    const { month, organizationalUnits } = state
    let partMonth = month.split('-')
    let monthNew = [partMonth[1], partMonth[0]].join('-')

    if (department?.list?.length) {
      let orgUnitIds = []
      department.list.forEach((x) => {
        orgUnitIds = [...orgUnitIds, x._id]
      })
      if (orgUnitIds?.length) {
        /* Lấy dữ liệu công việc của nhân viên trong đơn vị */
        props.getAllEmployeeOfUnitByIds({ organizationalUnitIds: orgUnitIds })
        props.getTaskInOrganizationUnitByMonth(orgUnitIds, monthNew, monthNew)

        /* Lấy dánh sách khen thưởng, kỷ luật */
        props.getListPraise({ organizationalUnits: orgUnitIds, month: monthNew })
        props.getListDiscipline({ organizationalUnits: orgUnitIds, month: monthNew })

        /* Lấy dữ liệu tăng ca của nhân viên trong công ty */
        props.getTimesheets({ organizationalUnits: orgUnitIds, startDate: monthNew, endDate: monthNew, trendOvertime: true })
      }
    }

    /* Lấy dữ liệu kết quả kpi của nhân viên */
    props.getAllEmployeeKpiSetByMonth(undefined, localStorage.getItem('userId'), monthNew, monthNew)

    /* Lấy dữ liệu nghỉ phép tăng ca của nhân viên */
    props.getTimesheets({
      organizationalUnits: organizationalUnits,
      startDate: monthNew,
      endDate: monthNew,
      trendOvertime: true,
      callApiByDashboardPersional: 'curent_unit'
    })

    /* Lấy số ngày nghỉ phép còn lại của nhân viên */
    props.getNumberAnnaulLeave({ numberAnnulLeave: true, year: partMonth[1] })
    props.getListWorkPlan({ year: partMonth[1] })

    setState({
      ...state,
      monthShow: month,
      loadingScreen: true
    })
  }

  // /** Function xem tất cả bảng tổng hợp công việc*/
  // const viewAllTasks = () => {
  //     window.$('#modal-view-all-task').modal('show');
  // }

  // /** Function xem tất cả bảng tổng hợp khen thưởng*/
  // const viewAllCommendation = () => {
  //     window.$('#modal-view-all-commendation').modal('show');
  // }

  // /** Function xem tất cả bảng tổng hợp kỷ luật*/
  // const viewAllDiscipline = () => {
  //     window.$('#modal-view-all-discipline').modal('show');
  // }

  // /** Function xem tất cả tình hình tăng ca */
  // const viewAllOverTime = async () => {
  //     await setState({
  //         viewOverTime: 'overTime',
  //     });
  //     window.$(`#modal-view-${"overTime"}`).modal('show');
  // };

  // /** Function xem tất cả tình hình nghỉ phép */
  // const viewAllHoursOff = async () => {
  //     await this.setState({
  //         viewHoursOff: 'hoursOff',
  //     });
  //     window.$(`#modal-view-${"hoursOff"}`).modal('show');
  // }

  const { monthShow, month, organizationalUnits, viewOverTime, viewHoursOff } = state
  const { discipline, translate, timesheets, tasks, user, workPlan, annualLeave, createEmployeeKpiSet } = props
  const { organizationalUnitsOfUser } = props

  useEffect(() => {
    const { organizationalUnits } = state
    let taskInCurrentUnit = [],
      taskInCompany = [],
      totalListCommendationInUnit = [],
      totalListCommendationInCompany = []

    /* Lấy dữ liệu công việc của mỗi nhân viên trong đơn vị */
    let taskListByStatus = tasks.organizationUnitTasks ? tasks.organizationUnitTasks.tasks : null
    if (taskListByStatus && organizationalUnits) {
      let orgUnit = organizationalUnits[0]
      taskListByStatus.forEach((x) => {
        if (x?.organizationalUnit?._id === orgUnit) taskInCurrentUnit = [...taskInCurrentUnit, x]
      })
    }

    let listEmployee = user.employees
    let maxTask = 1
    let employeeTaskInCurrentUnit = [],
      employeeTasksInCompany = [],
      employeeOvertime = [],
      employeeHoursOff = []

    let currentEmployee
    if (listEmployee?.length) {
      const listEmployeeLength = listEmployee.length
      for (let k = 0; k < listEmployeeLength; k++) {
        if (listEmployee[k]?.userId?._id === localStorage.getItem('userId')) {
          currentEmployee = listEmployee[k]
          break
        }
      }
    }

    for (let i in listEmployee) {
      let accountableTaskInCurrentUnit = [],
        consultedTaskInCurrentUnit = [],
        responsibleTaskInCurrentUnit = [],
        informedTaskInCurrentUnit = []
      let accountableTaskInCompany = [],
        consultedTaskInCompany = [],
        responsibleTaskInCompany = [],
        informedTaskInCompany = []

      // xử lý danh sách công việc đơn vị hiện tại của người dùng
      taskInCurrentUnit &&
        taskInCurrentUnit.forEach((x) => {
          if (x?.accountableEmployees) {
            x.accountableEmployees.forEach((k) => {
              if (typeof k === 'object') {
                if (k?._id === listEmployee?.[i]?.userId?._id) accountableTaskInCurrentUnit = [...accountableTaskInCurrentUnit, x]
              }
              if (typeof k === 'string') {
                if (k === listEmployee?.[i]?.userId?._id) accountableTaskInCurrentUnit = [...accountableTaskInCurrentUnit, x]
              }
            })
          }

          if (x?.responsibleEmployees) {
            x.responsibleEmployees.forEach((k) => {
              if (typeof k === 'object') {
                if (k?._id === listEmployee?.[i]?.userId?._id) responsibleTaskInCurrentUnit = [...responsibleTaskInCurrentUnit, x]
              }
              if (typeof k === 'string') {
                if (k === listEmployee?.[i]?.userId?._id) responsibleTaskInCurrentUnit = [...responsibleTaskInCurrentUnit, x]
              }
            })
          }

          if (x?.consultedEmployees) {
            x.consultedEmployees.forEach((k) => {
              if (typeof k === 'object') {
                if (k?._id === listEmployee?.[i]?.userId?._id) consultedTaskInCurrentUnit = [...consultedTaskInCurrentUnit, x]
              }
              if (typeof k === 'string') {
                if (k === listEmployee?.[i]?.userId?._id) consultedTaskInCurrentUnit = [...consultedTaskInCurrentUnit, x]
              }
            })
          }

          if (x?.informedEmployees) {
            x.informedEmployees.forEach((k) => {
              if (typeof k === 'object') {
                if (k?._id === listEmployee?.[i]?.userId?._id) informedTaskInCurrentUnit = [...informedTaskInCurrentUnit, x]
              }
              if (typeof k === 'string') {
                if (k === listEmployee?.[i]?.userId?._id) informedTaskInCurrentUnit = [...informedTaskInCurrentUnit, x]
              }
            })
          }
        })

      // Xử lý danh sách công việc toàn công ty
      taskListByStatus &&
        taskListByStatus.forEach((x) => {
          if (x?.accountableEmployees) {
            x.accountableEmployees.forEach((k) => {
              if (typeof k === 'object') {
                if (k?._id === listEmployee?.[i]?.userId?._id) accountableTaskInCompany = [...accountableTaskInCompany, x]
              }
              if (typeof k === 'string') {
                if (k === listEmployee?.[i]?.userId?._id) accountableTaskInCompany = [...accountableTaskInCompany, x]
              }
            })
          }

          if (x?.responsibleEmployees) {
            x.responsibleEmployees.forEach((k) => {
              if (typeof k === 'object') {
                if (k?._id === listEmployee?.[i]?.userId?._id) responsibleTaskInCompany = [...responsibleTaskInCompany, x]
              }
              if (typeof k === 'string') {
                if (k === listEmployee?.[i]?.userId?._id) responsibleTaskInCompany = [...responsibleTaskInCompany, x]
              }
            })
          }

          if (x?.consultedEmployees) {
            x.consultedEmployees.forEach((k) => {
              if (typeof k === 'object') {
                if (k?._id === listEmployee?.[i]?.userId?._id) consultedTaskInCompany = [...consultedTaskInCompany, x]
              }
              if (typeof k === 'string') {
                if (k === listEmployee?.[i]?.userId?._id) consultedTaskInCompany = [...consultedTaskInCompany, x]
              }
            })
          }

          if (x?.informedEmployees) {
            x.informedEmployees.forEach((k) => {
              if (typeof k === 'object') {
                if (k?._id === listEmployee?.[i]?.userId?._id) informedTaskInCompany = [...informedTaskInCompany, x]
              }
              if (typeof k === 'string') {
                if (k === listEmployee?.[i]?.userId?._id) informedTaskInCompany = [...informedTaskInCompany, x]
              }
            })
          }
        })

      taskInCurrentUnit = taskInCurrentUnit
        .concat(accountableTaskInCurrentUnit)
        .concat(consultedTaskInCurrentUnit)
        .concat(responsibleTaskInCurrentUnit)
        .concat(informedTaskInCurrentUnit)
      taskInCompany = taskInCompany
        .concat(accountableTaskInCompany)
        .concat(consultedTaskInCompany)
        .concat(responsibleTaskInCompany)
        .concat(informedTaskInCompany)

      // lọc cv trùng lặp
      taskInCurrentUnit = filterDifference(taskInCurrentUnit)
      taskInCompany = filterDifference(taskInCompany)

      let totalTask = taskInCurrentUnit.filter(function (item, pos) {
        return taskInCurrentUnit.indexOf(item) === pos
      })

      let totalTaskInCompany = taskInCompany.filter(function (item, pos) {
        return taskInCompany.indexOf(item) === pos
      })

      if (totalTask.length > maxTask) {
        maxTask = totalTask.length
      }

      employeeTaskInCurrentUnit = [
        ...employeeTaskInCurrentUnit,
        {
          _id: listEmployee[i]?.userId?._id,
          name: listEmployee[i]?.userId?.name,
          accountableTask: accountableTaskInCurrentUnit?.length,
          consultedTask: consultedTaskInCurrentUnit?.length,
          responsibleTask: responsibleTaskInCurrentUnit?.length,
          informedTask: informedTaskInCurrentUnit?.length,
          totalTask: totalTask?.length
        }
      ]

      employeeTasksInCompany = [
        ...employeeTasksInCompany,
        {
          _id: listEmployee[i]?.userId?._id,
          totalTask: totalTaskInCompany?.length
        }
      ]
    }

    /* Lấy tổng số công việc làm trong tháng của nhân viên */
    let totalTask = 0,
      accountableTask = 0,
      consultedTask = 0,
      responsibleTask = 0,
      informedTask = 0
    let taskPersonal = employeeTaskInCurrentUnit.find((x) => x._id === localStorage.getItem('userId'))
    if (taskPersonal) {
      totalTask = taskPersonal?.totalTask
      accountableTask = taskPersonal?.accountableTask
      consultedTask = taskPersonal?.consultedTask
      responsibleTask = taskPersonal?.responsibleTask
      informedTask = taskPersonal?.informedTask
    }

    // Lấy user có số công việc nhiều nhất và ít nhất
    let categoryChart = ['Công ty', 'đơn vị hiện tại']

    let taskMax = ['Giá trị lớn nhất']
    let taskMin = ['Giá trị bé nhất']
    let taskCurrent = ['Cá nhân hiện tại']
    let dataTaskChart = []

    let commendationMax = ['Giá trị lớn nhất']
    let commendationMin = ['Giá trị bé nhất']
    let commendationCurrent = ['Cá nhân hiện tại']
    let dataCommendationChart = []

    let disciplineMax = ['Giá trị lớn nhất']
    let disciplineMin = ['Giá trị bé nhất']
    let disciplineCurrent = ['Cá nhân hiện tại']
    let dataDisciplineChart = []

    let hoursOffMax = ['Giá trị lớn nhất']
    let hoursOffMin = ['Giá trị bé nhất']
    let hoursOffCurrent = ['Cá nhân hiện tại']
    let dataHoursOffChart = []

    let overTimeMax = ['Giá trị lớn nhất']
    let overTimeMin = ['Giá trị bé nhất']
    let overTimeCurrent = ['Cá nhân hiện tại']
    let dataOverTimeChart = []

    if (employeeTasksInCompany.length) {
      employeeTasksInCompany = employeeTasksInCompany.sort((a, b) => b.totalTask - a.totalTask)

      const taskPersonalInCompany = employeeTaskInCurrentUnit.find((x) => x._id === localStorage.getItem('userId'))

      taskMax = [...taskMax, employeeTasksInCompany[0]?.totalTask ? employeeTasksInCompany[0].totalTask : 0]
      taskMin = [
        ...taskMin,
        employeeTasksInCompany[employeeTasksInCompany.length - 1]?.totalTask
          ? employeeTasksInCompany[employeeTasksInCompany.length - 1].totalTask
          : 0
      ]
      if (taskPersonalInCompany) {
        taskCurrent = [...taskCurrent, taskPersonalInCompany.totalTask]
      } else {
        taskCurrent = [...taskCurrent, 0]
      }
    } else {
      taskMax = [...taskMax, 0]
      taskMin = [...taskMin, 0]
      taskCurrent = [...taskCurrent, 0]
    }

    if (employeeTaskInCurrentUnit.length !== 0) {
      employeeTaskInCurrentUnit = employeeTaskInCurrentUnit.sort((a, b) => b.totalTask - a.totalTask)

      taskMax = [...taskMax, employeeTaskInCurrentUnit[0]?.totalTask ? employeeTaskInCurrentUnit[0]?.totalTask : 0]
      taskMin = [
        ...taskMin,
        employeeTaskInCurrentUnit[employeeTaskInCurrentUnit.length - 1]?.totalTask
          ? employeeTaskInCurrentUnit[employeeTaskInCurrentUnit.length - 1].totalTask
          : 0
      ]
      if (taskPersonal) {
        taskCurrent = [...taskCurrent, taskPersonal.totalTask]
      } else {
        taskCurrent = [...taskCurrent, totalTask]
      }
    } else {
      taskMax = [...taskMax, 0]
      taskMin = [...taskMin, 0]
      taskCurrent = [...taskCurrent, totalTask]
    }

    dataTaskChart = [taskMax, taskMin, taskCurrent]

    // Xử lý biểu đồ khen thưởng kỷ luật
    if (props?.discipline?.totalListCommendation?.length) {
      let totalListCommendationInCompany = [...props?.discipline?.totalListCommendation] // Daanh sách khen thưởng của toàn công ty trong tháng ...
      let totalListCommendationInCurrentUnit = [] // danh sách khen thưởng ở đơn vị hiện tại trong tháng ...
      let orgUnit = organizationalUnits[0]

      totalListCommendationInCompany.forEach((x) => {
        if (x.organizationalUnit === orgUnit) totalListCommendationInCurrentUnit = [...totalListCommendationInCurrentUnit, x]
      })

      if (totalListCommendationInCompany) {
        // xử lý danh sách khen thưởng toàn công ty thành dữ liệu chart
        let listCommendationInCompany = []

        totalListCommendationInCompany.forEach((x) => {
          if (!listCommendationInCompany[x?.employee?._id]) listCommendationInCompany[x?.employee?._id] = 1
          else listCommendationInCompany[x?.employee?._id] = listCommendationInCompany[x?.employee?._id] + 1
        })

        let listCommendationInCompanyCount = []

        for (let key in listCommendationInCompany) {
          listCommendationInCompanyCount = [...listCommendationInCompanyCount, listCommendationInCompany[key]]
        }

        listCommendationInCompanyCount = listCommendationInCompanyCount.sort((a, b) => b - a)

        commendationMax = [...commendationMax, listCommendationInCompanyCount[0]]
        commendationMin = [...commendationMin, listCommendationInCompanyCount[listCommendationInCompanyCount.length - 1]]

        const currentCommendation = totalListCommendationInCompany.filter(
          (x) => x?.employee?.emailInCompany === currentEmployee?.userId?.email
        )

        if (currentCommendation) commendationCurrent = [...commendationCurrent, currentCommendation?.length]
        else commendationCurrent = [...commendationCurrent, 0]
      } else {
        commendationMax = [...commendationMax, 0]
        commendationMin = [...commendationMin, 0]
        commendationCurrent = [...commendationCurrent, 0]
      }

      if (totalListCommendationInCurrentUnit?.length) {
        // xử lý danh sách khen thưởng trong công ty hiện tai
        let listDisciplineInUnits = []

        totalListCommendationInCurrentUnit.forEach((x) => {
          if (!listDisciplineInUnits[x?.employee?._id]) listDisciplineInUnits[x?.employee?._id] = 1
          else listDisciplineInUnits[x?.employee?._id] = listDisciplineInUnits[x?.employee?._id] + 1
        })

        let listDisciplineInUnitCount = []

        for (let key in listDisciplineInUnits) {
          listDisciplineInUnitCount = [...listDisciplineInUnitCount, listDisciplineInUnits[key]]
        }

        listDisciplineInUnitCount = listDisciplineInUnitCount.sort((a, b) => b - a)

        commendationMax = [...commendationMax, listDisciplineInUnitCount[0]]
        commendationMin = [...commendationMin, listDisciplineInUnitCount[listDisciplineInUnitCount.length - 1]]

        const currentCommendation = totalListCommendationInCurrentUnit.filter(
          (x) => x?.employee?.emailInCompany === currentEmployee?.userId?.email
        )

        if (currentCommendation) commendationCurrent = [...commendationCurrent, currentCommendation?.length]
        else commendationCurrent = [...commendationCurrent, 0]
      } else {
        commendationMax = [...commendationMax, 0]
        commendationMin = [...commendationMin, 0]
        commendationCurrent = [...commendationCurrent, 0]
      }
    } else {
      commendationMax = [...commendationMax, 0, 0]
      commendationMin = [...commendationMin, 0, 0]
      commendationCurrent = [...commendationCurrent, 0, 0]
    }

    // Dữ liệu bieeyr đồ khen thưởng
    dataCommendationChart = [commendationMax, commendationMin, commendationCurrent]

    if (props?.discipline?.totalListDiscipline?.length) {
      let totalListDisciplineInCompany = [...props?.discipline?.totalListDiscipline] // Daanh sách kỷ luật của toàn công ty trng tháng ...
      let totalListDisciplineInCurrentUnit = [] // danh sách kỷ luật ở đơn vị hiện tại trong tháng ...
      let orgUnit = organizationalUnits[0]

      totalListDisciplineInCompany.forEach((x) => {
        if (x.organizationalUnit === orgUnit) totalListDisciplineInCurrentUnit = [...totalListDisciplineInCurrentUnit, x]
      })

      if (totalListDisciplineInCompany) {
        // xử lý danh sách kỷ luật toàn công ty
        let listDisciplineInCompany = []

        totalListDisciplineInCompany.forEach((x) => {
          if (!listDisciplineInCompany[x?.employee?._id]) listDisciplineInCompany[x?.employee?._id] = 1
          else listDisciplineInCompany[x?.employee?._id] = listDisciplineInCompany[x?.employee?._id] + 1
        })

        let listDisciplineInCompanyCount = []

        for (let key in listDisciplineInCompany) {
          listDisciplineInCompanyCount = [...listDisciplineInCompanyCount, listDisciplineInCompany[key]]
        }

        listDisciplineInCompanyCount = listDisciplineInCompanyCount.sort((a, b) => b - a)

        disciplineMax = [...disciplineMax, listDisciplineInCompanyCount[0]]
        disciplineMin = [...disciplineMin, listDisciplineInCompanyCount[listDisciplineInCompanyCount.length - 1]]

        const currentCommendation = totalListDisciplineInCompany.filter(
          (x) => x?.employee?.emailInCompany === currentEmployee?.userId?.email
        )

        if (currentCommendation) disciplineCurrent = [...disciplineCurrent, currentCommendation?.length]
      } else {
        disciplineMax = [...disciplineMax, 0]
        disciplineMin = [...disciplineMin, 0]
        disciplineCurrent = [...disciplineCurrent, 0]
      }

      if (totalListDisciplineInCurrentUnit?.length) {
        // xử lý danh sách khen thưởng trong công ty hiện tai
        let listCommendationInUnits = []

        totalListDisciplineInCurrentUnit.forEach((x) => {
          if (!listCommendationInUnits[x?.employee?._id]) listCommendationInUnits[x?.employee?._id] = 1
          else listCommendationInUnits[x?.employee?._id] = listCommendationInUnits[x?.employee?._id] + 1
        })

        let listCommendationInUnitCount = []

        for (let key in listCommendationInUnits) {
          listCommendationInUnitCount = [...listCommendationInUnitCount, listCommendationInUnits[key]]
        }

        listCommendationInUnitCount = listCommendationInUnitCount.sort((a, b) => b - a)

        disciplineMax = [...disciplineMax, listCommendationInUnitCount[0]]
        disciplineMin = [...disciplineMin, listCommendationInUnitCount[listCommendationInUnitCount.length - 1]]

        const currentCommendation = totalListDisciplineInCurrentUnit.filter(
          (x) => x?.employee?.emailInCompany === currentEmployee?.userId?.email
        )

        if (currentCommendation) disciplineCurrent = [...disciplineCurrent, currentCommendation?.length]
      } else {
        disciplineMax = [...disciplineMax, 0]
        disciplineMin = [...disciplineMin, 0]
        disciplineCurrent = [...disciplineCurrent, 0]
      }
    } else {
      disciplineMax = [...disciplineMax, 0, 0]
      disciplineMin = [...disciplineMin, 0, 0]
      disciplineCurrent = [...disciplineCurrent, 0, 0]
    }

    dataDisciplineChart = [disciplineMax, disciplineMin, disciplineCurrent]

    // Xử lý biểu đồ nghỉ phép tăng ca

    if (timesheets?.listOvertimeOfUnitsByStartDateAndEndDate?.length) {
      let listOvertimeInCompany = cloneDeep(timesheets?.listOvertimeOfUnitsByStartDateAndEndDate)

      if (listOvertimeInCompany?.length) {
        let listOverTimeAndHoursOffInCompany = []
        listOvertimeInCompany = listOvertimeInCompany.map((x) => ({
          employeeId: x?.employee?._id,
          emailInCompany: x?.employee?.emailInCompany,
          totalHoursOff: x?.totalHoursOff,
          totalOvertime: x?.totalOvertime
        }))

        listOvertimeInCompany.reduce(function (res, value) {
          if (!res[value?.employeeId]) {
            res[value?.employeeId] = { ...value, employeeId: value?.employeeId, totalHoursOff: 0, totalOvertime: 0 }
            listOverTimeAndHoursOffInCompany.push(res[value.employeeId])
          }
          res[value?.employeeId].totalHoursOff += value.totalHoursOff
          res[value?.employeeId].totalOvertime += value.totalOvertime
          return res
        }, {})

        const current = listOvertimeInCompany.find((x) => x.emailInCompany === currentEmployee?.userId?.email)

        //Giá trị hiện tại trong công ty
        if (current) {
          hoursOffCurrent = [...hoursOffCurrent, current.totalHoursOff]
          overTimeCurrent = [...overTimeCurrent, current.totalOvertime]
        } else {
          hoursOffCurrent = [...hoursOffCurrent, 0]
          overTimeCurrent = [...overTimeCurrent, 0]
        }

        let listOverTimeSort = cloneDeep(listOverTimeAndHoursOffInCompany).sort((a, b) => b.totalOvertime - a.totalOvertime)
        let listHoursOffSort = cloneDeep(listOverTimeAndHoursOffInCompany).sort((a, b) => b.totalHoursOff - a.totalHoursOff)

        if (listHoursOffSort?.length) {
          hoursOffMax = [...hoursOffMax, listHoursOffSort[0].totalHoursOff]
          hoursOffMin = [...hoursOffMin, listHoursOffSort[listHoursOffSort.length - 1].totalHoursOff]
        } else {
          hoursOffMax = [...hoursOffMax, 0]
          hoursOffMin = [...hoursOffMin, 0]
        }

        if (listOverTimeSort?.length) {
          overTimeMax = [...overTimeMax, listOverTimeSort[0].totalOvertime]
          overTimeMin = [...overTimeMin, listOverTimeSort[listOverTimeSort.length - 1].totalOvertime]
        } else {
          overTimeMax = [...overTimeMax, 0]
          overTimeMin = [...overTimeMin, 0]
        }
      }
    } else {
      hoursOffMax = [...hoursOffMax, 0]
      hoursOffMin = [...hoursOffMin, 0]
      hoursOffCurrent = [...hoursOffCurrent, 0]

      overTimeMax = [...overTimeMax, 0]
      overTimeMin = [...overTimeMin, 0]
      overTimeCurrent = [...overTimeCurrent, 0]
    }

    if (timesheets?.listOvertimeOfCurrentUnitByStartDateAndEndDate?.length) {
      let listOvertimeInCurrentUnits = cloneDeep(timesheets?.listOvertimeOfCurrentUnitByStartDateAndEndDate)

      if (listOvertimeInCurrentUnits?.length) {
        let listOverTimeAndHoursOffInCurrentUnit = []
        listOvertimeInCurrentUnits = listOvertimeInCurrentUnits.map((x) => ({
          employeeId: x?.employee?._id,
          emailInCompany: x?.employee?.emailInCompany,
          totalHoursOff: x?.totalHoursOff,
          totalOvertime: x?.totalOvertime
        }))

        listOvertimeInCurrentUnits.reduce(function (res, value) {
          if (!res[value?.employeeId]) {
            res[value?.employeeId] = { ...value, employeeId: value?.employeeId, totalHoursOff: 0, totalOvertime: 0 }
            listOverTimeAndHoursOffInCurrentUnit.push(res[value.employeeId])
          }
          res[value?.employeeId].totalHoursOff += value.totalHoursOff
          res[value?.employeeId].totalOvertime += value.totalOvertime
          return res
        }, {})

        const current = listOvertimeInCurrentUnits.find((x) => x.emailInCompany === currentEmployee?.userId?.email)

        //Giá trị hiện tại trong công ty
        if (current) {
          hoursOffCurrent = [...hoursOffCurrent, current.totalHoursOff]
          overTimeCurrent = [...overTimeCurrent, current.totalOvertime]
        } else {
          hoursOffCurrent = [...hoursOffCurrent, 0]
          overTimeCurrent = [...overTimeCurrent, 0]
        }

        let listOverTimeSort = cloneDeep(listOverTimeAndHoursOffInCurrentUnit).sort((a, b) => b.totalOvertime - a.totalOvertime)
        let listHoursOffSort = cloneDeep(listOverTimeAndHoursOffInCurrentUnit).sort((a, b) => b.totalHoursOff - a.totalHoursOff)

        if (listHoursOffSort?.length) {
          hoursOffMax = [...hoursOffMax, listHoursOffSort[0].totalHoursOff]
          hoursOffMin = [...hoursOffMin, listHoursOffSort[listHoursOffSort.length - 1].totalHoursOff]
        } else {
          hoursOffMax = [...hoursOffMax, 0]
          hoursOffMin = [...hoursOffMin, 0]
        }

        if (listOverTimeSort?.length) {
          overTimeMax = [...overTimeMax, listOverTimeSort[0].totalOvertime]
          overTimeMin = [...overTimeMin, listOverTimeSort[listOverTimeSort.length - 1].totalOvertime]
        } else {
          overTimeMax = [...overTimeMax, 0]
          overTimeMin = [...overTimeMin, 0]
        }
      }
    } else {
      hoursOffMax = [...hoursOffMax, 0]
      hoursOffMin = [...hoursOffMin, 0]
      hoursOffCurrent = [...hoursOffCurrent, 0]

      overTimeMax = [...overTimeMax, 0]
      overTimeMin = [...overTimeMin, 0]
      overTimeCurrent = [...overTimeCurrent, 0]
    }

    dataHoursOffChart = [hoursOffMax, hoursOffMin, hoursOffCurrent]

    dataOverTimeChart = [overTimeMax, overTimeMin, overTimeCurrent]

    setState({
      ...state,
      totalTask,
      accountableTask,
      consultedTask,
      responsibleTask,
      informedTask,
      employeeTaskInCurrentUnit,
      categoryChart,
      dataDisciplineChart,
      dataTaskChart,
      dataCommendationChart,
      dataHoursOffChart,
      dataOverTimeChart,
      loadingScreen: false
    })
  }, [
    JSON.stringify(props?.user?.employees),
    JSON.stringify(props?.tasks?.organizationUnitTasks?.tasks),
    JSON.stringify(props?.discipline?.totalListCommendation),
    JSON.stringify(props?.discipline.totalListDiscipline),
    JSON.stringify(props.timesheets?.listOvertimeOfUnitsByStartDateAndEndDate)
  ])

  const removePreviosChart = () => {
    const chart = refTaskChart.current

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  const removePreviosDataCommendationChart = () => {
    const chart = refDataCommendationChart.current

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  const removePreviosDataDisciplineChart = () => {
    const chart = refDataDisciplineChart.current

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  const removePreviosHoursOffChart = () => {
    const chart = refHoursOffChart.current

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  const removePreviosOverTimeChart = () => {
    const chart = refOverTimeChart.current

    if (chart) {
      while (chart.hasChildNodes()) {
        chart.removeChild(chart.lastChild)
      }
    }
  }

  const renderTaskChart = () => {
    const { dataTaskChart, categoryChart } = state
    removePreviosChart()
    c3.generate({
      bindto: refTaskChart.current,

      padding: {
        top: 20,
        bottom: 20,
        right: 20
      },

      data: {
        columns: dataTaskChart,
        types: {
          'Cá nhân hiện tại': 'bar',
          'Giá trị lớn nhất': 'bar',
          'Giá trị bé nhất': 'bar'
        },
        labels: true
      },
      bar: {
        width: {
          ratio: 0.3
        }
      },

      axis: {
        x: {
          type: 'categories',
          categories: categoryChart
        }
      }

      // tooltip: {
      //     format: !singleUnit && !advancedMode && {
      //         title: function (d, index) { return fullnameUnit[index]; }
      //     }
      // },
    })
  }

  const renderCommendationChart = () => {
    const { dataCommendationChart, categoryChart } = state
    removePreviosDataCommendationChart()
    c3.generate({
      bindto: refDataCommendationChart.current,

      padding: {
        top: 20,
        bottom: 20,
        right: 20
      },

      data: {
        columns: dataCommendationChart,
        type: 'bar',
        labels: true
      },
      bar: {
        width: {
          ratio: 0.3
        }
      },

      axis: {
        x: {
          type: 'categories',
          categories: categoryChart
        }
      }

      // tooltip: {
      //     format: !singleUnit && !advancedMode && {
      //         title: function (d, index) { return fullnameUnit[index]; }
      //     }
      // },
    })
  }

  const renderDisciplineChart = () => {
    const { dataDisciplineChart, categoryChart } = state
    console.log('dataDisciplineChart', dataDisciplineChart, categoryChart)
    removePreviosDataDisciplineChart()
    c3.generate({
      bindto: refDataDisciplineChart.current,

      padding: {
        top: 20,
        bottom: 20,
        right: 20
      },

      data: {
        columns: dataDisciplineChart,
        type: 'bar',
        labels: true
      },
      bar: {
        width: {
          ratio: 0.3
        }
      },

      axis: {
        x: {
          type: 'categories',
          categories: categoryChart
        }
      }

      // tooltip: {
      //     format: !singleUnit && !advancedMode && {
      //         title: function (d, index) { return fullnameUnit[index]; }
      //     }
      // },
    })
  }

  const renderHoursOffChart = () => {
    const { categoryChart, dataHoursOffChart } = state
    removePreviosHoursOffChart()

    c3.generate({
      bindto: refHoursOffChart.current,

      padding: {
        top: 20,
        bottom: 20,
        right: 20
      },

      data: {
        columns: dataHoursOffChart,
        type: 'bar',
        labels: true
      },
      bar: {
        width: {
          ratio: 0.3
        }
      },

      axis: {
        x: {
          type: 'categories',
          categories: categoryChart
        }
      }

      // tooltip: {
      //     format: !singleUnit && !advancedMode && {
      //         title: function (d, index) { return fullnameUnit[index]; }
      //     }
      // },
    })
  }

  const renderOverTimeChart = () => {
    const { categoryChart, dataOverTimeChart } = state
    removePreviosOverTimeChart()

    c3.generate({
      bindto: refOverTimeChart.current,

      padding: {
        top: 20,
        bottom: 20,
        right: 20
      },

      data: {
        columns: dataOverTimeChart,
        type: 'bar',
        labels: true
      },
      bar: {
        width: {
          ratio: 0.3
        }
      },

      axis: {
        x: {
          type: 'categories',
          categories: categoryChart
        }
      }

      // tooltip: {
      //     format: !singleUnit && !advancedMode && {
      //         title: function (d, index) { return fullnameUnit[index]; }
      //     }
      // },
    })
  }

  useEffect(() => {
    if (state?.categoryChart && state.dataTaskChart) {
      renderTaskChart()
    }
  }, [JSON.stringify(state?.categoryChart), JSON.stringify(state.dataTaskChart)])

  useEffect(() => {
    if (state?.categoryChart && state.dataCommendationChart) {
      renderCommendationChart()
    }
  }, [JSON.stringify(state?.categoryChart), JSON.stringify(state.dataCommendationChart)])

  useEffect(() => {
    if (state?.categoryChart && state.dataDisciplineChart) {
      renderDisciplineChart()
    }
  }, [JSON.stringify(state?.categoryChart), JSON.stringify(state.dataDisciplineChart)])

  useEffect(() => {
    if (state?.categoryChart && state.dataHoursOffChart) {
      renderHoursOffChart()
    }
  }, [JSON.stringify(state?.categoryChart), JSON.stringify(state.dataHoursOffChart)])

  useEffect(() => {
    if (state?.categoryChart && state.dataOverTimeChart) {
      renderOverTimeChart()
    }
  }, [JSON.stringify(state?.categoryChart), JSON.stringify(state.dataOverTimeChart)])

  const { accountableTask, totalTask, consultedTask, responsibleTask, informedTask, employeeTaskInCurrentUnit } = state
  let partMonth = monthShow.split('-')
  let year = partMonth[1]
  const employeeKpiSetByMonth = createEmployeeKpiSet.employeeKpiSetByMonth

  /* Lấy số ngày nghỉ phép còn lại của nhân viên */
  let numberAnnualLeave = 0
  let maximumNumberOfLeaveDays = 0
  if (
    workPlan.maximumNumberOfLeaveDays &&
    annualLeave.numberAnnulLeave &&
    workPlan.maximumNumberOfLeaveDays - annualLeave.numberAnnulLeave > 0
  ) {
    maximumNumberOfLeaveDays = workPlan.maximumNumberOfLeaveDays
    numberAnnualLeave = workPlan.maximumNumberOfLeaveDays - annualLeave.numberAnnulLeave
  } else if (annualLeave.numberAnnulLeave === 0 && workPlan.maximumNumberOfLeaveDays) {
    numberAnnualLeave = workPlan.maximumNumberOfLeaveDays
    maximumNumberOfLeaveDays = workPlan.maximumNumberOfLeaveDays
  }

  /* Lấy dữ liệu công việc của mỗi nhân viên trong đơn vị */
  let listEmployee = user.employees
  let employeeOvertime = [],
    employeeHoursOff = []

  /* Lấy dữ liệu tăng ca và nghỉ phép của mỗi nhân viên trong đơn vị */
  let listOvertimeOfUnitsByStartDateAndEndDate = timesheets.listOvertimeOfUnitsByStartDateAndEndDate
  for (let i in listEmployee) {
    let totalOvertime = 0,
      totalHoursOff = 0
    listOvertimeOfUnitsByStartDateAndEndDate &&
      listOvertimeOfUnitsByStartDateAndEndDate.forEach((x) => {
        if (listEmployee[i]?.userId?.email === x.employee?.emailInCompany) {
          totalOvertime = x.totalOvertime ? x.totalOvertime : 0
          totalHoursOff = x.totalHoursOff ? x.totalHoursOff : 0
        }
      })
    employeeOvertime = [
      ...employeeOvertime,
      { _id: listEmployee[i]?.userId?._id, name: listEmployee[i]?.userId?.name, totalHours: totalOvertime }
    ]
    employeeHoursOff = [
      ...employeeHoursOff,
      { _id: listEmployee[i]?.userId?._id, name: listEmployee[i]?.userId?.name, totalHours: totalHoursOff }
    ]
  }

  /* Sắp xếp theo thứ tự giảm dần */
  if (employeeOvertime.length !== 0) {
    employeeOvertime = employeeOvertime.sort((a, b) => b.totalHours - a.totalHours)
  }
  if (employeeHoursOff.length !== 0) {
    employeeHoursOff = employeeHoursOff.sort((a, b) => b.totalHours - a.totalHours)
  }
  let maxHoursOff = 1,
    maxOverTime = 1
  employeeHoursOff.forEach((x) => {
    if (x.totalHours > maxHoursOff) {
      maxHoursOff = x.totalHours
    }
  })

  employeeOvertime.forEach((x) => {
    if (x.totalHours > maxHoursOff) {
      maxOverTime = x.totalHours
    }
  })

  /* Lấy tổng thời gian nghỉ phép của nhân viên */
  let totalOvertime = 0,
    totalHoursOff = 0
  let overtimePersonal = employeeOvertime.find((x) => x._id === localStorage.getItem('userId'))
  let hoursOffPersonal = employeeHoursOff.find((x) => x._id === localStorage.getItem('userId'))
  if (overtimePersonal) {
    totalOvertime = overtimePersonal.totalHours
  }
  if (hoursOffPersonal) {
    totalHoursOff = hoursOffPersonal.totalHours
  }

  return (
    <React.Fragment>
      {organizationalUnitsOfUser.length !== 0 ? (
        <div className='qlcv'>
          <div className='form-inline' style={{ marginBottom: 10 }}>
            <div className='form-group'>
              <label style={{ width: 'auto' }}>{translate('kpi.organizational_unit.dashboard.organizational_unit')}</label>
              <SelectBox
                id={`organizationalUnitSelectBox`}
                className='form-control select2'
                style={{ width: '100%' }}
                items={organizationalUnitsOfUser.map((item) => {
                  return { value: item._id, text: item.name }
                })}
                multiple={false}
                onChange={handleSelectOrganizationalUnit}
                value={organizationalUnits[0]}
              />
            </div>
            <div className='form-group'>
              <label style={{ width: 'auto' }}>{translate('kpi.organizational_unit.dashboard.month')}</label>
              <DatePicker
                id='monthInOrganizationalUnitKpiDashboard'
                dateFormat='month-year'
                value={month}
                onChange={handleSelectMonth}
                deleteValue={false}
              />
            </div>

            <button type='button' className='btn btn-success' onClick={handleUpdateData}>
              {translate('kpi.evaluation.dashboard.analyze')}
            </button>
          </div>
          <div className='row'>
            {/* Nhắc việc */}
            <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
              <div className='box box-solid'>
                <div className='box-header with-border'>
                  <h3 className='box-title'>
                    Thông tin cá nhân trong {getUnitName(organizationalUnitsOfUser, organizationalUnits[0])} {monthShow}
                  </h3>
                </div>
                <div className='box-body' style={{ paddingBottom: 53 }}>
                  <ul className='todo-list'>
                    <li>
                      <span className='handle'>
                        <i className='fa fa-ellipsis-v'></i>
                        <i className='fa fa-ellipsis-v'></i>
                      </span>
                      <span className='text'>
                        <a href='/task-management-dashboard' target='_blank'>
                          {translate('human_resource.dashboard_personal.task_total')}
                        </a>
                      </span>
                      <small className='label label-warning'>
                        {totalTask} {translate('human_resource.dashboard_personal.task')}
                      </small>
                    </li>

                    <li>
                      <span className='handle'>
                        <i className='fa fa-ellipsis-v'></i>
                        <i className='fa fa-ellipsis-v'></i>
                      </span>
                      <span className='text'>
                        <a href='/task-management-dashboard' target='_blank'>
                          Tổng số công việc theo từng vai trò
                        </a>
                      </span>
                      <small className='label label-danger'>
                        {accountableTask} {translate('human_resource.dashboard_personal.accountable')}
                      </small>
                      <small className='label label-success'>
                        {responsibleTask} {translate('human_resource.dashboard_personal.responsible')}
                      </small>
                      <small className='label label-warning'>
                        {consultedTask} {translate('human_resource.dashboard_personal.consulted')}
                      </small>
                      <small className='label label-info'>
                        {informedTask} {translate('human_resource.dashboard_personal.informed')}
                      </small>
                    </li>

                    <li title='Hệ thống đánh giá/Cá nhân đánh giá/Quản lý đánh giá'>
                      <span className='handle'>
                        <i className='fa fa-ellipsis-v'></i>
                        <i className='fa fa-ellipsis-v'></i>
                      </span>
                      <span className='text'>
                        <a target='_blank'>{translate('human_resource.dashboard_personal.kpi_results')}</a>
                      </span>
                      <small className='label label-success'>{`${employeeKpiSetByMonth && employeeKpiSetByMonth.length ? employeeKpiSetByMonth[0].automaticPoint : 0} ${translate('human_resource.dashboard_personal.point')}/ ${employeeKpiSetByMonth && employeeKpiSetByMonth.length ? employeeKpiSetByMonth[0].employeePoint : 0} ${translate('human_resource.dashboard_personal.point')}/ ${employeeKpiSetByMonth && employeeKpiSetByMonth.length ? employeeKpiSetByMonth[0].approvedPoint : 0} ${translate('human_resource.dashboard_personal.point')}`}</small>
                    </li>

                    <li>
                      <span className='handle'>
                        <i className='fa fa-ellipsis-v'></i>
                        <i className='fa fa-ellipsis-v'></i>
                      </span>
                      <span className='text'>
                        <a href='/hr-annual-leave-personal' target='_blank'>
                          {translate('human_resource.dashboard_personal.number_annual_leave_in_year')} {year}
                        </a>
                      </span>
                      <small className='label label-success'>
                        {numberAnnualLeave}/{maximumNumberOfLeaveDays} ngày
                      </small>
                    </li>

                    <li>
                      <span className='handle'>
                        <i className='fa fa-ellipsis-v'></i>
                        <i className='fa fa-ellipsis-v'></i>
                      </span>
                      <span className='text'>
                        <a style={{ pointerEvents: 'none' }}>{translate('human_resource.dashboard_personal.overtime_total')}</a>
                      </span>
                      <small className='label label-primary'>
                        {totalOvertime} {translate('human_resource.dashboard_personal.hours')}
                      </small>
                    </li>

                    <li>
                      <span className='handle'>
                        <i className='fa fa-ellipsis-v'></i>
                        <i className='fa fa-ellipsis-v'></i>
                      </span>
                      <span className='text'>
                        <a style={{ pointerEvents: 'none' }}>{translate('human_resource.dashboard_personal.total_time_annual_leave')}</a>
                      </span>
                      <small className='label label-danger'>
                        {totalHoursOff} {translate('human_resource.dashboard_personal.hours')}
                      </small>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
              <div className='box box-solid'>
                <div className='box-header with-border'>
                  <div className='box-title'>
                    Tương quan công việc cá nhân trong {getUnitName(organizationalUnitsOfUser, organizationalUnits[0])} và công ty{' '}
                    {monthShow}
                  </div>
                </div>
                <div className='box-body'>
                  {state?.loadingScreen ? <div>{translate('general.loading')}</div> : <div ref={refTaskChart}></div>}
                </div>
              </div>
            </div>
          </div>

          <div className='row'>
            <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
              <div className='box box-solid'>
                <div className='box-header with-border'>
                  <div className='box-title'>
                    Tương quan số lượt khen thưởng của cá nhân trong {getUnitName(organizationalUnitsOfUser, organizationalUnits[0])} và
                    công ty {monthShow}
                  </div>
                </div>
                <div className='box-body'>
                  {state?.loadingScreen ? <div>{translate('general.loading')}</div> : <div ref={refDataCommendationChart}></div>}
                </div>
              </div>
            </div>

            <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
              <div className='box box-solid'>
                <div className='box-header with-border'>
                  <div className='box-title'>
                    {' '}
                    Tương quan số lượt kỷ luật của cá nhân trong {getUnitName(organizationalUnitsOfUser, organizationalUnits[0])} và công ty{' '}
                    {monthShow}
                  </div>
                </div>
                <div className='box-body'>
                  {state?.loadingScreen ? <div>{translate('general.loading')}</div> : <div ref={refDataDisciplineChart}></div>}
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-16 col-md-6 col-sm-12 col-xs-12'>
              <div className='box box-solid'>
                <div className='box-header with-border'>
                  <div className='box-title'>
                    Tương quan số giờ nghỉ phép cá nhân trong {getUnitName(organizationalUnitsOfUser, organizationalUnits[0])} và công ty{' '}
                    {monthShow}
                  </div>
                </div>
                <div className='box-body'>
                  {state?.loadingScreen ? <div>{translate('general.loading')}</div> : <div ref={refHoursOffChart}></div>}
                </div>
              </div>
            </div>
            <div className='col-lg-16 col-md-6 col-sm-12 col-xs-12'>
              <div className='box box-solid'>
                <div className='box-header with-border'>
                  <div className='box-title'>
                    {' '}
                    Tương quan số giờ tăng ca cá nhân trong {getUnitName(organizationalUnitsOfUser, organizationalUnits[0])} và công ty{' '}
                    {monthShow}
                  </div>
                </div>
                <div className='box-body'>
                  {state?.loadingScreen ? <div>{translate('general.loading')}</div> : <div ref={refOverTimeChart}></div>}
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            {/* Tổng hợp khen thưởng */}
            {/* <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="box box-solid">
                                <div className="box-header with-border">
                                    <h3 className="box-title">{translate('human_resource.dashboard_personal.general_commendation')} {monthShow}</h3>
                                </div>
                                <div className="box-body">
                                    <table className="table table-striped table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                                <th>{translate('human_resource.dashboard_personal.fullname')}</th>
                                                <th className="col-sort">{translate('human_resource.dashboard_personal.reason_praise')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {discipline.totalListCommendation.length !== 0 &&
                                                discipline.totalListCommendation.map((x, index) => index < 5 ? (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{x.employee.fullName}</td>
                                                        <td>{x.reason}</td>
                                                    </tr>
                                                ) : null)
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        (!discipline.totalListCommendation || discipline.totalListCommendation.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                    }
                                </div>
                                <div className="box-footer text-center">
                                    <a style={{ cursor: 'pointer' }} onClick={viewAllCommendation} className="uppercase">{translate('human_resource.dashboard_personal.see_all')}</a>
                                </div>
                            </div>
                        </div> */}

            {/* Tổng hợp kỷ luật */}
            {/* <LazyLoadComponent>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{translate('human_resource.dashboard_personal.general_discipline')} {monthShow}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th className="col-fixed" style={{ width: 80 }}>STT</th>
                                                    <th>{translate('human_resource.dashboard_personal.fullname')}</th>
                                                    <th className="col-sort">{translate('human_resource.dashboard_personal.reason_discipline')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {discipline.totalListDiscipline.length !== 0 &&
                                                    discipline.totalListDiscipline.map((x, index) => index < 5 ? (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{x.employee.fullName}</td>
                                                            <td>{x.reason}</td>
                                                        </tr>
                                                    ) : null)
                                                }
                                            </tbody>
                                        </table>
                                        {
                                            (!discipline.totalListDiscipline || discipline.totalListDiscipline.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                                        }
                                    </div>
                                    <div className="box-footer text-center">
                                        <a style={{ cursor: 'pointer' }} onClick={viewAllDiscipline} className="uppercase">{translate('human_resource.dashboard_personal.see_all')}</a>
                                    </div>
                                </div>
                            </div>
                        </LazyLoadComponent> */}
          </div>

          <div className='row'>
            {/* Tổng hợp nghỉ phép */}
            {/* <LazyLoadComponent>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{translate('human_resource.dashboard_personal.general_annual_leave')} {monthShow}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>{translate('human_resource.dashboard_personal.fullname')}</th>
                                                    <th className="col-sort">{translate('human_resource.dashboard_personal.total_hours')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeHoursOff.length !== 0 &&
                                                    employeeHoursOff.map((x, index) => index < 5 ? (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>Nhân viên {index + 1}</td>
                                                            <td>
                                                                <div className="clearfix"> <small className="pull-right">{x.totalHours}</small> </div>
                                                                <div className="progress xs">
                                                                    <div style={{ width: `${(x.totalHours / maxHoursOff).toFixed(2) * 100}%` }} className="progress-bar progress-bar-green">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : null)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="box-footer text-center">
                                        <a style={{ cursor: 'pointer' }} onClick={viewAllHoursOff} className="uppercase">{translate('human_resource.dashboard_personal.see_all')}</a>
                                    </div>
                                </div>
                            </div>
                        </LazyLoadComponent> */}

            {/* Tổng hợp tăng ca */}
            {/* <LazyLoadComponent>
                            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                <div className="box box-solid">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">{translate('human_resource.dashboard_personal.general_overtime')} {monthShow}</h3>
                                    </div>
                                    <div className="box-body">
                                        <table className="table table-striped table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>STT</th>
                                                    <th>{translate('human_resource.dashboard_personal.fullname')}</th>
                                                    <th className="col-sort">{translate('human_resource.dashboard_personal.total_hours')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employeeOvertime.length !== 0 &&
                                                    employeeOvertime.map((x, index) => index < 5 ? (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>Nhân viên {index + 1}</td>
                                                            <td>
                                                                <div className="clearfix"> <small className="pull-right">{x.totalHours}</small> </div>
                                                                <div className="progress xs">
                                                                    <div style={{ width: `${(x.totalHours / maxOverTime).toFixed(2) * 100}%` }} className="progress-bar progress-bar-green">
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : null)
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="box-footer text-center">
                                        <a style={{ cursor: 'pointer' }} onClick={viewAllOverTime} className="uppercase">{translate('human_resource.dashboard_personal.see_all')}</a>
                                    </div>
                                </div>
                            </div>
                        </LazyLoadComponent> */}

            <LazyLoadComponent>
              <TrendWorkChart
                nameChart={`Thống kê tình hình làm việc`}
                nameData1={`${translate('human_resource.dashboard_personal.total_hours_works')}`}
                nameData2={`${translate('human_resource.dashboard_personal.overtime_total')}`}
              />
            </LazyLoadComponent>
          </div>
        </div>
      ) : (
        <div className='box'>
          <div className='box-body'>
            <h4>{translate('human_resource.dashboard_personal.not_org_unit')}</h4>
          </div>
        </div>
      )}

      <ViewAllTasks
        employeeTasks={employeeTaskInCurrentUnit ? employeeTaskInCurrentUnit : []}
        title={`${translate('human_resource.dashboard_personal.general_task')} ${monthShow}`}
        showCheck={true}
      />
      <ViewAllCommendation
        dataCommendation={discipline.totalListCommendation}
        title={`${translate('human_resource.dashboard_personal.general_commendation')} ${monthShow}`}
      />
      <ViewAllDiscipline
        dataDiscipline={discipline.totalListDiscipline}
        title={`${translate('human_resource.dashboard_personal.general_discipline')} ${monthShow}`}
      />
      {viewOverTime && (
        <ViewAllOverTime
          dataView={employeeOvertime}
          hideEmployee={true}
          title={`${translate('human_resource.dashboard_personal.general_overtime')} ${monthShow}`}
          id={viewOverTime}
          showCheck={true}
        />
      )}
      {viewHoursOff && (
        <ViewAllOverTime
          dataView={employeeHoursOff}
          hideEmployee={true}
          title={`${translate('human_resource.dashboard_personal.general_annual_leave')} ${monthShow}`}
          id={viewHoursOff}
          showCheck={true}
        />
      )}
    </React.Fragment>
  )
}

function mapState(state) {
  const { timesheets, tasks, user, workPlan, annualLeave, createEmployeeKpiSet, discipline, department } = state
  return { timesheets, tasks, user, workPlan, annualLeave, createEmployeeKpiSet, discipline, department }
}

const actionCreators = {
  getTimesheets: TimesheetsActions.searchTimesheets,
  getTaskInOrganizationUnitByMonth: taskManagementActions.getTaskInOrganizationUnitByMonth,
  getAllEmployeeOfUnitByIds: UserActions.getAllEmployeeOfUnitByIds,
  getListWorkPlan: WorkPlanActions.getListWorkPlan,
  getNumberAnnaulLeave: AnnualLeaveActions.searchAnnualLeaves,
  getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth,

  getListPraise: DisciplineActions.getListPraise,
  getListDiscipline: DisciplineActions.getListDiscipline
}

const componentInfor = connect(mapState, actionCreators)(withTranslate(ComponentInfor))
export { componentInfor as ComponentInfor }
