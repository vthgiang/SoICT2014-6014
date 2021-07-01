import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, SelectBox } from '../../../../../common-components';

import { SystemApiActions } from '../../system-api-management/redux/actions'
import { PrivilegeApiActions } from '../redux/actions'

function PrivilegeApiCreateModal(props) {
    const { translate, systemApis, company } = props;

    const [state, setState] = useState({
        email: null,
        apis: [],
        companyId: null
    });

    const { email, apis, companyId } = state;

    let listPaginateApi = systemApis?.listPaginateApi
    let listPaginateCompany = company?.listPaginate

    useEffect(() => {
        props.getSystemApis({
            page: 1,
            perPage: 20
        })
    }, [])

    useEffect(() => {
        setState({
            ...state,
            companyId: company?.listPaginate?.[0]?._id,
        })
    }, [JSON.stringify(company?.listPaginate)])

    const handleSystemApi = (value) => {
        setState({
            ...state,
            apis: value,
        })
    }

    const handleCompany = (value) => {
        setState({
            ...state,
            companyId: value[0],
        })
    }

    const handleChangeEmail = (e) => {
        setState({
            ...state,
            email: e.target.value
        })
    }

    const handleSubmit = () => {
        props.createPrivilegeApi({
            email: email,
            apis: apis,
            companyId: companyId
        })
        window.$("#privilege-system-api-modal").modal("hide");
    }

    const onSearchSystemApi = (textSearch) => {
        props.getSystemApis({
            path: textSearch,
            page: 1,
            perPage: 20
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="privilege-system-api-modal" isLoading={false}
                formID="form-privilege-system-api"
                title={translate('system_admin.system_api.modal.create_title')}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_faile={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
            >
                {/* Form them phan quyen API */}
                <form id="form-privilege-system-api" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>
                    {/* Email */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('system_admin.privilege_system_api.table.email')}</label>
                        <input className="form-control" type="text" placeholder={translate('system_admin.privilege_system_api.placeholder.input_email')} value={email} onChange={(e) => handleChangeEmail(e)} />
                    </div>

                    {/* API */}
                    <div className="form-group">
                        <label className="control-label">{translate('system_admin.system_api.table.path')}</label>
                        <SelectBox
                            id={`create-privilege-api-modal-path`}
                            className="form-control"
                            style={{ width: "100%" }}
                            items={listPaginateApi?.length > 0 ? listPaginateApi.map(item => {
                                return {
                                    value: item?._id,
                                    text: item?.path
                                }
                            }) : []}
                            multiple={true}
                            value={apis}
                            onChange={handleSystemApi}
                            onSearch={onSearchSystemApi}
                        />
                    </div>

                    {/* Company */}
                    <div className="form-group">
                        <label className="control-label">{translate('system_admin.company.table.name')}</label>
                        <SelectBox
                            id={`create-privilege-api-modal-company`}
                            className="form-control"
                            style={{ width: "100%" }}
                            items={listPaginateCompany?.length > 0 ? listPaginateCompany.map(item => {
                                return {
                                    value: item?._id,
                                    text: item?.name
                                }
                            }) : []}
                            value={companyId}
                            onChange={handleCompany}
                        />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );

}

function mapState(state) {
    const { systemApis, company } = state
    return { systemApis, company }
}

const actionCreators = {
    getSystemApis: SystemApiActions.getSystemApis,
    createPrivilegeApi: PrivilegeApiActions.createPrivilegeApi
};

const connectedPrivilegeApiCreateModal = connect(mapState, actionCreators)(withTranslate(PrivilegeApiCreateModal));
export { connectedPrivilegeApiCreateModal as PrivilegeApiCreateModal };
