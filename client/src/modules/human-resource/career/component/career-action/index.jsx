import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Tree, SlimScroll, ExportExcel } from '../../../../../common-components';
import Swal from 'sweetalert2';
import { CareerReduxAction } from '../../redux/actions';
import EditForm from './editForm';
import CreateForm from './createForm';
import "./careerAction.css";

class CareerAction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            careerParent: [],
            deleteNode: [],
        }
    }

    componentDidMount() {
        this.props.getListCareerAction({ name: '', page: 1, limit: 1000 });
        this.props.getListCareerPosition({ name: '', page: 1, limit: 1000 });
    }
    onChanged = async (e, data) => {
        await this.setState({
            currentNode: data.node,
        })
        window.$(`#edit-career-action`).slideDown();
    }

    checkNode = (e, data) => {
        this.setState({
            careerParent: [...data.selected],
            // deleteNode: [...data.selected, ...data.node.children_d],
            deleteNode: [...data.selected],
        })
    }

    unCheckNode = (e, data) => {
        this.setState({
            careerParent: [...data.selected],
            deleteNode: [...data.selected],
        })
        console.log('statode', this.state);
    }
    handleAddCareerAction = (event) => {
        event.preventDefault();
        window.$('#modal-create-career-action').modal('show');
    }
    /**Mở modal import file excel */
    handImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file_career_action').modal('show');
    }
    deleteCareer = () => {
        const { translate } = this.props;
        const { deleteNode, careerParent } = this.state;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa hoạt động nghề nghiệp</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(result => {
            console.log('Confirm delete');
            this.props.deleteCareerAction(deleteNode)
        })
    }

    findChildrenNode = (list, node) => {
        let array = [];
        let queue_children = [];
        queue_children = [node];
        while (queue_children.length > 0) {
            let tmp = queue_children.shift();
            array = [...array, tmp._id];
            let children = list.filter(child => child.parent === tmp.id);
            queue_children = queue_children.concat(children);
        }
        array.shift();
        array.unshift(node.id);
        return array;
    }

    render() {
        const { careerParent, currentNode } = this.state;
        const { translate } = this.props;
        const { career } = this.props;
        const list = career.listAction.filter(e => e.isLabel !== 1);

        let dataTree = list.map(elm => {
            return {
                ...elm,
                id: elm._id,
                text: elm.name,
                state: { "opened": true },
                parent: "#",
            }
        });
        for (let i in list) {
            let detail = list[i].label.map(elm => {
                return {
                    ...elm,
                    id: `${elm._id}-${list[i]._id}`,
                    text: elm.name,
                    // state: { "opened": true },
                    parent: list[i]._id.toString(),
                }
            });
            dataTree = [...dataTree, ...detail];
        }
        let unChooseNode = currentNode ? this.findChildrenNode(list, currentNode) : [];

        return (
            <React.Fragment>
                <div className="box box-body">

                    <div className="form-inline">
                        <a className="btn btn-success pull-right" href="#modal-create-career-action" title="Add Career action" onClick={(event) => { this.handleAddCareerAction(event) }}>Thêm</a>
                    </div>

                    {
                        careerParent.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={this.deleteCareer}>{translate('general.delete')}</button>
                    }
                    <CreateForm list={list} />
                    <div className="row"
                    >
                        <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                            <div className="career-action-tree" id="career-action-tree">
                                <Tree
                                    id="tree-qlcv-career-action"
                                    onChanged={this.onChanged}
                                    checkNode={this.checkNode}
                                    unCheckNode={this.unCheckNode}
                                    data={dataTree}
                                />
                            </div>
                            <SlimScroll outerComponentId="career-action-tree" innerComponentId="tree-qlcv-career-action" innerComponentWidth={"100%"} activate={true} />
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                            {
                                currentNode &&
                                <EditForm
                                    careerId={currentNode.original._id}
                                    careerName={currentNode.text}
                                    careerCode={currentNode.original.code}
                                    careerParent={(currentNode.parent !== "#") ? currentNode.parent : undefined}
                                    careerPackage={currentNode.original.package ? currentNode.original.package : ""}
                                    actionLabel={currentNode.original.label.map(e=>e._id)}
                                    isLabel={currentNode.original.isLabel}

                                    listData={list}
                                    unChooseNode={unChooseNode}
                                />
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getListCareerAction: CareerReduxAction.getListCareerAction,
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    deleteCareerAction: CareerReduxAction.deleteCareerAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CareerAction));