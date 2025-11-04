export const createProducer = (kafka) => {
  const producer = kafka.producer();

  const connect = async () => {
    await producer.connect();
    console.log("Kafka producer connected");
  };

  const send = async (topic, message) => {
    try {
      console.log("producer message","topic"+topic,"message"+message)
      await producer.send({
        topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      console.log(`Message sent to topic "${topic}"`);
    } catch (err) {
      console.error("Error sending Kafka message:", err);
      throw err
    }
  };

  const disconnect = async () => {
    await producer.disconnect();
    console.log("Kafka producer disconnected");
  };

  return { connect, send, disconnect };
};
