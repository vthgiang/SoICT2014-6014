import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";

import { Tree, SlimScroll, ExportExcel } from '../../../common-components';
import { ProjectActions } from "../redux/actions";
import { UserActions } from '../../super-admin/user/redux/actions';
function CategoryProject(props) {

    const [state, setState] = useState({
        projectParent: [],
        deleteNode: [],

    });

    const { project, translate } = props;

    const checkNode = (e, data) => {
        setState({
            ...state,
            projectParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }
    useEffect(() => {
        //   props.getProjects({ calledId: "paginate", page, limit });
        props.getProjects({ calledId: "all" })
        //  props.getAllUser();
    }, [])

    // const deleteArchive = () => {
    //     const { translate } = props;
    //     const { deleteNode, projectParent } = state;
    //     Swal.fire({
    //         html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         cancelButtonText: translate('general.no'),
    //         confirmButtonText: translate('general.yes'),
    //     }).then(result => {
    //         if (result.value && projectParent.length > 1) {
    //             props.deleteDocumentArchive(projectParent, "many");
    //             setState({
    //                 deleteNode: []
    //             });
    //         } else if (result.value && projectParent.length === 1) {
    //             props.deleteDocumentArchive(projectParent, 'single');
    //             setState({
    //                 deleteNode: []
    //             });
    //         }
    //     })
    // }
    const onChanged = async (e, data) => {
        await setState({
            currentArchive: data.node,
        })
        window.$(`#edit-document-archive`).slideDown();
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

    const unCheckNode = (e, data) => {
        setState({
            archiveParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d],

        })
    }
    const list = project.data.list;
    const dataTree = list.map(node => {
        return {
            ...node,
            text: node.name,
            id: node._id,
            state: { "open": true },
            parent: node.parent ? node.parent.toString() : "#"
        }
    })

    console.log('lllllllll', list, dataTree);
    return (
        <React.Fragment>
            <div class="row">
                <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7">
                    <div className="archive-tree" id="archive-tree">
                        <Tree
                            id="tree-qlcv-category-project"
                            onChanged={onChanged}
                            checkNode={checkNode}
                            unCheckNode={unCheckNode}
                            data={dataTree}
                        />
                    </div>
                    <SlimScroll outerComponentId="archive-tree" innerComponentId="tree-qlcv-document-archive" innerComponentWidth={"100%"} activate={true} />
                </div>
            </div>
        </React.Fragment>
    )


}


function mapState(state) {
    const { project, user } = state;

    return { project, user }
}
const actions = {
    getProjects: ProjectActions.getProjects,
    deleteProject: ProjectActions.deleteProject,


    // getAllUser: UserActions.get,

}

const connectedCategoryProject = connect(mapState, actions)(withTranslate(CategoryProject));
export { connectedCategoryProject as CategoryProject };