import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors)

const formatNumber = (number) => {
  return number.toLocaleString('en-US')
}

const toggleSetting = (id) => {
  if (document.getElementById(id).style.display === 'none') {
    document.getElementById(id).style.display = 'block'
  } else {
    document.getElementById(id).style.display = 'none'
  }
}

const showNodeContent = (unit) => {
  return (
    <div
      className='tf-nc bg bg-primary'
      style={{
        minWidth: '120px',
        border: 'none',
        padding: '0px',
        textAlign: 'center',
        fontWeight: '900',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
      }}
    >
      <div style={{ padding: '8px' }}>
        {unit.unit_name}: {formatNumber(unit.planed_value)} {unit.value_unit}
      </div>
    </div>
  )
}

function KpiAllocationEachUnitResult({ tabSelectedUnitKpiTree, handleOpenModal }) {
  const showParentNodeContent = (goal) => {
    return (
      <div
        className='tf-nc bg bg-primary'
        style={{
          minWidth: '120px',
          border: 'none',
          padding: '0px',
          textAlign: 'center',
          fontWeight: '900',
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
        }}
      >
        <div style={{ padding: '8px' }}>
          <span id={`department-${goal.id}`} title='123' className='pull-right' style={{ paddingLeft: '5px' }}>
            <a href='#abc' style={{ color: 'white' }} title='Ẩn/hiện điều khiển' onClick={() => toggleSetting(`department-setting`)}>
              <i className='fa fa-gears' />
            </a>
          </span>
          {goal.description}: {formatNumber(goal.planed_value)} {goal.unit}
        </div>

        <div
          style={{ backgroundColor: '#fff', paddingTop: '2px', display: 'none', borderTop: '0.5px solid #c1c1c1' }}
          id='department-setting'
        >
          <a href='#setting-organizationalUnit' className='edit text-yellow' onClick={() => handleOpenModal()}>
            <i className='material-icons'>ballot</i>
          </a>
        </div>
      </div>
    )
  }

  const displayTreeView = (goal) => {
    if (goal) {
      if (!goal.units) {
        return (
          <li key={goal.id} className='w-full'>
            {showNodeContent(goal)}
          </li>
        )
      }

      return (
        <li key={goal.id} className='w-full'>
          {showParentNodeContent(goal)}
          <ul className='w-full'>{goal.units.map((unit) => displayTreeView(unit))}</ul>
        </li>
      )
    }
    return null
  }

  const generateOption = () => {
    const totalPlannedValue = tabSelectedUnitKpiTree.units.reduce((sum, unit) => sum + unit.planed_value, 0)

    return {
      plugins: {
        title: {
          display: true,
          text: `Bảng phân bổ kết quả cho KPI ${tabSelectedUnitKpiTree.description}`
        },
        colors: {
          forceOverride: true
        }
      },
      responsive: true,
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max:
            Math.ceil((totalPlannedValue / tabSelectedUnitKpiTree.planed_value) * 100) > 100
              ? Math.ceil((totalPlannedValue / tabSelectedUnitKpiTree.planed_value) * 100)
              : 100,
          ticks: {
            callback: (value) => `${value}%` // Append '%' to the tick labels
          }
        }
      }
    }
  }

  const generateData = () => {
    const labels = [`Khối lượng KPI ${tabSelectedUnitKpiTree.description}`]
    const datasets = tabSelectedUnitKpiTree.units.map((unit) => {
      return {
        label: unit.unit_name,
        data: [((unit.planed_value / tabSelectedUnitKpiTree.planed_value) * 100).toFixed(2)]
      }
    })
    return {
      labels,
      datasets
    }
  }

  return (
    <div className='row'>
      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
        <div className='tf-tree example' style={{ textAlign: 'left', marginTop: '50px' }}>
          <ul className='w-full'>{displayTreeView(tabSelectedUnitKpiTree)}</ul>
        </div>
        <Bar options={generateOption()} data={generateData()} />
      </div>
    </div>
  )
}

export default KpiAllocationEachUnitResult
