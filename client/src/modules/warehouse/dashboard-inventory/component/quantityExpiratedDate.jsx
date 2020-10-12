
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../common-components';

class QuantityExpiratedDate extends Component {
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
            shortName: ["T", "P","T", "A", "S"]
        }

        return data;
    }

    pieChart = () => {
        let chart = c3.generate({
            bindto: this.refs.quantityExpiratedDate,

            data: {
                columns: [
                    ['Hư hỏng, hết hạn', 30],
                    ['Đã bán', 120],
                    ['Đang lưu trữ', 90],
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
                            Xem chi tiết số lượng theo từng sản phẩm
                        </h3>
                        <div className="form-group" style={{width: '100%', margin: '10px'}}>
                                <SelectBox id="multiSelectO"
                                    items={[
                                        { value: '0', text: 'Propylen Glycon'},
                                        { value: '1', text: 'Bàn ghế'},
                                        { value: '2', text: 'Bút mực'},
                                        { value: '3', text: 'Điện thoại'},
                                        { value: '4', text: 'Bình nước'}
                                    ]}
                                    onChange={this.handleSelectOrganizationalUnit}
                                />
                            </div>
                        <div ref="quantityExpiratedDate"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslate(QuantityExpiratedDate);