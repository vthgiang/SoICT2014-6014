import React, { Component } from 'react';
class ModalAddDiscipline extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleChange = this.handleChange.bind(this);
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
    handleSunmit = async () => {
        // await this.setState({
        //     startDate: this.refs.startDate.value,
        //     endDate:this.refs.endDate.value
        // })
        // this.props.createNewDiscipline(this.state);
        // window.$(`#modal-addNewDiscipline`).modal("hide");
    }
    render() {
        return (
            <div className="modal fade" id="modal-addNewDiscipline" tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span></button>
                            <h4 className="modal-title">Thêm mới kỷ luật:</h4>
                        </div>
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
                                    <label htmlFor="startDate">Ngày có hiệu lực:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control datepicker" name="startDate" ref="startDate" autoComplete="off"  data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy" />
                                    </div>
                                </div>
                                <div className="form-group col-md-6" style={{ paddingRight: 0 }}>
                                    <label htmlFor="endDate">Ngày hết hiệu lực:<span className="required">&#42;</span></label>
                                    <div className={'input-group date has-feedback'}>
                                        <div className="input-group-addon">
                                            <i className="fa fa-calendar" />
                                        </div>
                                        <input type="text" className="form-control datepicker" name="endDate" ref="endDate" autoComplete="off" data-date-format="dd-mm-yyyy" placeholder="dd-mm-yyyy"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type">Hình thức kỷ luật:<span className="required">&#42;</span></label>
                                    <input type="text" className="form-control" name="type" onChange={this.handleChange} autoComplete="off" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="reason">Lý do kỷ luật:<span className="required">&#42;</span></label>
                                    <textarea className="form-control" rows="3" name="reason" placeholder="Enter ..." onChange={this.handleChange}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                            <button style={{ marginRight: 15 }} type="button" className="btn btn-success" onClick={() => this.handleSunmit()} title="Thêm mới kỷ luật" >Thêm mới</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export { ModalAddDiscipline };