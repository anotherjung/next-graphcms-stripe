import stripe from '@/lib/stripe-client'

const mailjet = require('node-mailjet')
  .connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

async function createOrderEmail({ sessionId }) {

  const {
    customer,
    line_items,
    ...session
  } = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items.data.price.product', 'customer']
  })

  console.log(412,"order-email")
  console.log(413,"order-email",customer)
  console.log(414,"order-email-session",session)
  console.log(415,"order-email",line_items)
  console.log(417,"order-email",line_items.data)
  console.log(418,"order-email",line_items.data[0].price.product.metadata)

      let dataEmail = {
          name: customer.name,
          email: customer.email,
          orderMessage: "Thank you very much for your pre-order.",
          orderId: session.payment_intent,
          orderSubtotal: session.amount_subtotal,
          companyName: 'Air Ahi Hawaii'
      }

      mailjet
      .post("send", { 'version': 'v3.1' })
      .request(
        {
        "Messages": [
          {
            "From": {
              "Email": process.env.MJ_SENDER_EMAIL
            },
            "To": [
              {
                "Email": dataEmail.email,
                "Name": dataEmail.name
              }
            ],
            "TemplateID": Number(process.env.MJ_EMAIL_TEMPLATE),
            "TemplateLanguage": true,
            "Variables": {
          "name": dataEmail.name,
          "orderMessage": dataEmail.orderMessage,
          "orderId": dataEmail.orderId,
          "orderSubTotal": dataEmail.orderSubtotal,
          "companyName": dataEmail.companyName
        }
          }
        ]},
        {
          "Data":[{
            "name": dataEmail.name,
            "body": dataEmail.message,
            "orderId": dataEmail.payment_intent,
            "orderSubTotal": dataEmail.amount_subtotal,
            "companyName": 'Air Ahi Hawaii'
        }]
      }
      )
      .then((result) => {
        console.log(419,result.body)
      })
      .catch((err) => {
        console.log(err.statusCode)
      })
}

export default createOrderEmail
