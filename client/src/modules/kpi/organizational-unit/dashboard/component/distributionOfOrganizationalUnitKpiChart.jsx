import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createUnitKpiActions } from '../../creation/redux/actions';
import * as d3 from "d3";

class DistributionOfOrganizationalUnitKpiChart extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            newDataCurrentKpi: false
        };
    }

    componentDidMount() {
        this.props.getCurrentKPIUnit(this.state.currentRole)
    }
    
    shouldComponentUpdate = (nextProps, nextState) => {
        // Kiểm tra currentKPI đã được bind vào props hay chưa
        let newDataCurrentKpi = nextProps.createKpiUnit.currentKPI !== undefined 
                                    && nextProps.createKpiUnit.currentKPI !== null;
        if(!newDataCurrentKpi) {
            return false
        }
        if(this.props.createKpiUnit.currentKPI) {
            newDataCurrentKpi = newDataCurrentKpi && (nextProps.createKpiUnit.currentKPI._id !== this.props.createKpiUnit.currentKPI._id)
        }
        // if(!newDataCurrentKpi && !this.state.newDataCurrentKpi) {
        //     this.setState(state =>{
        //         return {
        //             ...state,
        //             newDataCurrentKpi: true,
        //         };
        //     });
        //     return false; // Cần cập nhật lại state, không cần render
        // }

        if(!newDataCurrentKpi) {
            return true
        }
    }

    setDataPieChart = () => {
        const { createKpiUnit } = this.props;
        var listOrganizationalUnitKpi, dataPieChart;

        if (createKpiUnit.currentKPI !== undefined && createKpiUnit.currentKPI.kpis !== undefined) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if(listOrganizationalUnitKpi !== undefined){
            dataPieChart = listOrganizationalUnitKpi.map(x => { 
                return { name: x.name, value: x.weight}
            })
        }

        return dataPieChart;
    }

    pieChart = () => { 
        // Tạo mảng dữ liệu
        var dataPieChart;
        dataPieChart = this.setDataPieChart(); 

        var pie = d3.pie()
            .sort(null)
            .value(d => d.value);
        // Tạo dữ liệu dạng Pie cho biểu đồ
        var arcs = pie(dataPieChart);

        var width = window.innerWidth;
        var height = window.innerHeight;
        var minViewportSize = Math.min(width, height);

        // This sets the radius of the pie chart to fit within
        // the current window size, with some additional padding
        var radius = (minViewportSize * .9) / 2;
        var arcLabel = d3.arc().innerRadius(radius).outerRadius(radius);
                
        var color = d3.scaleOrdinal()
            .domain(dataPieChart.map(d => d.name))
            .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), dataPieChart.length).reverse());

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(width, height) / 2 - 1);

        var svg = d3.select(this.refs.pieChart)
            .append("svg")
            .attr("viewBox", [-width / 2, -height / 2, width, height]);

        svg.append("g")
                .attr("stroke", "white")
            .selectAll("path")
            .data(arcs)
            .join("path")
                .attr("fill", d => color(d.data.name))
                .attr("d", arc)
            .append("title")
                .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

        svg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 40)
                .attr("text-anchor", "middle")
            .selectAll("text")
            .data(arcs)
            .join("text")
                .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
                .call(text => text.append("tspan")
                    .attr("y", "1em")
                    .attr("font-weight", "bold")
                    .text(d => d.data.value))
                .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                    .attr("x", 0)
                    .attr("y", "1em")
                    .attr("fill-opacity", 0.7)
                    .text(d => d.data.value.toLocaleString()));
    }

    render() {
        (this.props.createKpiUnit.currentKPI && this.props.createKpiUnit.currentKPI.kpis)
            && this.pieChart()

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
