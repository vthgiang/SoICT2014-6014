import React from 'react'

function KpiAllocationEachUnitResult({ tabSelectedUnitKpiTree }) {
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

  // const handle

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
          {goal.description}: {formatNumber(goal.planed_value)} {goal.unit}
        </div>
      </div>
    )
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
          <span id='department' title='123' className='pull-right' style={{ paddingLeft: '5px' }}>
            <a href='#abc' style={{ color: 'white' }} title='Ẩn/hiện điều khiển' onClick={() => toggleSetting(`department-setting`)}>
              <i className='fa fa-gears' />
            </a>
          </span>
          {unit.unit_name}: {formatNumber(unit.planed_value)} {unit.value_unit}
        </div>

        <div
          style={{ backgroundColor: '#fff', paddingTop: '2px', display: 'none', borderTop: '0.5px solid #c1c1c1' }}
          id='department-setting'
        >
          <a
            href='#setting-organizationalUnit'
            className='edit text-yellow'
            // onClick={() => handleEdit(data)}
            // title={translate('manage_department.edit_title')}
          >
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
          <ul className='w-full'>{goal.units.map((tag) => displayTreeView(tag))}</ul>
        </li>
      )
    }
    return null
  }
  return (
    <div className='row'>
      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
        <div className='tf-tree example' style={{ textAlign: 'left', marginTop: '50px' }}>
          <ul className='w-full'>{displayTreeView(tabSelectedUnitKpiTree)}</ul>
        </div>
      </div>
    </div>
  )
}

export default KpiAllocationEachUnitResult
