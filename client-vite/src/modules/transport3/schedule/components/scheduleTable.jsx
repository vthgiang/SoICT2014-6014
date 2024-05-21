import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {withTranslate} from 'react-redux-multilingual'

//Helper Function
import {formatDate} from '@helpers/formatDate'
import {generateCode} from '@helpers/generateCode'
//Components Import
import {
  PaginateBar,
  DataTableSetting,
  SelectMulti,
} from '@common-components'
import {getTableConfiguration} from '@helpers/tableConfiguration'
import ScheduleCreateForm from './scheduleCreateForm';

function ScheduleTable(props) {
  const TableId = 'schedule-table'
  const defaultConfig = {limit: 5}
  const Limit = getTableConfiguration(TableId, defaultConfig).limit

  const [state, setState] = useState({
    page: 1,
    code: generateCode('SC_'),
    limit: Limit,
    tableId: TableId
  })

  const handleCodeChange = (e) => {
    setState({
      ...state,
      code: generateCode('SC_')
    })
  }
  const setPage = async (page) => {
    await setState({
      ...state,
      page: page
    })
  }

  const setLimit = async (limit) => {
    await setState({
      ...state,
      limit: limit
    })
  }

  return (
    <>
      <ScheduleCreateForm code={state.code}/>
      {/*  button them lich*/}
      <div className="row">
        <div className="col-md-12">
          <div className="box box-primary">
            <div className="box-body">
              <button
                type="button"
                className="btn btn-success"
                data-toggle="modal"
                data-target="#modal-add-schedule"
                onClick={handleCodeChange}
                  >
                  <i className='fa fa-plus'/>
                  &nbsp;Thêm lịch
                  </button>
                  </div>
                  </div>
                  </div>
                  </div>
                  </>
                  )
                }

function mapStateToProps(state) {
  return {}
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ScheduleTable))
