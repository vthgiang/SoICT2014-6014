import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';

class PieChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pieChart: false,
            namePieChart: '',
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.pieChartData && nextProps.pieChartData.length > 0) {
            return {
                ...prevState,
                pieChart: true,
                namePieChart: nextProps.namePieChart,
            }
        }
        return null;
    }


    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.pieChartData) {
            this.renderPieChart(nextProps.pieChartData)
        }
        return true;
    }


    componentDidMount() {
        if (this.props.pieChartData) {
            this.renderPieChart(this.props.pieChartData)
        }
    }
    // Xóa các  Piechart đã render khi chưa đủ dữ liệu
    removePrceviousPieChart() {
        const chart = this.refs.pieChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }


    renderPieChart = (data) => {
        this.removePrceviousPieChart();
        console.log('data', data)
        this.chart = c3.generate({
            bindto: this.refs.pieChart,
            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: {
                columns: data,
                type: 'pie',
            }
        })
    }
    render() {
        const { data, namePieChart } = this.state;
        return (
            <React.Fragment>
                <div className="row">
                    {
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <h3 className="box-title">{namePieChart}</h3>
                                </div>
                                <div className="box-body dashboard_box_body">
                                    <div ref="pieChart"></div>
                                </div>
                            </div>
                        </div>
                    }

                </div>
            </React.Fragment>
        );
    }
}

const pieChart = connect(null, null)(withTranslate(PieChart));
export { pieChart as PieChart };
