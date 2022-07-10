import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import c3 from 'c3';
import 'c3/c3.css'


function SupplyOrganizationUnitChart(props) {

    const [state, setState] = useState([]);
    const { translate,supplyOrganizationUnitPrice } = props;
    useEffect(() => {
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

        console.log('DEBUG amountOfAsset: ', amountSupplies);
        for (const [key, value] of amountSupplies) {
            lineBarChart[indices.amount].push(value);
        }

        console.log('DEBUG amountOfAsset: ', valueSupplies);
        for (const [key, value] of valueSupplies) {
            lineBarChart[indices.value].push(value);
        }
        barLineChart(lineBarChart);
    }, [supplyOrganizationUnitPrice]);

    const barLineChart = (data) => {
        let { translate } = props;
        let amount = 'Số lượng';
        let value = 'Giá trị';
        const types = {
            [amount]: 'line',
            [value]: 'bar',
        }
        const groups = [[value]];
        // thay đổi bằng giá trị name trong phần supplyOrganizationUnitPrice
        const category = supplyOrganizationUnitPrice?.map(item => item.name)

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
        <div className="box box-solid">
            <div className="box-body qlcv">
                <div id="supplyOrganizationUnitChart"/>
            </div>
        </div>
    )


}

export default connect(null, null)(withTranslate(SupplyOrganizationUnitChart));