const axios = require("axios");
const moment = require("moment");
const CryptoJS = require('crypto-js');
const qs = require('qs');
const Order = require("../models/order.model");
// var accessKey = 'F8BBA842ECF85';
// var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const config = {
  app_id: "553",
  key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
  key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
  key3: "eG4r0GcoNtRGbO8",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};
module.exports.paymentZalo = async (req, res) => {
  const { total_price, order_id, payment_id } = req.body;
  const embed_data = {
    redirecturl: "https://dacn-steel.vercel.app/Cart",
  };

  const items = [{}];

  const order = {
    app_id: config.app_id,
    app_trans_id: payment_id, // `${moment().format('YYMMDD')}_${order._id}`
    app_user: "user123",
    app_time: Date.now(), // miliseconds
    item: JSON.stringify(items),
    embed_data: JSON.stringify(embed_data),
    amount: total_price,
    description: `BKPetcare - Thanh toán cho đơn hàng #${order_id}`,
    bank_code: "",
    callback_url: "https://3304-125-235-239-124.ngrok-free.app/payment/callbackZALO",
  };

  // appid|app_trans_id|appuser|amount|apptime|embeddata|item
  const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
  order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  try {
    const response = await axios.post(config.endpoint, null, { params: order });
    console.log(response.data);
    // Update order's payment_id and payment_url
    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      { payment_url: response.data.order_url });
    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
module.exports.callbackZalo = async (req, res) => {
  let result = {};

  try {
    let dataStr = req.body.data;
    let reqMac = req.body.mac;

    let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
    console.log("mac =", mac);

    // kiểm tra callback hợp lệ (đến từ ZaloPay server)
    if (reqMac !== mac) {
      // callback không hợp lệ
      result.returncode = -1;
      result.returnmessage = "mac not equal";
    }
    else {
      // thanh toán thành công
      // merchant cập nhật trạng thái cho đơn hàng
      let dataJson = JSON.parse(dataStr, config.key2);
      console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);
      const order_id = dataJson["app_trans_id"].split('_')[1]
      const order = Order.findOneAndUpdate({ order_id: order_id }, { status: "Chờ Xử lý" });
      result.returncode = 1;
      result.returnmessage = "success";
    }
  } catch (ex) {
    result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
    result.returnmessage = ex.message;
  }

  // thông báo kết quả cho ZaloPay server
  res.json(result);
};
module.exports.orderStatusZalo = async (req, res) => {
  const app_trans_id = req.params.app_trans_id;

  let postData = {
    appid: config.app_id,
    apptransid: app_trans_id, // Input your apptransid
  }
  let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key4
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: 'post',
    url: "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(postData)
  };
  try {
    const response = await axios(postConfig);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json(error);
  }
};
module.exports.checkOrderStatusZalo = async (req, res) => {
  const app_trans_id = req.params.app_trans_id;

  let postData = {
    appid: config.app_id,
    apptransid: app_trans_id, // Input your apptransid
  }
  let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key4
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: 'post',
    url: "https://sandbox.zalopay.com.vn/v001/tpe/getstatusbyapptransid",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(postData)
  };
  try {
    const response = await axios(postConfig);
    if (response.data.returncode === 1) {
      const order_id = app_trans_id.split('_')[1];
      const updatedOrder = await Order.findByIdAndUpdate(
        order_id,
        { order_status: "Chờ xử lý", paid: true },
        { new: true, useFindAndModify: false } // Return the updated document and use the new MongoDB driver
      );
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
    }
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json(error);
  }
};
module.exports.refundZalo = async (req, res) => {
  const timestamp = Date.now();
  const uid = `${timestamp}${Math.floor(111 + Math.random() * 999)}`; // unique id

  let params = {
    appid: config.app_id,
    mrefundid: `${moment().format('YYMMDD')}_${config.app_id}_${uid}`,
    timestamp, // miliseconds
    zptransid: req.body.payment_id,
    amount: req.body.total_price,
    description: `ZaloPay Refund cho giao dịch ${req.body.payment_id}`,
  };

  // appid|zptransid|amount|description|timestamp
  let data = params.appid + "|" + params.zptransid + "|" + params.amount + "|" + params.description + "|" + params.timestamp;
  params.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  axios.post("https://sandbox.zalopay.com.vn/v001/tpe/partialrefund", null, { params })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));
}


// DM MOMO
// module.exports.paymentMOMO = async (req, res) => {
//   //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
//   //parameters
//   var orderInfo = 'pay with MoMo';
//   var partnerCode = 'MOMO';
//   var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
//   var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
//   var requestType = "payWithMethod";
//   var amount = '50000';
//   var orderId = partnerCode + new Date().getTime();
//   var requestId = orderId;
//   var extraData = '';
//   var paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
//   var orderGroupId = '';
//   var autoCapture = true;
//   var lang = 'vi';

//   //before sign HMAC SHA256 with format
//   //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
//   var rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + "&requestType=" + requestType;
//   //puts raw signature
//   console.log("--------------------RAW SIGNATURE----------------")
//   console.log(rawSignature)
//   //signature
//   const crypto = require('crypto');
//   var signature = crypto.createHmac('sha256', secretKey)
//     .update(rawSignature)
//     .digest('hex');
//   console.log("--------------------SIGNATURE----------------")
//   console.log(signature)

//   //json object send to MoMo endpoint
//   const requestBody = JSON.stringify({
//     partnerCode: partnerCode,
//     partnerName: "Test",
//     storeId: "MomoTestStore",
//     requestId: requestId,
//     amount: amount,
//     orderId: orderId,
//     orderInfo: orderInfo,
//     redirectUrl: redirectUrl,
//     ipnUrl: ipnUrl,
//     lang: lang,
//     requestType: requestType,
//     autoCapture: autoCapture,
//     extraData: extraData,
//     orderGroupId: orderGroupId,
//     signature: signature
//   });
//   const options = {
//     url: 'https://test-payment.momo.vn/v2/gateway/api/create',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': Buffer.byteLength(requestBody),
//     },
//     data: requestBody,
//   }
//   let result;
//   try {
//     result = await axios(options);
//     return res.status(200).json(result.data);
//   } catch (error) {
//     res.status(500).json({
//       statusCode: 500,
//       message: error,
//     })
//   }

// }
// module.exports.callback = async (req, res) => {
//   console.log("callback");
//   console.log(req.body);
//   res.status(200).json(req.body);
// }
// module.exports.transactionStatusMOMO = async (req, res) => {
//   const { orderId } = req.body;

//   const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

//   const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');
//   const requestBody = JSON.stringify({
//     partnerCode: 'MOMO',
//     accessKey: accessKey,
//     requestId: orderId,
//     orderId: orderId,
//     signature: signature,
//     lang: 'vi'
//   });
//   const options = {
//     url: 'https://test-payment.momo.vn/v2/gateway/api/query',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': Buffer.byteLength(requestBody),
//     },
//     data: requestBody,
//   }
//   let result = await axios(options);
//   return res.status(200).json(result.data);
// }