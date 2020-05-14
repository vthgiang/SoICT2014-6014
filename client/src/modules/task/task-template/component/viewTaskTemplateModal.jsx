import React, { Component } from 'react';
import { connect } from 'react-redux';
import { taskTemplateActions } from '../redux/actions';
import { DialogModal } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';

class ModalViewTaskTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasktemplate: ""
        };
    }
    componentDidMount() {
        this.props.getTaskTemplate(this.props.id);
        this.handleResizeColumn();
    }
    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
    }
    render() {
        var template;
        const { tasktemplates } = this.props;
        const { translate } = this.props;
        if (tasktemplates.template) template = tasktemplates.template;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID="modal-view-tasktemplate" isLoading={false}
                    formID={`viewTaskTemplate${this.props.id}`}
                    title={template && template.info.name}
                    hasSaveButton={false}
                >

                    {/* Modal Body */}
                    <form className="form-horizontal">
                        <div className="row" >
                            <div className="col-sm-6" >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        Thông tin
                                    </div>
                                    <div className="box-body">
                                        <dl>
                                            <dt>{translate('task_template.unit')}</dt>
                                            <dd>{template && template.info.organizationalUnit.name}</dd>

                                            <dt>{translate('task_template.permission_view')}</dt>
                                            <dd>
                                                {template && <span>{template.info.readByEmployees[1]}</span>}
                                            </dd>

                                            {template && template.info.responsibleEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.performer')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {template.info.responsibleEmployees.map((item, index) => {
                                                                return <li key={index}>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </dd>
                                                </React.Fragment>
                                            }

                                            {template && template.info.accountableEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.approver')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {template.info.accountableEmployees.map((item, index) => {
                                                                return <li key={index}>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </dd>
                                                </React.Fragment>
                                            }

                                            {template && template.info.consultedEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.observer')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {template.info.consultedEmployees.map((item, index) => {
                                                                return <li key={index}>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </dd>
                                                </React.Fragment>
                                            }

                                            {template && template.info.informedEmployees.length > 0 &&
                                                <React.Fragment>
                                                    <dt>{translate('task_template.supporter')}</dt>
                                                    <dd>
                                                        <ul>
                                                            {template.info.informedEmployees.map((item, index) => {
                                                                return <li key={index}>{item.name}</li>
                                                            })}
                                                        </ul>
                                                    </dd>
                                                </React.Fragment>
                                            }
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6" >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        Công thức đánh giá
                                    </div>
                                    <div className="box-body">
                                        <dt>{translate('task_template.description')}</dt>
                                        <dd>{template && template.info.description}</dd>

                                        <dt>{translate('task_template.formula')}</dt>
                                        <dd>{template && template.info.formula}</dd>
                                        
                                        <dt>Tham số</dt>
                                        <dd>
                                            <span>D: Tổng số ngày thực hiện công việc (trừ CN)</span><br />
                                            <span>D0: Số ngày quá hạn</span><br />
                                            <span>A: Tổng số hoạt động</span><br />
                                            <span>AD: Tổng số lần duyệt "Chưa đạt" cho các hoạt động</span><br />
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="row">
                            <div className="col-sm-6" >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        {translate('task_template.activity_list')}
                                    </div>
                                    <div className="box-body">
                                        {
                                            (typeof template === 'undefined' || template.info.taskActions.length === 0) ? <p style={{ color: 'red', textAlign: 'left' }}>{translate('task_template.no_data')}</p> :
                                                template.info.taskActions.map((item, index) =>
                                                    <React.Fragment>
                                                        <dt style={{ textAlign: 'left' }} >{item.name} - {item.mandatory ? "" : "Không"} bắt buộc</dt>
                                                        <dd>{item.description}</dd>
                                                    </React.Fragment>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6" >
                                <div className="box box-solid description">
                                    <div className="box-header with-border">
                                        {translate('task_template.information_list')}
                                    </div>
                                    <div className="box-body">
                                        {
                                            (typeof template === 'undefined' || template.info.taskInformations.length === 0) ? <p style={{ color: 'red', textAlign: 'left' }}>{translate('task_template.no_data')}</p> :
                                                template.info.taskInformations.map((item, index) =>
                                                    <React.Fragment>
                                                        <dt>{item.name} - Kiểu {item.type} {item.filledByAccountableEmployeesOnly ? "- Chỉ quản lý được điền" : ""}</dt>
                                                        <dd>{item.description}</dd>
                                                    </React.Fragment>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasktemplates } = state;
    return { tasktemplates };
}

const actionCreators = {
    getTaskTemplate: taskTemplateActions.getTaskTemplateById,
};
const connectedModalViewTaskTemplate = connect(mapState, actionCreators)(withTranslate(ModalViewTaskTemplate));
export { connectedModalViewTaskTemplate as ModalViewTaskTemplate };