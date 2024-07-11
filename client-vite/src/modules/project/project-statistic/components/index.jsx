import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { DatePicker } from "../../../../common-components";
import { ProjectStatusQuantityStatistic } from "./projectQuantityStatistic";
import { BiddingPackageStatusQuantityStatistic } from "./biddingPackageStatistic";
import { EmployeeStatusQuantityStatistic } from "./employeeStatusQuantityStatistic";
import { AssetStatusQuantityStatistic } from "./assetStatusQuantityStatistic";
import { EmployeeManagerActions } from "../../../human-resource/profile/employee-management/redux/actions";
import { UserActions } from "../../../super-admin/user/redux/actions";
import { BiddingPackageManagerActions } from "../../../bidding/bidding-package/biddingPackageManagement/redux/actions";
import { ProjectActions } from "../../projects/redux/actions";
import { AssetManagerActions } from "../../../asset/admin/asset-information/redux/actions";
import Swal from "sweetalert2";
import { getStorage } from "../../../../config";

function ProjectStatisticPage(props) {
  const { translate, employeesManager, user, assetsManager, biddingPackagesManager, project } = props
  const [state, setState] = useState({
    startDate: '',
    endDate: ''
  })

  const userId = getStorage('userId')
  const currentRole = getStorage('currentRole')

  const handleChangeEndDate = (value) => {
    let month
    if (value === '') {
      month = null
    } else {
      month = value.slice(3, 7) + '-' + value.slice(0, 2)
    }

    setState((state) => {
      return {
        ...state,
        endDate: month
      }
    })
  }

  const handleChangeStartDate = (value) => {
    let month
    if (value === '') {
      month = null
    } else {
      month = value.slice(3, 7) + '-' + value.slice(0, 2)
    }

    setState((state) => {
      return {
        ...state,
        startDate: month
      }
    })
  }

  const [projectStatistic, setProjectStatistic] = useState({
    total: 0,
    numberOfInProcess: 0,
    numberOfWaitForApproval: 0,
    numberOfFinished: 0,
    numberOfDelayed: 0,
    numberOfCanceled: 0,
  })

  const [biddingPackageStatistic, setBiddingPackageStatistic] = useState({
    total: 0,
    numberOfActive: 0,
    numberOfWaitForBidding: 0,
    numberOfInProcess: 0,
    numberOfInactive: 0,
    numberOfComplete: 0
  })

  const [employeeStatistic, setEmployeeStatistic] = useState({
    total: 0,
    numberOfReadyToAssign: 0,
    numberOfIsWorking: 0
  })

  const [assetStatistic, setAssetStatistic] = useState({
    total: 0,
    numberOfReadyToUse: 0,
    numberOfLost: 0,
    numberOfInUse: 0,
    numberOfBroken: 0,
    numberOfDisposed: 0
  })

  const handleUpdateData = () => {
    const startDate = state?.startDate
    const endDate = state?.endDate
    let startMonth, endMonth
    if (startDate && endDate) {
      startMonth = new Date(startDate)
      endMonth = new Date(endDate)
    }

    if (startMonth && endMonth && startMonth.getTime() > endMonth.getTime()) {
      Swal.fire({
        title: translate('kpi.evaluation.employee_evaluation.wrong_time'),
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: translate('kpi.evaluation.employee_evaluation.confirm')
      })
    } else {
      let data = {
        calledId: 'paginate',
        endDate: endDate,
        startDate: startDate,
        currentRole: currentRole,
        userId: userId
      }

      props.getProjectsDispatch(data)
      props.getAllBiddingPackage(data)
    }
  }

  useEffect(() => {
    props.getAllAsset()
    props.getAllBiddingPackage({
      name: '',
      page: undefined,
      limit: undefined,
      startDate: state?.startDate,
      endDate: state?.endDate
    })
    props.getProjectsDispatch({
      calledId: 'paginate',
      startDate: state?.startDate,
      endDate: state?.endDate,
      currentRole: currentRole,
      userId: userId
    })
    props.getAllEmployee()
  }, [])

  useEffect(() => {
    // set projectStatistic
    const projectData = project?.data?.paginate || []
    let projectInProcess, projectWaitForApproval, projectFinished, projectDelayed, projectCanceled = []
    if (projectData && projectData?.length) {
      projectInProcess = projectData.filter((item) => item?.status === 'inprocess')
      projectWaitForApproval = projectData.filter((item) => item?.status === 'wait_for_approval' || item?.status === 'proposal')
      projectFinished = projectData.filter((item) => item?.status === 'finished')
      projectDelayed = projectData.filter((item) => item?.status === 'delayed')
      projectCanceled = projectData.filter((item) => item?.status === 'canceled')
    }
    setProjectStatistic({
      total: projectData?.length,
      numberOfInProcess: projectInProcess?.length,
      numberOfWaitForApproval: projectWaitForApproval?.length,
      numberOfFinished: projectFinished?.length,
      numberOfDelayed: projectDelayed?.length,
      numberOfCanceled: projectCanceled?.length,
    })

    // set Bidding package statistic
    const biddingPackageData = biddingPackagesManager?.listBiddingPackages
    if (biddingPackageData && biddingPackageData?.length) {
      const total = biddingPackageData?.length
      const numberOfActive = biddingPackageData.filter((x) => x.status === 1)?.length
      const numberOfInactive = biddingPackageData.filter((x) => x.status === 0)?.length
      const numberOfWaitForBidding = biddingPackageData.filter((x) => x.status === 2)?.length
      const numberOfInProcess = biddingPackageData.filter((x) => x.status === 3)?.length
      const numberOfComplete = biddingPackageData.filter((x) => x.status === 4)?.length

      setBiddingPackageStatistic({
        total: total,
        numberOfActive: numberOfActive,
        numberOfInactive: numberOfInactive,
        numberOfWaitForBidding: numberOfWaitForBidding,
        numberOfInProcess: numberOfInProcess,
        numberOfComplete:numberOfComplete
      })
    }

    // set employees
    const employeesData = employeesManager?.listAllEmployees
    
    let listEmployeeIsWorking = []
    if (projectData && projectData?.length && projectInProcess && projectInProcess?.length && employeesData) {
      for (let i = 0; i < projectInProcess?.length; i++) {
        let projectInProcessItem = projectInProcess[i]
        const usersInProject = projectInProcessItem?.usersInProject.map((item) => item?.employeeId) ?? []
        if (usersInProject?.length) {
          usersInProject.forEach((item) => {
            if (!listEmployeeIsWorking || !listEmployeeIsWorking.includes(item)) {
              listEmployeeIsWorking.push(item)
            }
          })
        }
      }
      const totalEmp = employeesData?.length
      const numberOfIsWorking = listEmployeeIsWorking?.length
      const numberOfReadyToAssign = totalEmp - numberOfIsWorking
     
      setEmployeeStatistic({
        total: totalEmp,
        numberOfIsWorking: numberOfIsWorking,
        numberOfReadyToAssign: numberOfReadyToAssign
      })
    } else if (employeesData && employeesData?.length) {
      const totalEmp = employeesData?.length
      const numberOfIsWorking = listEmployeeIsWorking?.length
      const numberOfReadyToAssign = totalEmp - numberOfIsWorking
      setEmployeeStatistic({
        total: totalEmp,
        numberOfIsWorking: numberOfIsWorking,
        numberOfReadyToAssign: numberOfReadyToAssign
      })
    }

    // set asset statistic
    const assetData = assetsManager?.listAssets
    let assetReadyToUse, assetLost, assetInUse, assetBroken, assetDisposed = []
    if (assetData && assetData?.length) {
      assetReadyToUse = assetData?.filter((item) => item?.status === 'ready_to_use')
      assetLost = assetData?.filter((item) => item?.status === 'lost')
      assetInUse = assetData?.filter((item) => item?.status === 'in_use')
      assetBroken = assetData?.filter((item) => item?.status === 'broken')
      assetDisposed = assetData?.filter((item) => item?.status === 'disposed')
    }

    const total = assetData?.length
    const numberOfReadyToUse = assetReadyToUse?.length
    const numberOfLost = assetLost?.length
    const numberOfInUse = assetInUse?.length
    const numberOfBroken = assetBroken?.length
    const numberOfDisposed = assetDisposed?.length

    setAssetStatistic({
      total: total,
      numberOfReadyToUse: numberOfReadyToUse,
      numberOfLost: numberOfLost,
      numberOfInUse: numberOfInUse,
      numberOfBroken: numberOfBroken,
      numberOfDisposed: numberOfDisposed,
    })

  }, [project?.isLoading, biddingPackagesManager?.isLoading, employeesManager?.isLoading, assetsManager?.isLoading])
  
  return (
    <React.Fragment>
      <div className='qlcv' style={{ textAlign: 'left' }}>
        {/* <div className='form-inline'>
          <div className='form-group'>
            <label style={{ width: 'auto' }}>{translate('task.task_management.from')}</label>
            <DatePicker
              id='monthStartInProjectStatistic'
              dateFormat='month-year' // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
              // value={state?.startDate} // giá trị mặc định cho datePicker
              onChange={handleChangeStartDate}
              disabled={false} // sử dụng khi muốn disabled, mặc định là false
            />
          </div>

          <div className='form-group'>
            <label style={{ width: 'auto' }}>{translate('task.task_management.to')}</label>
            <DatePicker
              id='monthEndInProjectStatistic'
              dateFormat='month-year' // sử dụng khi muốn hiện thị tháng - năm, mặc định là ngày-tháng-năm
              // value={state?.endDate} // giá trị mặc định cho datePicker
              onChange={handleChangeEndDate}
              disabled={false} // sử dụng khi muốn disabled, mặc định là false
            />
          </div>

          <div className='form-group'>
            <button type='button' className='btn btn-success'
              onClick={handleUpdateData}
            >
              {translate('kpi.evaluation.employee_evaluation.search')}
            </button>
          </div>
        </div> */}

        {/* Project Quantity => TODO split component */}
        <div className='row'>
          <div className='col-md-6 col-sm-6 form-inline'>
            <div className='info-box'>
              <span className='info-box-icon bg-yellow'>
                <i className='fa fa-archive'></i>
              </span>
              <div className='info-box-content'>
                <span className='info-box-text'>Tổng số dự án</span>
                {/* <a className="info-box-number" style="cursor: pointer; font-size: 20px;">1</a> */}
                <span style={{ fontWeight: 600, fontSize: '20px' }}>{projectStatistic?.total}</span>
              </div>
            </div>
          </div>
          <div className='col-md-6 col-sm-6 form-inline'>
            <div className='info-box'>
              <span className='info-box-icon bg-aqua'>
                <i className='fa fa-handshake-o'></i>
              </span>
              <div className='info-box-content'>
                <span className='info-box-text'>Tổng số gói thầu</span>
                <span style={{ fontWeight: 600, fontSize: '20px' }}>{biddingPackageStatistic?.total}</span>
              </div>
            </div>
          </div>  
        </div>
        <div className='box'>
          <ul className='todo-list'>
            <li>
              <span className='handle'>
                <i className='fa fa-ellipsis-v'></i>
                <i className='fa fa-ellipsis-v'></i>
              </span>
              <span className='text'>
                {/* {numOfBP >= 10 && <span style={{ fontWeight: 600, color: "red", lineHeight: 2 }}>* Hiện đang có 10 gói thầu đang thực hiện, hãy tạm dừng tìm kiếm gói thầu mới để đảm bảo tiến độ *<br /></span>} */}
                <span style={{ fontWeight: 600, color: 'green', lineHeight: 2 }}>
                  Xem danh sách dự án tại{' '}
                  <a style={{ fontWeight: 600 }} href='/project/projects-list' target='_blank'>
                    đây
                  </a>
                </span>
              </span>
            </li>
          </ul>
        </div>

        <div className="row">
          <div className="col-md-6">
            {projectStatistic?.total ? 
              <ProjectStatusQuantityStatistic projectStatisticQuantity={projectStatistic} />
              : <></>
            }
          </div>
          <div className="col-md-6">
            {biddingPackageStatistic?.total ?
              <BiddingPackageStatusQuantityStatistic biddingPackageQuantityStatistic={biddingPackageStatistic} />
              : <></>
            }
          </div>
        </div>

        <div className="row text-3xl py-2 px-5">
          Thống kê về nguồn nhân viên, tài sản
        </div>

        <div className='row'>
          <div className='col-md-6 col-sm-6 form-inline'>
            <div className='info-box'>
              <span className='info-box-icon bg-green'>
                <i className='fa fa-user'></i>
              </span>
              <div className='info-box-content'>
                <span className='info-box-text'>Tổng số nhân viên</span>
                <span style={{ fontWeight: 600, fontSize: '20px' }}>{employeeStatistic?.total}</span>
              </div>
            </div>
          </div>

          <div className='col-md-6 col-sm-6 form-inline'>
            <div className='info-box'>
              <span className='info-box-icon bg-red'>
                <i className='fa fa-tasks'></i>
              </span>
              <div className='info-box-content'>
                <span className='info-box-text'>Tổng số tài sản</span>
                <span style={{ fontWeight: 600, fontSize: '20px' }}>{assetStatistic?.total}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {
              employeeStatistic?.total ? 
                <EmployeeStatusQuantityStatistic employeeQuantityStatistic={employeeStatistic} />
              : <></>  
            }
          </div>
          <div className="col-md-6">
            {
              assetStatistic?.total ? <AssetStatusQuantityStatistic assetQuantityStatistic={assetStatistic} />
                : <></>
            }
          </div>
        </div>


      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { employeesManager, user, translate, assetsManager, project, biddingPackagesManager } = state
  return { employeesManager, user, translate, assetsManager, project, biddingPackagesManager }
}

const actions = {
  getAllEmployee: EmployeeManagerActions.getAllEmployee,
  getAllUser: UserActions.get,
  getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage,
  getProjectsDispatch: ProjectActions.getProjectsDispatch,
  getAllAsset: AssetManagerActions.getAllAsset,
}

export default connect(mapState, actions)(withTranslate(ProjectStatisticPage))
