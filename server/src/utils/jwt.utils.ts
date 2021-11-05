import jwt from 'jsonwebtoken';

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, process.env.PRIVATE_KEY!.replace(/\\n/gm, '\n'), {
    ...(options && options),
    algorithm: 'RS256',
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.PUBLIC_KEY!.replace(/\\n/gm, '\n')
    );
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decoded: null,
    };
  }
}
