import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PaginateBar, DataTableSetting, SelectMulti, DeleteNotification } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

import { CreateApiRegistrationModal } from './createApiRegistrationModal'

import { ApiRegistrationActions } from '../redux/actions'
import { PrivilegeApiActions } from '../../../../system-admin/system-api/system-api-privilege/redux/actions'

import { getStorage } from '../../../../../config';

function ApiRegistrationEmployee (props) {
    const { translate, privilegeApis, company } = props

    const tableId = "table-api-registration";
    const defaultConfig = { limit: 20 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        email: null,
        companyId: localStorage.getItem("companyId"),
        page: 1,
        perPage: limit,
        userId: getStorage('userId')
    })
    const { email, companyId, page, perPage, userId } = state;

    useEffect(() => {
        props.getPrivilegeApis({
            creator: userId,
            email: email,
            companyIds: [companyId],
            role: 'admin',
            page: page,
            perPage: perPage
        })
    }, [])

    const handleChangeEmail = (e) => {
        setState({
            ...state,
            email: e.target.value
        })
    }

    const handleSunmitSearch = () => {
        props.getPrivilegeApis({
            creator: userId,
            email: email,
            companyIds: [companyId],
            role: 'admin',
            page: page,
            perPage: perPage
        })
    }

    const handleCopyToken = (apiRegistration) => {
        let copyText = apiRegistration?.token?.slice();
        navigator.clipboard.writeText(copyText);
    }

    const handleAcceptApiRegistration = (api) => {
        props.updateStatusPrivilegeApi({
            privilegeApiIds: [api?._id],
            status: 3
        })
    }

    const handleDeclineApiRegistration = (api) => {
        props.updateStatusPrivilegeApi({
            privilegeApiIds: [api?._id],
            status: 2
        })
    }

    const handleCancelApiRegistration = (api) => {
        props.updateStatusPrivilegeApi({
            privilegeApiIds: [api?._id],
            status: 0
        })
    }

    const setLimit = (value) => {
        if (Number(value) !== perPage) {
            setState({
                ...state,
                page: 1,
                perPage: Number(value)
            })
            props.getPrivilegeApis({
                creator: userId,
                email: email,
                companyIds: [companyId],
                role: 'admin',
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
            creator: userId,
            email: email,
            companyIds: [companyId],
            role: 'admin',
            page: value,
            perPage: perPage
        })
    }

    const formatStatus = (status) => {
        if (status === 0) {
            return <span style={{ color: '#858585' }}>Vô hiệu hóa</span>
        } else if (status === 1) {
            return <span style={{ color: '#F57F0C' }}>Yêu cầu sử dụng</span>
        } else if (status === 2) {
            return <span style={{ color: '#E34724' }}>Từ chối</span>
        } else if (status === 3) {
            return <span style={{ color: '#28A745' }}>Đang sử dụng</span>

        }
    }
    
    const handleAddPrivilegeApi = () => {
        window.$("#create-api-registration-modal").modal("show");
    }

    let listPaginateApiRegistration = privilegeApis?.listPaginatePrivilegeApi

    return (
        <React.Fragment>
            <CreateApiRegistrationModal
                role="employee"
            />
            
            <div className="box" >
                <div className="box-body qlcv">
                    <div className="form-inline" style={{ marginBottom: 15 }}>
                        {/* Email */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('system_admin.privilege_system_api.table.email')}</label>
                            <input className="form-control" type="text" placeholder={translate('system_admin.privilege_system_api.placeholder.input_email')} name="name" onChange={(e) => handleChangeEmail(e)} />
                        </div>
                        <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>

                        <button type="button" onClick={() => handleAddPrivilegeApi()} className="btn btn-success pull-right" title={translate('task.task_management.add_title')}>{translate('task.task_management.add_task')}</button>
                    </div>

                    <table id={tableId} className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}>{translate('kpi.employee.employee_kpi_set.create_employee_kpi_set.no_')}</th>
                                <th>{translate('system_admin.privilege_system_api.table.email')}</th>
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
                            { listPaginateApiRegistration?.length > 0
                                && listPaginateApiRegistration.map((apiRegistration, index) => 
                                    <tr key={apiRegistration._id}>
                                        <td>{index + 1}</td>
                                        <td>{apiRegistration.email}</td>
                                        <td>{formatStatus(apiRegistration.status)}</td>
                                        <td style={{ position: "relative" }}>
                                            <button className="pull-right" style={{ position: "absolute", right: 0 }} onClick={() => handleCopyToken(apiRegistration)}>Copy</button>
                                            {apiRegistration?.token?.slice(0, 60)}...
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            {/* <a onClick={() => handleAcceptApiRegistration(apiRegistration)} style={{ color: "#28A745"}}>
                                                <i className="material-icons">check_circle_outline</i>
                                            </a>
                                            <a onClick={() => handleDeclineApiRegistration(apiRegistration)} style={{ color: "#E34724"}}>
                                                <i className="material-icons">remove_circle_outline</i>
                                            </a> */}
                                            <a onClick={() => handleCancelApiRegistration(apiRegistration)} style={{ color: "#858585"}}>
                                                <i className="material-icons">highlight_off</i>
                                            </a>
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
    updateStatusPrivilegeApi: PrivilegeApiActions.updateStatusPrivilegeApi
}

export default connect(mapState, actions)(withTranslate(ApiRegistrationEmployee))