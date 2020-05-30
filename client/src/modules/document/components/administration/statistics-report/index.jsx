import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DocumentActions } from '../../../redux/actions';
import {
    BarChart, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid, Pie, PieChart, Cell
} from 'recharts';

class AdministrationStatisticsReport extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    componentDidMount(){
        this.props.getAllDocuments();
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    displayDocumentAnalys = (docList, categoryList) => {

        const data = categoryList.map( category =>{
            let docs = docList.filter(doc => doc.category !== undefined && doc.category.name === category.name).length;

            return {
                name: category.name,
                value: docs
            }
        });

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
        const RADIAN = Math.PI / 180;  
        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x  = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy  + radius * Math.sin(-midAngle * RADIAN);

            return (percent * 100).toFixed(0) > 0 ? (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
            ): null;
        };
        console.log("FDFSFSDFS", data)
        return (
            <div className="chart-display">
                {
                    docList.length > 0 ?
                    <PieChart width={1024} height={400}>
                        <Pie
                            data={data} 
                            cx="50%" 
                            cy="50%" 
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={120} 
                            fill="#8884d8"
                            >
                                {
                                data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                            }
                        </Pie><Tooltip/><Legend/>
                    </PieChart> : null
                }
            </div>
        );
    }

    displayViewDownloadBarChart = (docList, categoryList) => {
        const {translate} = this.props;
        const data = categoryList.map( category =>{
            let docs = docList.filter(doc => doc.category !== undefined && doc.category.name === category.name);
            let totalDownload = 0;
            let totalView = 0;
            for (let index = 0; index < docs.length; index++) {
                const element = docs[index];
                totalDownload = totalDownload + element.numberOfDownload;
                totalView = totalView + element.numberOfView;
            }
            return {
                name: category.name,
                [translate('document.views')]: totalView,
                [translate('document.downloads')]: totalDownload
            }
        });

        return (
            <div className="chart-display">
                <BarChart width={1024} height={400} data={data} margin={{ top: 50, right: 10, bottom: 10, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={translate('document.views')} fill="#2F8DCA" />
                    <Bar dataKey={translate('document.downloads')} fill="#01CD02" />
                </BarChart>
            </div>
        );
    }

    render() { 
        const {documents} = this.props;
        const categoryList = documents.administration.categories.list;
        const docList = documents.administration.data.list;
        
        return <React.Fragment>
                
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        { this.displayDocumentAnalys(docList, categoryList) }
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        { this.displayViewDownloadBarChart(docList, categoryList) }
                    </div>
                </div>
                
            </React.Fragment>;
        
    }
}
  
const mapStateToProps = state => state;

const mapDispatchToProps = {
    getAllDocuments: DocumentActions.getDocuments
}

export default connect( mapStateToProps, mapDispatchToProps )( withTranslate(AdministrationStatisticsReport) );