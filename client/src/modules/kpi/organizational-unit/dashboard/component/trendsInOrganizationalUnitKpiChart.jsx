import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';
import { createUnitKpiActions } from '../../creation/redux/actions';

import c3 from 'c3';
import 'c3/c3.css';
import * as d3 from "d3";

class TrendsInOrganizationalUnitKpiChart extends Component {

    constructor(props) {
        super(props);

        this.DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};
        
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            dataStatus: this.DATA_STATUS.QUERYING
        };

        // Lấy Kpi của đơn vị hiện tại
        this.props.getCurrentKPIUnit(this.state.currentRole);
        // Lấy danh sách Kpi con theo từng Kpi của đơn vị hiện tại
        this.props.getAllChildTargetOfOrganizationalUnitKpis(this.state.currentRole);
        // Lấy danh sách các công việc theo từng Kpi của đơn vị hiện tại
        this.props.getAllTaskOfOrganizationalUnit(this.state.currentRole)
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextState.dataStatus == this.DATA_STATUS.NOT_AVAILABLE){
            // Lấy Kpi của đơn vị hiện tại
            this.props.getCurrentKPIUnit(this.state.currentRole);
            // Lấy danh sách Kpi con theo từng Kpi của đơn vị hiện tại
            this.props.getAllChildTargetOfOrganizationalUnitKpis(this.state.currentRole);
            // Lấy danh sách các công việc theo từng Kpi của đơn vị hiện tại
            this.props.getAllTaskOfOrganizationalUnit(this.state.currentRole)

            this.setState(state => {
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.QUERYING,
                };
            });
            return false;
        } else if (nextState.dataStatus == this.DATA_STATUS.QUERYING) {
            // Kiểm tra currentKPI đã được bind vào props hay chưa
            if(!nextProps.createKpiUnit.currentKPI) {
                return false            // Đang lấy dữ liệu, ko cần render lại
            }

            // Kiểm tra childTarget đã được bind vào props hay chưa
            if(!nextProps.dashboardOrganizationalUnitKpi.childTargets) {
                return false            // Đang lấy dữ liệu, ko cần render lại
            }

            // Kiểm tra tasks đã được bind vào props hay chưa
            if(!nextProps.dashboardOrganizationalUnitKpi.tasks) {
                return false            // Đang lấy dữ liệu, ko cần render lại
            }
            
            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.AVAILABLE,
                };
            });
            return false;
        } else if (nextState.dataStatus == this.DATA_STATUS.AVAILABLE){
            this.barChart();
            this.setState(state =>{
                return {
                    ...state,
                    dataStatus: this.DATA_STATUS.FINISHED,
                };
            });
        }

        return false;
    }

    // Lấy danh sách công việc theo từng Kpi đơn vị
    getListTaskByOrganizationUnitKpi = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        var listOrganizationalUnitKpi, listChildTarget, listTask, listTaskByOrganizationUnitKpi;

        if (createKpiUnit.currentKPI !== undefined && createKpiUnit.currentKPI.kpis !== undefined) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }
        if(dashboardOrganizationalUnitKpi.childTargets !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.childTargets;
        }
        if(dashboardOrganizationalUnitKpi.tasks !== []) {
            listTask = dashboardOrganizationalUnitKpi.tasks
        }

        if(listOrganizationalUnitKpi !== undefined && listTask !== undefined) {
            listTaskByOrganizationUnitKpi = listOrganizationalUnitKpi.map(parent => {
                var temporaryListTaskByOrganizationUnitKpi = [];
                if(listChildTarget !== [] && listChildTarget !== undefined && listTask !== undefined){
                    listChildTarget.filter(childTarget => childTarget.parent === parent._id).map(employeeKpi => {
                        if(listTask !== undefined){
                            var list = listTask.filter(item => {
                                var kpi, length;
                                item.evaluations.kpis.map(item => {
                                    kpi = item.kpis.filter(kpi => kpi === employeeKpi._id);
                                    length = kpi.length;
                                });
                                return length !== 0 && length !== undefined;
                            })
                            temporaryListTaskByOrganizationUnitKpi = temporaryListTaskByOrganizationUnitKpi.concat(list);
                        }
                    })
                }
                temporaryListTaskByOrganizationUnitKpi = Array.from(new Set(temporaryListTaskByOrganizationUnitKpi));
                return temporaryListTaskByOrganizationUnitKpi;
            })
        }

        return listTaskByOrganizationUnitKpi;
    }

    // Thiết lập data thời gian thực hiện TB của các công việc theo từng Kpi đơn vị
    setExecutionTimeData = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        var listOrganizationalUnitKpi, listChildTarget, listTask, listTaskByOrganizationUnitKpi;
        var executionTimes = {}, total = 0;
        var now = new Date();
        var currentYear = now.getFullYear();
        var currentMonth = now.getMonth();
        var currentDate = now.getDate();
        var currentTime = new Date(currentYear, currentMonth, currentDate);

        if (createKpiUnit.currentKPI !== undefined && createKpiUnit.currentKPI.kpis !== undefined) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }
        if(dashboardOrganizationalUnitKpi.childTargets !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.childTargets;
        }
        if(dashboardOrganizationalUnitKpi.tasks !== []) {
            listTask = dashboardOrganizationalUnitKpi.tasks
        }

        // Lấy danh sách công việc theo từng Kpi đơn vị
        listTaskByOrganizationUnitKpi = this.getListTaskByOrganizationUnitKpi();

        if(listOrganizationalUnitKpi !== undefined && listChildTarget !== [] && listChildTarget !== undefined && listTask !== undefined && listTask !== []) {
            listOrganizationalUnitKpi.map(parent => {
                var key = listOrganizationalUnitKpi.indexOf(parent);
                var temporary = {};
                var executionTime = 0;

                listTaskByOrganizationUnitKpi[key].map(x => {
                    var date1 = new Date(x.evaluations.date);
                    var date2 = new Date(x.startDate);
                    if(x.evaluations.date !== undefined) {
                        executionTime = executionTime + (date1.getTime() - date2.getTime())/(3600*24*1000)
                    } else {
                        executionTime = executionTime + (currentTime.getTime() - date2.getTime())/(3600*24*1000)
                    }
                })

                if(listTaskByOrganizationUnitKpi.length !== 0 && listOrganizationalUnitKpi !== undefined) {
                    executionTime = executionTime/listTaskByOrganizationUnitKpi.length;
                }
                temporary[parent.name] = executionTime;
                executionTimes = Object.assign(executionTimes, temporary);
            
                total = total + executionTime;
            
            })
        }

        executionTimes = Object.assign(
            { name: "Thời gian thực hiện (Ngày)" },
            executionTimes,
            { total: total }
        )

        return executionTimes;
    }

    // Thiết lập data số công việc thực hiện theo từng Kpi đơn vị
    setNumberOfTaskData = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        var listOrganizationalUnitKpi, listChildTarget, listTask, listTaskByOrganizationUnitKpi;
        var numberOfTasks = {}, total = 0;

        if (createKpiUnit.currentKPI !== undefined && createKpiUnit.currentKPI.kpis !== undefined) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.childTarget !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.childTargets
        }
        if (dashboardOrganizationalUnitKpi.tasks !== []) {
            listTask = dashboardOrganizationalUnitKpi.tasks
        }

        // Lấy danh sách công việc theo từng Kpi đơn vị
        listTaskByOrganizationUnitKpi = this.getListTaskByOrganizationUnitKpi();

        if(listOrganizationalUnitKpi !== undefined && listChildTarget !== [] && listChildTarget !== undefined && listTask !== undefined && listTask !== []) {
            listOrganizationalUnitKpi.map(parent => {
                var key = listOrganizationalUnitKpi.indexOf(parent);
                var temporary = {};
                var numberOfTask;

                numberOfTask = listTaskByOrganizationUnitKpi[key].length;
                temporary[parent.name] = numberOfTask;
                numberOfTasks = Object.assign(numberOfTasks, temporary);
            
                total = total + numberOfTask;
            })
        }

        numberOfTasks = Object.assign(
            { name: "Số lượng công việc" },
            numberOfTasks,
            { total: total }
        )

        return numberOfTasks; 
    }

    // Thiết lập data số người tham gia theo từng Kpi đơn vị
    setNumberOfParticipantData = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        var listOrganizationalUnitKpi, listChildTarget, listTaskByOrganizationUnitKpi;
        var numberOfParticipants = {}, total = 0; 

        if (createKpiUnit.currentKPI !== undefined && createKpiUnit.currentKPI.kpis !== undefined) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.childTargets !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.childTargets
        }

        // Lấy danh sách công việc theo từng Kpi đơn vị
        listTaskByOrganizationUnitKpi = this.getListTaskByOrganizationUnitKpi();

        if(listOrganizationalUnitKpi === undefined && listChildTarget !== undefined){
            numberOfParticipants = {}
        } else {
            listOrganizationalUnitKpi.map(parent => {
                var key = listOrganizationalUnitKpi.indexOf(parent);
                var creators1, creators2, numberOfParticipant;
                var temporary = {};
                if(listChildTarget !== undefined){
                    creators1 = listChildTarget.filter(item => item.parent === parent._id).map(x => {
                        return x.creator;
                    })
                }
                
                if(listTaskByOrganizationUnitKpi !== undefined) {
                    creators2 = listTaskByOrganizationUnitKpi[key].map(x => {
                        return x.informedEmployees.concat(x.consultedEmployees).concat(x.informedEmployees);
                    })
                    creators2.forEach(x => creators1 = creators1.concat(x));
                }

                creators1 = Array.from(new Set(creators1));
                numberOfParticipant = creators1.length;
                temporary[parent.name] = numberOfParticipant;
                numberOfParticipants = Object.assign(numberOfParticipants, temporary);
                
                total = total + numberOfParticipant;
            })
        }

        numberOfParticipants = Object.assign(
            { name: "Người tham gia" },
            numberOfParticipants,
            { total: total }
        )

        return numberOfParticipants;
    }

    // Thiết lập data số Kpi con của từng Kpi đơn vị
    setNumberOfChildKpiData = () => {
        const { createKpiUnit, dashboardOrganizationalUnitKpi } = this.props;
        var listOrganizationalUnitKpi, listChildTarget;
        var numberOfChildKpis = {}, total = 0;

        if (createKpiUnit.currentKPI !== undefined && createKpiUnit.currentKPI.kpis !== undefined) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        if (dashboardOrganizationalUnitKpi.childTargets !== []) {
            listChildTarget = dashboardOrganizationalUnitKpi.childTargets
        }

        if(listOrganizationalUnitKpi === undefined && listChildTarget !== undefined){
            numberOfChildKpis = {}
        } else {
            listOrganizationalUnitKpi.map(parent => {
                var numberOfChildKpi = 0;
                var temporary = {};
                if(listChildTarget !== undefined){
                    listChildTarget.filter(item => item.parent === parent._id).map(x => {
                        numberOfChildKpi++;
                    })
                }
                total = total + numberOfChildKpi;
                temporary[parent.name] = numberOfChildKpi;
                numberOfChildKpis = Object.assign(numberOfChildKpis, temporary);
            })
        }

        numberOfChildKpis = Object.assign(
            { name: "Số Kpi con" },
            numberOfChildKpis,
            { total: total }
        )

        return numberOfChildKpis;
    }
    
    // Thiết lập data trọng số của từng Kpi đơn vị
    setWeightData = () => {
        const { createKpiUnit } = this.props;
        var listOrganizationalUnitKpi;
        var weight = {}, total = 0;

        if (createKpiUnit.currentKPI !== undefined && createKpiUnit.currentKPI.kpis !== undefined) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis
        }
        
        if(listOrganizationalUnitKpi !== undefined) {
            listOrganizationalUnitKpi.map(parent => {
                var temporary = {};

                total = total + parent.weight;
                temporary[parent.name] = parent.weight;
                weight = Object.assign(weight, temporary)
            })
        }

        weight = Object.assign(
            { name: "Trọng số" },
            weight,
            { total: total }
        )

        return weight;
    }

    // Xóa các chart đã render trước khi đủ dữ liệu
    removePreviousBarChart = () => {
        const chart = this.refs.barChart;
        while(chart.hasChildNodes()){
            chart.removeChild(chart.lastChild);
        }
    } 

    // Khởi tạo Bar Chart bằng D3
    barChart = () => {
       this.removePreviousBarChart();
       
        const { createKpiUnit } = this.props;
        var numberOfParticipants, numberOfChildKpis, executionTimes, numberOfTasks, weight, data, dataChart, listOrganizationalUnitKpi, titleX;
           
        if(createKpiUnit.currentKPI) {
            listOrganizationalUnitKpi = createKpiUnit.currentKPI.kpis;
        }

        executionTimes = this.setExecutionTimeData();
        numberOfChildKpis = this.setNumberOfChildKpiData();
        numberOfParticipants = this.setNumberOfParticipantData();
        numberOfTasks = this.setNumberOfTaskData();
        weight = this.setWeightData();
        
        // Dữ liệu dạng mảng theo từng chỉ số
        data = [               
            executionTimes,
            numberOfParticipants,
            numberOfTasks,
            numberOfChildKpis,
            weight
        ]

        // Giá trị các thanh bar(trục y)
        if(data !== undefined) {
            titleX = data.map(x => x.name);
            titleX = ['x'].concat(titleX);
        }

        // Dữ liệu dạng mảng theo từng KPI để vẽ biểu đồ
        if(listOrganizationalUnitKpi !== undefined) {
            dataChart = listOrganizationalUnitKpi.map(kpis => {
                var temporary;
                temporary = data.map(x => {
                    return (x[kpis.name]/x.total).toFixed(4);
                })
                
                temporary = [kpis.name].concat(temporary);

                return temporary;
            })
        }
        dataChart.unshift(titleX);
    
        // Khởi tạo biểu đồ
        this.chart = c3.generate({
            bindto: this.refs.barChart,         // Đẩy chart vào thẻ div có id="barChart"        

            size: {                                 
                height: 350                     // Thiết lập size biểu đồ
            },

            padding: {                          // Căn lề biểu đồ
                top: 20,
                left: 100,
                right: 20,
                bottom: 20
            },

            data: {                             // Dữ liệu biểu đồ
                x: 'x',
                columns: dataChart,
                type: 'bar',
                groups: [
                    listOrganizationalUnitKpi.map(x => x.name)
                ]
            },

            bar: {                              // Thiết lập size thanh bar
                width: {
                    ratio: 0.8
                }
            },

            axis: {                             // Config các trục tọa độ
                rotated: true,
                x: {
                    type: 'category',
                    tick: {
                        outer: true
                    }
                },
                y: {
                    max: 0.91,
                    tick: {
                        format: d3.format('.0%')
                    }
                }
            },

            tooltip: {                          // Config tooltip
                format: {
                    value:d3.format('.2%')
                }
            },
        })


        // // Lấy các keys của dữ liệu biểu đồ
        // var keys = Object.keys(dataChart[0]).slice(1,5);  

        // // Tạo dữ liệu dạng stack cho biểu đồ
        // var series = d3.stack()
        //     .keys(keys)
        //     .offset(d3.stackOffsetExpand)(dataChart)
        //     .map(d => (d.forEach(v => v.key = d.key), d));

        // // Kích thước biểu đồ
        // var margin = ({top: 30, right: 10, bottom: 0, left: 120});
        // var height = dataChart.length * 25 + margin.top + margin.bottom;
        // var width = 600 + margin.top + margin.bottom;
        
        // // Màu các thanh keys dữ liệu
        // var color = d3.scaleOrdinal()
        //     .domain(series.map(d => d.key))
        //     .range(d3.schemeSpectral[series.length])
        //     .unknown("#ccc");
        
        // // Vẽ các trục tọa độ x, y
        // var x = d3.scaleLinear()
        //     .range([margin.left, width - margin.right]);

        // var y = d3.scaleBand()
        //     .domain(dataChart.map(d => d.name))
        //     .range([margin.top, height - margin.bottom])
        //     .padding(0.08);

        // var xAxis = g => g
        //     .attr("transform", `translate(0,${margin.top})`)
        //     .call(d3.axisTop(x).ticks(width / 100, "%"))
        //     .call(g => g.selectAll(".domain").remove());

        // var yAxis = g => g
        //     .attr("transform", `translate(${margin.left},0)`)
        //     .call(d3.axisLeft(y).tickSizeOuter(0))
        //     .call(g => g.selectAll(".domain").remove());

        // // Định dạng %
        // var formatValue = (x) => isNaN(x) ? "N/A" : x.toLocaleString("en");
        // var formatPercent = d3.format(".1%");

        // // Tạo thẻ svg và đổ vào div có ref="barChart", các thẻ svg sẽ render thành biểu đồ trên giao diện
        // var svg = d3.select(this.refs.barChart)
        //     .append("svg")
        //     .attr("viewBox", [0, 0, width, height])
        //     .style("overflow", "visible");

        // svg.append("g")
        //     .selectAll("g")
        //     .data(series)
        //     .enter().append("g")
        //         .attr("fill", d => color(d.key))
        //     .selectAll("rect")
        //     .data(d => d)
        //     .join("rect")
        //         .attr("x", d => x(d[0]))
        //         .attr("y", (d, i) => y(d.data.name))
        //         .attr("width", d => x(d[1]) - x(d[0]))
        //         .attr("height", y.bandwidth())
        //     .append("title")
        //     .text(d => `${d.key}: ${formatPercent(d[1] - d[0])} (${formatValue(d.data[d.key])})`);

        // svg.append("g")
        //     .call(xAxis);

        // svg.append("g")
        //     .call(yAxis);
    }
    
    render() {
        return (
            <React.Fragment>
                <div ref="barChart"></div>
            </React.Fragment>
        )
    }
}

function mapState(state) {
    const { createKpiUnit, dashboardOrganizationalUnitKpi } = state;
    return { createKpiUnit, dashboardOrganizationalUnitKpi };
}
const actions = {
    getCurrentKPIUnit: createUnitKpiActions.getCurrentKPIUnit,
    getAllChildTargetOfOrganizationalUnitKpis: dashboardOrganizationalUnitKpiActions.getAllChildTargetOfOrganizationalUnitKpis,
    getAllTaskOfOrganizationalUnit: dashboardOrganizationalUnitKpiActions.getAllTaskOfOrganizationalUnit
}

const connectedTrendsInOrganizationalUnitKpiChart = connect(mapState, actions)(TrendsInOrganizationalUnitKpiChart);
export { connectedTrendsInOrganizationalUnitKpiChart as TrendsInOrganizationalUnitKpiChart };