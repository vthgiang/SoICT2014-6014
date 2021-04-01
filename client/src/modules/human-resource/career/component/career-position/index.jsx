import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Tree, SlimScroll, ExportExcel } from '../../../../../common-components';
import Swal from 'sweetalert2';
import { CareerReduxAction } from '../../redux/actions';
import EditForm from './editForm';
import CreateForm from './createForm';
import "./careerPosition.css";

function CareerPosition(props) {
    const [state, setState] = useState({
        careerParent: [],
        deleteNode: [],
    });

    useEffect(() => {
        props.getListCareerPosition({ name: '', page: 1, limit: 1000 });
        props.getListCareerAction({ name: '', page: 1, limit: 1000 });
    }, [])

    const onChanged = async (e, data) => {
        console.log('data', data);
        await setState({
            ...state,
            currentNode: data.node,
        })
        window.$(`#edit-career-position`).slideDown();
    }

    const checkNode = (e, data) => {
        setState({
            ...state,
            careerParent: [...data.selected],
            // deleteNode: [...data.selected, ...data.node.children_d],
            deleteNode: [...data.selected]
        })
    }

    const unCheckNode = (e, data) => {
        setState({
            ...state,
            careerParent: [...data.selected],
            // deleteNode: [...data.selected, ...data.node.children_d],
            deleteNode: [...data.selected],

        })
    }

    const handleAddCareerPosition = (event) => {
        event.preventDefault();
        window.$('#modal-create-career-position').modal('show');
    }
    /**Mở modal import file excel */
    const handleImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file_archive').modal('show');
    }

    const deleteCareer = () => {
        const { translate } = props;
        const { deleteNode, careerParent } = state;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(result => {
            if (result.value) {
                console.log('Confirm delete');
                props.deleteCareerPosition(deleteNode)
                setState({
                    ...state,
                    deleteNode: []
                });
            }
        })
    }

    const findChildrenNode = (list, node) => {
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

    const { careerParent, currentNode } = state;
    const { translate } = props;
    const { career } = props;
    const list = career.listPosition;

    let dataTree = list.map(elm => {
        return {
            ...elm,
            id: elm._id,
            code: elm.code,
            text: elm.name,
            // state: { "opened": true },
            parent: "#",
        }
    });
    for (let i in list) {
        let description = list[i].description.map(elm => {
            return {
                ...elm,
                id: elm._id,
                text: elm.action.name,
                code: elm.action.code,
                // state: { "opened": true },
                parent: list[i]._id.toString(),
            }
        });
        dataTree = [...dataTree, ...description];
    }
    let unChooseNode = currentNode ? findChildrenNode(list, currentNode) : [];
    // console.log('dataTree', dataTree);
    return (
        <React.Fragment>
            <div className="box box-body">

                <div className="form-inline">
                    {/* <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                            <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('document.administration.domains.add')}>{translate('general.add')}</button>
                            <ul className="dropdown-menu pull-right">
                                <li><a href="#modal-create-career-position" title="Add archive" onClick={(event) => { this.handleAddCareerPosition(event) }}>{translate('document.add')}</a></li>
                                <li><a href="#modal_import_file_archive" title="ImportForm" onClick={(event) => { this.handImportFile(event) }}>{translate('document.import')}</a></li>
                            </ul>
                        </div> */}
                    <a className="btn btn-success pull-right" href="#modal-create-career-position" title="Add Career" onClick={(event) => { handleAddCareerPosition(event) }}>Thêm</a>
                </div>

                {
                    careerParent.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={deleteCareer}>{translate('general.delete')}</button>
                }
                {/* <ExportExcel id="export-career-position" exportData={exportData} style={{ marginRight: 5 }} buttonName={translate('document.export')} /> */}
                <CreateForm list={dataTree} />
                {/* <ArchiveImportForm /> */}
                <div className="row"
                >
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        <div className="career-position-tree" id="career-position-tree">
                            <Tree
                                id="tree-qlcv-career-position"
                                onChanged={onChanged}
                                checkNode={checkNode}
                                unCheckNode={unCheckNode}
                                data={dataTree}
                            />
                        </div>
                        <SlimScroll outerComponentId="career-position-tree" innerComponentId="tree-qlcv-career-position" innerComponentWidth={"100%"} activate={true} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                        {
                            currentNode &&
                            <EditForm
                                careerId={currentNode.id}
                                careerName={currentNode.text}
                                careerCode={currentNode.original.code}
                                careerPackage={currentNode.original.package ? currentNode.original.package : ""}
                                careerParent={(currentNode.parent !== "#") ? currentNode.parent : undefined}

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

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    getListCareerAction: CareerReduxAction.getListCareerAction,
    deleteCareerPosition: CareerReduxAction.deleteCareerPosition,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CareerPosition));