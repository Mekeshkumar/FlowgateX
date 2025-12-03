// IoT Feature - Device monitoring and management
export const iotConfig = {
    gatewayUrl: import.meta.env.VITE_IOT_GATEWAY_URL,
    mqttBroker: import.meta.env.VITE_MQTT_BROKER_URL,
};

export const deviceTypes = {
    ENTRY_GATE: 'entry_gate',
    EXIT_GATE: 'exit_gate',
    CROWD_SENSOR: 'crowd_sensor',
    TEMPERATURE_SENSOR: 'temperature_sensor',
    CAMERA: 'camera',
};

export const deviceStatus = {
    ONLINE: 'online',
    OFFLINE: 'offline',
    WARNING: 'warning',
    ERROR: 'error',
};
