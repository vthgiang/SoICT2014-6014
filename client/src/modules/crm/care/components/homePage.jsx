import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification, ExportExcel, PaginateBar, SelectBox, SelectMulti } from '../../../../common-components';
import { formatFunction, getData } from '../../common/index';
import { CrmCustomerActions } from '../../customer/redux/actions';
import { CrmCareActions } from '../redux/action';
import CreateCareForm from './createForm';
import EditCareForm from './editForm';
import InfoCareForm from './infoForm';
import CompleteCareForm from './completeForm'
import CreateCareCommonForm from '../../common/createCareCommonForm'
import { CrmCareTypeActions } from '../../careType/redux/action';
import { UserActions } from '../../../super-admin/user/redux/actions';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';
import { getStorage } from '../../../../config';

function CrmCareHomePage(props) {

    const [searchState, setSearchState] = useState({
        limit: 5,
        page: 0,
    })
    const { crm, translate, user, auth, role } = props;
    const { cares, careTypes } = crm;
    const { limit, page } = searchState;
    const [careInfoId, setCareInfoId] = useState();
    const [careEditId, setCareEditId] = useState();
    const [careCompleteId, setCareCompleteId] = useState();
    const handleInfo = async (id) => {
        await setCareInfoId(id);
        window.$('#modal-crm-care-info').modal('show')
    }

    const handleEdit = async (id) => {
        await setCareEditId(id);
        window.$('#modal-crm-care-edit').modal('show')
    }
    const handleComplete = async (id) => {
        await setCareCompleteId(id);
        window.$(`#modal-crm-care-complete${id}`).modal('show')
    }

    const deleteCare = (id) => {
        if (id) {
            props.deleteCare(id);
            props.getCares(searchState);
        }
    }

    const setPage = async (pageNumber) => {
        const { limit } = searchState;
        const page = (pageNumber - 1) * (limit);
        const newSearchState = { ...searchState, page: parseInt(page), }
        await setSearchState(newSearchState);
        props.getCares(searchState);
    }
    const search = () => {
        console.log(searchState);
        props.getCares(searchState);
    }

    useEffect(
        () => {
            async function getData() {
                props.getCares(searchState);
                props.getCustomers();
                props.getCareTypes({});
                const currentRole = getStorage('currentRole')
                if (user && user.organizationalUnitsOfUser) {
                    let getCurrentUnit = user.organizationalUnitsOfUser.find(item =>
                        item.managers[0] === currentRole
                        || item.deputyManagers[0] === currentRole
                        || item.employees[0] === currentRole);
                    if (getCurrentUnit) {
                        props.getChildrenOfOrganizationalUnits(getCurrentUnit._id);

                    }
                }
            }
            getData();
        }

        , [])





    let pageTotal = (cares.totalDocs % limit === 0) ?
        parseInt(cares.totalDocs / limit) :
        parseInt((cares.totalDocs / limit) + 1);
    const cr_page = parseInt((page / limit) + 1);
    // lay danh sach nhan vien
    //lay danh sach nhan vien
    let unitMembers;
    if (user.usersOfChildrenOrganizationalUnit) {

        unitMembers = getEmployeeSelectBoxItems(user.usersOfChildrenOrganizationalUnit);
    }




    //lay danh sach loại hình CSKH
    let listCareTypes;
    // Lấy hình thức chắm sóc khách hàng
    if (careTypes) {
        listCareTypes = careTypes.list.map(o => (
            { value: o._id, text: o.name }
        ))
    }

    /**
     * Xử lý tìm kiếm theo tất cả - do tôi phụ trách
     */
    const handleSearchByCurrentRole = async (value) => {
        let customerCareStaffs;
        if (value[0] == '1') customerCareStaffs = [auth.user._id];
        else {
            customerCareStaffs = [];
            await setSearchState(customerCareStaffs);
            return
        }
        if (searchState.customerCareStaffs) customerCareStaffs = [...customerCareStaffs, ...searchState.customerCareStaffs];
        const newSearchState = { ...searchState, customerCareStaffs }
        await setSearchState(newSearchState);
    }

    /**
   * Xử lý tìm kiếm theo trang thai
   */
    const handleSearchByStatus = async (value) => {
        const newSearchState = { ...searchState, status: value }
        await setSearchState(newSearchState);
    }

    /**
   * Xử lý tìm kiếm theo loai hinh CSKH
   */
    const handleSearchByCareTypes = async (value) => {

        const newSearchState = { ...searchState, customerCareTypes: value }
        await setSearchState(newSearchState);
    }
    /**
       * Xử lý tìm kiếm theo nhan vien CSKH
       */
    const handleSearchByCustomerCareStaffs = async (value) => {

        const newSearchState = { ...searchState, customerCareStaffs: value }
        await setSearchState(newSearchState);
    }


    //xu ly xuat bao cao

    const convertDataToExportData = (data) => {
        if (data) {
            data = data.map((o, index) => ({
                STT: index + 1,
                customerCareTypes: o.customerCareTypes ? o.customerCareTypes.map(cr => cr.name).join(', ') : '',
                name: o.name,
                customer: o.customer.name,
                status: formatFunction.formatCareStatus(o.status),
                customerCareStaffs: o.customerCareStaffs ? o.customerCareStaffs.map(cg => cg.name).join(', ') : '',
                priority: 'Ưu tiên cao',
                startDate: o.startDate ? formatFunction.formatDate(o.startDate) : '',
                endDate: o.endDate ? formatFunction.formatDate(o.endDate) : '',

            }))
        }

        let exportData = {
            fileName: 'Thông tin chăm sóc khách hàng',
            dataSheets: [
                {
                    sheetName: 'sheet1',
                    sheetTitle: 'Thông tin chăm sóc khách hàng',
                    tables: [
                        {
                            columns: [
                                { key: "STT", value: 'STT', width: 7 },
                                { key: "customerCareTypes", value: 'Loại hoạt động CSKH' },
                                { key: "name", value: "Tên hoạt động CSKH" },
                                { key: "customer", value: "Tên khách hàng", width: 25 },
                                { key: "priority", value: "Độ ưu tiên" },
                                { key: "customerCareStaffs", value: "Nhân viên phụ trách" },
                                { key: "status", value: "Trạng thái" },
                                { key: "startDate", value: "Ngày bắt đầu", width: 25 },
                                { key: "endDate", value: 'Ngày kết thúc', width: 25 },

                            ],
                            data: data,
                        }
                    ]
                }
            ]
        }
        return exportData;

    }
    let exportData = [];
    if (cares && cares.list && cares.list.length > 0) {
        exportData = convertDataToExportData(cares.list);

    }
    return (
        <div className="box">
            <div className="box-body qlcv">

                {/* form xem chi tieets */}
                {
                    careInfoId && <InfoCareForm careInfoId={careInfoId} />
                }

                {/* form edit  */}
                {
                    careEditId && <EditCareForm careEditId={careEditId} />
                }
                {
                    careCompleteId && <CompleteCareForm careCompleteId={careCompleteId} />
                }
                <div className="form-inline">
                    {/* export excel danh sách khách hàng */}
                    <ExportExcel id="export-customer" buttonName={translate('human_resource.name_button_export')} exportData={exportData} style={{ marginTop: 0 }} />
                    {/* Button dropdown thêm mới khách hàng */}
                </div>
                {cares && <CreateCareForm />}
                {/* search form */}
                {/* tim kiem hoat dong CSKh do toi phu trach */}
                <div className="form-inline" >
                    <div className="form-group unitSearch">
                        <label>{"Hoạt động chăm sóc khách hàng"}</label>
                        <SelectBox id="SelectUnit-care-by-current-role"
                            defaultValue={''}
                            items={[{ value: '0', text: 'Chọn tất cả' }, { value: '1', text: 'Do tôi phụ trách' },]}
                            onChange={handleSearchByCurrentRole}
                            style={{ width: '100%' }}
                        >
                        </SelectBox>
                    </div>
                    {/* tim kiem theo nhan vien phu trach*/}
                    <div className="form-group">
                        <label className="form-control-static">Nhân viên phụ trách</label>
                        {unitMembers && <SelectMulti id="multiSelectUnit-employees-care-home-page"
                            defaultValue={''}
                            items={
                                unitMembers[0].value
                            }
                            onChange={handleSearchByCustomerCareStaffs}
                            options={{ nonSelectedText: "Nhân viên phụ trách ", allSelectedText: 'Chọn tất cả' }}
                        >
                          
                        </SelectMulti>}
                    </div>
                </div>
                {/*  tim kiem theo loai hinh CSKH */}
                <div className="form-inline" >
                    <div className="form-group">
                        <label className="form-control-static">{translate('crm.care.careType')}</label>
                        {listCareTypes && <SelectMulti id="multiSelectUnit12"
                            defaultValue={''}
                            items={listCareTypes}
                            onChange={handleSearchByCareTypes}
                            options={{
                                nonSelectedText: translate('crm.care.careType'),
                                allSelectedText: translate(`task.task_management.select_all_department`)
                            }}
                        >
                        </SelectMulti>}
                    </div>
                    {/* tim kiem theo trang thai */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('crm.care.status')}</label>
                        <SelectMulti id="multiSelectUnit-status-customercare-common-form"
                            defaultValue={''}
                            items={[
                                { value: 1, text: 'Chưa thưc hiện' },
                                { value: 2, text: 'Đang thực hiện' },
                                { value: 3, text: 'Đã hoàn thành' },
                                { value: 4, text: 'Đã quá hạn' },
                                { value: 5, text: 'Hoàn thành quá hạn' },
                            ]}
                            onChange={handleSearchByStatus}
                            options={{
                                nonSelectedText: translate('crm.care.status'),
                                allSelectedText: translate(`task.task_management.select_all_department`)
                            }}
                        >
                        </SelectMulti>
                    </div>
                    <div className="form-group" >
                        <label></label>
                        <button type="button" className="btn btn-success" onClick={search} title={translate('form.search')}>{translate('form.search')}</button>
                    </div>
                </div>



                <table className="table table-hover table-striped table-bordered" id="table-manage-crm-group" style={{ marginTop: '10px' }}>
                    <thead>
                        <tr>

                            <th>{translate('crm.care.name')}</th>
                            <th>{translate('crm.care.careType')}</th>
                            <th>{translate('crm.care.customer')}</th>
                            {/* <th>{translate('crm.care.description')}</th> */}
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
                                    <td>{o.customer.name ? o.customer.name : ''}</td>
                                    {/* <td>{o.description}</td> */}
                                    <td>{o.priority ? formatFunction.formatCarePriority(o.priority) : ''}</td>
                                    <td>{o.customerCareStaffs ? o.customerCareStaffs.map(cg => cg.name).join(', ') : ''}</td>
                                    <td>{formatFunction.formatCareStatus(o.status)}</td>
                                    <td>{o.startDate ? formatFunction.formatDate(o.startDate) : ''}</td>
                                    <td>{o.endDate ? formatFunction.formatDate(o.endDate) : ''}</td>
                                    <td style={{ textAlign: 'left' }}>
                                        <a className="text-green" onClick={() => handleInfo(o._id)}><i className="material-icons">visibility</i></a>
                                        {o.status != 3 && o.status != 5 &&(o.customerCareStaffs[0]._id == auth.user._id||getData.getRole(role) =='manager')&&
                                            <>
                                                <a className="text-yellow" onClick={() => handleEdit(o._id)}><i className="material-icons">edit</i></a>
                                                {/* Chỉ người thực hiện mới được báo hoàn thành */}
                                                {o.customerCareStaffs[0]._id == auth.user._id &&
                                                    <a className="text-green" onClick={() => handleComplete(o._id)}><i className="material-icons">assignment_turned_in</i></a>
                                                }
                                                <ConfirmNotification
                                                    icon="question"
                                                    title="Xóa thông tin về khách hàng"
                                                    content="<h3>Xóa thông tin khách hàng</h3>"
                                                    name="delete"
                                                    className="text-red"
                                                    func={() => deleteCare(o._id)}
                                                />
                                            </>
                                        }
                                    </td>
                                </tr>
                            )) : null
                        }

                    </tbody>
                </table>
                {
                    cares && cares.isLoading ?
                        <div className="table-info-panel">{translate('confirm.loading')}</div> :
                        cares.list && cares.list.length === 0 && <div className="table-info-panel">{translate('confirm.no_data')}</div>

                }
                {/* Phan trang */}
                {
                    <PaginateBar pageTotal={pageTotal} currentPage={cr_page} func={setPage} />
                }
            </div>
        </div>
    );
}



function mapStateToProps(state) {
    const { crm, user, auth, role } = state;
    return { crm, user, auth, role };
}

const mapDispatchToProps = {
    getCares: CrmCareActions.getCares,
    deleteCare: CrmCareActions.deleteCare,
    getCustomers: CrmCustomerActions.getCustomers,
    getCareTypes: CrmCareTypeActions.getCareTypes,
    getDepartment: UserActions.getDepartmentOfUser,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getAllEmployeeOfUnitByRole: UserActions.getAllEmployeeOfUnitByRole,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CrmCareHomePage));