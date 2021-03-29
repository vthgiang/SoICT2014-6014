import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import useDeepCompareEffect from 'use-deep-compare-effect';
import c3 from 'c3';
import 'c3/c3.css'
function StatisticalAssetByType(props) {

    const [state, setState] = useState([]);
    const { translate } = props;
    useDeepCompareEffect(() => {
        let dataStatistical = [
            [translate('asset.dashboard.amount')],
            [translate('asset.dashboard.value')],
            [translate('asset.dashboard.lost')],
        ]

        let category = [];
        if (props.valueOfAsset && props.valueOfAsset.count) {
            category = [...props.valueOfAsset.shortName];
            for (let i = 1; i < props.valueOfAsset.count.length; i++) {
                dataStatistical[1].push(props.valueOfAsset.count[i])
            }
        }
        if (props.amountOfAsset && props.amountOfAsset.count) {
            for (let i = 1; i < props.amountOfAsset.count.length; i++) {
                dataStatistical[0].push(props.amountOfAsset.count[i])
            }
        }

        if (props.depreciationOfAsset && props.depreciationOfAsset.count) {
            for (let i = 1; i < props.depreciationOfAsset.count.length; i++) {
                dataStatistical[2].push(props.depreciationOfAsset.count[i])
            }
        }

        let amount = translate('asset.dashboard.amount');
        let value = translate('asset.dashboard.value');
        let lost = translate('asset.dashboard.lost');
        const types = {
            [amount]: 'line',
            [value]: 'bar',
            [lost]: 'bar'
        }
        barLineChart(dataStatistical, types, category);
    }, [props.amountOfAsset, props.valueOfAsset, props.depreciationOfAsset]);

    const barLineChart = (data, types, category) => {

        let { translate } = props;
        let amount = translate('asset.dashboard.amount');
        let value = translate('asset.dashboard.value');
        let lost = translate('asset.dashboard.lost');

        const customAxes = {
            [amount]: 'y2',
            [value]: 'y',
            [lost]: 'y'
        }

        c3.generate({
            bindto: document.getElementById('statisticalAssetByType'),

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
                    label: "Tiền (Triệu đồng)",
                },
                y2: {
                    show: true,
                    label: "Số lượng"
                },
            },
        });
    }

    return (
        <div id="statisticalAssetByType"></div>
    )


}

export default connect(null, null)(withTranslate(StatisticalAssetByType));