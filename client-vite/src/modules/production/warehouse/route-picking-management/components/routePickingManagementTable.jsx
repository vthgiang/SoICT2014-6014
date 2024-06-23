import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withTranslate } from 'react-redux-multilingual'
import { RoutePickingActions } from '../redux/actions'

import { DataTableSetting, DeleteNotification, PaginateBar } from '../../../../../common-components'

// import ExampleCreateForm from './exampleCreateForm'
// import ExampleEditForm from './exampleEditForm'
import RoutePickingDefaultInfo from './routePickingDetailInfo'
// import ExampleImportForm from './exampleImortForm'
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

class RoutePickingManagementTable extends Component {
  constructor(props) {
    super(props)
    const tableId = 'table-manage-route-class'
    const defaultConfig = { limit: 5 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit

    this.state = {
      routeName: '',
      page: 1,
      perPage: limit,
      tableId,
      detailModalId: 1,
    }
  }

  componentDidMount() {
    let { routeName, page, perPage } = this.state
    this.props.getAllRoutes()
  }


  /**
   * Hàm xử lý khi tên ví dụ thay đổi
   * @param {*} e
   */
  handleChangeExampleName = (e) => {
    const { value } = e.target
    this.setState({
      exampleName: value
    })
  }

  /**
   * Hàm xử lý khi click nút tìm kiếm
   */
  handleSubmitSearch = () => {
    const { exampleName, perPage } = this.state

    this.setState((state) => {
      return {
        ...state,
        page: 1
      }
    })
    this.props.getAllRoutes({ exampleName, perPage, page: 1 })
  }

  /**
   * Hàm xử lý khi click chuyển trang
   * @param {*} pageNumber Số trang định chuyển
   */
  setPage = (pageNumber) => {
    const { exampleName, perPage } = this.state

    this.setState((state) => {
      return {
        ...state,
        page: parseInt(pageNumber)
      }
    })

    this.props.getAllRoutes({ exampleName, perPage, page: parseInt(pageNumber) })
  }

  /**
   * Hàm xử lý thiết lập giới hạn hiển thị số bản ghi
   * @param {*} number số bản ghi sẽ hiển thị
   */
  setLimit = (number) => {
    const { exampleName, page } = this.state

    this.setState((state) => {
      return {
        ...state,
        perPage: parseInt(number)
      }
    })
    this.props.getAllRoutes({ exampleName, perPage: parseInt(number), page })
  }

  /**
   * Hàm xử lý khi click xóa 1 ví dụ
   * @param {*} id của ví dụ cần xóa
   */
  handleDelete = (id) => {
    const { example } = this.props
    const { exampleName, perPage, page } = this.state

    // this.props.deleteExamples({
    //   exampleIds: [id]
    // })
    // console.log('55555')
    // this.props.getAllRoutes({
    //   exampleName,
    //   perPage,
    //   page: example?.lists?.length === 1 ? page - 1 : page
    // })
  }

  /**
   * Hàm xử lý khi click edit một ví vụ
   * @param {*} example thông tin của ví dụ cần chỉnh sửa
   */
  handleEdit = (example) => {
    this.setState(
      {
        currentRow: example
      },
      () => window.$('#modal-edit-example').modal('show')
    )
  }

  handleShowDetailInfo = async (chemin) => {
    // const { detailModalId } = this.state
    // await this.props.getRoute(chemin._id)
    await this.setState(
      {
        routeDetail: chemin
      },
      () => window.$(`#modal-detail-info-route-picking`).modal('show')
    )
  }



  render() {
    const { translate, routes } = this.props
    const { page, perPage, currentRow, tableId, routeDetail } = this.state
    console.log(routeDetail)
    return (
      <React.Fragment>
        {routeDetail && (
          <RoutePickingDefaultInfo
            routeDetail={routeDetail}
          />
        )}
        <div className='box-body qlcv'>
          <div className='form-inline'>
            <div className='dropdown pull-right' style={{ marginBottom: 15 }}>
              {/* button thêm mới */}
              <button
                type='button'
                className='btn btn-success dropdown-toggle pull-right'
                data-toggle='dropdown'
                aria-expanded='true'
                title={translate('manage_example.add_title')}
              >
                {translate('manage_example.add')}
              </button>
              <ul className='dropdown-menu pull-right' style={{ marginTop: 0 }}>
                <li>
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.$('#modal-import-file-example').modal('show')}
                    title={translate('human_resource.salary.add_multi_example')}
                  >
                    {translate('human_resource.salary.add_import')}
                  </a>
                </li>
                <li>
                  <a
                    style={{ cursor: 'pointer' }}
                    onClick={() => window.$('#modal-create-example').modal('show')}
                    title={translate('manage_example.add_one_example')}
                  >
                    {translate('manage_example.add_example')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Tên ví dụ cần tìm kiếm*/}
            <div className='form-group'>
              <label className='form-control-static'>{translate('manage_example.exampleName')}</label>
              <input
                type='text'
                className='form-control'
                name='exampleName'
                onChange={this.handleChangeExampleName}
                placeholder={translate('manage_example.exampleName')}
                autoComplete='off'
              />
            </div>

            {/* Nút tìm kiếm */}
            <div className='form-group'>
              <button
                type='button'
                className='btn btn-success'
                title={translate('manage_example.search')}
                onClick={this.handleSubmitSearch}
              >
                {translate('manage_example.search')}
              </button>
            </div>
          </div>

          {/* Bảng hiển thị danh sách ví dụ */}
          <table id={tableId} className='table table-striped table-bordered table-hover'>
            <thead>
              <tr>
                <th className='col-fixed' style={{ width: 60 }}>
                  STT
                </th>
                <th>Wave ID</th>
                <th>Các đơn hàng trong wave</th>
                <th>Sản phẩm</th>
                <th>Tổng quãng đường</th>
                <th style={{ width: '120px', textAlign: 'center' }}>
                  {translate('table.action')}
                  <DataTableSetting
                    tableId={tableId}
                    columnArr={[
                      'STT',
                      'Các đơn hàng trong wave',
                      'Tổng quãng đường'
                    ]}
                    setLimit={this.setLimit}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {routes.listChemins &&
                routes.listChemins.length !== 0 &&
                routes.listChemins.map((chemin, index) => (
                  <tr key={index}>
                    <td>{index + 1 + (page - 1) * perPage}</td>
                    <td>{chemin.waveId}</td>
                    <td>
                      {chemin.orderId.map(order => order.code).join(', ')}
                    </td>
                    <td>
                      {chemin.listInfoOrders.map(order => (
                        <div style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.good.name}
                        </div>
                      ))}
                    </td>
                    <td>{chemin.distanceRoute}</td>

                    <td style={{ textAlign: 'center' }}>
                      <a
                        className='edit text-green'
                        style={{ width: '5px' }}
                        title={translate('manage_example.detail_info_example')}
                        onClick={() => this.handleShowDetailInfo(chemin)}
                      >
                        <i className='material-icons'>visibility</i>
                      </a>
                      {/* <a
                        className='edit text-yellow'
                        style={{ width: '5px' }}
                        title={translate('manage_example.edit')}
                        onClick={() => this.handleEdit(chemin)}
                      >
                        <i className='material-icons'>edit</i>
                      </a>
                      <DeleteNotification
                        content={translate('manage_example.delete')}
                        data={{
                          id: chemin._id,
                          info: chemin.exampleName
                        }}
                        func={this.handleDelete}
                      /> */}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {routes.isLoading ? (
            <div className='table-info-panel'>{translate('confirm.loading')}</div>
          ) : (
            (typeof routes.listChemins === 'undefined' || routes.listChemins.length === 0) && <div className='table-info-panel'>{translate('confirm.no_data')}</div>
          )}
          {/* <PaginateBar
            pageTotal={totalPage ? totalPage : 0}
            currentPage={page}
            display={lists && lists.length !== 0 && lists.length}
            total={routes && routes.totalList}
            func={this.setPage}
          /> */}
        </div>
      </React.Fragment >
    )
  }
}

function mapStateToProps(state) {
  const { routes } = state

  return { routes }
}

const mapDispatchToProps = {
  getAllRoutes: RoutePickingActions.getAllChemins,

  // deleteExamples: exampleActions.deleteExamples
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(RoutePickingManagementTable))
