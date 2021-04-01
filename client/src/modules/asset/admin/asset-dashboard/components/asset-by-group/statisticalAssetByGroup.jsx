import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import useDeepCompareEffect from 'use-deep-compare-effect';
import c3 from 'c3';
import 'c3/c3.css'
function StatisticalAssetByGroup(props) {

    const [state, setState] = useState([]);
    const { translate } = props;
    useDeepCompareEffect(() => {
        let lineBarChart = [
            [translate('asset.dashboard.amount')],
            [translate('asset.dashboard.value')],
            [translate('asset.dashboard.lost')],
        ]

        const indices = { amount: 0, value: 1, lost_value: 2 };
        for (const [key, value] of props.amountOfAsset) {
            lineBarChart[indices.amount].push(value);
        }
        for (const [key, value] of props.valueOfAsset) {
            lineBarChart[indices.value].push(value);
        }
        for (const [key, value] of props.depreciationOfAsset) {
            lineBarChart[indices.lost_value].push(value);
        }
        barLineChart(lineBarChart);
    }, [props.amountOfAsset, props.valueOfAsset, props.depreciationOfAsset]);

    const barLineChart = (data) => {
        let { translate } = props;
        let amount = translate('asset.dashboard.amount');
        let value = translate('asset.dashboard.value');
        let lost = translate('asset.dashboard.lost');
        const types = {
            [amount]: 'line',
            [value]: 'bar',
            [lost]: 'bar'
        }
        const category = [
            translate('asset.dashboard.building'),
            translate('asset.asset_info.vehicle'),
            translate('asset.dashboard.machine'),
            translate('asset.dashboard.other')
        ]

        const customAxes = {
            [amount]: 'y2',
            [value]: 'y',
            [lost]: 'y'
        }

        c3.generate({
            bindto: document.getElementById('statisticalAssetByGroup'),

            data: {
                columns: data,
                types: types,
                axes: customAxes
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
            <div className="box-header">
                <div className="box-title">Thống kê tài sản theo nhóm</div>
            </div>
            <div className="box-body qlcv">
                <div id="statisticalAssetByGroup"></div>
            </div>
        </div>
    )


}

export default connect(null, null)(withTranslate(StatisticalAssetByGroup));