import React, { useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { Collapse, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import './kpiUnitAllocation.scss'

function Row({ name, kpisDetail, onEditKpi }) {
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editedValue, setEditedValue] = useState('')

  const formatNumber = (number) => {
    return number.toLocaleString('en-US')
  }

  const handleEditItem = (kpi) => {
    setEditingId(kpi._id)
    setEditedValue(kpi.target || '')
  }

  const handleSaveItem = (kpi) => {
    onEditKpi(kpi._id, editedValue)
    setEditingId(null)
  }

  const renderIcon = (kpi) => {
    if (kpi.type === 0) {
      if (editingId === kpi._id) {
        return <SaveIcon className='cursor-pointer' onClick={() => handleSaveItem(kpi)} />
      }
      return <EditIcon className='cursor-pointer' onClick={() => handleEditItem(kpi)} />
    }
    return null
  }

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{name}</TableCell>
        <TableCell align='right' />
        <TableCell align='right' />
        <TableCell align='right' />
        <TableCell align='right' />
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell className='text-bold'>Mục tiêu</TableCell>
                    <TableCell>Tiêu chí đánh giá</TableCell>
                    <TableCell>Khối lượng KPI thực thi</TableCell>
                    <TableCell>Đơn vị</TableCell>
                    <TableCell>Khối lượng phòng ban</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {kpisDetail.map((kpi) => (
                    <TableRow key={kpi._id}>
                      <TableCell className='max-w-xs overflow-hidden whitespace-nowrap truncate'>{kpi.name}</TableCell>
                      <TableCell className='max-w-xs overflow-hidden whitespace-nowrap truncate'>{kpi.criteria}</TableCell>
                      <TableCell>
                        {editingId === kpi._id ? (
                          <TextField
                            value={editedValue}
                            onChange={(e) => setEditedValue(e.target.value)}
                            onBlur={() => handleSaveItem(kpi)}
                            autoFocus
                          />
                        ) : (
                          <>
                            {!kpi.target ? 'Hoàn thành mục tiêu' : formatNumber(kpi.target)} {kpi.unit ? `(${kpi.unit})` : ''}
                          </>
                        )}
                      </TableCell>
                      <TableCell>{kpi.unit ? `${kpi.unit}` : 'None'}</TableCell>
                      <TableCell>{kpi.parent.target ? formatNumber(kpi.parent.target) : 'Hoàn thành mục tiêu'}</TableCell>
                      <TableCell>{renderIcon(kpi)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

function EmployeeKpi({ rows, onEditKpi }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Nhân sự</TableCell>
            <TableCell />
            <TableCell />
            <TableCell />
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.assigner.name} name={row.assigner.name} kpisDetail={row.kpis} onEditKpi={onEditKpi} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default EmployeeKpi
