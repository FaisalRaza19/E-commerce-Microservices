export const createProducer = (Kafka) => {
    try {
        const producer = Kafka.producer()
        const connect = async () => {
            await producer.connect()
        }
        const send = async (topic, message) => {
            await producer.send({
                topic,
                messages: [{ value: JSON.stringify(message) }]
            })
        }
        
        const disconnect = async () => {
            await producer.disconnect()
        }

        return {connect,send,disconnect}
    } catch (error) {
        console.log("producer error", error)
        return error.message
    }
}