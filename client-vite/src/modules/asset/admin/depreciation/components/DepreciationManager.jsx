import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DataTableSetting, DatePicker, PaginateBar, SelectMulti, ExportExcel, TreeSelect } from '../../../../../common-components'

import { AssetManagerActions } from '../../asset-information/redux/actions'
import { AssetTypeActions } from '../../asset-type/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'

import { AssetDetailForm, AssetEditForm } from '../../asset-information/components/combinedContent'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

function DepreciationManager(props) {
  const tableId_constructor = 'table-depreciation-manager'
  const defaultConfig = { limit: 5 }
  const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit

  const [state, setState] = useState({
    tableId: tableId_constructor,
    code: '',
    assetName: '',
    assetType: null,
    month: '',
    page: 0,
    limit: limit_constructor,
    managedBy: props.managedBy ? props.managedBy : '',
    getType: 'depreciation'
  })

  const { translate, assetsManager, assetType } = props
  const { page, limit, currentRowView, currentRow, managedBy, tableId } = state

  useEffect(() => {
    props.getAssetTypes()
    props.getAllAsset(state)
    props.getListBuildingAsTree()
  }, [])

  // Bắt sự kiện click xem thông tin tài sản
  const handleView = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRowView: value
      }
    })
    window.$('#modal-view-asset').modal('show')
  }

  // Function format ngày hiện tại thành dạnh mm-yyyy
  const formatDate2 = (date) => {
    if (!date) return null
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) {
      month = `0${month}`
    }

    if (day.length < 2) {
      day = `0${day}`
    }

    return [month, year].join('-')
  }

  // Function format dữ liệu Date thành string
  const formatDate = (date, monthYear = false) => {
    if (!date) return null
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) {
      month = `0${month}`
    }

    if (day.length < 2) {
      day = `0${day}`
    }

    if (monthYear === true) {
      return [month, year].join('-')
    }
    return [day, month, year].join('-')
  }

  // Bắt sự kiện click xem thông tin tài sản
  // handleView = async (value) => {
  //     await setState(state => {
  //         return {
  //             currentRowView: value
  //         }
  //     });
  //     window.$('#modal-view-asset').modal('show');
  // }

  // Function lưu giá trị mã tài sản vào state khi thay đổi
  const handleCodeChange = (event) => {
    const { name, value } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  // Function lưu giá trị tên tài sản vào state khi thay đổi
  const handleAssetNameChange = (event) => {
    const { name, value } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  // Function lưu giá trị tháng bắt đầu khấu hao vào state khi thay đổi
  const handleMonthStartChange = (value) => {
    setState({
      ...state,
      startDepreciation: value
    })
  }

  // Function lưu loại khấu hao
  const handleDepreciationTypeChange = (value) => {
    setState({
      ...state,
      depreciationType: value
    })
  }

  // Function lưu giá trị loại tài sản vào state khi thay đổi
  const handleAssetTypeChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState({
      ...state,
      assetType: value
    })
  }

  // Bắt sự kiện thay đổi nhóm tài sản
  const handleGroupChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState({
      ...state,
      group: value
    })
  }

  // Function bắt sự kiện tìm kiếm
  const handleSubmitSearch = async () => {
    await setState({
      ...state,
      page: 0
    })
    props.getAllAsset(state)
  }

  // Bắt sự kiện setting số dòng hiện thị trên một trang
  const setLimit = async (number) => {
    const limit = parseInt(number)
    await setState({
      ...state,
      limit
    })
    props.getAllAsset({ ...state, limit })
  }

  // Bắt sự kiện chuyển trang
  const setPage = async (pageNumber) => {
    const page = (pageNumber - 1) * state.limit

    await setState({
      ...state,
      page: parseInt(page)
    })

    props.getAllAsset({ ...state, page })
  }

  const addMonth = (date, month) => {
    date = new Date(date)
    const newDate = new Date(date.setMonth(date.getMonth() + month))

    return formatDate(newDate)
  }

  /* Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
  const convertDataToExportData = (data) => {
    const { translate } = props
    const fileName = 'Bảng quản lý khấu hao tài sản '
    const formater = new Intl.NumberFormat()
    if (data) {
      data = data.map((x, index) => {
        const { code } = x
        const { assetName } = x
        const type = x.assetType && x.assetType.map((obj) => obj.typeName).join(', ')
        const cost = formater.format(parseInt(x.cost))
        const startDepreciation = formatDate(x.startDepreciation)
        const month = `${x.usefulLife} ${translate('general.month')}`
        const depreciationPerYear = formater.format(parseInt(12 * (x.cost / x.usefulLife)))
        const depreciationPerMonth = formater.format(parseInt(x.cost / x.usefulLife))
        const accumulatedValue = formater.format(
          parseInt(
            (x.cost / x.usefulLife) *
              (new Date().getFullYear() * 12 +
                new Date().getMonth() -
                (new Date(x.startDepreciation).getFullYear() * 12 + new Date(x.startDepreciation).getMonth()))
          )
        )
        const remainingValue = formater.format(
          parseInt(
            x.cost -
              (x.cost / x.usefulLife) *
                (new Date().getFullYear() * 12 +
                  new Date().getMonth() -
                  (new Date(x.startDepreciation).getFullYear() * 12 + new Date(x.startDepreciation).getMonth()))
          )
        )
        const endDepreciation = addMonth(x.startDepreciation, x.usefulLife)

        return {
          index: index + 1,
          code,
          assetName,
          type,
          cost,
          startDepreciation,
          month,
          depreciationPerYear,
          depreciationPerMonth,
          accumulatedValue,
          remainingValue,
          endDepreciation
        }
      })
    }

    const exportData = {
      fileName,
      dataSheets: [
        {
          sheetName: 'sheet1',
          sheetTitle: fileName,
          tables: [
            {
              rowHeader: 2,
              columns: [
                { key: 'index', value: 'STT' },
                { key: 'code', value: 'Mã tài sản' },
                { key: 'assetName', value: 'Tên tài sản' },
                { key: 'type', value: 'Loại tài sản' },
                { key: 'cost', value: 'Nguyên giá (VNĐ)' },
                { key: 'startDepreciation', value: 'Thời gian bắt đầu trích khấu hao' },
                { key: 'month', value: 'Thời gian trích khấu hao' },
                { key: 'depreciationPerYear', value: 'Mức độ khấu hao trung bình hàng năm' },
                { key: 'depreciationPerMonth', value: 'Mức độ khấu hao trung bình hàng tháng' },
                { key: 'accumulatedValue', value: 'Giá trị hao mòn lũy kế' },
                { key: 'remainingValue', value: 'Giá trị còn lại' },
                { key: 'endDepreciation', value: 'Thời gian kết thúc trích khấu hao' }
              ],
              data
            }
          ]
        }
      ]
    }
    return exportData
  }

  /**
   * Hàm để tính các giá trị khấu hao cho tài sản
   * @param {*} depreciationType Phương pháp khấu hao
   * @param {*} cost Nguyên giá
   * @param {*} usefulLife Thời gian trích khấu hao
   * @param {*} startDepreciation Thời gian bắt đầu trích khấu hao
   * @param {*} estimatedTotalProduction Sản lượng theo công suất thiết kế (trong 1 năm)
   * @param {*} unitsProducedDuringTheYears Sản lượng sản phẩm trong các tháng
   */
  const calculateDepreciation = (
    depreciationType,
    cost,
    usefulLife,
    estimatedTotalProduction,
    unitsProducedDuringTheYears,
    startDepreciation
  ) => {
    let annualDepreciation = 0
    let monthlyDepreciation = 0
    let remainingValue = cost

    if (depreciationType === 'straight_line') {
      // Phương pháp khấu hao theo đường thẳng
      annualDepreciation = (12 * cost) / usefulLife
      monthlyDepreciation = cost / usefulLife
      remainingValue =
        cost -
        (cost / usefulLife) *
          (new Date().getFullYear() * 12 +
            new Date().getMonth() -
            (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth()))
    } else if (depreciationType === 'declining_balance') {
      // Phương pháp khấu hao theo số dư giảm dần
      let lastYears = false
      let t
      const usefulYear = usefulLife / 12
      const usedTime =
        new Date().getFullYear() * 12 +
        new Date().getMonth() -
        (new Date(startDepreciation).getFullYear() * 12 + new Date(startDepreciation).getMonth())

      if (usefulYear < 4) {
        t = (1 / usefulYear) * 1.5
      } else if (usefulYear >= 4 && usefulYear <= 6) {
        t = (1 / usefulYear) * 2
      } else if (usefulYear > 6) {
        t = (1 / usefulYear) * 2.5
      }

      // Tính khấu hao đến năm hiện tại
      for (let i = 1; i <= usedTime / 12; i++) {
        if (!lastYears) {
          if (remainingValue * t > remainingValue / (usefulYear - i + 1)) {
            annualDepreciation = remainingValue * t
          } else {
            annualDepreciation = remainingValue / (usefulYear - i + 1)
            lastYears = true
          }
        }

        remainingValue -= annualDepreciation
      }

      // Tính khấu hao đến tháng hiện tại
      if (usedTime % 12 !== 0) {
        if (!lastYears) {
          if (remainingValue * t > remainingValue / (usefulYear - Math.floor(usedTime / 12))) {
            annualDepreciation = remainingValue * t
          } else {
            annualDepreciation = remainingValue / (usefulYear - Math.floor(usedTime / 12))
            lastYears = true
          }
        }

        monthlyDepreciation = annualDepreciation / 12
        remainingValue -= monthlyDepreciation * (usedTime % 12)
      }
    } else if (depreciationType === 'units_of_production') {
      // Phương pháp khấu hao theo sản lượng
      const monthTotal = unitsProducedDuringTheYears.length // Tổng số tháng tính khấu hao
      const productUnitDepreciation = cost / (estimatedTotalProduction * (usefulLife / 12)) // Mức khấu hao đơn vị sản phẩm
      let accumulatedDepreciation = 0 // Giá trị hao mòn lũy kế

      for (let i = 0; i < monthTotal; i++) {
        accumulatedDepreciation += unitsProducedDuringTheYears[i].unitsProducedDuringTheYear * productUnitDepreciation
      }

      remainingValue = cost - accumulatedDepreciation
      annualDepreciation = monthTotal ? (accumulatedDepreciation * 12) / monthTotal : 0
    }

    return [parseInt(annualDepreciation), parseInt(annualDepreciation / 12), parseInt(remainingValue)]
  }

  // Bắt sự kiện click chỉnh sửa thông tin tài sản
  const handleEditAsset = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRow: value
      }
    })
    window.$('#modal-edit-asset').modal('show')

    // Mở tab thứ 2
    window.$('#modal-edit-asset').on('shown.bs.modal', function () {
      window.$('#nav-tabs li:eq(1) a').tab('show')
    })
  }
  // Lấy danh sách loại tài sản cho tree select
  const getAssetTypes = () => {
    const { assetType } = props
    const assetTypeName = assetType && assetType.listAssetTypes
    const typeArr = []
    assetTypeName.map((item) => {
      typeArr.push({
        _id: item._id,
        id: item._id,
        name: item.typeName,
        parent: item.parent ? item.parent._id : null
      })
    })
    return typeArr
  }

  const convertGroupAsset = (group) => {
    const { translate } = props

    if (group === 'building') {
      return translate('asset.asset_info.building')
    }
    if (group === 'vehicle') {
      return translate('asset.asset_info.vehicle')
    }
    if (group === 'machine') {
      return translate('asset.asset_info.machine')
    }
    return translate('asset.asset_info.other')
  }

  let lists = ''
  let exportData
  const typeArr = getAssetTypes()
  const assetTypeName = state.assetType ? state.assetType : []

  const formater = new Intl.NumberFormat()
  if (assetsManager.isLoading === false) {
    lists = assetsManager.listAssets
  }

  const pageTotal =
    assetsManager.totalList % limit === 0 ? parseInt(assetsManager.totalList / limit) : parseInt(assetsManager.totalList / limit + 1)
  const currentPage = parseInt(page / limit + 1)
  if (lists) {
    exportData = convertDataToExportData(lists)
  }

  return (
    <div className='box'>
      <div className='box-body qlcv'>
        {/* Thanh tìm kiếm */}
        <div className='form-inline'>
          {/* Mã tài sản */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.asset_code')}</label>
            <input
              type='text'
              className='form-control'
              name='code'
              onChange={handleCodeChange}
              placeholder={translate('asset.general_information.asset_code')}
              autoComplete='off'
            />
          </div>

          {/* Tên tài sản */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.asset_name')}</label>
            <input
              type='text'
              className='form-control'
              name='assetName'
              onChange={handleAssetNameChange}
              placeholder={translate('asset.general_information.asset_name')}
              autoComplete='off'
            />
          </div>
        </div>

        <div className='form-inline'>
          {/* Nhóm tài sản */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.asset_group')}</label>
            <SelectMulti
              id='multiSelectGroupInManagement'
              multiple='multiple'
              options={{
                nonSelectedText: translate('asset.asset_info.select_group'),
                allSelectedText: translate('asset.general_information.select_all_group')
              }}
              onChange={handleGroupChange}
              items={[
                { value: 'building', text: translate('asset.dashboard.building') },
                { value: 'vehicle', text: translate('asset.asset_info.vehicle') },
                { value: 'machine', text: translate('asset.dashboard.machine') },
                { value: 'other', text: translate('asset.dashboard.other') }
              ]}
            />
          </div>

          {/* Phân loại */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.asset_type')}</label>
            <TreeSelect data={typeArr} value={assetTypeName} handleChange={handleAssetTypeChange} mode='hierarchical' />
          </div>
        </div>
        <div className='form-inline' style={{ marginBottom: 10 }}>
          {/* Loại khấu hao */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.depreciation_type')}</label>
            <SelectMulti
              id='multiSelectDepreTypeInManagement'
              multiple='multiple'
              options={{
                nonSelectedText: translate('asset.depreciation.select_depreciation_type'),
                allSelectedText: translate('asset.depreciation.select_all_depreciation_type')
              }}
              onChange={handleDepreciationTypeChange}
              items={[
                { value: 'straight_line', text: translate('asset.depreciation.line') },
                { value: 'declining_balance', text: translate('asset.depreciation.declining_balance') },
                { value: 'units_of_production', text: translate('asset.depreciation.units_production') }
              ]}
            />
          </div>

          {/* Tháng bắt đầu trích khấu hao */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.start_depreciation')}</label>
            <DatePicker
              id='month-start-depreciation'
              dateFormat='month-year'
              // value={formatDate2(Date.now())}
              onChange={handleMonthStartChange}
            />
          </div>

          {/* Button tìm kiếm */}
          <div className='form-group'>
            <button
              type='button'
              className='btn btn-success'
              title={translate('asset.general_information.search')}
              onClick={() => handleSubmitSearch()}
            >
              {translate('asset.general_information.search')}
            </button>
          </div>
          {exportData && <ExportExcel id='export-asset-depreciation-management' exportData={exportData} style={{ marginRight: 10 }} />}
        </div>

        {/* Bảng thông tin khấu hao */}
        <table id={tableId} className='table table-striped table-bordered table-hover'>
          <thead>
            <tr>
              <th style={{ width: '8%' }}>{translate('asset.general_information.asset_code')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.asset_name')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.asset_group')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.asset_type')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.original_price')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.start_depreciation')}</th>
              <th style={{ width: '10%' }}>{translate('asset.depreciation.depreciation_time')}</th>
              <th style={{ width: '10%' }}>{translate('asset.asset_info.annual_depreciation')}</th>
              <th style={{ width: '10%' }}>{translate('asset.asset_info.monthly_depreciation')}</th>
              <th style={{ width: '10%' }}>{translate('asset.depreciation.accumulated_value')}</th>
              <th style={{ width: '10%' }}>{translate('asset.depreciation.remaining_value')}</th>
              <th style={{ width: '10%' }}>{translate('asset.general_information.end_depreciation')}</th>
              <th style={{ width: '120px', textAlign: 'center' }}>
                {translate('asset.general_information.action')}
                <DataTableSetting
                  tableId={tableId}
                  columnArr={[
                    translate('asset.general_information.asset_code'),
                    translate('asset.general_information.asset_name'),
                    translate('asset.general_information.asset_group'),
                    translate('asset.general_information.asset_type'),
                    translate('asset.general_information.original_price'),
                    translate('asset.general_information.start_depreciation'),
                    translate('asset.depreciation.depreciation_time'),
                    translate('asset.asset_info.annual_depreciation'),
                    translate('asset.asset_info.monthly_depreciation'),
                    translate('asset.depreciation.accumulated_value'),
                    translate('asset.depreciation.remaining_value'),
                    translate('asset.general_information.end_depreciation')
                  ]}
                  setLimit={setLimit}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {lists
              ? lists.map((x, index) => {
                  const result = calculateDepreciation(
                    x.depreciationType,
                    x.cost,
                    x.usefulLife,
                    x.estimatedTotalProduction,
                    x.unitsProducedDuringTheYears,
                    x.startDepreciation
                  )
                  return (
                    <tr key={index}>
                      <td>
                        <a onClick={() => handleEditAsset(x)}>{x.code}</a>
                      </td>
                      <td>{x.assetName}</td>
                      <td>{convertGroupAsset(x.group)}</td>
                      <td>
                        {x.assetType && x.assetType.length
                          ? x.assetType.map((item, index) => {
                              const suffix = index < x.assetType.length - 1 ? ', ' : ''
                              return item.typeName + suffix
                            })
                          : ''}
                      </td>
                      <td>{formater.format(parseInt(x.cost))} VNĐ</td>
                      <td>{formatDate(x.startDepreciation)}</td>
                      <td>
                        {x.usefulLife} {translate('training.course.month')}
                      </td>
                      <td>
                        {formater.format(result[0])} VNĐ/{translate('training.course.year')}
                      </td>
                      <td>
                        {formater.format(result[1])} VNĐ/{translate('training.course.month')}
                      </td>
                      <td>{formater.format(x.cost - result[2])} VNĐ</td>
                      <td>{formater.format(result[2])} VNĐ</td>
                      <td>{addMonth(x.startDepreciation, x.usefulLife)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <a onClick={() => handleView(x)} style={{ width: '5px' }} title={translate('asset.general_information.view')}>
                          <i className='material-icons'>view_list</i>
                        </a>
                      </td>
                    </tr>
                  )
                })
              : null}
          </tbody>
        </table>
        {assetsManager.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (!lists || lists.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}

        {/* PaginateBar */}
        <PaginateBar pageTotal={pageTotal || 0} currentPage={currentPage} func={setPage} />
      </div>

      {/* Form xem chi tiết thông tin khấu hao */}
      {currentRowView && (
        <AssetDetailForm
          _id={currentRowView._id}
          avatar={currentRowView.avatar}
          code={currentRowView.code}
          assetName={currentRowView.assetName}
          serial={currentRowView.serial}
          assetType={currentRowView.assetType}
          purchaseDate={currentRowView.purchaseDate}
          warrantyExpirationDate={currentRowView.warrantyExpirationDate}
          managedBy={currentRowView.managedBy}
          assignedToUser={currentRowView.assignedToUser}
          assignedToOrganizationalUnit={currentRowView.assignedToOrganizationalUnit}
          handoverFromDate={currentRowView.handoverFromDate}
          handoverToDate={currentRowView.handoverToDate}
          location={currentRowView.location}
          description={currentRowView.description}
          status={currentRowView.status}
          typeRegisterForUse={currentRowView.typeRegisterForUse}
          detailInfo={currentRowView.detailInfo}
          cost={currentRowView.cost}
          residualValue={currentRowView.residualValue}
          startDepreciation={currentRowView.startDepreciation}
          usefulLife={currentRowView.usefulLife}
          estimatedTotalProduction={currentRowView.estimatedTotalProduction}
          unitsProducedDuringTheYears={currentRowView.unitsProducedDuringTheYears}
          depreciationType={currentRowView.depreciationType}
          maintainanceLogs={currentRowView.maintainanceLogs}
          usageLogs={currentRowView.usageLogs}
          incidentLogs={currentRowView.incidentLogs}
          disposalDate={currentRowView.disposalDate}
          disposalType={currentRowView.disposalType}
          disposalCost={currentRowView.disposalCost}
          disposalDesc={currentRowView.disposalDesc}
          archivedRecordNumber={currentRowView.archivedRecordNumber}
          files={currentRowView.files}
        />
      )}

      {/* Form chỉnh sửa thông tin tài sản */}
      {currentRow && (
        <AssetEditForm
          _id={currentRow._id}
          employeeId={managedBy}
          avatar={currentRow.avatar}
          code={currentRow.code}
          assetName={currentRow.assetName}
          serial={currentRow.serial}
          assetType={JSON.stringify(currentRow.assetType)}
          group={currentRow.group}
          purchaseDate={currentRow.purchaseDate}
          warrantyExpirationDate={currentRow.warrantyExpirationDate}
          managedBy={currentRow.managedBy}
          assignedToUser={currentRow.assignedToUser}
          assignedToOrganizationalUnit={currentRow.assignedToOrganizationalUnit}
          handoverFromDate={currentRow.handoverFromDate}
          handoverToDate={currentRow.handoverToDate}
          location={currentRow.location}
          description={currentRow.description}
          status={currentRow.status}
          typeRegisterForUse={currentRow.typeRegisterForUse}
          detailInfo={currentRow.detailInfo}
          readByRoles={currentRow.readByRoles}
          cost={currentRow.cost}
          residualValue={currentRow.residualValue}
          startDepreciation={currentRow.startDepreciation}
          usefulLife={currentRow.usefulLife}
          depreciationType={currentRow.depreciationType}
          estimatedTotalProduction={currentRow.estimatedTotalProduction}
          unitsProducedDuringTheYears={
            currentRow.unitsProducedDuringTheYears &&
            currentRow.unitsProducedDuringTheYears.map((x) => ({
              month: formatDate2(x.month),
              unitsProducedDuringTheYear: x.unitsProducedDuringTheYear
            }))
          }
          disposalDate={currentRow.disposalDate}
          disposalType={currentRow.disposalType}
          disposalCost={currentRow.disposalCost}
          disposalDesc={currentRow.disposalDesc}
          maintainanceLogs={currentRow.maintainanceLogs}
          usageLogs={currentRow.usageLogs}
          incidentLogs={currentRow.incidentLogs}
          archivedRecordNumber={currentRow.archivedRecordNumber}
          files={currentRow.documents}
          linkPage='management'
          page={page}
        />
      )}
    </div>
  )
}

function mapState(state) {
  const { assetsManager, assetType, user } = state
  return { assetsManager, assetType, user }
}

const actionCreators = {
  getAssetTypes: AssetTypeActions.getAssetTypes,
  getAllAsset: AssetManagerActions.getAllAsset,
  getListBuildingAsTree: AssetManagerActions.getListBuildingAsTree,
  getUser: UserActions.get
}

const connectedListDepreciation = connect(mapState, actionCreators)(withTranslate(DepreciationManager))
export { connectedListDepreciation as DepreciationManager }
