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

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PercentIcon from '@mui/icons-material/Percent';

import ServerResponseAlert from '../../../../../alert/components/serverResponseAlert';
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';

import * as XLSX from 'xlsx';


import { sendRequest } from '../../../../../../helpers/requestHelper';
import { ToastContainer, toast } from 'react-toastify';
import { ImportForm } from './ImportForm';
import { configurationExampleTemplate } from './fileConfigurationImportExample';
import { ShowImportData } from '../../../../../../common-components';






const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(green[500]),
  backgroundColor: green[500],
  '&:hover': {
    backgroundColor: green[700]
  }
}))


const MarketingForecastComponent = (props) => {
  const [layout, setLayout] = React.useState(() => {
    const layoutDefault = JSON.parse(localStorage.getItem('layout'));
    if (layoutDefault) return layoutDefault
    return LayoutDefault;
  })
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [openAddCampaign, setOpenAddCampaign] = React.useState(false)
  const handleOpenAddCampaign = () => setOpenAddCampaign(true)
  const handleCloseAddCampaign = () => setOpenAddCampaign(false)
  const [openDetail, setOpenDetail] = React.useState(false)
  const handleOpenDetail = () => setOpenDetail(true)
  const handleCloseDetail = () => setOpenDetail(false)
  const [openForecast, setOpenForecast] = React.useState(false)
  const handleOpenForecast = () => setOpenForecast(true)
  const handleCloseForecast = () => setOpenForecast(false)
  const [openEdit, setOpenEdit] = React.useState(false)
  const [doughnutCurrentListKeyTarget, setDoughnutCurrentListKeyTarget] = useState()
  const handleOpenEdit = (item) => {
    setOpenEdit(true);
    setEditMarketing(item)
  }
  const handleCloseEdit = () => setOpenEdit(false)
  const [editMarketing, setEditMarketing] = React.useState({});
  const [content, setContent] = React.useState('');

  const handleButtonClick = (buttonType) => {
    if (buttonType === 'button1') {
      window.$('#modal-import-file-hooks').modal('show')
      setOpenForecast(false)
      // setContent('upload');
    } else if (buttonType === 'button2') {
      setContent('Nút 2');
    }
  };

  const handlePredictClick = async () => {
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
    
    toast.success(
      <ServerResponseAlert
        type='success'
        title={'general.success'}
        content={['Dự báo thành công']}
      />,
      { containerId: 'toast-notification' }
    )
    // const response = await sendRequest(
    //   {
    //     url: `${process.env.REACT_APP_SERVER}/crm/customers/forecast-response/66852d882e30241e5810cb34`,
    //     method: 'GET',
    //   },
    //   true,
    //   true,
    //   'forecast-response'
    // )
  }


  const { translate } = props
  const labels = ['Facebook', 'Google', 'Tiktok']

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'COSTS & REVENUE',
        font: {
          size: 18,
          weight: 'bold'
        },
        color: '#000000'
      }
    }
  }





  const [date, setDate] = React.useState({
    startDate: null,
    endDate: null
  })
  const [marketingCampaign, setMarketingCampaign] = React.useState([])
  const [percentChange, setPercentChange] = React.useState({})
  const [marketingCampaignDetail, setMarketingCampaignDetail] = React.useState(null)
  const [isLoadingTopCampaign, setIsLoadingTopCampaign] = React.useState(false)
  const [topMarketingCampaign, setTopMarketingCampaign] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [marketingEffective, setMarketingEffective] = React.useState({})
  const [name, setName] = React.useState('')
  const [cost, setCost] = React.useState('')
  const [channel, setChannel] = React.useState('Facebook')
  const [anchorElPopover, setAnchorElPopover] = React.useState(null);
  const [anchorElMenuCard, setAnchorElMenuCard] = React.useState(null);
  const [anchorElMenuChild, setAnchorElMenuChild] = React.useState(null);
  const [anchorElMenuAddChart, setAnchorElMenuAddChart] = React.useState(null);
  const [anchorElMenuDoughnut, setAnchorElMenuDoughnut] = React.useState(null);

  const [optionsMenuChild, setOptionsMenuChild] = React.useState([]);
  const [listCard, setListCard] = React.useState([]);
  const [costCard, setCostCard] = React.useState(null);
  const [clickCard, setClickCard] = React.useState(null);
  const [impressionCard, setImpressionCard] = React.useState(null);
  const [sessionCard, setSessionCard] = React.useState(null);
  const [CPCCard, setCPCCard] = React.useState(null);
  const [revenuesCard, setRevenuesCard] = React.useState(null);
  const [ROIMCard, setROIMCard] = React.useState(null);
  const [transactionCard, setTransactionCard] = React.useState(null);
  const [currentMenuCardTargetId, setCurrentMenuCardTargetId] = React.useState();
  const [showTable, setShowTable] = useState();
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

  const handleChangeExampleName = (e) => {
    const { value } = e.target
    setState({
      ...state,
      exampleName: value
    })
  }


  const openPopover = Boolean(anchorElPopover);

  const deleteCard = (key) => {
    const condition = (element) => element.key === key;
    const newListCard = listCard.filter(element => !condition(element))
    const newListKeyCard = newListCard.map(element => element.key);
    localStorage.setItem("listCard", JSON.stringify(newListKeyCard))
    setListCard(newListCard)
    setAnchorElMenuCard(null)
  }

  const deleteDoughnut = () => {
    setDoughnutCurrentListKeyTarget(null)
    localStorage.setItem("doughnut", JSON.stringify([]))
    setAnchorElMenuDoughnut(null)
  }


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

  const fetchMarketingCampaign = async () => {
    const response = await sendRequest(
      {
        url: `${process.env.REACT_APP_SERVER}/marketing-campaign`,
        method: 'GET',
      },
      false,
      false,
      'marketing'
    )
    if (response.status === 200) {
      setMarketingCampaign(response.data.content)
    }
  }
  const fetchTopMarketingCampaign = async () => {
    setIsLoadingTopCampaign(true)
    const response = await sendRequest(
      {
        url: `${process.env.REACT_APP_SERVER}/marketing-effective/top-campaign`,
        method: 'GET',
      },
      false,
      false,
      'marketing-effective'
    )
    if (response.status === 200) {
      setTopMarketingCampaign(response.data.content)
    }
    setIsLoadingTopCampaign(false)
  }

  const fetchMarketingEffective = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams();
      if (date.startDate) {
        queryParams.set('startDate', date.startDate);
      }
      if (date.endDate) {
        queryParams.set('endDate', date.endDate);
      }
      const queryString = queryParams.toString();

      const response = await sendRequest(
        {
          url: `${process.env.REACT_APP_SERVER}/marketing-effective${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        },
        false,
        false,
        'marketing-effective'
      );

      if (response.status === 200) {
        setMarketingEffective(response.data.content.currentTotals);
        setPercentChange(response.data.content.percentageChanges)
      }
    } catch (error) {
      console.error('Error fetching marketing effective:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [isLoadingMarketingChanel, setIsLoadingMarketingChanel] = React.useState(false)
  const [marketingEffectiveChannel, setMarketingCampaignChannel] = React.useState([])
  const fetchMarketingEffectiveChannel = async () => {
    setIsLoadingMarketingChanel(true)
    const response = await sendRequest(
      {
        url: `${process.env.REACT_APP_SERVER}/marketing-effective/channel`,
        method: 'GET',
      },
      false,
      false,
      'marketing-effective'
    )
    if (response.status === 200) {
      setMarketingCampaignChannel(response.data.content)
    }
    setIsLoadingMarketingChanel(false)
  }
  const fetchMarketingEffectiveByCampaignId = async (id) => {
    const response = await sendRequest(
      {
        url: `${process.env.REACT_APP_SERVER}/marketing-effective/${id}`,
        method: 'GET',
      },
      false,
      false,
      'marketing-effective'
    )

    if (response.status === 200) {
      setMarketingCampaignDetail(response.data.content[0])
      setOpenDetail(true)
    }
  }

  React.useEffect(() => {
    fetchMarketingEffectiveChannel()
  }, [])

  React.useEffect(() => {
    fetchMarketingCampaign()
  }, [])

  React.useEffect(() => {
    fetchMarketingEffective()
    fetchTopMarketingCampaign()
  }, [])

  React.useEffect(() => {
    if (date.startDate || date.endDate) {
      fetchMarketingEffective();
    }
  }, [date.startDate, date.endDate]); // Theo dõi sự thay đổi của startDate và endDate

  React.useEffect(() => {
    const costCard = {
      key: "cost",
      title: "Cost",
      image: <AttachMoneyIcon
        sx={{
          height: '56px',
          width: '56px',
          color: '#ffff'
        }}
      />,
      percentChangeTotal: percentChange?.totalCost,
      marketingEffectiveTotal: marketingEffective?.totalCost,
      layout: layout.find((value) => value.i === "cost")
    }
    const clickCard = {
      key: "click",
      title: "Clicks",
      image: <AdsClickIcon
        sx={{
          height: '56px',
          width: '56px',
          color: '#ffff'
        }}
      />,
      percentChangeTotal: percentChange?.totalClick,
      marketingEffectiveTotal: marketingEffective?.totalClick,
      layout: layout.find((value) => value.i === "click")
    }
    const impressionCard = {
      key: "impression",
      title: "Impressions",
      image: <VisibilityIcon
        sx={{
          height: '56px',
          width: '56px',
          color: '#ffff'
        }}
      />,
      percentChangeTotal: percentChange?.totalImpression,
      marketingEffectiveTotal: marketingEffective?.totalImpression,
      layout: layout.find((value) => value.i === "impression")
    }
    const sessionCard = {
      key: "session",
      title: "Sessions",
      image: <WebAssetIcon
        sx={{
          height: '56px',
          width: '56px',
          color: '#ffff'
        }}
      />,
      percentChangeTotal: percentChange?.totalSession,
      marketingEffectiveTotal: marketingEffective?.totalSession,
      layout: layout.find((value) => value.i === "session")
    }
    const CPCCard = {
      key: "CPC",
      title: "CPC",
      image: <PriceCheckIcon
        sx={{
          height: '56px',
          width: '56px',
          color: '#ffff'
        }}
      />,
      percentChangeTotal: percentChange?.totalCPC,
      marketingEffectiveTotal: (marketingEffective?.totalCost && marketingEffective?.totalClick) ?
        marketingEffective?.totalCost / marketingEffective?.totalClick : 0,
      layout: layout.find((value) => value.i === "CPC")
    }
    const transactionCard = {
      key: "transaction",
      title: "Transactions",
      image: <AttachMoneyIcon
        sx={{
          height: '56px',
          width: '56px',
          color: '#ffff'
        }}
      />,
      percentChangeTotal: percentChange?.totalTransaction,
      marketingEffectiveTotal: marketingEffective?.totalTransaction,
      layout: layout.find((value) => value.i === "transaction")
    }
    const revenueCard = {
      key: "revenue",
      title: "Revenues",
      image: <LocalAtmIcon
        sx={{
          height: '56px',
          width: '56px',
          color: '#ffff'
        }}
      />,
      percentChangeTotal: percentChange?.totalRevenue,
      marketingEffectiveTotal: marketingEffective?.totalRevenue,
      layout: layout.find((value) => value.i === "revenue")
    }
    const ROIMCard = {
      key: "ROIM",
      title: "ROIM",
      image: <PercentIcon
        sx={{
          height: '56px',
          width: '56px',
          color: '#ffff'
        }}
      />,
      percentChangeTotal: percentChange?.totalRoim,
      marketingEffectiveTotal: (marketingEffective.totalRevenue && marketingEffective.totalCost) ? marketingEffective.totalRevenue / marketingEffective.totalCost * 100 : 0,
      layout: layout.find((value) => value.i === "ROIM")
    }
    const listCard = [
      costCard,
      clickCard,
      impressionCard,
      sessionCard,
      CPCCard,
      transactionCard,
      revenueCard,
      ROIMCard
    ]
    setCostCard(costCard);
    setCPCCard(CPCCard);
    setClickCard(clickCard);
    setImpressionCard(impressionCard);
    setSessionCard(sessionCard);
    setTransactionCard(transactionCard);
    setRevenuesCard(revenueCard);
    setROIMCard(ROIMCard);
    const listCardCurrent = JSON.parse(localStorage.getItem("listCard"))
    if (listCardCurrent) {
      const listCardKeySet = new Set(listCardCurrent);
      const listCardFilter = listCard.filter((element) => listCardKeySet.has(element.key))
      setListCard(listCardFilter)
    }
    else {
      const listKeyCard = listCard.map(element => element.key)
      localStorage.setItem("listCard", JSON.stringify(listKeyCard))
      setListCard(listCard)
    }

    const doughnutCurrentListKeyTargetLocal = localStorage.getItem("doughnut") ? JSON.parse(localStorage.getItem("doughnut")) : null;
    if (doughnutCurrentListKeyTargetLocal) {
      setDoughnutCurrentListKeyTarget(doughnutCurrentListKeyTargetLocal)
    } else {
      const defaultDoughnut = ["costs"];
      localStorage.setItem("doughnut", JSON.stringify(defaultDoughnut))
      setDoughnutCurrentListKeyTarget(defaultDoughnut)
    }
    const showTableLocalStr = localStorage.getItem("showTable");
    const showTableLocalJson = showTableLocalStr ? JSON.parse(showTableLocalStr) : null;
    if (typeof showTableLocalJson) setShowTable(showTableLocalJson);
    else {
      setShowTable(true);
      localStorage.setItem("showTable", true)
    }

  }, [isLoading])

  const addTable = () => {
    if (showTable) {
      toast.error(
        <ServerResponseAlert
          type='error'
          title={'general.error'}
          content={['Dữ liệu dạng bảng đã tồn tại ở dashboard, hãy kiểm tra lại.']}
        />,
        { containerId: 'toast-notification' }
      )
      return;
    }
    setShowTable(true);
    localStorage.setItem("showTable", true);
  }

  const changeDoughnutCurrent = (listKey) => {
    setDoughnutCurrentListKeyTarget(listKey)
    setAnchorElMenuDoughnut(null)
    setAnchorElMenuChild(null)
    localStorage.setItem("doughnut", JSON.stringify(listKey))
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  }

  return (
    <>
      <ToastContainer />
      <ImportForm page={page} perPage={perPage} setStateTableData={setStateTableData} />

      <ColorButton onClick={() => handleButtonClick('button1')} sx={{ marginBottom: 2, marginTop: 2, fontSize: 14, color: '#ffff' }} variant='contained'>
        Dự báo phản hồi người dùng
      </ColorButton>
      <ColorButton onClick={() => handleButtonClick('button2')} sx={{ marginBottom: 2, marginTop: 2, marginLeft: 8, fontSize: 14, color: '#ffff' }} variant='contained'>
        Dự báo lợi nhuận từ tiếp thị
      </ColorButton>
      {importData && <div>
        <ColorButton onClick={() => handlePredictClick()} sx={{ fontSize: 14, color: '#ffff' }} variant='contained'>
          Dự báo
        </ColorButton>
      </div>}
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

      {content === 'Nút 2' && <div>Nút 2</div>}
    </>
  )
}

const mapState = (state) => {
  const { department, createEmployeeKpiSet, user, createKpiUnit, auth } = state
  return { department, createEmployeeKpiSet, user, createKpiUnit, auth }
}

export default connect(mapState)(withTranslate(MarketingForecastComponent))
