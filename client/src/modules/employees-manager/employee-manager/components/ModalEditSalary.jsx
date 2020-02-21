import React, { Component } from 'react';
class ModalEditSalary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: this.props.index,
            unit: this.props.data.unit,
            mainSalary: this.props.data.mainSalary,
            bonus: this.props.data.bonus,
            month:this.props.data.month,
        };
        this.handleAddBonus = this.handleAddBonus.bind(this);
        this.handleChangeBonus = this.handleChangeBonus.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        let script = document.createElement('script');
        script.src = '/lib/main/js/CoCauToChuc.js';
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
    handleAddBonus(event) {
        var bonus = this.state.bonus;
        this.setState({
            bonus: [...bonus, { nameBonus: " ", number: "" }]
        })
    }
    handleChangeBonus(event) {
        var { name, value, className } = event.target;
        var { bonus } = this.state;
        bonus[className] = { ...bonus[className], [name]: value }
        this.setState({
            bonus: bonus
        })
    }
    delete = (index) => {
        var { bonus } = this.state;
        bonus.splice(index, 1);
        this.setState({
            bonus: bonus
        })
    };
    handleSunmit = async () => {
        await this.setState({
            month: this.refs.month.value,
        })
        this.props.handleChange(this.state);
        window.$(`#modal-editNewSalary-${this.props.index}`).modal("hide");
    }
    render() {
        return (
            <div style={{ display: "inline" }}>
                <a href={`#modal-editNewSalary-${this.props.index}`} title="Thông tin tăng giảm lương lương" data-toggle="modal"><i className="material-icons">view_list</i></a>
                <div className="modal fade" id={`modal-editNewSalary-${this.props.index}`} tabIndex={-1} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span></button>
                                <h4 className="modal-title">Thông tin tăng giảm lương bảng lương:</h4>
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
                                            <label htmlFor="month">Tháng:<span className="required">&#42;</span></label>
                                            <div className={'input-group date has-feedback'}>
                                                <div className="input-group-addon">
                                                    <i className="fa fa-calendar" />
                                                </div>
                                                <input type="text" className="form-control" name="month" defaultValue={this.state.month} id="employeedatepicker4" ref="month" onChange={this.handleChange} data-date-format="mm-yyyy" disabled />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="mainSalary">Tiền lương chính:<span className="required">&#42;</span></label>
                                            <input style={{ display: "inline", width: "85%" }} type="number" defaultValue={this.state.mainSalary} className="form-control" name="mainSalary" onChange={this.handleChange} autoComplete="off" />
                                            <select name="unit" id="" className="form-control" defaultValue={this.state.unit} onChange={this.handleChange} style={{ height: 34, display: "inline", width: "15%" }}>
                                                <option value="VND">VND</option>
                                                <option value="USD">USD</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Các loại lương thưởng khác:<a href="#abc" title="Thêm lương thưởng khác"><i className="fa fa-plus" style={{ color: "#00a65a", marginLeft: 5 }} onClick={this.handleAddBonus} /></a></label>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Tên lương thưởng</th>
                                                        <th style={{ width: "30%" }}>Số tiền</th>
                                                        <th style={{ width: "16%" }}>Hành động</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(typeof this.state.bonus === 'undefined' || this.state.bonus.length === 0) ? <tr><td colSpan={3}><center> Không có lương thưởng khác</center></td></tr> :
                                                        this.state.bonus.map((x, index) => (
                                                            <tr key={index}>
                                                                <td><input className={index} type="text" value={x.nameBonus} name="nameBonus" style={{ width: "100%" }} onChange={this.handleChangeBonus} /></td>
                                                                <td><input className={index} type="number" value={x.number} name="number" style={{ width: "100%" }} onChange={this.handleChangeBonus} /></td>
                                                                <td style={{ textAlign: "center" }}>
                                                                    <a href="#abc" className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button style={{ marginRight: 15 }} type="button" className="btn btn-default pull-right" data-dismiss="modal">Đóng</button>
                                    <button style={{ marginRight: 15 }} type="reset" className="btn btn-success" onClick={() => this.handleSunmit()} title="Lưu thay đổi" >Lưu lại</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export { ModalEditSalary };