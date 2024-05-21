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

function createData(name, tstart, tend, goals, channel, costs, action) {
  return { name, tstart, tend, goals, channel, costs, action }
}

const rows = [
  createData('Chiến dịch Tết 2024', '29/1/2024', '29/2/2024', 'ROI 50%', 'Content marketing', '1.000$'),
  createData('Quý 4 2023 ', '1/10/2023', '28/12/2023', 'ROI 100%', 'Mails marketing', '1.600$'),
  createData('Chiến dịch giáng sinh 2023', '20/12/2023', '31/12/2023', 'ROI 200%', 'Content marketing', '500$'),
  createData('Chiến dịch Sale hè 2023', '19/5/2023', '19/8/2023', 'ROI 100%', 'Video marketing', '2.000$'),
  createData('Chiến dịch Valentine 2023', '1/1/2023', '15/2/2023', 'ROI 70%', 'Content marketing', '1.200$')
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

const MarketingCampaign = (props) => {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { translate } = props

  return (
    <>
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
                  id={`created-at-command-managemet-table`}
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
                  id={`created-at-command-managemet-table`}
                  // value={createdAt}
                  // onChange={handleCreatedAtChange}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </Box>
      </Modal>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#asad' }}>
              <StyledTableCell>Name </StyledTableCell>
              <StyledTableCell>From</StyledTableCell>
              <StyledTableCell>To</StyledTableCell>
              <StyledTableCell>Goals</StyledTableCell>
              <StyledTableCell>Channel</StyledTableCell>
              <StyledTableCell>Costs</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component='th' scope='row'>
                  {row.name}
                </StyledTableCell>
                <StyledTableCell>{row.tstart}</StyledTableCell>
                <StyledTableCell>{row.tend}</StyledTableCell>
                <StyledTableCell>{row.goals}</StyledTableCell>
                <StyledTableCell>{row.channel}</StyledTableCell>
                <StyledTableCell>{row.costs}</StyledTableCell>
                <StyledTableCell>
                  <Link to='/marketing-campaign-id'>See more</Link>
                  {/* <Button onClick={() => handleRedirect()}>See more</Button> */}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

const mapState = (state) => {
  const { department, createEmployeeKpiSet, user, createKpiUnit, auth } = state
  return { department, createEmployeeKpiSet, user, createKpiUnit, auth }
}

export default connect(mapState)(withTranslate(MarketingCampaign))
