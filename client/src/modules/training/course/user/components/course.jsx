import React from 'react';
import { TabListTrainingProgram, TabListUpcomingCourse, TabListAttendedCourse } from './combinedContent';
import { forceCheckOrVisible, LazyLoadComponent } from '../../../../../common-components';
const TrainingPlan = (props) => {

    /** Bắt sự kiện chuyển tab  */
    const handleNavTabs = (value) => {
        if (!value) {
            forceCheckOrVisible(true, false);
        }
        window.dispatchEvent(new Event('resize')); // Fix lỗi chart bị resize khi đổi tab
    }

    return (
        <div className="box">
            <div className="nav-tabs-custom">
                <ul className="nav nav-tabs">
                    <li className="active"><a href="#hr-training-plan-employee" data-toggle="tab" onClick={() => handleNavTabs(true)}>Danh sách chương trình đào tạo</a></li>
                    <li><a href="#list-upcoming-course" data-toggle="tab" onClick={() => handleNavTabs()}>Danh sách khóa học sắp mở</a></li>
                    <li><a href="#list-attended-course" data-toggle="tab" onClick={() => handleNavTabs()}>Danh sách khóa học đã tham gia</a></li>
                </ul>
            </div>
            <div className="tab-content ">
                {/* Tab chương trình đào tạo */}
                <div className="tab-pane active" id="hr-training-plan-employee">
                    <TabListTrainingProgram />
                </div>

                {/* Tab danh sách khóa học sắp mở */}
                <div className="tab-pane" id="list-upcoming-course">
                    <LazyLoadComponent>
                        <TabListUpcomingCourse />
                    </LazyLoadComponent>
                </div>

                {/* Tab danh sách khóa học đã tham gia */}
                <div className="tab-pane" id="list-attended-course">
                    <LazyLoadComponent>
                        <TabListAttendedCourse />
                    </LazyLoadComponent>
                </div>
            </div>
        </div>
    );
    
        
};

export default TrainingPlan