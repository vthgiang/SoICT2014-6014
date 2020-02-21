import React, { Component } from 'react';
class ModalAddPraise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: "",
            unit: "",
            startDate: "",
            type: "",
            reason: "",
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
    handleSunmit = async () => {
        await this.setState({
            startDate: this.refs.startDate.value,
        })
        this.props.handleChange(this.state);
        this.setState({
            number: "",
            unit: "",
            type: "",
            reason: "",
        })
        window.$(`#modal-addPraise`).modal("hide");
    }
    render() {
        console.log(this.state);
        return (
            <div className="modal fade" id="modal-addPraise" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới khen thưởng:</h4>
                        </div>
                        <form>
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="number">Số quyết định:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="number" onChange={this.handleChange} autoComplete="off" placeholder="Số ra quyết định" />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="unit">Cấp ra quyết định:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="unit" onChange={this.handleChange} autoComplete="off" placeholder="Cấp ra quyết định" />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="startDate">Ngày ra quyết định:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="type">Hình thức khen thưởng:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="type" onChange={this.handleChange} autoComplete="off" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="reason">Thành tích (Lý do):<span className="required">&#42;</span></label>
                                        <textarea className="form-control" rows="3" name="reason" placeholder="Enter ..." onChange={this.handleChange}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                <button style={{ marginRight: 15 }} type="reset" className="btn btn-success" onClick={() => this.handleSunmit()} title="Thêm mới khen thưởng" >Thêm mới</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};

export { ModalAddPraise };