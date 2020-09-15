const { Stock, User, Company, Bill, BinLocation, Category, Consignment, Good, Partner, Proposal } = require('../../../models').schema;

require('dotenv').config({path: '../../../.env'});
require('../../../connectDatabase');

test = async () =>{
    // var listCategory = await Category.insertMany([{
    //     code: "CT001",
    //     name: "ABC",
    //     type: "product",
    //     description: "San pham",
    // },
    // {
    //     code: "CT002",
    //     name: "ABCD",
    //     type: "material",
    //     description: "Nguyen vat lieu",
    // },
    // {
    //     code: "CT003",
    //     name: "ABCDE",
    //     type: "product",
    //     description: "San pham",
    // }
    // ]);
    // console.log("Khởi tạo xong danh sách danh mục hàng hóa");

    // var listGood = await Good.insertMany([{
    //     category: listCategory[0]._id,
    //     code: "G001",
    //     name: "Thuoc",
    //     type: "product",
    //     description: "San pham",
    //     baseUnit: "Vi"
    // },
    // {
    //     category: listCategory[2]._id,
    //     code: "G002",
    //     name: "Thuoc vien",
    //     type: "product",
    //     description: "San pham",
    //     baseUnit: "Hop"
    // }
    // ]);

    // var listConsignment = await Consignment.insertMany([{
    //     name: "123456",
    //     good: listGood[0]._id,
    //     originalQuantity: 100,
    //     quanitity: 70,
    //     price: 100000,
    //     description: "test",
    //     consignment: [
    //     {
    //         bill:
    //         type: "Nhap kho",
    //         quantity: 100,
    //         description: "xuat kho",
    //     },
    //     {
    //         type: "Hu hong",
    //         quantity: 30,
    //         description: "hong"
    //     }]
    // },
    // {
    //     name: "23456",
    //     good: listGood[1]._id,
    //     originalQuantity: 100,
    //     quanitity: 50,
    //     price: 120000,
    //     description: "test",
    //     consignmentLogs: [
    //     {
    //         type: "Nhap kho",
    //         quantity: 100,
    //         description: "xuat kho",
    //     },
    //     {
    //         type: "Hu hong",
    //         quantity: 30,
    //         description: "hong",
    //     },
    //     {
    //         type: "Xuat kho",
    //         quantity: 20,
    //         description: "xuat kho",
    //     }]
    // }
    // ]);

    // var listBill = await Bill.insertMany([{
    //     code: "ST001",
    //     description: "Nhap",
    //     consignmentReceipts: [
    //         {
    //             consignment: listConsignment[0]._id,
    //             // type: "Nhap",
    //             quantity: 100
    //         },
    //         {
    //             consignment: listConsignment[1]._id,
    //             // type: "Nhap",
    //             quantity: 100
    //         },
    //     ],
    //     consignmentIssues: [
    //         {
    //             consignment: listConsignment[1]._id,
    //             // type: "Xuat",
    //             quantity: 20
    //         }
    //     ]
    // },
    // {
    //     code: "ST002",
    //     description: "Nhap",
    //     consignmentIssues: [
    //         {
    //             consignment: listConsignment[1]._id,
    //             // type: "Xuat",
    //             quantity: 20
    //         }
    //     ]
    // }
    // ]);
    // var listConsignment = await Consignment.updateOne(
    // {_id: "5f5b338588742718b845cf2b"},
    // {
    //     name: "123456",
    //     //good: listGood[0]._id,
    //     originalQuantity: 100,
    //     quanitity: 70,
    //     price: 100000,
    //     description: "test",
    //     consignmentLogs: [
    //     {
    //         bill: "5f5b33e1c2b3f838a4470ff5",
    //         type: "Nhap kho",
    //         quantity: 100,
    //         description: "xuat kho",
    //     },
    //     {
    //         type: "Hu hong",
    //         quantity: 30,
    //         description: "hong"
    //     }]
    // }
    // {
    //     name: "23456",
    //     // good: listGood[1]._id,
    //     originalQuantity: 100,
    //     quanitity: 50,
    //     price: 120000,
    //     description: "test",
    //     consignmentLogs: [
    //     {
    //         bill: "5f5b33e1c2b3f838a4470ff5",
    //         type: "Nhap kho",
    //         quantity: 100,
    //         description: "xuat kho",
    //     },
    //     {
    //         type: "Hu hong",
    //         quantity: 30,
    //         description: "hong",
    //     },
    //     {
    //         bill: "5f5b34c3ca00d330ecddda15",
    //         type: "Xuat kho",
    //         quantity: 20,
    //         description: "xuat kho",
    //     }]
    // }
    // );
    // let consignment = await Consignment.findOne()
    // .populate()
    // console.log(consignment);
    let test = await Consignment.findById({_id: "5f5b338588742718b845cf2b"})
        .populate({path: 'good', model: Good, select: 'name'})
        .populate({path: 'consignmentLogs.bill', model: Bill, select: 'consignmentReceipts consignmentIssues'})
    //console.log(test.consignmentLogs[0].bill.consignmentReceipts);

    let test2 = await Consignment.find()
        .populate({path: 'good', model: Good, select: 'code name category',
        populate: {path: 'category', model: Category, select: 'name'}})
    // console.log(test2[0].good)

    let test3 = await Bill.findById({_id: "5f5b33e1c2b3f838a4470ff5"})
        .populate({path: 'consignmentIssues.consignment consignmentReceipts.consignment', model: Consignment, select: 'name good', populate: {path: 'good', model: Good, select: 'name'}})
    console.log(test3.consignmentReceipts[0].consignment)
}
test();