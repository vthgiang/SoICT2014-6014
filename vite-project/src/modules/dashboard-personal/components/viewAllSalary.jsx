import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, PaginateBar } from '../../../common-components'

class ViewAllSalary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 0,
      limit: 10
    }
  }

  /**
   * Bắt sự kiện chuyển trang
   * @param {*} pageNumber :  Số trang muốn xem
   */
  setPage = async (pageNumber) => {
    await this.setState({
      page: parseInt(pageNumber - 1)
    })
  }

  render() {
    const { dataSalary, title, viewTotalSalary = false } = this.props

    const { page, limit } = this.state

    let pageTotal = dataSalary.length % limit === 0 ? parseInt(dataSalary.length / limit) : parseInt(dataSalary.length / limit + 1)
    let currentPage = parseInt(page + 1)
    const listData = dataSalary.slice(page * limit, page * limit + limit)

    let formater = new Intl.NumberFormat()
    return (
      <React.Fragment>
        <DialogModal
          size='50'
          modalID={'modal-view-all-salary'}
          isLoading={false}
          formID={`form-view-all-salary`}
          title={title}
          hasSaveButton={false}
          hasNote={false}
        >
          <form className='form-group' id={`form-view-all-salary`}>
            <table className='table table-striped table-bordered table-hover'>
              <thead>
                <tr>
                  <th className='col-fixed' style={{ width: 80 }}>
                    STT
                  </th>
                  <th>Mã nhân viên</th>
                  <th>Họ và tên</th>
                  {viewTotalSalary && <th>Tổng lương</th>}
                </tr>
              </thead>
              <tbody>
                {listData &&
                  listData.length !== 0 &&
                  listData.map((x, index) => (
                    <tr key={index}>
                      <td>{page * limit + index + 1}</td>
                      <td>{x.employee.employeeNumber}</td>
                      <td>{x.employee.fullName}</td>
                      {viewTotalSalary && (
                        <td>
                          {formater.format(x.total)} {x.unit}
                        </td>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>
            <PaginateBar pageTotal={pageTotal ? pageTotal : 0} currentPage={currentPage} func={this.setPage} />
          </form>
        </DialogModal>
      </React.Fragment>
    )
  }
}

const viewAllSalary = connect(null, null)(withTranslate(ViewAllSalary))
export { viewAllSalary as ViewAllSalary }
