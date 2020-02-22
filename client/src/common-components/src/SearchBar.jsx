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

    render() { 
        const { columns, translate, option, setOption, search } = this.props;
        
        return ( 
            <React.Fragment>
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 item-container">
                    <select style={{
                        backgroundColor: "#ECF0F5",
                        border: '1px solid lightgray',
                        minWidth: '150px'
                    }} defaultValue={ option } ref={this.opt} onChange={() => setOption("option", this.opt.current.value)}>
                        {
                            columns !== undefined && columns.map( column => <option key={column.value} value={column.value}>{column.title}</option>)
                        }
                    </select>
                    <input className="form-control" type="text" placeholder={translate('searchByValue')} ref={this.value} onChange={() => setOption("value", { $regex: this.value.current.value, $options: 'i' })}/>
                    <button type="button" className="btn btn-success" onClick={search} title={translate('form.search')}>{translate('form.search')}</button>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const SearchBarExport = connect(mapState, null)(withTranslate(SearchBar));

export { SearchBarExport as SearchBar }