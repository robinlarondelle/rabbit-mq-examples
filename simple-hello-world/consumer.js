const amqp = require("amqplib") //advanced messaging queue protocol

async function connect() {
  try {

    //Make sure the Docker Container with the Rabbit MQ server is spinning
    //The RabbitMQ Container uses a Advanced Messaging Queue Protocol
    //The RabbitMQ Container is listening on port 5672
    const connection = await amqp.connect("amqp://localhost:5672")

    //The Connection now contains a HTTP TCP connection
    //RabbitMQ communicates via the HTTP/2 protocol and uses channels
    //Create new channels
    const channel = await connection.createChannel()

    //A Publisher publishes a Messaage to a Queue
    //First we need to check if the Queue exists using assertQueue()
    const assertResult = await channel.assertQueue("jobs")

    //To consume messages, you have to listen to the Message Exchange
    //this can be done with the consume() function whidh takes the name of the channel
    //and a function to execute once a message arrives
    channel.consume("jobs", message => {
      const content = JSON.parse(message.content.toString())

      //to remove a Message from the Queue, we have to tell RabbitMQ that we have received the message
      //We can do this with the .ack() function
      //This function will pop the message from the Queue
      channel.ack(message)
      
      console.log(`Received message with number ${content.number}`);
    })

    console.log("Waiting for messages...");   
    
  } catch (ex) {
    console.log(ex);
  }
}

connect()