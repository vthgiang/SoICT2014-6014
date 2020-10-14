import React, { Component } from 'react';

import QuoterSummaryChart from './quoterSummaryChart';
import QuoterSalesMappingAreaChart from './quoterSalesMappingAreaChart';
import TopCareBarChart from './topCareBarChart';
import RevenueAndSalesBarChart  from './revenueAndSalesBarChart';
import SalesOrderStatusChart from './salesOrderStatusChart';
import TopSoldBarChart from './topSoldBarChart';
import { DatePicker, SelectBox } from '../../../../../common-components';

class QuoterDashboard extends Component {

    onchangeDate = () => {

    }

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
                            <span className="info-box-icon bg-aqua"><i className="fa fa-hand-o-right"></i></span>
                            <div className="info-box-content" title='Tổng tiền mua hàng'>
                                <span className="info-box-text">Số đơn báo giá</span>
                                <span className="info-box-number">
                                1893 đơn
                                </span>
                                <a href={`/manage-purchase-order`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-green"><i className="fa fa-hand-o-right"></i></span>
                            <div className="info-box-content" title='Tổng tiền mua hàng'>
                                <span className="info-box-text">Số đơn kinh doanh</span>
                                <span className="info-box-number">
                                983 đơn
                                </span>
                                <a href={`/manage-sales-order`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-red"><i className="fa fa-hand-o-right"></i></span>
                            <div className="info-box-content" title='Tổng tiền mua hàng'>
                                <span className="info-box-text">Doanh số</span>
                                <span className="info-box-number">
                                1,334,553,332.00 vnđ
                                </span>
                                <a href={`/manage-sales-order`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-xs-6">
                        <div className="info-box with-border">
                            <span className="info-box-icon bg-yellow"><i className="fa fa-hand-o-right"></i></span>
                            <div className="info-box-content" title='Tổng tiền mua hàng'>
                                <span className="info-box-text">Doanh thu</span>
                                <span className="info-box-number">
                                893,425,500.00 vnđ
                                </span>
                                <a href={`/manage-sales-order`} target="_blank" >Xem thêm <i className="fa fa-arrow-circle-right"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xs-12">
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            {/**Biểu đồ đơn báo giá */}
                            <div className="box-header with-border">
                                <div className="box-title">Biểu đồ tổng kết báo giá</div>
                            </div>
                            <div className="box-body qlcv">
                                <div> </div>
                                <QuoterSummaryChart/>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-6">
                        <div className=" box box-primary">
                            {/**Biểu đồ*/}
                            <div className="box-header with-border">
                                <div className="box-title">Top 5 sản phẩm được quan tâm nhất</div>
                            </div>
                            <div className="box-body qlcv">
                                <div style={{position: 'absolute', top:  '35px', left: '10px'}}></div>
                                <TopCareBarChart/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12">
                    <div className=" box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Mức tương quan giữa báo giá và đơn hàng</div>
                        </div>
                        <div className="box-body qlcv">
                            <QuoterSalesMappingAreaChart/>
                        </div>
                    </div>
                </div>

                <div className="col-xs-12">
                    <div className=" box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Doanh số bán hàng và doanh thu</div>
                        </div>
                        <div className="box-body qlcv">
                            <RevenueAndSalesBarChart/>
                        </div>
                    </div>
                </div>

                <div className="col-xs-12">
                    <div className="col-xs-6">
                        <div className="box box-primary">
                            {/**Biểu đồ  */}
                            <div className="box-header with-border">
                                <div className="box-title">Thống kê trạng thái đơn hàng</div>
                            </div>
                            <div className="box-body qlcv">
                                <div> </div>
                                <SalesOrderStatusChart/>
                            </div>
                        </div>
                    </div>

                    <div className="col-xs-6">
                        <div className=" box box-primary">
                            {/**Biểu đồ  */}
                            <div className="box-header with-border">
                                <div className="box-title">Top 5 sản phẩm bán chạy nhất</div>
                            </div>
                            <div className="box-body qlcv">
                                <div style={{position: 'absolute', top:  '35px', left: '10px'}}></div>
                                <TopSoldBarChart/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
  }
}

export default QuoterDashboard;

