import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ConfirmNotification, DataTableSetting, DatePicker, ExportExcel, SelectBox } from '../../../../../common-components';
import { BiddingPackageManagerActions } from '../../biddingPackageManagement/redux/actions';
import { BiddingPackageReduxAction } from '../../redux/actions';
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { proposalDocxCreate } from './proposalDocxCreator';

function Proposals(props) {
    const arrUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
        { text: 'Tháng', value: 'months' },
    ]
    const [state, setState] = useState({
    });
    const initProposal = {
        executionTime: 0,
        unitOfTime: "days",
        tasks: [],
    }
    const [proposals, setProposals] = useState(props.biddingPackage.proposals ? props.biddingPackage.proposals : initProposal)

    useEffect(() => {
        setState({ ...state, id: props.id, })
    }, [props.id])


    useEffect(() => {
        setProposals(props.biddingPackage.proposals)
    }, [props.biddingPackage?._id])

    const { translate } = props;
    const { id } = state;

    const generateProposalDocx = (proposals) => {
        const doc = proposalDocxCreate(proposals);

        Packer.toBlob(doc).then(blob => {
            console.log(blob);
            saveAs(blob, `Đẽ xuất kĩ thuật.docx`);
            console.log("Document created successfully");
        });
    }

    return (
        <div id={id} className="tab-pane">
            {/* <div className="form-group pull-right" style={{ padding: '6px 12px', margin: '5px', width: '100%' }}>
                <ExportExcel id="download_template_search_package" type='link' exportData={convertDataExport()} buttonName='Download hồ sơ nhân sự chủ chốt' />
                <a className="btn btn-success" style={{ paddingLeft: '15px', marginLeft: '15px' }} onClick={() => props.downLoadDocument(props._id)} title="Tải xuống file minh chứng">
                    Tải xuống file minh chứng
                </a>
            </div> */}
            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                <div className="btn btn-success" onClick={() => generateProposalDocx(proposals)}>Tải file Đề xuất</div>
            </div>
            {proposals?.executionTime && <div style={{ marginLeft: "20px" }}><strong>Thời gian thực hiện hợp đồng: </strong><span>{proposals.executionTime} ({arrUnitTimeList.find(x => x.value === proposals.unitOfTime)?.text})</span> kể từ thời điểm ký kết hợp đồng</div>}
            {proposals?.tasks?.length > 0 ? <div>
                <br />
                <p style={{ color: "green", marginLeft: "20px" }}>*Thông tin đề xuất côn việc sẽ được hiển thị bên dưới - click để xem chi tiết*</p>
            </div> : <span style={{ marginLeft: "20px" }}>Chưa có thông tin đề xuất!</span>
            }
            <div className="box-body qlcv">
                {
                    proposals.tasks.map((item, index) => {
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