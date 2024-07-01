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
import { DialogModal, ErrorLabel } from '../../../../../common-components'
import { Link } from 'react-router-dom'
import { green } from '@mui/material/colors'
import TextField from '@mui/material/TextField'
import './style.css'
// import { connect } from 'react-redux';
import { SelectBox, DatePicker, Loading } from '../../../../../common-components'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import Switch from '@mui/material/Switch';
import './style.css'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
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
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ServerResponseAlert from '../../../../alert/components/serverResponseAlert';
import { Popover } from '@mui/material';
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
import { Bar, Doughnut } from 'react-chartjs-2'
import { sendRequest } from '../../../../../helpers/requestHelper';
import moment from 'moment';
import { toast } from 'react-toastify';
import MarketingEffeciveChannelTable from './MarketingEffeciveChannelTable';
import MarketingCampaignDetail from './CampaignDetail';
import QuestionMark from '@mui/icons-material/QuestionMark';
import { element } from 'prop-types';
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

function createData(name, costs, clicks, impressions, transactions, revenue, action) {
  return { name, costs, clicks, impressions, transactions, revenue, action }
}
const rows_campaign = [
  createData('Chiến dịch Tết 2024', '125,254.4M', '103,098', '18,300,220', '4000', '120,256M'),
  createData('Quý 4 2023 ', '96,234.4M', '98,023', '16,200,205', '356', '60,234M'),
  createData('Chiến dịch giáng sinh 2023', '90,100.3M', '92,478', '12,500,348', '480', '50,356M'),
  createData('Chiến dịch Sale hè 2023', '88,398.1M', '91200', '11,222,556', '20', '24,891M'),
  createData('Chiến dịch Valentine 2023', '90,202.8M', '88000', '11,002,089', '11', '30,2M')
]
function createDataCampaign(name, timestart, channel, cost, status) {
  return { name, timestart, channel, cost, status }
}
const rows_campaign_manage = [
  createDataCampaign('Chiến dịch Tết 2024', '4-6-2023', 'Facebook', '120,256M'),
  createDataCampaign('Quý 4 2023 ', '5-7-2023', 'Facebook', '60,234M'),
  createDataCampaign('Chiến dịch giáng sinh 2023', '12-12-2023', 'Facebook', '50,356M'),
  createDataCampaign('Chiến dịch Sale hè 2023', '12-12-2023', 'Facebook', '24,891M'),
  createDataCampaign('Chiến dịch Valentine 2023', '12-12-2023', 'Facebook', '30,2M')
]
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
  const handleOpenEdit = (item) => {
    setOpenEdit(true);
    setEditMarketing(item)
  }
  const handleCloseEdit = () => setOpenEdit(false)
  const [editMarketing, setEditMarketing] = React.useState({});
  const [content, setContent] = React.useState('');

  const handleButtonClick = (buttonType) => {
    if (buttonType === 'button1') {
      setContent('upload');
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
    const channels = data.length > 0 && data.map(item => item._id);
    const trans = data.length > 0 && data.map(item => item.totalTransaction);

    return {
      labels: channels,
      datasets: [
        {
          label: '% of Transactions',
          data: trans,
          backgroundColor: ['#1f77b4', '#d62728', '#28a745'],
          borderColor: ['#0d47a1', '#d50000', '#558b2f'],
          borderWidth: 1
        }
      ]
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
  const idPopoverTarget = openPopover ? 'simple-popover' : undefined;

  const deleteCard = (key) => {
    const condition = (element) => element.key === key;
    const newListCard = listCard.filter(element => !condition(element))
    const newListKeyCard = newListCard.map(element => element.key);
    localStorage.setItem("listCard", JSON.stringify(newListKeyCard))
    setListCard(newListCard)
    setAnchorElMenuCard(null)
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

  const optionsMenuAddCard = [
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
    },
    {
      title: "Dữ liệu dạng biểu đồ"
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
        console.log(response.data.content.currentTotals);
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
      marketingEffectiveTotal: (marketingEffective.totalRevenue && marketingEffective.totalCost) ? marketingEffective.totalRevenue / marketingEffective.totalCost *100 : 0,
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

  const handleOpenMenuChild = (event, options) => {
    setOptionsMenuChild(options)
    setAnchorElMenuChild(event.currentTarget)
  }

  const addCard = (card) => {
    const checkExistCard = listCard.find(element => element.key === card.key)
    if (checkExistCard) {
      // toast.error("Dữ liệu đơn này đã tồn tại ở dashboard, hãy kiểm tra lại.")
      toast.error("Dữ liệu đơn này đã tồn tại ở dashboard, hãy kiểm tra lại.", {
        position: toast.POSITION.TOP_CENTER,
      });
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

  return (
    <>
      <div className='time-campaign-manage-container'>
        <div style={{ display: 'flex' }}>

          <div className='form-control-static'>Từ</div>
          <DatePicker
            id={`time-campaign-manage-from`}
            value={date.startDate}
            onChange={(e) => handleChangeDate('startDate', e)}
            disabled={false}
            className='date-picker'
          />

          <div className='form-control-static'>Đến</div>

          <DatePicker
            id={`time-campaign-manage-to`}
            value={date.endDate}
            onChange={(e) => handleChangeDate('endDate', e)}
            disabled={false}
            className='date-picker'
          />
        </div>

        <button type="button" class="btn btn-success" onClick={handleClickOpenMenuAddCard}>Thêm thống kê</button>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorElMenuAddChart}
          open={openMenuAddChart}
          onClose={handleCloseMenuAddChart}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          {optionsMenuAddCard.map((option) => (
            <MenuItem key={option.title}
              onClick={
                (event) =>
                  option.child.length > 0 ? handleOpenMenuChild(event, option.child) : option.onClick()
              }
            >
              {option.title}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <Popover
        id={idPopoverTarget}
        open={openPopover}
        anchorEl={anchorElPopover}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorElMenuCard}
        open={openMenuCard}
        onClose={handleCloseMenuCard}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      // PaperProps={{
      //   style: {
      //     maxHeight: ITEM_HEIGHT * 4.5,
      //     width: '20ch',
      //   },
      // }}
      >
        {optionsMenuCard.map((option) => (
          <MenuItem key={option.title}
            onClick={
              (event) =>
                option.child.length > 0 ? handleOpenMenuChild(event, option.child) : option.onClick()
            }
          >
            {option.title}
          </MenuItem>
        ))}
      </Menu>
      {/*Menu child */}
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorElMenuChild}
        open={openMenuChild}
        onClose={handleCloseMenuChild}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      // PaperProps={{
      //   style: {
      //     maxHeight: ITEM_HEIGHT * 4.5,
      //     width: '20ch',
      //   },
      // }}
      >
        {optionsMenuChild.map((option) => (
          <MenuItem key={option.title} selected={option === 'Pyxis'} onClick={() => option.onClick()}>
            {option.title}
          </MenuItem>
        ))}
      </Menu>
      <GridLayout
        draggableHandle=".react-grid-dragHandleExample"
        onLayoutChange={handleChangeLayout}
        className='layout'
        cols={24}
        rowHeight={30} width={1200} compactType={'vertical'}>
        {/* Class của to chứa nội dung item */}
        {
          listCard.map((card, index) => {
            return card.key ? (
              <div key={card.key} className='item' data-grid={card.layout} >
                <div className='item-icon'>
                  {/*Info icon */}
                  <div className='item-icon-info'>
                    <InfoIcon style={{ fontSize: "20px", color: "#4a3e3e" }} onClick={handleClickOpenPopover} />
                  </div>
                </div>
                {/*Liệt kê các button trong thẻ item-action */}
                <div className='item-action-menu'>
                  <IconButton
                    aria-label="more"
                    id={`${card.key}`}
                    aria-controls={openMenuCard ? 'long-menu' : undefined}
                    aria-expanded={openMenuCard ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClickOpenMenuCard}
                    key={card.key}
                  >
                    {/* <MoreVertIcon /> */}
                    <MoreHorizIcon />
                  </IconButton>
                </div>
                <div className='item-content react-grid-dragHandleExample'>
                  <span className={`campaign-manage-minicard-image campaign-manage-minicard-image-${card?.percentChangeTotal >= 0 ? 'green react-grid-dragHandleExample' : 'red react-grid-dragHandleExample'}`}>
                    {card.image}
                  </span>
                  <div className='campaign-manage-minicard'>
                    <div className='campaign-manage-minicard-label'> {card?.title}</div>
                    <div className='campaign-manage-minicard-number'>{isLoading ? <Loading /> : card.marketingEffectiveTotal ? formatNumber(card.marketingEffectiveTotal) : 0}</div>
                    <div className={`campaign-manage-minicard-${card?.percentChangeTotal >= 0 ? 'up' : 'down'}`}>
                      {card?.percentChangeTotal ? <>
                        {card?.percentChangeTotal >= 0 ? <ArrowUpwardIcon className='campaign-manage-minicard-icon' /> : <ArrowDownwardIcon className='campaign-manage-minicard-icon' />}
                        {card?.percentChangeTotal}%
                      </> : null}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={'custom'} className='item' data-grid={{ i: 'custom', x: 0, y: 13, w: 6, h: 6, minW: 2, maxW: 24 }} >
                Choose
              </div>
            )
          })
        }

        <div key='h' className='item campaign-manage-top-campaign' data-grid={{ i: 'h', x: 0, y: 6, w: 15, h: 7, minW: 2, maxW: 24 }}>
          <MarketingEffeciveChannelTable marketingEffectiveChannel={marketingEffectiveChannel} isLoading={isLoadingMarketingChanel}></MarketingEffeciveChannelTable>
        </div>
        <div key='k' className='item' data-grid={{ i: 'k', x: 15, y: 6, w: 9, h: 7, minW: 2, maxW: 24 }}>
          <Bar options={optionsBar} data={convertDataBar(marketingEffectiveChannel)} />;
        </div>
        <div key='m' className='item campaign-manage-top-campaign' data-grid={{ i: 'm', x: 0, y: 13, w: 6, h: 6, minW: 2, maxW: 24 }}>
          <Doughnut data={convertDataChannelTrans(marketingEffectiveChannel)} />
        </div>
        {/* <div key='n' className='item campaign-manage-top-campaign'>
          n
        </div>
        <div key='l' className='item campaign-manage-top-campaign'>
          l
        </div> */}
      </GridLayout>

      <div className='campaign-manage-top-campaign-title'>
        <FormatListNumberedIcon
          sx={{
            height: '24px',
            width: '24px',
            marginRight: '10px'
          }}
        />
        <div className='campaign-manage-top-campaign-label'> Top Campaigns</div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#asad' }}>
              <StyledTableCell>Name </StyledTableCell>
              <StyledTableCell>
                Costs
                <ArrowDropDownIcon />
              </StyledTableCell>
              <StyledTableCell>Clicks</StyledTableCell>
              <StyledTableCell>Impressions</StyledTableCell>
              <StyledTableCell>Transactions</StyledTableCell>
              <StyledTableCell>Revenue</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoadingTopCampaign && <StyledTableRow>
              <StyledTableCell component='th' scope='row'>
                <Loading />
              </StyledTableCell>
              <StyledTableCell> <Loading /></StyledTableCell>
              <StyledTableCell> <Loading /></StyledTableCell>
              <StyledTableCell> <Loading /></StyledTableCell>
              <StyledTableCell> <Loading /></StyledTableCell>
              <StyledTableCell> <Loading /></StyledTableCell>
              <StyledTableCell>
                <Loading />
              </StyledTableCell>
            </StyledTableRow>}
            {topMarketingCampaign.length ? topMarketingCampaign.map((row) => (
              <StyledTableRow key={row._id}>
                <StyledTableCell component='th' scope='row'>
                  {row.name}
                </StyledTableCell>
                <StyledTableCell>{formatNumber(row.totalCost)}</StyledTableCell>
                <StyledTableCell>{formatNumber(row.totalClick)}</StyledTableCell>
                <StyledTableCell>{formatNumber(row.totalImpression)}</StyledTableCell>
                <StyledTableCell>{formatNumber(row.totalTransaction)}</StyledTableCell>
                <StyledTableCell>{formatNumber(row.totalRevenue)}</StyledTableCell>
                <StyledTableCell>
                  <BatchPredictionIcon
                    sx={{
                      height: '24px',
                      width: '24px',
                      color: '#28a745',
                      marginRight: '10px'
                    }}
                  />
                  {/* <Link to='/marketing-campaign-id'>
                  </Link> */}
                  <InfoIcon
                    sx={{
                      height: '24px',
                      width: '24px',
                      color: '#1f77b4'
                    }}
                    onClick={() => fetchMarketingEffectiveByCampaignId(row._id)}
                  />
                  <Modal open={openDetail} onClose={handleCloseDetail} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
                    <Box sx={{ ...style, width: 1300, '& .MuiTextField-root': { m: 1, width: '25ch' } }} component='form' noValidate autoComplete='off'>
                      <CloseIcon
                        onClick={handleCloseDetail}
                        className='close-icon'
                        sx={{
                          width: '24px',
                          height: '24px',
                        }}
                      />
                      <MarketingCampaignDetail marketingCampaignDetail={marketingCampaignDetail}></MarketingCampaignDetail>
                    </Box>
                  </Modal>

                </StyledTableCell>
              </StyledTableRow>
            )) : null}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <ColorButton onClick={handleOpen} sx={{ marginBottom: 2, marginTop: 2, fontSize: 14, color: '#ffff' }} variant='contained'>
        Quản lý chiến dịch
      </ColorButton> */}
      <button type="button" onClick={handleOpen} class="btn btn-success btn-on-right">Quản lý chiến dịch</button>

      <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={{ ...style, width: 1000, maxHeight: 700, '& .MuiTextField-root': { m: 1, width: '25ch' } }} component='form' noValidate autoComplete='off'>
          <div id='parent-modal-title'>Quản lý chiến dịch</div>

          <CloseIcon
            onClick={handleClose}
            className='close-icon'
            sx={{
              width: '24px',
              height: '24px',
            }}
          />
          <div>
            <TableContainer component={Paper} sx={{ minWidth: 700, maxHeight: 480, overflowY: scroll }}>
              <Table sx={{ minWidth: 700, maxHeight: 500, overflowY: scroll }} aria-label='customized table'>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#asad' }}>
                    <StyledTableCell>Name </StyledTableCell>
                    <StyledTableCell>
                      Time start
                    </StyledTableCell>
                    <StyledTableCell>Channel</StyledTableCell>
                    <StyledTableCell>Cost</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Action</StyledTableCell>
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
            <button onClick={handleClose} className="btn btn-danger">
              Đóng
            </button>
          </div>
        </Box>
      </Modal>
      {/* <ColorButton onClick={handleOpenForecast} sx={{ marginBottom: 2, marginTop: 2, marginLeft: 2, fontSize: 14, color: '#ffff' }} variant='contained'>
        Dự báo
      </ColorButton> */}
      <button type="button" onClick={handleOpenForecast} class="btn btn-success btn-on-right">  Dự báo</button>
      <Modal open={openForecast} onClose={handleCloseForecast} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={{ ...style, width: 700, '& .MuiTextField-root': { m: 1, width: '25ch' } }} component='form' noValidate autoComplete='off'>
          <ColorButton onClick={() => handleButtonClick('button1')} sx={{ marginBottom: 2, marginTop: 2, fontSize: 14, color: '#ffff' }} variant='contained'>
            Dự báo phản hồi người dùng
          </ColorButton>
          <ColorButton onClick={() => handleButtonClick('button2')} sx={{ marginBottom: 2, marginTop: 2, marginLeft: 8, fontSize: 14, color: '#ffff' }} variant='contained'>
            Dự báo lợi nhuận từ tiếp thị
          </ColorButton>
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
        </Box>
      </Modal>
    </>
  )
}

const mapState = (state) => {
  const { department, createEmployeeKpiSet, user, createKpiUnit, auth } = state
  return { department, createEmployeeKpiSet, user, createKpiUnit, auth }
}

export default connect(mapState)(withTranslate(MarketingCampaignComponent))
