/* Biểu đồ thể hiện lương thưởng các đơn vị trong công ty */
import React, { Component, useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { showListInSwal } from '../../../../helpers/showListInSwal'

import c3 from 'c3'
import 'c3/c3.css'
import Swal from 'sweetalert2'

const SalaryOfOrganizationalUnitsChart = (props) => {
  const [state, setState] = useState({
    unit: true
  })

  const salaryChart = useRef(null)
  /**
   * Bắt sự kiện thay đổi đơn vị biểu đồ
   * @param {*} value : đơn vị biểu đồ (true or false)
   */
  const handleChangeUnitChart = (value) => {
    setState({
      ...state,
      unit: value
    })
  }

  useEffect(() => {
    if (props.salary.listSalaryByMonth !== state.listSalaryByMonth) {
      setState({
        ...state,
        listSalaryByMonth: props.salary.listSalaryByMonth
      })
    }
  }, [props.salary.listSalaryByMonth, state.unit, state.listSalaryByMonth])

  /** Xóa các chart đã render khi chưa đủ dữ liệu */
  const removePreviousChart = () => {
    const chart = salaryChart.current
    while (chart && chart.hasChildNodes()) {
      chart.removeChild(chart.lastChild)
    }
  }

  /** Render chart */
  const renderChart = (data) => {
    //data.data1.shift();
    let setHeightChart = data.ratioX.length * 40 < 320 ? 320 : data.ratioX.length * 40
    removePreviousChart()
    let chart = c3.generate({
      bindto: salaryChart.current,
      data: {
        columns: [[data.nameData, ...data.data1]],
        type: 'bar',
        labels: true
      },
      padding: {
        bottom: 20
      },
      size: {
        height: setHeightChart
      },
      axis: {
        rotated: true,
        x: {
          type: 'category',
          categories: data.ratioX,
          tick: { outer: false, centered: true }
        },
        y: {
          tick: {
            outer: false
          }
        }
      }
    })
  }

  const { translate, salary, department } = props

  const { monthShow, organizationalUnits, salaryChartData } = props
  const { unit } = state

  let dataChart = {}
  let filterSalary = {
    nameOfUnit: [],
    salaryOfMonth: []
  }
  if (salaryChartData?.length != 0) {
    if (organizationalUnits?.length) {
      organizationalUnits.map((i) => {
        let index = salaryChartData?.idSalaryTypePurchase?.indexOf(i)

        filterSalary.nameOfUnit.push(salaryChartData?.nameOfUnit[index])
        filterSalary.salaryOfMonth.push(salaryChartData?.salaryOfMonth[index])
      })
    }
  }
  console.log('filterSalary', filterSalary)
  if (filterSalary) {
    console.log('filterSalary', filterSalary)
    let dataNew = []
    if (filterSalary?.salaryOfMonth.length > 0) {
      filterSalary.salaryOfMonth.map((i) => {
        if (state?.unit) {
          dataNew.push(i / 1000000000)
        } else {
          dataNew.push(i / 1000000)
        }
      })
    }
    dataChart = {
      nameData: 'Thu nhập',
      ratioX: filterSalary.nameOfUnit,
      data1: dataNew
    }
  }

  const showDetailSalary = () => {
    Swal.fire({
      icon: 'question',
      html: `<h3 style="color: red"><div>Biểu đồ thu nhập được tính như sau:</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <ul>
                <li>Lương chính (Lương cơ bản)</b></li>
                <li>Các khoản lương thưởng, phụ cấp,...vv</li>
            </ul>`,
      width: '50%'
    })
  }
  useEffect(() => {
    if (dataChart) {
      renderChart(dataChart)
    }
  }, [dataChart])

  return (
    <React.Fragment>
      <div className='box box-solid' style={{ paddingBottom: 20 }}>
        <div className='box-header with-border'>
          <a title={'Giải thích'} onClick={showDetailSalary}>
            <i className='fa fa-question-circle' style={{ cursor: 'pointer' }} />
          </a>
        </div>
        {salary.isLoading ? (
          <div style={{ marginLeft: '5px' }}>{translate('general.loading')}</div>
        ) : (
          <div className='box-body'>
            <div className='box-tools pull-right'>
              <div className='btn-group pull-right'>
                <button
                  type='button'
                  className={`btn btn-xs ${unit ? 'active' : 'btn-danger'}`}
                  onClick={() => handleChangeUnitChart(false)}
                >
                  Triệu
                </button>
                <button
                  type='button'
                  className={`btn btn-xs ${unit ? 'btn-danger' : 'active'}`}
                  onClick={() => handleChangeUnitChart(true)}
                >
                  Tỷ
                </button>
              </div>
              <p className='pull-right' style={{ marginBottom: 0, marginRight: 10 }}>
                {' '}
                <b> ĐV tính</b>
              </p>
            </div>
            <div ref={salaryChart}></div>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}

function mapState(state) {
  const { salary, department } = state
  return { salary, department }
}

const salaryOfOrganizationalUnits = connect(mapState, null)(withTranslate(SalaryOfOrganizationalUnitsChart))
export { salaryOfOrganizationalUnits as SalaryOfOrganizationalUnitsChart }
