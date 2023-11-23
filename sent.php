<?php
require_once __DIR__ . '/vendor/autoload.php';

use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

$connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
$channel = $connection->channel();

$channel->queue_declare('email_queue', false, false, false, false);

$messageBody = json_encode(['to' => 'thistiz01@gmail.com', 'subject' => 'Test', 'body' => 'Hello, This is test send email from PHP to RabbitMQ.']);

$message = new AMQPMessage($messageBody);
$channel->basic_publish($message, '', 'email_queue');

$channel->close();
$connection->close();