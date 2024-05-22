import jwt, { type JwtHeader, type SigningKeyCallback } from 'jsonwebtoken';
import jwksClient, { JwksClient } from 'jwks-rsa';

const AUTH0_DOMAIN = 'jconnect.eu.auth0.com';
const API_IDENTIFIER = 'https://api.auth0.jconnect.cloud';

const client: JwksClient = jwksClient({
  jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});

interface DecodedJwtPayload extends jwt.JwtPayload {
  scope: string;
}

function getKey(header: JwtHeader, callback: SigningKeyCallback): void {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, undefined);
    } else {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    }
  });
}

export default function validateAccessToken(token: string): Promise<DecodedJwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, {
      audience: API_IDENTIFIER,
      issuer: `https://${AUTH0_DOMAIN}/`,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) {
        return reject(`Token validation failed: ${err.message}`);
      }

      const decodedPayload = decoded as DecodedJwtPayload;
      const requiredScopes = ['openid', 'profile', 'read:profile_picture'];
      const tokenScopes = decodedPayload.scope ? decodedPayload.scope.split(' ') : [];

      const hasRequiredScopes = requiredScopes.every(scope => tokenScopes.includes(scope));

      if (!hasRequiredScopes) {
        return reject('Token does not have the required permissions (scopes).');
      }

      resolve(decodedPayload);
    });
  });
}
