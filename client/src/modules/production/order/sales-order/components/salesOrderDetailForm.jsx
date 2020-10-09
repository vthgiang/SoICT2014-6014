import React, { Component } from 'react';
import {connect} from 'react-redux'
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';

class SalesOrderDetailForm extends Component {
  constructor(props) {
    super(props);
    
  }

  format_curency(x) {
    x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
    x = x.replace(pattern, "$1,$2");
  return x;
  }
  
  render() {
    const {data, type} = this.props;
    const goodsData = data.goods.map((item)=>{
      let check = false;
      if (data.totalDiscounts.goods.length > 0){
        data.totalDiscounts.goods.forEach(e => {
          if (item._id === e._id){
            item.quantityDiscount = e.quantity;
          }
        });
      }
        if(!check){
          item.quantityDiscount = 0;
        }
      return item;
    })

    console.log("goodsData", goodsData);

    const goodDataMerge = [];
    goodsData.forEach((e) => {
      goodDataMerge.push(e)
    })
      if (data.totalDiscounts.goods.length > 0){
        data.totalDiscounts.goods.forEach(e => {
          let check = false;
          goodsData.forEach(good => {
            if (good._id === e._id){
              check = true;
            }
        });
        if(!check) {
          let good = e;
          good.quantityDiscount = e.quantity;
          good.quantity = 0;
          good.returnRule =[];
          good.serviceLevelAgreement = [];
          good.tax = [];
          goodDataMerge.push(good);
        }
      })
    }

    console.log("ddd",goodDataMerge);

    return (
      <React.Fragment>

      <DialogModal
          modalID="modal-detail-sales-order" isLoading={false}
          formID="form-detail-sales-order"
          title={'Chi tiết đơn hàng'}
          size='100'
          hasSaveButton={false}
          hasNote={false}
      >
        <div className="row row-equal-height" style={{ marginTop: -25 }}>
          <div className={"col-xs-12 col-sm-12 col-md-6 col-lg-6"} style={{ padding: 10 }}>
            <div className="description-box" style={{ height: "100%" }}>
              <div className="form-group">
                <strong>{"Mã đơn hàng"}:&emsp; </strong>
                {data.code}
              </div>

              <div className="form-group">
                <strong>{"Loại đơn hàng"}:&emsp; </strong>
                {data.type}
              </div>

              <div className="form-group">
                <strong>{"Trạng thái"}:&emsp; </strong>
                {data.status}
              </div>

              <div className="form-group">
                <strong>{"Ngày tạo"}:&emsp; </strong>
                {data.createAt}
              </div>
              
              <div className="form-group">
                <strong>{"Khách hàng"}:&emsp; </strong>
                {data.customer}
              </div>

              <div className="form-group">
                <strong>{"Số điện thoại khách hàng"}:&emsp; </strong>
                {data.phone}
              </div>

              <div className="form-group">
                <strong>{"Địa chỉ khách hàng"}:&emsp; </strong>
                {data.andress}
              </div>

              {type === "sales" ? (
                <div className="form-group">
                <strong>{"Ngày giao hàng"}:&emsp; </strong>
                {data.deliveryStartDate}
              </div>
              ) : (
                <div className="form-group">
                <strong>{"Ngày có hiệu lực báo giá"}:&emsp; </strong>
                {data.effectiveDate}
              </div>
              )}

              {type === "sales" ? (
                <div className="form-group">
                <strong>{"Hạn giao hàng"}:&emsp; </strong>
                {data.deliveryEndDate}
              </div>
              ) : (
                <div className="form-group">
                <strong>{"Ngày hết hiệu lực báo giá"}:&emsp; </strong>
                {data.expirationDate}
              </div>
              )}



            </div>
          </div>

          <div className={"col-xs-12 col-sm-12 col-md-6 col-lg-6"} style={{ padding: 10 }}>
            <div className="description-box" style={{ height: "100%" }}>
           
            <div className="form-group">
                <strong>{"Người tạo"}:&emsp; </strong>
                {data.creator}
              </div>

              <div className="form-group">
                <strong>{"Những người phê duyệt"}:&emsp; </strong>
                {data.approvers.length ? data.approvers.map((user)=>(<div style={{display: 'flex'}}>
                    <div style={{width: '30%'}}><b> <i>Tên: </i></b> {user.name}</div>
                    <div style={{width: '40%'}}><b><i>Chức vụ: </i></b> {user.role}</div>
                    <div style={{width: '30%'}}><b><i>Duyệt lúc: </i></b> {user.approveAt}</div>
                  </div>)) : 'Chưa được phê duyệt'}
              </div>
              <div className="form-group">
                {data.payments.length ? (
                  <fieldset className="scheduler-border">
                  <legend className="scheduler-border">{'Thông tin thanh toán'}</legend>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th title={'Người nhận thanh toán'}>Người nhận thanh toán</th>
                          <th title={'Số tiền thanh toán'}>Số tiền thanh toán (vnđ)</th>
                          <th title={'Thanh toán lúc'}>Thanh toán lúc</th>
                          <th title={'Phương thức thanh toán'}>Phương thức thanh toán</th>
                        </tr>
                        </thead>
                        <tbody id={`payment-detail-manage-by-sales-order`}>
                          {
                            data.payments.map((item, index) =>
                              <tr key={index}>
                                <td>{item.taker}</td>
                                <td>{this.format_curency(item.money)}</td>
                                <td>{item.paymentAt}</td>
                                <td>{item.paymentType}</td>
                              </tr>
                            )
                          }
                        </tbody>
                    </table>
                    <div>{`Tổng tiền: 200,000 vnđ`}</div>
                  </fieldset>
                ) : ''}
              </div>
            </div>
          </div>
          
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <fieldset className="scheduler-border" style={{ padding: 10 }}>
              <legend className="scheduler-border">Thông tin chi hàng nhập</legend>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th title={'Tên nguyên vật liệu'}>Tên nguyên vật liệu</th>
                      <th title={'Giá (vnđ)'}>Giá (vnđ)</th>
                      <th title={'Số lượng hàng bán'}>Số lượng hàng bán</th>
                      <th title={'Số lượng khuyến mãi'}>Số lượng khuyến mãi</th>
                      <th title={'Số lượng thực xuất'}>Số lượng thực xuất</th>
                      <th title={'Đơn vị tính'}>Đơn vị tính</th>
                      <th title={'Quy tắc đổi trả'}>Quy tắc đổi trả</th>
                      <th title={'Cam kết chất lượng'}>Cam kết chất lượng</th>
                      <th title={'Cam kết chất lượng'}>Thuế</th>
                      <th title={'Thành tiền'}>Thành tiền (vnđ)</th>
                    </tr>
                  </thead>
                  <tbody id={`good-edit-manage-by-stock`}>
                    {
                      (goodDataMerge.length === 0) ? <tr><td colSpan={6}><center>{'Chưa có thông tin nguyên vật liệu'}</center></td></tr> :
                      goodDataMerge.map((item, index) =>
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{this.format_curency(item.price)}</td>
                          <td>{item.quantity}</td>
                          <td>{item.quantityDiscount}</td>
                          <td>{item.quantity + item.quantityDiscount}</td>
                          <td>{item.baseUnit}</td>
                          <td>
                            {item.returnRule.map((item)=>(
                              <span>
                                <i className="fa  fa-check-square-o text-yellow"></i>
                                {` ${item}`}
                                <br />
                              </span>
                            ))}
                          </td>
                          <td>
                            {item.serviceLevelAgreement.map((item)=>(
                              <span>
                                <i className="fa fa-check-square-o text-yellow"></i>
                                {` ${item}`}
                                <br />
                              </span>
                            ))}
                          </td>
                          <td>{item.tax.map((item, index) => <span>
                            <i className="fa   fa-check-square-o text-yellow"></i>
                            {` ${item.name}: ${item.value} %`}
                            <br />
                            </span>)}</td>
                          <td>{this.format_curency(item.quantity * item.price )}</td>
                        </tr>
                      )
                    }
                  </tbody>
              </table>
            </fieldset>
            <div className="form-group">
              <strong>{"Tổng tiền: "}:&emsp; </strong>
              {this.format_curency(data.amount) + ' vnđ'}
            </div>

            <div className="form-group">
              <strong>{"Tiền khuyến mãi: "}:&emsp; </strong>
              {this.format_curency(data.totalDiscounts.money) + ' vnđ'}
            </div>

            <div className="form-group">
              <strong>{"Tích điểm: "}:&emsp; </strong>
              {this.format_curency(data.totalDiscounts.coin) + ' coin'}
            </div>

            <div className="form-group">
              <strong>{"Thuế: "}:&emsp; </strong>
              {this.format_curency(data.totalTax) + ' vnđ'}
            </div>

            <div className="form-group">
              <strong>{"Thành tiền: "}:&emsp; </strong>
              {this.format_curency(data.paymentAmount) + ' vnđ'}
            </div>

            <div className="form-group">
              <strong>{"Dư nợ kỳ trước: "}:&emsp; </strong>
              {this.format_curency(10000000 + data.paymentAmount) + ' vnđ'}
            </div>
            
            <div className="form-group">
              <strong>{"Đã thanh toán: "}:&emsp; </strong>
              {this.format_curency(200000) + ' vnđ'}
            </div>

            <div className="form-group">
              <strong>{"Tổng cần thanh toán: "}:&emsp; </strong>
              {this.format_curency(10000000 + data.paymentAmount - 200000) + ' vnđ'}
            </div>
          </div>
        </div>
         
      </DialogModal>
    </React.Fragment>
    );
  }
}

export default SalesOrderDetailForm
