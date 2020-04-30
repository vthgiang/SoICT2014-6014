import React, { Component } from 'react';
import { connect } from 'react-redux';
import { taskTemplateActions } from '../redux/actions';
import { DialogModal } from '../../../../common-components';

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
    handleCloseModal = (id) => {
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        var modal = document.getElementById(`viewTaskTemplate${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
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
        if (tasktemplates.template) template = tasktemplates.template.info;
        return (
            <React.Fragment>
                <DialogModal
                    size='75' modalID={`viewTaskTemplate${this.props.id}`} isLoading={false}
                    formID="form-view-tasktemplate"
                    title={template && template.info.name}
                    // func={this.handleCloseModal(this.props.id)}
                    disableSubmit={false}
                >

                    {/* Modal Body */}
                    <form className="form-horizontal">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="row">
                                    <div className="col-xs-4">
                                        <div className='form-group' style={{ marginTop: "-15px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Đơn vị</label>
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
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người được xem </label>
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
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người thực hiện</label>
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
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người phê duyệt</label>
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
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người quan sát</label>
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
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Người hỗ trợ</label>
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
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Mô tả công việc</label>
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
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Công thức tính điểm</label>
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
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Danh sách hoạt động: </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="control-group" style={{ marginLeft: "15px" }}>
                                    {
                                        (typeof template === 'undefined' || template.actions.length === 0) ? <p style={{ color: 'red', textAlign: 'left' }}>Chưa có dữ liệu</p> :
                                            template.actions.map((item, index) =>
                                                <p style={{ textAlign: 'left' }} >{item.name} - {item.description} - {item.mandatary ? "Có" : "Không"} bắt buộc </p>
                                            )
                                    }
                                </div>
                            </div>
                            <div className="col-sm-6" style={{ marginTop: "15px" }}>
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className='form-group' style={{ marginTop: "5px" }}>
                                            <label className="col-sm-5 control-label" style={{ width: '100%', textAlign: 'left' }}>Danh sách thông tin: </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="control-group" style={{ marginLeft: "15px" }}>

                                    {
                                        (typeof template === 'undefined' || template.informations.length === 0) ? <p style={{ color: 'red', textAlign: 'left' }}>Chưa có dữ liệu</p> :
                                            template.informations.map((item, index) =>
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
const connectedModalViewTaskTemplate = connect(mapState, actionCreators)(ModalViewTaskTemplate);
export { connectedModalViewTaskTemplate as ModalViewTaskTemplate };