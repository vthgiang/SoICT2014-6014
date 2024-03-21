import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { formatDate } from '../../../../../../helpers/formatDate'

import { transportRequirementsActions } from '../../../transport-requirements/redux/actions'
import { getTypeRequirement } from '../../../transportHelper/getTextFromValue'

import '../transport-plan.css'

function TransportPlanRequirement(props) {
  let { transportRequirements, transportPlan, callBackListRequirements } = props

  /**
   * Danh sách tất cả transportrequirements theo thứ tự ưu tiên
   * [transportRequirement, ...]
   */
  const [listRequirements, setListRequirements] = useState([])

  /**
   * Danh sách transportrequirements đã lựa chọn
   * [id, id...]
   */
  const [listSelectedRequirements, setListSelectedRequirements] = useState([])

  const handleSelectRequirement = (requirement) => {
    let arr = [...listSelectedRequirements]
    let pos = arr.indexOf(requirement._id)
    if (pos >= 0) {
      arr = arr.slice(0, pos).concat(arr.slice(pos + 1))
    } else {
      arr.push(requirement._id)
    }
    // console.log(arr);
    setListSelectedRequirements(arr)
  }

  const getStatusTickBox = (requirement) => {
    if (listSelectedRequirements && listSelectedRequirements.length !== 0) {
      if (listSelectedRequirements.indexOf(requirement._id) >= 0) {
        return 'iconactive'
      } else {
        return 'iconinactive'
      }
    } else {
      return 'iconinactive'
    }
  }
  useEffect(() => {
    props.getAllTransportRequirements({ page: 1, limit: 100, status: '2' })
  }, [transportPlan])
  useEffect(() => {
    if (transportRequirements) {
      let { lists } = transportRequirements
      setListRequirements(lists)
    }
  }, [transportRequirements])

  useEffect(() => {
    let res = []
    if (listSelectedRequirements && listSelectedRequirements.length !== 0 && listRequirements && listRequirements.length !== 0) {
      console.log(listSelectedRequirements, listRequirements)
      listSelectedRequirements.map((item) => {
        let k = listRequirements.filter((r) => String(r._id) === String(item))
        console.log(k)
        if (k && k.length !== 0) {
          k.map((i) => {
            res.push(i)
          })
        }
      })
    }
    console.log(res)
    callBackListRequirements(res)
  }, [listSelectedRequirements, listRequirements])

  return (
    <form id='form-select-transport-requirements'>
      <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
        {listRequirements && listRequirements.length !== 0 && (
          <table id={'1'} className='table table-striped table-bordered table-hover' style={{ marginTop: '10px' }}>
            <thead>
              <tr>
                <th className='col-fixed' style={{ width: 60 }}>
                  {'STT'}
                </th>
                <th>{'Mã yêu cầu'}</th>
                <th>{'Loại yêu cầu'}</th>
                <th>{'Địa chỉ nhận hàng'}</th>
                <th>{'Địa chỉ giao hàng'}</th>
                <th>{'Ngày tạo'}</th>
                <th>{'Ngày mong muốn vận chuyển'}</th>
                <th>{'Thêm vào kế hoạch'}</th>
              </tr>
            </thead>
            <tbody>
              {listRequirements &&
                listRequirements.length !== 0 &&
                listRequirements.map(
                  (x, index) =>
                    x && (
                      <tr key={index + x._id}>
                        <td>{index + 1}</td>
                        <td>{x.code}</td>
                        <td>{getTypeRequirement(x.type)}</td>
                        <td>{x.fromAddress}</td>
                        <td>{x.toAddress}</td>
                        <td>{x.createdAt ? formatDate(x.createdAt) : ''}</td>
                        <td>
                          {x.timeRequests &&
                            x.timeRequests.length !== 0 &&
                            x.timeRequests.map((timeRequest, index2) => (
                              <div key={index + ' ' + index2}>{index2 + 1 + '/ ' + formatDate(timeRequest.timeRequest)}</div>
                            ))}
                        </td>
                        {/* <td>{x.status}</td> */}
                        <td style={{ textAlign: 'center' }} className='tooltip-checkbox'>
                          <span
                            className={'icon ' + getStatusTickBox(x)}
                            title={'Chọn yêu cầu vận chuyển để tạo kế hoạch'}
                            onClick={() => handleSelectRequirement(x)}
                          ></span>
                        </td>
                      </tr>
                    )
                )}
            </tbody>
          </table>
        )}
      </div>
    </form>
  )
}

function mapState(state) {
  const { transportRequirements } = state
  return { transportRequirements }
}

const actions = {
  getAllTransportRequirements: transportRequirementsActions.getAllTransportRequirements
}

const connectedTransportPlanRequirement = connect(mapState, actions)(withTranslate(TransportPlanRequirement))
export { connectedTransportPlanRequirement as TransportPlanRequirement }
