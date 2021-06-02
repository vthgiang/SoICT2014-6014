import React, { useState, useEffect } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

function GoodWillReceipt(props) {
    const [state, setState] = useState({
        barAndLineChart: false
    })

    const refBarAndChart = React.createRef();

    useEffect(() => {
        barAndChart();
    }, [])

    const handleChangeViewChart = (value) => {
        setState({
            ...state,
            barAndLineChart: value
        })
    }

    // Khởi tạo BarChart bằng C3
    const barAndChart = () => {
        let { translate } = props;
        const { barAndLineChart } = state;
        let chart = c3.generate({
            bindto: refBarAndChart.current,
            data: {
                x: 'x',
                columns: [
                    ['x', '13-10-2020', '14-10-2020', '15-10-2020', '16-10-2020', '17-10-2020', '18-10-2020', '19-10-2020', '20-10-2020'],
                    ['Số lượng', 0, 0, 140, 0, 300, 228, 400, 0],
                ],
                type: barAndLineChart ? 'bar' : '',
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 70
                }
            }
        });
    }

    const { translate } = props;
    const { barAndLineChart } = state;
    barAndChart();
    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Xem số lượng sẽ nhập kho của từng mặt hàng
                        </h3>
                    <div className="form-inline" style={{ marginTop: '10px' }}>
                        <div className="form-group" style={{ display: 'flex', marginBottom: '10px' }}>
                            <label>Chọn mặt hàng</label>
                            <SelectBox
                                id="multiSelectOrgani"
                                className="form-control select2"
                                items={[
                                    { value: '0', text: 'Albendazole' },
                                    { value: '1', text: 'Afatinib' },
                                    { value: '2', text: 'Zoledronic Acid' },
                                    { value: '3', text: 'Abobotulinum' },
                                    { value: '4', text: 'Acid Thioctic' }
                                ]}
                                // onChange={handleSelectOrganizationalUnit}
                            />
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Từ ngày</label>
                            <DatePicker
                                id="purchase-month"
                                value=""
                                // onChange={handlePurchaseMonthChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Đến ngày</label>
                            <DatePicker
                                id="purchase-month"
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
                    <div className="dashboard_box_body">
                        <p className="pull-left" style={{ marginBottom: 0 }}><b>ĐV tính: Hộp</b></p>
                        <div className="box-tools pull-right">
                            <div className="btn-group pull-rigth">
                                <button type="button" className={`btn btn-xs ${barAndLineChart ? "active" : "btn-danger"}`} onClick={() => handleChangeViewChart(false)}>Line chart</button>
                                <button type="button" className={`btn btn-xs ${barAndLineChart ? 'btn-danger' : "active"}`} onClick={() => handleChangeViewChart(true)}>Bar chart</button>
                            </div>
                        </div>
                        <div ref={refBarAndChart}></div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default withTranslate(GoodWillReceipt);