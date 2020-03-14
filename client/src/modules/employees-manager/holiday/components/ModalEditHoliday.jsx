import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { HolidayActions } from '../redux/actions';
import { toast } from 'react-toastify';

class ModalEditHoliday extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }
    // function: notification the result of an action
    notifysuccess = (message) => toast(message);
    notifyerror = (message) => toast.error(message);
    notifywarning = (message) => toast.warning(message);

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('-');
    }
    handleCloseModal = () => {
        this.setState({
        });
        document.getElementById("formAddaddHoliday").reset();
        window.$(`#modal-addHoliday`).modal("hide");
    }
    handleSunmit = () => {
        var { translate } = this.props;
        if (this.refs.startDate.value === "") {
            this.notifyerror(translate('holiday.check_start_Date'));
        } else if (this.refs.endDate.value === "") {
            this.notifyerror(translate('holiday.check_end_Date'));
        } else if (this.refs.reason.value === "") {
            this.notifyerror(translate('holiday.check_description'));
        } else {
            var data = {
                startDate: this.refs.startDate.value,
                endDate: this.refs.endDate.value,
                reason: this.refs.reason.value
            }
            this.props.updateHoliday(this.props.data._id, data);
            window.$(`#modal-editHoliday-${this.props.data._id}`).modal("hide");
        }
    }
    render() {
        var { data, translate } = this.props;
        return (
            <React.Fragment>
                {(typeof data === 'undefined' || data.length === 0) ? <div></div> :
                    <div style={{ display: "inline" }}>
                        <a href={`#modal-editHoliday-${data._id}`} title="" data-toggle="modal"><i className="material-icons">view_list</i></a>
                        <div className="modal fade" id={`modal-editHoliday-${data._id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span></button>
                                        <h4 className="modal-title">Chỉnh sửa lịch nghỉ: 01/01/2019</h4>
                                    </div>
                                    <div className="modal-body">
                                        {/* /.box-header */}
                                        <div className="box-body">
                                            <div className="col-md-12">
                                                <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                                    <label htmlFor="startDate">Ngày bắt đầu:<span className="required">&#42;</span></label>
                                                    <div className={'input-group date has-feedback'}>
                                                        <div className="input-group-addon">
                                                            <i className="fa fa-calendar" />
                                                        </div>
                                                        <input type="text" style={{ height: 33 }} className="form-control datepicker" defaultValue={this.formatDate(data.startDate)} name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                                    </div>
                                                </div>
                                                <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                                    <label htmlFor="endDate">Ngày kết thúc:<span className="required">&#42;</span></label>
                                                    <div className={'input-group date has-feedback'}>
                                                        <div className="input-group-addon">
                                                            <i className="fa fa-calendar" />
                                                        </div>
                                                        <input type="text" style={{ height: 33 }} className="form-control datepicker" name="endDate" defaultValue={this.formatDate(data.endDate)} ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="reason">Mô tả lịch nghỉ:<span className="required">&#42;</span></label>
                                                    <textarea className="form-control" rows="3" style={{ height: 72 }} defaultValue={data.reason} name="reason" ref="reason"></textarea>
                                                </div>

                                            </div>
                                        </div>
                                        {/* /.box-body */}
                                    </div>
                                    <div className="modal-footer">
                                        <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                        <button style={{ marginRight: 15 }} type="button" title="Lưu lại các thay đổi" onClick={()=>this.handleSunmit()} className="btn btn-success pull-right">Lưu thay đổi</button>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div >
                }
            </React.Fragment>
        );
    }
};
function mapState(state) {
    const { holiday } = state;
    return { holiday };
};

const actionCreators = {
    updateHoliday: HolidayActions.updateHoliday,
};

const editHoliday = connect(mapState, actionCreators)(withTranslate(ModalEditHoliday));
export { editHoliday as ModalEditHoliday };