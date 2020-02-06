import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.opt = React.createRef();
        this.value = React.createRef();
        this.state = {
            limit: 5,
            page: 1
        }
    }

    search = async (e) =>{
        e.preventDefault();
        const { func } = this.props;
        if(this.opt.current !== null){
            var value = this.opt.current.value;
            await this.setState({
                [value]: this.value.current.value
            });
            var data = this.state;
            console.log("data: ", data);
            await func(data);
        }
    }

    render() { 
        const { columns, translate } = this.props;

        return ( 
            <React.Fragment>
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 item-container">
                    <select style={{
                        backgroundColor: "#ECF0F5",
                        border: '1px solid lightgray'
                    }} defaultValue={ columns[0].value } ref={this.opt}>
                        {
                            columns !== undefined && columns.map( column => <option key={column.value} value={column.value}>{column.title}</option>)
                        }
                    </select>
                    <input className="form-control" type="text" placeholder={translate('searchByValue')} ref={this.value}/>
                    <button type="button" className="btn btn-success" onClick={this.search}>{translate('search')}</button>
                </div>
            </React.Fragment>
         );
    }
}
 
const mapStateToProps = state => state;

export default connect( mapStateToProps, null )( withTranslate(SearchBar) );