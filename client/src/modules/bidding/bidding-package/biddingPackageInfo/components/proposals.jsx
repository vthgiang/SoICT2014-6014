import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { saveAs } from "file-saver";
import { Packer } from "docx";
import { proposalDocxCreate } from './proposalDocxCreator';
import { convertEmpIdToName, convertTagIdToTagName } from '../../biddingPackageManagement/components/employeeHelper';
import { TagActions } from '../../../tags/redux/actions';
import { EmployeeManagerActions } from '../../../../human-resource/profile/employee-management/redux/actions';
import { DateTimeConverter, forceCheckOrVisible } from '../../../../../common-components';

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

    useEffect(() => {
        props.getListTag({});
        props.getAllEmployee();
    }, [])

    const { translate, tag, employeesManager } = props;
    const { currentLog, currentLogIndex, id } = state;

    let allEmployee;
    if (employeesManager && employeesManager.listAllEmployees) {
        allEmployee = employeesManager.listAllEmployees
    }

    let alltag = [];
    if (tag && tag.listTag) {
        alltag = tag?.listTag
    }

    const generateProposalDocx = (proposals) => {
        const doc = proposalDocxCreate(proposals);

        Packer.toBlob(doc).then(blob => {
            console.log(blob);
            saveAs(blob, `Đẽ xuất kĩ thuật.docx`);
            console.log("Document created successfully");
        });
    }

    // code for logs    

    const [showDetailLog, setShowDetailLog] = useState(true)

    const handleChangeContent = (item, index) => {
        setState({
            ...state,
            currentLog: item,
            currentLogIndex: index,
            content: item._id,
        })
        setShowDetailLog(true);
    };

    const checkInArr = (item, arr) => {
        let check = arr.find(x => String(x) === String(item));
        if (check) return true;
        return false;
    }

    const converDataLog = (log) => {
        const oldVersion = log?.oldVersion?.tasks ?? [];
        const newVersion = log?.newVersion?.tasks ?? [];
        let compareTasks = [];

        for (let o of oldVersion) {
            for (let n of newVersion) {
                if (o.code.trim() == n.code.trim()) {
                    compareTasks.push({
                        oldVersionIsProposal: log?.oldVersion?.isProposal ? true : false,
                        isSatisfied: log.isSatisfied,
                        code: o.code,
                        taskName: o.taskName,
                        taskDescription: o.taskDescription,
                        old: o,
                        new: n
                    })
                }
            }
        }

        return compareTasks;
    }

    // end logs

    return (
        <div id={id} className="tab-pane">
            <div style={{ display: 'flex', justifyContent: "flex-end" }}>
                <div className="btn btn-success" onClick={() => generateProposalDocx(proposals)}>Tải file Đề xuất</div>
            </div>
            {proposals?.executionTime && <div style={{ marginLeft: "20px" }}><strong>Thời gian thực hiện hợp đồng: </strong><span>{proposals?.executionTime} ({arrUnitTimeList.find(x => x.value === proposals?.unitOfTime)?.text})</span> kể từ thời điểm ký kết hợp đồng</div>}

            <br />

            <div className="nav-tabs-custom">
                {<ul className="nav nav-tabs">
                    <li className="active"><a href={`#proposal_info_${id}`} data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Thông tin công việc đề xuất</a></li>
                    <li><a href={`#proposal_log_${id}`} data-toggle="tab" onClick={() => forceCheckOrVisible(true, false)}>Lịch sử phân công nhân sự</a></li>
                </ul>
                }
                <div className="tab-content">
                    <div className="tab-pane active" id={`proposal_info_${id}`}>
                        {proposals?.tasks?.length > 0 ? <div>
                            <br />
                            <p style={{ color: "green", marginLeft: "20px" }}>*Thông tin đề xuất công việc sẽ được hiển thị bên dưới - click để xem chi tiết*</p>
                        </div> : <span style={{ marginLeft: "20px" }}>Chưa có thông tin đề xuất!</span>
                        }
                        <div className="box-body qlcv">
                            {
                                proposals?.tasks.map((item, index) => {
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
                                                    <div><strong>Tags: </strong><span>{item?.tag?.map(x => convertTagIdToTagName(alltag, x))?.join(", ")}</span></div>
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
                    <div className="tab-pane" id={`proposal_log_${id}`}>
                        {!(proposals?.logs?.length > 0) ? <div style={{textAlign: "center"}}>Chưa có thông tin lịch sử phân công nhân sự</div> : <div className='row'>
                            <div className="col-xs-12 col-sm-4">
                                <div className="box box-solid" style={{ border: "1px solid #ecf0f6", borderBottom: "none" }}>
                                    <div className="box-header with-border">
                                        <h3 className="box-title" style={{ fontWeight: 800 }}>Các phiên bản phân công nhân sự</h3>
                                    </div>
                                    <div className="box-body no-padding">
                                        <ul className="nav nav-pills nav-stacked">
                                            {
                                                proposals?.logs?.map((item, index) =>
                                                    <li key={index} className={state.content === item._id ? "active" : undefined}>
                                                        <a href="#abc" onClick={() => handleChangeContent(item, index)}>
                                                            Phiên bản {index + 1} (<DateTimeConverter dateTime={item.createdAt} />)
                                                        </a>
                                                    </li>
                                                )
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {currentLog && <div className="col-xs-12 col-sm-8" style={{ lineHeight: 2 }}>
                                <h4>Thông tin chi tiết phân công nhân sự tự động lần {currentLogIndex + 1}</h4>
                                {!currentLog?.isSatisfied ?
                                    <div style={{ lineHeight: 2 }}>
                                        <div><strong>Hình thức: </strong>&nbsp; {currentLog.type === "create" ? <span style={{ color: "green", fontWeight: "bold" }}>Khởi tạo phân công nhân sự vào công việc gói thầu</span> : <span style={{ color: "red", fontWeight: "bold" }}>Chỉnh sửa phân công nhân sự vào công việc gói thầu</span>}</div>
                                        <div><strong>Người thực hiện: </strong> {currentLog.createdBy.name}</div>
                                        <div><strong>Thời gian: </strong> <DateTimeConverter dateTime={currentLog.createdAt} /></div>
                                        <div><strong>Ghi chú: </strong> <span style={{ color: `${currentLog.isSatisfied ? "green" : "red"}`, fontWeight: "bold" }}>{currentLog?.note}</span></div>

                                        <div><a style={{ cursor: 'pointer' }} onClick={() => setShowDetailLog(!showDetailLog)}>{showDetailLog ? "Ẩn chi tiết" : "Hiển thị chi tiết"}</a> </div>
                                        <br />
                                        {!showDetailLog ? null :
                                            <table id="proposal-result-show-data-1" className="table not-has-action table-striped table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>STT</th>
                                                        <th>Công việc</th>
                                                        <th>Nhân sự phân công tự động</th>
                                                        <th>Nhân sự phân công đã điều chỉnh</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        converDataLog(currentLog)?.map((item, listIndex) => {
                                                            return (
                                                                <tr key={`tag-${listIndex}`}>
                                                                    <td>{listIndex + 1}</td>
                                                                    <td>{item?.taskName}</td>
                                                                    <td>
                                                                        <div><strong>Nhân sự trực tiếp: </strong>
                                                                            {item?.old?.directEmployees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}
                                                                        </div>
                                                                        <div><strong>Nhân sự dự phòng: </strong>
                                                                            {item?.old?.backupEmployees?.length > 0 ? item?.old?.backupEmployees?.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ') : "N/A"}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div><strong>Nhân sự trực tiếp: </strong>
                                                                            {item?.new?.directEmployees.map(userItem => {
                                                                                return <span> {/** &cedil; */}
                                                                                    <span style={checkInArr(userItem, item?.old?.directEmployees) ? { color: "green", fontWeight: 600 } : { color: "red", fontWeight: 600 }}>{`${convertEmpIdToName(allEmployee, userItem)}`}</span>&#44;
                                                                                </span>
                                                                            })}
                                                                        </div>
                                                                        <div><strong>Nhân sự dự phòng: </strong>
                                                                            {item?.new?.backupEmployees?.length > 0 ? item?.new?.backupEmployees?.map(userItem => {
                                                                                return <span> {/** &cedil; */}
                                                                                    <span style={checkInArr(userItem, item?.old?.backupEmployees) ? { color: "green", fontWeight: 600 } : { color: "red", fontWeight: 600 }}>{`${convertEmpIdToName(allEmployee, userItem)}`}</span>&#44;
                                                                                </span>
                                                                            }) : "N/A"}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </table>}
                                    </div> : <div >
                                        {currentLog?.type === "edit" ?
                                            <div style={{ lineHeight: 2 }}>
                                                <div><span><strong>Hình thức: </strong>&nbsp; {currentLog.type === "create" ? <span style={{ color: "green", fontWeight: "bold" }}>Khởi tạo phân công nhân sự vào công việc gói thầu</span> : <span style={{ color: "red", fontWeight: "bold" }}>Chỉnh sửa phân công nhân sự vào công việc gói thầu</span>}</span></div>
                                                <div><span><strong>Người thực hiện: </strong> {currentLog.createdBy.name}</span></div>
                                                <div><strong>Thời gian: </strong> <DateTimeConverter dateTime={currentLog.createdAt} /></div>
                                                <div><strong>Ghi chú: </strong> <span style={{ color: `${currentLog.isSatisfied ? "green" : "red"}`, fontWeight: "bold" }}>{currentLog?.note}</span></div>

                                                <div><a style={{ cursor: 'pointer' }} onClick={() => setShowDetailLog(!showDetailLog)}>{showDetailLog ? "Ẩn chi tiết" : "Hiển thị chi tiết"}</a> </div>
                                                <br />
                                                {!showDetailLog ? null :

                                                    <table id="proposal-result-show-data-2" className="table not-has-action table-striped table-bordered table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th>STT</th>
                                                                <th>Công việc</th>
                                                                <th>Nhân sự phân công ban đầu</th>
                                                                <th>Nhân sự phân công tự động</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                converDataLog(currentLog)?.map((item, listIndex) => {
                                                                    return (
                                                                        <tr key={`tag-${listIndex}`}>
                                                                            <td>{listIndex + 1}</td>
                                                                            <td>{item?.taskName}</td>
                                                                            <td>
                                                                                <div><strong>Nhân sự trực tiếp: </strong>
                                                                                    {item?.old?.directEmployees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}
                                                                                </div>
                                                                                <div><strong>Nhân sự dự phòng: </strong>
                                                                                    {item?.old?.backupEmployees?.length > 0 ? item?.old?.backupEmployees?.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ') : "N/A"}
                                                                                </div>
                                                                            </td>
                                                                            <td>
                                                                                <div><strong>Nhân sự trực tiếp: </strong>
                                                                                    {item?.new?.directEmployees.map(userItem => {
                                                                                        return <span> {/** &cedil; */}
                                                                                            <span style={checkInArr(userItem, item?.old?.directEmployees) ? { color: "green", fontWeight: 600 } : { color: "red", fontWeight: 600 }}>{`${convertEmpIdToName(allEmployee, userItem)}`}</span>&#44;
                                                                                        </span>
                                                                                    })}
                                                                                </div>
                                                                                <div><strong>Nhân sự dự phòng: </strong>
                                                                                    {item?.new?.backupEmployees?.length > 0 ? item?.new?.backupEmployees?.map(userItem => {
                                                                                        return <span> {/** &cedil; */}
                                                                                            <span style={checkInArr(userItem, item?.old?.backupEmployees) ? { color: "green", fontWeight: 600 } : { color: "red", fontWeight: 600 }}>{`${convertEmpIdToName(allEmployee, userItem)}`}</span>&#44;
                                                                                        </span>
                                                                                    }) : "N/A"}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>}
                                            </div> : <div style={{ lineHeight: 2 }}>
                                                <div><strong>Hình thức: </strong>&nbsp; {currentLog.type === "create" ? <span style={{ color: "green", fontWeight: "bold" }}>Khởi tạo phân công nhân sự vào công việc gói thầu</span> : <span style={{ color: "red", fontWeight: "bold" }}>Chỉnh sửa phân công nhân sự vào công việc gói thầu</span>}</div>
                                                <div><strong>Người thực hiện: </strong> {currentLog.createdBy.name}</div>
                                                <div><strong>Thời gian: </strong> <DateTimeConverter dateTime={currentLog.createdAt} /></div>
                                                <div><strong>Ghi chú: </strong> <span style={{ color: `${currentLog.isSatisfied ? "green" : "red"}`, fontWeight: "bold" }}>{currentLog?.note}</span></div>

                                                <div><a style={{ cursor: 'pointer' }} onClick={() => setShowDetailLog(!showDetailLog)}>{showDetailLog ? "Ẩn chi tiết" : "Hiển thị chi tiết"}</a> </div>
                                                <br />
                                                {!showDetailLog ? null :
                                                    <table id="proposal-result-show-data-3" className="table not-has-action table-striped table-bordered table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th>STT</th>
                                                                <th>Công việc</th>
                                                                <th>Nhân sự trực tiếp</th>
                                                                <th>Nhân sự dự phòng</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                currentLog.newVersion.tasks?.map((item, listIndex) => {
                                                                    return (
                                                                        <tr key={`tag-${listIndex}`}>
                                                                            <td>{listIndex + 1}</td>
                                                                            <td>{item?.taskName}</td>
                                                                            <td>{item?.directEmployees.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ')}
                                                                            </td>
                                                                            <td>{item?.backupEmployees?.length > 0 ? item?.backupEmployees?.map(userItem => convertEmpIdToName(allEmployee, userItem)).join(', ') : "N/A"}
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
                                                            }
                                                        </tbody>
                                                    </table>
                                                }

                                            </div>}
                                    </div>}
                            </div>}
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapState = (state) => {
    const { auth, employeesManager, tag } = state;
    return { auth, employeesManager, tag };
}

const mapAction = {
    getListTag: TagActions.getListTag,
    getAllEmployee: EmployeeManagerActions.getAllEmployee,
}

const connectComponent = connect(mapState, mapAction)(withTranslate(Proposals));
export { connectComponent as Proposals };