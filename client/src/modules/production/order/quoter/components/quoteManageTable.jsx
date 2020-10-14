import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from  'react-redux-multilingual';
import {PaginateBar,
    DataTableSetting,
    DeleteNotification, SelectBox} from '../../../../../common-components';
import data from '../../dataTest/quoterData.json';
import QuoteDetailForm from './quoteDetailForm';
import QuoteCreateForm from './quoteCreateForm';

class QuoteManageTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 5,
      page: 1
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      list: data
    }
  }

  
  handleShowDetailInfo = (data) => {
    this.setState(state => {
      return {
        ...state,
        currentRow: data
      }
    })
    window.$('#modal-detail-quote').modal('show');
  }

  format_curency(x) {
    x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
    x = x.replace(pattern, "$1,$2");
  return x;
  }


  render() {
     let {list, limit, page, type} = this.state;

     const { translate } = this.props;

    let totalPages = 0;
      totalPages =
        list.length % limit === 0
          ? parseInt(list.length / limit)
          : parseInt(list.length / limit + 1);
    return (
      <React.Fragment>
        <div className="nav-tabs-custom">
          <div className="box-body qlcv">
            {this.state.currentRow && 
            <QuoteDetailForm 
              data = {this.state.currentRow}
              type = {this.state.type}
            />}
            <QuoteCreateForm />
            <div className="form-inline">
              <div className="form-group">
                <label className="form-control-static">
                Tìm mã đơn mua
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="code"
                  onChange={this.handleOrderCodeChange}
                  placeholder="Nhập vào mã đơn"
                  autoComplete="off"
                />
              </div>
              <div className="form-group">
                <label className="form-control-static">Trạng thái đơn</label>
                <SelectBox
                  id={`select-filter-status-material-purchase-order`}
                  className="form-control select2"
                  style={{ width: "100%" }}
                  items={[
                    { value: 'Chờ phản hồi', text: 'Chờ phản hồi'},
                    { value: 'Đạt thỏa thuận', text: 'Đạt thỏa thuận'},
                    { value: 'Hủy đơn', text: 'Hủy đơn'},
                  ]}
                  onChange={this.handleStatusChange}
                />
            </div>
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-success"
                  title="Lọc"
                  onClick={this.handleSubmitSearch}
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
            <table
              id={`order-table-${type}`}
              className="table table-striped table-bordered table-hover"
              style={{marginTop: 20}}
            >
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã đơn</th>
                  <th>Người tạo</th>
                  <th>Khách hàng</th>
                  <th>Ngày có hiệu lực</th>
                  <th>Ngày hết hiệu lực</th>
                  <th>Tổng tiền (vnđ)</th>
                  <th>Trạng thái</th>
                  <th style={{ width: "120px", textAlign: "center" }}>
                    {translate("table.action")}
                    <DataTableSetting
                      tableId="purchase-order-table"
                      columnArr={[
                        "STT",
                        "Nội dung mua hàng",
                        "Trạng thái",
                        "Người tạo",
                      ]}
                      limit={limit}
                      setLimit={this.setLimit}
                      hideColumnOption={true}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {typeof list !== "undefined" &&
                  list.length !== 0 &&
                  list.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1 + (page - 1) * limit}</td>
                      <td>{item.code}</td>
                      <td>{item.creator}</td>
                      <td>{item.customer}</td>
                      <td>{item.effectiveDate}</td>
                      <td>{item.expirationDate}</td>
                      <td>{this.format_curency(item.paymentAmount)}</td>
                      <td>{item.status}</td>
                      <td style={{ textAlign: "center" }}>
                      <a className="text-green" onClick={() => this.handleShowDetailInfo(item)}>
                        <i className="material-icons">visibility</i>
                        </a>
                        <a
                          onClick={() => this.handleEdit(item)}
                          className="edit text-yellow"
                          style={{ width: "5px" }}
                          title="Sửa đơn"
                        >
                          <i className="material-icons">edit</i>
                        </a>
                        <DeleteNotification
                          content={"Xóa đơn hàng"}
                          data={{
                            info: 'Bạn có chắc chắn muốn xóa đơn: ' + item.code
                          }}
                          func={()=>this.deletePurchaseOrder(item._id)}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <PaginateBar
              pageTotal={totalPages ? totalPages : 0}
              currentPage={page}
              func={this.setPage}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, null)(withTranslate(QuoteManageTable));