import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJPFjNU9LVVlIIMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi16cjg0aDdyMi51cy5hdXRoMC5jb20wHhcNMjIwOTE1MTQyNzU4WhcN
MzYwNTI0MTQyNzU4WjAkMSIwIAYDVQQDExlkZXYtenI4NGg3cjIudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5YjZRHSzQlPGyV0C
Yhi8Fz0TD/uINNO/HoE2WSAwB8cBOLwRgEe8G5vMpezecGzqGbQn2Fege4XGhxBh
4biHy1LPoPQPABfirNKXJwg9wF72bSo7RPoKp5JZ1lzA2z1QAKrFJrSn84lQtt0B
XaqNfmBaprzRAFpXzsJ6uFkIDWEE07zwLCRU1WumCzxSiyGbhy3HiqgocvuNqTOG
CLQO646uoVx1IgTBTwElFLsWQQFecB4HPFDpwhhdUPRqhlB7PmFWJL+2acvrVHyC
mrqkrM2+oGwtS2qiThXP2Y/6PVvHgC4LQaRPTJjRUU9o7uUDZ0kM5hiMihRdDss2
Q+lErwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQ5CWCpmsww
2Gini9bQzax7FARZCzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AEqqNu4a5+h0STrs3ru2jmrtpeFiiIotm/kh/i/lh67VTRLlm6joI0byJvGBPVz2
zg7o35u4J+LkidVc7fwcS+l+9VClt6KsNDhFcw7PACfchsOgMDneAY8KFjyP2cqg
IbDeVW8VMx0bN/MUXqfYpJ0/TLT2yDqLfehmWKyQqTJs7JxoFeTZuJfQurrwQpmd
Dl4gn239qVaGOSxPEF1QlHu0VkekG3tfdRkIQJEIBGYBMS2Gxtx9rj6iYe5ihJ9M
mXMRnnhC9iXm1mFqOM572qJAn5j2ws4NjJ1iMhp4ARwcNPJzoFQUxDrx2IWE574S
bLE+NDU+3vxbBOqldQ4SCh4=
-----END CERTIFICATE-----`;

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-zr84h7r2.us.auth0.com/.well-known/jwks.json'

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)

  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      // principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }

}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
// async function verifyToken(authHeader: string) {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/


  // if(token !== '123'){
  //     throw new Error('Invalid token');
  // }

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload;
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
