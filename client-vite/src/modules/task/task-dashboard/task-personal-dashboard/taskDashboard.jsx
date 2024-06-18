import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { useTranslate, withTranslate } from 'react-redux-multilingual'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { taskManagementActions } from '../../task-management/redux/actions'
import { TaskStatusChart } from './taskStatusChart'
import { DomainOfTaskResultsChart } from './domainOfTaskResultsChart'
import { GanttCalendar } from './ganttCalendar'
import { AverageResultsOfTask } from './averageResultsOfTask'
import GeneralTaskPersonalChart from './generalTaskPersonalChart'
import { InprocessTask } from './inprocessTask'
import { LoadTaskChart } from './loadTaskChart'
import { DatePicker, LazyLoadComponent, ExportExcel } from '../../../../common-components'
import { convertTime } from '../../../../helpers/stringMethod'
import { filterDifference } from '../../../../helpers/taskModuleHelpers'
import { getStorage } from '../../../../config'

const initState = () => {
  const d = new Date()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  let startMonth
  let endMonth
  let startYear

  if (month > 3) {
    startMonth = month - 3
    startYear = year
  } else {
    startMonth = month - 3 + 12
    startYear = year - 1
  }
  if (startMonth < 10) startMonth = `0${startMonth}`
  if (month < 10) {
    endMonth = `0${month}`
  } else {
    endMonth = month
  }

  const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 }

  const INFO_SEARCH = {
    startMonth: [startYear, startMonth].join('-'),
    endMonth: [year, endMonth].join('-'),

    startMonthTitle: [startMonth, startYear].join('-'),
    endMonthTitle: [endMonth, year].join('-')
  }

  // const SEARCH_FOR_WEIGHT_TASK = {
  //   taskStartMonth: [startYear, startMonth].join('-'),
  //   taskEndMonth: [year, endMonth].join('-'),

  //   startMonthTitle: [startMonth, startYear].join('-'),
  //   endMonthTitle: [endMonth, year].join('-')
  // }

  return {
    userID: '',

    dataStatus: DATA_STATUS.NOT_AVAILABLE,

    startMonth: INFO_SEARCH.startMonth,
    endMonth: INFO_SEARCH.endMonth,

    startMonthTitle: INFO_SEARCH.startMonthTitle,
    endMonthTitle: INFO_SEARCH.endMonthTitle,
    type: 'status',
    monthTimeSheetLog: INFO_SEARCH.endMonthTitle
  }
}

const initInfoSearch = () => {
  const d = new Date()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  let startMonth
  let endMonth
  let startYear

  if (month > 3) {
    startMonth = month - 3
    startYear = year
  } else {
    startMonth = month - 3 + 12
    startYear = year - 1
  }
  if (startMonth < 10) startMonth = `0${startMonth}`
  if (month < 10) {
    endMonth = `0${month}`
  } else {
    endMonth = month
  }

  return {
    startMonth: [startYear, startMonth].join('-'),
    endMonth: [year, endMonth].join('-'),

    startMonthTitle: [startMonth, startYear].join('-'),
    endMonthTitle: [endMonth, year].join('-')
  }
}

function TaskDashboard(props) {
  const { tasks } = props
  const { loadingInformed, loadingCreator, loadingConsulted, loadingAccountable, loadingResponsible } = tasks
  const [state, setState] = useState(initState())
  const [infoSearch, setInfoSearch] = useState(initInfoSearch())
  const { startMonth, endMonth, monthTimeSheetLog } = state
  const dispatch = useDispatch()
  const translate = useTranslate()

  useEffect(() => {
    const { startMonth, endMonth } = state
    const d = new Date()
    const month = d.getMonth() + 1
    const year = d.getFullYear()

    dispatch(taskManagementActions.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true))
    dispatch(taskManagementActions.getAccountableTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true))
    dispatch(taskManagementActions.getConsultedTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true))
    dispatch(taskManagementActions.getCreatorTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true))
    dispatch(taskManagementActions.getInformedTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true))
    dispatch(taskManagementActions.getTimeSheetOfUser(getStorage('userId'), month, year))
  }, [dispatch])

  const convertType = (value) => {
    // 1: Tắt bấm giờ bằng tay, 2: Tắt bấm giờ tự động với thời gian hẹn trc, 3: add log timer
    if (value === 1) {
      return 'Bấm giờ'
    }
    if (value === 2) {
      return 'Bấm hẹn giờ'
    }
    return 'Bấm bù giờ'
  }

  const formatMonth = (value) => {
    const monthTitle = `${value.slice(5, 7)}-${value.slice(0, 4)}`
    return monthTitle
  }

  const handleSelectMonthStart = (value) => {
    const month = `${value.slice(3, 7)}-${value.slice(0, 2)}`
    setInfoSearch({
      ...infoSearch,
      startMonth: month
    })
  }

  const handleSelectMonthEnd = (value) => {
    const month = `${value.slice(3, 7)}-${value.slice(0, 2)}`
    setInfoSearch({
      ...infoSearch,
      endMonth: month
    })
  }

  const handleSearchData = async () => {
    const { startMonth, endMonth } = infoSearch
    const startMonthObj = new Date(startMonth)
    const endMonthObj = new Date(endMonth)

    if (startMonthObj.getTime() > endMonthObj.getTime()) {
      const { translate } = props
      Swal.fire({
        title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    } else {
      setState({
        ...state,
        startMonth,
        endMonth
      })
      setInfoSearch({
        ...infoSearch,
        startMonthTitle: formatMonth(startMonth),
        endMonthTitle: formatMonth(endMonth)
      })

      dispatch(taskManagementActions.getResponsibleTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true))
      dispatch(taskManagementActions.getAccountableTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true))
      dispatch(taskManagementActions.getConsultedTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true))
      dispatch(taskManagementActions.getCreatorTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true))
      dispatch(taskManagementActions.getInformedTaskByUser([], 1, 1000, [], [], [], null, startMonth, endMonth, null, null, true))
    }
  }

  const handleChangeMonthTimeSheetLog = (value) => {
    setState({
      ...state,
      monthTimeSheetLog: value
    })
  }

  const getUserTimeSheetLogs = () => {
    const { monthTimeSheetLog } = state
    if (monthTimeSheetLog) {
      const d = monthTimeSheetLog.split('-')
      const month = d[0]
      const year = d[1]
      const userId = getStorage('userId')
      dispatch(taskManagementActions.getTimeSheetOfUser(userId, month, year))
    }
  }

  const getTotalTimeSheet = (ts) => {
    let total = 0
    for (let i = 0; i < ts.length; i++) {
      const tslog = ts[i]
      if (typeof tslog.duration === 'number' && tslog.acceptLog) {
        total += Number(tslog.duration)
      }
    }
    return convertTime(total)
  }

  const showLoadTaskDoc = () => {
    Swal.fire({
      icon: 'question',
      html: `<h3 style="color: red"><div>Tải công việc cá nhân</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Tải công việc cá nhân trong 1 tháng được tính như sau</p>
            <ul>
                <li>Lấy tất cả các công việc trong tháng đó (theo các vai trò thực hiện, phê duyệt, tư vấn)</li>
                <li>Tải của một công việc = Số ngày thực hiện công việc trong tháng đó/tổng số người thực hiện, phê duyệt, tư vấn trong công việc</li>
                <li>Tải công việc tháng = Tổng tải của tất cả các công việc</li>
            </ul>
            <p>Ví dụ, 1 công việc kéo dài từ 15/3 đến 20/5, có 1 người thực hiện, 1 người phê duyệt và 1 người tư vấn</p>
            <ul>
                <li>Tải công việc đó trong tháng 3 = 15/(1+1+1)</li>
                <li>Tải công việc đó trong tháng 4 = 31/(1+1+1)</li>
                <li>Tải công việc đó trong tháng 5 = 20/(1+1+1)</li>
            </ul>
            </div>`,
      width: '50%'
    })
  }

  const showTimeSheetLogsDescription = () => {
    Swal.fire({
      icon: 'question',
      html: `<h3 style="color: red"><div>Thống kê bấm giờ cá nhân</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <p>Thống kê lịch sử bấm giờ của bạn trong tháng được chọn.</p>
            <p>Bảng chỉ liệt kê các hoạt động được bắt đầu bấm giờ trong tháng đó. Ví dụ, bạn chọn tháng 12/2021:</p>
            <ul>
                <li>Bấm giờ từ 20:30:00 ngày 31/12/2021 đến 01:30:00 ngày 1/1/2022: <span style="color: green">hiển thị</span>.</li>
                <li>Bấm giờ từ 21:00:00 ngày 30/11/2021 đến 02:00:00 ngày 1/12/2021: <span style="color: red">không hiển thị</span>.</li>
            </ul>
            </div>`,
      width: '50%'
    })
  }

  const showGeneralTaskDescription = () => {
    Swal.fire({
      icon: 'question',
      html: `<h3 style="color: red"><div>Tổng quan công việc được thống kê như sau  ?</div> </h3>
            <ul>
             <li style="font-size: 15px; margin-top: 25px; text-align: left;">Thời gian thống kê tự chọn</li>
             <li style="font-size: 15px; margin-top: 25px; text-align: left;">Vai trò trong công việc</strong>: thực hiện, phê duyệt, hỗ trợ</li>
             <li style="font-size: 15px; margin-top: 25px; text-align: left;">Trạng thái công viêc: đang thực hiện</li>
             </ul>`,
      width: '50%'
    })
  }

  // const showAverageResultDescriptions = () => {
  //     Swal.fire({
  //         icon: "question",

  //         html: `<h3 style="color: red"><div>Kết quả trung bình công việc cá nhân</div> </h3>
  //         <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
  //         <p>Kết quả trung bình công việc trong 1 tháng được tính như sau</p>
  //         <ul>
  //             <li>Lấy tất cả các công việc đã có kết quả đánh giá mà người dùng tham gia với vai trò đã chọn</li>
  //             <p>Nếu người dùng chọn tiêu chí <b>không theo hệ số</b> thì tính như sau:</p>
  //             <li>Kết quả trung bình công việc = lần lượt tính trung bình cộng của 3 loại điểm (điểm tự động/điểm tự đánh giá/điểm người phê duyệt) thẻ hiện trên biểu đồ là 3 đường</li>
  //             <p>Nếu người dùng chọn tiêu chí <b>theo hệ số</b> thì tính như sau:</p>
  //             <li>Kết quả trung bình công việc = tổng </li>
  //             </ul>`,
  //         width: "50%",
  //     })
  // }

  const showDetailInprocessChart = () => {
    Swal.fire({
      icon: 'question',
      html: `<h4>Biểu đồ tiến độ công việc chỉ xét những công việc có trạng thái <b>Đang thực hiện</b></h4>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">`,
      width: '50%'
    })
  }

  const { startMonthTitle, endMonthTitle } = infoSearch
  const { userTimeSheetLogs } = tasks // Thống kê bấm giờ

  let amountResponsibleTask = 0
  let amountTaskCreated = 0
  let amountAccountableTasks = 0
  let amountConsultedTasks = 0
  let amountInformedTasks = 0
  let totalTasks = 0
  let newNumTask = []
  let listTasksGeneral = []
  // Tinh tong so luong cong viec co trang thai Inprogess
  let responsibleTasks = []
  let creatorTasks = []
  let accountableTasks = []
  let consultedTasks = []
  let informedTasks = []

  if (!loadingResponsible && !loadingInformed && !loadingCreator && !loadingConsulted && !loadingAccountable) {
    // Tinh so luong tat ca cac task người này là người thực hiện
    if (tasks?.responsibleTasks?.length > 0) {
      responsibleTasks = tasks.responsibleTasks.filter((o) => o.status === 'inprocess')
      amountResponsibleTask = responsibleTasks.length
    }

    if (tasks?.creatorTasks?.length > 0) {
      creatorTasks = tasks.creatorTasks.filter((o) => o.status === 'inprocess')
      amountTaskCreated = creatorTasks.length
    }

    if (tasks?.accountableTasks?.length > 0) {
      accountableTasks = tasks.accountableTasks.filter((o) => o.status === 'inprocess')
      amountAccountableTasks = accountableTasks.length
    }

    if (tasks?.consultedTasks?.length > 0) {
      consultedTasks = tasks.consultedTasks.filter((o) => o.status === 'inprocess')
      amountConsultedTasks = consultedTasks.length
    }

    if (tasks?.informedTasks?.length > 0) {
      informedTasks = tasks.informedTasks.filter((o) => o.status === 'inprocess')
      amountInformedTasks = informedTasks.length
    }

    newNumTask = [...newNumTask, ...responsibleTasks, ...creatorTasks, ...consultedTasks, ...accountableTasks, ...informedTasks]
    listTasksGeneral = [...listTasksGeneral, ...responsibleTasks, ...accountableTasks, ...consultedTasks]

    newNumTask = filterDifference(newNumTask)
    listTasksGeneral = filterDifference(listTasksGeneral)

    totalTasks = newNumTask.length
  }

  const dataTimeSheetLogsExport = {
    fileName: `${translate('task.task_dashboard.statistical_timesheet_logs')} ${state.monthTimeSheetLog}`,
    dataSheets: [
      {
        sheetTitle: `${translate('task.task_dashboard.statistical_timesheet_logs')} ${state.monthTimeSheetLog}`,
        sheetName: `${translate('task.task_dashboard.statistical_timesheet_logs')}`,
        sheetTitleWidth: 6,
        tables: [
          {
            columns: [
              { key: 'STT', value: 'STT', width: 7 },
              { key: 'name', value: 'Tên công việc', width: 20 },
              { key: 'startedAt', value: 'Thời gian bắt đầu', width: 25 },
              { key: 'stoppedAt', value: 'Thời gian kết thúc', width: 25 },
              { key: 'type', value: 'Loại bấm giờ', width: 15 },
              { key: 'duration', value: 'Thời gian bấm', width: 10 }
            ],
            data: userTimeSheetLogs.map((tsl, index) => ({
              STT: index + 1,
              name: tsl.name ? tsl.name : '...',
              startedAt: tsl.startedAt ? dayjs(tsl.startedAt).format('DD-MM-YYYY h:mm:ss A') : '...',
              stoppedAt: tsl.stoppedAt ? dayjs(tsl.stoppedAt).format('DD-MM-YYYY h:mm:ss A') : '...',
              type: tsl.autoStopped ? convertType(tsl.autoStopped) : '...',
              duration: tsl.duration ? convertTime(tsl.duration) : '...'
            }))
          }
        ]
      }
    ]
  }

  return (
    <>
      <div className='qlcv' style={{ textAlign: 'left' }}>
        {/** Chọn ngày bắt đầu */}
        <div className='form-inline'>
          <div className='form-group'>
            <label style={{ width: 'auto' }}>{translate('task.task_management.from')}</label>
            <DatePicker
              id='monthStartInTaskDashBoard'
              dateFormat='month-year' // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
              value={startMonthTitle} // giá trị mặc định cho datePicker
              onChange={handleSelectMonthStart}
              disabled={false} // sử dụng khi muốn disabled, mặc định là false
            />
          </div>

          {/** Chọn ngày kết thúc */}
          <div className='form-group'>
            <label style={{ width: 'auto' }}>{translate('task.task_management.to')}</label>
            <DatePicker
              id='monthEndInTaskDashBoard'
              dateFormat='month-year' // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
              value={endMonthTitle} // giá trị mặc định cho datePicker
              onChange={handleSelectMonthEnd}
              disabled={false} // sử dụng khi muốn disabled, mặc định là false
            />
          </div>

          {/** button tìm kiếm data để vẽ biểu đồ */}
          <div className='form-group'>
            <button type='button' className='btn btn-success' onClick={handleSearchData}>
              {translate('kpi.evaluation.employee_evaluation.search')}
            </button>
          </div>
        </div>
      </div>

      <div className='row statistical-wrapper' style={{ marginTop: '5px' }}>
        <div className='col-md-2 col-sm-4 col-xs-4 statistical-item'>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', color: '#00c0ef' }} className='material-icons'>
                list_alt
              </span>
              <span style={{ fontWeight: 'bold' }}>Tổng số cv</span>
            </div>

            <Link
              to='/task-management'
              onClick={() =>
                localStorage.setItem(
                  'stateFromTaskDashboard',
                  JSON.stringify({
                    fromTaskPersonalDashboard: true,
                    status: ['inprocess'],
                    startDate: infoSearch.startMonth,
                    endDate: infoSearch.endMonth,
                    roles: ['responsible', 'accountable', 'consulted', 'creator', 'informed']
                  })
                )
              }
              target='_blank'
              rel='noopener noreferrer'
            >
              <span style={{ fontSize: '21px' }} className='info-box-number'>
                {totalTasks}
              </span>
            </Link>
          </div>
        </div>

        <div className='col-md-2 col-sm-4 col-xs-4 statistical-item'>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', color: '#00c0ef' }} className='material-icons'>
                person_add
              </span>
              <span style={{ fontWeight: 'bold' }}>Bạn đã tạo</span>
            </div>
            <Link
              to='/task-management'
              onClick={() =>
                localStorage.setItem(
                  'stateFromTaskDashboard',
                  JSON.stringify({
                    fromTaskPersonalDashboard: true,
                    status: ['inprocess'],
                    startDate: infoSearch.startMonth,
                    endDate: infoSearch.endMonth,
                    roles: ['creator']
                  })
                )
              }
              target='_blank'
              rel='noopener noreferrer'
            >
              <span style={{ fontSize: '21px' }} className='info-box-number'>
                {amountTaskCreated}
              </span>
            </Link>
          </div>
        </div>

        <div className='col-md-2 col-sm-4 col-xs-4 statistical-item'>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', color: '#289428' }} className='material-icons'>
                person
              </span>
              <span style={{ fontWeight: 'bold' }}>Bạn thực hiện</span>
            </div>
            <Link
              to='/task-management'
              onClick={() =>
                localStorage.setItem(
                  'stateFromTaskDashboard',
                  JSON.stringify({
                    fromTaskPersonalDashboard: true,
                    status: ['inprocess'],
                    startDate: infoSearch.startMonth,
                    endDate: infoSearch.endMonth,
                    roles: ['responsible']
                  })
                )
              }
              target='_blank'
              rel='noopener noreferrer'
            >
              <span style={{ fontSize: '21px' }} className='info-box-number'>
                {amountResponsibleTask}
              </span>
            </Link>
          </div>
        </div>

        <div className='col-md-2 col-sm-4 col-xs-4 statistical-item'>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', color: '#f13c3c' }} className='material-icons'>
                person
              </span>
              <span style={{ fontWeight: 'bold' }}>Bạn phê duyệt</span>
            </div>
            <Link
              to='/task-management'
              onClick={() =>
                localStorage.setItem(
                  'stateFromTaskDashboard',
                  JSON.stringify({
                    fromTaskPersonalDashboard: true,
                    status: ['inprocess'],
                    startDate: infoSearch.startMonth,
                    endDate: infoSearch.endMonth,
                    roles: ['accountable']
                  })
                )
              }
              target='_blank'
              rel='noopener noreferrer'
            >
              <span style={{ fontSize: '21px' }} className='info-box-number'>
                {amountAccountableTasks}
              </span>
            </Link>
          </div>
        </div>
        <div className='col-md-2 col-sm-4 col-xs-4 statistical-item'>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', color: '#f39c12' }} className='material-icons'>
                people
              </span>

              <span style={{ fontWeight: 'bold' }}>Bạn tư vấn</span>
            </div>
            <Link
              to='/task-management'
              onClick={() =>
                localStorage.setItem(
                  'stateFromTaskDashboard',
                  JSON.stringify({
                    fromTaskPersonalDashboard: true,
                    status: ['inprocess'],
                    startDate: infoSearch.startMonth,
                    endDate: infoSearch.endMonth,
                    roles: ['consulted']
                  })
                )
              }
              target='_blank'
              rel='noopener noreferrer'
            >
              <span style={{ fontSize: '21px' }} className='info-box-number'>
                {amountConsultedTasks}
              </span>
            </Link>
          </div>
        </div>

        <div className='col-md-2 col-sm-4 col-xs-4 statistical-item'>
          <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '10px', color: '#dcb67a' }} className='material-icons'>
                <span className='material-icons-outlined'>person_search</span>
              </span>
              <span style={{ fontWeight: 'bold' }}>Bạn quan sát</span>
            </div>
            <Link
              to='/task-management'
              onClick={() =>
                localStorage.setItem(
                  'stateFromTaskDashboard',
                  JSON.stringify({
                    fromTaskPersonalDashboard: true,
                    status: ['inprocess'],
                    startDate: infoSearch.startMonth,
                    endDate: infoSearch.endMonth,
                    roles: ['informed']
                  })
                )
              }
              target='_blank'
              rel='noopener noreferrer'
            >
              <span style={{ fontSize: '21px' }} className='info-box-number'>
                {amountInformedTasks}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Tổng quan công việc cá nhân */}
      <div className='row'>
        <div className='col-md-12'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>
                {`Tổng quan công việc `}
                {startMonthTitle}
                <i className='fa fa-fw fa-caret-right' />
                {endMonthTitle} {`(${listTasksGeneral ? listTasksGeneral.length : 0} công việc)`}
              </div>
              <a onClick={() => showGeneralTaskDescription()}>
                <i className='fa fa-question-circle' style={{ cursor: 'pointer', marginLeft: '5px' }} />
              </a>
            </div>
            <LazyLoadComponent once>
              {listTasksGeneral && listTasksGeneral.length > 0 ? (
                <GeneralTaskPersonalChart tasks={listTasksGeneral} />
              ) : loadingInformed && loadingConsulted && loadingAccountable ? (
                <div className='table-info-panel'>{translate('confirm.loading')}</div>
              ) : (
                <div className='table-info-panel'>{translate('confirm.no_data')}</div>
              )}
            </LazyLoadComponent>
          </div>
        </div>
      </div>

      {/* Lịch công việc chi tiết */}
      <div className='row'>
        <div className='col-xs-12'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>
                {translate('task.task_management.tasks_calendar')} {startMonthTitle}
                <i className='fa fa-fw fa-caret-right' />
                {endMonthTitle}
              </div>
            </div>
            <LazyLoadComponent once>
              <GanttCalendar tasks={tasks} unit={false} />
            </LazyLoadComponent>
          </div>
        </div>
      </div>

      <div className='row'>
        {/* Biểu đồ miền kết quả công việc */}
        <div className='col-xs-12'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>
                {translate('task.task_management.dashboard_area_result')} {startMonthTitle}
                <i className='fa fa-fw fa-caret-right' />
                {endMonthTitle}
              </div>
            </div>
            <div className='box-body qlcv'>
              <LazyLoadComponent once>
                <DomainOfTaskResultsChart startMonth={startMonth} endMonth={endMonth} />
              </LazyLoadComponent>
            </div>
          </div>
        </div>

        {/* Biểu đồ kết quả trung bình công việc */}
        <div className='col-xs-12'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>
                {translate('task.task_management.detail_average_results')} {startMonthTitle}
                <i className='fa fa-fw fa-caret-right' />
                {endMonthTitle}
              </div>
              {/* <a onClick={showAverageResultDescriptions}>
                                <i className="fa fa-question-circle" style={{ cursor: 'pointer', marginLeft: '5px' }} />
                            </a> */}
            </div>
            <div className='box-body'>
              <LazyLoadComponent once>
                <AverageResultsOfTask startMonth={startMonth} endMonth={endMonth} />
              </LazyLoadComponent>
            </div>
          </div>
        </div>

        {/* Biểu đồ trạng thái công việc */}
        <div className='col-xs-12 col-sm-12 col-md-6'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>
                {translate('task.task_management.detail_status_task')} {startMonthTitle}
                <i className='fa fa-fw fa-caret-right' />
                {endMonthTitle}
              </div>
            </div>
            <div className='box-body qlcv'>
              <LazyLoadComponent once>
                <TaskStatusChart startMonth={startMonth} endMonth={endMonth} />
              </LazyLoadComponent>
            </div>
          </div>
        </div>
        <div className='col-xs-12 col-sm-12 col-md-6'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title' style={{ marginRight: '5px' }}>
                {translate('task.task_management.calc_progress')} {startMonthTitle}
                <i className='fa fa-fw fa-caret-right' />
                {endMonthTitle}
              </div>
              <a onClick={showDetailInprocessChart}>
                <i className='fa fa-question-circle' style={{ cursor: 'pointer' }} />
              </a>
            </div>
            <div className='box-body qlcv'>
              <LazyLoadComponent once>
                <InprocessTask startMonth={startMonth} endMonth={endMonth} tasks={tasks.tasks} />
              </LazyLoadComponent>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ dashboard tải công việc */}
      <div className='row'>
        <div className='col-xs-12'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>
                {translate('task.task_management.load_task_chart')} {startMonthTitle}
                <i className='fa fa-fw fa-caret-right' />
                {endMonthTitle}
              </div>
              <a onClick={() => showLoadTaskDoc()}>
                <i className='fa fa-question-circle' style={{ cursor: 'pointer', marginLeft: '5px' }} />
              </a>
            </div>

            <div className='box-body qlcv'>
              <LazyLoadComponent once>
                <LoadTaskChart startMonth={startMonth} endMonth={endMonth} />
              </LazyLoadComponent>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê bấm giờ theo tháng */}
      <div className='row'>
        <div className='col-xs-12 col-md-12'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>Thống kê bấm giờ theo tháng</div>
              <a onClick={() => showTimeSheetLogsDescription()}>
                <i className='fa fa-question-circle' style={{ cursor: 'pointer', marginLeft: '5px' }} />
              </a>
            </div>
            <div className='box-body qlcv'>
              {/* Seach theo thời gian */}
              <div className='form-inline'>
                <div className='form-group'>
                  <label style={{ width: 'auto' }}>Tháng</label>
                  <DatePicker
                    id='month-time-sheet-log'
                    dateFormat='month-year'
                    value={monthTimeSheetLog}
                    onChange={handleChangeMonthTimeSheetLog}
                    disabled={false}
                  />
                </div>
                <button className='btn btn-primary' onClick={getUserTimeSheetLogs}>
                  Thống kê
                </button>
                <ExportExcel id='export-personal-timesheets-logs' style={{ right: 0 }} exportData={dataTimeSheetLogsExport} />
              </div>
              <div>
                <p className='pull-right' style={{ fontWeight: 'bold' }}>
                  Kết quả
                  <span style={{ fontWeight: 'bold', marginLeft: 10 }}>
                    {!tasks.isLoading ? getTotalTimeSheet(userTimeSheetLogs) : translate('general.loading')}
                  </span>
                </p>
              </div>
              <table className='table table-hover table-striped table-bordered' id='table-user-timesheetlogs'>
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>STT</th>
                    <th>Tên công việc</th>
                    <th>Thời gian bắt đầu</th>
                    <th>Thời gian kết thúc</th>
                    <th>Loại bấm giờ</th>
                    <th className='col-sort'>Thời gian bấm</th>
                  </tr>
                </thead>
                <tbody>
                  {userTimeSheetLogs.map((tsl, index) => {
                    return (
                      tsl?.acceptLog && (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{tsl.name}</td>
                          <td>{dayjs(tsl.startedAt).format('DD-MM-YYYY h:mm:ss A')}</td>
                          <td>{dayjs(tsl.stoppedAt).format('DD-MM-YYYY h:mm:ss A')}</td>
                          <td>{convertType(tsl.autoStopped)}</td>
                          <td>{convertTime(tsl.duration)}</td>
                        </tr>
                      )
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách công việc đã hoàn thành của các nhân viên trong phòng ban */}
      <div className='row'>
        <div className='col-xs-12 col-md-12'>
          <div className='box box-primary'>
            <div className='box-header with-border'>
              <div className='box-title'>Thống kê tiến độ làm việc của các nhân viên trong phòng ban</div>
            </div>
            {/* <div className='box-body qlcv'>
              <div className='form-inline'>
                <div className='form-group'>
                  <label style={{ width: 'auto' }}>Tháng</label>
                  <DatePicker
                    id='month-time-sheet-log'
                    dateFormat='month-year'
                    value={monthTimeSheetLog}
                    onChange={handleChangeMonthTimeSheetLog}
                    disabled={false}
                  />
                </div>
                <button className='btn btn-primary' onClick={getUserTimeSheetLogs}>
                  Thống kê
                </button>
                <ExportExcel id='export-personal-timesheets-logs' style={{ right: 0 }} exportData={dataTimeSheetLogsExport} />
              </div>
              <div>
                <p className='pull-right' style={{ fontWeight: 'bold' }}>
                  Kết quả
                  <span style={{ fontWeight: 'bold', marginLeft: 10 }}>
                    {!tasks.isLoading ? getTotalTimeSheet(userTimeSheetLogs) : translate('general.loading')}
                  </span>
                </p>
              </div>
              <table className='table table-hover table-striped table-bordered' id='table-user-timesheetlogs'>
                <thead>
                  <tr>
                    <th style={{ width: 80 }}>STT</th>
                    <th>Tên công việc</th>
                    <th>Thời gian bắt đầu</th>
                    <th>Thời gian kết thúc</th>
                    <th>Loại bấm giờ</th>
                    <th className='col-sort'>Thời gian bấm</th>
                  </tr>
                </thead>
                <tbody>
                  {userTimeSheetLogs.map((tsl, index) => {
                    return (
                      tsl?.acceptLog && (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{tsl.name}</td>
                          <td>{dayjs(tsl.startedAt).format('DD-MM-YYYY h:mm:ss A')}</td>
                          <td>{dayjs(tsl.stoppedAt).format('DD-MM-YYYY h:mm:ss A')}</td>
                          <td>{convertType(tsl.autoStopped)}</td>
                          <td>{convertTime(tsl.duration)}</td>
                        </tr>
                      )
                    )
                  })}
                </tbody>
              </table>
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

function mapState(state) {
  const { tasks } = state
  return { tasks }
}
const actionCreators = {
  getResponsibleTaskByUser: taskManagementActions.getResponsibleTaskByUser,
  getAccountableTaskByUser: taskManagementActions.getAccountableTaskByUser,
  getConsultedTaskByUser: taskManagementActions.getConsultedTaskByUser,
  getInformedTaskByUser: taskManagementActions.getInformedTaskByUser,
  getCreatorTaskByUser: taskManagementActions.getCreatorTaskByUser,
  getTimeSheetOfUser: taskManagementActions.getTimeSheetOfUser
}

export default connect(mapState, actionCreators)(withTranslate(TaskDashboard))
