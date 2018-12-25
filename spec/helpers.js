const got = require("got");
const faker = require("faker");
const api = require("..");

const PORT = process.env.PORT || 3000;

async function queryApi(method, resource, options) {
  const customOptions = Object.assign({}, options, { json: true, method });
  let response;
  try {
    response = await got(`http://localhost:${PORT}${resource}`, customOptions);
  } catch (error) {
    response = error.response;
  }
  return response;
}

function startApi() {
  let server;

  before(done => {
    api().then(app => {
      server = app.listen(PORT, done);
    });
  });

  after(() => {
    server.close();
  });
}

async function login() {
  let {body} = await queryApi('POST',"/api/users/session", {body:{username: 'gonto', password:'gonto'}});  
  return body;
}

async function addProduct(data) {
  const defaultProduct = {
    name: faker.commerce.product(),
    price: faker.finance.amount(),
    weight: faker.random.number()
  };
  const body = Object.assign(defaultProduct, data);  
  const token = await login();
  return await queryApi("POST", "/api/data/products", { body, headers: {'Authorization': 'Bearer ' + token.access_token }});
}


async function deleteAllData (){
  return await queryApi("DELETE", "/api/data");
}

module.exports = {
  queryApi,
  testUtils: {
    startApi,
    addProduct,
    deleteAllData  
  }
};
