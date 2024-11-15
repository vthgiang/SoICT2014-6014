import React, { Component, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

function TaxTab(props) {
  const [state, setState] = useState({})

  useEffect(() => {
    setState((state) => {
      return {
        ...state,
        id: props.id,
        atmNumber: props.employee.atmNumber,
        bankName: props.employee.bankName,
        bankAddress: props.employee.bankAddress,
        taxNumber: props.employee.taxNumber,
        taxRepresentative: props.employee.taxRepresentative,
        taxDateOfIssue: props.employee.taxDateOfIssue,
        taxAuthority: props.employee.taxAuthority
      }
    })
  }, [props.id])

  const { translate } = props

  const { id, atmNumber, bankName, bankAddress, taxNumber, taxRepresentative, taxDateOfIssue, taxAuthority } = state

  /**
   * Function format dữ liệu Date thành string
   * @param {*} date
   * @param {*} monthYear
   */
  const formatDate = (date, monthYear = false) => {
    if (date) {
      let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      if (monthYear === true) {
        return [month, year].join('-')
      } else return [day, month, year].join('-')
    }
    return date
  }

  return (
    <div id={id} className='tab-pane'>
      <div className='box-body'>
        <fieldset className='scheduler-border'>
          <legend className='scheduler-border'>
            <h4 className='box-title'>{translate('human_resource.profile.bank_account')}</h4>
          </legend>
          <div className='row'>
            {/* Số tài khoản ngân hàng */}
            <div className='form-group col-md-4'>
              <strong>{translate('human_resource.profile.account_number')}&emsp; </strong>
              {atmNumber}
            </div>
            {/* Tên ngân hàng */}
            <div className='form-group col-md-4'>
              <strong>{translate('human_resource.profile.bank_name')}&emsp; </strong>
              {bankName}
            </div>
            {/* Chi nhánh */}
            <div className='form-group col-md-4'>
              <strong>{translate('human_resource.profile.bank_branch')}&emsp; </strong>
              {bankAddress}
            </div>
          </div>
        </fieldset>
        {/* Thông tin thuế */}
        <fieldset className='scheduler-border'>
          <legend className='scheduler-border'>
            <h4 className='box-title'>{translate('human_resource.profile.personal_income_tax')}</h4>
          </legend>
          {/* Thuế thu nhập cá nhân */}
          <div className='form-group'>
            <strong>{translate('human_resource.profile.tax_number')}&emsp; </strong>
            {taxNumber}
          </div>
          {/* Người đại diện */}
          <div className='form-group'>
            <strong>{translate('human_resource.profile.representative')}&emsp; </strong>
            {taxRepresentative}
          </div>
          {/* Ngày hoạt động */}
          <div className='form-group'>
            <strong>{translate('human_resource.profile.day_active')}&emsp; </strong>
            {formatDate(taxDateOfIssue)}
          </div>
          {/* Nơi quản lý */}
          <div className='form-group'>
            <strong>{translate('human_resource.profile.managed_by')}&emsp; </strong>
            {taxAuthority}
          </div>
        </fieldset>
      </div>
    </div>
  )
}

const tabGeneral = connect(null, null)(withTranslate(TaxTab))
export { tabGeneral as TaxTab }
