import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, DatePicker, SelectBox } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { TransportGeneralInfoShip } from './transportGeneralInfoShip';

import { exampleActions } from '../../redux/actions';

function TransportGeneralInfo(props) {
    const requirements = [
        {
            value: "0",
            text: "-Chọn loại yêu cầu-"
        },
        {
            value: "1",
            text: "Giao hàng"
        },
        {
            value: "2",
            text: "Trả hàng"
        }
    ];
    // Khởi tạo state
    const [state, setState] = useState({
        value: "1",
    })



    const { translate, example, page, perPage } = props;
    const { exampleName, description, exampleNameError } = state;


    /**
     * Hàm dùng để kiểm tra xem form đã được validate hay chưa
     */
    const isFormValidated = () => {
        if (!exampleNameError.status) {
            return false;
        }
        return true;
    }

    const handleTypeRequirementChange = (value) => {
        if (value[0] !== "0") {
            setState({
                value: value[0],
            });
        }
    }


    useEffect(() => {
        console.log(state, '- Has changed')
    },[state])

    return (
        <React.Fragment>
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <div className={`form-group`}>
                    <label>
                        Loại yêu cầu
                        <span className="attention"> * </span>
                    </label>
                    <SelectBox
                        id={`select-type-requirement`}
                        className="form-control select2"
                        style={{ width: "100%" }}
                        value={"0"}
                        items={requirements}
                        onChange={handleTypeRequirementChange}
                        multiple={false}
                    />
                </div>
            </div>
            {state.value === "1" && ( <TransportGeneralInfoShip />)}
        </React.Fragment>
    );
}

function mapState(state) {
    const example = state.example1;
    return { example }
}

const actions = {
    // createExample: exampleActions.createExample,
    // getExamples: exampleActions.getExamples,
}

const connectedTransportGeneralInfo = connect(mapState, actions)(withTranslate(TransportGeneralInfo));
export { connectedTransportGeneralInfo as TransportGeneralInfo };