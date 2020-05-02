import React, { Component } from 'react';
import { connect } from 'react-redux';
import  {taskTemplateActions} from '../redux/actions';
import { withTranslate } from 'react-redux-multilingual';

class ModalEditTaskTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {            
            editing: false,
        }
    }

    componentDidMount() {
        this.props.getTaskTemplate(this.props.id);
    }
    
    handleCloseModal = (id) => {
        var element = document.getElementsByTagName("BODY")[0];
        element.classList.remove("modal-open");
        var modal = document.getElementById(`editTaskTemplate${id}`);
        modal.classList.remove("in");
        modal.style = "display: none;";
    }

    // Submit edit template in data
    handleSubmit = async (event,id) => {
        event.preventDefault();
        await this.setState({
            editing: false,
            newTemplate: {
                name: this.name.value,
                description :this.description.value,
            }            
        });
        const { newTemplate } = this.state;
            if (newTemplate.name && newTemplate.description) {
                this.props.editTaskTemplate(id, newTemplate);
                this.handleCloseModal(this.props.id);
            }
        
            
            //window.$(`#editTaskTemplate${id}`).modal("hide");
    }
    render() {
        var template;
        const { tasktemplates } = this.props;
        const { translate } = this.props;
        if (tasktemplates.template) template = tasktemplates.template;
        return (
            <React.Fragment>
                <div className="modal fade" id={"editTaskTemplate" + this.props.id}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={()=>this.handleCloseModal(this.props.id)} data-dismiss="modal" aria-hidden="true">×</button>
                                <h3 className="modal-title">{translate('task_template.edit')}</h3>
                            </div>
                            <div className="modal-body">
                                {
                                    typeof template !== "undefined" ?
                                        <form>
                                            <div className="box-body">
                                                <div className="form-group">
                                                    <label>{translate('task_template.tasktemplate_name')}</label>
                                                    <input name="url" type="text" className="form-control" ref={input => this.name = input} defaultValue={template.info.name} />
                                                </div>
                                                <div className="form-group">
                                                    <label>{translate('task_template.description')}</label>
                                                    <input name="description" type="text" className="form-control" ref={input => this.description = input} defaultValue={template.info.description} />
                                                </div>
                                            </div>
                                        </form> : null
                                }
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-success" onClick={(event)=>this.handleSubmit(event, this.props.id)} >{translate('task_template.save')}</button>
                            <button type="cancel" className="btn btn-primary" data-dismiss="modal" onClick={()=>this.handleCloseModal(this.props.id)}>{translate('task_template.close')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

function mapState(state) {
    const { tasktemplates } = state;
    return { tasktemplates };
}

const actionCreators = {
    getTaskTemplate: taskTemplateActions.getTaskTemplateById,
    editTaskTemplate: taskTemplateActions.editTaskTemplate
};
const connectedModelEditTaskTemplate = connect(mapState, actionCreators)( withTranslate(ModalEditTaskTemplate));
export { connectedModelEditTaskTemplate as ModalEditTaskTemplate };