import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import moment from 'moment';

class DateTimeConverter extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    convertDateTime = (time, type) => {
        switch(type){
            case 1:
                return moment(time).fromNow(); // bao lâu tính đến thời điểm hiện tại

            case 2: 
                return moment(time).calendar(); // ngày, giờ phút
            
            default:
                return moment(time).format('LLLL'); // thứ ngày tháng năm giờ phút giấy
        }
    }


    render() { 
        const {dateTime, type=0} = this.props;

        return <span>{this.convertDateTime(dateTime, type)}</span>;
    }
}
 

const mapState = state => state;
const DateTimeConverterExport = connect(mapState, null)(withTranslate(DateTimeConverter));
export { DateTimeConverterExport as DateTimeConverter }