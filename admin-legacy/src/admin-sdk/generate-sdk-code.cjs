const fs = require('fs')
const axios = require('axios')
const dotenv = require('dotenv')
const exec = require('child-process-promise').exec

dotenv.config({ path: './.env' })

const gateway = process.argv[2]
const key = `${gateway.toUpperCase()}_API_GTW_URL`
console.log({ key })
const baseURL = (process.env[key] ||  process.env.REACT_APP_ADMIN_GATEWAY_URL)+'/gateways/'+gateway
if (!baseURL) {
    console.log('baseUrl not found')
    process.exit()
}
console.log({ baseURL })
const sdk = axios.create({ baseURL  })

const fetch = async () => {
    console.log({ gateway })

    const response = await sdk.get('/api/docs-json')

    const swaggerJsonFilePath = `src/admin-sdk/open-api-spec.${gateway}.json`
    // fs.writeFileSync(swaggerJsonFilePath, JSON.stringify(response.data))

    const outputFolder = `src/admin-sdk/${gateway}`
    exec(
        `./node_modules/.bin/openapi --input ${swaggerJsonFilePath} --output ${outputFolder} --postfixServices 'API' --client axios`
    )
}

fetch()
