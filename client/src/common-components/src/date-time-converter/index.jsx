import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';

class DateTimeConverter extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    convertDateTime = (time, type) => {
        const {translate} = this.props;
        
        var data = new Date(time);
        var day = data.getDate();
        var month = data.getMonth()+1;
        var year = data.getFullYear();
        var hour = data.getHours();
        var minute = data.getMinutes();
        
        switch(type){
            case 1:
                var timeNow = new Date();
                var dayNow = timeNow.getDate();
                if(day === dayNow)
                    return `${translate('general.date_time.today')}, ${hour}:${minute}`
                else
                    return `${day}/${month}/${year}`

            case 2: 
                var dmy = `${translate('general.date_time.day')} ${day} ${translate('general.date_time.month')} ${month} ${translate('general.date_time.year')} ${year}`;
                var hm = `${hour} ${translate('general.date_time.hour')} ${minute} ${translate('general.date_time.minute')}`
                return `${hm}, ${dmy}`; 
            
            default:
                return `${hour}:${minute} ${day}/${month}/${year}`;
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