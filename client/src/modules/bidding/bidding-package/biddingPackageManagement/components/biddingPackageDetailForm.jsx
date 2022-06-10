import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components';

import {
    GeneralTab, KeyPeopleRequireTab, KeyPeople, Proposals
} from '../../biddingPackageInfo/components/combinedContent';

import { BiddingPackageManagerActions } from '../redux/actions';
import { MajorActions } from '../../../../human-resource/major/redux/actions';
import { CareerReduxAction } from '../../../../human-resource/career/redux/actions';
import { CertificateActions } from '../../../../human-resource/certificate/redux/actions';
import { BiddingPackageReduxAction } from '../../redux/actions';
import CreateBiddingContract from '../../../bidding-contract/component/createContract'

const BiddingPackageDetailForm = (props) => {

    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };

    const [state, setState] = useState({
        dataStatus: DATA_STATUS.NOT_AVAILABLE
    })

    const mountedRef = useRef(true)

    useEffect(() => {
        const shouldUpdate = async () => {
            if (props._id !== state._id && !props.biddingPackagesManager.isLoading) {
                await props.getDetailBiddingPackage(props._id, {});
                setState({
                    ...state,
                    _id: props._id,
                    dataStatus: DATA_STATUS.QUERYING,
                    biddingPackageDetail: null,
                })
            };
            if (state.dataStatus === DATA_STATUS.QUERYING && !props.biddingPackagesManager.isLoading) {
                setState({
                    ...state,
                    dataStatus: DATA_STATUS.AVAILABLE,
                    biddingPackageDetail: props.biddingPackagesManager?.biddingPackageDetail,
                });
            };
        }

        shouldUpdate()
        return () => {
            mountedRef.current = false;
        }
    }, [props._id, props.biddingPackagesManager.isLoading, state.dataStatus]);

    const { biddingPackagesManager, translate, career, major, certificate } = props;

    let { _id, biddingPackageDetail } = state;

    const handleDownLoadDocument = (id) => {
        props.downLoadDocument(id)
    }

    return (
        <React.Fragment>
            <DialogModal
                size='75' modalID={`modal-detail-bidding-package${props?._id}`} isLoading={biddingPackagesManager.isLoading}
                formID={`form-detail-biddingPackage${_id}`}
                title="Chi tiết gói thầu"
                hasSaveButton={false}
                hasNote={false}
            >
                <form className="form-group" id={`form-detail-biddingPackage${_id}`} style={{ marginTop: "-15px" }}>
                    <CreateBiddingContract
                        id={_id ? _id : ''}
                    />
                    {biddingPackageDetail && (
                        <div className="nav-tabs-custom row">
                            <ul className="nav nav-tabs">
                                <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href={`#view_general${_id}`}>{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                                <li><a title="Yêu cầu nhân sự chủ chốt" data-toggle="tab" href={`#view_contact${_id}`}>Yêu cầu nhân sự chủ chốt</a></li>
                                <li><a title="Danh sách nhân sự chủ chốt" data-toggle="tab" href={`#view_key_people_bidding_package${_id}`}>Danh sách nhân sự chủ chốt</a></li>
                                <li><a title="Hồ sơ đề xuất" data-toggle="tab" href={`#view_proppsals_bidding_package${_id}`}>Hồ sơ đề xuất</a></li>
                            </ul>
                            <div className="tab-content">
                                {/* Thông tin chung */}
                                <GeneralTab
                                    _id={_id}
                                    id={`view_general${_id}`}
                                    biddingPackage={biddingPackageDetail}
                                />
                                {/* Yêu cầu nhân sự chủ chốt */}
                                <KeyPeopleRequireTab
                                    id={`view_contact${_id}`}
                                    biddingPackage={biddingPackageDetail}
                                    listCareer={career?.listPosition}
                                    listMajor={major?.listMajor}
                                    listCertificate={certificate?.listCertificate}
                                />
                                {/* Danh sách nhân sự chủ chốt */}
                                <KeyPeople
                                    id={`view_key_people_bidding_package${_id}`}
                                    _id={_id}
                                    listCareer={career?.listPosition}
                                    listMajor={major?.listMajor}
                                    listCertificate={certificate?.listCertificate}
                                    keyPersonnelRequires={biddingPackageDetail.keyPersonnelRequires}
                                    keyPeople={biddingPackageDetail.keyPeople}
                                    biddingPackage={biddingPackageDetail}
                                    downLoadDocument={handleDownLoadDocument}
                                />
                                {/* Hồ sơ đề xuất */}
                                <Proposals
                                    id={`view_proppsals_bidding_package${_id}`}
                                    _id={_id}
                                    proposals={biddingPackageDetail.proposals}
                                    biddingPackage={biddingPackageDetail}
                                    downLoadDocument={handleDownLoadDocument}
                                />
                            </div>
                        </div>
                    )}
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapState(state) {
    const { biddingPackagesManager, biddingPackages, major, career, certificate } = state;
    return { biddingPackagesManager, biddingPackages, major, career, certificate };
};

const actionCreators = {
    getDetailBiddingPackage: BiddingPackageManagerActions.getDetailBiddingPackage,
    downLoadDocument: BiddingPackageManagerActions.downloadPackageDocument,
    getListMajor: MajorActions.getListMajor,
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    getListCertification: CertificateActions.getListCertificate,
    downLoadDocument: BiddingPackageReduxAction.downloadPackageDocument,
};

const detailBiddingPackage = connect(mapState, actionCreators)(withTranslate(BiddingPackageDetailForm));
export { detailBiddingPackage as BiddingPackageDetailForm };
