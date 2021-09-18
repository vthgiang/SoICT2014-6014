import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal, QuillEditor } from '../../../../../common-components';

import { PrivilegeApiActions } from '../../../../system-admin/system-api/system-api-privilege/redux/actions';
import { ApiActions } from '../../api-management/redux/actions'

function CreateApiRegistrationModal(props) {
    const { translate, apis } = props;

    const [state, setState] = useState({
        companyId: localStorage.getItem("companyId"),
        email: null,
        name: null,
        description: null,
        registrationApis: [],
        registrationApisCategory: [],
    });

    const { email, name, companyId, description, registrationApis, registrationApisCategory } = state;

    useEffect(() => {
        props.getApis({
            page: 1,
            perPage: 100000,
            special: "group"
        })
    }, [])

    const handleChangeEmail = (e) => {
        setState({
            ...state,
            email: e.target.value
        })
    }

    const handleChangeName = (e) => {
        setState({
            ...state,
            name: e.target.value
        })
    }

    const checkAll = (e) => {
        const { checked } = e.target;
        let arr = [], arrCategory = []

        if (checked) {
            if (apis?.listPaginateApi?.length > 0) {
                apis.listPaginateApi.map(category => {
                    arrCategory.push(category?._id)

                    if (category?.apis?.length > 0) {
                        category.apis.map(item => {
                            arr.push(item?._id)
                        })
                    }
                })
            }

            setState({
                ...state,
                registrationApis: arr,
                registrationApisCategory: arrCategory
            })
        } else {
            setState({
                ...state,
                registrationApis: [],
                registrationApisCategory: []
            })
        }
    }

    const handleCheckboxCategory = (e) => {
        const { value, checked } = e.target;
        let arr = registrationApis;

        if (checked) {
            if (apis?.listPaginateApi?.length > 0) {
                let lists = apis.listPaginateApi.filter(item => item?._id === value)
                if (lists?.[0]?.apis?.length > 0) {
                    lists[0].apis.map(item => {
                        arr.push(item?._id)
                    })
                }
            }

            setState({
                ...state,
                registrationApis: Array.from(new Set(arr)),
                registrationApisCategory: [
                    ...state.registrationApisCategory,
                    value
                ]
            })
        } else {
            if (apis?.listPaginateApi?.length > 0) {
                let lists = apis.listPaginateApi.filter(item => item?._id === value)
                if (lists?.[0]?.apis?.length > 0) {
                    lists[0].apis.map(item => {
                        let index = arr.indexOf(item?._id);
                        arr.splice(index, 1);
                    })
                }
            }

            let arrCategory = registrationApisCategory;

            let index = arrCategory.indexOf(value);
            arrCategory.splice(index, 1);

            setState({
                ...state,
                registrationApis: arr,
                registrationApisCategory: arrCategory
            })
        }
    }

    const handleCheckbox = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setState({
                ...state,
                registrationApis: [
                    ...state.registrationApis,
                    value
                ]
            });
        } else {
            const arr = registrationApis;
            const index = arr.indexOf(value);

            arr.splice(index, 1);
            setState({
                ...state,
                registrationApis: arr
            })
        }
    }

    const checkedCheckboxCategory = (item, arr) => {
        let index = arr?.indexOf(item);
        if (index !== -1) {
            return true;
        } else {
            return false;
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

    const handleChangeDescription = (value, imgs) => {
        setState({
            ...state,
            description: value,
        });
    }

    const handleSubmit = () => {
        props.createPrivilegeApi({
            email: email,
            name: name,
            description: description,
            companyId: companyId,
            apis: registrationApis,
            role: 'admin'
        })
        window.$("#create-api-registration-modal").modal("hide");
    }

    let listApi = apis?.listPaginateApi

    return (
        <React.Fragment>
            <DialogModal
                modalID="create-api-registration-modal" isLoading={false}
                size="75"
                formID="form-create-api-registration"
                title={translate('system_admin.system_api.modal.create_title')}
                msg_success={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success')}
                msg_failure={translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.failure')}
                func={handleSubmit}
            >
                {/* Form them phan quyen API */}
                <form id="form-create-api-registration" className="qlcv" onSubmit={() => handleSubmit(translate('kpi.organizational_unit.create_organizational_unit_kpi_set_modal.success'))}>
                    <div className="row">
                        {/* Email */}
                        <div className="form-group col-xs-12 col-sm-6">
                            <label>{translate('system_admin.privilege_system_api.table.email')}</label>
                            <input className="form-control" type="text" placeholder={translate('system_admin.privilege_system_api.placeholder.input_email')} value={email} onChange={(e) => handleChangeEmail(e)} />
                        </div>

                        {/* Name */}
                        <div className="form-group col-xs-12 col-sm-6">
                            <label>{translate('auth.profile.name')}</label>
                            <input className="form-control" type="text" placeholder={translate('auth.profile.input_name')} value={name} onChange={(e) => handleChangeName(e)} />
                        </div>
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
                                    <th>{translate('system_admin.system_link.table.category')}</th>
                                    <th>{translate('system_admin.system_api.table.path')}</th>
                                    <th>{translate('system_admin.system_api.table.method')}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    listApi?.length > 0 
                                        ? listApi.map(category => {
                                            return <>
                                                <tr key={category?._id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            value={category._id}
                                                            onChange={handleCheckboxCategory}
                                                            checked={checkedCheckboxCategory(category._id, registrationApisCategory)}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "left" }}><strong>{category?._id}</strong></td>
                                                </tr>
                                                {category?.apis?.length > 0 && category.apis.map(api => 
                                                    <tr key={api._id}>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                value={api._id}
                                                                onChange={handleCheckbox}
                                                                checked={checkedCheckbox(api._id, registrationApis)}
                                                            />
                                                        </td>
                                                        <td>{api.category}</td>
                                                        <td>{api.path}</td>
                                                        <td>{api.method}</td>
                                                    </tr>
                                                )}
                                            </>
                                        }) 
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
    const { apis } = state
    return { apis }
}

const actionCreators = {
    getApis: ApiActions.getApis,
    createPrivilegeApi: PrivilegeApiActions.createPrivilegeApi
};

const connectedCreateApiRegistrationModal = connect(mapState, actionCreators)(withTranslate(CreateApiRegistrationModal));
export { connectedCreateApiRegistrationModal as CreateApiRegistrationModal };
