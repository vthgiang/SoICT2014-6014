import React, { useEffect, useState } from 'react';
import { DataTableSetting, DeleteNotification, PaginateBar } from '../../../../common-components';
import { ExternalPolicyActions } from '../redux/actions';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { getTableConfiguration } from '../../../../helpers/tableConfiguration';
import ExternalPolicyViewModal from './externalPolicyViewModal';

function ExternalPolicy(props) {
    const { translate, externalPolicies } = props;

    const tableId = "table-management-external-policy";

    const [listExternalPolicy, setListExternalPolicy] = useState([]);
    const defaultConfig = { limit: 20 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [queryParams, setQueryParams] = useState({
        page: 0,
        perPage: limit,
        name: null,
    })
    const [externalPolicyView, setExternalPolicyView] = useState({})

    const { page, perPage, name } = queryParams;

    useEffect(() => {
        async function init() {
            props.getExternalPolicies({
                page,
                perPage
            })
        }

        init();
    }, [])

    useEffect(() => {
        if (externalPolicies) {
            setListExternalPolicy(externalPolicies.listExternalPolicy);
        }
    }, [externalPolicies])

    const handleNameChange = (event) => {
        setQueryParams({
            ...queryParams,
            name: event.target.value
        })
    }

    const handleLimitChange = (value) => {
        if (Number(value) !== perPage) {
            setQueryParams({
                ...queryParams,
                perPage: Number(value)
            })
            props.getExternalPolicies({
                name: name,
                page: 0,
                perPage: Number(value),
            })
        }
    }

    const handlePageChange = (value) => {
        setQueryParams({
            ...queryParams,
            page: Number(value) - 1
        })
        props.getExternalPolicies({
            name: name,
            page: Number(value) - 1,
            perPage: perPage
        })
    }

    const handleSubmitSearch = () => {
        props.getExternalPolicies({
            name: name,
            page: page,
            perPage: perPage
        })
    }

    const handleView = async (serviceIdentity) => {
        setExternalPolicyView(serviceIdentity);
        window.$('#view-external-policy-modal').modal('show');
    }

    const renderPolicyTable = () => (
        <table id={tableId} className="table table-hover table-striped table-bordered">
            <thead>
                <tr>
                    <th style={{ width: '40px' }}>{translate('system_admin.external_policy.table.no')}</th>
                    <th>{translate('system_admin.external_policy.table.name')}</th>
                    <th>{translate('system_admin.external_policy.table.description')}</th>
                    <th>{translate('system_admin.external_policy.table.enabled')}</th>
                    <th style={{ width: "120px" }}>
                        {translate('system_admin.external_policy.table.method')}
                        <DataTableSetting
                            tableId={tableId}
                            hideColumn={false}
                            setLimit={handleLimitChange}
                        />
                    </th>
                </tr>
            </thead>
            <tbody>
                {listExternalPolicy?.length > 0
                    && listExternalPolicy.map((policy, index) =>
                    <tr key={policy?.id}>
                        <td>{index + 1}</td>
                        <td>{policy?.name}</td>
                        <td>{policy?.description}</td>
                        <td>{policy?.enabled == true ? "Đang kích hoạt" : "Vô hiệu hóa"}</td>
                        <td style={{ textAlign: 'center' }}>
                            <a className="edit text-green" style={{ width: '5px' }} title={translate('system_admin.external_policy.view')} onClick={() => handleView(policy)}><i className="material-icons">visibility</i></a>
                        </td>
                    </tr>
                    )
                }
            </tbody>
        </table>
    )

    return (
        <React.Fragment>
            <ExternalPolicyViewModal
                externalPolicy={externalPolicyView}
            />
            <div className="box" >
                <div className="box-body qlcv">
                    <div className="form-inline">
                        {/* Name */}
                        <div className="form-group">
                            <label className="form-control-static">Tên</label>
                            <input className="form-control" type="text" placeholder="Input service name" name="name" onChange={handleNameChange} />
                        </div>
                    </div>

                    <div className="form-inline" style={{ marginBottom: 15 }}>

                        {/* Button tìm kiếm */}
                        <div className="form-group">
                            <label></label>
                            <button type="button" className="btn btn-success" title="Search" onClick={handleSubmitSearch} >Tìm kiếm</button>
                        </div>
                    </div>

                    {renderPolicyTable()}

                    <PaginateBar
                        display={externalPolicies?.listExternalPolicy?.length}
                        total={externalPolicies?.totalExternalPolicies}
                        pageTotal={externalPolicies?.totalPages}
                        currentPage={page}
                        func={handlePageChange}
                    />
                </div>
            </div>
        </React.Fragment>

    );
}


function mapState(state) {
    const { externalPolicies } = state
    return { externalPolicies }
}
const actions = {
    getExternalPolicies: ExternalPolicyActions.getExternalPolicies,
    deleteExternalPolicy: ExternalPolicyActions.deleteExternalPolicy
}

export default connect(mapState, actions)(withTranslate(ExternalPolicy))