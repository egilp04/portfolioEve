var Zf = Object.defineProperty,
  Yf = Object.defineProperties;
var Qf = Object.getOwnPropertyDescriptors;
var oc = Object.getOwnPropertySymbols;
var Kf = Object.prototype.hasOwnProperty,
  Jf = Object.prototype.propertyIsEnumerable;
var ic = (e, t, n) =>
    t in e
      ? Zf(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  R = (e, t) => {
    for (var n in (t ||= {})) Kf.call(t, n) && ic(e, n, t[n]);
    if (oc) for (var n of oc(t)) Jf.call(t, n) && ic(e, n, t[n]);
    return e;
  },
  G = (e, t) => Yf(e, Qf(t));
var mr = (e, t, n) =>
  new Promise((r, o) => {
    var i = (c) => {
        try {
          a(n.next(c));
        } catch (u) {
          o(u);
        }
      },
      s = (c) => {
        try {
          a(n.throw(c));
        } catch (u) {
          o(u);
        }
      },
      a = (c) => (c.done ? r(c.value) : Promise.resolve(c.value).then(i, s));
    a((n = n.apply(e, t)).next());
  });
function sc(e, t) {
  return Object.is(e, t);
}
var q = null,
  yr = !1,
  vr = 1,
  tt = Symbol("SIGNAL");
function x(e) {
  let t = q;
  return (q = e), t;
}
function ac() {
  return q;
}
var bn = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function xi(e) {
  if (yr) throw new Error("");
  if (q === null) return;
  q.consumerOnSignalRead(e);
  let t = q.nextProducerIndex++;
  if ((Er(q), t < q.producerNode.length && q.producerNode[t] !== e && En(q))) {
    let n = q.producerNode[t];
    wr(n, q.producerIndexOfThis[t]);
  }
  q.producerNode[t] !== e &&
    ((q.producerNode[t] = e),
    (q.producerIndexOfThis[t] = En(q) ? dc(e, q, t) : 0)),
    (q.producerLastReadVersion[t] = e.version);
}
function Xf() {
  vr++;
}
function cc(e) {
  if (!(En(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === vr)) {
    if (!e.producerMustRecompute(e) && !Ni(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = vr);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = vr);
  }
}
function uc(e) {
  if (e.liveConsumerNode === void 0) return;
  let t = yr;
  yr = !0;
  try {
    for (let n of e.liveConsumerNode) n.dirty || eh(n);
  } finally {
    yr = t;
  }
}
function lc() {
  return q?.consumerAllowSignalWrites !== !1;
}
function eh(e) {
  (e.dirty = !0), uc(e), e.consumerMarkedDirty?.(e);
}
function Cr(e) {
  return e && (e.nextProducerIndex = 0), x(e);
}
function Si(e, t) {
  if (
    (x(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (En(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        wr(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function Ni(e) {
  Er(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (cc(n), r !== n.version)) return !0;
  }
  return !1;
}
function Ai(e) {
  if ((Er(e), En(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      wr(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function dc(e, t, n) {
  if ((fc(e), e.liveConsumerNode.length === 0 && hc(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      e.producerIndexOfThis[r] = dc(e.producerNode[r], e, r);
  return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1;
}
function wr(e, t) {
  if ((fc(e), e.liveConsumerNode.length === 1 && hc(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      wr(e.producerNode[r], e.producerIndexOfThis[r]);
  let n = e.liveConsumerNode.length - 1;
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t];
    Er(o), (o.producerIndexOfThis[r] = t);
  }
}
function En(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function Er(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function fc(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function hc(e) {
  return e.producerNode !== void 0;
}
function pc(e) {
  let t = Object.create(th);
  t.computation = e;
  let n = () => {
    if ((cc(t), xi(t), t.value === Dr)) throw t.error;
    return t.value;
  };
  return (n[tt] = t), n;
}
var Mi = Symbol("UNSET"),
  Ti = Symbol("COMPUTING"),
  Dr = Symbol("ERRORED"),
  th = G(R({}, bn), {
    value: Mi,
    dirty: !0,
    error: null,
    equal: sc,
    producerMustRecompute(e) {
      return e.value === Mi || e.value === Ti;
    },
    producerRecomputeValue(e) {
      if (e.value === Ti) throw new Error("Detected cycle in computations.");
      let t = e.value;
      e.value = Ti;
      let n = Cr(e),
        r;
      try {
        r = e.computation();
      } catch (o) {
        (r = Dr), (e.error = o);
      } finally {
        Si(e, n);
      }
      if (t !== Mi && t !== Dr && r !== Dr && e.equal(t, r)) {
        e.value = t;
        return;
      }
      (e.value = r), e.version++;
    },
  });
function nh() {
  throw new Error();
}
var gc = nh;
function mc() {
  gc();
}
function yc(e) {
  gc = e;
}
var rh = null;
function vc(e) {
  let t = Object.create(Cc);
  t.value = e;
  let n = () => (xi(t), t.value);
  return (n[tt] = t), n;
}
function Oi(e, t) {
  lc() || mc(), e.equal(e.value, t) || ((e.value = t), oh(e));
}
function Dc(e, t) {
  lc() || mc(), Oi(e, t(e.value));
}
var Cc = G(R({}, bn), { equal: sc, value: void 0 });
function oh(e) {
  e.version++, Xf(), uc(e), rh?.();
}
function _(e) {
  return typeof e == "function";
}
function br(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var _r = br(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ""),
        (this.name = "UnsubscriptionError"),
        (this.errors = n);
    }
);
function _n(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var se = class e {
  constructor(t) {
    (this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null);
  }
  unsubscribe() {
    let t;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: n } = this;
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this);
        else n.remove(this);
      let { initialTeardown: r } = this;
      if (_(r))
        try {
          r();
        } catch (i) {
          t = i instanceof _r ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            wc(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof _r ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new _r(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) wc(t);
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return;
          t._addParent(this);
        }
        (this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this;
    return n === t || (Array.isArray(n) && n.includes(t));
  }
  _addParent(t) {
    let { _parentage: n } = this;
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
  }
  _removeParent(t) {
    let { _parentage: n } = this;
    n === t ? (this._parentage = null) : Array.isArray(n) && _n(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && _n(n, t), t instanceof e && t._removeParent(this);
  }
};
se.EMPTY = (() => {
  let e = new se();
  return (e.closed = !0), e;
})();
var Fi = se.EMPTY;
function Ir(e) {
  return (
    e instanceof se ||
    (e && "closed" in e && _(e.remove) && _(e.add) && _(e.unsubscribe))
  );
}
function wc(e) {
  _(e) ? e() : e.unsubscribe();
}
var be = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Vt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = Vt;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = Vt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Mr(e) {
  Vt.setTimeout(() => {
    let { onUnhandledError: t } = be;
    if (t) t(e);
    else throw e;
  });
}
function Ri() {}
var Ec = Pi("C", void 0, void 0);
function bc(e) {
  return Pi("E", void 0, e);
}
function _c(e) {
  return Pi("N", e, void 0);
}
function Pi(e, t, n) {
  return { kind: e, value: t, error: n };
}
var wt = null;
function jt(e) {
  if (be.useDeprecatedSynchronousErrorHandling) {
    let t = !wt;
    if ((t && (wt = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = wt;
      if (((wt = null), n)) throw r;
    }
  } else e();
}
function Ic(e) {
  be.useDeprecatedSynchronousErrorHandling &&
    wt &&
    ((wt.errorThrown = !0), (wt.error = e));
}
var Et = class extends se {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Ir(t) && t.add(this))
          : (this.destination = ah);
    }
    static create(t, n, r) {
      return new Be(t, n, r);
    }
    next(t) {
      this.isStopped ? Li(_c(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? Li(bc(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? Li(Ec, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(t) {
      this.destination.next(t);
    }
    _error(t) {
      try {
        this.destination.error(t);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  ih = Function.prototype.bind;
function ki(e, t) {
  return ih.call(e, t);
}
var Vi = class {
    constructor(t) {
      this.partialObserver = t;
    }
    next(t) {
      let { partialObserver: n } = this;
      if (n.next)
        try {
          n.next(t);
        } catch (r) {
          Tr(r);
        }
    }
    error(t) {
      let { partialObserver: n } = this;
      if (n.error)
        try {
          n.error(t);
        } catch (r) {
          Tr(r);
        }
      else Tr(t);
    }
    complete() {
      let { partialObserver: t } = this;
      if (t.complete)
        try {
          t.complete();
        } catch (n) {
          Tr(n);
        }
    }
  },
  Be = class extends Et {
    constructor(t, n, r) {
      super();
      let o;
      if (_(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && be.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && ki(t.next, i),
              error: t.error && ki(t.error, i),
              complete: t.complete && ki(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new Vi(o);
    }
  };
function Tr(e) {
  be.useDeprecatedSynchronousErrorHandling ? Ic(e) : Mr(e);
}
function sh(e) {
  throw e;
}
function Li(e, t) {
  let { onStoppedNotification: n } = be;
  n && Vt.setTimeout(() => n(e, t));
}
var ah = { closed: !0, next: Ri, error: sh, complete: Ri };
var Bt = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function xr(e) {
  return e;
}
function Mc(e) {
  return e.length === 0
    ? xr
    : e.length === 1
    ? e[0]
    : function (n) {
        return e.reduce((r, o) => o(r), n);
      };
}
var P = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n);
    }
    lift(n) {
      let r = new e();
      return (r.source = this), (r.operator = n), r;
    }
    subscribe(n, r, o) {
      let i = uh(n) ? n : new Be(n, r, o);
      return (
        jt(() => {
          let { operator: s, source: a } = this;
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          );
        }),
        i
      );
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n);
      } catch (r) {
        n.error(r);
      }
    }
    forEach(n, r) {
      return (
        (r = Tc(r)),
        new r((o, i) => {
          let s = new Be({
            next: (a) => {
              try {
                n(a);
              } catch (c) {
                i(c), s.unsubscribe();
              }
            },
            error: i,
            complete: o,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(n) {
      var r;
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n);
    }
    [Bt]() {
      return this;
    }
    pipe(...n) {
      return Mc(n)(this);
    }
    toPromise(n) {
      return (
        (n = Tc(n)),
        new n((r, o) => {
          let i;
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i)
          );
        })
      );
    }
  }
  return (e.create = (t) => new e(t)), e;
})();
function Tc(e) {
  var t;
  return (t = e ?? be.Promise) !== null && t !== void 0 ? t : Promise;
}
function ch(e) {
  return e && _(e.next) && _(e.error) && _(e.complete);
}
function uh(e) {
  return (e && e instanceof Et) || (ch(e) && Ir(e));
}
function lh(e) {
  return _(e?.lift);
}
function Y(e) {
  return (t) => {
    if (lh(t))
      return t.lift(function (n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
    throw new TypeError("Unable to lift unknown Observable type");
  };
}
function ne(e, t, n, r, o) {
  return new ji(e, t, n, r, o);
}
var ji = class extends Et {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a);
            } catch (c) {
              t.error(c);
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a);
            } catch (c) {
              t.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r();
            } catch (a) {
              t.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var t;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this;
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
    }
  }
};
var xc = br(
  (e) =>
    function () {
      e(this),
        (this.name = "ObjectUnsubscribedError"),
        (this.message = "object unsubscribed");
    }
);
var Q = (() => {
    class e extends P {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(n) {
        let r = new Sr(this, this);
        return (r.operator = n), r;
      }
      _throwIfClosed() {
        if (this.closed) throw new xc();
      }
      next(n) {
        jt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        jt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        jt(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: n } = this;
            for (; n.length; ) n.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null);
      }
      get observed() {
        var n;
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        );
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n);
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        );
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: o, observers: i } = this;
        return r || o
          ? Fi
          : ((this.currentObservers = null),
            i.push(n),
            new se(() => {
              (this.currentObservers = null), _n(i, n);
            }));
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this;
        r ? n.error(o) : i && n.complete();
      }
      asObservable() {
        let n = new P();
        return (n.source = this), n;
      }
    }
    return (e.create = (t, n) => new Sr(t, n)), e;
  })(),
  Sr = class extends Q {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n);
    }
    next(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    error(t) {
      var n, r;
      (r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t);
    }
    complete() {
      var t, n;
      (n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t);
    }
    _subscribe(t) {
      var n, r;
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : Fi;
    }
  };
var In = class extends Q {
  constructor(t) {
    super(), (this._value = t);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(t) {
    let n = super._subscribe(t);
    return !n.closed && t.next(this._value), n;
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this;
    if (t) throw n;
    return this._throwIfClosed(), r;
  }
  next(t) {
    super.next((this._value = t));
  }
};
var Bi = {
  now() {
    return (Bi.delegate || Date).now();
  },
  delegate: void 0,
};
var Nr = class extends Q {
  constructor(t = 1 / 0, n = 1 / 0, r = Bi) {
    super(),
      (this._bufferSize = t),
      (this._windowTime = n),
      (this._timestampProvider = r),
      (this._buffer = []),
      (this._infiniteTimeWindow = !0),
      (this._infiniteTimeWindow = n === 1 / 0),
      (this._bufferSize = Math.max(1, t)),
      (this._windowTime = Math.max(1, n));
  }
  next(t) {
    let {
      isStopped: n,
      _buffer: r,
      _infiniteTimeWindow: o,
      _timestampProvider: i,
      _windowTime: s,
    } = this;
    n || (r.push(t), !o && r.push(i.now() + s)),
      this._trimBuffer(),
      super.next(t);
  }
  _subscribe(t) {
    this._throwIfClosed(), this._trimBuffer();
    let n = this._innerSubscribe(t),
      { _infiniteTimeWindow: r, _buffer: o } = this,
      i = o.slice();
    for (let s = 0; s < i.length && !t.closed; s += r ? 1 : 2) t.next(i[s]);
    return this._checkFinalizedStatuses(t), n;
  }
  _trimBuffer() {
    let {
        _bufferSize: t,
        _timestampProvider: n,
        _buffer: r,
        _infiniteTimeWindow: o,
      } = this,
      i = (o ? 1 : 2) * t;
    if ((t < 1 / 0 && i < r.length && r.splice(0, r.length - i), !o)) {
      let s = n.now(),
        a = 0;
      for (let c = 1; c < r.length && r[c] <= s; c += 2) a = c;
      a && r.splice(0, a + 1);
    }
  }
};
var Sc = new P((e) => e.complete());
function Nc(e) {
  return e && _(e.schedule);
}
function Ac(e) {
  return e[e.length - 1];
}
function Oc(e) {
  return _(Ac(e)) ? e.pop() : void 0;
}
function Ar(e) {
  return Nc(Ac(e)) ? e.pop() : void 0;
}
function Rc(e, t, n, r) {
  function o(i) {
    return i instanceof n
      ? i
      : new n(function (s) {
          s(i);
        });
  }
  return new (n || (n = Promise))(function (i, s) {
    function a(l) {
      try {
        u(r.next(l));
      } catch (d) {
        s(d);
      }
    }
    function c(l) {
      try {
        u(r.throw(l));
      } catch (d) {
        s(d);
      }
    }
    function u(l) {
      l.done ? i(l.value) : o(l.value).then(a, c);
    }
    u((r = r.apply(e, t || [])).next());
  });
}
function Fc(e) {
  var t = typeof Symbol == "function" && Symbol.iterator,
    n = t && e[t],
    r = 0;
  if (n) return n.call(e);
  if (e && typeof e.length == "number")
    return {
      next: function () {
        return (
          e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }
        );
      },
    };
  throw new TypeError(
    t ? "Object is not iterable." : "Symbol.iterator is not defined."
  );
}
function bt(e) {
  return this instanceof bt ? ((this.v = e), this) : new bt(e);
}
function Pc(e, t, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = n.apply(e, t || []),
    o,
    i = [];
  return (
    (o = Object.create(
      (typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype
    )),
    a("next"),
    a("throw"),
    a("return", s),
    (o[Symbol.asyncIterator] = function () {
      return this;
    }),
    o
  );
  function s(f) {
    return function (p) {
      return Promise.resolve(p).then(f, d);
    };
  }
  function a(f, p) {
    r[f] &&
      ((o[f] = function (g) {
        return new Promise(function (D, w) {
          i.push([f, g, D, w]) > 1 || c(f, g);
        });
      }),
      p && (o[f] = p(o[f])));
  }
  function c(f, p) {
    try {
      u(r[f](p));
    } catch (g) {
      h(i[0][3], g);
    }
  }
  function u(f) {
    f.value instanceof bt
      ? Promise.resolve(f.value.v).then(l, d)
      : h(i[0][2], f);
  }
  function l(f) {
    c("next", f);
  }
  function d(f) {
    c("throw", f);
  }
  function h(f, p) {
    f(p), i.shift(), i.length && c(i[0][0], i[0][1]);
  }
}
function kc(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Fc == "function" ? Fc(e) : e[Symbol.iterator]()),
      (n = {}),
      r("next"),
      r("throw"),
      r("return"),
      (n[Symbol.asyncIterator] = function () {
        return this;
      }),
      n);
  function r(i) {
    n[i] =
      e[i] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = e[i](s)), o(a, c, s.done, s.value);
        });
      };
  }
  function o(i, s, a, c) {
    Promise.resolve(c).then(function (u) {
      i({ value: u, done: a });
    }, s);
  }
}
var Or = (e) => e && typeof e.length == "number" && typeof e != "function";
function Fr(e) {
  return _(e?.then);
}
function Rr(e) {
  return _(e[Bt]);
}
function Pr(e) {
  return Symbol.asyncIterator && _(e?.[Symbol.asyncIterator]);
}
function kr(e) {
  return new TypeError(
    `You provided ${
      e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function dh() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Lr = dh();
function Vr(e) {
  return _(e?.[Lr]);
}
function jr(e) {
  return Pc(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield bt(n.read());
        if (o) return yield bt(void 0);
        yield yield bt(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Br(e) {
  return _(e?.getReader);
}
function Z(e) {
  if (e instanceof P) return e;
  if (e != null) {
    if (Rr(e)) return fh(e);
    if (Or(e)) return hh(e);
    if (Fr(e)) return ph(e);
    if (Pr(e)) return Lc(e);
    if (Vr(e)) return gh(e);
    if (Br(e)) return mh(e);
  }
  throw kr(e);
}
function fh(e) {
  return new P((t) => {
    let n = e[Bt]();
    if (_(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function hh(e) {
  return new P((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function ph(e) {
  return new P((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n)
    ).then(null, Mr);
  });
}
function gh(e) {
  return new P((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function Lc(e) {
  return new P((t) => {
    yh(e, t).catch((n) => t.error(n));
  });
}
function mh(e) {
  return Lc(jr(e));
}
function yh(e, t) {
  var n, r, o, i;
  return Rc(this, void 0, void 0, function* () {
    try {
      for (n = kc(e); (r = yield n.next()), !r.done; ) {
        let s = r.value;
        if ((t.next(s), t.closed)) return;
      }
    } catch (s) {
      o = { error: s };
    } finally {
      try {
        r && !r.done && (i = n.return) && (yield i.call(n));
      } finally {
        if (o) throw o.error;
      }
    }
    t.complete();
  });
}
function pe(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function $r(e, t = 0) {
  return Y((n, r) => {
    n.subscribe(
      ne(
        r,
        (o) => pe(r, e, () => r.next(o), t),
        () => pe(r, e, () => r.complete(), t),
        (o) => pe(r, e, () => r.error(o), t)
      )
    );
  });
}
function Ur(e, t = 0) {
  return Y((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function Vc(e, t) {
  return Z(e).pipe(Ur(t), $r(t));
}
function jc(e, t) {
  return Z(e).pipe(Ur(t), $r(t));
}
function Bc(e, t) {
  return new P((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function $c(e, t) {
  return new P((n) => {
    let r;
    return (
      pe(n, t, () => {
        (r = e[Lr]()),
          pe(
            n,
            t,
            () => {
              let o, i;
              try {
                ({ value: o, done: i } = r.next());
              } catch (s) {
                n.error(s);
                return;
              }
              i ? n.complete() : n.next(o);
            },
            0,
            !0
          );
      }),
      () => _(r?.return) && r.return()
    );
  });
}
function Hr(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new P((n) => {
    pe(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      pe(
        n,
        t,
        () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        },
        0,
        !0
      );
    });
  });
}
function Uc(e, t) {
  return Hr(jr(e), t);
}
function Hc(e, t) {
  if (e != null) {
    if (Rr(e)) return Vc(e, t);
    if (Or(e)) return Bc(e, t);
    if (Fr(e)) return jc(e, t);
    if (Pr(e)) return Hr(e, t);
    if (Vr(e)) return $c(e, t);
    if (Br(e)) return Uc(e, t);
  }
  throw kr(e);
}
function $e(e, t) {
  return t ? Hc(e, t) : Z(e);
}
function Ue(...e) {
  let t = Ar(e);
  return $e(e, t);
}
function nt(e) {
  return !!e && (e instanceof P || (_(e.lift) && _(e.subscribe)));
}
function te(e, t) {
  return Y((n, r) => {
    let o = 0;
    n.subscribe(
      ne(r, (i) => {
        r.next(e.call(t, i, o++));
      })
    );
  });
}
var { isArray: vh } = Array;
function Dh(e, t) {
  return vh(t) ? e(...t) : e(t);
}
function Gc(e) {
  return te((t) => Dh(e, t));
}
var { isArray: Ch } = Array,
  { getPrototypeOf: wh, prototype: Eh, keys: bh } = Object;
function zc(e) {
  if (e.length === 1) {
    let t = e[0];
    if (Ch(t)) return { args: t, keys: null };
    if (_h(t)) {
      let n = bh(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function _h(e) {
  return e && typeof e == "object" && wh(e) === Eh;
}
function Wc(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function qc(e, t, n, r, o, i, s, a) {
  let c = [],
    u = 0,
    l = 0,
    d = !1,
    h = () => {
      d && !c.length && !u && t.complete();
    },
    f = (g) => (u < r ? p(g) : c.push(g)),
    p = (g) => {
      i && t.next(g), u++;
      let D = !1;
      Z(n(g, l++)).subscribe(
        ne(
          t,
          (w) => {
            o?.(w), i ? f(w) : t.next(w);
          },
          () => {
            D = !0;
          },
          void 0,
          () => {
            if (D)
              try {
                for (u--; c.length && u < r; ) {
                  let w = c.shift();
                  s ? pe(t, s, () => p(w)) : p(w);
                }
                h();
              } catch (w) {
                t.error(w);
              }
          }
        )
      );
    };
  return (
    e.subscribe(
      ne(t, f, () => {
        (d = !0), h();
      })
    ),
    () => {
      a?.();
    }
  );
}
function $t(e, t, n = 1 / 0) {
  return _(t)
    ? $t((r, o) => te((i, s) => t(r, i, o, s))(Z(e(r, o))), n)
    : (typeof t == "number" && (n = t), Y((r, o) => qc(r, o, e, n)));
}
function Zc(e = 1 / 0) {
  return $t(xr, e);
}
function Yc() {
  return Zc(1);
}
function Gr(...e) {
  return Yc()($e(e, Ar(e)));
}
function zr(e) {
  return new P((t) => {
    Z(e()).subscribe(t);
  });
}
function Mn(...e) {
  let t = Oc(e),
    { args: n, keys: r } = zc(e),
    o = new P((i) => {
      let { length: s } = n;
      if (!s) {
        i.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        u = s;
      for (let l = 0; l < s; l++) {
        let d = !1;
        Z(n[l]).subscribe(
          ne(
            i,
            (h) => {
              d || ((d = !0), u--), (a[l] = h);
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (u || i.next(r ? Wc(r, a) : a), i.complete());
            }
          )
        );
      }
    });
  return t ? o.pipe(Gc(t)) : o;
}
function $i(e, t) {
  return Y((n, r) => {
    let o = 0;
    n.subscribe(ne(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function Tn(e, t) {
  return _(t) ? $t(e, t, 1) : $t(e, 1);
}
function Ut(e) {
  return e <= 0
    ? () => Sc
    : Y((t, n) => {
        let r = 0;
        t.subscribe(
          ne(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          })
        );
      });
}
function Ui(e) {
  return Y((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Qc(e = {}) {
  let {
    connector: t = () => new Q(),
    resetOnError: n = !0,
    resetOnComplete: r = !0,
    resetOnRefCountZero: o = !0,
  } = e;
  return (i) => {
    let s,
      a,
      c,
      u = 0,
      l = !1,
      d = !1,
      h = () => {
        a?.unsubscribe(), (a = void 0);
      },
      f = () => {
        h(), (s = c = void 0), (l = d = !1);
      },
      p = () => {
        let g = s;
        f(), g?.unsubscribe();
      };
    return Y((g, D) => {
      u++, !d && !l && h();
      let w = (c = c ?? t());
      D.add(() => {
        u--, u === 0 && !d && !l && (a = Hi(p, o));
      }),
        w.subscribe(D),
        !s &&
          u > 0 &&
          ((s = new Be({
            next: (F) => w.next(F),
            error: (F) => {
              (d = !0), h(), (a = Hi(f, n, F)), w.error(F);
            },
            complete: () => {
              (l = !0), h(), (a = Hi(f, r)), w.complete();
            },
          })),
          Z(g).subscribe(s));
    })(i);
  };
}
function Hi(e, t, ...n) {
  if (t === !0) {
    e();
    return;
  }
  if (t === !1) return;
  let r = new Be({
    next: () => {
      r.unsubscribe(), e();
    },
  });
  return Z(t(...n)).subscribe(r);
}
function Wr(e, t, n) {
  let r,
    o = !1;
  return (
    e && typeof e == "object"
      ? ({
          bufferSize: r = 1 / 0,
          windowTime: t = 1 / 0,
          refCount: o = !1,
          scheduler: n,
        } = e)
      : (r = e ?? 1 / 0),
    Qc({
      connector: () => new Nr(r, t, n),
      resetOnError: !0,
      resetOnComplete: !1,
      resetOnRefCountZero: o,
    })
  );
}
function Ht(e, t) {
  return Y((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      ne(
        r,
        (c) => {
          o?.unsubscribe();
          let u = 0,
            l = i++;
          Z(e(c, l)).subscribe(
            (o = ne(
              r,
              (d) => r.next(t ? t(c, d, l, u++) : d),
              () => {
                (o = null), a();
              }
            ))
          );
        },
        () => {
          (s = !0), a();
        }
      )
    );
  });
}
var Ou = "https://g.co/ng/security#xss",
  I = class extends Error {
    constructor(t, n) {
      super(wo(t, n)), (this.code = t);
    }
  };
function wo(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ": " + t : ""}`;
}
function Eo(e) {
  return { toString: e }.toString();
}
function j(e) {
  for (let t in e) if (e[t] === j) return t;
  throw Error("Could not find renamed property on target object.");
}
function Ih(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function me(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(me).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function Kc(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
    ? e
    : e + " " + t;
}
var Mh = j({ __forward_ref__: j });
function cn(e) {
  return (
    (e.__forward_ref__ = cn),
    (e.toString = function () {
      return me(this());
    }),
    e
  );
}
function ae(e) {
  return Fu(e) ? e() : e;
}
function Fu(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(Mh) && e.__forward_ref__ === cn
  );
}
function b(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  };
}
function qe(e) {
  return { providers: e.providers || [], imports: e.imports || [] };
}
function Zs(e) {
  return Jc(e, Ru) || Jc(e, Pu);
}
function Jc(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function Th(e) {
  let t = e && (e[Ru] || e[Pu]);
  return t || null;
}
function Xc(e) {
  return e && (e.hasOwnProperty(eu) || e.hasOwnProperty(xh)) ? e[eu] : null;
}
var Ru = j({ ɵprov: j }),
  eu = j({ ɵinj: j }),
  Pu = j({ ngInjectableDef: j }),
  xh = j({ ngInjectorDef: j }),
  C = class {
    constructor(t, n) {
      (this._desc = t),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = b({
              token: this,
              providedIn: n.providedIn || "root",
              factory: n.factory,
            }));
    }
    get multi() {
      return this;
    }
    toString() {
      return `InjectionToken ${this._desc}`;
    }
  };
function ku(e) {
  return e && !!e.ɵproviders;
}
var Sh = j({ ɵcmp: j }),
  Nh = j({ ɵdir: j }),
  Ah = j({ ɵpipe: j });
var to = j({ ɵfac: j }),
  Nn = j({ __NG_ELEMENT_ID__: j }),
  tu = j({ __NG_ENV_ID__: j });
function Ys(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Oh(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
    ? e.type.name || e.type.toString()
    : Ys(e);
}
function Fh(e, t) {
  let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new I(-200, e);
}
function Qs(e, t) {
  throw new I(-201, !1);
}
var A = (function (e) {
    return (
      (e[(e.Default = 0)] = "Default"),
      (e[(e.Host = 1)] = "Host"),
      (e[(e.Self = 2)] = "Self"),
      (e[(e.SkipSelf = 4)] = "SkipSelf"),
      (e[(e.Optional = 8)] = "Optional"),
      e
    );
  })(A || {}),
  rs;
function Lu() {
  return rs;
}
function ue(e) {
  let t = rs;
  return (rs = e), t;
}
function Vu(e, t, n) {
  let r = Zs(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & A.Optional) return null;
  if (t !== void 0) return t;
  Qs(e, "Injector");
}
var Rh = {},
  An = Rh,
  Ph = "__NG_DI_FLAG__",
  no = "ngTempTokenPath",
  kh = "ngTokenPath",
  Lh = /\n/gm,
  Vh = "\u0275",
  nu = "__source",
  qt;
function jh() {
  return qt;
}
function rt(e) {
  let t = qt;
  return (qt = e), t;
}
function Bh(e, t = A.Default) {
  if (qt === void 0) throw new I(-203, !1);
  return qt === null
    ? Vu(e, void 0, t)
    : qt.get(e, t & A.Optional ? null : void 0, t);
}
function T(e, t = A.Default) {
  return (Lu() || Bh)(ae(e), t);
}
function v(e, t = A.Default) {
  return T(e, bo(t));
}
function bo(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function os(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = ae(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new I(900, !1);
      let o,
        i = A.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = $h(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push(T(o, i));
    } else t.push(T(r));
  }
  return t;
}
function $h(e) {
  return e[Ph];
}
function Uh(e, t, n, r) {
  let o = e[no];
  throw (
    (t[nu] && o.unshift(t[nu]),
    (e.message = Hh(
      `
` + e.message,
      o,
      n,
      r
    )),
    (e[kh] = o),
    (e[no] = null),
    e)
  );
}
function Hh(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == Vh
      ? e.slice(2)
      : e;
  let o = me(t);
  if (Array.isArray(t)) o = t.map(me).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : me(a)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
    Lh,
    `
  `
  )}`;
}
function _t(e, t) {
  let n = e.hasOwnProperty(to);
  return n ? e[to] : null;
}
function Ks(e, t) {
  e.forEach((n) => (Array.isArray(n) ? Ks(n, t) : t(n)));
}
function Gh(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function ju(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function zh(e, t, n, r) {
  let o = e.length;
  if (o == t) e.push(n, r);
  else if (o === 1) e.push(r, e[0]), (e[0] = n);
  else {
    for (o--, e.push(e[o - 1], e[o]); o > t; ) {
      let i = o - 2;
      (e[o] = e[i]), o--;
    }
    (e[t] = n), (e[t + 1] = r);
  }
}
function Wh(e, t, n) {
  let r = $n(e, t);
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), zh(e, r, t, n)), r;
}
function Gi(e, t) {
  let n = $n(e, t);
  if (n >= 0) return e[n | 1];
}
function $n(e, t) {
  return qh(e, t, 1);
}
function qh(e, t, n) {
  let r = 0,
    o = e.length >> n;
  for (; o !== r; ) {
    let i = r + ((o - r) >> 1),
      s = e[i << n];
    if (t === s) return i << n;
    s > t ? (o = i) : (r = i + 1);
  }
  return ~(o << n);
}
var Yt = {},
  ge = [],
  On = new C(""),
  Bu = new C("", -1),
  $u = new C(""),
  ro = class {
    get(t, n = An) {
      if (n === An) {
        let r = new Error(`NullInjectorError: No provider for ${me(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  Uu = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })(Uu || {}),
  Fe = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(Fe || {}),
  st = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(st || {});
function Zh(e, t, n) {
  let r = e.length;
  for (;;) {
    let o = e.indexOf(t, n);
    if (o === -1) return o;
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length;
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
    }
    n = o + 1;
  }
}
function is(e, t, n) {
  let r = 0;
  for (; r < n.length; ) {
    let o = n[r];
    if (typeof o == "number") {
      if (o !== 0) break;
      r++;
      let i = n[r++],
        s = n[r++],
        a = n[r++];
      e.setAttribute(t, s, a, i);
    } else {
      let i = o,
        s = n[++r];
      Qh(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function Yh(e) {
  return e === 3 || e === 4 || e === 6;
}
function Qh(e) {
  return e.charCodeAt(0) === 64;
}
function Fn(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number"
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? ru(e, n, o, null, t[++r])
              : ru(e, n, o, null, null));
      }
    }
  return e;
}
function ru(e, t, n, r, o) {
  let i = 0,
    s = e.length;
  if (t === -1) s = -1;
  else
    for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i];
    if (typeof a == "number") break;
    if (a === n) {
      if (r === null) {
        o !== null && (e[i + 1] = o);
        return;
      } else if (r === e[i + 1]) {
        e[i + 2] = o;
        return;
      }
    }
    i++, r !== null && i++, o !== null && i++;
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    r !== null && e.splice(i++, 0, r),
    o !== null && e.splice(i++, 0, o);
}
var Hu = "ng-template";
function Kh(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && Zh(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (Js(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function Js(e) {
  return e.type === 4 && e.value !== Hu;
}
function Jh(e, t, n) {
  let r = e.type === 4 && !n ? Hu : e.value;
  return t === r;
}
function Xh(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? np(o) : 0,
    s = !1;
  for (let a = 0; a < t.length; a++) {
    let c = t[a];
    if (typeof c == "number") {
      if (!s && !_e(r) && !_e(c)) return !1;
      if (s && _e(c)) continue;
      (s = !1), (r = c | (r & 1));
      continue;
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== "" && !Jh(e, c, n)) || (c === "" && t.length === 1))
        ) {
          if (_e(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !Kh(e, o, c, n)) {
          if (_e(r)) return !1;
          s = !0;
        }
      } else {
        let u = t[++a],
          l = ep(c, o, Js(e), n);
        if (l === -1) {
          if (_e(r)) return !1;
          s = !0;
          continue;
        }
        if (u !== "") {
          let d;
          if (
            (l > i ? (d = "") : (d = o[l + 1].toLowerCase()), r & 2 && u !== d)
          ) {
            if (_e(r)) return !1;
            s = !0;
          }
        }
      }
  }
  return _e(r) || s;
}
function _e(e) {
  return (e & 1) === 0;
}
function ep(e, t, n, r) {
  if (t === null) return -1;
  let o = 0;
  if (r || !n) {
    let i = !1;
    for (; o < t.length; ) {
      let s = t[o];
      if (s === e) return o;
      if (s === 3 || s === 6) i = !0;
      else if (s === 1 || s === 2) {
        let a = t[++o];
        for (; typeof a == "string"; ) a = t[++o];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          o += 4;
          continue;
        }
      }
      o += i ? 1 : 2;
    }
    return -1;
  } else return rp(t, e);
}
function tp(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Xh(e, t[r], n)) return !0;
  return !1;
}
function np(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Yh(n)) return t;
  }
  return e.length;
}
function rp(e, t) {
  let n = e.indexOf(4);
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
  return -1;
}
function ou(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function op(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = "",
    i = !1;
  for (; n < e.length; ) {
    let s = e[n];
    if (typeof s == "string")
      if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? (o += "." + s) : r & 4 && (o += " " + s);
    else
      o !== "" && !_e(s) && ((t += ou(i, o)), (o = "")),
        (r = s),
        (i = i || !_e(r));
    n++;
  }
  return o !== "" && (t += ou(i, o)), t;
}
function ip(e) {
  return e.map(op).join(",");
}
function sp(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2;
  for (; r < e.length; ) {
    let i = e[r];
    if (typeof i == "string")
      o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
    else {
      if (!_e(o)) break;
      o = i;
    }
    r++;
  }
  return { attrs: t, classes: n };
}
function K(e) {
  return Eo(() => {
    let t = Wu(e),
      n = G(R({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Uu.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Fe.Emulated,
        styles: e.styles || ge,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    qu(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = su(r, !1)), (n.pipeDefs = su(r, !0)), (n.id = lp(n)), n
    );
  });
}
function ap(e) {
  return _o(e) || Gu(e);
}
function cp(e) {
  return e !== null;
}
function Ze(e) {
  return Eo(() => ({
    type: e.type,
    bootstrap: e.bootstrap || ge,
    declarations: e.declarations || ge,
    imports: e.imports || ge,
    exports: e.exports || ge,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function iu(e, t) {
  if (e == null) return Yt;
  let n = {};
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a = st.None;
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = a !== st.None ? [r, a] : r), (t[i] = s)) : (n[i] = r);
    }
  return n;
}
function Te(e) {
  return Eo(() => {
    let t = Wu(e);
    return qu(t), t;
  });
}
function Xs(e) {
  return {
    type: e.type,
    name: e.name,
    factory: null,
    pure: e.pure !== !1,
    standalone: e.standalone === !0,
    onDestroy: e.type.prototype.ngOnDestroy || null,
  };
}
function _o(e) {
  return e[Sh] || null;
}
function Gu(e) {
  return e[Nh] || null;
}
function zu(e) {
  return e[Ah] || null;
}
function up(e) {
  let t = _o(e) || Gu(e) || zu(e);
  return t !== null ? t.standalone : !1;
}
function Wu(e) {
  let t = {};
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || Yt,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || ge,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: iu(e.inputs, t),
    outputs: iu(e.outputs),
    debugInfo: null,
  };
}
function qu(e) {
  e.features?.forEach((t) => t(e));
}
function su(e, t) {
  if (!e) return null;
  let n = t ? zu : ap;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(cp);
}
function lp(e) {
  let t = 0,
    n = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join("|");
  for (let o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0;
  return (t += 2147483648), "c" + t;
}
function Io(e) {
  return { ɵproviders: e };
}
function ea(...e) {
  return { ɵproviders: Zu(!0, e), ɵfromNgModule: !0 };
}
function Zu(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    Ks(t, (s) => {
      let a = s;
      ss(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Yu(o, i),
    n
  );
}
function Yu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    ta(o, (i) => {
      t(i, r);
    });
  }
}
function ss(e, t, n, r) {
  if (((e = ae(e)), !e)) return !1;
  let o = null,
    i = Xc(e),
    s = !i && _o(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = Xc(c)), i)) o = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    o = e;
  }
  let a = r.has(o);
  if (s) {
    if (a) return !1;
    if ((r.add(o), s.dependencies)) {
      let c =
        typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
      for (let u of c) ss(u, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let u;
      try {
        Ks(i.imports, (l) => {
          ss(l, t, n, r) && ((u ||= []), u.push(l));
        });
      } finally {
      }
      u !== void 0 && Yu(u, t);
    }
    if (!a) {
      let u = _t(o) || (() => new o());
      t({ provide: o, useFactory: u, deps: ge }, o),
        t({ provide: $u, useValue: o, multi: !0 }, o),
        t({ provide: On, useValue: () => T(o), multi: !0 }, o);
    }
    let c = i.providers;
    if (c != null && !a) {
      let u = e;
      ta(c, (l) => {
        t(l, u);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function ta(e, t) {
  for (let n of e)
    ku(n) && (n = n.ɵproviders), Array.isArray(n) ? ta(n, t) : t(n);
}
var dp = j({ provide: String, useValue: j });
function Qu(e) {
  return e !== null && typeof e == "object" && dp in e;
}
function fp(e) {
  return !!(e && e.useExisting);
}
function hp(e) {
  return !!(e && e.useFactory);
}
function Qt(e) {
  return typeof e == "function";
}
function pp(e) {
  return !!e.useClass;
}
var Mo = new C(""),
  Qr = {},
  gp = {},
  zi;
function na() {
  return zi === void 0 && (zi = new ro()), zi;
}
var He = class {},
  Rn = class extends He {
    get destroyed() {
      return this._destroyed;
    }
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        cs(t, (s) => this.processProvider(s)),
        this.records.set(Bu, Gt(void 0, this)),
        o.has("environment") && this.records.set(He, Gt(void 0, this));
      let i = this.records.get(Mo);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get($u, ge, A.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      let t = x(null);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let n = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of n) r();
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear(),
          x(t);
      }
    }
    onDestroy(t) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
      );
    }
    runInContext(t) {
      this.assertNotDestroyed();
      let n = rt(this),
        r = ue(void 0),
        o;
      try {
        return t();
      } finally {
        rt(n), ue(r);
      }
    }
    get(t, n = An, r = A.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(tu))) return t[tu](this);
      r = bo(r);
      let o,
        i = rt(this),
        s = ue(void 0);
      try {
        if (!(r & A.SkipSelf)) {
          let c = this.records.get(t);
          if (c === void 0) {
            let u = Cp(t) && Zs(t);
            u && this.injectableDefInScope(u)
              ? (c = Gt(as(t), Qr))
              : (c = null),
              this.records.set(t, c);
          }
          if (c != null) return this.hydrate(t, c);
        }
        let a = r & A.Self ? na() : this.parent;
        return (n = r & A.Optional && n === An ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[no] = a[no] || []).unshift(me(t)), i)) throw a;
          return Uh(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        ue(s), rt(i);
      }
    }
    resolveInjectorInitializers() {
      let t = x(null),
        n = rt(this),
        r = ue(void 0),
        o;
      try {
        let i = this.get(On, ge, A.Self);
        for (let s of i) s();
      } finally {
        rt(n), ue(r), x(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(me(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new I(205, !1);
    }
    processProvider(t) {
      t = ae(t);
      let n = Qt(t) ? t : ae(t && t.provide),
        r = yp(t);
      if (!Qt(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = Gt(void 0, Qr, !0)),
          (o.factory = () => os(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t);
      }
      this.records.set(n, r);
    }
    hydrate(t, n) {
      let r = x(null);
      try {
        return (
          n.value === Qr && ((n.value = gp), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            Dp(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        x(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = ae(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function as(e) {
  let t = Zs(e),
    n = t !== null ? t.factory : _t(e);
  if (n !== null) return n;
  if (e instanceof C) throw new I(204, !1);
  if (e instanceof Function) return mp(e);
  throw new I(204, !1);
}
function mp(e) {
  if (e.length > 0) throw new I(204, !1);
  let n = Th(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function yp(e) {
  if (Qu(e)) return Gt(void 0, e.useValue);
  {
    let t = Ku(e);
    return Gt(t, Qr);
  }
}
function Ku(e, t, n) {
  let r;
  if (Qt(e)) {
    let o = ae(e);
    return _t(o) || as(o);
  } else if (Qu(e)) r = () => ae(e.useValue);
  else if (hp(e)) r = () => e.useFactory(...os(e.deps || []));
  else if (fp(e)) r = () => T(ae(e.useExisting));
  else {
    let o = ae(e && (e.useClass || e.provide));
    if (vp(e)) r = () => new o(...os(e.deps));
    else return _t(o) || as(o);
  }
  return r;
}
function Gt(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function vp(e) {
  return !!e.deps;
}
function Dp(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function Cp(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof C);
}
function cs(e, t) {
  for (let n of e)
    Array.isArray(n) ? cs(n, t) : n && ku(n) ? cs(n.ɵproviders, t) : t(n);
}
function Ju(e, t) {
  e instanceof Rn && e.assertNotDestroyed();
  let n,
    r = rt(e),
    o = ue(void 0);
  try {
    return t();
  } finally {
    rt(r), ue(o);
  }
}
function wp() {
  return Lu() !== void 0 || jh() != null;
}
var Ye = 0,
  M = 1,
  E = 2,
  ve = 3,
  Ie = 4,
  Pe = 5,
  Pn = 6,
  oo = 7,
  re = 8,
  Kt = 9,
  Re = 10,
  oe = 11,
  kn = 12,
  au = 13,
  un = 14,
  Me = 15,
  Jt = 16,
  zt = 17,
  Xt = 18,
  To = 19,
  Xu = 20,
  ot = 21,
  Wi = 22,
  ye = 23,
  fe = 25,
  el = 1;
var Ln = 7,
  Ep = 8,
  io = 9,
  le = 10,
  so = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(so || {});
function it(e) {
  return Array.isArray(e) && typeof e[el] == "object";
}
function Nt(e) {
  return Array.isArray(e) && e[el] === !0;
}
function tl(e) {
  return (e.flags & 4) !== 0;
}
function xo(e) {
  return e.componentOffset > -1;
}
function ra(e) {
  return (e.flags & 1) === 1;
}
function at(e) {
  return !!e.template;
}
function us(e) {
  return (e[E] & 512) !== 0;
}
var ls = class {
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function nl(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function Un() {
  return rl;
}
function rl(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = _p), bp;
}
Un.ngInherit = !0;
function bp() {
  let e = il(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === Yt) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function _p(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = il(e) || Ip(e, { previous: Yt, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    u = c[i];
  (a[i] = new ls(u && u.currentValue, n, c === Yt)), nl(e, t, o, n);
}
var ol = "__ngSimpleChanges__";
function il(e) {
  return e[ol] || null;
}
function Ip(e, t) {
  return (e[ol] = t);
}
var cu = null;
var Ae = function (e, t, n) {
    cu?.(e, t, n);
  },
  Mp = "svg",
  Tp = "math";
function Ge(e) {
  for (; Array.isArray(e); ) e = e[Ye];
  return e;
}
function sl(e, t) {
  return Ge(t[e]);
}
function ke(e, t) {
  return Ge(t[e.index]);
}
function oa(e, t) {
  return e.data[t];
}
function xp(e, t) {
  return e[t];
}
function ct(e, t) {
  let n = t[e];
  return it(n) ? n : n[Ye];
}
function ia(e) {
  return (e[E] & 128) === 128;
}
function en(e, t) {
  return t == null ? null : e[t];
}
function al(e) {
  e[zt] = 0;
}
function cl(e) {
  e[E] & 1024 || ((e[E] |= 1024), ia(e) && No(e));
}
function Sp(e, t) {
  for (; e > 0; ) (t = t[un]), e--;
  return t;
}
function So(e) {
  return !!(e[E] & 9216 || e[ye]?.dirty);
}
function ds(e) {
  e[Re].changeDetectionScheduler?.notify(8),
    e[E] & 64 && (e[E] |= 1024),
    So(e) && No(e);
}
function No(e) {
  e[Re].changeDetectionScheduler?.notify(0);
  let t = It(e);
  for (; t !== null && !(t[E] & 8192 || ((t[E] |= 8192), !ia(t))); ) t = It(t);
}
function ul(e, t) {
  if ((e[E] & 256) === 256) throw new I(911, !1);
  e[ot] === null && (e[ot] = []), e[ot].push(t);
}
function Np(e, t) {
  if (e[ot] === null) return;
  let n = e[ot].indexOf(t);
  n !== -1 && e[ot].splice(n, 1);
}
function It(e) {
  let t = e[ve];
  return Nt(t) ? t[ve] : t;
}
var S = { lFrame: vl(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var ll = !1;
function Ap() {
  return S.lFrame.elementDepthCount;
}
function Op() {
  S.lFrame.elementDepthCount++;
}
function Fp() {
  S.lFrame.elementDepthCount--;
}
function dl() {
  return S.bindingsEnabled;
}
function Rp() {
  return S.skipHydrationRootTNode !== null;
}
function Pp(e) {
  return S.skipHydrationRootTNode === e;
}
function kp() {
  S.skipHydrationRootTNode = null;
}
function L() {
  return S.lFrame.lView;
}
function he() {
  return S.lFrame.tView;
}
function De(e) {
  return (S.lFrame.contextLView = e), e[re];
}
function Ce(e) {
  return (S.lFrame.contextLView = null), e;
}
function xe() {
  let e = fl();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function fl() {
  return S.lFrame.currentTNode;
}
function Lp() {
  let e = S.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function Hn(e, t) {
  let n = S.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function hl() {
  return S.lFrame.isParent;
}
function Vp() {
  S.lFrame.isParent = !1;
}
function pl() {
  return ll;
}
function uu(e) {
  ll = e;
}
function jp() {
  let e = S.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function Bp(e) {
  return (S.lFrame.bindingIndex = e);
}
function Ao() {
  return S.lFrame.bindingIndex++;
}
function $p(e) {
  let t = S.lFrame,
    n = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), n;
}
function Up() {
  return S.lFrame.inI18n;
}
function Hp(e, t) {
  let n = S.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), fs(t);
}
function Gp() {
  return S.lFrame.currentDirectiveIndex;
}
function fs(e) {
  S.lFrame.currentDirectiveIndex = e;
}
function zp(e) {
  let t = S.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function gl(e) {
  S.lFrame.currentQueryIndex = e;
}
function Wp(e) {
  let t = e[M];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Pe] : null;
}
function ml(e, t, n) {
  if (n & A.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & A.Host); )
      if (((o = Wp(i)), o === null || ((i = i[un]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (S.lFrame = yl());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function sa(e) {
  let t = yl(),
    n = e[M];
  (S.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function yl() {
  let e = S.lFrame,
    t = e === null ? null : e.child;
  return t === null ? vl(e) : t;
}
function vl(e) {
  let t = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: e,
    child: null,
    inI18n: !1,
  };
  return e !== null && (e.child = t), t;
}
function Dl() {
  let e = S.lFrame;
  return (S.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var Cl = Dl;
function aa() {
  let e = Dl();
  (e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0);
}
function qp(e) {
  return (S.lFrame.contextLView = Sp(e, S.lFrame.contextLView))[re];
}
function At() {
  return S.lFrame.selectedIndex;
}
function Mt(e) {
  S.lFrame.selectedIndex = e;
}
function wl() {
  let e = S.lFrame;
  return oa(e.tView, e.selectedIndex);
}
function Zp() {
  return S.lFrame.currentNamespace;
}
var El = !0;
function ca() {
  return El;
}
function ua(e) {
  El = e;
}
function Yp(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = rl(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function la(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: u,
        ngOnDestroy: l,
      } = i;
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      c && (e.viewHooks ??= []).push(-n, c),
      u &&
        ((e.viewHooks ??= []).push(n, u), (e.viewCheckHooks ??= []).push(n, u)),
      l != null && (e.destroyHooks ??= []).push(n, l);
  }
}
function Kr(e, t, n) {
  bl(e, t, 3, n);
}
function Jr(e, t, n, r) {
  (e[E] & 3) === n && bl(e, t, n, r);
}
function qi(e, t) {
  let n = e[E];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[E] = n));
}
function bl(e, t, n, r) {
  let o = r !== void 0 ? e[zt] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == "number") {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      t[c] < 0 && (e[zt] += 65536),
        (a < i || i == -1) &&
          (Qp(e, n, t, c), (e[zt] = (e[zt] & 4294901760) + c + 2)),
        c++;
}
function lu(e, t) {
  Ae(4, e, t);
  let n = x(null);
  try {
    t.call(e);
  } finally {
    x(n), Ae(5, e, t);
  }
}
function Qp(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[E] >> 14 < e[zt] >> 16 &&
      (e[E] & 3) === t &&
      ((e[E] += 16384), lu(a, i))
    : lu(a, i);
}
var Zt = -1,
  Tt = class {
    constructor(t, n, r) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function Kp(e) {
  return e instanceof Tt;
}
function Jp(e) {
  return (e.flags & 8) !== 0;
}
function Xp(e) {
  return (e.flags & 16) !== 0;
}
var Zi = {},
  hs = class {
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = bo(r);
      let o = this.injector.get(t, Zi, r);
      return o !== Zi || n === Zi ? o : this.parentInjector.get(t, n, r);
    }
  };
function eg(e) {
  return e !== Zt;
}
function ps(e) {
  return e & 32767;
}
function tg(e) {
  return e >> 16;
}
function gs(e, t) {
  let n = tg(e),
    r = t;
  for (; n > 0; ) (r = r[un]), n--;
  return r;
}
var ms = !0;
function ao(e) {
  let t = ms;
  return (ms = e), t;
}
var ng = 256,
  _l = ng - 1,
  Il = 5,
  rg = 0,
  Oe = {};
function og(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Nn) && (r = n[Nn]),
    r == null && (r = n[Nn] = rg++);
  let o = r & _l,
    i = 1 << o;
  t.data[e + (o >> Il)] |= i;
}
function co(e, t) {
  let n = Ml(e, t);
  if (n !== -1) return n;
  let r = t[M];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Yi(r.data, e),
    Yi(t, null),
    Yi(r.blueprint, null));
  let o = Tl(e, t),
    i = e.injectorIndex;
  if (eg(o)) {
    let s = ps(o),
      a = gs(o, t),
      c = a[M].data;
    for (let u = 0; u < 8; u++) t[i + u] = a[s + u] | c[s + u];
  }
  return (t[i + 8] = o), i;
}
function Yi(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function Ml(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Tl(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Ol(o)), r === null)) return Zt;
    if ((n++, (o = o[un]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return Zt;
}
function ys(e, t, n) {
  og(e, t, n);
}
function xl(e, t, n) {
  if (n & A.Optional || e !== void 0) return e;
  Qs(t, "NodeInjector");
}
function Sl(e, t, n, r) {
  if (
    (n & A.Optional && r === void 0 && (r = null), !(n & (A.Self | A.Host)))
  ) {
    let o = e[Kt],
      i = ue(void 0);
    try {
      return o ? o.get(t, r, n & A.Optional) : Vu(t, r, n & A.Optional);
    } finally {
      ue(i);
    }
  }
  return xl(r, t, n);
}
function Nl(e, t, n, r = A.Default, o) {
  if (e !== null) {
    if (t[E] & 2048 && !(r & A.Self)) {
      let s = ug(e, t, n, r, Oe);
      if (s !== Oe) return s;
    }
    let i = Al(e, t, n, r, Oe);
    if (i !== Oe) return i;
  }
  return Sl(t, n, r, o);
}
function Al(e, t, n, r, o) {
  let i = ag(n);
  if (typeof i == "function") {
    if (!ml(t, e, r)) return r & A.Host ? xl(o, n, r) : Sl(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & A.Optional))) Qs(n);
      else return s;
    } finally {
      Cl();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Ml(e, t),
      c = Zt,
      u = r & A.Host ? t[Me][Pe] : null;
    for (
      (a === -1 || r & A.SkipSelf) &&
      ((c = a === -1 ? Tl(e, t) : t[a + 8]),
      c === Zt || !fu(r, !1)
        ? (a = -1)
        : ((s = t[M]), (a = ps(c)), (t = gs(c, t))));
      a !== -1;

    ) {
      let l = t[M];
      if (du(i, a, l.data)) {
        let d = ig(a, t, n, s, r, u);
        if (d !== Oe) return d;
      }
      (c = t[a + 8]),
        c !== Zt && fu(r, t[M].data[a + 8] === u) && du(i, a, t)
          ? ((s = l), (a = ps(c)), (t = gs(c, t)))
          : (a = -1);
    }
  }
  return o;
}
function ig(e, t, n, r, o, i) {
  let s = t[M],
    a = s.data[e + 8],
    c = r == null ? xo(a) && ms : r != s && (a.type & 3) !== 0,
    u = o & A.Host && i === a,
    l = sg(a, s, n, c, u);
  return l !== null ? tn(t, s, l, a) : Oe;
}
function sg(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    c = e.directiveStart,
    u = e.directiveEnd,
    l = i >> 20,
    d = r ? a : a + l,
    h = o ? a + l : u;
  for (let f = d; f < h; f++) {
    let p = s[f];
    if ((f < c && n === p) || (f >= c && p.type === n)) return f;
  }
  if (o) {
    let f = s[c];
    if (f && at(f) && f.type === n) return c;
  }
  return null;
}
function tn(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (Kp(o)) {
    let s = o;
    s.resolving && Fh(Oh(i[n]));
    let a = ao(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      u = s.injectImpl ? ue(s.injectImpl) : null,
      l = ml(e, r, A.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Yp(n, i[n], t);
    } finally {
      u !== null && ue(u), ao(a), (s.resolving = !1), Cl();
    }
  }
  return o;
}
function ag(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(Nn) ? e[Nn] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & _l : cg) : t;
}
function du(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> Il)] & r);
}
function fu(e, t) {
  return !(e & A.Self) && !(e & A.Host && t);
}
var uo = class {
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return Nl(this._tNode, this._lView, t, bo(r), n);
  }
};
function cg() {
  return new uo(xe(), L());
}
function ln(e) {
  return Eo(() => {
    let t = e.prototype.constructor,
      n = t[to] || vs(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[to] || vs(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function vs(e) {
  return Fu(e)
    ? () => {
        let t = vs(ae(e));
        return t && t();
      }
    : _t(e);
}
function ug(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[E] & 2048 && !(s[E] & 512); ) {
    let a = Al(i, s, n, r | A.Self, Oe);
    if (a !== Oe) return a;
    let c = i.parent;
    if (!c) {
      let u = s[Xu];
      if (u) {
        let l = u.get(n, Oe, r);
        if (l !== Oe) return l;
      }
      (c = Ol(s)), (s = s[un]);
    }
    i = c;
  }
  return o;
}
function Ol(e) {
  let t = e[M],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[Pe] : null;
}
function hu(e, t = null, n = null, r) {
  let o = lg(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function lg(e, t = null, n = null, r, o = new Set()) {
  let i = [n || ge, ea(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : me(e))),
    new Rn(i, t || na(), r || null, o)
  );
}
var nn = class e {
  static {
    this.THROW_IF_NOT_FOUND = An;
  }
  static {
    this.NULL = new ro();
  }
  static create(t, n) {
    if (Array.isArray(t)) return hu({ name: "" }, n, t, "");
    {
      let r = t.name ?? "";
      return hu({ name: r }, t.parent, t.providers, r);
    }
  }
  static {
    this.ɵprov = b({ token: e, providedIn: "any", factory: () => T(Bu) });
  }
  static {
    this.__NG_ELEMENT_ID__ = -1;
  }
};
var dg = new C("");
dg.__NG_ELEMENT_ID__ = (e) => {
  let t = xe();
  if (t === null) throw new I(204, !1);
  if (t.type & 2) return t.value;
  if (e & A.Optional) return null;
  throw new I(204, !1);
};
var fg = "ngOriginalError";
function Qi(e) {
  return e[fg];
}
var Fl = !0,
  Rl = (() => {
    class e {
      static {
        this.__NG_ELEMENT_ID__ = hg;
      }
      static {
        this.__NG_ENV_ID__ = (n) => n;
      }
    }
    return e;
  })(),
  Ds = class extends Rl {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return ul(this._lView, t), () => Np(this._lView, t);
    }
  };
function hg() {
  return new Ds(L());
}
var dn = (() => {
  class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new In(!1));
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value;
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0);
      let n = this.taskId++;
      return this.pendingTasks.add(n), n;
    }
    remove(n) {
      this.pendingTasks.delete(n),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1);
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1);
    }
    static {
      this.ɵprov = b({ token: e, providedIn: "root", factory: () => new e() });
    }
  }
  return e;
})();
var Cs = class extends Q {
    constructor(t = !1) {
      super(),
        (this.destroyRef = void 0),
        (this.pendingTasks = void 0),
        (this.__isAsync = t),
        wp() &&
          ((this.destroyRef = v(Rl, { optional: !0 }) ?? void 0),
          (this.pendingTasks = v(dn, { optional: !0 }) ?? void 0));
    }
    emit(t) {
      let n = x(null);
      try {
        super.next(t);
      } finally {
        x(n);
      }
    }
    subscribe(t, n, r) {
      let o = t,
        i = n || (() => null),
        s = r;
      if (t && typeof t == "object") {
        let c = t;
        (o = c.next?.bind(c)),
          (i = c.error?.bind(c)),
          (s = c.complete?.bind(c));
      }
      this.__isAsync &&
        ((i = this.wrapInTimeout(i)),
        o && (o = this.wrapInTimeout(o)),
        s && (s = this.wrapInTimeout(s)));
      let a = super.subscribe({ next: o, error: i, complete: s });
      return t instanceof se && t.add(a), a;
    }
    wrapInTimeout(t) {
      return (n) => {
        let r = this.pendingTasks?.add();
        setTimeout(() => {
          t(n), r !== void 0 && this.pendingTasks?.remove(r);
        });
      };
    }
  },
  B = Cs;
function lo(...e) {}
function Pl(e) {
  let t, n;
  function r() {
    e = lo;
    try {
      n !== void 0 &&
        typeof cancelAnimationFrame == "function" &&
        cancelAnimationFrame(n),
        t !== void 0 && clearTimeout(t);
    } catch {}
  }
  return (
    (t = setTimeout(() => {
      e(), r();
    })),
    typeof requestAnimationFrame == "function" &&
      (n = requestAnimationFrame(() => {
        e(), r();
      })),
    () => r()
  );
}
function pu(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = lo;
    }
  );
}
var da = "isAngularZone",
  fo = da + "_ID",
  pg = 0,
  z = class e {
    constructor(t) {
      (this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new B(!1)),
        (this.onMicrotaskEmpty = new B(!1)),
        (this.onStable = new B(!1)),
        (this.onError = new B(!1));
      let {
        enableLongStackTrace: n = !1,
        shouldCoalesceEventChangeDetection: r = !1,
        shouldCoalesceRunChangeDetection: o = !1,
        scheduleInRootZone: i = Fl,
      } = t;
      if (typeof Zone > "u") throw new I(908, !1);
      Zone.assertZonePatched();
      let s = this;
      (s._nesting = 0),
        (s._outer = s._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())),
        n &&
          Zone.longStackTraceZoneSpec &&
          (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)),
        (s.shouldCoalesceEventChangeDetection = !o && r),
        (s.shouldCoalesceRunChangeDetection = o),
        (s.callbackScheduled = !1),
        (s.scheduleInRootZone = i),
        yg(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(da) === !0;
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new I(909, !1);
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new I(909, !1);
    }
    run(t, n, r) {
      return this._inner.run(t, n, r);
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, gg, lo, lo);
      try {
        return i.runTask(s, n, r);
      } finally {
        i.cancelTask(s);
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r);
    }
    runOutsideAngular(t) {
      return this._outer.run(t);
    }
  },
  gg = {};
function fa(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null));
        } finally {
          e.isStable = !0;
        }
    }
}
function mg(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    Pl(() => {
      (e.callbackScheduled = !1),
        ws(e),
        (e.isCheckStableRunning = !0),
        fa(e),
        (e.isCheckStableRunning = !1);
    });
  }
  e.scheduleInRootZone
    ? Zone.root.run(() => {
        t();
      })
    : e._outer.run(() => {
        t();
      }),
    ws(e);
}
function yg(e) {
  let t = () => {
      mg(e);
    },
    n = pg++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [da]: !0, [fo]: n, [fo + n]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (vg(c)) return r.invokeTask(i, s, a, c);
      try {
        return gu(e), r.invokeTask(i, s, a, c);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          mu(e);
      }
    },
    onInvoke: (r, o, i, s, a, c, u) => {
      try {
        return gu(e), r.invoke(i, s, a, c, u);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !Dg(c) &&
          t(),
          mu(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), ws(e), fa(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function ws(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function gu(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function mu(e) {
  e._nesting--, fa(e);
}
var Es = class {
  constructor() {
    (this.hasPendingMicrotasks = !1),
      (this.hasPendingMacrotasks = !1),
      (this.isStable = !0),
      (this.onUnstable = new B()),
      (this.onMicrotaskEmpty = new B()),
      (this.onStable = new B()),
      (this.onError = new B());
  }
  run(t, n, r) {
    return t.apply(n, r);
  }
  runGuarded(t, n, r) {
    return t.apply(n, r);
  }
  runOutsideAngular(t) {
    return t();
  }
  runTask(t, n, r, o) {
    return t.apply(n, r);
  }
};
function vg(e) {
  return kl(e, "__ignore_ng_zone__");
}
function Dg(e) {
  return kl(e, "__scheduler_tick__");
}
function kl(e, t) {
  return !Array.isArray(e) || e.length !== 1 ? !1 : e[0]?.data?.[t] === !0;
}
var ze = class {
    constructor() {
      this._console = console;
    }
    handleError(t) {
      let n = this._findOriginalError(t);
      this._console.error("ERROR", t),
        n && this._console.error("ORIGINAL ERROR", n);
    }
    _findOriginalError(t) {
      let n = t && Qi(t);
      for (; n && Qi(n); ) n = Qi(n);
      return n || null;
    }
  },
  Cg = new C("", {
    providedIn: "root",
    factory: () => {
      let e = v(z),
        t = v(ze);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function wg() {
  return Ll(xe(), L());
}
function Ll(e, t) {
  return new Ot(ke(e, t));
}
var Ot = (() => {
  class e {
    constructor(n) {
      this.nativeElement = n;
    }
    static {
      this.__NG_ELEMENT_ID__ = wg;
    }
  }
  return e;
})();
function Vl(e) {
  return (e.flags & 128) === 128;
}
var jl = new Map(),
  Eg = 0;
function bg() {
  return Eg++;
}
function _g(e) {
  jl.set(e[To], e);
}
function bs(e) {
  jl.delete(e[To]);
}
var yu = "__ngContext__";
function xt(e, t) {
  it(t) ? ((e[yu] = t[To]), _g(t)) : (e[yu] = t);
}
function Bl(e) {
  return Ul(e[kn]);
}
function $l(e) {
  return Ul(e[Ie]);
}
function Ul(e) {
  for (; e !== null && !Nt(e); ) e = e[Ie];
  return e;
}
var _s;
function Hl(e) {
  _s = e;
}
function Ig() {
  if (_s !== void 0) return _s;
  if (typeof document < "u") return document;
  throw new I(210, !1);
}
var ha = new C("", { providedIn: "root", factory: () => Mg }),
  Mg = "ng",
  pa = new C(""),
  ut = new C("", { providedIn: "platform", factory: () => "unknown" });
var ga = new C("", {
  providedIn: "root",
  factory: () =>
    Ig().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var Tg = "h",
  xg = "b";
var Sg = () => null;
function ma(e, t, n = !1) {
  return Sg(e, t, n);
}
var Gl = !1,
  Ng = new C("", { providedIn: "root", factory: () => Gl });
var ho = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Ou})`;
  }
};
function Oo(e) {
  return e instanceof ho ? e.changingThisBreaksApplicationSecurity : e;
}
function zl(e, t) {
  let n = Ag(e);
  if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${Ou})`);
  }
  return n === t;
}
function Ag(e) {
  return (e instanceof ho && e.getTypeName()) || null;
}
var Og = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function Wl(e) {
  return (e = String(e)), e.match(Og) ? e : "unsafe:" + e;
}
var ya = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(ya || {});
function Gn(e) {
  let t = Fg();
  return t ? t.sanitize(ya.URL, e) || "" : zl(e, "URL") ? Oo(e) : Wl(Ys(e));
}
function Fg() {
  let e = L();
  return e && e[Re].sanitizer;
}
var We = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(We || {}),
  Rg;
function va(e, t) {
  return Rg(e, t);
}
function Wt(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    Nt(r) ? (i = r) : it(r) && ((s = !0), (r = r[Ye]));
    let a = Ge(r);
    e === 0 && n !== null
      ? o == null
        ? Ql(t, n, a)
        : Is(t, n, a, o || null, !0)
      : e === 1 && n !== null
      ? Is(t, n, a, o || null, !0)
      : e === 2
      ? Yg(t, a, s)
      : e === 3 && t.destroyNode(a),
      i != null && Kg(t, e, i, n, o);
  }
}
function Pg(e, t) {
  return e.createText(t);
}
function kg(e, t, n) {
  e.setValue(t, n);
}
function ql(e, t, n) {
  return e.createElement(t, n);
}
function Lg(e, t) {
  Zl(e, t), (t[Ye] = null), (t[Pe] = null);
}
function Vg(e, t, n, r, o, i) {
  (r[Ye] = o), (r[Pe] = t), Fo(e, r, n, 1, o, i);
}
function Zl(e, t) {
  t[Re].changeDetectionScheduler?.notify(9), Fo(e, t, t[oe], 2, null, null);
}
function jg(e) {
  let t = e[kn];
  if (!t) return Ki(e[M], e);
  for (; t; ) {
    let n = null;
    if (it(t)) n = t[kn];
    else {
      let r = t[le];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[Ie] && t !== e; ) it(t) && Ki(t[M], t), (t = t[ve]);
      t === null && (t = e), it(t) && Ki(t[M], t), (n = t && t[Ie]);
    }
    t = n;
  }
}
function Bg(e, t, n, r) {
  let o = le + r,
    i = n.length;
  r > 0 && (n[o - 1][Ie] = t),
    r < i - le
      ? ((t[Ie] = n[o]), Gh(n, le + r, t))
      : (n.push(t), (t[Ie] = null)),
    (t[ve] = n);
  let s = t[Jt];
  s !== null && n !== s && Yl(s, t);
  let a = t[Xt];
  a !== null && a.insertView(e), ds(t), (t[E] |= 128);
}
function Yl(e, t) {
  let n = e[io],
    r = t[ve];
  if (it(r)) e[E] |= so.HasTransplantedViews;
  else {
    let o = r[ve][Me];
    t[Me] !== o && (e[E] |= so.HasTransplantedViews);
  }
  n === null ? (e[io] = [t]) : n.push(t);
}
function Da(e, t) {
  let n = e[io],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Ca(e, t) {
  if (e.length <= le) return;
  let n = le + t,
    r = e[n];
  if (r) {
    let o = r[Jt];
    o !== null && o !== e && Da(o, r), t > 0 && (e[n - 1][Ie] = r[Ie]);
    let i = ju(e, le + t);
    Lg(r[M], r);
    let s = i[Xt];
    s !== null && s.detachView(i[M]),
      (r[ve] = null),
      (r[Ie] = null),
      (r[E] &= -129);
  }
  return r;
}
function wa(e, t) {
  if (!(t[E] & 256)) {
    let n = t[oe];
    n.destroyNode && Fo(e, t, n, 3, null, null), jg(t);
  }
}
function Ki(e, t) {
  if (t[E] & 256) return;
  let n = x(null);
  try {
    (t[E] &= -129),
      (t[E] |= 256),
      t[ye] && Ai(t[ye]),
      Ug(e, t),
      $g(e, t),
      t[M].type === 1 && t[oe].destroy();
    let r = t[Jt];
    if (r !== null && Nt(t[ve])) {
      r !== t[ve] && Da(r, t);
      let o = t[Xt];
      o !== null && o.detachView(e);
    }
    bs(t);
  } finally {
    x(n);
  }
}
function $g(e, t) {
  let n = e.cleanup,
    r = t[oo];
  if (n !== null)
    for (let i = 0; i < n.length - 1; i += 2)
      if (typeof n[i] == "string") {
        let s = n[i + 3];
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2);
      } else {
        let s = r[n[i + 1]];
        n[i].call(s);
      }
  r !== null && (t[oo] = null);
  let o = t[ot];
  if (o !== null) {
    t[ot] = null;
    for (let i = 0; i < o.length; i++) {
      let s = o[i];
      s();
    }
  }
}
function Ug(e, t) {
  let n;
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof Tt)) {
        let i = n[r + 1];
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              c = i[s + 1];
            Ae(4, a, c);
            try {
              c.call(a);
            } finally {
              Ae(5, a, c);
            }
          }
        else {
          Ae(4, o, i);
          try {
            i.call(o);
          } finally {
            Ae(5, o, i);
          }
        }
      }
    }
}
function Hg(e, t, n) {
  return Gg(e, t.parent, n);
}
function Gg(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[Ye];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === Fe.None || i === Fe.Emulated) return null;
    }
    return ke(r, n);
  }
}
function Is(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function Ql(e, t, n) {
  e.appendChild(t, n);
}
function vu(e, t, n, r, o) {
  r !== null ? Is(e, t, n, r, o) : Ql(e, t, n);
}
function zg(e, t) {
  return e.parentNode(t);
}
function Wg(e, t, n) {
  return Zg(e, t, n);
}
function qg(e, t, n) {
  return e.type & 40 ? ke(e, n) : null;
}
var Zg = qg,
  Du;
function Ea(e, t, n, r) {
  let o = Hg(e, r, t),
    i = t[oe],
    s = r.parent || t[Pe],
    a = Wg(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) vu(i, o, n[c], a, !1);
    else vu(i, o, n, a, !1);
  Du !== void 0 && Du(i, r, t, n, o);
}
function xn(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return ke(t, e);
    if (n & 4) return Ms(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return xn(e, r);
      {
        let o = e[t.index];
        return Nt(o) ? Ms(-1, o) : Ge(o);
      }
    } else {
      if (n & 128) return xn(e, t.next);
      if (n & 32) return va(t, e)() || Ge(e[t.index]);
      {
        let r = Kl(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = It(e[Me]);
          return xn(o, r);
        } else return xn(e, t.next);
      }
    }
  }
  return null;
}
function Kl(e, t) {
  if (t !== null) {
    let r = e[Me][Pe],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Ms(e, t) {
  let n = le + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[M].firstChild;
    if (o !== null) return xn(r, o);
  }
  return t[Ln];
}
function Yg(e, t, n) {
  e.removeChild(null, t, n);
}
function ba(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    if (n.type === 128) {
      n = n.next;
      continue;
    }
    let a = r[n.index],
      c = n.type;
    if (
      (s && t === 0 && (a && xt(Ge(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) ba(e, t, n.child, r, o, i, !1), Wt(t, e, o, a, i);
      else if (c & 32) {
        let u = va(n, r),
          l;
        for (; (l = u()); ) Wt(t, e, o, l, i);
        Wt(t, e, o, a, i);
      } else c & 16 ? Qg(e, t, r, n, o, i) : Wt(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function Fo(e, t, n, r, o, i) {
  ba(n, r, e.firstChild, t, o, i, !1);
}
function Qg(e, t, n, r, o, i) {
  let s = n[Me],
    c = s[Pe].projection[r.projection];
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u];
      Wt(t, e, o, l, i);
    }
  else {
    let u = c,
      l = s[ve];
    Vl(r) && (u.flags |= 128), ba(e, t, u, l, o, i, !0);
  }
}
function Kg(e, t, n, r, o) {
  let i = n[Ln],
    s = Ge(n);
  i !== s && Wt(t, e, r, i, o);
  for (let a = le; a < n.length; a++) {
    let c = n[a];
    Fo(c[M], c, e, t, r, i);
  }
}
function Jg(e, t, n, r, o) {
  if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
  else {
    let i = r.indexOf("-") === -1 ? void 0 : We.DashCase;
    o == null
      ? e.removeStyle(n, r, i)
      : (typeof o == "string" &&
          o.endsWith("!important") &&
          ((o = o.slice(0, -10)), (i |= We.Important)),
        e.setStyle(n, r, o, i));
  }
}
function Xg(e, t, n) {
  e.setAttribute(t, "style", n);
}
function Jl(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Xl(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && is(e, t, r),
    o !== null && Jl(e, t, o),
    i !== null && Xg(e, t, i);
}
var Qe = {};
function N(e = 1) {
  ed(he(), L(), At() + e, !1);
}
function ed(e, t, n, r) {
  if (!r)
    if ((t[E] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Kr(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Jr(t, i, 0, n);
    }
  Mt(n);
}
function $(e, t = A.Default) {
  let n = L();
  if (n === null) return T(e, t);
  let r = xe();
  return Nl(r, n, ae(e), t);
}
function td(e, t, n, r, o, i) {
  let s = x(null);
  try {
    let a = null;
    o & st.SignalBased && (a = t[r][tt]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & st.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : nl(t, a, r, i);
  } finally {
    x(s);
  }
}
function em(e, t) {
  let n = e.hostBindingOpCodes;
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) Mt(~o);
        else {
          let i = o,
            s = n[++r],
            a = n[++r];
          Hp(s, i);
          let c = t[i];
          a(2, c);
        }
      }
    } finally {
      Mt(-1);
    }
}
function Ro(e, t, n, r, o, i, s, a, c, u, l) {
  let d = t.blueprint.slice();
  return (
    (d[Ye] = o),
    (d[E] = r | 4 | 128 | 8 | 64),
    (u !== null || (e && e[E] & 2048)) && (d[E] |= 2048),
    al(d),
    (d[ve] = d[un] = e),
    (d[re] = n),
    (d[Re] = s || (e && e[Re])),
    (d[oe] = a || (e && e[oe])),
    (d[Kt] = c || (e && e[Kt]) || null),
    (d[Pe] = i),
    (d[To] = bg()),
    (d[Pn] = l),
    (d[Xu] = u),
    (d[Me] = t.type == 2 ? e[Me] : d),
    d
  );
}
function Po(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = tm(e, t, n, r, o)), Up() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = Lp();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Hn(i, !0), i;
}
function tm(e, t, n, r, o) {
  let i = fl(),
    s = hl(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = sm(e, a, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = c),
    i !== null &&
      (s
        ? i.child == null && c.parent !== null && (i.child = c)
        : i.next === null && ((i.next = c), (c.prev = i))),
    c
  );
}
function nd(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function rd(e, t, n, r, o) {
  let i = At(),
    s = r & 2;
  try {
    Mt(-1), s && t.length > fe && ed(e, t, fe, !1), Ae(s ? 2 : 0, o), n(r, o);
  } finally {
    Mt(i), Ae(s ? 3 : 1, o);
  }
}
function od(e, t, n) {
  if (tl(t)) {
    let r = x(null);
    try {
      let o = t.directiveStart,
        i = t.directiveEnd;
      for (let s = o; s < i; s++) {
        let a = e.data[s];
        if (a.contentQueries) {
          let c = n[s];
          a.contentQueries(1, c, s);
        }
      }
    } finally {
      x(r);
    }
  }
}
function id(e, t, n) {
  dl() && (fm(e, t, n, ke(n, t)), (n.flags & 64) === 64 && dd(e, t, n));
}
function sd(e, t, n = ke) {
  let r = t.localNames;
  if (r !== null) {
    let o = t.index + 1;
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s];
      e[o++] = a;
    }
  }
}
function ad(e) {
  let t = e.tView;
  return t === null || t.incompleteFirstPass
    ? (e.tView = _a(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : t;
}
function _a(e, t, n, r, o, i, s, a, c, u, l) {
  let d = fe + r,
    h = d + o,
    f = nm(d, h),
    p = typeof u == "function" ? u() : u;
  return (f[M] = {
    type: e,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: h,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof i == "function" ? i() : i,
    pipeRegistry: typeof s == "function" ? s() : s,
    firstChild: null,
    schemas: c,
    consts: p,
    incompleteFirstPass: !1,
    ssrId: l,
  });
}
function nm(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : Qe);
  return n;
}
function rm(e, t, n, r) {
  let i = r.get(Ng, Gl) || n === Fe.ShadowDom,
    s = e.selectRootElement(t, i);
  return om(s), s;
}
function om(e) {
  im(e);
}
var im = () => null;
function sm(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    Rp() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: t,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Cu(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue;
    let s = t[i];
    if (s === void 0) continue;
    r ??= {};
    let a,
      c = st.None;
    Array.isArray(s) ? ((a = s[0]), (c = s[1])) : (a = s);
    let u = i;
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue;
      u = o[i];
    }
    e === 0 ? wu(r, n, u, a, c) : wu(r, n, u, a);
  }
  return r;
}
function wu(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function am(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    a = [],
    c = null,
    u = null;
  for (let l = r; l < o; l++) {
    let d = i[l],
      h = n ? n.get(d) : null,
      f = h ? h.inputs : null,
      p = h ? h.outputs : null;
    (c = Cu(0, d.inputs, l, c, f)), (u = Cu(1, d.outputs, l, u, p));
    let g = c !== null && s !== null && !Js(t) ? wm(c, l, s) : null;
    a.push(g);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (t.flags |= 8),
    c.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = c),
    (t.outputs = u);
}
function cm(e) {
  return e === "class"
    ? "className"
    : e === "for"
    ? "htmlFor"
    : e === "formaction"
    ? "formAction"
    : e === "innerHtml"
    ? "innerHTML"
    : e === "readonly"
    ? "readOnly"
    : e === "tabindex"
    ? "tabIndex"
    : e;
}
function cd(e, t, n, r, o, i, s, a) {
  let c = ke(t, n),
    u = t.inputs,
    l;
  !a && u != null && (l = u[r])
    ? (Ma(e, n, l, r, o), xo(t) && um(n, t.index))
    : t.type & 3
    ? ((r = cm(r)),
      (o = s != null ? s(o, t.value || "", r) : o),
      i.setProperty(c, r, o))
    : t.type & 12;
}
function um(e, t) {
  let n = ct(t, e);
  n[E] & 16 || (n[E] |= 64);
}
function ud(e, t, n, r) {
  if (dl()) {
    let o = r === null ? null : { "": -1 },
      i = pm(e, n),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && ld(e, t, n, s, o, a),
      o && gm(n, r, o);
  }
  n.mergedAttrs = Fn(n.mergedAttrs, n.attrs);
}
function ld(e, t, n, r, o, i) {
  for (let u = 0; u < r.length; u++) ys(co(n, t), e, r[u].type);
  ym(n, e.data.length, r.length);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    c = nd(e, t, r.length, null);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    (n.mergedAttrs = Fn(n.mergedAttrs, l.hostAttrs)),
      vm(e, n, t, c, l),
      mm(c, l, o),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64);
    let d = l.type.prototype;
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      c++;
  }
  am(e, n, i);
}
function lm(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    dm(s) != a && s.push(a), s.push(n, r, i);
  }
}
function dm(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function fm(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  xo(n) && Dm(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || co(n, t),
    xt(r, t);
  let s = n.initialInputs;
  for (let a = o; a < i; a++) {
    let c = e.data[a],
      u = tn(t, e, a, n);
    if ((xt(u, t), s !== null && Cm(t, a - o, u, c, n, s), at(c))) {
      let l = ct(n.index, t);
      l[re] = tn(t, e, a, n);
    }
  }
}
function dd(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = Gp();
  try {
    Mt(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        u = t[a];
      fs(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          hm(c, u);
    }
  } finally {
    Mt(-1), fs(s);
  }
}
function hm(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function pm(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (tp(t, s.selectors, !1))
        if ((r || (r = []), at(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s);
            let c = a.length;
            Ts(e, t, c);
          } else r.unshift(s), Ts(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function Ts(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function gm(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new I(-301, !1);
      r.push(t[o], i);
    }
  }
}
function mm(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    at(t) && (n[""] = e);
  }
}
function ym(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function vm(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = _t(o.type, !0)),
    s = new Tt(i, at(o), $);
  (e.blueprint[r] = s), (n[r] = s), lm(e, t, r, nd(e, n, o.hostVars, Qe), o);
}
function Dm(e, t, n) {
  let r = ke(t, e),
    o = ad(n),
    i = e[Re].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = Ia(
    e,
    Ro(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null)
  );
  e[t.index] = a;
}
function Cm(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        u = s[a++],
        l = s[a++],
        d = s[a++];
      td(r, n, c, u, l, d);
    }
}
function wm(e, t, n) {
  let r = null,
    o = 0;
  for (; o < n.length; ) {
    let i = n[o];
    if (i === 0) {
      o += 4;
      continue;
    } else if (i === 5) {
      o += 2;
      continue;
    }
    if (typeof i == "number") break;
    if (e.hasOwnProperty(i)) {
      r === null && (r = []);
      let s = e[i];
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          r.push(i, s[a + 1], s[a + 2], n[o + 1]);
          break;
        }
    }
    o += 2;
  }
  return r;
}
function Em(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function fd(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = x(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          gl(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      x(r);
    }
  }
}
function Ia(e, t) {
  return e[kn] ? (e[au][Ie] = t) : (e[kn] = t), (e[au] = t), t;
}
function xs(e, t, n) {
  gl(0);
  let r = x(null);
  try {
    t(e, n);
  } finally {
    x(r);
  }
}
function bm(e) {
  return (e[oo] ??= []);
}
function _m(e) {
  return (e.cleanup ??= []);
}
function hd(e, t) {
  let n = e[Kt],
    r = n ? n.get(ze, null) : null;
  r && r.handleError(t);
}
function Ma(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      c = n[i++],
      u = t[s],
      l = e.data[s];
    td(l, u, r, a, c, o);
  }
}
function Im(e, t, n) {
  let r = sl(t, e);
  kg(e[oe], r, n);
}
function Mm(e, t) {
  let n = ct(t, e),
    r = n[M];
  Tm(r, n);
  let o = n[Ye];
  o !== null && n[Pn] === null && (n[Pn] = ma(o, n[Kt])), Ta(r, n, n[re]);
}
function Tm(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Ta(e, t, n) {
  sa(t);
  try {
    let r = e.viewQuery;
    r !== null && xs(1, r, n);
    let o = e.template;
    o !== null && rd(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[Xt]?.finishViewCreation(e),
      e.staticContentQueries && fd(e, t),
      e.staticViewQueries && xs(2, e.viewQuery, n);
    let i = e.components;
    i !== null && xm(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[E] &= -5), aa();
  }
}
function xm(e, t) {
  for (let n = 0; n < t.length; n++) Mm(e, t[n]);
}
function xa(e, t, n, r) {
  let o = x(null);
  try {
    let i = t.tView,
      a = e[E] & 4096 ? 4096 : 16,
      c = Ro(
        e,
        i,
        n,
        a,
        null,
        t,
        null,
        null,
        r?.injector ?? null,
        r?.embeddedViewInjector ?? null,
        r?.dehydratedView ?? null
      ),
      u = e[t.index];
    c[Jt] = u;
    let l = e[Xt];
    return l !== null && (c[Xt] = l.createEmbeddedView(i)), Ta(i, c, n), c;
  } finally {
    x(o);
  }
}
function pd(e, t) {
  let n = le + t;
  if (n < e.length) return e[n];
}
function Sa(e, t) {
  return !t || t.firstChild === null || Vl(e);
}
function Na(e, t, n, r = !0) {
  let o = t[M];
  if ((Bg(o, t, e, n), r)) {
    let s = Ms(n, e),
      a = t[oe],
      c = zg(a, e[Ln]);
    c !== null && Vg(o, e[Pe], a, t, c, s);
  }
  let i = t[Pn];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function gd(e, t) {
  let n = Ca(e, t);
  return n !== void 0 && wa(n[M], n), n;
}
function po(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(Ge(i)), Nt(i) && Sm(i, r);
    let s = n.type;
    if (s & 8) po(e, t, n.child, r);
    else if (s & 32) {
      let a = va(n, t),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = Kl(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = It(t[Me]);
        po(c[M], c, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function Sm(e, t) {
  for (let n = le; n < e.length; n++) {
    let r = e[n],
      o = r[M].firstChild;
    o !== null && po(r[M], r, o, t);
  }
  e[Ln] !== e[Ye] && t.push(e[Ln]);
}
var md = [];
function Nm(e) {
  return e[ye] ?? Am(e);
}
function Am(e) {
  let t = md.pop() ?? Object.create(Fm);
  return (t.lView = e), t;
}
function Om(e) {
  e.lView[ye] !== e && ((e.lView = null), md.push(e));
}
var Fm = G(R({}, bn), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    No(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[ye] = this;
  },
});
function Rm(e) {
  let t = e[ye] ?? Object.create(Pm);
  return (t.lView = e), t;
}
var Pm = G(R({}, bn), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    let t = It(e.lView);
    for (; t && !yd(t[M]); ) t = It(t);
    t && cl(t);
  },
  consumerOnSignalRead() {
    this.lView[ye] = this;
  },
});
function yd(e) {
  return e.type !== 2;
}
var km = 100;
function vd(e, t = !0, n = 0) {
  let r = e[Re],
    o = r.rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    Lm(e, n);
  } catch (s) {
    throw (t && hd(e, s), s);
  } finally {
    i || (o.end?.(), r.inlineEffectRunner?.flush());
  }
}
function Lm(e, t) {
  let n = pl();
  try {
    uu(!0), Ss(e, t);
    let r = 0;
    for (; So(e); ) {
      if (r === km) throw new I(103, !1);
      r++, Ss(e, 1);
    }
  } finally {
    uu(n);
  }
}
function Vm(e, t, n, r) {
  let o = t[E];
  if ((o & 256) === 256) return;
  let i = !1,
    s = !1;
  !i && t[Re].inlineEffectRunner?.flush(), sa(t);
  let a = !0,
    c = null,
    u = null;
  i ||
    (yd(e)
      ? ((u = Nm(t)), (c = Cr(u)))
      : ac() === null
      ? ((a = !1), (u = Rm(t)), (c = Cr(u)))
      : t[ye] && (Ai(t[ye]), (t[ye] = null)));
  try {
    al(t), Bp(e.bindingStartIndex), n !== null && rd(e, t, n, 2, r);
    let l = (o & 3) === 3;
    if (!i)
      if (l) {
        let f = e.preOrderCheckHooks;
        f !== null && Kr(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && Jr(t, f, 0, null), qi(t, 0);
      }
    if ((s || jm(t), Dd(t, 0), e.contentQueries !== null && fd(e, t), !i))
      if (l) {
        let f = e.contentCheckHooks;
        f !== null && Kr(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && Jr(t, f, 1), qi(t, 1);
      }
    em(e, t);
    let d = e.components;
    d !== null && wd(t, d, 0);
    let h = e.viewQuery;
    if ((h !== null && xs(2, h, r), !i))
      if (l) {
        let f = e.viewCheckHooks;
        f !== null && Kr(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && Jr(t, f, 2), qi(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[Wi])) {
      for (let f of t[Wi]) f();
      t[Wi] = null;
    }
    i || (t[E] &= -73);
  } catch (l) {
    throw (i || No(t), l);
  } finally {
    u !== null && (Si(u, c), a && Om(u)), aa();
  }
}
function Dd(e, t) {
  for (let n = Bl(e); n !== null; n = $l(n))
    for (let r = le; r < n.length; r++) {
      let o = n[r];
      Cd(o, t);
    }
}
function jm(e) {
  for (let t = Bl(e); t !== null; t = $l(t)) {
    if (!(t[E] & so.HasTransplantedViews)) continue;
    let n = t[io];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      cl(o);
    }
  }
}
function Bm(e, t, n) {
  let r = ct(t, e);
  Cd(r, n);
}
function Cd(e, t) {
  ia(e) && Ss(e, t);
}
function Ss(e, t) {
  let r = e[M],
    o = e[E],
    i = e[ye],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Ni(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[E] &= -9217),
    s)
  )
    Vm(r, e, r.template, e[re]);
  else if (o & 8192) {
    Dd(e, 1);
    let a = r.components;
    a !== null && wd(e, a, 1);
  }
}
function wd(e, t, n) {
  for (let r = 0; r < t.length; r++) Bm(e, t[r], n);
}
function Aa(e, t) {
  let n = pl() ? 64 : 1088;
  for (e[Re].changeDetectionScheduler?.notify(t); e; ) {
    e[E] |= n;
    let r = It(e);
    if (us(e) && !r) return e;
    e = r;
  }
  return null;
}
var Vn = class {
  get rootNodes() {
    let t = this._lView,
      n = t[M];
    return po(n, t, n.firstChild, []);
  }
  constructor(t, n, r = !0) {
    (this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r),
      (this._appRef = null),
      (this._attachedToViewContainer = !1);
  }
  get context() {
    return this._lView[re];
  }
  set context(t) {
    this._lView[re] = t;
  }
  get destroyed() {
    return (this._lView[E] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[ve];
      if (Nt(t)) {
        let n = t[Ep],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (Ca(t, r), ju(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    wa(this._lView[M], this._lView);
  }
  onDestroy(t) {
    ul(this._lView, t);
  }
  markForCheck() {
    Aa(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[E] &= -129;
  }
  reattach() {
    ds(this._lView), (this._lView[E] |= 128);
  }
  detectChanges() {
    (this._lView[E] |= 1024), vd(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new I(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = us(this._lView),
      n = this._lView[Jt];
    n !== null && !t && Da(n, this._lView), Zl(this._lView[M], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new I(902, !1);
    this._appRef = t;
    let n = us(this._lView),
      r = this._lView[Jt];
    r !== null && !n && Yl(r, this._lView), ds(this._lView);
  }
};
var A_ = new RegExp(`^(\\d+)*(${xg}|${Tg})*(.*)`);
var $m = () => null;
function Oa(e, t) {
  return $m(e, t);
}
var rn = class {},
  ko = new C("", { providedIn: "root", factory: () => !1 });
var Ed = new C(""),
  bd = new C(""),
  Ns = class {},
  go = class {};
function Um(e) {
  let t = Error(`No component factory found for ${me(e)}.`);
  return (t[Hm] = e), t;
}
var Hm = "ngComponent";
var As = class {
    resolveComponentFactory(t) {
      throw Um(t);
    }
  },
  jn = class {
    static {
      this.NULL = new As();
    }
  },
  on = class {},
  zn = (() => {
    class e {
      constructor() {
        this.destroyNode = null;
      }
      static {
        this.__NG_ELEMENT_ID__ = () => Gm();
      }
    }
    return e;
  })();
function Gm() {
  let e = L(),
    t = xe(),
    n = ct(t.index, e);
  return (it(n) ? n : e)[oe];
}
var zm = (() => {
  class e {
    static {
      this.ɵprov = b({ token: e, providedIn: "root", factory: () => null });
    }
  }
  return e;
})();
function Os(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = Kc(o, a);
      else if (i == 2) {
        let c = a,
          u = t[++s];
        r = Kc(r, c + ": " + u + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var Fs = class extends jn {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = _o(t);
    return new Rs(n, this.ngModule);
  }
};
function Eu(e, t) {
  let n = [];
  for (let r in e) {
    if (!e.hasOwnProperty(r)) continue;
    let o = e[r];
    if (o === void 0) continue;
    let i = Array.isArray(o),
      s = i ? o[0] : o,
      a = i ? o[1] : st.None;
    t
      ? n.push({
          propName: s,
          templateName: r,
          isSignal: (a & st.SignalBased) !== 0,
        })
      : n.push({ propName: s, templateName: r });
  }
  return n;
}
function Wm(e) {
  let t = e.toLowerCase();
  return t === "svg" ? Mp : t === "math" ? Tp : null;
}
var Rs = class extends go {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = Eu(t.inputs, !0);
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
      return r;
    }
    get outputs() {
      return Eu(this.componentDef.outputs, !1);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = ip(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n);
    }
    create(t, n, r, o) {
      let i = x(null);
      try {
        o = o || this.ngModule;
        let s = o instanceof He ? o : o?.injector;
        s &&
          this.componentDef.getStandaloneInjector !== null &&
          (s = this.componentDef.getStandaloneInjector(s) || s);
        let a = s ? new hs(t, s) : t,
          c = a.get(on, null);
        if (c === null) throw new I(407, !1);
        let u = a.get(zm, null),
          l = a.get(rn, null),
          d = {
            rendererFactory: c,
            sanitizer: u,
            inlineEffectRunner: null,
            changeDetectionScheduler: l,
          },
          h = c.createRenderer(null, this.componentDef),
          f = this.componentDef.selectors[0][0] || "div",
          p = r
            ? rm(h, r, this.componentDef.encapsulation, a)
            : ql(h, f, Wm(f)),
          g = 512;
        this.componentDef.signals
          ? (g |= 4096)
          : this.componentDef.onPush || (g |= 16);
        let D = null;
        p !== null && (D = ma(p, a, !0));
        let w = _a(0, null, null, 1, 0, null, null, null, null, null, null),
          F = Ro(null, w, null, g, null, null, d, h, a, null, D);
        sa(F);
        let k,
          ee,
          ce = null;
        try {
          let W = this.componentDef,
            je,
            Ii = null;
          W.findHostDirectiveDefs
            ? ((je = []),
              (Ii = new Map()),
              W.findHostDirectiveDefs(W, je, Ii),
              je.push(W))
            : (je = [W]);
          let qf = qm(F, p);
          (ce = Zm(qf, p, W, je, F, d, h)),
            (ee = oa(w, fe)),
            p && Km(h, W, p, r),
            n !== void 0 && Jm(ee, this.ngContentSelectors, n),
            (k = Qm(ce, W, je, Ii, F, [Xm])),
            Ta(w, F, null);
        } catch (W) {
          throw (ce !== null && bs(ce), bs(F), W);
        } finally {
          aa();
        }
        return new Ps(this.componentType, k, Ll(ee, F), F, ee);
      } finally {
        x(i);
      }
    }
  },
  Ps = class extends Ns {
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new Vn(o, void 0, !1)),
        (this.componentType = t);
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        o;
      if (r !== null && (o = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return;
        let i = this._rootLView;
        Ma(i[M], i, o, t, n), this.previousInputValues.set(t, n);
        let s = ct(this._tNode.index, i);
        Aa(s, 1);
      }
    }
    get injector() {
      return new uo(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(t) {
      this.hostView.onDestroy(t);
    }
  };
function qm(e, t) {
  let n = e[M],
    r = fe;
  return (e[r] = t), Po(n, r, 2, "#host", null);
}
function Zm(e, t, n, r, o, i, s) {
  let a = o[M];
  Ym(r, e, t, s);
  let c = null;
  t !== null && (c = ma(t, o[Kt]));
  let u = i.rendererFactory.createRenderer(t, n),
    l = 16;
  n.signals ? (l = 4096) : n.onPush && (l = 64);
  let d = Ro(o, ad(n), null, l, o[e.index], e, i, u, null, null, c);
  return (
    a.firstCreatePass && Ts(a, e, r.length - 1), Ia(o, d), (o[e.index] = d)
  );
}
function Ym(e, t, n, r) {
  for (let o of e) t.mergedAttrs = Fn(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (Os(t, t.mergedAttrs, !0), n !== null && Xl(r, n, t));
}
function Qm(e, t, n, r, o, i) {
  let s = xe(),
    a = o[M],
    c = ke(s, o);
  ld(a, o, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      h = tn(o, a, d, s);
    xt(h, o);
  }
  dd(a, o, s), c && xt(c, o);
  let u = tn(o, a, s.directiveStart + s.componentOffset, s);
  if (((e[re] = o[re] = u), i !== null)) for (let l of i) l(u, t);
  return od(a, s, o), u;
}
function Km(e, t, n, r) {
  if (r) is(e, n, ["ng-version", "18.2.14"]);
  else {
    let { attrs: o, classes: i } = sp(t.selectors[0]);
    o && is(e, n, o), i && i.length > 0 && Jl(e, n, i.join(" "));
  }
}
function Jm(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null ? Array.from(i) : null);
  }
}
function Xm() {
  let e = xe();
  la(L()[M], e);
}
var ey = () => !1;
function ty(e, t, n) {
  return ey(e, t, n);
}
var bu = new Set();
function lt(e) {
  bu.has(e) ||
    (bu.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
function Ft(e, t) {
  lt("NgSignals");
  let n = vc(e),
    r = n[tt];
  return (
    t?.equal && (r.equal = t.equal),
    (n.set = (o) => Oi(r, o)),
    (n.update = (o) => Dc(r, o)),
    (n.asReadonly = ny.bind(n)),
    n
  );
}
function ny() {
  let e = this[tt];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    (t[tt] = e), (e.readonlyFn = t);
  }
  return e.readonlyFn;
}
function ry(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function dt(e) {
  let t = ry(e.type),
    n = !0,
    r = [e];
  for (; t; ) {
    let o;
    if (at(e)) o = t.ɵcmp || t.ɵdir;
    else {
      if (t.ɵcmp) throw new I(903, !1);
      o = t.ɵdir;
    }
    if (o) {
      if (n) {
        r.push(o);
        let s = e;
        (s.inputs = qr(e.inputs)),
          (s.inputTransforms = qr(e.inputTransforms)),
          (s.declaredInputs = qr(e.declaredInputs)),
          (s.outputs = qr(e.outputs));
        let a = o.hostBindings;
        a && cy(e, a);
        let c = o.viewQuery,
          u = o.contentQueries;
        if (
          (c && sy(e, c),
          u && ay(e, u),
          oy(e, o),
          Ih(e.outputs, o.outputs),
          at(o) && o.data.animation)
        ) {
          let l = e.data;
          l.animation = (l.animation || []).concat(o.data.animation);
        }
      }
      let i = o.features;
      if (i)
        for (let s = 0; s < i.length; s++) {
          let a = i[s];
          a && a.ngInherit && a(e), a === dt && (n = !1);
        }
    }
    t = Object.getPrototypeOf(t);
  }
  iy(r);
}
function oy(e, t) {
  for (let n in t.inputs) {
    if (!t.inputs.hasOwnProperty(n) || e.inputs.hasOwnProperty(n)) continue;
    let r = t.inputs[n];
    if (
      r !== void 0 &&
      ((e.inputs[n] = r),
      (e.declaredInputs[n] = t.declaredInputs[n]),
      t.inputTransforms !== null)
    ) {
      let o = Array.isArray(r) ? r[0] : r;
      if (!t.inputTransforms.hasOwnProperty(o)) continue;
      (e.inputTransforms ??= {}), (e.inputTransforms[o] = t.inputTransforms[o]);
    }
  }
}
function iy(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    (o.hostVars = t += o.hostVars),
      (o.hostAttrs = Fn(o.hostAttrs, (n = Fn(n, o.hostAttrs))));
  }
}
function qr(e) {
  return e === Yt ? {} : e === ge ? [] : e;
}
function sy(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.viewQuery = t);
}
function ay(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i);
      })
    : (e.contentQueries = t);
}
function cy(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.hostBindings = t);
}
var sn = class {};
var mo = class extends sn {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new Fs(this)),
      (this.instance = null);
    let n = new Rn(
      [
        ...t.providers,
        { provide: sn, useValue: this },
        { provide: jn, useValue: this.componentFactoryResolver },
      ],
      t.parent || na(),
      t.debugName,
      new Set(["environment"])
    );
    (this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(t) {
    this.injector.onDestroy(t);
  }
};
function uy(e, t, n = null) {
  return new mo({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
function ly(e, t, n) {
  return (e[t] = n);
}
function fn(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function dy(e) {
  return (e.flags & 32) === 32;
}
function fy(e, t, n, r, o, i, s, a, c) {
  let u = t.consts,
    l = Po(t, e, 4, s || null, a || null);
  ud(t, n, l, en(u, c)), la(t, l);
  let d = (l.tView = _a(
    2,
    l,
    r,
    o,
    i,
    t.directiveRegistry,
    t.pipeRegistry,
    null,
    t.schemas,
    u,
    null
  ));
  return (
    t.queries !== null &&
      (t.queries.template(t, l), (d.queries = t.queries.embeddedTView(l))),
    l
  );
}
function ks(e, t, n, r, o, i, s, a, c, u) {
  let l = n + fe,
    d = t.firstCreatePass ? fy(l, t, e, r, o, i, s, a, c) : t.data[l];
  Hn(d, !1);
  let h = hy(t, e, d, n);
  ca() && Ea(t, e, h, d), xt(h, e);
  let f = Em(h, e, h, d);
  return (
    (e[l] = f),
    Ia(e, f),
    ty(f, d, e),
    ra(d) && id(t, e, d),
    c != null && sd(e, d, u),
    d
  );
}
function Wn(e, t, n, r, o, i, s, a) {
  let c = L(),
    u = he(),
    l = en(u.consts, i);
  return ks(c, u, e, t, n, r, o, l, s, a), Wn;
}
var hy = py;
function py(e, t, n, r) {
  return ua(!0), t[oe].createComment("");
}
var Sn = (function (e) {
    return (
      (e[(e.EarlyRead = 0)] = "EarlyRead"),
      (e[(e.Write = 1)] = "Write"),
      (e[(e.MixedReadWrite = 2)] = "MixedReadWrite"),
      (e[(e.Read = 3)] = "Read"),
      e
    );
  })(Sn || {}),
  gy = (() => {
    class e {
      constructor() {
        this.impl = null;
      }
      execute() {
        this.impl?.execute();
      }
      static {
        this.ɵprov = b({
          token: e,
          providedIn: "root",
          factory: () => new e(),
        });
      }
    }
    return e;
  })(),
  _u = class e {
    constructor() {
      (this.ngZone = v(z)),
        (this.scheduler = v(rn)),
        (this.errorHandler = v(ze, { optional: !0 })),
        (this.sequences = new Set()),
        (this.deferredRegistrations = new Set()),
        (this.executing = !1);
    }
    static {
      this.PHASES = [Sn.EarlyRead, Sn.Write, Sn.MixedReadWrite, Sn.Read];
    }
    execute() {
      this.executing = !0;
      for (let t of e.PHASES)
        for (let n of this.sequences)
          if (!(n.erroredOrDestroyed || !n.hooks[t]))
            try {
              n.pipelinedValue = this.ngZone.runOutsideAngular(() =>
                n.hooks[t](n.pipelinedValue)
              );
            } catch (r) {
              (n.erroredOrDestroyed = !0), this.errorHandler?.handleError(r);
            }
      this.executing = !1;
      for (let t of this.sequences)
        t.afterRun(), t.once && (this.sequences.delete(t), t.destroy());
      for (let t of this.deferredRegistrations) this.sequences.add(t);
      this.deferredRegistrations.size > 0 && this.scheduler.notify(7),
        this.deferredRegistrations.clear();
    }
    register(t) {
      this.executing
        ? this.deferredRegistrations.add(t)
        : (this.sequences.add(t), this.scheduler.notify(6));
    }
    unregister(t) {
      this.executing && this.sequences.has(t)
        ? ((t.erroredOrDestroyed = !0),
          (t.pipelinedValue = void 0),
          (t.once = !0))
        : (this.sequences.delete(t), this.deferredRegistrations.delete(t));
    }
    static {
      this.ɵprov = b({ token: e, providedIn: "root", factory: () => new e() });
    }
  };
function _d(e, t, n, r) {
  return fn(e, Ao(), n) ? t + Ys(n) + r : Qe;
}
function Zr(e, t) {
  return (e << 17) | (t << 2);
}
function St(e) {
  return (e >> 17) & 32767;
}
function my(e) {
  return (e & 2) == 2;
}
function yy(e, t) {
  return (e & 131071) | (t << 17);
}
function Ls(e) {
  return e | 2;
}
function an(e) {
  return (e & 131068) >> 2;
}
function Ji(e, t) {
  return (e & -131069) | (t << 2);
}
function vy(e) {
  return (e & 1) === 1;
}
function Vs(e) {
  return e | 1;
}
function Dy(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = St(s),
    c = an(s);
  e[r] = n;
  let u = !1,
    l;
  if (Array.isArray(n)) {
    let d = n;
    (l = d[1]), (l === null || $n(d, l) > 0) && (u = !0);
  } else l = n;
  if (o)
    if (c !== 0) {
      let h = St(e[a + 1]);
      (e[r + 1] = Zr(h, a)),
        h !== 0 && (e[h + 1] = Ji(e[h + 1], r)),
        (e[a + 1] = yy(e[a + 1], r));
    } else
      (e[r + 1] = Zr(a, 0)), a !== 0 && (e[a + 1] = Ji(e[a + 1], r)), (a = r);
  else
    (e[r + 1] = Zr(c, 0)),
      a === 0 ? (a = r) : (e[c + 1] = Ji(e[c + 1], r)),
      (c = r);
  u && (e[r + 1] = Ls(e[r + 1])),
    Iu(e, l, r, !0),
    Iu(e, l, r, !1),
    Cy(t, l, e, r, i),
    (s = Zr(a, c)),
    i ? (t.classBindings = s) : (t.styleBindings = s);
}
function Cy(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == "string" &&
    $n(i, t) >= 0 &&
    (n[r + 1] = Vs(n[r + 1]));
}
function Iu(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? St(o) : an(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let c = e[s],
      u = e[s + 1];
    wy(c, t) && ((a = !0), (e[s + 1] = r ? Vs(u) : Ls(u))),
      (s = r ? St(u) : an(u));
  }
  a && (e[n + 1] = r ? Ls(o) : Vs(o));
}
function wy(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == "string"
    ? $n(e, t) >= 0
    : !1;
}
function Se(e, t, n) {
  let r = L(),
    o = Ao();
  if (fn(r, o, t)) {
    let i = he(),
      s = wl();
    cd(i, s, r, e, t, r[oe], n, !1);
  }
  return Se;
}
function Mu(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? "class" : "style";
  Ma(e, n, i[s], s, r);
}
function Lo(e, t) {
  return Ey(e, t, null, !0), Lo;
}
function Ey(e, t, n, r) {
  let o = L(),
    i = he(),
    s = $p(2);
  if ((i.firstUpdatePass && _y(i, e, s, r), t !== Qe && fn(o, s, t))) {
    let a = i.data[At()];
    Sy(i, a, o, o[oe], e, (o[s + 1] = Ny(t, n)), r, s);
  }
}
function by(e, t) {
  return t >= e.expandoStartIndex;
}
function _y(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[At()],
      s = by(e, n);
    Ay(i, r) && t === null && !s && (t = !1),
      (t = Iy(o, i, t, r)),
      Dy(o, i, t, n, s, r);
  }
}
function Iy(e, t, n, r) {
  let o = zp(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = Xi(null, e, t, n, r)), (n = Bn(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = Xi(o, e, t, n, r)), i === null)) {
        let c = My(e, t, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Xi(null, e, t, c[1], r)),
          (c = Bn(c, t.attrs, r)),
          Ty(e, t, r, c));
      } else i = xy(e, t, r);
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n
  );
}
function My(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (an(r) !== 0) return e[St(r)];
}
function Ty(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[St(o)] = r;
}
function xy(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = Bn(r, s, n);
  }
  return Bn(r, t.attrs, n);
}
function Xi(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = Bn(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return e !== null && (n.directiveStylingLast = a), r;
}
function Bn(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number"
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
          Wh(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function Sy(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let c = e.data,
    u = c[a + 1],
    l = vy(u) ? Tu(c, t, n, o, an(u), s) : void 0;
  if (!yo(l)) {
    yo(i) || (my(u) && (i = Tu(c, null, n, o, a, s)));
    let d = sl(At(), n);
    Jg(r, s, d, o, i);
  }
}
function Tu(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      u = Array.isArray(c),
      l = u ? c[1] : c,
      d = l === null,
      h = n[o + 1];
    h === Qe && (h = d ? ge : void 0);
    let f = d ? Gi(h, r) : l === r ? h : void 0;
    if ((u && !yo(f) && (f = Gi(c, r)), yo(f) && ((a = f), s))) return a;
    let p = e[o + 1];
    o = s ? St(p) : an(p);
  }
  if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = Gi(c, r));
  }
  return a;
}
function yo(e) {
  return e !== void 0;
}
function Ny(e, t) {
  return (
    e == null ||
      e === "" ||
      (typeof t == "string"
        ? (e = e + t)
        : typeof e == "object" && (e = me(Oo(e)))),
    e
  );
}
function Ay(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
var js = class {
  destroy(t) {}
  updateValue(t, n) {}
  swap(t, n) {
    let r = Math.min(t, n),
      o = Math.max(t, n),
      i = this.detach(o);
    if (o - r > 1) {
      let s = this.detach(r);
      this.attach(r, i), this.attach(o, s);
    } else this.attach(r, i);
  }
  move(t, n) {
    this.attach(n, this.detach(t));
  }
};
function es(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function Oy(e, t, n) {
  let r,
    o,
    i = 0,
    s = e.length - 1,
    a = void 0;
  if (Array.isArray(t)) {
    let c = t.length - 1;
    for (; i <= s && i <= c; ) {
      let u = e.at(i),
        l = t[i],
        d = es(i, u, i, l, n);
      if (d !== 0) {
        d < 0 && e.updateValue(i, l), i++;
        continue;
      }
      let h = e.at(s),
        f = t[c],
        p = es(s, h, c, f, n);
      if (p !== 0) {
        p < 0 && e.updateValue(s, f), s--, c--;
        continue;
      }
      let g = n(i, u),
        D = n(s, h),
        w = n(i, l);
      if (Object.is(w, D)) {
        let F = n(c, f);
        Object.is(F, g)
          ? (e.swap(i, s), e.updateValue(s, f), c--, s--)
          : e.move(s, i),
          e.updateValue(i, l),
          i++;
        continue;
      }
      if (((r ??= new vo()), (o ??= Su(e, i, s, n)), Bs(e, r, i, w)))
        e.updateValue(i, l), i++, s++;
      else if (o.has(w)) r.set(g, e.detach(i)), s--;
      else {
        let F = e.create(i, t[i]);
        e.attach(i, F), i++, s++;
      }
    }
    for (; i <= c; ) xu(e, r, n, i, t[i]), i++;
  } else if (t != null) {
    let c = t[Symbol.iterator](),
      u = c.next();
    for (; !u.done && i <= s; ) {
      let l = e.at(i),
        d = u.value,
        h = es(i, l, i, d, n);
      if (h !== 0) h < 0 && e.updateValue(i, d), i++, (u = c.next());
      else {
        (r ??= new vo()), (o ??= Su(e, i, s, n));
        let f = n(i, d);
        if (Bs(e, r, i, f)) e.updateValue(i, d), i++, s++, (u = c.next());
        else if (!o.has(f))
          e.attach(i, e.create(i, d)), i++, s++, (u = c.next());
        else {
          let p = n(i, l);
          r.set(p, e.detach(i)), s--;
        }
      }
    }
    for (; !u.done; ) xu(e, r, n, e.length, u.value), (u = c.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((c) => {
    e.destroy(c);
  });
}
function Bs(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function xu(e, t, n, r, o) {
  if (Bs(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function Su(e, t, n, r) {
  let o = new Set();
  for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
  return o;
}
var vo = class {
  constructor() {
    (this.kvMap = new Map()), (this._vMap = void 0);
  }
  has(t) {
    return this.kvMap.has(t);
  }
  delete(t) {
    if (!this.has(t)) return !1;
    let n = this.kvMap.get(t);
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(t),
      !0
    );
  }
  get(t) {
    return this.kvMap.get(t);
  }
  set(t, n) {
    if (this.kvMap.has(t)) {
      let r = this.kvMap.get(t);
      this._vMap === void 0 && (this._vMap = new Map());
      let o = this._vMap;
      for (; o.has(r); ) r = o.get(r);
      o.set(r, n);
    } else this.kvMap.set(t, n);
  }
  forEach(t) {
    for (let [n, r] of this.kvMap)
      if ((t(r, n), this._vMap !== void 0)) {
        let o = this._vMap;
        for (; o.has(r); ) (r = o.get(r)), t(r, n);
      }
  }
};
function Vo(e, t) {
  lt("NgControlFlow");
  let n = L(),
    r = Ao(),
    o = n[r] !== Qe ? n[r] : -1,
    i = o !== -1 ? Do(n, fe + o) : void 0,
    s = 0;
  if (fn(n, r, e)) {
    let a = x(null);
    try {
      if ((i !== void 0 && gd(i, s), e !== -1)) {
        let c = fe + e,
          u = Do(n, c),
          l = Gs(n[M], c),
          d = Oa(u, l.tView.ssrId),
          h = xa(n, l, t, { dehydratedView: d });
        Na(u, h, s, Sa(l, d));
      }
    } finally {
      x(a);
    }
  } else if (i !== void 0) {
    let a = pd(i, s);
    a !== void 0 && (a[re] = t);
  }
}
var $s = class {
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - le;
  }
};
var Us = class {
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function qn(e, t, n, r, o, i, s, a, c, u, l, d, h) {
  lt("NgControlFlow");
  let f = L(),
    p = he(),
    g = c !== void 0,
    D = L(),
    w = a ? s.bind(D[Me][re]) : s,
    F = new Us(g, w);
  (D[fe + e] = F),
    ks(f, p, e + 1, t, n, r, o, en(p.consts, i)),
    g && ks(f, p, e + 2, c, u, l, d, en(p.consts, h));
}
var Hs = class extends js {
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.operationsCounter = void 0),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - le;
  }
  at(t) {
    return this.getLView(t)[re].$implicit;
  }
  attach(t, n) {
    let r = n[Pn];
    (this.needsIndexUpdate ||= t !== this.length),
      Na(this.lContainer, n, t, Sa(this.templateTNode, r));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), Fy(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = Oa(this.lContainer, this.templateTNode.tView.ssrId),
      o = xa(
        this.hostLView,
        this.templateTNode,
        new $s(this.lContainer, n, t),
        { dehydratedView: r }
      );
    return this.operationsCounter?.recordCreate(), o;
  }
  destroy(t) {
    wa(t[M], t), this.operationsCounter?.recordDestroy();
  }
  updateValue(t, n) {
    this.getLView(t)[re].$implicit = n;
  }
  reset() {
    (this.needsIndexUpdate = !1), this.operationsCounter?.reset();
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[re].$index = t;
  }
  getLView(t) {
    return Ry(this.lContainer, t);
  }
};
function Zn(e) {
  let t = x(null),
    n = At();
  try {
    let r = L(),
      o = r[M],
      i = r[n],
      s = n + 1,
      a = Do(r, s);
    if (i.liveCollection === void 0) {
      let u = Gs(o, s);
      i.liveCollection = new Hs(a, r, u);
    } else i.liveCollection.reset();
    let c = i.liveCollection;
    if ((Oy(c, e, i.trackByFn), c.updateIndexes(), i.hasEmptyBlock)) {
      let u = Ao(),
        l = c.length === 0;
      if (fn(r, u, l)) {
        let d = n + 2,
          h = Do(r, d);
        if (l) {
          let f = Gs(o, d),
            p = Oa(h, f.tView.ssrId),
            g = xa(r, f, void 0, { dehydratedView: p });
          Na(h, g, 0, Sa(f, p));
        } else gd(h, 0);
      }
    }
  } finally {
    x(t);
  }
}
function Do(e, t) {
  return e[t];
}
function Fy(e, t) {
  return Ca(e, t);
}
function Ry(e, t) {
  return pd(e, t);
}
function Gs(e, t) {
  return oa(e, t);
}
function Py(e, t, n, r, o, i) {
  let s = t.consts,
    a = en(s, o),
    c = Po(t, e, 2, r, a);
  return (
    ud(t, n, c, en(s, i)),
    c.attrs !== null && Os(c, c.attrs, !1),
    c.mergedAttrs !== null && Os(c, c.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, c),
    c
  );
}
function m(e, t, n, r) {
  let o = L(),
    i = he(),
    s = fe + e,
    a = o[oe],
    c = i.firstCreatePass ? Py(s, i, o, t, n, r) : i.data[s],
    u = ky(i, o, c, a, t, e);
  o[s] = u;
  let l = ra(c);
  return (
    Hn(c, !0),
    Xl(a, u, c),
    !dy(c) && ca() && Ea(i, o, u, c),
    Ap() === 0 && xt(u, o),
    Op(),
    l && (id(i, o, c), od(i, c, o)),
    r !== null && sd(o, c),
    m
  );
}
function y() {
  let e = xe();
  hl() ? Vp() : ((e = e.parent), Hn(e, !1));
  let t = e;
  Pp(t) && kp(), Fp();
  let n = he();
  return (
    n.firstCreatePass && (la(n, e), tl(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      Jp(t) &&
      Mu(n, t, L(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Xp(t) &&
      Mu(n, t, L(), t.stylesWithoutHost, !1),
    y
  );
}
function J(e, t, n, r) {
  return m(e, t, n, r), y(), J;
}
var ky = (e, t, n, r, o, i) => (ua(!0), ql(r, o, Zp()));
function Rt() {
  return L();
}
var Co = "en-US";
var Ly = Co;
function Vy(e) {
  typeof e == "string" && (Ly = e.toLowerCase().replace(/_/g, "-"));
}
var jy = (e, t, n) => {};
function O(e, t, n, r) {
  let o = L(),
    i = he(),
    s = xe();
  return $y(i, o, o[oe], s, e, t, r), O;
}
function By(e, t, n, r) {
  let o = e.cleanup;
  if (o != null)
    for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[oo],
          c = o[i + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == "string" && (i += 2);
    }
  return null;
}
function $y(e, t, n, r, o, i, s) {
  let a = ra(r),
    u = e.firstCreatePass && _m(e),
    l = t[re],
    d = bm(t),
    h = !0;
  if (r.type & 3 || s) {
    let g = ke(r, t),
      D = s ? s(g) : g,
      w = d.length,
      F = s ? (ee) => s(Ge(ee[r.index])) : r.index,
      k = null;
    if ((!s && a && (k = By(e, t, o, r.index)), k !== null)) {
      let ee = k.__ngLastListenerFn__ || k;
      (ee.__ngNextListenerFn__ = i), (k.__ngLastListenerFn__ = i), (h = !1);
    } else {
      (i = Au(r, t, l, i)), jy(g, o, i);
      let ee = n.listen(D, o, i);
      d.push(i, ee), u && u.push(o, F, w, w + 1);
    }
  } else i = Au(r, t, l, i);
  let f = r.outputs,
    p;
  if (h && f !== null && (p = f[o])) {
    let g = p.length;
    if (g)
      for (let D = 0; D < g; D += 2) {
        let w = p[D],
          F = p[D + 1],
          ce = t[w][F].subscribe(i),
          W = d.length;
        d.push(i, ce), u && u.push(o, r.index, W, -(W + 1));
      }
  }
}
function Nu(e, t, n, r) {
  let o = x(null);
  try {
    return Ae(6, t, n), n(r) !== !1;
  } catch (i) {
    return hd(e, i), !1;
  } finally {
    Ae(7, t, n), x(o);
  }
}
function Au(e, t, n, r) {
  return function o(i) {
    if (i === Function) return r;
    let s = e.componentOffset > -1 ? ct(e.index, t) : t;
    Aa(s, 5);
    let a = Nu(t, n, r, i),
      c = o.__ngNextListenerFn__;
    for (; c; ) (a = Nu(t, n, c, i) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function we(e = 1) {
  return qp(e);
}
function Yn(e, t, n) {
  return jo(e, "", t, "", n), Yn;
}
function jo(e, t, n, r, o) {
  let i = L(),
    s = _d(i, t, n, r);
  if (s !== Qe) {
    let a = he(),
      c = wl();
    cd(a, c, i, e, s, i[oe], o, !1);
  }
  return jo;
}
function Uy(e, t, n, r) {
  n >= e.data.length && ((e.data[n] = null), (e.blueprint[n] = null)),
    (t[n] = r);
}
function V(e, t = "") {
  let n = L(),
    r = he(),
    o = e + fe,
    i = r.firstCreatePass ? Po(r, o, 1, t, null) : r.data[o],
    s = Hy(r, n, i, t, e);
  (n[o] = s), ca() && Ea(r, n, s, i), Hn(i, !1);
}
var Hy = (e, t, n, r, o) => (ua(!0), Pg(t[oe], r));
function Ne(e) {
  return de("", e, ""), Ne;
}
function de(e, t, n) {
  let r = L(),
    o = _d(r, e, t, n);
  return o !== Qe && Im(r, At(), o), de;
}
function Gy(e, t, n) {
  let r = he();
  if (r.firstCreatePass) {
    let o = at(e);
    zs(n, r.data, r.blueprint, o, !0), zs(t, r.data, r.blueprint, o, !1);
  }
}
function zs(e, t, n, r, o) {
  if (((e = ae(e)), Array.isArray(e)))
    for (let i = 0; i < e.length; i++) zs(e[i], t, n, r, o);
  else {
    let i = he(),
      s = L(),
      a = xe(),
      c = Qt(e) ? e : ae(e.provide),
      u = Ku(e),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      h = a.providerIndexes >> 20;
    if (Qt(e) || !e.multi) {
      let f = new Tt(u, o, $),
        p = ns(c, t, o ? l : l + h, d);
      p === -1
        ? (ys(co(a, s), i, c),
          ts(i, e, t.length),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(f),
          s.push(f))
        : ((n[p] = f), (s[p] = f));
    } else {
      let f = ns(c, t, l + h, d),
        p = ns(c, t, l, l + h),
        g = f >= 0 && n[f],
        D = p >= 0 && n[p];
      if ((o && !D) || (!o && !g)) {
        ys(co(a, s), i, c);
        let w = qy(o ? Wy : zy, n.length, o, r, u);
        !o && D && (n[p].providerFactory = w),
          ts(i, e, t.length, 0),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(w),
          s.push(w);
      } else {
        let w = Id(n[o ? p : f], u, !o && r);
        ts(i, e, f > -1 ? f : p, w);
      }
      !o && r && D && n[p].componentProviders++;
    }
  }
}
function ts(e, t, n, r) {
  let o = Qt(t),
    i = pp(t);
  if (o || i) {
    let c = (i ? ae(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
      let u = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let l = u.indexOf(n);
        l === -1 ? u.push(n, [r, c]) : u[l + 1].push(r, c);
      } else u.push(n, c);
    }
  }
}
function Id(e, t, n) {
  return n && e.componentProviders++, e.multi.push(t) - 1;
}
function ns(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function zy(e, t, n, r) {
  return Ws(this.multi, []);
}
function Wy(e, t, n, r) {
  let o = this.multi,
    i;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = tn(n, n[M], this.providerFactory.index, r);
    (i = a.slice(0, s)), Ws(o, i);
    for (let c = s; c < a.length; c++) i.push(a[c]);
  } else (i = []), Ws(o, i);
  return i;
}
function Ws(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function qy(e, t, n, r, o) {
  let i = new Tt(e, n, $);
  return (
    (i.multi = []),
    (i.index = t),
    (i.componentProviders = 0),
    Id(i, o, r && !n),
    i
  );
}
function Bo(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => Gy(r, o ? o(e) : e, t);
  };
}
var Zy = (() => {
  class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = Zu(!1, n.type),
          o =
            r.length > 0
              ? uy([r], this._injector, `Standalone[${n.type.name}]`)
              : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
    static {
      this.ɵprov = b({
        token: e,
        providedIn: "environment",
        factory: () => new e(T(He)),
      });
    }
  }
  return e;
})();
function X(e) {
  lt("NgStandalone"),
    (e.getStandaloneInjector = (t) =>
      t.get(Zy).getOrCreateStandaloneInjector(e));
}
function Yy(e, t) {
  let n = e[t];
  return n === Qe ? void 0 : n;
}
function Qy(e, t, n, r, o, i) {
  let s = t + n;
  return fn(e, s, o) ? ly(e, s + 1, i ? r.call(i, o) : r(o)) : Yy(e, s + 1);
}
function U(e, t) {
  let n = he(),
    r,
    o = e + fe;
  n.firstCreatePass
    ? ((r = Ky(t, n.pipeRegistry)),
      (n.data[o] = r),
      r.onDestroy && (n.destroyHooks ??= []).push(o, r.onDestroy))
    : (r = n.data[o]);
  let i = r.factory || (r.factory = _t(r.type, !0)),
    s,
    a = ue($);
  try {
    let c = ao(!1),
      u = i();
    return ao(c), Uy(n, L(), o, u), u;
  } finally {
    ue(a);
  }
}
function Ky(e, t) {
  if (t)
    for (let n = t.length - 1; n >= 0; n--) {
      let r = t[n];
      if (e === r.name) return r;
    }
}
function H(e, t, n) {
  let r = e + fe,
    o = L(),
    i = xp(o, r);
  return Jy(o, r) ? Qy(o, jp(), t, i.transform, n, i) : i.transform(n);
}
function Jy(e, t) {
  return e[M].data[t].pure;
}
var Md = new C("");
function Qn(e) {
  return !!e && typeof e.then == "function";
}
function Td(e) {
  return !!e && typeof e.subscribe == "function";
}
var Fa = new C(""),
  xd = (() => {
    class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, r) => {
            (this.resolve = n), (this.reject = r);
          })),
          (this.appInits = v(Fa, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = o();
          if (Qn(i)) n.push(i);
          else if (Td(i)) {
            let s = new Promise((a, c) => {
              i.subscribe({ complete: a, error: c });
            });
            n.push(s);
          }
        }
        let r = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            r();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && r(),
          (this.initialized = !0);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  Sd = new C("");
function Xy() {
  yc(() => {
    throw new I(600, !1);
  });
}
function ev(e) {
  return e.isBoundToModule;
}
var tv = 10;
function nv(e, t, n) {
  try {
    let r = n();
    return Qn(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
var hn = (() => {
  class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = v(Cg)),
        (this.afterRenderManager = v(gy)),
        (this.zonelessEnabled = v(ko)),
        (this.dirtyFlags = 0),
        (this.deferredDirtyFlags = 0),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new Q()),
        (this.afterTick = new Q()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = v(dn).hasPendingTasks.pipe(te((n) => !n))),
        (this._injector = v(He));
    }
    get allViews() {
      return [...this.externalTestViews.keys(), ...this._views];
    }
    get destroyed() {
      return this._destroyed;
    }
    whenStable() {
      let n;
      return new Promise((r) => {
        n = this.isStable.subscribe({
          next: (o) => {
            o && r();
          },
        });
      }).finally(() => {
        n.unsubscribe();
      });
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, r) {
      let o = n instanceof go;
      if (!this._injector.get(xd).done) {
        let h = !o && up(n),
          f = !1;
        throw new I(405, f);
      }
      let s;
      o ? (s = n) : (s = this._injector.get(jn).resolveComponentFactory(n)),
        this.componentTypes.push(s.componentType);
      let a = ev(s) ? void 0 : this._injector.get(sn),
        c = r || s.selector,
        u = s.create(nn.NULL, [], c, a),
        l = u.location.nativeElement,
        d = u.injector.get(Md, null);
      return (
        d?.registerApplication(l),
        u.onDestroy(() => {
          this.detachView(u.hostView),
            Xr(this.components, u),
            d?.unregisterApplication(l);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
    }
    _tick() {
      if (this._runningTick) throw new I(101, !1);
      let n = x(null);
      try {
        (this._runningTick = !0), this.synchronize();
      } catch (r) {
        this.internalErrorHandler(r);
      } finally {
        (this._runningTick = !1), x(n), this.afterTick.next();
      }
    }
    synchronize() {
      let n = null;
      this._injector.destroyed ||
        (n = this._injector.get(on, null, { optional: !0 })),
        (this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0);
      let r = 0;
      for (; this.dirtyFlags !== 0 && r++ < tv; ) this.synchronizeOnce(n);
    }
    synchronizeOnce(n) {
      if (
        ((this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0),
        this.dirtyFlags & 7)
      ) {
        let r = !!(this.dirtyFlags & 1);
        (this.dirtyFlags &= -8),
          (this.dirtyFlags |= 8),
          this.beforeRender.next(r);
        for (let { _lView: o, notifyErrorHandler: i } of this._views)
          rv(o, i, r, this.zonelessEnabled);
        if (
          ((this.dirtyFlags &= -5),
          this.syncDirtyFlagsWithViews(),
          this.dirtyFlags & 7)
        )
          return;
      } else n?.begin?.(), n?.end?.();
      this.dirtyFlags & 8 &&
        ((this.dirtyFlags &= -9), this.afterRenderManager.execute()),
        this.syncDirtyFlagsWithViews();
    }
    syncDirtyFlagsWithViews() {
      if (this.allViews.some(({ _lView: n }) => So(n))) {
        this.dirtyFlags |= 2;
        return;
      } else this.dirtyFlags &= -8;
    }
    attachView(n) {
      let r = n;
      this._views.push(r), r.attachToAppRef(this);
    }
    detachView(n) {
      let r = n;
      Xr(this._views, r), r.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let r = this._injector.get(Sd, []);
      [...this._bootstrapListeners, ...r].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()),
            this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return (
        this._destroyListeners.push(n), () => Xr(this._destroyListeners, n)
      );
    }
    destroy() {
      if (this._destroyed) throw new I(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function Xr(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function rv(e, t, n, r) {
  if (!n && !So(e)) return;
  vd(e, t, n && !r ? 0 : 1);
}
var ov = (() => {
    class e {
      constructor() {
        (this.zone = v(z)),
          (this.changeDetectionScheduler = v(rn)),
          (this.applicationRef = v(hn));
      }
      initialize() {
        this._onMicrotaskEmptySubscription ||
          (this._onMicrotaskEmptySubscription =
            this.zone.onMicrotaskEmpty.subscribe({
              next: () => {
                this.changeDetectionScheduler.runningTick ||
                  this.zone.run(() => {
                    this.applicationRef.tick();
                  });
              },
            }));
      }
      ngOnDestroy() {
        this._onMicrotaskEmptySubscription?.unsubscribe();
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  iv = new C("", { factory: () => !1 });
function Nd({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new z(G(R({}, Od()), { scheduleInRootZone: n }))),
    [
      { provide: z, useFactory: e },
      {
        provide: On,
        multi: !0,
        useFactory: () => {
          let r = v(ov, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: On,
        multi: !0,
        useFactory: () => {
          let r = v(sv);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: Ed, useValue: !0 } : [],
      { provide: bd, useValue: n ?? Fl },
    ]
  );
}
function Ad(e) {
  let t = e?.ignoreChangesOutsideZone,
    n = e?.scheduleInRootZone,
    r = Nd({
      ngZoneFactory: () => {
        let o = Od(e);
        return (
          (o.scheduleInRootZone = n),
          o.shouldCoalesceEventChangeDetection && lt("NgZone_CoalesceEvent"),
          new z(o)
        );
      },
      ignoreChangesOutsideZone: t,
      scheduleInRootZone: n,
    });
  return Io([{ provide: iv, useValue: !0 }, { provide: ko, useValue: !1 }, r]);
}
function Od(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var sv = (() => {
  class e {
    constructor() {
      (this.subscription = new se()),
        (this.initialized = !1),
        (this.zone = v(z)),
        (this.pendingTasks = v(dn));
    }
    initialize() {
      if (this.initialized) return;
      this.initialized = !0;
      let n = null;
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (n = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              z.assertNotInAngularZone(),
                queueMicrotask(() => {
                  n !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(n), (n = null));
                });
            })
          );
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            z.assertInAngularZone(), (n ??= this.pendingTasks.add());
          })
        );
    }
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
var av = (() => {
  class e {
    constructor() {
      (this.appRef = v(hn)),
        (this.taskService = v(dn)),
        (this.ngZone = v(z)),
        (this.zonelessEnabled = v(ko)),
        (this.disableScheduling = v(Ed, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < "u" && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new se()),
        (this.angularZoneId = this.zoneIsDefined
          ? this.ngZone._inner?.get(fo)
          : null),
        (this.scheduleInRootZone =
          !this.zonelessEnabled &&
          this.zoneIsDefined &&
          (v(bd, { optional: !0 }) ?? !1)),
        (this.cancelScheduledCallback = null),
        (this.useMicrotaskScheduler = !1),
        (this.runningTick = !1),
        (this.pendingRenderTaskId = null),
        this.subscriptions.add(
          this.appRef.afterTick.subscribe(() => {
            this.runningTick || this.cleanup();
          })
        ),
        this.subscriptions.add(
          this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          })
        ),
        (this.disableScheduling ||=
          !this.zonelessEnabled &&
          (this.ngZone instanceof Es || !this.zoneIsDefined));
    }
    notify(n) {
      if (!this.zonelessEnabled && n === 5) return;
      switch (n) {
        case 0: {
          this.appRef.dirtyFlags |= 2;
          break;
        }
        case 3:
        case 2:
        case 4:
        case 5:
        case 1: {
          this.appRef.dirtyFlags |= 4;
          break;
        }
        case 7: {
          this.appRef.deferredDirtyFlags |= 8;
          break;
        }
        case 9:
        case 8:
        case 6:
        case 10:
        default:
          this.appRef.dirtyFlags |= 8;
      }
      if (!this.shouldScheduleTick()) return;
      let r = this.useMicrotaskScheduler ? pu : Pl;
      (this.pendingRenderTaskId = this.taskService.add()),
        this.scheduleInRootZone
          ? (this.cancelScheduledCallback = Zone.root.run(() =>
              r(() => this.tick())
            ))
          : (this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() =>
              r(() => this.tick())
            ));
    }
    shouldScheduleTick() {
      return !(
        this.disableScheduling ||
        this.pendingRenderTaskId !== null ||
        this.runningTick ||
        this.appRef._runningTick ||
        (!this.zonelessEnabled &&
          this.zoneIsDefined &&
          Zone.current.get(fo + this.angularZoneId))
      );
    }
    tick() {
      if (this.runningTick || this.appRef.destroyed) return;
      !this.zonelessEnabled &&
        this.appRef.dirtyFlags & 7 &&
        (this.appRef.dirtyFlags |= 1);
      let n = this.taskService.add();
      try {
        this.ngZone.run(
          () => {
            (this.runningTick = !0), this.appRef._tick();
          },
          void 0,
          this.schedulerTickApplyArgs
        );
      } catch (r) {
        throw (this.taskService.remove(n), r);
      } finally {
        this.cleanup();
      }
      (this.useMicrotaskScheduler = !0),
        pu(() => {
          (this.useMicrotaskScheduler = !1), this.taskService.remove(n);
        });
    }
    ngOnDestroy() {
      this.subscriptions.unsubscribe(), this.cleanup();
    }
    cleanup() {
      if (
        ((this.runningTick = !1),
        this.cancelScheduledCallback?.(),
        (this.cancelScheduledCallback = null),
        this.pendingRenderTaskId !== null)
      ) {
        let n = this.pendingRenderTaskId;
        (this.pendingRenderTaskId = null), this.taskService.remove(n);
      }
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function cv() {
  return (typeof $localize < "u" && $localize.locale) || Co;
}
var Ra = new C("", {
  providedIn: "root",
  factory: () => v(Ra, A.Optional | A.SkipSelf) || cv(),
});
var qs = new C("");
function Yr(e) {
  return !e.moduleRef;
}
function uv(e) {
  let t = Yr(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(z);
  return n.run(() => {
    Yr(e)
      ? e.r3Injector.resolveInjectorInitializers()
      : e.moduleRef.resolveInjectorInitializers();
    let r = t.get(ze, null),
      o;
    if (
      (n.runOutsideAngular(() => {
        o = n.onError.subscribe({
          next: (i) => {
            r.handleError(i);
          },
        });
      }),
      Yr(e))
    ) {
      let i = () => t.destroy(),
        s = e.platformInjector.get(qs);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(qs);
      s.add(i),
        e.moduleRef.onDestroy(() => {
          Xr(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
    }
    return nv(r, n, () => {
      let i = t.get(xd);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get(Ra, Co);
          if ((Vy(s || Co), Yr(e))) {
            let a = t.get(hn);
            return (
              e.rootComponent !== void 0 && a.bootstrap(e.rootComponent), a
            );
          } else return lv(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function lv(e, t) {
  let n = e.injector.get(hn);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new I(-403, !1);
  t.push(e);
}
var eo = null,
  Fd = new C("");
function dv(e = [], t) {
  return nn.create({
    name: t,
    providers: [
      { provide: Mo, useValue: "platform" },
      { provide: qs, useValue: new Set([() => (eo = null)]) },
      ...e,
    ],
  });
}
function fv(e = []) {
  if (eo) return eo;
  let t = dv(e);
  return t.get(Fd, !1) || (eo = t), Xy(), hv(t), t;
}
function hv(e) {
  e.get(pa, null)?.forEach((n) => n());
}
var Kn = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = pv;
    }
  }
  return e;
})();
function pv(e) {
  return gv(xe(), L(), (e & 16) === 16);
}
function gv(e, t, n) {
  if (xo(e) && !n) {
    let r = ct(e.index, t);
    return new Vn(r, r);
  } else if (e.type & 175) {
    let r = t[Me];
    return new Vn(r, t);
  }
  return null;
}
function Rd(e) {
  let {
    rootComponent: t,
    appProviders: n,
    platformProviders: r,
    platformRef: o,
  } = e;
  try {
    let i = o?.injector ?? fv(r);
    if (i.get(Fd, !1) === !0 && !e.platformRef) throw new I(401, !1);
    let s = [Nd({}), { provide: rn, useExisting: av }, ...(n || [])],
      a = new mo({
        providers: s,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return uv({
      r3Injector: a.injector,
      platformInjector: i,
      rootComponent: t,
    });
  } catch (i) {
    return Promise.reject(i);
  }
}
function Jn(e, t) {
  lt("NgSignals");
  let n = pc(e);
  return t?.equal && (n[tt].equal = t.equal), n;
}
function Ke(e) {
  let t = x(null);
  try {
    return e();
  } finally {
    x(t);
  }
}
var kd = null;
function gn() {
  return kd;
}
function Ld(e) {
  kd ??= e;
}
var $o = class {};
var Le = new C("");
function Uo(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var Pa = (() => {
    class e {
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵmod = Ze({ type: e });
      }
      static {
        this.ɵinj = qe({});
      }
    }
    return e;
  })(),
  Vd = "browser",
  vv = "server";
function Ho(e) {
  return e === vv;
}
var pn = class {};
var er = class {},
  zo = class {},
  Je = class e {
    constructor(t) {
      (this.normalizedNames = new Map()),
        (this.lazyUpdate = null),
        t
          ? typeof t == "string"
            ? (this.lazyInit = () => {
                (this.headers = new Map()),
                  t
                    .split(
                      `
`
                    )
                    .forEach((n) => {
                      let r = n.indexOf(":");
                      if (r > 0) {
                        let o = n.slice(0, r),
                          i = o.toLowerCase(),
                          s = n.slice(r + 1).trim();
                        this.maybeSetNormalizedName(o, i),
                          this.headers.has(i)
                            ? this.headers.get(i).push(s)
                            : this.headers.set(i, [s]);
                      }
                    });
              })
            : typeof Headers < "u" && t instanceof Headers
            ? ((this.headers = new Map()),
              t.forEach((n, r) => {
                this.setHeaderEntries(r, n);
              }))
            : (this.lazyInit = () => {
                (this.headers = new Map()),
                  Object.entries(t).forEach(([n, r]) => {
                    this.setHeaderEntries(n, r);
                  });
              })
          : (this.headers = new Map());
    }
    has(t) {
      return this.init(), this.headers.has(t.toLowerCase());
    }
    get(t) {
      this.init();
      let n = this.headers.get(t.toLowerCase());
      return n && n.length > 0 ? n[0] : null;
    }
    keys() {
      return this.init(), Array.from(this.normalizedNames.values());
    }
    getAll(t) {
      return this.init(), this.headers.get(t.toLowerCase()) || null;
    }
    append(t, n) {
      return this.clone({ name: t, value: n, op: "a" });
    }
    set(t, n) {
      return this.clone({ name: t, value: n, op: "s" });
    }
    delete(t, n) {
      return this.clone({ name: t, value: n, op: "d" });
    }
    maybeSetNormalizedName(t, n) {
      this.normalizedNames.has(n) || this.normalizedNames.set(n, t);
    }
    init() {
      this.lazyInit &&
        (this.lazyInit instanceof e
          ? this.copyFrom(this.lazyInit)
          : this.lazyInit(),
        (this.lazyInit = null),
        this.lazyUpdate &&
          (this.lazyUpdate.forEach((t) => this.applyUpdate(t)),
          (this.lazyUpdate = null)));
    }
    copyFrom(t) {
      t.init(),
        Array.from(t.headers.keys()).forEach((n) => {
          this.headers.set(n, t.headers.get(n)),
            this.normalizedNames.set(n, t.normalizedNames.get(n));
        });
    }
    clone(t) {
      let n = new e();
      return (
        (n.lazyInit =
          this.lazyInit && this.lazyInit instanceof e ? this.lazyInit : this),
        (n.lazyUpdate = (this.lazyUpdate || []).concat([t])),
        n
      );
    }
    applyUpdate(t) {
      let n = t.name.toLowerCase();
      switch (t.op) {
        case "a":
        case "s":
          let r = t.value;
          if ((typeof r == "string" && (r = [r]), r.length === 0)) return;
          this.maybeSetNormalizedName(t.name, n);
          let o = (t.op === "a" ? this.headers.get(n) : void 0) || [];
          o.push(...r), this.headers.set(n, o);
          break;
        case "d":
          let i = t.value;
          if (!i) this.headers.delete(n), this.normalizedNames.delete(n);
          else {
            let s = this.headers.get(n);
            if (!s) return;
            (s = s.filter((a) => i.indexOf(a) === -1)),
              s.length === 0
                ? (this.headers.delete(n), this.normalizedNames.delete(n))
                : this.headers.set(n, s);
          }
          break;
      }
    }
    setHeaderEntries(t, n) {
      let r = (Array.isArray(n) ? n : [n]).map((i) => i.toString()),
        o = t.toLowerCase();
      this.headers.set(o, r), this.maybeSetNormalizedName(t, o);
    }
    forEach(t) {
      this.init(),
        Array.from(this.normalizedNames.keys()).forEach((n) =>
          t(this.normalizedNames.get(n), this.headers.get(n))
        );
    }
  };
var La = class {
  encodeKey(t) {
    return jd(t);
  }
  encodeValue(t) {
    return jd(t);
  }
  decodeKey(t) {
    return decodeURIComponent(t);
  }
  decodeValue(t) {
    return decodeURIComponent(t);
  }
};
function Cv(e, t) {
  let n = new Map();
  return (
    e.length > 0 &&
      e
        .replace(/^\?/, "")
        .split("&")
        .forEach((o) => {
          let i = o.indexOf("="),
            [s, a] =
              i == -1
                ? [t.decodeKey(o), ""]
                : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
            c = n.get(s) || [];
          c.push(a), n.set(s, c);
        }),
    n
  );
}
var wv = /%(\d[a-f0-9])/gi,
  Ev = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function jd(e) {
  return encodeURIComponent(e).replace(wv, (t, n) => Ev[n] ?? t);
}
function Go(e) {
  return `${e}`;
}
var ht = class e {
  constructor(t = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = t.encoder || new La()),
      t.fromString)
    ) {
      if (t.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = Cv(t.fromString, this.encoder);
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((n) => {
            let r = t.fromObject[n],
              o = Array.isArray(r) ? r.map(Go) : [Go(r)];
            this.map.set(n, o);
          }))
        : (this.map = null);
  }
  has(t) {
    return this.init(), this.map.has(t);
  }
  get(t) {
    this.init();
    let n = this.map.get(t);
    return n ? n[0] : null;
  }
  getAll(t) {
    return this.init(), this.map.get(t) || null;
  }
  keys() {
    return this.init(), Array.from(this.map.keys());
  }
  append(t, n) {
    return this.clone({ param: t, value: n, op: "a" });
  }
  appendAll(t) {
    let n = [];
    return (
      Object.keys(t).forEach((r) => {
        let o = t[r];
        Array.isArray(o)
          ? o.forEach((i) => {
              n.push({ param: r, value: i, op: "a" });
            })
          : n.push({ param: r, value: o, op: "a" });
      }),
      this.clone(n)
    );
  }
  set(t, n) {
    return this.clone({ param: t, value: n, op: "s" });
  }
  delete(t, n) {
    return this.clone({ param: t, value: n, op: "d" });
  }
  toString() {
    return (
      this.init(),
      this.keys()
        .map((t) => {
          let n = this.encoder.encodeKey(t);
          return this.map
            .get(t)
            .map((r) => n + "=" + this.encoder.encodeValue(r))
            .join("&");
        })
        .filter((t) => t !== "")
        .join("&")
    );
  }
  clone(t) {
    let n = new e({ encoder: this.encoder });
    return (
      (n.cloneFrom = this.cloneFrom || this),
      (n.updates = (this.updates || []).concat(t)),
      n
    );
  }
  init() {
    this.map === null && (this.map = new Map()),
      this.cloneFrom !== null &&
        (this.cloneFrom.init(),
        this.cloneFrom
          .keys()
          .forEach((t) => this.map.set(t, this.cloneFrom.map.get(t))),
        this.updates.forEach((t) => {
          switch (t.op) {
            case "a":
            case "s":
              let n = (t.op === "a" ? this.map.get(t.param) : void 0) || [];
              n.push(Go(t.value)), this.map.set(t.param, n);
              break;
            case "d":
              if (t.value !== void 0) {
                let r = this.map.get(t.param) || [],
                  o = r.indexOf(Go(t.value));
                o !== -1 && r.splice(o, 1),
                  r.length > 0
                    ? this.map.set(t.param, r)
                    : this.map.delete(t.param);
              } else {
                this.map.delete(t.param);
                break;
              }
          }
        }),
        (this.cloneFrom = this.updates = null));
  }
};
var Va = class {
  constructor() {
    this.map = new Map();
  }
  set(t, n) {
    return this.map.set(t, n), this;
  }
  get(t) {
    return (
      this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
    );
  }
  delete(t) {
    return this.map.delete(t), this;
  }
  has(t) {
    return this.map.has(t);
  }
  keys() {
    return this.map.keys();
  }
};
function bv(e) {
  switch (e) {
    case "DELETE":
    case "GET":
    case "HEAD":
    case "OPTIONS":
    case "JSONP":
      return !1;
    default:
      return !0;
  }
}
function Bd(e) {
  return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
}
function $d(e) {
  return typeof Blob < "u" && e instanceof Blob;
}
function Ud(e) {
  return typeof FormData < "u" && e instanceof FormData;
}
function _v(e) {
  return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
}
var Xn = class e {
    constructor(t, n, r, o) {
      (this.url = n),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = t.toUpperCase());
      let i;
      if (
        (bv(this.method) || o
          ? ((this.body = r !== void 0 ? r : null), (i = o))
          : (i = r),
        i &&
          ((this.reportProgress = !!i.reportProgress),
          (this.withCredentials = !!i.withCredentials),
          i.responseType && (this.responseType = i.responseType),
          i.headers && (this.headers = i.headers),
          i.context && (this.context = i.context),
          i.params && (this.params = i.params),
          (this.transferCache = i.transferCache)),
        (this.headers ??= new Je()),
        (this.context ??= new Va()),
        !this.params)
      )
        (this.params = new ht()), (this.urlWithParams = n);
      else {
        let s = this.params.toString();
        if (s.length === 0) this.urlWithParams = n;
        else {
          let a = n.indexOf("?"),
            c = a === -1 ? "?" : a < n.length - 1 ? "&" : "";
          this.urlWithParams = n + c + s;
        }
      }
    }
    serializeBody() {
      return this.body === null
        ? null
        : typeof this.body == "string" ||
          Bd(this.body) ||
          $d(this.body) ||
          Ud(this.body) ||
          _v(this.body)
        ? this.body
        : this.body instanceof ht
        ? this.body.toString()
        : typeof this.body == "object" ||
          typeof this.body == "boolean" ||
          Array.isArray(this.body)
        ? JSON.stringify(this.body)
        : this.body.toString();
    }
    detectContentTypeHeader() {
      return this.body === null || Ud(this.body)
        ? null
        : $d(this.body)
        ? this.body.type || null
        : Bd(this.body)
        ? null
        : typeof this.body == "string"
        ? "text/plain"
        : this.body instanceof ht
        ? "application/x-www-form-urlencoded;charset=UTF-8"
        : typeof this.body == "object" ||
          typeof this.body == "number" ||
          typeof this.body == "boolean"
        ? "application/json"
        : null;
    }
    clone(t = {}) {
      let n = t.method || this.method,
        r = t.url || this.url,
        o = t.responseType || this.responseType,
        i = t.transferCache ?? this.transferCache,
        s = t.body !== void 0 ? t.body : this.body,
        a = t.withCredentials ?? this.withCredentials,
        c = t.reportProgress ?? this.reportProgress,
        u = t.headers || this.headers,
        l = t.params || this.params,
        d = t.context ?? this.context;
      return (
        t.setHeaders !== void 0 &&
          (u = Object.keys(t.setHeaders).reduce(
            (h, f) => h.set(f, t.setHeaders[f]),
            u
          )),
        t.setParams &&
          (l = Object.keys(t.setParams).reduce(
            (h, f) => h.set(f, t.setParams[f]),
            l
          )),
        new e(n, r, s, {
          params: l,
          headers: u,
          context: d,
          reportProgress: c,
          responseType: o,
          withCredentials: a,
          transferCache: i,
        })
      );
    }
  },
  pt = (function (e) {
    return (
      (e[(e.Sent = 0)] = "Sent"),
      (e[(e.UploadProgress = 1)] = "UploadProgress"),
      (e[(e.ResponseHeader = 2)] = "ResponseHeader"),
      (e[(e.DownloadProgress = 3)] = "DownloadProgress"),
      (e[(e.Response = 4)] = "Response"),
      (e[(e.User = 5)] = "User"),
      e
    );
  })(pt || {}),
  tr = class {
    constructor(t, n = 200, r = "OK") {
      (this.headers = t.headers || new Je()),
        (this.status = t.status !== void 0 ? t.status : n),
        (this.statusText = t.statusText || r),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  Wo = class e extends tr {
    constructor(t = {}) {
      super(t), (this.type = pt.ResponseHeader);
    }
    clone(t = {}) {
      return new e({
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  nr = class e extends tr {
    constructor(t = {}) {
      super(t),
        (this.type = pt.Response),
        (this.body = t.body !== void 0 ? t.body : null);
    }
    clone(t = {}) {
      return new e({
        body: t.body !== void 0 ? t.body : this.body,
        headers: t.headers || this.headers,
        status: t.status !== void 0 ? t.status : this.status,
        statusText: t.statusText || this.statusText,
        url: t.url || this.url || void 0,
      });
    }
  },
  ft = class extends tr {
    constructor(t) {
      super(t, 0, "Unknown Error"),
        (this.name = "HttpErrorResponse"),
        (this.ok = !1),
        this.status >= 200 && this.status < 300
          ? (this.message = `Http failure during parsing for ${
              t.url || "(unknown url)"
            }`)
          : (this.message = `Http failure response for ${
              t.url || "(unknown url)"
            }: ${t.status} ${t.statusText}`),
        (this.error = t.error || null);
    }
  },
  Wd = 200,
  Iv = 204;
function ka(e, t) {
  return {
    body: t,
    headers: e.headers,
    context: e.context,
    observe: e.observe,
    params: e.params,
    reportProgress: e.reportProgress,
    responseType: e.responseType,
    withCredentials: e.withCredentials,
    transferCache: e.transferCache,
  };
}
var Pt = (() => {
    class e {
      constructor(n) {
        this.handler = n;
      }
      request(n, r, o = {}) {
        let i;
        if (n instanceof Xn) i = n;
        else {
          let c;
          o.headers instanceof Je ? (c = o.headers) : (c = new Je(o.headers));
          let u;
          o.params &&
            (o.params instanceof ht
              ? (u = o.params)
              : (u = new ht({ fromObject: o.params }))),
            (i = new Xn(n, r, o.body !== void 0 ? o.body : null, {
              headers: c,
              context: o.context,
              params: u,
              reportProgress: o.reportProgress,
              responseType: o.responseType || "json",
              withCredentials: o.withCredentials,
              transferCache: o.transferCache,
            }));
        }
        let s = Ue(i).pipe(Tn((c) => this.handler.handle(c)));
        if (n instanceof Xn || o.observe === "events") return s;
        let a = s.pipe($i((c) => c instanceof nr));
        switch (o.observe || "body") {
          case "body":
            switch (i.responseType) {
              case "arraybuffer":
                return a.pipe(
                  te((c) => {
                    if (c.body !== null && !(c.body instanceof ArrayBuffer))
                      throw new Error("Response is not an ArrayBuffer.");
                    return c.body;
                  })
                );
              case "blob":
                return a.pipe(
                  te((c) => {
                    if (c.body !== null && !(c.body instanceof Blob))
                      throw new Error("Response is not a Blob.");
                    return c.body;
                  })
                );
              case "text":
                return a.pipe(
                  te((c) => {
                    if (c.body !== null && typeof c.body != "string")
                      throw new Error("Response is not a string.");
                    return c.body;
                  })
                );
              case "json":
              default:
                return a.pipe(te((c) => c.body));
            }
          case "response":
            return a;
          default:
            throw new Error(
              `Unreachable: unhandled observe type ${o.observe}}`
            );
        }
      }
      delete(n, r = {}) {
        return this.request("DELETE", n, r);
      }
      get(n, r = {}) {
        return this.request("GET", n, r);
      }
      head(n, r = {}) {
        return this.request("HEAD", n, r);
      }
      jsonp(n, r) {
        return this.request("JSONP", n, {
          params: new ht().append(r, "JSONP_CALLBACK"),
          observe: "body",
          responseType: "json",
        });
      }
      options(n, r = {}) {
        return this.request("OPTIONS", n, r);
      }
      patch(n, r, o = {}) {
        return this.request("PATCH", n, ka(o, r));
      }
      post(n, r, o = {}) {
        return this.request("POST", n, ka(o, r));
      }
      put(n, r, o = {}) {
        return this.request("PUT", n, ka(o, r));
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(T(er));
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Mv = /^\)\]\}',?\n/,
  Tv = "X-Request-URL";
function Hd(e) {
  if (e.url) return e.url;
  let t = Tv.toLocaleLowerCase();
  return e.headers.get(t);
}
var xv = (() => {
    class e {
      constructor() {
        (this.fetchImpl =
          v(ja, { optional: !0 })?.fetch ?? ((...n) => globalThis.fetch(...n))),
          (this.ngZone = v(z));
      }
      handle(n) {
        return new P((r) => {
          let o = new AbortController();
          return (
            this.doRequest(n, o.signal, r).then(Ba, (i) =>
              r.error(new ft({ error: i }))
            ),
            () => o.abort()
          );
        });
      }
      doRequest(n, r, o) {
        return mr(this, null, function* () {
          let i = this.createRequestInit(n),
            s;
          try {
            let f = this.ngZone.runOutsideAngular(() =>
              this.fetchImpl(n.urlWithParams, R({ signal: r }, i))
            );
            Sv(f), o.next({ type: pt.Sent }), (s = yield f);
          } catch (f) {
            o.error(
              new ft({
                error: f,
                status: f.status ?? 0,
                statusText: f.statusText,
                url: n.urlWithParams,
                headers: f.headers,
              })
            );
            return;
          }
          let a = new Je(s.headers),
            c = s.statusText,
            u = Hd(s) ?? n.urlWithParams,
            l = s.status,
            d = null;
          if (
            (n.reportProgress &&
              o.next(new Wo({ headers: a, status: l, statusText: c, url: u })),
            s.body)
          ) {
            let f = s.headers.get("content-length"),
              p = [],
              g = s.body.getReader(),
              D = 0,
              w,
              F,
              k = typeof Zone < "u" && Zone.current;
            yield this.ngZone.runOutsideAngular(() =>
              mr(this, null, function* () {
                for (;;) {
                  let { done: ce, value: W } = yield g.read();
                  if (ce) break;
                  if ((p.push(W), (D += W.length), n.reportProgress)) {
                    F =
                      n.responseType === "text"
                        ? (F ?? "") +
                          (w ??= new TextDecoder()).decode(W, { stream: !0 })
                        : void 0;
                    let je = () =>
                      o.next({
                        type: pt.DownloadProgress,
                        total: f ? +f : void 0,
                        loaded: D,
                        partialText: F,
                      });
                    k ? k.run(je) : je();
                  }
                }
              })
            );
            let ee = this.concatChunks(p, D);
            try {
              let ce = s.headers.get("Content-Type") ?? "";
              d = this.parseBody(n, ee, ce);
            } catch (ce) {
              o.error(
                new ft({
                  error: ce,
                  headers: new Je(s.headers),
                  status: s.status,
                  statusText: s.statusText,
                  url: Hd(s) ?? n.urlWithParams,
                })
              );
              return;
            }
          }
          l === 0 && (l = d ? Wd : 0),
            l >= 200 && l < 300
              ? (o.next(
                  new nr({
                    body: d,
                    headers: a,
                    status: l,
                    statusText: c,
                    url: u,
                  })
                ),
                o.complete())
              : o.error(
                  new ft({
                    error: d,
                    headers: a,
                    status: l,
                    statusText: c,
                    url: u,
                  })
                );
        });
      }
      parseBody(n, r, o) {
        switch (n.responseType) {
          case "json":
            let i = new TextDecoder().decode(r).replace(Mv, "");
            return i === "" ? null : JSON.parse(i);
          case "text":
            return new TextDecoder().decode(r);
          case "blob":
            return new Blob([r], { type: o });
          case "arraybuffer":
            return r.buffer;
        }
      }
      createRequestInit(n) {
        let r = {},
          o = n.withCredentials ? "include" : void 0;
        if (
          (n.headers.forEach((i, s) => (r[i] = s.join(","))),
          n.headers.has("Accept") ||
            (r.Accept = "application/json, text/plain, */*"),
          !n.headers.has("Content-Type"))
        ) {
          let i = n.detectContentTypeHeader();
          i !== null && (r["Content-Type"] = i);
        }
        return {
          body: n.serializeBody(),
          method: n.method,
          headers: r,
          credentials: o,
        };
      }
      concatChunks(n, r) {
        let o = new Uint8Array(r),
          i = 0;
        for (let s of n) o.set(s, i), (i += s.length);
        return o;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  ja = class {};
function Ba() {}
function Sv(e) {
  e.then(Ba, Ba);
}
function Nv(e, t) {
  return t(e);
}
function Av(e, t, n) {
  return (r, o) => Ju(n, () => t(r, (i) => e(i, o)));
}
var qd = new C(""),
  Ov = new C(""),
  Fv = new C("", { providedIn: "root", factory: () => !0 });
var Gd = (() => {
  class e extends er {
    constructor(n, r) {
      super(),
        (this.backend = n),
        (this.injector = r),
        (this.chain = null),
        (this.pendingTasks = v(dn)),
        (this.contributeToStability = v(Fv));
    }
    handle(n) {
      if (this.chain === null) {
        let r = Array.from(
          new Set([...this.injector.get(qd), ...this.injector.get(Ov, [])])
        );
        this.chain = r.reduceRight((o, i) => Av(o, i, this.injector), Nv);
      }
      if (this.contributeToStability) {
        let r = this.pendingTasks.add();
        return this.chain(n, (o) => this.backend.handle(o)).pipe(
          Ui(() => this.pendingTasks.remove(r))
        );
      } else return this.chain(n, (r) => this.backend.handle(r));
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)(T(zo), T(He));
      };
    }
    static {
      this.ɵprov = b({ token: e, factory: e.ɵfac });
    }
  }
  return e;
})();
var Rv = /^\)\]\}',?\n/;
function Pv(e) {
  return "responseURL" in e && e.responseURL
    ? e.responseURL
    : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
    ? e.getResponseHeader("X-Request-URL")
    : null;
}
var zd = (() => {
    class e {
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === "JSONP") throw new I(-2800, !1);
        let r = this.xhrFactory;
        return (r.ɵloadImpl ? $e(r.ɵloadImpl()) : Ue(null)).pipe(
          Ht(
            () =>
              new P((i) => {
                let s = r.build();
                if (
                  (s.open(n.method, n.urlWithParams),
                  n.withCredentials && (s.withCredentials = !0),
                  n.headers.forEach((g, D) =>
                    s.setRequestHeader(g, D.join(","))
                  ),
                  n.headers.has("Accept") ||
                    s.setRequestHeader(
                      "Accept",
                      "application/json, text/plain, */*"
                    ),
                  !n.headers.has("Content-Type"))
                ) {
                  let g = n.detectContentTypeHeader();
                  g !== null && s.setRequestHeader("Content-Type", g);
                }
                if (n.responseType) {
                  let g = n.responseType.toLowerCase();
                  s.responseType = g !== "json" ? g : "text";
                }
                let a = n.serializeBody(),
                  c = null,
                  u = () => {
                    if (c !== null) return c;
                    let g = s.statusText || "OK",
                      D = new Je(s.getAllResponseHeaders()),
                      w = Pv(s) || n.url;
                    return (
                      (c = new Wo({
                        headers: D,
                        status: s.status,
                        statusText: g,
                        url: w,
                      })),
                      c
                    );
                  },
                  l = () => {
                    let { headers: g, status: D, statusText: w, url: F } = u(),
                      k = null;
                    D !== Iv &&
                      (k =
                        typeof s.response > "u" ? s.responseText : s.response),
                      D === 0 && (D = k ? Wd : 0);
                    let ee = D >= 200 && D < 300;
                    if (n.responseType === "json" && typeof k == "string") {
                      let ce = k;
                      k = k.replace(Rv, "");
                      try {
                        k = k !== "" ? JSON.parse(k) : null;
                      } catch (W) {
                        (k = ce),
                          ee && ((ee = !1), (k = { error: W, text: k }));
                      }
                    }
                    ee
                      ? (i.next(
                          new nr({
                            body: k,
                            headers: g,
                            status: D,
                            statusText: w,
                            url: F || void 0,
                          })
                        ),
                        i.complete())
                      : i.error(
                          new ft({
                            error: k,
                            headers: g,
                            status: D,
                            statusText: w,
                            url: F || void 0,
                          })
                        );
                  },
                  d = (g) => {
                    let { url: D } = u(),
                      w = new ft({
                        error: g,
                        status: s.status || 0,
                        statusText: s.statusText || "Unknown Error",
                        url: D || void 0,
                      });
                    i.error(w);
                  },
                  h = !1,
                  f = (g) => {
                    h || (i.next(u()), (h = !0));
                    let D = { type: pt.DownloadProgress, loaded: g.loaded };
                    g.lengthComputable && (D.total = g.total),
                      n.responseType === "text" &&
                        s.responseText &&
                        (D.partialText = s.responseText),
                      i.next(D);
                  },
                  p = (g) => {
                    let D = { type: pt.UploadProgress, loaded: g.loaded };
                    g.lengthComputable && (D.total = g.total), i.next(D);
                  };
                return (
                  s.addEventListener("load", l),
                  s.addEventListener("error", d),
                  s.addEventListener("timeout", d),
                  s.addEventListener("abort", d),
                  n.reportProgress &&
                    (s.addEventListener("progress", f),
                    a !== null &&
                      s.upload &&
                      s.upload.addEventListener("progress", p)),
                  s.send(a),
                  i.next({ type: pt.Sent }),
                  () => {
                    s.removeEventListener("error", d),
                      s.removeEventListener("abort", d),
                      s.removeEventListener("load", l),
                      s.removeEventListener("timeout", d),
                      n.reportProgress &&
                        (s.removeEventListener("progress", f),
                        a !== null &&
                          s.upload &&
                          s.upload.removeEventListener("progress", p)),
                      s.readyState !== s.DONE && s.abort();
                  }
                );
              })
          )
        );
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(T(pn));
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Zd = new C(""),
  kv = "XSRF-TOKEN",
  Lv = new C("", { providedIn: "root", factory: () => kv }),
  Vv = "X-XSRF-TOKEN",
  jv = new C("", { providedIn: "root", factory: () => Vv }),
  qo = class {},
  Bv = (() => {
    class e {
      constructor(n, r, o) {
        (this.doc = n),
          (this.platform = r),
          (this.cookieName = o),
          (this.lastCookieString = ""),
          (this.lastToken = null),
          (this.parseCount = 0);
      }
      getToken() {
        if (this.platform === "server") return null;
        let n = this.doc.cookie || "";
        return (
          n !== this.lastCookieString &&
            (this.parseCount++,
            (this.lastToken = Uo(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(T(Le), T(ut), T(Lv));
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })();
function $v(e, t) {
  let n = e.url.toLowerCase();
  if (
    !v(Zd) ||
    e.method === "GET" ||
    e.method === "HEAD" ||
    n.startsWith("http://") ||
    n.startsWith("https://")
  )
    return t(e);
  let r = v(qo).getToken(),
    o = v(jv);
  return (
    r != null &&
      !e.headers.has(o) &&
      (e = e.clone({ headers: e.headers.set(o, r) })),
    t(e)
  );
}
function Yd(...e) {
  let t = [
    Pt,
    zd,
    Gd,
    { provide: er, useExisting: Gd },
    { provide: zo, useFactory: () => v(xv, { optional: !0 }) ?? v(zd) },
    { provide: qd, useValue: $v, multi: !0 },
    { provide: Zd, useValue: !0 },
    { provide: qo, useClass: Bv },
  ];
  for (let n of e) t.push(...n.ɵproviders);
  return Io(t);
}
var Ha = class extends $o {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Ga = class e extends Ha {
    static makeCurrent() {
      Ld(new e());
    }
    onAndCancel(t, n, r) {
      return (
        t.addEventListener(n, r),
        () => {
          t.removeEventListener(n, r);
        }
      );
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n);
    }
    remove(t) {
      t.remove();
    }
    createElement(t, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(t);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument("fakeTitle");
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment;
    }
    getGlobalEventTarget(t, n) {
      return n === "window"
        ? window
        : n === "document"
        ? t
        : n === "body"
        ? t.body
        : null;
    }
    getBaseHref(t) {
      let n = Hv();
      return n == null ? null : Gv(n);
    }
    resetBaseElement() {
      rr = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return Uo(document.cookie, t);
    }
  },
  rr = null;
function Hv() {
  return (
    (rr = rr || document.querySelector("base")),
    rr ? rr.getAttribute("href") : null
  );
}
function Gv(e) {
  return new URL(e, document.baseURI).pathname;
}
var zv = (() => {
    class e {
      build() {
        return new XMLHttpRequest();
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)();
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  za = new C(""),
  ef = (() => {
    class e {
      constructor(n, r) {
        (this._zone = r),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, r, o) {
        return this._findPluginFor(r).addEventListener(n, r, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let r = this._eventNameToPlugin.get(n);
        if (r) return r;
        if (((r = this._plugins.find((i) => i.supports(n))), !r))
          throw new I(5101, !1);
        return this._eventNameToPlugin.set(n, r), r;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(T(za), T(z));
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Zo = class {
    constructor(t) {
      this._doc = t;
    }
  },
  $a = "ng-app-id",
  tf = (() => {
    class e {
      constructor(n, r, o, i = {}) {
        (this.doc = n),
          (this.appId = r),
          (this.nonce = o),
          (this.platformId = i),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Ho(i)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let r of n)
          this.changeUsageCount(r, 1) === 1 && this.onStyleAdded(r);
      }
      removeStyles(n) {
        for (let r of n)
          this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((r) => r.remove()), n.clear());
        for (let r of this.getAllStyles()) this.onStyleRemoved(r);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let r of this.getAllStyles()) this.addStyleToHost(n, r);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let r of this.hostNodes) this.addStyleToHost(r, n);
      }
      onStyleRemoved(n) {
        let r = this.styleRef;
        r.get(n)?.elements?.forEach((o) => o.remove()), r.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${$a}="${this.appId}"]`);
        if (n?.length) {
          let r = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && r.set(o.textContent, o);
            }),
            r
          );
        }
        return null;
      }
      changeUsageCount(n, r) {
        let o = this.styleRef;
        if (o.has(n)) {
          let i = o.get(n);
          return (i.usage += r), i.usage;
        }
        return o.set(n, { usage: r, elements: [] }), r;
      }
      getStyleElement(n, r) {
        let o = this.styleNodesInDOM,
          i = o?.get(r);
        if (i?.parentNode === n) return o.delete(r), i.removeAttribute($a), i;
        {
          let s = this.doc.createElement("style");
          return (
            this.nonce && s.setAttribute("nonce", this.nonce),
            (s.textContent = r),
            this.platformIsServer && s.setAttribute($a, this.appId),
            n.appendChild(s),
            s
          );
        }
      }
      addStyleToHost(n, r) {
        let o = this.getStyleElement(n, r),
          i = this.styleRef,
          s = i.get(r)?.elements;
        s ? s.push(o) : i.set(r, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(T(Le), T(ha), T(ga, 8), T(ut));
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Ua = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  qa = /%COMP%/g,
  nf = "%COMP%",
  Wv = `_nghost-${nf}`,
  qv = `_ngcontent-${nf}`,
  Zv = !0,
  Yv = new C("", { providedIn: "root", factory: () => Zv });
function Qv(e) {
  return qv.replace(qa, e);
}
function Kv(e) {
  return Wv.replace(qa, e);
}
function rf(e, t) {
  return t.map((n) => n.replace(qa, e));
}
var Kd = (() => {
    class e {
      constructor(n, r, o, i, s, a, c, u = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = r),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = i),
          (this.doc = s),
          (this.platformId = a),
          (this.ngZone = c),
          (this.nonce = u),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = Ho(a)),
          (this.defaultRenderer = new or(n, s, c, this.platformIsServer));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        this.platformIsServer &&
          r.encapsulation === Fe.ShadowDom &&
          (r = G(R({}, r), { encapsulation: Fe.Emulated }));
        let o = this.getOrCreateRenderer(n, r);
        return (
          o instanceof Yo
            ? o.applyToHost(n)
            : o instanceof ir && o.applyStyles(),
          o
        );
      }
      getOrCreateRenderer(n, r) {
        let o = this.rendererByCompId,
          i = o.get(r.id);
        if (!i) {
          let s = this.doc,
            a = this.ngZone,
            c = this.eventManager,
            u = this.sharedStylesHost,
            l = this.removeStylesOnCompDestroy,
            d = this.platformIsServer;
          switch (r.encapsulation) {
            case Fe.Emulated:
              i = new Yo(c, u, r, this.appId, l, s, a, d);
              break;
            case Fe.ShadowDom:
              return new Wa(c, u, n, r, s, a, this.nonce, d);
            default:
              i = new ir(c, u, r, l, s, a, d);
              break;
          }
          o.set(r.id, i);
        }
        return i;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(
            T(ef),
            T(tf),
            T(ha),
            T(Yv),
            T(Le),
            T(ut),
            T(z),
            T(ga)
          );
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  or = class {
    constructor(t, n, r, o) {
      (this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = o),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(t, n) {
      return n
        ? this.doc.createElementNS(Ua[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (Jd(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (Jd(t) ? t.content : t).insertBefore(n, r);
    }
    removeChild(t, n) {
      n.remove();
    }
    selectRootElement(t, n) {
      let r = typeof t == "string" ? this.doc.querySelector(t) : t;
      if (!r) throw new I(-5104, !1);
      return n || (r.textContent = ""), r;
    }
    parentNode(t) {
      return t.parentNode;
    }
    nextSibling(t) {
      return t.nextSibling;
    }
    setAttribute(t, n, r, o) {
      if (o) {
        n = o + ":" + n;
        let i = Ua[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = Ua[r];
        o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
      } else t.removeAttribute(n);
    }
    addClass(t, n) {
      t.classList.add(n);
    }
    removeClass(t, n) {
      t.classList.remove(n);
    }
    setStyle(t, n, r, o) {
      o & (We.DashCase | We.Important)
        ? t.style.setProperty(n, r, o & We.Important ? "important" : "")
        : (t.style[n] = r);
    }
    removeStyle(t, n, r) {
      r & We.DashCase ? t.style.removeProperty(n) : (t.style[n] = "");
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r);
    }
    setValue(t, n) {
      t.nodeValue = n;
    }
    listen(t, n, r) {
      if (
        typeof t == "string" &&
        ((t = gn().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${n}`);
      return this.eventManager.addEventListener(
        t,
        n,
        this.decoratePreventDefault(r)
      );
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === "__ngUnwrap__") return t;
        (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) ===
          !1 && n.preventDefault();
      };
    }
  };
function Jd(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var Wa = class extends or {
    constructor(t, n, r, o, i, s, a, c) {
      super(t, i, s, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let u = rf(o.id, o.styles);
      for (let l of u) {
        let d = document.createElement("style");
        a && d.setAttribute("nonce", a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t;
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n);
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
    }
    removeChild(t, n) {
      return super.removeChild(null, n);
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  ir = class extends or {
    constructor(t, n, r, o, i, s, a, c) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = c ? rf(c, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Yo = class extends ir {
    constructor(t, n, r, o, i, s, a, c) {
      let u = o + "-" + r.id;
      super(t, n, r, i, s, a, c, u),
        (this.contentAttr = Qv(u)),
        (this.hostAttr = Kv(u));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  Jv = (() => {
    class e extends Zo {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, r, o) {
        return (
          n.addEventListener(r, o, !1), () => this.removeEventListener(n, r, o)
        );
      }
      removeEventListener(n, r, o) {
        return n.removeEventListener(r, o);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(T(Le));
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Xd = ["alt", "control", "meta", "shift"],
  Xv = {
    "\b": "Backspace",
    "	": "Tab",
    "\x7F": "Delete",
    "\x1B": "Escape",
    Del: "Delete",
    Esc: "Escape",
    Left: "ArrowLeft",
    Right: "ArrowRight",
    Up: "ArrowUp",
    Down: "ArrowDown",
    Menu: "ContextMenu",
    Scroll: "ScrollLock",
    Win: "OS",
  },
  eD = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  tD = (() => {
    class e extends Zo {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, r, o) {
        let i = e.parseEventName(r),
          s = e.eventCallback(i.fullKey, o, this.manager.getZone());
        return this.manager
          .getZone()
          .runOutsideAngular(() => gn().onAndCancel(n, i.domEventName, s));
      }
      static parseEventName(n) {
        let r = n.toLowerCase().split("."),
          o = r.shift();
        if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
        let i = e._normalizeKey(r.pop()),
          s = "",
          a = r.indexOf("code");
        if (
          (a > -1 && (r.splice(a, 1), (s = "code.")),
          Xd.forEach((u) => {
            let l = r.indexOf(u);
            l > -1 && (r.splice(l, 1), (s += u + "."));
          }),
          (s += i),
          r.length != 0 || i.length === 0)
        )
          return null;
        let c = {};
        return (c.domEventName = o), (c.fullKey = s), c;
      }
      static matchEventFullKeyCode(n, r) {
        let o = Xv[n.key] || n.key,
          i = "";
        return (
          r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Xd.forEach((s) => {
                if (s !== o) {
                  let a = eD[s];
                  a(n) && (i += s + ".");
                }
              }),
              (i += o),
              i === r)
        );
      }
      static eventCallback(n, r, o) {
        return (i) => {
          e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
        };
      }
      static _normalizeKey(n) {
        return n === "esc" ? "escape" : n;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(T(Le));
        };
      }
      static {
        this.ɵprov = b({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })();
function of(e, t, n) {
  return Rd(R({ rootComponent: e, platformRef: n?.platformRef }, nD(t)));
}
function nD(e) {
  return {
    appProviders: [...aD, ...(e?.providers ?? [])],
    platformProviders: sD,
  };
}
function rD() {
  Ga.makeCurrent();
}
function oD() {
  return new ze();
}
function iD() {
  return Hl(document), document;
}
var sD = [
  { provide: ut, useValue: Vd },
  { provide: pa, useValue: rD, multi: !0 },
  { provide: Le, useFactory: iD, deps: [] },
];
var aD = [
  { provide: Mo, useValue: "root" },
  { provide: ze, useFactory: oD, deps: [] },
  { provide: za, useClass: Jv, multi: !0, deps: [Le, z, ut] },
  { provide: za, useClass: tD, multi: !0, deps: [Le] },
  Kd,
  tf,
  ef,
  { provide: on, useExisting: Kd },
  { provide: pn, useClass: zv, deps: [] },
  [],
];
var cr = class {},
  cD = (() => {
    class e {
      handle(n) {
        return n.key;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = b({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  mn = class {},
  uD = (() => {
    class e extends mn {
      compile(n, r) {
        return n;
      }
      compileTranslations(n, r) {
        return n;
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = ln(e)))(o || e);
        };
      })();
      static ɵprov = b({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  mt = class {},
  lD = (() => {
    class e extends mt {
      getTranslation(n) {
        return Ue({});
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = ln(e)))(o || e);
        };
      })();
      static ɵprov = b({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function Qo(e, t) {
  if (e === t) return !0;
  if (e === null || t === null) return !1;
  if (e !== e && t !== t) return !0;
  let n = typeof e,
    r = typeof t,
    o;
  if (n == r && n == "object")
    if (Array.isArray(e)) {
      if (!Array.isArray(t)) return !1;
      if ((o = e.length) == t.length) {
        for (let i = 0; i < o; i++) if (!Qo(e[i], t[i])) return !1;
        return !0;
      }
    } else {
      if (Array.isArray(t)) return !1;
      if (Xe(e) && Xe(t)) {
        let i = Object.create(null);
        for (let s in e) {
          if (!Qo(e[s], t[s])) return !1;
          i[s] = !0;
        }
        for (let s in t) if (!(s in i) && typeof t[s] < "u") return !1;
        return !0;
      }
    }
  return !1;
}
function gt(e) {
  return typeof e < "u" && e !== null;
}
function sf(e) {
  return e !== void 0;
}
function Xe(e) {
  return ar(e) && !kt(e) && e !== null;
}
function ar(e) {
  return typeof e == "object" && e !== null;
}
function kt(e) {
  return Array.isArray(e);
}
function Ko(e) {
  return typeof e == "string";
}
function dD(e) {
  return typeof e == "function";
}
function Jo(e) {
  if (kt(e)) return e.map((t) => Jo(t));
  if (Xe(e)) {
    let t = {};
    return (
      Object.keys(e).forEach((n) => {
        t[n] = Jo(e[n]);
      }),
      t
    );
  } else return e;
}
function Qa(e, t) {
  if (!ar(e)) return Jo(t);
  let n = Jo(e);
  return (
    ar(n) &&
      ar(t) &&
      Object.keys(t).forEach((r) => {
        Xe(t[r])
          ? r in e
            ? (n[r] = Qa(e[r], t[r]))
            : Object.assign(n, { [r]: t[r] })
          : Object.assign(n, { [r]: t[r] });
      }),
    n
  );
}
function cf(e, t) {
  let n = t.split(".");
  t = "";
  do {
    t += n.shift();
    let r = !n.length;
    if (gt(e)) {
      if (Xe(e) && sf(e[t]) && (Xe(e[t]) || kt(e[t]) || r)) {
        (e = e[t]), (t = "");
        continue;
      }
      if (kt(e)) {
        let o = parseInt(t, 10);
        if (sf(e[o]) && (Xe(e[o]) || kt(e[o]) || r)) {
          (e = e[o]), (t = "");
          continue;
        }
      }
    }
    if (r) {
      e = void 0;
      continue;
    }
    t += ".";
  } while (n.length);
  return e;
}
function fD(e, t, n) {
  return Qa(e, hD(t, n));
}
function hD(e, t) {
  return e.split(".").reduceRight((n, r) => ({ [r]: n }), t);
}
var yn = class {},
  pD = (() => {
    class e extends yn {
      templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
      interpolate(n, r) {
        if (Ko(n)) return this.interpolateString(n, r);
        if (dD(n)) return this.interpolateFunction(n, r);
      }
      interpolateFunction(n, r) {
        return n(r);
      }
      interpolateString(n, r) {
        return r
          ? n.replace(this.templateMatcher, (o, i) => {
              let s = this.getInterpolationReplacement(r, i);
              return s !== void 0 ? s : o;
            })
          : n;
      }
      getInterpolationReplacement(n, r) {
        return this.formatValue(cf(n, r));
      }
      formatValue(n) {
        if (Ko(n)) return n;
        if (typeof n == "number" || typeof n == "boolean") return n.toString();
        if (n === null) return "null";
        if (kt(n)) return n.join(", ");
        if (ar(n))
          return typeof n.toString == "function" &&
            n.toString !== Object.prototype.toString
            ? n.toString()
            : JSON.stringify(n);
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = ln(e)))(o || e);
        };
      })();
      static ɵprov = b({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Za = (() => {
    class e {
      _onTranslationChange = new Q();
      _onLangChange = new Q();
      _onFallbackLangChange = new Q();
      fallbackLang = null;
      currentLang;
      translations = {};
      languages = [];
      getTranslations(n) {
        return this.translations[n];
      }
      setTranslations(n, r, o) {
        (this.translations[n] =
          o && this.hasTranslationFor(n) ? Qa(this.translations[n], r) : r),
          this.addLanguages([n]),
          this._onTranslationChange.next({
            lang: n,
            translations: this.getTranslations(n),
          });
      }
      getLanguages() {
        return this.languages;
      }
      getCurrentLang() {
        return this.currentLang;
      }
      getFallbackLang() {
        return this.fallbackLang;
      }
      setFallbackLang(n, r = !0) {
        (this.fallbackLang = n),
          r &&
            this._onFallbackLangChange.next({
              lang: n,
              translations: this.translations[n],
            });
      }
      setCurrentLang(n, r = !0) {
        (this.currentLang = n),
          r &&
            this._onLangChange.next({
              lang: n,
              translations: this.translations[n],
            });
      }
      get onTranslationChange() {
        return this._onTranslationChange.asObservable();
      }
      get onLangChange() {
        return this._onLangChange.asObservable();
      }
      get onFallbackLangChange() {
        return this._onFallbackLangChange.asObservable();
      }
      addLanguages(n) {
        this.languages = Array.from(new Set([...this.languages, ...n]));
      }
      hasTranslationFor(n) {
        return typeof this.translations[n] < "u";
      }
      deleteTranslations(n) {
        delete this.translations[n];
      }
      getTranslation(n) {
        let r = this.getValue(this.currentLang, n);
        return (
          r === void 0 &&
            this.fallbackLang != null &&
            this.fallbackLang !== this.currentLang &&
            (r = this.getValue(this.fallbackLang, n)),
          r
        );
      }
      getValue(n, r) {
        return cf(this.getTranslations(n), r);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = b({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Ya = new C("TRANSLATE_CONFIG"),
  sr = (e) => (nt(e) ? e : Ue(e));
var Lt = (() => {
  class e {
    loadingTranslations;
    pending = !1;
    _translationRequests = {};
    lastUseLanguage = null;
    currentLoader = v(mt);
    compiler = v(mn);
    parser = v(yn);
    missingTranslationHandler = v(cr);
    store = v(Za);
    extend = !1;
    get onTranslationChange() {
      return this.store.onTranslationChange;
    }
    get onLangChange() {
      return this.store.onLangChange;
    }
    get onFallbackLangChange() {
      return this.store.onFallbackLangChange;
    }
    get onDefaultLangChange() {
      return this.store.onFallbackLangChange;
    }
    constructor() {
      let n = R({ extend: !1, fallbackLang: null }, v(Ya, { optional: !0 }));
      n.lang && this.use(n.lang),
        n.fallbackLang && this.setFallbackLang(n.fallbackLang),
        n.extend && (this.extend = !0);
    }
    setFallbackLang(n) {
      this.getFallbackLang() || this.store.setFallbackLang(n, !1);
      let r = this.loadOrExtendLanguage(n);
      return nt(r)
        ? (r.pipe(Ut(1)).subscribe({
            next: () => {
              this.store.setFallbackLang(n);
            },
            error: () => {},
          }),
          r)
        : (this.store.setFallbackLang(n), Ue(this.store.getTranslations(n)));
    }
    use(n) {
      (this.lastUseLanguage = n),
        this.getCurrentLang() || this.store.setCurrentLang(n, !1);
      let r = this.loadOrExtendLanguage(n);
      return nt(r)
        ? (r.pipe(Ut(1)).subscribe({
            next: () => {
              this.changeLang(n);
            },
            error: () => {},
          }),
          r)
        : (this.changeLang(n), Ue(this.store.getTranslations(n)));
    }
    loadOrExtendLanguage(n) {
      if (!this.store.hasTranslationFor(n) || this.extend)
        return (
          (this._translationRequests[n] =
            this._translationRequests[n] || this.loadAndCompileTranslations(n)),
          this._translationRequests[n]
        );
    }
    changeLang(n) {
      n === this.lastUseLanguage && this.store.setCurrentLang(n);
    }
    getCurrentLang() {
      return this.store.getCurrentLang();
    }
    loadAndCompileTranslations(n) {
      this.pending = !0;
      let r = this.currentLoader.getTranslation(n).pipe(Wr(1), Ut(1));
      return (
        (this.loadingTranslations = r.pipe(
          te((o) => this.compiler.compileTranslations(o, n)),
          Wr(1),
          Ut(1)
        )),
        this.loadingTranslations.subscribe({
          next: (o) => {
            this.store.setTranslations(n, o, this.extend), (this.pending = !1);
          },
          error: (o) => {
            this.pending = !1;
          },
        }),
        r
      );
    }
    setTranslation(n, r, o = !1) {
      let i = this.compiler.compileTranslations(r, n);
      this.store.setTranslations(n, i, o || this.extend);
    }
    getLangs() {
      return this.store.getLanguages();
    }
    addLangs(n) {
      this.store.addLanguages(n);
    }
    getParsedResultForKey(n, r) {
      let o = this.getTextToInterpolate(n);
      if (gt(o)) return this.runInterpolation(o, r);
      let i = this.missingTranslationHandler.handle(
        R(
          { key: n, translateService: this },
          r !== void 0 && { interpolateParams: r }
        )
      );
      return i !== void 0 ? i : n;
    }
    getFallbackLang() {
      return this.store.getFallbackLang();
    }
    getTextToInterpolate(n) {
      return this.store.getTranslation(n);
    }
    runInterpolation(n, r) {
      if (gt(n))
        return kt(n)
          ? this.runInterpolationOnArray(n, r)
          : Xe(n)
          ? this.runInterpolationOnDict(n, r)
          : this.parser.interpolate(n, r);
    }
    runInterpolationOnArray(n, r) {
      return n.map((o) => this.runInterpolation(o, r));
    }
    runInterpolationOnDict(n, r) {
      let o = {};
      for (let i in n) {
        let s = this.runInterpolation(n[i], r);
        s !== void 0 && (o[i] = s);
      }
      return o;
    }
    getParsedResult(n, r) {
      return n instanceof Array
        ? this.getParsedResultForArray(n, r)
        : this.getParsedResultForKey(n, r);
    }
    getParsedResultForArray(n, r) {
      let o = {},
        i = !1;
      for (let a of n)
        (o[a] = this.getParsedResultForKey(a, r)), (i = i || nt(o[a]));
      if (!i) return o;
      let s = n.map((a) => sr(o[a]));
      return Mn(s).pipe(
        te((a) => {
          let c = {};
          return (
            a.forEach((u, l) => {
              c[n[l]] = u;
            }),
            c
          );
        })
      );
    }
    get(n, r) {
      if (!gt(n) || !n.length)
        throw new Error('Parameter "key" is required and cannot be empty');
      return this.pending
        ? this.loadingTranslations.pipe(
            Tn(() => sr(this.getParsedResult(n, r)))
          )
        : sr(this.getParsedResult(n, r));
    }
    getStreamOnTranslationChange(n, r) {
      if (!gt(n) || !n.length)
        throw new Error('Parameter "key" is required and cannot be empty');
      return Gr(
        zr(() => this.get(n, r)),
        this.onTranslationChange.pipe(
          Ht(() => {
            let o = this.getParsedResult(n, r);
            return sr(o);
          })
        )
      );
    }
    stream(n, r) {
      if (!gt(n) || !n.length) throw new Error('Parameter "key" required');
      return Gr(
        zr(() => this.get(n, r)),
        this.onLangChange.pipe(
          Ht(() => {
            let o = this.getParsedResult(n, r);
            return sr(o);
          })
        )
      );
    }
    instant(n, r) {
      if (!gt(n) || n.length === 0)
        throw new Error('Parameter "key" is required and cannot be empty');
      let o = this.getParsedResult(n, r);
      return nt(o)
        ? Array.isArray(n)
          ? n.reduce((i, s) => ((i[s] = s), i), {})
          : n
        : o;
    }
    set(n, r, o = this.getCurrentLang()) {
      this.store.setTranslations(
        o,
        fD(
          this.store.getTranslations(o),
          n,
          Ko(r)
            ? this.compiler.compile(r, o)
            : this.compiler.compileTranslations(r, o)
        ),
        !1
      );
    }
    reloadLang(n) {
      return this.resetLang(n), this.loadAndCompileTranslations(n);
    }
    resetLang(n) {
      delete this._translationRequests[n], this.store.deleteTranslations(n);
    }
    static getBrowserLang() {
      if (typeof window > "u" || !window.navigator) return;
      let n = this.getBrowserCultureLang();
      return n ? n.split(/[-_]/)[0] : void 0;
    }
    static getBrowserCultureLang() {
      if (!(typeof window > "u" || typeof window.navigator > "u"))
        return window.navigator.languages
          ? window.navigator.languages[0]
          : window.navigator.language ||
              window.navigator.browserLanguage ||
              window.navigator.userLanguage;
    }
    getBrowserLang() {
      return e.getBrowserLang();
    }
    getBrowserCultureLang() {
      return e.getBrowserCultureLang();
    }
    get defaultLang() {
      return this.getFallbackLang();
    }
    get currentLang() {
      return this.store.getCurrentLang();
    }
    get langs() {
      return this.store.getLanguages();
    }
    setDefaultLang(n) {
      return this.setFallbackLang(n);
    }
    getDefaultLang() {
      return this.getFallbackLang();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵprov = b({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var Ve = (() => {
  class e {
    translate = v(Lt);
    _ref = v(Kn);
    value = "";
    lastKey = null;
    lastParams = [];
    onTranslationChange;
    onLangChange;
    onFallbackLangChange;
    updateValue(n, r, o) {
      let i = (s) => {
        (this.value = s !== void 0 ? s : n),
          (this.lastKey = n),
          this._ref.markForCheck();
      };
      if (o) {
        let s = this.translate.getParsedResult(n, r);
        nt(s) ? s.subscribe(i) : i(s);
      }
      this.translate.get(n, r).subscribe(i);
    }
    transform(n, ...r) {
      if (!n || !n.length) return n;
      if (Qo(n, this.lastKey) && Qo(r, this.lastParams)) return this.value;
      let o;
      if (gt(r[0]) && r.length)
        if (Ko(r[0]) && r[0].length) {
          let i = r[0]
            .replace(/(')?([a-zA-Z0-9_]+)(')?(\s)?:/g, '"$2":')
            .replace(/:(\s)?(')(.*?)(')/g, ':"$3"');
          try {
            o = JSON.parse(i);
          } catch (s) {
            throw new SyntaxError(
              `Wrong parameter in TranslatePipe. Expected a valid Object, received: ${r[0]}`
            );
          }
        } else Xe(r[0]) && (o = r[0]);
      return (
        (this.lastKey = n),
        (this.lastParams = r),
        this.updateValue(n, o),
        this._dispose(),
        this.onTranslationChange ||
          (this.onTranslationChange =
            this.translate.onTranslationChange.subscribe((i) => {
              ((this.lastKey && i.lang === this.translate.getCurrentLang()) ||
                i.lang === this.translate.getFallbackLang()) &&
                ((this.lastKey = null), this.updateValue(n, o, i.translations));
            })),
        this.onLangChange ||
          (this.onLangChange = this.translate.onLangChange.subscribe((i) => {
            this.lastKey &&
              ((this.lastKey = null), this.updateValue(n, o, i.translations));
          })),
        this.onFallbackLangChange ||
          (this.onFallbackLangChange =
            this.translate.onFallbackLangChange.subscribe(() => {
              this.lastKey && ((this.lastKey = null), this.updateValue(n, o));
            })),
        this.value
      );
    }
    _dispose() {
      typeof this.onTranslationChange < "u" &&
        (this.onTranslationChange.unsubscribe(),
        (this.onTranslationChange = void 0)),
        typeof this.onLangChange < "u" &&
          (this.onLangChange.unsubscribe(), (this.onLangChange = void 0)),
        typeof this.onFallbackLangChange < "u" &&
          (this.onFallbackLangChange.unsubscribe(),
          (this.onFallbackLangChange = void 0));
    }
    ngOnDestroy() {
      this._dispose();
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵpipe = Xs({ name: "translate", type: e, pure: !1, standalone: !0 });
    static ɵprov = b({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function gD(e) {
  return { provide: mt, useClass: e };
}
function mD(e) {
  return { provide: mn, useClass: e };
}
function yD(e) {
  return { provide: yn, useClass: e };
}
function vD(e) {
  return { provide: cr, useClass: e };
}
function af(e = {}, t) {
  let n = [];
  e.loader && n.push(e.loader),
    e.compiler && n.push(e.compiler),
    e.parser && n.push(e.parser),
    e.missingTranslationHandler && n.push(e.missingTranslationHandler),
    t && n.push(Za),
    (e.useDefaultLang || e.defaultLanguage) &&
      (console.warn(
        "The `useDefaultLang` and `defaultLanguage` options are deprecated. Please use `fallbackLang` instead."
      ),
      e.useDefaultLang === !0 &&
        e.defaultLanguage &&
        (e.fallbackLang = e.defaultLanguage));
  let r = {
    fallbackLang: e.fallbackLang ?? null,
    lang: e.lang,
    extend: e.extend ?? !1,
  };
  return (
    n.push({ provide: Ya, useValue: r }),
    n.push({ provide: Lt, useClass: Lt, deps: [Za, mt, mn, yn, cr, Ya] }),
    n
  );
}
var Ee = (() => {
  class e {
    static forRoot(n = {}) {
      return {
        ngModule: e,
        providers: [
          ...af(
            R(
              {
                compiler: mD(uD),
                parser: yD(pD),
                loader: gD(lD),
                missingTranslationHandler: vD(cD),
              },
              n
            ),
            !0
          ),
        ],
      };
    }
    static forChild(n = {}) {
      return { ngModule: e, providers: [...af(n, n.isolate ?? !1)] };
    }
    static ɵfac = function (r) {
      return new (r || e)();
    };
    static ɵmod = Ze({ type: e });
    static ɵinj = qe({});
  }
  return e;
})();
var Xo = class {
  http;
  prefix;
  suffix;
  constructor(t, n = "/portfolioEve/assets/i18n/", r = ".json") {
    (this.http = t), (this.prefix = n), (this.suffix = r);
  }
  getTranslation(t) {
    return this.http.get(`${this.prefix}${t}${this.suffix}`);
  }
};
function DD(e) {
  return new Xo(e, "/portfolioEve/assets/i18n/", ".json");
}
function CD(e) {
  return () => {
    let t = typeof window < "u" ? localStorage.getItem("lang") ?? "en" : "en";
    return e.setDefaultLang("en"), e.use(t).toPromise();
  };
}
var uf = {
  providers: [
    Ad({ eventCoalescing: !0 }),
    Yd(),
    ea(
      Ee.forRoot({
        fallbackLang: "en",
        loader: { provide: mt, useFactory: DD, deps: [Pt] },
      })
    ),
    { provide: Fa, useFactory: CD, deps: [Lt], multi: !0 },
  ],
};
var ei = class e {
  navigate = new B();
  goNextSection(t, n) {
    n.preventDefault(), this.navigate.emit(t);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = K({
    type: e,
    selectors: [["app-intro"]],
    outputs: { navigate: "navigate" },
    standalone: !0,
    features: [X],
    decls: 10,
    vars: 0,
    consts: [
      [
        1,
        "w-full",
        "h-full",
        "bg-surface",
        "text-center",
        "flex",
        "flex-col",
        "relative",
      ],
      [
        1,
        "text-primary",
        "flex",
        "flex-col",
        "gap-1",
        "md:gap-2",
        "lg:gap-2",
        "mt-20",
        "lg:mt-36",
        "w-full",
        "h-full",
      ],
      [
        1,
        "font-fraunces",
        "font-bold",
        "text-h1-sm",
        "md:text-h1-md",
        "lg:text-h1-lg",
      ],
      [
        1,
        "font-sans",
        "font-medium",
        "text-h2-sm",
        "md:text-h2-md",
        "lg:text-h2-lg",
      ],
      [1, "text-acent"],
      [
        1,
        "text-secondary",
        "absolute",
        "bottom-2",
        "flex",
        "flex-row",
        "justify-center",
        "items-center",
        "w-full",
      ],
      [
        "src",
        "assets/icons/arrow-down.svg",
        1,
        "size-8",
        "md:size-9",
        "lg:size-11",
        "cursor-pointer",
        3,
        "click",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "div", 0)(1, "div", 1)(2, "h1", 2),
        V(3, " EVELIA GIL "),
        y(),
        m(4, "h2", 3),
        V(5, " FULL-STACK "),
        m(6, "span", 4),
        V(7, "DEVELOPER"),
        y()()(),
        m(8, "div", 5)(9, "img", 6),
        O("click", function (i) {
          return r.goNextSection("about", i);
        }),
        y()()());
    },
  });
};
var et = { _origin: "https://api.emailjs.com" };
var lf = (e, t = "https://api.emailjs.com") => {
  (et._userID = e), (et._origin = t);
};
var ti = (e, t, n) => {
  if (!e)
    throw "The user ID is required. Visit https://dashboard.emailjs.com/admin/integration";
  if (!t)
    throw "The service ID is required. Visit https://dashboard.emailjs.com/admin";
  if (!n)
    throw "The template ID is required. Visit https://dashboard.emailjs.com/admin/templates";
  return !0;
};
var lr = class {
  constructor(t) {
    (this.status = t.status), (this.text = t.responseText);
  }
};
var ni = (e, t, n = {}) =>
  new Promise((r, o) => {
    let i = new XMLHttpRequest();
    i.addEventListener("load", ({ target: s }) => {
      let a = new lr(s);
      a.status === 200 || a.text === "OK" ? r(a) : o(a);
    }),
      i.addEventListener("error", ({ target: s }) => {
        o(new lr(s));
      }),
      i.open("POST", et._origin + e, !0),
      Object.keys(n).forEach((s) => {
        i.setRequestHeader(s, n[s]);
      }),
      i.send(t);
  });
var df = (e, t, n, r) => {
  let o = r || et._userID;
  return (
    ti(o, e, t),
    ni(
      "/api/v1.0/email/send",
      JSON.stringify({
        lib_version: "3.2.0",
        user_id: o,
        service_id: e,
        template_id: t,
        template_params: n,
      }),
      { "Content-type": "application/json" }
    )
  );
};
var wD = (e) => {
    let t;
    if (
      (typeof e == "string" ? (t = document.querySelector(e)) : (t = e),
      !t || t.nodeName !== "FORM")
    )
      throw "The 3rd parameter is expected to be the HTML form element or the style selector of form";
    return t;
  },
  ff = (e, t, n, r) => {
    let o = r || et._userID,
      i = wD(n);
    ti(o, e, t);
    let s = new FormData(i);
    return (
      s.append("lib_version", "3.2.0"),
      s.append("service_id", e),
      s.append("template_id", t),
      s.append("user_id", o),
      ni("/api/v1.0/email/send-form", s)
    );
  };
var hf = { init: lf, send: df, sendForm: ff };
var wf = (() => {
    class e {
      constructor(n, r) {
        (this._renderer = n),
          (this._elementRef = r),
          (this.onChange = (o) => {}),
          (this.onTouched = () => {});
      }
      setProperty(n, r) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, r);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty("disabled", n);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)($(zn), $(Ot));
        };
      }
      static {
        this.ɵdir = Te({ type: e });
      }
    }
    return e;
  })(),
  ED = (() => {
    class e extends wf {
      static {
        this.ɵfac = (() => {
          let n;
          return function (o) {
            return (n || (n = ln(e)))(o || e);
          };
        })();
      }
      static {
        this.ɵdir = Te({ type: e, features: [dt] });
      }
    }
    return e;
  })(),
  Ef = new C("");
var bD = { provide: Ef, useExisting: cn(() => fi), multi: !0 };
function _D() {
  let e = gn() ? gn().getUserAgent() : "";
  return /android (\d+)/.test(e.toLowerCase());
}
var ID = new C(""),
  fi = (() => {
    class e extends wf {
      constructor(n, r, o) {
        super(n, r),
          (this._compositionMode = o),
          (this._composing = !1),
          this._compositionMode == null && (this._compositionMode = !_D());
      }
      writeValue(n) {
        let r = n ?? "";
        this.setProperty("value", r);
      }
      _handleInput(n) {
        (!this._compositionMode ||
          (this._compositionMode && !this._composing)) &&
          this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)($(zn), $(Ot), $(ID, 8));
        };
      }
      static {
        this.ɵdir = Te({
          type: e,
          selectors: [
            ["input", "formControlName", "", 3, "type", "checkbox"],
            ["textarea", "formControlName", ""],
            ["input", "formControl", "", 3, "type", "checkbox"],
            ["textarea", "formControl", ""],
            ["input", "ngModel", "", 3, "type", "checkbox"],
            ["textarea", "ngModel", ""],
            ["", "ngDefaultControl", ""],
          ],
          hostBindings: function (r, o) {
            r & 1 &&
              O("input", function (s) {
                return o._handleInput(s.target.value);
              })("blur", function () {
                return o.onTouched();
              })("compositionstart", function () {
                return o._compositionStart();
              })("compositionend", function (s) {
                return o._compositionEnd(s.target.value);
              });
          },
          features: [Bo([bD]), dt],
        });
      }
    }
    return e;
  })();
function vt(e) {
  return (
    e == null || ((typeof e == "string" || Array.isArray(e)) && e.length === 0)
  );
}
function bf(e) {
  return e != null && typeof e.length == "number";
}
var _f = new C(""),
  If = new C(""),
  MD =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  Dt = class {
    static min(t) {
      return TD(t);
    }
    static max(t) {
      return xD(t);
    }
    static required(t) {
      return SD(t);
    }
    static requiredTrue(t) {
      return ND(t);
    }
    static email(t) {
      return AD(t);
    }
    static minLength(t) {
      return OD(t);
    }
    static maxLength(t) {
      return FD(t);
    }
    static pattern(t) {
      return RD(t);
    }
    static nullValidator(t) {
      return Mf(t);
    }
    static compose(t) {
      return Of(t);
    }
    static composeAsync(t) {
      return Rf(t);
    }
  };
function TD(e) {
  return (t) => {
    if (vt(t.value) || vt(e)) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n < e ? { min: { min: e, actual: t.value } } : null;
  };
}
function xD(e) {
  return (t) => {
    if (vt(t.value) || vt(e)) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n > e ? { max: { max: e, actual: t.value } } : null;
  };
}
function SD(e) {
  return vt(e.value) ? { required: !0 } : null;
}
function ND(e) {
  return e.value === !0 ? null : { required: !0 };
}
function AD(e) {
  return vt(e.value) || MD.test(e.value) ? null : { email: !0 };
}
function OD(e) {
  return (t) =>
    vt(t.value) || !bf(t.value)
      ? null
      : t.value.length < e
      ? { minlength: { requiredLength: e, actualLength: t.value.length } }
      : null;
}
function FD(e) {
  return (t) =>
    bf(t.value) && t.value.length > e
      ? { maxlength: { requiredLength: e, actualLength: t.value.length } }
      : null;
}
function RD(e) {
  if (!e) return Mf;
  let t, n;
  return (
    typeof e == "string"
      ? ((n = ""),
        e.charAt(0) !== "^" && (n += "^"),
        (n += e),
        e.charAt(e.length - 1) !== "$" && (n += "$"),
        (t = new RegExp(n)))
      : ((n = e.toString()), (t = e)),
    (r) => {
      if (vt(r.value)) return null;
      let o = r.value;
      return t.test(o)
        ? null
        : { pattern: { requiredPattern: n, actualValue: o } };
    }
  );
}
function Mf(e) {
  return null;
}
function Tf(e) {
  return e != null;
}
function xf(e) {
  return Qn(e) ? $e(e) : e;
}
function Sf(e) {
  let t = {};
  return (
    e.forEach((n) => {
      t = n != null ? R(R({}, t), n) : t;
    }),
    Object.keys(t).length === 0 ? null : t
  );
}
function Nf(e, t) {
  return t.map((n) => n(e));
}
function PD(e) {
  return !e.validate;
}
function Af(e) {
  return e.map((t) => (PD(t) ? t : (n) => t.validate(n)));
}
function Of(e) {
  if (!e) return null;
  let t = e.filter(Tf);
  return t.length == 0
    ? null
    : function (n) {
        return Sf(Nf(n, t));
      };
}
function Ff(e) {
  return e != null ? Of(Af(e)) : null;
}
function Rf(e) {
  if (!e) return null;
  let t = e.filter(Tf);
  return t.length == 0
    ? null
    : function (n) {
        let r = Nf(n, t).map(xf);
        return Mn(r).pipe(te(Sf));
      };
}
function Pf(e) {
  return e != null ? Rf(Af(e)) : null;
}
function pf(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
}
function kf(e) {
  return e._rawValidators;
}
function Lf(e) {
  return e._rawAsyncValidators;
}
function Ka(e) {
  return e ? (Array.isArray(e) ? e : [e]) : [];
}
function oi(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
function gf(e, t) {
  let n = Ka(t);
  return (
    Ka(e).forEach((o) => {
      oi(n, o) || n.push(o);
    }),
    n
  );
}
function mf(e, t) {
  return Ka(t).filter((n) => !oi(e, n));
}
var ii = class {
    constructor() {
      (this._rawValidators = []),
        (this._rawAsyncValidators = []),
        (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(t) {
      (this._rawValidators = t || []),
        (this._composedValidatorFn = Ff(this._rawValidators));
    }
    _setAsyncValidators(t) {
      (this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = Pf(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(t) {
      this._onDestroyCallbacks.push(t);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((t) => t()),
        (this._onDestroyCallbacks = []);
    }
    reset(t = void 0) {
      this.control && this.control.reset(t);
    }
    hasError(t, n) {
      return this.control ? this.control.hasError(t, n) : !1;
    }
    getError(t, n) {
      return this.control ? this.control.getError(t, n) : null;
    }
  },
  Cn = class extends ii {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  gr = class extends ii {
    constructor() {
      super(...arguments),
        (this._parent = null),
        (this.name = null),
        (this.valueAccessor = null);
    }
  },
  si = class {
    constructor(t) {
      this._cd = t;
    }
    get isTouched() {
      return this._cd?.control?._touched?.(), !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return this._cd?.control?._pristine?.(), !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return this._cd?.control?._status?.(), !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return this._cd?._submitted?.(), !!this._cd?.submitted;
    }
  },
  kD = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  K0 = G(R({}, kD), { "[class.ng-submitted]": "isSubmitted" }),
  Vf = (() => {
    class e extends si {
      constructor(n) {
        super(n);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)($(gr, 2));
        };
      }
      static {
        this.ɵdir = Te({
          type: e,
          selectors: [
            ["", "formControlName", ""],
            ["", "ngModel", ""],
            ["", "formControl", ""],
          ],
          hostVars: 14,
          hostBindings: function (r, o) {
            r & 2 &&
              Lo("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
                "ng-pristine",
                o.isPristine
              )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
                "ng-invalid",
                o.isInvalid
              )("ng-pending", o.isPending);
          },
          features: [dt],
        });
      }
    }
    return e;
  })(),
  jf = (() => {
    class e extends si {
      constructor(n) {
        super(n);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)($(Cn, 10));
        };
      }
      static {
        this.ɵdir = Te({
          type: e,
          selectors: [
            ["", "formGroupName", ""],
            ["", "formArrayName", ""],
            ["", "ngModelGroup", ""],
            ["", "formGroup", ""],
            ["form", 3, "ngNoForm", ""],
            ["", "ngForm", ""],
          ],
          hostVars: 16,
          hostBindings: function (r, o) {
            r & 2 &&
              Lo("ng-untouched", o.isUntouched)("ng-touched", o.isTouched)(
                "ng-pristine",
                o.isPristine
              )("ng-dirty", o.isDirty)("ng-valid", o.isValid)(
                "ng-invalid",
                o.isInvalid
              )("ng-pending", o.isPending)("ng-submitted", o.isSubmitted);
          },
          features: [dt],
        });
      }
    }
    return e;
  })();
var dr = "VALID",
  ri = "INVALID",
  vn = "PENDING",
  fr = "DISABLED",
  Ct = class {},
  ai = class extends Ct {
    constructor(t, n) {
      super(), (this.value = t), (this.source = n);
    }
  },
  hr = class extends Ct {
    constructor(t, n) {
      super(), (this.pristine = t), (this.source = n);
    }
  },
  pr = class extends Ct {
    constructor(t, n) {
      super(), (this.touched = t), (this.source = n);
    }
  },
  Dn = class extends Ct {
    constructor(t, n) {
      super(), (this.status = t), (this.source = n);
    }
  },
  Ja = class extends Ct {
    constructor(t) {
      super(), (this.source = t);
    }
  },
  Xa = class extends Ct {
    constructor(t) {
      super(), (this.source = t);
    }
  };
function Bf(e) {
  return (hi(e) ? e.validators : e) || null;
}
function LD(e) {
  return Array.isArray(e) ? Ff(e) : e || null;
}
function $f(e, t) {
  return (hi(t) ? t.asyncValidators : e) || null;
}
function VD(e) {
  return Array.isArray(e) ? Pf(e) : e || null;
}
function hi(e) {
  return e != null && !Array.isArray(e) && typeof e == "object";
}
function jD(e, t, n) {
  let r = e.controls;
  if (!(t ? Object.keys(r) : r).length) throw new I(1e3, "");
  if (!r[n]) throw new I(1001, "");
}
function BD(e, t, n) {
  e._forEachChild((r, o) => {
    if (n[o] === void 0) throw new I(1002, "");
  });
}
var ci = class {
    constructor(t, n) {
      (this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = null),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this._status = Jn(() => this.statusReactive())),
        (this.statusReactive = Ft(void 0)),
        (this._pristine = Jn(() => this.pristineReactive())),
        (this.pristineReactive = Ft(!0)),
        (this._touched = Jn(() => this.touchedReactive())),
        (this.touchedReactive = Ft(!1)),
        (this._events = new Q()),
        (this.events = this._events.asObservable()),
        (this._onDisabledChange = []),
        this._assignValidators(t),
        this._assignAsyncValidators(n);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(t) {
      this._rawValidators = this._composedValidatorFn = t;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(t) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = t;
    }
    get parent() {
      return this._parent;
    }
    get status() {
      return Ke(this.statusReactive);
    }
    set status(t) {
      Ke(() => this.statusReactive.set(t));
    }
    get valid() {
      return this.status === dr;
    }
    get invalid() {
      return this.status === ri;
    }
    get pending() {
      return this.status == vn;
    }
    get disabled() {
      return this.status === fr;
    }
    get enabled() {
      return this.status !== fr;
    }
    get pristine() {
      return Ke(this.pristineReactive);
    }
    set pristine(t) {
      Ke(() => this.pristineReactive.set(t));
    }
    get dirty() {
      return !this.pristine;
    }
    get touched() {
      return Ke(this.touchedReactive);
    }
    set touched(t) {
      Ke(() => this.touchedReactive.set(t));
    }
    get untouched() {
      return !this.touched;
    }
    get updateOn() {
      return this._updateOn
        ? this._updateOn
        : this.parent
        ? this.parent.updateOn
        : "change";
    }
    setValidators(t) {
      this._assignValidators(t);
    }
    setAsyncValidators(t) {
      this._assignAsyncValidators(t);
    }
    addValidators(t) {
      this.setValidators(gf(t, this._rawValidators));
    }
    addAsyncValidators(t) {
      this.setAsyncValidators(gf(t, this._rawAsyncValidators));
    }
    removeValidators(t) {
      this.setValidators(mf(t, this._rawValidators));
    }
    removeAsyncValidators(t) {
      this.setAsyncValidators(mf(t, this._rawAsyncValidators));
    }
    hasValidator(t) {
      return oi(this._rawValidators, t);
    }
    hasAsyncValidator(t) {
      return oi(this._rawAsyncValidators, t);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(t = {}) {
      let n = this.touched === !1;
      this.touched = !0;
      let r = t.sourceControl ?? this;
      this._parent &&
        !t.onlySelf &&
        this._parent.markAsTouched(G(R({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new pr(!0, r));
    }
    markAllAsTouched(t = {}) {
      this.markAsTouched({
        onlySelf: !0,
        emitEvent: t.emitEvent,
        sourceControl: this,
      }),
        this._forEachChild((n) => n.markAllAsTouched(t));
    }
    markAsUntouched(t = {}) {
      let n = this.touched === !0;
      (this.touched = !1), (this._pendingTouched = !1);
      let r = t.sourceControl ?? this;
      this._forEachChild((o) => {
        o.markAsUntouched({
          onlySelf: !0,
          emitEvent: t.emitEvent,
          sourceControl: r,
        });
      }),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, r),
        n && t.emitEvent !== !1 && this._events.next(new pr(!1, r));
    }
    markAsDirty(t = {}) {
      let n = this.pristine === !0;
      this.pristine = !1;
      let r = t.sourceControl ?? this;
      this._parent &&
        !t.onlySelf &&
        this._parent.markAsDirty(G(R({}, t), { sourceControl: r })),
        n && t.emitEvent !== !1 && this._events.next(new hr(!1, r));
    }
    markAsPristine(t = {}) {
      let n = this.pristine === !1;
      (this.pristine = !0), (this._pendingDirty = !1);
      let r = t.sourceControl ?? this;
      this._forEachChild((o) => {
        o.markAsPristine({ onlySelf: !0, emitEvent: t.emitEvent });
      }),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, r),
        n && t.emitEvent !== !1 && this._events.next(new hr(!0, r));
    }
    markAsPending(t = {}) {
      this.status = vn;
      let n = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new Dn(this.status, n)),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.markAsPending(G(R({}, t), { sourceControl: n }));
    }
    disable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = fr),
        (this.errors = null),
        this._forEachChild((o) => {
          o.disable(G(R({}, t), { onlySelf: !0 }));
        }),
        this._updateValue();
      let r = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new ai(this.value, r)),
        this._events.next(new Dn(this.status, r)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(G(R({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((o) => o(!0));
    }
    enable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = dr),
        this._forEachChild((r) => {
          r.enable(G(R({}, t), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
        this._updateAncestors(G(R({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((r) => r(!1));
    }
    _updateAncestors(t, n) {
      this._parent &&
        !t.onlySelf &&
        (this._parent.updateValueAndValidity(t),
        t.skipPristineCheck || this._parent._updatePristine({}, n),
        this._parent._updateTouched({}, n));
    }
    setParent(t) {
      this._parent = t;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(t = {}) {
      if ((this._setInitialStatus(), this._updateValue(), this.enabled)) {
        let r = this._cancelExistingSubscription();
        (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === dr || this.status === vn) &&
            this._runAsyncValidator(r, t.emitEvent);
      }
      let n = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new ai(this.value, n)),
        this._events.next(new Dn(this.status, n)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.updateValueAndValidity(
            G(R({}, t), { sourceControl: n })
          );
    }
    _updateTreeValidity(t = { emitEvent: !0 }) {
      this._forEachChild((n) => n._updateTreeValidity(t)),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? fr : dr;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(t, n) {
      if (this.asyncValidator) {
        (this.status = vn),
          (this._hasOwnPendingAsyncValidator = { emitEvent: n !== !1 });
        let r = xf(this.asyncValidator(this));
        this._asyncValidationSubscription = r.subscribe((o) => {
          (this._hasOwnPendingAsyncValidator = null),
            this.setErrors(o, { emitEvent: n, shouldHaveEmitted: t });
        });
      }
    }
    _cancelExistingSubscription() {
      if (this._asyncValidationSubscription) {
        this._asyncValidationSubscription.unsubscribe();
        let t = this._hasOwnPendingAsyncValidator?.emitEvent ?? !1;
        return (this._hasOwnPendingAsyncValidator = null), t;
      }
      return !1;
    }
    setErrors(t, n = {}) {
      (this.errors = t),
        this._updateControlsErrors(
          n.emitEvent !== !1,
          this,
          n.shouldHaveEmitted
        );
    }
    get(t) {
      let n = t;
      return n == null ||
        (Array.isArray(n) || (n = n.split(".")), n.length === 0)
        ? null
        : n.reduce((r, o) => r && r._find(o), this);
    }
    getError(t, n) {
      let r = n ? this.get(n) : this;
      return r && r.errors ? r.errors[t] : null;
    }
    hasError(t, n) {
      return !!this.getError(t, n);
    }
    get root() {
      let t = this;
      for (; t._parent; ) t = t._parent;
      return t;
    }
    _updateControlsErrors(t, n, r) {
      (this.status = this._calculateStatus()),
        t && this.statusChanges.emit(this.status),
        (t || r) && this._events.next(new Dn(this.status, n)),
        this._parent && this._parent._updateControlsErrors(t, n, r);
    }
    _initObservables() {
      (this.valueChanges = new B()), (this.statusChanges = new B());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? fr
        : this.errors
        ? ri
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(vn)
        ? vn
        : this._anyControlsHaveStatus(ri)
        ? ri
        : dr;
    }
    _anyControlsHaveStatus(t) {
      return this._anyControls((n) => n.status === t);
    }
    _anyControlsDirty() {
      return this._anyControls((t) => t.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((t) => t.touched);
    }
    _updatePristine(t, n) {
      let r = !this._anyControlsDirty(),
        o = this.pristine !== r;
      (this.pristine = r),
        this._parent && !t.onlySelf && this._parent._updatePristine(t, n),
        o && this._events.next(new hr(this.pristine, n));
    }
    _updateTouched(t = {}, n) {
      (this.touched = this._anyControlsTouched()),
        this._events.next(new pr(this.touched, n)),
        this._parent && !t.onlySelf && this._parent._updateTouched(t, n);
    }
    _registerOnCollectionChange(t) {
      this._onCollectionChange = t;
    }
    _setUpdateStrategy(t) {
      hi(t) && t.updateOn != null && (this._updateOn = t.updateOn);
    }
    _parentMarkedDirty(t) {
      let n = this._parent && this._parent.dirty;
      return !t && !!n && !this._parent._anyControlsDirty();
    }
    _find(t) {
      return null;
    }
    _assignValidators(t) {
      (this._rawValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedValidatorFn = LD(this._rawValidators));
    }
    _assignAsyncValidators(t) {
      (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedAsyncValidatorFn = VD(this._rawAsyncValidators));
    }
  },
  ui = class extends ci {
    constructor(t, n, r) {
      super(Bf(n), $f(r, n)),
        (this.controls = t),
        this._initObservables(),
        this._setUpdateStrategy(n),
        this._setUpControls(),
        this.updateValueAndValidity({
          onlySelf: !0,
          emitEvent: !!this.asyncValidator,
        });
    }
    registerControl(t, n) {
      return this.controls[t]
        ? this.controls[t]
        : ((this.controls[t] = n),
          n.setParent(this),
          n._registerOnCollectionChange(this._onCollectionChange),
          n);
    }
    addControl(t, n, r = {}) {
      this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    removeControl(t, n = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    setControl(t, n, r = {}) {
      this.controls[t] &&
        this.controls[t]._registerOnCollectionChange(() => {}),
        delete this.controls[t],
        n && this.registerControl(t, n),
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    contains(t) {
      return this.controls.hasOwnProperty(t) && this.controls[t].enabled;
    }
    setValue(t, n = {}) {
      BD(this, !0, t),
        Object.keys(t).forEach((r) => {
          jD(this, !0, r),
            this.controls[r].setValue(t[r], {
              onlySelf: !0,
              emitEvent: n.emitEvent,
            });
        }),
        this.updateValueAndValidity(n);
    }
    patchValue(t, n = {}) {
      t != null &&
        (Object.keys(t).forEach((r) => {
          let o = this.controls[r];
          o && o.patchValue(t[r], { onlySelf: !0, emitEvent: n.emitEvent });
        }),
        this.updateValueAndValidity(n));
    }
    reset(t = {}, n = {}) {
      this._forEachChild((r, o) => {
        r.reset(t ? t[o] : null, { onlySelf: !0, emitEvent: n.emitEvent });
      }),
        this._updatePristine(n, this),
        this._updateTouched(n, this),
        this.updateValueAndValidity(n);
    }
    getRawValue() {
      return this._reduceChildren(
        {},
        (t, n, r) => ((t[r] = n.getRawValue()), t)
      );
    }
    _syncPendingControls() {
      let t = this._reduceChildren(!1, (n, r) =>
        r._syncPendingControls() ? !0 : n
      );
      return t && this.updateValueAndValidity({ onlySelf: !0 }), t;
    }
    _forEachChild(t) {
      Object.keys(this.controls).forEach((n) => {
        let r = this.controls[n];
        r && t(r, n);
      });
    }
    _setUpControls() {
      this._forEachChild((t) => {
        t.setParent(this),
          t._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(t) {
      for (let [n, r] of Object.entries(this.controls))
        if (this.contains(n) && t(r)) return !0;
      return !1;
    }
    _reduceValue() {
      let t = {};
      return this._reduceChildren(
        t,
        (n, r, o) => ((r.enabled || this.disabled) && (n[o] = r.value), n)
      );
    }
    _reduceChildren(t, n) {
      let r = t;
      return (
        this._forEachChild((o, i) => {
          r = n(r, o, i);
        }),
        r
      );
    }
    _allControlsDisabled() {
      for (let t of Object.keys(this.controls))
        if (this.controls[t].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(t) {
      return this.controls.hasOwnProperty(t) ? this.controls[t] : null;
    }
  };
var Uf = new C("CallSetDisabledState", {
    providedIn: "root",
    factory: () => ec,
  }),
  ec = "always";
function $D(e, t) {
  return [...t.path, e];
}
function yf(e, t, n = ec) {
  tc(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === "always") &&
      t.valueAccessor.setDisabledState?.(e.disabled),
    HD(e, t),
    zD(e, t),
    GD(e, t),
    UD(e, t);
}
function vf(e, t, n = !0) {
  let r = () => {};
  t.valueAccessor &&
    (t.valueAccessor.registerOnChange(r), t.valueAccessor.registerOnTouched(r)),
    di(e, t),
    e &&
      (t._invokeOnDestroyCallbacks(), e._registerOnCollectionChange(() => {}));
}
function li(e, t) {
  e.forEach((n) => {
    n.registerOnValidatorChange && n.registerOnValidatorChange(t);
  });
}
function UD(e, t) {
  if (t.valueAccessor.setDisabledState) {
    let n = (r) => {
      t.valueAccessor.setDisabledState(r);
    };
    e.registerOnDisabledChange(n),
      t._registerOnDestroy(() => {
        e._unregisterOnDisabledChange(n);
      });
  }
}
function tc(e, t) {
  let n = kf(e);
  t.validator !== null
    ? e.setValidators(pf(n, t.validator))
    : typeof n == "function" && e.setValidators([n]);
  let r = Lf(e);
  t.asyncValidator !== null
    ? e.setAsyncValidators(pf(r, t.asyncValidator))
    : typeof r == "function" && e.setAsyncValidators([r]);
  let o = () => e.updateValueAndValidity();
  li(t._rawValidators, o), li(t._rawAsyncValidators, o);
}
function di(e, t) {
  let n = !1;
  if (e !== null) {
    if (t.validator !== null) {
      let o = kf(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.validator);
        i.length !== o.length && ((n = !0), e.setValidators(i));
      }
    }
    if (t.asyncValidator !== null) {
      let o = Lf(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.asyncValidator);
        i.length !== o.length && ((n = !0), e.setAsyncValidators(i));
      }
    }
  }
  let r = () => {};
  return li(t._rawValidators, r), li(t._rawAsyncValidators, r), n;
}
function HD(e, t) {
  t.valueAccessor.registerOnChange((n) => {
    (e._pendingValue = n),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === "change" && Hf(e, t);
  });
}
function GD(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    (e._pendingTouched = !0),
      e.updateOn === "blur" && e._pendingChange && Hf(e, t),
      e.updateOn !== "submit" && e.markAsTouched();
  });
}
function Hf(e, t) {
  e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1);
}
function zD(e, t) {
  let n = (r, o) => {
    t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
  };
  e.registerOnChange(n),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(n);
    });
}
function WD(e, t) {
  e == null, tc(e, t);
}
function qD(e, t) {
  return di(e, t);
}
function ZD(e, t) {
  if (!e.hasOwnProperty("model")) return !1;
  let n = e.model;
  return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue);
}
function YD(e) {
  return Object.getPrototypeOf(e.constructor) === ED;
}
function QD(e, t) {
  e._syncPendingControls(),
    t.forEach((n) => {
      let r = n.control;
      r.updateOn === "submit" &&
        r._pendingChange &&
        (n.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
    });
}
function KD(e, t) {
  if (!t) return null;
  Array.isArray(t);
  let n, r, o;
  return (
    t.forEach((i) => {
      i.constructor === fi ? (n = i) : YD(i) ? (r = i) : (o = i);
    }),
    o || r || n || null
  );
}
function JD(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Df(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Cf(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    Object.keys(e).length === 2 &&
    "value" in e &&
    "disabled" in e
  );
}
var wn = class extends ci {
  constructor(t = null, n, r) {
    super(Bf(n), $f(r, n)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(t),
      this._setUpdateStrategy(n),
      this._initObservables(),
      this.updateValueAndValidity({
        onlySelf: !0,
        emitEvent: !!this.asyncValidator,
      }),
      hi(n) &&
        (n.nonNullable || n.initialValueIsDefault) &&
        (Cf(t) ? (this.defaultValue = t.value) : (this.defaultValue = t));
  }
  setValue(t, n = {}) {
    (this.value = this._pendingValue = t),
      this._onChange.length &&
        n.emitModelToViewChange !== !1 &&
        this._onChange.forEach((r) =>
          r(this.value, n.emitViewToModelChange !== !1)
        ),
      this.updateValueAndValidity(n);
  }
  patchValue(t, n = {}) {
    this.setValue(t, n);
  }
  reset(t = this.defaultValue, n = {}) {
    this._applyFormState(t),
      this.markAsPristine(n),
      this.markAsUntouched(n),
      this.setValue(this.value, n),
      (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(t) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(t) {
    this._onChange.push(t);
  }
  _unregisterOnChange(t) {
    Df(this._onChange, t);
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t);
  }
  _unregisterOnDisabledChange(t) {
    Df(this._onDisabledChange, t);
  }
  _forEachChild(t) {}
  _syncPendingControls() {
    return this.updateOn === "submit" &&
      (this._pendingDirty && this.markAsDirty(),
      this._pendingTouched && this.markAsTouched(),
      this._pendingChange)
      ? (this.setValue(this._pendingValue, {
          onlySelf: !0,
          emitModelToViewChange: !1,
        }),
        !0)
      : !1;
  }
  _applyFormState(t) {
    Cf(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t);
  }
};
var XD = (e) => e instanceof wn;
var Gf = (() => {
  class e {
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵdir = Te({
        type: e,
        selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
        hostAttrs: ["novalidate", ""],
      });
    }
  }
  return e;
})();
var zf = new C("");
var eC = { provide: Cn, useExisting: cn(() => nc) },
  nc = (() => {
    class e extends Cn {
      get submitted() {
        return Ke(this._submittedReactive);
      }
      set submitted(n) {
        this._submittedReactive.set(n);
      }
      constructor(n, r, o) {
        super(),
          (this.callSetDisabledState = o),
          (this._submitted = Jn(() => this._submittedReactive())),
          (this._submittedReactive = Ft(!1)),
          (this._onCollectionChange = () => this._updateDomValue()),
          (this.directives = []),
          (this.form = null),
          (this.ngSubmit = new B()),
          this._setValidators(n),
          this._setAsyncValidators(r);
      }
      ngOnChanges(n) {
        this._checkFormPresent(),
          n.hasOwnProperty("form") &&
            (this._updateValidators(),
            this._updateDomValue(),
            this._updateRegistrations(),
            (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (di(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange &&
            this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(n) {
        let r = this.form.get(n.path);
        return (
          yf(r, n, this.callSetDisabledState),
          r.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(n),
          r
        );
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        vf(n.control || null, n, !1), JD(this.directives, n);
      }
      addFormGroup(n) {
        this._setUpFormContainer(n);
      }
      removeFormGroup(n) {
        this._cleanUpFormContainer(n);
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      addFormArray(n) {
        this._setUpFormContainer(n);
      }
      removeFormArray(n) {
        this._cleanUpFormContainer(n);
      }
      getFormArray(n) {
        return this.form.get(n.path);
      }
      updateModel(n, r) {
        this.form.get(n.path).setValue(r);
      }
      onSubmit(n) {
        return (
          this._submittedReactive.set(!0),
          QD(this.form, this.directives),
          this.ngSubmit.emit(n),
          this.form._events.next(new Ja(this.control)),
          n?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n),
          this._submittedReactive.set(!1),
          this.form._events.next(new Xa(this.form));
      }
      _updateDomValue() {
        this.directives.forEach((n) => {
          let r = n.control,
            o = this.form.get(n.path);
          r !== o &&
            (vf(r || null, n),
            XD(o) && (yf(o, n, this.callSetDisabledState), (n.control = o)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(n) {
        let r = this.form.get(n.path);
        WD(r, n), r.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let r = this.form.get(n.path);
          r && qD(r, n) && r.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        tc(this.form, this), this._oldForm && di(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)($(_f, 10), $(If, 10), $(Uf, 8));
        };
      }
      static {
        this.ɵdir = Te({
          type: e,
          selectors: [["", "formGroup", ""]],
          hostBindings: function (r, o) {
            r & 1 &&
              O("submit", function (s) {
                return o.onSubmit(s);
              })("reset", function () {
                return o.onReset();
              });
          },
          inputs: { form: [0, "formGroup", "form"] },
          outputs: { ngSubmit: "ngSubmit" },
          exportAs: ["ngForm"],
          features: [Bo([eC]), dt, Un],
        });
      }
    }
    return e;
  })();
var tC = { provide: gr, useExisting: cn(() => rc) },
  rc = (() => {
    class e extends gr {
      set isDisabled(n) {}
      static {
        this._ngModelWarningSentOnce = !1;
      }
      constructor(n, r, o, i, s) {
        super(),
          (this._ngModelWarningConfig = s),
          (this._added = !1),
          (this.name = null),
          (this.update = new B()),
          (this._ngModelWarningSent = !1),
          (this._parent = n),
          this._setValidators(r),
          this._setAsyncValidators(o),
          (this.valueAccessor = KD(this, i));
      }
      ngOnChanges(n) {
        this._added || this._setUpControl(),
          ZD(n, this.viewModel) &&
            ((this.viewModel = this.model),
            this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      get path() {
        return $D(
          this.name == null ? this.name : this.name.toString(),
          this._parent
        );
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(),
          (this.control = this.formDirective.addControl(this)),
          (this._added = !0);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(
            $(Cn, 13),
            $(_f, 10),
            $(If, 10),
            $(Ef, 10),
            $(zf, 8)
          );
        };
      }
      static {
        this.ɵdir = Te({
          type: e,
          selectors: [["", "formControlName", ""]],
          inputs: {
            name: [0, "formControlName", "name"],
            isDisabled: [0, "disabled", "isDisabled"],
            model: [0, "ngModel", "model"],
          },
          outputs: { update: "ngModelChange" },
          features: [Bo([tC]), dt, Un],
        });
      }
    }
    return e;
  })();
var nC = (() => {
  class e {
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵmod = Ze({ type: e });
    }
    static {
      this.ɵinj = qe({});
    }
  }
  return e;
})();
var pi = (() => {
  class e {
    static withConfig(n) {
      return {
        ngModule: e,
        providers: [
          { provide: zf, useValue: n.warnOnNgModelWithFormControl ?? "always" },
          { provide: Uf, useValue: n.callSetDisabledState ?? ec },
        ],
      };
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵmod = Ze({ type: e });
    }
    static {
      this.ɵinj = qe({ imports: [nC] });
    }
  }
  return e;
})();
var gi = class e {
  contactForm = new ui({
    username: new wn("", [Dt.required]),
    email: new wn("", [Dt.required, Dt.email]),
    subject: new wn("", [Dt.required]),
    message: new wn("", [Dt.required]),
  });
  onSubmit() {
    if (this.contactForm.valid) {
      let t = {
        name: this.contactForm.value.username,
        email: this.contactForm.value.email,
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message,
      };
      console.log(t),
        hf
          .send("service_c2pii6u", "template_c3addk5", t, "QHVmY2xHRyND2kBoT")
          .then(
            (n) => {
              console.log("SUCCESS!", n.status, n.text),
                alert("Mensaje enviado correctamente \u{1F4E9}"),
                this.contactForm.reset();
            },
            (n) => {
              console.error("FAILED...", n),
                alert(
                  "Error al enviar el mensaje, intenta de nuevo m\xE1s tarde."
                );
            }
          );
    } else console.log("Form is invalid");
  }
  navigate = new B();
  goNextSection(t, n) {
    n.preventDefault(), this.navigate.emit(t);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = K({
    type: e,
    selectors: [["app-formular"]],
    outputs: { navigate: "navigate" },
    standalone: !0,
    features: [X],
    decls: 36,
    vars: 30,
    consts: [
      [
        1,
        "w-full",
        "h-full",
        "bg-surface",
        "text-center",
        "flex",
        "flex-col",
        "relative",
      ],
      [1, "py-8"],
      [
        1,
        "text-left",
        "justify-center",
        "font-bold",
        "font-sans",
        "px-6",
        "mt-8",
        "md:mt-10",
        "lg:mt-24",
        "grid",
        "grid-cols-1",
        "grid-rows-4",
        "lg:grid-cols-2",
        "lg:grid-rows-3",
        "lg:grid-flow-col",
        "gap-4",
        "md:gap-2",
        "lg:gap-10",
        3,
        "ngSubmit",
        "formGroup",
      ],
      [1, "col-span-full", "row-span-1", "lg:col-span-1", "lg:row-span-1"],
      [
        "for",
        "username",
        1,
        "text-form-sm",
        "lg:text-form-lg",
        "md:text-form-md",
        "text-primary",
        "hover:text-acent",
      ],
      [
        1,
        "flex",
        "items-center",
        "rounded-md",
        "outline-1",
        "-outline-offset-1",
        "outline-gray-300",
        "focus-within:outline-2",
        "focus-within:-outline-offset-2",
        "focus-within:outline-acent",
      ],
      [
        "id",
        "username",
        "formControlName",
        "username",
        "type",
        "text",
        "name",
        "username",
        1,
        "border-2",
        "border-primary",
        "block",
        "w-full",
        "rounded-md",
        "px-3",
        "text-primary",
        "outline-1",
        "-outline-offset-1",
        "outline-primary",
        "placeholder:text-gray-400",
        "focus-within:outline-2",
        "focus-within:-outline-offset-2",
        "text-form-sm",
        "lg:text-form-lg",
        "md:text-form-md",
        "font-light",
        3,
        "placeholder",
      ],
      [1, "col-span-full", "row-span-1", "lg:col-span-1", "lg:row-span-2"],
      [
        "for",
        "email",
        1,
        "text-form-sm",
        "lg:text-form-lg",
        "md:text-form-md",
        "text-primary",
        "hover:text-acent",
      ],
      [
        "id",
        "email",
        "formControlName",
        "email",
        "type",
        "email",
        "name",
        "email",
        1,
        "border-2",
        "border-primary",
        "block",
        "w-full",
        "rounded-md",
        "px-3",
        "text-primary",
        "outline-1",
        "-outline-offset-1",
        "outline-primary",
        "placeholder:text-gray-400",
        "focus-within:outline-2",
        "focus-within:-outline-offset-2",
        "text-form-sm",
        "lg:text-form-lg",
        "md:text-form-md",
        "font-light",
        3,
        "placeholder",
      ],
      [
        "for",
        "subject",
        1,
        "text-form-sm",
        "lg:text-form-lg",
        "md:text-form-md",
        "text-primary",
        "hover:text-acent",
      ],
      [
        "id",
        "subject",
        "formControlName",
        "subject",
        "type",
        "text",
        "name",
        "subject",
        1,
        "border-2",
        "border-primary",
        "block",
        "w-full",
        "rounded-md",
        "px-3",
        "text-primary",
        "outline-1",
        "-outline-offset-1",
        "outline-primary",
        "placeholder:text-gray-400",
        "focus-within:outline-2",
        "focus-within:-outline-offset-2",
        "text-form-sm",
        "lg:text-form-lg",
        "md:text-form-md",
        "font-light",
        3,
        "placeholder",
      ],
      [
        "for",
        "message",
        1,
        "text-form-sm",
        "lg:text-form-lg",
        "md:text-form-md",
        "text-primary",
        "hover:text-acent",
      ],
      [
        "id",
        "message",
        "formControlName",
        "message",
        "name",
        "message",
        1,
        "border-2",
        "border-primary",
        "block",
        "w-full",
        "rounded-md",
        "px-3",
        "text-primary",
        "outline-1",
        "-outline-offset-1",
        "outline-primary",
        "placeholder:text-gray-400",
        "focus-within:outline-2",
        "focus-within:-outline-offset-2",
        "text-form-sm",
        "lg:text-form-lg",
        "md:text-form-md",
        "font-light",
        3,
        "placeholder",
      ],
      [
        1,
        "mt-2",
        "md:mt-2",
        "flex",
        "items-center",
        "justify-center",
        "lg:col-span-1",
        "lg:row-span-1",
        "text-sm",
        "text-button-sm",
        "md:text-button-md",
        "lg:text-button-lg",
      ],
      [
        "type",
        "submit",
        1,
        "bg-acent",
        "text-surface",
        "hover:border-acent",
        "hover:border-2",
        "hover:bg-surface",
        "hover:text-acent",
        "disabled:bg-button-disabled",
        "disabled:border-0",
        "disabled:text-black",
        "font-bold",
        "py-2",
        "px-4",
        "rounded-full",
        "disabled:cursor-not-allowed",
        "cursor-pointer",
        3,
        "disabled",
      ],
      [
        1,
        "text-secondary",
        "flex",
        "flex-row",
        "justify-center",
        "items-center",
        "w-full",
        "absolute",
        "bottom-0.5",
        "md:bottom-2",
        "lg:bottom-2",
      ],
      [
        "src",
        "assets/icons/arrow-up.svg",
        1,
        "size-8",
        "md:size-9",
        "lg:size-11",
        "cursor-pointer",
        3,
        "click",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "div", 0)(1, "div", 1)(2, "form", 2),
        O("ngSubmit", function () {
          return r.onSubmit();
        }),
        m(3, "div", 3)(4, "label", 4),
        V(5),
        U(6, "translate"),
        y(),
        m(7, "div", 5),
        J(8, "input", 6),
        U(9, "translate"),
        y()(),
        m(10, "div", 7)(11, "label", 8),
        V(12),
        U(13, "translate"),
        y(),
        m(14, "div", 5),
        J(15, "input", 9),
        U(16, "translate"),
        y()(),
        m(17, "div", 3)(18, "label", 10),
        V(19),
        U(20, "translate"),
        y(),
        m(21, "div", 5),
        J(22, "input", 11),
        U(23, "translate"),
        y()(),
        m(24, "div", 3)(25, "label", 12),
        V(26),
        U(27, "translate"),
        y(),
        J(28, "textarea", 13),
        U(29, "translate"),
        y(),
        m(30, "div", 14)(31, "button", 15),
        V(32),
        U(33, "translate"),
        y()()(),
        m(34, "div", 16)(35, "img", 17),
        O("click", function (i) {
          return r.goNextSection("projects", i);
        }),
        y()()()()),
        n & 2 &&
          (N(2),
          Se("formGroup", r.contactForm),
          N(3),
          Ne(H(6, 12, "username")),
          N(3),
          Yn("placeholder", H(9, 14, "username")),
          N(4),
          Ne(H(13, 16, "email")),
          N(3),
          Yn("placeholder", H(16, 18, "email")),
          N(4),
          Ne(H(20, 20, "subject")),
          N(3),
          Yn("placeholder", H(23, 22, "subject")),
          N(4),
          Ne(H(27, 24, "message")),
          N(2),
          jo("placeholder", "", H(29, 26, "message"), "..."),
          N(3),
          Se("disabled", r.contactForm.invalid),
          N(),
          de(" ", H(33, 28, "send Message"), " "));
    },
    dependencies: [pi, Gf, fi, Vf, jf, nc, rc, Pa, Ee, Ve],
  });
};
var mi = class e {
  constructor(t) {
    this.http = t;
  }
  dataUrl = "assets/data/tech/technologies.json";
  getTechnologies() {
    return this.http.get(this.dataUrl);
  }
  static ɵfac = function (n) {
    return new (n || e)(T(Pt));
  };
  static ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var Wf = (e, t) => t.name;
function oC(e, t) {
  if ((e & 1 && (m(0, "li"), J(1, "img", 2), y()), e & 2)) {
    let n = t.$implicit;
    N(), Se("src", n == null ? null : n.link, Gn);
  }
}
function iC(e, t) {
  if ((e & 1 && (m(0, "li"), J(1, "img", 2), y()), e & 2)) {
    let n = t.$implicit;
    N(), Se("src", n == null ? null : n.link, Gn);
  }
}
var yi = class e {
  technologieService = v(mi);
  technologies = [];
  ngOnInit() {
    this.technologieService.getTechnologies().subscribe((t) => {
      this.technologies = [...t];
    });
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = K({
    type: e,
    selectors: [["app-carrousel"]],
    standalone: !0,
    features: [X],
    decls: 7,
    vars: 0,
    consts: [
      [
        1,
        "w-full",
        "inline-flex",
        "flex-nowrap",
        "overflow-hidden",
        "[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]",
      ],
      [
        "aria-hidden",
        "true",
        1,
        "flex",
        "items-center",
        "justify-center",
        "md:justify-start",
        "[&_li]:mx-8",
        "[&_img]:max-w-none",
        "animate-infinite-scroll",
      ],
      [1, "size-16", "md:size-30", "lg:size-40", "object-contain", 3, "src"],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "div", 0)(1, "ul", 1),
        qn(2, oC, 2, 1, "li", null, Wf),
        y(),
        m(4, "ul", 1),
        qn(5, iC, 2, 1, "li", null, Wf),
        y()()),
        n & 2 && (N(2), Zn(r.technologies), N(3), Zn(r.technologies));
    },
  });
};
var vi = class e {
  navigate = new B();
  goNextSection(t, n) {
    n.preventDefault(), this.navigate.emit(t);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = K({
    type: e,
    selectors: [["app-about"]],
    outputs: { navigate: "navigate" },
    standalone: !0,
    features: [X],
    decls: 14,
    vars: 9,
    consts: [
      [
        1,
        "w-full",
        "h-full",
        "bg-surface",
        "text-center",
        "flex",
        "flex-col",
        "relative",
        "items-center",
        "lg:gap-8",
        "gap-2",
      ],
      [
        1,
        "font-fraunces",
        "font-medium",
        "text-h1-sm",
        "md:text-h1-md",
        "lg:text-h1-lg",
        "text-primary",
        "mt-6",
        "md:mt-2",
        "lg:mt-2",
      ],
      [
        1,
        "font-sans",
        "text-p-sm",
        "sm:text-p-sm",
        "md:text-p-md",
        "lg:text-p-lg",
        "text-primary",
        "px-10",
      ],
      [
        1,
        "font-fraunces",
        "font-medium",
        "text-h2-sm",
        "md:text-h2-md",
        "lg:text-h2-lg",
        "text-primary",
        "sm:mt-2",
        "md:mt-2",
      ],
      [1, "overflow-hidden", "w-full"],
      [
        1,
        "text-secondary",
        "flex",
        "flex-row",
        "justify-center",
        "items-center",
        "gap-8",
        "w-full",
        "absolute",
        "bottom-6",
      ],
      [
        "src",
        "assets/icons/arrow-down.svg",
        1,
        "size-8",
        "md:size-9",
        "lg:size-11",
        "cursor-pointer",
        3,
        "click",
      ],
      [
        "src",
        "assets/icons/arrow-up.svg",
        1,
        "size-8",
        "md:size-9",
        "lg:size-11",
        "cursor-pointer",
        3,
        "click",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "div", 0)(1, "h1", 1),
        V(2),
        U(3, "translate"),
        y(),
        m(4, "p", 2),
        V(5),
        U(6, "translate"),
        y(),
        m(7, "h1", 3),
        V(8),
        U(9, "translate"),
        y(),
        J(10, "app-carrousel", 4),
        m(11, "div", 5)(12, "img", 6),
        O("click", function (i) {
          return r.goNextSection("projects", i);
        }),
        y(),
        m(13, "img", 7),
        O("click", function (i) {
          return r.goNextSection("home", i);
        }),
        y()()()),
        n & 2 &&
          (N(2),
          de(" ", H(3, 3, "about"), " "),
          N(3),
          de(" ", H(6, 5, "text"), " "),
          N(3),
          de(" ", H(9, 7, "technologies"), " "));
    },
    dependencies: [yi, Ee, Ve],
  });
};
function sC(e, t) {
  if (e & 1) {
    let n = Rt();
    m(0, "div", 2)(1, "nav", 3)(2, "a", 4),
      O("click", function (o) {
        De(n);
        let i = we();
        return Ce(i.goToSection("home", o));
      }),
      V(3),
      U(4, "translate"),
      y(),
      m(5, "a", 5),
      O("click", function (o) {
        De(n);
        let i = we();
        return Ce(i.goToSection("about", o));
      }),
      V(6),
      U(7, "translate"),
      y(),
      m(8, "a", 6),
      O("click", function (o) {
        De(n);
        let i = we();
        return Ce(i.goToSection("projects", o));
      }),
      V(9),
      U(10, "translate"),
      y(),
      m(11, "a", 7),
      O("click", function (o) {
        De(n);
        let i = we();
        return Ce(i.goToSection("contact", o));
      }),
      V(12),
      U(13, "translate"),
      y(),
      m(14, "div", 8)(15, "a", 9),
      O("click", function () {
        De(n);
        let o = we();
        return Ce(o.setLanguage("en"));
      }),
      V(16, "EN"),
      y(),
      m(17, "a", 9),
      O("click", function () {
        De(n);
        let o = we();
        return Ce(o.setLanguage("es"));
      }),
      V(18, "ES"),
      y()(),
      m(19, "div", 10)(20, "a", 11),
      J(21, "img", 12),
      y(),
      m(22, "a", 13),
      J(23, "img", 14),
      y()()()();
  }
  e & 2 &&
    (N(3),
    Ne(H(4, 4, "home")),
    N(3),
    Ne(H(7, 6, "about")),
    N(3),
    Ne(H(10, 8, "projects")),
    N(3),
    Ne(H(13, 10, "contact")));
}
var Di = class e {
  constructor(t) {
    this.translate = t;
  }
  visibleMenu = !1;
  navigate = new B();
  goToSection(t, n) {
    n.preventDefault(), this.navigate.emit(t);
  }
  toggleMenu() {
    this.visibleMenu = !this.visibleMenu;
  }
  setLanguage(t) {
    localStorage.setItem("lang", t), this.translate.use(t);
  }
  static ɵfac = function (n) {
    return new (n || e)($(Lt));
  };
  static ɵcmp = K({
    type: e,
    selectors: [["app-menu"]],
    outputs: { navigate: "navigate" },
    standalone: !0,
    features: [X],
    decls: 3,
    vars: 1,
    consts: [
      [
        1,
        "text-acent",
        "flex",
        "flex-col",
        "items-start",
        "ml-3",
        "z-50",
        "fixed",
        "top-6",
        "md:top-8",
        "lg:top-10",
      ],
      [
        "src",
        "assets/icons/menuSmp.svg",
        1,
        "size-8",
        "md:size-9",
        "lg:size-11",
        "cursor-pointer",
        3,
        "click",
      ],
      [
        1,
        "fixed",
        "h-96",
        "w-48",
        "z-40",
        "py-16",
        "px-3",
        "flex",
        "flex-col",
        "bg-surface",
      ],
      [
        1,
        "flex",
        "flex-col",
        "gap-4",
        "text-acent",
        "lg:text-2xl",
        "cursor-pointer",
      ],
      ["href", "#home", 1, "hover:text-primary", 3, "click"],
      ["href", "#about", 1, "hover:text-primary", 3, "click"],
      ["href", "#projects", 1, "hover:text-primary", 3, "click"],
      ["href", "#contact", 1, "hover:text-primary", 3, "click"],
      [1, "flex", "flex-row", "gap-1"],
      [1, "hover:text-primary", 3, "click"],
      [1, "flex", "flex-row", "gap-2"],
      [
        "href",
        "https://github.com/egilp04?tab=repositories",
        "target",
        "_blank",
      ],
      ["src", "assets/img/github.svg", 1, "size-6"],
      [
        "href",
        "https://www.linkedin.com/in/evelia-gil-paredes/",
        "target",
        "_blank",
      ],
      ["src", "assets/img/linkedin.svg", 1, "size-6"],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "div", 0)(1, "img", 1),
        O("click", function () {
          return r.toggleMenu();
        }),
        y()(),
        Wn(2, sC, 24, 12, "div", 2)),
        n & 2 && (N(2), Vo(r.visibleMenu ? 2 : -1));
    },
    dependencies: [Ee, Ve],
  });
};
var Ci = class e {
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = K({
    type: e,
    selectors: [["app-button"]],
    standalone: !0,
    features: [X],
    decls: 3,
    vars: 3,
    consts: [
      [
        1,
        "bg-button-primary",
        "hover:border-button-hover",
        "disabled:bg-button-disabled",
        "text-button-text",
        "font-bold",
        "py-2",
        "px-4",
        "rounded-full",
      ],
    ],
    template: function (n, r) {
      n & 1 && (m(0, "button", 0), V(1), U(2, "translate"), y()),
        n & 2 &&
          (N(),
          de(
            " ",
            H(2, 1, "go"),
            `
`
          ));
    },
    dependencies: [Ee, Ve],
  });
};
var wi = class e {
  title;
  image;
  link;
  goToProject(t) {
    window.location.href = t;
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = K({
    type: e,
    selectors: [["app-card"]],
    inputs: { title: "title", image: "image", link: "link" },
    standalone: !0,
    features: [X],
    decls: 6,
    vars: 2,
    consts: [
      [
        1,
        "h-72",
        "md:h-64",
        "lg:h-80",
        "bg-surface",
        "text-center",
        "flex",
        "flex-col",
        "items-center",
        "justify-between",
        "shadow-md",
        "shadow-secondary",
        "p-1",
        "relative",
      ],
      [
        1,
        "absolute",
        "w-full",
        "h-full",
        "top-0",
        "left-0",
        "z-0",
        "object-cover",
        3,
        "src",
      ],
      [1, "absolute", "inset-0", "bg-black", "opacity-60"],
      [
        1,
        "font-sans",
        "font-bold",
        "text-surface",
        "text-xl",
        "text-shadow-sm",
        "text-shadow-acent/80",
        "sm:text-h3-sm",
        "md:text-h3-md",
        "lg:text-h3-lg",
        "z-20",
      ],
      [1, "z-20", 3, "click"],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "div", 0),
        J(1, "img", 1)(2, "div", 2),
        m(3, "h3", 3),
        V(4),
        y(),
        m(5, "app-button", 4),
        O("click", function () {
          return r.goToProject(r.link);
        }),
        y()()),
        n & 2 && (N(), Se("src", r.image, Gn), N(3), de(" ", r.title, " "));
    },
    dependencies: [Ci],
  });
};
var Ei = class e {
  constructor(t) {
    this.http = t;
  }
  dataUrl = "assets/data/cards/card.json";
  getCards() {
    return this.http.get(this.dataUrl);
  }
  static ɵfac = function (n) {
    return new (n || e)(T(Pt));
  };
  static ɵprov = b({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var aC = (e, t) => t.title;
function cC(e, t) {
  if ((e & 1 && J(0, "app-card", 3), e & 2)) {
    let n = t.$implicit;
    Se("title", n.title)("image", n.image)("link", n.link);
  }
}
var bi = class e {
  cards = [];
  cardsService = v(Ei);
  ngOnInit() {
    this.cardsService.getCards().subscribe((t) => {
      this.cards = [...t];
    });
  }
  navigate = new B();
  goNextSection(t, n) {
    n.preventDefault(), this.navigate.emit(t);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = K({
    type: e,
    selectors: [["app-projects"]],
    outputs: { navigate: "navigate" },
    standalone: !0,
    features: [X],
    decls: 10,
    vars: 3,
    consts: [
      [1, "w-full", "h-full", "bg-surface", "flex", "flex-col", "items-center"],
      [
        1,
        "font-fraunces",
        "font-medium",
        "text-h1-sm",
        "md:text-h1-md",
        "lg:text-h1-lg",
        "text-primary",
        "mt-8",
        "md:mt-2",
      ],
      [
        1,
        "grid",
        "grid-cols-[repeat(auto-fit,_minmax(275px,_1fr))]",
        "container",
        "w-full",
        "h-3/5",
        "overflow-auto",
        "gap-2",
        "p-2",
      ],
      [3, "title", "image", "link"],
      [
        1,
        "text-secondary",
        "flex",
        "flex-row",
        "justify-center",
        "items-center",
        "gap-7",
        "w-full",
        "absolute",
        "bottom-6",
        "lg:bottom-8",
      ],
      [
        "src",
        "assets/icons/arrow-down.svg",
        1,
        "size-8",
        "md:size-9",
        "lg:size-11",
        "cursor-pointer",
        3,
        "click",
      ],
      [
        "src",
        "assets/icons/arrow-up.svg",
        1,
        "size-8",
        "md:size-9",
        "lg:size-11",
        "cursor-pointer",
        3,
        "click",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "div", 0)(1, "h1", 1),
        V(2),
        U(3, "translate"),
        y(),
        m(4, "div", 2),
        qn(5, cC, 1, 3, "app-card", 3, aC),
        y(),
        m(7, "div", 4)(8, "img", 5),
        O("click", function (i) {
          return r.goNextSection("contact", i);
        }),
        y(),
        m(9, "img", 6),
        O("click", function (i) {
          return r.goNextSection("about", i);
        }),
        y()()()),
        n & 2 && (N(2), de(" ", H(3, 1, "projects"), " "), N(3), Zn(r.cards));
    },
    dependencies: [wi, Ee, Ve],
    styles: [
      ".container[_ngcontent-%COMP%]{-ms-overflow-style:none;scrollbar-width:none}.container[_ngcontent-%COMP%]::-webkit-scrollbar{display:none}",
    ],
  });
};
function uC(e, t) {
  if (e & 1) {
    let n = Rt();
    m(0, "section", 2)(1, "app-intro", 1),
      O("navigate", function (o) {
        De(n);
        let i = we();
        return Ce(i.showSection(o));
      }),
      y()();
  }
}
function lC(e, t) {
  if (e & 1) {
    let n = Rt();
    m(0, "section", 3)(1, "app-about", 1),
      O("navigate", function (o) {
        De(n);
        let i = we();
        return Ce(i.showSection(o));
      }),
      y()();
  }
}
function dC(e, t) {
  if (e & 1) {
    let n = Rt();
    m(0, "section", 4)(1, "app-projects", 1),
      O("navigate", function (o) {
        De(n);
        let i = we();
        return Ce(i.showSection(o));
      }),
      y()();
  }
}
function fC(e, t) {
  if (e & 1) {
    let n = Rt();
    m(0, "section", 5)(1, "app-formular", 1),
      O("navigate", function (o) {
        De(n);
        let i = we();
        return Ce(i.showSection(o));
      }),
      y()();
  }
}
var _i = class e {
  title = "miPortfolio";
  current = Ft("home");
  showSection(t) {
    this.current.set(t), console.log(this.current);
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = K({
    type: e,
    selectors: [["app-root"]],
    standalone: !0,
    features: [X],
    decls: 6,
    vars: 1,
    consts: [
      [1, "h-full", "w-full"],
      [3, "navigate"],
      ["id", "home", 1, "h-full", "w-full"],
      ["id", "about", 1, "h-full", "w-full"],
      ["id", "projects", 1, "h-full", "w-full"],
      ["id", "contact", 1, "h-full", "w-full"],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "div", 0)(1, "app-menu", 1),
        O("navigate", function (i) {
          return r.showSection(i);
        }),
        y(),
        Wn(2, uC, 2, 0, "section", 2)(3, lC, 2, 0, "section", 3)(
          4,
          dC,
          2,
          0,
          "section",
          4
        )(5, fC, 2, 0, "section", 5),
        y()),
        n & 2 &&
          (N(2),
          Vo(
            r.current() === "home"
              ? 2
              : r.current() === "about"
              ? 3
              : r.current() === "projects"
              ? 4
              : 5
          ));
    },
    dependencies: [gi, ei, vi, Di, pi, bi],
    styles: [".hidden[_ngcontent-%COMP%]{display:none}"],
  });
};
of(_i, uf).catch((e) => console.error(e));
