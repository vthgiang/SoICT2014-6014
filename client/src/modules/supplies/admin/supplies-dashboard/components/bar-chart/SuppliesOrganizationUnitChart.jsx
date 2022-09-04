import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import c3 from 'c3';
import 'c3/c3.css'
import {DataTableSetting, PaginateBar} from "../../../../../../common-components";
import {getTableConfiguration} from "../../../../../../helpers/tableConfiguration";
import _deepClone from "lodash/cloneDeep";


function SupplyOrganizationUnitChart(props) {

    const [state, setState] = useState(() => initState())

    const { perPage, nameSupplies, supplyCount, page, pageTotal, total, display } = state;
    function initState() {
        const defaultConfig = { limit: 10 }
        const supplyOrganizationUnitChartId = "supplyOrganizationUnitChart";
        const supplyOrganizationUnitChartPerPage = getTableConfiguration(supplyOrganizationUnitChartId, defaultConfig).limit;

        return {
            perPage: supplyOrganizationUnitChartPerPage,
        }
    }

    const { translate,supplyOrganizationUnitPrice } = props;

    const getDataChart = () => {
        let amountSupplies = [];
        let valueSupplies = [];

        for(let i = 0; i < supplyOrganizationUnitPrice.length; i++) {
            amountSupplies.push([supplyOrganizationUnitPrice[i].name, supplyOrganizationUnitPrice[i].quantity]);
            valueSupplies.push([supplyOrganizationUnitPrice[i].name, supplyOrganizationUnitPrice[i].price]);
        }

        let lineBarChart = [
            [translate('asset.dashboard.amount')],
            [translate('asset.dashboard.value')],
        ]

        const indices = { amount: 0, value: 1};

        for (const [key, value] of amountSupplies) {
            lineBarChart[indices.amount].push(value);
        }

        for (const [key, value] of valueSupplies) {
            lineBarChart[indices.value].push(value);
        }

        return lineBarChart;
    }

    useEffect(() => {

        let data = _deepClone(getDataChart());
        let nameSupplies = supplyOrganizationUnitPrice?.map(item => item.name)?.slice(0, perPage);
        let supplyCount = data;
        for (let i in supplyCount) {
            supplyCount[i] = supplyCount[i].slice(0, 1).concat(supplyCount[i].slice(1, perPage + 1))
        }
        setState({
            ...state,
            nameSupplies: nameSupplies,
            supplyCount: supplyCount,
            total: supplyOrganizationUnitPrice?.length,
            pageTotal: Math.ceil(supplyOrganizationUnitPrice?.length / perPage),
            page: 1,
            display: nameSupplies.length
        });
        console.log('state: ', state);
    }, [JSON.stringify(supplyOrganizationUnitPrice)]);

    useEffect(() => {
        if (state.nameSupplies && state.supplyCount) {
            barLineChart();
        }
    }, [JSON.stringify(state.nameSupplies), JSON.stringify(state.supplyCount)]);

    const handlePaginationDistributionOfEmployeeChart = (page) => {
        let dataChart = getDataChart();
        if (dataChart) {
            let data = _deepClone(dataChart);
            let begin = (Number(page) - 1) * perPage
            let end = (Number(page) - 1) * perPage + perPage
            let nameSupplies = supplyOrganizationUnitPrice?.map(item => item.name)?.slice(begin, end);
            let supplyCount = data;
            for (let i in supplyCount) {
                supplyCount[i] = supplyCount[i].slice(0, 1).concat(supplyCount[i].slice(begin + 1, end + 1))
            }

            setState({
                ...state,
                nameSupplies: nameSupplies,
                supplyCount: supplyCount,
                page: page,
                display: nameSupplies.length
            });
        }
    }
    const setLimitDistributionOfEmployeeChart = (limit) => {
        const  dataChart = getDataChart();

        if (dataChart) {
            let data = _deepClone(dataChart);
            let nameSupplies = supplyOrganizationUnitPrice?.map(item => item.name)?.slice(0, Number(limit));
            let supplyCount = data;
            for (let i in supplyCount) {
                supplyCount[i] = supplyCount[i].slice(0, 1).concat(supplyCount[i].slice(1,  Number(limit) + 1))
            }

            setState({
                ...state,
                nameSupplies: nameSupplies,
                supplyCount: supplyCount,
                total: supplyOrganizationUnitPrice?.length,
                pageTotal: Math.ceil(supplyOrganizationUnitPrice?.length / Number(limit)),
                page: 1,
                perPage: Number(limit),
                display: nameSupplies.length
            });
        }
    }
    const removePreviousChart = () => {
        const chart = document.getElementById("supplyOrganizationUnitChart");

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const barLineChart = () => {
        removePreviousChart();

        let data = supplyCount;
        let amount = 'Số lượng';
        let value = 'Giá trị';
        const types = {
            [amount]: 'line',
            [value]: 'bar',
        }
        const groups = [[value]];
        // thay đổi bằng giá trị name trong phần supplyOrganizationUnitPrice
        const category = nameSupplies ? nameSupplies : [];

        const customAxes = {
            [amount]: 'y2',
            [value]: 'y',
        }

        c3.generate({
            bindto: document.getElementById('supplyOrganizationUnitChart'),

            data: {
                columns: data,
                types: types,
                axes: customAxes,
                groups: groups
            },

            padding: {
                bottom: 20,
                right: 20
            },

            axis: {
                x: {
                    type: 'category',
                    categories: category,
                    tick: {
                        multiline: false
                    }
                },
                y: {
                    label: "Tiền (vnđ)",
                    tick: {
                        format: function (value) {
                            let valueByUnit, unit;
                            if (value >= 1000000000) {
                                valueByUnit = Math.round(value / 1000000000);
                                unit = "B";
                            }
                            else {
                                valueByUnit = Math.round(value / 1000000);
                                unit = "M";
                            }
                            return valueByUnit + unit;
                        }
                    }
                },
                y2: {
                    show: true,
                    label: "Số lượng"
                },
            },
        });
    }

    return (
        <>
            <DataTableSetting
                tableId={"supply-organization-chart"}
                setLimit={setLimitDistributionOfEmployeeChart}
            />

            <div className="box box-solid" style={{marginTop: '30px'}}>
                <div className="box-body qlcv">
                    <div id="supplyOrganizationUnitChart"/>
                </div>

                <PaginateBar
                    display={display}
                    total={total}
                    pageTotal={pageTotal}
                    currentPage={page}
                    func={handlePaginationDistributionOfEmployeeChart}
                />
            </div>
        </>
    )


}

export default connect(null, null)(withTranslate(SupplyOrganizationUnitChart));