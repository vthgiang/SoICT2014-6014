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
        const { translate, link } = this.props;

        return ( 
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                    <React.Fragment>
                        <div className="row">
                            <SearchBar 
                                columns={[
                                    { title: translate('table.url'), value:'url' },
                                    { title: translate('table.description'), value:'description' },
                                ]}
                                option={this.state.option}
                                setOption={this.setOption}
                                search={this.searchWithOption}
                            />
                            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                                <CreateLinkForm/>
                            </div>
                        </div>
                        <table 
                            className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th>{ translate('manage_page.url') }</th>
                                    <th>{ translate('manage_page.description') }</th>
                                    <th>{ translate('manage_page.roles') }</th>
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
                                    link.listPaginate.length > 0 ? link.listPaginate.map( link => 
                                        <tr key={link._id}>
                                            <td>{ link.url }</td>
                                            <td>{ link.description }</td>
                                            <td>{
                                                link.roles.map((role, index, arr) => {
                                                    if(arr.length < 4){
                                                        return <span className="badge">{role.roleId.name}</span>
                                                    }else{
                                                        if(index < 3 ){
                                                            return <span className="badge">{role.roleId.name}</span>
                                                        }
                                                    }
                                                })
                                            }{
                                                link.roles.length >=4 &&
                                                
                                                <React.Fragment>
                                                    <a data-toggle="modal" href={`#link-roles-detail-${link._id}`} style={{fontSize: '24px'}} title="Xem chi tiết">...</a>
                                                    <div className="modal fade" id={`link-roles-detail-${link._id}`}>
                                                        <div className="modal-dialog">
                                                        <div className="modal-content" style={{borderRadius: '20px'}}>
                                                            <div className="modal-header">
                                                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                                                            <h5 className="modal-title">{translate('manage_page.roles')}<span className="text-purple"> {link.description} </span></h5>
                                                            </div>
                                                            <div className="modal-body">
                                                                <ul>
                                                                {
                                                                    link.roles.map(role => <li>{role.roleId.name}</li>)
                                                                }
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>  
                                                </React.Fragment>

                                                
                                            }
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <LinkInfoForm 
                                                    linkId={ link._id }
                                                    linkName={ link.url }
                                                    linkDescription={ link.description }
                                                    linkRoles={ link.roles.map(role => role.roleId._id) }
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
                                    ): <tr><td colSpan={4}>{translate('confirm.no_data')}</td></tr>
                                }
                            </tbody>
                        </table>
                        {/* PaginateBar */}
                        <PaginateBar pageTotal={link.totalPages} currentPage={link.page} func={this.setPage}/>
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
            
    handleResizeColumn = () => {
        window.$(function () {
            var pressed = false;
            var start = undefined;
            var startX, startWidth;

            window.$("table thead tr th:not(:last-child)").mousedown(function (e) {
                start = window.$(this);
                pressed = true;
                startX = e.pageX;
                startWidth = window.$(this).width();
                window.$(start).addClass("resizing");
            });

            window.$(document).mousemove(function (e) {
                if (pressed) {
                    window.$(start).width(startWidth + (e.pageX - startX));
                }
            });

            window.$(document).mouseup(function () {
                if (pressed) {
                    window.$(start).removeClass("resizing");
                    pressed = false;
                }
            });
        });
    }

    componentDidMount(){
        this.props.getLinks();
        this.props.getPaginate({page: this.state.page, limit: this.state.limit});
        let script = document.createElement('script');
        script.src = '/lib/main/js/defindMultiSelect.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        this.handleResizeColumn();
    }
}
 
const mapState = state => state;
const getState =  {
    getLinks: LinkActions.get,
    getPaginate: LinkActions.getPaginate,
    destroy: LinkActions.destroy
}
 
export default connect(mapState, getState) (withTranslate(ManageLink));