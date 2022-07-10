
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
        name: [],
        searchType: '0',
    })

    useEffect(() => {
        props.getAllLots({ managementLocation: state.currentRole });
    }, [])

    useEffect(() => {
        barChart(state.name, state.dataChart);
    }, [state.name, state.dataChart])

    // Khởi tạo BarChart bằng C3
    const barChart = (name, dataChart) => {
        c3.generate({
            bindto: refBarChart.current,
            data: {
                // x: 'x',
                columns: dataChart,
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

    const handleSearchTypeChange = (value) => {
        setState({
            ...state,
            searchType: value[0]
        })
    }

    const getDataForChart = () => {
        const { lots } = props;
        const { listLots } = lots;
    }

    let { translate, lots } = props;
    const { inventoryDashboard } = lots;
    const { searchType } = state;
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
    const dataType = [
        {
            value: '0',
            text: "Lô hàng sắp hết hạn"
        },
        {
            value: '1',
            text: "Lô hàng đã hết hạn"
        }
    ]
    let dataForChart = getDataForChart();
    console.log(props.lots);
    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">{"Lô hàng tồn kho sắp hết hạn sử dụng"}</h3>
                    <div className="box-body qlcv" >
                        <div className="form-inline" >
                            <div className="form-group" >
                                <label className="form-control-static">{"Chọn loại"}</label>
                                <SelectBox
                                    id={`select-type-dashboard`}
                                    className="form-control select2"
                                    value={searchType}
                                    items={dataType}
                                    onChange={handleSearchTypeChange}
                                    multiple={false}
                                />
                            </div>
                        </div>
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
    getAllLots: LotActions.getAllLots,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(QuantityExpirationDate));
