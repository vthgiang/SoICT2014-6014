import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel } from '../../../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../../../helpers/validationHelper';

import { TransportGeneralInfo } from '../create-transport-requirements/transportGeneralInfo';
import { TransportGoodsAndTime} from '../create-transport-requirements/transportGoodsAndTime'

import { exampleActions } from '../../redux/actions';

function TransportRequirementsCreateForm(props) {

    // Khởi tạo state
    const [state, setState] = useState({
        exampleName: "",
        description: "",
        exampleNameError: {
            message: undefined,
            status: true
        },
        step: 0,
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


    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
     */
    const save = () => {
        if (isFormValidated() && exampleName) {
            props.createExample([{ exampleName, description }]);
            props.getExamples({
                exampleName: "",
                page: page,
                perPage: perPage
            });
        }
    }


    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    const handleExampleName = (e) => {
        const { value } = e.target;
        let result = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            exampleName: value,
            exampleNameError: result
        })
    }

    const setCurrentStep = (e, step) => {
        e.preventDefault();
        setState({
            ...state,
            step: step,
        });
    }
    // useEffect(() => {
    //     console.log(state, '- Has changed')
    // },[state])

    return (
        <React.Fragment>
            <ButtonModal
                    // onButtonCallBack={this.handleClickCreateCode}
                    modalID={"modal-create-transport-requirements"}
                    button_name={"Yêu cầu vận chuyển mới"}
                    title={"Yêu cầu vận chuyển mới"}
            />
            <DialogModal
                modalID="modal-create-transport-requirements" 
                isLoading={false}
                formID="form-create-transport-requirements"
                title={translate('manage_transport.add_requirements')}
                msg_success={translate('manage_example.add_success')}
                msg_faile={translate('manage_example.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={100}
                maxWidth={500}
            >
                <form id="form-create-transport-requirements" onSubmit={() => save(translate('manage_example.add_success'))}>
                    {/* Tên ví dụ */}
                    {/* <div className={`form-group ${exampleNameError.status ? "" : "has-error"}`}>
                        <label>{"Tên khách hàng"}<span className="text-red">*</span></label>
                        <input type="text" className="form-control" value={exampleName} onChange={handleExampleName}></input>
                        <ErrorLabel content={exampleNameError.message} />
                    </div> */}
                    <ul className="breadcrumbs">
                        <li key="1">
                            <a
                                className={`${state.step >= 0 ? "quote-active-tab" : "quote-defaul-tab"}`}
                                onClick={(e) => setCurrentStep(e, 0)}
                                style={{ cursor: "pointer" }}
                            >
                                <span>Thông tin vận chuyển</span>
                            </a>
                        </li>
                        <li key="2">
                            <a
                                className={`${state.step >= 1 ? "quote-active-tab" : "quote-defaul-tab"} 
                                `}
                                onClick={(e) => setCurrentStep(e, 1)}
                                style={{ cursor: "pointer" }}
                            >
                                <span>Thông tin hàng hóa và thời gian</span>
                            </a>
                        </li>
                        <li key="3">
                            <a
                                className={`${state.step >= 2 ? "quote-active-tab" : "quote-defaul-tab"} `}
                                onClick={(e) => setCurrentStep(e, 2)}
                                style={{ cursor: "pointer" }}
                            >
                                <span>Xác nhận yêu cầu</span>
                            </a>
                        </li>
                    </ul>
                
                    {
                        state.step === 0 && (
                            <TransportGeneralInfo />
                        )
                    }
                    {
                        state.step === 1 && (
                            <TransportGoodsAndTime />
                        )
                    }
                </form>
            </DialogModal>
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

const connectedTransportRequirementsCreateForm = connect(mapState, actions)(withTranslate(TransportRequirementsCreateForm));
export { connectedTransportRequirementsCreateForm as TransportRequirementsCreateForm };