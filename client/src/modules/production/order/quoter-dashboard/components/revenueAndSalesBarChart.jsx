import React, { Component } from 'react';

import c3 from 'c3';
import 'c3/c3.css';

class RevenueAndSalesBarChart
 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    
    componentDidMount() {
        this.barChart();
    }

    setDataBarChart = () => {
        let dataBarChart = {
            columns: [
                ['Doanh thu', 130, 100, 140, 200, 150, 50, 130, 100, 140, 200, 150, 50],
                ['Doanh số', 300, 350, 300, 400, 340, 267, 300, 350, 300, 400, 340, 267]
            ],
            type: 'bar'
        };
        return dataBarChart;
    }

    removePreviousChart() {
        const chart = this.refs.amountPieChart;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    // Khởi tạo PieChart bằng C3
    barChart = () => {

        let dataBarChart = this.setDataBarChart();
        this.removePreviousChart();
        let chart = c3.generate({
            bindto: this.refs.revenueAndSalesBarChart
            ,

            data: dataBarChart,

            bar: {
                width: {
                    ratio: 0.5 // this makes bar width 50% of length between ticks
                }
                // or
                //width: 100 // this makes bar width 100px
            },
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
                  '23/10/2020', '24/10/2020', '25/10/2020', '26/10/2020', '27/10/2020', '28/10/2020']
                }
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
    //   this.barChart()
    return (
        <section ref="revenueAndSalesBarChart"></section>
    );
  }
}

export default RevenueAndSalesBarChart;
