export const createConsumer = (kafka, groupId) => {
  const consumer = kafka.consumer({ groupId });

  const connect = async () => {
    await consumer.connect();
    console.log(`Kafka consumer connected (group: ${groupId})`);
  };

  const subscribe = async (topics) => {
    for (const { topicName } of topics) {
      await consumer.subscribe({ topic: topicName, fromBeginning: true });
    }

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const topicConfig = topics.find((t) => t.topicName === topic);
        if (!topicConfig || !message.value) return;

        let value;
        try {
          value = JSON.parse(message.value.toString());
        } catch (err) {
          console.error(`[${groupId}] Unparseable message on topic ${topic}:`, err.message);
          return;
        }

        try {
          await topicConfig.topicHandler(value, {
            topic,
            partition,
            offset: message.offset,
          });
        } catch (err) {
          console.error(`[${groupId}] Error in handler for topic ${topic}:`, err.message);
        }
      },
    });
  };

  const disconnect = async () => {
    await consumer.disconnect();
    console.log(`Kafka consumer disconnected (group: ${groupId})`);
  };

  return { connect, subscribe, disconnect };
};
