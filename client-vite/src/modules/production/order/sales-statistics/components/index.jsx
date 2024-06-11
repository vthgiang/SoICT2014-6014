import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { GoodActions } from '../redux/actions';
import { CategoryActions } from '../../../common-production/category-management/redux/actions';
import { StockActions } from '../../../warehouse/stock-management/redux/actions';
import { PaginateBar, TreeSelect, SelectMulti } from '../../../../../common-components';

function GoodManagement(props) {
    const [state, setState] = useState({
        currentRole: localStorage.getItem('currentRole'),
        page: 1,
        limit: 5,
        code: '',
        name: '',
        category: '',
        value: '',
        type: 'product',
        oldType: '',
        activeP: true,
        activeM: false,
        activeE: false,
        sourceType: ''
    });

    const dispatch = useDispatch();
    const goods = useSelector(state => state.goods);
    const categories = useSelector(state => state.categories);
    const stocks = useSelector(state => state.stocks);
    const { translate } = props;

    useEffect(() => {
        let { page, limit, type, currentRole } = state;
        dispatch(GoodActions.getGoodsByType());
        dispatch(GoodActions.getGoodsByType({ page, limit, type }));
        dispatch(CategoryActions.getCategoryToTree());
        dispatch(StockActions.getAllStocks({ managementLocation: currentRole }));
    }, []);

    useEffect(() => {
        if (state.oldType !== state.type) {
            dispatch(GoodActions.getGoodsByType({ page: state.page, limit: state.limit, type: state.type }));
            setState({
                ...state,
                oldType: state.type
            });
        }
    }, [state.type]);

    useEffect(() => {
        if (!state.type) {
            setType();
        }
    }, [state.type]);

    const setPage = (page) => {
        setState({
            ...state,
            page
        });
        const data = {
            limit: state.limit,
            page: page,
            key: state.option,
            value: state.value,
            type: state.type
        };
        dispatch(GoodActions.getGoodsByType(data));
    };

    const setLimit = (number) => {
        setState({
            ...state,
            limit: number
        });
        const data = {
            limit: number,
            page: state.page,
            key: state.option,
            value: state.value,
            type: state.type
        };
        dispatch(GoodActions.getGoodsByType(data));
    };

    const setOption = (title, option) => {
        setState({
            ...state,
            [title]: option
        });
    };

    const handleProduct = () => {
        let type = 'product';
        let page = 1;
        setState({
            ...state,
            page: page,
            type: type,
            category: ''
        });
    };

    const handleMaterial = () => {
        let type = 'material';
        let page = 1;
        setState({
            ...state,
            page: page,
            type: type,
            category: ''
        });
    };

    const handleEquipment = () => {
        let type = 'equipment';
        let page = 1;
        setState({
            ...state,
            page: page,
            type: type,
            category: ''
        });
    };

    const handleWaste = () => {
        let type = 'waste';
        let page = 1;
        setState({
            ...state,
            page: page,
            type: type,
            category: ''
        });
    };

    const handleCodeChange = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            code: value.trim()
        });
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setState({
            ...state,
            name: value.trim()
        });
    };

    const handleSourceChange = (e) => {
        setState({
            ...state,
            sourceType: e
        });
    };

    const handleCategoryChange = (value) => {
        if (value.length === 0) {
            value = null;
        }

        setState({
            ...state,
            category: value
        });
    };

    const handleSubmitSearch = () => {
        const data = {
            limit: state.limit,
            page: state.page,
            type: state.type,
            code: state.code,
            name: state.name,
            category: state.category,
            sourceType: state.sourceType
        };
        dispatch(GoodActions.getGoodsByType(data));
    };

    const handleEdit = (goods) => {
        setState({
            ...state,
            currentRow: goods
        });
        window.$('#modal-edit-good').modal('show');
    };

    const handleShowDetailInfo = (good) => {
        let id = good._id;
        dispatch(GoodActions.getGoodDetail(id));
        setState({
            ...state,
            currentRow: good
        });

        window.$('#modal-detail-good').modal('show');
    };

    const getAllCategory = () => {
        let categoryArr = [];
        if (categories.categoryToTree && categories.categoryToTree.list.length > 0) {
            categories.categoryToTree.list.map((item) => {
                categoryArr.push({
                    _id: item._id,
                    id: item._id,
                    state: { open: true },
                    name: item.name,
                    parent: item.parent ? item.parent.toString() : null
                });
            });
        }
        return categoryArr;
    };

    const checkManagementGood = (value) => {
        const { currentRole } = state;
        const { listStocks } = stocks;
        let arrayType = [];
        if (listStocks && listStocks.length > 0) {
            for (let i = 0; i < listStocks.length; i++) {
                if (listStocks[i].managementLocation.length > 0) {
                    for (let j = 0; j < listStocks[i].managementLocation.length > 0; j++) {
                        if (listStocks[i].managementLocation[j].role._id === currentRole) {
                            arrayType = arrayType.concat(listStocks[i].managementLocation[j].managementGood);
                        }
                    }
                }
            }
        }

        if (arrayType.includes(value)) {
            return true;
        }

        return false;
    };

    const setType = () => {
        if (checkManagementGood('product') || checkManagementGood('waste')) {
            setState({
                ...state,
                type: 'product',
                activeP: true
            });
        } else if (checkManagementGood('material')) {
            setState({
                ...state,
                type: 'material',
                activeM: true
            });
        } else if (checkManagementGood('equipment')) {
            setState({
                ...state,
                type: 'equipment',
                activeE: true
            });
        } else if (checkManagementGood('waste')) {
            setState({
                ...state,
                type: 'waste',
                activeW: true
            });
        }
    };

    const { type, category } = state;
    const { listPaginate, totalPages, page } = goods;
    const dataCategory = getAllCategory();
    let categorySearch = category ? category : [];

    return (
        <div className='nav-tabs-custom'>
            <ul className='nav nav-tabs'>
                {(checkManagementGood('product') || checkManagementGood('waste')) && (
                    <li className={`${state.activeP ? 'active' : ''}`}>
                        <a href='#good-products' data-toggle='tab' onClick={() => handleProduct()}>
                            {translate('manage_warehouse.good_management.product')}
                        </a>
                    </li>
                )}
                {checkManagementGood('material') && (
                    <li className={`${state.activeM ? 'active' : ''}`}>
                        <a href='#good-materials' data-toggle='tab' onClick={handleMaterial}>
                            {translate('manage_warehouse.good_management.material')}
                        </a>
                    </li>
                )}
                {checkManagementGood('equipment') && (
                    <li className={`${state.activeE ? 'active' : ''}`}>
                        <a href='#good-equipments' data-toggle='tab' onClick={() => handleEquipment()}>
                            {translate('manage_warehouse.good_management.equipment')}
                        </a>
                    </li>
                )}
                {checkManagementGood('waste') && (
                    <li className={`${state.activeW ? 'active' : ''}`}>
                        <a href='#good-wastes' data-toggle='tab' onClick={() => handleWaste()}>
                            {translate('manage_warehouse.good_management.waste')}
                        </a>
                    </li>
                )}
            </ul>
            <div className='box-body qlcv'>
                <div className='form-inline'>
                    <div className='form-group'>
                        <label className='form-control-static'>{translate('manage_warehouse.good_management.code')}</label>
                        <input
                            type='text'
                            className='form-control'
                            name='code'
                            onChange={handleCodeChange}
                            placeholder={translate('manage_warehouse.good_management.code')}
                            autoComplete='off'
                        />
                    </div>
                    <div className='form-group'>
                        <label className='form-control-static'>{translate('manage_warehouse.good_management.name')}</label>
                        <input
                            type='text'
                            className='form-control'
                            name='name'
                            onChange={handleNameChange}
                            placeholder={translate('manage_warehouse.good_management.name')}
                            autoComplete='off'
                        />
                    </div>
                </div>
                <div className='form-inline'>
                    <div className='form-group'>
                        <label className='form-control-static'>{translate('manage_warehouse.good_management.category')}</label>
                        <TreeSelect data={dataCategory} value={categorySearch} handleChange={handleCategoryChange} mode='hierarchical' />
                    </div>
                    {type === 'product' && (
                        <div className='form-group'>
                            <label className='form-control-static'>{translate('manage_warehouse.good_management.choose_source')}</label>
                            <SelectMulti
                                id={`select-multi-partner-source-type`}
                                multiple='multiple'
                                options={{ nonSelectedText: 'Chọn nguồn hàng hóa', allSelectedText: 'Chọn tất cả' }}
                                className='form-control select2'
                                style={{ width: '100%' }}
                                items={[
                                    {
                                        value: '1',
                                        text: translate('manage_warehouse.good_management.selfProduced')
                                    },
                                    {
                                        value: '2',
                                        text: translate('manage_warehouse.good_management.importedFromSuppliers')
                                    }
                                ]}
                                onChange={handleSourceChange}
                            />
                        </div>
                    )}
                    <div className='form-group'>
                        <button
                            type='button'
                            className='btn btn-success'
                            title={translate('manage_warehouse.good_management.search')}
                            onClick={handleSubmitSearch}
                        >
                            {translate('manage_warehouse.good_management.search')}
                        </button>
                    </div>
                </div>

                <table id={`good-table-${type}`} className='table table-striped table-bordered table-hover' style={{ marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '5%' }}>{translate('manage_warehouse.good_management.index')}</th>
                            <th>{translate('manage_warehouse.good_management.code')}</th>
                            <th>{translate('manage_warehouse.good_management.name')}</th>
                            <th>{translate('manage_warehouse.good_management.category')}</th>
                            <th>{translate('manage_warehouse.good_management.unit')}</th>
                            {type === 'product' && <th>{translate('manage_warehouse.good_management.materials')}</th>}
                            <th>{translate('manage_warehouse.good_management.good_source')}</th>
                            <th>{translate('manage_warehouse.good_management.description')}</th>
                            <th>Tổng số đơn hàng</th>
                            <th>Lượng hàng tồn kho</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listPaginate && listPaginate.length !== 0 &&
                            listPaginate.map((x, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{x.code}</td>
                                    <td>{x.name}</td>
                                    <td>
                                        {x.category && categories.categoryToTree && categories.categoryToTree.list.filter((item) => item._id === x.category).pop()
                                            ? categories.categoryToTree.list.filter((item) => item._id === x.category).pop().name
                                            : 'category is deleted'}
                                    </td>
                                    <td>{x.baseUnit}</td>
                                    {type === 'product' && (
                                        <td>
                                            {x.materials.length > 0 &&
                                                x.materials.map((y, i) => (x.materials.length === i + 1 ? y.good.name : `${y.good.name}, `))}
                                        </td>
                                    )}
                                    <td>
                                        {x.sourceType === '1'
                                            ? translate('manage_warehouse.good_management.selfProduced')
                                            : translate('manage_warehouse.good_management.importedFromSuppliers')}
                                    </td>
                                    <td>{x.description}</td>
                                    <td>{Math.floor(Math.random() * 500) + 50}</td> {/* Giả sử số đơn hàng ngẫu nhiên từ 50 đến 550 */}
                                    <td>{x.stocks}</td> {/* Giả sử số lượng tồn kho ngẫu nhiên từ 20 đến 220 */}
                                </tr>
                            ))}
                    </tbody>
                </table>

                {goods.isLoading ? (
                    <div className='table-info-panel'>{translate('confirm.loading')}</div>
                ) : (
                    (!listPaginate || listPaginate.length === 0) && (
                        <div className='table-info-panel'>{translate('confirm.no_data')}</div>
                    )
                )}
                <PaginateBar pageTotal={totalPages} currentPage={page} func={setPage} />
            </div>
        </div>
    );
}

export default withTranslate(GoodManagement);
