import React, { Component } from 'react';
import { connect } from 'react-redux';
import  {taskTemplateActions} from '../redux/actions';

class ModalEditTaskTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTemplate: this.props.id
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
    render() {
        var template;
        const { tasktemplates } = this.props;
        if (tasktemplates.template) template = tasktemplates.template;
        return (
            <React.Fragment>
                <div className="modal fade" id={"editTaskTemplate" + this.props.id}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" onClick={()=>this.handleCloseModal(this.props.id)} data-dismiss="modal" aria-hidden="true">×</button>
                                <h3 className="modal-title">Chỉnh sửa {template && template.name}</h3>
                            </div>
                            <div className="modal-body">
                                {
                                    typeof template !== "undefined" ?
                                        <form>
                                            <div className="box-body">
                                                <div className="form-group">
                                                    <label>Tên mẫu công việc</label>
                                                    <input name="url" type="text" className="form-control" defaultValue={template.info.name} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Mô tả mẫu công việc</label>
                                                    <input name="description" type="text" className="form-control" defaultValue={template.info.description} />
                                                </div>
                                            </div>
                                        </form> : null
                                }
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-success" >Lưu</button>
                                <button type="cancel" className="btn btn-primary" data-dismiss="modal" onClick={()=>this.handleCloseModal(this.props.id)}>Hủy bỏ</button>
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
const connectedModelEditTaskTemplate = connect(mapState, actionCreators)(ModalEditTaskTemplate);
export { connectedModelEditTaskTemplate as ModalEditTaskTemplate };