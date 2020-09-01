import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from "react-redux-multilingual";

class IncomingDataTab extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            taskId: undefined,
            task: undefined,
            infoTaskProcess: undefined
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isIncomingData && nextProps.taskId !== prevState.taskId) {
            let infoTaskProcess = {};
            for (let i in nextProps.infoTaskProcess) {
                infoTaskProcess[`${nextProps.infoTaskProcess[i]._id}`] = nextProps.infoTaskProcess[i];
            }

            return {
                ...prevState,
                taskId: nextProps.taskId,
                task: nextProps.task,
                infoTaskProcess: infoTaskProcess
            }
        } else {
            return null
        }
    }

    render() {
        const { task, infoTaskProcess } = this.state;
        let listTask = [];
        
        if (task && task.length !== 0 && task.preceedingTasks && task.preceedingTasks.length !== 0 && infoTaskProcess) {
            task.preceedingTasks.map((item, index) => {
                if (infoTaskProcess[`${item.task && item.task._id}`]) {
                    listTask[index] = {};
                    listTask[index].name = infoTaskProcess[`${item.task && item.task._id}`].name;

                    if (infoTaskProcess[`${item.task && item.task._id}`].taskInformations && infoTaskProcess[`${item.task && item.task._id}`].taskInformations.length !== 0) {
                        listTask[index].informations = infoTaskProcess[`${item.task && item.task._id}`].taskInformations.filter(info => info.isOutput);
                    } else {
                        listTask[index].informations = []
                    }

                    if (infoTaskProcess[`${item.task && item.task._id}`].documents && infoTaskProcess[`${item.task && item.task._id}`].documents.length !== 0) {
                        listTask[index].documents = infoTaskProcess[`${item.task && item.task._id}`].documents.filter(document => document.isOutput);
                    } else {
                        listTask[index].documents = []
                    }
                    
                }
            })
        }
        
        return (
            <React.Fragment>
                {
                    listTask.length !== 0
                    && listTask.map(task => 
                        <div className="description-box">
                            <h4>{task.name}</h4>
                            
                            {/** Danh sách thông tin */}
                            <div><strong>Thông tin</strong></div>
                            {
                                task.informations.length !== 0
                                ? task.informations.map(info => 
                                    info.isOutput &&
                                    <div>
                                        <ul>
                                            <strong>{info.name}</strong>
                                            <span> - {info.description}</span>
                                            <span> - {info.type}</span>
                                        </ul>
                                    </div>
                                )   
                                : <div>{task.name} không xuất thông tin</div>
                            }

                            {/** Danh sách tài liệu */}
                            <div><strong>Tài liệu</strong></div>
                            {
                                task.documents.length !== 0
                                ? task.documents.map(document => 
                                    document.isOutput &&
                                    <div>
                                        <ul>
                                            <li style={{ listStyle: "none" }}><strong>{document.description}</strong></li>
                                            <ul>
                                            {
                                                document.files
                                                && document.files.length !== 0
                                                && document.files.map(file => 
                                                    <li style={{ listStyle: "none" }}>
                                                        <strong>{file.name}</strong><span> - <a>{file.url}</a></span>
                                                    </li>
                                                )
                                            }
                                            </ul>
                                        </ul>
                                    </div>
                                )
                                : <div>{task.name} không xuất tài liệu</div>
                            }
                        </div>
                    )
                }
            </React.Fragment>
        )
    }
}


function mapState(state) {
    const { } = state;
    return {};
}
const actions = {

}

const connectIncomingDataTab = connect(mapState, actions)(withTranslate(IncomingDataTab));
export { connectIncomingDataTab as IncomingDataTab }