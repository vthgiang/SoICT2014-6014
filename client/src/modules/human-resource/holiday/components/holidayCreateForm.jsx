import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, ButtonModal, DatePicker, ErrorLabel } from '../../../../common-components';

import { HolidayActions } from '../redux/actions';
class HolidayCreateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: "",
            endDate: "",
            reason: ""
        };
    }

    handleChange = (e) => {
        const { value } = e.target;
        this.setState({
            reason: value
        })
    }

    handleStartDateChange = (value) => {
        this.setState({
            startDate: value
        })
    }
    handleEndDateChange = (value) => {
        this.setState({
            endDate: value
        })
    }
    save = () => {
        this.props.createNewHoliday(this.state);
    }
    render() {
        const { translate, holiday } = this.props;
        const { startDate, endDate, reason } = this.state;
        return (
            <React.Fragment>
                <ButtonModal modalID="modal-create-holiday" button_name="Thêm mới" title="Thêm mới lịch nghỉ" />
                <DialogModal
                    modalID="modal-create-holiday" isLoading={holiday.isLoading}
                    formID="form-create-holiday"
                    title="Thêm mới lịch nghỉ"
                    func={this.save}
                    disableSubmit={false}
                    size={50}
                    maxWidth={500}
                // disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id="form-create-holiday" >
                        <div className="row">
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Thời gian bắt đầu<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_start_date"
                                    value={startDate}
                                    onChange={this.handleStartDateChange}
                                />
                            </div>
                            <div className="form-group col-sm-6 col-xs-12">
                                <label>Thời gian kết thúc<span className="text-red">*</span></label>
                                <DatePicker
                                    id="create_end_date"
                                    value={endDate}
                                    onChange={this.handleEndDateChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="reason">Mô tả lịch nghỉ<span className="text-red">&#42;</span></label>
                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" value={reason} onChange={this.handleChange}></textarea>
                        </div>
                    </form>
                </DialogModal>
            </React.Fragment>



            // <div className="modal fade" id="modal-addHoliday" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            //     <div className="modal-dialog">
            //         <div className="modal-content">
            //             <div className="modal-header">
            //                 <button type="button" className="close" onClick={() => this.handleCloseModal()} aria-label="Close">
            //                     <span aria-hidden="true">×</span></button>
            //                 <h4 className="modal-title">Thêm mới lịch nghỉ:</h4>
            //             </div>
            //             <form id="formAddaddHoliday">
            //                 <div className="modal-body">
            //                     {/* /.box-header */}
            //                     <div className="box-body">
            //                         <div className="col-md-12">
            //                             <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
            //                                 <label htmlFor="startDate">Ngày bắt đầu:<span className="text-red">&#42;</span></label>
            //                                 <div className={'input-group date has-feedback'}>
            //                                     <div className="input-group-addon">
            //                                         <i className="fa fa-calendar" />
            //                                     </div>
            //                                     <input type="text" style={{ height: 33 }} className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
            //                                 </div>
            //                             </div>
            //                             <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
            //                                 <label htmlFor="endDate">Ngày kết thúc:<span className="text-red">&#42;</span></label>
            //                                 <div className={'input-group date has-feedback'}>
            //                                     <div className="input-group-addon">
            //                                         <i className="fa fa-calendar" />
            //                                     </div>
            //                                     <input type="text" style={{ height: 33 }} className="form-control datepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
            //                                 </div>
            //                             </div>
            //                             <div className="form-group">
            //                                 <label htmlFor="reason">Mô tả lịch nghỉ:<span className="text-red">&#42;</span></label>
            //                                 <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" ref="reason"></textarea>
            //                             </div>

            //                         </div>
            //                     </div>
            //                     {/* /.box-body */}
            //                 </div>
            //                 <div className="modal-footer">
            //                     <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleCloseModal()}>Đóng</button>
            //                     <button style={{ marginRight: 15 }} type="button" title="Thêm mới lịch nghỉ" onClick={() => this.handleSunmit()} className="btn btn-success pull-right">Thêm mới</button>
            //                 </div>
            //             </form>
            //         </div>
            //     </div>
            // </div >
        );
    }
};
function mapState(state) {
    const { holiday } = state;
    return { holiday };
};

const actionCreators = {
    createNewHoliday: HolidayActions.createNewHoliday,
};

const createForm = connect(mapState, actionCreators)(withTranslate(HolidayCreateForm));
export { createForm as HolidayCreateForm };