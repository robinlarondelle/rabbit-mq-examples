const amqp = require("amqplib") //advanced messaging queue protocol

const msg = process.argv.slice(2).join(' ') || "Hello World!";
const queue = "task_queue" // task_queue is the same as work_queue
async function connect() {
  try {

    //Make sure the Docker Container with the Rabbit MQ server is spinning
    //The RabbitMQ Container uses a Advanced Messaging Queue Protocol
    //The RabbitMQ Container is listening on port 5672
    amqp.connect("amqp://localhost:5672", (err, connection) => {
      if (err) throw err

      //The Connection now contains a HTTP TCP connection
      //RabbitMQ communicates via the HTTP/2 protocol and uses channels
      //Create new channels
      connection.createChannel((err, channel) => {
        if (err) throw err

        //A Publisher publishes a Messaage to a Queue
        //First we need to check if the Queue exists using assertQueue()
        channel.assertQueue(queue, {

          //Marking a queue as durable will make sure that messages in the queue will be stored
          //even if the RabbitMQ server stops. 
          //However, this will only work if the consumer is durable as well.
          durable: true
        })

        //the sendToQueue() function takes the Queue name and the Message to be send
        //the Message has to be of type Buffer.
        //to send JSON Messages you can Stringify the JSON objects to convert them to a Buffer
        channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)), {

          //In combination with the durable queue, marking messages as persistent will make sure
          //that the messages are stored when the server shuts down for some reason
          persistent: true
        })

        console.log(`Successfully sent message ${msg}`);
      })
    })

    //Timeout to close publisher
    setTimeout(() => {
      connection.close();
      process.exit(0)
    }, 500);

  } catch (ex) {
    console.log(ex);
  }
}

connect()