import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Tree, SlimScroll, ExportExcel } from '../../../../common-components';
import Swal from 'sweetalert2';
import { MajorActions } from '../redux/actions';
import EditForm from './editForm';
import CreateForm from './createForm';
import "./major.css";

function Major(props) {

    const [state, setState] = useState({
        majorParent: [],
        deleteNode: [],
    });

    useEffect(() => {
        props.getListMajor({ name: '', page: 1, limit: 1000 });
    }, [])

    const onChanged = async (e, data) => {
        setState({
            ...state,
            currentNode: data.node,
        })
        window.$(`#edit-major`).slideDown();
    }

    const checkNode = (e, data) => {
        setState({
            ...state,
            majorParent: [...data.selected],
            // deleteNode: [...data.selected, ...data.node.children_d],
            deleteNode: [...data.selected],
        })
    }

    const unCheckNode = (e, data) => {
        setState({
            ...state,
            majorParent: [...data.selected],
            // deleteNode: [...data.selected, ...data.node.children_d],
            deleteNode: [...data.selected],
        })
    }
    const handleAddMajor = (event) => {
        event.preventDefault();
        window.$('#modal-create-major').modal('show');
    }
    /**Mở modal import file excel */
    const handImportFile = (event) => {
        event.preventDefault();
        window.$('#modal_import_file_archive').modal('show');
    }
    const deleteMajor = () => {
        const { translate } = props;
        const { deleteNode, majorParent } = state;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then(result => {
            console.log('Confirm delete');
            console.log('state', state);
            this.props.deleteMajor(deleteNode);
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

    const { majorParent, currentNode } = state;
    const { translate } = props;
    const { major } = props;
    const list = major.listMajor;

    let dataTreeSelect = [];
    let dataTree = list.map(elm => {
        return {
            ...elm,
            id: elm._id,
            text: elm.name,
            state: { "opened": true },
            parent: "#",
        }
    });
    dataTreeSelect = dataTree;
    for (let i in list) {
        let groupMap = list[i].group;
        let group = list[i].group.map(elm => {
            return {
                ...elm,
                id: elm._id,
                text: elm.name,
                state: { "opened": true },
                parent: list[i]._id.toString(),
            }
        });
        dataTree = [...dataTree, ...group];
        dataTreeSelect = [...dataTreeSelect, ...group];

        for (let x in groupMap) {
            let specializedMap = groupMap[x].specialized;
            let specialized = groupMap[x].specialized.map(elm => {
                return {
                    ...elm,
                    id: elm._id,
                    text: elm.name,
                    state: { "opened": true },
                    parent: groupMap[x]._id.toString(),
                }
            });
            dataTree = [...dataTree, ...specialized];
        }
    }
    let unChooseNode = currentNode ? findChildrenNode(list, currentNode) : [];
    // console.log('dataTree', dataTree, dataTreeSelect);
    return (
        <React.Fragment>
            <div className="box box-body">

                <div className="form-inline">
                    <a className="btn btn-success pull-right" href="#modal-create-major" title="Add major" onClick={(event) => { handleAddMajor(event) }}>Thêm</a>
                </div>

                {
                    majorParent.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={deleteMajor}>{translate('general.delete')}</button>
                }
                <CreateForm
                    list={dataTreeSelect}
                // majorParent={currentNode.parent}
                />
                <div className="row"
                >
                    <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                        <div className="major-tree" id="major-tree">
                            <Tree
                                id="tree-qlcv-major"
                                onChanged={onChanged}
                                checkNode={checkNode}
                                unCheckNode={unCheckNode}
                                data={dataTree}
                            />
                        </div>
                        <SlimScroll outerComponentId="major-tree" innerComponentId="tree-qlcv-major" innerComponentWidth={"100%"} activate={true} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                        {
                            currentNode &&
                            <EditForm
                                majorId={currentNode.id}
                                majorName={currentNode.text}
                                majorCode={currentNode.original.code}
                                majorParent={currentNode.parent}

                                listData={dataTreeSelect}
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
    getListMajor: MajorActions.getListMajor,
    deleteMajor: MajorActions.deleteMajor,
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Major));