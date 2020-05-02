const amqp = require("amqplib") //advanced messaging queue protocol

const msg = {number: 19}
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
    
    //the sendToQueue() function takes the Queue name and the Message to be send
    //the Message has to be of type Buffer.
    //to send JSON Messages you can Stringify the JSON objects to convert them to a Buffer
    channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)))

    console.log("Successfully send Job Message!");
    console.log(msg.number);
    
  } catch (ex) {
    console.log(ex);
  }
}

connect()