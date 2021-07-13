import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PaginateBar, DataTableSetting, SelectMulti, DeleteNotification } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

import { CreateApiRegistrationModal } from './createApiRegistrationModal'

import { ApiRegistrationActions } from '../redux/actions'

function ApiRegistration (props) {
    const { translate, apiRegistration, company } = props

    const tableId = "table-api-registration";
    const defaultConfig = { limit: 20 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        email: null,
        page: 1,
        perPage: limit
    })
    const { email, page, perPage } = state;

    useEffect(() => {
        props.getApiRegistration({
            email: email,
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
        props.getApiRegistration({
            email: email,
            page: page,
            perPage: perPage
        })
    }

    const handleCancelApiRegistration = (api) => {

    }

    const setLimit = (value) => {
        if (Number(value) !== perPage) {
            setState({
                ...state,
                page: 1,
                perPage: Number(value)
            })
            props.getApiRegistration({
                email: email,
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
        props.getApiRegistration({
            email: email,
            page: value,
            perPage: perPage
        })
    }

    const formatStatus = (status) => {
        return status
    }

    const handleAddPrivilegeApi = () => {
        window.$("#create-api-registration-modal").modal("show");
    }

    let listPaginateApiRegistration = apiRegistration?.listPaginateApiRegistration

    return (
        <React.Fragment>
            <CreateApiRegistrationModal/>
            
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
                                            <button className="pull-right" style={{ position: "absolute", right: 0 }}>Copy</button>
                                            {apiRegistration?.token?.slice(0, 60)}...
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a onClick={() => handleCancelApiRegistration(apiRegistration)} style={{ color: "#E34724"}}>
                                                <i className="material-icons">highlight_off</i>
                                            </a>
                                        </td>
                                    </tr>    
                                )
                            }
                        </tbody>
                    </table>

                    <PaginateBar
                        display={apiRegistration?.listPaginateApiRegistration?.length}
                        total={apiRegistration?.totalApiRegistrations}
                        pageTotal={apiRegistration?.totalPages}
                        currentPage={page}
                        func={handleGetDataPagination}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { apiRegistration, company } = state
    return { apiRegistration, company }
}
const actions = {
    getApiRegistration: ApiRegistrationActions.getApiRegistration
}

export default connect(mapState, actions)(withTranslate(ApiRegistration))