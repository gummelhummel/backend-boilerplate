
import m from 'mithril';
import tagl from 'tagl-mithril';
import UserService from '../services/user';
import dataService from '../services/data';

const {h1,ol,li,form,formfield,a} = tagl(m);

let collections = [];
let newCollectionName = "";

let update = () => dataService.listCollections(l => (collections = l));

update();


export default{
    view(vnode) {
      return [
        h1("Collections"),
        ol(collections.map(e => li(e))),
        UserService.loggedIn()
          ? form(
              formfield(
                input({
                  value: newCollectionName,
                  oninput: m.withAttr("value", v => (newCollectionName = v))
                }),
                a.button(
                  {
                    onclick: () =>
                      dataService.addCollection(newCollectionName, update)
                  },
                  "+"
                )
              )
            )
          : null
      ];
    }
  }