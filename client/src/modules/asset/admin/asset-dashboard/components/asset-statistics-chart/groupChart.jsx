import React, { Component } from 'react';
import { connect } from 'react-redux';

import c3 from 'c3';
import 'c3/c3.css';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

class GroupChart extends Component {
    constructor(props) {
        super(props);
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { listAssets } = this.props;

        const { translate } = this.props;
        let dataPieChart, numberOfBuilding = 0, numberOfVehicle = 0, numberOfMachine = 0, numberOfOrther = 0;

        if (listAssets) {
            for( let i in listAssets) {
                switch (listAssets[i].group) {
                    case "Building":
                        numberOfBuilding++;
                        break;
                    case "Vehicle":
                        numberOfVehicle++;
                        break;
                    case "Machine":
                        numberOfMachine++;
                        break;
                    case "Other":
                        numberOfOrther++;
                        break;
                }
            }
        }

        dataPieChart = [
            ["Mặt bằng", numberOfBuilding],
            ["Phương tiện", numberOfVehicle],
            ["Máy móc", numberOfMachine],
            ["Khác", numberOfOrther],
        ];

        return dataPieChart;
    }

    // Hàm xóa biểu đồ trước
    removePreviousChart() {
        const chart = this.refs.chart;

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        } 
    }

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
        let dataPieChart = this.setDataPieChart();
        
        this.chart = c3.generate({
            bindto: '#assetGroup',

            data: {
                columns: dataPieChart,
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
                    title: function (d) { 
                        return d; 
                    },
                    value: function (value, ratio, id) {
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
        const { listAssets } = this.props;

        console.log('call pie chart');
        this.pieChart();

        return (
            <React.Fragment>
                <div className="box-body qlcv" id="assetGroupChart">
                    <section id="assetGroup"></section>
                </div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
}

const actions = {
}

const GroupChartConnected = connect(mapState, actions)(withTranslate(GroupChart));

export { GroupChartConnected as GroupChart }