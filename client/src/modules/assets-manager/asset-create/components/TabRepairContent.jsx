import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import {
    ModalAddRepair, ModalEditRepair,// ModalAddDiscipline, ModalEditDiscipline
} from './CombineContent';
import {  DatePicker, DataTableSetting, SelectMulti } from '../../../../common-components';

class TabRepairContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // Function format ngày hiện tại thành dạnh mm-yyyy
    formatDate(date) {
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

    // Bắt sự kiện click edit phiếu
    handleEdit = async (value, index) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: { ...value, index: index }
            }
        });
        window.$(`#modal-edit-repair-editRepair${index}`).modal('show');
    }

    // Function thêm thông tin phiếu
    handleAddRepair = async (data) => {
        const { repairUpgrade } = this.state;
        await this.setState({
            repairUpgrade: [...repairUpgrade, {
                ...data
            }]
        })
        this.props.handleAddRepair(this.state.repairUpgrade)
    }
    // Function chỉnh sửa thông tin phiếu
    handleEditRepair = async (data) => {
        const { repairUpgrade } = this.state;
        repairUpgrade[data.index] = data;
        await this.setState({
            repairUpgrade: repairUpgrade
        })
        this.props.handleEditRepair(this.state.repairUpgrade)
    }
    // Function bắt sự kiện xoá thông tin phiếu
    delete = async (index) => {
        var repairUpgrade = this.state.repairUpgrade;
        repairUpgrade.splice(index, 1);
        await this.setState({
            ...this.state,
            repairUpgrade: [...repairUpgrade]
        })
        this.props.handleDeleteRepair(this.state.repairUpgrade)
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.id !== prevState.id) {
            return {
                ...prevState,
                id: nextProps.id,
                repairUpgrade: nextProps.repairUpgrade
            }
        } else {
            return null;
        }
    }


    render() {
        const { id, translate } = this.props;
        const {  repairUpgrade } = this.state;

        return (
            <div id={id} className="tab-pane">
                <div className="box-body qlcv">
                    
                    <ModalAddRepair handleChange={this.handleAddRepair} id={`addRepair${id}`} />
                    <div className="form-group">
                        <h5 className="box-title">Lịch sử sửa chữa - thay thế - nâng cấp: </h5>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label className="form-control-static">Mã phiếu</label>
                            <input type="text" className="form-control" name="repairNumber" onChange={this.handleRepairNumberChange} placeholder="Mã phiếu" autoComplete="off" />
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.month')}</label>
                            <DatePicker
                                id="month"
                                dateFormat="month-year"
                                value={this.formatDate(Date.now())}
                                onChange={this.handleMonthChange}
                            />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: 10 }}>
                        <div className="form-group">
                            <label className="form-control-static">Phân loại</label>
                            <SelectMulti id={`multiSelectType`} multiple="multiple"
                                options={{ nonSelectedText: "Chọn loại phiếu", allSelectedText: "Chọn tất cả các loại phiếu" }}
                                onChange={this.handleTypeChange}
                                items={[
                                    { value: "repair", text: "Sửa chữa" },
                                    { value: "substitute", text: "Thay thế" },
                                    { value: "upgrade", text: "Nâng cấp" }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">{translate('page.status')}</label>
                            <SelectMulti id={`multiSelectStatus`} multiple="multiple"
                                options={{ nonSelectedText: translate('page.non_status'), allSelectedText: translate('page.all_status') }}
                                onChange={this.handleStatusChange}
                                items={[
                                    { value: "complete", text: "Đã thực hiện" },
                                    { value: "processing", text: "Đang thực hiện" },
                                    { value: "plan", text: "Chưa thực hiện" }
                                ]}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('page.add_search')} onClick={() => this.handleSunmitSearch()} >{translate('page.add_search')}</button>
                        </div>
                    </div>
                    <table id="repairupgrade-table" className="table table-striped table-bordered table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: "8%" }}>Mã phiếu</th>
                                <th style={{ width: "10%" }}>Ngày lập</th>
                                <th style={{ width: "10%" }}>Phân loại</th>
                                <th style={{ width: "10%" }}>Ngày thực hiện</th>
                                {/* <th style={{ width: "12%" }}>Ngày hoàn thành</th> */}
                                <th style={{ width: "10%" }}>Nội dung</th>
                                <th style={{ width: "10%" }}>Chi phí</th>
                                <th style={{ width: "10%" }}>Trạng thái</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động
                                    <DataTableSetting
                                        tableId="repairupgrade-table"
                                        columnArr={[
                                            "Mã phiếu",
                                            "Ngày lập",
                                            "Phân loại",
                                            "Ngày thực hiện",
                                            // "Ngày hoàn thành",
                                            "Nội dung",
                                            "Chi phí",
                                            "Trạng thái"
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        hideColumnOption={true}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(typeof repairUpgrade !== 'undefined' && repairUpgrade.length !== 0) &&
                                repairUpgrade.map((x, index) => (
                                    <tr key={index}>
                                        <td>{x.repairNumber}</td>
                                        <td>{x.dateCreate}</td>
                                        <td>{x.type}</td>
                                        <td>{x.repairDate}</td>
                                        {/* <td>{x.completeDate}</td> */}
                                        <td>{x.reason}</td>
                                        <td>{x.cost}</td>
                                        <td>{x.status}</td>
                                        <td>
                                            <a onClick={() => this.handleEdit(x, index)} className="edit text-yellow" style={{ width: '5px' }} title={translate('discipline.edit_praise')}><i className="material-icons">edit</i></a>
                                            <a className="delete" title="Delete" data-toggle="tooltip" onClick={() => this.delete(index)}><i className="material-icons"></i></a>
                                        </td>
                                    </tr>))
                            }
                        </tbody>
                    </table>
                    {
                        (typeof repairUpgrade === 'undefined' || repairUpgrade.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                    }
                </div>
                {
                    this.state.currentRow !== undefined &&
                    <ModalEditRepair
                        id={`editRepair${this.state.currentRow.index}`}
                        index={this.state.currentRow.index}
                        repairNumber={this.state.currentRow.repairNumber}
                        dateCreate={this.state.currentRow.dateCreate}
                        type={this.state.currentRow.type}
                        repairDate={this.state.currentRow.repairDate}
                        reason={this.state.currentRow.reason}
                        cost={this.state.currentRow.cost}
                        status={this.state.currentRow.status}
                        handleChange={this.handleEditRepair}
                    />
                }
            </div>
        );
    }
};

const tabRepair = connect(null, null)(withTranslate(TabRepairContent));
export { tabRepair as TabRepairContent };