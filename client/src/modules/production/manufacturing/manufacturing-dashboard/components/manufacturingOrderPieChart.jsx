
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../../common-components';

class ManufacturingOrderPieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pieChart: true
        }
    }

    componentDidMount() {
        this.pieChart();
    }

    // Thiết lập dữ liệu biểu đồ
    setDataBarChart = () => {
        let data = {
            count: ["5", "6", "7", "8", "9", "10"],
            type: ["Thắng", "Phương", "Tài", "An", "Sang"],
            shortName: ["T", "P", "T", "A", "S"]
        }

        return data;
    }

    pieChart = () => {
        let chart = c3.generate({
            bindto: this.refs.quantityExpiratedDate,

            data: {
                columns: [
                    ['Chưa được duyệt', 30],
                    ['Chưa lập kế hoạch', 120],
                    ['Đang lập kế hoạch', 90],
                    ['Lập kế hoạch xong', 90],
                    ['Đã hoàn thành', 80],
                    ['Đã hủy', 40],
                ],
                type: 'pie',
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

    render() {
        const { translate } = this.props;
        this.pieChart();
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Số lượng từng loại đơn sản xuất
                        </h3>
                        <div ref="quantityExpiratedDate"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslate(ManufacturingOrderPieChart);