import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';

import { PaginateBar, DataTableSetting, SelectMulti } from '../../../../../common-components';
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
            role: 'system_admin',
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
            role: 'system_admin',
            page: page,
            perPage: perPage
        })
    }

    const handleCopyToken = (privilege) => {
        let copyText = privilege?.token?.slice();
        navigator.clipboard.writeText(copyText);
    }

    const handleAcceptPrivilegeApi = (privilegeApi) => {
        props.updateStatusPrivilegeApi({
            role: 'system_admin',
            privilegeApiIds: [privilegeApi?._id],
            status: 3
        })
    }

    const handleDeclinePrivilegeApi = (privilegeApi) => {
        props.updateStatusPrivilegeApi({
            role: 'system_admin',
            privilegeApiIds: [privilegeApi?._id],
            status: 2
        })
    }

    const handleCancelPrivilegeApi = (privilegeApi) => {
        props.updateStatusPrivilegeApi({
            role: 'system_admin',
            privilegeApiIds: [privilegeApi?._id],
            status: 0
        })
    }

    const handleDeletePrivilegeApi = (privilegeApi) => {
        Swal.fire({
            html: `<h4 style="color: red"><div>${translate('system_admin.system_api.delete')}</div></h4>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value) {
                props.deletePrivilegeApis({
                    role: 'system_admin',
                    privilegeApiIds: [privilegeApi?._id]
                });
            }
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
                email: email,
                companyIds: companyIds,
                role: 'system_admin',
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
            role: 'system_admin',
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
                                            <button className="pull-right" style={{ position: "absolute", right: 0 }} onClick={() => handleCopyToken(privilege)}>Copy</button>
                                            {privilege?.token?.slice(0, 60)}...
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a onClick={() => handleAcceptPrivilegeApi(privilege)} style={{ color: "#28A745"}}>
                                                <i className="material-icons">check_circle_outline</i>
                                            </a>
                                            <a onClick={() => handleDeclinePrivilegeApi(privilege)} style={{ color: "#E34724"}}>
                                                <i className="material-icons">remove_circle_outline</i>
                                            </a>
                                            <div>
                                                <a onClick={() => handleCancelPrivilegeApi(privilege)} style={{ color: "#858585"}}>
                                                    <i className="material-icons">highlight_off</i>
                                                </a>
                                                <a className="delete text-red" onClick={() => handleDeletePrivilegeApi(privilege)}>
                                                    <i className="material-icons">delete</i>
                                                </a>
                                            </div>
                                            
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
    deletePrivilegeApis: PrivilegeApiActions.deletePrivilegeApis,
    updateStatusPrivilegeApi: PrivilegeApiActions.updateStatusPrivilegeApi,
    getAllCompanies: CompanyActions.getAllCompanies,
}

export default connect(mapState, actions)(withTranslate(PrivilegeApiManagement))