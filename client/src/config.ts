// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'oqgog0nqla'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
// export const apiEndpoint = "http://localhost:3003/dev"

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  domain: 'dev-zr84h7r2.us.auth0.com',            // Auth0 domain
  clientId: '5kYSSleoQsCNogSoDEDivoQM8r9qT5e6',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
