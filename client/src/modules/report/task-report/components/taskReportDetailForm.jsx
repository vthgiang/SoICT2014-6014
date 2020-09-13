import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { TaskReportActions } from '../redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { chartFunction } from './chart';
import { LineBarChart } from './lineBarChart';
import { PieChart } from './pieChart';

class TaskReportDetailForm extends Component {
    constructor(props) {
        super(props);
        this.DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, FINISHED: 3 };
        this.state = {
            dataStatus: this.DATA_STATUS.NOT_AVAILABLE,
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (props.taskReportId !== state.taskReportId) {
            props.getTaskReportById(props.taskReportId);
            return {
                ...state,
                dataStatus: 1, // 1 : QUERING
                taskReportId: props.taskReportId,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.state.dataStatus === this.DATA_STATUS.QUERYING && !nextProps.reports.isLoading) {
            // await this.props.getTaskReportById(nextProps.taskReportId);
            this.setState({
                dataStatus: this.DATA_STATUS.AVAILABLE,
            })
            return false;
        }

        if (this.state.dataStatus === this.DATA_STATUS.AVAILABLE) {
            let listTaskReport = nextProps.reports.listTaskReportById;
            this.setState({
                listTaskReport: listTaskReport,
                dataStatus: this.DATA_STATUS.FINISHED,
            });
            return false;
        }
        return true;
    }


    handleView = () => {
        let { listTaskReport } = this.state;
        if (listTaskReport) {
            let newData = {
                organizationalUnit: listTaskReport.organizationalUnit._id,
                nameTaskReport: listTaskReport.nameTaskReport,
                descriptionTaskReport: listTaskReport.descriptionTaskReport,
                startDate: (listTaskReport.startDate) ? listTaskReport.startDate.slice(0, 10) : '',
                endDate: (listTaskReport.endDate) ? listTaskReport.endDate.slice(0, 10) : '',
                frequency: listTaskReport.frequency,
                accountableEmployees: listTaskReport.accountableEmployees.map(x => x._id),
                responsibleEmployees: listTaskReport.responsibleEmployees.map(x => x._id),
                status: listTaskReport.status,
                taskTemplate: listTaskReport.taskTemplate._id,
                taskInformations: listTaskReport.configurations,
                itemListBoxRight: listTaskReport.dataForAxisXInChart,
            }

            this.props.getTaskEvaluations(newData);
            this.setState({
                chartStatus: true,
            })
        }
    }

    handleClose = () => {
        this.setState({
            chartStatus: false,
        })
    }

    render() {
        const { reports, tasks } = this.props;
        const { chartStatus } = this.state;
        let listTaskReportById = reports.listTaskReportById;
        let listTaskEvaluations = tasks.listTaskEvaluations;
        let frequency, newlistTaskEvaluations, dataForAxisXInChart = [];
        console.log('listTaskReportById', listTaskReportById)
        const mystyle = {
            display: "flex",
        };
        const styledt = {
            marginRight: '10px'
        };

        if (listTaskEvaluations) {
            // Lấy tần suất, vì tần suất là chung cho các công việc nên chỉ cần lấy công việc đầu tiên
            let taskEvaluation = listTaskEvaluations[0];
            frequency = taskEvaluation.frequency;

            // Lấy giá trị chọn chiều dữ liệu đưa vào biểu đồ
            dataForAxisXInChart = taskEvaluation.dataForAxisXInChart;
            if (dataForAxisXInChart.length > 0) {
                dataForAxisXInChart = dataForAxisXInChart.map(x => x.id);
            } else {
                // Trường hợp người dùng không chọn chiều dữ liệu, thì mặc định lấy chiều thời gian
                dataForAxisXInChart = dataForAxisXInChart;
            }

            // Lọc lấy các trường cần thiết cho việc config dữ liệu biểu đồ.
            newlistTaskEvaluations = listTaskEvaluations.map(item => {
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


        let output, pieChartData = [], barLineChartData = [], pieDataConvert, barAndLineDataChartConvert;
        if (newlistTaskEvaluations) {
            /**
              * Convert data, gom nhóm, tính tổng và tính trung bình cộng các trường thông tin.
              *  Nếu chọn trục hoành là thời gian dataForAxisXInChart = 1
              */
            if (dataForAxisXInChart.toString() === "1" && dataForAxisXInChart.length === 1 || dataForAxisXInChart.length === 0) {
                let groupDataByDate;

                // Gọi hàm groupByDate gom nhóm theo thời gian
                groupDataByDate = Object.entries(chartFunction.groupByDate(newlistTaskEvaluations, dataForAxisXInChart));

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
                let results = chartFunction.separateResponsibleEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateAccountableEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateResponsibleEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateResponsibleEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateAccountableEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateAccountableEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluations);

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
                let results = chartFunction.separateResponsibleEmployeesAndAccountableEmployees(newlistTaskEvaluations);

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
            // tách data vẽ biểu đồ:  cột với đường ra riêng, tròn ra riêng
            let separateDataChart = chartFunction.separateDataChart(output); // gọi hàm tách data
            pieChartData = separateDataChart.pieChartData; // Dữ liệu vẽ biểu đồ tròn
            barLineChartData = separateDataChart.barLineChartData; // Dữ liệu vẽ biểu đồ cột và đường

            // convert Data pieChart sang dạng C3js
            if (pieChartData && pieChartData.length > 0) {
                pieDataConvert = chartFunction.convertDataPieChart(pieChartData);
            }

            // Convert Data vẽ biểu đồ cột và đường dạng c3js
            if (barLineChartData && barLineChartData.length > 0) {
                barAndLineDataChartConvert = chartFunction.convertDataBarAndLineChart(barLineChartData);
            }
        }

        return (
            <DialogModal
                size='75' modalID="modal-detail-taskreport" isLoading={false}
                formID="modal-detail-taskreport"
                title="Xem chi tiết báo cáo"
                hasSaveButton={false}
                hasNote={false}
            >
                {/* <TaskReportViewForm /> */}
                {
                    chartStatus && barAndLineDataChartConvert && <LineBarChart barLineChartData={barAndLineDataChartConvert} />
                }

                {/* Biểu đồ tròn  */}
                <div className="row">
                    {
                        chartStatus && pieDataConvert && pieDataConvert.map((item, index) => (
                            Object.entries(item).map(([code, data]) => (
                                <div key={index} className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                    <div className="pieChart">
                                        <PieChart pieChartData={data} namePieChart={code} />
                                    </div>
                                </div>
                            ))
                        ))
                    }
                </div>

                {/* Nút xem biểu đồ */}
                <div className="row">
                    <div className="col-md-12 col-lg-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className="form-inline d-flex justify-content-end">
                            {
                                !chartStatus ?
                                    <button id="exportButton" className="btn btn-sm btn-success " title="Xem chi tiết" style={{ marginBottom: '6px' }} onClick={() => this.handleView()} ><span className="fa fa-fw fa-line-chart" style={{ color: 'rgb(66 65 64)', fontSize: '15px', marginRight: '5px' }}></span>Xem</button>
                                    :
                                    <button id="exportButton" className="btn btn-sm btn-success " title="Xem chi tiết" style={{ marginBottom: '6px' }} onClick={() => this.handleClose()} >Ẩn biểu đồ</button>
                            }
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="row row-equal-height" >
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ padding: 10 }}>
                        <div className="box box-solid description">
                            <div className="box-header with-border">
                                Thông tin cơ bản
                            </div>
                            <div className="box-body">

                                <div style={mystyle}>
                                    <dt style={styledt}>Đơn vị: </dt>
                                    <dd>{(listTaskReportById && listTaskReportById.organizationalUnit) ? listTaskReportById.organizationalUnit.name : ''}</dd>
                                </div>

                                <div style={mystyle}>
                                    <dt style={styledt}>Mẫu công việc:</dt>
                                    <dd>{listTaskReportById && listTaskReportById.taskTemplate.name}</dd>
                                </div>

                                <dt>Tên báo cáo</dt>
                                <dd>{listTaskReportById && listTaskReportById.name}</dd>


                                <dt>Mô tả</dt>
                                <dd>{listTaskReportById && listTaskReportById.description}</dd>

                                <div style={mystyle}>
                                    <dt style={styledt}>Đặc thù công việc: </dt>
                                    <dd>{listTaskReportById && (listTaskReportById.status === 0 ? 'Tất cả' : (listTaskReportById.status === 1 ? 'Đã hoàn thành' : 'Đang thực hiện'))}</dd>
                                </div>

                                <div style={mystyle}>
                                    <dt style={styledt}>Tần suất:</dt>
                                    <dd>{listTaskReportById && (listTaskReportById.frequency === 'month' ? 'Tháng' : (listTaskReportById.frequency === 'quarter' ? 'Quý' : 'Năm'))}</dd>
                                </div>

                                {listTaskReportById && listTaskReportById.responsibleEmployees &&
                                    <React.Fragment>
                                        <dt>Người thực hiện</dt>
                                        <dd>
                                            <ul>
                                                {listTaskReportById && listTaskReportById.responsibleEmployees.map((item, index) => {
                                                    return <li key={index}>{item.name}</li>
                                                })}
                                            </ul>
                                        </dd>
                                    </React.Fragment>
                                }
                                {listTaskReportById && listTaskReportById.accountableEmployees &&
                                    <React.Fragment>
                                        <dt>Người phê duyệt</dt>
                                        <dd>
                                            <ul>
                                                {listTaskReportById && listTaskReportById.accountableEmployees.map((item, index) => {
                                                    return <li key={index}>{item.name}</li>
                                                })}
                                            </ul>
                                        </dd>
                                    </React.Fragment>
                                }

                                {/* Người được xem */}
                                {listTaskReportById && listTaskReportById.readByEmployees &&
                                    <React.Fragment>
                                        <dt>Người được xem</dt>
                                        <dd>
                                            <ul>
                                                {listTaskReportById && listTaskReportById.readByEmployees.map((item, index) => {
                                                    return <li key={index}>{item.name}</li>
                                                })}
                                            </ul>
                                        </dd>
                                    </React.Fragment>
                                }

                                {/* Thống kê từ ngày */}
                                <dt>Thời gian thực hiện từ ngày</dt>
                                <dd>{listTaskReportById && listTaskReportById.startDate && listTaskReportById.startDate.slice(0, 10)}</dd>

                                {/* Thống kê đến ngày */}
                                <dt>Thời gian thực hiện đến ngày</dt>
                                <dd>{listTaskReportById && listTaskReportById.endDate && listTaskReportById.endDate.slice(0, 10)}</dd>

                                <dt>Chiều dữ liệu cho biểu đồ</dt>
                                <dd>{listTaskReportById && listTaskReportById.dataForAxisXInChart.map((x, index) => `${index + 1}. ${x.name} `)}</dd>
                            </div>
                        </div>
                    </div>

                    {/* form thông tin công việc theo mẫu */}
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ padding: 10 }} >
                        <div className="box box-solid description">
                            <div className="box-header with-border">
                                Điều kiện lọc
                                </div>
                            <div className="box-body">
                                {
                                    listTaskReportById && (!listTaskReportById.configurations || listTaskReportById.configurations.length === 0) ?
                                        <dt>Không có dữ liệu</dt> :
                                        listTaskReportById && listTaskReportById.configurations.map((item, index) =>
                                            <React.Fragment key={index}>
                                                <dt>{item.code} - {item.name} - {item.type}</dt>
                                                {
                                                    <React.Fragment>
                                                        <div style={mystyle}>
                                                            <dt style={styledt}> Điều kiện lọc:  </dt>
                                                            <dd>{item.filter}</dd>
                                                        </div>
                                                    </React.Fragment>
                                                }

                                                <React.Fragment>
                                                    <div style={mystyle}>
                                                        <dt style={styledt}> Hiển thị trong báo cáo: </dt>
                                                        <dd>{(item.showInReport) === true ? "Có" : "Không"}</dd>
                                                    </div>
                                                </React.Fragment>

                                                {
                                                    <React.Fragment>
                                                        <div style={mystyle}>
                                                            <dt style={styledt}> Tên mới: </dt>
                                                            <dd>{item.newName}</dd>
                                                        </div>
                                                    </React.Fragment>
                                                }

                                                {
                                                    <React.Fragment>
                                                        <div style={mystyle}>
                                                            <dt style={styledt}> Cách tính: </dt>
                                                            <dd>{(item.aggregationType === 0) ? "Trung bình cộng" : "Tổng"}</dd>
                                                        </div>
                                                    </React.Fragment>
                                                }

                                                {
                                                    <React.Fragment>
                                                        <div style={mystyle}>
                                                            <dt style={styledt}> Dạng biểu đồ: </dt>
                                                            <dd>{(item.chartType === 0) ? "Cột" : (item.chartType === 1 ? "Đường" : "Tròn")}</dd>
                                                        </div>
                                                    </React.Fragment>
                                                }
                                                <div style={{ marginBottom: '12px' }}></div>
                                            </React.Fragment>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </DialogModal>
        );
    }
}

function mapState(state) {
    const { tasks, reports } = state;
    return { tasks, reports };
}
const actionCreators = {
    getTaskReportById: TaskReportActions.getTaskReportById,
    getTaskEvaluations: taskManagementActions.getTaskEvaluations,
};
const detailReport = connect(mapState, actionCreators)(withTranslate(TaskReportDetailForm));

export { detailReport as TaskReportDetailForm };