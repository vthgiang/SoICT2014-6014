import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { PaginateBar, DataTableSetting } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration'

import { PrivilegeApiCreateModal } from './privilegeApiCreateModal'

function PrivilegeApiManagement (props) {
    const { translate, systemApis } = props

    const tableId = "table-privilege-system-api";
    const defaultConfig = { limit: 20 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        path: null,
        method: [],
        description: null,
        page: 1,
        perPage: limit
    })
    const { path, method, description, page, perPage } = state;

    const handleChangePath = (e) => {
        setState({
            ...state,
            path: e.target.value
        })
    }

    const handleChangeEmail = (e) => {
        setState({
            ...state,
            description: e.target.value
        })
    }

    const handleSunmitSearch = () => {
        props.getSystemApis({
            path: path,
            method: method,
            description: description,
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
            props.getSystemApis({
                path: path,
                method: method,
                description: description,
                page: 1,
                perPage: Number(value)
            })
        }
    }

    const handleGetDataPagination = (value) => {
        console.log(value)
        setState({
            ...state,
            page: value
        })
        props.getSystemApis({
            path: path,
            method: method,
            description: description,
            page: value,
            perPage: perPage
        })
    }

    const handleAddApi = () => {
        window.$("#privilege-system-api-modal").modal("show");
    }

    let listPaginateApi = systemApis?.listPaginateApi
    console.log("listPaginateApi", listPaginateApi)
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

                        <button type="button" onClick={() => handleAddApi()} className="btn btn-success pull-right" title={translate('task.task_management.add_title')}>{translate('task.task_management.add_task')}</button>
                    </div>

                    <div className="form-inline" style={{ marginBottom: 15 }}>
                        {/* Path */}
                        <div className="form-group">
                            <label className="form-control-static">{translate('system_admin.system_api.table.path')}</label>
                            <input className="form-control" type="text" placeholder={translate('system_admin.system_api.placeholder.input_path')} name="name" onChange={(e) => handleChangePath(e)} />
                        </div>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <button type="button" className="btn btn-success" title={translate('general.search')} onClick={() => handleSunmitSearch()} >{translate('general.search')}</button>
                        </div>
                    </div>

                    <table id={tableId} className="table table-hover table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>{translate('system_admin.privilege_system_api.table.email')}</th>
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
                            { listPaginateApi?.length > 0
                                && listPaginateApi.map(api => 
                                    <tr key={api._id}>
                                        <td>{api.path}</td>
                                        <td>{api.description}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <a onClick={() => handleEdit(api)} className="edit" title={translate('system_admin.system_component.edit')}><i className="material-icons">edit</i></a>
                                            {/* <DeleteNotification
                                                content={translate('system_admin.system_component.delete')}
                                                data={{
                                                    id: component._id,
                                                    info: component.name
                                                }}
                                                func={props.deleteSystemComponent}
                                            /> */}
                                        </td>
                                    </tr>    
                                )
                            }
                        </tbody>
                    </table>

                    <PaginateBar
                        display={systemApis?.listPaginateApi?.length}
                        total={systemApis?.totalSystemApis}
                        pageTotal={systemApis?.totalPages}
                        currentPage={page}
                        func={handleGetDataPagination}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

function mapState(state) {
    const { systemApis } = state
    return { systemApis }
}
const actions = {
  
}

export default connect(mapState, actions)(withTranslate(PrivilegeApiManagement))