import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { DetailTaskTab } from './detailTaskTab';
import { ActionTab } from './actionTab';
import { taskManagementActions } from "../../task-management/redux/actions";
import { performTaskAction } from '../redux/actions';

import qs from 'qs';

class TaskComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        
    }

    componentDidMount = () => {
        if (this.props.location) { // Nếu là trang trực tiếp (trong Route)
            const { taskId } = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
            if (taskId){
                this.props.getTaskById(taskId);
                this.props.getTaskActions(taskId);
                this.props.getTaskComments(taskId)
            }
        }
    }

    render() {
                
        return (
            <div className="row row-equal-height" style={{margin: "0px", height: "100%", backgroundColor: "#fff"}}>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{ paddingTop: "10px"}}>

                    <DetailTaskTab
                        id={this.props.id}
                        role={this.props.role}
                    />
                </div>

                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6" style={{padding: "10px 0 10px 0", borderLeft: "1px solid #f4f4f4"}}>
                    <ActionTab 
                        id = {this.props.id}
                        role={this.props.role}
                    />
                </div>
            </div>
        );
    }
}
function mapState(state) {
    const { tasks } = state;
    return { tasks };
}

const actionCreators = {
    getTaskById: taskManagementActions.getTaskById,
    getTaskActions: performTaskAction.getTaskActions,
    getTaskComments: performTaskAction.getTaskComments,
};

const taskComponent = connect(mapState, actionCreators)(withTranslate(TaskComponent));
export { taskComponent as TaskComponent }


