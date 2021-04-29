import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { TaskOrganizationalUnitsChart } from './combinedContent';
import { CurrentTaskTimesheetLogInOrganizationalUnit } from '../../task/task-dashboard/task-organization-dashboard/currentTaskTimesheetLogInOrganizationalUnit'
class TabTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    };

    render() {
        const { childOrganizationalUnit, organizationalUnits } = this.props;

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <TaskOrganizationalUnitsChart 
                            childOrganizationalUnit={childOrganizationalUnit} 
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <CurrentTaskTimesheetLogInOrganizationalUnit
                            organizationalUnitIds={organizationalUnits}
                            listUnitSelect={childOrganizationalUnit?.map(item => {
                                return { text: item?.name, value: item?.id }
                            })}
                            getUnitName={this.props.getUnitName}
                            showUnitTask={this.props.showUnitGeneraTask}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const tabTask = connect(mapState, null)(withTranslate(TabTask));
export { tabTask as TabTask };