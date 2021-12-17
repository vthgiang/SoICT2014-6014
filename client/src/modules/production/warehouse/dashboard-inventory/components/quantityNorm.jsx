
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import c3 from 'c3';
import 'c3/c3.css';
import './style.css';
import { LotActions } from '../../inventory-management/redux/actions';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox, TreeSelect } from '../../../../../common-components';

function QuantityNorm(props) {
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
        barChart: true,
        type: 'product',
        currentRole: localStorage.getItem("currentRole"),
        category: [],
        dataChart: [],
        name: [],
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

    let { translate, lots } = props;
    const { inventoryDashboard } = lots;

    const refBarChart = React.createRef();

    useEffect(() => {
        barChart();
    }, [])

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

    // Khởi tạo BarChart bằng C3
    const barChart = () => {
        let chart = c3.generate({
            bindto: refBarChart.current,
            data: {
                x: 'x',
                columns: [
                    ['x', '01-2020', '02-2020', '03-2020', '04-2020', '05-2020', '06-2020', '07-2020', '08-2020'],
                    ['Số lượng tồn', 100, 200, 140, 200, 600, 228, 600, 200, 100],
                    ['Số lượng sắp nhập', 50, 150, 70, 30, 50, 228, 200, 60, 40],
                    ['Số lượng sắp xuất', 200, 100, 100, 100, 400, 128, 270, 130, 230]
                ],
                type: 'bar',
                labels: true,
                types: {
                    'Số lượng sắp nhập': 'line',
                    'Số lượng sắp xuất': 'line'
                }
            },
            grid: {
                y: {
                    lines: [{ value: 100, class: 'grid500', text: 'MIN 100' }, { value: 500, class: 'grid500', text: 'MAX 500' }]
                }
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
            },
        });
    }

    barChart();
    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Số lượng tồn kho theo thời gian của từng mặt hàng
                        </h3>
                    <div className="form-inline" style={{ display: 'flex' }}>
                        <div className="form-group" style={{ display: 'flex', marginRight: '20px' }}>
                            <label>Kho</label>
                            <SelectMulti id="multiSelectStock"
                                items={[
                                    { value: '1', text: 'Tạ Quang Bửu' },
                                    { value: '2', text: 'Trần Đại Nghĩa' },
                                    { value: '3', text: 'Đại Cồ Việt' },
                                    { value: '4', text: 'Lê Thanh Nghị' }
                                ]}
                                options={{ nonSelectedText: "Tất cả kho(4)", allSelectedText: "Tất cả kho(4)" }}
                                // onChange={handleSelectOrganizationalUnit}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group" style={{ display: 'flex' }}>
                            <label>Mặt hàng</label>
                            <SelectBox
                                id="multiSelectProduct"
                                className="form-control select2"
                                items={inventoryDashboard.map((x, index) => { return { value: x._id, text: x.name } })}
                                // onChange={handleSelectOrganizationalUnit}
                            />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginTop: '10px' }}>
                        <div className="form-group" style={{ display: 'flex' }}>
                            <label>Thống kê theo</label>
                            <SelectBox
                                id="multiSelect"
                                className="form-control select2"
                                items={[
                                    { value: '1', text: 'Tháng' },
                                    { value: '0', text: 'Ngày' },
                                    { value: '2', text: 'Năm' },
                                ]}
                                // onChange={handleSelectOrganizationalUnit}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Từ Tháng</label>
                            <DatePicker
                                id="monthStartInGoodWillReceipt"
                                dateFormat="month-year"
                                value={defaultStartMonth}
                                onChange={handleSelectMonthStart}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Đến Tháng</label>
                            <DatePicker
                                id="monthEndInGoodWillReceipt"
                                dateFormat="month-year"
                                value={defaultEndMonth}
                                onChange={handleSelectMonthEnd}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('manage_warehouse.bill_management.search')} 
                            // onClick={handleSubmitSearch}
                            >{translate('manage_warehouse.bill_management.search')}</button>
                        </div>
                    </div>
                    <div ref={refBarChart}></div>
                    {/* <div style={{ marginLeft: '70%' }}>
                        <ul className="pagination">
                            <li className="page-item"><a className="page-link" href="#">Trước</a></li>
                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item"><a className="page-link" href="#">4</a></li>
                            <li className="page-item"><a className="page-link" href="#">5</a></li>
                            <li className="page-item"><a className="page-link" href="#">Sau</a></li>
                        </ul>
                    </div> */}
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getInventoriesDashboard: LotActions.getInventoriesDashboard,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuantityNorm));