import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { LazyLoadComponent, ExportExcel } from '../../../common-components'

import { ResultsOfAllOrganizationalUnitKpiChart } from './resultsOfAllOrganizationalUnitKpiChart'
import { ResultsOfAllEmployeeKpiSetChart } from '../../kpi/evaluation/dashboard/component/resultsOfAllEmployeeKpiSetChart'
import { DashboardEvaluationEmployeeKpiSetAction } from '../../kpi/evaluation/dashboard/redux/actions'

import { showListInSwal } from '../../../helpers/showListInSwal'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'

class TabEmployeeCapacity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      numberOfExcellentEmployees: 5,
      numberOfExcellent: 5
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.organizationalUnits !== prevState.organizationalUnits || nextProps.month !== prevState.month) {
      nextProps.getAllEmployeeKpiSetOfUnitByIds(
        nextProps.organizationalUnits && nextProps.organizationalUnits.length !== 0
          ? nextProps.organizationalUnits
          : nextProps.allOrganizationalUnits
      )
      return {
        ...prevState,
        organizationalUnits: nextProps.organizationalUnits,
        month: nextProps.month,
        allOrganizationalUnits: nextProps.allOrganizationalUnits
      }
    }

    return null
  }

  /**
   * Function lấy lại thông tin kpi các đơn vị để export báo cáo
   * @param {*} data
   */
  handleResultsOfAllOrganizationalUnitsKpiChartDataAvailable = (data) => {
    this.setState((state) => {
      return {
        ...state,
        resultsOfAllOrganizationalUnitsKpiChartData: data
      }
    })
  }

  /**
   * Function lấy lại kết quả KPI tất cả các nhân viên để export báo cáo
   * @param {*} data
   */
  handleResultsOfAllEmployeeKpiSetChartDataAvailable = (data) => {
    this.setState((state) => {
      return {
        ...state,
        resultsOfAllEmployeeKpiSetChartData: data
      }
    })
  }

  /** Function thay đổi số lượng nhân viên xuất sắc nhất muốn xem */
  handleNumberOfEmployeesChange = (event) => {
    const value = event.target.value
    this.setState((state) => {
      return {
        ...state,
        numberOfExcellent: value
      }
    })
  }

  /** Lưu thay đổi số lượng nhân viên xuất sắc muốn xem */
  setLimit = () => {
    const { numberOfExcellent } = this.state
    this.setState((state) => {
      return {
        ...state,
        numberOfExcellentEmployees: numberOfExcellent
      }
    })
    window.$(`#setting-excellent`).collapse('hide')
  }

  showDetailTopEmployees = () => {
    Swal.fire({
      icon: 'question',
      html: `<h4><div>Top nhân viên xuất sắc nhất lấy theo nhân viên có điểm người phê duyệt chấm, và sắp xếp từ cao xuống thấp </h4>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
          `,
      width: '50%'
    })
  }

  render() {
    const { translate, department, dashboardEvaluationEmployeeKpiSet, childOrganizationalUnit, monthSearch } = this.props
    const {
      month,
      organizationalUnits,
      allOrganizationalUnits,
      numberOfExcellentEmployees,
      numberOfExcellent,
      resultsOfAllOrganizationalUnitsKpiChartData,
      resultsOfAllEmployeeKpiSetChartData
    } = this.state

    let employeeKpiSets, lastMonthEmployeeKpiSets, organizationalUnitsName
    if (organizationalUnits) {
      organizationalUnitsName = department.list.filter((x) => organizationalUnits.includes(x._id))
      organizationalUnitsName = organizationalUnitsName.map((x) => x.name)
    }
    if (dashboardEvaluationEmployeeKpiSet) {
      employeeKpiSets = dashboardEvaluationEmployeeKpiSet.employeeKpiSets

      lastMonthEmployeeKpiSets = employeeKpiSets && employeeKpiSets.filter((item) => dayjs(item.date).format('MM-YYYY') === month)
      lastMonthEmployeeKpiSets && lastMonthEmployeeKpiSets.sort((a, b) => b.approvedPoint - a.approvedPoint)
      lastMonthEmployeeKpiSets = lastMonthEmployeeKpiSets && lastMonthEmployeeKpiSets.filter((x) => x.approvedPoint)
      lastMonthEmployeeKpiSets = lastMonthEmployeeKpiSets && lastMonthEmployeeKpiSets.slice(0, numberOfExcellentEmployees)
    }

    return (
      <div className='row qlcv'>
        {/* Kết quả KPI các đơn vị */}
        <LazyLoadComponent>
          <div className='col-md-12'>
            <ResultsOfAllOrganizationalUnitKpiChart
              childOrganizationalUnit={childOrganizationalUnit}
              monthSearch={monthSearch}
              onDataAvailable={this.handleResultsOfAllOrganizationalUnitsKpiChartDataAvailable}
            />
          </div>
        </LazyLoadComponent>

        {/* Top 5 nhân viên xuất sắc */}
        <div className='col-md-12'>
          <div className='box box-solid'>
            <div className='box-header with-border'>
              <div className='box-title'>
                {`Top ${numberOfExcellentEmployees} ${translate('kpi.evaluation.dashboard.best_employee')} `}
                {organizationalUnitsName && organizationalUnitsName.length < 2 ? (
                  <>
                    <span>{` ${organizationalUnitsName?.[0] ? organizationalUnitsName?.[0] : ''}`}</span>
                  </>
                ) : (
                  <span
                    onClick={() => showListInSwal(organizationalUnitsName, translate('general.list_unit'))}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>{` ${translate('task.task_dashboard.of')}`}</span>
                    <a style={{ cursor: 'pointer', fontWeight: 'bold' }}> {organizationalUnitsName?.length}</a>
                    <span>{` ${translate('task.task_dashboard.unit_lowercase')}`}</span>
                  </span>
                )}
                {` ${month}`}
              </div>
              <div className='box-tools pull-right'>
                <button
                  type='button'
                  data-toggle='collapse'
                  data-target='#setting-excellent'
                  className='pull-right'
                  style={{ border: 'none', background: 'none', padding: '0px' }}
                >
                  <i className='fa fa-gear' style={{ fontSize: '19px' }}></i>
                </button>
                <div className='box box-primary box-solid collapse setting-table' id={'setting-excellent'}>
                  <div className='box-header with-border'>
                    <h3 className='box-title'>{translate('kpi.evaluation.dashboard.option')}</h3>
                    <div className='box-tools pull-right'>
                      <button type='button' className='btn btn-box-tool' data-toggle='collapse' data-target='#setting-excellent'>
                        <i className='fa fa-times'></i>
                      </button>
                    </div>
                  </div>
                  <div className='form-group'>
                    <label className='form-control-static'>{translate('kpi.evaluation.dashboard.number_of_employee')}</label>
                    <input className='form-control' value={numberOfExcellent} type='Number' onChange={this.handleNumberOfEmployeesChange} />
                  </div>

                  <button type='button' className='btn btn-primary pull-right' onClick={this.setLimit}>
                    {translate('table.update')}
                  </button>
                </div>
              </div>
              {/* Giải thích */}
              <a title={'Giải thích các nhóm tài sản'} style={{ marginLeft: '5px' }} onClick={this.showDetailTopEmployees}>
                <i className='fa fa-question-circle' style={{ cursor: 'pointer' }} />
              </a>
            </div>
            <div className='box-body no-parding'>
              <ul className='users-list clearfix'>
                {dashboardEvaluationEmployeeKpiSet.loading ? (
                  <p>{translate('general.loading')}</p>
                ) : lastMonthEmployeeKpiSets && lastMonthEmployeeKpiSets.length !== 0 ? (
                  lastMonthEmployeeKpiSets.map((item, index) => (
                    <li key={index} style={{ maxWidth: 200 }}>
                      <img alt='avatar' style={{ height: '150px' }} src={process.env.REACT_APP_SERVER + item.creator.avatar} />
                      <a className='users-list-name' href='#detailKpiMember2' data-toggle='modal' data-target='#memberKPIApprove2'>
                        {item.creator.name}
                      </a>
                      <span className='users-list-date'>{item.approvedPoint}</span>
                    </li>
                  ))
                ) : (
                  <li>{translate('kpi.evaluation.employee_evaluation.data_not_found')}</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Kết quả Kpi tất cả nhân viên */}
        <div className='col-md-12'>
          <ResultsOfAllEmployeeKpiSetChart
            organizationalUnitIds={organizationalUnits && organizationalUnits.length !== 0 ? organizationalUnits : allOrganizationalUnits}
            onDataAvailable={this.handleResultsOfAllEmployeeKpiSetChartDataAvailable}
            organizationalUnitsName={organizationalUnitsName}
          />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { dashboardEvaluationEmployeeKpiSet, department } = state
  return { dashboardEvaluationEmployeeKpiSet, department }
}

const mapDispatchToProps = {
  getAllEmployeeKpiSetOfUnitByIds: DashboardEvaluationEmployeeKpiSetAction.getAllEmployeeKpiSetOfUnitByIds
}

const tabEmployeeCapacity = React.memo(connect(mapStateToProps, mapDispatchToProps)(withTranslate(TabEmployeeCapacity)))
export { tabEmployeeCapacity as TabEmployeeCapacity }
