const moment = require('moment')

export function dateDiff(start, end) {
  return moment(end).diff(moment(start), 'days') + 1
}

export function popup_emit(event) {
  var vm = this;
  var args = toArray(arguments, 1);

  while (vm && vm != null) {
    var cbs = vm._events[event];

    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;

      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          var result = cbs[i].apply(vm, args);

          // если обработчик вернет false, то сразу останавливаем обработку событий
          if (result === false) {
            return this;
          }

        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    vm = vm.$parent;
  }
  return this;

  function toArray(list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }
};

export const dictionary = {
  "auth/user-not-found": "Пользователь с такими данными не найден",
  "auth/wrong-password": "Пользователь с такими данными не найден",
  "auth/email-already-in-use": "Пользователь с таким email существует",
  "auth/too-many-requests": "Слишком рано, попробуйте позднее"
}