import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Tree, SlimScroll, ExportExcel } from '../../../../../common-components';
import Swal from 'sweetalert2';
import { CareerReduxAction } from '../../redux/actions';
import EditForm from './editForm';
import CreateForm from './createForm';
import "./careerAction.css";

function CareerAction(props) {
    const [state, setState] = useState({
        careerParent: [],
        deleteNode: [],
    })

    useEffect(() => {
        props.getListCareerAction({ name: '', page: 1, limit: 1000 });
        props.getListCareerPosition({ name: '', page: 1, limit: 1000 });
    }, [])
    const onChanged = async (e, data) => {
        await setState({
            ...state,
            currentNode: data.node,
        })
        window.$(`#edit-career-action`).slideDown();
    }

    const checkNode = (e, data) => {
        setState({
            ...state,
            careerParent: [...data.selected],
            // deleteNode: [...data.selected, ...data.node.children_d],
            deleteNode: [...data.selected],
        })
    }

    const unCheckNode = (e, data) => {
        setState({
            ...state,
            careerParent: [...data.selected],
            deleteNode: [...data.selected],
        })
        console.log('statode', state);
    }
    const handleAddCareerAction = (event) => {
        event.preventDefault();
        window.$('#modal-create-career-action').modal('show');
    }
    /**Mở modal import file excel */
    const handImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file_career_action').modal('show');
    }
    const deleteCareer = () => {
        const { translate } = props;
        const { deleteNode, careerParent } = state;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa hoạt động nghề nghiệp</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(result => {
            if (result.value) {
                console.log('Confirm delete');
                props.deleteCareerAction(deleteNode)
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
    const list = career.listAction.filter(e => e.isLabel !== 1);

    let dataTree = list.map(elm => {
        return {
            ...elm,
            id: elm._id,
            text: elm.name,
            // state: { "opened": true },
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
    let unChooseNode = currentNode ? findChildrenNode(list, currentNode) : [];

    return (
        <React.Fragment>
            <div className="box box-body">

                <div className="form-inline">
                    <a className="btn btn-success pull-right" href="#modal-create-career-action" title="Add Career action" onClick={(event) => { handleAddCareerAction(event) }}>Thêm</a>
                </div>

                {
                    careerParent.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={deleteCareer}>{translate('general.delete')}</button>
                }
                <CreateForm list={list} />
                <div className="row"
                >
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        <div className="career-action-tree" id="career-action-tree">
                            <Tree
                                id="tree-qlcv-career-action"
                                onChanged={onChanged}
                                checkNode={checkNode}
                                unCheckNode={unCheckNode}
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
                                careerParent={(currentNode.parent !== "#") ? currentNode.parent : []}
                                careerPackage={currentNode.original.package ? currentNode.original.package : ""}
                                actionLabel={currentNode.original.label.map(e => e._id)}
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

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getListCareerAction: CareerReduxAction.getListCareerAction,
    getListCareerPosition: CareerReduxAction.getListCareerPosition,
    deleteCareerAction: CareerReduxAction.deleteCareerAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CareerAction));