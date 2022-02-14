import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DialogModal } from '../../../../../common-components';

import {
    GeneralTab, KeyPeopleRequireTab, TaxTab
} from '../../biddingPackageInfo/components/combinedContent';

import { BiddingPackageManagerActions } from '../redux/actions';
import { MajorActions } from '../../../major/redux/actions';
import { CareerReduxAction } from '../../../career/redux/actions';
import { CertificateActions } from '../../../certificate/redux/actions';

const BiddingPackageDetailForm = (props) => {

    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };

    const [state, setState] = useState({
        dataStatus: DATA_STATUS.NOT_AVAILABLE
    })

    const mountedRef = useRef(true)

    useEffect(() => {
        const shouldUpdate = async () => {
            if (props._id !== state._id && !props.biddingPackagesManager.isLoading) {
                await props.getDetailBiddingPackage( props._id, {} );
                setState({
                    ...state,
                    _id: props._id,
                    dataStatus: DATA_STATUS.QUERYING,
                    biddingPackageDetail: [],
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

    console.log("detail", biddingPackagesManager.isLoading)

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
                    {biddingPackageDetail && biddingPackageDetail.length !== 0 &&
                        biddingPackageDetail.map((x, index) => (
                            <div className="nav-tabs-custom row" key={index}>
                                <ul className="nav nav-tabs">
                                    <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href={`#view_general${_id}`}>{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                                    <li><a title="Yêu cầu nhân sự chủ chốt" data-toggle="tab" href={`#view_contact${_id}`}>Yêu cầu nhân sự chủ chốt</a></li>
                                    <li><a title="Danh sách nhân sự chủ chốt" data-toggle="tab" href={`#view_experience${_id}`}>Danh sách nhân sự chủ chốt</a></li>
                                </ul>
                                <div className="tab-content">
                                    {/* Thông tin chung */}
                                    <GeneralTab
                                        id={`view_general${_id}`}
                                        biddingPackage={x}
                                    />
                                    {/* Thông tin liên hệ */}
                                    <KeyPeopleRequireTab
                                        id={`view_contact${_id}`}
                                        biddingPackage={x}
                                        listCareer={career?.listPosition?.listPosition}
                                        listMajor={major?.listMajor}
                                        listCertificate={certificate?.listCertificate}
                                    />
                                    {/* Thuế thu nhập cá nhân */}
                                    {/* <TaxTab
                                        id={`view_account${_id}`}
                                        biddingPackage={x}
                                    /> */}
                                </div>
                            </div>
                        ))}
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
    getListMajor: MajorActions.getListMajor,
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    getListCertification: CertificateActions.getListCertificate
};

const detailBiddingPackage = connect(mapState, actionCreators)(withTranslate(BiddingPackageDetailForm));
export { detailBiddingPackage as BiddingPackageDetailForm };
