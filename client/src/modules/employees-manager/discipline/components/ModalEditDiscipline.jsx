import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DisciplineActions } from '../redux/actions';
class ModalEditDiscipline extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.data._id,
            fullName: this.props.data.employee.fullName,
            employeeNumber: this.props.data.employee.employeeNumber,
            number: this.props.data.number,
            unit: this.props.data.unit,
            type: this.props.data.type,
            reason: this.props.data.reason,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSunmit = this.handleSunmit.bind(this);
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
    handleSunmit(event) {
        var startDate = this.refs.startDate.value;
        var endDate = this.refs.endDate.value;
        this.props.updateDiscipline(this.state.id, { ...this.state, startDate, endDate });
        window.$(`#modal-viewDiscipline-${this.state.id}`).modal("hide");
    }
    render() {
        var data = this.state;
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-viewDiscipline-${data.id}`} title="Thông tin bảng lương" data-toggle="modal"><i className="material-icons">view_list</i></a>
                <div className="modal fade" id={`modal-viewDiscipline-${data.id}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Thông tin kỷ luật: {data.fullName + " - Số ra quyết định: " + data.number}</h4>
                            </div>
                            <div className="modal-body">
                                <div className="col-md-12">
                                    <div className="checkbox" style={{ marginTop: 0 }}>
                                        <label style={{ paddingLeft: 0 }}>
                                            (<span style={{ color: "red" }}>*</span>): là các trường bắt buộc phải nhập.
                                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="employeeNumber">Mã nhân viên:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" id="employeeNumber" name="employeeNumber" defaultValue={data.employeeNumber} disabled />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="number">Số quyết định:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" defaultValue={data.number} disabled />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="unit">Cấp ra quyết định:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="unit" defaultValue={data.unit} onChange={this.handleChange} />
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingLeft: 0 }}>
                                        <label htmlFor="startDate">Ngày có hiệu lực:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" style={{ height: 33 }} className="form-control datepicker" name="startDate" defaultValue={this.props.data.startDate} ref="startDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                        <label htmlFor="endDate">Ngày hết hiệu lực:<span className="required">&#42;</span></label>
                                        <div className={'input-group date has-feedback'}>
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar" />
                                            </div>
                                            <input type="text" style={{ height: 33 }} className="form-control datepicker" name="endDate" defaultValue={this.props.data.endDate} ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="type">Hình thức kỷ luật:<span className="required">&#42;</span></label>
                                        <input type="text" className="form-control" name="type" onChange={this.handleChange} defaultValue={data.type} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="reason">Lý do kỷ luật:<span className="required">&#42;</span></label>
                                        <textarea className="form-control" rows="3" style={{height:72}} name="reason" defaultValue={data.reason} onChange={this.handleChange}></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                <button style={{ marginRight: 15 }} type="button" className="btn btn-success" title="Lưu lại các thay đổi" onClick={this.handleSunmit} >Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
function mapState(state) {
    const { Discipline } = state;
    return { Discipline };
};

const actionCreators = {
    updateDiscipline: DisciplineActions.updateDiscipline,
};

const connectedEditDiscipline = connect(mapState, actionCreators)(ModalEditDiscipline);
export { connectedEditDiscipline as ModalEditDiscipline };