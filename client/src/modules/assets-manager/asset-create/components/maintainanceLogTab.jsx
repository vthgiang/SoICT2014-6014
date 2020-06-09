import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { MaintainanceLogAddModal, MaintainanceLogEditModal } from './combinedContent';

class MaintainanceLogTab extends Component {
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

    // Bắt sự kiện click edit phiếu
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-maintainance-editMaintainance${index}`).modal('show');
    }

    // Function thêm thông tin bảo trì
    handleAddMaintainance = async (data) => {
        let { maintainanceLogs } = this.state;
        await this.setState({
            maintainanceLogs: [...maintainanceLogs, {
                ...data
            }]
        })
        this.props.handleAddMaintainance(this.state.maintainanceLogs, data)
    }
    // Function chỉnh sửa thông tin bảo trì
    handleEditMaintainance = async (data) => {
        const { maintainanceLogs } = this.state;
        maintainanceLogs[data.index] = data;
        await this.setState({
            maintainanceLogs: maintainanceLogs
        });
        this.props.handleEditMaintainance(this.state.maintainanceLogs, data)
    }
    // Function bắt sự kiện xoá thông tin bảo trì
    handleDeleteMaintainance = async (index) => {
        var { maintainanceLogs } = this.state;
        var data = maintainanceLogs[index];
        maintainanceLogs.splice(index, 1);
        await this.setState({
            ...this.state,
            maintainanceLogs: [...maintainanceLogs]
        })
        this.props.handleDeleteMaintainance(this.state.maintainanceLogs, data)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                maintainanceLogs: nextProps.maintainanceLogs,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const { maintainanceLogs } = this.state;
        var formater = new Intl.NumberFormat();

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">Lịch sử bảo trì</h4></legend>
                        <MaintainanceLogAddModal handleChange={this.handleAddMaintainance} id={`addMaintainance${id}`} />
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "8%" }}>Mã phiếu</th>
                                    <th style={{ width: "10%" }}>Ngày lập</th>
                                    <th style={{ width: "10%" }}>Phân loại</th>
                                    <th style={{ width: "10%" }}>Nội dung</th>
                                    <th style={{ width: "10%" }}>Ngày bắt đầu sửa chữa</th>
                                    <th style={{ width: "12%" }}>Ngày hoàn thành</th>
                                    <th style={{ width: "10%" }}>Chi phí</th>
                                    <th style={{ width: "10%" }}>Trạng thái</th>
                                    <th style={{ width: '120px', textAlign: 'center' }}>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(typeof maintainanceLogs !== 'undefined' && maintainanceLogs.length !== 0) &&
                                    maintainanceLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.maintainanceCode}</td>
                                            <td>{this.formatDate(x.createDate)}</td>
                                            <td>{x.type}</td>
                                            <td>{x.description}</td>
                                            <td>{this.formatDate(x.startDate)}</td>
                                            <td>{this.formatDate(x.endDate)}</td>
                                            <td>{formater.format(parseInt(x.expense))} VNĐ</td>
                                            <td>{x.status}</td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin phiếu"><i
                                                    className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteMaintainance(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>))
                                }
                            </tbody>
                        </table>
                        {
                            (typeof maintainanceLogs === 'undefined' || maintainanceLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <MaintainanceLogEditModal
                        id={`editMaintainance${this.state.currentRow.index}`}
                        _id={this.state.currentRow._id}
                        index={this.state.currentRow.index}
                        maintainanceCode={this.state.currentRow.maintainanceCode}
                        createDate={this.state.currentRow.createDate}
                        type={this.state.currentRow.type}
                        description={this.state.currentRow.description}
                        startDate={this.state.currentRow.startDate}
                        endDate={this.state.currentRow.endDate}
                        expense={this.state.currentRow.expense}
                        status={this.state.currentRow.status}
                        handleChange={this.handleEditMaintainance}
                    />
                }
            </div>
        );
    }
};


const maintainanceLogTab = connect(null, null)(withTranslate(MaintainanceLogTab));
export { maintainanceLogTab as MaintainanceLogTab };
