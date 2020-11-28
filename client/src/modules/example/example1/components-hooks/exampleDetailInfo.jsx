import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';

import { exampleActions } from '../../example2/redux/actions';

import { DialogModal } from '../../../../common-components';

const ExampleDetailInfo = (props) => {

    const { translate, example } = props;
    let currentDetailExample;

    if (example) {
        currentDetailExample = example.currentDetailExample;
    }

    useEffect(() => {
        props.exampleId && props.getExampleDetail(props.exampleId);
    }, [props.exampleId])

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
                    <div className={`form-group`}>
                        <label>{translate('manage_example.exampleName')}:</label>
                        <span> {currentDetailExample && currentDetailExample.exampleName}</span>
                    </div>
                    <div className={`form-group`}>
                        <label>{translate('manage_example.description')}:</label>
                        <span> {currentDetailExample && currentDetailExample.description}</span>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const example = state.example2;
    return { example };
}

const mapDispatchToProps = {
    getExampleDetail: exampleActions.getExampleDetail
}

const connectedExampleDetailInfo = React.memo(connect(mapStateToProps, mapDispatchToProps)(withTranslate(ExampleDetailInfo)));
export { connectedExampleDetailInfo as ExampleDetailInfo }