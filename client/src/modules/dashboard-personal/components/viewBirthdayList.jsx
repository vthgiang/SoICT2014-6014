import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal } from '../../../common-components'

class ViewBirthdayList extends Component {
  constructor(props) {
    super(props)
  }

  /**
   * Function format dữ liệu Date thành string
   * @param {*} date : Ngày muốn format
   * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
   */
  formatDate(date, monthYear = false) {
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

  render() {
    const { dataBirthday, title } = this.props
    console.log(dataBirthday)

    return (
      <React.Fragment>
        <DialogModal
          size='50'
          modalID={'modal-view-birthday-list'}
          isLoading={false}
          formID={`form-view-birthday-list`}
          title={title}
          hasSaveButton={false}
          hasNote={false}
        >
          <form className='form-group' id={`form-view-birthday-list`}>
            <table className='table table-striped table-bordered table-hover'>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã nhân viên</th>
                  <th>Họ và tên</th>
                  <th>Ngày sinh</th>
                </tr>
              </thead>
              <tbody>
                {dataBirthday &&
                  dataBirthday.length !== 0 &&
                  dataBirthday.map((x, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{x.employeeNumber}</td>
                      <td>{x.fullName}</td>
                      <td>{this.formatDate(x.birthdate, false)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </form>
        </DialogModal>
      </React.Fragment>
    )
  }
}

const viewBirthdayList = connect(null, null)(withTranslate(ViewBirthdayList))
export { viewBirthdayList as ViewBirthdayList }
