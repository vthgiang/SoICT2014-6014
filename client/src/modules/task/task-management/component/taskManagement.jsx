import React, { Component } from 'react';
import { TabTaskContent } from './taskTab';

class TaskManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: "responsible",
        };
    }
    handleChangeTab = async (role) => {
        let script = document.createElement('script');
        script.src = '../lib/main/js/GridTableVers1.js';//fix /lib/main.....---------------------------------------------------
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        await this.setState(state => {
            return {
                ...state,
                currentTab: role
            }
        })
    }
    render() {
        const { currentTab } = this.state
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#responsible" data-toggle="tab" onClick={() => this.handleChangeTab("responsible")}>Thực hiện chính</a></li>
                    <li><a href="#accountable" data-toggle="tab" onClick={() => this.handleChangeTab("accountable")}>Phê duyệt</a></li>
                    <li><a href="#consulted" data-toggle="tab" onClick={() => this.handleChangeTab("consulted")}>Hỗ trợ thực hiện</a></li>
                    <li><a href="#creator" data-toggle="tab" onClick={() => this.handleChangeTab("creator")}>Thiết lập</a></li>
                    <li><a href="#informed" data-toggle="tab" onClick={() => this.handleChangeTab("informed")}>Quan sát</a></li>
                </ul>
                <div className="tab-content">
                    <div className="active tab-pane" id="responsible">
                        {currentTab === "responsible" && <TabTaskContent role="responsible" />}
                    </div>
                    <div className="tab-pane" id="accountable">
                        {currentTab === "accountable" && <TabTaskContent role="accountable" />}
                    </div>
                    <div className="tab-pane" id="consulted">
                        {currentTab === "consulted" && <TabTaskContent role="consulted" />}
                    </div>
                    <div className="tab-pane" id="creator">
                        {currentTab === "creator" && <TabTaskContent role="creator" />}
                    </div>
                    <div className="tab-pane" id="informed">
                        {currentTab === "informed" && <TabTaskContent role="informed" />}
                    </div>
                </div>
            </div>
        );
    }
}
export { TaskManagement };
