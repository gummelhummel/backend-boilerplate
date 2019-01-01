import UserService from './service-user';

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
    addCollection: (name, cb) => {
      UserService.request({
        url: `/api/data/${name}`,
        method: "POST",
        data: {
          hey: "data"
        }
      }).then(cb);
    }
  };
