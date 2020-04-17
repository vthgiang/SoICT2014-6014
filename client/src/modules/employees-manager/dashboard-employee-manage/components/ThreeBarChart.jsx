import React, { Component } from 'react';
import * as d3 from 'd3';
class ThreeBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataset: [
                {
                    "month": "01-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
                {
                    "month": "02-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
                {
                    "month": "03-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
                {
                    "month": "04-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
                {
                    "month": "05-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
                {
                    "month": "06-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
                {
                    "month": "07-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
                {
                    "month": "08-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
                {
                    "month": "09-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
                {
                    "month": "10-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
                {
                    "month": "11-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
                {
                    "month": "12-2020",
                    "field1": 5.00,
                    "field2": 3.33,
                    "field3": 4.00
                },
            ]
        }
        this.renderChart = this.renderChart.bind(this);
    }
    componentDidMount() {
        this.renderChart();
    }

    renderChart() {

        var dataset = this.state.dataset;
        var calculationUnit = this.props.calculationUnit;
        // các thông sô xác định chiều rộng, chiều dài của biểu đồ
        // xác định chiều rộng của biểu đồ = 35% chiều rộng <body> khi chiều rộng <body> > 750px
        //chiều rộng của biểu đồ = chiều rộng <body> khi chiều rộng <body> < 750px
        var margin = { top: 0, right: 10, bottom: 50, left: 25 };
        var width = (parseInt(d3.select('body').style('width').replace('px', '')) > 750 ? parseInt(d3.select('body').style('width').replace('px', '') * 35 / 100) : parseInt(d3.select('body').style('width').replace('px', '') * 85 / 100));
        var height = 300,
            barPadding = 0.1,
            axisTicks = { qty: 5, outerSize: 0, dateFormat: '%m-%d' };

        // Select SVG element
        var svg = d3.select(this.refs.lineAndBarChart).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add Scales
        var xScale0 = d3.scaleBand().rangeRound([0, width]).padding(barPadding)
        var xScale1 = d3.scaleBand()
        var yScale = d3.scaleLinear().rangeRound([height - margin.top - margin.bottom, 0])

        // Adding Axis
        var xAxis = d3.axisBottom(xScale0).tickSizeOuter(axisTicks.outerSize);
        var yAxis = d3.axisLeft(yScale).ticks(axisTicks.qty).tickSizeOuter(axisTicks.outerSize);

        // Mapping the Axis with data
        xScale0.domain(dataset.map(d => d.month))
        xScale1.domain(['field1', 'field2', 'field3']).range([0, xScale0.bandwidth()])
        yScale.domain([0, d3.max(dataset, function (d) {
            if (d.field1 > d.field2) {
                if (d.field3 > d.field1) {
                    return d.field3 + d.field3 / 10;
                } else {
                    return d.field1 + d.field1 / 10;
                }
            } else {
                if (d.field3 > d.field2) {
                    return d.field3 + d.field3 / 10;
                } else {
                    return d.field2 + d.field2 / 10;
                }
            }
        })]);

        // Add tooltip 
        var div = d3.select(this.refs.lineAndBarChart).append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Create and Transform Group Element
        var month = svg.selectAll(".month")
            .data(dataset)
            .enter().append("g")
            .attr("class", "month")
            .attr("transform", d => `translate(${xScale0(d.month)},0)`)
            .on("mouseover", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html("Tháng: " + d.month + "<br/>" + "<div style='text-align: left'>" +
                    "<button type='button' style='border: 0px; width: 10px; background-color: #FF0D17; height: 10px; margin-right: 5px; margin-left: 10px' }}></button>" + Number(d.field1).toFixed(2) +
                    "<button type='button' style='border: 0px; width: 10px; background-color: #0000FF; height: 10px; margin-right: 5px; margin-left: 10px' }}></button>" + Number(d.field2).toFixed(2) +
                    "<button type='button' style='border: 0px; width: 10px; background-color: #FFAA4F; height: 10px; margin-right: 5px; margin-left: 10px' }}></button>" + Number(d.field3).toFixed(2) + "</div>")
                    .style("left", xScale0(d.month) + "px")
                    .style("top", 100 + "px");
            })
            .on("mouseout", function (d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            });


        /***********/
        /**Appending the bars */
        /**********/
        //Add field1 bars
        month.selectAll(".bar.field1")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar field1")
            .style("fill", "#FF0D17")
            .attr("x", d => xScale1('field1'))
            .attr("y", d => yScale(d.field1))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return height - margin.top - margin.bottom - yScale(d.field1)
            });

        // labels field1 on the bar chart
        // month.selectAll(".text1")
        //     .data(d => [d])
        //     .enter()
        //     .append("text")
        //     .attr("class", "text1")
        //     .attr("dy", "1.3em")
        //     .attr("x", function (d) { return xScale1('field1') + xScale1.bandwidth() / 2; })
        //     .attr("y", function (d) { return yScale(d.field1) - Number(d.field1); })
        //     .attr("text-anchor", "middle")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", "11px")
        //     .attr("fill", "black")
        //     .text(function (d) {
        //         return Number(d.field1).toFixed(2);
        //     });

        //Add field2 bars
        month.selectAll(".bar.field2")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar field2")
            .style("fill", "#0000FF")
            .attr("x", d => xScale1('field2'))
            .attr("y", d => yScale(d.field2))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return height - margin.top - margin.bottom - yScale(d.field2)
            });

        // labels field2 on the bar chart
        // month.selectAll(".text2")
        //     .data(d => [d])
        //     .enter()
        //     .append("text")
        //     .attr("class", "text2")
        //     .attr("dy", "1.3em")
        //     .attr("x", function (d) { return xScale1('field2') + xScale1.bandwidth() / 2; })
        //     .attr("y", function (d) { return yScale(d.field2) - Number(d.field2); })
        //     .attr("text-anchor", "middle")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", "11px")
        //     .attr("fill", "black")
        //     .text(function (d) {
        //         return Number(d.field2).toFixed(2);
        //     });

        //Add field3 bars
        month.selectAll(".bar.field3")
            .data(d => [d])
            .enter()
            .append("rect")
            .attr("class", "bar field3")
            .style("fill", "#FFAA4F")
            .attr("x", d => xScale1('field3'))
            .attr("y", d => yScale(d.field3))
            .attr("width", xScale1.bandwidth())
            .attr("height", d => {
                return height - margin.top - margin.bottom - yScale(d.field3)
            });
        // labels field3 on the bar chart
        // month.selectAll(".text3")
        //     .data(d => [d])
        //     .enter()
        //     .append("text")
        //     .attr("class", "text3")
        //     .attr("dy", "1.3em")
        //     .attr("x", function (d) { return xScale1('field3') + xScale1.bandwidth() / 2; })
        //     .attr("y", function (d) { return yScale(d.field3) - Number(d.field3); })
        //     .attr("text-anchor", "middle")
        //     .attr("font-family", "sans-serif")
        //     .attr("font-size", "11px")
        //     .attr("fill", "black")
        //     .text(function (d) {
        //         return Number(d.field3).toFixed(2);
        //     });

        /* Add the X Axis*/
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function (d) {
                return "rotate(-45)"
            });
        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

    }
    render() {
        const { nameChart, calculationUnit, nameField1, nameField2, nameField3 } = this.props;
        return (
            <div className="col-md-6 col-xs-6" >
                <div className="box">
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
                                    <button type="button" style={{ border: 0, width: 40, backgroundColor: "#FF0D17", height: 10, marginRight: 5 }}></button> {nameField1}
                                </span>
                                <span style={{ marginLeft: 50 }}>
                                    <button type="button" style={{ border: 0, width: 40, backgroundColor: "#0000FF", height: 10, marginRight: 5 }}></button> {nameField2}
                                </span>
                                <span style={{ marginLeft: 50 }}>
                                    <button type="button" style={{ border: 0, width: 40, backgroundColor: "#FFAA4F", height: 10, marginRight: 5 }}></button> {nameField3}
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
export { ThreeBarChart };