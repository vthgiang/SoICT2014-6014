import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import './paginateBar.css';

class PaginateBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1
        }
        this.inputChange = this.inputChange.bind(this);
        this.setPaginate = this.setPaginate.bind(this);
    }

    inputChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value
        });
    }

    setPaginate = async () => {
        await window.$(`#search-page`).collapse("hide");
        await this.props.func(this.state.page);
    }

    handleEnterSetting = (event) => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            this.setPaginate();
        }
    }

    render() {
        const { pageTotal, currentPage, translate, func } = this.props;
        var items = [];

        if (typeof pageTotal !== "undefined" && pageTotal > 5) {
            if (currentPage <= 3) {
                for (let i = 0; i < currentPage + 1; i++) {
                    items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => func(i + 1)}>{i + 1}</a></li>);
                }
                items.push(<li className="disable" key={pageTotal + 1}><a href="#search-page" data-toggle="collapse">...</a></li>);
                items.push(<li key={pageTotal} className={currentPage === pageTotal ? "active" : ""}><a href="#abc" onClick={() => func(pageTotal)}>{pageTotal}</a></li>);
            } else if (currentPage >= pageTotal - 2) {
                items.push(<li key={1} className={currentPage === 1 ? "active" : ""}><a href="#abc" onClick={() => func(1)}>1</a></li>);
                items.push(<li className="disable" key={0}><a href="#search-page" data-toggle="collapse">...</a></li>);
                for (let i = pageTotal - 3; i < pageTotal; i++) {
                    items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => func(i + 1)}>{i + 1}</a></li>);
                }
            } else {
                items.push(<li key={1} className={currentPage === 1 ? "active" : ""}><a href="#abc" onClick={() => func(1)}>1</a></li>);
                items.push(<li className="disable" key={0}><a href="#search-page" data-toggle="collapse">...</a></li>);
                for (let i = currentPage - 2; i < currentPage + 1; i++) {
                    items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => func(i + 1)}>{i + 1}</a></li>);
                }
                items.push(<li className="disable" key={pageTotal + 1}><a href="#search-page" data-toggle="collapse">...</a></li>);
                items.push(<li key={pageTotal} className={currentPage === pageTotal ? "active" : ""}><a href="#abc" onClick={() => func(pageTotal)}>{pageTotal}</a></li>);
            }
        } else if (typeof pageTotal !== "undefined" && pageTotal > 1) {
            for (let i = 0; i < pageTotal; i++) {
                items.push(<li key={i + 1} className={currentPage === i + 1 ? "active" : ""}><a href="#abc" onClick={() => func(i + 1)}>{i + 1}</a></li>);
            }
        }

        return (
            <React.Fragment>
                {
                    pageTotal !== 0 &&
                    <div className="pull-right">
                        <ul className="pagination" style={{ marginTop: '20px' }}>
                            {currentPage !== 1 && <li><a href="#abc" onClick={() => func(currentPage - 1)}>{"<"}</a></li>}
                            {items}
                            {currentPage !== pageTotal && <li><a href="#abc" onClick={() => func(currentPage + 1)}>{">"}</a></li>}
                        </ul>
                        <div id="search-page" className="form-group collapse">
                            <input className="form-control" type="number" min="1" max={pageTotal} name='page' onChange={this.inputChange} onKeyUp={this.handleEnterSetting}/>
                            <button
                                type="button"
                                className="pull-right btn btn-success"
                                onClick={this.setPaginate}
                            >{translate('form.search')}</button>
                        </div>
                    </div>
                }
            </React.Fragment>
        );
    }
}

const mapState = state => state;
const PaginateBarExport = connect(mapState, null)(withTranslate(PaginateBar));

export { PaginateBarExport as PaginateBar }