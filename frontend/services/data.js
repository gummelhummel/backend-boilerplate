import UserService from "./user";

export default {
  listCollection: (collection, cb) => {
    UserService.request({ url: `/api/data/${collection}` }).then(cb);
  },
  listCollections: cb => {
    UserService.request({ url: "/api/data" }).then(cb);
  },
  get: (collection, id, cb) => {
    UserService.request({ url: `/api/data/${collection}/${id}` }).then(cb);
  },
  create: (collection, id, data, cb) => {
    UserService.request({
      url: `/api/data/${collection}`,
      method: "POST"
    }).then(cb);
  },
  delete: (collection, id, cb) => {
    UserService.request({
      url: `/api/${collection}/${id}`,
      method: "DELETE"
    }).then(cb || (() => {}));
  },
  save: (collection, id, data, cb) => {
    UserService.request({
      url: `/api/data/${collection}/${id}`,
      method: "PUT",
      data
    }).then(cb);
  },
  addCollection: (name, cb) => {
    UserService.request({
      url: `/api/data/${name}`,
      method: "POST",
      data: {
        hey: "data"
      }
    }).then(cb);
  },
  search: (collection, search, cb) =>
    UserService.request({
      url: `/api/data/search/${collection}`,
      method: "POST",
      data: search
    }).then(cb),
};
