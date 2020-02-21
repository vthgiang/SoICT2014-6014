import React, { Component } from 'react';
class ModalEditBHXH extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index:this.props.index,
            unit: this.props.data.unit,
            position:  this.props.data.position,
            startDate:this.props.data.startDate,
            endDate: this.props.data.endDate,
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
        window.$(`#modal-editNewBHXH-${this.props.index}`).modal("hide");
    }
    render() {
        return (
            <div style={{ display: "inline" }}>
            <a href={`#modal-editNewBHXH-${this.props.index}`} className="edit" title="Thông tin quá trình đóng bảo hiểm xã hội" data-toggle="modal"><i className="material-icons"></i></a>
            <div className="modal fade" id={`modal-editNewBHXH-${this.props.index}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới quá trình đóng BHXH:</h4>
                        </div>
                        <div className="modal-body">
                            <div className="col-md-12">
                                <div className="checkbox" style={{ marginTop: 0 }}>
                                    <label style={{ paddingLeft: 0 }}>
                                        (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="unit">Đơn vị công tác:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="unit" defaultValue={this.state.unit} onChange={this.handleChange} autoComplete="off" />
                                </div>
                                
                                <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                    <label htmlFor="startDate">Từ tháng/năm:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control employeedatepicker" defaultValue={this.state.startDate} name="startDate" ref="startDate" autoComplete="off" data-date-format="mm-yyyy" placeholder="mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                    <label htmlFor="endDate">Đến tháng/năm:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control employeedatepicker" defaultValue={this.state.endDate} name="endDate" ref="endDate" autoComplete="off" data-date-format="mm-yyyy" placeholder="mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="position">chức vụ:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="position" defaultValue={this.state.position} onChange={this.handleChange} autoComplete="off" />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={()=>this.handleSubmit()} title="Lưu thay đổi" >Lưu lại</button>
                        </div>
                    </div>
                </div >
            </div>
            </div>
        );
    }
};
export { ModalEditBHXH };
