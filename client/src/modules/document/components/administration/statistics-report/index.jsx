import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DocumentActions } from '../../../redux/actions';

class AdministrationStatisticsReport extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        this.props.getAllDocuments();
    }

    render() { 
        const {documents} = this.props;
        const categoryList = documents.administration.categories.list;
        const docList = documents.administration.data.list;
        return ( 
            <React.Fragment>
                <div className="row text-center">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    {
                        docList.length > 0 && categoryList.length > 0 && 
                        categoryList.map((category, i)=>{
                            let docs = docList.filter(doc => doc.category !== undefined && doc.category.name === category.name);
                            let totalDownload = 0;
                            for (let index = 0; index < docs.length; index++) {
                                const element = docs[index];
                                totalDownload = totalDownload + element.numberOfDownload;
                            }
                            console.log("tổng số download: ", totalDownload)
                            return <div className="col-xs-6 col-sm-3 col-md-3 col-lg-2" key={i}>
                                <p style={{color: 'gray'}}>{category.name}</p>
                                <p style={{fontSize: '24px'}}><b>{docs.length}</b></p>
                                <p>{totalDownload}<i> tải xuống</i></p>
                            </div>
                        })
                    }
                    hhh
                    </div>
                </div>
            </React.Fragment>
         );
    }
}
  
const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(AdministrationStatisticsReport) );