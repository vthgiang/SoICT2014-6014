import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal } from '../../../../../common-components';
import { kpiTemplateActions } from '../redux/actions';
import { EditKpiTemplate } from './editKpiTemplate';

function ModalEditKpiTemplate(props) {
    console.log('kpi', props)

    const [state, setState] = useState({
        currentRole: localStorage.getItem('currentRole'),
        templateData: {
            organizationalUnit: '',
            name: '',
            description: '',
            kpis: [],
        },
    })

    useEffect(() => {
        if (props.kpiTemplateId !== state.kpiTemplateId) {
            console.log('run efffect')
            setState(state => {
                return {
                    ...state,
                    kpiTemplateId: props.kpiTemplateId,
                    kpiTemplate: props.kpiTemplate,
                    templateData: {
                        _id: props.kpiTemplate._id,
                        organizationalUnit: props.kpiTemplate.organizationalUnit._id,
                        name: props.kpiTemplate.name,
                        description: props.kpiTemplate.description,
                        kpis: props.kpiTemplate.kpis,
                    },
                    showActionForm: true,
                }
            })
        }
    }, [props.kpiTemplateId, props.kpiTemplate])

    const handleSubmit = () => {
        const { templateData } = state;
        console.log(templateData);
        props.editKpiTemplate(props.kpiTemplateId, templateData);
    }


    const onChangeTemplateData = (value) => {
        console.log(50, value);

        setState({
            ...state,
            templateData: value
        })
    }

    const { department, user, translate, kpitemplates } = props;
    const { templateData, kpiTemplateId } = state;

    return (
        <DialogModal
            modalID="modal-edit-kpi-template" isLoading={user.isLoading}
            formID="form-edit-kpi-template"
            title={"Chỉnh sửa mẫu KPI"}
            func={handleSubmit}
            // disableSubmit={!isKpiTemplateFormValidated()}
            size={100}
        >
            <React.Fragment>
                <EditKpiTemplate
                    isKpiTemplate={true}
                    kpiTemplate={templateData}
                    kpiTemplateId={kpiTemplateId}
                    onChangeTemplateData={onChangeTemplateData}
                />
            </React.Fragment>
        </DialogModal>
    );
}

function mapState(state) {
    const { department, user, kpitemplates } = state;
    return { department, user, kpitemplates };
}

const actionCreators = {
    editKpiTemplate: kpiTemplateActions.editKpiTemplate,
};
const connectedModalEditKpiTemplate = connect(mapState, actionCreators)(withTranslate(ModalEditKpiTemplate));
export { connectedModalEditKpiTemplate as ModalEditKpiTemplate };
