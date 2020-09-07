import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TaskReportActions } from '../redux/actions';
import moment from 'moment';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { LineBarChart } from './lineBarChart';
import { PieChart } from './pieChart';
class TaskReportViewForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartType: '',
            aggregationType: '',
        }
    }

    formatPriority = (data) => {
        if (data === 1) return "Thấp";
        if (data === 2) return "Trung bình";
        if (data === 3) return "Cao";
    }

    formatChartType = (chartType) => {
        if (chartType === '0') return "bar";
        if (chartType === '1') return "line";
        if (chartType === '2') return "pie";
    }


    /**
     * @param {*} data:time
     * 
     * Hàm convert thời gian ra tháng
     */
    convertMonthYear = (data) => {
        const time = new Date(data);
        const month = time.getMonth();
        const year = time.getFullYear();
        return `${month + 1}-${year}`;
    }


    // 
    /**
     * @param {*} data : Time
     * 
     * Hàm convert thời gian ra năm
     */
    convertYear = (data) => {
        const time = new Date(data);
        const year = time.getFullYear();
        return `${year}`;
    }


    /**
     * @param {*} data Time
     * 
     * Hàm convert thời gian ra quý
     */
    getQuarter = (data) => {
        const time = new Date(data);
        let quarter = Math.floor((time.getMonth() + 3) / 3);
        let year = (`Quý${quarter}-`) + time.getFullYear();
        return `${year}`;
    }


    /**
     * @param {*} tasks Danh sách công việc
     * 
     * Hàm gom nhóm các công việc theo thời gian
     */
    groupByDate = (tasks, dataAxisX) => {
        if (dataAxisX && dataAxisX.indexOf(1) === 0) {
            return tasks.reduce((groups, item) => {
                groups[item.time] = [...groups[item.time] || [], item];
                return groups;
            }, {});
        } else {
            return Object.entries(tasks).map(([o, datapoints]) => {
                return datapoints.reduce((groups, item) => {
                    const getTime = item.time;
                    groups[[o] + `|${getTime}`] = [...groups[[o] + `|${getTime}`] || [], item]
                    return groups;
                }, [])
            })
        }
    }


    /**
     * @param {*} tasks Danh sách các công việc
     * 
     * Hàm gom nhóm các công việc theo người thực hiện
     */
    groupByResponsibleEmployees = (tasks, dataAxisX) => {
        if (dataAxisX && dataAxisX.indexOf(2) === 0) {
            return tasks.reduce((groups, item) => {
                groups[item.responsibleEmployees.toString()] = [...groups[item.responsibleEmployees.toString()] || [], item];
                return groups;
            }, {});
        } else {
            return Object.entries(tasks).map(([o, datapoints]) => {
                return datapoints.reduce((groups, item) => {
                    const getRes = item.responsibleEmployees.toString();
                    groups[[o] + `|${getRes}`] = [...groups[[o] + `|${getRes}`] || [], item];
                    return groups;
                }, []);
            })
        }
    }


    /**
     * @param {*} tasks Danh sách các công việc
     * 
     * Hàm gom nhóm các công việc theo người phê duyệt
     */
    groupByAccountableEmployees = (tasks) => {
        return tasks.reduce((groups, item) => {
            groups[item.accountableEmployees.toString()] = [...groups[item.accountableEmployees.toString()] || [], item];
            return groups;
        }, {});
    }


    /**
     * @param {*} tasks Danh sách các công việc đã convert đúng định dạng đầu vào
     * 
     * Hàm tính tổng và trung bình cộng các công việc
     */
    aggregate = (tasks) => {
        let map = new Map;
        for (let { aggregationType, coefficient, code, value, chartType, showInReport } of tasks) {
            if (showInReport === true) {
                let entry = map.get(code);
                if (!entry) map.set(code, entry = { aggregationType, chartType, showInReport, coefficient, sum: 0, count: 0 });
                entry.sum += value;
                entry.count++;
            }
        }
        return Array.from(map, ([code, { aggregationType, chartType, showInReport, coefficient, sum, count }]) =>
            [code, (+aggregationType ? sum : sum / count) * coefficient, this.formatChartType(chartType), showInReport]
        );
    }


    /**
     * @param {*} input Đầu vào là một mảng gồm Mangr các giá kị có cặp key, value
     * 
     * Hàm Convert data sau khi tính toán
     */
    dataAfterAggregate = (input) => {
        return input.map(([time, datapoints]) => {
            let allTasks = datapoints.flatMap(point => point.task.map(x => ({ ...x, responsibleEmployees: point.responsibleEmployees, accountableEmployees: point.accountableEmployees })))
            // Tên mới cho trường thông tin
            allTasks.map(item => {
                if (item.newName) {
                    item.code = item.newName;
                } else {
                    item.code = item.code;
                }
                return item;
            })

            let result = this.aggregate(allTasks); // gọi hàm tính trung bình cộng và tổng. 

            return {
                time,
                tasks: result.map(([code, value, chartType, showInReport]) => ({ code, value, chartType, showInReport })),
            }
        });
    }

    /**
     * @param {*} input 
     * 
     * Tách data vẽ chart:
     *  - Tách riêng data vẽ biểu đồ cột, đường và tròn
     */
    separateDataChart = (input) => {
        let pieChartData = [], barLineChartData = [];
        input.forEach(x => {
            let tasks = x.tasks.filter(y =>
                y.chartType === "pie" ? (pieChartData.push({ tasks: [y], time: x.time }), false) : true)
            if (tasks.length > 0) {
                barLineChartData.push({
                    time: x.time,
                    tasks: tasks,
                })
            }
        })
        return { pieChartData, barLineChartData };
    }


    /**
     * @param {*} input Dữ liệu bên server trả ra, mặc định người thực hiện trả ra là mảng
     *  - Nếu một công việc có 3 người thực hiện thì tách ra mỗi công việc 1 người thực hiện
     */
    separateResponsibleEmployees = (input) => {
        let results = [];
        input.forEach(x => {
            x.responsibleEmployees.forEach(y => {
                results.push({
                    time: x.time,
                    task: x.task,
                    responsibleEmployees: y,
                })
            })
        });
        return results;
    }



    /**
     * @param {*} input Dữ liệu bên server trả ra, mặc định người phê duyệt trả ra là mảng
     *  - Nếu một công việc có 3 người phê duyệt thì tách ra mỗi công việc 1 người phê duyệt
     */
    separateAccountableEmployees = (input) => {
        let results = [];
        input.forEach(x => {
            x.accountableEmployees.forEach(y => {
                results.push({
                    time: x.time,
                    task: x.task,
                    accountableEmployees: y,
                })
            })
        });
        return results;
    }

    /**
     * @param {*} input 
     * 
     * Hàm convert data qua dạng của c3js với biểu đồ tròn khi chọn 1 chiều dữ liệu
     */
    convertDataPieChartOneWay = (input) => {
        let groupByCode = {}, pieDataConvert;

        input.flatMap(item => item.tasks.map(task => ({ ...task, time: item.time })) //add time vào mảng task
        ).forEach(childTask => {
            if (groupByCode[childTask.code]) {
                groupByCode[childTask.code].push(childTask)
            } else {
                groupByCode[childTask.code] = [childTask];
            }
        })

        pieDataConvert = Object.entries(groupByCode).map(([code, tasks]) => ({
            [code]: tasks.map((task) => [task.time, task.value])
        }))
        return pieDataConvert;
    }


    render() {
        const { tasks, reports, translate } = this.props;
        let formater = new Intl.NumberFormat();
        let listTaskEvaluation = tasks.listTaskEvaluations;

        let taskInfoName, headTable = [], frequency, newlistTaskEvaluation, dataForAxisXInChart = [];

        // hiển thị trường thông tin hiện trong bảng báo cáo form preview view
        if (listTaskEvaluation && listTaskEvaluation.length !== 0) {
            taskInfoName = listTaskEvaluation[0];
            taskInfoName.taskInformations.forEach(x => {
                if (x.type === "Number") {
                    headTable = [...headTable, x.name];
                }
            })
        }


        if (listTaskEvaluation) {
            // Lấy tần suất, Vì tần suất là chung cho các công việc nên chỉ cần lấy công việc đầu tiên
            let taskEvaluation = listTaskEvaluation[0];
            frequency = taskEvaluation.frequency;

            // Lấy giá trị chọn chiều dữ liệu đưa vào biểu đồ
            dataForAxisXInChart = taskEvaluation.dataForAxisXInChart;
            if (dataForAxisXInChart.length > 0) {
                dataForAxisXInChart = dataForAxisXInChart.map(x => x.id);
            } else {

                // Trường hợp người dùng không chọn chiều dữ liệu, thì mặc định láy chiều thời gian
                dataForAxisXInChart = dataForAxisXInChart;
            }

            // Lọc lấy các trường cần thiết cho việc config dữ liệu biểu đồ.
            newlistTaskEvaluation = listTaskEvaluation.map(item => {
                return {
                    time: (frequency && frequency === 'month') ? this.convertMonthYear(item.date)
                        : (frequency === 'quarter' ? this.getQuarter(item.date) : this.convertYear(item.date)),
                    task: item.taskInformations.filter(task => {
                        if (task.type === 'Number')
                            return task;
                    }),
                    responsibleEmployees: item.responsibleEmployees.map(x => x.name),
                    accountableEmployees: item.accountableEmployees.map(x => x.name),
                }
            });

        }

        let output, pieChartData = [], barLineChartData = [], pieDataConvert;

        /**
       * Convert data, gom nhóm, tính tổng và tính trung bình cộng các trường thông tin.
       *  Nếu chọn trục hoành là thời gian dataForAxisXInChart = 1
       */

        if (dataForAxisXInChart.toString() === "1" || dataForAxisXInChart.length === 0) {
            let groupDataByDate;

            if (newlistTaskEvaluation) {
                // Gọi hàm groupByDate gom nhóm theo thời gian
                groupDataByDate = Object.entries(this.groupByDate(newlistTaskEvaluation, dataForAxisXInChart));

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = this.dataAfterAggregate(groupDataByDate);

                // tách data vẽ biểu đồ:  cột với đường ra riêng, tròn ra riêng
                let separateDataChart = this.separateDataChart(output); // gọi hàm tách data
                pieChartData = separateDataChart.pieChartData; // Dữ liệu vẽ biểu đồ tròn
                barLineChartData = separateDataChart.barLineChartData; // Dữ liệu vẽ biểu đồ cột và đường
            }

            // convert Data pieChart sang dạng C3js
            if (pieChartData && pieChartData.length > 0) {
                pieDataConvert = this.convertDataPieChartOneWay(pieChartData);
            }

        }

        /**
             * Convert data, gom nhóm theo người thực hiện, tính trung bình cộng các trường thông tin.
             * Nếu trục hoành là người thực hiện dataForAxisXInChart = '2'
        */

        else if (dataForAxisXInChart.toString() === "2") {
            let groupDataByResponsibleEmployees;

            if (newlistTaskEvaluation) {
                let results = [];

                // Gọi hàm separateResponsibleEmployees tách người thực hiện
                results = this.separateResponsibleEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByResponsibleEmployees nhóm công việc theo người thực hiện
                groupDataByResponsibleEmployees = Object.entries(this.groupByResponsibleEmployees(results, dataForAxisXInChart)); // Dùng Object.entries convert thành mảng các phần tử có cặp key,value

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = this.dataAfterAggregate(groupDataByResponsibleEmployees);

                // tách data vẽ biểu đồ cột+đường với tròn
                let separateDataChart = this.separateDataChart(output);
                pieChartData = separateDataChart.pieChartData;
                barLineChartData = separateDataChart.barLineChartData;
            }

            // convert Data pieChart sang dạng C3js
            if (pieChartData && pieChartData.length > 0) {
                pieDataConvert = this.convertDataPieChartOneWay(pieChartData);
            }

        }
        /**
            * Convert data, gom nhóm theo người phê duyệt, tính trung bình cộng các trường thông tin.
            * Nếu trục hoành là người phê duyệt dataForAxisXInChart = '3'
        */
        else if (dataForAxisXInChart.toString() === "3") {

            let groupDataByAccountableEmployees;
            if (newlistTaskEvaluation) {
                let results = [];

                // Gọi hàm separateAccountableEmployees tách người phê duyệt
                results = this.separateAccountableEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByAccountableEmployees nhóm công việc theo người phê duyệt
                groupDataByAccountableEmployees = Object.entries(this.groupByAccountableEmployees(results));

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = this.dataAfterAggregate(groupDataByAccountableEmployees);

                // tách data vẽ biểu đồ cột+đường với tròn
                let separateDataChart = this.separateDataChart(output);
                pieChartData = separateDataChart.pieChartData;
                barLineChartData = separateDataChart.barLineChartData;
            }

            // convert Data pieChart theo dạng c3
            if (pieChartData && pieChartData.length > 0) {
                pieDataConvert = this.convertDataPieChartOneWay(pieChartData);
            }
        }

        /**
         * Convert data, gom nhóm theo thời gian và người thực hiện, tính trung bình cộng các trường thông tin.
         * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của chiều thời gian và người thực hiện có ở trong mảng dataForAxisXInChart hay không. 
         * nếu id = 1 chiều thời gian, id = 2 là chiều người thực hiện
         */
        else if (dataForAxisXInChart.indexOf(1) === 0 && dataForAxisXInChart.indexOf(2) === 1) {
            if (newlistTaskEvaluation) {
                // Gọi hàm separateResponsibleEmployees tách người thực hiện
                let results = this.separateResponsibleEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByDate nhóm công việc theo thời gian
                let groupDataByDate = this.groupByDate(results, dataForAxisXInChart);

                // Tiếp tục gom nhóm theo người thực hiện: thực hiện đính kèm ngày với tên người thực hiện
                let groupDataByResponsibleEmployees = this.groupByResponsibleEmployees(groupDataByDate, dataForAxisXInChart)

                // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
                groupDataByResponsibleEmployees = groupDataByResponsibleEmployees.flatMap(x => Object.entries(x));

                let output = [];

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = this.dataAfterAggregate(groupDataByResponsibleEmployees);

                //tách data vẽ biểu đồ cột, đường với biểu dồ tròn
                let separateDataChart = this.separateDataChart(output);
                pieChartData = separateDataChart.pieChartData;
                barLineChartData = separateDataChart.barLineChartData;


                // Convert data sang dạng vẽ biểu đồ tròn của c3js
                if (pieChartData && pieChartData.length > 0) {
                    // convert Data pieChart
                    pieDataConvert = this.convertDataPieChartOneWay(pieChartData);
                }

            }
        }

        /**
         * Convert data, gom nhóm theo người thực hiện và thời gian, tính tổng/ trung bình cộng các trường thông tin.
         * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của chiều người thực hiện và thời gian có ở trong mảng dataForAxisXInChart hay không.
         *  id = 2 là chiều người thực hiện, nếu id = 1 chiều thời gian
        */
        else if (dataForAxisXInChart.indexOf(1) === 1 && dataForAxisXInChart.indexOf(2) === 0) {

            if (newlistTaskEvaluation) {
                // Gọi hàm separateResponsibleEmployees tách người thực hiện
                let results = this.separateResponsibleEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByResponsibleEmployees nhóm công việc theo người thực hiện
                let groupDataByResponsibleEmployees = this.groupByResponsibleEmployees(results, dataForAxisXInChart);

                // Sau khi gom nhóm theo người thực hiện thì gom nhóm theo thời gian 
                let groupDataByDate = this.groupByDate(groupDataByResponsibleEmployees, dataForAxisXInChart)

                // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
                groupDataByDate = groupDataByDate.flatMap(x => Object.entries(x));

                let output = [];
                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = this.dataAfterAggregate(groupDataByDate);

                //tách data vẽ biểu đồ cột, đường với biểu dồ tròn
                let separateDataChart = this.separateDataChart(output);
                pieChartData = separateDataChart.pieChartData;
                barLineChartData = separateDataChart.barLineChartData;

                if (pieChartData && pieChartData.length > 0) {
                    // convert Data pieChart c3js
                    pieDataConvert = this.convertDataPieChartOneWay(pieChartData);
                }

            }
        }

        /**
           * Convert data, gom nhóm theo thời gian và người phê duyệt, tính tổng/ trung bình cộng các trường thông tin.
           * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của thời gian và người phê duyệt có ở trong mảng dataForAxisXInChart hay không.
           * nếu id = 1 chiều thời gian, id = 3 là chiều người phê duyệt,
        */
        else if (dataForAxisXInChart.indexOf(1) === 0 && dataForAxisXInChart.indexOf(3) === 1) {
            if (newlistTaskEvaluation) {
                // Gọi hàm separateAccountableEmployees tách người phê duyệt
                let results = this.separateAccountableEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByDate nhóm công việc theo người thực hiện
                let groupDataByDate = this.groupByDate(results);


                // Sau khi gom nhóm theo thời gian thì gom nhóm theo người phê duyệt
                let groupDataByAccountableEmployees = Object.entries(groupDataByDate).map(([time, datapoints]) => {
                    return datapoints.reduce((gr, item) => {
                        let acc = item.accountableEmployees.toString();
                        gr[[time] + ` ` + `(${acc})`] = [...gr[[time] + ` ` + `(${acc})`] || [], item];
                        return gr;
                    }, []);
                });

                // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
                groupDataByAccountableEmployees = groupDataByAccountableEmployees.flatMap(x => Object.entries(x));

                let output = [];
                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = this.dataAfterAggregate(groupDataByAccountableEmployees);

                //tách data vẽ biểu đồ cột, đường với biểu dồ tròn
                let separateDataChart = this.separateDataChart(output);
                pieChartData = separateDataChart.pieChartData;
                barLineChartData = separateDataChart.barLineChartData;

                if (pieChartData && pieChartData.length > 0) {
                    // convert Data pieChart c3js
                    pieDataConvert = this.convertDataPieChartOneWay(pieChartData);
                }
            }
        }

        /**
          * Convert data, gom nhóm theo người phê duyệt và thời gian, tính tổng/ trung bình cộng các trường thông tin.
          * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của người phê duyệt và thời gian có ở trong mảng dataForAxisXInChart hay không.
          * nếu id = 1 chiều thời gian, id = 3 là chiều người phê duyệt, id=3 nằm ở vị trí 0 trong mảng dataForAxisXInChart thì gom nhóm trước
       */
        else if (dataForAxisXInChart.indexOf(1) === 1 && dataForAxisXInChart.indexOf(3) === 0) {
            if (newlistTaskEvaluation) {
                // Gọi hàm separateAccountableEmployees tách người phê duyệt
                let results = this.separateAccountableEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByAccountableEmployees nhóm công việc theo người phê duyệt
                let groupDataByAccountableEmployees = this.groupByAccountableEmployees(results);

                // Sau khi gom nhóm theo người phê duyệt thì tiếp tục gom nhóm theo thời gian
                let groupDataByDate = Object.entries(groupDataByAccountableEmployees).map(([time, datapoints]) => {
                    return datapoints.reduce((gr, item) => {
                        let res = item.time;
                        gr[[time] + ` ` + `(${res})`] = [...gr[[time] + ` ` + `(${res})`] || [], item];
                        return gr;
                    }, []);
                });

                // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
                groupDataByDate = groupDataByDate.flatMap(x => Object.entries(x));

                let output = [];
                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = this.dataAfterAggregate(groupDataByDate);

                //tách data vẽ biểu đồ cột, đường với biểu dồ tròn
                let separateDataChart = this.separateDataChart(output);
                pieChartData = separateDataChart.pieChartData;
                barLineChartData = separateDataChart.barLineChartData;

                if (pieChartData && pieChartData.length > 0) {
                    // convert Data pieChart dạng c3js
                    pieDataConvert = this.convertDataPieChartOneWay(pieChartData);
                }
            }
        }



        return (
            <React.Fragment>
                <DialogModal
                    modalID="modal-view-taskreport" isLoading={false}
                    formID="form-view-tasktemplate"
                    title="Xem chi tiết báo cáo"
                    hasSaveButton={true}
                    func={this.save}
                    size={100}
                    hasNote={false}
                >
                    {/* Modal Body */}

                    {
                        barLineChartData.length > 0 && <LineBarChart barLineChartData={barLineChartData} />
                    }

                    <div className="row">
                        {
                            pieDataConvert && pieDataConvert.map((item, index) => (
                                Object.entries(item).map(([code, data]) => (
                                    <div key={index} className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <div className="pieChart">
                                            <PieChart pieChartData={data} namePieChart={code} />
                                        </div>
                                    </div>
                                ))
                            ))
                        }
                    </div>

                    <div className="form-inline">
                        <button id="exportButton" className="btn btn-sm btn-success " style={{ marginBottom: '10px' }}><span className="fa fa-file-excel-o"></span> Export to Excel</button>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="box">
                                <div className="box-header">
                                    <div className="box-tools pull-right">
                                        <button className="btn btn-box-tool" data-widget="collapse"><i className="fa fa-minus"></i></button>
                                    </div>
                                </div>

                                <div className=" box-body">
                                    <table className="table table-hover table-striped table-bordered" id="report_manager" style={{ marginBottom: '0px !important' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'center' }}>Công việc</th>
                                                <th style={{ textAlign: 'center' }}>Người thực hiện</th>
                                                <th style={{ textAlign: 'center' }}>Người phê duyệt</th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Điểm hệ thống tự tính
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Ngày bắt đầu
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Ngày kết thúc
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Ngày đánh giá
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Mức độ ưu tiên
                                                </th>
                                                <th style={{ textAlign: 'center' }}>
                                                    Trạng thái công việc
                                                </th>
                                                {
                                                    headTable && headTable.map((x, key) => (<th key={key}>{x}</th>))
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                tasks.listTaskEvaluations && tasks.listTaskEvaluations.map((item, key) => {
                                                    //Lấy tên người thực hiện 
                                                    let getNameResponsibleEmployees = item.responsibleEmployees.map(x1 => x1.name);

                                                    //Lấy tên người phê duyệt
                                                    let getNameAccountableEmployees = item.accountableEmployees.map(x2 => x2.name);

                                                    // lấy điểm tự động của các công việc
                                                    let result = item.results, point = [];
                                                    if (result) {
                                                        result = result[0];
                                                        point = result.automaticPoint;
                                                    }

                                                    let contentTable = [];
                                                    if (headTable) {
                                                        item.taskInformations.forEach(element => {
                                                            if (element.type === 'Number') {
                                                                contentTable = [...contentTable, element.value]
                                                            }
                                                        })
                                                    }
                                                    return (
                                                        <tr key={key}>
                                                            <td className="text-center" className="text-center">{item.name}</td>
                                                            <td className="text-center">
                                                                {
                                                                    getNameResponsibleEmployees.join(', ')
                                                                }
                                                            </td>
                                                            <td className="text-center">
                                                                {
                                                                    getNameAccountableEmployees.join(', ')
                                                                }
                                                            </td>
                                                            <td className="text-center">
                                                                {
                                                                    point
                                                                }
                                                            </td>
                                                            <td className="text-center">{item.startDate.slice(0, 10)}</td>
                                                            <td className="text-center">{item.endDate.slice(0, 10)}</td>
                                                            <td className="text-center">{item.date.slice(0, 10)}</td>
                                                            <td className="text-center">
                                                                {
                                                                    item.priority === 1 ? 'Thấp' : (item.priority === 2 ? 'Trung bình' : 'Cao')
                                                                }
                                                            </td>
                                                            <td className="text-center">{item.status}</td>
                                                            {
                                                                contentTable && contentTable.map((x, index) => (<td key={index}>{formater.format(parseInt(x))} VNĐ</td>))
                                                            }
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                {reports.isLoading ?
                                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                                    tasks.listTaskEvaluations && tasks.listTaskEvaluations.length === 0 && <div className="table-info-panel" style={{ width: '100%' }}>{translate('confirm.no_data')}</div>}
                            </div>
                        </div>
                    </div>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks, reports } = state;
    return { tasks, reports };
}

const actionCreators = {
    createTaskReport: TaskReportActions.createTaskReport,
    getTaskEvaluations: taskManagementActions.getTaskEvaluations,
}

const viewForm = connect(mapState, actionCreators)(withTranslate(TaskReportViewForm));

export { viewForm as TaskReportViewForm };