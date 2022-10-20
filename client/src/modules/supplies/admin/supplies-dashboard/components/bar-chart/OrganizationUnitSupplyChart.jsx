import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import c3 from 'c3';
import 'c3/c3.css'


function OrganizationUnitSupplyChart(props) {

    const [state, setState] = useState([]);
    const { translate,organizationUnitsPriceSupply } = props;
    useEffect(() => {
        let amountSupplies = [];
        let valueSupplies = [];

        for(let i = 0; i < organizationUnitsPriceSupply.length; i++) {
            amountSupplies.push([organizationUnitsPriceSupply[i].name, organizationUnitsPriceSupply[i].quantity]);
            valueSupplies.push([organizationUnitsPriceSupply[i].name, organizationUnitsPriceSupply[i].price]);
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
    }, [organizationUnitsPriceSupply]);

    const barLineChart = (data) => {
        let { translate } = props;
        let amount = 'Số lượng';
        let value = 'Giá trị';
        const types = {
            [amount]: 'line',
            [value]: 'bar',
        }
        const groups = [[value]];
        // thay đổi bằng giá trị name trong phần organizationUnitsPriceSupply
        const category = organizationUnitsPriceSupply.map((item) => {
            let splitName = item.name.split(' ');
            let name = '';
            for(const e of splitName) {
                name += e[0];
            }
            return name.toUpperCase();
        });

        const customAxes = {
            [amount]: 'y2',
            [value]: 'y',
        }

        c3.generate({
            bindto: document.getElementById('organizationUnitSupplyChart'),

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
                <div id="organizationUnitSupplyChart"></div>
            </div>
        </div>
    )


}

export default connect(null, null)(withTranslate(OrganizationUnitSupplyChart));