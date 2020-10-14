import React, { Component } from 'react';
import  ManufacturingOrderPieChart from './manufacturingOrderPieChart'; 
import PurchaseOrderPieChart from './purchaseOrderPieChart';
import PurchaseOrderBarChart from './purchaseOrderBarChart';
import { DatePicker, SelectBox } from '../../../../../common-components';

class ManufacturingOrderDashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <section className="row">
            <div style={{display:'flex', margin: '0px 0px 20px 30px'}}>
                <div style={{display: 'flex', margin: '0px 5px', alignItems: 'center'}}>
                    <span style={{paddingRight: '5px'}}>Định dạng: </span>
                    <SelectBox
                        id={`select-format-date-sales-order-dashboard`}
                        className="form-control select2"
                        // style={{ width: "100%" }}
                        value={''}
                        items={[
                            { value: 'Ngày', text: 'Ngày'},
                            { value: 'Tháng', text: 'Tháng'},
                            { value: 'Năm', text: 'Năm'}
                        ]}
                        onChange={this.handleTypeChange}
                        multiple={false}
                    />
                </div>
                <div style={{display: 'flex', margin: '0px 5px', alignItems: 'center'}}>
                <span style={{paddingRight: '5px'}}>Ngày bắt đầu: </span>
                    <DatePicker
                        id="incident_before"
                        // dateFormat={dateFormat}
                        // value={startValue}
                        onChange={this.onchangeDate}
                        disabled={false}
                        placeholder = 'start date'
                        style={{width: '120px', borderRadius: '4px'}}
                    />
                </div>
                <div style={{display: 'flex', margin: '0px 5px', alignItems: 'center'}}>
                    <span style={{paddingRight: '5px'}}>Ngày kết thúc: </span>
                    <DatePicker
                        id="incident_after"
                        // dateFormat={dateFormat}
                        // value={startValue}
                        onChange={this.onchangeDate}
                        disabled={false}
                        style={{width: '120px', borderRadius: '4px'}}
                    />
                </div>
            </div>

            <div className="col-xs-12">
                <div className="col-md-3 col-sm-6 col-xs-6">
                    <div className="info-box with-border">
                        <span className="info-box-icon bg-red"><i className="fa fa-hand-o-right"></i></span>
                        <div className="info-box-content" title='Tổng tiền mua hàng'>
                            <span className="info-box-text">Số đơn sản xuất</span>
                            <span className="info-box-number">
                               18 đơn
                            </span>
                            <a href={`/manage-manufacturing-order`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-6">
                    <div className="info-box with-border">
                        <span className="info-box-icon bg-green"><i className="fa fa-hand-o-right"></i></span>
                        <div className="info-box-content" title='Tổng tiền mua hàng'>
                            <span className="info-box-text">Số đơn mua NVL</span>
                            <span className="info-box-number">
                               32 đơn
                            </span>
                            <a href={`/manage-purchase-order`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-6">
                    <div className="info-box with-border">
                        <span className="info-box-icon bg-aqua"><i className="fa fa-hand-o-right"></i></span>
                        <div className="info-box-content" title='Tổng tiền mua hàng'>
                            <span className="info-box-text">Tổng tiền mua hàng</span>
                            <span className="info-box-number">
                               236,859,000 vnđ
                            </span>
                            <a href={`/manage-purchase-order`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-6">
                    <div className="info-box with-border">
                        <span className="info-box-icon bg-aqua"><i className="fa fa-hand-o-right"></i></span>
                        <div className="info-box-content" title='Tổng tiền mua hàng'>
                            <span className="info-box-text">Tổng tiền đã thanh toán</span>
                            <span className="info-box-number">
                               120,000,000 vnđ
                            </span>
                            <a href={`/manage-purchase-order`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xs-12">
                <div className="col-xs-6">
                    <div className="box box-primary">
                        {/**Biểu đồ  */}
                        <div className="box-header with-border">
                            <div className="box-title">Trạng thái các đơn sản xuất</div>
                        </div>
                        <div className="box-body qlcv">
                            <div> </div>
                            <ManufacturingOrderPieChart/>
                        </div>
                    </div>
                </div>

                <div className="col-xs-6">
                    <div className=" box box-primary">
                        {/**Biểu đồ*/}
                        <div className="box-header with-border">
                            <div className="box-title">Trạng thái đơn mua NVL</div>
                        </div>
                        <div className="box-body qlcv">
                            <div style={{position: 'absolute', top:  '35px', left: '10px'}}></div>
                            <PurchaseOrderPieChart/>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xs-12">
                <div className="box box-primary">
                    {/**Biểu đồ  */}
                    <div className="box-header with-border">
                        <div className="box-title">Thống kê mua nguyên vật liệu</div>
                    </div>
                    <div className="box-body qlcv">
                        <div> </div>
                        <PurchaseOrderBarChart/>
                    </div>
                </div>
            </div>
        </section>
      </React.Fragment>
    );
  }
}

export default ManufacturingOrderDashboard;