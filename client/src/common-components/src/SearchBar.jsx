import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: '',
            value: ''
        }
    }

    handleEnterLimitSetting = (event) => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            this.props.search();
        }
    }

    handleChangeOption = async (e) => {
        const {value} = e.target;
        await this.setState(state => {
            return {
                ...state,
                option: value
            }
        })
        await this.props.setOption("option", this.state.option);
    }

    handleChangeInput = async(e) => {
        const {value} = e.target;
        await this.setState(state => {
            return {
                ...state,
                value: { $regex: value, $options: 'i' }
            }
        })
        await this.props.setOption("value", this.state.value); //set giá trị của nội dung muốn tìm kiếm
    }

    search = () => {
        this.props.search();
    } 

    render() { 
        const { columns, translate, option } = this.props;
        
        console.log("SEARCH: ", this.state);
        return ( 
            <React.Fragment>
                <div className="qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('form.property')}</label>
                            <select
                                className="form-control"
                                value={ option } 
                                onChange={this.handleChangeOption}
                            >
                            {
                                columns !== undefined && columns.map( column => <option key={column.value} value={column.value}>{column.title}</option>)
                            }
                            </select>
                        </div>
                    </div>
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('form.value')}</label>
                            <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} placeholder={translate('searchByValue')} onChange={this.handleChangeInput}/>
                            <button type="button" className="btn btn-success" onClick={this.search} title={translate('form.search')}>{translate('form.search')}</button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const SearchBarExport = connect(mapState, null)(withTranslate(SearchBar));

export { SearchBarExport as SearchBar }