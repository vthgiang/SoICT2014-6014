import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import withTranslate from 'react-redux-multilingual/lib/withTranslate';
import { RequestActions } from '../../../../production/common-production/request-management/redux/actions';
import { ButtonModal, DatePicker, DialogModal, ErrorLabel, SelectBox } from '../../../../../common-components';

function RetrainingModel(props) {
    const { parameterConfigurationValues, handleInputChange, handleInitDeliveryPlan, isProgress, handleChangeEstimatedDeliveryDate } = props;
    const [state, setState] = useState({
    });

    useEffect(() => {
        // Code to handle modal visibility when `showModal` prop changes
        if (props.showModal) {
            // Code to show modal
        }
    }, [props.showModal]);

    // Function to handle modal visibility
    const handleShowModal = () => {
        props.setShowModal(true); // Call setShowModal function passed from parent component
    }

    const { translate, bigModal } = props;

    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-retraining-model"
                title="Huấn luyện lại mô hình"
                size={bigModal ? 75 : 50}
                maxWidth={900}
                handleShowModal
            >
                <div className="box-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <div className="algorithm-run-time form-group">
                                        <label>n_estimators</label>
                                        <input className="form-control" type="number" value={60} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <div className="algorithm-run-time form-group">
                                        <label>max_depth</label>
                                        <input className="form-control" type="number" value={3} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <div className="algorithm-run-time form-group">
                                        <label>min_samples_leaf</label>
                                        <input className="form-control" type="number" value={1} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogModal>
        </React.Fragment >
    );
}

const mapStateToProps = (state) => {
};

export default connect(mapStateToProps)(withTranslate(RetrainingModel));