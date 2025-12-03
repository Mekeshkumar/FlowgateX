// Application configuration
const config = {
    app: {
        name: import.meta.env.VITE_APP_NAME || 'FlowGateX',
        version: import.meta.env.VITE_APP_VERSION || '1.0.0',
        env: import.meta.env.VITE_APP_ENV || 'development',
    },
    api: {
        baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
        timeout: 10000,
    },
    websocket: {
        url: import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:5000',
    },
    auth: {
        tokenKey: import.meta.env.VITE_AUTH_TOKEN_KEY || 'flowgatex_auth_token',
    },
    payment: {
        stripeKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
        razorpayKey: import.meta.env.VITE_RAZORPAY_KEY_ID,
    },
    iot: {
        gatewayUrl: import.meta.env.VITE_IOT_GATEWAY_URL,
        mqttBroker: import.meta.env.VITE_MQTT_BROKER_URL,
    },
    features: {
        chatbot: import.meta.env.VITE_ENABLE_CHATBOT === 'true',
        iot: import.meta.env.VITE_ENABLE_IOT === 'true',
        crowdMonitoring: import.meta.env.VITE_ENABLE_CROWD_MONITORING === 'true',
    },
    analytics: {
        googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID,
    },
};

export default config;
