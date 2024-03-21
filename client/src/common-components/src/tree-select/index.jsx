import React, { Component } from 'react'
import SelectTree from 'react-dropdown-tree-select'
import './tree-select.css'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { convertArrayToTree } from '../../../helpers/arrayToTree'
class TreeSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static isEqual = (items1, items2) => {
    if (!items1 || !items2) {
      return false
    }
    if (items1.length !== items2.length) {
      return false
    }
    for (let i = 0; i < items1.length; ++i) {
      if (!items1[i] || !items2[i]) return false
      else {
        if (!(items1[i] instanceof Array) && items1[i] !== items2[i]) {
          // Kiểu bình thường
          return false
        } else if (items1[i] instanceof Array && JSON.stringify(items1[i]) !== JSON.stringify(items2[i])) {
          // Kiểu group
          return false
        }
      }
    }
    return true
  }

  static getDerivedStateFromProps(props, state) {
    if (
      props.id !== state.id ||
      !TreeSelect.isEqual(props.data, state.data) ||
      (props.value && !TreeSelect.isEqual(props.value, state.value))
    ) {
      return {
        id: props.id,
        value: props.value, // Lưu value ban đầu vào state
        innerChange: false, // reset lại innerChange (true-tự thay đổi do người dùng chọn, hay false-thay đổi do component cha cập nhật props)
        data: props.data
      }
    } else {
      return null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.innerChange) {
      return false
    }

    if (
      !TreeSelect.isEqual(nextProps.data, this.state.data) ||
      nextProps.id !== this.state.id ||
      (nextProps.value && !TreeSelect.isEqual(nextProps.value, this.state.value))
    )
      // Chỉ render 1 lần, trừ khi id, value, data thay đổi
      return true
    return false // Tự chủ động update (do đã lưu value vào state)
  }

  onChange = (currentNode, selectedNodes) => {
    const value = selectedNodes.map((node) => node._id)

    this.setState((state) => {
      return {
        ...state,
        innerChange: true,
        value: value
      }
    })

    this.props.handleChange(value)
  }

  convertData = (array = [], value = []) => {
    let data = []
    for (let i = 0; i < array.length; i++) {
      let index = array[i].id ? array[i].id : array[i]._id
      if (value.indexOf(index) > -1) {
        data.push({
          ...array[i],
          checked: true
        })
      } else {
        data.push({
          ...array[i],
          checked: false
        })
      }
    }

    return data
  }

  render() {
    /**
     * mode có 4 tùy chọn là
     * 1. multiSelect - chọn phần tử cha mặc định đánh dấu luôn phần tử con
     * 2. hierarchical - chọn phần tử cha không đánh dấu phần tử con
     * 3. simpleSelect - chọn một node trong list - không có dạng cây
     * 4. radioSelect - chọn một node trong cây
     */
    let { mode, data = [], value = [], placeholder = ' ', action, actionIcon } = this.props
    let getData = this.convertData(data, value)
    let tree = convertArrayToTree(getData)

    placeholder = value.length === 0 ? placeholder : ' '

    if (!action) {
      return (
        <React.Fragment>
          <SelectTree data={tree} onChange={this.onChange} texts={{ placeholder }} mode={mode} className='qlcv' />
        </React.Fragment>
      )
    } else
      return (
        <div>
          <SelectTree data={tree} onChange={this.onChange} texts={{ placeholder }} mode={mode} className='qlcv' />
          <span
            style={{
              padding: '5px',
              cursor: 'pointer',
              height: '34px',
              width: '34px',
              backgroundColor: '#f1f1f1',
              position: 'absolute',
              right: '34px',
              border: '1px solid #D2D6DE',
              justifyContent: 'center'
            }}
            onClick={action}
          >
            <a className='tree-select-action' title='Thêm dự án mới'>
              <i style={{ fontSize: '24px' }} className='material-icons'>
                post_add
              </i>
            </a>
          </span>
        </div>
      )
  }
}

const mapState = (state) => state
const TreeSelectExport = connect(null)(withTranslate(TreeSelect))

export { TreeSelectExport as TreeSelect }
