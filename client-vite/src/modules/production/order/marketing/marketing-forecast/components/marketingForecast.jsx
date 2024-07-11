import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Button, Select } from '@mui/material'
import * as React from 'react'
import { useState, useRef } from 'react';
import { styled } from '@mui/material/styles'
// Css baseline để fix lỗi mui, dù không dùng đến.


import { green } from '@mui/material/colors'
import './style.css'
// import { connect } from 'react-redux';

import 'react-grid-layout/css/styles.css'
import './style.css'

import ServerResponseAlert from '../../../../../alert/components/serverResponseAlert';
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';

import * as XLSX from 'xlsx';


import { sendRequest } from '../../../../../../helpers/requestHelper';
import { ToastContainer, toast } from 'react-toastify';
import { ImportForm } from './ImportForm';
import { configurationExampleTemplate } from './fileConfigurationImportExample';
import { configurationForeCast } from './fileConfigurationForecast';
import { Loading, ShowImportData } from '../../../../../../common-components';
import { configurationRevenue } from './fileConfigurationRevenue';
import { RevenuesForecastChart} from './revenuesForecastChart'
import { withRouter } from 'react-router-dom';  // Import withRouter từ react-router-dom

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(green[500]),
  backgroundColor: green[500],
  '&:hover': {
    backgroundColor: green[700]
  }
}))

const MarketingForecastComponent = (props) => {
  const [content, setContent] = React.useState('');
  const [resultForecast, setResultForecast] = useState('');
  const [isLoading, setIsLoading] = React.useState(false)
  const getTableId = 'table-manage-example1-hooks';
  const defaultConfig = { limit: 5 }
  const getLimit = getTableConfiguration(getTableId, defaultConfig).limit
  const [state, setState] = useState({
    exampleName: '',
    page: 1,
    perPage: getLimit,
    tableId: getTableId
  })
  const [stateTableData, setStateTableData] = useState({
    id: 'import_file_example',
    importData: undefined,
    rowError: [],
    configData: undefined,
    checkFileImport: undefined
  });
  const { importData, rowError, configData, checkFileImport, id } = stateTableData
  const { exampleName, page, perPage, currentRow, curentRowDetail, tableId } = state

  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // submit state
  const [excelData, setExcelData] = useState(null);

  // onchange event
  const handleFile = (e) => {
    let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        }
      }
      else {
        setTypeError('Please select only excel file types');
        setExcelFile(null);
      }
    }
    else {
      console.log('Please select your file');
    }
  }

  // submit event
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0, 10));
    }
  }

  const handleButtonClick = (buttonType) => {
    if (buttonType === 'button1') {
      window.$('#modal-import-file-hooks').modal('show')
      setContent('Nút 1')
      setStateTableData(
        {
          ...stateTableData,
          configData: configurationExampleTemplate,
          importData: undefined
        }
      )
    } else if (buttonType === 'button2') {
      setContent('Nút 2');
      setStateTableData(
        {
          ...stateTableData,
          configData: configurationRevenue,
          importData: undefined
        }
      )
    }
  };

  const predictResponse = async () => {
    setIsLoading(true);
    const listIdForecast = importData?.map((element) => element._id) ?? [];
    const response = await Promise.all(
      await listIdForecast.map(async (id) => await sendRequest(
        {
          url: `${process.env.REACT_APP_SERVER}/crm/customers/forecast-response/${id}`,
          method: 'GET',
        },
        false,
        false,
        'forecast-response'
      ))
    )

    const dataAfterPredict = response.map((element) => element.data?.content);
    const responseDataTrue = dataAfterPredict?.filter((element) => element.response === 1);
    // const dataResponse
    // Thêm cột phản hồi vào data 
    setResultForecast(responseDataTrue?.length)
    setStateTableData({
      ...stateTableData,
      importData: dataAfterPredict,
      configData: configurationForeCast
    })

    toast.success(
      <ServerResponseAlert
        type='success'
        title={'general.success'}
        content={['Dự báo thành công']}
      />,
      { containerId: 'toast-notification' }
    )
    setIsLoading(false)
  }

  const predictRevenue = async () => {
    setIsLoading(true);
    const response = await sendRequest(
      {
        url: `${process.env.REACT_APP_SERVER}/crm/customers/forecase-revenue`,
        method: 'GET',
      },
      false,
      false,
      'forecast-revenue'
    )
    const dataAfterPredict = response.data?.content?.map((element) => ({
      ...element,
      ...element.campaign
    }))
    setStateTableData({
      ...stateTableData,
      importData: dataAfterPredict
    })
    toast.success(
      <ServerResponseAlert
        type='success'
        title={'general.success'}
        content={['Dự báo thành công']}
      />,
      { containerId: 'toast-notification' }
    )
    setIsLoading(false)
  }

  const redirectToTaskManagement = () => {
    props.history.push('/task-management'); 
  }; 

  const redirectToMarketingCampaign = () => {
    props.history.push('/marketing-campaign'); 
  }; 

  return (
    <>
      <ToastContainer />
      <ImportForm page={page} perPage={perPage} setStateTableData={setStateTableData} />
      <button type="button" class="btn btn-success btn-on-bot" onClick={() => handleButtonClick('button1')}> Dự báo phản hồi người dùng</button>
      <button type="button" class="btn btn-success btn-on-right"  onClick={() => handleButtonClick('button2')}>  Dự báo doanh thu từ tiếp thị</button>
     
      {(content === 'Nút 1' && importData) && <div>
        <button type="button" class="btn btn-success btn-on-bot" onClick={() => !isLoading && predictResponse()}> 
        {isLoading ? <Loading styleInner={{ position: "unset", borderColor: "white", borderRightColor: "transparent" }} /> : "Dự báo"}
        </button>
        {resultForecast &&
         <div>
            <span class="forecast-result">Kết quả {100 * (resultForecast / importData?.length).toFixed(2)}% tập khách hàng mục tiêu sẽ mua hàng thông qua tiếp thị ({resultForecast}/{importData?.length} người)</span>

            <button class="forecast-action" onClick={redirectToTaskManagement}> Tạo lập chiến dịch phù hợp hơn với tập khách hàng ? </button>
         </div>
           }
      </div>}

      {content === 'upload' && (
        <div >
          <h3>Upload & View Excel Sheets</h3>

          {/* form */}
          <form onSubmit={handleFileSubmit}>
            <input type="file" required onChange={handleFile} />
            <button type="submit" >UPLOAD</button>
            {typeError && (
              <div role="alert">{typeError}</div>
            )}
          </form>

          {/* view data */}

          <div >
            {excelData ? (
              <div>
                <table >
                  <thead>
                    <tr>
                      {Object.keys(excelData[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.map((individualExcelData, index) => (
                      <tr key={index}>
                        {Object.keys(individualExcelData).map((key) => (
                          <td key={key}>{individualExcelData[key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>No File is uploaded yet!</div>
            )}
          </div>
        </div>
      )}

      {content === 'Nút 2' && <div>
        <button type="button" class="btn btn-success btn-on-bot" onClick={() => !isLoading && predictRevenue()}> 
        {isLoading ? <Loading styleInner={{ position: "unset", borderColor: "white", borderRightColor: "transparent" }} /> : "Dự báo"}
        </button>
        
      </div>}
      {
        (importData && configData && content === 'Nút 2') &&
        <>
            <button class="forecast-revenue-action" onClick={redirectToMarketingCampaign}> Điều chỉnh lại các chiến dịch? </button>
            <RevenuesForecastChart data={importData}/>
        </>
       
      }
      <ShowImportData
        id={`import_asset_show_data${id}`}
        configData={configData ? configData : configurationExampleTemplate}
        importData={importData} // data ở đây nhé
        rowError={rowError}
        checkFileImport={checkFileImport}
        scrollTable={false}
        limit={10}
        page={0}
      />
    </>
  )
}

const mapState = (state) => {
  const { department, createEmployeeKpiSet, user, createKpiUnit, auth } = state
  return { department, createEmployeeKpiSet, user, createKpiUnit, auth }
}

export default  connect(mapState)(withRouter(withTranslate(MarketingForecastComponent))); // Step 2: Wrap withRouter
