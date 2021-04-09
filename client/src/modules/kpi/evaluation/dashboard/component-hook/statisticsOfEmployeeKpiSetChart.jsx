import React, {useCallback, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

import {createKpiSetActions} from '../../../employee/creation/redux/actions';
import {UserActions} from "../../../../super-admin/user/redux/actions";

import {withTranslate} from 'react-redux-multilingual';

import c3 from 'c3';
import 'c3/c3.css';

function StatisticsOfEmployeeKpiSetChart(props) {
    const DATA_STATUS = {NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3};

    const [state, setState] = useState({
        dataStatus: DATA_STATUS.QUERYING,
        exportData: null
    });

    // useEffect(() => {
    //     const { userId, startMonth, endMonth, organizationalUnitIds } = state;
    //
    //     // if (props.organizationalUnitIds !== organizationalUnitIds || props.userId !== userId || props.startMonth !== startMonth || props.endMonth !== endMonth) {
    //         props.getAllEmployeeKpiSetByMonth(props.organizationalUnitIds, props.userId, props.startMonth, props.endMonth);
    //         setState({
    //             ...state,
    //             dataStatus: DATA_STATUS.QUERYING
    //         });
    //     // }
    //
    // },[props.organizationalUnitIds, props.userId, props.startMonth, props.endMonth])

    useEffect(() => {
        props.getAllEmployeeKpiSetByMonth(props.organizationalUnitIds, props.userId, props.startMonth, props.endMonth);
        setState({
            ...state,
            userId: props.userId,
            startMonth: props.startMonth,
            endMonth: props.endMonth,
            userName: props.userName,
            organizationalUnitIds: props.organizationalUnitIds
        })
    }, [props.userId, props.startMonth, props.endMonth, props.userName, props.organizationalUnitIds]);

    useEffect(() => {
        // console.log("abc")

        // if (state.dataStatus === DATA_STATUS.NOT_AVAILABLE) {
        //    props.getAllEmployeeKpiSetByMonth(props.organizationalUnitIds, props.userId, props.startMonth, props.endMonth);
        //
        //     setState({
        //         ...state,
        //         dataStatus: DATA_STATUS.QUERYING
        //     });
        //
        // } else if (state.dataStatus === DATA_STATUS.QUERYING) {
        //     if (props.createEmployeeKpiSet.employeeKpiSetByMonth) {
        //         setState({
        //             ...state,
        //             dataStatus: DATA_STATUS.AVAILABLE
        //         });
        //     }
        //
        // } else if (state.dataStatus === DATA_STATUS.AVAILABLE) {
        //     multiLineChart();
        //     setState( {
        //         ...state,
        //         dataStatus: DATA_STATUS.FINISHED
        //     });
        //     console.log("##", state.dataStatus)
        //
        // }
        const {createEmployeeKpiSet, translate} = props;
        console.log("dataStatus", createEmployeeKpiSet)
            multiLineChart();

    },[props.createEmployeeKpiSet.employeeKpiSetByMonth])



    const filterEmloyeeKpiSetSameOrganizationaUnit = () => {
        const {createEmployeeKpiSet, translate} = props;
        const {userName} = state;

        let listEmployeeKpiSet, listOrganizationalUnit, listEmployeeKpiSetSameOrganizationalUnit = [], dataChart,
            exportData;

        if (createEmployeeKpiSet) {
            listEmployeeKpiSet = createEmployeeKpiSet.employeeKpiSetByMonth
        }

        if (listEmployeeKpiSet && listEmployeeKpiSet.length !== 0) {
            listOrganizationalUnit = listEmployeeKpiSet.map(kpi => {
                if (kpi.organizationalUnit) {
                    return kpi.organizationalUnit.name;
                }
            })
        }
        listOrganizationalUnit = Array.from(new Set(listOrganizationalUnit));

        if (listOrganizationalUnit && listOrganizationalUnit.length !== 0) {
            listOrganizationalUnit.map((unit, index) => {
                listEmployeeKpiSetSameOrganizationalUnit[index] = listEmployeeKpiSet.filter(kpi => kpi.organizationalUnit && kpi.organizationalUnit.name === unit);

            })
        }
        if (listEmployeeKpiSetSameOrganizationalUnit && userName) {
            exportData = convertDataToExportData(listEmployeeKpiSetSameOrganizationalUnit, userName)
            handleExportData(exportData);
        }

        if (listEmployeeKpiSetSameOrganizationalUnit.length !== 0) {
            dataChart = listEmployeeKpiSetSameOrganizationalUnit.map(kpi => {
                return setDataMultiLineChart(kpi);
            })
        }

        return dataChart;
    };

    const setDataMultiLineChart = (listEmployeeKpiSet) => {
        const {createEmployeeKpiSet, translate} = props;
        const {userName} = state;

        let employeeName, title;
        let dataMultiLineChart, automaticPoint, employeePoint, approvedPoint, date;

        if (userName) {
            employeeName = userName.split('(');
            employeeName = employeeName[0];
        }
        if (listEmployeeKpiSet[0] && listEmployeeKpiSet[0].organizationalUnit) {
            title = employeeName + ' - ' + listEmployeeKpiSet[0].organizationalUnit.name;
        }

        if (listEmployeeKpiSet) {
            automaticPoint = [translate('kpi.evaluation.dashboard.auto_eva')].concat(listEmployeeKpiSet.map(x => x.automaticPoint));
            employeePoint = [translate('kpi.evaluation.dashboard.employee_eva')].concat(listEmployeeKpiSet.map(x => x.employeePoint));
            approvedPoint = [translate('kpi.evaluation.dashboard.approver_eva')].concat(listEmployeeKpiSet.map(x => x.approvedPoint));
            date = listEmployeeKpiSet.map(x => {
                date = new Date(x.date);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() - 1);
            })
        }

        dataMultiLineChart = {
            "title": title,
            "data": [['x'].concat(date), automaticPoint, employeePoint, approvedPoint]
        };
        return dataMultiLineChart;
    };

    function removePreviousChart() {
        const chart = document.getElementById("chart");

        if (chart) {
            while (chart.hasChildNodes()) {
                chart.removeChild(chart.lastChild);
            }
        }
    }

    const multiLineChart = () => {
        removePreviousChart();

        const {translate} = props;
        let dataMultiLineChart = filterEmloyeeKpiSetSameOrganizationaUnit();
        if (dataMultiLineChart && dataMultiLineChart.length !== 0) {
            dataMultiLineChart.map(data => {
                let div = document.createElement('div');
                div.id = data.title;
                let section = document.getElementById("chart");
                section.appendChild(div);

                let chart = c3.generate({
                    bindto: document.getElementById(data.title),
                    title: {
                        show: false,
                        text: data.title,
                        position: 'top-left',   // top-left, top-center and top-right
                        padding: {
                            top: 20,
                            bottom: 5,
                        }
                    },
                    padding: {
                        top: 20,
                        right: 20,
                        left: 20
                    },
                    data: {
                        x: 'x',
                        columns: data.data,
                        type: 'spline'
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: function (x) {
                                    return (x.getMonth() + 1) + "-" + x.getFullYear();
                                }
                            }
                        },
                        y: {
                            max: 100,
                            min: 0,
                            label: {
                                text: translate('kpi.evaluation.employee_evaluation.point'),
                                position: 'outer-right'
                            },
                            padding: {
                                top: 10,
                                bottom: 10
                            }
                        }
                    },
                    zoom: {
                        enabled: false
                    }

                })
            })
        } else {
            let div = document.createElement('div');
            div.innerHTML = "Không có dữ liệu";
            let section = document.getElementById("chart");
            section.appendChild(div);
        }
    };

    const handleExportData = (exportData) => {
        const {onDataAvailable} = props;
        if (onDataAvailable) {
            onDataAvailable(exportData);
        }

    };

    /*Chuyển đổi dữ liệu KPI nhân viên thành dữ liệu export to file excel */
    const convertDataToExportData = (data, name) => {
        let convertedData = [], names = name.split("("), temp;
        let fileName = "Kết quả KPI " + (names ? names[0] : "") + " theo từng tháng ";
        if (data) {
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    convertedData.push(data[i][j])
                }
            }
            let d1, d2;
            //Sap xep tap kpi theo thu tu thoi gian
            for (let i = 0; i < convertedData.length - 1; i++) {
                for (let j = i + 1; j < convertedData.length; j++) {
                    d1 = new Date(convertedData[i].date);
                    d2 = new Date(convertedData[j].date)
                    if (d1 > d2) {
                        temp = convertedData[i];
                        convertedData[i] = convertedData[j];
                        convertedData[j] = temp;
                    }
                }
            }


            for (let i = 0; i < convertedData.length; i++) {
                let d = new Date(convertedData[i].date);
                convertedData[i]["time"] = d;
                convertedData[i]["STT"] = i + 1;
                convertedData[i]["unit"] = convertedData[i].organizationalUnit.name
            }
        }


        let exportData = {
            fileName: fileName,
            dataSheets: [
                {
                    sheetName: "sheet1",
                    sheetTitle: fileName,
                    tables: [
                        {
                            columns: [
                                {key: "STT", value: "STT"},
                                {key: "time", value: "Thời gian"},
                                {key: "unit", value: "Đơn vị "},
                                {key: "automaticPoint", value: "Điểm KPI tự động"},
                                {key: "employeePoint", value: "Điểm KPI tự đánh giá"},
                                {key: "approvedPoint", value: "Điểm KPI được phê duyệt"}
                            ],
                            data: convertedData
                        }
                    ]
                },
            ]


        };
        return exportData;

    };

    let {exportData} = state;
    return (
        <React.Fragment>
            <section id="chart"> </section>
        </React.Fragment>
    )
}

function mapState(state) {
    const {createEmployeeKpiSet} = state;
    return {createEmployeeKpiSet};
}

const actions = {
    getAllEmployeeKpiSetByMonth: createKpiSetActions.getAllEmployeeKpiSetByMonth
};

const connectedStatisticsOfEmployeeKpiSetChart = connect(mapState, actions)(withTranslate(StatisticsOfEmployeeKpiSetChart));
export {connectedStatisticsOfEmployeeKpiSetChart as StatisticsOfEmployeeKpiSetChart};
