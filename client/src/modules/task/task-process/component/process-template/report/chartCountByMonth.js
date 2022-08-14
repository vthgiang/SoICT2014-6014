import React, { Component, useEffect, useState } from "react";
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";
import { DatePicker } from "../../../../../../common-components";
import { TaskProcessActions } from "../../../redux/actions";
import { TaskProcessService } from "../../../redux/services";
import c3 from 'c3';
import 'c3/c3.css';

function ChartCountByMonth(props) {
    useEffect(()=>{
        barChart();
    })
    const CountColumnChart = React.createRef()
    function removePreviousBarChart() {
        const chart = CountColumnChart.current;
        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }
    const barChart = () => {
        removePreviousBarChart();

        const { translate,startDate,endDate ,dataTaskProcess} = props;
        let categoryDisposal =[],listMonthDisposal=[]
        let newStartDate = startDate.split("-").reverse().join("-")
        let newEndDate = endDate.split("-").reverse().join("-")
        let startDateDisposal = new Date(newStartDate);
        let endDateDisposal = new Date(newEndDate);
        let periodDisposal = Math.round((endDateDisposal - startDateDisposal) / 2592000000) + 1;
        let mDisposal = newStartDate.slice(5, 7);
        let yDisposal = newStartDate.slice(0, 4);

        for (let k = 0; k <= periodDisposal; k++) {
            if (mDisposal > 12) {
                mDisposal = 1;
                yDisposal++;
            }
            if (mDisposal < 10) {
                mDisposal = '0' + mDisposal;
            }
            categoryDisposal.push([mDisposal, yDisposal].join('-'));
            listMonthDisposal.push([yDisposal, mDisposal].join(','));
            mDisposal++;
        }
        let countTaskProcess=[]
        if (dataTaskProcess) {
            for (let i = 0; i < listMonthDisposal.length - 1; i++) {
                let cnt = 0, val = 0;
                let minDate = new Date(listMonthDisposal[i]).getTime();
                let maxDate = new Date(listMonthDisposal[i + 1]).getTime();
                if (dataTaskProcess) {
                    dataTaskProcess.forEach(TaskProcess => {
                        if (new Date(TaskProcess.createdAt).getTime() < maxDate && new Date(TaskProcess.createdAt).getTime() >= minDate) {
                            val++
                        }
                    })
                }
                countTaskProcess.push(val)
            }

        }
        let dataChart =  countTaskProcess.length!==0 ? [["quy trinh"].concat(countTaskProcess)]:[]
        categoryDisposal.pop(listMonthDisposal)
        let x = categoryDisposal.length!==0 ? categoryDisposal:[];
        console.log(x,dataChart);
        let chart = c3.generate({
            bindto: CountColumnChart.current,


            // Căn lề biểu đồ
            padding: {
                top: 20,
                bottom: 20,
                right: 20,
                left: 20
            },
            axis: {
                x: {
                    type: 'category',
                    categories: x,
                    tick: {
                        multiline: false
                    }
                },y: {
                    label: {
                        text: 'y axis',
                        position: 'outer middle'
                      },tick: {
                        multiline: false
                    }
                },
                //  rotated: true
            },
            data: {
                columns: dataChart,
                type: 'bar',
                labels: true,
            },

        })
    }
    return (
        <React.Fragment>
        <div class="box-header"><div class="box-title">Số lần thực hiện quy trình theo từng tháng</div></div>
            <div ref={CountColumnChart}></div>
        </React.Fragment>
    );
}

function mapState(state) {
    //const { user, auth, role, taskProcess } = state;
    return {  };
}

const actionCreators = {
    //getAllTaskProcess: TaskProcessActions.getAllTaskProcess,
    //getXmlDiagramById: TaskProcessActions.getXmlDiagramById,
};
const connectedChartCountByMonth = connect(mapState, actionCreators)(withTranslate(ChartCountByMonth));
export { connectedChartCountByMonth as ChartCountByMonth };
