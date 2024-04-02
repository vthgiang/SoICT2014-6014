const statisticChart = () => {
    removePrevStatisticChart();
    let dataChart = setStatisticChartData();
    let chart = c3.generate({
        bindto: document.getElementById('task-chart'),             // Đẩy chart vào thẻ div có id="chart"
        data: {
            x: 'x',
            columns: dataChart,
            // type: 'bar'
        },
        bar: {
            width: {
                ratio: 0.5// this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
        },
        axis: {                                // Config trục tọa độ
            x: {
                type: 'category',
                tick: {
                    rotate: 75,
                    multiline: true
                },
                height: 130
            },
            y: {
                max: 100,
                min: 0,
                label: {
                    text: 'Xác xuất thành công ',
                    position: 'outer-middle'
                },
                // format: d3.format("$")
            }
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {

                    return value;
                }
            }
        }
    })
}
const setStatisticChartData = () => {

    let data = ['Chưa rủi ro']
    console.log('taskRiskData', taskPert.taskRiskData)
    data = taskPert.pertData != undefined ? data.concat(taskPert.pertData.map(r => { return r.pertProb * 100 })) : [];
    console.log(data)
    let taskRiskData = ['Có rủi ro']
    taskRiskData = taskPert.taskRiskData != undefined ? taskRiskData.concat(taskPert.taskRiskData.map(t => t.successProb * 100)) : [];
    let x = ['x']
    x = x.concat(taskPert.pertData.map(r => r.name))
    console.log(x)
    // let month = ['x'], averageAutomatic = [translate('task.task_management.detail_auto_point')], averageEmployee = [translate('task.task_management.detail_emp_point')], averageApproved = [translate('task.task_management.detail_acc_point')];

    return [
        x,
        data,
        taskRiskData

    ]
}
useEffect(() => {
    if (taskPert.pertData.length != 0) {

        statisticChart()
    }

}, [taskPert.pertData, taskPert.taskRiskData])