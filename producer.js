import { connect } from 'amqplib';

async function createAndSendMessage() {
  try {
    // Connect to RabbitMQ server
    const connection = await connect('amqp://localhost');

    // Create a channel
    const channel = await connection.createChannel();

    // Specify the queue name
    const queueName = 'my-queue';

    // Declare and create the queue if it doesn't exist
    await channel.assertQueue(queueName, { durable: false });

    // Message to be sent
    const message = 'Hello, RabbitMQ!';

    // Send the message to the queue
    channel.sendToQueue(queueName, Buffer.from(message));

    console.log(`Sent: ${message}`);

    // Close the connection
    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
}

// Call the createAndSendMessage function
createAndSendMessage();
