import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { CompanyActions } from '../redux/actions';
import { PaginateBar, DataTableSetting, SearchBar } from '../../../../common-components';
import { SystemPageActions } from '../../system-page/redux/actions';
import { SystemPageServices } from '../../system-page/redux/services';

const CompanyManageApi = (props) => {
    const { translate, company } = props;
    const [companyPageApi, setCompanyPageApi] = useState([]);

    const [state, setState] = useState({
        limit: 5,
        page: 1,
        option: 'url',
        value: '',
        checkedAll: false,
        companyId: props.companyId,
        companyShortName: props.companyShortName,
        linkPaginate: props.company.item.links.listPaginate,
        linkPage: props.company.item.links.page,
        linkLimit: props.company.item.links.limit,
    })

    const { linkPaginate, checkedAll, companyShortName } = state;

    useEffect(() => {
        setState({
            ...state,
            checkedAll: false,
            companyId: props.companyId,
            companyShortName: props.companyShortName,
            linkPaginate: props.company.item.links.listPaginate,
            linkPage: props.company.item.links.page,
            linkLimit: props.company.item.links.limit,
        })
    }, [
        props.companyId,
        props.company.item.links.listPaginate,
        props.company.item.links.limit,
        props.company.item.links.page
    ])

    useEffect(() => {
        const getCompanyPageApis = async () => {
            const pageApiArr = [];

            try {
                for (let i = 0; i < linkPaginate.length; i++) {
                    const pageApis = await SystemPageServices.getSystemPageApis({
                        pageUrl: linkPaginate[i].url,
                    });

                    pageApiArr.push({
                        page: linkPaginate[i],
                        apis: pageApis.data.content.pageApis,
                    });
                }

                setCompanyPageApi(pageApiArr);
            } catch (error) {
                console.error(error);
            }
        }

        if (linkPaginate.length > 0) {
            getCompanyPageApis();
        }
    }, [linkPaginate]);

    const setOption = (title, option) => {
        setState({
            ...state,
            [title]: option
        });
    }

    const searchWithOption = () => {
        const { companyId } = state;
        const params = {
            company: companyId,
            portal: state.companyShortName,
            limit: state.limit,
            page: 1,
            key: state.option,
            value: state.value
        };

        props.getCompanyLinks(params);
    }

    const setPage = (page) => {
        setState({
            ...state,
            page
        });
        const { companyId } = state;
        const params = {
            company: companyId,
            portal: state.companyShortName,
            limit: state.limit,
            page: page,
            key: state.option,
            value: state.value
        };
        props.getCompanyLinks(params);
    }

    const setLimit = (number) => {
        setState({
            ...state,
            limit: number
        });
        const { companyId } = state;
        const params = {
            company: companyId,
            portal: state.companyShortName,
            limit: number,
            page: state.page,
            key: state.option,
            value: state.value
        };

        props.getCompanyLinks(params);

    }

    const checkAll = (e) => {
        let { linkPaginate } = state;
        let { checked } = e.target;
        const linkArr = linkPaginate.map(link => {
            return {
                ...link,
                deleteSoft: !checked
            }
        });
        setState({
            ...state,
            checkedAll: checked,
            linkPaginate: linkArr
        })
    }

    const handleCheckbox = (e) => {
        const { linkPaginate } = state;
        const { value, checked } = e.target;
        for (let i = 0; i < linkPaginate.length; i++) {
            if (value === linkPaginate[i]._id) {
                linkPaginate[i].deleteSoft = !checked;
                setState({
                    ...state,
                    linkPaginate
                })
                break;
            }
        }
    }

    const updateCompanyLinks = (portal) => {
        let { linkPaginate } = state;
        let data = linkPaginate.map(link => {
            return {
                _id: link._id,
                deleteSoft: link.deleteSoft
            }
        });

        props.updateCompanyLinks(data, { portal });
    }

    const renderApiTable = () => (
        <table className="table table-hover table-striped table-bordered" id="company-manage-link-table">
            <thead>
                <tr>
                    <th style={{ width: '32px' }} className="col-fixed">
                        <input type="checkbox" value="checkall" onChange={checkAll} checked={checkedAll} />
                    </th>
                    <th style={{ width: '32px' }} className="col-fixed"></th>
                    <th>Api</th>
                    <th>{translate('manage_api.description')}</th>
                </tr>
            </thead>

            <tbody>
                {companyPageApi.length > 0 ?
                    companyPageApi.map(pageApis =>
                        <>
                            <tr>
                                <td>
                                    <input
                                        type="checkbox"
                                        value={pageApis.page._id}
                                        onChange={handleCheckbox}
                                        checked={!pageApis.page.deleteSoft}
                                    />
                                </td>
                                <td
                                    colspan="3"
                                    style={{
                                        textAlign: 'left',
                                        fontWeight: '700'
                                    }}
                                >{pageApis.page.url}</td>
                            </tr>

                            {pageApis.apis.map((api, index) =>
                                <tr key={index}>
                                    {console.log(api)}
                                    <td></td>
                                    <td>
                                        <input
                                            type="checkbox"
                                        // value={link._id}
                                        // onChange={handleCheckbox}
                                        // checked={!link.deleteSoft}
                                        />
                                    </td>
                                    <td style={{
                                        textAlign: 'left'
                                    }}>{api}</td>
                                </tr>)}

                        </>
                    ) : (
                        company.item.links.isLoading ?
                            <tr><td colSpan='4'>{translate('confirm.loading')}</td></tr> :
                            <tr><td colSpan='4'>{translate('confirm.no_data')}</td></tr>
                    )
                }
            </tbody>
        </table>
    )

    return (
        <div style={{ padding: '10px 0px 10px 0px' }}>
            <a
                className="btn btn-primary pull-right"
                onClick={() => updateCompanyLinks(companyShortName)}
            >
                <i className="material-icons">save</i>
            </a>

            <SearchBar
                columns={[
                    { title: translate('manage_link.url'), value: 'url' },
                    { title: translate('manage_link.category'), value: 'category' },
                    { title: translate('manage_link.description'), value: 'description' }
                ]}
                option={state.option}
                setOption={setOption}
                search={searchWithOption}
            />

            <DataTableSetting
                tableId="company-manage-link-table"
                setLimit={setLimit}
            />

            {renderApiTable()}

            {/* Paginate Bar */}
            <PaginateBar pageTotal={company.item.links.totalPages} currentPage={company.item.links.page} func={setPage} />
        </div>
    );
}

const mapState = (state) => {
    const { systemPage, company, systemLinks } = state;
    return { systemPage, company, systemLinks };
}
const action = {
    getCompanyLinks: CompanyActions.getCompanyLinks,
    getSystemPageApis: SystemPageActions.getPageApis,
}

const connectedCompanyManageApi = connect(mapState, action)(withTranslate(CompanyManageApi))
export { connectedCompanyManageApi as CompanyManageApi }
