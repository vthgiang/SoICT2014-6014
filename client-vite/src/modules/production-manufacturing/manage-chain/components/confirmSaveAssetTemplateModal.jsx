import React, { useState } from "react";
import { withTranslate } from "react-redux-multilingual";
import { connect } from 'react-redux';

import ValidationHelper from '../../../../helpers/validationHelper'
import { ManagerChainActions } from './../redux/actions';
import { DialogModal, ErrorLabel } from "../../../../common-components";

const ConfirmSaveAssetTemplateModal = (props) => {

    let {saveAssetTemplate, processTemplateId, translate} = props;

    const [state, setState] = useState({
        templateName: "",
        errorTemplateNameValidate: {
            message: undefined,
            status: true
        }
    })

    const isFormValidate = () => {
        return !state.errorTemplateNameValidate.status;
    }

    const save = () => {
        let listTaskTemplateSelected = saveAssetTemplate;
        let listTask = [];
        if (listTaskTemplateSelected.length !== 0) {
            listTaskTemplateSelected.map((item) => {
                let task = {
                    taskCodeId: item.taskCodeId,
                    taskName: item.name,
                    taskTimeSchedule: item.taskTimeSchedule ? item.taskTimeSchedule : 0,
                    taskDescription: item.taskDescription ? item.taskDescription : "",
                    listActivityAsset: item.listAssetTask ? item.listAssetTask : []
                };
                listTask.push(task)
            })
            let newAssetTemplate = {
                assetTemplateName: state.templateName,
                processTemplate: processTemplateId,
                listTask: listTask,
                isTemplateAsset: true
            }
            props.createAssetTemplate(newAssetTemplate);
        }
    }

    const handleChangeAssetTemplateName = (event) => {
        let value = event.target.value;
        let errorNameValidate = ValidationHelper.validateName(translate, value, 6, 255);
        setState({
            templateName: value,
            errorTemplateNameValidate: errorNameValidate
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID={`confirm-create-asset-template`}
                isLoading={false}
                formID={`confirm-create-asset-template`}
                title="Xác nhận tạo mẫu tài sản công việc"
                disableSubmit={isFormValidate()}
                func={save}
                size="50"
                width="100"
            >
                <div className={`form-group ${state.errorTemplateNameValidate.status ? "" : "has-error"}`}>
                    <label className="control-label">Tên mẫu công việc: <span className="text-red">*</span></label>
                    <input className="form-control" type="text" onChange={(event) => handleChangeAssetTemplateName(event)}></input>
                    <ErrorLabel content={state.errorTemplateNameValidate.message} />
                </div>
            </DialogModal>
        </React.Fragment>
    )
}

const mapStateToProps = state => {

}

const mapDispatchToProps = {
    createAssetTemplate: ManagerChainActions.createAssetTemplate
}

const connectConfirmSaveAssetTemplateModal = connect(mapStateToProps, mapDispatchToProps)(withTranslate(ConfirmSaveAssetTemplateModal))
export { connectConfirmSaveAssetTemplateModal as ConfirmSaveAssetTemplateModal }