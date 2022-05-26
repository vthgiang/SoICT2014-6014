import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification, DataTableSetting, DatePicker, ExportExcel, SelectBox } from '../../../../../common-components';
import { BiddingPackageManagerActions } from '../../biddingPackageManagement/redux/actions';
import { BiddingPackageReduxAction } from '../../redux/actions';

function Proposals(props) {
    const arrUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
        { text: 'Tháng', value: 'months' },
    ]
    const [state, setState] = useState({
    });
    const [proposals, setProposals] = useState(props.biddingPackage.proposals ? props.biddingPackage.proposals : [])

    useEffect(() => {
        setState({ ...state, id: props.id, })
    }, [props.id])


    useEffect(() => {
        setProposals(props.biddingPackage.proposals)
    }, [props.biddingPackage?._id])

    const { translate } = props;
    const { id } = state;

    return (
        <div id={id} className="tab-pane">
            {/* <div className="form-group pull-right" style={{ padding: '6px 12px', margin: '5px', width: '100%' }}>
                <ExportExcel id="download_template_search_package" type='link' exportData={convertDataExport()} buttonName='Download hồ sơ nhân sự chủ chốt' />
                <a className="btn btn-success" style={{ paddingLeft: '15px', marginLeft: '15px' }} onClick={() => props.downLoadDocument(props._id)} title="Tải xuống file minh chứng">
                    Tải xuống file minh chứng
                </a>
            </div> */}
            <div>
                <br />
                <p style={{ color: "green", marginLeft: "20px" }}>*Thông tin đề xuất sẽ được hiển thị bên dưới - click để xem chi tiết*</p>
                <br />
            </div>
            <div className="box-body qlcv">
                {
                    proposals.map((item, index) => {
                        return (

                            <section className="col-lg-12 col-md-12" key={`section-${index}`}>

                                <div className="box">
                                    <div className="box-header with-border">
                                        <p data-toggle="collapse" data-target={`#task-proposal-${index}`} aria-expanded="false" style={{ display: "flex", alignItems: "center", fontWeight: "600", cursor: "pointer" }} onClick={() => {
                                            window.$(`#arrow-up-${index}`).toggle();
                                            window.$(`#arrow-down-${index}`).toggle();
                                        }}>
                                            <span id={`arrow-up-${index}`} className="material-icons" style={{ fontWeight: "bold", marginRight: '10px' }}>
                                                {`keyboard_arrow_up`}
                                            </span>
                                            <span id={`arrow-down-${index}`} className="material-icons" style={{ display: 'none', fontWeight: "bold", marginRight: '10px' }}>
                                                {`keyboard_arrow_down`}
                                            </span>
                                            Công việc: {item.taskName}</p>
                                    </div>
                                    <div className="box-body collapse" data-toggle="collapse" id={`task-proposal-${index}`} style={{ lineHeight: 2 }}>
                                        <div><strong>Tên công việc: </strong><span>{item.taskName}</span></div>
                                        <div><strong>Mô tả công việc: </strong><span>{item.taskDescription}</span></div>
                                        <div><strong>Thời gian thực hiện: </strong><span>{item.estimateTime} ({arrUnitTimeList.find(x => x.value === item.unitOfTime)?.text})</span></div>
                                        <div><strong>Nhân viên trực tiếp: </strong><span>{item.directEmployees.map(x => x.fullName).join(", ")}</span></div>
                                        <div><strong>Nhân viên dự phòng: </strong><span>{item.backupEmployees.map(x => x.fullName).join(", ")}</span></div>
                                    </div>
                                </div>
                            </section>
                        );
                    }
                    )
                }

            </div>
        </div>
    );
};

const mapState = (state) => {
    const { auth } = state;
    return { auth };
}

const connectComponent = connect(mapState, null)(withTranslate(Proposals));
export { connectComponent as Proposals };