import React, { Component } from 'react';
class ModalAddCertificateShort extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameCertificateShort:""
        }
        this.handleChange= this.handleChange.bind(this)
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = 'main/js/AddEmployee.js';
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
    render() {
        return (
            <div className="modal fade" id="modal-addNewCertificateShort" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới chứng chỉ:</h4>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="checkbox" style={{ marginTop: 0 }}>
                                    <label style={{ paddingLeft: 0 }}>
                                        (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nameCertificateShort">Tên chứng chỉ:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="nameCertificateShort" onChange={this.handleChange} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="unit">Nơi cấp:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="unit" onChange={this.handleChange} autoComplete="off" />
                                </div>
                                <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                    <label htmlFor="startDate">Ngày cấp:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                    <label htmlFor="endDate">Ngày hết hạn:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control datepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="urlCertificateShort">Chọn file đính kèm:</label>
                                    <input type="file" className="form-control" name="urlCertificateShort" onChange={this.handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-success" title="Thêm mới đơn xin nghỉ" >Thêm mới</button>
                        </div>
                    </div>
                </div >
            </div>
        );
    }
};
export { ModalAddCertificateShort };
