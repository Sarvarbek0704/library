export const eskizConfig = {
  apiKey: process.env.SMS_TOKEN || '', // sizning sms_token
  sender: process.env.SMS_SENDER || '4546', // Eskiz dashboarddagi yuboruvchi
  serviceUrl:
    process.env.SMS_SERVICE_URL ||
    'https://notify.eskiz.uz/api/message/sms/send',
};
