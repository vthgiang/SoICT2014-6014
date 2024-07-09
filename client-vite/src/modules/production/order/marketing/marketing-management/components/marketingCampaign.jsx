import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Button, Select } from '@mui/material'
import * as React from 'react'
import { useState, useRef } from 'react';
import { styled } from '@mui/material/styles'
// Css baseline để fix lỗi mui, dù không dùng đến.
import CssBaseline from '@mui/material/CssBaseline'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { DialogModal, ErrorLabel } from '../../../../../../common-components'
import { Link } from 'react-router-dom'
import { green } from '@mui/material/colors'
import TextField from '@mui/material/TextField'
import './style.css'
// import { connect } from 'react-redux';
import { SelectBox, DatePicker, Loading } from '../../../../../../common-components'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import Switch from '@mui/material/Switch';
import './style.css'
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PercentIcon from '@mui/icons-material/Percent';
import ServerResponseAlert from '../../../../../alert/components/serverResponseAlert';
import { getTableConfiguration } from '../../../../../../helpers/tableConfiguration';
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { sendRequest } from '../../../../../../helpers/requestHelper';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    // color: theme.palette.common.black,
    color: '#33333',
    fontSize: 14,
    fontWeight: 700
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

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

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(green[500]),
  backgroundColor: green[500],
  '&:hover': {
    backgroundColor: green[700]
  }
}))

function formatNumber(totalCost) {
  if (totalCost >= 1e9) {  // nếu totalCost lớn hơn hoặc bằng 1 tỉ
    return (totalCost / 1e9).toFixed(1) + 'B';  // chia cho 1 tỉ và làm tròn đến 1 chữ số thập phân
  } else if (totalCost >= 1e6) {  // nếu totalCost lớn hơn hoặc bằng 1 triệu
    return (totalCost / 1e6).toFixed(1) + 'M';  // chia cho 1 triệu và làm tròn đến 1 chữ số thập phân
  } else if (totalCost >= 1e3) {  // nếu totalCost lớn hơn hoặc bằng 1 nghìn
    return (totalCost / 1e3).toFixed(1) + 'K';  // chia cho 1 nghìn và làm tròn đến 1 chữ số thập phân
  } else {
    return totalCost.toFixed(0);  // nếu totalCost nhỏ hơn 1 nghìn, chỉ hiển thị số nguyên
  }
}

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

const LayoutDefault = [{ i: 'cost', x: 0, y: 0, w: 6, h: 3, minH: 3, minW: 6 },
{ i: 'click', x: 6, y: 0, w: 6, h: 3, minH: 3, minW: 6 },
{ i: 'impression', x: 12, y: 0, w: 6, h: 3, minH: 3, minW: 6 },
{ i: 'session', x: 18, y: 0, w: 6, h: 3, minH: 3, minW: 6 },
{ i: 'CPC', x: 0, y: 3, w: 6, h: 3, minH: 3, minW: 6 },
{ i: 'transaction', x: 6, y: 3, w: 6, h: 3, minH: 3, minW: 6 },
{ i: 'revenue', x: 12, y: 3, w: 6, h: 3, minH: 3, minW: 6 },
{ i: 'ROIM', x: 18, y: 3, w: 6, h: 3, minH: 3, minW: 6 },
{ i: 'h', x: 0, y: 6, w: 15, h: 7, minW: 2, maxW: 24 },
{ i: 'k', x: 15, y: 6, w: 9, h: 7, minW: 2, maxW: 24 },
{ i: 'm', x: 0, y: 13, w: 6, h: 6, minW: 2, maxW: 24 }
]
const MarketingCampaignComponent = (props) => {
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
      console.log(123);
      window.$('#modal-import-file-hooks').modal('show')
      setOpenForecast(false)
      // setContent('upload');
    } else if (buttonType === 'button2') {
      setContent('Nút 2');
    }
  };
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

  const convertDataBar = (data) => {
    const channels = data.length > 0 && data.map(item => item._id);
    const costs = data.length > 0 && data.map(item => item.totalCost);
    const revenue = data.length > 0 && data.map(item => item.totalRevenue);

    return {
      labels: channels,
      datasets: [
        {
          label: 'Costs',
          data: costs,
          backgroundColor: '#d62728'
        },
        {
          label: 'Revenue',
          data: revenue,
          backgroundColor: '#1f77b4'
        }
      ]
    }
  }
  const convertDataChannelTrans = (data) => {
    const listKeySet = new Set(doughnutCurrentListKeyTarget);
    const datasets = [];
    const channels = data.length > 0 && data.map(item => item._id);
    const trans = data.length > 0 && data.map(item => item.totalTransaction);
    const transData =
    {
      label: '% of Transactions',
      data: trans,
      backgroundColor: ['#1f77b4', '#d62728', '#28a745'],
      borderColor: ['#0d47a1', '#d50000', '#558b2f'],
      borderWidth: 1
    }

    const costs = data.length > 0 && data.map(item => item.totalCost);
    const costsData =
    {
      label: '% of Costs',
      data: costs,
      backgroundColor: ['#1f77b4', '#d62728', '#28a745'],
      borderColor: ['#0d47a1', '#d50000', '#558b2f'],
      borderWidth: 1
    }

    const clicks = data.length > 0 && data.map(item => item.totalClick);
    const clicksData =
    {
      label: '% of Clicks',
      data: clicks,
      backgroundColor: ['#1f77b4', '#d62728', '#28a745'],
      borderColor: ['#0d47a1', '#d50000', '#558b2f'],
      borderWidth: 1
    }

    const revenue = data.length > 0 && data.map(item => item.totalRevenue);
    const revenueData =
    {
      label: '% of Revenue',
      data: revenue,
      backgroundColor: ['#1f77b4', '#d62728', '#28a745'],
      borderColor: ['#0d47a1', '#d50000', '#558b2f'],
      borderWidth: 1
    }

    const impressions = data.length > 0 && data.map(item => item.totalImpression);
    const impressionsData =
    {
      label: '% of Impressions',
      data: impressions,
      backgroundColor: ['#1f77b4', '#d62728', '#28a745'],
      borderColor: ['#0d47a1', '#d50000', '#558b2f'],
      borderWidth: 1
    }

    listKeySet.has("costs") && datasets.push(costsData);
    listKeySet.has("transactions") && datasets.push(transData);
    listKeySet.has("clicks") && datasets.push(clicksData);
    listKeySet.has("revenue") && datasets.push(revenueData);
    listKeySet.has("impressions") && datasets.push(impressionsData);

    return {
      labels: channels,
      datasets: datasets
    }
  }

  const options = [
    { value: 'Facebook', text: 'Facebook' },
    { value: 'Tiktok', text: 'Tiktok' },
    { value: 'Google', text: 'Google' }
  ]

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
  const { exampleName, page, perPage, currentRow, curentRowDetail, tableId } = state

  const handleChangeExampleName = (e) => {
    const { value } = e.target
    setState({
      ...state,
      exampleName: value
    })
  }

  const handleSubmitSearch = () => {
    props.getExamples({
      exampleName,
      perPage,
      page: 1
    })
    setState({
      ...state,
      page: 1
    })
  }

  const setPage = (pageNumber) => {
    setState({
      ...state,
      page: parseInt(pageNumber)
    })

    props.getExamples({
      exampleName,
      perPage,
      page: parseInt(pageNumber)
    })
  }

  const setLimit = (number) => {
    setState({
      ...state,
      perPage: parseInt(number),
      page: 1
    })
    props.getExamples({
      exampleName,
      perPage: parseInt(number),
      page: 1
    })
  }

  const handleShowDetailInfo = (example) => {
    setState({
      ...state,
      curentRowDetail: example
    })
    window.$(`#modal-detail-info-example-hooks`).modal('show')
  }
  //Trong đó Card = {
  //   id: int
  //   title: String,
  //   image: IconComponent,
  //   total: int,
  // }

  const openPopover = Boolean(anchorElPopover);
  const openMenuCard = Boolean(anchorElMenuCard);
  const openMenuChild = Boolean(anchorElMenuChild);
  const openMenuAddChart = Boolean(anchorElMenuAddChart);
  const openMenuDoughnut = Boolean(anchorElMenuDoughnut);
  const idPopoverTarget = openPopover ? 'simple-popover' : undefined;

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

  const deleteTable = () => {
    setShowTable(false);
    localStorage.setItem("showTable", false);
  }
  const optionsMenuCard = [
    {
      title: 'Action',
      child: [
        { title: 'A' },
        { title: 'B' },
        { title: 'C' }
      ],
    },
    {
      title: 'Delete',
      child: [],
      onClick: () => deleteCard(currentMenuCardTargetId)
    }
    // 'Action',
    // 'Delete'
  ];

  const optionsMenuAddChart = [
    {
      title: "Dữ liệu đơn",
      child: [
        { title: 'Cost', onClick: () => addCard(costCard) },
        { title: 'Click', onClick: () => addCard(clickCard) },
        { title: 'Impression', onClick: () => addCard(impressionCard) },
        { title: 'Session', onClick: () => addCard(sessionCard) },
        { title: 'CPC', onClick: () => addCard(CPCCard) },
        { title: 'Transaction', onClick: () => addCard(transactionCard) },
        { title: 'Revenues', onClick: () => addCard(revenuesCard) },
        { title: 'ROIM', onClick: () => addCard(ROIMCard) },
      ],
    },
    {
      title: "Dữ liệu bảng",
      onClick: () => addTable()
    },
    {
      title: "Dữ liệu dạng biểu đồ tròn",
      onClick: () => addDoughnut()
    }
  ]

  const optionsMenuDoughnut = [

    {
      title: "Chuyển giá trị",
      child: [
        {
          title: 'Costs',
          onClick: () => changeDoughnutCurrent(["costs"])
        },
        {
          title: 'Clicks',
          onClick: () => changeDoughnutCurrent(["clicks"])
        },
        {
          title: 'Impressions',
          onClick: () => changeDoughnutCurrent(["impressions"])
        },
        {
          title: 'Transactions',
          onClick: () => changeDoughnutCurrent(["transactions"])
        },
        {
          title: 'Revenue',
          onClick: () => changeDoughnutCurrent(["revenue"])
        },
      ]
    },
    {
      title: 'Xoá',
      child: [],
      onClick: () => deleteDoughnut()
    }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { cost, channel, name }

    const response = await sendRequest(
      {
        url: `${process.env.REACT_APP_SERVER}/marketing-campaign`,
        method: 'POST',
        data
      },
      false,
      false,
      'marketing'
    )

    if (response.status === 201) {
      setName('');
      setCost('');
      setChannel('Facebook');
      fetchMarketingCampaign();
    }
    setOpenAddCampaign(false)
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

    console.log('response', response)
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

  const handleChangeChanel = (e) => {
    setChannel(e[0])
  }

  const deleteCampaign = async (id) => {
    const response = await sendRequest(
      {
        url: `${process.env.REACT_APP_SERVER}/marketing-campaign/${id}`,
        method: 'DELETE',
      },
      false,
      false,
      'marketing'
    )
    if (response.status === 200) {
      fetchMarketingCampaign()
    }
  }
  const changeStatusMarketingCampaign = async (id) => {
    const response = await sendRequest(
      {
        url: `${process.env.REACT_APP_SERVER}/marketing-campaign/change-status/${id}`,
        method: 'PUT',
      },
      false,
      false,
      'marketing'
    )
    if (response.status === 200) {
      fetchMarketingCampaign()
    }
  }

  const handleEditChange = (field, value) => {
    setEditMarketing(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangeDate = (field, value) => {
    const formattedValue = moment(value, 'DD-MM-YYYY').format('DD-MM-YYYY');
    const formattedStartDate = moment(date.startDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
    const formattedEndDate = moment(date.endDate, 'DD-MM-YYYY').format('DD-MM-YYYY');

    if (field == 'startDate' && moment(formattedValue).isAfter(formattedEndDate)) {
      setDate({
        startDate: formattedEndDate,
        endDate: formattedValue
      });
    } else if (field == 'endDate' && moment(formattedValue).isBefore(formattedStartDate)) {
      setDate({
        startDate: formattedValue,
        endDate: formattedStartDate
      });
    } else {
      setDate(prev => ({
        ...prev,
        [field]: formattedValue
      }));
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const response = await sendRequest(
      {
        url: `${process.env.REACT_APP_SERVER}/marketing-campaign/${editMarketing._id}`,
        method: 'PUT',
        data: editMarketing
      },
      false,
      false,
      'marketing'
    )
    if (response.status === 200) {
      fetchMarketingCampaign()
      setOpenEdit(false)
    }

    setOpenEdit(false)
  }

  const handleChangeLayout = (e) => {
    localStorage.setItem('layout', JSON.stringify(e))
    setLayout(e)
  }

  const handleClickOpenPopover = (event) => {
    setAnchorElPopover(event.currentTarget);
  };

  const handleClickOpenMenuAddCard = (event) => {
    setAnchorElMenuAddChart(event.currentTarget)
  }

  const handleClosePopover = () => {
    setAnchorElPopover(null);
  };

  const handleCloseMenuCard = () => {
    setAnchorElMenuCard(null)
  }

  const handleCloseMenuDoughnut = () => {
    setAnchorElMenuDoughnut(null)
  }

  const handleCloseMenuChild = () => {
    setAnchorElMenuChild(null)
  }

  const handleCloseMenuAddChart = () => {
    setAnchorElMenuAddChart(null)
  }

  const handleClickOpenMenuCard = (event) => {
    const elementCurrentTarget = event.currentTarget;
    setCurrentMenuCardTargetId(elementCurrentTarget.getAttribute("id"));
    setAnchorElMenuCard(elementCurrentTarget);
  }

  const handleClickOpenMenuDoughnut = (event) => {
    const elementCurrentTarget = event.currentTarget;
    setAnchorElMenuDoughnut(elementCurrentTarget)
  }

  const handleOpenMenuChild = (event, options) => {
    setOptionsMenuChild(options)
    setAnchorElMenuChild(event.currentTarget)
  }

  const addCard = (card) => {
    const checkExistCard = listCard.find(element => element.key === card.key)
    if (checkExistCard) {
      // toast.error("Dữ liệu đơn này đã tồn tại ở dashboard, hãy kiểm tra lại.")
      toast.error(
        <ServerResponseAlert
          type='error'
          title={'general.error'}
          content={['Dữ liệu đơn này đã tồn tại ở dashboard, hãy kiểm tra lại.']}
        />,
        { containerId: 'toast-notification' }
      )
      return;
    }
    setAnchorElMenuChild(null)
    setAnchorElMenuAddChart(null)
    const newLayout = LayoutDefault.find(element => element.i === card.key)
    const setLayoutCard = { ...card, layout: newLayout }
    // setLayout(...layout, newLayout)
    const listCardCurrent = JSON.parse(localStorage.getItem("listCard"))
    localStorage.setItem("listCard", JSON.stringify([...listCardCurrent, card.key]))
    localStorage.setItem("layout", JSON.stringify([...layout, newLayout]))
    setListCard([...listCard, setLayoutCard])
  }

  const addDoughnut = () => {
    if (doughnutCurrentListKeyTarget?.length > 0) {
      toast.error(
        <ServerResponseAlert
          type='error'
          title={'general.error'}
          content={['Dữ liệu dạng biểu đồ tròn đã tồn tại ở dashboard, hãy kiểm tra lại.']}
        />,
        { containerId: 'toast-notification' }
      )
      return;
    }
    const defaultDoughnut = ["costs"];
    setDoughnutCurrentListKeyTarget(defaultDoughnut);
    localStorage.setItem("doughnut", JSON.stringify(defaultDoughnut));
    setAnchorElMenuAddChart(null);
    setAnchorElMenuChild(null);
  }

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

  return (
    <>
          <div>
            <TableContainer component={Paper} sx={{ minWidth: 700, maxHeight: 480, overflowY: scroll }}>
              <Table sx={{ minWidth: 700, maxHeight: 500, overflowY: scroll }} aria-label='customized table'>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#asad' }}>
                    <StyledTableCell>Tên </StyledTableCell>
                    <StyledTableCell>
                      Thời gian sửa gần nhất
                    </StyledTableCell>
                    <StyledTableCell>Kênh tiếp thị</StyledTableCell>
                    <StyledTableCell>Chi phí</StyledTableCell>
                    <StyledTableCell>Trạng thái</StyledTableCell>
                    <StyledTableCell>Hành động</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {marketingCampaign.map((row) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell component='th' scope='row'>
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell>{moment(row.createdAt).format('YYYY-MM-DD')}</StyledTableCell>
                      <StyledTableCell>{row.channel}</StyledTableCell>
                      <StyledTableCell>{row.cost}</StyledTableCell>
                      <StyledTableCell>
                        <label className="switch">
                          <input type="checkbox" checked={!row.status} onChange={() => changeStatusMarketingCampaign(row._id)} />
                          <span className="slider round"></span>
                        </label>
                      </StyledTableCell>
                      <StyledTableCell>
                        <EditIcon
                          onClick={() => handleOpenEdit(row)}
                          sx={{
                            height: '24px',
                            width: '24px',
                            color: '#ffc10a',
                            marginRight: '10px',
                          }}
                        />

                        <Link to='/marketing-campaign-id'>
                          <InfoIcon
                            sx={{
                              height: '24px',
                              width: '24px',
                              color: '#1f77b4'
                            }}
                          />
                        </Link>
                        <DeleteIcon
                          sx={{
                            height: '24px',
                            width: '24px',
                            marginLeft: '10px',
                            color: 'red'
                          }}
                          onClick={() => deleteCampaign(row._id)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
                <Modal open={openEdit} onClose={handleCloseEdit} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                  <Box sx={{ ...style, width: 700, '& .MuiTextField-root': { m: 1, width: '25ch' } }} component='form' noValidate autoComplete='off'>
                    <CloseIcon
                      onClick={handleCloseEdit}
                      className='close-icon'
                      sx={{
                        width: '24px',
                        height: '24px',
                      }}
                    />
                    <form className='row'>
                      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                        <div className='form-group'>
                          <label className='form-control-static'>Tên chiến dịch</label>
                          <input
                            type='text'
                            className='form-control'
                            value={editMarketing.name}
                            onChange={(e) => handleEditChange('name', e.target.value)}
                            placeholder='Quý 1 2024'
                            autoComplete='off'
                          />
                        </div>
                        <div className='form-group'>
                          <label>{translate('menu.marketing_channels_select')}</label>
                          <SelectBox
                            id={`select-good-issue-create-material-select2`}
                            className='form-control select2'
                            style={{ width: '100%' }}
                            value={editMarketing.channel}
                            items={options}
                            onChange={(e) => handleEditChange('channel', e[0])}
                            multiple={false}
                          />
                        </div>
                      </div>
                      <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                        <div className='form-group'>
                          <label>Chi phí</label>
                          <input
                            type='text'
                            className='form-control'
                            value={editMarketing.cost}
                            onChange={(e) => handleEditChange('cost', e.target.value)}
                            placeholder='1000$'
                            autoComplete='off'
                          />
                        </div>
                      </div>
                      {/* <button onClick={handleSubmitEdit}  className='submit-button'>Sửa</button>
                      <button onClick={handleCloseEdit} className="close-button close-submit-button">
                        Đóng
                      </button> */}
                      <button onClick={handleSubmitEdit} className="btn btn-success btn-on-right">
                        Sửa
                      </button>
                      <button onClick={handleCloseEdit} className="btn btn-danger btn-on-right">
                        Đóng
                      </button>
                    </form>
                  </Box>
                </Modal>
              </Table>
            </TableContainer>
          </div>

          <div className="button-container">
            {/* <ColorButton onClick={handleOpenAddCampaign} sx={{fontSize: 14, color: '#ffff' }} variant='contained'>
            Thêm chiến dịch
          </ColorButton> */}

            <button type="button" onClick={handleOpenAddCampaign} class="btn btn-success">  Thêm chiến dịch</button>
            <Modal open={openAddCampaign} onClose={handleCloseAddCampaign} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
              <Box sx={{ ...style, width: 700, '& .MuiTextField-root': { m: 1, width: '25ch' } }} component='form' noValidate autoComplete='off'>
                <CloseIcon
                  onClick={handleCloseAddCampaign}
                  className='close-icon'
                  sx={{
                    width: '24px',
                    height: '24px',
                  }}
                />
                <form className='row' onSubmit={handleSubmit}>
                  <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                    <div className='form-group'>
                      <label className='form-control-static'>Tên chiến dịch</label>
                      <input
                        type='text'
                        className='form-control'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Quý 1 2024'
                        autoComplete='off'
                      />
                    </div>
                    <div className='form-group'>
                      <label>{translate('menu.marketing_channels_select')}</label>
                      <SelectBox
                        id={`select-good-issue-create-material`}
                        className='form-control select2'
                        style={{ width: '100%' }}
                        value={channel}
                        items={options}
                        onChange={handleChangeChanel}
                        multiple={false}
                      />
                    </div>

                  </div>
                  <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
                    <div className='form-group'>
                      <label>Chi phí</label>
                      <input
                        type='text'
                        className='form-control'
                        value={cost}
                        onChange={(e) => { setCost(e.target.value); }}
                        placeholder='1000$'
                        autoComplete='off'
                      />
                    </div>
                  </div>
                  {/* <button onClick={handleSubmit} className='submit-button'></button> */}
                  <button type="button" onClick={handleSubmit} class="btn btn-success btn-on-right"> Thêm</button>
                  <button onClick={handleCloseAddCampaign} className="btn btn-danger btn-on-right">
                    Đóng
                  </button>
                </form>

              </Box>
            </Modal>
          </div>
    </>
  )
}

const mapState = (state) => {
  const { department, createEmployeeKpiSet, user, createKpiUnit, auth } = state
  return { department, createEmployeeKpiSet, user, createKpiUnit, auth }
}

export default connect(mapState)(withTranslate(MarketingCampaignComponent))
