export default () => ({
  port: Number(process.env.PORT) || 9000,
  secretKey: process.env.SECRET_KEY,
  awsAccessKey: process.env.AWS_ACCESS_KEY_ID as string,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  awsRegion: process.env.AWS_REGION as string,
  awsBucketName: process.env.AWS_BUCKET_NAME as string,
  smtpUser: process.env.SMTP_USER as string,
  smtpPassword: process.env.SMTP_PASSWORD as string,
  smtpSecure: process.env.SMTP_SECURE,
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpClient: process.env.SMTP_CLIENT as string,
});
