import React, { useState } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { DialogModal } from '../../../../common-components';

const ExampleDetailInfo = (props) => {
    const [state, setState] = useState({
        exampleID: undefined,
    })

    const { translate, example } = props;
    const { exampleID } = state;

    // Nhận giá trị từ component cha
    if (props.exampleID !== exampleID) {
        setState({
            ...state,
            exampleID: props.exampleID,
            exampleName: props.exampleName,
            description: props.description,
        })
    }

    const { exampleName, description } = state

    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-info-example-hooks`} isLoading={example.isLoading}
                title={translate('manage_example.detail_info_example')}
                formID={`form-detail-example-hooks`}
                size={50}
                maxWidth={500}
                hasSaveButton={false}
                hasNote={false}
            >
                <form id={`form-detail-example-hooks`}>
                    {/* Tên ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_example.exampleName')}:</label>
                        <span> {exampleName}</span>
                    </div>

                    {/* Mô tả ví dụ */}
                    <div className={`form-group`}>
                        <label>{translate('manage_example.description')}:</label>
                        <span> {description}</span>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const example = state.example1;
    return { example };
}

const connectedExampleDetailInfo = React.memo(connect(mapStateToProps, null)(withTranslate(ExampleDetailInfo)));
export { connectedExampleDetailInfo as ExampleDetailInfo }