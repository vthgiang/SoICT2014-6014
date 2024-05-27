import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { Button } from '@mui/material'
import * as React from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
// import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Link } from 'react-router-dom'
import { green } from '@mui/material/colors'
import TextField from '@mui/material/TextField'
import './style.css'
// import { connect } from 'react-redux';
import { SelectBox, DatePicker } from '../../../../../common-components'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'

import './style.css'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
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
const rows_channel = [
  createData('Facebook', '125,254.4M', '103,098', '18,300,220', '4000', '120,256M'),
  createData('Google', '96,234.4M', '98,023', '16,200,205', '356', '60,234M'),
  createData('Tiktok', '90,100.3M', '92,478', '12,500,348', '480', '50,356M')
]
const rows_campaign = [
  createData('Chiến dịch Tết 2024', '125,254.4M', '103,098', '18,300,220', '4000', '120,256M'),
  createData('Quý 4 2023 ', '96,234.4M', '98,023', '16,200,205', '356', '60,234M'),
  createData('Chiến dịch giáng sinh 2023', '90,100.3M', '92,478', '12,500,348', '480', '50,356M'),
  createData('Chiến dịch Sale hè 2023', '88,398.1M', '91200', '11,222,556', '20', '24,891M'),
  createData('Chiến dịch Valentine 2023', '90,202.8M', '88000', '11,002,089', '11', '30,2M')
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

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

const MarketingCampaign = (props) => {
  const layout = [
    // { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
    // { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },

    { i: 'a', x: 0, y: 0, w: 3, h: 3, minW: 0, maxW: 6 },
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
    // { i: 'n', x: 6, y: 12, w: 9, h: 6, minW: 2, maxW: 24 },
    // { i: 'l', x: 15, y: 12, w: 9, h: 6, minW: 2, maxW: 24 }
  ]

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { translate } = props
  const labels = ['Facebook', 'Google', 'Tiktok']
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

  return (
    <>
      <div className='time-campaign-manage-container'>
        <div className='form-control-static'>Từ</div>
        <DatePicker
          id={`time-campaign-manage-from`}
          // value={createdAt}
          // onChange={handleCreatedAtChange}
          disabled={false}
          className='date-picker'
        />

        <div className='form-control-static'>Đến</div>

        <DatePicker
          id={`time-campaign-manage-to`}
          // value={createdAt}
          // onChange={handleCreatedAtChange}
          disabled={false}
          className='date-picker'
        />
      </div>
      <GridLayout className='layout' layout={layout} cols={24} rowHeight={30} width={1200} compactType={'vertical'}>
        <div key='a' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Costs</div>
            <div className='campaign-manage-minicard-number'>1,05B</div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -1.5%
            </div>
          </div>
        </div>
        <div key='b' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Clicks</div>
            <div className='campaign-manage-minicard-number'>2,1M</div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -5.9%
            </div>
          </div>
        </div>
        <div key='c' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Impressions</div>
            <div className='campaign-manage-minicard-number'>107,3M</div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -5.4%
            </div>
          </div>
        </div>
        <div key='d' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Sessions</div>
            <div className='campaign-manage-minicard-number'>8,3M</div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -6.75%
            </div>
          </div>
        </div>
        <div key='e' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> CPC</div>
            <div className='campaign-manage-minicard-number'>0,5K</div>
            <div className='campaign-manage-minicard-up'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              2.5%
            </div>
          </div>
        </div>
        <div key='f' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Transactions</div>
            <div className='campaign-manage-minicard-number'>100,1K</div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -6.0%
            </div>
          </div>
        </div>
        <div key='g' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> Revenue</div>
            <div className='campaign-manage-minicard-number'>748,4M</div>
            <div className='campaign-manage-minicard-up'>
              <ArrowUpwardIcon className='campaign-manage-minicard-icon' />
              -0.4%
            </div>
          </div>
        </div>
        <div key='i' className='item'>
          <div className='campaign-manage-minicard'>
            <div className='campaign-manage-minicard-label'> ROAS</div>
            <div className='campaign-manage-minicard-number'>1,713K</div>
            <div className='campaign-manage-minicard-down'>
              <ArrowDownwardIcon className='campaign-manage-minicard-icon' />
              -0.9%
            </div>
          </div>
        </div>

        <div key='h' className='item campaign-manage-top-campaign'>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#asad' }}>
                  <StyledTableCell>Channels </StyledTableCell>
                  <StyledTableCell>
                    Costs
                    <ArrowDropDownIcon />
                  </StyledTableCell>
                  <StyledTableCell>Clicks</StyledTableCell>
                  <StyledTableCell>Impressions</StyledTableCell>
                  <StyledTableCell>Transactions</StyledTableCell>
                  <StyledTableCell>Revenue</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows_channel.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component='th' scope='row'>
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell>{row.costs}</StyledTableCell>
                    <StyledTableCell>{row.clicks}</StyledTableCell>
                    <StyledTableCell>{row.impressions}</StyledTableCell>
                    <StyledTableCell>{row.transactions}</StyledTableCell>
                    <StyledTableCell>{row.revenue}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
            {rows_campaign.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component='th' scope='row'>
                  {row.name}
                </StyledTableCell>
                <StyledTableCell>{row.costs}</StyledTableCell>
                <StyledTableCell>{row.clicks}</StyledTableCell>
                <StyledTableCell>{row.impressions}</StyledTableCell>
                <StyledTableCell>{row.transactions}</StyledTableCell>
                <StyledTableCell>{row.revenue}</StyledTableCell>
                <StyledTableCell>
                  <Link to='/marketing-campaign-id'>See more</Link>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ColorButton onClick={handleOpen} sx={{ marginBottom: 2, fontSize: 14, color: '#ffff' }} variant='contained'>
        Thêm chiến dịch
      </ColorButton>
      <Modal open={open} onClose={handleClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
        <Box sx={{ ...style, width: 700, '& .MuiTextField-root': { m: 1, width: '25ch' } }} component='form' noValidate autoComplete='off'>
          <h3 id='parent-modal-title'>Thêm chiến dịch</h3>
          <div className='row'>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className='form-group'>
                <label className='form-control-static'>Tên chiến dịch</label>
                <input
                  type='text'
                  className='form-control'
                  // value={code} onChange={handleCodeChange}
                  placeholder='Quý 1 2024'
                  autoComplete='off'
                />
              </div>
              <div className={`form-group`}>
                <label>{translate('menu.marketing_channels_select')}</label>
                <SelectBox
                  id={`select-good-issue-create-material`}
                  className='form-control select2'
                  style={{ width: '100%' }}
                  // value={good.goodId}
                  // items={this.getMaterialArr()}
                  // onChange={this.handleGoodChange}
                  multiple={false}
                />
              </div>
              <div className='form-group'>
                <label className='form-control-static'>Từ</label>

                <DatePicker
                  id={`time-campaign-from`}
                  // value={createdAt}
                  // onChange={handleCreatedAtChange}
                  disabled={false}
                />
              </div>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6'>
              <div className='form-group'>
                <label className='form-control-static'>Mục tiêu</label>
                <input
                  type='text'
                  className='form-control'
                  // value={code} onChange={handleCodeChange}
                  placeholder='ROI 50%'
                  autoComplete='off'
                />
              </div>
              <div className='form-group'>
                <label>Chi phí</label>
                <input
                  type='text'
                  className='form-control'
                  // value={code} onChange={handleCodeChange}
                  placeholder='1000$'
                  autoComplete='off'
                />
              </div>

              <div className='form-group'>
                <label className='form-control-static'>Đến</label>

                <DatePicker
                  id={`time-campaign-to`}
                  // value={createdAt}
                  // onChange={handleCreatedAtChange}
                  disabled={false}
                />
              </div>
            </div>
          </div>
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
