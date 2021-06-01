import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withTranslate } from "react-redux-multilingual";
import { CategoryActions } from '../redux/actions';
import { GoodActions } from '../../good-management/redux/actions';
import CategoryCreateForm from './categoryCreateForm';
import CategoryEditForm from './categoryEditForm';
import CategoryDetailForm from './categoryDetailInfo';
import { DataTableSetting, DeleteNotification, PaginateBar, SearchBar } from '../../../../../common-components';
import { getTableConfiguration } from '../../../../../helpers/tableConfiguration';
function CategoryManagementTable(props) {
    const tableId = "category-management-table";
    const defaultConfig = { limit: 5 }
    const limit = getTableConfiguration(tableId, defaultConfig).limit;

    const [state, setState] = useState({
        page: 1,
        limit: limit,
        option: 'code',
        value: '',
        tableId
    })

    useEffect(() => {
        let { page, limit } = state;
        props.getCategories();
        props.getCategoryToTree();
        props.getCategories({ page, limit });
    }, [])

    const setPage = (page) => {
        setState({
            ...state,
            page
        });
        const data = {
            limit: state.limit,
            page: page,
            key: state.option,
            value: state.value
        };
        props.getCategories(data);
    }

    const setLimit = (number) => {
        setState({
            ...state,
            limit: number
        });
        const data = {
            limit: number,
            page: state.page,
            key: state.option,
            value: state.value
        };
        props.getCategories(data);
    }

    const setOption = (title, option) => {
        setState({
            ...state,
            [title]: option
        });
    }

    const searchWithOption = async () => {
        const data = {
            limit: state.limit,
            page: 1,
            key: state.option,
            value: state.value
        };
        await props.getCategories(data);
    }

    const handleEdit = async (categories) => {
        await setState({
            ...state,
            currentRow: categories
        });

        window.$('#modal-edit-category').modal('show');
    }

    const handleShowDetailInfo = async (category) => {
        let id = category._id;
        props.getAllGoodsByCategory(id);
        await setState({
            ...state,
            currentRow: category
        })
        window.$('#modal-detail-category').modal('show');
    }

    const { categories, translate } = props;
    const { listPaginate, totalPages, page, categoryToTree } = categories;
    // const { tableId } = state;
    console.log(categoryToTree);

    return (
        <div className="box">
            <div className="box-body qlcv">
                <CategoryCreateForm />

                <SearchBar
                    columns={[
                        { title: translate('manage_warehouse.category_management.code'), value: 'code' },
                        { title: translate('manage_warehouse.category_management.name'), value: 'name' },
                        { title: translate('manage_warehouse.category_management.type'), value: 'type' }
                    ]}
                    valueOption={{ nonSelectedText: translate('manage_warehouse.category_management.choose_type'), allSelectedText: translate('manage_warehouse.category_management.all_type') }}
                    typeColumns={[
                        { value: "product", title: translate('manage_warehouse.category_management.product') },
                        { value: "material", title: translate('manage_warehouse.category_management.material') },
                        { value: "equipment", title: translate('manage_warehouse.category_management.equipment') },
                        { value: "waste", title: translate('manage_warehouse.category_management.waste') }
                    ]}
                    option={state.option}
                    setOption={setOption}
                    search={searchWithOption}
                />

                {
                    state.currentRow &&
                    <CategoryEditForm
                        categoryId={state.currentRow._id}
                        code={state.currentRow.code}
                        name={state.currentRow.name}
                        type={state.currentRow.type}
                        description={state.currentRow.description}
                    />
                }

                {
                    state.currentRow &&
                    <CategoryDetailForm
                        categoryId={state.currentRow._id}
                        code={state.currentRow.code}
                        name={state.currentRow.name}
                        type={state.currentRow.type}
                        description={state.currentRow.description}
                    />
                }

                <table id={tableId} className="table table-striped table-bordered table-hover" style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: "5%" }}>{translate('manage_warehouse.category_management.index')}</th>
                            <th>{translate('manage_warehouse.category_management.code')}</th>
                            <th>{translate('manage_warehouse.category_management.name')}</th>
                            <th>{translate('manage_warehouse.category_management.type')}</th>
                            <th>{translate('manage_warehouse.category_management.description')}</th>
                            <th style={{ width: '120px', textAlign: 'center' }}>{translate('table.action')}
                                <DataTableSetting
                                    tableId={tableId}
                                    columnArr={[
                                        translate('manage_warehouse.category_management.index'),
                                        translate('manage_warehouse.category_management.code'),
                                        translate('manage_warehouse.category_management.name'),
                                        translate('manage_warehouse.category_management.type'),
                                        translate('manage_warehouse.category_management.description')
                                    ]}
                                    setLimit={setLimit}
                                />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {(typeof listPaginate !== undefined && listPaginate.length !== 0) &&
                            listPaginate.map((x, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{x.code}</td>
                                    <td>{x.name}</td>
                                    <td>{translate(`manage_warehouse.category_management.${x.type}`)}</td>
                                    <td>{x.description}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <a className="text-green" onClick={() => handleShowDetailInfo(x)}><i className="material-icons">visibility</i></a>
                                        <a onClick={() => handleEdit(x)} href={`#${x._id}`} className="text-yellow" ><i className="material-icons">edit</i></a>
                                        <DeleteNotification
                                            content={translate('manage_warehouse.category_management.delete_info')}
                                            data={{
                                                id: x._id,
                                                info: x.code + " - " + x.name
                                            }}
                                            func={props.deleteCategory}
                                        />
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                {categories.isLoading ?
                    <div className="table-info-panel">{translate('confirm.loading')}</div> :
                    (typeof listPaginate === 'undefined' || listPaginate.length === 0) && <div className="table-info-panel">{translate('confirm.no_data')}</div>
                }
                <PaginateBar pageTotal={totalPages} currentPage={page} func={setPage} />
            </div>
        </div>
    );
}



function mapStateToProps(state) {
    const { categories, goods } = state;
    return { categories, goods };
}

const mapDispatchToProps = {
    getCategories: CategoryActions.getCategories,
    getCategoryToTree: CategoryActions.getCategoryToTree,
    getAllGoodsByCategory: GoodActions.getAllGoodsByCategory,
    deleteCategory: CategoryActions.deleteCategory
}
export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(CategoryManagementTable));