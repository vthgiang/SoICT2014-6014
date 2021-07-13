import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PaginateBar, DataTableSetting, SelectMulti, DeleteNotification } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

import { PrivilegeApiActions } from '../redux/actions'
import { CompanyActions } from '../../../company/redux/actions';

import { PrivilegeApiCreateModal } from './privilegeApiCreateModal'
 
function PrivilegeApiManagement (props) {
    const { translate, privilegeApis, company } = props

    const tableId = "table-privilege-system-api";
    const defaultConfig = { limit: 20 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        email: null,
        companyIds: null,
        page: 1,
        perPage: limit
    })
    const { email, companyIds, page, perPage } = state;

    useEffect(() => {
        props.getPrivilegeApis({
            page: page,
            perPage: perPage
        })
        props.getAllCompanies({
            limit: 2000,
            page: 1
        })
    }, [])

    const handleChangeEmail = (e) => {
        setState({
            ...state,
            email: e.target.value
        })
    }

    const handleCompany = (value) => {
        setState({
            ...state,
            companyIds: value
        })
    }

    const handleSunmitSearch = () => {
        props.getPrivilegeApis({
            email: email,
            companyIds: companyIds,
            page: page,
            perPage: perPage
        })
    }

    const handleEdit = (api) => {

    }

    const setLimit = (value) => {
        if (Number(value) !== perPage) {
            setState({
                ...state,
                page: 1,
                perPage: Number(value)
            })
            props.getPrivilegeApis({
                email: email,
                companyIds: companyIds,
                page: 1,
                perPage: Number(value)
            })
        }
    }

    const handleGetDataPagination = (value) => {
        setState({
            ...state,
            page: value
        })
        props.getPrivilegeApis({
            email: email,
            companyIds: companyIds,
            page: value,
            perPage: perPage
        })
    }

    const formatStatus = (status) => {
        return status
    }

    const handleAddPrivilegeApi = () => {
        window.$("#privilege-system-api-modal").modal("show");
    }

    let listPaginatePrivilegeApi = privilegeApis?.listPaginatePrivilegeApi
    let listPaginateCompany = company?.listPaginate

    return (
        <React.Fragment>
            <PrivilegeApiCreateModal/>

            <div className="box" >
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Email */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('system_admin.privilege_system_api.table.email')}</label>
                            <input className="form-control" type="text" placeholder={translate('system_admin.privilege_system_api.placeholder.input_email')} name="name" onChange={(e) => handleChangeEmail(e)} />
                        </div>

                        <button type="button" onClick={() => handleAddPrivilegeApi()} className="btn btn-success pull-right" title={translate('task.task_management.add_title')}>{translate('task.task_management.add_task')}</button>
                    </div>

                    <div className="form-inline" style={{ marginBottom: 15 }}>
                        {/* Company */}
                        <div className="form-group">
                            <label className="control-label">{translate('system_admin.company.table.name')}</label>
                            <SelectMulti
                                id={`management-privilege-api-modal-company`}
                                className="form-control"
                                style={{ width: "100%" }}
                                items={listPaginateCompany?.length > 0 ? listPaginateCompany.map(item => {
                                    return {
                                        value: item?._id,
                                        text: item?.name
                                    }
                                }) : []}
                                value={companyIds}
                                onChange={handleCompany}
                            />
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>
                        </div>
                    </div>

                    <table id={tableId} className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')}</th>
                                <th>{translate('system_admin.privilege_system_api.table.email')}</th>
                                <th>{translate('system_admin.company.table.name')}</th>
                                <th>{translate('task.task_management.col_status')}</th>
                                <th>Token</th>
                                <th style={{ width: "120px" }}>
                                    {translate('table.action')}
                                    <DataTableSetting
                                        tableId={tableId}
                                        hideColumn={false}
                                        setLimit={setLimit}
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            { listPaginatePrivilegeApi?.length > 0
                                && listPaginatePrivilegeApi.map((privilege, index) => 
                                    <tr key={privilege._id}>
                                        <td>{index + 1}</td>
                                        <td>{privilege.email}</td>
                                        <td>{privilege.company?.name}</td>
                                        <td>{formatStatus(privilege.status)}</td>
                                        <td style={{ position: "relative" }}>
                                            <button className="pull-right" style={{ position: "absolute", right: 0 }}>Copy</button>
                                            {privilege?.token?.slice(0, 60)}...
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a onClick={() => handleEdit(privilege)} className="edit" title={translate('system_admin.system_component.edit')}><i className="material-icons">edit</i></a>
                                            <DeleteNotification
                                                content={translate('system_admin.system_component.delete')}
                                                data={{
                                                    id: privilege._id,
                                                }}
                                                // func={props.deleteSystemComponent}
                                            />
                                        </td>
                                    </tr>    
                                )
                            }
                        </tbody>
                    </table>

                    <PaginateBar
                        display={privilegeApis?.listPaginatePrivilegeApi?.length}
                        total={privilegeApis?.totalPrivilegeApis}
                        pageTotal={privilegeApis?.totalPages}
                        currentPage={page}
                        func={handleGetDataPagination}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { privilegeApis, company } = state
    return { privilegeApis, company }
}
const actions = {
    getPrivilegeApis: PrivilegeApiActions.getPrivilegeApis,
    getAllCompanies: CompanyActions.getAllCompanies,
}

export default connect(mapState, actions)(withTranslate(PrivilegeApiManagement))