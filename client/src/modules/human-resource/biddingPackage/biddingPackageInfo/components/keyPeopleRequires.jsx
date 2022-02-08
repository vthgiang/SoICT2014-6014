import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { SelectBox } from '../../../../../common-components';

function KeyPeopleRequireTab(props) {
    const [state, setState] = useState({

    })

    useEffect(() => {
        setState(state => {
            return {
                ...state,
                id: props.id,
                keyPersonnelRequires: props.biddingPackage.keyPersonnelRequires,
            }
        })
    }, [props.id])

    const { translate, listMajor, listCareer, listCertificate } = props;

    const { id, biddingPackage, keyPersonnelRequires } = state;

    return (
        <div id={id} className="tab-pane">
            {
                keyPersonnelRequires?.map((item, listIndex) => {
                    // let certificate = item?.
                    console.log("object, item", item);
                    return (
                        <div className="box-body" style={{ border: '1px solid #ccc', marginBottom: '10px' }}>
                            <div className="row" style={{ marginTop: '15px' }}>
                                <div className="form-group col-md-6">
                                    <strong>Vị trí công việc&emsp; </strong>
                                    {listCareer.filter(x => x._id == item.careerPosition).map(y => y.name)}
                                </div>
                                <div className="form-group col-md-6">
                                    <strong>Số lượng&emsp; </strong>
                                    {listMajor.filter(x => x._id == item.majors).map(y => y.name)}
                                </div>
                            </div>

                            <div className="row" style={{ marginTop: '15px' }}>
                                <div className="form-group col-md-6">
                                    <strong>Chuyên ngành&emsp; </strong>
                                    {listMajor.filter(x => x._id == item.majors).map(y => y.name)}
                                </div>
                                <div className="form-group col-md-6">
                                    <strong>Trình độ chuyên môn&emsp; </strong>
                                    {listCareer.filter(x => x._id == item.careerPosition).map(y => y.name)}
                                </div>
                            </div>

                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">
                                    <h4 className="box-title">Yêu cầu chứng chỉ- bằng cấp</h4>
                                </legend>
                                
                                <div className="row">
                                    <div className="form-group col-md-12">
                                        <label >Danh sách chứng chỉ - bằng cấp</label>
                                        <SelectBox
                                            id={`certificate-${id}-${listIndex}`}
                                            lassName="form-control select2"
                                            style={{ width: "100%" }}
                                            items={listCertificate?.map(x => {
                                                return { text: x.name, value: x._id }
                                            })}
                                            options={{ placeholder: "Chọn chứng chỉ - bằng cấp" }}
                                            value={item?.certificateRequirements?.certificates}
                                            multiple={true}
                                        />
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label >Số chứng chỉ tối thiểu</label>
                                        <input type="number" className="form-control" name="count" value={item?.certificateRequirements?.count} autoComplete="off" disabled={true}/>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                    )
                })
            }
        </div >
    );
};

const keyPeopleRequireTab = connect(null, null)(withTranslate(KeyPeopleRequireTab));
export { keyPeopleRequireTab as KeyPeopleRequireTab };