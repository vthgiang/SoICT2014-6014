import React, { Component } from 'react';
import { TabDiscipline } from './TabDiscipline';
import { TabPraise } from './TabPraise';
class Discipline extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="row">
                    {/* left column */}
                    <div className="col-sm-12">
                        <div className="nav-tabs-custom">
                            <ul className="nav nav-tabs">
                                <li className="active"><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Danh sách nhân viên được khen thưởng" data-toggle="tab" href="#khenthuong">Danh sách khen thưởng</a></li>
                                <li><a style={{ paddingLeft: 5, paddingRight: 8 }} title="Danh sách nhân viên bị kỷ luật" data-toggle="tab" href="#kyluat">Danh sách kỷ luật</a></li>
                            </ul>
                            <div className="tab-content">
                                <TabPraise />
                                <TabDiscipline />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    };
}
export { Discipline };