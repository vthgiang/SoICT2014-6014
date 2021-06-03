
import React, { useState, useEffect } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

function QuantityExpiratedDate(props){
    const [state, setState] = useState({
        pieChart: true
    })

    const refPieChart = React.createRef();

    useEffect(() => {
        pieChart();
    }, [])

    // Thiết lập dữ liệu biểu đồ
    const setDataBarChart = () => {
        let data = {
            count: ["5", "6", "7", "8", "9", "10"],
            type: ["Thắng", "Phương", "Tài", "An", "Sang"],
            shortName: ["T", "P", "T", "A", "S"]
        }

        return data;
    }

    const pieChart = () => {
        let chart = c3.generate({
            bindto: refPieChart.current,

            data: {
                columns: [
                    ['Hư hỏng, hết hạn', 30],
                    ['Đã xuất kho', 120],
                    ['Đang lưu trữ', 90],
                    ['Chuẩn bị nhập kho', 50],
                    ['Chuẩn bị xuất kho', 80]
                ],
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

    const { translate } = props;
    pieChart();
    return (
        <React.Fragment>
            <div className="box">
                <div className="box-header with-border">
                    <i className="fa fa-bar-chart-o" />
                    <h3 className="box-title">
                        Xem chi tiết số lượng theo từng sản phẩm
                        </h3>
                    <div className="form-group" style={{ width: '100%', margin: '10px' }}>
                        <SelectBox id="multiSelectqO"
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
                    <div ref={refPieChart}></div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default withTranslate(QuantityExpiratedDate);