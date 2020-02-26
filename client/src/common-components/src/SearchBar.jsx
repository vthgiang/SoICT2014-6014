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
                {/* <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 item-container">
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
                </div> */}
                <div className="col-md-3">
                    <div className="form-group col-md-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <label style={{ paddingTop: 5 }}>{translate('form.property')}</label>
                    </div>
                    <div className="form-group col-md-8" style={{ paddingLeft: 0, paddingRight: 0 }}>
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
                <div className="col-md-3">
                    <div className="form-group col-md-12" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <input className="form-control" type="text" placeholder={translate('searchByValue')} ref={this.value} onChange={() => setOption("value", { $regex: this.value.current.value, $options: 'i' })}/>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <button type="button" className="btn btn-success" onClick={search} title={translate('form.search')}>{translate('form.search')}</button>
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapState = state => state;
const SearchBarExport = connect(mapState, null)(withTranslate(SearchBar));

export { SearchBarExport as SearchBar }