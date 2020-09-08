import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import c3 from 'c3';
import 'c3/c3.css';
import './transferList.css';

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
        this.chart = c3.generate({
            bindto: this.refs.pieChart,
            // Căn lề biểu đồ

            size: {
                height: 350,
                width: 480,
            },
            data: {
                columns: data,
                type: 'pie',
            },
            legend: {
                position: 'bottom',
                show: (data.length > 6) ? false : true
            }
        })
    }
    render() {
        const { data, namePieChart } = this.state;
        return (
            <React.Fragment>
                <div className="box box-primary" >
                    <div className="box-header with-border">
                        <h4 className="box-title">{namePieChart}</h4>
                    </div>
                    <div className="box-body report-box">
                        <div ref="pieChart"></div>
                    </div>
                </div >
            </React.Fragment>
        );
    }
}

const pieChart = connect(null, null)(withTranslate(PieChart));
export { pieChart as PieChart };
