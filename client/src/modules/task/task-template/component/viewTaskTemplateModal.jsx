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
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="row">
                                    <div className="col-xs-4">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.unit')}</label>
                                        </div>
                                    </div>
                                    <div className="col-xs-8" >
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <p className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{template && template.info.organizationalUnit.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-4">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.permission_view')} </label>
                                        </div>
                                    </div>
                                    <div className="col-xs-8">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            {template &&
                                                <p className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>
                                                    {template.info.readByEmployees[1]}
                                                </p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-4">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.performer')}</label>
                                        </div>
                                    </div>
                                    <div className="col-xs-8">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            {template &&
                                                <p className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>
                                                    {template.info.responsibleEmployees.map((item, index) => {
                                                        return <p key={index}>{item.name}</p>
                                                    })}
                                                </p>}
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-xs-4">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.approver')}</label>
                                        </div>
                                    </div>
                                    <div className="col-xs-8">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            {template &&
                                                <p className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>
                                                    {template.info.accountableEmployees.map((item, index) => {
                                                        return <p key={index}>{item.name}</p>
                                                    })}
                                                </p>}
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-xs-4">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.observer')}</label>
                                        </div>
                                    </div>
                                    <div className="col-xs-8">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            {template &&
                                                <p className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>
                                                    {template.info.consultedEmployees.map((item, index) => {
                                                        return <p key={index}>{item.name}</p>
                                                    })}
                                                </p>}
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-xs-4">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.supporter')}</label>
                                        </div>
                                    </div>
                                    <div className="col-xs-8">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            {template &&
                                                <p className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>
                                                    {template.info.informedEmployees.map((item, index) => {
                                                        return <p key={index}>{item.name}</p>
                                                    })}
                                                </p>}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="row">
                                    <div className="col-xs-4">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.description')}</label>
                                        </div>
                                    </div>
                                    <div className="col-xs-8" >
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <p className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{template && template.info.description}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-4">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.formula')}</label>
                                        </div>
                                    </div>
                                    <div className="col-xs-8" >
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <p className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{template && template.info.formula}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ marginTop: "-15px", textAlign: "left" }} >
                                        <label className="col-sm-12" style={{ fontWeight: "400" }}>D: Tổng số ngày thực hiện công việc (trừ CN)</label><br />
                                        <label className="col-sm-12" style={{ fontWeight: "400" }}>D0: Số ngày quá hạn</label><br />
                                        <label className="col-sm-12" style={{ fontWeight: "400" }}>A: Tổng số hoạt động</label><br />
                                        <label className="col-sm-12" style={{ fontWeight: "400" }}>AD: Tổng số lần duyệt "Chưa đạt" cho các hoạt động</label><br />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6" style={{ marginTop: "15px" }}>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className='form-group' style={{ marginTop: "5px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.activity_list')} </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="control-group" style={{ marginLeft: "15px" }}>
                                    {
                                        (typeof template === 'undefined' || template.info.taskActions.length === 0) ? <p style={{ color: 'red', textAlign: 'left' }}>{translate('task_template.no_data')}</p> :
                                            template.info.taskActions.map((item, index) =>
                                                <p style={{ textAlign: 'left' }} >{item.name} - {item.description} - {item.mandatary ? "Có" : "Không"} bắt buộc </p>
                                            )
                                    }
                                </div>
                            </div>
                            <div className="col-sm-6" style={{ marginTop: "15px" }}>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className='form-group' style={{ marginTop: "5px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>{translate('task_template.information_list')} </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="control-group" style={{ marginLeft: "15px" }}>

                                    {
                                        (typeof template === 'undefined' || template.info.taskInformations.length === 0) ? <p style={{ color: 'red', textAlign: 'left' }}>{translate('task_template.no_data')}</p> :
                                            template.info.taskInformations.map((item, index) =>
                                                <p style={{ textAlign: 'left' }}>{item.name} - {item.description} - {item.type} - {item.mandatary ? "Chỉ quản lý được điền" : "Không bắt buộc chỉ quản lý được điền"}</p>
                                            )
                                    }
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
const connectedModalViewTaskTemplate = connect(mapState, actionCreators)( withTranslate(ModalViewTaskTemplate));
export { connectedModalViewTaskTemplate as ModalViewTaskTemplate };