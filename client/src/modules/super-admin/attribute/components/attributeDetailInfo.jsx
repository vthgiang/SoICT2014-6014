import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { DialogModal } from '../../../../common-components';

const AttributeDetailInfo = (props) => {
    const [state, setState] = useState({
        attributeID: undefined,
    })

    const { translate, attribute } = props;
    const { attributeID } = state;

    // Nhận giá trị từ component cha
    if (props.attributeID !== attributeID || props.attributeName !== state.attributeName || props.description !== state.description || props.type !== state.type) {
        setState({
            ...state,
            attributeID: props.attributeID,
            attributeName: props.attributeName,
            description: props.description,
            type: props.type
        })
    }

    const { attributeName, description, type } = state

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-info-attribute-hooks`} isLoading={attribute.isLoading}
                title={translate('manage_attribute.detail_info_attribute')}
                formID={`form-detail-attribute-hooks`}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-detail-attribute-hooks`}>
                    {/* Tên ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_attribute.attributeName')}:</label>
                        <span> {attributeName}</span>
                    </div>

                    <div className={`form-group`}>
                        <label>{translate('manage_attribute.add_type')}:</label>
                        <span> {translate("manage_attribute.type" + "." + type)}</span>
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_attribute.description')}:</label>
                        <span> {description}</span>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const attribute = state.attribute;
    return { attribute };
}

const connectedAttributeDetailInfo = React.memo(connect(mapStateToProps, null)(withTranslate(AttributeDetailInfo)));
export { connectedAttributeDetailInfo as AttributeDetailInfo }