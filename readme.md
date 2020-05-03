# Rabbit MQ Examples
This repository is a product of the Rabbit MQ tutorials, and is ment for studying purposes only.

## How to run the examples
Before running any of the examples, make sure you have the RabbitMQ server running.
The RabbitMQ server can be downloaded, or can be deployed in a container using Docker.

### Download
Download from the Rabbit MQ website:
https://www.rabbitmq.com/download.html

### Docker
If you have docker installed, spin up the container using the following command:
`docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`

## Examples
The examples are based on the Rabbit MQ tutorials. Each example resides in it's own folder

### simple-hello-world
Run `npm run 'simple-hello-world consumer'` and `npm run 'simple-hello-world publisher'`, each in a separate terminal.

### work-queue
Run `npm run 'work-queue publisher'` in a terminal, then open up **two** terminals. Run `npm run 'work-queue consumer'` in each of them to simulate the working of the work-queue.

### publish-subscribe
The Publish/Subscribe example demonstrates how multiple consumers can subscribe to messages from a single publishers. This example uses the fanout-exchange