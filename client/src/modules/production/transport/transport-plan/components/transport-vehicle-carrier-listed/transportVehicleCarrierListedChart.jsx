import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import useDeepCompareEffect from 'use-deep-compare-effect';
import c3 from 'c3';
import 'c3/c3.css'
function TransportVehicleCarrierListedChart(props) {

    const columnClick = (event) => {
        console.log(event, " aaaaaaaaaa");
        setIndexClick(event.index)
    }

    const { listDay, countVehicles, countCarriers, setIndexClick } = props;
    // useDeepCompareEffect(() => {
    //     let lineBarChart = [
    //         [translate('asset.dashboard.amount')],
    //         [translate('asset.dashboard.value')],
    //         [translate('asset.dashboard.lost')],
    //     ]

    //     const indices = { amount: 0, value: 1, lost_value: 2 };
    //     for (const [key, value] of props.amountOfAsset) {
    //         lineBarChart[indices.amount].push(value);
    //     }
    //     for (const [key, value] of props.valueOfAsset) {
    //         lineBarChart[indices.value].push(value);
    //     }
    //     for (const [key, value] of props.depreciationOfAsset) {
    //         lineBarChart[indices.lost_value].push(value);
    //     }
    //     barLineChart(lineBarChart);
    // }, [props.amountOfAsset, props.valueOfAsset, props.depreciationOfAsset]);
    useEffect(() => {
        let barChart = [
            ["Phương tiện"],
            ["Nhân viên"],
        ]
        // for (const [key, value] of countVehicles){
        //     bar-chart[0].push(value);
        // }
        // for (const [key, value] of countCarriers){
        //     bar-chart[1].push(value);
        // }
        if (countVehicles && countVehicles.length !==0 ){
            countVehicles.map(item => {
                barChart[0].push(item);
            })
        }
        if (countCarriers && countCarriers.length !==0 ){
            countCarriers.map(item => {
                barChart[1].push(item);
            })
        }
        barLineChart(barChart);
    }, [countCarriers, countVehicles])
    const barLineChart = (data) => {
        const types = {
            // [amount]: 'line',
            ["Phương tiện"]: 'bar',
            ["Nhân viên"]: 'bar'
        }
        // const category = [
        //     translate('asset.dashboard.building'),
        //     translate('asset.asset_info.vehicle'),
        //     translate('asset.dashboard.machine'),
        //     translate('asset.dashboard.other')
        // ]

        // const customAxes = {
        //     [amount]: 'y2',
        //     [value]: 'y',
        //     [lost]: 'y'
        // }

        c3.generate({
            bindto: document.getElementById('transportVehicleCarrierListed'),

            data: {
                columns: data,
                types: types,
                // types: 'bar',
                // axes: customAxes
                onclick: columnClick
            },

            padding: {
                bottom: 20,
                right: 20
            },

            axis: {
                x: {
                    type: 'category',
                    categories: listDay,
                    tick: {
                        multiline: false
                    }
                },
                // y: {
                //     label: "Tiền (vnđ)",
                //     tick: {
                //         format: function (value) {
                //             let valueByUnit, unit;
                //             if (value >= 1000000000) {
                //                 valueByUnit = Math.round(value / 1000000000);
                //                 unit = "B";
                //             }
                //             else {
                //                 valueByUnit = Math.round(value / 1000000);
                //                 unit = "M";
                //             }
                //             return valueByUnit + unit;
                //         }
                //     }
                // },
                // y2: {
                //     show: true,
                //     label: "Số lượng"
                // },
            },
        });
    }

    return (
        <div className="box box-solid">
            <div className="box-header">
                <div className="box-title">Thống kê phương tiện và nhân viên vận chuyển</div>
            </div>
            <div className="box-body qlcv">
                <div id="transportVehicleCarrierListed"></div>
            </div>
        </div>
    )
}
function mapState(state) {
    const {transportDepartment, transportVehicle } = state;
    return { transportDepartment, transportVehicle }
}

const actions = {
}
const connectedTransportVehicleCarrierListedChart = connect(mapState, actions)(withTranslate(TransportVehicleCarrierListedChart));
export { connectedTransportVehicleCarrierListedChart as TransportVehicleCarrierListedChart };