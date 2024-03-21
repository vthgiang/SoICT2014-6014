import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'

import { DialogModal, PaginateBar } from '../../../common-components'

class ViewAllCommendation extends Component {
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
    const { dataCommendation, title } = this.props
    const { page, limit } = this.state

    let pageTotal =
      dataCommendation.length % limit === 0 ? parseInt(dataCommendation.length / limit) : parseInt(dataCommendation.length / limit + 1)
    let currentPage = parseInt(page + 1)
    const listData = Array.isArray(dataCommendation) ? dataCommendation?.slice(page * limit, page * limit + limit) : []

    return (
      <React.Fragment>
        <DialogModal
          size='50'
          modalID={'modal-view-all-commendation'}
          isLoading={false}
          formID={`form-view-all-commendation`}
          title={title}
          hasSaveButton={false}
          hasNote={false}
        >
          <form className='form-group' id={`form-view-all-commendation`}>
            <table className='table table-striped table-bordered table-hover'>
              <thead>
                <tr>
                  <th className='col-fixed' style={{ width: 80 }}>
                    STT
                  </th>
                  <th>Họ và tên</th>
                  <th>Lý do khen thưởng</th>
                </tr>
              </thead>
              <tbody>
                {listData &&
                  listData.length !== 0 &&
                  listData.map((x, index) => (
                    <tr key={index}>
                      <td>{page * limit + index + 1}</td>
                      <td>{x.employee.fullName}</td>
                      <td>{x.reason}</td>
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

const viewAllCommendation = connect(null, null)(withTranslate(ViewAllCommendation))
export { viewAllCommendation as ViewAllCommendation }
