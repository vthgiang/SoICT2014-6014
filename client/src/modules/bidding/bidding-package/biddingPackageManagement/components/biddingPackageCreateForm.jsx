import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { convertJsonObjectToFormData } from '../../../../../helpers/jsonObjectToFormDataObjectConverter';

import { DialogModal } from '../../../../../common-components';

import { KeyPeopleRequire, ExperienceTab, GeneralTab, KeyPeople } from './combinedContent';
import { BiddingPackageManagerActions } from '../redux/actions';
import { MajorActions } from '../../../../human-resource/major/redux/actions';
import { CareerReduxAction } from '../../../../human-resource/career/redux/actions';
import { CertificateActions } from '../../../../human-resource/certificate/redux/actions';
import { Proposals } from './proposals';

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
            proposals: null,
            errorOnName: undefined,
        },
        editBiddingPackge: initBiddingPackage
    })
    
    const [log, setLog] = useState(null)

    // useEffect()

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
        const { biddingPackage } = state;
        if (name === 'startDate' || name === 'endDate') {
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
        let { keyPeople, biddingPackage, keyPersonnelRequires, code, startDate, endDate, status, type,
            description, name, price, customer, openLocal, receiveLocal, proposals } = state.biddingPackage;
        console.log(149, log, state);
        
        let dataReq = {
            ...biddingPackage,
            name: name,
            code: code,
            customer: customer,
            price: price,
            openLocal: openLocal,
            receiveLocal: receiveLocal,
            startDate: startDate,
            endDate: endDate,
            status: status,
            type: type,
            description: description,
            KeyPeople: keyPeople,
            keyPersonnelRequires: keyPersonnelRequires,
            proposals: {
                ...proposals,
                logs: log ? [log] : []
            }
        }
        await setState(state => ({
            ...state,
            biddingPackage: dataReq
        })) 
        console.log(171, dataReq);

        props.addNewBiddingPackage({ ...dataReq });
    }

    const { translate, biddingPackagesManager, career, major, certificate } = props;
    const { img, biddingPackage } = state;

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID="modal-create-bidding-package" isLoading={biddingPackagesManager.isLoading}
                formID="form-create-bidding-package"
                title="Thêm gói thầu"
                func={save}
                resetOnSave={true}
                resetOnClose={true}
                // afterClose={() => {
                //     setState(state => ({
                //         ...state,
                //         biddingPackage: {
                //             name: "",
                //             code: "",
                //             type: "",
                //             status: "",
                //             startDate: "",
                //             endDate: "",
                //             description: "",
                //             KeyPeople: [],
                //             keyPersonnelRequires: [],
                //             proposals: [],
                //             errorOnName: undefined,
                //         },
                //     }))
                // }}
                disableSubmit={!isFormValidated()}
            >
                {/* <form className="form-group" id="form-create-bidding-package"> */}
                <div className="nav-tabs-custom row" style={{ marginTop: '-15px', overflowX: "hidden", marginBottom: "-15px"}} >
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href="#general-create">{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                        <li><a title={translate('human_resource.profile.tab_name.menu_contact_infor_title')} data-toggle="tab" href="#key-people-require-create">Yêu cầu nhân sự chủ chốt</a></li>
                        <li><a title="Danh sách nhân sự chủ chốt" data-toggle="tab" href={`#key_people_create`}>Nhân sự chủ chốt</a></li>
                        <li><a title="Hồ sơ đề xuất" data-toggle="tab" href={`#proposals_create`}>Hồ sơ đề xuất</a></li>

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
                            listCareer={career?.listPosition}
                            listMajor={major?.listMajor}
                            listCertificate={certificate?.listCertificate}
                            biddingPackage={biddingPackage}
                        />
                        {/* Danh sách nhân sự chủ chốt */}
                        <KeyPeople
                            id={`key_people_create`}
                            handleChange={handleChange}
                            listCareer={career?.listPosition}
                            listMajor={major?.listMajor}
                            listCertificate={certificate?.listCertificate}
                            keyPersonnelRequires={state.biddingPackage.keyPersonnelRequires}
                            biddingPackage={biddingPackage}
                        />
                        {/* Hồ sơ đề xuất */}
                        <Proposals
                            type={`create`}
                            id={`proposals_create`}
                            handleChange={handleChange}
                            listCareer={career?.listPosition}
                            proposals={state.biddingPackage.proposals}
                            biddingPackage={biddingPackage}
                            setLog={setLog}
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
