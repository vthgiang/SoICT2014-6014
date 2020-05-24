import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class ResultsOfOrganizationalUnitKpiChart extends Component {
    
    constructor(props) {
        super(props);

        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };

        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            year: new Date().getFullYear(),
            dataStatus: this.DATA_STATUS.QUERYING
        };

        this.props.getAllOrganizationalUnitKpiSetEachYear(this.state.currentRole, this.state.year)
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if(this.state.dataStatus === this.DATA_STATUS.NOT_AVAILABLE) {
            this.props.getAllOrganizationalUnitKpiSetEachYear(this.state.currentRole, this.state.year)

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING
                }
            })
            return false;
        } else if(this.state.dataStatus === this.DATA_STATUS.QUERYING) {
            if(!nextProps.dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsEachYear) {
                return false
            }

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE
                }
            })
        } else if(this.state.dataStatus === this.DATA_STATUS.AVAILABLE) {
            this.multiLineChart();

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED
                }
            })
        }

        return false;
    }
    
    // Thiết lập dữ liệu biểu đồ
    setDataMultiLineChart = () => {
        const { dashboardOrganizationalUnitKpi } = this.props;
        var listOrganizationalUnitKpiSetEachYear, automaticPoint, employeePoint, approvedPoint, date, dataMultiLineChart;

        if(dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsEachYear !== [] && dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsEachYear !== undefined) {
            listOrganizationalUnitKpiSetEachYear = dashboardOrganizationalUnitKpi.organizationalUnitKpiSetsEachYear
        }

        if(listOrganizationalUnitKpiSetEachYear !== undefined) {
            automaticPoint = ['Hệ thống đánh giá'].concat(listOrganizationalUnitKpiSetEachYear.map(x => x.automaticPoint));
            
            employeePoint = ['Cá nhân tự đánh giá'].concat(listOrganizationalUnitKpiSetEachYear.map(x => x.employeePoint));

            approvedPoint = ['Quản lý đánh giá'].concat(listOrganizationalUnitKpiSetEachYear.map(x => x.approvedPoint));
        
            date = listOrganizationalUnitKpiSetEachYear.map(x => {
                date = new Date(x.date);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() - 1);
            })
        }
        
        dataMultiLineChart = [['x'].concat(date), automaticPoint, employeePoint, approvedPoint];

        return dataMultiLineChart;
    }

    // Xóa các chart đã render trước khi đủ dữ liệu
    removePreviosMultiLineChart = () => {
        const chart =  this.refs.multiLineChart;
        while(chart.hasChildNodes()) {
            chart.removeChild(chart.lastChild)
        }
    }

    // Khởi tạo MultiLineChart bằng C3
    multiLineChart = () => {
        this.removePreviosMultiLineChart();
        
        // Tạo mảng dữ liệu
        var dataMultiLineChart = this.setDataMultiLineChart();

        this.chart = c3.generate({
            bindto: this.refs.multiLineChart,       // Đẩy chart vào thẻ div có id="multiLineChart"

            padding: {                              // Căn lề biểu đồ
                top: 20,
                bottom: 20,
                right: 20
            },

            data: {                                 // Dữ liệu biểu đồ
                x: 'x',
                columns: dataMultiLineChart
            },

            axis : {                                // Config trục tọa độ
                x : {
                    type : 'timeseries',
                    tick: {
                        format: function (x) { return (x.getMonth() + 1) + "-" + x.getFullYear(); }
                    }
                }
            },

            zoom: {                                 // Cho phép zoom biểu đồ
                enabled: false
            }
        });

        
        // var dates = dataMultiLineChart[0].values.map(d => Object.keys(d)[0]);
        // var data = {
        //     y: "% Unemployment",
        //     series: dataMultiLineChart.map(d => ({
        //         name: d.name,
        //         values: d.values.map(d => Object.values(d)[0])
        //     })),
        //     dates: dates.map(d3.utcParse("%Y-%m"))
        // }

        // function hover(svg, path) {
  
        //     if ("ontouchstart" in document) svg
        //         .style("-webkit-tap-highlight-color", "transparent")
        //         .on("touchmove", moved)
        //         .on("touchstart", entered)
        //         .on("touchend", left)
        //     else svg
        //         .on("mousemove", moved)
        //         .on("mouseenter", entered)
        //         .on("mouseleave", left);
          
        //     const dot = svg.append("g")
        //         .attr("display", "none");
          
        //     dot.append("circle")
        //         .attr("r", 2.5);
          
        //     dot.append("text")
        //         .attr("font-family", "sans-serif")
        //         .attr("font-size", 10)
        //         .attr("text-anchor", "middle")
        //         .attr("y", -8);
          
        //     function moved() {
        //         d3.event.preventDefault();
        //         const mouse = d3.mouse(this);
        //         const xm = x.invert(mouse[0]);
        //         const ym = y.invert(mouse[1]);
        //         const i1 = d3.bisectLeft(data.dates, xm, 1);
        //         const i0 = i1 - 1;
        //         const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
        //         // const s = d3.least(data.series, d => Math.abs(d.values[i] - ym));
        //         // path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
        //         // dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
        //         // dot.select("text").text(s.name);
        //     }
          
        //     function entered() {
        //         path.style("mix-blend-mode", null).attr("stroke", "#ddd");
        //         dot.attr("display", null);
        //     }
          
        //     function left() {
        //         path.style("mix-blend-mode", "multiply").attr("stroke", null);
        //         dot.attr("display", "none");
        //     }
        // }
        
        // var height = 600;
        // var width = 600;
        // var margin = ({top: 20, right: 20, bottom: 30, left: 30});
        
        // var x = d3.scaleUtc()
        //     .domain(d3.extent(data.dates))
        //     .range([margin.left, width - margin.right]);
        // var y = d3.scaleLinear()
        //     .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
        //     .range([height - margin.bottom, margin.top]);

        // var xAxis = g => g
        //     .attr("transform", `translate(0,${height - margin.bottom})`)
        //     .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        // var yAxis = g => g
        //     .attr("transform", `translate(${margin.left},0)`)
        //     .call(d3.axisLeft(y))
        //     .call(g => g.select(".domain").remove())
        //     .call(g => g.select(".tick:last-of-type text").clone()
        //         .attr("x", 3)
        //         .attr("text-anchor", "start")
        //         .attr("font-weight", "bold")
        //         .text(data.y));
        
        // var line = d3.line()
        //     .defined(d => !isNaN(d))
        //     .x((d, i) => x(data.dates[i]))
        //     .y(d => y(d));

        // var svg = d3.select(this.refs.multiLineChart)
        //     .append("svg")
        //     .attr("viewBox", [0, 0, width, height])
        //     .style("overflow", "visible");
      
        // svg.append("g")
        //     .call(xAxis);
      
        // svg.append("g")
        //     .call(yAxis);
      
        // const path = svg.append("g")
        //     .attr("fill", "none")
        //     .attr("stroke", "steelblue")
        //     .attr("stroke-width", 1.5)
        //     .attr("stroke-linejoin", "round")
        //     .attr("stroke-linecap", "round")
        //   .selectAll("path")
        //   .data(data.series)
        //   .join("path")
        //     .style("mix-blend-mode", "multiply")
        //     .attr("d", d => line(d.values));
      
        // svg.call(hover, path);
        // console.log("********", data)
    }

    render() {
        return(
            <div ref="multiLineChart"></div>
        )
    }
}

function mapState(state) {
    const { dashboardOrganizationalUnitKpi } = state;
    return { dashboardOrganizationalUnitKpi };
}

const actions = {
    getAllOrganizationalUnitKpiSetEachYear: dashboardOrganizationalUnitKpiActions.getAllOrganizationalUnitKpiSetEachYear
}

const connectedResultsOfOrganizationalUnitKpiChart = connect(mapState, actions)(ResultsOfOrganizationalUnitKpiChart);
export { connectedResultsOfOrganizationalUnitKpiChart as ResultsOfOrganizationalUnitKpiChart }