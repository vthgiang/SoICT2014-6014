/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import { useTranslate } from 'react-redux-multilingual'
import { Box, Tab, Tabs } from '@mui/material'
import PropTypes from 'prop-types'
import KpiAllocationEachUnitResult from './kpiAllocationEachUnitResult'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

function AllocationResult() {
  const [listUnitKpiTree, setListUnitKpiTree] = useState([])
  const [listTask, setListTask] = useState([])
  const [listResourceKpi, setListResource] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const translate = useTranslate()
  const [activeTab, setActiveTab] = useState(0)
  const [listTab, setListTab] = useState([])
  const [tabSelectedUnitKpiTree, setTabSelectedUnitKpiTree] = useState({})
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
    setTabSelectedUnitKpiTree(listUnitKpiTree[newValue])
  }

  // const handleStartAllocation = async () => {
  //   try {
  //     setIsLoading(true)
  //     setIsLoading(false)
  //   } catch (error) {
  //     console.log(error)
  //     setIsLoading(false)
  //   }
  // }

  const fetchData = async () => {
    try {
      const responseOutput = await fetch('http://localhost:3000/sample_output.json')
      if (!responseOutput.ok) {
        throw new Error(`Network response was not ok ${responseOutput.statusText}`)
      }
      const jsonDataOutput = await responseOutput.json()
      const { content } = jsonDataOutput
      const { list_unit_kpi } = content

      const responseInput = await fetch('http://localhost:3000/sample_input.json')
      if (!responseInput.ok) {
        throw new Error(`Network response was not ok ${responseInput.statusText}`)
      }
      const jsonDataInput = await responseInput.json()
      const { listEnterpriseGoal } = jsonDataInput

      // const payloadUnitKpiTree =
      const combinedGoals = listEnterpriseGoal.map((enterpriseGoal) => {
        const units = list_unit_kpi
          .map((unitKpi) => {
            const matchingMetric = unitKpi.unit_list_metric.find((metric) => metric.id === enterpriseGoal.id)
            return {
              unit_id: unitKpi.unit_id,
              unit_name: unitKpi.unit_name,
              planed_value: matchingMetric ? matchingMetric.planed_value : null,
              value_unit: matchingMetric.unit
            }
          })
          .filter((unit) => unit.planed_value !== null)

        return {
          ...enterpriseGoal,
          units
        }
      })

      // console.log(combinedGoals)
      setListUnitKpiTree(combinedGoals)

      const listTabGoal = listEnterpriseGoal.map((item, index) => {
        return {
          id: item.id,
          description: item.description,
          value: index,
          isActive: index === 0 && true
        }
      })
      setListTab(listTabGoal)
      setTabSelectedUnitKpiTree(combinedGoals[0])
    } catch (error) {
      // console.error('Fetch error:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      {/* <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
        <CircularProgress color='inherit' />
      </Backdrop> */}
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
          <button type='button' className='btn btn-success'>
            Bắt đầu phân bổ cho phòng ban và nhân viên
          </button>
        </div>
      </div>
    </>
  )
}

export default AllocationResult
