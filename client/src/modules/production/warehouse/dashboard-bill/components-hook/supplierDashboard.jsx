
import React, { useState, useEffect } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

function SupplierDashboard(props) {
    const [state, setState] = useState({
        pieChart: true
    })

    const refPieChart = React.createRef();

    useEffect(() => {
        pieChart();
    }, [])

    const pieChart = () => {
        let chart = c3.generate({
            bindto: refPieChart.current,

            data: {
                columns: [
                    ['Khách bán buôn', 30],
                    ['Sỉ lẻ', 50],
                    ['Nhà cung cấp Đức Anh', 90],
                    ['Đại lý Việt Anh', 20],
                ],
                type: 'pie',
            },

            pie: {
                label: {
                    format: function (value, ratio, id) {
                        return value;
                    }
                }
            },

            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            tooltip: {
                format: {
                    title: function (d) { return d; },
                    value: function (value) {
                        return value;
                    }
                }
            },

            legend: {
                show: true
            }
        });
    }

    const { translate } = props;
    pieChart();
    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Xem số lượng phiếu nhập cho từng nhóm nhà cung cấp
                        </h3>
                    {/* <div className="form-inline" style={{marginTop: '10px'}}>
                            <div className="form-group" style={{display: 'flex', marginBottom: '10px', width: '70%'}}>
                                    <label>Nhóm nhà cung cấp</label>
                                    <SelectMulti
                                        id={`select-multi-supplier-dashboard`}
                                        multiple="multiple"
                                        options={{ nonSelectedText: "Tất cả", allSelectedText: "Tất cả" }}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={[
                                            { value: '1', text: "Khách bán buôn"},
                                            { value: '2', text: "Sỉ lẻ"},
                                            { value: '3', text: "Nhà cung cấp Anh Đức"},
                                            { value: '3', text: "Đai lý Việt Anh"},
                                        ]}
                                        onChange={handleCategoryChange}
                                    />
                                </div>
                        </div> */}
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Từ</label>
                            <DatePicker
                                id="purchase-month"
                                dateFormat="month-year"
                                value=""
                                // onChange={handlePurchaseMonthChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Đến</label>
                            <DatePicker
                                id="purchase-month"
                                dateFormat="month-year"
                                value=""
                                // onChange={handlePurchaseMonthChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} 
                            // onClick={handleSubmitSearch}
                            >{translate('manage_warehouse.bill_management.search')}</button>
                        </div>
                    </div>
                    <div ref={refPieChart}></div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default withTranslate(SupplierDashboard);