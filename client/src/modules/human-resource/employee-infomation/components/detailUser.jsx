import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import AssetsManagedByUser from "./assetsManagedByUser";
import KpiUser from "./kpiUser";
import TaskUser from "./taskUser";
import TakeLeaveUser from "./overtimeUser"
import { UserServices } from "../../../super-admin/user/redux/services";
import { SelectMulti, forceCheckOrVisible } from '../../../../common-components';
import CommendationUser from "./commendationUser";
import DisciplineUser from "./disciplineUser";

function DetailUser(props) {
    const [nameTask, setNameTask] = useState(" thực hiện ")
    const { translate } = props
    const [email, setEmail] = useState()
    useEffect(() => {
        if (props.user._id) {
            UserServices.getUserById(props.user._id)
                .then(res => {
                    setEmail(res.data.content.email)
                })
        }
    }, [props.user._id])
    const handleNavTabs = (value) => {
        if (value) {
            forceCheckOrVisible(true, false);
        }
        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }
    const handleNameTask = (taskName) => {
        setNameTask(taskName)
    }
    const { state, search } = props
    let partMonth1 = state.startDate.split('-');
    let startDate = [partMonth1[1], partMonth1[0]].join('-');
    let partMonth2 = state.endDate.split('-');
    let endDate = [partMonth2[1], partMonth2[0]].join('-');
    return (
        <div className="nav-tabs-custom">
            <ul className="nav nav-tabs">
                <li className="active"><a href="#task" data-toggle="tab" onClick={() => handleNavTabs()}>Công việc nhân viên</a></li>
                <li><a href="#asset" data-toggle="tab" onClick={() => handleNavTabs(true)}>Tài sản nhân viên</a></li>
                <li><a href="#commendation-dícipline" data-toggle="tab" onClick={() => handleNavTabs(true)}>Khen thường và kỷ luật</a></li>
                <li><a href="#kpi" data-toggle="tab" onClick={() => handleNavTabs(true)}>KPI nhân viên</a></li>
                <li><a href="#annualLeave" data-toggle="tab" onClick={() => handleNavTabs(true)}>Nghỉ phép-Tăng ca</a></li>
            </ul>
            <div className="tab-content ">
                <div className="tab-pane active" id="task">
                    <TaskUser user={props.user} unitId={props.id} startDate={startDate} endDate={endDate} search={search} changeTask={handleNameTask}></TaskUser>
                </div>
                <div className="tab-pane" id="asset">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div class="title">Tài sản quản lý</div>
                                </div>
                                <AssetsManagedByUser user={props.user} unitId={props.id} type="quản lý" ></AssetsManagedByUser>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div class="title">Tài sản sử dụng</div>
                                </div>
                                <AssetsManagedByUser user={props.user} unitId={props.id} type="sử dụng" ></AssetsManagedByUser>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tab-pane" id="commendation-dícipline">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div class="title">Thông tin khen thưởng</div>
                                </div>
                                <CommendationUser user={props.user} unitId={props.id} email={email} startDate={startDate} endDate={endDate} search={search} ></CommendationUser>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <div class="title">Thông tin kỷ luật</div>
                                </div>
                                <DisciplineUser user={props.user} unitId={props.id} email={email} startDate={startDate} endDate={endDate} search={search}></DisciplineUser>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tab-pane" id="kpi">
                    <KpiUser user={props.user} unitId={props.id} startDate={startDate} endDate={endDate} search={search} ></KpiUser>
                </div>
                <div className="tab-pane" id="annualLeave">
                    <TakeLeaveUser user={props.user} unitId={props.id} email={email} startDate={startDate} endDate={endDate} search={search}></TakeLeaveUser>
                </div>
            </div>

        </div>
    )
}
function mapState(state) {
    const { } = state;

    return {}
}

const mapDispatchToProps = {
}
export default connect(mapState, mapDispatchToProps)(withTranslate(DetailUser));