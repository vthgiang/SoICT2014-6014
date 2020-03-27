import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { LinkActions } from '../redux/actions';
import { DeleteNotification } from '../../../../common-components';
import LinkInfoForm from './LinkInfoForm';
import CreateLinkForm from './CreateLinkForm';
import { SearchBar } from '../../../../common-components';
import { ActionColumn } from '../../../../common-components';
import { PaginateBar } from '../../../../common-components';

class ManageLink extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            limit: 5,
            page: 1,
            option: 'url', //mặc định tìm kiếm theo tên
            value: null,
            url: null,
            description: null,
            role: null
        }
        this.inputChange = this.inputChange.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setOption = this.setOption.bind(this);
        this.searchWithOption = this.searchWithOption.bind(this);
        this.setLimit = this.setLimit.bind(this);
    }

    render() { 
        const { translate, linksDefault } = this.props;

        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <React.Fragment>
                        <CreateLinkForm/>
                        <SearchBar 
                            columns={[
                                { title: translate('table.url'), value:'url' },
                                { title: translate('table.description'), value:'description' },
                            ]}
                            option={this.state.option}
                            setOption={this.setOption}
                            search={this.searchWithOption}
                        />
                        
                        <table className="table table-hover table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>{ translate('manage_page.url') }</th>
                                    <th>{ translate('manage_page.description') }</th>
                                    <th style={{width: "120px"}}>
                                        <ActionColumn 
                                            columnName={translate('table.action')} 
                                            hideColumn={false}
                                            setLimit={this.setLimit}
                                        /> 
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    linksDefault.list.length > 0 ? linksDefault.list.map( link => 
                                        <tr key={link._id}>
                                            <td>{ link.url }</td>
                                            <td>{ link.description }</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <LinkInfoForm 
                                                    linkId={ link._id }
                                                    linkName={ link.url }
                                                    linkDescription={ link.description }
                                                />
                                                <DeleteNotification 
                                                    content={{
                                                        title: translate('manage_page.delete'),
                                                        btnNo: translate('confirm.no'),
                                                        btnYes: translate('confirm.yes'),
                                                    }}
                                                    data={{
                                                        id: link._id,
                                                        info: link.url+"<br/>"+link.description
                                                    }}
                                                    func={this.props.destroy}
                                                />
                                            </td>
                                        </tr> 
                                    ): <tr><td colSpan={3}>{translate('confirm.no_data')}</td></tr>
                                }
                            </tbody>
                        </table>
                        {/* PaginateBar */}
                        <PaginateBar pageTotal={linksDefault.totalPages} currentPage={linksDefault.page} func={this.setPage}/>
                    </React.Fragment>
                </div>
            </div>
        );

    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = async() => {
        const data = {
            limit: this.state.limit,
            page: 1
        };
        data[this.state.option] = this.state.value;
        await this.props.getPaginate(data);
    }

    setPage = (pageNumber) => {
        this.setState({ page: pageNumber });
        const data = { limit: this.state.limit, page: pageNumber };
        if(this.state.value !== null){
            data[this.state.option] = this.state.value;
        }
        this.props.getPaginate(data);
    }
    
    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }
    
    setLimit = (number) => {
        this.setState({ limit: number });
        const data = { limit: number, page: this.state.page };
        if(this.state.value !== null){
            data[this.state.option] = this.state.value;
        }
        this.props.getPaginate(data);
    }
     
    componentDidMount(){
        this.props.getLinks();
        // this.props.getPaginate({page: this.state.page, limit: this.state.limit});
    }
}
 
const mapState = state => state;
const getState =  {
    getLinks: LinkActions.get,
    getPaginate: LinkActions.getPaginate,
    destroy: LinkActions.destroy
}
 
export default connect(mapState, getState) (withTranslate(ManageLink));