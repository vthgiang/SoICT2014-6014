
import React, { useState, useEffect } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

function TopIssueReceiptLeast(props) {
    const [state, setState] = useState({
        barChart: true
    })

    const refBarAndLineChart = React.createRef();


    useEffect(() => {
        barAndChart();
    }, [])

    const handleChangeViewChart = (value) => {
        setState({
            ...state,
            barChart: value
        })
    }

    // Khởi tạo BarChart bằng C3
    const barAndChart = () => {
        let { translate } = props;
        const { barChart } = state;
        let chart = c3.generate({
            bindto: refBarAndLineChart.current,
            data: {
                x: 'x',
                columns: [
                    ['x', 'Bút', 'Chuột', 'Bình nước', 'Sách vở', 'Điện thoại'],
                    ['Số lượng', 600, 550, 450, 400, 200],
                ],
                type: 'bar',
                labels: true,
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 100
                }
            }
        });
    }

    const { translate } = props;
    const { barChart } = state;
    barAndChart();
    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Tốp những mặt hàng nhập, xuất ít nhất
                        </h3>
                    <div className="form-inline" style={{ display: 'flex', marginTop: '10px' }}>
                        <div className="form-group">
                            <SelectBox
                                id="multiSelectIssueRecei"
                                className="form-control select2"
                                items={[
                                    { value: '1', text: 'Nhập' },
                                    { value: '0', text: 'Xuất' },
                                ]}
                                // onChange={handleSelectOrganizationalUnit}
                            />
                        </div>
                        <div className="form-group" style={{ display: 'flex' }}>
                            <label>Top</label>
                            <SelectBox
                                id="multiSelectIssueR"
                                className="form-control select2"
                                items={[
                                    { value: '1', text: '5' },
                                    { value: '2', text: '10' },
                                    { value: '3', text: '15' },
                                    { value: '4', text: '20' },
                                ]}
                                // onChange={handleSelectOrganizationalUnit}
                            />
                        </div>
                    </div>
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

                    <div ref={refBarAndLineChart}></div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default withTranslate(TopIssueReceiptLeast);