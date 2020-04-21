import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LineAndBarChart } from './lineAndBarChart';
import { ThreeBarChart } from './threeBarChart';

class DashBoardEmployees extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: [
                ['01-2020', 13.50, 12.33],
                ['02-2020', 13.50, 12.33],
                ['03-2020', 13.50, 11.33],
                ['04-2020', 13.50, 15.33],
                ['05-2020', 13.50, 12.33],
                ['06-2020', 13.50, 11.33],
                ['07-2020', 13.50, 12.33],
                ['08-2020', 13.50, 12.33],
                ['09-2020', 13.50, 11.33],
                ['10-2020', 13.50, 15.33],
                ['11-2020', 13.50, 12.33],
                ['12-2020', 13.50, 11.33],
            ]
        }
    }
    componentDidMount() {
        // let script = document.createElement('script');
        // script.src = 'lib/main/js/DashBoardEmployee.js';
        // script.async = true;
        // script.defer = true;
        // document.body.appendChild(script);
    }
    render() {
        return (
            <div className="qlcv">
                <div className="row">
                    <LineAndBarChart
                        dataset={this.state.dataset}
                        nameChart={"Biểu đồ tỷ lệ % quỹ lương công ty/doanh thu 12 tháng gần nhất"}
                        calculationUnit={"%"}
                        nameLableBar={"% Tổng lương"}
                        nameLableLine={"% Mục tiêu"}
                    />
                    <LineAndBarChart
                        dataset={this.state.dataset}
                        nameChart={"Biểu đồ tỷ lệ % quỹ lương khối kinh doanh/doanh thu 12 tháng gần nhất"}
                        calculationUnit={"%"}
                        nameLableBar={"% Kinh doanh"}
                        nameLableLine={"% Mục tiêu"}
                    />
                    <LineAndBarChart
                        dataset={this.state.dataset}
                        nameChart={"Biểu đồ tỷ lệ % quỹ lương khối quản trị/doanh thu 12 tháng gần nhất"}
                        calculationUnit={"%"}
                        nameLableBar={"% Quản trị"}
                        nameLableLine={"% Mục tiêu"}
                    />
                    <LineAndBarChart
                        dataset={this.state.dataset}
                        nameChart={"Biểu đồ tỷ lệ % quỹ lương khối sản xuất/doanh thu 12 tháng gần nhất"}
                        calculationUnit={"%"}
                        nameLableBar={"% Sản xuất"}
                        nameLableLine={"% Mục tiêu"}
                    />
                    <ThreeBarChart
                        nameChart={"Biểu đồ tỷ lệ % quỹ lương các khối chức năng/doanh thu 12 tháng gần nhất"}
                        calculationUnit={"%"}
                        nameField1={"% Kinh doanh"}
                        nameField2={"% Sản xuất"}
                        nameField3={"% Quản trị"}
                    />
                </div>
            </div>
        );
    }
};
// function mapState(state) {
// };

// const actionCreators = {
// };

const DashBoard = connect(null, null)(withTranslate(DashBoardEmployees));
export { DashBoard as DashBoardEmployees };