import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { TaskOrganizationalUnitsChart } from './combinedContent';
class TabTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    };

    render() {
        const { translate, tasks } = this.props; //redux
        let { childOrganizationalUnit } = this.props;

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <TaskOrganizationalUnitsChart childOrganizationalUnit={childOrganizationalUnit} />
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