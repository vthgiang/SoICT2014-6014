import React, { useEffect, useState } from 'react';
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
import InfoCareForm from '../../care/components/infoForm'
CareHistoriesInfoForm.propTypes = {

};

function CareHistoriesInfoForm(props) {

    const { customerId, customerInfomation, crm, user, translate } = props;
    const [searchState, setSearchState] = useState({
        limit: 5,
        page: 0,
        customerId: customerId,
    });
    const { id } = props;
    const [careInfoId,setCareInfoId] = useState();
    let unitMembers;
    let listCareType;

    useEffect(() => {


        console.log('ID', customerId)
        const newSearchState = { ...searchState, customerId: customerId }
        setSearchState(newSearchState);
        console.log('State', searchState)
        props.getCareTypes({});
        props.getCares({ ...searchState, customerId: customerId })
    }, [customerId])

    const { cares } = crm;
    // lấy danh sách loại hình CSKH

    if (crm.careTypes) {
        listCareType = crm.careTypes.list.map((item) => {
            return { value: item._id, text: item.name }
        })
    }
    console.log("CRM", crm);
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
    /**hàm xử lý tìm kiếm theo trạng thái */
    const handleSearchByCareStatus = async (value) => {
        const newState = { ...searchState, status: value };
        await setSearchState(newState);
    }
    /**hàm xử lý tìm kiếm theo loại hoạt động  */
    const handleSearchByCareTypes = async (value) => {
        const newState = { ...searchState, customerCareTypes: value }
        await setSearchState(newState);
    }
    /**hàm xử lý tìm kiếm theo nguoi phu trach  */
    const handleSearchByCustomerCareStaffs = async (value) => {
        const newState = { ...searchState, customerCareStaffs: value[0] }
        await setSearchState(newState);
    }

    const search = async () => {
        await props.getCares(searchState);
    }
    /**
     * ham xu ly xem thong tin
     */
    const handleInfo = async (id) => {
        await setCareInfoId(id);
        window.$('#modal-crm-care-info').modal('show')
    }
    return (
        <div className="tab-pane purchaseHistories" id={id}>
            <div className="box">
                <div className="box-body qlcv">
                     {/* form xem chi tieets */}
                {
                    careInfoId && <InfoCareForm careInfoId={careInfoId} />
                }
                    {/* search form */}
                    {/* tìm kiếm theo loại hoạt động */}
                    <div className="form-inline" style={{ marginBottom: '2px' }}>
                        <div className="form-group" >
                            <label>{'Loại hoạt động'}</label>
                            {listCareType &&
                                <SelectMulti id="multiSelectUnit-care-history"
                                    items={listCareType}
                                    onChange={handleSearchByCareTypes}
                                    options={{ nonSelectedText: "Loại hoạt động", allSelectedText: 'Chọn tất cả' }}
                                >
                                </SelectMulti>
                            }
                        </div>
                        {/* tìm kiếm theo trang thai */}
                        <div className="form-group">
                            <label>{'Trạng thái '}</label>
                            {
                                <SelectMulti id="multiSelectUnit-care-status-customer-info"
                                    items={listStatus}
                                    onChange={handleSearchByCareStatus}
                                    options={{ nonSelectedText: "Trạng thái ", allSelectedText: 'Chọn tất cả' }}
                                >
                                </SelectMulti>
                            }

                        </div>
                        <div className="form-group" >
                            <button type="button" className="btn btn-success"
                                onClick={search}
                            >{'Tìm kiếm'}</button>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group unitSearch">
                            {/* Tìm kiếm khách hàng theo người quản lý */}
                            <label>{'Người phụ trách'}</label>
                            {
                                unitMembers &&
                                <SelectMulti
                                    id={`customer-group-edit-form`}
                                    className="form-control select2"
                                    style={{ width: "100%" }}
                                    items={
                                        unitMembers[0].value
                                    }
                                    onChange={handleSearchByCustomerCareStaffs}
                                    multiple={false}
                                    options={{ nonSelectedText: "Nhân viên phụ trách ", allSelectedText: 'Chọn tất cả' }}
                                />
                            }
                        </div>

                    </div>
                    <table className="table table-hover table-striped table-bordered" id="table-manage-crm-group" style={{ marginTop: '10px' }}>
                        <thead>
                            <tr>

                                <th>{translate('crm.care.name')}</th>
                                <th>{translate('crm.care.careType')}</th>

                                <th>{translate('crm.care.description')}</th>

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
                                        <td>{o.description}</td>
                                        <td>{o.customerCareStaffs ? o.customerCareStaffs.map(cg => cg.name).join(', ') : ''}</td>
                                        <td>{getStatusText(o.status)}</td>
                                        <td>{o.startDate ? formatFunction.formatDate(o.startDate) : ''}</td>
                                        <td>{o.endDate ? formatFunction.formatDate(o.endDate) : ''}</td>
                                        <td style={{ textAlign: 'center' }}>
                                             <a className="text-green" onClick={() => handleInfo(o._id)}><i className="material-icons">visibility</i></a>
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