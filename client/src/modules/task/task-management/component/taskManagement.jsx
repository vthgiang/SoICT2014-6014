import React, { Component } from 'react';
import { TabTaskContent } from './taskTab';
import { withTranslate } from 'react-redux-multilingual';

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
        const { currentTab } = this.state;
        const { translate } = this.props;
        return (
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#responsible" data-toggle="tab" onClick={() => this.handleChangeTab("responsible")}>{translate('task.task_management.responsible')}</a></li>
                    <li><a href="#accountable" data-toggle="tab" onClick={() => this.handleChangeTab("accountable")}>{translate('task.task_management.accountable')}</a></li>
                    <li><a href="#consulted" data-toggle="tab" onClick={() => this.handleChangeTab("consulted")}>{translate('task.task_management.consulted')}</a></li>
                    <li><a href="#creator" data-toggle="tab" onClick={() => this.handleChangeTab("creator")}>{translate('task.task_management.creator')}</a></li>
                    <li><a href="#informed" data-toggle="tab" onClick={() => this.handleChangeTab("informed")}>{translate('task.task_management.informed')}</a></li>
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

const translateTaskManagement = withTranslate(TaskManagement);
export {translateTaskManagement as TaskManagement} ;
// export default ( withTranslate(TaskManagement) ) ;
