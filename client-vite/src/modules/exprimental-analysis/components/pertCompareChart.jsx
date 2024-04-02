import React, { useState, useEffect } from 'react'
import C3Chart from "react-c3js";
const PertCompareChart = (props) => {
    const { chartData } = props
    const [probChart,setProbChart] = useState(null)
    const [probChartConfig,setProbChartConfig] = useState({
        distributionData:{
            x:'x',
            columns:[]
        },
        axis: {                                // Config trục tọa độ
            x: {
                type: 'category',
                tick: {
                    // rotate: -75,
                    multiline: false,
                },
                label: {

                    text: 'Duration(hours)',
                    position: 'outer-center'
                },
                height: 50,

            },
            y: {
                max: 100,
                min: 10,
                label: {
                    text: 'Completion Probability(%)',
                    position: 'outer-middle'
                },
                // format: d3.format("$")
            }
        },
        color: {
            pattern: []
        },
        size: {
            width: 600,
            // height:s 500
        },
        legend: {
            position: 'right',
        },
        tooltip: {
            format: {
                title: function (d) {
                    // console.log('d', d)
                    return d;
                },
                value: function (value) {
                    return value + ' %'
                }
            },
        },
    })
    const [chartConfig, setChartConfig] = useState({
        pertData: {
            x: 'x',
            columns: []
        },
        noRiskData:{
            x:'x',
            columns:[]
        },
        distributionData:{
            x:'x',
            columns:[]
        },
        axis: {                                // Config trục tọa độ
            x: {
                type: 'category',
                tick: {
                    // rotate: -75,
                    multiline: false,
                },
                label: {

                    text: 'Activities',
                    position: 'outer-center'
                },
                height: 50,

            },
            y: {
                max: 100,
                min: 10,
                label: {
                    text: 'Completion Probability(%)',
                    position: 'outer-middle'
                },
                // format: d3.format("$")
            }
        },
        color: {
            pattern: []
        },
        size: {
            width: 600,
            // height:s 500
        },
        legend: {
            position: 'right',
        },
        tooltip: {
            format: {
                title: function (d) {
                    // console.log('d', d)
                    return d;
                },
                value: function (value) {
                    return value + ' %'
                }
            },
        },
    })
    useEffect(() => {
        // Lấy dữ liệu đổ vào chart
        let chartData = props.chartData
        console.log('chartCompare', chartData)
        let tasks = chartData.taskData
        let risks = chartData.riskData
        let probList = chartData.probList
        let newModel = ['New model']
        let pertModel = ['PERT']
        let x = ['x']
        let taskNames = tasks.map(task => task.ID)
        x = x.concat(taskNames)
        x = x.map(x => x.length > 13 ? x.slice(0, 10) + '...' : x)
        // Đổ dữ liệu vào chart so sánh với giải thuật PERT
        newModel = newModel.concat(tasks.map(task => Math.round(task.prob * 10000) / 100))
        pertModel = pertModel.concat(tasks.map(task => Math.round(task.pertProb * 10000) / 100))
        let data = [x, newModel, pertModel]
        // Đổ dữ liệu vào so sánh khi có và không xét đến rủi ro
        let hasRiskModel = ['Có rủi ro']
        let noRiskModel = ['Không có rủi ro']
        hasRiskModel = hasRiskModel.concat(tasks.map(task => Math.round(task.prob * 10000) / 100))
        noRiskModel = noRiskModel.concat(tasks.map(task => Math.round(task.noRiskProb * 10000) / 100))
        let noRiskData = [x,hasRiskModel,noRiskModel]
        
        setChartConfig({
            ...chartConfig,
            pertData: {
                x: 'x',
                columns: data,
                // type: 'bar',
                
            },
            noRiskData:{
                x:'x',
                columns:noRiskData
            },
            bar: {
                width: {
                  ratio: 0.2
                }
              },
            tooltip: {
                format: {
                    title: function (d) {
                        // console.log('d', d)
                        return taskNames[d + 1];
                    },
                    value: function (value) {
                        return value + ' %'
                    }
                },
            }
        })
    }, [props.chartData])
    const [taskShowing,setTaskShowing] = useState("A")
    const handleChangeSelectBox = (e) =>{
        console.log(e.target.value)
        setTaskShowing(e.target.value)
    }
    useEffect(()=>{
        // Do du lieu vao probList
        // lay gia tri cua A
        let probList = props.chartData.probList
        let xProbList = ['x']
        let temp = probList.map(p => {
            // console.log('p',p)
            let data = p.find(p1 => p1.id==taskShowing)
            // console.log(data)
            return data.duration.toString() +' hours'
        })
        // console.log('temp',temp)
        console.log('taskShowung',taskShowing)
        xProbList = xProbList.concat(temp)
        let probData = ['Probability']
        let probListAxis = probList.map(p => {
            let data = p.find(p1 => p1.id==taskShowing)
            return Math.round(data.prob*10000)/100
        })
        probData = probData.concat(probListAxis)
        let probDataChart = [xProbList,probData]
        console.log('probDataChart',probDataChart)
        setProbChartConfig({
            ...probChartConfig,
            distributionData:{
                x:'x',
                columns:probDataChart
            },
            axis: {                                // Config trục tọa độ
                x: {
                    type: 'category',
                    tick: {
                        // format: function (x) { return xProbList[x+1]+' day'},
                        // rotate: -75,
                        multiline: false,
                    },
                    label: {
    
                        text: 'Duration (hours)',
                        position: 'outer-center'
                    },
                    height: 50,
    
                },
                y: {
                    // max: parseInt(Math.max(...allProb)),
                    // min: parseInt(Math.min(...allProb)),
                    label: {
                        text: 'Completition Probability ',
                        position: 'outer-middle'
                    },
                    // format: d3.format("$")
                }
            },
            
        })
    },[taskShowing])
    
    return (
        <React.Fragment>
            <div className="row">
                <div className="col-sm-6">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Compare Models</div>
                        </div>
                        <div className="box-body">


                            {chartConfig.pertData != null&&chartConfig.pertData.columns.length!=0&& <C3Chart
                                data={chartConfig.pertData}
                                axis={chartConfig.axis}
                                size={chartConfig.size}
                                tooltip={chartConfig.tooltip}
                                legend={chartConfig.legend}
                                // bar ={chartConfig.bar}
                            />
                            }
                        </div>
                    </div>
                </div>
                <div className="col-sm-8">
                    <div className="box box-primary">
                        <div className="box-header with-border">
                            <div className="box-title">Completition Probability In Time</div>
                        </div>
                        <div className="box-body">
                        <div className="form-group">
                                <label>Choose Task</label>
                                {props.chartData.taskData.length!=0&&<select style={{ width: '50%' }} className="form-control" onChange={handleChangeSelectBox} >
                                    {props.chartData.taskData.map(task =>(
                                        <option value={task.ID}>{task.ID}</option>)
                                    )}
                
                                </select>
                                }
                            </div>

                            {probChartConfig.distributionData != null&&probChartConfig.distributionData.columns.length!=0&& <C3Chart
                                data={probChartConfig.distributionData}
                                axis={probChartConfig.axis}
                                size={probChartConfig.size}
                                tooltip={probChartConfig.tooltip}
                                legend={probChartConfig.legend}
                                // bar ={chartConfig.bar}
                            />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default PertCompareChart