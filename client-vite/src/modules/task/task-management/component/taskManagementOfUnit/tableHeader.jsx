import React from 'react'
import { ExportExcel } from '../../../../../common-components'

function TableHeaderComponent({ handleDisplayType, exportData }) {
  return (
    <div style={{ height: '40px', marginBottom: '10px' }}>
      <button
        className='btn btn-primary'
        type='button'
        style={{ marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }}
        title='Dạng bảng'
        onClick={() => handleDisplayType('table')}
      >
        <i className='fa fa-list' /> Dạng bảng
      </button>
      <button
        className='btn btn-primary'
        type='button'
        style={{ marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }}
        title='Dạng cây'
        onClick={() => handleDisplayType('tree')}
      >
        <i className='fa fa-sitemap' /> Dạng cây
      </button>
      <button
        className='btn btn-primary'
        type='button'
        style={{ marginLeft: 10, backgroundColor: 'transparent', borderRadius: '4px', color: '#367fa9' }}
        onClick={() => {
          window.$('#tasks-filter').slideToggle()
        }}
      >
        <i className='fa fa-filter' /> Lọc
      </button>
      {exportData && <ExportExcel id='list-task-employee' buttonName='Báo cáo' exportData={exportData} style={{ marginLeft: '10px' }} />}
    </div>
  )
}

export default TableHeaderComponent
