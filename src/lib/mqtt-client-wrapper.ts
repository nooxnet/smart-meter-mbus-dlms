import { connect, IClientPublishOptions, MqttClient } from "mqtt";
import { IClientOptions } from 'mqtt/types/lib/client';
import { MqttSettings } from './settings/setting-classes';

export class MqttClientWrapper {

	private client: MqttClient | undefined;

	public constructor() {
		const clientOptions: IClientOptions = {
			host: MqttSettings.host,
			port: MqttSettings.port,

			clientId: MqttSettings.clientId,

			username: MqttSettings.username,
			password: MqttSettings.password,
			clean: true,
			rejectUnauthorized: MqttSettings.rejectUnauthorized
		};
		if(MqttSettings.testMode) {
			if(!MqttSettings.testModeNoLogging) {
				console.log('MQTT test mode: connect to broker', clientOptions);
			}
			return;
		}
		this.client = connect(clientOptions);

		this.client.on("error", function (error) {
			console.error(`Unable to connect to ${MqttSettings.host}:${MqttSettings.port}. Error: ${error}`);
		});
	}

	// public disconnect() {
	// 	if(this.client) {
	// 		this.client.end()
	// 	}
	// }

	public publish(topic: string, message: string): void {
		if(this.client && !this.client.connected) {
			console.error(`MQTT client is not connected to broker ${MqttSettings.host}:${MqttSettings.port}. Ignore publish.`);
			return;
		}
		const options: IClientPublishOptions = {
			qos: 0,
			retain: false
		};

		const fullTopic = MqttSettings.topicBase + topic;
		if(MqttSettings.testMode) {
			if(!MqttSettings.testModeNoLogging) {
				console.log(`MQTT test mode. Publish: '${fullTopic}': ${message}`);
			}
			return;
		}

		if(!this.client) {
			console.error(`Error publishing MQTT topic ${fullTopic}. Mqtt client object  is not defined.`);
			return;
		}

		this.client.publish(fullTopic, message, options, (error: Error | undefined) => {
			if (error) {
				console.error(`Error publishing MQTT topic ${fullTopic}. Error: ${error}`);
			}
		});
	}
}
