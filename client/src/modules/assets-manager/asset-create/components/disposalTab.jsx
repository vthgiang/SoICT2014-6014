import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, ErrorLabel } from '../../../../common-components';

class DisposalTab extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Function format dữ liệu Date thành string
    formatDate(date, monthYear = false) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        if (monthYear === true) {
            return [month, year].join('-');
        } else return [day, month, year].join('-');
    }

    // Function lưu các trường thông tin vào state
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
        this.props.handleChange(name, value);
    }

    /**
     * Bắt sự kiện thay đổi Thời gian thanh lý
     */
    handleDisposalDateChange = (value) => {
        this.setState(state => {
            return {
                ...state,
                disposalDate: value,
            }
        });
        this.props.handleChange("disposalDate", value);
    }

    /**
     * Bắt sự kiện thay đổi hình thức thanh lý
     */
    handleDisposalTypeChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...this.state,
                disposalType: value
            }

        });
        this.props.handleChange("disposalType", value);
    }

    /**
     * Bắt sự kiện thay đổi giá trị thanh lý
     */
    handleDisposalCostChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                disposalCost: value
            }

        });
        this.props.handleChange("disposalCost", value);
    }

    /**
     * Bắt sự kiện thay đổi nội dung thanh lý
     */
    handleDisposalDescriptionChange = (e) => {
        let value = e.target.value;
        this.setState(state => {
            return {
                ...state,
                disposalDesc: value
            }

        });
        this.props.handleChange("disposalDesc", value);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                disposalDate: nextProps.disposalDate,
                disposalType: nextProps.disposalType,
                disposalCost: nextProps.disposalCost,
                disposalDesc: nextProps.disposalDesc,
            }
        } else {
            return null;
        }
    }

    render() {
        const { id, translate } = this.props;
        const { disposalDate, disposalType, disposalCost, disposalDesc } = this.state;
        return (
            <div id={id} className="tab-pane">
                <div className="box-body">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Thông tin thanh lý</h4></legend>
                        <div className={`form-group`}>
                            <label htmlFor="disposalDate">Thời gian thanh lý</label>
                            <DatePicker
                                id={`disposalDate${id}`}
                                value={disposalDate}
                                onChange={this.handleDisposalDateChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="disposalType">Hình thức thanh lý</label>
                            <select className="form-control" name="disposalType" value={disposalType} onChange={this.handleDisposalTypeChange}>
                                <option value="Tiêu hủy">Tiêu hủy</option>
                                <option value="Nhượng bán">Nhượng bán</option>
                                <option value="Tặng">Tặng</option>
                            </select>
                        </div>
                        <div className={`form-group`}>
                            <label htmlFor="disposalCost">Giá trị thanh lý (VNĐ)</label><br />
                            <input type="number" className="form-control" name="disposalCost" value={disposalCost} onChange={this.handleDisposalCostChange}
                                placeholder="Giá trị thanh lý" autoComplete="off" />
                        </div>
                        <div className={`form-group`}>
                            <label htmlFor="disposalDesc">Nội dung thanh lý</label><br />
                            <input type="text" className="form-control" name="disposalDesc" value={disposalDesc} onChange={this.handleDisposalDescriptionChange}
                                placeholder="Nội dung thanh lý" autoComplete="off" />
                        </div>
                        {/* <div className={`form-group`}>
                            <label htmlFor="usefulLife">Thời gian sử dụng (Tháng)<span className="text-red">*</span> (Ghi chú: Thời gian sử dụng = Thời gian trích khấu hao)</label>
                            <input type="number" className="form-control" name="usefulLife" value={usefulLife} onChange={this.handleUsefulLifeChange}
                                placeholder="Thời gian trích khấu hao" autoComplete="off" />
                        </div> */}

                    </fieldset>
                </div>
            </div>
        );
    }
};
const disposalTab = connect(null, null)(withTranslate(DisposalTab));
export { disposalTab as DisposalTab };
