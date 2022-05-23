import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { ConfigurationActions } from '../redux/actions';

import { HumanResourceConfiguration, BiddingConfiguration } from './combinedContent';

function ManageConfiguration(props) {
    const [selectedTab, setSelectedTab] = useState("human_resource_config")
    const [humanResourceConfig, setHumanResourceConfig] = useState({})
    const [biddingConfig, setBiddingConfig] = useState({})
    const { translate } = props

    // hàm xử lý tabbedPane
    const handleChangeContent = async (content) => {
        await setSelectedTab(content)
    }

    useEffect(() => {
        props.getConfiguration();
    }, []);

    const save = () => {
        props.editConfiguration({
            humanResource: humanResourceConfig,
            bidding: biddingConfig,
        });
    }

    return (
        <div className="nav-tabs-custom box-body">
            <ul className="nav nav-tabs">
                <li className="active"><a onClick={() => handleChangeContent("human_resource_config")} data-toggle="tab" href="#human_resource_config">{`Quản lý nhân sự`}</a></li>
                <li className=""><a onClick={() => handleChangeContent("bidding_config")} data-toggle="tab" href="#bidding_config">{`Quản lý đấu thầu`}</a></li>
            </ul>
            <div className="tab-content">
                <div className={selectedTab === "human_resource_config" ? "active tab-pane" : "tab-pane"}>
                    <HumanResourceConfiguration
                        id="human_resource_config"
                        setDataReq={setHumanResourceConfig}
                    />
                </div>
                <div className={selectedTab === "bidding_config" ? "active tab-pane" : "tab-pane"}>
                    <BiddingConfiguration
                        id="bidding_config"
                        setDataReq={setBiddingConfig}
                    />
                </div>
            </div>
            <div className=" col-md-12">
                <button type="button" className="btn pull-right btn-success" onClick={() => save()} >{translate('human_resource.work_plan.save_as')}</button>
            </div>
        </div>
    );
}

function mapState(state) {
    const { modelConfiguration } = state;
    return { modelConfiguration };
};

const actionCreators = {
    getConfiguration: ConfigurationActions.getConfiguration,
    editConfiguration: ConfigurationActions.editConfiguration,
};

const configuration = connect(mapState, actionCreators)(withTranslate(ManageConfiguration));
export { configuration as ManageConfiguration };
