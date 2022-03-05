import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import { DialogModal } from '../../../../../common-components';

import { KeyPeopleRequire, ExperienceTab, GeneralTab } from './combinedContent';
import { BiddingPackageManagerActions } from '../redux/actions';
import { MajorActions } from '../../../major/redux/actions';
import { CareerReduxAction } from '../../../career/redux/actions';
import { CertificateActions } from '../../../certificate/redux/actions';
import { KeyPeople } from './keyPeople';
import { UserActions } from '../../../../super-admin/user/redux/actions';

const BiddingPackageEditFrom = (props) => {

    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };

    const [state, setState] = useState({
        dataStatus: DATA_STATUS.NOT_AVAILABLE,
        biddingPackage: {
            name: "",
            name: "",
            code: "",
            startDate: "",
            endDate: "",
            type: "",
            status: "",
            description: "",
            keyPersonnelRequires: [
                {
                    careerPosition: "",
                    majors: "",
                    certificateRequirements: {
                        certificates: [],
                        count: 0
                    }
                }
            ], 
        }
    })

    const mountedRef = useRef(true)

    useEffect(() => {
        const shouldUpdate = async () => {
            if (props._id !== state._id && !props.biddingPackagesManager.isLoading) {
                await props.getDetailBiddingPackage( props._id, {} );
                setState({
                    ...state,
                    _id: props?._id,
                    dataStatus: DATA_STATUS.QUERYING,
                    biddingPackage: ''
                })
            };
            
            if (state.dataStatus === DATA_STATUS.QUERYING && !props.biddingPackagesManager.isLoading) {
                setState({
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE,
                    biddingPackage: props.biddingPackagesManager?.biddingPackageDetail,
                });
            };
        }
        shouldUpdate();
        return () => {
            mountedRef.current = false;
        }
    }, [props._id, props.biddingPackagesManager.isLoading, state.dataStatus]);

    const { translate, biddingPackagesManager, career, major, certificate } = props;

    let { _id, biddingPackage } = state;

    /**
     * Function upload avatar 
     * @param {*} img 
     * @param {*} avatar 
     */
    const handleUpload = (img, avatar) => {
        setState({
            ...state,
            img: img,
            avatar: avatar
        })
    }

    /**
     * Function lưu các trường thông tin vào state
     * @param {*} name : Tên trường
     * @param {*} value : Giá trị của trường
     */
    const handleChange = (name, value) => {
        const { biddingPackage } = state;
        if (name === 'startDate' || name === 'endDate' || name === 'birthdate' || name === 'identityCardDate' || name === 'taxDateOfIssue' || name === 'startDate' || name === 'endDate'
            || name === 'contractEndDate') {
            if (value) {
                let partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            }
        }
        setState({
            ...state,
            biddingPackage: {
                ...biddingPackage,
                [name]: value
            }
        });
    }

    const handleChangeCareerKeyEmployee = (value, index) => {
        setState({
            ...state,
            biddingPackage: {
                ...biddingPackage,
                keyPeople: [state.biddingPackage.keyPeople.map()]
            }
        })
    }

    /**
     * Function kiểm tra các trường bắt buộc phải nhập
     * @param {*} value : Giá trị của trường cần kiểm tra
     */
    const validatorInput = (value) => {
        if (value && value.toString().trim() !== '') {
            return true;
        }
        return false;
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { biddingPackage } = state;
        let result = true;
        if (biddingPackage) {
            result = validatorInput(biddingPackage.name)

            if (biddingPackage.startDate && biddingPackage.endDate) {
                if (new Date(biddingPackage.endDate).getTime() < new Date(biddingPackage.startDate).getTime()) {
                    return false;
                }
            } else if ((biddingPackage.startDate && !biddingPackage.endDate) ||
                (!biddingPackage.startDate && biddingPackage.endDate)) {
                return false;
            }
            if (biddingPackage.endDate && biddingPackage.startDate) {
                if (new Date(biddingPackage.endDate).getTime() < new Date(biddingPackage.startDate).getTime()) {
                    return false;
                }
            } else if (biddingPackage.endDate && !biddingPackage.startDate) {
                return false;
            }
        }
        return result;
    }

    const save = async () => {
        let { _id, biddingPackage, keyPersonnelRequires, code, startDate, endDate, status, type,
            description, name } = state;

        // setState(state => ({
        //     ...state,
        //     biddingPackage: {
        //         ...biddingPackage,
        //         name,
        //         code,
        //         startDate,
        //         endDate,
        //         status, 
        //         type,
        //         description,
        //         keyPersonnelRequires: keyPersonnelRequires
        //     }
        // }))

        await props.updateBiddingPackage(_id, biddingPackage);
        await props.getDetailBiddingPackage( props._id, {} );
        setState({
            ...state,
            dataStatus: DATA_STATUS.QUERYING,
        })
    }

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={`modal-edit-bidding-package${props._id}`} isLoading={biddingPackagesManager.isLoading}
                formID={`form-edit-bidding-package${_id}`}
                title="Chỉnh sửa thông tin gói thầu"
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* <form className="form-group" id="form-edit-biddingPackage"> */}
                {biddingPackage &&
                    <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }}>
                        <ul className="nav nav-tabs">
                            <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href={`#edit_general_bidding_package${_id}`}>{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                            <li><a title="Yêu cầu nhân sự chủ chốt" data-toggle="tab" href={`#edit_contact_bidding_package${_id}`}>Yêu cầu nhân sự chủ chốt</a></li>
                            <li><a title="Danh sách nhân sự chủ chốt" data-toggle="tab" href={`#edit_key_people_bidding_package${_id}`}>Nhân sự chủ chốt</a></li>
                        </ul>
                        <div className="tab-content">
                            {/* Tab thông tin chung */
                                <GeneralTab
                                    id={`edit_general_bidding_package${_id}`}
                                    handleChange={handleChange}
                                    handleUpload={handleUpload}
                                    biddingPackage={biddingPackage}
                                />
                            }
                            {/* Điều kiện nhân sự chủ chốt */}
                            <KeyPeopleRequire
                                id={`edit_contact_bidding_package${_id}`}
                                handleChange={handleChange}
                                listCareer={career?.listPosition}
                                listMajor={major?.listMajor}
                                listCertificate={certificate?.listCertificate}
                                biddingPackage={biddingPackage}
                            />
                            {/* Danh sách nhân sự chủ chốt */}
                            <KeyPeople
                                id={`edit_key_people_bidding_package${_id}`}
                                handleChange={handleChange}
                                listCareer={career?.listPosition}
                                listMajor={major?.listMajor}
                                listCertificate={certificate?.listCertificate}
                                keyPersonnelRequires={state.biddingPackage.keyPersonnelRequires}
                                biddingPackage={biddingPackage}
                            />
                        </div>
                    </div>}
                {/* </form> */}
            </DialogModal>
        </React.Fragment>
    )
};

function mapState(state) {
    const { biddingPackagesManager, user, major, career, certificate } = state;
    return { biddingPackagesManager, user, major, career, certificate };
};

const actionCreators = {
    getDetailBiddingPackage: BiddingPackageManagerActions.getDetailEditBiddingPackage,
    updateBiddingPackage: BiddingPackageManagerActions.updateBiddingPackage,
    getListMajor: MajorActions.getListMajor,
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    getListCertificate: CertificateActions.getListCertificate,
    getAllUserOfCompany: UserActions.getAllUserOfCompany,
    getChildrenOfOrganizationalUnits: UserActions.getChildrenOfOrganizationalUnitsAsTree,
    getDepartment: UserActions.getDepartmentOfUser,
};

const editFrom = connect(mapState, actionCreators)(withTranslate(BiddingPackageEditFrom));
export { editFrom as BiddingPackageEditFrom };
