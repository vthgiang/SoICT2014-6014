// import React, { useEffect, useState } from 'react';
// import { connect } from 'react-redux';
// import { withTranslate } from 'react-redux-multilingual';
// import { BiddingPackageDetail } from './biddingPackageDetail';

// const BiddingPackageDetailPage = (props) => {
//     const currentId = window.location.href.split('?id=')[1].split('#')?.[0];

//     return (
//         <>
//             <BiddingPackageDetail
//                 _id={currentId}
//             />
//         </>
//     );
// }

// export default connect(null, null)(withTranslate(BiddingPackageDetailPage));
import React, { Component, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import {
    GeneralTab, KeyPeopleRequireTab, KeyPeople, Proposals
} from '../../biddingPackageInfo/components/combinedContent';

import { BiddingPackageManagerActions } from '../redux/actions';
import { MajorActions } from '../../../../human-resource/major/redux/actions';
import { CareerReduxAction } from '../../../../human-resource/career/redux/actions';
import { CertificateActions } from '../../../../human-resource/certificate/redux/actions';
import { BiddingPackageReduxAction } from '../../redux/actions';

const BiddingPackageDetailPage = (props) => {
    const { biddingPackagesManager, translate, career, major, certificate } = props;
    const currentId = window.location.href.split('?id=')[1].split('#')?.[0];
    const DATA_STATUS = { NOT_AVAILABLE: 0, QUERYING: 1, AVAILABLE: 2, };

    const [state, setState] = useState({
        dataStatus: DATA_STATUS.NOT_AVAILABLE
    })

    const mountedRef = useRef(true)

    useEffect(() => {
        props.getDetailBiddingPackage(currentId, {});
    }, []);

    useEffect(() => {
        props.getListMajor({ name: '', page: 0, limit: 1000 });
        props.getListCareerPosition({ name: '', page: 0, limit: 1000 });
        props.getListCertification({ name: '', page: 0, limit: 1000 });
    }, [])

    useEffect(() => {
        setState({
            ...state,
            biddingPackageDetail: biddingPackagesManager.biddingPackageDetail
        });
    }, [biddingPackagesManager.biddingPackageDetail]);


    let { _id, biddingPackageDetail } = state;

    const handleDownLoadDocument = (id) => {
        props.downLoadDocument(id)
    }

    return (
        <div className='box' id={`form-detail-biddingPackage${_id}`} >
            {biddingPackageDetail?._id && (
                <div className="nav-tabs-custom row box-body" style={{ margin: 0 }}>
                    <ul className="nav nav-tabs">
                        <li className="active"><a title={translate('human_resource.profile.tab_name.menu_general_infor_title')} data-toggle="tab" href={`#view_general${_id}`}>{translate('human_resource.profile.tab_name.menu_general_infor')}</a></li>
                        <li><a title="Yêu cầu nhân sự chủ chốt" data-toggle="tab" href={`#view_contact${_id}`}>Yêu cầu nhân sự chủ chốt</a></li>
                        <li><a title="Danh sách nhân sự chủ chốt" data-toggle="tab" href={`#view_key_people_bidding_package${_id}`}>Danh sách nhân sự chủ chốt</a></li>
                        <li><a title="Hồ sơ đề xuất" data-toggle="tab" href={`#view_proppsals_bidding_package${_id}`}>Hồ sơ đề xuất</a></li>
                    </ul>
                    <div className="tab-content">
                        {/* Thông tin chung */}
                        <GeneralTab
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
        </div>
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

// const detailBiddingPackage = connect(mapState, actionCreators)(withTranslate(BiddingPackageDetail));
// export { detailBiddingPackage as BiddingPackageDetail };
export default connect(mapState, actionCreators)(withTranslate(BiddingPackageDetailPage));