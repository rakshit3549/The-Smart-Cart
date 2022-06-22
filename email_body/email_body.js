export function sendMail(email_items_list, costumer_details) {

    let d = new Date();
    var dateString = d.getHours() + ":" + d.getMinutes() + " " + d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();

    let tr = ``;
    email_items_list.forEach(myFunction);
    let email_body = `
        <!DOCTYPE html>
        <html>
        <base target="_top">

        <head>
            <title>paymentEmailTemp</title>
        </head>

        <body
            style="background-color: rgb(195, 211, 233) !important ;width: 500px; padding:10px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; ">
            <div
                style="background-color: rgb(214, 231, 240) !important ;padding: 20px;border-top-left-radius: 10px;border-top-right-radius: 10px">
                <img style="width: 400px ;margin: 30px; margin-right: 100% ;" 
                src="https://firebasestorage.googleapis.com/v0/b/beproject-5ce09.appspot.com/o/email_templet%2Fpayment_success.png?alt=media&token=d50cbcd4-431a-4470-b94b-56ebcf205bd2"
                alt="Payment image">

                <div style="text-align: center;padding-bottom: 10px;"><span style="line-height: 45px; font-size: 30px;">Your
                        Payment has been &nbsp;<span
                            style="color: #2190e3 !important; font-size: 35px; line-height: 45px;">Successfully
                            Received!</span></span>
                </div>
                <div style="line-height: 33px; text-align: center ;font-size: 20px; padding-left: 10px ;padding-right : 10px ">
                    Hello ${costumer_details.get("user_name")}, Thank you for shopping with <a style="text-decoration: none;" href="#">TheSmartCart.com</a>.
                    We're glad to inform you that your payment has been <strong>successful</strong> and we value you as a
                    preferred customer and look forward to future business with you.
                </div>
                <div style="text-align:center; padding: 20px; "><span
                        style="font-size: 18px; line-height: 21px; background-color: rgb(255, 255, 255) !important ;padding: 10px; border-radius: 10px;">&nbsp;
                        Amount : ₹ ${costumer_details.get("total_amount")} on&nbsp;<strong><span
                                style="color: rgb(33, 144, 227) !important ; font-size: 18px; line-height: 21px;">
                                ${dateString}
                            </span></strong></span>
                </div>

            </div>

            <div id="itemsordered" style="background-color: rgb(206, 205, 194) !important ;">

                <div
                    style="text-align: center;padding: 10px;text-decoration-thickness: 3px ; background-color: rgb(247, 250, 255) !important ; font-size: 22px; ">
                    <span> Order Summary:</span>
                </div>
                <div id="table"
                    style="text-align: center;background-color:rgb(238, 242, 245) !important ;border-collapse: collapse; padding: 0; ">

                    <table
                        style=" font-family: Arial, Helvetica, sans-serif; text-align: center;width: 100%; border-collapse: collapse;">
                        <col style="width: 30%;">
                        <col style="width: 22%;">
                        <thead>
                            <tr style="border-collapse: collapse; background-color: rgb(195, 211, 233) !important;">
                                <th style="border-right: 1px solid rgb(33, 144, 227);padding: 10px;">ITEM</th>
                                <!-- <th style="border-right: 1px solid rgb(33, 144, 227);">City</th> -->
                                <th style="border-right: 1px solid rgb(33, 144, 227);">QTY</th>
                                <th style="border-right: 1px solid rgb(33, 144, 227);">MRP</th>
                                <th>Sub Total</th>
                            </tr>
                        </thead>
                        ${tr}
                    </table>

                </div>


            </div>
            <div id="Question"
                style="background-color: whitesmoke !important;padding:2%;padding-right: 0; width: 490px;text-align: center;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px">
                <div
                    style="background-color:  rgb(195, 211, 233) !important; width: 470px;border-radius: 10px; margin-left: 5px; ">
                    <h2 style="color: tomato; margin-top: 2%;padding-top: 1%;margin-bottom: 0;"> <strong>Got a
                            question?</strong></h2>

                    <div style="padding-bottom:5px"><span style="line-height: 40px; font-size: 34px; "
                            data-mce-style="line-height: 40px; font-size: 34px;">We're here to help you</span>
                    </div>


                    <span style="font-size: 14px; line-height: 30px;" data-mce-style="font-size: 14px; line-height: 27px;">If
                        you need us we here to help <strong><a style="text-decoration: none;"
                                href="mailto:rakshitshetty272@gmail.com?cc=rakshitshetty26@gmail.com&subject=Support Needed">
                                support@thesmartcart.com</a></strong></span>
                </div>
            </div>

        </body>

        </html>
        `;


    Email.send({
        Host: "smtp.gmail.com",
        Username: "rakshitshetty272@gmail.com",
        Password: "vthoqvmdvtcoafha",
        To: costumer_details.get("user_email"),
        From: " \"The Smart Cart\" rakshitshetty272@gmail.com ",
        Subject: "Payment Successful",
        Body: email_body,
    }).then(function (message) {
        console.log("mail sent successfully");
    });

    function myFunction(email_item) {

        tr += `<tr>
            <td style="border-right: 1px solid rgb(33, 144, 227) !important;"><img
                style="width: 80px;height:80px; padding-top: 15px; " src="${email_item.get("image")}" alt="Item image">
                <p style="margin-left: 30px;margin-right: 30px;">${email_item.get("name")}</p></td>
            <td style="border-right: 1px solid rgb(33, 144, 227);">
            ${email_item.get("quantity")}</td>
            <td style="border-right: 1px solid rgb(33, 144, 227);">
            ${email_item.get("mrp")}</td>
            <td> ${email_item.get("subtotal")} </td>
        </tr>`;
    }



}