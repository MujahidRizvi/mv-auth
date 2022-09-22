import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
  const authToken = req.cookies.token;

  if (!authToken) {
    throw new Error('Not authenticated.');
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(authToken, process.env.JWT_TOKEN_KEY);
  } catch (err) {
    throw new Error('Not authenticated.');
  }
  // if (!decodedToken) {
  //   throw new Error('Not authenticated.');
  // }
  req.userId = decodedToken.userId;
  next();
};

export default isAuthenticated;
