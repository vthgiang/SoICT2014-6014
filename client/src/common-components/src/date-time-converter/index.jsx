import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

class DateTimeConverter extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    convertDateTime = (time) => {
        var dateNow = new Date();
        var date = new Date(time);
        var diff = (dateNow - date)/3600000; // đơn vị là giờ
        if(diff < 24) // cách biệt không quá 24 giờ
            return moment(time).fromNow();
        else    
            return moment(time).format('LLLL');
    }


    render() { 
        const {dateTime} = this.props;

        return <span>{this.convertDateTime(dateTime)}</span>;
    }
}
 

const mapState = state => state;
const DateTimeConverterExport = connect(mapState, null)(withTranslate(DateTimeConverter));
export { DateTimeConverterExport as DateTimeConverter }