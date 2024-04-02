import React, { useEffect, useState } from 'react'
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import C3Chart from "react-c3js";
import 'c3/c3.css';
import { Line } from 'react-chartjs-2';
const ProbDiagram = (props) => {
    const { translate, task, idProcess, taskPert } = props
    const [state, setState] = useState({
        lineData: null,
        taskName: '',
        id: '',
        taskID: task.codeInProcess,
        taskShowing: null

    })
    /**
     * Tính toán xác suất thành công trong khoảng thời gian
     */
    useEffect(() => {
        // console.log(state.taskShowing)
        // removePreviousChart()
        if (task) {
            // let task = state.taskShowing
            console.log(task)
            if (task != undefined) {

                let diagramData = taskPert.processListData.find(p => p.process == idProcess).diagramData
                diagramData = diagramData.find(data => data.taskID == task.codeInProcess)
                console.log(diagramData)
                setState({
                    ...state,
                    taskName: task.name,
                    id: '#' + task._id,
                    taskID: task.codeInProcess
                })
                // convert to chart data 
                let x = ['x']
                // x = x.concat(['a','b','c'])
                x = x.concat(diagramData.timeseries.map(time => time.toString() + ' day'))
                let values = [task.name].concat(diagramData.points.map(p => Math.round(p * 10000) / 100))
                let chartData = [x, values]
                x.shift()
                values.shift()
                console.log(chartData)

                let lineData = {
                    data: values,
                    labels: x
                }
                let chartLineData = {
                    labels: lineData.labels,
                    datasets: [
                        {
                            label: task.name,
                            data: lineData.data,
                            fill: false,
                            backgroundColor: '#2E64FE',
                            borderColor: '#0080FF',
                            pointBorderColor: '#111',
                            pointBackgroundColor: '#ff4000',
                            pointBorderWidth: 2,
                        },
                    ],
                };
                // const footer = (tooltipItems) => {
                //     let sum = 0;
                  
                //     tooltipItems.forEach(function(tooltipItem) {
                //       sum += tooltipItem.parsed.y;
                //     });
                //     return 'Sum: ' + sum;
                //   };
                let options = {
                    title: {
                        display: true,
                        text: 'abc'
                    },
                    responsive: true,
                    layout: {
                        padding: '1em'
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    var label = context.dataset.label || '';
            
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += context.parsed.y+'%';
                                    }
                                    return label;
                                }
                            }
                        }
                      },
                    scales: {
                        y: {
                            title:{
                                display:true,
                                text:'Xác xuất thành công (%)'
                            },
                            ticks: {
                                
                                // Include a dollar sign in the ticks
                                callback: function(value, index, values) {
                                    return  value+'%';
                                }
                            }
                        },
                        x:{
                            title:{
                                display:true,
                                text:'Thời gian thực hiện'
                            },
                            ticks:{
                                color:['black','black','red','black','black'],
                            }
                        }
                    },
                };
                setState({
                    ...state,
                    lineData: {
                        data: chartLineData,
                        option: options
                    }

                })


            }


        }
    }, [task])

    useEffect(() => {
        if (taskPert.processListData.length != 0 && idProcess) {
            console.log(idProcess)
            let data = taskPert.processListData.filter(p => p.process == idProcess)
            if (data.diagramData) {
                let diagramData = data.diagramData
                diagramData = diagramData.filter(t => t.taskID == task.codeInProcess)
            }
            // data = data.filter(t => t.taskID == t.codeInProcess)
            console.log(data)
        }

    }, [taskPert.processListData])

    return (
        <React.Fragment>

            <div id="chart-prob">
                {state.lineData != null && <Line
                    data={state.lineData.data}
                    options={state.lineData.option}
                ></Line>}
            </div>


        </React.Fragment>
    )
}
function mapState(state) {
    const { risk, user, taskPert, tasks } = state;
    return { risk, user, taskPert, tasks }
}

const actionCreators = {

}
const connectedProbDiagram = connect(mapState, actionCreators)(withTranslate(ProbDiagram));
export { connectedProbDiagram as ProbDiagram };