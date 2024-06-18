import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import { dashboardOrganizationalUnitKpiActions } from '../redux/actions'
import { UserActions } from '../../../../super-admin/user/redux/actions'
import { DialogModal } from '../../../../../common-components'
import './kpiUnitAllocation.scss'
import Tabs from '@mui/material/Tabs'
import EmployeeKpi from './employeeKpiTableComponent'
import EmployeeGanttChartUnit from './employeeGanttChartUnit'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

function KpiUnitAllocation() {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const currentRole = localStorage.getItem('currentRole')
  const currentUserUnitId = user?.userdepartments?._id
  const kpiAllocationUnitResult = useSelector((state) => state.dashboardOrganizationalUnitKpi?.kpiAllocationUnitResult)
  const [value, setValue] = useState(0)
  const [editedKpiAllocationUnitResult, setEditedKpiAllocationUnitResult] = useState(null)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    dispatch(UserActions.getAllUserSameDepartment(currentRole))
    if (currentUserUnitId) dispatch(dashboardOrganizationalUnitKpiActions.getAllAllocationAssignUnitResult(currentUserUnitId))
  }, [dispatch, currentUserUnitId])

  useEffect(() => {
    if (kpiAllocationUnitResult) {
      setEditedKpiAllocationUnitResult(JSON.parse(JSON.stringify(kpiAllocationUnitResult)))
    }
  }, [kpiAllocationUnitResult])

  const handleSaveAllocationResult = () => {
    const payload = {
      userId: localStorage.getItem('userId'),
      kpiAllocationUnitResult: editedKpiAllocationUnitResult,
      currentUserUnitId
    }
    dispatch(dashboardOrganizationalUnitKpiActions.handleSaveAllocationResultUnit(payload))
  }

  const handleEditKpi = (id, newValue) => {
    if (editedKpiAllocationUnitResult) {
      const updatedKpiEmployee = editedKpiAllocationUnitResult.kpiEmployee.map((employee) => ({
        ...employee,
        kpis: employee.kpis.map((kpi) => (kpi._id === id ? { ...kpi, target: parseFloat(newValue) } : kpi))
      }))
      setEditedKpiAllocationUnitResult({ ...editedKpiAllocationUnitResult, kpiEmployee: updatedKpiEmployee })
    }
  }

  return (
    <DialogModal
      modalID='allocation-each-unit-result'
      size='80'
      isLoading={false}
      formID='form-allocation-each-unit-result'
      title='Dữ liệu phân bổ KPI đơn vị cho phòng ban'
      hasNote={false}
      func={handleSaveAllocationResult}
    >
      <div className='box box-defaul kpi-unit-allocation'>
        <div className='box-body'>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                <Tab label='Kpi đơn vị' {...a11yProps(0)} />
                <Tab label='Nhiệm vụ cá nhân' {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              {editedKpiAllocationUnitResult?.kpiEmployee && (
                <EmployeeKpi rows={editedKpiAllocationUnitResult.kpiEmployee} onEditKpi={handleEditKpi} />
              )}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {editedKpiAllocationUnitResult?.kpiEmployee && (
                <EmployeeGanttChartUnit data={editedKpiAllocationUnitResult.taskEmployeeIds} />
              )}
            </CustomTabPanel>
          </Box>
        </div>
      </div>
    </DialogModal>
  )
}

export default KpiUnitAllocation
