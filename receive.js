import { connect } from 'amqplib';
import { createTransport } from 'nodemailer';

async function sleep(ms) {
  return await new Promise(resolve => setTimeout(resolve, ms));
}

// async function sendMail() {
//   // Create a new Date object
//   var currentDate = new Date();
//   // Get the current date and time in a readable format
//   var dateTimeString = currentDate.toLocaleString();
// await  console.log(dateTimeString);
// }

async function receiveEmail() {
  const connection = await connect('amqp://localhost');
  const channel = await connection.createChannel();

  const queue = 'email_queue';
  await channel.assertQueue(queue, { durable: false });

  console.log('Waiting for messages. To exit, press CTRL+C');

  // Set up nodemailer transporter for Gmail
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: 'jetset496@gmail.com',
      pass: 'kabu exna ftjy ftef',
    },
  });

  // Set the prefetch count before starting to consume messages
  channel.prefetch(1);

  await channel.consume(queue, async (msg) => {
    try {
      const emailData = JSON.parse(msg.content.toString());
      console.log(`Received email to: ${emailData.to}, subject: ${emailData.subject}, body: ${emailData.body}`);

      console.log('Sending email...');
      // Send email using nodemailer
      await transporter.sendMail({
        from: 'your-gmail@gmail.com',
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.body,
      }, (error, info) => {
        if (error) {
          return console.error('Error sending email:', error);
        }
        console.log('Email sent successfully:', info);
        
      });

      // Simulate processing time before the next email
      const delayAfterSend = 5000; // 60 seconds in milliseconds
      await sleep(delayAfterSend);

      console.log('Waiting for the next email...');
    } catch (error) {
      console.error('Error processing email:', error);
    } finally {
      // Acknowledge the message
      channel.ack(msg);
    }
  }, { noAck: false }); // Set noAck to false to manually acknowledge messages
}

// Start receiving emails
receiveEmail();
