const firebaseAdmin = require('firebase-admin');

const serviceAccount = {
  'type': 'service_account',
  'project_id': 'dx-workplace',
  'private_key_id': '726a4a58e4d04fb503dceb579b0713efa9de2636',
  'private_key': '-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQC4wpm+bNYjp7XB\n+xmRm6gp3161EeDSmBMp9bIT4lQOB/D5dJHgl96Pw3VtDbKVOfpILW9lp8YMdGr2\noj5FV4qvfAjrqDEcgV6O7DiGqqZ9sLsObLiN3J+SELvDJICQ7SHqgDiffDBs6d2J\n1p0oRzUzhE+V9sf5rZ2hgZ4XjxSe0hIdwWFz+335kyA0lOj3Mt+zaoKqSX/NLsh8\nRJSEHjm/bq2lNlKr527mJLi0mEk3qNexwoEHmZfxdfKhT1cyhuRAVlSxtUe5Zv1U\n0KfuIqaHogRGLpJokkVUEui1QP8/b/alRB21U552aGCt+DkOa43aCMRwAMNkAe6J\nnkGHUZIbAgMBAAECgf99FS8dWNP/fvgqyKBlowo68BYWY42m331cRPWuGDtd7xVg\nBdJeEE05XHSZug/S7dp++XMER6kUN0rwrlhBOutYvMsBaoKlzn4LMZ8AN2IXrG0w\nGTH1N5w4oSUBlIogikQbSjgU3X701ROm0Lyn67Nf+RvCXP/fwfGIyXV73HBXAYH/\nZofxuIXPRsef+k7bJQxVxFREhPjv2QSRWi0VNBVXC1dCuB6YqBWWdVf7D5M9gTYq\no8SIuS4V2w15dwiLiLdhFqU+OtUKHLm3bycgL8CuEEm1vFThJjPqsypZ/iDv2TP0\nYuRT05V8xtJKsGOjLMmB35QfgMPH8o1nBPYMoT0CgYEA2wyxPFwFroqap5deb4vT\ncSHiUMJK3GinFWNEcmY8YWRkjQMETwwDtGQa0ROxvqPcvlr4akv7SGzWfQn0m2G6\nolCYk8bDpFqdRrICm/wZ43hYCbyEl2UQ06/FjI5mHWk2GcoZ4kCKIJ10Ztla03qd\noboPSl3jzDEHMNfGaA1nDw8CgYEA1+0sk82Y8JhvG3UdhIYxs6plUrTgRuu61cwO\nUzPVWGodOfo2Nk8sHLqD1oNj+7smb6jLqbghX11YcAsPeRYC/Q1TM/71k0WKdszN\neUU09AApELpDbSA6SSS0sFn9tHPCq0glSgVM6ycdstRhasjicH34QXtilNrHlxMd\neU9NTDUCgYBs8C4A178Xo+TwLi6QCRkZ7YERKt9yKDXYRCsZPdEPmo8LNhHhghch\nkptnmYTPS80PekyLCMiqpz4wp0/YKs1Xxf9rlvFbfpkzPHphuwng/8vA49mJNYEd\n1g/ILFWKkPWP89vVksVfHQ9zyusJu7RDZzYNhQ4yUbvCxbztqKS1bwKBgFliy4Nc\nJyXiVIxvTQrhao3PyiYUzotNZoi+8mcrG/R/6R1pISwWVlKGO7F/rtI0xVKP88+M\nc/RAdi3bxkn//Li43Wq27v5KWWmYmq7LIYKo1lcgZG02XCqPUWV3u3kKOtohAZ7E\n1vS5uqefF7zW8DZVT4H8C/FHKDy4Iwlm9L7JAoGARJWfuPmp8UG5TxzLhgZlFgiO\nTLlixgsJLo1bfU3lyvLKcMUuXlIU8RYa0oveSc1EDhaGKpWZSGH/ZSrM3fxSWFEj\naUlwv4YV1OmxFCLH/1Cjd8fhBOfdO8uqt466hBmp4vIdtR9WNNlXN7t2DheyVSYf\nIBY6al0ww2TNbUlUWPQ=\n-----END PRIVATE KEY-----\n',
  'client_email': 'firebase-adminsdk-wxsr2@dx-workplace.iam.gserviceaccount.com',
  'client_id': '106351610852955863965',
  'auth_uri': 'https://accounts.google.com/o/oauth2/auth',
  'token_uri': 'https://oauth2.googleapis.com/token',
  'auth_provider_x509_cert_url': 'https://www.googleapis.com/oauth2/v1/certs',
  'client_x509_cert_url': 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-wxsr2%40dx-workplace.iam.gserviceaccount.com'
}

const FIREBASE_ADMIN = () => {
    return firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: 'https://dx-workplace.firebaseio.com',
  });
}

module.exports = {
    FIREBASE_ADMIN
}
