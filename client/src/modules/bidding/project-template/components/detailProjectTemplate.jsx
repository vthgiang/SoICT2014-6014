import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DialogModal } from '../../../../common-components';
import { withTranslate } from 'react-redux-multilingual';
import { ProjectTemplateActions } from '../redux/actions';
import { getStorage } from '../../../../config';
import { convertDateTime, convertUserIdToUserName, getParticipants, renderProjectTemplateTypeText } from './functionHelper';
import getEmployeeSelectBoxItems from '../../../task/organizationalUnitHelper';

const DetailProjectTemplate = (props) => {
    const { translate, projectTemplate, user, projectId, projectDetail } = props;
    const listUsers = user && user.usersInUnitsOfCompany ? getEmployeeSelectBoxItems(user.usersInUnitsOfCompany) : []
    const fakeUnitCostList = [
        { text: 'VND', value: 'VND' },
        { text: 'USD', value: 'USD' },
    ]
    const fakeUnitTimeList = [
        { text: 'Ngày', value: 'days' },
        { text: 'Giờ', value: 'hours' },
    ]
    const fakeProjectTypeList = [
        { text: 'QLDA dạng đơn giản', value: 1 },
        { text: 'QLDA phương pháp CPM', value: 2 },
    ]
    const userId = getStorage('userId');
    const [projectData, setProjectData] = useState(projectDetail);
    const [id, setId] = useState(projectId);
    const [selectedTab, setSelectedTab] = useState("general");
    useEffect(() => {
        setProjectData(projectDetail);
        setId(projectId);
    }, [projectId])

    // Các hàm xử lý tabbedPane
    const handleChangeContent = async (content) => {
        await setSelectedTab(content)
    }

    const renderGeneral = () => {
        return (
            <div style={{ lineHeight: 2.3 }}>
                <div className="row">
                    <div className="col-md-6">
                        <div><strong>Tên dự án: </strong> {projectData?.name}</div>
                    </div>
                    <div className="col-md-6">
                        <div><strong>Hình thức quản lý dự án: </strong>	{projectData ? renderProjectTemplateTypeText(projectData?.projectType) : null}</div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div><strong>Đơn vị chi phí: </strong> {projectData && projectData?.currenceUnit ? projectData?.currenceUnit : "Không xác định"}</div>
                    </div>
                    <div className="col-md-6">
                        <div><strong>Đơn vị thời gian: </strong>{fakeUnitTimeList.find(x => x.value === projectData?.unitOfTime)?.text || "Không xác định"}</div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div><strong>Quản lý dự án: </strong> {projectData?.projectManager?.map(m => m.name).join(", ") || "Không xác định"}</div>
                    </div>
                    <div className="col-md-6">
                        <div><strong>Thành viên dự án: </strong>{projectData?.responsibleEmployees?.map(r => r.name).join(", ") || "Không xác định"}</div>
                    </div>
                </div>

            </div>
        )
    }

    const renderTasks = () => {
        return (
            <>
                {projectData?.tasks?.length === 0 && <span style={{ display: "flex", justifyContent: "center" }}>Không có thông tin công việc</span>}
                {projectData?.tasks?.map((item, index) => {
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
                                        Công việc: {item.name}</p>
                                </div>
                                <div className="box-body collapse" data-toggle="collapse" id={`task-proposal-${index}`} style={{ lineHeight: 2.3 }}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div><strong>Tên công việc: </strong><span>{item.name}</span></div>
                                            <div><strong>Mã công việc: </strong><span>{item.code}</span></div>
                                            <div><strong>Công việc tiền nhiệm: </strong><span>{item.preceedingTasks ?? "Không có"}</span></div>
                                            <div><strong>Mô tả công việc: </strong><span>{item.description}</span></div>
                                            <div><strong>Thời gian ước lượng: </strong><span>{item.estimateNormalTime} ({fakeUnitTimeList.find(x => x.value === projectData?.unitOfTime)?.text})</span></div>
                                            <div><strong>Thời lượng thỏa hiệp: </strong><span>{item.estimateOptimisticTime} ({fakeUnitTimeList.find(x => x.value === projectData?.unitOfTime)?.text})</span></div>
                                        </div>
                                        <div className="col-md-6">
                                            <div><strong>Người phê duyệt: </strong><span>{item.accountableEmployees?.map(x => convertUserIdToUserName(listUsers, x)).join(", ")}</span></div>
                                            <div><strong>Người thực hiện: </strong><span>{item.responsibleEmployees?.map(x => convertUserIdToUserName(listUsers, x)).join(", ")}</span></div>
                                            <div><strong>Tổng trọng số người thực hiện: </strong><span>{item.totalResWeight} (%)</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                }
                )
                }
            </>
        )
    }
    return (
        <React.Fragment>
            <DialogModal
                modalID={`modal-detail-project-template-${id}`} isLoading={false}
                formID="form-detail-project-template"
                title={"Chi tiết mẫu dự án"}
                hasSaveButton={false}
                size={75}
            >
                <form id="form-detail-project-template">
                    <div className="nav-tabs-custom" style={{ boxShadow: "none", MozBoxShadow: "none", WebkitBoxShadow: "none", marginBottom: 0 }}>
                        {/* Tabbed pane */}
                        <ul className="nav nav-tabs">
                            {/* Nút tab thông tin cơ bản */}
                            <li className="active"><a href={`#general-detail-${id}`} onClick={() => handleChangeContent(`general-detail-${id}`)} data-toggle="tab">Thông số và nhân sự mẫu dự án</a></li>
                            {/* Nút tab các bên tgia */}
                            <li><a href={`#tasks-detail-${id}`} onClick={() => handleChangeContent(`tasks-detail-${id}`)} data-toggle="tab">Công việc trong mẫu dự án</a></li>
                        </ul>
                        <div className="tab-content">
                            <div className={selectedTab === "general" ? "active tab-pane" : "tab-pane"} id={`general-detail-${id}`}>
                                {renderGeneral()}
                            </div>
                            <div className={selectedTab === "tasks" ? "active tab-pane" : "tab-pane"} id={`tasks-detail-${id}`}>
                                {renderTasks()}
                            </div>
                        </div>
                    </div>
                </form>
            </DialogModal>
        </React.Fragment>
    );
}

function mapStateToProps(state) {
    const { projectTemplate, user } = state;
    return { projectTemplate, user }
}

const mapDispatchToProps = {
    editProjectTemplateDispatch: ProjectTemplateActions.editProjectTemplateDispatch,
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(DetailProjectTemplate));