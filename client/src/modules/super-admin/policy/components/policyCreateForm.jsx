import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { ButtonModal, DialogModal, ErrorLabel, AttributeTable } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import ValidationHelper from '../../../../helpers/validationHelper';
import { AttributeActions } from '../../attribute/redux/actions';
import { PolicyActions } from '../redux/actions';

function PolicyCreateForm(props) {

    // Khởi tạo state
    const [state, setState] = useState({
        policyName: "",
        description: "",
        policyNameError: {
            message: undefined,
            status: true
        },
        userAttributes: [],
        roleAttributes: [],
        resourceAttributes: [],
        rules:
        {
            subject: [
                {
                    userAttributes: [
                        {
                            attributeId: '623949d57486a13b2c35bff9',
                            name: 'projectA', // tên thuộc tính
                            value: 'testUA', //giá trị
                        },
                        {
                            attributeId: '62396cbaf93ca054c485d967',
                            name: 'projectB', // tên thuộc tính
                            value: 'testUA', //giá trị
                        }
                    ],
                    roleAttributes: [
                        {
                            attributeId: '623949d57486a13b2c35bff9',
                            name: 'projectA', // tên thuộc tính
                            value: 'testRoA', //giá trị
                        }
                    ]
                },
                {
                    userAttributes: [
                        {
                            attributeId: '62396cbaf93ca054c485d967',
                            name: 'projectB', // tên thuộc tính
                            value: 'testUA', //giá trị
                        }
                    ],
                    roleAttributes: [
                        {
                            attributeId: '62396cbaf93ca054c485d967',
                            name: 'projectB', // tên thuộc tính
                            value: 'testRoA', //giá trị
                        },
                        {
                            attributeId: '62396cc2f93ca054c485d979',
                            name: 'projectC', // tên thuộc tính
                            value: 'testRoA', //giá trị
                        }
                    ]
                }
            ],
            resource: [
                {
                    resourceAttributes: [
                        {
                            attributeId: '623949d57486a13b2c35bff9',
                            name: 'projectA', // tên thuộc tính
                            value: 'testReA', //giá trị
                        },
                        {
                            attributeId: '62396cc2f93ca054c485d979',
                            name: 'projectC', // tên thuộc tính
                            value: 'testReA', //giá trị
                        }
                    ]
                },
                {
                    resourceAttributes: [
                        {
                            attributeId: '62396cbaf93ca054c485d967',
                            name: 'projectB', // tên thuộc tính
                            value: 'testReA', //giá trị
                        }
                    ]
                }
            ]
        }

    })

    const { translate, policy, page, perPage } = props;
    const { policyName, description, policyNameError, rules, userAttributes, roleAttributes, resourceAttributes } = state;

    const handleChange = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    }

    const handleChangeAddRowAttribute = (name, value) => {
        props.handleChangeAddRowAttribute(name, value)
    }

    useEffect(() => {
        props.getAttribute();
    }, [])
    /**
     * Hàm dùng để kiểm tra xem form đã được validate hay chưa
     */
    const isFormValidated = () => {
        if (!policyNameError.status) {
            return false;
        }
        return true;
    }


    /**
     * Hàm dùng để lưu thông tin của form và gọi service tạo mới ví dụ
     */
    const save = () => {
        if (isFormValidated() && policyName) {
            props.createPolicy([{ policyName, description, rules }]);
            // props.getPolicies({
            //     policyName: "",
            //     page: page,
            //     perPage: perPage
            // });
        }
    }


    /**
     * Hàm xử lý khi tên ví dụ thay đổi
     * @param {*} e 
     */
    const handlePolicyName = (e) => {
        const { value } = e.target;
        let result = ValidationHelper.validateName(translate, value, 6, 255);

        setState({
            ...state,
            policyName: value,
            policyNameError: result
        })
    }


    /**
     * Hàm xử lý khi mô tả ví dụ thay đổi
     * @param {*} e 
     */
    const handlePolicyDescription = (e) => {
        const { value } = e.target;
        setState({
            ...state,
            description: value
        });
    }


    return (
        <React.Fragment>
            <DialogModal
                modalID="modal-create-policy-hooks" isLoading={policy.isLoading}
                formID="form-create-policy-hooks"
                title={translate('manage_policy.add_title')}
                msg_success={translate('manage_policy.add_success')}
                msg_failure={translate('manage_policy.add_fail')}
                func={save}
                disableSubmit={!isFormValidated()}
                size={50}
                maxWidth={500}
            >
                <div className="nav-tabs-custom" style={{ marginTop: '-15px' }}>
                    {/* Nav-tabs */}
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('manage_policy.general_information')} data-toggle="tab" href={`#create_general`}>{translate('manage_policy.general_information')}</a></li>
                        <li><a title={translate('manage_policy.subject_information')} data-toggle="tab" href={`#subject`}>{translate('manage_policy.subject_information')}</a></li>
                        <li><a title={translate('manage_policy.resource_information')} data-toggle="tab" href={`#resource`}>{translate('manage_policy.resource_information')}</a></li>
                    </ul>

                    <div className="tab-content">
                        {/* Thông tin chung */}
                        {/* <GeneralTab
                            id={`create_general`}
                            img={img}
                            avatar={avatar}
                            handleChange={handleChange}
                            handleUpload={handleUpload}
                            assignedToUser={asset.assignedToUser}
                            assignedToOrganizationalUnit={asset.assignedToOrganizationalUnit}
                            usageLogs={usageLogs}
                            status={asset.status}
                            asset={asset}
                            detailInfo={asset.detailInfo}
                        /> */}
                        <div id="create_general" className="tab-pane active">

                            <form id="form-create-policy-hooks" onSubmit={() => save(translate('manage_policy.add_success'))}>
                                {/* Tên ví dụ */}
                                <div className={`form-group ${policyNameError.status ? "" : "has-error"}`}>
                                    <label>{translate('manage_policy.policyName')}<span className="text-red">*</span></label>
                                    <input type="text" className="form-control" value={policyName} onChange={handlePolicyName}></input>
                                    <ErrorLabel content={policyNameError.message} />
                                </div>

                                {/* Mô tả ví dụ */}
                                <div className={`form-group`}>
                                    <label>{translate('manage_policy.policy_description')}</label>
                                    <input type="text" className="form-control" value={description} onChange={handlePolicyDescription}></input>
                                </div>
                            </form>
                        </div>

                        <div id="subject" className="tab-pane">
                            <AttributeTable
                                attributes={userAttributes}
                                handleChange={handleChange}
                                attributeOwner={'userAttributes'}
                                translation={'manage_policy.user'}
                                noDescription={true}
                                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                                i={props.i}
                            />

                            <AttributeTable
                                attributes={roleAttributes}
                                handleChange={handleChange}
                                attributeOwner={'roleAttributes'}
                                translation={'manage_policy.role'}
                                noDescription={true}
                                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                                i={props.i}
                            />
                        </div>

                        <div id="resource" className="tab-pane">
                            <AttributeTable
                                attributes={resourceAttributes}
                                handleChange={handleChange}
                                attributeOwner={'resourceAttributes'}
                                translation={'manage_policy.resource'}
                                noDescription={true}
                                handleChangeAddRowAttribute={handleChangeAddRowAttribute}
                                i={props.i}
                            />
                        </div>
                    </div>
                </div>

            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const policy = state.policy;
    return { policy }
}

const actions = {
    createPolicy: PolicyActions.createPolicy,
    getPolicies: PolicyActions.getPolicies,
    getAttribute: AttributeActions.getAttributes
}

const connectedPolicyCreateForm = connect(mapState, actions)(withTranslate(PolicyCreateForm));
export { connectedPolicyCreateForm as PolicyCreateForm };