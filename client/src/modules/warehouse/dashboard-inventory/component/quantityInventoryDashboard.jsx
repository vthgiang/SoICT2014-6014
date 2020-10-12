
import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { SelectMulti, DatePicker, SelectBox } from '../../../../common-components';

class QuantityInventoryDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barChart: true
        }
    }

    componentDidMount() {
        this.barChart();
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

    // Khởi tạo BarChart bằng C3
    barChart = () => {
        let { translate } = this.props;
        let dataPieChart = this.setDataBarChart();
        let count = dataPieChart.count;
        let heightCalc = dataPieChart.type.length * 24.8;
        let height = heightCalc < 320 ? 320 : heightCalc;
        let chart = c3.generate({
            bindto: this.refs.quantityInventoryDashboard,
            data: {
                x : 'x',
                columns: [
                    ['x', 'Máy tính', 'Bàn học', 'Điện thoại', 'Chuột', 'Cặp sách', 'Bình nước', 'Sách vở', 'Bút'],
                    ['Lê Thanh Nghị', 100, 200, 140, 200, 600, 228, 600, 200, 130],
                    ['Tạ Quang Bửu', 300, 150, 140, 200, 500, 228, 290, 200, 130],
                    ['Trần Đại Nghĩa', 100, 200, 140, 200, 600, 228, 700, 200, 130],
                    ['Đại Cồ Việt', 300, 150, 140, 200, 500, 228, 290, 200, 130],
                ],
                type: 'bar',
                groups: [
                    ['Trần Đại Nghĩa','Tạ Quang Bửu', 'Lê Thanh Nghị', 'Đại Cồ Việt']
                ]
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        rotate: 75,
                        multiline: false
                    },
                    height: 100
                }
            }
        });
    }

    render() {
        const { translate } = this.props;
        this.barChart();
        return (
            <React.Fragment>
                <div className="box">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title">
                            Số lượng tồn kho từng mặt hàng
                        </h3>
                        <div className="form-inline">
                            <div className="form-group">
                                <label></label>
                                <div style={{width: '20%'}}>
                                <SelectBox id="multiSelectOrganizat"
                                    items={[
                                        { value: '1', text: 'Sản phẩm'},
                                        { value: '2', text: 'Nguyên vật liệu'},
                                        { value: '3', text: 'Công cụ dụng cụ'},
                                        { value: '4', text: 'Tài sản'}
                                    ]}
                                    onChange={this.handleSelectOrganizationalUnit}
                                />
                                </div>
                                <label></label>
                            </div>
                        </div>
                        <div ref="quantityInventoryDashboard"></div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withTranslate(QuantityInventoryDashboard);