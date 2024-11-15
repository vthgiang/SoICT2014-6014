import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { SelectMulti } from '../..'
import { SlimScroll } from '../..'
import './dataTableSetting.css'
import { getTableConfiguration } from '../../../helpers/tableConfiguration'
import { setTableConfiguration } from '../../../helpers/tableConfiguration'

class DataTableSetting extends Component {
  constructor(props) {
    super(props)
    this.record = React.createRef()
    const configuration = getTableConfiguration(this.props.tableId)
    this.state = {
      useScrollBar: false,
      hiddenColumns: configuration.hiddenColumns,
      limit: configuration.limit
    }
  }

  componentDidMount() {
    this.adjustSize()
    window.addEventListener('resize', this.adjustSize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.adjustSize)
  }

  componentDidUpdate() {
    const { hiddenColumns } = this.state
    window.$(`#${this.props.tableId} td`).show()
    window.$(`#${this.props.tableId} th`).show()

    // Xóa các thuộc tính width, nếu không khi thêm cột, bảng sẽ tràn chiều rộng (lớn hơn width trình duyệt)
    let headings = window.$(`#${this.props.tableId} th`)
    for (let i = 0; i < headings.length; ++i) {
      if (!window.$(headings[i]).hasClass('col-fixed')) {
        // Riêng cột có class col-fixed sẽ không xóa thuộc tính width
        window.$(headings[i]).width('')
      }
    }

    for (var j = 0, len = hiddenColumns.length; j < len; j++) {
      window.$(`#${this.props.tableId} td:nth-child(` + hiddenColumns[j] + `)`).hide()
      window.$(`#${this.props.tableId} thead th:nth-child(` + hiddenColumns[j] + `)`).hide()
    }
  }

  adjustSize = async () => {
    await this.setState((state) => {
      return {
        ...state,
        useScrollBar: window.innerWidth > 992 ? false : true // 992: kích thước Bootstrap md
      }
    })
  }

  handleChangeHiddenColumns = (value) => {
    const { limit } = this.state
    let config = {}
    config = { ...config, limit: limit, hiddenColumns: value }
    setTableConfiguration(this.props.tableId, config)

    this.setState((state) => {
      return {
        ...state,
        hiddenColumns: value
      }
    })
  }

  handleEnterLimitSetting = (event) => {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault()
      // Trigger the button element with a click
      this.setLimit()
    }
  }

  setLimit = async () => {
    await window.$(`#setting-${this.props.tableId}`).collapse('hide')

    let config = {}
    const { hiddenColumns } = this.state
    config = { ...config, limit: Number(this.record.current.value), hiddenColumns: hiddenColumns }
    setTableConfiguration(this.props.tableId, config)

    if (this.props.setLimit && Number(this.props.limit) !== Number(this.record.current.value)) {
      await this.setState({
        ...this.state,
        limit: this.record.current.value
      })
      this.props.setLimit(this.record.current.value)
    }
  }

  configTableWidth = async () => {
    await this.setState((state) => {
      return {
        ...state,
        useScrollBar: this.refs.configCheckbox.checked
      }
    })

    window.$(`#setting-${this.props.tableId}`).collapse('hide')
  }

  render() {
    const {
      text,
      fontSize = 19,
      className,
      style,
      translate,
      columnArr = [],
      hideColumnOption = true,
      linePerPageOption = true,
      tableContainerId,
      tableId,
      tableWidth
    } = this.props
    const { hiddenColumns, limit } = this.state
    return (
      <React.Fragment>
        <button
          type='button'
          data-toggle='collapse'
          data-target={`#setting-${tableId}`}
          className={className ? className : 'pull-right'}
          style={style ? style : { border: 'none', background: 'none', padding: '0px', display: 'flex', alignItems: 'center' }}
        >
          <i className='fa fa-gear' style={{ fontSize }}></i> {text}
        </button>

        <div className='collapse setting-table' id={`setting-${tableId}`}>
          <button type='button' className='btn-close' data-toggle='collapse' data-target={`#setting-${tableId}`}>
            <i className='fa fa-times'></i>
          </button>

          <h4 className='box-title'>{translate('general.action')}</h4>

          {hideColumnOption && columnArr.length > 0 && (
            <div className='form-group'>
              <label>{translate('table.hidden_column')}</label>
              <SelectMulti
                id={`multiSelectHideColumn-${tableId}`}
                multiple='multiple'
                options={{
                  nonSelectedText: translate('table.choose_hidden_columns'),
                  allSelectedText: translate('table.hide_all_columns')
                }}
                items={columnArr.map((col, i) => {
                  return { value: i + 1, text: col }
                })}
                value={hiddenColumns}
                onChange={this.handleChangeHiddenColumns}
                includeSelectAllOption={false}
              />
            </div>
          )}
          {linePerPageOption && (
            <div className='form-group'>
              <label>{translate('table.line_per_page')}</label>
              <input className='form-control' type='Number' onKeyUp={this.handleEnterLimitSetting} defaultValue={limit} ref={this.record} />
            </div>
          )}

          {window.$(`#${tableContainerId}`)[0] !== undefined && (
            <div className='form-group'>
              <label>
                <input type='checkbox' checked={this.state.useScrollBar} ref='configCheckbox' onChange={this.configTableWidth} />
                &nbsp;&nbsp;{translate('general.scroll')}
              </label>
              <SlimScroll
                outerComponentId={tableContainerId}
                innerComponentId={tableId}
                innerComponentWidth={tableWidth}
                activate={this.state.useScrollBar}
              />
            </div>
          )}
          <button type='button' className='btn btn-primary pull-right' onClick={this.setLimit}>
            {translate('table.update')}
          </button>
        </div>
      </React.Fragment>
    )
  }
}

const mapState = (state) => state
const DataTableSettingExport = connect(mapState, null)(withTranslate(DataTableSetting))

export { DataTableSettingExport as DataTableSetting }
