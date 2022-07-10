
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectBox } from '../../../../../common-components';
import { LotActions } from '../../inventory-management/redux/actions';

function DetailQuantityOfGood(props) {
    const [state, setState] = useState({
        pieChart: true,
        type: 'product',
        currentRole: localStorage.getItem("currentRole"),
        category: [],
        dataChart: [],
        name: [],
        productName: '',
        index: 0,
    })
    let name = [];
    let inventory = ['Hàng tồn kho'];
    let goodReceipted = ['Hàng đã nhập kho'];
    let goodReceipt = ['Hàng chuẩn bị nhập kho'];
    let goodIssued = ['Hàng đã xuất kho'];
    let goodIssue = ['Xuất chuẩn bị xuất kho'];

    let { translate, lots } = props;
    const { inventoryDashboard } = lots;

    useEffect(() => {
        if (!inventoryDashboard.isLoading && inventoryDashboard.length > 0) {
            name = [...name, inventoryDashboard[state.index].name];
            inventory = [...inventory, inventoryDashboard[state.index].inventory];
            goodReceipted = [...goodReceipted, inventoryDashboard[state.index].goodReceipted];
            goodIssued = [...goodIssued, inventoryDashboard[state.index].goodIssued];
            goodReceipt = [...goodReceipt, inventoryDashboard[state.index].goodReceipt];
            goodIssue = [...goodIssue, inventoryDashboard[state.index].goodIssue];
            setState({
                ...state,
                name,
                dataChart: [inventory, goodReceipted, goodIssued, goodReceipt, goodIssue]
            })
        }
    }, [state.index, JSON.stringify(inventoryDashboard)])

    useEffect(() => {
        pieChart(state.name, state.dataChart);
    }, [state.name, state.dataChart])

    const refPieChart = React.createRef();

    const pieChart = (name, dataChart) => {
        c3.generate({
            bindto: refPieChart.current,

            data: {
                columns: dataChart,
                type: 'pie',
            },
            legend: {
                position: 'right'
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

    const handleSelectProduct = async (value) => {
        let index = 0;
        for (let i = 0; i < inventoryDashboard.length; i++) {
            if (inventoryDashboard[i].name === value[0]) {
                index = i;
                break;
            }
        }
        await setState({
            ...state,
            index: index,
        })
    }

    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">{"Xem chi tiết số lượng theo từng sản phẩm"}</h3>
                    <div className="box-body qlcv" >
                        <div className="form-inline" >
                            <div className="form-group" >
                                <label className="form-control-static">{"Chọn hàng hóa"}</label>
                                <SelectBox id="multiSelectqO"
                                    items={inventoryDashboard.map((x, index) => { return { value: x._id, text: x.name } })}
                                    onChange={handleSelectProduct}
                                />
                            </div>
                        </div>
                    </div>
                    <div ref={refPieChart}></div>
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getInventoriesDashboard: LotActions.getInventoriesDashboard,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DetailQuantityOfGood));
