import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { ConFigImportFile, DialogModal, ExportExcel, ImportFileExcel, ShowImportData } from '../../../../common-components'
import { formatFunction } from '../../common/index'
import { CrmCustomerActions } from '../redux/actions'
import { configurationCustomer } from './configurationImportCustomer'
class CrmCustomerImportFile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      configData: configurationCustomer.configurationImport(this.props.translate),
      checkFileImport: true,
      rowError: [],
      importData: [],
      importShowData: [],
      limit: 100,
      page: 0
    }
  }

  static getDerivedStateFromProps(props, state) {
    const { listGroups, listStatus } = props
    if (listGroups && listStatus) {
      return {
        ...state,
        listGroups,
        listStatus
      }
    } else {
      return null
    }
  }

  handleChangeConfig = (value) => {
    this.setState({
      configData: value,
      importData: []
    })
  }

  handleImportExcel = (value, checkFileImport) => {
    const { translate } = this.props
    const { listGroups, listStatus } = this.state
    let valueImport = [],
      showValueImport = [],
      rowError = [],
      checkImportData = value,
      k = -1

    value.forEach((o) => {
      if (o.code) {
        k++
        //convert text thành number
        let gender = o.gender ? formatFunction.formatCustomerGenderImportForm(o.gender) : null
        let customerType = o.customerType ? formatFunction.formatCustomerTypeImportForm(o.customerType) : null
        let birthDate = !o.birthDate || typeof o.birthDate === 'string' ? o.birthDate : formatFunction.convertExcelDateToJSDate(o.birthDate)
        let companyEstablishmentDate =
          !o.companyEstablishmentDate || typeof o.companyEstablishmentDate === 'string'
            ? o.companyEstablishmentDate
            : formatFunction.convertExcelDateToJSDate(o.companyEstablishmentDate)
        let location = o.location ? formatFunction.formatCustomerLocationImportForm(o.location) : null
        // Kiểm tra xem nhóm khách hàng trong file import có trong danh sách nhóm khách hàng hay không
        // Nếu có convert tên nhóm khách hang sang id
        let group = o.group ? formatFunction.getIdGroupInArray(listGroups, o.group) : null

        // Kiểm tra xem trạng thái của khách hàng trong file import có trong danh sách trạng thái hay không
        // Nếu có convert tên trạng thái khách hàng sang id
        let status = o.status ? formatFunction.getIdStatusInArray(listStatus, o.status) : []

        //
        valueImport = [
          ...valueImport,
          {
            ...o,
            owner: [o.owner],
            gender: gender,
            customerType: customerType,
            companyEstablishmentDate: companyEstablishmentDate ? companyEstablishmentDate : null,
            birthDate: birthDate ? birthDate : null,
            location: location,
            group: group,
            status: status
          }
        ]

        showValueImport = [...showValueImport, { ...o }]
      } else {
        if (k > -1) {
          if (o.owner && o.owner.length > 0) {
            showValueImport = [
              ...showValueImport,
              {
                code: '',
                name: '',
                owner: o.owner
              }
            ]

            // merge người quản lý thành 1 dòng nếu 1 khach hàng có nhiều người quản lý
            valueImport[k].owner = [...valueImport[k].owner, o.owner]
          }
        }
      }
    })

    if (checkFileImport) {
      showValueImport = showValueImport.map((x, index) => {
        let errorAlert = []
        // Check lỗi ở dòng nào
        if (
          x.code === null ||
          x.name === null ||
          formatFunction.formatCustomerTypeImportForm(x.customerType) === -1 ||
          formatFunction.formatCustomerLocationImportForm(x.location) === -1 ||
          formatFunction.formatCustomerGenderImportForm(x.gender) === -1 ||
          formatFunction.getIdGroupInArray(listGroups, x.group) === -1 ||
          formatFunction.getIdStatusInArray(listStatus, x.status) === -1
        ) {
          rowError = [...rowError, index + 1]
          x = { ...x, error: true }
        }

        //check xem mã khách hàng có trống hay không
        if (x.code === null) {
          errorAlert = [...errorAlert, `${translate('crm.customer.code')} ${translate('crm.customer.cannot_be_empty')}`]
        } else {
          // kiểm tra sự trùng lặp của mã khách hàng
          if (checkImportData.filter((obj) => obj.code === x.code).length > 1)
            errorAlert = [...errorAlert, `${translate('crm.customer.code')} ${translate('crm.customer.value_duplicate')}`]
        }

        //check xem tên khách hàng có trống hay không
        if (x.name === null) {
          errorAlert = [...errorAlert, `${translate('crm.customer.name')} ${translate('crm.customer.cannot_be_empty')}`]
        }

        // check xem loại khách hàng có nhập đúng định dạng hay không
        if (formatFunction.formatCustomerTypeImportForm(x.customerType) === -1) {
          errorAlert = [...errorAlert, `${translate('crm.customer.customerType')} không đúng định dạng`]
        }

        // check xem giới tính có nhập đúng định dạng hay không
        if (formatFunction.formatCustomerGenderImportForm(x.gender) === -1) {
          errorAlert = [...errorAlert, `${translate('crm.customer.gender')} không đúng định dạng`]
        }

        // check xem vùng khách hàng có nhập đúng hay không
        if (formatFunction.formatCustomerLocationImportForm(x.location) === -1) {
          errorAlert = [...errorAlert, `${translate('crm.customer.location')} không đúng định dạng`]
        }

        // check xem nhóm khách hàng có nhập đúng hay không
        if (formatFunction.getIdGroupInArray(listGroups, x.group) === -1) {
          errorAlert = [...errorAlert, `${translate('crm.customer.group')} không đúng định dạng`]
        }

        // check xem trạng thái khách hàng có nhập đúng hay không
        if (formatFunction.getIdStatusInArray(listStatus, x.status) === -1) {
          errorAlert = [...errorAlert, `${translate('crm.customer.status')} không đúng định dạng`]
        }

        x = { ...x, errorAlert: errorAlert }
        return x
      })

      this.setState({
        showData: showValueImport,
        importData: valueImport,
        rowError: rowError,
        checkFileImport: checkFileImport
      })
    } else {
      this.setState({
        checkFileImport: checkFileImport
      })
    }
  }

  /**
   * Function kiểm tra lỗi trước khi submit form
   */
  isFormValidated = () => {
    const { rowError } = this.state
    if (rowError.length > 0) return false
    return true
  }

  render() {
    const { translate, crm } = this.props
    let { limit, page, rowError, configData, checkFileImport, showData, listGroups, listStatus } = this.state

    const exportData = configurationCustomer.templateImport(translate, listGroups, listStatus)
    return (
      <React.Fragment>
        <DialogModal
          modalID='modal-customer-import'
          isLoading={crm.customers.isLoading}
          formID='form-customer-import'
          title='Nhập dữ liệu khách hàng'
          func={this.save}
          disableSubmit={!this.isFormValidated()}
          size={75}
        >
          {/* Form thêm khách hàng mới */}
          <form id='form-customer-import'>
            <div className='form-group'>
              <div
                style={{
                  padding: '20px',
                  backgroundColor: '#FFE6CC',
                  marginBottom: '10px'
                }}
              >
                <label className='text-red'>Chú ý !</label>
                <ul>
                  <li>Mã khách hàng phải là duy nhất</li>
                  <li>File import phải có định dạng .xlsx</li>
                  <li>Dung lượng file không quá 5Mb</li>
                  <li>
                    Tải xuống file mẫu:
                    {
                      <ExportExcel
                        type='link'
                        id='downloadTemplateImport-customer'
                        buttonName={translate('human_resource.download_file')}
                        exportData={exportData}
                        style={{ position: 'absolute', marginLeft: '10px' }}
                      />
                    }
                  </li>
                </ul>
              </div>
            </div>

            <div className='formgroup'>
              <ConFigImportFile
                id='import_customer_config'
                configData={configData}
                scrollTable={false}
                handleChangeConfig={this.handleChangeConfig}
              />
            </div>
            <div className='form-group'>
              <label>{translate('human_resource.choose_file')}</label>
              <ImportFileExcel configData={configData} handleImportExcel={this.handleImportExcel} />
            </div>
            <div className='form-group col-md-12 col-xs-12'>
              <ShowImportData
                id='import_customer_show_data'
                configData={configData}
                importData={showData}
                rowError={rowError}
                scrollTable={true}
                checkFileImport={checkFileImport}
                limit={limit}
                page={page}
              />
            </div>
          </form>
        </DialogModal>
      </React.Fragment>
    )
  }

  save = () => {
    const { importData } = this.state
    this.props.importCustomers(importData)
  }
}

function mapStateToProps(state) {
  const { crm } = state
  return { crm }
}

const mapDispatchToProps = {
  importCustomers: CrmCustomerActions.importCustomers
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCustomerImportFile))
