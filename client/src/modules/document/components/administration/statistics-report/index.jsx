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
        this.state = {
            pieWidth: 1024,
            pieHeight: 400,
            barWidth: 1024,
            barHeight: 400,
         }
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

    displayDocumentAnalys = (docList, categoryList, width, height) => {

        const data = categoryList.map( category =>{
            let docs = docList.filter(doc => doc.category !== undefined && doc.category.name === category.name).length;

            return {
                name: category.name,
                value: docs
            }
        });

        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000', '#FFCC00', '#00CC00', '#CC33FF', '#FF66FF', '#660066'];
        const RADIAN = Math.PI / 180;  
        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x  = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy  + radius * Math.sin(-midAngle * RADIAN);
            
            return percent*100 > 0 ? (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${percent*100}%`}
            </text>
            ): null;
        };
        
        return (
            <div className={this.state.pieWidth > 1024 ? "chart-display" : null}>
                {
                    docList.length > 0 ?
                    <PieChart width={width} height={height}>
                        <Pie
                            data={data} 
                            cx="50%" 
                            cy="50%" 
                            labelLine={false}
                            label={renderCustomizedLabel}
                            innerRadius={height <= width ? height/10 : width/10}
                            outerRadius={height <= width ? height/3 : width/3} 
                            fill="#8884d8"
                            dataKey="value"
                            >
                                {
                                data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index}/>)
                            }
                        </Pie><Tooltip/><Legend verticalAlign="bottom"/>
                    </PieChart> : null
                }
            </div>
        );
    }

    displayViewDownloadBarChart = (docList, categoryList, width, height) => {
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
            <div className={this.state.barWidth > 1024 ? "chart-display" : null}>
                <BarChart width={width} height={height} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="bottom"/>
                    <Bar dataKey={translate('document.views')} fill="#2F8DCA" />
                    <Bar dataKey={translate('document.downloads')} fill="#01CD02" />
                </BarChart>
            </div>
        );
    }

    changeBarWidth = (e) => {
        const {value} = e.target;
        this.setState({barWidth: parseInt(value)})
    }

    changeBarHeight = (e) => {
        const {value} = e.target;
        this.setState({barHeight: parseInt(value)})
    }

    changePieWidth = (e) => {
        const {value} = e.target;
        this.setState({pieWidth: parseInt(value)})
    }

    changePieHeight = (e) => {
        const {value} = e.target;
        this.setState({pieHeight: parseInt(value)})
    }

    render() { 
        const { documents, translate } = this.props;
        const categoryList = documents.administration.categories.list;
        const docList = documents.administration.data.list;
        
        return <React.Fragment>
                
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <b className="text-left" style={{fontSize: '20px'}}>{translate('document.statistical_document')}</b>
                        <div className="text-right">
                            <span style={{marginLeft: '34px', marginRight: '8px'}}>X <input type="number" min={100} onChange={this.changePieWidth} value={this.state.pieWidth}/></span>
                            <span>Y <input type="number" min={100} onChange={this.changePieHeight} value={this.state.pieHeight}/></span>
                        </div>
                        <div>
                            { this.displayDocumentAnalys(docList, categoryList, this.state.pieWidth, this.state.pieHeight) }
                        </div>
                    </div>
                    
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{marginTop: '50px', paddingTop: '10px'}}>
                        <b className="text-left" style={{fontSize: '20px'}}>{translate('document.statistical_view_down')}</b>
                        <div className="text-right">
                            <span style={{marginLeft: '34px', marginRight: '8px'}}>X <input type="number" min={100} onChange={this.changeBarWidth} value={this.state.barWidth}/></span>
                            <span>Y <input type="number" min={100} onChange={this.changeBarHeight} value={this.state.barHeight}/></span>
                        </div>
                        <div>
                            { this.displayViewDownloadBarChart(docList, categoryList, this.state.barWidth, this.state.barHeight) }
                        </div>
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