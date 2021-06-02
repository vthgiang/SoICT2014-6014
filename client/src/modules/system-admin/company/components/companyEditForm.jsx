import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { CompanyActions } from '../redux/actions';
import ValidationHelper from '../../../../helpers/validationHelper';
import { ErrorLabel, DialogModal } from '../../../../common-components';

function CompanyEditForm(props) {

    const [state, setState] = useState({})

    useEffect(() => {
        if (props.companyId !== state.companyId) {
            setState({
                ...state,
                companyId: props.companyId,
                companyName: props.companyName,
                companyShortName: props.companyShortName,
                companyDescription: props.companyDescription,
                companyLog: props.companyLog,
                companyLinks: props.companyLinks,
                companyActive: props.companyActive,
                companyEmail: props.companyEmail,
                nameError: undefined,
                shortNameError: undefined,
                descriptionError: undefined,
                emailError: undefined
            })
        }
    }, [props.companyId])

    // Luu du lieu ve cong ty
    const save = () => {
        const data = {
            name: state.companyName,
            shortName: state.companyShortName,
            log: state.companyLog,
            description: state.companyDescription,
            email: state.companyEmail,
            active: state.companyActive
        };

        if (isFormValidated()) {
            return props.editCompany(state.companyId, data);
        }
    }

    // Xu ly handle log va active
    const handleActive = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            companyActive: value
        });
    }

    const handleLog = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            companyLog: value
        });
    }

    const handleChangeName = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateName(translate, value, 4, 255);
        setState({
            ...state,
            companyName: value,
            nameError: message
        });
    }

    const handleChangeDescription = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateDescription(translate, value);
        setState({
            ...state,
            companyDescription: value,
            descriptionError: message
        });
    }

    const handleChangeEmail = (e) => {
        let { value } = e.target;
        let { translate } = props;
        let { message } = ValidationHelper.validateEmail(translate, value);
        setState({
            ...state,
            companyEmail: value,
            emailError: message
        });
    }

    const isFormValidated = () => {
        let { companyName, companyShortName, companyDescription, companyEmail } = state;
        let { translate } = props;
        if (
            !ValidationHelper.validateName(translate, companyName).status ||
            !ValidationHelper.validateName(translate, companyShortName).status ||
            !ValidationHelper.validateEmail(translate, companyEmail).status ||
            !ValidationHelper.validateDescription(translate, companyDescription).status
        ) return false;
        return true;
    }

    const { translate, company } = props;
    const {
        // Phần edit nội dung của công ty
        companyName,
        companyShortName,
        companyDescription,
        companyLog,
        companyActive,
        companyEmail,
        nameError,
        shortNameError,
        descriptionError,
        emailError,
    } = state;

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-edit-company"
                formID="form-edit-company" isLoading={company.isLoading}
                title={translate('system_admin.company.edit')}
                func={save}
                disableSubmit={!isFormValidated()}
            >
                <form id="form-edit-company">
                    <div className="row">
                        <div className={`form-group col-sm-9 ${nameError === undefined ? "" : "has-error"}`}>
                            <label>{translate('system_admin.company.table.name')}<span className="text-red"> * </span></label>
                            <input type="text" className="form-control" onChange={handleChangeName} value={companyName} />
                            <ErrorLabel content={nameError} />
                        </div>
                        <div className="form-group col-sm-3">
                            <label>{translate('system_admin.company.table.service')}<span className="text-red"> * </span></label>
                            <select className="form-control" onChange={handleActive} value={companyActive}>
                                <option key='1' value={true}>{translate('system_admin.company.on')}</option>
                                <option key='2' value={false}>{translate('system_admin.company.off')}</option>
                            </select>
                        </div>

                        <div className={`form-group col-sm-9 ${shortNameError === undefined ? "" : "has-error"}`}>
                            <label>{translate('system_admin.company.table.short_name')}</label>
                            <input type="text" className="form-control" value={companyShortName} disabled={true} />
                            <ErrorLabel content={shortNameError} />
                        </div>
                        <div className="form-group col-sm-3">
                            <label>{translate('system_admin.company.table.log')}<span className="text-red"> * </span></label>
                            <select className="form-control" onChange={handleLog} value={companyLog}>
                                <option key='1' value={true}>{translate('system_admin.company.on')}</option>
                                <option key='2' value={false}>{translate('system_admin.company.off')}</option>
                            </select>
                        </div>
                    </div>

                    <div className={`form-group ${emailError === undefined ? "" : "has-error"}`}>
                        <label>{translate('system_admin.company.table.super_admin')}<span className="text-red"> * </span></label>
                        <input type="email" className="form-control" onChange={handleChangeEmail} value={companyEmail} />
                        <ErrorLabel content={emailError} />
                    </div>
                    <div className={`form-group ${descriptionError === undefined ? "" : "has-error"}`}>
                        <label>{translate('system_admin.company.table.description')}<span className="text-red"> * </span></label>
                        <textarea type="text" className="form-control" onChange={handleChangeDescription} value={companyDescription} />
                        <ErrorLabel content={descriptionError} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { linksDefault, company } = state;
    return { linksDefault, company };
}
const action = {
    editCompany: CompanyActions.editCompany
}

const connectedCompanyEditForm = connect(mapState, action)(withTranslate(CompanyEditForm))
export { connectedCompanyEditForm as CompanyEditForm }
