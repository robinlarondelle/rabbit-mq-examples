const amqp = require("amqplib") //advanced messaging queue protocol

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

          //Marking a queue as durable will make sure that the queue will exist,
          //even if the RabbitMQ server stops. 
          //However, this will only work if the publisher is durable as well.
          durable: true
        })

        //The function prefetch() tells RabbitMQ to not overload a consumer with more than 1 message
        //All other messages will be kept on the Queue instead. This prevents an uneven
        //or unfair balance when balancing messages
        channel.prefetch(1);

        //To consume messages, you have to listen to the Message Exchange
        //this can be done with the consume() function whidh takes the name of the channel
        //and a function to execute once a message arrives
        channel.consume("jobs", message => {

          //For this example, we use dots (.) to indicate how long we should 'perform a taks'
          //This is to simulate work and make the work-queue do it's thing
          const secs = message.content.toString().split('.').length - 1;

          console.log(`Received message ${message.content.toString()}. Waiting ${secs} seconds`);

          // 'Perform work'
          setTimeout(() => {
            console.log("Task finished.");
          }, secs * 1000) //Simulate the seconds

          //to remove a Message from the Queue, we have to tell RabbitMQ that we have received the message
          //We can do this with the .ack() function
          //This function will pop the message from the Queue
          //You'll only acknowledge a message after you are done with it!
          channel.ack(message)

        }, {

          // There are two options: automatically acknowledge when received, or manually acknowledge them
          // It depends on the situation when it is desired to automatically acknowledge messages
          noAck: false
        })
      })


      console.log("Waiting for messages...");
    })
  } catch (ex) {
    console.log(ex);
  }
}

connect()