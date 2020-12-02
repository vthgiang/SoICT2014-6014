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
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    unCheckNode = (e, data) => {
        this.setState({
            careerParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d],

        })
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
            if (result.value && careerParent.length > 1) {
                // this.props.deleteDocumentArchive(careerParent, "many");
                // this.setState({
                //     deleteNode: []
                // });
            } else if (result.value && careerParent.length === 1) {
                // this.props.deleteDocumentArchive(careerParent, 'single');
                // this.setState({
                //     deleteNode: []
                // });
            }
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
        const list = career.listAction;

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
            let detail = list[i].detail.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    // state: { "opened": true },
                    parent: list[i]._id.toString(),
                }
            });
            dataTree = [...dataTree, ...detail];
        }
        let unChooseNode = currentNode ? this.findChildrenNode(list, currentNode) : [];
        console.log('dataTree', dataTree);
        return (
            <React.Fragment>
                <div className="box box-body">

                    <div className="form-inline">
                        {/* <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('document.administration.domains.add')}>{translate('general.add')}</button>
                            <ul className="dropdown-menu pull-right">
                                <li><a href="#modal-create-career-position" title="Add archive" onClick={(event) => { this.handleAddCareerAction(event) }}>{translate('document.add')}</a></li>
                                <li><a href="#modal_import_file_archive" title="ImportForm" onClick={(event) => { this.handImportFile(event) }}>{translate('document.import')}</a></li>
                            </ul>
                        </div> */}
                        <a className="btn btn-success pull-right" href="#modal-create-career-action" title="Add Career action" onClick={(event) => { this.handleAddCareerAction(event) }}>Thêm</a>
                    </div>

                    {
                        careerParent.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={this.deleteCareer}>{translate('general.delete')}</button>
                    }
                    {/* <ExportExcel id="export-career-position" exportData={exportData} style={{ marginRight: 5 }} buttonName={translate('document.export')} /> */}
                    <CreateForm list={dataTree} />
                    {/* <ArchiveImportForm /> */}
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
                                    careerId={currentNode.id}
                                    careerName={currentNode.text}
                                    careerCode={currentNode.original.code}
                                    careerParent={currentNode.parent ? currentNode.parent : undefined}
                                    careerPackage={currentNode.original.package ? currentNode.original.package : ""}

                                    listData={dataTree}
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
    // editDocumentArchive: DocumentActions.editDocumentArchive,
    // deleteDocumentArchive: DocumentActions.deleteDocumentArchive,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CareerAction));