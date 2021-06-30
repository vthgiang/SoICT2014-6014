
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';
import { LotActions } from '../../inventory-management/redux/actions';

function QuantityExpirationDate(props) {
    const [state, setState] = useState({
        barChart: true,
        type: 'product',
        currentRole: localStorage.getItem("currentRole"),
        category: [],
        dataChart: [],
        name: []
    })

    let { translate, lots } = props;
    const { inventoryDashboard } = lots;
    const { type, category, startDate, endDate } = state;
    const refBarChart = React.createRef();

    if (inventoryDashboard.length > 0 && state.dataChart.length == 0) {
        let name = [];
        let inventory = ['Tồn kho'];
        for (let i = 0; i < inventoryDashboard.length; i++) {
            name = [...name, inventoryDashboard[i].name];
            inventory = [...inventory, inventoryDashboard[i].inventory];
        }
        setState({
            ...state, 
            name,
            dataChart: [inventory]
        })
    }

    useEffect(() => {
        barChart(state.name, state.dataChart);
    }, [state.name, state.dataChart])

    // Khởi tạo BarChart bằng C3
    const barChart = (name, dataChart) => {
        let chart = c3.generate({
            bindto: refBarChart.current,
            data: {
                // x: 'x',
                columns:dataChart,
                type: 'bar',
                labels: true,
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 0,
                        multiline: false
                    },
                    categories: name,
                    height: 100
                }
            }
        });
    }

    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Số lượng mặt hàng tồn kho sắp hết hạn sử dụng
                    </h3>
                    <div className="form-group" style={{ width: '100%', display: 'flex', margin: '10px' }}>
                        <label style={{ marginRight: '10px' }} className="form-control-static">{translate('manage_warehouse.bill_management.to_date')}</label>
                        <DatePicker
                            id="purchase-month"
                            dateFormat="month-year"
                            value=""
                        // onChange={handlePurchaseMonthChange}
                        />
                    </div>
                    <div ref={refBarChart}></div>
                </div>
            </div>
        </React.Fragment>
    )
}
const mapStateToProps = state => state;

const mapDispatchToProps = {
    getInventoriesDashboard: LotActions.getInventoriesDashboard,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuantityExpirationDate));
