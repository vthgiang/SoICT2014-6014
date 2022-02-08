import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { DatePicker, SelectBox } from '../../../../../common-components';

function KeyPeopleRequire(props) {
    const [state, setState] = useState({
        keyPersonnelRequires: []
    });

    const [list, setList] = useState([{
        careerPosition: '',
        majors: [],
        count: 0,
        numberYearsOfExperience: 0,
        experienceWorkInCarreer: 0,
        numblePackageWorkInCarreer: 0,
        certificateRequirements: {
            certificates: [],
            count: 0,
            certificatesEndDate: ''
        }
    }])
    
    const { translate, listMajor, listCareer, listCertificate } = props;
    const { id,  biddingPackage, keyPersonnelRequires } = state;

    // console.log("keyPersonnelRequires", keyPersonnelRequires)
        
    useEffect(() => {
        setState(state => {
                return {
                    ...state,
                    keyPersonnelRequires: list
                }
        })

        console.log("list", list)
        console.log("state", state)
    }, [list])

    useEffect(() => {
        
        if (props.biddingPackage) {
            setState(state => {
                return {
                    ...state,
                    id: props.id,
                    keyPersonnelRequires: props.biddingPackage ? props.biddingPackage.keyPersonnelRequires : []
                }
            })

            setList(props.biddingPackage ? props.biddingPackage.keyPersonnelRequires : [])
        }
    }, [props.id, props.biddingPackage])


    /** Function lưu các trường thông tin vào state */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(state => {
            return {
                ...state,
                [name]: value,
            }
        })
        props.handleChange(name, value);
    }

    /**
     * Function format dữ liệu Date thành string
     * @param {*} date : Ngày muốn format
     * @param {*} monthYear : true trả về tháng năm, false trả về ngày tháng năm
     */
    const formatDate = (date, monthYear = false) => {
        if (date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            if (monthYear === true) {
                return [month, year].join('-');
            } else return [day, month, year].join('-');
        } else {
            return date;
        }
    }

    /** Function bắt sự kiện thay đổi vị trí công việc */
    const handleCareer = (e, listIndex) => {
        let { value } = e.target;
        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    careerPosition: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPersonnelRequires", newList);
    }

    /** Function bắt sự kiện thay đổi vị trí công việc */
    const handleCount = (e, listIndex) => {
        let { value } = e.target;
        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    count: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPersonnelRequires", newList);
    }

    /** Function bắt sự kiện thay đổi vị trí công việc */
    const handleYearOfExperiment = (e, listIndex) => {
        let { value } = e.target;
        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    numberYearsOfExperience: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPersonnelRequires", newList);
    }
    
    /** Function bắt sự kiện thay đổi vị trí công việc */
    const handleExperimentWorkInCareer = (e, listIndex) => {
        let { value } = e.target;
        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    experienceWorkInCarreer: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPersonnelRequires", newList);
    }

    /** Function bắt sự kiện thay đổi vị trí công việc */
    const handleNumberBiddingPackageInCareer = (e, listIndex) => {
        let { value } = e.target;
        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    numblePackageWorkInCarreer: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPersonnelRequires", newList);
    }

    /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
    const handleMajor = (value, listIndex) => {

        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    majors: value
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPersonnelRequires", newList);
    }

    /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
    const handleCertificates = (value, listIndex) => {

        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    certificateRequirements: {
                        ...item.certificateRequirements,
                        certificates: value
                    }
                }
            }
            return item;
        })
        setList(newList);
    }

    /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
    const handleCertificateCount = (e, listIndex) => {
        let { value } = e.target;

        let newList = list.map((item, index) => {
            if (index === listIndex) {
                return {
                    ...item,
                    certificateRequirements: {
                        ...item.certificateRequirements,
                        count: value
                    }
                }
            }
            return item;
        })
        setList(newList);
        props.handleChange("keyPersonnelRequires", newList);
    }

    /** Function bắt sự kiện thay đổi điện thoại đi động 1 */
    const handleCertificateEndDate = (value, listIndex) => {
        if (value) {
            let partValue = value.split('-');
            let endDate = [partValue[2], partValue[1], partValue[0]].join('-');

            let newList = list.map((item, index) => {
                if (index === listIndex) {
                    return {
                        ...item,
                        certificateRequirements: {
                            ...item.certificateRequirements,
                            certificatesEndDate: endDate
                        }
                    }
                }
                return item;
            })

            setList(newList);
            props.handleChange("keyPersonnelRequires", newList);
        }
    }

    return (
        <div id={id} className="tab-pane">
            {
                list?.map((item, listIndex) => {
                    return (
                        <div key={listIndex} className="box-body" style={{ border: '1px solid #ccc', marginBottom: '10px' }}>
                            <div className="row" style={{ marginTop: '15px' }}>
                                <div className="form-group col-md-6">
                                    <label >Vị trí công việc</label>
                                    <select key={`careerPosition${id}-${listIndex}`} name={`career-${listIndex}`} style={{ border: '1px solid #aaa', borderRadius: "4px" }} className="form-control select2" value={item?.careerPosition} onChange={value => handleCareer(value, listIndex)}>
                                        <option key={`id-${listIndex}`} value="0">Chọn vị trí công việc</option>
                                        {
                                            listCareer?.map(x => {
                                                return (<option key={x._id} value={x._id}>{x.name}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label >Số lượng</label>
                                    <input type="number" className="form-control" name={`count-${listIndex}`} onChange={(value) => handleCount(value, listIndex)} value={item.count} placeholder="Số lượng nhân viên" autoComplete="off" />
                                </div>
                            </div>

                            <div className="row" style={{ marginTop: '15px' }}>
                                <div className="form-group col-md-6">
                                    <label >Chuyên ngành</label>
                                    <SelectBox
                                        id={`major-${id}-${listIndex}`}
                                        className="form-control select2"
                                        style={{ width: "100%" }}
                                        items={listMajor?.map(x => {
                                            return { text: x.name, value: x._id }
                                        })}
                                        options={{ placeholder: "Chọn chuyên ngành" }}
                                        onChange={(value) => handleMajor(value, listIndex)}
                                        value={item?.majors}
                                        multiple={true}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label >Năm kinh nghiệm</label>
                                    <input type="number" className="form-control" step={0.5} name={`year-experiment-${listIndex}`} onChange={(value) => handleYearOfExperiment(value, listIndex)} value={item.numberYearsOfExperience} placeholder="Số năm kinh nghiệm" autoComplete="off" />
                                </div>
                            </div>

                            <div className="row" style={{ marginTop: '15px' }}>
                                <div className="form-group col-md-6">
                                    <label >Thời gian làm việc ở vị trí tương đương (Tháng)</label>
                                    <input type="number" className="form-control" name={`experiment-time-${listIndex}`} onChange={(value) => handleExperimentWorkInCareer(value, listIndex)} value={item.experienceWorkInCarreer} placeholder="Thời gian làm việc ở vị trí tương đương" autoComplete="off" />
                                </div>
                                <div className="form-group col-md-6">
                                    <label >Số dự án ở vị trí tương đương</label>
                                    <input type="number" className="form-control" name={`numble-package-${listIndex}`} onChange={(value) => handleNumberBiddingPackageInCareer(value, listIndex)} value={item.numblePackageWorkInCarreer} placeholder="Số dự án ở vị trí tương đương" autoComplete="off" />
                                </div>
                            </div>

                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">
                                    <h4 className="box-title">Yêu cầu chứng chỉ- bằng cấp</h4>
                                </legend>
                                
                                <div className="row">
                                    <div className="form-group col-md-12">
                                        <label >Danh sách chứng chỉ</label>
                                        <SelectBox
                                            id={`certificate-${id}-${listIndex}`}
                                            className="form-control select2"
                                            style={{ width: "100%" }}
                                            items={listCertificate?.map(x => {
                                                return { text: x.name, value: x._id }
                                            })}
                                            options={{ placeholder: "Chọn chứng chỉ" }}
                                            onChange={(value) => handleCertificates(value, listIndex)}
                                            value={item.certificateRequirements.certificates}
                                            multiple={true}
                                        />
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label>Số chứng chỉ tối thiểu</label>
                                        <input type="number" className="form-control" name={`count-certificate-${listIndex}`} onChange={(value) => handleCertificateCount(value, listIndex)} value={item.certificateRequirements.count} placeholder={translate('human_resource.profile.address')} autoComplete="off" />
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label>Hiệu lực</label>

                                        <DatePicker
                                            id={`certificatesEndDate-${id}-${listIndex}`}
                                            value={formatDate(item.certificateRequirements.certificatesEndDate ? item.certificateRequirements.certificatesEndDate : '')}
                                            onChange={(value) => handleCertificateEndDate(value, listIndex)}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    )
                })
            }
            
            <button onClick={() => {
                const newList = [...list, {
                    careerPosition: '',
                    majors: [],
                    count: 0,
                    numberYearsOfExperience: 0,
                    experienceWorkInCarreer: 0,
                    numblePackageWorkInCarreer: 0,
                    certificateRequirements: {
                        certificates: [],
                        count: 0,
                        certificatesEndDate: null,
                    }
                }]
                setList(newList)
            }}>Thêm</button>
        </div >
    );
};

const  mapState = state => state;

const keyPeopleRequire = connect(mapState, null)(withTranslate(KeyPeopleRequire));
export { keyPeopleRequire as KeyPeopleRequire };