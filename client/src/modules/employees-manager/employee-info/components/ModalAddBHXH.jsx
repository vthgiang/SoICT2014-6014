import React, { Component } from 'react';
class ModalAddBHXH extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.handleChange = this.handleChange.bind(this)
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
    handleSubmit = async () => {
        await this.setState({
            startDate: this.refs.startDate.value,
            endDate: this.refs.endDate.value
        })
        this.props.handleChange(this.state);
        this.setState ({
            unit: "",
            position: "",
        })
        window.$(`#modal-addNewBHXH`).modal("hide");
    }
    render() {
        return (
            <div className="modal fade" id="modal-addNewBHXH" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới quá trình đóng BHXH:</h4>
                        </div>
                        <form>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="checkbox" style={{ marginTop: 0 }}>
                                    <label style={{ paddingLeft: 0 }}>
                                        (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="unit">Đơn vị công tác:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="unit" onChange={this.handleChange} autoComplete="off" />
                                </div>
                                
                                <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                    <label htmlFor="startDate">Từ tháng/năm:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control employeedatepicker" name="startDate" ref="startDate" autoComplete="off" data-date-format="mm-yyyy" placeholder="mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                    <label htmlFor="endDate">Đến tháng/năm:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control employeedatepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="mm-yyyy" placeholder="mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="position">chức vụ:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="position" onChange={this.handleChange} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="reset" className="btn btn-success" onClick={()=>this.handleSubmit()} title="Thêm mới đơn xin nghỉ" >Thêm mới</button>
                        </div>
                        </form>
                    </div>
                </div >
            </div>
        );
    }
};
export { ModalAddBHXH };
