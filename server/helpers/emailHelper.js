const nodemailer = require("nodemailer");
const user = 'vnist.qlcv@gmail.com';
const pass = 'Vnist1234@12345';

// Hiện tại khi gửi mail sẽ vào thư rác.. đang xử lý,,, dùng tạm mail cũ
// const user = 'qlcv@vnist.vn';
// const pass = 'Vni$tad@321';
// const mailPort = 25;
// const mailHost = 'mail.vnist.vn';

let length = 0;
exports.sendEmail = (to, subject, text, html) => {
    var transporter = nodemailer.createTransport({
        // host: mailHost,
        // port: mailPort,
        // secure: false,
        service: 'Gmail',
        auth: { user: user, pass: pass }
    });
    var mainOptions = {
        from: user,
        to: to,
        // inReplyTo: messageId,  
        subject: subject,
        text: text,
        html: html,
        // messageId: to 
    }
    length = length + 1
    const send = () => {
        console.log(length);
        transporter.sendMail(mainOptions, (err, success) => {
            length = length - 1;
            if (success) {
                console.log(success);
                let messageId = success.messageId;
                console.log(messageId);
            }
            if (err) {
                console.log(err)
            }
        });
    }
    setTimeout(send, length * 2000)
}
