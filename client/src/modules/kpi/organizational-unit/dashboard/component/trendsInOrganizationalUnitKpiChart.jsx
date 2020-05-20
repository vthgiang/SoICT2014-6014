import React, { Component } from 'react';
import { connect } from 'react-redux';

import { dashboardOrganizationalUnitKpiActions } from '../redux/actions';
import { createUnitKpiActions } from '../../creation/redux/actions';
import * as d3 from "d3";

class TrendsInOrganizationalUnitKpiChart extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            currentRole: localStorage.getItem("currentRole"),
            newDataCurrentKpi: false,
            newDataChildTargets: false,
            newDataTasks: false
        };
    }

    componentDidMount() {
        // Lấy Kpi của đơn vị hiện tại
        this.props.getCurrentKPIUnit(this.state.currentRole);
        // Lấy danh sách Kpi con theo từng Kpi của đơn vị hiện tại
        this.props.getAllChildTargetOfOrganizationalUnitKpis(this.state.currentRole);
        // Lấy danh sách các công việc theo từng Kpi của đơn vị hiện tại
        this.props.getAllTaskOfOrganizationalUnit(this.state.currentRole)
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        // Kiểm tra currentKPI đã được bind vào props hay chưa
        let newDataCurrentKpi = nextProps.createKpiUnit.currentKPI !== undefined 
                                    && nextProps.createKpiUnit.currentKPI !== null;
        if(!newDataCurrentKpi) {
            return false            // Đang lấy dữ liệu, ko cần render lại
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

        // Kiểm tra childTarget đã được bind vào props hay chưa
        let newDataChildTargets = nextProps.dashboardOrganizationalUnitKpi.childTargets !== undefined 
                                    && nextProps.dashboardOrganizationalUnitKpi.childTargets !== null 
                                    && nextProps.dashboardOrganizationalUnitKpi.childTargets !== [];                          
        if(!newDataChildTargets) {
            return false            // Đang lấy dữ liệu, ko cần render lại
        }
        if(this.props.dashboardOrganizationalUnitKpi.childTargets) {
            newDataChildTargets = newDataChildTargets && (nextProps.dashboardOrganizationalUnitKpi.childTargets.length !== this.props.dashboardOrganizationalUnitKpi.childTargets.length)
        }
        // if(!newDataChildTargets && !this.state.newDataChildTargets) {
        //     this.setState(state =>{
        //         return {
        //             ...state,
        //             newDataChildTargets: true,
        //         };
        //     });
        //     return false; // Cần cập nhật lại state, không cần render
        // }

        // Kiểm tra tasks đã được bind vào props hay chưa
        let newDataTasks = nextProps.dashboardOrganizationalUnitKpi.tasks !== undefined 
                                && nextProps.dashboardOrganizationalUnitKpi.tasks !== null 
                                && nextProps.dashboardOrganizationalUnitKpi.tasks !== [];
        if(!newDataTasks) {
            return false            // Đang lấy dữ liệu, ko cần render lại
        }
        if(this.props.dashboardOrganizationalUnitKpi.tasks) {
            newDataTasks = newDataTasks && (nextProps.dashboardOrganizationalUnitKpi.tasks.length === this.props.dashboardOrganizationalUnitKpi.tasks.length)
        }
        // if(!newDataTasks && !this.state.newDataTasks) {
        //     this.setState(state =>{
        //         return {
        //             ...state,
        //             newDataTasks: true,
        //         };
        //     });
        //     return false; // Cần cập nhật lại state, không cần render
        // }

        // console.log("00000", nextProps.dashboardOrganizationalUnitKpi.tasks.length === this.props.dashboardOrganizationalUnitKpi.tasks.length)
        // console.log("---------------", this.props.createKpiUnit.currentKPI.kpis, nextProps.createKpiUnit.currentKPI.kpis)
        // console.log("---------------", this.props.dashboardOrganizationalUnitKpi.childTargets, nextProps.dashboardOrganizationalUnitKpi.childTargets)
        // console.log("---------------", this.props.dashboardOrganizationalUnitKpi.tasks, nextProps.dashboardOrganizationalUnitKpi.tasks)
        // console.log("!newDataCurrentKpi && !newDataChildTargets && !newDataTasks",this.state.newDataCurrentKpi && this.state.newDataChildTargets && this.state.newDataTasks)
        // console.log("this.state.newDataCurrentKpi", this.state.newDataCurrentKpi)
        // console.log("this.state.newDataChildTargets", this.state.newDataChildTargets)
        // console.log("this.state.newDataTasks", this.state.newDataTasks)

        // if(this.state.newDataCurrentKpi && this.state.newDataChildTargets && this.state.newDataTasks) {
        //     return true
        // }
        if(!newDataCurrentKpi && !newDataChildTargets && !newDataTasks) {
            return true             // Render khi đã bind đủ dữ liệu vào props
        }
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

    // Khởi tạo Bar Chart bằng D3
    barChart = () => {
        // Tạo mảng dữ liệu
        var numberOfParticipants, numberOfChildKpis, executionTimes, numberOfTasks, weight, dataChart;
           
        executionTimes = this.setExecutionTimeData();
        numberOfChildKpis = this.setNumberOfChildKpiData();
        numberOfParticipants = this.setNumberOfParticipantData();
        numberOfTasks = this.setNumberOfTaskData();
        weight = this.setWeightData();
        
        dataChart = [               
            executionTimes,
            numberOfParticipants,
            numberOfTasks,
            numberOfChildKpis,
            weight
        ]

        // Lấy các keys của dữ liệu biểu đồ
        var keys = Object.keys(dataChart[0]).slice(1,5);  

        // Tạo dữ liệu dạng stack cho biểu đồ
        var series = d3.stack()
            .keys(keys)
            .offset(d3.stackOffsetExpand)(dataChart)
            .map(d => (d.forEach(v => v.key = d.key), d));

        // Kích thước biểu đồ
        var margin = ({top: 30, right: 10, bottom: 0, left: 120});
        var height = dataChart.length * 25 + margin.top + margin.bottom;
        var width = 600 + margin.top + margin.bottom;
        
        // Màu các thanh keys dữ liệu
        var color = d3.scaleOrdinal()
            .domain(series.map(d => d.key))
            .range(d3.schemeSpectral[series.length])
            .unknown("#ccc");
        
        // Vẽ các trục tọa độ x, y
        var x = d3.scaleLinear()
            .range([margin.left, width - margin.right]);

        var y = d3.scaleBand()
            .domain(dataChart.map(d => d.name))
            .range([margin.top, height - margin.bottom])
            .padding(0.08);

        var xAxis = g => g
            .attr("transform", `translate(0,${margin.top})`)
            .call(d3.axisTop(x).ticks(width / 100, "%"))
            .call(g => g.selectAll(".domain").remove());

        var yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSizeOuter(0))
            .call(g => g.selectAll(".domain").remove());

        // Định dạng %
        var formatValue = (x) => isNaN(x) ? "N/A" : x.toLocaleString("en");
        var formatPercent = d3.format(".1%");

        // Tạo thẻ svg và đổ vào div có ref="barChart", các thẻ svg sẽ render thành biểu đồ trên giao diện
        var svg = d3.select(this.refs.barChart)
            .append("svg")
            .attr("viewBox", [0, 0, width, height])
            .style("overflow", "visible");

        svg.append("g")
            .selectAll("g")
            .data(series)
            .enter().append("g")
                .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
                .attr("x", d => x(d[0]))
                .attr("y", (d, i) => y(d.data.name))
                .attr("width", d => x(d[1]) - x(d[0]))
                .attr("height", y.bandwidth())
            .append("title")
            .text(d => `${d.key}: ${formatPercent(d[1] - d[0])} (${formatValue(d.data[d.key])})`);

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);
    }
    
    render() {
        (this.props.createKpiUnit.currentKPI 
            && this.props.createKpiUnit.currentKPI.kpis 
            && this.props.dashboardOrganizationalUnitKpi.tasks !== [] 
            && this.props.dashboardOrganizationalUnitKpi.childTargets !== []
            && this.props.dashboardOrganizationalUnitKpi.tasks !== undefined 
            && this.props.dashboardOrganizationalUnitKpi.childTargets !== undefined) 
            && this.barChart()

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