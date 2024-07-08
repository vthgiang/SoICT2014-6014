import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SalesOrderActions } from '../../redux/actions';
import { configSales, importSalesTemplate } from './fileConfigurationImportOrder';
import { DialogModal, ImportFileExcel, ShowImportData, ConFigImportFile, ExportExcel } from '../../../../../../common-components';

function ImportOrdersModal(props) {
  const [state, setState] = useState({
    configData: configSales,
    limit: 100,
    page: 0,
    importData: [],
    importShowData: [],
    rowError: [],
    checkFileImport: false,
  });

  const { translate, currentRole } = props;
  const { configData, importData, rowError, checkFileImport, limit, page } = state;

  const save = () => {
    console.log('Data to be imported:', state.importShowData); // Kiểm tra dữ liệu
    if (state.importShowData.length > 0) {
      const dataToSend = {
        data: state.importShowData,
        currentRole: currentRole // Truyền currentRole vào dữ liệu gửi
      };
      props.importOrders(dataToSend);
    } else {
      alert('No data to import');
    }
  };

  const handleChangeConfig = (value) => {
    setState({
      ...state,
      configData: value,
      importData: []
    });
  };

  const convertDataExport = (dataExport) => {
    for (let i = 0; i < dataExport.dataSheets.length; i++) {
      for (let j = 0; j < dataExport.dataSheets[i].tables.length; j++) {
        let datas = [];
        let data = dataExport.dataSheets[i].tables[j].data;

        for (let index = 0; index < data.length; index++) {
          let dataTemporary = data[index];
          let out = {
            STT: dataTemporary.code ? index + 1 : null,
            code: dataTemporary.code,
            customerID: dataTemporary.customerID,
            customerName: dataTemporary.customerName,
            customerAddress: dataTemporary.customerAddress,
            customerPhone: dataTemporary.customerPhone,
            productID: dataTemporary.productID,
            createdAt: dataTemporary.createdAt,
            marketingID: dataTemporary.marketingID,
            productionCost: dataTemporary.productionCost,
            pricePerBaseUnit: dataTemporary.pricePerBaseUnit,
            quantity: dataTemporary.quantity,
            priority: dataTemporary.priority,
            status: dataTemporary.status
          };
          datas = [...datas, out];
        }
        dataExport.dataSheets[i].tables[j].data = datas;
      }
    }

    return dataExport;
  };

  const checkOrderCode = (code, list) => {
    let checkCode;
    if (list?.length) {
      checkCode = list.filter((o) => o?.code === code?.toString()?.trim());
    }
    if (checkCode?.length) return -1;
  };

  const handleImportExcel = (value, checkFileImport) => {
    const { list } = props;
    let values = [],
      valueShow = [],
      index = -1;

    for (let i = 0; i < value.length; i++) {
      const valueTemporary = value[i];
      if (valueTemporary.customerName) {
        index = index + 1;
        values = [
          ...values,
          {
            STT: index + 1,
            code: valueTemporary.code,
            customerID: valueTemporary.customerID,
            customerName: valueTemporary.customerName,
            customerAddress: valueTemporary.customerAddress,
            customerPhone: valueTemporary.customerPhone,
            productID: valueTemporary.productID,
            createdAt: valueTemporary.createdAt,
            marketingID: valueTemporary.marketingID,
            productionCost: valueTemporary.productionCost,
            pricePerBaseUnit: valueTemporary.pricePerBaseUnit,
            quantity: valueTemporary.quantity,
            priority: valueTemporary.priority,
            status: valueTemporary.status
          }
        ];
        valueShow = [
          ...valueShow,
          {
            code: valueTemporary.code,
            customerID: valueTemporary.customerID,
            customerName: valueTemporary.customerName,
            customerAddress: valueTemporary.customerAddress,
            customerPhone: valueTemporary.customerPhone,
            productID: valueTemporary.productID,
            createdAt: valueTemporary.createdAt,
            marketingID: valueTemporary.marketingID,
            productionCost: valueTemporary.productionCost,
            pricePerBaseUnit: valueTemporary.pricePerBaseUnit,
            quantity: valueTemporary.quantity,
            priority: valueTemporary.priority,
            status: valueTemporary.status
          }
        ];
      } else {
        if (index >= 0) {
          let out = {
            STT: '',
            code: '',
            customerID: '',
            customerName: '',
            customerAddress: '',
            customerPhone: '',
            productID: '',
            createdAt: '',
            marketingID: '',
            productionCost: '',
            pricePerBaseUnit: '',
            quantity: '',
            priority: '',
            status: ''
          };
          values = [...values, out];
        }
      }
    }
    value = values;

    if (checkFileImport) {
      let rowError = [];
      for (let i = 0; i < value.length; i++) {
        let x = value[i],
          errorAlert = [];
        const checkCode = value.filter((obj) => obj?.code?.toString()?.trim() === value[i]?.code?.toString()?.trim());
        if (
          x.customerName === null ||
          x.code === null ||
          x.productID === null ||
          x.createdAt === null ||
          x.quantity === null ||
          (value[i]?.code && checkCode?.length > 1) ||
          checkOrderCode(x.code, list) === -1
        ) {
          rowError = [...rowError, i + 1];
          x = { ...x, error: true };
        }
        if (x.code === null) {
          errorAlert = [...errorAlert, 'Mã đơn hàng không được để trống'];
        }
        if (x.customerName === null) {
          errorAlert = [...errorAlert, 'Tên khách hàng không được để trống'];
        }
        if (x.productID === null) {
          errorAlert = [...errorAlert, 'Mã sản phẩm không được để trống'];
        }
        if (x.createdAt === null) {
          errorAlert = [...errorAlert, 'Ngày tạo đơn không được để trống'];
        }
        if (x.quantity === null) {
          errorAlert = [...errorAlert, 'Số lượng sản phẩm không được để trống'];
        }
        if (value[i]?.code && checkCode?.length > 1) {
          errorAlert = [...errorAlert, 'Mã đơn hàng trong file trùng lặp'];
        }
        if (checkOrderCode(x.code, list) === -1) {
          errorAlert = [...errorAlert, 'Mã đơn hàng đã tồn tại trên hệ thống'];
        }

        x = { ...x, errorAlert: errorAlert };
        value[i] = x;
      }

      setState({
        ...state,
        importData: value,
        importShowData: valueShow,
        rowError: rowError,
        checkFileImport: checkFileImport,
      });
    } else {
      setState({
        ...state,
        importData: [], // Thêm dòng này để reset importData
        rowError: [], // Thêm dòng này để reset rowError
        checkFileImport: false,
      });
    }
  };

  let importDataTemplate = convertDataExport(importSalesTemplate);
  return (
    <React.Fragment>
      <DialogModal
        modalID={`modal-import-sales-orders`}
        isLoading={false}
        formID={`form_import_orders`}
        title='Thêm đơn hàng bằng import file excel'
        func={save}
        disableSubmit={false}
        size={75}
      >
        <form className='form-group' id={`form_import_orders`}>
          <ConFigImportFile id='import_orders_config' configData={configData} scrollTable={false} handleChangeConfig={handleChangeConfig} />
          <div className='row'>
            <div className='form-group col-md-6 col-xs-6'>
              <label>{translate('human_resource.choose_file')}</label>
              <ImportFileExcel configData={configData} handleImportExcel={handleImportExcel} />
            </div>
            <div className='form-group col-md-6 col-xs-6'>
              <label></label>
              <ExportExcel id='download_order_file' type='link' exportData={importDataTemplate} buttonName='Download file import mẫu' />
            </div>
            <div className='form-group col-md-12 col-xs-12'>
              <ShowImportData
                id='import_orders_show_data'
                configData={configData}
                importData={importData}
                rowError={rowError}
                scrollTable={true}
                checkFileImport={checkFileImport}
                limit={limit}
                page={page}
              />
            </div>
          </div>
        </form>
      </DialogModal>
    </React.Fragment>
  );
}

function mapState(state) {
  const { Order } = state;
  return { 
    Order
  };
}

const actions = {
  importOrders: SalesOrderActions.importSales
};

export default connect(mapState, actions)(withTranslate(ImportOrdersModal));
