import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../common-components';
import { TaskReportActions } from '../redux/actions';
import { TaskReportViewForm } from './taskReportViewForm';
class TaskReportDetailForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.taskReportId !== prevState.taskReportId) {
            return {
                ...prevState,
                taskReportId: nextProps.taskReportId,
            }
        } else {
            return null;
        }
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (nextProps.taskReportId !== this.state.taskReportId) {
            this.props.getTaskReportById(nextProps.taskReportId);
            return false;
        }
        return true;
    }
    handleView = () => {

    }
    render() {
        let formater = new Intl.NumberFormat();
        const { reports, translate } = this.props;
        let listTaskReportById = reports.listTaskReportById;
        return (
            <DialogModal
                size='75' modalID="modal-detail-taskreport" isLoading={false}
                formID="modal-detail-taskreport"
                title="Xem chi tiết báo cáo"
                hasSaveButton={false}
            >
                <TaskReportViewForm />
                <div className="row" >
                    <div className="col-md-12 col-lg-12" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className="form-inline d-flex justify-content-end">
                            <button id="exportButton" className="btn btn-sm btn-success " title="Xem chi tiết" style={{ marginBottom: '10px' }} onClick={() => this.handleView()} ><span className="fa fa-eye" style={{ color: '#4e4e4e' }}></span> Xem</button>
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

                                <dt>Đơn vị</dt>
                                <dd>{(listTaskReportById && listTaskReportById.organizationalUnit) ? listTaskReportById.organizationalUnit.name : ''}</dd>

                                <dt>Mẫu công việc</dt>
                                <dd>{listTaskReportById && listTaskReportById.taskTemplate && listTaskReportById.taskTemplate.name}</dd>

                                <dt>Tên báo cáo</dt>
                                <dd>{listTaskReportById && listTaskReportById.name}</dd>


                                <dt>Mô tả</dt>
                                <dd>{listTaskReportById && listTaskReportById.description}</dd>
                                <dt>Đặc thù công việc</dt>
                                <dd>{listTaskReportById && (listTaskReportById.status === 0 ? 'Tất cả' : (listTaskReportById.status === 1 ? 'Đã hoàn thành' : 'Đang thực hiện'))}</dd>
                                <dt>Tần suất</dt>
                                <dd>{listTaskReportById && (listTaskReportById.frequency === 'Month' ? 'Tháng' : (listTaskReportById.frequency === 'quarter' ? 'Quý' : 'Năm'))}</dd>
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
                                <dt>Thời gian thực hiện từ ngày</dt>
                                <dd>{listTaskReportById && listTaskReportById.startDate && listTaskReportById.startDate.slice(0, 10)}</dd>
                                <dt>Thời gian thực hiện đến ngày</dt>
                                <dd>{listTaskReportById && listTaskReportById.endDate && listTaskReportById.endDate.slice(0, 10)}</dd>

                            </div>
                        </div>
                    </div>

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
                                                    (item.filter) ?
                                                        <React.Fragment>
                                                            <div style={{ display: 'flex' }}>
                                                                <dt style={{ marginRight: '10px' }}> Điều kiện lọc:  </dt>
                                                                <dd>{item.filter}</dd>
                                                            </div>
                                                        </React.Fragment>
                                                        : null
                                                }
                                                {(item.showInReport) ?
                                                    <React.Fragment>
                                                        <div style={{ display: 'flex' }}>
                                                            <dt style={{ marginRight: '10px' }}> Hiển thị trong báo cáo: </dt>
                                                            <dd>{(item.showInReport) === true ? "Có" : "Không"}</dd>
                                                        </div>
                                                    </React.Fragment> : null

                                                }

                                                {
                                                    (item.newName) ?
                                                        <React.Fragment>
                                                            <div style={{ display: 'flex' }}>
                                                                <dt style={{ marginRight: '10px' }}> Tên mới: </dt>
                                                                <dd>{item.newName}</dd>
                                                            </div>

                                                        </React.Fragment>
                                                        : null
                                                }

                                                {
                                                    (typeof item.aggregationType === "number") ?
                                                        <React.Fragment>
                                                            <div style={{ display: 'flex' }}>
                                                                <dt style={{ marginRight: '10px' }}> Cách tính: </dt>
                                                                <dd>{(item.aggregationType === '0') ? "Trung bình cộng" : "Tổng"}</dd>
                                                            </div>
                                                        </React.Fragment> : <p>cách</p>

                                                }

                                                {
                                                    (typeof item.charType === "number") ?
                                                        <React.Fragment>
                                                            <div style={{ display: 'flex' }}>
                                                                <dt style={{ marginRight: '10px' }}> Dạng biểu đồ: </dt>
                                                                <dd>{(item.charType === '0') ? "Cột" : (item.charType === '1' ? "Đường" : "Tròn")}</dd>
                                                            </div>
                                                        </React.Fragment> : null
                                                }
                                                <hr style={{ borderTop: '1px solid #eae9f5 !important' }} />
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
    const { tasktemplates, tasks, reports, user } = state;
    return { tasktemplates, tasks, user, reports };
}
const actionCreators = {
    getTaskReportById: TaskReportActions.getTaskReportById,
};
const detailReport = connect(mapState, actionCreators)(withTranslate(TaskReportDetailForm));

export { detailReport as TaskReportDetailForm };