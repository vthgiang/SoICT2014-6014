import React, { Component } from 'react';

class ModalAddHoliday extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'lib/main/js/AddEmployee.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleCloseModal = () => {
        this.setState({
        });
        document.getElementById("formAddaddHoliday").reset();
        window.$(`#modal-addHoliday`).modal("hide");
    }

    handleSunmit = () => {
        document.getElementById("formAddaddHoliday").reset();
        window.$(`#modal-addHoliday`).modal("hide");
    }
    render() {
        return (
            <div className="modal fade" id="modal-addHoliday" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => this.handleCloseModal()} aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới lịch nghỉ:</h4>
                        </div>
                        <form id="formAddaddHoliday">
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
                                                <input type="text" style={{ height: 33 }} className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                            <label htmlFor="endDate">Ngày kết thúc:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" style={{ height: 33 }} className="form-control datepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="reason">Mô tả lịch nghỉ:<span className="required">&#42;</span></label>
                                            <textarea className="form-control" rows="3" style={{ height: 72 }} name="reason" onChange={this.handleChange}></textarea>
                                        </div>

                                    </div>
                                </div>
                                {/* /.box-body */}
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 45 }} type="button" className="btn btn-default pull-right" onClick={() => this.handleCloseModal()}>Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" title="Thêm mới lịch nghỉ" onClick={() => this.handleSunmit()} className="btn btn-success pull-right">Thêm mới</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        );
    }
};

export { ModalAddHoliday };