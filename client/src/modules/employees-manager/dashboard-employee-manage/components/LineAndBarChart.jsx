import React, { Component } from 'react';
import * as d3 from 'd3';
class LineAndBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: this.props.dataset
        }
        this.renderChart = this.renderChart.bind(this);
    }
    componentDidMount() {
        this.renderChart();
    }

    renderChart() {
        var dataset = this.state.dataset;
        // các thông sô xác định chiều rộng, chiều dài của biểu đồ
        // xác định chiều rộng của biểu đồ = 35% chiều rộng <body> khi chiều rộng <body> > 750px
        //chiều rộng của biểu đồ = chiều rộng <body> khi chiều rộng <body> < 750px
        var margin = { top: 0, right: 10, bottom: 50, left: 25 };
        var width = parseInt(d3.select('body').style('width').replace('px', '')) > 750 ? parseInt(d3.select('body').style('width').replace('px', '') * 35 / 100) : parseInt(d3.select('body').style('width').replace('px', '') * 85 / 100);
        var height = 250;


        // Add Scales and Mapping the Axis with data
        var xScale = d3.scaleBand()
            .rangeRound([0, width])
            .padding(dataset.length > 6 ? 0.2 : 0.4)
            .domain(dataset.map(function (d) {
                return d[0];
            }));
        var yScale = d3.scaleLinear()
            .rangeRound([height, 0])
            .domain([0, d3.max(dataset, function (d) {
                if (d[1] > d[2]) {
                    return d[1] + d[1] / 10;
                } else {
                    return d[2] + d[2] / 10;
                }
            })]);


        // Add tooltip 
        var div = d3.select(this.refs.lineAndBarChart).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Select SVG element
        var svg = d3.select(this.refs.lineAndBarChart).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Add the X Axis
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-45)"
            });

        // Add the Y Axis
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(yScale));

        var bar = g.selectAll("rect")
            .data(dataset)
            .enter().append("g");

        /* Appending the bars*/
        bar.append("rect")
            .attr("x", function (d) { return xScale(d[0]); })
            .attr("y", function (d) { return yScale(d[2]); })
            .attr("width", xScale.bandwidth())
            .attr("height", function (d) { return height - yScale(d[2]); })
            .attr("class", function (d) {
                var s = "bar ";
                return s + "bar1";
            }).on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("Tháng: " + d[0] + "<br/>" +"<div style='text-align: left'>"+
                    "<button type='button' style='border: 0px; width: 10px; background-color: #0000FF; height: 10px; margin-right: 5px;margin-left: 10px' }}></button>" + Number(d[2]).toFixed(2) + "</br>" +
                    "<button type='button' style='border: 0px; width: 10px; background-color: #FFAA4F; height: 10px; margin-right: 5px;margin-left: 10px' }}></button>" + Number(d[1]).toFixed(2)+"</div>")
                    .style("left", xScale(d[0]) + "px")
                    .style("top", (yScale(d[2]) + 40) + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // labels on the bar chart
        bar.append("text")
            .attr("dy", "1.3em")
            .attr("x", function (d) { return xScale(d[0]) + xScale.bandwidth() / 2; })
            .attr("y", function (d) { return yScale(d[2]); })
            .attr("text-anchor", "middle")
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("fill", "#ffffff")
            .text(function (d) {
                return Number(d[2]).toFixed(2);
            });

        /* Appending the line*/
        var line = d3.line()
            .x(function (d, i) { return xScale(d[0]) + xScale.bandwidth() / 2; })
            .y(function (d) { return yScale(d[1]); })
            .curve(d3.curveMonotoneX);

        bar.append("path")
            .attr("class", "line") // Assign a class for styling
            .attr("d", line(dataset)); // 11. Calls the line generator

        // bar.append("circle") // Uses the enter().append() method
        //     .attr("class", "dot") // Assign a class for styling
        //     .attr("cx", function (d, i) { return xScale(d[0]) + xScale.bandwidth() / 2; })
        //     .attr("cy", function (d) { return yScale(d[1]); })
        //     .attr("r", 5);

        // Legend Placing

    }
    render() {
        const { nameChart, calculationUnit, nameLableBar, nameLableLine } = this.props;
        return (
            <div className="col-md-6">
                <div className="box box-primary">
                    <div className="box-header with-border">
                        <i className="fa fa-bar-chart-o" />
                        <h3 className="box-title" style={{ display: 'inline', marginLeft: 10 }}><b>{nameChart}</b></h3>
                    </div>
                    <div className="box-body">
                        <p className="pull-right" style={{ marginBottom: 0 }}><b>ĐV tính: {calculationUnit}</b></p>
                        <div ref="lineAndBarChart"></div>
                        <center>
                            <div className="d-flex flex-row justify-content-end">
                                <span className="mr-2">
                                    <button type="button" style={{ border: 0, width: 40, backgroundColor: "#0000FF", height: 10, marginRight: 5 }}></button> {nameLableBar}
                                </span>

                                <span style={{ marginLeft: 50 }}>
                                    <button type="button" style={{ border: 0, width: 40, backgroundColor: "#FFAA4F", height: 10, marginRight: 5 }}></button> {nameLableLine}
                                </span>
                            </div>
                        </center>
                    </div>
                    {/* /.box-body*/}
                </div>
            </div>
        )
    }
}
export { LineAndBarChart };