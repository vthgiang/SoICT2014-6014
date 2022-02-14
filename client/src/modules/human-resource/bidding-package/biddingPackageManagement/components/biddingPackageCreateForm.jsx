import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import { DialogModal } from '../../../../../common-components';

import { KeyPeopleRequire, ExperienceTab, GeneralTab } from './combinedContent';
import { BiddingPackageManagerActions } from '../redux/actions';
import { MajorActions } from '../../../major/redux/actions';
import { CareerReduxAction } from '../../../career/redux/actions';
import { CertificateActions } from '../../../certificate/redux/actions';

const initBiddingPackage = {
    name: "",
    code: "",
    type: 1,
    status: 0,
    description: "",
    keyPersonnelRequires: [],
    errorOnName: undefined,
}
const BiddingPackageCreateForm = (props) => {

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về yyyy-mm, false trả về yyyy-mm-dd
     */
    const formatDate2 = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [year, month].join('-');
            } else return [year, month, day].join('-');
        }
        return date;
    }

    const [state, setState] = useState({
        biddingPackage: {
            name: "",
            code: "",
            type: "",
            status: "",
            startDate: "",
            endDate: "",
            description: "",
            keyPersonnelRequires: [],
            errorOnName: undefined,
        },
        editBiddingPackge: initBiddingPackage
    })


    /**
     * Function upload avatar 
     * @param {*} img 
     * @param {*} avatar 
     */
    const handleUpload = (img, avatar) => {
        setState(state => ({
            ...state,
            img: img,
            avatar: avatar
        }))
    }

    /**
     * Function lưu các trường thông tin vào state
     * @param {*} name : Tên trường
     * @param {*} value : Giá trị của trường
     */
    const handleChange = (name, value) => {
        const { biddingPackage} = state;
        if ( name === 'startDate' || name === 'endDate' ) {
            if (value) {
                let partValue = value.split('-');
                value = [partValue[2], partValue[1], partValue[0]].join('-');
            }
        }
        setState(state => ({
            ...state,
            biddingPackage: {
                ...biddingPackage,
                [name]: value,
            }
        }));
    }

    /**
     * Function thêm thông tin tài liệu đính kèm
     * @param {*} data : Dữ liệu thông tin tài liệu đính kèm
     * @param {*} addData : Tài liệu đính kèm muốn thêm
     */
    const handleChangeFile = (data, addData) => {
        setState(state => ({
            ...state,
            files: data
        }))
    }

    /**
     * Function kiểm tra các trường bắt buộc phải nhập
     * @param {*} value : Giá trị của trường cần kiểm tra
     */
    const validatorInput = (value) => {
        if (value !== undefined && value.toString().trim() !== '') {
            return true;
        }
        return false;
    }

    /** Function kiểm tra lỗi validator của các dữ liệu nhập vào để undisable submit form */
    const isFormValidated = () => {
        const { biddingPackage } = state;
        let result = validatorInput(biddingPackage.name) &&
            validatorInput(biddingPackage.name);

        if (biddingPackage.startDate && biddingPackage.endDate) {
            if (new Date(biddingPackage.endDate).getTime() < new Date(biddingPackage.startDate).getTime()) {
                return false;
            }
        } else if ((biddingPackage.startDate && !biddingPackage.endDate) ||
            (!biddingPackage.startDate && biddingPackage.endDate)) {
            return false;
        }
        return result;
    }

    /** Function thêm mới thông tin nhân viên */
    const save = async () => {
        let { biddingPackage, keyPersonnelRequires, code, startDate, endDate, status, type,
            description, name } = state;

        await setState(state => ({
            ...state,
            biddingPackage: {
                ...biddingPackage,
                name,
                code,
                startDate,
                endDate,
                status, 
                type,
                description,
                keyPersonnelRequires: keyPersonnelRequires
            }
        }))
        
        props.addNewBiddingPackage({...biddingPackage});
    }

    const { translate, biddingPackagesManager, career, major, certificate } = props;
    const { img, biddingPackage } = state;

    console.log("createForm", biddingPackagesManager.isLoading)

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID="modal-create-bidding-package" isLoading={biddingPackagesManager.isLoading}
                formID="form-create-bidding-package"
                title="Thêm gói thầu"
                func={save}
                disableSubmit={!isFormValidated()}
            >
                {/* <form className="form-group" id="form-create-bidding-package"> */}
                <div className="nav-tabs-custom row" style={{ marginTop: '-15px' }} >
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href="#general-create">{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle="tab" href="#key-people-require-create">Yêu cầu nhân sự chủ chốt</a></li>
                    </ul>
                    < div className="tab-content">
                        {/* Tab thông tin chung */}
                        <GeneralTab
                            id="general-create"
                            handleChange={handleChange}
                            biddingPackage={biddingPackage}
                        />
                        {/* Tab thông tin liên hệ */}
                        <KeyPeopleRequire
                            id="key-people-require-create"
                            handleChange={handleChange}
                            listCareer={career?.listPosition?.listPosition}
                            listMajor={major?.listMajor}
                            listCertificate={certificate?.listCertificate}
                            biddingPackage={biddingPackage}
                        />
                    </div>
                </div>
                {/* </form> */}
            </DialogModal>
        </React.Fragment>
    );
};

function mapState(state) {
    const { biddingPackagesManager, major, career, certificate } = state;
    return { biddingPackagesManager, major, career, certificate };
};

const actionCreators = {
    getAllBiddingPackage: BiddingPackageManagerActions.getAllBiddingPackage,
    getListMajor: MajorActions.getListMajor,
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    getListCertificate: CertificateActions.getListCertificate,
    addNewBiddingPackage: BiddingPackageManagerActions.addNewBiddingPackage,
};

const createForm = connect(mapState, actionCreators)(withTranslate(BiddingPackageCreateForm));
export { createForm as BiddingPackageCreateForm };
