/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import { useTranslate } from 'react-redux-multilingual'
import { Backdrop, Box, CircularProgress, Tab, Tabs } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import KpiAllocationEachUnitResult from './kpiAllocationEachUnitResult'
import { ConfigParametersAction } from './redux/actions'

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

function AllocationResult({ listUnitKpi }) {
  const [listUnitKpiTree, setListUnitKpiTree] = useState([])
  const [listTask, setListTask] = useState([])
  const [listResourceKpi, setListResource] = useState([])
  const translate = useTranslate()
  const [activeTab, setActiveTab] = useState(0)
  const [listTab, setListTab] = useState([])
  const [tabSelectedUnitKpiTree, setTabSelectedUnitKpiTree] = useState({})
  const [value, setValue] = useState(0)
  const allocationResult = useSelector((state) => state.configParametersReducer.allocationResult)
  const isLoading = useSelector((state) => state.configParametersReducer.isLoading)

  const { responseOutput = {}, payload = {} } = allocationResult ?? {}
  const { content = {} } = responseOutput ?? {}
  const { list_unit_kpi = [], list_resource_kpi = [] } = content ?? {}
  const { listEnterpriseGoal = [], listEnterpriseUnit = [] } = payload
  const dispatch = useDispatch()

  useEffect(() => {
    if (list_unit_kpi.length === 0 || listEnterpriseGoal.length === 0) {
      setListUnitKpiTree([])
      setListTab([])
      setTabSelectedUnitKpiTree(null)
      setListResource([])
      return
    }

    // Handle the combined goals
    const combinedGoals = listEnterpriseGoal.map((enterpriseGoal) => {
      const units = list_unit_kpi
        .map((unitKpi) => {
          const matchingMetric = unitKpi.unit_list_metric?.find((metric) => metric.id === enterpriseGoal.id)
          return matchingMetric
            ? {
                unit_id: unitKpi.unit_id,
                unit_name: unitKpi.unit_name,
                planed_value: matchingMetric.planed_value,
                value_unit: matchingMetric.unit
              }
            : null
        })
        .filter(Boolean)

      return {
        ...enterpriseGoal,
        units
      }
    })

    setListUnitKpiTree(combinedGoals)

    const listTabGoal = listEnterpriseGoal.map((item, index) => ({
      id: item.id,
      description: item.description,
      value: index,
      isActive: index === 0
    }))

    setListTab(listTabGoal)
    setTabSelectedUnitKpiTree(combinedGoals[0])

    // Handle the resource KPIs
    const allResourceKpi = list_resource_kpi.flatMap(
      (item) =>
        item.metric_resource?.map((kpi) => ({
          ...item,
          ...kpi,
          metric_resource: undefined
        })) ?? []
    )

    const listResourceFitKpi = combinedGoals[0].units
      .map((unit) => {
        return allResourceKpi.map((resource) => {
          if (resource.company_unit_id === unit.unit_id && combinedGoals[0].description === resource.description) {
            return resource
          }
          return undefined
        })
      })
      .flat()
      .filter((item) => item !== undefined)

    const departmentsWithKpi = listEnterpriseUnit.map((department) => {
      const listEmployeeKpi = listResourceFitKpi.filter((employee) => employee.company_unit_id === department.id)
      return {
        ...department,
        listEmployeeKpi
      }
    })

    setListResource(departmentsWithKpi)
  }, [allocationResult])

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setTabSelectedUnitKpiTree(listUnitKpiTree[newValue])

    // Handle the resource KPIs
    const allResourceKpi = list_resource_kpi.flatMap(
      (item) =>
        item.metric_resource?.map((kpi) => ({
          ...item,
          ...kpi,
          metric_resource: undefined
        })) ?? []
    )

    const listResourceFitKpi = listUnitKpiTree[newValue].units
      .map((unit) => {
        return allResourceKpi.map((resource) => {
          if (resource.company_unit_id === unit.unit_id && listUnitKpiTree[newValue].description === resource.description) {
            return resource
          }
          return undefined
        })
      })
      .flat()
      .filter((item) => item !== undefined)

    const departmentsWithKpi = listEnterpriseUnit.map((department) => {
      const listEmployeeKpi = listResourceFitKpi.filter((employee) => employee.company_unit_id === department.id)
      return {
        ...department,
        listEmployeeKpi
      }
    })

    setListResource(departmentsWithKpi)
  }

  const handleStartAssignAllocation = () => {
    const param = {
      responseServerOutput: responseOutput,
      responseInput: payload,
      listUnitKpi
    }
    dispatch(ConfigParametersAction.handleAssignAllocation(param))
  }

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <div className='box box-default'>
        <div className='box-header with-border text-center'>
          <b style={{ fontSize: '24px' }}>Review kết quả phân bổ</b>
        </div>
        <div className='box-body'>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                {listTab.map((item) => {
                  return <Tab label={item.description} {...a11yProps(item.id)} />
                })}
              </Tabs>
            </Box>
            {listTab.map((_, index) => {
              return (
                <CustomTabPanel value={value} index={index}>
                  <KpiAllocationEachUnitResult tabSelectedUnitKpiTree={tabSelectedUnitKpiTree} />
                </CustomTabPanel>
              )
            })}
          </Box>
        </div>
        <div className='box-footer text-center flex justify-center gap-[16px]'>
          <button type='button' className='btn btn-success' onClick={() => handleStartAssignAllocation()}>
            Bắt đầu phân bổ cho phòng ban và nhân viên
          </button>
        </div>
      </div>
    </>
  )
}

export default AllocationResult
