import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

import { ToolTip, SearchBar, DataTableSetting, PaginateBar } from '../../../../common-components';

class SystemManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { translate } = this.props;

        return (
            <div className="box" style={{ minHeight: '450px' }}>
                <div className="box-body">
                   
                </div>
            </div>
        );
    }

    setOption = (title, option) => {
        this.setState({
            [title]: option
        });
    }

    searchWithOption = () => {
        let {page, option, value, limit} = this.state;
        const params = {
            type: "active",
            limit,
            page,
            key: option,
            value
        };
        this.props.getLinks(params);
    }

    setPage = (page) => {
        this.setState({ page });
        let {limit, option, value} = this.state;
        const params = {
            type: "active",
            limit,
            page,
            key: option,
            value
        };
        this.props.getLinks(params);
    }

    setLimit = (number) => {
        this.setState({ limit: number });
        let {page, option, value} = this.state;
        const params = {
            type: "active",
            limit: number,
            page,
            key: option,
            value
        };
        this.props.getLinks(params);
    }

    componentDidMount() {
    }

    // Cac ham xu ly du lieu voi modal
    handleEdit = async (link) => {
        await this.setState(state => {
            return {
                ...state,
                currentRow: link
            }
        });

        window.$('#modal-edit-link').modal('show');
    }
}

function mapState(state) {
    return state;
}

const getState = {
}

export default connect(mapState, getState)(withTranslate(SystemManagement));