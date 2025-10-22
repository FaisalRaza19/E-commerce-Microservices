export const createConsumer = (Kafka,groupId) => {
    try {
        const consumer = Kafka.consumer({ groupId })
        const connect = async () => {
            await consumer.connect();
            console.log("Kafka consumer connected:" + groupId);
        };

        const subscribe = async (topics) => {
            await consumer.subscribe({
                topics: topics.map((topic) => topic.topicName),
                fromBeginning: true,
            });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    try {
                        const topicConfig = topics.find((t) => t.topicName === topic);
                        if (topicConfig) {
                            const value = message.value?.toString();

                            if (value) {
                                await topicConfig.topicHandler(JSON.parse(value));
                            }
                        }
                    } catch (error) {
                        console.log("Error processing message", error);
                    }
                },
            });
        };

        const disconnect = async () => {
            await consumer.disconnect();
        };

        return {connect,subscribe,disconnect}
    } catch (error) {
        console.log("consumer error", error.message)
        return error
    }
}