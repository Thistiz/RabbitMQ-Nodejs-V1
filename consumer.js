import { connect } from 'amqplib';

async function consumeMessages() {
  try {
    // Connect to RabbitMQ server
    const connection = await connect('amqp://localhost');

    // Create a channel
    const channel = await connection.createChannel();

    // Specify the queue name
    const queueName = 'my-queue';

    // Declare the queue (no need to create it again if it already exists in the producer)
    await channel.assertQueue(queueName, { durable: false });

    console.log(`Waiting for messages in ${queueName}. To exit, press CTRL+C`);

    // Consume messages from the queue
    channel.consume(queueName, (message) => {
      const content = message.content.toString();
      console.log(`Received: ${content}`);

      // Process the received message content here

      // Acknowledge the message to RabbitMQ
      channel.ack(message);
    });
  } catch (error) {
    console.error(error);
  }
}

// Call the consumeMessages function
consumeMessages();
