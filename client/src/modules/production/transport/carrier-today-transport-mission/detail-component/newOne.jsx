import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { getTypeRequirement } from '../../transportHelper/getTextFromValue'

function NewOne(props) {
  let { mission } = props
  const [requirement, setRequirement] = useState()

  const getTypeAction = () => {
    if (mission.type === 1) {
      return 'Nhận hàng'
    }
    return 'Giao hàng'
  }

  const getDetailAddress = () => {
    if (mission.type === 1) {
      return requirement?.detail1
    }
    return requirement?.detail2
  }

  const getAddress = () => {
    if (mission.type === 1) {
      return requirement?.fromAddress
    }
    return requirement?.toAddress
  }

  useEffect(() => {
    console.log(mission, ' kkkk')
    setRequirement(mission?.transportRequirement)
  }, [mission])
  return (
    <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12'>
      <p>{'Loại vận chuyển: ' + getTypeRequirement(requirement?.type)}</p>
      <p>{'Thực hiện: ' + getTypeAction()}</p>
      <p>{'Địa chỉ: ' + getAddress()}</p>
      {getDetailAddress() && <p>{'Chi tiết: ' + getDetailAddress()}</p>}
    </div>
  )
}

function mapState(state) {
  return {}
}

const actions = {}

const connectedNewOne = connect(mapState, actions)(withTranslate(NewOne))
export { connectedNewOne as NewOne }
