import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Swal from 'sweetalert2';
import c3 from 'c3';
import 'c3/c3.css';
import { LotActions } from '../../inventory-management/redux/actions';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

function GoodWillIssue(props) {
    let today = new Date(),
        month = today.getMonth() + 1,
        year = today.getFullYear();
    let endMonth;

    if (month < 10) {
        endMonth = '0' + month;
    } else {
        endMonth = month;
    }

    const INFO_SEARCH = {
        startMonth: year + '-01',
        endMonth: [year, endMonth].join('-')
    };
    const [state, setState] = useState({
        barAndLineChart: true,
        type: '',
        name: [],
        dataChart: [],
        productName: '',
        startMonth: INFO_SEARCH.startMonth,
        endMonth: INFO_SEARCH.endMonth,
        infosearch: {
            startMonth: INFO_SEARCH.startMonth,
            endMonth: INFO_SEARCH.endMonth,
        },

        defaultEndMonth: [endMonth, year].join('-'),
        defaultStartMonth: ['01', year].join('-'),
    })
    const { defaultEndMonth, defaultStartMonth } = state;

    const refBarAndLineChart = React.createRef();

    const { translate, lots, stocks, categories } = props;
    const { inventoryDashboard } = lots;

    if (inventoryDashboard.length > 0 && state.dataChart.length == 0) {
        let name = [];
        let goodIssue = ['Số lượng hàng sẽ xuất'];
        for (let i = 0; i < inventoryDashboard.length; i++) {
            name = [...name, inventoryDashboard[i].name];
            goodIssue = [...goodIssue, inventoryDashboard[i].goodIssue];
        }
        setState({
            ...state,
            name,
            dataChart: [goodIssue]
        })
    }

    useEffect(() => {
        barAndLineChart(state.name, state.dataChart);
    }, [state.name, state.dataChart])

    const handleChangeViewChart = (value) => {
        setState({
            ...state,
            barAndLineChart: value
        })
    }

    // Khởi tạo BarChart bằng C3
    const barAndLineChart = (name, dataChart) => {
        let { translate } = props;
        const { barAndLineChart } = state;
        let chart = c3.generate({
            bindto: refBarAndLineChart.current,
            data: {
                // x: 'x',
                columns: dataChart,
                // type: barAndLineChart ? 'bar' : '',
                type: 'line',
                labels: true,
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 0,
                        multiline: false
                    },
                    categories: ['13-6-2021', '14-6-2021', '15-6-2021', '16-6-2021'],
                    height: 70
                }
            }
        });
    }

    const handleSelectProduct = (value) => {
        setState({
            ...state,
            productName: value
        })
    }

    /** Select month start in box */
    const handleSelectMonthStart = (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setState({
            ...state,
            startMonth: month
        })
    };

    /** Select month end in box */
    const handleSelectMonthEnd = async (value) => {
        let month = value.slice(3, 7) + '-' + value.slice(0, 2);
        setState({
            ...state,
            endMonth: month
        })
    };

    /** Search data */
    const handleSearchData = async () => {
        let startMonth = new Date(state.startMonth);
        let endMonth = new Date(state.endMonth);
        if (startMonth.getTime() > endMonth.getTime()) {
            const { translate } = props;
            Swal.fire({
                title: translate('manage_warehouse.dashboard_inventory.wrong_time'),
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: translate('manage_warehouse.dashboard_inventory.confirm')
            })
        } else {
            await setState({
                ...state,
                infosearch: {
                    ...state.infosearch,
                    startMonth: state.startMonth,
                    endMonth: state.endMonth
                }
            })
            // props.organizationalUnitIds && props.getAllEmployeeKpiSetInOrganizationalUnitsByMonth(props.organizationalUnitIds, state.startMonth, state.endMonth);
        }
    };

    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Xem số lượng sẽ xuất kho của từng mặt hàng
                    </h3>
                    <div className="form-inline" style={{ marginTop: '10px' }}>
                        <div className="form-group" style={{ display: 'flex', marginBottom: '10px' }}>
                            <label>Mặt hàng</label>
                            <SelectBox
                                id="selectProduct"
                                className="form-control select2"
                                items={inventoryDashboard.map((x, index) => { return { value: x._id, text: x.name } })}
                                onChange={handleSelectProduct}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Từ Tháng</label>
                            <DatePicker
                                id="monthStartInGoodWillIssue"
                                dateFormat="month-year"
                                value={defaultStartMonth}
                                onChange={handleSelectMonthStart}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Đến Tháng</label>
                            <DatePicker
                                id="monthEndInGoodWillIssue"
                                dateFormat="month-year"
                                value={defaultEndMonth}
                                onChange={handleSelectMonthEnd}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success"
                                onClick={handleSearchData}>{translate('manage_warehouse.bill_management.search')}</button>
                        </div>

                    </div>
                    <div className="dashboard_box_body">
                        <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: Hộp</b></p>
                        <div className="box-tools pull-right">
                            <div className="btn-group pull-rigth">
                                <button type="button" className={`btn btn-xs ${barAndLineChart ? "active" : "btn-danger"}`} onClick={() => handleChangeViewChart(false)}>Line chart</button>
                                <button type="button" className={`btn btn-xs ${barAndLineChart ? 'btn-danger' : "active"}`} onClick={() => handleChangeViewChart(true)}>Bar chart</button>
                            </div>
                        </div>
                        <div ref={refBarAndLineChart}></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getInventoriesDashboard: LotActions.getInventoriesDashboard,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(GoodWillIssue));
