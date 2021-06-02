import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import Swal from 'sweetalert2';
import { CategoryActions } from '../redux/actions';
import CategoryEditTree from './categoryEditTree';
import CategoryCreateTree from './categoryCreateTree';
import { Tree, SlimScroll, ExportExcel } from '../../../../../common-components';
import './category.css';

function CategoryManagementTree(props) {
    const [state, setState] = useState({
        categoryParent: [],
        deleteNode: [],
    })

    useEffect(() => {
        props.getCategoryToTree()
    }, [])

    const onChanged = async (e, data) => {
        await setState({
            ...state,
            currentCategory: data.node,

        })
        window.$(`#edit-category-good`).slideDown();
    }

    const checkNode = (e, data) => {
        setState({
            ...state,
            categoryParent: [...data.selected],
            deleteNode: [...data.selected, ...data.node.children_d]
        })
    }

    const unCheckNode = (e, data) => {
        setState({
            ...state,
            categoryParent: [...data.selected],
            deleteNode: [...data.selected],

        })
    }

    const handleAddCategory = (event) => {
        event.preventDefault();
        window.$('#modal-create-category-good').modal('show');
    }

    const deleteCategory = () => {
        const { translate } = props;
        const { deleteNode, categoryParent } = state;
        Swal.fire({
            html: `<h4 style="color: red"><div>Xóa lưu trữ</div>?</h4>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: translate('general.no'),
            confirmButtonText: translate('general.yes'),
        }).then((result) => {
            if (result.value && categoryParent.length > 1) {
                props.deleteCategory(categoryParent, "many");
                setState({
                    ...state,
                    deleteNode: [],
                    categoryParent: []
                });
            } else if (result.value && categoryParent.length === 1) {
                props.deleteCategory(categoryParent, 'single');
                setState({
                    ...state,
                    deleteNode: [],
                    categoryParent: []
                });
            }
        })
    }

    const { categoryParent, deleteNode, currentCategory } = state;
    const { translate, categories } = props;
    const { list, tree } = categories.categoryToTree;

    const dataTree = list ? list.map(node => {
        return {
            ...node,
            text: node.name,
            icon: 'glyphicon glyphicon-book',
            state: { "open": true },
            id: node._id,
            parent: node.parent ? node.parent.toString() : "#"
        }
    }) : null;
    return (
        <React.Fragment>

            <div className="form-inline">
                <div className="dropdown pull-right" style={{ marginBottom: 15 }}>
                    <button type="button" className="btn btn-success dropdown-toggler pull-right" data-toggle="dropdown" aria-expanded="true" title={translate('manage_warehouse.category_management.add')}
                        disabled={categoryParent.length > 1 ? true : false}>{translate('manage_warehouse.category_management.add')}</button>
                    <ul className="dropdown-menu pull-right">
                        <li><a href="#modal-create-category-good" title="Add category" onClick={(event) => { handleAddCategory(event) }}>{translate('manage_warehouse.category_management.add')}</a></li>
                        {/* <li><a href="#modal_import_file_category_good" title="ImportForm" onClick={(event) => { handImportFile(event) }}>ImportFile</a></li> */}
                    </ul>
                </div>
            </div>

            {
                deleteNode.length > 0 && <button className="btn btn-danger" style={{ marginLeft: '5px' }} onClick={deleteCategory}>{translate('general.delete')}</button>
            }
            <CategoryCreateTree categoryParent={state.categoryParent[0]} />
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    <div className="category-tree" id="category-tree">
                        <Tree
                            id="tree-qlcv-category-good"
                            onChanged={onChanged}
                            checkNode={checkNode}
                            unCheckNode={unCheckNode}
                            data={dataTree}
                        />
                    </div>
                    <SlimScroll outerComponentId="category-tree" innerComponentId="tree-qlcv-category-good" innerComponentWidth={"100%"} activate={true} />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                    {
                        currentCategory &&
                        <CategoryEditTree
                            categoryId={currentCategory.id}
                            categoryCode={currentCategory.original.code}
                            categoryName={currentCategory.text}
                            categoryParent={currentCategory.parent}
                            categoryDescription={currentCategory.original.description}
                        />
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => state;

const mapDispatchToProps = {
    getCategoryToTree: CategoryActions.getCategoryToTree,
    deleteCategory: CategoryActions.deleteCategory
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryManagementTree));