import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { PaginateBar, SelectMulti, DataTableSetting, ConfirmNotification } from '../../../../common-components';
import CreateCareForm from './createForm';
class CrmCare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            limit: 5,
            page: 0,
        }
    }

    render() {
        const { crm, translate } = this.props;

        return (
            <div className="box">
                <div className="box-body qlcv">
                    <CreateCareForm />

                    {/* search form */}
                    <div className="form-inline" style={{ marginBottom: '2px' }}>
                        <div className="form-group unitSearch">
                            <label>{translate('task.task_management.department')}</label>
                            <SelectMulti id="multiSelectUnit1"
                                defaultValue={''}
                                items={[]}
                                onChange={this.handleSelectOrganizationalUnit}
                            >
                            </SelectMulti>
                        </div>
                        <div className="form-group">
                            <label className="form-control-static">Nhân viên phụ trách</label>
                            <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} name="customerCode" onChange={this.handleChangeCreator} placeholder={`Mã nhân viên`} />
                        </div>
                    </div>
                    <div className="form-inline" style={{ marginBottom: '2px' }}>
                        <div className="form-group">
                            <label className="form-control-static">Loại hình chăm sóc</label>
                            <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} name="customerCode" onChange={this.handleChangeCreator} placeholder={`Mã nhân viên`} />
                        </div>

                        <div className="form-group">
                            <label className="form-control-static">Trạng thái</label>
                            <SelectMulti id="multiSelectUnit1"
                                defaultValue={''}
                                items={[]}
                                onChange={this.handleSelectOrganizationalUnit}
                            >
                            </SelectMulti>
                        </div>
                    </div>

                    <div className="form-inline">
                        <div className="form-group" >
                            <label></label>
                            <button type="button" className="btn btn-success" onClick={this.search} title={translate('form.search')}>{translate('form.search')}</button>
                        </div>
                    </div>

                    <table className="table table-hover table-striped table-bordered" id="table-manage-crm-group" style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th>Tên công việc</th>
                                <th>Mô tả</th>
                                <th>Nhân viên phụ trách</th>
                                <th>Loại hình chăm sóc</th>
                                <th>Trạng thái</th>
                                <th>Thời gian thực hiện</th>
                                <th>Thời gian kết thúc</th>
                                <th>Hành động</th>
                                {/* <th style={{ width: "120px" }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        columnArr={[
                                            translate('crm.group.name'),
                                            translate('crm.group.code'),
                                            translate('crm.group.description'),
                                        ]}
                                        limit={this.state.limit}
                                        setLimit={this.setLimit}
                                        tableId="table-manage-crm-group"
                                    />
                                </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Gọi điện tư vấn cho khách</td>
                                <td>Yêu cầu gọi điện tư vấn sản phẩm với khách hàng được giao</td>
                                <td>Nhi Nguyễn</td>
                                <td>Gọi điện thoại</td>
                                <td>Đang thực hiện</td>
                                <td>11-10-2020</td>
                                <td>20-10-2020</td>
                                <td style={{ textAlign: 'center' }}>
                                    <a className="text-green" onClick={() => this.handleInfo()}><i className="material-icons">visibility</i></a>
                                    <a className="text-yellow" onClick={() => this.handleEdit()}><i className="material-icons">edit</i></a>
                                    <ConfirmNotification
                                        icon="question"
                                        title="Xóa thông tin về khách hàng"
                                        content="<h3>Xóa thông tin khách hàng</h3>"
                                        name="delete"
                                        className="text-red"
                                        func={() => this.props.deleteCustomer()}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { crm } = state;
    return { crm };
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCare));