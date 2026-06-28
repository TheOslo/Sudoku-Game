const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  
  if (
    username !== process.env.ADMIN_USER || 
    password !== process.env.ADMIN_PASS
  ) {
    return res.status(401).json({ 
      success: false, 
      msg: 'Invalid admin credentials' 
    });
  }

  const token = jwt.sign(
    { role: 'admin' }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );

  return res.status(200).json({ 
    success: true, 
    token 
  });
};

module.exports = { loginAdmin };