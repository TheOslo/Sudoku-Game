const adminBasicAuth = (req, res, next) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
  
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
      return next();
    }
  
    res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
    res.status(401).send('Authentication required.');
};

module.exports = adminBasicAuth