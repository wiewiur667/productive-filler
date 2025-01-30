module.exports = {
  apps : [{
    name: 'productive_service',
    script: './dist/index.js'
  }]
};


// export default {
//   apps: [
//     {
//       name: 'productive_service',
//       script: './dist/index.js',
//       env_production: {
//         'PRODUCTIVE_API_TOKEN':'c623831b-8428-4c58-951a-256ce531bc25',
//         'PRODUCTIVE_ORGANIZATION_ID':4506,
//         'PRODUCTIVE_PERSON_ID':184575
//       },
//       env_development: {
//         'PRODUCTIVE_API_TOKEN':'c623831b-8428-4c58-951a-256ce531bc25',
//         'PRODUCTIVE_ORGANIZATION_ID':4506,
//         'PRODUCTIVE_PERSON_ID':184575
//       }
//     }
//   ]
// };
