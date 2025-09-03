const setTokenCookie = (res, refreshToken) => {
  res.cookie('resToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export default setTokenCookie;
