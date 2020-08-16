import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { UsageLogAddModal, UsageLogEditModal } from './combinedContent';

class UsageLogTab extends Component {
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

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }

        if (monthYear === true) {
            return [month, year].join('-');
        } else {
            return [day, month, year].join('-');
        }
    }

    // Function lưu giá trị mã phiếu vào state khi thay đổi
    handleDistributeNumberChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị mã tài sản vào state khi thay đổi
    handleCodeChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });

    }

    // Function lưu giá trị tháng vào state khi thay đổi
    handleMonthChange = (value) => {
        this.setState({
            ...this.state,
            month: value
        });
    }

    // Function lưu giá trị loại phiếu vào state khi thay đổi
    handleTypeChange = (value) => {
        if (value.length === 0) {
            value = null
        }
        ;
        this.setState({
            ...this.state,
            type: value
        })
    }

    // Function bắt sự kiện tìm kiếm
    handleSunmitSearch = async () => {
        if (this.state.month === "") {
            await this.setState({
                month: this.formatDate(Date.now())
            })
        }

    }

    // Bắt sự kiện click edit phiếu
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-usage-editUsage${index}`).modal('show');
    }

    // Function thêm thông tin phiếu
    handleAddUsage = async (data) => {
        const { usageLogs } = this.state;
        usageLogs.push(data);

        await this.setState({
            usageLogs: usageLogs,
        })

        this.props.handleAddUsage(this.state.usageLogs, data)
    }

    // Function chỉnh sửa thông tin phiếu
    handleEditUsage = async (data) => {
        const { usageLogs } = this.state;
        usageLogs[data.index] = data;
        await this.setState({
            usageLogs: usageLogs,
        })

        await this.props.handleEditUsage(this.state.usageLogs, data)
    }

    // Function bắt sự kiện xoá thông tin phiếu
    handleDeleteUsage = async (index) => {
        var { usageLogs } = this.state;
        var data = usageLogs[index];
        usageLogs.splice(index, 1);
        await this.setState({
            ...this.state,
            usageLogs: [...usageLogs]
        })
        this.props.handleDeleteUsage(this.state.usageLogs, data)
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id || nextProps.usageLogs !== prevState.usageLogs) {
            return {
                ...prevState,
                id: nextProps.id,
                usageLogs: nextProps.usageLogs,
            }
        } else {
            return null;
        }
    }


    render() {
        const { id } = this.props;
        const { translate, user } = this.props;
        const { usageLogs, currentRow } = this.state;

        var userlist = user.list;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    {/* Lịch sử sử dụng */}
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border"><h4 className="box-title">{translate('asset.asset_info.usage_logs')}</h4></legend>

                        {/* Form thêm thông tin sử dụng */}
                        <UsageLogAddModal handleChange={this.handleAddUsage} id={`addUsage${id}`} />

                        {/* Bảng thông tin sử dụng */}
                        <table className="table table-striped table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.user')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.handover_from_date')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.handover_to_date')}</th>
                                    <th style={{ width: "10%" }}>{translate('asset.general_information.content')}</th>
                                    <th style={{ width: '100px', textAlign: 'center' }}>{translate('table.action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(usageLogs && usageLogs.length !== 0) &&
                                    usageLogs.map((x, index) => (
                                        <tr key={index}>
                                            <td>{x.usedBy ? (userlist.length && userlist.filter(item => item._id === x.usedBy).pop() ? userlist.filter(item => item._id === x.usedBy).pop().name : 'User is deleted') : ''}</td>
                                            <td>{x.startDate ? this.formatDate(x.startDate) : ''}</td>
                                            <td>{x.endDate ? this.formatDate(x.endDate) : ''}</td>
                                            <td>{x.description}</td>
                                            <td>
                                                <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title="Chỉnh sửa thông tin sử dụng"><i
                                                    className="material-icons">edit</i></a>
                                                <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.handleDeleteUsage(index)}><i className="material-icons"></i></a>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        {
                            (!usageLogs || usageLogs.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                        }
                    </fieldset>

                </div>
                {
                    currentRow &&
                    <UsageLogEditModal
                        id={`editUsage${currentRow.index}`}
                        _id={currentRow._id}
                        index={currentRow.index}
                        usedBy={currentRow.usedBy}
                        startDate={currentRow.startDate}
                        endDate={currentRow.endDate}
                        description={currentRow.description}
                        handleChange={this.handleEditUsage}
                    />
                }
            </div>
        );
    }
};

function mapState(state) {
    const { user } = state;
    return { user };
};

const usageLogTab = connect(mapState, null)(withTranslate(UsageLogTab));

export { usageLogTab as UsageLogTab };
