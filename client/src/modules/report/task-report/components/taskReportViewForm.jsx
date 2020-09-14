import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TaskReportActions } from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../common-components';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { LineBarChart } from './lineBarChart';
import { PieChart } from './pieChart';
import { chartFunction } from './chart';

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


    render() {
        const { tasks, reports, translate } = this.props;
        let formater = new Intl.NumberFormat();
        let listTaskEvaluations = tasks.listTaskEvaluations;
        let taskInfoName, headTable = [], frequency, newlistTaskEvaluation;
        /**
         * dataForAxisXInChart là mảng chứa chiều dữ liệu cho biểu đồ
         * 
         * id = 1 là chiều thời gian
         * 
         * id = 2 là chiều người thực hiện
         * 
         * id = 3 là chiều người phê duyệt
         */
        let dataForAxisXInChart = []

        // hiển thị trường thông tin hiện trong bảng báo cáo form preview view
        if (listTaskEvaluations && listTaskEvaluations.length > 0) {
            taskInfoName = listTaskEvaluations[0];
            taskInfoName.taskInformations.forEach(x => {
                if (x.type === "Number") {
                    headTable = [...headTable, x.name];
                }
            })
        }


        if (listTaskEvaluations) {
            // Lấy tần suất, Vì tần suất là chung cho các công việc nên chỉ cần lấy công việc đầu tiên
            let taskEvaluation = listTaskEvaluations[0];
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
            newlistTaskEvaluation = listTaskEvaluations.map(item => {
                return {
                    time: (frequency && frequency === 'month') ? chartFunction.convertMonthYear(item.date)
                        : (frequency === 'quarter' ? chartFunction.getQuarter(item.date) : chartFunction.convertYear(item.date)),
                    task: item.taskInformations.filter(task => {
                        if (task.type === 'Number')
                            return task;
                    }),
                    responsibleEmployees: item.responsibleEmployees.map(x => x.name),
                    accountableEmployees: item.accountableEmployees.map(x => x.name),
                }
            });

        }

        let output, pieChartData = [], barLineChartData = [], pieChartDataConvert, barAndLineDataChartConvert;

        if (newlistTaskEvaluation) {

            /**
             * Convert data, gom nhóm, tính tổng và tính trung bình cộng các trường thông tin.
             *  Nếu chọn trục hoành là thời gian dataForAxisXInChart = 1
             */
            if (dataForAxisXInChart.toString() === "1" && dataForAxisXInChart.length === 1 || dataForAxisXInChart.length === 0) {
                let groupDataByDate;

                // Gọi hàm groupByDate gom nhóm theo thời gian
                groupDataByDate = Object.entries(chartFunction.groupByDate(newlistTaskEvaluation, dataForAxisXInChart));

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByDate);
            }


            /**
             * Convert data, gom nhóm theo người thực hiện, tính trung bình cộng các trường thông tin.
             * Nếu trục hoành là người thực hiện dataForAxisXInChart = '2'
             */
            else if (dataForAxisXInChart.toString() === "2" && dataForAxisXInChart.length === 1) {
                let groupDataByResponsibleEmployees;

                // Gọi hàm separateResponsibleEmployees tách người thực hiện
                let results = chartFunction.separateResponsibleEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByResponsibleEmployees nhóm công việc theo người thực hiện
                groupDataByResponsibleEmployees = Object.entries(chartFunction.groupByResponsibleEmployees(results, dataForAxisXInChart)); // Dùng Object.entries convert thành mảng các phần tử có cặp key,value

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByResponsibleEmployees);

            }


            /**
             * Convert data, gom nhóm theo người phê duyệt, tính trung bình cộng các trường thông tin.
             * Nếu trục hoành là người phê duyệt dataForAxisXInChart = '3'
             */
            else if (dataForAxisXInChart.toString() === "3" && dataForAxisXInChart.length === 1) {
                let groupDataByAccountableEmployees;

                // Gọi hàm separateAccountableEmployees tách người phê duyệt
                let results = chartFunction.separateAccountableEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByAccountableEmployees nhóm công việc theo người phê duyệt
                groupDataByAccountableEmployees = Object.entries(chartFunction.groupByAccountableEmployees(results, dataForAxisXInChart));

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByAccountableEmployees);
            }

            /**
             * Convert data, gom nhóm theo thời gian và người thực hiện, tính trung bình cộng các trường thông tin.
             * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của chiều thời gian và người thực hiện có ở trong mảng dataForAxisXInChart hay không. 
             * nếu id = 1 chiều thời gian, id = 2 là chiều người thực hiện
             */
            else if (dataForAxisXInChart.indexOf(1) === 0 && dataForAxisXInChart.indexOf(2) === 1 && dataForAxisXInChart.length === 2) {
                // Gọi hàm separateResponsibleEmployees tách người thực hiện
                let results = chartFunction.separateResponsibleEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByDate nhóm công việc theo thời gian
                let groupDataByDate = chartFunction.groupByDate(results, dataForAxisXInChart);

                // Tiếp tục gom nhóm theo người thực hiện: thực hiện đính kèm ngày với tên người thực hiện
                let groupDataByResponsibleEmployees = chartFunction.groupByResponsibleEmployees(groupDataByDate, dataForAxisXInChart)

                // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
                groupDataByResponsibleEmployees = groupDataByResponsibleEmployees.flatMap(x => Object.entries(x));

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByResponsibleEmployees);
            }

            /**
             * Convert data, gom nhóm theo người thực hiện và thời gian, tính tổng/ trung bình cộng các trường thông tin.
             * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của chiều người thực hiện và thời gian có ở trong mảng dataForAxisXInChart hay không.
             * id = 2 là chiều người thực hiện, nếu id = 1 chiều thời gian
             */
            else if (dataForAxisXInChart.indexOf(1) === 1 && dataForAxisXInChart.indexOf(2) === 0 && dataForAxisXInChart.length === 2) {
                // Gọi hàm separateResponsibleEmployees tách người thực hiện
                let results = chartFunction.separateResponsibleEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByResponsibleEmployees nhóm công việc theo người thực hiện
                let groupDataByResponsibleEmployees = chartFunction.groupByResponsibleEmployees(results, dataForAxisXInChart);

                // Sau khi gom nhóm theo người thực hiện thì gom nhóm theo thời gian 
                let groupDataByDate = chartFunction.groupByDate(groupDataByResponsibleEmployees, dataForAxisXInChart)

                // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
                groupDataByDate = groupDataByDate.flatMap(x => Object.entries(x));

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByDate);
            }


            /**
             * Convert data, gom nhóm theo thời gian và người phê duyệt, tính tổng/ trung bình cộng các trường thông tin.
             * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của thời gian và người phê duyệt có ở trong mảng dataForAxisXInChart hay không.
             * nếu id = 1 chiều thời gian, id = 3 là chiều người phê duyệt,
             */
            else if (dataForAxisXInChart.indexOf(1) === 0 && dataForAxisXInChart.indexOf(3) === 1 && dataForAxisXInChart.length === 2) {
                // Gọi hàm separateAccountableEmployees tách người phê duyệt
                let results = chartFunction.separateAccountableEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByDate nhóm công việc theo thời gian
                let groupDataByDate = chartFunction.groupByDate(results, dataForAxisXInChart);

                // Sau khi gom nhóm theo thời gian thì gom nhóm theo người phê duyệt
                let groupDataByAccountableEmployees = chartFunction.groupByAccountableEmployees(groupDataByDate, dataForAxisXInChart);

                // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
                groupDataByAccountableEmployees = groupDataByAccountableEmployees.flatMap(x => Object.entries(x));

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByAccountableEmployees);
            }


            /**
             * Convert data, gom nhóm theo người phê duyệt và thời gian, tính tổng/ trung bình cộng các trường thông tin.
             * dataForAxisXInChart là mảng chứa id chiều dữ liệu, kiểm tra id của người phê duyệt và thời gian có ở trong mảng dataForAxisXInChart hay không.
             * nếu id = 1 chiều thời gian, id = 3 là chiều người phê duyệt, id=3 nằm ở vị trí 0 trong mảng dataForAxisXInChart thì gom nhóm trước
             */
            else if (dataForAxisXInChart.indexOf(1) === 1 && dataForAxisXInChart.indexOf(3) === 0 && dataForAxisXInChart.length === 2) {
                // Gọi hàm separateAccountableEmployees tách người phê duyệt
                let results = chartFunction.separateAccountableEmployees(newlistTaskEvaluation);

                // Gọi hàm groupByAccountableEmployees nhóm công việc theo người phê duyệt
                let groupDataByAccountableEmployees = chartFunction.groupByAccountableEmployees(results, dataForAxisXInChart);

                // Sau khi gom nhóm theo người phê duyệt thì tiếp tục gom nhóm theo thời gian
                let groupDataByDate = chartFunction.groupByDate(groupDataByAccountableEmployees, dataForAxisXInChart)

                // Convert đầu ra các phân tử trong mảng cùng cấp và có cặp key, value
                groupDataByDate = groupDataByDate.flatMap(x => Object.entries(x));

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByDate);
            }

            // Người thực hiện -> Người phê duyệt
            else if (dataForAxisXInChart.indexOf(2) === 0 && dataForAxisXInChart.indexOf(3) === 1 && dataForAxisXInChart.length === 2) {
                // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluation);

                // Nhóm công việc theo người thực hiện
                let groupDataByResponsibleEmployees = chartFunction.groupByResponsibleEmployees(results, dataForAxisXInChart);

                // Nhóm công việc theo người phê duyệt
                let groupDataByAccountableEmployees = chartFunction.groupByAccountableEmployees(groupDataByResponsibleEmployees, dataForAxisXInChart);

                groupDataByAccountableEmployees = groupDataByAccountableEmployees.flatMap(x => Object.entries(x));

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByAccountableEmployees);
            }

            // Người phê duyệt -> Người thực hiện
            else if (dataForAxisXInChart.indexOf(3) === 0 && dataForAxisXInChart.indexOf(2) === 1 && dataForAxisXInChart.length === 2) {
                // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluation);

                // Nhóm công việc theo người phê duyệt
                let groupDataByAccountableEmployees = chartFunction.groupByAccountableEmployees(results, dataForAxisXInChart);

                // Nhóm công việc theo Người thực hiện
                let groupDataByResponsibleEmployees = chartFunction.groupByResponsibleEmployees(groupDataByAccountableEmployees, dataForAxisXInChart);

                groupDataByResponsibleEmployees = groupDataByResponsibleEmployees.flatMap(x => Object.entries(x));

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByResponsibleEmployees);
            }

            // Time -> Người thực hiện -> người phê duyệt
            else if (dataForAxisXInChart.indexOf(1) === 0 && dataForAxisXInChart.indexOf(2) === 1 && dataForAxisXInChart.indexOf(3) === 2 && dataForAxisXInChart.length === 3) {
                // Danh sách người thực hiện và người thực hiện từ server trả về là mảng nên tách ra 
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluation);

                // Gom nhóm công việc theo thời gian
                let groupDataByDate = chartFunction.groupByDate(results, dataForAxisXInChart);

                // Sau đó gom nhóm theo người thực hiện
                let groupDataByResponsibleEmployees = chartFunction.groupByResponsibleEmployees(groupDataByDate, dataForAxisXInChart);

                // Sau đó gom nhóm theo người phê duyệt
                let groupByAccountableEmployees = chartFunction.groupByAccountableEmployees(groupDataByResponsibleEmployees, dataForAxisXInChart);

                // groupByAccountableEmployees đang là mảng 3 cấp-> convert 1 array câp
                groupByAccountableEmployees = chartFunction.convertArray3dTo1d(groupByAccountableEmployees);

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupByAccountableEmployees);
            }

            // Time -> Người phê duyệt -> người thực hiện
            else if (dataForAxisXInChart.indexOf(1) === 0 && dataForAxisXInChart.indexOf(3) === 1 && dataForAxisXInChart.indexOf(2) === 2 && dataForAxisXInChart.length === 3) {
                // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluation);

                // Gom nhóm công việc theo thời gian
                let groupDataByDate = chartFunction.groupByDate(results, dataForAxisXInChart);

                // Sau đó gom nhóm theo người phê duyệt
                let groupDataByAccountableEmployees = chartFunction.groupByAccountableEmployees(groupDataByDate, dataForAxisXInChart);

                // Sau đó gom nhóm theo người thực hiện
                let groupDataByResponsibleEmployees = chartFunction.groupByResponsibleEmployees(groupDataByAccountableEmployees, dataForAxisXInChart);

                groupDataByResponsibleEmployees = chartFunction.convertArray3dTo1d(groupDataByResponsibleEmployees);

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByResponsibleEmployees);
            }

            // Người thực hiện -> time -> người phê duyệt
            else if (dataForAxisXInChart.indexOf(2) === 0 && dataForAxisXInChart.indexOf(1) === 1 && dataForAxisXInChart.indexOf(3) === 2 && dataForAxisXInChart.length === 3) {
                // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluation);

                // Nhóm công việc theo người thực hiện
                let groupDataByResponsibleEmployees = chartFunction.groupByResponsibleEmployees(results, dataForAxisXInChart);

                // Sau đó gom nhóm công việc theo thời gian
                let groupDataByDate = chartFunction.groupByDate(groupDataByResponsibleEmployees, dataForAxisXInChart);

                // Sau đó gom nhóm công việc theo người phê duyệt
                let groupDataByAccountableEmployees = chartFunction.groupByAccountableEmployees(groupDataByDate, dataForAxisXInChart);

                groupDataByAccountableEmployees = chartFunction.convertArray3dTo1d(groupDataByAccountableEmployees);

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByAccountableEmployees);
            }

            // người thực hiện -> Người phê duyệt -> time
            else if (dataForAxisXInChart.indexOf(2) === 0 && dataForAxisXInChart.indexOf(3) === 1 && dataForAxisXInChart.indexOf(1) === 2 && dataForAxisXInChart.length === 3) {
                // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluation);

                // Nhóm công việc theo người thực hiện
                let groupDataByResponsibleEmployees = chartFunction.groupByResponsibleEmployees(results, dataForAxisXInChart);

                // Sau đó gom nhóm công việc theo người phê duyệt
                let groupDataByAccountableEmployees = chartFunction.groupByAccountableEmployees(groupDataByResponsibleEmployees, dataForAxisXInChart);

                // Sau đó gom nhóm công việc theo thời gian
                let groupDataByDate = chartFunction.groupByDate(groupDataByAccountableEmployees, dataForAxisXInChart);

                // Convert thành mảng 1 cấp
                groupDataByDate = chartFunction.convertArray3dTo1d(groupDataByDate);

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByDate);
            }


            // Người phê duyệt -> time -> người thực hiện
            else if (dataForAxisXInChart.indexOf(3) === 0 && dataForAxisXInChart.indexOf(1) === 1 && dataForAxisXInChart.indexOf(2) === 2 && dataForAxisXInChart.length === 3) {
                // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluation);

                // Gom nhóm công việc theo người phê duyệt
                let groupDataByAccountableEmployees = chartFunction.groupByAccountableEmployees(results, dataForAxisXInChart);

                // Sau đó gom nhóm công việc theo thời gian
                let groupDataByDate = chartFunction.groupByDate(groupDataByAccountableEmployees, dataForAxisXInChart);

                // Nhóm công việc theo người thực hiện
                let groupDataByResponsibleEmployees = chartFunction.groupByResponsibleEmployees(groupDataByDate, dataForAxisXInChart);

                groupDataByResponsibleEmployees = chartFunction.convertArray3dTo1d(groupDataByResponsibleEmployees);

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByResponsibleEmployees);
            }

            // Người phê duyệt -> Người thực hiện -> time 
            else if (dataForAxisXInChart.indexOf(3) === 0 && dataForAxisXInChart.indexOf(2) === 1 && dataForAxisXInChart.indexOf(1) === 2 && dataForAxisXInChart.length === 3) {
                // Danh sách người thực hiện và người phê duyệt từ server trả về là mảng nên tách ra 
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluation);

                // Gom nhóm công việc theo người phê duyệt
                let groupDataByAccountableEmployees = chartFunction.groupByAccountableEmployees(results, dataForAxisXInChart);

                // Nhóm công việc theo người thực hiện
                let groupDataByResponsibleEmployees = chartFunction.groupByResponsibleEmployees(groupDataByAccountableEmployees, dataForAxisXInChart);

                // Sau đó gom nhóm công việc theo thời gian
                let groupDataByDate = chartFunction.groupByDate(groupDataByResponsibleEmployees, dataForAxisXInChart);

                groupDataByDate = chartFunction.convertArray3dTo1d(groupDataByDate);

                // Tính tổng/Trung bình cộng, xử lý tên mới, và showInreport các trường thông tin theo tùy chọn của người dùng
                output = chartFunction.dataAfterAggregate(groupDataByDate);
            }
        }


        if (output) {
            console.log('output', output)
            // tách data vẽ biểu đồ:  cột với đường ra riêng, tròn ra riêng
            let separateDataChart = chartFunction.separateDataChart(output); // gọi hàm tách data
            pieChartData = separateDataChart.pieChartData; // Dữ liệu vẽ biểu đồ tròn
            barLineChartData = separateDataChart.barLineChartData; // Dữ liệu vẽ biểu đồ cột và đường

            // convert Data pieChart sang dạng C3js
            if (pieChartData && pieChartData.length > 0) {
                pieChartDataConvert = chartFunction.convertDataPieChart(pieChartData);
            }

            // Convert Data vẽ biểu đồ cột và đường dạng c3js
            if (barLineChartData && barLineChartData.length > 0) {
                barAndLineDataChartConvert = chartFunction.convertDataBarAndLineChart(barLineChartData);
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

                    {/* Biểu đồ đường và cột */}
                    {
                        barAndLineDataChartConvert && <LineBarChart barLineChartData={barAndLineDataChartConvert} />
                    }

                    {/* Biểu đồ tròn  */}
                    <div className="row">
                        {
                            pieChartDataConvert && pieChartDataConvert.map((item, index) => (
                                Object.entries(item).map(([code, data]) => {
                                    if (data.length > 6) {
                                        return (
                                            <div key={index} className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                                <div className="pieChart">
                                                    <PieChart pieChartData={data} namePieChart={code} />
                                                </div>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={index} className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                                <div className="pieChart">
                                                    <PieChart pieChartData={data} namePieChart={code} />
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            ))
                        }
                    </div>

                    {/* Button xuất excell */}
                    <div className="form-inline">
                        <button id="exportButton" className="btn btn-sm btn-success " style={{ marginBottom: '10px' }}><span className="fa fa-file-excel-o"></span> Export to Excel</button>
                    </div>

                    {/* form hiển thị thông tin danh sách công việc được đưa vào biểu đồ */}
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
                                                listTaskEvaluations && listTaskEvaluations.map((item, key) => {
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
                                    listTaskEvaluations && listTaskEvaluations.length === 0 && <div className="table-info-panel" style={{ width: '100%' }}>{translate('confirm.no_data')}</div>}
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