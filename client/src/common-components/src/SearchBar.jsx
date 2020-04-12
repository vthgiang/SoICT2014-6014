import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.opt = React.createRef();
        this.value = React.createRef();
        this.state = { }
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

    render() { 
        const { columns, translate, option, setOption, search } = this.props;
        
        return ( 
            <React.Fragment>
                <div className="qlcv">
                    <div className="form-inline">
                        <div className="form-group">
                            <label>{translate('form.property')}</label>
                            <select
                                className="form-control"
                                defaultValue={ option } 
                                ref={this.opt} 
                                onChange={() => setOption("option", this.opt.current.value)}
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
                            <input className="form-control" type="text" onKeyUp={this.handleEnterLimitSetting} placeholder={translate('searchByValue')} ref={this.value} onChange={() => setOption("value", { $regex: this.value.current.value, $options: 'i' })}/>
                            <button type="button" className="btn btn-success" onClick={search} title={translate('form.search')}>{translate('form.search')}</button>
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