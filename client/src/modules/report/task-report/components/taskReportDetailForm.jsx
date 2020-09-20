import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { TaskReportActions } from '../redux/actions';
import { taskManagementActions } from '../../../task/task-management/redux/actions';
import { chartFunction } from './chart';
import { LineBarChartDetailForm } from './lineBarChartDetailForm';
import { PieChartDetailForm } from './pieChartDetailForm';

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


    handleViewChart = async () => {
        let { listTaskReport } = this.state;
        let { taskReportId } = this.props;
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

            await this.props.getTaskEvaluations(newData);
            this.setState({
                idLineBarChart: `detail-lineBarChart-${taskReportId}`,
                idPieChart: `detail-pieChart-${taskReportId}`,
            })
        }
    }

    handleClose = () => {
        this.setState({
        })
    }

    render() {
        const { reports, tasks } = this.props;
        const { idLineBarChart, idPieChart, taskReportId } = this.state;
        let listTaskReportById = reports.listTaskReportById;
        let listTaskEvaluations = tasks.listTaskEvaluations;
        let newlistTaskEvaluations, dataForAxisXInChart = [], results, output, pieChartDataConvert, barAndLineDataChartConvert;

        const mystyle = {
            display: "flex",
        };
        const styledt = {
            marginRight: '10px'
        };

        if (listTaskEvaluations && listTaskEvaluations.length > 0) {
            // Lọc lấy các trường cần thiết cho việc config dữ liệu biểu đồ.
            results = chartFunction.filterFieldInListTask(listTaskEvaluations);

            // Dữ liệu sau khi lọc
            newlistTaskEvaluations = results.newlistTaskEvaluations;

            // Chiều dữ liệu
            dataForAxisXInChart = results.dataForAxisXInChart;

            // Hàm này cho ra dạng data vẽ chart: bar, line, pie
            output = chartFunction.exportDataChart(newlistTaskEvaluations, dataForAxisXInChart);

            // data vẽ pie chart 
            pieChartDataConvert = output.pieChartDataConvert;

            //  data vẽ bar và line chart
            barAndLineDataChartConvert = output.barAndLineDataChartConvert;
        }

        return (
            <DialogModal
                size='75' modalID="modal-detail-taskreport" isLoading={false}
                formID="modal-detail-taskreport"
                title="Xem chi tiết báo cáo"
                hasSaveButton={false}
                hasNote={false}
            >
                {
                    idLineBarChart && idLineBarChart === `detail-lineBarChart-${taskReportId}` && barAndLineDataChartConvert && <LineBarChartDetailForm id={idLineBarChart} barLineChartData={barAndLineDataChartConvert} dataForAxisXInChart={dataForAxisXInChart} />
                }

                {/* Biểu đồ tròn  */}
                <div className="row">
                    {
                        idPieChart && idPieChart === `detail-pieChart-${taskReportId}` && pieChartDataConvert && pieChartDataConvert.map((item, index) => (
                            Object.entries(item).map(([code, data]) => {
                                if (data.length > 9) {
                                    return (
                                        <div key={index} className="col-xs-12 col-sm-12 col-md-12 col-ld-12">
                                            <div className="pieChart">
                                                <PieChartDetailForm id={`${idPieChart}-${index}`} pieChartData={data} namePieChart={code} dataForAxisXInChart={dataForAxisXInChart} />
                                            </div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={index} className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                                            <div className="pieChart">
                                                <PieChartDetailForm id={`${idPieChart}-${index}`} pieChartData={data} namePieChart={code} dataForAxisXInChart={dataForAxisXInChart} />
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        ))
                    }
                </div>

                {/* Nút xem biểu đồ */}
                <div className="row">
                    <div className="col-md-12 col-lg-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className="form-inline d-flex justify-content-end">
                            <button id="exportButton" className="btn btn-sm btn-success " title="Xem biểu đồ" style={{ marginBottom: '6px' }} onClick={() => this.handleViewChart()} ><span className="fa fa-fw fa-line-chart" style={{ color: 'rgb(66 65 64)', fontSize: '15px', marginRight: '5px' }}></span></button>
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