import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Button } from '@mui/material'
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
import MarketingEffeciveChanneTablel from './MarketingEffeciveChanneTablel';
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

const MarketingCampaign = (props) => {
  const [layout, setLayout] = React.useState(() => {
    const layoutDefault = JSON.parse(localStorage.getItem('layout'));
    if (layoutDefault) return layoutDefault
    return [{ i: 'a', x: 0, y: 0, w: 3, h: 3, minW: 0, maxW: 6 },
    { i: 'b', x: 3, y: 0, w: 3, h: 3, minW: 2, maxW: 6 },
    { i: 'c', x: 6, y: 0, w: 3, h: 3, minW: 2, maxW: 6 },
    { i: 'd', x: 9, y: 0, w: 3, h: 3, minW: 2, maxW: 6 },
    { i: 'e', x: 12, y: 0, w: 3, h: 3, minW: 2, maxW: 6 },
    { i: 'f', x: 15, y: 0, w: 3, h: 3, minW: 2, maxW: 6 },
    { i: 'g', x: 18, y: 0, w: 3, h: 3, minW: 2, maxW: 6 },
    { i: 'i', x: 21, y: 0, w: 3, h: 3, minW: 2, maxW: 6 },
    { i: 'h', x: 0, y: 4, w: 15, h: 7, minW: 2, maxW: 24 },
    { i: 'k', x: 15, y: 4, w: 9, h: 7, minW: 2, maxW: 24 },
    { i: 'm', x: 0, y: 13, w: 6, h: 6, minW: 2, maxW: 24 }
    ]
  }
  )
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
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
  // const labelSwitch = { inputProps: { 'aria-label': 'Open/Close' } };
  const data_channel_ROIM = {
    labels,
    datasets: [
      {
        label: 'Costs',
        data: [125254, 96234, 90100],
        backgroundColor: '#ff5252'
      },
      {
        label: 'Revenue',
        data: [120256, 60234, 50356],
        backgroundColor: '#1976d2'
      }
    ]
  }
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

  const data_channel_transaction = {
    labels: ['Facebook', 'Google', 'Tiktok'],
    datasets: [
      {
        label: '% of Transactions',
        data: [4000, 356, 480],
        backgroundColor: ['#1976d2', '#ff5252', '#9ccc65'],
        borderColor: ['#0d47a1', '#d50000', '#558b2f'],
        borderWidth: 1
      }
    ]
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
  const [isLoadingTopCampaign, setIsLoadingTopCampaign] = React.useState(false)
  const [topMarketingCampaign, setTopMarketingCampaign] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [marketingEffective, setMarketingEffective] = React.useState({})
  const [name, setName] = React.useState('')
  const [cost, setCost] = React.useState('')
  const [channel, setChannel] = React.useState('Facebook')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = { cost, channel, name }

    console.log(data);
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

  }
  //  const data =  MarketingCampaignServices.createMarketingCampaign({name, cost, channel})

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

  // const fetchMarketingEffective = async () => {
  //   setIsLoading(true)
  //   const response = await sendRequest(
  //     {
  //       url: `${process.env.REACT_APP_SERVER}/marketing-effective`,
  //       method: 'GET',
  //     },
  //     false,
  //     false,
  //     'marketing-effective'
  //   )
  //   if (response.status === 200) {
  //     setMarketingEffective(response.data.content[0])
  //   }
  //   setIsLoading(false)
  // }

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
        setMarketingEffective(response.data.content[0]);
      }
    } catch (error) {
      console.error('Error fetching marketing effective:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      console.log('a')
      setDate({
        startDate: formattedEndDate,
        endDate: formattedValue
      });
    } else if (field == 'endDate' && moment(formattedValue).isBefore(formattedStartDate)) {
      console.log('b')
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
  }

  const handleChangeLayout = (e) => {
    localStorage.setItem('layout', JSON.stringify(e))
    setLayout(e)
  }

  return (
    <>
      <div className='time-campaign-manage-container'>
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
      <GridLayout onLayoutChange={handleChangeLayout} className='layout' layout={layout} cols={24} rowHeight={30} width={1200} compactType={'vertical'}>
        <div key='a' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Costs</div>
            <div className='campaign-manage-minicard-number'>{isLoading ? <Loading /> : marketingEffective?.totalCost ? formatNumber(marketingEffective.totalCost) : 0}</div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -1.5%
            </div>
          </div>
        </div>
        <div key='b' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Clicks</div>
            <div className='campaign-manage-minicard-number'>{isLoading ? <Loading /> : marketingEffective?.totalClick ? formatNumber(marketingEffective.totalClick) : 0}
            </div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -5.9%
            </div>
          </div>
        </div>
        <div key='c' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Impressions</div>
            <div className='campaign-manage-minicard-number'>{isLoading ? <Loading /> : marketingEffective?.totalImpression ? formatNumber(marketingEffective.totalImpression) : 0}</div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -5.4%
            </div>
          </div>
        </div>
        <div key='d' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Sessions</div>
            <div className='campaign-manage-minicard-number'>{isLoading ? <Loading /> : marketingEffective?.totalSession ? formatNumber(marketingEffective.totalSession) : 0}</div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -6.75%
            </div>
          </div>
        </div>
        <div key='e' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> CPC</div>
            <div className='campaign-manage-minicard-number'>{isLoading ? <Loading /> : marketingEffective?.totalCost && marketingEffective?.totalClick ? formatNumber(marketingEffective.totalCost / marketingEffective.totalClick) : 0}</div>
            <div className='campaign-manage-minicard-up'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              2.5%
            </div>
          </div>
        </div>
        <div key='f' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Transactions</div>
            <div className='campaign-manage-minicard-number'>{isLoading ? <Loading /> : marketingEffective?.totalTransaction ? formatNumber(marketingEffective.totalTransaction) : 0}</div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -6.0%
            </div>
          </div>
        </div>
        <div key='g' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Revenue</div>
            <div className='campaign-manage-minicard-number'>{isLoading ? <Loading /> : marketingEffective?.totalRevenue ? formatNumber(marketingEffective.totalRevenue) : 0}</div>
            <div className='campaign-manage-minicard-up'>
              <ArrowUpwardIcon className='campaign-manage-minicard-icon' />
              -0.4%
            </div>
          </div>
        </div>
        <div key='i' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> ROIM</div>
            <div className='campaign-manage-minicard-number'>{isLoading ? <Loading /> : marketingEffective?.totalRevenue && marketingEffective?.totalCost ? formatNumber(marketingEffective.totalRevenue / marketingEffective.totalCost) : 0}</div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -0.9%
            </div>
          </div>
        </div>

        <div key='h' className='item campaign-manage-top-campaign'>
          <MarketingEffeciveChanneTablel></MarketingEffeciveChanneTablel>
        </div>
        <div key='k' className='item'>
          <Bar options={optionsBar} data={data_channel_ROIM} />;
        </div>
        <div key='m' className='item campaign-manage-top-campaign'>
          <Doughnut data={data_channel_transaction} />
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
                <BatchPredictionIcon
                  sx={{
                    height: '24px',
                    width: '24px',
                    color: 'green',
                    marginRight: '10px'
                  }}
                />
                <Link to='/marketing-campaign-id'>
                  <InfoIcon
                    sx={{
                      height: '24px',
                      width: '24px',
                      color: '#1976d2'
                    }}
                  />
                </Link>
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
                      color: 'green',
                      marginRight: '10px'
                    }}
                  />
                  <Link to='/marketing-campaign-id'>
                    <InfoIcon
                      sx={{
                        height: '24px',
                        width: '24px',
                        color: '#1976d2'
                      }}
                    />
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
            )) : null}
          </TableBody>
        </Table>
      </TableContainer>

      <ColorButton onClick={handleOpen} sx={{ marginBottom: 2, marginTop: 2, fontSize: 14, color: '#ffff' }} variant='contained'>
        Quản lý chiến dịch
      </ColorButton>
      <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={{ ...style, width: 1000, maxHeight: 700, '& .MuiTextField-root': { m: 1, width: '25ch' } }} component='form' noValidate autoComplete='off'>
          <h3 id='parent-modal-title'>Thêm chiến dịch</h3>
          <div>
            <TableContainer component={Paper} sx={{ minWidth: 700, maxHeight: 500, overflowY: scroll }}>
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
                              color: '#1976d2'
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
                      <button onClick={handleSubmitEdit}>Sửa</button>
                    </form>
                  </Box>
                </Modal>
              </Table>
            </TableContainer>
          </div>

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
            <button onClick={handleSubmit}>Thêm</button>
          </form>
        </Box>
      </Modal>
      <ColorButton onClick={handleOpenForecast} sx={{ marginBottom: 2, marginTop: 2, marginLeft: 2, fontSize: 14, color: '#ffff' }} variant='contained'>
        Dự báo
      </ColorButton>
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

export default connect(mapState)(withTranslate(MarketingCampaign))
