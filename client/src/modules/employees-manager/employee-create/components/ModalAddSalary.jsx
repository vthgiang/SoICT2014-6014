import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ModalDialog, ErrorLabel, DatePicker, ModalButton } from '../../../../common-components';
import { SalaryFormValidator } from '../../salary-employee/components/CombineContent';
class ModalAddSalary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unit: "VND",
            month: this.formatDate(Date.now()),
            mainSalary: "",
            bonus: [],
        };
    }
    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        return [month, year].join('-');
    }
    // Function bắt sự kiện thay đổi tháng lương để lưu vào state
    handleMonthChange = (value) => {
        this.validateMonthSalary(value, true);
    }
    // Function kiem tra tiền lương chính nhập vào có hợp lệ không
    validateMonthSalary = (value, willUpdateState = true) => {
        let msg = SalaryFormValidator.validateMonthSalary(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnMonthSalary: msg,
                    month: value,
                }
            });
        }
        return msg === undefined;
    }

    // Function bắt sự kiện thay đổi tiền lương chính
    handleMainSalaryChange = (e) => {
        let value = e.target.value;
        this.validateMainSalary(value, true);
    }
    // Function kiem tra tiền lương chính nhập vào có hợp lệ không
    validateMainSalary = (value, willUpdateState = true) => {
        let msg = SalaryFormValidator.validateMainSalary(value, this.props.translate);
        if (willUpdateState) {
            this.setState(state => {
                return {
                    ...state,
                    errorOnMainSalary: msg,
                    mainSalary: value,
                }
            });
        }
        return msg === undefined;
    }


    // Function bắt sự kiện thay đổi đơn vị tiền lương
    handleChange = (e) => {
        let value = e.target.value;
        this.setState({
            unit: value
        });
    }

    // Bắt sự kiện click thêm lương thưởng khác
    handleAddBonus = () => {
        var bonus = this.state.bonus;
        if (bonus.length !== 0) {
            let result;
            for (let n in bonus) {
                result = this.validateNameSalary(bonus[n].nameBonus, n) &&
                    this.validateMoreMoneySalary(bonus[n].number, n);
                if (result === false) {
                    this.validateNameSalary(bonus[n].nameBonus, n);
                    this.validateMoreMoneySalary(bonus[n].number, n)
                    break;
                }
            }
            if (result === true) {
                this.setState({
                    bonus: [...bonus, { nameBonus: "", number: "" }]
                })
            }
        } else {
            this.setState({
                bonus: [...bonus, { nameBonus: "", number: "" }]
            })
        }

    }

    // Bắt sự kiện chỉnh sửa tên lương thưởng khác 
    handleChangeNameBonus = (e) => {
        var { value, className } = e.target;
        this.validateNameSalary(value, className);
    }
    // Function kiểm tra tên lương thưởng nhập vào có hợp lệ không
    validateNameSalary = (value, className, willUpdateState = true) => {
        let msg = SalaryFormValidator.validateNameSalary(value, this.props.translate);
        if (willUpdateState) {
            var { bonus } = this.state;
            bonus[className] = { ...bonus[className], nameBonus: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnNameSalary: msg,
                    bonus: bonus
                }
            });
        }
        return msg === undefined;
    }

    // Bắt sự kiện chỉnh sửa tiền lương thưởng khác 
    handleChangeMoneyBonus = (e) => {
        var { value, className } = e.target;
        this.validateMoreMoneySalary(value, className);
    }
    // Kiểm tra tiền lương thưởng khác nhập vào có hợp lệ hay không
    validateMoreMoneySalary = (value, className, willUpdateState = true) => {
        let msg = SalaryFormValidator.validateMoreMoneySalary(value, this.props.translate);
        if (willUpdateState) {
            var { bonus } = this.state;
            bonus[className] = { ...bonus[className], number: value }
            this.setState(state => {
                return {
                    ...state,
                    errorOnMoreMoneySalary: msg,
                    bonus: bonus
                }
            });
        }
        return msg === undefined;
    }

    // Function xoá lương thưởng khác
    delete = (index) => {
        var { bonus } = this.state;
        bonus.splice(index, 1);
        this.setState({
            bonus: bonus
        })
        if (bonus.length !== 0) {
            for (let n in bonus) {
                this.validateNameSalary(bonus[n].nameBonus, n);
                this.validateMoreMoneySalary(bonus[n].number, n)
            }
        } else {
            this.setState({
                errorOnMoreMoneySalary: undefined,
                errorOnNameSalary: undefined
            })
        }
    };

    // Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form
    isFormValidated = () => {
        let result =
            this.validateMainSalary(this.state.mainSalary, false) && this.validateMonthSalary(this.state.month, false);

        if (result === true) {
            if (this.state.bonus !== []) {
                let test = this.state.bonus;
                for (let n in test) {
                    result = this.validateNameSalary(test[n].nameBonus, n, false) &&
                        this.validateMoreMoneySalary(test[n].number, n, false);
                    if (result === false) break;
                }
            }
        }
        return result;
    }

    // Function bắt sự kiện lưu bảng lương
    save = async () => {
        await this.setState({
            mainSalary: this.state.mainSalary + this.state.unit
        })
        if (this.isFormValidated()) {
            return this.props.handleChange(this.state);
        }
    }
    render() {
        const { translate, id } = this.props;
        const { unit, mainSalary, bonus, month,
            errorOnMainSalary, errorOnNameSalary, errorOnMoreMoneySalary, errorOnMonthSalary } = this.state;
        return (
            <React.Fragment>
                <ModalButton modalID={`modal-create-salary-${id}`} button_name={translate('modal.create')} title={translate('salary_employee.add_salary_title')} />
                <ModalDialog
                    size='50' modalID={`modal-create-salary-${id}`} isLoading={false}
                    formID={`form-create-salary-${id}`}
                    title={translate('salary_employee.add_salary_title')}
                    func={this.save}
                    disableSubmit={!this.isFormValidated()}
                >
                    <form className="form-group" id={`form-create-salary-${id}`}>
                        <div className={`form-group ${errorOnMonthSalary === undefined ? "" : "has-error"}`}>
                            <label>{translate('page.month')}<span className="text-red">*</span></label>
                            <DatePicker
                                id={`create_month${id}`}
                                dateFormat="month-year"
                                value={month}
                                onChange={this.handleMonthChange}
                            />
                            <ErrorLabel content={errorOnMonthSalary} />
                        </div>
                        <div className={`form-group ${errorOnMainSalary === undefined ? "" : "has-error"}`}>
                            <label >{translate('salary_employee.main_salary')}<span className="text-red">*</span></label>
                            <div>
                                <input type="number" className="form-control" name="mainSalary" value={mainSalary} onChange={this.handleMainSalaryChange} style={{ display: "inline", width: "85%" }} autoComplete="off" placeholder={translate('salary_employee.main_salary')} autoComplete="off" />
                                <select className="form-control" name="unit" value={unit} onChange={this.handleChange} style={{ display: "inline", width: "15%" }}>
                                    <option value="VND">VND</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <ErrorLabel content={errorOnMainSalary} />
                        </div>
                        <div className={`form-group ${(errorOnNameSalary === undefined && errorOnMoreMoneySalary) === undefined ? "" : "has-error"}`}>
                            <label>{translate('salary_employee.other_salary')}:<a title={translate('salary_employee.add_more_salary')}><i className="fa fa-plus" style={{ color: "#00a65a", marginLeft: 5 }} onClick={this.handleAddBonus} /></a></label>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>{translate('salary_employee.name_salary')}</th>
                                        <th>{translate('salary_employee.money_salary')}</th>
                                        <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(typeof bonus === 'undefined' || bonus.length === 0) ? <tr><td colSpan={3}><center> {translate('table.no_data')}</center></td></tr> :
                                        bonus.map((x, index) => (
                                            <tr key={index}>
                                                <td><input className={index} type="text" value={x.nameBonus} name="nameBonus" style={{ width: "100%" }} onChange={this.handleChangeNameBonus} /></td>
                                                <td><input className={index} type="number" value={x.number} name="number" style={{ width: "100%" }} onChange={this.handleChangeMoneyBonus} /></td>
                                                <td style={{ textAlign: "center" }}>
                                                    <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <ErrorLabel content={errorOnNameSalary} />
                            <ErrorLabel content={errorOnMoreMoneySalary} />
                        </div>
                    </form>
                </ModalDialog>
            </React.Fragment>
        );
    }
};

const addSalary = connect(null, null)(withTranslate(ModalAddSalary));
export { addSalary as ModalAddSalary };