import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DialogModal, SelectBox } from '../../../../common-components';
import { ExternalServiceConsumerActions } from '../redux/actions';

function ExternalServiceConsumerEditModal(props) {
    const { translate, externalServiceConsumer } = props;

    const [state, setState] = useState({
        id: null,
        name: '',
        description: '',
        attributes: '',
    });

    const { id, name, description, attributes } = state;

    useEffect(() => {
        async function init() {
            setState({
                id: externalServiceConsumer?.id,
                name: externalServiceConsumer?.name,
                description: externalServiceConsumer?.description,
                attributes: JSON.stringify(externalServiceConsumer?.attributes, null, 2),
            })
        }
        init();
    }, [externalServiceConsumer])

    const handleChangeName = (e) => {
        setState({
            ...state,
            name: e.target.value
        })
    }

    const handleChangeDescription = (e) => {
        setState({
            ...state,
            description: e.target.value
        })
    }

    const handleChangeAttributes = (value) => {
        setState({
            ...state,
            attributes: value.target.value
        })
    }

    const handleSubmit = () => {
        props.editExternalServiceConsumer(id, {
            name: name,
            description: description,
            attributes: JSON.parse(attributes),
        })
        window.$("#update-external-service-consumer-modal").modal("hide");
    }

    return (
        <React.Fragment>
            <DialogModal
                modalID="update-external-service-consumer-modal" isLoading={false}
                formID="form-update-external-service-consumer"
                title={translate('system_admin.external_service_consumer.modal.update_title')}
                msg_success="Cập nhật thành công"
                msg_failure="Cập nhật thất bại"
                func={handleSubmit}
            >
                {/* Form them API */}
                <form id="form-update-external-service-consumer" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group">
                        <label>{translate('system_admin.external_service_consumer.table.name')}</label>
                        <input className="form-control" type="text" name="name" value={name} onChange={handleChangeName} />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>{translate('system_admin.external_service_consumer.table.description')}</label>
                        <input className="form-control" type="text" name="name" value={description} onChange={handleChangeDescription} />
                    </div>

                    <div className={`form-group`}>
                        <label>{translate('system_admin.external_service_consumer.table.attributes')}</label>
                        <textarea className="form-control" rows="20" name="name" value={attributes} onChange={handleChangeAttributes} />
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { } = state;
    return {};
}

const actionCreators = {
    editExternalServiceConsumer: ExternalServiceConsumerActions.editExternalServiceConsumer
};

export default connect(mapState, actionCreators)(withTranslate(ExternalServiceConsumerEditModal))
