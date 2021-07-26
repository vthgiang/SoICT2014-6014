import React, { useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import useDeepCompareEffect from 'use-deep-compare-effect';
import c3 from 'c3';
import 'c3/c3.css'
import Swal from 'sweetalert2';


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


    const showDetailAssetGroup = () => {
        Swal.fire({
            icon: "question",

            html: `<h3 style="color: red"><div>Các nhóm tài sản</div> </h3>
            <div style="font-size: 1.3em; text-align: left; margin-top: 15px; line-height: 1.7">
            <ul>
                <li><b>Mặt bằng: </b>bao gồm nhà, công trình xây dựng, vật kiến trúc,...</li>
                <li><b>Xe cộ: </b>bao gồm các phương tiện vận tải</li>
                <li><b>Máy móc: </b>bao gồm các loại máy móc, thiết bị văn phòng, thiết bị truyền dẫn, thiết bị động lực, thiết bị chuyên dùng, thiết bị đo lường thí nghiệm,...</li>
                <li><b>Khác: </b> bao gồm cây lâu năm, súc vật, trang thiết bị dễ hỏng dễ vỡ hay các tài sản cố định hữu hình khác, các tài sản cố định vô hình, các tài sản cố định đặc thù,...</li>
            </ul>
            <p>Ví dụ một số tài sản được phân lần lượt vào các nhóm như sau:</p>
            <ul>
               <li><b>Mặt bằng: </b>như nhà văn hóa,....</li>
                <li><b>Xe cộ: </b>một số tài sản như xe ô tô, xe mô tô/gắn máy,...</li>
                <li><b>Máy móc: </b>bao gồm một số loại tài sản như máy sưởi, máy hút bụi,....</li>
                <li><b>Khác: </b> gồm một số tài sản như cây xanh, bản quyền phần mềm, ứng dụng,....</li>
            </ul>`,
            width: "50%",
        })
    }

    return (
        <div className="box box-solid">
            <div className="box-header">
                <div style={{ marginRight: '5px' }} className="box-title">Thống kê tài sản theo nhóm</div>
                <a className="text-red" title={'Giải thích các nhóm tài sản'} onClick={showDetailAssetGroup}>
                    <i className="fa fa-question-circle" style={{ cursor: 'pointer', color: '#dd4b39' }} />
                </a>
            </div>
            <div className="box-body qlcv">
                <div id="statisticalAssetByGroup"></div>
            </div>
        </div>
    )


}

export default connect(null, null)(withTranslate(StatisticalAssetByGroup));