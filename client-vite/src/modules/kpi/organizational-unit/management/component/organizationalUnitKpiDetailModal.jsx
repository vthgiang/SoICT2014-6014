import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import parse from 'html-react-parser'

import { managerActions } from '../redux/actions'

import { DialogModal } from '../../../../../common-components/index'

import { ExportExcel, SlimScroll } from '../../../../../common-components'

function ModalDetailKPI(props) {
  const [state, setState] = useState({
    content: '',
    listKpiId: 'list-kpi',
    detailKpiId: 'detail-kpi'
  })

  let listchildtarget, detailExportData
  const { managerKpiUnit, translate } = props
  const { content, listKpiId, detailKpiId } = state

  useEffect(() => {
    SlimScroll.removeVerticalScrollStyleCSS(listKpiId)
    SlimScroll.addVerticalScrollStyleCSS(listKpiId, 450, true)

    SlimScroll.removeVerticalScrollStyleCSS(detailKpiId)
    SlimScroll.addVerticalScrollStyleCSS(detailKpiId, 550, true)
  })

  useEffect(() => {
    setState({
      ...state,
      id: props.id,
      idkpiunit: props.idkpiunit,
      date: props.date
    })
    props.getChildTarget(props.id, null)
  }, [props.id])

  const handleChangeContent = async (id) => {
    await setState({
      ...state,
      content: id
    })
  }

  function formatMonth(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [month, year].join('-')
  }

  /**Chuyển đổi dữ liệu 1 KPI đơn vị thành dữ liệu export to file excel */
  const convertDataToDetailExportData = (data, date) => {
    let fileName = 'Thông tin chi tiết KPI đơn vị '
    if (date) {
      let d = new Date(date),
        month = d.getMonth() + 1,
        year = d.getFullYear()
      fileName += 'tháng ' + month + '-' + year + '_'
    }

    let unitKpiData = [],
      detailData

    if (data) {
      fileName += data.name
      //Component excel nhận truyền vào là dữ liệu dạng mảng
      let dataObject = {
        unitKpiName: data.name,
        unitKpiCriteria: data.criteria,
        unitKpiWeight: parseInt(data.weight),
        automaticPoint: data.automaticPoint === null ? 'Chưa đánh giá' : parseInt(data.automaticPoint),
        employeePoint: data.employeePoint === null ? 'Chưa đánh giá' : parseInt(data.employeePoint),
        approverPoint: data.approvedPoint === null ? 'Chưa đánh giá' : parseInt(data.approvedPoint)
      }
      unitKpiData.push(dataObject)
    }

    if (data.arrtarget) {
      detailData = data.arrtarget.map((x, index) => {
        let creatorName = x.creator.name
        let creatorEmail = x.creator.email
        let targetName = x.target.name
        let unitName = x.organizationalUnit.name
        let criteria = x.target.criteria
        let result = x.target.approvedPoint

        return {
          STT: index + 1,
          creatorName: creatorName,
          creatorEmail: creatorEmail,
          targetName: targetName,
          unitName: unitName,
          criteria: criteria,
          result: result
        }
      })
    }

    let exportData = {
      fileName: fileName,
      dataSheets: [
        {
          sheetName: 'sheet1',
          sheetTitle: fileName,
          tables: [
            {
              tableName: 'Thông tin chung KPI ' + unitKpiData[0].unitKpiName,
              columns: [
                { key: 'unitKpiName', value: 'Tên KPI đơn vị' },
                { key: 'unitKpiCriteria', value: 'Tiêu chí đánh giá' },
                { key: 'unitKpiWeight', value: 'Trọng số (/100)' },
                { key: 'automaticPoint', value: 'Điểm KPI tự động' },
                { key: 'employeePoint', value: 'Điểm KPI tự đánh giá' },
                { key: 'approverPoint', value: 'Điểm KPI được phê duyệt' }
              ],
              data: unitKpiData
            },
            {
              tableName: 'Danh sách KPI con của KPI ' + unitKpiData[0].unitKpiName,
              columns: [
                { key: 'STT', value: 'STT' },
                { key: 'creatorName', value: 'Người tạo' },
                { key: 'creatorEmail', value: 'Email người tạo' },
                { key: 'targetName', value: 'Tên mục tiêu' },
                { key: 'unitName', value: 'Đơn vị' },
                { key: 'criteria', value: 'Tiêu chí đánh giá' },
                { key: 'result', value: 'Kết quả đánh giá' }
              ],
              data: detailData
            }
          ]
        }
      ]
    }
    return exportData
  }

  const handleSetPointKPI = () => {
    let kpiUnitSet = props.id
    let date = props.date

    props.calculateKPIUnit([kpiUnitSet], date)
  }

  if (managerKpiUnit.childtarget) {
    listchildtarget = managerKpiUnit.childtarget
  }

  if (content && listchildtarget) {
    let data = listchildtarget.filter((item) => item._id === content)
    detailExportData = data && data.length ? convertDataToDetailExportData(data[0], props.date) : []
  }
  return (
    <DialogModal
      modalID={`dataResultTask`}
      title={translate('kpi.organizational_unit.management.detail_modal.title') + `${formatMonth(props.date)}`}
      hasSaveButton={false}
      size={100}
    >
      {/* Danh sách mục tiêu của KPI đơn vị tháng được chọn */}
      <div className='col-xs-12 col-sm-4'>
        <div className='form-group'>
          <button className='btn btn-success' style={{ width: '100%' }} onClick={() => handleSetPointKPI()}>
            {translate('kpi.evaluation.employee_evaluation.calc_kpi_point')}
          </button>
        </div>
        <div className='box box-solid' style={{ border: '1px solid #ecf0f6', borderBottom: 'none' }}>
          <div className='box-header with-border'>
            <h3 className='box-title' style={{ fontWeight: 800 }}>
              {translate('kpi.organizational_unit.management.detail_modal.list_kpi_unit')}
            </h3>
          </div>
          <div id={listKpiId} className='box-body no-padding'>
            <ul className='nav nav-pills nav-stacked'>
              {listchildtarget &&
                listchildtarget.map((item, index) => (
                  <li key={index} className={state.content === item._id ? 'active' : undefined}>
                    <a href='#abc' onClick={() => handleChangeContent(item._id)}>
                      {item.name}
                      <span className='label label-primary pull-right'>{item.arrtarget.length}</span>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      <div className='col-xs-12 col-sm-8'>
        {/* Thông tin chi tiết mục tiêu KPI đơn vị được chọn */}
        {listchildtarget &&
          listchildtarget.map((item) => {
            if (item._id === state.content)
              return (
                <div id={detailKpiId} key={item._id}>
                  <h4>{translate('kpi.organizational_unit.management.detail_modal.information_kpi') + `"${item.name}"`}</h4>
                  <div style={{ lineHeight: 2 }}>
                    <div>
                      <label>{translate('kpi.organizational_unit.management.detail_modal.criteria')}</label>
                      <span> {parse(item.criteria)}</span>
                    </div>

                    <div>
                      <label>{translate('kpi.organizational_unit.management.detail_modal.weight')}</label>
                      <span> {item.weight}/100</span>
                    </div>
                    <div>
                      <label>{translate('kpi.organizational_unit.management.detail_modal.point_field')}:</label>
                      <span>
                        {' '}
                        {item.approvedPoint === null
                          ? translate('kpi.organizational_unit.management.detail_modal.not_eval')
                          : item.automaticPoint + '-' + item.employeePoint + '-' + item.approvedPoint}
                      </span>
                    </div>
                  </div>
                  <div className='form-inline pull-right'>
                    <div className='form-group'>
                      {detailExportData && (
                        <ExportExcel id='export-unit-kpi-management-detail-kpi' exportData={detailExportData} style={{ marginLeft: 5 }} />
                      )}
                    </div>
                  </div>
                  <br />
                  <br />
                  {/* Danh sách các mục tiêu con của mục tiêu KPI đơn vị được chọn */}
                  <h4>{translate('kpi.organizational_unit.management.detail_modal.list_child_kpi')}</h4>
                  <div>
                    <table id='example1' className='table table-bordered table-striped'>
                      <thead>
                        <tr>
                          <th style={{ width: '50px' }} className='col-fixed'>
                            {translate('kpi.organizational_unit.management.detail_modal.index')}
                          </th>
                          <th>{translate('kpi.organizational_unit.management.detail_modal.target_name')}</th>
                          <th style={{ width: '108px' }}>{translate('kpi.organizational_unit.management.detail_modal.creator')}</th>
                          <th>{translate('kpi.organizational_unit.management.detail_modal.organization_unit')}</th>
                          <th>{translate('kpi.organizational_unit.management.detail_modal.criteria')}</th>
                          <th>{translate('kpi.organizational_unit.management.detail_modal.result')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item && item.arrtarget ? (
                          item.arrtarget.map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{data.target.name}</td>
                              <td>{data.creator.name}</td>
                              <td>{data.organizationalUnit.name}</td>
                              <td>{parse(data.target.criteria)}</td>
                              <td>{data.target.approvedPoint}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6}>{translate('kpi.organizational_unit.management.detail_modal.no_data')}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            return true
          })}
      </div>
    </DialogModal>
  )
}
function mapState(state) {
  const { managerKpiUnit } = state
  return { managerKpiUnit }
}

const actionCreators = {
  getChildTarget: managerActions.getChildTargetOfCurrentTarget,
  calculateKPIUnit: managerActions.calculateKPIUnit
}
const connectedModalDetailKPI = connect(mapState, actionCreators)(withTranslate(ModalDetailKPI))
export { connectedModalDetailKPI as ModalDetailKPI }
