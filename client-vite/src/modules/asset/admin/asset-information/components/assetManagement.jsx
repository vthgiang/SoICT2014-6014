import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import qs from 'qs'
import Swal from 'sweetalert2'
import {
  DatePicker,
  DeleteNotification,
  PaginateBar,
  SelectMulti,
  ExportExcel,
  TreeSelect,
  SmartTable
} from '../../../../../common-components'

import { DepartmentActions } from '../../../../super-admin/organizational-unit/redux/actions'
import { AssetManagerActions } from '../redux/actions'
import { AssetTypeActions } from '../../asset-type/redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { RoleActions } from '../../../../super-admin/role/redux/actions'

import { AssetCreateForm, AssetDetailForm, AssetEditForm, AssetImportForm } from './combinedContent'
import { getFormatDateFromTime, getPropertyOfValue } from '../../../../../helpers/stringMethod'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'
import { AssetLotManagerActions } from '../../asset-lot/redux/actions'

const getAssetName = (listAsset, idAsset) => {
  let assetName
  if (listAsset?.length && idAsset) {
    for (let i = 0; i < listAsset.length; i++) {
      if (listAsset[i]?._id === idAsset) {
        assetName = `${listAsset[i].code} - ${listAsset[i].assetName}`
        break
      }
    }
  }
  return assetName
}

function AssetManagement(props) {
  const tableId_constructor = 'table-asset-manager'
  const defaultConfig = { limit: 5 }
  const limit_constructor = getTableConfiguration(tableId_constructor, defaultConfig).limit

  const [state, setState] = useState({
    tableId: tableId_constructor,
    code: '',
    assetName: '',
    purchaseDateStart: null,
    purchaseDateEnd: null,
    purchaseDate: null,
    disposalDate: null,
    status: window.location.search
      ? [qs.parse(window.location.search, { ignoreQueryPrefix: true }).status]
      : ['ready_to_use', 'in_use', 'broken', 'lost', 'disposed'],
    group: '',
    handoverUnit: '',
    handoverUser: '',
    typeRegisterForUse: ['1', '2', '3'],
    page: 0,
    limit: limit_constructor,
    managedBy: props.managedBy ? props.managedBy : '',
    assetLot: ''
  })

  const [advancedSearch, setAdvancedSearch] = useState(false)

  const [selectedData, setSelectedData] = useState()

  const onSelectedRowsChange = (value) => {
    setSelectedData(value)
  }

  const handleDeleteOptions = () => {
    const shortTitle = `<h4 style="color: red"><div>${translate('asset.general_information.delete_info')} "${selectedData?.length && selectedData.length === 1 ? getAssetName(props.assetsManager?.listAssets, selectedData[0]) : ''}" ?</div></h4>`
    const longTitle = `<h4 style="color: red"><div>Xóa thông tin ${selectedData?.length > 1 ? selectedData.length : ''} tài sản ?</div></h4>`

    Swal.fire({
      html: selectedData?.length === 1 ? shortTitle : longTitle,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: translate('general.no'),
      confirmButtonText: translate('general.yes')
    }).then((result) => {
      if (result.value && selectedData.length > 0) {
        props.deleteAsset({
          assetIds: selectedData
        })
      }
    })
  }

  const handleDeleteAnAsset = (id) => {
    props.deleteAsset({
      assetIds: [id]
    })
  }

  const { assetsManager, assetType, translate, user, isActive, department, assetLotManager } = props
  const {
    page,
    limit,
    currentRowView,
    status,
    currentRow,
    purchaseDateStart,
    purchaseDateEnd,
    purchaseDate,
    disposalDate,
    managedBy,
    location,
    tableId,
    group,
    typeRegisterForUse
  } = state
  const getAll = true
  useEffect(() => {
    props.getAllAsset(state)
    props.getAssetTypes()
    props.getListBuildingAsTree()
    props.getUser()
    props.getAllDepartments()
    props.getAllRoles()
    props.getAllAssetLots(getAll)
  }, [])

  // Function format ngày hiện tại thành dạnh mm-yyyy
  const formatDate2 = (date) => {
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
  const handleView = async (value) => {
    await setState({
      ...state,
      currentRowView: value
    })
    window.$('#modal-view-asset').modal('show')
  }

  // Bắt sự kiện click chỉnh sửa thông tin tài sản
  const handleEdit = async (value) => {
    await setState((state) => {
      return {
        ...state,
        currentRow: value
      }
    })
    window.$('#modal-edit-asset').modal('show')
  }

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

  // Function lưu giá trị tháng vào state khi thay đổi
  const handlePurchaseMonthStartChange = async (value) => {
    if (!value) {
      value = null
    }

    await setState({
      ...state,
      purchaseDateStart: value
    })
  }

  // Function lưu giá trị tháng vào state khi thay đổi
  const handlePurchaseMonthEndChange = async (value) => {
    if (!value) {
      value = null
    }

    await setState({
      ...state,
      purchaseDateEnd: value
    })
  }

  // Function lưu giá trị tháng vào state khi thay đổi
  const handlePurchaseMonthChange = async (value) => {
    if (!value) {
      value = null
    }

    await setState({
      ...state,
      purchaseDate: value
    })
  }

  // Function lưu giá trị tháng vào state khi thay đổi
  const handleDisposalMonthChange = async (value) => {
    if (!value) {
      value = null
    }

    await setState({
      ...state,
      disposalDate: value
    })
  }

  // Function lưu giá trị loại tài sản vào state khi thay đổi
  const handleAssetTypeChange = (value) => {
    setState((state) => {
      return {
        ...state,
        assetType: value.length !== 0 ? JSON.stringify(value) : null
      }
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

  // Function lưu giá trị status vào state khi thay đổi
  const handleStatusChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState({
      ...state,
      status: value
    })
  }

  // Function lưu giá trị vị trí vào state khi thay đổi
  const handleLocationChange = async (value) => {
    await setState((state) => {
      return {
        ...state,
        location: value.length !== 0 ? value[0] : null
      }
    })
  }

  // Function lưu giá trị quyền đăng kí vào state khi thay đổi
  const handleTypeRegisterForUseChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState({
      ...state,
      typeRegisterForUse: value
    })
  }

  // Function lưu giá trị người sử dụng vào state khi thay đổi
  const handleHandoverUserChange = (event) => {
    const { name, value } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  // Function lưu giá trị đơn vị sử dụng vào state khi thay đổi
  const handleHandoverUnitChange = (value) => {
    if (value.length === 0) {
      value = null
    }

    setState({
      ...state,
      handoverUnit: value
    })
  }

  // Function lưu giá trị lô tài sản vào state khi thay đổi
  const handleAssetLotChange = (event) => {
    const { value } = event.target
    setState({
      ...state,
      assetLot: value
    })
  }

  // Function bắt sự kiện tìm kiếm
  const handleSubmitSearch = async () => {
    await setState({
      ...state,
      page: 0
    })
    props.getAllAsset({ page: 0, ...state })
  }

  const handleAdvancedSearch = () => {
    setAdvancedSearch(!advancedSearch)
  }

  // Bắt sự kiện setting số dòng hiện thị trên một trang
  const setLimit = async (number) => {
    await setState({
      ...state,
      limit: parseInt(number)
    })
    props.getAllAsset({ ...state, limit: parseInt(number) })
  }

  // Bắt sự kiện chuyển trang
  const setPage = async (pageNumber) => {
    const page = (pageNumber - 1) * state.limit
    await setState({
      ...state,
      page: parseInt(page)
    })

    props.getAllAsset({ ...state, page: parseInt(page) })
  }

  const getAssetTypesList = (types) => {
    const list = types.reduce((list, cur) => {
      return list ? `${list}, ${cur.typeName}` : cur.typeName
    }, '')
    return list
  }

  const getNumber = (number) => {
    return number || ''
  }

  const getAssetDepreciationType = (type) => {
    const { translate } = props
    switch (type) {
      case 'straight_line':
        return translate('asset.depreciation.line')
      case 'declining_balance':
        return translate('asset.depreciation.declining_balance')
      case 'units_of_production':
        return translate('asset.depreciation.units_production')
      default:
        return ''
    }
  }

  const getIncidentType = (type) => {
    const { translate } = props
    if (Number(type) === 1) {
      return translate('asset.general_information.damaged')
    }
    if (Number(type) === 2) {
      return translate('asset.general_information.lost')
    }
    return null
  }

  const getIncidentStatus = (status) => {
    const { translate } = props
    if (Number(status) === 1) {
      return translate('asset.general_information.waiting')
    }
    if (Number(status) === 2) {
      return translate('asset.general_information.processed')
    }
    return null
  }

  const gettDisposalType = (type) => {
    const { translate } = props

    if (type === '1') {
      return translate('asset.asset_info.destruction')
    }
    if (type === '2') {
      return translate('asset.asset_info.sale')
    }
    if (type === '3') {
      return translate('asset.asset_info.give')
    }
    return ''
  }

  const getCostNumber = (number) => {
    if (!number) return ''
    return new Intl.NumberFormat().format(number)
  }

  const convertDataToExportData = (data, assettypelist, userlist) => {
    const organizationalUnitList = props.department.list
    const fileName = 'File export tài sản'
    let length = 0
    let exportThongTinChung = []
    let exportKhauHao = []
    let exportSuDung = []
    let exportSuCo = []
    let exportBaoTriSuaChua = []
    let exportThanhLy = []

    if (data) {
      data.forEach((x, index) => {
        // Dữ liệu tab thông tin chung
        const { code } = x
        const name = x.assetName
        const { description } = x
        const group = convertGroupAsset(x.group)
        const type = x.assetType && getAssetTypesList(x.assetType)
        const purchaseDate = getFormatDateFromTime(x.purchaseDate, 'dd-mm-yyyy')
        const disposalDate = getFormatDateFromTime(x.disposalDate, 'dd-mm-yyyy')
        const manager = getPropertyOfValue(x.managedBy, 'email', false, userlist)
        const assigner = getPropertyOfValue(x.assignedToUser, 'email', false, userlist)
        const status = formatStatus(x.status)
        length = x.detailInfo && x.detailInfo.length
        const info = length
          ? x.detailInfo.map((item, index) => {
              return {
                infoName: item.nameField,
                value: item.value
              }
            })
          : ''
        const infoName = info[0] ? info[0].infoName : ''
        const value = length ? info[0].value : ''

        exportThongTinChung = [
          ...exportThongTinChung,
          {
            index: index + 1,
            code,
            name,
            group,
            description,
            type,
            purchaseDate,
            disposalDate,
            manager,
            assigner,
            status,
            infoName,
            value
          }
        ]
        if (length > 1) {
          for (let i = 1; i < length; i++) {
            exportThongTinChung = [
              ...exportThongTinChung,
              {
                index: '',
                code: '',
                group: '',
                name: '',
                description: '',
                type: '',
                purchaseDate: '',
                disposalDate: '',
                manager: '',
                assigner: '',
                status: '',
                infoName: info[i].infoName,
                value: info[i].value
              }
            ]
          }
        }

        // Dữ liệu tab khấu hao
        const cost = getCostNumber(x.cost)
        const residualValue = getCostNumber(x.residualValue)
        const usefulLife = getNumber(x.usefulLife)
        const startDepreciation = getFormatDateFromTime(x.startDepreciation, 'dd-mm-yyyy')
        const depreciationType = getAssetDepreciationType(x.depreciationType)
        exportKhauHao = [
          ...exportKhauHao,
          {
            index: index + 1,
            code,
            name,
            cost,
            residualValue,
            usefulLife,
            startDepreciation,
            depreciationType
          }
        ]

        // Dữ liệu tab thông tin sử dụng
        const dataKH = x.usageLogs
          ? x.usageLogs.map((use) => {
              return {
                index: index + 1,
                code,
                name,
                usedByOrganizationalUnit: getPropertyOfValue(use.usedByOrganizationalUnit, 'name', false, organizationalUnitList),
                usedByUser: getPropertyOfValue(use.usedByUser, 'email', false, userlist),
                startDate: getFormatDateFromTime(use.startDate, 'dd-mm-yyyy'),
                endDate: getFormatDateFromTime(use.endDate, 'dd-mm-yyyy'),
                description: use.description
              }
            })
          : null
        exportSuDung = dataKH ? [...exportSuDung, ...dataKH] : [...exportSuDung]

        // Dữ liệu tab sự cố
        const dataSuCo = x.incidentLogs
          ? x.incidentLogs.map((incident) => {
              return {
                index: index + 1,
                code,
                name,
                incidentCode: incident.incidentCode,
                incidentType: getIncidentType(incident.type),
                announcer: getPropertyOfValue(incident.reportedBy, 'email', false, userlist),
                incidentDate: getFormatDateFromTime(incident.dateOfIncident, 'dd-mm-yyyy'),
                content: incident.description,
                status: getIncidentStatus(incident.statusIncident)
              }
            })
          : null
        exportSuCo = dataSuCo ? [...exportSuCo, ...dataSuCo] : [...exportSuCo]

        // Dữ liệu tab bảo trì - sửa chữa
        const dataBTSC = x.maintainanceLogs
          ? x.maintainanceLogs.map((mt) => {
              return {
                index: index + 1,
                maintainanceCode: mt.maintainanceCode,
                code,
                name,
                createDate: getFormatDateFromTime(mt.createDate),
                type: getIncidentType(mt.type),
                description: mt.description,
                startDate: getFormatDateFromTime(mt.startDate, 'dd-mm-yyyy'),
                endDate: getFormatDateFromTime(mt.endDate, 'dd-mm-yyyy'),
                expense: getCostNumber(mt.expense),
                status: getIncidentStatus(mt.status)
              }
            })
          : null
        exportBaoTriSuaChua = dataBTSC ? [...exportBaoTriSuaChua, ...dataBTSC] : [...exportBaoTriSuaChua]

        // Dữ liệu tab thanh lý
        const { disposalDesc } = x
        const { disposalType } = x
        const disposalCost = getCostNumber(x.disposalCost)

        exportThanhLy = [
          ...exportThanhLy,
          {
            index: index + 1,
            code,
            name,
            disposalDesc,
            disposalCost,
            disposalDate,
            disposalType: gettDisposalType(disposalType)
          }
        ]
      })
    }

    const exportData = {
      fileName,
      dataSheets: [
        // 1. Sheet thông tin sử dụng
        {
          sheetName: 'Thông tin chung',
          sheetTitle: 'Bảng danh sách thông tin chung',
          sheetTitleWidth: 15,
          tables: [
            {
              merges: [
                {
                  key: 'detailInfo',
                  columnName: 'Danh sách các trường thông tin chi tiết',
                  keyMerge: 'infoName',
                  colspan: 2
                }
              ],
              rowHeader: 2,
              columns: [
                { key: 'index', value: 'STT' },
                { key: 'code', value: 'Mã tài sản' },
                { key: 'name', value: 'Tên tài sản' },
                { key: 'description', value: 'Mô tả' },
                { key: 'group', value: 'Nhóm tài sản' },
                { key: 'type', value: 'Loại tài sản' },
                { key: 'purchaseDate', value: 'Ngày nhập' },
                { key: 'disposalDate', value: 'Ngày thanh lý' },
                { key: 'manager', value: 'Người quản lý' },
                { key: 'assigner', value: 'Người sử dụng' },
                { key: 'handoverFromDate', value: 'Thời gian bắt đầu sử dụng' },
                { key: 'handoverToDate', value: 'Thời gian kết thúc sử dụng' },
                { key: 'status', value: 'Trạng thái' },
                { key: 'infoName', value: 'Tên trường thông tin' },
                { key: 'value', value: 'Giá trị' }
              ],
              data: exportThongTinChung
            }
          ]
        },

        // 2. Sheet thông tin khấu hao
        {
          sheetName: 'Thông tin khấu hao',
          sheetTitle: 'Danh sách thông tin khấu hao tài sản',
          sheetTitleWidth: 8,
          tables: [
            {
              rowHeader: 2,
              columns: [
                { key: 'index', value: 'STT' },
                { key: 'code', value: 'Mã tài sản' },
                { key: 'name', value: 'Tên tài sản' },
                { key: 'cost', value: 'Nguyên giá' },
                { key: 'residualValue', value: 'Giá trị thu hồi ước tính' },
                { key: 'usefulLife', value: 'Thời gian sử dụng (tháng)' },
                { key: 'startDepreciation', value: 'Thời điểm bắt đầu trích khấu khao' },
                { key: 'depreciationType', value: 'Phương pháp khấu hao' }
              ],
              data: exportKhauHao
            }
          ]
        },

        // 3. Sheet thông tin sử dụng
        {
          sheetName: 'Thông tin sử dụng',
          sheetTitle: 'Bảng danh sách thông tin sử dụng',
          sheetTitleWidth: 8,
          tables: [
            {
              rowHeader: 2,
              columns: [
                { key: 'index', value: 'STT' },
                { key: 'code', value: 'Mã tài sản' },
                { key: 'name', value: 'Tên tài sản' },
                { key: 'description', value: 'Mô tả' },
                { key: 'usedByUser', value: 'Người sử dụng' },
                { key: 'usedByOrganizationalUnit', value: 'Đơn vị sử dụng' },
                { key: 'startDate', value: 'Ngày bắt đầu sử dụng' },
                { key: 'endDate', value: 'Ngày kết thúc sử dụng' }
              ],
              data: exportSuDung
            }
          ]
        },

        // 4. Sheet thông tin sự cố
        {
          sheetName: 'Thông tin sự cố',
          sheetTitle: 'Bảng danh sách thông tin sự cố',
          sheetTitleWidth: 9,
          tables: [
            {
              rowHeader: 2,
              columns: [
                { key: 'index', value: 'STT' },
                { key: 'code', value: 'Mã tài sản' },
                { key: 'name', value: 'Tên tài sản' },
                { key: 'incidentCode', value: 'Mã sự cố' },
                { key: 'incidentType', value: 'Loại sự cố' },
                { key: 'announcer', value: 'Người báo cáo' },
                { key: 'incidentDate', value: 'Ngày phát hiện' },
                { key: 'content', value: 'Nội dung' },
                { key: 'status', value: 'Trạng thái' }
              ],
              data: exportSuCo
            }
          ]
        },

        // 5. Sheet thông tin bảo trì - sửa chữa
        {
          sheetName: 'Thông tin bảo trì',
          sheetTitle: 'Bảng danh sách thông tin bảo trì',
          sheetTitleWidth: 11,
          tables: [
            {
              rowHeader: 2,
              columns: [
                { key: 'index', value: 'STT' },
                { key: 'maintainanceCode', value: 'Mã phiếu' },
                { key: 'code', value: 'Mã tài sản' },
                { key: 'name', value: 'Tên tài sản' },
                { key: 'createDate', value: 'Ngày lập' },
                { key: 'type', value: 'Phân loại' },
                { key: 'description', value: 'Nội dung' },
                { key: 'startDate', value: 'Ngày bắt đầu' },
                { key: 'endDate', value: 'Ngày hoàn thành' },
                { key: 'expense', value: 'Chi phí' },
                { key: 'status', value: 'Trạng thái' }
              ],
              data: exportBaoTriSuaChua
            }
          ]
        },

        // 6. Sheet thông tin thanh lý
        {
          sheetName: 'Thông tin thanh lý',
          sheetTitle: 'Bảng danh sách thông tin thanh lý',
          sheetTitleWidth: 7,
          tables: [
            {
              rowHeader: 2,
              columns: [
                { key: 'index', value: 'STT' },
                { key: 'code', value: 'Mã tài sản' },
                { key: 'name', value: 'Tên tài sản' },
                { key: 'disposalDate', value: 'Ngày thanh lý' },
                { key: 'disposalType', value: 'Hình thức thanh lý' },
                { key: 'disposalCost', value: 'Giá trị thanh lý' },
                { key: 'disposalDesc', value: 'Nội dung thanh lý' }
              ],
              data: exportThanhLy
            }
          ]
        }
      ]
    }
    return exportData
  }

  const getAssetTypes = () => {
    const { assetType } = props
    const assetTypeName = assetType && assetType.listAssetTypes
    const typeArr = []
    assetTypeName.map((item) => {
      typeArr.push({
        _id: item._id,
        id: item._id,
        name: item.typeName,
        parent: item.parent ? (typeof item.parent === 'object' ? item.parent._id : item.parent) : null
      })
    })
    return typeArr
  }

  const getDepartment = () => {
    const { department } = props
    const listUnit = department && department.list
    const unitArr = []

    listUnit.map((item) => {
      unitArr.push({
        value: item._id,
        text: item.name
      })
    })

    return unitArr
  }

  const getAssetLot = () => {
    const { assetLotManager } = props
    const listLot = assetLotManager && assetLotManager.listAssetLots
    const lotArr = []

    listLot.map((item) => {
      lotArr.push({
        value: item._id,
        text: item.assetLotName
      })
    })

    return lotArr
  }

  const convertGroupAsset = (group) => {
    const { translate } = props
    if (group === 'building') {
      return translate('asset.dashboard.building')
    }
    if (group === 'vehicle') {
      return translate('asset.asset_info.vehicle')
    }
    if (group === 'machine') {
      return translate('asset.dashboard.machine')
    }
    if (group === 'other') {
      return translate('asset.dashboard.other')
    }
    return null
  }

  const formatStatus = (status) => {
    const { translate } = props

    if (status === 'ready_to_use') {
      return translate('asset.general_information.ready_use')
    }
    if (status === 'in_use') {
      return translate('asset.general_information.using')
    }
    if (status === 'broken') {
      return translate('asset.general_information.damaged')
    }
    if (status === 'lost') {
      return translate('asset.general_information.lost')
    }
    if (status === 'disposed') {
      return translate('asset.general_information.disposal')
    }
    return ''
  }

  const formatDisposalDate = (disposalDate, status) => {
    const { translate } = props
    if (status === 'disposed') {
      if (disposalDate) return formatDate(disposalDate)
      return translate('asset.general_information.not_disposal_date')
    }
    return translate('asset.general_information.not_disposal')
  }

  let lists = ''
  let exportData
  const userlist = user.list
  const departmentlist = department.list
  const assetLotList = assetLotManager.listAssetLots
  const assettypelist = assetType.listAssetTypes
  const typeArr = getAssetTypes()
  const dataSelectBox = getDepartment()
  const assetTypeName = state.assetType ? state.assetType : []

  if (assetsManager.isLoading === false) {
    lists = assetsManager.listAssets
  }

  const assetbuilding = assetsManager && assetsManager.buildingAssets
  const assetbuildinglist = assetbuilding && assetbuilding.list
  const buildingList =
    assetbuildinglist &&
    assetbuildinglist.map((node) => {
      return {
        ...node,
        id: node._id,
        name: node.assetName,
        parent: node.location
      }
    })

  const pageTotal =
    assetsManager.totalList % limit === 0 ? parseInt(assetsManager.totalList / limit) : parseInt(assetsManager.totalList / limit + 1)
  const currentPage = parseInt(page / limit + 1)

  if (userlist && lists && assettypelist) {
    exportData = convertDataToExportData(lists, assettypelist, userlist)
  }
  return (
    <div className={isActive || 'box'}>
      <div className='box-body qlcv'>
        {/* Form thêm tài sản mới */}
        <div className='dropdown pull-right'>
          <button
            type='button'
            className='btn btn-success dropdown-toggle pull-right'
            data-toggle='dropdown'
            aria-expanded='true'
            title={translate('menu.add_asset_title')}
          >
            {translate('menu.add_update_asset')}
          </button>
          <ul className='dropdown-menu pull-right' style={{ marginTop: 0 }}>
            <li>
              <a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-add-asset').modal('show')}>
                {translate('menu.add_asset')}
              </a>
            </li>
            <li>
              <a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-asset-add').modal('show')}>
                {translate('human_resource.profile.employee_management.add_import')}
              </a>
            </li>
            <li>
              <a style={{ cursor: 'pointer' }} onClick={() => window.$('#modal-import-asset-update').modal('show')}>
                {translate('human_resource.profile.employee_management.update_import')}
              </a>
            </li>
          </ul>
        </div>
        <AssetCreateForm />
        <AssetImportForm id='modal-import-asset-add' type='add' page={0} limit={5} />
        <AssetImportForm id='modal-import-asset-update' type='update' page={0} limit={5} />

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

          <a style={{ cursor: 'pointer' }} title='Tìm kiếm nâng cao'>
            <i className='fa fa-filter fa-2x' style={{ marginLeft: 20 }} onClick={handleAdvancedSearch} />
          </a>
        </div>

        <div className='form-inline'>
          {/* Nhóm tài sản */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.asset_group')}</label>
            <SelectMulti
              id='multiSelectGroupInManagement'
              multiple='multiple'
              value={group}
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

          {/* Loại tài sản */}
          <div className='form-group'>
            <label>{translate('asset.general_information.asset_type')}</label>
            <TreeSelect data={typeArr} value={assetTypeName} handleChange={handleAssetTypeChange} mode='hierarchical' />
          </div>
        </div>

        <div className='form-inline'>
          {/* Trạng thái */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('page.status')}</label>
            <SelectMulti
              id='multiSelectStatus1'
              multiple='multiple'
              options={{
                nonSelectedText: translate('page.non_status'),
                allSelectedText: translate('asset.general_information.select_all_status')
              }}
              onChange={handleStatusChange}
              value={status || []}
              items={[
                { value: 'ready_to_use', text: translate('asset.general_information.ready_use') },
                { value: 'in_use', text: translate('asset.general_information.using') },
                { value: 'broken', text: translate('asset.general_information.damaged') },
                { value: 'lost', text: translate('asset.general_information.lost') },
                { value: 'disposed', text: translate('asset.general_information.disposal') }
              ]}
            />
          </div>

          {/* Vị trí tài sản */}
          <div className='form-group'>
            <label>{translate('asset.general_information.asset_location')}</label>
            <TreeSelect data={buildingList} value={[location]} handleChange={handleLocationChange} mode='radioSelect' />
          </div>
        </div>

        <div className='form-inline'>
          {/* Đơn vị được giao sử dụng */}
          <div className='form-group'>
            <label>{translate('asset.general_information.organization_unit')}</label>
            <SelectMulti
              id='unitInManagement'
              multiple='multiple'
              options={{
                nonSelectedText: translate('asset.general_information.select_organization_unit'),
                allSelectedText: translate('asset.general_information.select_all_organization_unit')
              }}
              className='form-control select2'
              style={{ width: '100%' }}
              items={dataSelectBox}
              onChange={handleHandoverUnitChange}
            />
          </div>

          {/* Người được giao sử dụng */}
          <div className='form-group'>
            <label className='form-control-static'>{translate('asset.general_information.user')}</label>
            <input
              type='text'
              className='form-control'
              name='handoverUser'
              onChange={handleHandoverUserChange}
              placeholder={translate('asset.general_information.user')}
              autoComplete='off'
            />
          </div>
        </div>
        {advancedSearch && (
          <div className='form-inline'>
            {/* Ngày nhập từ */}
            <div className='form-group'>
              <label className='form-control-static'>{translate('asset.general_information.purchase_date_start')}</label>
              <DatePicker
                id='purchase-month-start'
                dateFormat='day-month-year'
                value={purchaseDateStart}
                onChange={handlePurchaseMonthStartChange}
              />
            </div>

            {/* Ngày nhập đến */}
            <div className='form-group'>
              <label className='form-control-static' style={{ padding: 0 }}>
                {translate('asset.general_information.purchase_date_end')}
              </label>
              <DatePicker
                id='disposal-month-end'
                dateFormat='day-month-year'
                value={purchaseDateEnd}
                onChange={handlePurchaseMonthEndChange}
              />
            </div>
          </div>
        )}

        <div className='form-inline'>
          {/* Ngày nhập */}
          {!advancedSearch && (
            <div className='form-group'>
              <label className='form-control-static'>{translate('asset.general_information.purchase_date')}</label>
              <DatePicker id='purchase-month' dateFormat='month-year' value={purchaseDate} onChange={handlePurchaseMonthChange} />
            </div>
          )}

          {/* Ngày Thanh lý */}
          <div className='form-group'>
            <label className='form-control-static' style={{ padding: 0 }}>
              {translate('asset.general_information.disposal_date')}
            </label>
            <DatePicker id='disposal-month' dateFormat='month-year' value={disposalDate} onChange={handleDisposalMonthChange} />
          </div>
        </div>

        <div className='form-inline' style={{ marginBottom: 10 }}>
          {/* Quyền đăng ký */}
          <div className='form-group'>
            <label>{translate('asset.general_information.can_register')}</label>
            <SelectMulti
              id='typeRegisterForUseInManagement'
              className='form-control select2'
              multiple='multiple'
              value={typeRegisterForUse}
              options={{
                nonSelectedText: translate('asset.general_information.select_register'),
                allSelectedText: translate('asset.general_information.select_all_register')
              }}
              style={{ width: '100%' }}
              items={[
                { value: 1, text: translate('asset.general_information.not_for_registering') },
                { value: 2, text: translate('asset.general_information.register_by_hour') },
                { value: 3, text: translate('asset.general_information.register_for_long_term') }
              ]}
              onChange={handleTypeRegisterForUseChange}
            />
          </div>
          {/* lô tài sản */}
          <div className='form-group'>
            <label>{translate('asset.general_information.asset_lot')}</label>
            {/* <SelectMulti
                            id={`assetLotSearchInManagement`}
                            multiple="multiple"
                            options={{
                                nonSelectedText: translate('asset.general_information.select_asset_lot'),
                                allSelectedText: translate('asset.general_information.select_all_asset_lot')
                            }}
                            className="form-control select2"
                            style={{ width: "100%" }}
                            items={dataLotSelectBox}
                            onChange={handleAssetLotChange}
                        /> */}
            <input
              type='text'
              className='form-control'
              name='assetLot'
              onChange={handleAssetLotChange}
              placeholder={translate('asset.general_information.asset_lot')}
              autoComplete='off'
            />
          </div>

          {/* Nút tìm kiếm */}
          <div className='form-group'>
            <label />
            <button
              type='button'
              className='btn btn-success'
              title={translate('asset.general_information.search')}
              onClick={handleSubmitSearch}
            >
              {translate('asset.general_information.search')}
            </button>
          </div>
          {exportData && <ExportExcel id='export-asset-info-management' exportData={exportData} style={{ marginRight: 10 }} />}
          {selectedData?.length > 0 && (
            <button
              type='button'
              className='btn btn-danger pull-right'
              title={translate('general.delete_option')}
              onClick={() => handleDeleteOptions()}
            >
              {translate('general.delete_option')}
            </button>
          )}
        </div>

        {/* Báo lỗi khi thêm mới tài sản */}
        {assetsManager && assetsManager.assetCodeError && assetsManager.assetCodeError.length !== 0 && (
          <div style={{ color: 'red' }}>
            <strong style={{ fontWeight: 600, paddingRight: 10 }}>{translate('asset.asset_info.asset_code_exist')}:</strong>
            {assetsManager.assetCodeError.map((item, index) => {
              const seperator = index !== 0 ? ', ' : ''
              return (
                <span key={index}>
                  {seperator}
                  {item}
                </span>
              )
            })}
          </div>
        )}
        <SmartTable
          tableId={tableId}
          columnData={{
            index: translate('manage_example.index'),
            assetCode: translate('asset.general_information.asset_code'),
            assetName: translate('asset.general_information.asset_name'),
            assetGroup: translate('asset.general_information.asset_group'),
            assetType: translate('asset.general_information.asset_type'),
            assetPurchaseDate: translate('asset.general_information.purchase_date'),
            assetManager: translate('asset.general_information.manager'),
            assetLot: translate('asset.general_information.asset_lot'),
            assetUser: translate('asset.general_information.user'),
            assetOrganizationUnit: translate('asset.general_information.organization_unit'),
            assetStatus: translate('asset.general_information.status'),
            assetDisposalDate: translate('asset.general_information.disposal_date')
          }}
          tableHeaderData={{
            index: <th>{translate('manage_example.index')}</th>,
            assetCode: <th>{translate('asset.general_information.asset_code')}</th>,
            assetName: <th>{translate('asset.general_information.asset_name')}</th>,
            assetGroup: <th>{translate('asset.general_information.asset_group')}</th>,
            assetType: <th>{translate('asset.general_information.asset_type')}</th>,
            assetPurchaseDate: <th>{translate('asset.general_information.purchase_date')}</th>,
            assetManager: <th>{translate('asset.general_information.manager')}</th>,
            assetLot: <th>{translate('asset.general_information.asset_lot')}</th>,
            assetUser: <th>{translate('asset.general_information.user')}</th>,
            assetOrganizationUnit: <th>{translate('asset.general_information.organization_unit')}</th>,
            assetStatus: <th>{translate('asset.general_information.status')}</th>,
            assetDisposalDate: <th>{translate('asset.general_information.disposal_date')}</th>,
            action: <th style={{ width: '120px', textAlign: 'center' }}>{translate('general.action')}</th>
          }}
          tableBodyData={
            lists?.length > 0 &&
            lists.map((x, index) => {
              return {
                id: x?._id,
                index: <td>{index + 1}</td>,
                assetCode: <td>{x.code}</td>,
                assetName: <td>{x.assetName}</td>,
                assetGroup: <td>{convertGroupAsset(x.group)}</td>,
                assetType: (
                  <td>
                    {x.assetType &&
                      x.assetType.length !== 0 &&
                      x.assetType.map((type, index, arr) => (index !== arr.length - 1 ? `${type.typeName}, ` : type.typeName))}
                  </td>
                ),
                assetPurchaseDate: <td>{formatDate(x.purchaseDate)}</td>,
                assetManager: <td>{getPropertyOfValue(x.managedBy, 'email', false, userlist)}</td>,
                assetLot: <td>{getPropertyOfValue(x.assetLot, 'assetLotName', false, assetLotList)}</td>,
                assetUser: <td>{getPropertyOfValue(x.assignedToUser, 'email', false, userlist)}</td>,
                assetOrganizationUnit: <td>{getPropertyOfValue(x.assignedToOrganizationalUnit, 'name', false, departmentlist)}</td>,
                assetStatus: <td>{formatStatus(x.status)}</td>,
                assetDisposalDate: <td>{formatDisposalDate(x.disposalDate, x.status)}</td>,
                action: (
                  <td style={{ textAlign: 'center' }}>
                    <a
                      className='edit text-green'
                      style={{ width: '5px' }}
                      title={translate('manage_example.detail_info_example')}
                      onClick={() => handleView(x)}
                    >
                      <i className='material-icons'>visibility</i>
                    </a>
                    <a
                      className='edit text-yellow'
                      style={{ width: '5px' }}
                      title={translate('manage_example.edit')}
                      onClick={() => handleEdit(x)}
                    >
                      <i className='material-icons'>edit</i>
                    </a>
                    <DeleteNotification
                      content={translate('asset.general_information.delete_info')}
                      data={{
                        id: x._id,
                        info: `${x.code} - ${x.assetName}`
                      }}
                      func={handleDeleteAnAsset}
                    />
                  </td>
                )
              }
            })
          }
          dataDependency={lists}
          onSetNumberOfRowsPerpage={setLimit}
          onSelectedRowsChange={onSelectedRowsChange}
        />

        {assetsManager.isLoading ? (
          <div className='table-info-panel'>{translate('confirm.loading')}</div>
        ) : (
          (!lists || lists.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
        )}

        {/* PaginateBar */}
        <PaginateBar
          display={assetsManager.listAssets ? assetsManager.listAssets.length : null}
          total={assetsManager.totalList ? assetsManager.totalList : null}
          pageTotal={pageTotal || 0}
          currentPage={currentPage}
          func={setPage}
        />
      </div>

      {/* Form xem thông tin tài sản */}
      {currentRowView && (
        <AssetDetailForm
          _id={currentRowView._id}
          avatar={currentRowView.avatar}
          code={currentRowView.code}
          assetName={currentRowView.assetName}
          serial={currentRowView.serial}
          assetType={currentRowView.assetType}
          group={currentRowView.group}
          purchaseDate={currentRowView.purchaseDate}
          warrantyExpirationDate={currentRowView.warrantyExpirationDate}
          managedBy={getPropertyOfValue(currentRowView.managedBy, '_id', true, userlist)}
          assignedToUser={getPropertyOfValue(currentRowView.assignedToUser, '_id', true, userlist)}
          assignedToOrganizationalUnit={getPropertyOfValue(currentRowView.assignedToOrganizationalUnit, '_id', true, departmentlist)}
          handoverFromDate={currentRowView.handoverFromDate}
          handoverToDate={currentRowView.handoverToDate}
          location={currentRowView.location}
          description={currentRowView.description}
          status={currentRowView.status}
          typeRegisterForUse={currentRowView.typeRegisterForUse}
          detailInfo={currentRowView.detailInfo}
          cost={currentRowView.cost}
          readByRoles={currentRowView.readByRoles}
          residualValue={currentRowView.residualValue}
          startDepreciation={currentRowView.startDepreciation}
          usefulLife={currentRowView.usefulLife}
          depreciationType={currentRowView.depreciationType}
          estimatedTotalProduction={currentRowView.estimatedTotalProduction}
          unitsProducedDuringTheYears={currentRowView.unitsProducedDuringTheYears}
          maintainanceLogs={currentRowView.maintainanceLogs}
          usageLogs={currentRowView.usageLogs}
          incidentLogs={currentRowView.incidentLogs}
          disposalDate={currentRowView.disposalDate}
          disposalType={currentRowView.disposalType}
          disposalCost={currentRowView.disposalCost}
          disposalDesc={currentRowView.disposalDesc}
          archivedRecordNumber={currentRowView.archivedRecordNumber}
          files={currentRowView.documents}
          linkPage='management'
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
          managedBy={getPropertyOfValue(currentRow.managedBy, '_id', true, userlist)}
          assignedToUser={getPropertyOfValue(currentRow.assignedToUser, '_id', true, userlist)}
          assignedToOrganizationalUnit={getPropertyOfValue(currentRow.assignedToOrganizationalUnit, '_id', true, departmentlist)}
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
  const { assetsManager, assetType, user, role, department, auth, assetLotManager } = state
  return { assetsManager, assetType, user, role, department, auth, assetLotManager }
}

const actionCreators = {
  getAssetTypes: AssetTypeActions.getAssetTypes,
  getAllAsset: AssetManagerActions.getAllAsset,
  getListBuildingAsTree: AssetManagerActions.getListBuildingAsTree,
  deleteAsset: AssetManagerActions.deleteAsset,
  getUser: UserActions.get,
  getAllDepartments: DepartmentActions.get,
  getAllRoles: RoleActions.get,
  getAllAssetLots: AssetLotManagerActions.getAllAssetLots
}

const assetManagement = connect(mapState, actionCreators)(withTranslate(AssetManagement))
export { assetManagement as AssetManagement }
