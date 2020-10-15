import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

class QuoterSalesMappingAreaChart extends Component {
    constructor(props) {
        super(props);
        
    }
    

    componentDidMount() {
        this.areaChart();
    }

    setDataAreaChart = () => {

        let dataAreaChart = {
            columns: [
                ['Đơn kinh doanh', 130, 100, 140, 200, 150, 50, 130, 100, 140, 200, 150, 50],
                ['Báo giá', 300, 350, 300, 400, 340, 267, 300, 350, 300, 400, 340, 267],
            ],
            types: {
                'Đơn kinh doanh': 'area',
                'Báo giá': 'area-spline'
            }
        }
        return dataAreaChart;
    }

    removePreviousChart() {
        const chart = this.refs.amountAreaChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    areaChart = () => {

        let dataAreaChart = this.setDataAreaChart();
        console.log(dataAreaChart);
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.amountAreaChart,

            data: dataAreaChart, 
            axis: {
                y: {
                  label: {
                    text: 'Triệu đồng',
                    position: 'outer-middle'
                  },
                }, 
                x: {
                    type: 'category',
                    categories: ['21/10/2020', '18/10/2020', '19/10/2020', '20/10/2020', '21/10/2020', '22/10/2020', 
                  '23/10/2020', '24/10/2020', '25/10/2020', '26/10/2020', '27/10/2020', '28/10/2020'],
                }
            }
        });
    }

  render() {
    return (
      <section ref="amountAreaChart"></section>
    );
  }
}

export default QuoterSalesMappingAreaChart;
