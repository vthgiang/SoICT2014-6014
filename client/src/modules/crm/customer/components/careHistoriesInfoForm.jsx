import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { translate } from 'react-redux-multilingual/lib/utils';
import { ConfirmNotification, DataTableSetting, SelectBox, SelectMulti } from '../../../../common-components';
import { UserActions } from '../../../super-admin/user/redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { CrmCareActions } from '../../care/redux/action';
import { CrmCareTypeActions } from '../../careType/redux/action';
import { formatFunction } from '../../common';
import { CrmGroupActions } from '../../group/redux/actions';
import { CrmStatusActions } from '../../status/redux/actions';
import { CrmCustomerActions } from '../redux/actions';

CareHistoriesInfoForm.propTypes = {

};

function CareHistoriesInfoForm(props) {

    const { id } = props;
    let unitMembers;
    useEffect(() => {
        props.getCareTypes({});
        props.getCares({
            limit: 5,
            page: 0,
        })
    }, [])

    const { customerId, customerInfomation, crm, user, translate } = props;
    const { cares } = crm;
    // lấy danh sách loại hình CSKH
    let listCareType;
    if (crm.careTypes) {
        listCareType = crm.careTypes.list.map((item) => {
            return { value: item._id, text: item.name }
        })
    }
    console.log("CRM", crm)
    //lấy danh sách người quản lý
    if (user.usersOfChildrenOrganizationalUnit) {
        unitMembers =
            getEmployeeSelectBoxItems(user.usersOfChildrenOrganizationalUnit);
    }

    // danh sách các trạng thái của hoạt động CSKH
    const listStatus = [
        { value: 0, text: 'Chưa thực hiện' },
        { value: 1, text: 'Đang thực hiện' },
        { value: 2, text: 'Đã hoàn thành ' },
        { value: 3, text: 'Đã quá hạn' },
        { value: 4, text: 'Hoàn thành quá hạn' },
    ]

    // lấy trạng thái để hiện thị
    const getStatusText = (value) => {
        let text;
        listStatus.forEach((item) => {
            if (item.value == value) text = item.text
        })
        return text;
    }
console.log('Care',cares)
    return (
        <div className="tab-pane purchaseHistories" id={id}>
            <div className="box">
                <div className="box-body qlcv">
                    {/* search form */}
                    {/* tìm kiếm theo loại hoạt động */}
                    <div className="form-inline" style={{ marginBottom: '2px' }}>
                        <div className="form-group" >
                            <label>{'Loại hoạt động'}</label>
                            {listCareType &&
                                <SelectMulti id="multiSelectUnit12"
                                    items={listCareType}
                                    //   onChange={this.handleSelectOrganizationalUnit}
                                    options={{ nonSelectedText: "Loại hoạt động", allSelectedText: 'Chọn tất cả' }}
                                >
                                </SelectMulti>
                            }
                        </div>
                        <div className="form-group">
                            <label>{'Trạng thái '}</label>
                            {
                                <SelectMulti id="multiSelectUnit13"
                                    items={listStatus}
                                    //   onChange={this.handleSelectOrganizationalUnit}
                                    options={{ nonSelectedText: "Trạng thái ", allSelectedText: 'Chọn tất cả' }}
                                >
                                </SelectMulti>
                            }

                        </div>
                        <div className="form-group" >
                            <button type="button" className="btn btn-success"
                            //onClick={this.search} 
                            >{'Tìm kiếm'}</button>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group unitSearch">
                            {/* Tìm kiếm khách hàng theo người quản lý */}
                            <label>{'Người phụ trách'}</label>
                            {
                                unitMembers &&
                                <SelectBox
                                    id={`customer-group-edit-form`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        unitMembers
                                    }
                                    // onChange={handleSearchByOwner}
                                    multiple={false}
                                />
                            }
                        </div>

                    </div>
                    <table className="table table-hover table-striped table-bordered" id="table-manage-crm-group" style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>

                                <th>{translate('crm.care.name')}</th>
                                <th>{translate('crm.care.careType')}</th>
                                <th>{translate('crm.care.customer')}</th>
                                <th>{translate('crm.care.description')}</th>
                                <th>{translate('crm.care.priority')}</th>
                                <th>{translate('crm.care.caregiver')}</th>
                                <th>{translate('crm.care.status')}</th>
                                <th>{translate('crm.care.startDate')}</th>
                                <th>{translate('crm.care.endDate')}</th>
                                <th>{translate('crm.care.action')}</th>
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
                            {
                                cares.list && cares.list.length > 0 ? cares.list.map(o => (
                                    <tr key={o._id}>

                                        <td>{o.name ? o.name : ''}</td>
                                        <td>{o.customerCareTypes ? o.customerCareTypes.map(cr => cr.name).join(', ') : ''}</td>
                                        <td>{o.customer ? o.customer.name : ''}</td>
                                        <td>{o.description}</td>
                                        <td>ưu tiên cao</td>
                                        <td>{o.customerCareStaffs ? o.customerCareStaffs.map(cg => cg.name).join(', ') : ''}</td>

                                        <td>{getStatusText(o.status)}</td>
                                        <td>{o.startDate ? formatFunction.formatDate(o.startDate) : ''}</td>
                                        <td>{o.endDate ? formatFunction.formatDate(o.endDate) : ''}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            {/* <a className="text-green" onClick={() => this.handleInfo(o._id)}><i className="material-icons">visibility</i></a>
                                            <a className="text-yellow" onClick={() => this.handleEdit(o._id)}><i className="material-icons">edit</i></a>
                                            <a className="text-green" onClick={() => this.handleComplete(o._id)}><i className="material-icons">add_task</i></a> */}
                                            <ConfirmNotification
                                                icon="question"
                                                title="Xóa thông tin về khách hàng"
                                                content="<h3>Xóa thông tin khách hàng</h3>"
                                                name="delete"
                                                className="text-red"
                                                func={() => this.props.deleteCare(o._id)}
                                            />
                                        </td>
                                    </tr>
                                )) : null
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const { crm, user } = state;
    return { crm, user };
}

const mapDispatchToProps = {
    getDepartment: UserActions.getDepartmentOfUser,
    getCustomers: CrmCustomerActions.getCustomers,
    deleteCustomer: CrmCustomerActions.deleteCustomer,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getGroups: CrmGroupActions.getGroups,
    getStatus: CrmStatusActions.getStatus,
    getCareTypes: CrmCareTypeActions.getCareTypes,
    getCares: CrmCareActions.getCares,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CareHistoriesInfoForm));