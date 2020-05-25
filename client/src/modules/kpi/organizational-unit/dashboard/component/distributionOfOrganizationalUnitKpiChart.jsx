import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUnitKpiActions } from '../../creation/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class DistributionOfOrganizationalUnitKpiChart extends Component {

    constructor(props) {
        super(props);
        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            dataStatus: this.DATA_STATUS.QUERYING
        };
        this.props.getCurrentKPIUnit(this.state.currentRole);
    }
    
    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.dataStatus == this.DATA_STATUS.NOT_AVAILABLE){
            this.props.getCurrentKPIUnit(this.state.currentRole)
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                };
            });
            return false;
        } else if (nextState.dataStatus == this.DATA_STATUS.QUERYING) {
            if (!nextProps.createKpiUnit.currentKPI)
                return false;
            
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });
            return false;
        } else if (nextState.dataStatus == this.DATA_STATUS.AVAILABLE){
            this.pieChart();
            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        }

        return false;
    }

    // Thiết lập dữ liệu biểu đồ
    setDataPieChart = () => {
        const { createKpiUnit } = this.props;
        var listOrganizationalUnitKpi, dataPieChart;

        if (createKpiUnit.currentKPI !== undefined && createKpiUnit.currentKPI.kpis !== undefined) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if(listOrganizationalUnitKpi !== undefined){
            dataPieChart = listOrganizationalUnitKpi.map(x => { 
                return [ x.name, x.weight ]
            })
        }

        return dataPieChart;
    }

    // Xóa các chart đã render khi chưa đủ dữ liệu
    removePreviousChart(){
        const chart = this.refs.pieChart;
        while(chart.hasChildNodes()){
            chart.removeChild(chart.lastChild);
        }
    } 

    // Khởi tạo PieChart bằng C3
    pieChart = () => {
       this.removePreviousChart();

        // Tạo mảng dữ liệu
        var dataPieChart;
        dataPieChart = this.setDataPieChart(); 

        this.chart = c3.generate({
            bindto: this.refs.pieChart,             // Đẩy chart vào thẻ div có id="pieChart"

            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                columns: dataPieChart,
                type : 'pie',
            },

            legend: {                               // Ẩn chú thích biểu đồ
                show: true
            }
        });

        // var pie = d3.pie()
        //     .sort(null)
        //     .value(d => d.value);
        // // Tạo dữ liệu dạng Pie cho biểu đồ
        // var arcs = pie(dataPieChart);

        // var width = window.innerWidth;
        // var height = window.innerHeight;
        // var minViewportSize = Math.min(width, height);

        // // This sets the radius of the pie chart to fit within
        // // the current window size, with some additional padding
        // var radius = (minViewportSize * .9) / 3;
        // var arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);
                
        // var color = d3.scaleOrdinal()
        //     .domain(dataPieChart.map(d => d.name))
        //     .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), dataPieChart.length).reverse());

        // var arc = d3.arc()
        //     .innerRadius(0)
        //     .outerRadius(Math.min(width, height) / 2 - 1);

        // var svg = d3.select(this.refs.pieChart)
        //     .append("svg")
        //     .attr("viewBox", [-width / 2, -height / 2, width, height]);

        // svg.append("g")
        //         .attr("stroke", "white")
        //     .selectAll("path")
        //     .data(arcs)
        //     .join("path")
        //         .attr("fill", d => color(d.data.name))
        //         .attr("d", arc)
        //     .append("title")
        //         .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

        // svg.append("g")
        //         .attr("font-family", "sans-serif")
        //         .attr("font-size", 40)
        //         .attr("text-anchor", "middle")
        //     .selectAll("text")
        //     .data(arcs)
        //     .join("text")
        //         .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
        //         .call(text => text.append("tspan")
        //             .attr("y", "1em")
        //             .attr("font-weight", "bold")
        //             .text(d => d.data.value))
        //         .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        //             .attr("x", 0)
        //             .attr("y", "1em")
        //             .attr("fill-opacity", 0.7)
        //             .text(d => d.data.value.toLocaleString()));
    }

    render() {
       

        return (
            <React.Fragment>
                <div ref="pieChart"></div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createKpiUnit } = state;
    return { createKpiUnit };
}

const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit
}

const connectedDistributionOfOrganizationalUnitKpiChart = connect(mapState, actions)(DistributionOfOrganizationalUnitKpiChart);
export { connectedDistributionOfOrganizationalUnitKpiChart as DistributionOfOrganizationalUnitKpiChart}
