import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DatePicker, DialogModal, QuillEditor, SelectBox } from '../../../../../common-components';

import { SystemApiActions } from '../../system-api-management/redux/actions'
import { PrivilegeApiActions } from '../redux/actions'

function PrivilegeApiCreateModal(props) {
    const { translate, systemApis, company } = props;

    const [state, setState] = useState({
        email: null,
        description: '',
        description: null,
        unlimitedExpirationTime: true,
        startDate: '',
        startDate: '',
        apis: [],
        companyId: null
    });

    const { email, apis, companyId } = state;

    let listPaginateApi = systemApis?.listPaginateApi
    let listPaginateCompany = company?.listPaginate

    useEffect(() => {
        props.getSystemApis({
            page: 1,
            perPage: 10000
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

    const handleChangeDescription = (value, imgs) => {
        setState({
            ...state,
            description: value.replace(/<[^>]*>/g, ''),
        });
    }

    const handleOnChangeUnlimitedExpirationTimeCheckbox = (e) => {
        setState({
            ...state,
            unlimitedExpirationTime: !state.unlimitedExpirationTime,
        })
    }

    const handleEnterStartDate = (value) => {
        setState({
            ...state,
            startDate: value
        })
    }

    const handleEnterEndDate = (value) => {
        setState({
            ...state,
            endDate: value
        })
    }

    const checkAll = (e) => {
        const { checked } = e.target;
        let arr = [];

        if (checked) {
            if (listPaginateApi?.length > 0)
                listPaginateApi.map(api => arr.push(api?._id));
            setState({
                ...state,
                apis: arr,
            })
        } else {
            setState({
                ...state,
                apis: [],
            })
        }
    }

    const handleCheckbox = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setState({
                ...state,
                apis: [
                    ...state.apis,
                    value
                ]
            });
        } else {
            const arr = apis;
            const index = arr.indexOf(value);

            arr.splice(index, 1);
            setState({
                ...state,
                apis: arr
            })
        }
    }

    const checkedCheckbox = (item, arr) => {
        let index = arr?.indexOf(item);
        if (index !== -1) {
            return true;
        } else {
            return false;
        }
    }

    const handleSubmit = () => {
        let requestBody = {
            email: email,
            apis: apis,
            companyId: companyId,
            role: 'system_admin',
            description: state.description,
            unlimitedExpirationTime: state.unlimitedExpirationTime,
        }

        if (!state.unlimitedExpirationTime) {
            requestBody = {
                ...requestBody,
                startDate: state.startDate,
                endDate: state.endDate,
            }
        }

        props.createPrivilegeApi(requestBody);
        window.$("#privilege-system-api-modal").modal("hide");
    }

    // const onSearchSystemApi = (textSearch) => {
    //     props.getSystemApis({
    //         path: textSearch,
    //         page: 1,
    //         perPage: 20
    //     })
    // }

    const renderApiList = () => {
        let apiCategory = 'placeholder';
        let isNextCategory = false;

        return listPaginateApi.map(api => {
            if (!api.path.startsWith(apiCategory)) {
                apiCategory = '/' + api.path.split('/')[1];
                isNextCategory = true;
            } else {
                isNextCategory = false;
            }

            return (
                <>
                    {isNextCategory &&
                        <>
                            <tr>
                                <td colspan="3" style={{
                                    textAlign: 'left',
                                }}></td>
                            </tr>
                            <tr>
                                <td colspan="3" style={{
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                }}>Path: <span>{apiCategory}</span></td>
                            </tr>
                        </>}

                    <tr key={api._id}>
                        <td>
                            <input
                                type="checkbox"
                                value={api._id}
                                onChange={handleCheckbox}
                                checked={checkedCheckbox(api._id, apis)}
                            />
                        </td>
                        <td>{api.path}</td>
                        <td>{api.method}</td>
                    </tr>
                </>
            )
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="privilege-system-api-modal" isLoading={false}
                size="75"
                formID="form-privilege-system-api"
                title={translate('system_admin.system_api.modal.create_title')}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
            >
                {/* Form them phan quyen API */}
                <form id="form-privilege-system-api" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>
                    {/* Email */}
                    <div className="form-group">
                        <label className="form-control-static">{translate('system_admin.privilege_system_api.table.email')}</label>
                        <input className="form-control" type="text" placeholder={translate('system_admin.privilege_system_api.placeholder.input_email')} value={email} onChange={(e) => handleChangeEmail(e)} />
                    </div>

                    {/* Mô tả */}
                    <div className="form-group">
                        <label>{translate('general.description')}</label>
                        <QuillEditor
                            id={`create-registration-api-description-quill`}
                            toolbar={false}
                            getTextData={handleChangeDescription}
                            maxHeight={180}
                            placeholder={translate('system_admin.system_api.placeholder.input_description')}
                        />
                    </div>

                    <td>
                        <input
                            style={{ marginBottom: 10 }}
                            type="checkbox"
                            checked={state.unlimitedExpirationTime}
                            onChange={handleOnChangeUnlimitedExpirationTimeCheckbox}
                        />
                        Unlimited expiration time
                    </td>

                    {!state.unlimitedExpirationTime &&
                        (<div className="row">
                            {/* Start date */}
                            <div className="form-group col-xs-12 col-sm-6">
                                <label>{translate('system_admin.privilege_system_api.table.startDate')}</label>
                                <DatePicker
                                    id={`datepicker-startDate`}
                                    dateFormat="day-month-year"
                                    value={state.startDate}
                                    onChange={handleEnterStartDate}
                                />
                            </div>

                            {/* End date */}
                            <div className="form-group col-xs-12 col-sm-6">
                                <label>{translate('system_admin.privilege_system_api.table.endDate')}</label>
                                <DatePicker
                                    id={`datepicker-endDate`}
                                    value={state.endDate}
                                    onChange={handleEnterEndDate}
                                />
                            </div>

                        </div>)
                    }

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

                    {/* API */}
                    <fieldset className="scheduler-border" style={{ minHeight: '300px' }}>
                        <legend className="scheduler-border">{translate('system_admin.company.service')}</legend>

                        <table className="table table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th style={{ width: '32px' }} className="col-fixed">
                                        <input
                                            type="checkbox"
                                            onChange={checkAll}
                                        />
                                    </th>
                                    <th>{translate('system_admin.system_api.table.path')}</th>
                                    <th>{translate('system_admin.system_api.table.method')}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    listPaginateApi?.length > 0
                                        ? renderApiList()
                                        : apis.isLoading
                                            ? <tr><td colSpan={4}>{translate('general.loading')}</td></tr>
                                            : <tr><td colSpan={4}>{translate('general.no_data')}</td></tr>
                                }
                            </tbody>
                        </table>
                    </fieldset>
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
