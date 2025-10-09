var qf = Object.defineProperty,
  Zf = Object.defineProperties;
var Yf = Object.getOwnPropertyDescriptors;
var rc = Object.getOwnPropertySymbols;
var Qf = Object.prototype.hasOwnProperty,
  Kf = Object.prototype.propertyIsEnumerable;
var oc = (e, t, n) =>
    t in e
      ? qf(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  R = (e, t) => {
    for (var n in (t ||= {})) Qf.call(t, n) && oc(e, n, t[n]);
    if (rc) for (var n of rc(t)) Kf.call(t, n) && oc(e, n, t[n]);
    return e;
  },
  U = (e, t) => Zf(e, Yf(t));
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
function ic(e, t) {
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
function sc() {
  return q;
}
var In = {
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
function Ti(e) {
  if (yr) throw new Error("");
  if (q === null) return;
  q.consumerOnSignalRead(e);
  let t = q.nextProducerIndex++;
  if ((Er(q), t < q.producerNode.length && q.producerNode[t] !== e && bn(q))) {
    let n = q.producerNode[t];
    wr(n, q.producerIndexOfThis[t]);
  }
  q.producerNode[t] !== e &&
    ((q.producerNode[t] = e),
    (q.producerIndexOfThis[t] = bn(q) ? lc(e, q, t) : 0)),
    (q.producerLastReadVersion[t] = e.version);
}
function Jf() {
  vr++;
}
function ac(e) {
  if (!(bn(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === vr)) {
    if (!e.producerMustRecompute(e) && !Si(e)) {
      (e.dirty = !1), (e.lastCleanEpoch = vr);
      return;
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = vr);
  }
}
function cc(e) {
  if (e.liveConsumerNode === void 0) return;
  let t = yr;
  yr = !0;
  try {
    for (let n of e.liveConsumerNode) n.dirty || Xf(n);
  } finally {
    yr = t;
  }
}
function uc() {
  return q?.consumerAllowSignalWrites !== !1;
}
function Xf(e) {
  (e.dirty = !0), cc(e), e.consumerMarkedDirty?.(e);
}
function Cr(e) {
  return e && (e.nextProducerIndex = 0), x(e);
}
function xi(e, t) {
  if (
    (x(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (bn(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        wr(e.producerNode[n], e.producerIndexOfThis[n]);
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop();
  }
}
function Si(e) {
  Er(e);
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t];
    if (r !== n.version || (ac(n), r !== n.version)) return !0;
  }
  return !1;
}
function Ni(e) {
  if ((Er(e), bn(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      wr(e.producerNode[t], e.producerIndexOfThis[t]);
  (e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
}
function lc(e, t, n) {
  if ((dc(e), e.liveConsumerNode.length === 0 && fc(e)))
    for (let r = 0; r < e.producerNode.length; r++)
      e.producerIndexOfThis[r] = lc(e.producerNode[r], e, r);
  return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1;
}
function wr(e, t) {
  if ((dc(e), e.liveConsumerNode.length === 1 && fc(e)))
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
function bn(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
}
function Er(e) {
  (e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= []);
}
function dc(e) {
  (e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= []);
}
function fc(e) {
  return e.producerNode !== void 0;
}
function hc(e) {
  let t = Object.create(eh);
  t.computation = e;
  let n = () => {
    if ((ac(t), Ti(t), t.value === Dr)) throw t.error;
    return t.value;
  };
  return (n[tt] = t), n;
}
var Ii = Symbol("UNSET"),
  Mi = Symbol("COMPUTING"),
  Dr = Symbol("ERRORED"),
  eh = U(R({}, In), {
    value: Ii,
    dirty: !0,
    error: null,
    equal: ic,
    producerMustRecompute(e) {
      return e.value === Ii || e.value === Mi;
    },
    producerRecomputeValue(e) {
      if (e.value === Mi) throw new Error("Detected cycle in computations.");
      let t = e.value;
      e.value = Mi;
      let n = Cr(e),
        r;
      try {
        r = e.computation();
      } catch (o) {
        (r = Dr), (e.error = o);
      } finally {
        xi(e, n);
      }
      if (t !== Ii && t !== Dr && r !== Dr && e.equal(t, r)) {
        e.value = t;
        return;
      }
      (e.value = r), e.version++;
    },
  });
function th() {
  throw new Error();
}
var pc = th;
function gc() {
  pc();
}
function mc(e) {
  pc = e;
}
var nh = null;
function yc(e) {
  let t = Object.create(Dc);
  t.value = e;
  let n = () => (Ti(t), t.value);
  return (n[tt] = t), n;
}
function Ai(e, t) {
  uc() || gc(), e.equal(e.value, t) || ((e.value = t), rh(e));
}
function vc(e, t) {
  uc() || gc(), Ai(e, t(e.value));
}
var Dc = U(R({}, In), { equal: ic, value: void 0 });
function rh(e) {
  e.version++, Jf(), cc(e), nh?.();
}
function b(e) {
  return typeof e == "function";
}
function _r(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack);
  });
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  );
}
var br = _r(
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
function Mn(e, t) {
  if (e) {
    let n = e.indexOf(t);
    0 <= n && e.splice(n, 1);
  }
}
var ie = class e {
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
      if (b(r))
        try {
          r();
        } catch (i) {
          t = i instanceof br ? i.errors : [i];
        }
      let { _finalizers: o } = this;
      if (o) {
        this._finalizers = null;
        for (let i of o)
          try {
            Cc(i);
          } catch (s) {
            (t = t ?? []),
              s instanceof br ? (t = [...t, ...s.errors]) : t.push(s);
          }
      }
      if (t) throw new br(t);
    }
  }
  add(t) {
    var n;
    if (t && t !== this)
      if (this.closed) Cc(t);
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
    n === t ? (this._parentage = null) : Array.isArray(n) && Mn(n, t);
  }
  remove(t) {
    let { _finalizers: n } = this;
    n && Mn(n, t), t instanceof e && t._removeParent(this);
  }
};
ie.EMPTY = (() => {
  let e = new ie();
  return (e.closed = !0), e;
})();
var Oi = ie.EMPTY;
function Ir(e) {
  return (
    e instanceof ie ||
    (e && "closed" in e && b(e.remove) && b(e.add) && b(e.unsubscribe))
  );
}
function Cc(e) {
  b(e) ? e() : e.unsubscribe();
}
var Ee = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var Bt = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = Bt;
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
  },
  clearTimeout(e) {
    let { delegate: t } = Bt;
    return (t?.clearTimeout || clearTimeout)(e);
  },
  delegate: void 0,
};
function Mr(e) {
  Bt.setTimeout(() => {
    let { onUnhandledError: t } = Ee;
    if (t) t(e);
    else throw e;
  });
}
function Fi() {}
var wc = Ri("C", void 0, void 0);
function Ec(e) {
  return Ri("E", void 0, e);
}
function _c(e) {
  return Ri("N", e, void 0);
}
function Ri(e, t, n) {
  return { kind: e, value: t, error: n };
}
var wt = null;
function $t(e) {
  if (Ee.useDeprecatedSynchronousErrorHandling) {
    let t = !wt;
    if ((t && (wt = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = wt;
      if (((wt = null), n)) throw r;
    }
  } else e();
}
function bc(e) {
  Ee.useDeprecatedSynchronousErrorHandling &&
    wt &&
    ((wt.errorThrown = !0), (wt.error = e));
}
var Et = class extends ie {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Ir(t) && t.add(this))
          : (this.destination = sh);
    }
    static create(t, n, r) {
      return new Be(t, n, r);
    }
    next(t) {
      this.isStopped ? ki(_c(t), this) : this._next(t);
    }
    error(t) {
      this.isStopped
        ? ki(Ec(t), this)
        : ((this.isStopped = !0), this._error(t));
    }
    complete() {
      this.isStopped ? ki(wc, this) : ((this.isStopped = !0), this._complete());
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
  oh = Function.prototype.bind;
function Pi(e, t) {
  return oh.call(e, t);
}
var Li = class {
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
      if (b(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
      else {
        let i;
        this && Ee.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && Pi(t.next, i),
              error: t.error && Pi(t.error, i),
              complete: t.complete && Pi(t.complete, i),
            }))
          : (o = t);
      }
      this.destination = new Li(o);
    }
  };
function Tr(e) {
  Ee.useDeprecatedSynchronousErrorHandling ? bc(e) : Mr(e);
}
function ih(e) {
  throw e;
}
function ki(e, t) {
  let { onStoppedNotification: n } = Ee;
  n && Bt.setTimeout(() => n(e, t));
}
var sh = { closed: !0, next: Fi, error: ih, complete: Fi };
var Ut = (typeof Symbol == "function" && Symbol.observable) || "@@observable";
function xr(e) {
  return e;
}
function Ic(e) {
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
      let i = ch(n) ? n : new Be(n, r, o);
      return (
        $t(() => {
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
        (r = Mc(r)),
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
    [Ut]() {
      return this;
    }
    pipe(...n) {
      return Ic(n)(this);
    }
    toPromise(n) {
      return (
        (n = Mc(n)),
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
function Mc(e) {
  var t;
  return (t = e ?? Ee.Promise) !== null && t !== void 0 ? t : Promise;
}
function ah(e) {
  return e && b(e.next) && b(e.error) && b(e.complete);
}
function ch(e) {
  return (e && e instanceof Et) || (ah(e) && Ir(e));
}
function uh(e) {
  return b(e?.lift);
}
function Y(e) {
  return (t) => {
    if (uh(t))
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
function ee(e, t, n, r, o) {
  return new Vi(e, t, n, r, o);
}
var Vi = class extends Et {
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
var Tc = _r(
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
        if (this.closed) throw new Tc();
      }
      next(n) {
        $t(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers));
            for (let r of this.currentObservers) r.next(n);
          }
        });
      }
      error(n) {
        $t(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = n);
            let { observers: r } = this;
            for (; r.length; ) r.shift().error(n);
          }
        });
      }
      complete() {
        $t(() => {
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
          ? Oi
          : ((this.currentObservers = null),
            i.push(n),
            new ie(() => {
              (this.currentObservers = null), Mn(i, n);
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
        : Oi;
    }
  };
var Tn = class extends Q {
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
var ji = {
  now() {
    return (ji.delegate || Date).now();
  },
  delegate: void 0,
};
var Nr = class extends Q {
  constructor(t = 1 / 0, n = 1 / 0, r = ji) {
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
var xc = new P((e) => e.complete());
function Sc(e) {
  return e && b(e.schedule);
}
function Nc(e) {
  return e[e.length - 1];
}
function Ac(e) {
  return b(Nc(e)) ? e.pop() : void 0;
}
function Ar(e) {
  return Sc(Nc(e)) ? e.pop() : void 0;
}
function Fc(e, t, n, r) {
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
function Oc(e) {
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
function _t(e) {
  return this instanceof _t ? ((this.v = e), this) : new _t(e);
}
function Rc(e, t, n) {
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
    f.value instanceof _t
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
function Pc(e) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator],
    n;
  return t
    ? t.call(e)
    : ((e = typeof Oc == "function" ? Oc(e) : e[Symbol.iterator]()),
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
  return b(e?.then);
}
function Rr(e) {
  return b(e[Ut]);
}
function Pr(e) {
  return Symbol.asyncIterator && b(e?.[Symbol.asyncIterator]);
}
function kr(e) {
  return new TypeError(
    `You provided ${
      e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  );
}
function lh() {
  return typeof Symbol != "function" || !Symbol.iterator
    ? "@@iterator"
    : Symbol.iterator;
}
var Lr = lh();
function Vr(e) {
  return b(e?.[Lr]);
}
function jr(e) {
  return Rc(this, arguments, function* () {
    let n = e.getReader();
    try {
      for (;;) {
        let { value: r, done: o } = yield _t(n.read());
        if (o) return yield _t(void 0);
        yield yield _t(r);
      }
    } finally {
      n.releaseLock();
    }
  });
}
function Br(e) {
  return b(e?.getReader);
}
function Z(e) {
  if (e instanceof P) return e;
  if (e != null) {
    if (Rr(e)) return dh(e);
    if (Or(e)) return fh(e);
    if (Fr(e)) return hh(e);
    if (Pr(e)) return kc(e);
    if (Vr(e)) return ph(e);
    if (Br(e)) return gh(e);
  }
  throw kr(e);
}
function dh(e) {
  return new P((t) => {
    let n = e[Ut]();
    if (b(n.subscribe)) return n.subscribe(t);
    throw new TypeError(
      "Provided object does not correctly implement Symbol.observable"
    );
  });
}
function fh(e) {
  return new P((t) => {
    for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
    t.complete();
  });
}
function hh(e) {
  return new P((t) => {
    e.then(
      (n) => {
        t.closed || (t.next(n), t.complete());
      },
      (n) => t.error(n)
    ).then(null, Mr);
  });
}
function ph(e) {
  return new P((t) => {
    for (let n of e) if ((t.next(n), t.closed)) return;
    t.complete();
  });
}
function kc(e) {
  return new P((t) => {
    mh(e, t).catch((n) => t.error(n));
  });
}
function gh(e) {
  return kc(jr(e));
}
function mh(e, t) {
  var n, r, o, i;
  return Fc(this, void 0, void 0, function* () {
    try {
      for (n = Pc(e); (r = yield n.next()), !r.done; ) {
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
function me(e, t, n, r = 0, o = !1) {
  let i = t.schedule(function () {
    n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
  }, r);
  if ((e.add(i), !o)) return i;
}
function $r(e, t = 0) {
  return Y((n, r) => {
    n.subscribe(
      ee(
        r,
        (o) => me(r, e, () => r.next(o), t),
        () => me(r, e, () => r.complete(), t),
        (o) => me(r, e, () => r.error(o), t)
      )
    );
  });
}
function Ur(e, t = 0) {
  return Y((n, r) => {
    r.add(e.schedule(() => n.subscribe(r), t));
  });
}
function Lc(e, t) {
  return Z(e).pipe(Ur(t), $r(t));
}
function Vc(e, t) {
  return Z(e).pipe(Ur(t), $r(t));
}
function jc(e, t) {
  return new P((n) => {
    let r = 0;
    return t.schedule(function () {
      r === e.length
        ? n.complete()
        : (n.next(e[r++]), n.closed || this.schedule());
    });
  });
}
function Bc(e, t) {
  return new P((n) => {
    let r;
    return (
      me(n, t, () => {
        (r = e[Lr]()),
          me(
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
      () => b(r?.return) && r.return()
    );
  });
}
function Hr(e, t) {
  if (!e) throw new Error("Iterable cannot be null");
  return new P((n) => {
    me(n, t, () => {
      let r = e[Symbol.asyncIterator]();
      me(
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
function $c(e, t) {
  return Hr(jr(e), t);
}
function Uc(e, t) {
  if (e != null) {
    if (Rr(e)) return Lc(e, t);
    if (Or(e)) return jc(e, t);
    if (Fr(e)) return Vc(e, t);
    if (Pr(e)) return Hr(e, t);
    if (Vr(e)) return Bc(e, t);
    if (Br(e)) return $c(e, t);
  }
  throw kr(e);
}
function $e(e, t) {
  return t ? Uc(e, t) : Z(e);
}
function Ue(...e) {
  let t = Ar(e);
  return $e(e, t);
}
function nt(e) {
  return !!e && (e instanceof P || (b(e.lift) && b(e.subscribe)));
}
function X(e, t) {
  return Y((n, r) => {
    let o = 0;
    n.subscribe(
      ee(r, (i) => {
        r.next(e.call(t, i, o++));
      })
    );
  });
}
var { isArray: yh } = Array;
function vh(e, t) {
  return yh(t) ? e(...t) : e(t);
}
function Hc(e) {
  return X((t) => vh(e, t));
}
var { isArray: Dh } = Array,
  { getPrototypeOf: Ch, prototype: wh, keys: Eh } = Object;
function Gc(e) {
  if (e.length === 1) {
    let t = e[0];
    if (Dh(t)) return { args: t, keys: null };
    if (_h(t)) {
      let n = Eh(t);
      return { args: n.map((r) => t[r]), keys: n };
    }
  }
  return { args: e, keys: null };
}
function _h(e) {
  return e && typeof e == "object" && Ch(e) === wh;
}
function zc(e, t) {
  return e.reduce((n, r, o) => ((n[r] = t[o]), n), {});
}
function Wc(e, t, n, r, o, i, s, a) {
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
        ee(
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
                  s ? me(t, s, () => p(w)) : p(w);
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
      ee(t, f, () => {
        (d = !0), h();
      })
    ),
    () => {
      a?.();
    }
  );
}
function Ht(e, t, n = 1 / 0) {
  return b(t)
    ? Ht((r, o) => X((i, s) => t(r, i, o, s))(Z(e(r, o))), n)
    : (typeof t == "number" && (n = t), Y((r, o) => Wc(r, o, e, n)));
}
function qc(e = 1 / 0) {
  return Ht(xr, e);
}
function Zc() {
  return qc(1);
}
function Gr(...e) {
  return Zc()($e(e, Ar(e)));
}
function zr(e) {
  return new P((t) => {
    Z(e()).subscribe(t);
  });
}
function xn(...e) {
  let t = Ac(e),
    { args: n, keys: r } = Gc(e),
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
          ee(
            i,
            (h) => {
              d || ((d = !0), u--), (a[l] = h);
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (u || i.next(r ? zc(r, a) : a), i.complete());
            }
          )
        );
      }
    });
  return t ? o.pipe(Hc(t)) : o;
}
function Bi(e, t) {
  return Y((n, r) => {
    let o = 0;
    n.subscribe(ee(r, (i) => e.call(t, i, o++) && r.next(i)));
  });
}
function Sn(e, t) {
  return b(t) ? Ht(e, t, 1) : Ht(e, 1);
}
function Gt(e) {
  return e <= 0
    ? () => xc
    : Y((t, n) => {
        let r = 0;
        t.subscribe(
          ee(n, (o) => {
            ++r <= e && (n.next(o), e <= r && n.complete());
          })
        );
      });
}
function $i(e) {
  return Y((t, n) => {
    try {
      t.subscribe(n);
    } finally {
      n.add(e);
    }
  });
}
function Yc(e = {}) {
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
        u--, u === 0 && !d && !l && (a = Ui(p, o));
      }),
        w.subscribe(D),
        !s &&
          u > 0 &&
          ((s = new Be({
            next: (F) => w.next(F),
            error: (F) => {
              (d = !0), h(), (a = Ui(f, n, F)), w.error(F);
            },
            complete: () => {
              (l = !0), h(), (a = Ui(f, r)), w.complete();
            },
          })),
          Z(g).subscribe(s));
    })(i);
  };
}
function Ui(e, t, ...n) {
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
    Yc({
      connector: () => new Nr(r, t, n),
      resetOnError: !0,
      resetOnComplete: !1,
      resetOnRefCountZero: o,
    })
  );
}
function zt(e, t) {
  return Y((n, r) => {
    let o = null,
      i = 0,
      s = !1,
      a = () => s && !o && r.complete();
    n.subscribe(
      ee(
        r,
        (c) => {
          o?.unsubscribe();
          let u = 0,
            l = i++;
          Z(e(c, l)).subscribe(
            (o = ee(
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
var Au = "https://g.co/ng/security#xss",
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
function V(e) {
  for (let t in e) if (e[t] === V) return t;
  throw Error("Could not find renamed property on target object.");
}
function bh(e, t) {
  for (let n in t) t.hasOwnProperty(n) && !e.hasOwnProperty(n) && (e[n] = t[n]);
}
function ve(e) {
  if (typeof e == "string") return e;
  if (Array.isArray(e)) return "[" + e.map(ve).join(", ") + "]";
  if (e == null) return "" + e;
  if (e.overriddenName) return `${e.overriddenName}`;
  if (e.name) return `${e.name}`;
  let t = e.toString();
  if (t == null) return "" + t;
  let n = t.indexOf(`
`);
  return n === -1 ? t : t.substring(0, n);
}
function Qc(e, t) {
  return e == null || e === ""
    ? t === null
      ? ""
      : t
    : t == null || t === ""
    ? e
    : e + " " + t;
}
var Ih = V({ __forward_ref__: V });
function ln(e) {
  return (
    (e.__forward_ref__ = ln),
    (e.toString = function () {
      return ve(this());
    }),
    e
  );
}
function se(e) {
  return Ou(e) ? e() : e;
}
function Ou(e) {
  return (
    typeof e == "function" && e.hasOwnProperty(Ih) && e.__forward_ref__ === ln
  );
}
function _(e) {
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
function qs(e) {
  return Kc(e, Fu) || Kc(e, Ru);
}
function Kc(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null;
}
function Mh(e) {
  let t = e && (e[Fu] || e[Ru]);
  return t || null;
}
function Jc(e) {
  return e && (e.hasOwnProperty(Xc) || e.hasOwnProperty(Th)) ? e[Xc] : null;
}
var Fu = V({ ɵprov: V }),
  Xc = V({ ɵinj: V }),
  Ru = V({ ngInjectableDef: V }),
  Th = V({ ngInjectorDef: V }),
  C = class {
    constructor(t, n) {
      (this._desc = t),
        (this.ngMetadataName = "InjectionToken"),
        (this.ɵprov = void 0),
        typeof n == "number"
          ? (this.__NG_ELEMENT_ID__ = n)
          : n !== void 0 &&
            (this.ɵprov = _({
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
function Pu(e) {
  return e && !!e.ɵproviders;
}
var xh = V({ ɵcmp: V }),
  Sh = V({ ɵdir: V }),
  Nh = V({ ɵpipe: V });
var to = V({ ɵfac: V }),
  On = V({ __NG_ELEMENT_ID__: V }),
  eu = V({ __NG_ENV_ID__: V });
function Zs(e) {
  return typeof e == "string" ? e : e == null ? "" : String(e);
}
function Ah(e) {
  return typeof e == "function"
    ? e.name || e.toString()
    : typeof e == "object" && e != null && typeof e.type == "function"
    ? e.type.name || e.type.toString()
    : Zs(e);
}
function Oh(e, t) {
  let n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
  throw new I(-200, e);
}
function Ys(e, t) {
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
  ns;
function ku() {
  return ns;
}
function fe(e) {
  let t = ns;
  return (ns = e), t;
}
function Lu(e, t, n) {
  let r = qs(e);
  if (r && r.providedIn == "root")
    return r.value === void 0 ? (r.value = r.factory()) : r.value;
  if (n & A.Optional) return null;
  if (t !== void 0) return t;
  Ys(e, "Injector");
}
var Fh = {},
  Fn = Fh,
  Rh = "__NG_DI_FLAG__",
  no = "ngTempTokenPath",
  Ph = "ngTokenPath",
  kh = /\n/gm,
  Lh = "\u0275",
  tu = "__source",
  Yt;
function Vh() {
  return Yt;
}
function rt(e) {
  let t = Yt;
  return (Yt = e), t;
}
function jh(e, t = A.Default) {
  if (Yt === void 0) throw new I(-203, !1);
  return Yt === null
    ? Lu(e, void 0, t)
    : Yt.get(e, t & A.Optional ? null : void 0, t);
}
function T(e, t = A.Default) {
  return (ku() || jh)(se(e), t);
}
function v(e, t = A.Default) {
  return T(e, _o(t));
}
function _o(e) {
  return typeof e > "u" || typeof e == "number"
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
}
function rs(e) {
  let t = [];
  for (let n = 0; n < e.length; n++) {
    let r = se(e[n]);
    if (Array.isArray(r)) {
      if (r.length === 0) throw new I(900, !1);
      let o,
        i = A.Default;
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          c = Bh(a);
        typeof c == "number" ? (c === -1 ? (o = a.token) : (i |= c)) : (o = a);
      }
      t.push(T(o, i));
    } else t.push(T(r));
  }
  return t;
}
function Bh(e) {
  return e[Rh];
}
function $h(e, t, n, r) {
  let o = e[no];
  throw (
    (t[tu] && o.unshift(t[tu]),
    (e.message = Uh(
      `
` + e.message,
      o,
      n,
      r
    )),
    (e[Ph] = o),
    (e[no] = null),
    e)
  );
}
function Uh(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == Lh
      ? e.slice(2)
      : e;
  let o = ve(t);
  if (Array.isArray(t)) o = t.map(ve).join(" -> ");
  else if (typeof t == "object") {
    let i = [];
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : ve(a)));
      }
    o = `{${i.join(", ")}}`;
  }
  return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(
    kh,
    `
  `
  )}`;
}
function bt(e, t) {
  let n = e.hasOwnProperty(to);
  return n ? e[to] : null;
}
function Qs(e, t) {
  e.forEach((n) => (Array.isArray(n) ? Qs(n, t) : t(n)));
}
function Hh(e, t, n) {
  t >= e.length ? e.push(n) : e.splice(t, 0, n);
}
function Vu(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
}
function Gh(e, t, n, r) {
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
function zh(e, t, n) {
  let r = Hn(e, t);
  return r >= 0 ? (e[r | 1] = n) : ((r = ~r), Gh(e, r, t, n)), r;
}
function Hi(e, t) {
  let n = Hn(e, t);
  if (n >= 0) return e[n | 1];
}
function Hn(e, t) {
  return Wh(e, t, 1);
}
function Wh(e, t, n) {
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
var Kt = {},
  ye = [],
  Rn = new C(""),
  ju = new C("", -1),
  Bu = new C(""),
  ro = class {
    get(t, n = Fn) {
      if (n === Fn) {
        let r = new Error(`NullInjectorError: No provider for ${ve(t)}!`);
        throw ((r.name = "NullInjectorError"), r);
      }
      return n;
    }
  },
  $u = (function (e) {
    return (e[(e.OnPush = 0)] = "OnPush"), (e[(e.Default = 1)] = "Default"), e;
  })($u || {}),
  Oe = (function (e) {
    return (
      (e[(e.Emulated = 0)] = "Emulated"),
      (e[(e.None = 2)] = "None"),
      (e[(e.ShadowDom = 3)] = "ShadowDom"),
      e
    );
  })(Oe || {}),
  st = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.SignalBased = 1)] = "SignalBased"),
      (e[(e.HasDecoratorInputTransform = 2)] = "HasDecoratorInputTransform"),
      e
    );
  })(st || {});
function qh(e, t, n) {
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
function os(e, t, n) {
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
      Yh(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
    }
  }
  return r;
}
function Zh(e) {
  return e === 3 || e === 4 || e === 6;
}
function Yh(e) {
  return e.charCodeAt(0) === 64;
}
function Pn(e, t) {
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
              ? nu(e, n, o, null, t[++r])
              : nu(e, n, o, null, null));
      }
    }
  return e;
}
function nu(e, t, n, r, o) {
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
var Uu = "ng-template";
function Qh(e, t, n, r) {
  let o = 0;
  if (r) {
    for (; o < t.length && typeof t[o] == "string"; o += 2)
      if (t[o] === "class" && qh(t[o + 1].toLowerCase(), n, 0) !== -1)
        return !0;
  } else if (Ks(e)) return !1;
  if (((o = t.indexOf(1, o)), o > -1)) {
    let i;
    for (; ++o < t.length && typeof (i = t[o]) == "string"; )
      if (i.toLowerCase() === n) return !0;
  }
  return !1;
}
function Ks(e) {
  return e.type === 4 && e.value !== Uu;
}
function Kh(e, t, n) {
  let r = e.type === 4 && !n ? Uu : e.value;
  return t === r;
}
function Jh(e, t, n) {
  let r = 4,
    o = e.attrs,
    i = o !== null ? tp(o) : 0,
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
          (c !== "" && !Kh(e, c, n)) || (c === "" && t.length === 1))
        ) {
          if (_e(r)) return !1;
          s = !0;
        }
      } else if (r & 8) {
        if (o === null || !Qh(e, o, c, n)) {
          if (_e(r)) return !1;
          s = !0;
        }
      } else {
        let u = t[++a],
          l = Xh(c, o, Ks(e), n);
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
function Xh(e, t, n, r) {
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
  } else return np(t, e);
}
function ep(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (Jh(e, t[r], n)) return !0;
  return !1;
}
function tp(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    if (Zh(n)) return t;
  }
  return e.length;
}
function np(e, t) {
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
function ru(e, t) {
  return e ? ":not(" + t.trim() + ")" : t;
}
function rp(e) {
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
      o !== "" && !_e(s) && ((t += ru(i, o)), (o = "")),
        (r = s),
        (i = i || !_e(r));
    n++;
  }
  return o !== "" && (t += ru(i, o)), t;
}
function op(e) {
  return e.map(rp).join(",");
}
function ip(e) {
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
function re(e) {
  return Eo(() => {
    let t = zu(e),
      n = U(R({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === $u.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || Oe.Emulated,
        styles: e.styles || ye,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: "",
      });
    Wu(n);
    let r = e.dependencies;
    return (
      (n.directiveDefs = iu(r, !1)), (n.pipeDefs = iu(r, !0)), (n.id = up(n)), n
    );
  });
}
function sp(e) {
  return bo(e) || Hu(e);
}
function ap(e) {
  return e !== null;
}
function Ze(e) {
  return Eo(() => ({
    type: e.type,
    bootstrap: e.bootstrap || ye,
    declarations: e.declarations || ye,
    imports: e.imports || ye,
    exports: e.exports || ye,
    transitiveCompileScopes: null,
    schemas: e.schemas || null,
    id: e.id || null,
  }));
}
function ou(e, t) {
  if (e == null) return Kt;
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
function Me(e) {
  return Eo(() => {
    let t = zu(e);
    return Wu(t), t;
  });
}
function Js(e) {
  return {
    type: e.type,
    name: e.name,
    factory: null,
    pure: e.pure !== !1,
    standalone: e.standalone === !0,
    onDestroy: e.type.prototype.ngOnDestroy || null,
  };
}
function bo(e) {
  return e[xh] || null;
}
function Hu(e) {
  return e[Sh] || null;
}
function Gu(e) {
  return e[Nh] || null;
}
function cp(e) {
  let t = bo(e) || Hu(e) || Gu(e);
  return t !== null ? t.standalone : !1;
}
function zu(e) {
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
    inputConfig: e.inputs || Kt,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || ye,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: ou(e.inputs, t),
    outputs: ou(e.outputs),
    debugInfo: null,
  };
}
function Wu(e) {
  e.features?.forEach((t) => t(e));
}
function iu(e, t) {
  if (!e) return null;
  let n = t ? Gu : sp;
  return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(ap);
}
function up(e) {
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
function Xs(...e) {
  return { ɵproviders: qu(!0, e), ɵfromNgModule: !0 };
}
function qu(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s);
    };
  return (
    Qs(t, (s) => {
      let a = s;
      is(a, i, [], r) && ((o ||= []), o.push(a));
    }),
    o !== void 0 && Zu(o, i),
    n
  );
}
function Zu(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n];
    ea(o, (i) => {
      t(i, r);
    });
  }
}
function is(e, t, n, r) {
  if (((e = se(e)), !e)) return !1;
  let o = null,
    i = Jc(e),
    s = !i && bo(e);
  if (!i && !s) {
    let c = e.ngModule;
    if (((i = Jc(c)), i)) o = c;
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
      for (let u of c) is(u, t, n, r);
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o);
      let u;
      try {
        Qs(i.imports, (l) => {
          is(l, t, n, r) && ((u ||= []), u.push(l));
        });
      } finally {
      }
      u !== void 0 && Zu(u, t);
    }
    if (!a) {
      let u = bt(o) || (() => new o());
      t({ provide: o, useFactory: u, deps: ye }, o),
        t({ provide: Bu, useValue: o, multi: !0 }, o),
        t({ provide: Rn, useValue: () => T(o), multi: !0 }, o);
    }
    let c = i.providers;
    if (c != null && !a) {
      let u = e;
      ea(c, (l) => {
        t(l, u);
      });
    }
  } else return !1;
  return o !== e && e.providers !== void 0;
}
function ea(e, t) {
  for (let n of e)
    Pu(n) && (n = n.ɵproviders), Array.isArray(n) ? ea(n, t) : t(n);
}
var lp = V({ provide: String, useValue: V });
function Yu(e) {
  return e !== null && typeof e == "object" && lp in e;
}
function dp(e) {
  return !!(e && e.useExisting);
}
function fp(e) {
  return !!(e && e.useFactory);
}
function Jt(e) {
  return typeof e == "function";
}
function hp(e) {
  return !!e.useClass;
}
var Mo = new C(""),
  Qr = {},
  pp = {},
  Gi;
function ta() {
  return Gi === void 0 && (Gi = new ro()), Gi;
}
var He = class {},
  kn = class extends He {
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
        as(t, (s) => this.processProvider(s)),
        this.records.set(ju, Wt(void 0, this)),
        o.has("environment") && this.records.set(He, Wt(void 0, this));
      let i = this.records.get(Mo);
      i != null && typeof i.value == "string" && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(Bu, ye, A.Self)));
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
        r = fe(void 0),
        o;
      try {
        return t();
      } finally {
        rt(n), fe(r);
      }
    }
    get(t, n = Fn, r = A.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(eu))) return t[eu](this);
      r = _o(r);
      let o,
        i = rt(this),
        s = fe(void 0);
      try {
        if (!(r & A.SkipSelf)) {
          let c = this.records.get(t);
          if (c === void 0) {
            let u = Dp(t) && qs(t);
            u && this.injectableDefInScope(u)
              ? (c = Wt(ss(t), Qr))
              : (c = null),
              this.records.set(t, c);
          }
          if (c != null) return this.hydrate(t, c);
        }
        let a = r & A.Self ? ta() : this.parent;
        return (n = r & A.Optional && n === Fn ? null : n), a.get(t, n);
      } catch (a) {
        if (a.name === "NullInjectorError") {
          if (((a[no] = a[no] || []).unshift(ve(t)), i)) throw a;
          return $h(a, t, "R3InjectorError", this.source);
        } else throw a;
      } finally {
        fe(s), rt(i);
      }
    }
    resolveInjectorInitializers() {
      let t = x(null),
        n = rt(this),
        r = fe(void 0),
        o;
      try {
        let i = this.get(Rn, ye, A.Self);
        for (let s of i) s();
      } finally {
        rt(n), fe(r), x(t);
      }
    }
    toString() {
      let t = [],
        n = this.records;
      for (let r of n.keys()) t.push(ve(r));
      return `R3Injector[${t.join(", ")}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new I(205, !1);
    }
    processProvider(t) {
      t = se(t);
      let n = Jt(t) ? t : se(t && t.provide),
        r = mp(t);
      if (!Jt(t) && t.multi === !0) {
        let o = this.records.get(n);
        o ||
          ((o = Wt(void 0, Qr, !0)),
          (o.factory = () => rs(o.multi)),
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
          n.value === Qr && ((n.value = pp), (n.value = n.factory())),
          typeof n.value == "object" &&
            n.value &&
            vp(n.value) &&
            this._ngOnDestroyHooks.add(n.value),
          n.value
        );
      } finally {
        x(r);
      }
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1;
      let n = se(t.providedIn);
      return typeof n == "string"
        ? n === "any" || this.scopes.has(n)
        : this.injectorDefTypes.has(n);
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t);
      n !== -1 && this._onDestroyHooks.splice(n, 1);
    }
  };
function ss(e) {
  let t = qs(e),
    n = t !== null ? t.factory : bt(e);
  if (n !== null) return n;
  if (e instanceof C) throw new I(204, !1);
  if (e instanceof Function) return gp(e);
  throw new I(204, !1);
}
function gp(e) {
  if (e.length > 0) throw new I(204, !1);
  let n = Mh(e);
  return n !== null ? () => n.factory(e) : () => new e();
}
function mp(e) {
  if (Yu(e)) return Wt(void 0, e.useValue);
  {
    let t = Qu(e);
    return Wt(t, Qr);
  }
}
function Qu(e, t, n) {
  let r;
  if (Jt(e)) {
    let o = se(e);
    return bt(o) || ss(o);
  } else if (Yu(e)) r = () => se(e.useValue);
  else if (fp(e)) r = () => e.useFactory(...rs(e.deps || []));
  else if (dp(e)) r = () => T(se(e.useExisting));
  else {
    let o = se(e && (e.useClass || e.provide));
    if (yp(e)) r = () => new o(...rs(e.deps));
    else return bt(o) || ss(o);
  }
  return r;
}
function Wt(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 };
}
function yp(e) {
  return !!e.deps;
}
function vp(e) {
  return (
    e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function"
  );
}
function Dp(e) {
  return typeof e == "function" || (typeof e == "object" && e instanceof C);
}
function as(e, t) {
  for (let n of e)
    Array.isArray(n) ? as(n, t) : n && Pu(n) ? as(n.ɵproviders, t) : t(n);
}
function Ku(e, t) {
  e instanceof kn && e.assertNotDestroyed();
  let n,
    r = rt(e),
    o = fe(void 0);
  try {
    return t();
  } finally {
    rt(r), fe(o);
  }
}
function Cp() {
  return ku() !== void 0 || Vh() != null;
}
var Ye = 0,
  M = 1,
  E = 2,
  Ce = 3,
  be = 4,
  Re = 5,
  Ln = 6,
  oo = 7,
  te = 8,
  Xt = 9,
  Fe = 10,
  ne = 11,
  Vn = 12,
  su = 13,
  dn = 14,
  Ie = 15,
  en = 16,
  qt = 17,
  tn = 18,
  To = 19,
  Ju = 20,
  ot = 21,
  zi = 22,
  De = 23,
  pe = 25,
  Xu = 1;
var jn = 7,
  wp = 8,
  io = 9,
  he = 10,
  so = (function (e) {
    return (
      (e[(e.None = 0)] = "None"),
      (e[(e.HasTransplantedViews = 2)] = "HasTransplantedViews"),
      e
    );
  })(so || {});
function it(e) {
  return Array.isArray(e) && typeof e[Xu] == "object";
}
function Nt(e) {
  return Array.isArray(e) && e[Xu] === !0;
}
function el(e) {
  return (e.flags & 4) !== 0;
}
function xo(e) {
  return e.componentOffset > -1;
}
function na(e) {
  return (e.flags & 1) === 1;
}
function at(e) {
  return !!e.template;
}
function cs(e) {
  return (e[E] & 512) !== 0;
}
var us = class {
  constructor(t, n, r) {
    (this.previousValue = t), (this.currentValue = n), (this.firstChange = r);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function tl(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r);
}
function Gn() {
  return nl;
}
function nl(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = _p), Ep;
}
Gn.ngInherit = !0;
function Ep() {
  let e = ol(this),
    t = e?.current;
  if (t) {
    let n = e.previous;
    if (n === Kt) e.previous = t;
    else for (let r in t) n[r] = t[r];
    (e.current = null), this.ngOnChanges(t);
  }
}
function _p(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = ol(e) || bp(e, { previous: Kt, current: null }),
    a = s.current || (s.current = {}),
    c = s.previous,
    u = c[i];
  (a[i] = new us(u && u.currentValue, n, c === Kt)), tl(e, t, o, n);
}
var rl = "__ngSimpleChanges__";
function ol(e) {
  return e[rl] || null;
}
function bp(e, t) {
  return (e[rl] = t);
}
var au = null;
var Ne = function (e, t, n) {
    au?.(e, t, n);
  },
  Ip = "svg",
  Mp = "math";
function Ge(e) {
  for (; Array.isArray(e); ) e = e[Ye];
  return e;
}
function il(e, t) {
  return Ge(t[e]);
}
function Pe(e, t) {
  return Ge(t[e.index]);
}
function ra(e, t) {
  return e.data[t];
}
function Tp(e, t) {
  return e[t];
}
function ct(e, t) {
  let n = t[e];
  return it(n) ? n : n[Ye];
}
function oa(e) {
  return (e[E] & 128) === 128;
}
function nn(e, t) {
  return t == null ? null : e[t];
}
function sl(e) {
  e[qt] = 0;
}
function al(e) {
  e[E] & 1024 || ((e[E] |= 1024), oa(e) && No(e));
}
function xp(e, t) {
  for (; e > 0; ) (t = t[dn]), e--;
  return t;
}
function So(e) {
  return !!(e[E] & 9216 || e[De]?.dirty);
}
function ls(e) {
  e[Fe].changeDetectionScheduler?.notify(8),
    e[E] & 64 && (e[E] |= 1024),
    So(e) && No(e);
}
function No(e) {
  e[Fe].changeDetectionScheduler?.notify(0);
  let t = It(e);
  for (; t !== null && !(t[E] & 8192 || ((t[E] |= 8192), !oa(t))); ) t = It(t);
}
function cl(e, t) {
  if ((e[E] & 256) === 256) throw new I(911, !1);
  e[ot] === null && (e[ot] = []), e[ot].push(t);
}
function Sp(e, t) {
  if (e[ot] === null) return;
  let n = e[ot].indexOf(t);
  n !== -1 && e[ot].splice(n, 1);
}
function It(e) {
  let t = e[Ce];
  return Nt(t) ? t[Ce] : t;
}
var S = { lFrame: yl(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
var ul = !1;
function Np() {
  return S.lFrame.elementDepthCount;
}
function Ap() {
  S.lFrame.elementDepthCount++;
}
function Op() {
  S.lFrame.elementDepthCount--;
}
function ll() {
  return S.bindingsEnabled;
}
function Fp() {
  return S.skipHydrationRootTNode !== null;
}
function Rp(e) {
  return S.skipHydrationRootTNode === e;
}
function Pp() {
  S.skipHydrationRootTNode = null;
}
function L() {
  return S.lFrame.lView;
}
function ge() {
  return S.lFrame.tView;
}
function ae(e) {
  return (S.lFrame.contextLView = e), e[te];
}
function ce(e) {
  return (S.lFrame.contextLView = null), e;
}
function Te() {
  let e = dl();
  for (; e !== null && e.type === 64; ) e = e.parent;
  return e;
}
function dl() {
  return S.lFrame.currentTNode;
}
function kp() {
  let e = S.lFrame,
    t = e.currentTNode;
  return e.isParent ? t : t.parent;
}
function zn(e, t) {
  let n = S.lFrame;
  (n.currentTNode = e), (n.isParent = t);
}
function fl() {
  return S.lFrame.isParent;
}
function Lp() {
  S.lFrame.isParent = !1;
}
function hl() {
  return ul;
}
function cu(e) {
  ul = e;
}
function Vp() {
  let e = S.lFrame,
    t = e.bindingRootIndex;
  return t === -1 && (t = e.bindingRootIndex = e.tView.bindingStartIndex), t;
}
function jp(e) {
  return (S.lFrame.bindingIndex = e);
}
function Ao() {
  return S.lFrame.bindingIndex++;
}
function Bp(e) {
  let t = S.lFrame,
    n = t.bindingIndex;
  return (t.bindingIndex = t.bindingIndex + e), n;
}
function $p() {
  return S.lFrame.inI18n;
}
function Up(e, t) {
  let n = S.lFrame;
  (n.bindingIndex = n.bindingRootIndex = e), ds(t);
}
function Hp() {
  return S.lFrame.currentDirectiveIndex;
}
function ds(e) {
  S.lFrame.currentDirectiveIndex = e;
}
function Gp(e) {
  let t = S.lFrame.currentDirectiveIndex;
  return t === -1 ? null : e[t];
}
function pl(e) {
  S.lFrame.currentQueryIndex = e;
}
function zp(e) {
  let t = e[M];
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Re] : null;
}
function gl(e, t, n) {
  if (n & A.SkipSelf) {
    let o = t,
      i = e;
    for (; (o = o.parent), o === null && !(n & A.Host); )
      if (((o = zp(i)), o === null || ((i = i[dn]), o.type & 10))) break;
    if (o === null) return !1;
    (t = o), (e = i);
  }
  let r = (S.lFrame = ml());
  return (r.currentTNode = t), (r.lView = e), !0;
}
function ia(e) {
  let t = ml(),
    n = e[M];
  (S.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1);
}
function ml() {
  let e = S.lFrame,
    t = e === null ? null : e.child;
  return t === null ? yl(e) : t;
}
function yl(e) {
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
function vl() {
  let e = S.lFrame;
  return (S.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e;
}
var Dl = vl;
function sa() {
  let e = vl();
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
function Wp(e) {
  return (S.lFrame.contextLView = xp(e, S.lFrame.contextLView))[te];
}
function At() {
  return S.lFrame.selectedIndex;
}
function Mt(e) {
  S.lFrame.selectedIndex = e;
}
function Cl() {
  let e = S.lFrame;
  return ra(e.tView, e.selectedIndex);
}
function qp() {
  return S.lFrame.currentNamespace;
}
var wl = !0;
function aa() {
  return wl;
}
function ca(e) {
  wl = e;
}
function Zp(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
  if (r) {
    let s = nl(t);
    (n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s);
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i));
}
function ua(e, t) {
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
  El(e, t, 3, n);
}
function Jr(e, t, n, r) {
  (e[E] & 3) === n && El(e, t, n, r);
}
function Wi(e, t) {
  let n = e[E];
  (n & 3) === t && ((n &= 16383), (n += 1), (e[E] = n));
}
function El(e, t, n, r) {
  let o = r !== void 0 ? e[qt] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0;
  for (let c = o; c < s; c++)
    if (typeof t[c + 1] == "number") {
      if (((a = t[c]), r != null && a >= r)) break;
    } else
      t[c] < 0 && (e[qt] += 65536),
        (a < i || i == -1) &&
          (Yp(e, n, t, c), (e[qt] = (e[qt] & 4294901760) + c + 2)),
        c++;
}
function uu(e, t) {
  Ne(4, e, t);
  let n = x(null);
  try {
    t.call(e);
  } finally {
    x(n), Ne(5, e, t);
  }
}
function Yp(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s];
  o
    ? e[E] >> 14 < e[qt] >> 16 &&
      (e[E] & 3) === t &&
      ((e[E] += 16384), uu(a, i))
    : uu(a, i);
}
var Qt = -1,
  Tt = class {
    constructor(t, n, r) {
      (this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r);
    }
  };
function Qp(e) {
  return e instanceof Tt;
}
function Kp(e) {
  return (e.flags & 8) !== 0;
}
function Jp(e) {
  return (e.flags & 16) !== 0;
}
var qi = {},
  fs = class {
    constructor(t, n) {
      (this.injector = t), (this.parentInjector = n);
    }
    get(t, n, r) {
      r = _o(r);
      let o = this.injector.get(t, qi, r);
      return o !== qi || n === qi ? o : this.parentInjector.get(t, n, r);
    }
  };
function Xp(e) {
  return e !== Qt;
}
function hs(e) {
  return e & 32767;
}
function eg(e) {
  return e >> 16;
}
function ps(e, t) {
  let n = eg(e),
    r = t;
  for (; n > 0; ) (r = r[dn]), n--;
  return r;
}
var gs = !0;
function ao(e) {
  let t = gs;
  return (gs = e), t;
}
var tg = 256,
  _l = tg - 1,
  bl = 5,
  ng = 0,
  Ae = {};
function rg(e, t, n) {
  let r;
  typeof n == "string"
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(On) && (r = n[On]),
    r == null && (r = n[On] = ng++);
  let o = r & _l,
    i = 1 << o;
  t.data[e + (o >> bl)] |= i;
}
function co(e, t) {
  let n = Il(e, t);
  if (n !== -1) return n;
  let r = t[M];
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Zi(r.data, e),
    Zi(t, null),
    Zi(r.blueprint, null));
  let o = Ml(e, t),
    i = e.injectorIndex;
  if (Xp(o)) {
    let s = hs(o),
      a = ps(o, t),
      c = a[M].data;
    for (let u = 0; u < 8; u++) t[i + u] = a[s + u] | c[s + u];
  }
  return (t[i + 8] = o), i;
}
function Zi(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
}
function Il(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex;
}
function Ml(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
  let n = 0,
    r = null,
    o = t;
  for (; o !== null; ) {
    if (((r = Al(o)), r === null)) return Qt;
    if ((n++, (o = o[dn]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16);
  }
  return Qt;
}
function ms(e, t, n) {
  rg(e, t, n);
}
function Tl(e, t, n) {
  if (n & A.Optional || e !== void 0) return e;
  Ys(t, "NodeInjector");
}
function xl(e, t, n, r) {
  if (
    (n & A.Optional && r === void 0 && (r = null), !(n & (A.Self | A.Host)))
  ) {
    let o = e[Xt],
      i = fe(void 0);
    try {
      return o ? o.get(t, r, n & A.Optional) : Lu(t, r, n & A.Optional);
    } finally {
      fe(i);
    }
  }
  return Tl(r, t, n);
}
function Sl(e, t, n, r = A.Default, o) {
  if (e !== null) {
    if (t[E] & 2048 && !(r & A.Self)) {
      let s = cg(e, t, n, r, Ae);
      if (s !== Ae) return s;
    }
    let i = Nl(e, t, n, r, Ae);
    if (i !== Ae) return i;
  }
  return xl(t, n, r, o);
}
function Nl(e, t, n, r, o) {
  let i = sg(n);
  if (typeof i == "function") {
    if (!gl(t, e, r)) return r & A.Host ? Tl(o, n, r) : xl(t, n, r, o);
    try {
      let s;
      if (((s = i(r)), s == null && !(r & A.Optional))) Ys(n);
      else return s;
    } finally {
      Dl();
    }
  } else if (typeof i == "number") {
    let s = null,
      a = Il(e, t),
      c = Qt,
      u = r & A.Host ? t[Ie][Re] : null;
    for (
      (a === -1 || r & A.SkipSelf) &&
      ((c = a === -1 ? Ml(e, t) : t[a + 8]),
      c === Qt || !du(r, !1)
        ? (a = -1)
        : ((s = t[M]), (a = hs(c)), (t = ps(c, t))));
      a !== -1;

    ) {
      let l = t[M];
      if (lu(i, a, l.data)) {
        let d = og(a, t, n, s, r, u);
        if (d !== Ae) return d;
      }
      (c = t[a + 8]),
        c !== Qt && du(r, t[M].data[a + 8] === u) && lu(i, a, t)
          ? ((s = l), (a = hs(c)), (t = ps(c, t)))
          : (a = -1);
    }
  }
  return o;
}
function og(e, t, n, r, o, i) {
  let s = t[M],
    a = s.data[e + 8],
    c = r == null ? xo(a) && gs : r != s && (a.type & 3) !== 0,
    u = o & A.Host && i === a,
    l = ig(a, s, n, c, u);
  return l !== null ? rn(t, s, l, a) : Ae;
}
function ig(e, t, n, r, o) {
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
function rn(e, t, n, r) {
  let o = e[n],
    i = t.data;
  if (Qp(o)) {
    let s = o;
    s.resolving && Oh(Ah(i[n]));
    let a = ao(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      u = s.injectImpl ? fe(s.injectImpl) : null,
      l = gl(e, r, A.Default);
    try {
      (o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && Zp(n, i[n], t);
    } finally {
      u !== null && fe(u), ao(a), (s.resolving = !1), Dl();
    }
  }
  return o;
}
function sg(e) {
  if (typeof e == "string") return e.charCodeAt(0) || 0;
  let t = e.hasOwnProperty(On) ? e[On] : void 0;
  return typeof t == "number" ? (t >= 0 ? t & _l : ag) : t;
}
function lu(e, t, n) {
  let r = 1 << e;
  return !!(n[t + (e >> bl)] & r);
}
function du(e, t) {
  return !(e & A.Self) && !(e & A.Host && t);
}
var uo = class {
  constructor(t, n) {
    (this._tNode = t), (this._lView = n);
  }
  get(t, n, r) {
    return Sl(this._tNode, this._lView, t, _o(r), n);
  }
};
function ag() {
  return new uo(Te(), L());
}
function fn(e) {
  return Eo(() => {
    let t = e.prototype.constructor,
      n = t[to] || ys(t),
      r = Object.prototype,
      o = Object.getPrototypeOf(e.prototype).constructor;
    for (; o && o !== r; ) {
      let i = o[to] || ys(o);
      if (i && i !== n) return i;
      o = Object.getPrototypeOf(o);
    }
    return (i) => new i();
  });
}
function ys(e) {
  return Ou(e)
    ? () => {
        let t = ys(se(e));
        return t && t();
      }
    : bt(e);
}
function cg(e, t, n, r, o) {
  let i = e,
    s = t;
  for (; i !== null && s !== null && s[E] & 2048 && !(s[E] & 512); ) {
    let a = Nl(i, s, n, r | A.Self, Ae);
    if (a !== Ae) return a;
    let c = i.parent;
    if (!c) {
      let u = s[Ju];
      if (u) {
        let l = u.get(n, Ae, r);
        if (l !== Ae) return l;
      }
      (c = Al(s)), (s = s[dn]);
    }
    i = c;
  }
  return o;
}
function Al(e) {
  let t = e[M],
    n = t.type;
  return n === 2 ? t.declTNode : n === 1 ? e[Re] : null;
}
function fu(e, t = null, n = null, r) {
  let o = ug(e, t, n, r);
  return o.resolveInjectorInitializers(), o;
}
function ug(e, t = null, n = null, r, o = new Set()) {
  let i = [n || ye, Xs(e)];
  return (
    (r = r || (typeof e == "object" ? void 0 : ve(e))),
    new kn(i, t || ta(), r || null, o)
  );
}
var on = class e {
  static {
    this.THROW_IF_NOT_FOUND = Fn;
  }
  static {
    this.NULL = new ro();
  }
  static create(t, n) {
    if (Array.isArray(t)) return fu({ name: "" }, n, t, "");
    {
      let r = t.name ?? "";
      return fu({ name: r }, t.parent, t.providers, r);
    }
  }
  static {
    this.ɵprov = _({ token: e, providedIn: "any", factory: () => T(ju) });
  }
  static {
    this.__NG_ELEMENT_ID__ = -1;
  }
};
var lg = new C("");
lg.__NG_ELEMENT_ID__ = (e) => {
  let t = Te();
  if (t === null) throw new I(204, !1);
  if (t.type & 2) return t.value;
  if (e & A.Optional) return null;
  throw new I(204, !1);
};
var dg = "ngOriginalError";
function Yi(e) {
  return e[dg];
}
var Ol = !0,
  Fl = (() => {
    class e {
      static {
        this.__NG_ELEMENT_ID__ = fg;
      }
      static {
        this.__NG_ENV_ID__ = (n) => n;
      }
    }
    return e;
  })(),
  vs = class extends Fl {
    constructor(t) {
      super(), (this._lView = t);
    }
    onDestroy(t) {
      return cl(this._lView, t), () => Sp(this._lView, t);
    }
  };
function fg() {
  return new vs(L());
}
var hn = (() => {
  class e {
    constructor() {
      (this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new Tn(!1));
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
      this.ɵprov = _({ token: e, providedIn: "root", factory: () => new e() });
    }
  }
  return e;
})();
var Ds = class extends Q {
    constructor(t = !1) {
      super(),
        (this.destroyRef = void 0),
        (this.pendingTasks = void 0),
        (this.__isAsync = t),
        Cp() &&
          ((this.destroyRef = v(Fl, { optional: !0 }) ?? void 0),
          (this.pendingTasks = v(hn, { optional: !0 }) ?? void 0));
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
      return t instanceof ie && t.add(a), a;
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
  B = Ds;
function lo(...e) {}
function Rl(e) {
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
function hu(e) {
  return (
    queueMicrotask(() => e()),
    () => {
      e = lo;
    }
  );
}
var la = "isAngularZone",
  fo = la + "_ID",
  hg = 0,
  H = class e {
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
        scheduleInRootZone: i = Ol,
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
        mg(s);
    }
    static isInAngularZone() {
      return typeof Zone < "u" && Zone.current.get(la) === !0;
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
        s = i.scheduleEventTask("NgZoneEvent: " + o, t, pg, lo, lo);
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
  pg = {};
function da(e) {
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
function gg(e) {
  if (e.isCheckStableRunning || e.callbackScheduled) return;
  e.callbackScheduled = !0;
  function t() {
    Rl(() => {
      (e.callbackScheduled = !1),
        Cs(e),
        (e.isCheckStableRunning = !0),
        da(e),
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
    Cs(e);
}
function mg(e) {
  let t = () => {
      gg(e);
    },
    n = hg++;
  e._inner = e._inner.fork({
    name: "angular",
    properties: { [la]: !0, [fo]: n, [fo + n]: !0 },
    onInvokeTask: (r, o, i, s, a, c) => {
      if (yg(c)) return r.invokeTask(i, s, a, c);
      try {
        return pu(e), r.invokeTask(i, s, a, c);
      } finally {
        ((e.shouldCoalesceEventChangeDetection && s.type === "eventTask") ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          gu(e);
      }
    },
    onInvoke: (r, o, i, s, a, c, u) => {
      try {
        return pu(e), r.invoke(i, s, a, c, u);
      } finally {
        e.shouldCoalesceRunChangeDetection &&
          !e.callbackScheduled &&
          !vg(c) &&
          t(),
          gu(e);
      }
    },
    onHasTask: (r, o, i, s) => {
      r.hasTask(i, s),
        o === i &&
          (s.change == "microTask"
            ? ((e._hasPendingMicrotasks = s.microTask), Cs(e), da(e))
            : s.change == "macroTask" &&
              (e.hasPendingMacrotasks = s.macroTask));
    },
    onHandleError: (r, o, i, s) => (
      r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), !1
    ),
  });
}
function Cs(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.callbackScheduled === !0)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1);
}
function pu(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null));
}
function gu(e) {
  e._nesting--, da(e);
}
var ws = class {
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
function yg(e) {
  return Pl(e, "__ignore_ng_zone__");
}
function vg(e) {
  return Pl(e, "__scheduler_tick__");
}
function Pl(e, t) {
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
      let n = t && Yi(t);
      for (; n && Yi(n); ) n = Yi(n);
      return n || null;
    }
  },
  Dg = new C("", {
    providedIn: "root",
    factory: () => {
      let e = v(H),
        t = v(ze);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    },
  });
function Cg() {
  return kl(Te(), L());
}
function kl(e, t) {
  return new Ot(Pe(e, t));
}
var Ot = (() => {
  class e {
    constructor(n) {
      this.nativeElement = n;
    }
    static {
      this.__NG_ELEMENT_ID__ = Cg;
    }
  }
  return e;
})();
function Ll(e) {
  return (e.flags & 128) === 128;
}
var Vl = new Map(),
  wg = 0;
function Eg() {
  return wg++;
}
function _g(e) {
  Vl.set(e[To], e);
}
function Es(e) {
  Vl.delete(e[To]);
}
var mu = "__ngContext__";
function xt(e, t) {
  it(t) ? ((e[mu] = t[To]), _g(t)) : (e[mu] = t);
}
function jl(e) {
  return $l(e[Vn]);
}
function Bl(e) {
  return $l(e[be]);
}
function $l(e) {
  for (; e !== null && !Nt(e); ) e = e[be];
  return e;
}
var _s;
function Ul(e) {
  _s = e;
}
function bg() {
  if (_s !== void 0) return _s;
  if (typeof document < "u") return document;
  throw new I(210, !1);
}
var fa = new C("", { providedIn: "root", factory: () => Ig }),
  Ig = "ng",
  ha = new C(""),
  ut = new C("", { providedIn: "platform", factory: () => "unknown" });
var pa = new C("", {
  providedIn: "root",
  factory: () =>
    bg().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") ||
    null,
});
var Mg = "h",
  Tg = "b";
var xg = () => null;
function ga(e, t, n = !1) {
  return xg(e, t, n);
}
var Hl = !1,
  Sg = new C("", { providedIn: "root", factory: () => Hl });
var ho = class {
  constructor(t) {
    this.changingThisBreaksApplicationSecurity = t;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Au})`;
  }
};
function Oo(e) {
  return e instanceof ho ? e.changingThisBreaksApplicationSecurity : e;
}
function Gl(e, t) {
  let n = Ng(e);
  if (n != null && n !== t) {
    if (n === "ResourceURL" && t === "URL") return !0;
    throw new Error(`Required a safe ${t}, got a ${n} (see ${Au})`);
  }
  return n === t;
}
function Ng(e) {
  return (e instanceof ho && e.getTypeName()) || null;
}
var Ag = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i;
function zl(e) {
  return (e = String(e)), e.match(Ag) ? e : "unsafe:" + e;
}
var ma = (function (e) {
  return (
    (e[(e.NONE = 0)] = "NONE"),
    (e[(e.HTML = 1)] = "HTML"),
    (e[(e.STYLE = 2)] = "STYLE"),
    (e[(e.SCRIPT = 3)] = "SCRIPT"),
    (e[(e.URL = 4)] = "URL"),
    (e[(e.RESOURCE_URL = 5)] = "RESOURCE_URL"),
    e
  );
})(ma || {});
function Wn(e) {
  let t = Og();
  return t ? t.sanitize(ma.URL, e) || "" : Gl(e, "URL") ? Oo(e) : zl(Zs(e));
}
function Og() {
  let e = L();
  return e && e[Fe].sanitizer;
}
var We = (function (e) {
    return (
      (e[(e.Important = 1)] = "Important"),
      (e[(e.DashCase = 2)] = "DashCase"),
      e
    );
  })(We || {}),
  Fg;
function ya(e, t) {
  return Fg(e, t);
}
function Zt(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1;
    Nt(r) ? (i = r) : it(r) && ((s = !0), (r = r[Ye]));
    let a = Ge(r);
    e === 0 && n !== null
      ? o == null
        ? Yl(t, n, a)
        : bs(t, n, a, o || null, !0)
      : e === 1 && n !== null
      ? bs(t, n, a, o || null, !0)
      : e === 2
      ? Zg(t, a, s)
      : e === 3 && t.destroyNode(a),
      i != null && Qg(t, e, i, n, o);
  }
}
function Rg(e, t) {
  return e.createText(t);
}
function Pg(e, t, n) {
  e.setValue(t, n);
}
function Wl(e, t, n) {
  return e.createElement(t, n);
}
function kg(e, t) {
  ql(e, t), (t[Ye] = null), (t[Re] = null);
}
function Lg(e, t, n, r, o, i) {
  (r[Ye] = o), (r[Re] = t), Fo(e, r, n, 1, o, i);
}
function ql(e, t) {
  t[Fe].changeDetectionScheduler?.notify(9), Fo(e, t, t[ne], 2, null, null);
}
function Vg(e) {
  let t = e[Vn];
  if (!t) return Qi(e[M], e);
  for (; t; ) {
    let n = null;
    if (it(t)) n = t[Vn];
    else {
      let r = t[he];
      r && (n = r);
    }
    if (!n) {
      for (; t && !t[be] && t !== e; ) it(t) && Qi(t[M], t), (t = t[Ce]);
      t === null && (t = e), it(t) && Qi(t[M], t), (n = t && t[be]);
    }
    t = n;
  }
}
function jg(e, t, n, r) {
  let o = he + r,
    i = n.length;
  r > 0 && (n[o - 1][be] = t),
    r < i - he
      ? ((t[be] = n[o]), Hh(n, he + r, t))
      : (n.push(t), (t[be] = null)),
    (t[Ce] = n);
  let s = t[en];
  s !== null && n !== s && Zl(s, t);
  let a = t[tn];
  a !== null && a.insertView(e), ls(t), (t[E] |= 128);
}
function Zl(e, t) {
  let n = e[io],
    r = t[Ce];
  if (it(r)) e[E] |= so.HasTransplantedViews;
  else {
    let o = r[Ce][Ie];
    t[Ie] !== o && (e[E] |= so.HasTransplantedViews);
  }
  n === null ? (e[io] = [t]) : n.push(t);
}
function va(e, t) {
  let n = e[io],
    r = n.indexOf(t);
  n.splice(r, 1);
}
function Da(e, t) {
  if (e.length <= he) return;
  let n = he + t,
    r = e[n];
  if (r) {
    let o = r[en];
    o !== null && o !== e && va(o, r), t > 0 && (e[n - 1][be] = r[be]);
    let i = Vu(e, he + t);
    kg(r[M], r);
    let s = i[tn];
    s !== null && s.detachView(i[M]),
      (r[Ce] = null),
      (r[be] = null),
      (r[E] &= -129);
  }
  return r;
}
function Ca(e, t) {
  if (!(t[E] & 256)) {
    let n = t[ne];
    n.destroyNode && Fo(e, t, n, 3, null, null), Vg(t);
  }
}
function Qi(e, t) {
  if (t[E] & 256) return;
  let n = x(null);
  try {
    (t[E] &= -129),
      (t[E] |= 256),
      t[De] && Ni(t[De]),
      $g(e, t),
      Bg(e, t),
      t[M].type === 1 && t[ne].destroy();
    let r = t[en];
    if (r !== null && Nt(t[Ce])) {
      r !== t[Ce] && va(r, t);
      let o = t[tn];
      o !== null && o.detachView(e);
    }
    Es(t);
  } finally {
    x(n);
  }
}
function Bg(e, t) {
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
function $g(e, t) {
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
            Ne(4, a, c);
            try {
              c.call(a);
            } finally {
              Ne(5, a, c);
            }
          }
        else {
          Ne(4, o, i);
          try {
            i.call(o);
          } finally {
            Ne(5, o, i);
          }
        }
      }
    }
}
function Ug(e, t, n) {
  return Hg(e, t.parent, n);
}
function Hg(e, t, n) {
  let r = t;
  for (; r !== null && r.type & 168; ) (t = r), (r = t.parent);
  if (r === null) return n[Ye];
  {
    let { componentOffset: o } = r;
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o];
      if (i === Oe.None || i === Oe.Emulated) return null;
    }
    return Pe(r, n);
  }
}
function bs(e, t, n, r, o) {
  e.insertBefore(t, n, r, o);
}
function Yl(e, t, n) {
  e.appendChild(t, n);
}
function yu(e, t, n, r, o) {
  r !== null ? bs(e, t, n, r, o) : Yl(e, t, n);
}
function Gg(e, t) {
  return e.parentNode(t);
}
function zg(e, t, n) {
  return qg(e, t, n);
}
function Wg(e, t, n) {
  return e.type & 40 ? Pe(e, n) : null;
}
var qg = Wg,
  vu;
function wa(e, t, n, r) {
  let o = Ug(e, r, t),
    i = t[ne],
    s = r.parent || t[Re],
    a = zg(s, r, t);
  if (o != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) yu(i, o, n[c], a, !1);
    else yu(i, o, n, a, !1);
  vu !== void 0 && vu(i, r, t, n, o);
}
function Nn(e, t) {
  if (t !== null) {
    let n = t.type;
    if (n & 3) return Pe(t, e);
    if (n & 4) return Is(-1, e[t.index]);
    if (n & 8) {
      let r = t.child;
      if (r !== null) return Nn(e, r);
      {
        let o = e[t.index];
        return Nt(o) ? Is(-1, o) : Ge(o);
      }
    } else {
      if (n & 128) return Nn(e, t.next);
      if (n & 32) return ya(t, e)() || Ge(e[t.index]);
      {
        let r = Ql(e, t);
        if (r !== null) {
          if (Array.isArray(r)) return r[0];
          let o = It(e[Ie]);
          return Nn(o, r);
        } else return Nn(e, t.next);
      }
    }
  }
  return null;
}
function Ql(e, t) {
  if (t !== null) {
    let r = e[Ie][Re],
      o = t.projection;
    return r.projection[o];
  }
  return null;
}
function Is(e, t) {
  let n = he + e + 1;
  if (n < t.length) {
    let r = t[n],
      o = r[M].firstChild;
    if (o !== null) return Nn(r, o);
  }
  return t[jn];
}
function Zg(e, t, n) {
  e.removeChild(null, t, n);
}
function Ea(e, t, n, r, o, i, s) {
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
      if (c & 8) Ea(e, t, n.child, r, o, i, !1), Zt(t, e, o, a, i);
      else if (c & 32) {
        let u = ya(n, r),
          l;
        for (; (l = u()); ) Zt(t, e, o, l, i);
        Zt(t, e, o, a, i);
      } else c & 16 ? Yg(e, t, r, n, o, i) : Zt(t, e, o, a, i);
    n = s ? n.projectionNext : n.next;
  }
}
function Fo(e, t, n, r, o, i) {
  Ea(n, r, e.firstChild, t, o, i, !1);
}
function Yg(e, t, n, r, o, i) {
  let s = n[Ie],
    c = s[Re].projection[r.projection];
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u];
      Zt(t, e, o, l, i);
    }
  else {
    let u = c,
      l = s[Ce];
    Ll(r) && (u.flags |= 128), Ea(e, t, u, l, o, i, !0);
  }
}
function Qg(e, t, n, r, o) {
  let i = n[jn],
    s = Ge(n);
  i !== s && Zt(t, e, r, i, o);
  for (let a = he; a < n.length; a++) {
    let c = n[a];
    Fo(c[M], c, e, t, r, i);
  }
}
function Kg(e, t, n, r, o) {
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
function Jg(e, t, n) {
  e.setAttribute(t, "style", n);
}
function Kl(e, t, n) {
  n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
}
function Jl(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n;
  r !== null && os(e, t, r),
    o !== null && Kl(e, t, o),
    i !== null && Jg(e, t, i);
}
var Qe = {};
function N(e = 1) {
  Xl(ge(), L(), At() + e, !1);
}
function Xl(e, t, n, r) {
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
  let r = Te();
  return Sl(r, n, se(e), t);
}
function ed(e, t, n, r, o, i) {
  let s = x(null);
  try {
    let a = null;
    o & st.SignalBased && (a = t[r][tt]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & st.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : tl(t, a, r, i);
  } finally {
    x(s);
  }
}
function Xg(e, t) {
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
          Up(s, i);
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
    sl(d),
    (d[Ce] = d[dn] = e),
    (d[te] = n),
    (d[Fe] = s || (e && e[Fe])),
    (d[ne] = a || (e && e[ne])),
    (d[Xt] = c || (e && e[Xt]) || null),
    (d[Re] = i),
    (d[To] = Eg()),
    (d[Ln] = l),
    (d[Ju] = u),
    (d[Ie] = t.type == 2 ? e[Ie] : d),
    d
  );
}
function Po(e, t, n, r, o) {
  let i = e.data[t];
  if (i === null) (i = em(e, t, n, r, o)), $p() && (i.flags |= 32);
  else if (i.type & 64) {
    (i.type = n), (i.value = r), (i.attrs = o);
    let s = kp();
    i.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return zn(i, !0), i;
}
function em(e, t, n, r, o) {
  let i = dl(),
    s = fl(),
    a = s ? i : i && i.parent,
    c = (e.data[t] = im(e, a, n, t, r, o));
  return (
    e.firstChild === null && (e.firstChild = c),
    i !== null &&
      (s
        ? i.child == null && c.parent !== null && (i.child = c)
        : i.next === null && ((i.next = c), (c.prev = i))),
    c
  );
}
function td(e, t, n, r) {
  if (n === 0) return -1;
  let o = t.length;
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
  return o;
}
function nd(e, t, n, r, o) {
  let i = At(),
    s = r & 2;
  try {
    Mt(-1), s && t.length > pe && Xl(e, t, pe, !1), Ne(s ? 2 : 0, o), n(r, o);
  } finally {
    Mt(i), Ne(s ? 3 : 1, o);
  }
}
function rd(e, t, n) {
  if (el(t)) {
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
function od(e, t, n) {
  ll() && (dm(e, t, n, Pe(n, t)), (n.flags & 64) === 64 && ld(e, t, n));
}
function id(e, t, n = Pe) {
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
function sd(e) {
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
  let d = pe + r,
    h = d + o,
    f = tm(d, h),
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
function tm(e, t) {
  let n = [];
  for (let r = 0; r < t; r++) n.push(r < e ? null : Qe);
  return n;
}
function nm(e, t, n, r) {
  let i = r.get(Sg, Hl) || n === Oe.ShadowDom,
    s = e.selectRootElement(t, i);
  return rm(s), s;
}
function rm(e) {
  om(e);
}
var om = () => null;
function im(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0;
  return (
    Fp() && (a |= 128),
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
function Du(e, t, n, r, o) {
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
    e === 0 ? Cu(r, n, u, a, c) : Cu(r, n, u, a);
  }
  return r;
}
function Cu(e, t, n, r, o) {
  let i;
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o);
}
function sm(e, t, n) {
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
    (c = Du(0, d.inputs, l, c, f)), (u = Du(1, d.outputs, l, u, p));
    let g = c !== null && s !== null && !Ks(t) ? Cm(c, l, s) : null;
    a.push(g);
  }
  c !== null &&
    (c.hasOwnProperty("class") && (t.flags |= 8),
    c.hasOwnProperty("style") && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = c),
    (t.outputs = u);
}
function am(e) {
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
function ad(e, t, n, r, o, i, s, a) {
  let c = Pe(t, n),
    u = t.inputs,
    l;
  !a && u != null && (l = u[r])
    ? (Ia(e, n, l, r, o), xo(t) && cm(n, t.index))
    : t.type & 3
    ? ((r = am(r)),
      (o = s != null ? s(o, t.value || "", r) : o),
      i.setProperty(c, r, o))
    : t.type & 12;
}
function cm(e, t) {
  let n = ct(t, e);
  n[E] & 16 || (n[E] |= 64);
}
function cd(e, t, n, r) {
  if (ll()) {
    let o = r === null ? null : { "": -1 },
      i = hm(e, n),
      s,
      a;
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && ud(e, t, n, s, o, a),
      o && pm(n, r, o);
  }
  n.mergedAttrs = Pn(n.mergedAttrs, n.attrs);
}
function ud(e, t, n, r, o, i) {
  for (let u = 0; u < r.length; u++) ms(co(n, t), e, r[u].type);
  mm(n, e.data.length, r.length);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    l.providersResolver && l.providersResolver(l);
  }
  let s = !1,
    a = !1,
    c = td(e, t, r.length, null);
  for (let u = 0; u < r.length; u++) {
    let l = r[u];
    (n.mergedAttrs = Pn(n.mergedAttrs, l.hostAttrs)),
      ym(e, n, t, c, l),
      gm(c, l, o),
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
  sm(e, n, i);
}
function um(e, t, n, r, o) {
  let i = o.hostBindings;
  if (i) {
    let s = e.hostBindingOpCodes;
    s === null && (s = e.hostBindingOpCodes = []);
    let a = ~t.index;
    lm(s) != a && s.push(a), s.push(n, r, i);
  }
}
function lm(e) {
  let t = e.length;
  for (; t > 0; ) {
    let n = e[--t];
    if (typeof n == "number" && n < 0) return n;
  }
  return 0;
}
function dm(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd;
  xo(n) && vm(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || co(n, t),
    xt(r, t);
  let s = n.initialInputs;
  for (let a = o; a < i; a++) {
    let c = e.data[a],
      u = rn(t, e, a, n);
    if ((xt(u, t), s !== null && Dm(t, a - o, u, c, n, s), at(c))) {
      let l = ct(n.index, t);
      l[te] = rn(t, e, a, n);
    }
  }
}
function ld(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = Hp();
  try {
    Mt(i);
    for (let a = r; a < o; a++) {
      let c = e.data[a],
        u = t[a];
      ds(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          fm(c, u);
    }
  } finally {
    Mt(-1), ds(s);
  }
}
function fm(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t);
}
function hm(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null;
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i];
      if (ep(t, s.selectors, !1))
        if ((r || (r = []), at(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s);
            let c = a.length;
            Ms(e, t, c);
          } else r.unshift(s), Ms(e, t, 0);
        else
          (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s);
    }
  return r === null ? null : [r, o];
}
function Ms(e, t, n) {
  (t.componentOffset = n), (e.components ??= []).push(t.index);
}
function pm(e, t, n) {
  if (t) {
    let r = (e.localNames = []);
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new I(-301, !1);
      r.push(t[o], i);
    }
  }
}
function gm(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
    at(t) && (n[""] = e);
  }
}
function mm(e, t, n) {
  (e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t);
}
function ym(e, t, n, r, o) {
  e.data[r] = o;
  let i = o.factory || (o.factory = bt(o.type, !0)),
    s = new Tt(i, at(o), $);
  (e.blueprint[r] = s), (n[r] = s), um(e, t, r, td(e, n, o.hostVars, Qe), o);
}
function vm(e, t, n) {
  let r = Pe(t, e),
    o = sd(n),
    i = e[Fe].rendererFactory,
    s = 16;
  n.signals ? (s = 4096) : n.onPush && (s = 64);
  let a = ba(
    e,
    Ro(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null)
  );
  e[t.index] = a;
}
function Dm(e, t, n, r, o, i) {
  let s = i[t];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        u = s[a++],
        l = s[a++],
        d = s[a++];
      ed(r, n, c, u, l, d);
    }
}
function Cm(e, t, n) {
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
function wm(e, t, n, r) {
  return [e, !0, 0, t, null, r, null, n, null, null];
}
function dd(e, t) {
  let n = e.contentQueries;
  if (n !== null) {
    let r = x(null);
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1];
        if (s !== -1) {
          let a = e.data[s];
          pl(i), a.contentQueries(2, t[s], s);
        }
      }
    } finally {
      x(r);
    }
  }
}
function ba(e, t) {
  return e[Vn] ? (e[su][be] = t) : (e[Vn] = t), (e[su] = t), t;
}
function Ts(e, t, n) {
  pl(0);
  let r = x(null);
  try {
    t(e, n);
  } finally {
    x(r);
  }
}
function Em(e) {
  return (e[oo] ??= []);
}
function _m(e) {
  return (e.cleanup ??= []);
}
function fd(e, t) {
  let n = e[Xt],
    r = n ? n.get(ze, null) : null;
  r && r.handleError(t);
}
function Ia(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      c = n[i++],
      u = t[s],
      l = e.data[s];
    ed(l, u, r, a, c, o);
  }
}
function bm(e, t, n) {
  let r = il(t, e);
  Pg(e[ne], r, n);
}
function Im(e, t) {
  let n = ct(t, e),
    r = n[M];
  Mm(r, n);
  let o = n[Ye];
  o !== null && n[Ln] === null && (n[Ln] = ga(o, n[Xt])), Ma(r, n, n[te]);
}
function Mm(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
}
function Ma(e, t, n) {
  ia(t);
  try {
    let r = e.viewQuery;
    r !== null && Ts(1, r, n);
    let o = e.template;
    o !== null && nd(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      t[tn]?.finishViewCreation(e),
      e.staticContentQueries && dd(e, t),
      e.staticViewQueries && Ts(2, e.viewQuery, n);
    let i = e.components;
    i !== null && Tm(t, i);
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    );
  } finally {
    (t[E] &= -5), sa();
  }
}
function Tm(e, t) {
  for (let n = 0; n < t.length; n++) Im(e, t[n]);
}
function Ta(e, t, n, r) {
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
    c[en] = u;
    let l = e[tn];
    return l !== null && (c[tn] = l.createEmbeddedView(i)), Ma(i, c, n), c;
  } finally {
    x(o);
  }
}
function hd(e, t) {
  let n = he + t;
  if (n < e.length) return e[n];
}
function xa(e, t) {
  return !t || t.firstChild === null || Ll(e);
}
function Sa(e, t, n, r = !0) {
  let o = t[M];
  if ((jg(o, t, e, n), r)) {
    let s = Is(n, e),
      a = t[ne],
      c = Gg(a, e[jn]);
    c !== null && Lg(o, e[Re], a, t, c, s);
  }
  let i = t[Ln];
  i !== null && i.firstChild !== null && (i.firstChild = null);
}
function pd(e, t) {
  let n = Da(e, t);
  return n !== void 0 && Ca(n[M], n), n;
}
function po(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    if (n.type === 128) {
      n = o ? n.projectionNext : n.next;
      continue;
    }
    let i = t[n.index];
    i !== null && r.push(Ge(i)), Nt(i) && xm(i, r);
    let s = n.type;
    if (s & 8) po(e, t, n.child, r);
    else if (s & 32) {
      let a = ya(n, t),
        c;
      for (; (c = a()); ) r.push(c);
    } else if (s & 16) {
      let a = Ql(t, n);
      if (Array.isArray(a)) r.push(...a);
      else {
        let c = It(t[Ie]);
        po(c[M], c, a, r, !0);
      }
    }
    n = o ? n.projectionNext : n.next;
  }
  return r;
}
function xm(e, t) {
  for (let n = he; n < e.length; n++) {
    let r = e[n],
      o = r[M].firstChild;
    o !== null && po(r[M], r, o, t);
  }
  e[jn] !== e[Ye] && t.push(e[jn]);
}
var gd = [];
function Sm(e) {
  return e[De] ?? Nm(e);
}
function Nm(e) {
  let t = gd.pop() ?? Object.create(Om);
  return (t.lView = e), t;
}
function Am(e) {
  e.lView[De] !== e && ((e.lView = null), gd.push(e));
}
var Om = U(R({}, In), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    No(e.lView);
  },
  consumerOnSignalRead() {
    this.lView[De] = this;
  },
});
function Fm(e) {
  let t = e[De] ?? Object.create(Rm);
  return (t.lView = e), t;
}
var Rm = U(R({}, In), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    let t = It(e.lView);
    for (; t && !md(t[M]); ) t = It(t);
    t && al(t);
  },
  consumerOnSignalRead() {
    this.lView[De] = this;
  },
});
function md(e) {
  return e.type !== 2;
}
var Pm = 100;
function yd(e, t = !0, n = 0) {
  let r = e[Fe],
    o = r.rendererFactory,
    i = !1;
  i || o.begin?.();
  try {
    km(e, n);
  } catch (s) {
    throw (t && fd(e, s), s);
  } finally {
    i || (o.end?.(), r.inlineEffectRunner?.flush());
  }
}
function km(e, t) {
  let n = hl();
  try {
    cu(!0), xs(e, t);
    let r = 0;
    for (; So(e); ) {
      if (r === Pm) throw new I(103, !1);
      r++, xs(e, 1);
    }
  } finally {
    cu(n);
  }
}
function Lm(e, t, n, r) {
  let o = t[E];
  if ((o & 256) === 256) return;
  let i = !1,
    s = !1;
  !i && t[Fe].inlineEffectRunner?.flush(), ia(t);
  let a = !0,
    c = null,
    u = null;
  i ||
    (md(e)
      ? ((u = Sm(t)), (c = Cr(u)))
      : sc() === null
      ? ((a = !1), (u = Fm(t)), (c = Cr(u)))
      : t[De] && (Ni(t[De]), (t[De] = null)));
  try {
    sl(t), jp(e.bindingStartIndex), n !== null && nd(e, t, n, 2, r);
    let l = (o & 3) === 3;
    if (!i)
      if (l) {
        let f = e.preOrderCheckHooks;
        f !== null && Kr(t, f, null);
      } else {
        let f = e.preOrderHooks;
        f !== null && Jr(t, f, 0, null), Wi(t, 0);
      }
    if ((s || Vm(t), vd(t, 0), e.contentQueries !== null && dd(e, t), !i))
      if (l) {
        let f = e.contentCheckHooks;
        f !== null && Kr(t, f);
      } else {
        let f = e.contentHooks;
        f !== null && Jr(t, f, 1), Wi(t, 1);
      }
    Xg(e, t);
    let d = e.components;
    d !== null && Cd(t, d, 0);
    let h = e.viewQuery;
    if ((h !== null && Ts(2, h, r), !i))
      if (l) {
        let f = e.viewCheckHooks;
        f !== null && Kr(t, f);
      } else {
        let f = e.viewHooks;
        f !== null && Jr(t, f, 2), Wi(t, 2);
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[zi])) {
      for (let f of t[zi]) f();
      t[zi] = null;
    }
    i || (t[E] &= -73);
  } catch (l) {
    throw (i || No(t), l);
  } finally {
    u !== null && (xi(u, c), a && Am(u)), sa();
  }
}
function vd(e, t) {
  for (let n = jl(e); n !== null; n = Bl(n))
    for (let r = he; r < n.length; r++) {
      let o = n[r];
      Dd(o, t);
    }
}
function Vm(e) {
  for (let t = jl(e); t !== null; t = Bl(t)) {
    if (!(t[E] & so.HasTransplantedViews)) continue;
    let n = t[io];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      al(o);
    }
  }
}
function jm(e, t, n) {
  let r = ct(t, e);
  Dd(r, n);
}
function Dd(e, t) {
  oa(e) && xs(e, t);
}
function xs(e, t) {
  let r = e[M],
    o = e[E],
    i = e[De],
    s = !!(t === 0 && o & 16);
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Si(i))),
    (s ||= !1),
    i && (i.dirty = !1),
    (e[E] &= -9217),
    s)
  )
    Lm(r, e, r.template, e[te]);
  else if (o & 8192) {
    vd(e, 1);
    let a = r.components;
    a !== null && Cd(e, a, 1);
  }
}
function Cd(e, t, n) {
  for (let r = 0; r < t.length; r++) jm(e, t[r], n);
}
function Na(e, t) {
  let n = hl() ? 64 : 1088;
  for (e[Fe].changeDetectionScheduler?.notify(t); e; ) {
    e[E] |= n;
    let r = It(e);
    if (cs(e) && !r) return e;
    e = r;
  }
  return null;
}
var Bn = class {
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
    return this._lView[te];
  }
  set context(t) {
    this._lView[te] = t;
  }
  get destroyed() {
    return (this._lView[E] & 256) === 256;
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this);
    else if (this._attachedToViewContainer) {
      let t = this._lView[Ce];
      if (Nt(t)) {
        let n = t[wp],
          r = n ? n.indexOf(this) : -1;
        r > -1 && (Da(t, r), Vu(n, r));
      }
      this._attachedToViewContainer = !1;
    }
    Ca(this._lView[M], this._lView);
  }
  onDestroy(t) {
    cl(this._lView, t);
  }
  markForCheck() {
    Na(this._cdRefInjectingView || this._lView, 4);
  }
  detach() {
    this._lView[E] &= -129;
  }
  reattach() {
    ls(this._lView), (this._lView[E] |= 128);
  }
  detectChanges() {
    (this._lView[E] |= 1024), yd(this._lView, this.notifyErrorHandler);
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new I(902, !1);
    this._attachedToViewContainer = !0;
  }
  detachFromAppRef() {
    this._appRef = null;
    let t = cs(this._lView),
      n = this._lView[en];
    n !== null && !t && va(n, this._lView), ql(this._lView[M], this._lView);
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new I(902, !1);
    this._appRef = t;
    let n = cs(this._lView),
      r = this._lView[en];
    r !== null && !n && Zl(r, this._lView), ls(this._lView);
  }
};
var Ob = new RegExp(`^(\\d+)*(${Tg}|${Mg})*(.*)`);
var Bm = () => null;
function Aa(e, t) {
  return Bm(e, t);
}
var sn = class {},
  ko = new C("", { providedIn: "root", factory: () => !1 });
var wd = new C(""),
  Ed = new C(""),
  Ss = class {},
  go = class {};
function $m(e) {
  let t = Error(`No component factory found for ${ve(e)}.`);
  return (t[Um] = e), t;
}
var Um = "ngComponent";
var Ns = class {
    resolveComponentFactory(t) {
      throw $m(t);
    }
  },
  $n = class {
    static {
      this.NULL = new Ns();
    }
  },
  an = class {},
  qn = (() => {
    class e {
      constructor() {
        this.destroyNode = null;
      }
      static {
        this.__NG_ELEMENT_ID__ = () => Hm();
      }
    }
    return e;
  })();
function Hm() {
  let e = L(),
    t = Te(),
    n = ct(t.index, e);
  return (it(n) ? n : e)[ne];
}
var Gm = (() => {
  class e {
    static {
      this.ɵprov = _({ token: e, providedIn: "root", factory: () => null });
    }
  }
  return e;
})();
function As(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0;
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = Qc(o, a);
      else if (i == 2) {
        let c = a,
          u = t[++s];
        r = Qc(r, c + ": " + u + ";");
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o);
}
var Os = class extends $n {
  constructor(t) {
    super(), (this.ngModule = t);
  }
  resolveComponentFactory(t) {
    let n = bo(t);
    return new Fs(n, this.ngModule);
  }
};
function wu(e, t) {
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
function zm(e) {
  let t = e.toLowerCase();
  return t === "svg" ? Ip : t === "math" ? Mp : null;
}
var Fs = class extends go {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = wu(t.inputs, !0);
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
      return r;
    }
    get outputs() {
      return wu(this.componentDef.outputs, !1);
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = op(t.selectors)),
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
        let a = s ? new fs(t, s) : t,
          c = a.get(an, null);
        if (c === null) throw new I(407, !1);
        let u = a.get(Gm, null),
          l = a.get(sn, null),
          d = {
            rendererFactory: c,
            sanitizer: u,
            inlineEffectRunner: null,
            changeDetectionScheduler: l,
          },
          h = c.createRenderer(null, this.componentDef),
          f = this.componentDef.selectors[0][0] || "div",
          p = r
            ? nm(h, r, this.componentDef.encapsulation, a)
            : Wl(h, f, zm(f)),
          g = 512;
        this.componentDef.signals
          ? (g |= 4096)
          : this.componentDef.onPush || (g |= 16);
        let D = null;
        p !== null && (D = ga(p, a, !0));
        let w = _a(0, null, null, 1, 0, null, null, null, null, null, null),
          F = Ro(null, w, null, g, null, null, d, h, a, null, D);
        ia(F);
        let k,
          J,
          de = null;
        try {
          let W = this.componentDef,
            je,
            bi = null;
          W.findHostDirectiveDefs
            ? ((je = []),
              (bi = new Map()),
              W.findHostDirectiveDefs(W, je, bi),
              je.push(W))
            : (je = [W]);
          let Wf = Wm(F, p);
          (de = qm(Wf, p, W, je, F, d, h)),
            (J = ra(w, pe)),
            p && Qm(h, W, p, r),
            n !== void 0 && Km(J, this.ngContentSelectors, n),
            (k = Ym(de, W, je, bi, F, [Jm])),
            Ma(w, F, null);
        } catch (W) {
          throw (de !== null && Es(de), Es(F), W);
        } finally {
          sa();
        }
        return new Rs(this.componentType, k, kl(J, F), F, J);
      } finally {
        x(i);
      }
    }
  },
  Rs = class extends Ss {
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new Bn(o, void 0, !1)),
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
        Ia(i[M], i, o, t, n), this.previousInputValues.set(t, n);
        let s = ct(this._tNode.index, i);
        Na(s, 1);
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
function Wm(e, t) {
  let n = e[M],
    r = pe;
  return (e[r] = t), Po(n, r, 2, "#host", null);
}
function qm(e, t, n, r, o, i, s) {
  let a = o[M];
  Zm(r, e, t, s);
  let c = null;
  t !== null && (c = ga(t, o[Xt]));
  let u = i.rendererFactory.createRenderer(t, n),
    l = 16;
  n.signals ? (l = 4096) : n.onPush && (l = 64);
  let d = Ro(o, sd(n), null, l, o[e.index], e, i, u, null, null, c);
  return (
    a.firstCreatePass && Ms(a, e, r.length - 1), ba(o, d), (o[e.index] = d)
  );
}
function Zm(e, t, n, r) {
  for (let o of e) t.mergedAttrs = Pn(t.mergedAttrs, o.hostAttrs);
  t.mergedAttrs !== null &&
    (As(t, t.mergedAttrs, !0), n !== null && Jl(r, n, t));
}
function Ym(e, t, n, r, o, i) {
  let s = Te(),
    a = o[M],
    c = Pe(s, o);
  ud(a, o, s, n, null, r);
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      h = rn(o, a, d, s);
    xt(h, o);
  }
  ld(a, o, s), c && xt(c, o);
  let u = rn(o, a, s.directiveStart + s.componentOffset, s);
  if (((e[te] = o[te] = u), i !== null)) for (let l of i) l(u, t);
  return rd(a, s, o), u;
}
function Qm(e, t, n, r) {
  if (r) os(e, n, ["ng-version", "18.2.14"]);
  else {
    let { attrs: o, classes: i } = ip(t.selectors[0]);
    o && os(e, n, o), i && i.length > 0 && Kl(e, n, i.join(" "));
  }
}
function Km(e, t, n) {
  let r = (e.projection = []);
  for (let o = 0; o < t.length; o++) {
    let i = n[o];
    r.push(i != null ? Array.from(i) : null);
  }
}
function Jm() {
  let e = Te();
  ua(L()[M], e);
}
var Xm = () => !1;
function ey(e, t, n) {
  return Xm(e, t, n);
}
var Eu = new Set();
function lt(e) {
  Eu.has(e) ||
    (Eu.add(e),
    performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
}
function Ft(e, t) {
  lt("NgSignals");
  let n = yc(e),
    r = n[tt];
  return (
    t?.equal && (r.equal = t.equal),
    (n.set = (o) => Ai(r, o)),
    (n.update = (o) => vc(r, o)),
    (n.asReadonly = ty.bind(n)),
    n
  );
}
function ty() {
  let e = this[tt];
  if (e.readonlyFn === void 0) {
    let t = () => this();
    (t[tt] = e), (e.readonlyFn = t);
  }
  return e.readonlyFn;
}
function ny(e) {
  return Object.getPrototypeOf(e.prototype).constructor;
}
function dt(e) {
  let t = ny(e.type),
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
        a && ay(e, a);
        let c = o.viewQuery,
          u = o.contentQueries;
        if (
          (c && iy(e, c),
          u && sy(e, u),
          ry(e, o),
          bh(e.outputs, o.outputs),
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
  oy(r);
}
function ry(e, t) {
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
function oy(e) {
  let t = 0,
    n = null;
  for (let r = e.length - 1; r >= 0; r--) {
    let o = e[r];
    (o.hostVars = t += o.hostVars),
      (o.hostAttrs = Pn(o.hostAttrs, (n = Pn(n, o.hostAttrs))));
  }
}
function qr(e) {
  return e === Kt ? {} : e === ye ? [] : e;
}
function iy(e, t) {
  let n = e.viewQuery;
  n
    ? (e.viewQuery = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.viewQuery = t);
}
function sy(e, t) {
  let n = e.contentQueries;
  n
    ? (e.contentQueries = (r, o, i) => {
        t(r, o, i), n(r, o, i);
      })
    : (e.contentQueries = t);
}
function ay(e, t) {
  let n = e.hostBindings;
  n
    ? (e.hostBindings = (r, o) => {
        t(r, o), n(r, o);
      })
    : (e.hostBindings = t);
}
var cn = class {};
var mo = class extends cn {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new Os(this)),
      (this.instance = null);
    let n = new kn(
      [
        ...t.providers,
        { provide: cn, useValue: this },
        { provide: $n, useValue: this.componentFactoryResolver },
      ],
      t.parent || ta(),
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
function cy(e, t, n = null) {
  return new mo({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector;
}
function uy(e, t, n) {
  return (e[t] = n);
}
function pn(e, t, n) {
  let r = e[t];
  return Object.is(r, n) ? !1 : ((e[t] = n), !0);
}
function ly(e) {
  return (e.flags & 32) === 32;
}
function dy(e, t, n, r, o, i, s, a, c) {
  let u = t.consts,
    l = Po(t, e, 4, s || null, a || null);
  cd(t, n, l, nn(u, c)), ua(t, l);
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
function Ps(e, t, n, r, o, i, s, a, c, u) {
  let l = n + pe,
    d = t.firstCreatePass ? dy(l, t, e, r, o, i, s, a, c) : t.data[l];
  zn(d, !1);
  let h = fy(t, e, d, n);
  aa() && wa(t, e, h, d), xt(h, e);
  let f = wm(h, e, h, d);
  return (
    (e[l] = f),
    ba(e, f),
    ey(f, d, e),
    na(d) && od(t, e, d),
    c != null && id(e, d, u),
    d
  );
}
function Rt(e, t, n, r, o, i, s, a) {
  let c = L(),
    u = ge(),
    l = nn(u.consts, i);
  return Ps(c, u, e, t, n, r, o, l, s, a), Rt;
}
var fy = hy;
function hy(e, t, n, r) {
  return ca(!0), t[ne].createComment("");
}
var An = (function (e) {
    return (
      (e[(e.EarlyRead = 0)] = "EarlyRead"),
      (e[(e.Write = 1)] = "Write"),
      (e[(e.MixedReadWrite = 2)] = "MixedReadWrite"),
      (e[(e.Read = 3)] = "Read"),
      e
    );
  })(An || {}),
  py = (() => {
    class e {
      constructor() {
        this.impl = null;
      }
      execute() {
        this.impl?.execute();
      }
      static {
        this.ɵprov = _({
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
      (this.ngZone = v(H)),
        (this.scheduler = v(sn)),
        (this.errorHandler = v(ze, { optional: !0 })),
        (this.sequences = new Set()),
        (this.deferredRegistrations = new Set()),
        (this.executing = !1);
    }
    static {
      this.PHASES = [An.EarlyRead, An.Write, An.MixedReadWrite, An.Read];
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
      this.ɵprov = _({ token: e, providedIn: "root", factory: () => new e() });
    }
  };
function _d(e, t, n, r) {
  return pn(e, Ao(), n) ? t + Zs(n) + r : Qe;
}
function Zr(e, t) {
  return (e << 17) | (t << 2);
}
function St(e) {
  return (e >> 17) & 32767;
}
function gy(e) {
  return (e & 2) == 2;
}
function my(e, t) {
  return (e & 131071) | (t << 17);
}
function ks(e) {
  return e | 2;
}
function un(e) {
  return (e & 131068) >> 2;
}
function Ki(e, t) {
  return (e & -131069) | (t << 2);
}
function yy(e) {
  return (e & 1) === 1;
}
function Ls(e) {
  return e | 1;
}
function vy(e, t, n, r, o, i) {
  let s = i ? t.classBindings : t.styleBindings,
    a = St(s),
    c = un(s);
  e[r] = n;
  let u = !1,
    l;
  if (Array.isArray(n)) {
    let d = n;
    (l = d[1]), (l === null || Hn(d, l) > 0) && (u = !0);
  } else l = n;
  if (o)
    if (c !== 0) {
      let h = St(e[a + 1]);
      (e[r + 1] = Zr(h, a)),
        h !== 0 && (e[h + 1] = Ki(e[h + 1], r)),
        (e[a + 1] = my(e[a + 1], r));
    } else
      (e[r + 1] = Zr(a, 0)), a !== 0 && (e[a + 1] = Ki(e[a + 1], r)), (a = r);
  else
    (e[r + 1] = Zr(c, 0)),
      a === 0 ? (a = r) : (e[c + 1] = Ki(e[c + 1], r)),
      (c = r);
  u && (e[r + 1] = ks(e[r + 1])),
    bu(e, l, r, !0),
    bu(e, l, r, !1),
    Dy(t, l, e, r, i),
    (s = Zr(a, c)),
    i ? (t.classBindings = s) : (t.styleBindings = s);
}
function Dy(e, t, n, r, o) {
  let i = o ? e.residualClasses : e.residualStyles;
  i != null &&
    typeof t == "string" &&
    Hn(i, t) >= 0 &&
    (n[r + 1] = Ls(n[r + 1]));
}
function bu(e, t, n, r) {
  let o = e[n + 1],
    i = t === null,
    s = r ? St(o) : un(o),
    a = !1;
  for (; s !== 0 && (a === !1 || i); ) {
    let c = e[s],
      u = e[s + 1];
    Cy(c, t) && ((a = !0), (e[s + 1] = r ? Ls(u) : ks(u))),
      (s = r ? St(u) : un(u));
  }
  a && (e[n + 1] = r ? ks(o) : Ls(o));
}
function Cy(e, t) {
  return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t
    ? !0
    : Array.isArray(e) && typeof t == "string"
    ? Hn(e, t) >= 0
    : !1;
}
function xe(e, t, n) {
  let r = L(),
    o = Ao();
  if (pn(r, o, t)) {
    let i = ge(),
      s = Cl();
    ad(i, s, r, e, t, r[ne], n, !1);
  }
  return xe;
}
function Iu(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? "class" : "style";
  Ia(e, n, i[s], s, r);
}
function Lo(e, t) {
  return wy(e, t, null, !0), Lo;
}
function wy(e, t, n, r) {
  let o = L(),
    i = ge(),
    s = Bp(2);
  if ((i.firstUpdatePass && _y(i, e, s, r), t !== Qe && pn(o, s, t))) {
    let a = i.data[At()];
    xy(i, a, o, o[ne], e, (o[s + 1] = Sy(t, n)), r, s);
  }
}
function Ey(e, t) {
  return t >= e.expandoStartIndex;
}
function _y(e, t, n, r) {
  let o = e.data;
  if (o[n + 1] === null) {
    let i = o[At()],
      s = Ey(e, n);
    Ny(i, r) && t === null && !s && (t = !1),
      (t = by(o, i, t, r)),
      vy(o, i, t, n, s, r);
  }
}
function by(e, t, n, r) {
  let o = Gp(e),
    i = r ? t.residualClasses : t.residualStyles;
  if (o === null)
    (r ? t.classBindings : t.styleBindings) === 0 &&
      ((n = Ji(null, e, t, n, r)), (n = Un(n, t.attrs, r)), (i = null));
  else {
    let s = t.directiveStylingLast;
    if (s === -1 || e[s] !== o)
      if (((n = Ji(o, e, t, n, r)), i === null)) {
        let c = Iy(e, t, r);
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Ji(null, e, t, c[1], r)),
          (c = Un(c, t.attrs, r)),
          My(e, t, r, c));
      } else i = Ty(e, t, r);
  }
  return (
    i !== void 0 && (r ? (t.residualClasses = i) : (t.residualStyles = i)), n
  );
}
function Iy(e, t, n) {
  let r = n ? t.classBindings : t.styleBindings;
  if (un(r) !== 0) return e[St(r)];
}
function My(e, t, n, r) {
  let o = n ? t.classBindings : t.styleBindings;
  e[St(o)] = r;
}
function Ty(e, t, n) {
  let r,
    o = t.directiveEnd;
  for (let i = 1 + t.directiveStylingLast; i < o; i++) {
    let s = e[i].hostAttrs;
    r = Un(r, s, n);
  }
  return Un(r, t.attrs, n);
}
function Ji(e, t, n, r, o) {
  let i = null,
    s = n.directiveEnd,
    a = n.directiveStylingLast;
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < s && ((i = t[a]), (r = Un(r, i.hostAttrs, o)), i !== e);

  )
    a++;
  return e !== null && (n.directiveStylingLast = a), r;
}
function Un(e, t, n) {
  let r = n ? 1 : 2,
    o = -1;
  if (t !== null)
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number"
        ? (o = s)
        : o === r &&
          (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]),
          zh(e, s, n ? !0 : t[++i]));
    }
  return e === void 0 ? null : e;
}
function xy(e, t, n, r, o, i, s, a) {
  if (!(t.type & 3)) return;
  let c = e.data,
    u = c[a + 1],
    l = yy(u) ? Mu(c, t, n, o, un(u), s) : void 0;
  if (!yo(l)) {
    yo(i) || (gy(u) && (i = Mu(c, null, n, o, a, s)));
    let d = il(At(), n);
    Kg(r, s, d, o, i);
  }
}
function Mu(e, t, n, r, o, i) {
  let s = t === null,
    a;
  for (; o > 0; ) {
    let c = e[o],
      u = Array.isArray(c),
      l = u ? c[1] : c,
      d = l === null,
      h = n[o + 1];
    h === Qe && (h = d ? ye : void 0);
    let f = d ? Hi(h, r) : l === r ? h : void 0;
    if ((u && !yo(f) && (f = Hi(c, r)), yo(f) && ((a = f), s))) return a;
    let p = e[o + 1];
    o = s ? St(p) : un(p);
  }
  if (t !== null) {
    let c = i ? t.residualClasses : t.residualStyles;
    c != null && (a = Hi(c, r));
  }
  return a;
}
function yo(e) {
  return e !== void 0;
}
function Sy(e, t) {
  return (
    e == null ||
      e === "" ||
      (typeof t == "string"
        ? (e = e + t)
        : typeof e == "object" && (e = ve(Oo(e)))),
    e
  );
}
function Ny(e, t) {
  return (e.flags & (t ? 8 : 16)) !== 0;
}
var Vs = class {
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
function Xi(e, t, n, r, o) {
  return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
}
function Ay(e, t, n) {
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
        d = Xi(i, u, i, l, n);
      if (d !== 0) {
        d < 0 && e.updateValue(i, l), i++;
        continue;
      }
      let h = e.at(s),
        f = t[c],
        p = Xi(s, h, c, f, n);
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
      if (((r ??= new vo()), (o ??= xu(e, i, s, n)), js(e, r, i, w)))
        e.updateValue(i, l), i++, s++;
      else if (o.has(w)) r.set(g, e.detach(i)), s--;
      else {
        let F = e.create(i, t[i]);
        e.attach(i, F), i++, s++;
      }
    }
    for (; i <= c; ) Tu(e, r, n, i, t[i]), i++;
  } else if (t != null) {
    let c = t[Symbol.iterator](),
      u = c.next();
    for (; !u.done && i <= s; ) {
      let l = e.at(i),
        d = u.value,
        h = Xi(i, l, i, d, n);
      if (h !== 0) h < 0 && e.updateValue(i, d), i++, (u = c.next());
      else {
        (r ??= new vo()), (o ??= xu(e, i, s, n));
        let f = n(i, d);
        if (js(e, r, i, f)) e.updateValue(i, d), i++, s++, (u = c.next());
        else if (!o.has(f))
          e.attach(i, e.create(i, d)), i++, s++, (u = c.next());
        else {
          let p = n(i, l);
          r.set(p, e.detach(i)), s--;
        }
      }
    }
    for (; !u.done; ) Tu(e, r, n, e.length, u.value), (u = c.next());
  }
  for (; i <= s; ) e.destroy(e.detach(s--));
  r?.forEach((c) => {
    e.destroy(c);
  });
}
function js(e, t, n, r) {
  return t !== void 0 && t.has(r)
    ? (e.attach(n, t.get(r)), t.delete(r), !0)
    : !1;
}
function Tu(e, t, n, r, o) {
  if (js(e, t, r, n(r, o))) e.updateValue(r, o);
  else {
    let i = e.create(r, o);
    e.attach(r, i);
  }
}
function xu(e, t, n, r) {
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
function Pt(e, t) {
  lt("NgControlFlow");
  let n = L(),
    r = Ao(),
    o = n[r] !== Qe ? n[r] : -1,
    i = o !== -1 ? Do(n, pe + o) : void 0,
    s = 0;
  if (pn(n, r, e)) {
    let a = x(null);
    try {
      if ((i !== void 0 && pd(i, s), e !== -1)) {
        let c = pe + e,
          u = Do(n, c),
          l = Hs(n[M], c),
          d = Aa(u, l.tView.ssrId),
          h = Ta(n, l, t, { dehydratedView: d });
        Sa(u, h, s, xa(l, d));
      }
    } finally {
      x(a);
    }
  } else if (i !== void 0) {
    let a = hd(i, s);
    a !== void 0 && (a[te] = t);
  }
}
var Bs = class {
  constructor(t, n, r) {
    (this.lContainer = t), (this.$implicit = n), (this.$index = r);
  }
  get $count() {
    return this.lContainer.length - he;
  }
};
var $s = class {
  constructor(t, n, r) {
    (this.hasEmptyBlock = t), (this.trackByFn = n), (this.liveCollection = r);
  }
};
function Zn(e, t, n, r, o, i, s, a, c, u, l, d, h) {
  lt("NgControlFlow");
  let f = L(),
    p = ge(),
    g = c !== void 0,
    D = L(),
    w = a ? s.bind(D[Ie][te]) : s,
    F = new $s(g, w);
  (D[pe + e] = F),
    Ps(f, p, e + 1, t, n, r, o, nn(p.consts, i)),
    g && Ps(f, p, e + 2, c, u, l, d, nn(p.consts, h));
}
var Us = class extends Vs {
  constructor(t, n, r) {
    super(),
      (this.lContainer = t),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.operationsCounter = void 0),
      (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - he;
  }
  at(t) {
    return this.getLView(t)[te].$implicit;
  }
  attach(t, n) {
    let r = n[Ln];
    (this.needsIndexUpdate ||= t !== this.length),
      Sa(this.lContainer, n, t, xa(this.templateTNode, r));
  }
  detach(t) {
    return (
      (this.needsIndexUpdate ||= t !== this.length - 1), Oy(this.lContainer, t)
    );
  }
  create(t, n) {
    let r = Aa(this.lContainer, this.templateTNode.tView.ssrId),
      o = Ta(
        this.hostLView,
        this.templateTNode,
        new Bs(this.lContainer, n, t),
        { dehydratedView: r }
      );
    return this.operationsCounter?.recordCreate(), o;
  }
  destroy(t) {
    Ca(t[M], t), this.operationsCounter?.recordDestroy();
  }
  updateValue(t, n) {
    this.getLView(t)[te].$implicit = n;
  }
  reset() {
    (this.needsIndexUpdate = !1), this.operationsCounter?.reset();
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let t = 0; t < this.length; t++) this.getLView(t)[te].$index = t;
  }
  getLView(t) {
    return Fy(this.lContainer, t);
  }
};
function Yn(e) {
  let t = x(null),
    n = At();
  try {
    let r = L(),
      o = r[M],
      i = r[n],
      s = n + 1,
      a = Do(r, s);
    if (i.liveCollection === void 0) {
      let u = Hs(o, s);
      i.liveCollection = new Us(a, r, u);
    } else i.liveCollection.reset();
    let c = i.liveCollection;
    if ((Ay(c, e, i.trackByFn), c.updateIndexes(), i.hasEmptyBlock)) {
      let u = Ao(),
        l = c.length === 0;
      if (pn(r, u, l)) {
        let d = n + 2,
          h = Do(r, d);
        if (l) {
          let f = Hs(o, d),
            p = Aa(h, f.tView.ssrId),
            g = Ta(r, f, void 0, { dehydratedView: p });
          Sa(h, g, 0, xa(f, p));
        } else pd(h, 0);
      }
    }
  } finally {
    x(t);
  }
}
function Do(e, t) {
  return e[t];
}
function Oy(e, t) {
  return Da(e, t);
}
function Fy(e, t) {
  return hd(e, t);
}
function Hs(e, t) {
  return ra(e, t);
}
function Ry(e, t, n, r, o, i) {
  let s = t.consts,
    a = nn(s, o),
    c = Po(t, e, 2, r, a);
  return (
    cd(t, n, c, nn(s, i)),
    c.attrs !== null && As(c, c.attrs, !1),
    c.mergedAttrs !== null && As(c, c.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, c),
    c
  );
}
function m(e, t, n, r) {
  let o = L(),
    i = ge(),
    s = pe + e,
    a = o[ne],
    c = i.firstCreatePass ? Ry(s, i, o, t, n, r) : i.data[s],
    u = Py(i, o, c, a, t, e);
  o[s] = u;
  let l = na(c);
  return (
    zn(c, !0),
    Jl(a, u, c),
    !ly(c) && aa() && wa(i, o, u, c),
    Np() === 0 && xt(u, o),
    Ap(),
    l && (od(i, o, c), rd(i, c, o)),
    r !== null && id(o, c),
    m
  );
}
function y() {
  let e = Te();
  fl() ? Lp() : ((e = e.parent), zn(e, !1));
  let t = e;
  Rp(t) && Pp(), Op();
  let n = ge();
  return (
    n.firstCreatePass && (ua(n, e), el(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      Kp(t) &&
      Iu(n, t, L(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      Jp(t) &&
      Iu(n, t, L(), t.stylesWithoutHost, !1),
    y
  );
}
function K(e, t, n, r) {
  return m(e, t, n, r), y(), K;
}
var Py = (e, t, n, r, o, i) => (ca(!0), Wl(r, o, qp()));
function ke() {
  return L();
}
var Co = "en-US";
var ky = Co;
function Ly(e) {
  typeof e == "string" && (ky = e.toLowerCase().replace(/_/g, "-"));
}
var Vy = (e, t, n) => {};
function O(e, t, n, r) {
  let o = L(),
    i = ge(),
    s = Te();
  return By(i, o, o[ne], s, e, t, r), O;
}
function jy(e, t, n, r) {
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
function By(e, t, n, r, o, i, s) {
  let a = na(r),
    u = e.firstCreatePass && _m(e),
    l = t[te],
    d = Em(t),
    h = !0;
  if (r.type & 3 || s) {
    let g = Pe(r, t),
      D = s ? s(g) : g,
      w = d.length,
      F = s ? (J) => s(Ge(J[r.index])) : r.index,
      k = null;
    if ((!s && a && (k = jy(e, t, o, r.index)), k !== null)) {
      let J = k.__ngLastListenerFn__ || k;
      (J.__ngNextListenerFn__ = i), (k.__ngLastListenerFn__ = i), (h = !1);
    } else {
      (i = Nu(r, t, l, i)), Vy(g, o, i);
      let J = n.listen(D, o, i);
      d.push(i, J), u && u.push(o, F, w, w + 1);
    }
  } else i = Nu(r, t, l, i);
  let f = r.outputs,
    p;
  if (h && f !== null && (p = f[o])) {
    let g = p.length;
    if (g)
      for (let D = 0; D < g; D += 2) {
        let w = p[D],
          F = p[D + 1],
          de = t[w][F].subscribe(i),
          W = d.length;
        d.push(i, de), u && u.push(o, r.index, W, -(W + 1));
      }
  }
}
function Su(e, t, n, r) {
  let o = x(null);
  try {
    return Ne(6, t, n), n(r) !== !1;
  } catch (i) {
    return fd(e, i), !1;
  } finally {
    Ne(7, t, n), x(o);
  }
}
function Nu(e, t, n, r) {
  return function o(i) {
    if (i === Function) return r;
    let s = e.componentOffset > -1 ? ct(e.index, t) : t;
    Na(s, 5);
    let a = Su(t, n, r, i),
      c = o.__ngNextListenerFn__;
    for (; c; ) (a = Su(t, n, c, i) && a), (c = c.__ngNextListenerFn__);
    return a;
  };
}
function ue(e = 1) {
  return Wp(e);
}
function Qn(e, t, n) {
  return Vo(e, "", t, "", n), Qn;
}
function Vo(e, t, n, r, o) {
  let i = L(),
    s = _d(i, t, n, r);
  if (s !== Qe) {
    let a = ge(),
      c = Cl();
    ad(a, c, i, e, s, i[ne], o, !1);
  }
  return Vo;
}
function $y(e, t, n, r) {
  n >= e.data.length && ((e.data[n] = null), (e.blueprint[n] = null)),
    (t[n] = r);
}
function j(e, t = "") {
  let n = L(),
    r = ge(),
    o = e + pe,
    i = r.firstCreatePass ? Po(r, o, 1, t, null) : r.data[o],
    s = Uy(r, n, i, t, e);
  (n[o] = s), aa() && wa(r, n, s, i), zn(i, !1);
}
var Uy = (e, t, n, r, o) => (ca(!0), Rg(t[ne], r));
function Se(e) {
  return we("", e, ""), Se;
}
function we(e, t, n) {
  let r = L(),
    o = _d(r, e, t, n);
  return o !== Qe && bm(r, At(), o), we;
}
function Hy(e, t, n) {
  let r = ge();
  if (r.firstCreatePass) {
    let o = at(e);
    Gs(n, r.data, r.blueprint, o, !0), Gs(t, r.data, r.blueprint, o, !1);
  }
}
function Gs(e, t, n, r, o) {
  if (((e = se(e)), Array.isArray(e)))
    for (let i = 0; i < e.length; i++) Gs(e[i], t, n, r, o);
  else {
    let i = ge(),
      s = L(),
      a = Te(),
      c = Jt(e) ? e : se(e.provide),
      u = Qu(e),
      l = a.providerIndexes & 1048575,
      d = a.directiveStart,
      h = a.providerIndexes >> 20;
    if (Jt(e) || !e.multi) {
      let f = new Tt(u, o, $),
        p = ts(c, t, o ? l : l + h, d);
      p === -1
        ? (ms(co(a, s), i, c),
          es(i, e, t.length),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(f),
          s.push(f))
        : ((n[p] = f), (s[p] = f));
    } else {
      let f = ts(c, t, l + h, d),
        p = ts(c, t, l, l + h),
        g = f >= 0 && n[f],
        D = p >= 0 && n[p];
      if ((o && !D) || (!o && !g)) {
        ms(co(a, s), i, c);
        let w = Wy(o ? zy : Gy, n.length, o, r, u);
        !o && D && (n[p].providerFactory = w),
          es(i, e, t.length, 0),
          t.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          o && (a.providerIndexes += 1048576),
          n.push(w),
          s.push(w);
      } else {
        let w = bd(n[o ? p : f], u, !o && r);
        es(i, e, f > -1 ? f : p, w);
      }
      !o && r && D && n[p].componentProviders++;
    }
  }
}
function es(e, t, n, r) {
  let o = Jt(t),
    i = hp(t);
  if (o || i) {
    let c = (i ? se(t.useClass) : t).prototype.ngOnDestroy;
    if (c) {
      let u = e.destroyHooks || (e.destroyHooks = []);
      if (!o && t.multi) {
        let l = u.indexOf(n);
        l === -1 ? u.push(n, [r, c]) : u[l + 1].push(r, c);
      } else u.push(n, c);
    }
  }
}
function bd(e, t, n) {
  return n && e.componentProviders++, e.multi.push(t) - 1;
}
function ts(e, t, n, r) {
  for (let o = n; o < r; o++) if (t[o] === e) return o;
  return -1;
}
function Gy(e, t, n, r) {
  return zs(this.multi, []);
}
function zy(e, t, n, r) {
  let o = this.multi,
    i;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = rn(n, n[M], this.providerFactory.index, r);
    (i = a.slice(0, s)), zs(o, i);
    for (let c = s; c < a.length; c++) i.push(a[c]);
  } else (i = []), zs(o, i);
  return i;
}
function zs(e, t) {
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    t.push(r());
  }
  return t;
}
function Wy(e, t, n, r, o) {
  let i = new Tt(e, n, $);
  return (
    (i.multi = []),
    (i.index = t),
    (i.componentProviders = 0),
    bd(i, o, r && !n),
    i
  );
}
function jo(e, t = []) {
  return (n) => {
    n.providersResolver = (r, o) => Hy(r, o ? o(e) : e, t);
  };
}
var qy = (() => {
  class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let r = qu(!1, n.type),
          o =
            r.length > 0
              ? cy([r], this._injector, `Standalone[${n.type.name}]`)
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
      this.ɵprov = _({
        token: e,
        providedIn: "environment",
        factory: () => new e(T(He)),
      });
    }
  }
  return e;
})();
function oe(e) {
  lt("NgStandalone"),
    (e.getStandaloneInjector = (t) =>
      t.get(qy).getOrCreateStandaloneInjector(e));
}
function Zy(e, t) {
  let n = e[t];
  return n === Qe ? void 0 : n;
}
function Yy(e, t, n, r, o, i) {
  let s = t + n;
  return pn(e, s, o) ? uy(e, s + 1, i ? r.call(i, o) : r(o)) : Zy(e, s + 1);
}
function G(e, t) {
  let n = ge(),
    r,
    o = e + pe;
  n.firstCreatePass
    ? ((r = Qy(t, n.pipeRegistry)),
      (n.data[o] = r),
      r.onDestroy && (n.destroyHooks ??= []).push(o, r.onDestroy))
    : (r = n.data[o]);
  let i = r.factory || (r.factory = bt(r.type, !0)),
    s,
    a = fe($);
  try {
    let c = ao(!1),
      u = i();
    return ao(c), $y(n, L(), o, u), u;
  } finally {
    fe(a);
  }
}
function Qy(e, t) {
  if (t)
    for (let n = t.length - 1; n >= 0; n--) {
      let r = t[n];
      if (e === r.name) return r;
    }
}
function z(e, t, n) {
  let r = e + pe,
    o = L(),
    i = Tp(o, r);
  return Ky(o, r) ? Yy(o, Vp(), t, i.transform, n, i) : i.transform(n);
}
function Ky(e, t) {
  return e[M].data[t].pure;
}
var Id = new C("");
function Kn(e) {
  return !!e && typeof e.then == "function";
}
function Md(e) {
  return !!e && typeof e.subscribe == "function";
}
var Oa = new C(""),
  Td = (() => {
    class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, r) => {
            (this.resolve = n), (this.reject = r);
          })),
          (this.appInits = v(Oa, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let i = o();
          if (Kn(i)) n.push(i);
          else if (Md(i)) {
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
        this.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  xd = new C("");
function Jy() {
  mc(() => {
    throw new I(600, !1);
  });
}
function Xy(e) {
  return e.isBoundToModule;
}
var ev = 10;
function tv(e, t, n) {
  try {
    let r = n();
    return Kn(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o);
        })
      : r;
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r);
  }
}
var gn = (() => {
  class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = v(Dg)),
        (this.afterRenderManager = v(py)),
        (this.zonelessEnabled = v(ko)),
        (this.dirtyFlags = 0),
        (this.deferredDirtyFlags = 0),
        (this.externalTestViews = new Set()),
        (this.beforeRender = new Q()),
        (this.afterTick = new Q()),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = v(hn).hasPendingTasks.pipe(X((n) => !n))),
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
      if (!this._injector.get(Td).done) {
        let h = !o && cp(n),
          f = !1;
        throw new I(405, f);
      }
      let s;
      o ? (s = n) : (s = this._injector.get($n).resolveComponentFactory(n)),
        this.componentTypes.push(s.componentType);
      let a = Xy(s) ? void 0 : this._injector.get(cn),
        c = r || s.selector,
        u = s.create(on.NULL, [], c, a),
        l = u.location.nativeElement,
        d = u.injector.get(Id, null);
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
        (n = this._injector.get(an, null, { optional: !0 })),
        (this.dirtyFlags |= this.deferredDirtyFlags),
        (this.deferredDirtyFlags = 0);
      let r = 0;
      for (; this.dirtyFlags !== 0 && r++ < ev; ) this.synchronizeOnce(n);
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
          nv(o, i, r, this.zonelessEnabled);
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
      let r = this._injector.get(xd, []);
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
      this.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function Xr(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function nv(e, t, n, r) {
  if (!n && !So(e)) return;
  yd(e, t, n && !r ? 0 : 1);
}
var rv = (() => {
    class e {
      constructor() {
        (this.zone = v(H)),
          (this.changeDetectionScheduler = v(sn)),
          (this.applicationRef = v(gn));
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
        this.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
      }
    }
    return e;
  })(),
  ov = new C("", { factory: () => !1 });
function Sd({
  ngZoneFactory: e,
  ignoreChangesOutsideZone: t,
  scheduleInRootZone: n,
}) {
  return (
    (e ??= () => new H(U(R({}, Ad()), { scheduleInRootZone: n }))),
    [
      { provide: H, useFactory: e },
      {
        provide: Rn,
        multi: !0,
        useFactory: () => {
          let r = v(rv, { optional: !0 });
          return () => r.initialize();
        },
      },
      {
        provide: Rn,
        multi: !0,
        useFactory: () => {
          let r = v(iv);
          return () => {
            r.initialize();
          };
        },
      },
      t === !0 ? { provide: wd, useValue: !0 } : [],
      { provide: Ed, useValue: n ?? Ol },
    ]
  );
}
function Nd(e) {
  let t = e?.ignoreChangesOutsideZone,
    n = e?.scheduleInRootZone,
    r = Sd({
      ngZoneFactory: () => {
        let o = Ad(e);
        return (
          (o.scheduleInRootZone = n),
          o.shouldCoalesceEventChangeDetection && lt("NgZone_CoalesceEvent"),
          new H(o)
        );
      },
      ignoreChangesOutsideZone: t,
      scheduleInRootZone: n,
    });
  return Io([{ provide: ov, useValue: !0 }, { provide: ko, useValue: !1 }, r]);
}
function Ad(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  };
}
var iv = (() => {
  class e {
    constructor() {
      (this.subscription = new ie()),
        (this.initialized = !1),
        (this.zone = v(H)),
        (this.pendingTasks = v(hn));
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
              H.assertNotInAngularZone(),
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
            H.assertInAngularZone(), (n ??= this.pendingTasks.add());
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
      this.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
var sv = (() => {
  class e {
    constructor() {
      (this.appRef = v(gn)),
        (this.taskService = v(hn)),
        (this.ngZone = v(H)),
        (this.zonelessEnabled = v(ko)),
        (this.disableScheduling = v(wd, { optional: !0 }) ?? !1),
        (this.zoneIsDefined = typeof Zone < "u" && !!Zone.root.run),
        (this.schedulerTickApplyArgs = [{ data: { __scheduler_tick__: !0 } }]),
        (this.subscriptions = new ie()),
        (this.angularZoneId = this.zoneIsDefined
          ? this.ngZone._inner?.get(fo)
          : null),
        (this.scheduleInRootZone =
          !this.zonelessEnabled &&
          this.zoneIsDefined &&
          (v(Ed, { optional: !0 }) ?? !1)),
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
          (this.ngZone instanceof ws || !this.zoneIsDefined));
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
      let r = this.useMicrotaskScheduler ? hu : Rl;
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
        hu(() => {
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
      this.ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
    }
  }
  return e;
})();
function av() {
  return (typeof $localize < "u" && $localize.locale) || Co;
}
var Fa = new C("", {
  providedIn: "root",
  factory: () => v(Fa, A.Optional | A.SkipSelf) || av(),
});
var Ws = new C("");
function Yr(e) {
  return !e.moduleRef;
}
function cv(e) {
  let t = Yr(e) ? e.r3Injector : e.moduleRef.injector,
    n = t.get(H);
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
        s = e.platformInjector.get(Ws);
      s.add(i),
        t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
    } else {
      let i = () => e.moduleRef.destroy(),
        s = e.platformInjector.get(Ws);
      s.add(i),
        e.moduleRef.onDestroy(() => {
          Xr(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
    }
    return tv(r, n, () => {
      let i = t.get(Td);
      return (
        i.runInitializers(),
        i.donePromise.then(() => {
          let s = t.get(Fa, Co);
          if ((Ly(s || Co), Yr(e))) {
            let a = t.get(gn);
            return (
              e.rootComponent !== void 0 && a.bootstrap(e.rootComponent), a
            );
          } else return uv(e.moduleRef, e.allPlatformModules), e.moduleRef;
        })
      );
    });
  });
}
function uv(e, t) {
  let n = e.injector.get(gn);
  if (e._bootstrapComponents.length > 0)
    e._bootstrapComponents.forEach((r) => n.bootstrap(r));
  else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
  else throw new I(-403, !1);
  t.push(e);
}
var eo = null,
  Od = new C("");
function lv(e = [], t) {
  return on.create({
    name: t,
    providers: [
      { provide: Mo, useValue: "platform" },
      { provide: Ws, useValue: new Set([() => (eo = null)]) },
      ...e,
    ],
  });
}
function dv(e = []) {
  if (eo) return eo;
  let t = lv(e);
  return t.get(Od, !1) || (eo = t), Jy(), fv(t), t;
}
function fv(e) {
  e.get(ha, null)?.forEach((n) => n());
}
var Jn = (() => {
  class e {
    static {
      this.__NG_ELEMENT_ID__ = hv;
    }
  }
  return e;
})();
function hv(e) {
  return pv(Te(), L(), (e & 16) === 16);
}
function pv(e, t, n) {
  if (xo(e) && !n) {
    let r = ct(e.index, t);
    return new Bn(r, r);
  } else if (e.type & 175) {
    let r = t[Ie];
    return new Bn(r, t);
  }
  return null;
}
function Fd(e) {
  let {
    rootComponent: t,
    appProviders: n,
    platformProviders: r,
    platformRef: o,
  } = e;
  try {
    let i = o?.injector ?? dv(r);
    if (i.get(Od, !1) === !0 && !e.platformRef) throw new I(401, !1);
    let s = [Sd({}), { provide: sn, useExisting: sv }, ...(n || [])],
      a = new mo({
        providers: s,
        parent: i,
        debugName: "",
        runEnvironmentInitializers: !1,
      });
    return cv({
      r3Injector: a.injector,
      platformInjector: i,
      rootComponent: t,
    });
  } catch (i) {
    return Promise.reject(i);
  }
}
function Xn(e, t) {
  lt("NgSignals");
  let n = hc(e);
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
var Pd = null;
function yn() {
  return Pd;
}
function kd(e) {
  Pd ??= e;
}
var Bo = class {};
var Le = new C("");
function $o(e, t) {
  t = encodeURIComponent(t);
  for (let n of e.split(";")) {
    let r = n.indexOf("="),
      [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
    if (o.trim() === t) return decodeURIComponent(i);
  }
  return null;
}
var Ra = (() => {
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
  Ld = "browser",
  yv = "server";
function Uo(e) {
  return e === yv;
}
var mn = class {};
var tr = class {},
  Go = class {},
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
var ka = class {
  encodeKey(t) {
    return Vd(t);
  }
  encodeValue(t) {
    return Vd(t);
  }
  decodeKey(t) {
    return decodeURIComponent(t);
  }
  decodeValue(t) {
    return decodeURIComponent(t);
  }
};
function Dv(e, t) {
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
var Cv = /%(\d[a-f0-9])/gi,
  wv = {
    40: "@",
    "3A": ":",
    24: "$",
    "2C": ",",
    "3B": ";",
    "3D": "=",
    "3F": "?",
    "2F": "/",
  };
function Vd(e) {
  return encodeURIComponent(e).replace(Cv, (t, n) => wv[n] ?? t);
}
function Ho(e) {
  return `${e}`;
}
var ht = class e {
  constructor(t = {}) {
    if (
      ((this.updates = null),
      (this.cloneFrom = null),
      (this.encoder = t.encoder || new ka()),
      t.fromString)
    ) {
      if (t.fromObject)
        throw new Error("Cannot specify both fromString and fromObject.");
      this.map = Dv(t.fromString, this.encoder);
    } else
      t.fromObject
        ? ((this.map = new Map()),
          Object.keys(t.fromObject).forEach((n) => {
            let r = t.fromObject[n],
              o = Array.isArray(r) ? r.map(Ho) : [Ho(r)];
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
              n.push(Ho(t.value)), this.map.set(t.param, n);
              break;
            case "d":
              if (t.value !== void 0) {
                let r = this.map.get(t.param) || [],
                  o = r.indexOf(Ho(t.value));
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
var La = class {
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
function Ev(e) {
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
function jd(e) {
  return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer;
}
function Bd(e) {
  return typeof Blob < "u" && e instanceof Blob;
}
function $d(e) {
  return typeof FormData < "u" && e instanceof FormData;
}
function _v(e) {
  return typeof URLSearchParams < "u" && e instanceof URLSearchParams;
}
var er = class e {
    constructor(t, n, r, o) {
      (this.url = n),
        (this.body = null),
        (this.reportProgress = !1),
        (this.withCredentials = !1),
        (this.responseType = "json"),
        (this.method = t.toUpperCase());
      let i;
      if (
        (Ev(this.method) || o
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
        (this.context ??= new La()),
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
          jd(this.body) ||
          Bd(this.body) ||
          $d(this.body) ||
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
      return this.body === null || $d(this.body)
        ? null
        : Bd(this.body)
        ? this.body.type || null
        : jd(this.body)
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
  nr = class {
    constructor(t, n = 200, r = "OK") {
      (this.headers = t.headers || new Je()),
        (this.status = t.status !== void 0 ? t.status : n),
        (this.statusText = t.statusText || r),
        (this.url = t.url || null),
        (this.ok = this.status >= 200 && this.status < 300);
    }
  },
  zo = class e extends nr {
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
  rr = class e extends nr {
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
  ft = class extends nr {
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
  zd = 200,
  bv = 204;
function Pa(e, t) {
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
var kt = (() => {
    class e {
      constructor(n) {
        this.handler = n;
      }
      request(n, r, o = {}) {
        let i;
        if (n instanceof er) i = n;
        else {
          let c;
          o.headers instanceof Je ? (c = o.headers) : (c = new Je(o.headers));
          let u;
          o.params &&
            (o.params instanceof ht
              ? (u = o.params)
              : (u = new ht({ fromObject: o.params }))),
            (i = new er(n, r, o.body !== void 0 ? o.body : null, {
              headers: c,
              context: o.context,
              params: u,
              reportProgress: o.reportProgress,
              responseType: o.responseType || "json",
              withCredentials: o.withCredentials,
              transferCache: o.transferCache,
            }));
        }
        let s = Ue(i).pipe(Sn((c) => this.handler.handle(c)));
        if (n instanceof er || o.observe === "events") return s;
        let a = s.pipe(Bi((c) => c instanceof rr));
        switch (o.observe || "body") {
          case "body":
            switch (i.responseType) {
              case "arraybuffer":
                return a.pipe(
                  X((c) => {
                    if (c.body !== null && !(c.body instanceof ArrayBuffer))
                      throw new Error("Response is not an ArrayBuffer.");
                    return c.body;
                  })
                );
              case "blob":
                return a.pipe(
                  X((c) => {
                    if (c.body !== null && !(c.body instanceof Blob))
                      throw new Error("Response is not a Blob.");
                    return c.body;
                  })
                );
              case "text":
                return a.pipe(
                  X((c) => {
                    if (c.body !== null && typeof c.body != "string")
                      throw new Error("Response is not a string.");
                    return c.body;
                  })
                );
              case "json":
              default:
                return a.pipe(X((c) => c.body));
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
        return this.request("PATCH", n, Pa(o, r));
      }
      post(n, r, o = {}) {
        return this.request("POST", n, Pa(o, r));
      }
      put(n, r, o = {}) {
        return this.request("PUT", n, Pa(o, r));
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(T(tr));
        };
      }
      static {
        this.ɵprov = _({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Iv = /^\)\]\}',?\n/,
  Mv = "X-Request-URL";
function Ud(e) {
  if (e.url) return e.url;
  let t = Mv.toLocaleLowerCase();
  return e.headers.get(t);
}
var Tv = (() => {
    class e {
      constructor() {
        (this.fetchImpl =
          v(Va, { optional: !0 })?.fetch ?? ((...n) => globalThis.fetch(...n))),
          (this.ngZone = v(H));
      }
      handle(n) {
        return new P((r) => {
          let o = new AbortController();
          return (
            this.doRequest(n, o.signal, r).then(ja, (i) =>
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
            xv(f), o.next({ type: pt.Sent }), (s = yield f);
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
            u = Ud(s) ?? n.urlWithParams,
            l = s.status,
            d = null;
          if (
            (n.reportProgress &&
              o.next(new zo({ headers: a, status: l, statusText: c, url: u })),
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
                  let { done: de, value: W } = yield g.read();
                  if (de) break;
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
            let J = this.concatChunks(p, D);
            try {
              let de = s.headers.get("Content-Type") ?? "";
              d = this.parseBody(n, J, de);
            } catch (de) {
              o.error(
                new ft({
                  error: de,
                  headers: new Je(s.headers),
                  status: s.status,
                  statusText: s.statusText,
                  url: Ud(s) ?? n.urlWithParams,
                })
              );
              return;
            }
          }
          l === 0 && (l = d ? zd : 0),
            l >= 200 && l < 300
              ? (o.next(
                  new rr({
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
            let i = new TextDecoder().decode(r).replace(Iv, "");
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
        this.ɵprov = _({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Va = class {};
function ja() {}
function xv(e) {
  e.then(ja, ja);
}
function Sv(e, t) {
  return t(e);
}
function Nv(e, t, n) {
  return (r, o) => Ku(n, () => t(r, (i) => e(i, o)));
}
var Wd = new C(""),
  Av = new C(""),
  Ov = new C("", { providedIn: "root", factory: () => !0 });
var Hd = (() => {
  class e extends tr {
    constructor(n, r) {
      super(),
        (this.backend = n),
        (this.injector = r),
        (this.chain = null),
        (this.pendingTasks = v(hn)),
        (this.contributeToStability = v(Ov));
    }
    handle(n) {
      if (this.chain === null) {
        let r = Array.from(
          new Set([...this.injector.get(Wd), ...this.injector.get(Av, [])])
        );
        this.chain = r.reduceRight((o, i) => Nv(o, i, this.injector), Sv);
      }
      if (this.contributeToStability) {
        let r = this.pendingTasks.add();
        return this.chain(n, (o) => this.backend.handle(o)).pipe(
          $i(() => this.pendingTasks.remove(r))
        );
      } else return this.chain(n, (r) => this.backend.handle(r));
    }
    static {
      this.ɵfac = function (r) {
        return new (r || e)(T(Go), T(He));
      };
    }
    static {
      this.ɵprov = _({ token: e, factory: e.ɵfac });
    }
  }
  return e;
})();
var Fv = /^\)\]\}',?\n/;
function Rv(e) {
  return "responseURL" in e && e.responseURL
    ? e.responseURL
    : /^X-Request-URL:/m.test(e.getAllResponseHeaders())
    ? e.getResponseHeader("X-Request-URL")
    : null;
}
var Gd = (() => {
    class e {
      constructor(n) {
        this.xhrFactory = n;
      }
      handle(n) {
        if (n.method === "JSONP") throw new I(-2800, !1);
        let r = this.xhrFactory;
        return (r.ɵloadImpl ? $e(r.ɵloadImpl()) : Ue(null)).pipe(
          zt(
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
                      w = Rv(s) || n.url;
                    return (
                      (c = new zo({
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
                    D !== bv &&
                      (k =
                        typeof s.response > "u" ? s.responseText : s.response),
                      D === 0 && (D = k ? zd : 0);
                    let J = D >= 200 && D < 300;
                    if (n.responseType === "json" && typeof k == "string") {
                      let de = k;
                      k = k.replace(Fv, "");
                      try {
                        k = k !== "" ? JSON.parse(k) : null;
                      } catch (W) {
                        (k = de), J && ((J = !1), (k = { error: W, text: k }));
                      }
                    }
                    J
                      ? (i.next(
                          new rr({
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
          return new (r || e)(T(mn));
        };
      }
      static {
        this.ɵprov = _({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  qd = new C(""),
  Pv = "XSRF-TOKEN",
  kv = new C("", { providedIn: "root", factory: () => Pv }),
  Lv = "X-XSRF-TOKEN",
  Vv = new C("", { providedIn: "root", factory: () => Lv }),
  Wo = class {},
  jv = (() => {
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
            (this.lastToken = $o(n, this.cookieName)),
            (this.lastCookieString = n)),
          this.lastToken
        );
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)(T(Le), T(ut), T(kv));
        };
      }
      static {
        this.ɵprov = _({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })();
function Bv(e, t) {
  let n = e.url.toLowerCase();
  if (
    !v(qd) ||
    e.method === "GET" ||
    e.method === "HEAD" ||
    n.startsWith("http://") ||
    n.startsWith("https://")
  )
    return t(e);
  let r = v(Wo).getToken(),
    o = v(Vv);
  return (
    r != null &&
      !e.headers.has(o) &&
      (e = e.clone({ headers: e.headers.set(o, r) })),
    t(e)
  );
}
function Zd(...e) {
  let t = [
    kt,
    Gd,
    Hd,
    { provide: tr, useExisting: Hd },
    { provide: Go, useFactory: () => v(Tv, { optional: !0 }) ?? v(Gd) },
    { provide: Wd, useValue: Bv, multi: !0 },
    { provide: qd, useValue: !0 },
    { provide: Wo, useClass: jv },
  ];
  for (let n of e) t.push(...n.ɵproviders);
  return Io(t);
}
var Ua = class extends Bo {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  Ha = class e extends Ua {
    static makeCurrent() {
      kd(new e());
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
      let n = Uv();
      return n == null ? null : Hv(n);
    }
    resetBaseElement() {
      or = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(t) {
      return $o(document.cookie, t);
    }
  },
  or = null;
function Uv() {
  return (
    (or = or || document.querySelector("base")),
    or ? or.getAttribute("href") : null
  );
}
function Hv(e) {
  return new URL(e, document.baseURI).pathname;
}
var Gv = (() => {
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
        this.ɵprov = _({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Ga = new C(""),
  Xd = (() => {
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
          return new (r || e)(T(Ga), T(H));
        };
      }
      static {
        this.ɵprov = _({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  qo = class {
    constructor(t) {
      this._doc = t;
    }
  },
  Ba = "ng-app-id",
  ef = (() => {
    class e {
      constructor(n, r, o, i = {}) {
        (this.doc = n),
          (this.appId = r),
          (this.nonce = o),
          (this.platformId = i),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Uo(i)),
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
        let n = this.doc.head?.querySelectorAll(`style[${Ba}="${this.appId}"]`);
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
        if (i?.parentNode === n) return o.delete(r), i.removeAttribute(Ba), i;
        {
          let s = this.doc.createElement("style");
          return (
            this.nonce && s.setAttribute("nonce", this.nonce),
            (s.textContent = r),
            this.platformIsServer && s.setAttribute(Ba, this.appId),
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
          return new (r || e)(T(Le), T(fa), T(pa, 8), T(ut));
        };
      }
      static {
        this.ɵprov = _({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  $a = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: "http://www.w3.org/1999/xhtml",
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/",
    math: "http://www.w3.org/1998/Math/MathML",
  },
  Wa = /%COMP%/g,
  tf = "%COMP%",
  zv = `_nghost-${tf}`,
  Wv = `_ngcontent-${tf}`,
  qv = !0,
  Zv = new C("", { providedIn: "root", factory: () => qv });
function Yv(e) {
  return Wv.replace(Wa, e);
}
function Qv(e) {
  return zv.replace(Wa, e);
}
function nf(e, t) {
  return t.map((n) => n.replace(Wa, e));
}
var Qd = (() => {
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
          (this.platformIsServer = Uo(a)),
          (this.defaultRenderer = new ir(n, s, c, this.platformIsServer));
      }
      createRenderer(n, r) {
        if (!n || !r) return this.defaultRenderer;
        this.platformIsServer &&
          r.encapsulation === Oe.ShadowDom &&
          (r = U(R({}, r), { encapsulation: Oe.Emulated }));
        let o = this.getOrCreateRenderer(n, r);
        return (
          o instanceof Zo
            ? o.applyToHost(n)
            : o instanceof sr && o.applyStyles(),
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
            case Oe.Emulated:
              i = new Zo(c, u, r, this.appId, l, s, a, d);
              break;
            case Oe.ShadowDom:
              return new za(c, u, n, r, s, a, this.nonce, d);
            default:
              i = new sr(c, u, r, l, s, a, d);
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
            T(Xd),
            T(ef),
            T(fa),
            T(Zv),
            T(Le),
            T(ut),
            T(H),
            T(pa)
          );
        };
      }
      static {
        this.ɵprov = _({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  ir = class {
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
        ? this.doc.createElementNS($a[n] || n, t)
        : this.doc.createElement(t);
    }
    createComment(t) {
      return this.doc.createComment(t);
    }
    createText(t) {
      return this.doc.createTextNode(t);
    }
    appendChild(t, n) {
      (Kd(t) ? t.content : t).appendChild(n);
    }
    insertBefore(t, n, r) {
      t && (Kd(t) ? t.content : t).insertBefore(n, r);
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
        let i = $a[o];
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
      } else t.setAttribute(n, r);
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = $a[r];
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
        ((t = yn().getGlobalEventTarget(this.doc, t)), !t)
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
function Kd(e) {
  return e.tagName === "TEMPLATE" && e.content !== void 0;
}
var za = class extends ir {
    constructor(t, n, r, o, i, s, a, c) {
      super(t, i, s, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: "open" })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let u = nf(o.id, o.styles);
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
  sr = class extends ir {
    constructor(t, n, r, o, i, s, a, c) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = c ? nf(c, r.styles) : r.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  Zo = class extends sr {
    constructor(t, n, r, o, i, s, a, c) {
      let u = o + "-" + r.id;
      super(t, n, r, i, s, a, c, u),
        (this.contentAttr = Yv(u)),
        (this.hostAttr = Qv(u));
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
    }
    createElement(t, n) {
      let r = super.createElement(t, n);
      return super.setAttribute(r, this.contentAttr, ""), r;
    }
  },
  Kv = (() => {
    class e extends qo {
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
        this.ɵprov = _({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })(),
  Jd = ["alt", "control", "meta", "shift"],
  Jv = {
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
  Xv = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  eD = (() => {
    class e extends qo {
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
          .runOutsideAngular(() => yn().onAndCancel(n, i.domEventName, s));
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
          Jd.forEach((u) => {
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
        let o = Jv[n.key] || n.key,
          i = "";
        return (
          r.indexOf("code.") > -1 && ((o = n.code), (i = "code.")),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === " " ? (o = "space") : o === "." && (o = "dot"),
              Jd.forEach((s) => {
                if (s !== o) {
                  let a = Xv[s];
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
        this.ɵprov = _({ token: e, factory: e.ɵfac });
      }
    }
    return e;
  })();
function rf(e, t, n) {
  return Fd(R({ rootComponent: e, platformRef: n?.platformRef }, tD(t)));
}
function tD(e) {
  return {
    appProviders: [...sD, ...(e?.providers ?? [])],
    platformProviders: iD,
  };
}
function nD() {
  Ha.makeCurrent();
}
function rD() {
  return new ze();
}
function oD() {
  return Ul(document), document;
}
var iD = [
  { provide: ut, useValue: Ld },
  { provide: ha, useValue: nD, multi: !0 },
  { provide: Le, useFactory: oD, deps: [] },
];
var sD = [
  { provide: Mo, useValue: "root" },
  { provide: ze, useFactory: rD, deps: [] },
  { provide: Ga, useClass: Kv, multi: !0, deps: [Le, H, ut] },
  { provide: Ga, useClass: eD, multi: !0, deps: [Le] },
  Qd,
  ef,
  Xd,
  { provide: an, useExisting: Qd },
  { provide: mn, useClass: Gv, deps: [] },
  [],
];
var ur = class {},
  aD = (() => {
    class e {
      handle(n) {
        return n.key;
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  vn = class {},
  cD = (() => {
    class e extends vn {
      compile(n, r) {
        return n;
      }
      compileTranslations(n, r) {
        return n;
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = fn(e)))(o || e);
        };
      })();
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  mt = class {},
  uD = (() => {
    class e extends mt {
      getTranslation(n) {
        return Ue({});
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = fn(e)))(o || e);
        };
      })();
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })();
function Yo(e, t) {
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
        for (let i = 0; i < o; i++) if (!Yo(e[i], t[i])) return !1;
        return !0;
      }
    } else {
      if (Array.isArray(t)) return !1;
      if (Xe(e) && Xe(t)) {
        let i = Object.create(null);
        for (let s in e) {
          if (!Yo(e[s], t[s])) return !1;
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
function of(e) {
  return e !== void 0;
}
function Xe(e) {
  return cr(e) && !Lt(e) && e !== null;
}
function cr(e) {
  return typeof e == "object" && e !== null;
}
function Lt(e) {
  return Array.isArray(e);
}
function Qo(e) {
  return typeof e == "string";
}
function lD(e) {
  return typeof e == "function";
}
function Ko(e) {
  if (Lt(e)) return e.map((t) => Ko(t));
  if (Xe(e)) {
    let t = {};
    return (
      Object.keys(e).forEach((n) => {
        t[n] = Ko(e[n]);
      }),
      t
    );
  } else return e;
}
function Ya(e, t) {
  if (!cr(e)) return Ko(t);
  let n = Ko(e);
  return (
    cr(n) &&
      cr(t) &&
      Object.keys(t).forEach((r) => {
        Xe(t[r])
          ? r in e
            ? (n[r] = Ya(e[r], t[r]))
            : Object.assign(n, { [r]: t[r] })
          : Object.assign(n, { [r]: t[r] });
      }),
    n
  );
}
function af(e, t) {
  let n = t.split(".");
  t = "";
  do {
    t += n.shift();
    let r = !n.length;
    if (gt(e)) {
      if (Xe(e) && of(e[t]) && (Xe(e[t]) || Lt(e[t]) || r)) {
        (e = e[t]), (t = "");
        continue;
      }
      if (Lt(e)) {
        let o = parseInt(t, 10);
        if (of(e[o]) && (Xe(e[o]) || Lt(e[o]) || r)) {
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
function dD(e, t, n) {
  return Ya(e, fD(t, n));
}
function fD(e, t) {
  return e.split(".").reduceRight((n, r) => ({ [r]: n }), t);
}
var Dn = class {},
  hD = (() => {
    class e extends Dn {
      templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
      interpolate(n, r) {
        if (Qo(n)) return this.interpolateString(n, r);
        if (lD(n)) return this.interpolateFunction(n, r);
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
        return this.formatValue(af(n, r));
      }
      formatValue(n) {
        if (Qo(n)) return n;
        if (typeof n == "number" || typeof n == "boolean") return n.toString();
        if (n === null) return "null";
        if (Lt(n)) return n.join(", ");
        if (cr(n))
          return typeof n.toString == "function" &&
            n.toString !== Object.prototype.toString
            ? n.toString()
            : JSON.stringify(n);
      }
      static ɵfac = (() => {
        let n;
        return function (o) {
          return (n || (n = fn(e)))(o || e);
        };
      })();
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  qa = (() => {
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
          o && this.hasTranslationFor(n) ? Ya(this.translations[n], r) : r),
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
        return af(this.getTranslations(n), r);
      }
      static ɵfac = function (r) {
        return new (r || e)();
      };
      static ɵprov = _({ token: e, factory: e.ɵfac });
    }
    return e;
  })(),
  Za = new C("TRANSLATE_CONFIG"),
  ar = (e) => (nt(e) ? e : Ue(e));
var Vt = (() => {
  class e {
    loadingTranslations;
    pending = !1;
    _translationRequests = {};
    lastUseLanguage = null;
    currentLoader = v(mt);
    compiler = v(vn);
    parser = v(Dn);
    missingTranslationHandler = v(ur);
    store = v(qa);
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
      let n = R({ extend: !1, fallbackLang: null }, v(Za, { optional: !0 }));
      n.lang && this.use(n.lang),
        n.fallbackLang && this.setFallbackLang(n.fallbackLang),
        n.extend && (this.extend = !0);
    }
    setFallbackLang(n) {
      this.getFallbackLang() || this.store.setFallbackLang(n, !1);
      let r = this.loadOrExtendLanguage(n);
      return nt(r)
        ? (r.pipe(Gt(1)).subscribe({
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
        ? (r.pipe(Gt(1)).subscribe({
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
      let r = this.currentLoader.getTranslation(n).pipe(Wr(1), Gt(1));
      return (
        (this.loadingTranslations = r.pipe(
          X((o) => this.compiler.compileTranslations(o, n)),
          Wr(1),
          Gt(1)
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
        return Lt(n)
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
      let s = n.map((a) => ar(o[a]));
      return xn(s).pipe(
        X((a) => {
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
            Sn(() => ar(this.getParsedResult(n, r)))
          )
        : ar(this.getParsedResult(n, r));
    }
    getStreamOnTranslationChange(n, r) {
      if (!gt(n) || !n.length)
        throw new Error('Parameter "key" is required and cannot be empty');
      return Gr(
        zr(() => this.get(n, r)),
        this.onTranslationChange.pipe(
          zt(() => {
            let o = this.getParsedResult(n, r);
            return ar(o);
          })
        )
      );
    }
    stream(n, r) {
      if (!gt(n) || !n.length) throw new Error('Parameter "key" required');
      return Gr(
        zr(() => this.get(n, r)),
        this.onLangChange.pipe(
          zt(() => {
            let o = this.getParsedResult(n, r);
            return ar(o);
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
        dD(
          this.store.getTranslations(o),
          n,
          Qo(r)
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
    static ɵprov = _({ token: e, factory: e.ɵfac });
  }
  return e;
})();
var yt = (() => {
  class e {
    translate = v(Vt);
    _ref = v(Jn);
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
      if (Yo(n, this.lastKey) && Yo(r, this.lastParams)) return this.value;
      let o;
      if (gt(r[0]) && r.length)
        if (Qo(r[0]) && r[0].length) {
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
    static ɵpipe = Js({ name: "translate", type: e, pure: !1, standalone: !0 });
    static ɵprov = _({ token: e, factory: e.ɵfac });
  }
  return e;
})();
function pD(e) {
  return { provide: mt, useClass: e };
}
function gD(e) {
  return { provide: vn, useClass: e };
}
function mD(e) {
  return { provide: Dn, useClass: e };
}
function yD(e) {
  return { provide: ur, useClass: e };
}
function sf(e = {}, t) {
  let n = [];
  e.loader && n.push(e.loader),
    e.compiler && n.push(e.compiler),
    e.parser && n.push(e.parser),
    e.missingTranslationHandler && n.push(e.missingTranslationHandler),
    t && n.push(qa),
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
    n.push({ provide: Za, useValue: r }),
    n.push({ provide: Vt, useClass: Vt, deps: [qa, mt, vn, Dn, ur, Za] }),
    n
  );
}
var Ve = (() => {
  class e {
    static forRoot(n = {}) {
      return {
        ngModule: e,
        providers: [
          ...sf(
            R(
              {
                compiler: gD(cD),
                parser: mD(hD),
                loader: pD(uD),
                missingTranslationHandler: yD(aD),
              },
              n
            ),
            !0
          ),
        ],
      };
    }
    static forChild(n = {}) {
      return { ngModule: e, providers: [...sf(n, n.isolate ?? !1)] };
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
function vD(e) {
  return new Xo(e, "/portfolioEve/assets/i18n/", ".json");
}
function DD(e) {
  return () => {
    let t = typeof window < "u" ? localStorage.getItem("lang") ?? "en" : "en";
    return e.setDefaultLang("en"), e.use(t).toPromise();
  };
}
var cf = {
  providers: [
    Nd({ eventCoalescing: !0 }),
    Zd(),
    Xs(
      Ve.forRoot({
        fallbackLang: "en",
        loader: { provide: mt, useFactory: vD, deps: [kt] },
      })
    ),
    { provide: Oa, useFactory: DD, deps: [Vt], multi: !0 },
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
  static ɵcmp = re({
    type: e,
    selectors: [["app-intro"]],
    outputs: { navigate: "navigate" },
    standalone: !0,
    features: [oe],
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
        j(3, " EVELIA GIL "),
        y(),
        m(4, "h2", 3),
        j(5, " FULL-STACK "),
        m(6, "span", 4),
        j(7, "DEVELOPER"),
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
var uf = (e, t = "https://api.emailjs.com") => {
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
var lf = (e, t, n, r) => {
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
var CD = (e) => {
    let t;
    if (
      (typeof e == "string" ? (t = document.querySelector(e)) : (t = e),
      !t || t.nodeName !== "FORM")
    )
      throw "The 3rd parameter is expected to be the HTML form element or the style selector of form";
    return t;
  },
  df = (e, t, n, r) => {
    let o = r || et._userID,
      i = CD(n);
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
var ff = { init: uf, send: lf, sendForm: df };
var Cf = (() => {
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
          return new (r || e)($(qn), $(Ot));
        };
      }
      static {
        this.ɵdir = Me({ type: e });
      }
    }
    return e;
  })(),
  wD = (() => {
    class e extends Cf {
      static {
        this.ɵfac = (() => {
          let n;
          return function (o) {
            return (n || (n = fn(e)))(o || e);
          };
        })();
      }
      static {
        this.ɵdir = Me({ type: e, features: [dt] });
      }
    }
    return e;
  })(),
  wf = new C("");
var ED = { provide: wf, useExisting: ln(() => fi), multi: !0 };
function _D() {
  let e = yn() ? yn().getUserAgent() : "";
  return /android (\d+)/.test(e.toLowerCase());
}
var bD = new C(""),
  fi = (() => {
    class e extends Cf {
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
          return new (r || e)($(qn), $(Ot), $(bD, 8));
        };
      }
      static {
        this.ɵdir = Me({
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
          features: [jo([ED]), dt],
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
function Ef(e) {
  return e != null && typeof e.length == "number";
}
var _f = new C(""),
  bf = new C(""),
  ID =
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  Dt = class {
    static min(t) {
      return MD(t);
    }
    static max(t) {
      return TD(t);
    }
    static required(t) {
      return xD(t);
    }
    static requiredTrue(t) {
      return SD(t);
    }
    static email(t) {
      return ND(t);
    }
    static minLength(t) {
      return AD(t);
    }
    static maxLength(t) {
      return OD(t);
    }
    static pattern(t) {
      return FD(t);
    }
    static nullValidator(t) {
      return If(t);
    }
    static compose(t) {
      return Af(t);
    }
    static composeAsync(t) {
      return Ff(t);
    }
  };
function MD(e) {
  return (t) => {
    if (vt(t.value) || vt(e)) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n < e ? { min: { min: e, actual: t.value } } : null;
  };
}
function TD(e) {
  return (t) => {
    if (vt(t.value) || vt(e)) return null;
    let n = parseFloat(t.value);
    return !isNaN(n) && n > e ? { max: { max: e, actual: t.value } } : null;
  };
}
function xD(e) {
  return vt(e.value) ? { required: !0 } : null;
}
function SD(e) {
  return e.value === !0 ? null : { required: !0 };
}
function ND(e) {
  return vt(e.value) || ID.test(e.value) ? null : { email: !0 };
}
function AD(e) {
  return (t) =>
    vt(t.value) || !Ef(t.value)
      ? null
      : t.value.length < e
      ? { minlength: { requiredLength: e, actualLength: t.value.length } }
      : null;
}
function OD(e) {
  return (t) =>
    Ef(t.value) && t.value.length > e
      ? { maxlength: { requiredLength: e, actualLength: t.value.length } }
      : null;
}
function FD(e) {
  if (!e) return If;
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
function If(e) {
  return null;
}
function Mf(e) {
  return e != null;
}
function Tf(e) {
  return Kn(e) ? $e(e) : e;
}
function xf(e) {
  let t = {};
  return (
    e.forEach((n) => {
      t = n != null ? R(R({}, t), n) : t;
    }),
    Object.keys(t).length === 0 ? null : t
  );
}
function Sf(e, t) {
  return t.map((n) => n(e));
}
function RD(e) {
  return !e.validate;
}
function Nf(e) {
  return e.map((t) => (RD(t) ? t : (n) => t.validate(n)));
}
function Af(e) {
  if (!e) return null;
  let t = e.filter(Mf);
  return t.length == 0
    ? null
    : function (n) {
        return xf(Sf(n, t));
      };
}
function Of(e) {
  return e != null ? Af(Nf(e)) : null;
}
function Ff(e) {
  if (!e) return null;
  let t = e.filter(Mf);
  return t.length == 0
    ? null
    : function (n) {
        let r = Sf(n, t).map(Tf);
        return xn(r).pipe(X(xf));
      };
}
function Rf(e) {
  return e != null ? Ff(Nf(e)) : null;
}
function hf(e, t) {
  return e === null ? [t] : Array.isArray(e) ? [...e, t] : [e, t];
}
function Pf(e) {
  return e._rawValidators;
}
function kf(e) {
  return e._rawAsyncValidators;
}
function Qa(e) {
  return e ? (Array.isArray(e) ? e : [e]) : [];
}
function oi(e, t) {
  return Array.isArray(e) ? e.includes(t) : e === t;
}
function pf(e, t) {
  let n = Qa(t);
  return (
    Qa(e).forEach((o) => {
      oi(n, o) || n.push(o);
    }),
    n
  );
}
function gf(e, t) {
  return Qa(t).filter((n) => !oi(e, n));
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
        (this._composedValidatorFn = Of(this._rawValidators));
    }
    _setAsyncValidators(t) {
      (this._rawAsyncValidators = t || []),
        (this._composedAsyncValidatorFn = Rf(this._rawAsyncValidators));
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
  En = class extends ii {
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
  PD = {
    "[class.ng-untouched]": "isUntouched",
    "[class.ng-touched]": "isTouched",
    "[class.ng-pristine]": "isPristine",
    "[class.ng-dirty]": "isDirty",
    "[class.ng-valid]": "isValid",
    "[class.ng-invalid]": "isInvalid",
    "[class.ng-pending]": "isPending",
  },
  J0 = U(R({}, PD), { "[class.ng-submitted]": "isSubmitted" }),
  Lf = (() => {
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
        this.ɵdir = Me({
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
  Vf = (() => {
    class e extends si {
      constructor(n) {
        super(n);
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)($(En, 10));
        };
      }
      static {
        this.ɵdir = Me({
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
  Cn = "PENDING",
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
  wn = class extends Ct {
    constructor(t, n) {
      super(), (this.status = t), (this.source = n);
    }
  },
  Ka = class extends Ct {
    constructor(t) {
      super(), (this.source = t);
    }
  },
  Ja = class extends Ct {
    constructor(t) {
      super(), (this.source = t);
    }
  };
function jf(e) {
  return (hi(e) ? e.validators : e) || null;
}
function kD(e) {
  return Array.isArray(e) ? Of(e) : e || null;
}
function Bf(e, t) {
  return (hi(t) ? t.asyncValidators : e) || null;
}
function LD(e) {
  return Array.isArray(e) ? Rf(e) : e || null;
}
function hi(e) {
  return e != null && !Array.isArray(e) && typeof e == "object";
}
function VD(e, t, n) {
  let r = e.controls;
  if (!(t ? Object.keys(r) : r).length) throw new I(1e3, "");
  if (!r[n]) throw new I(1001, "");
}
function jD(e, t, n) {
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
        (this._status = Xn(() => this.statusReactive())),
        (this.statusReactive = Ft(void 0)),
        (this._pristine = Xn(() => this.pristineReactive())),
        (this.pristineReactive = Ft(!0)),
        (this._touched = Xn(() => this.touchedReactive())),
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
      return this.status == Cn;
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
      this.setValidators(pf(t, this._rawValidators));
    }
    addAsyncValidators(t) {
      this.setAsyncValidators(pf(t, this._rawAsyncValidators));
    }
    removeValidators(t) {
      this.setValidators(gf(t, this._rawValidators));
    }
    removeAsyncValidators(t) {
      this.setAsyncValidators(gf(t, this._rawAsyncValidators));
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
        this._parent.markAsTouched(U(R({}, t), { sourceControl: r })),
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
        this._parent.markAsDirty(U(R({}, t), { sourceControl: r })),
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
      this.status = Cn;
      let n = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new wn(this.status, n)),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.markAsPending(U(R({}, t), { sourceControl: n }));
    }
    disable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = fr),
        (this.errors = null),
        this._forEachChild((o) => {
          o.disable(U(R({}, t), { onlySelf: !0 }));
        }),
        this._updateValue();
      let r = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new ai(this.value, r)),
        this._events.next(new wn(this.status, r)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._updateAncestors(U(R({}, t), { skipPristineCheck: n }), this),
        this._onDisabledChange.forEach((o) => o(!0));
    }
    enable(t = {}) {
      let n = this._parentMarkedDirty(t.onlySelf);
      (this.status = dr),
        this._forEachChild((r) => {
          r.enable(U(R({}, t), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: t.emitEvent }),
        this._updateAncestors(U(R({}, t), { skipPristineCheck: n }), this),
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
          (this.status === dr || this.status === Cn) &&
            this._runAsyncValidator(r, t.emitEvent);
      }
      let n = t.sourceControl ?? this;
      t.emitEvent !== !1 &&
        (this._events.next(new ai(this.value, n)),
        this._events.next(new wn(this.status, n)),
        this.valueChanges.emit(this.value),
        this.statusChanges.emit(this.status)),
        this._parent &&
          !t.onlySelf &&
          this._parent.updateValueAndValidity(
            U(R({}, t), { sourceControl: n })
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
        (this.status = Cn),
          (this._hasOwnPendingAsyncValidator = { emitEvent: n !== !1 });
        let r = Tf(this.asyncValidator(this));
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
        (t || r) && this._events.next(new wn(this.status, n)),
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
        : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(Cn)
        ? Cn
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
        (this._composedValidatorFn = kD(this._rawValidators));
    }
    _assignAsyncValidators(t) {
      (this._rawAsyncValidators = Array.isArray(t) ? t.slice() : t),
        (this._composedAsyncValidatorFn = LD(this._rawAsyncValidators));
    }
  },
  ui = class extends ci {
    constructor(t, n, r) {
      super(jf(n), Bf(r, n)),
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
      jD(this, !0, t),
        Object.keys(t).forEach((r) => {
          VD(this, !0, r),
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
var $f = new C("CallSetDisabledState", {
    providedIn: "root",
    factory: () => Xa,
  }),
  Xa = "always";
function BD(e, t) {
  return [...t.path, e];
}
function mf(e, t, n = Xa) {
  ec(e, t),
    t.valueAccessor.writeValue(e.value),
    (e.disabled || n === "always") &&
      t.valueAccessor.setDisabledState?.(e.disabled),
    UD(e, t),
    GD(e, t),
    HD(e, t),
    $D(e, t);
}
function yf(e, t, n = !0) {
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
function $D(e, t) {
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
function ec(e, t) {
  let n = Pf(e);
  t.validator !== null
    ? e.setValidators(hf(n, t.validator))
    : typeof n == "function" && e.setValidators([n]);
  let r = kf(e);
  t.asyncValidator !== null
    ? e.setAsyncValidators(hf(r, t.asyncValidator))
    : typeof r == "function" && e.setAsyncValidators([r]);
  let o = () => e.updateValueAndValidity();
  li(t._rawValidators, o), li(t._rawAsyncValidators, o);
}
function di(e, t) {
  let n = !1;
  if (e !== null) {
    if (t.validator !== null) {
      let o = Pf(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.validator);
        i.length !== o.length && ((n = !0), e.setValidators(i));
      }
    }
    if (t.asyncValidator !== null) {
      let o = kf(e);
      if (Array.isArray(o) && o.length > 0) {
        let i = o.filter((s) => s !== t.asyncValidator);
        i.length !== o.length && ((n = !0), e.setAsyncValidators(i));
      }
    }
  }
  let r = () => {};
  return li(t._rawValidators, r), li(t._rawAsyncValidators, r), n;
}
function UD(e, t) {
  t.valueAccessor.registerOnChange((n) => {
    (e._pendingValue = n),
      (e._pendingChange = !0),
      (e._pendingDirty = !0),
      e.updateOn === "change" && Uf(e, t);
  });
}
function HD(e, t) {
  t.valueAccessor.registerOnTouched(() => {
    (e._pendingTouched = !0),
      e.updateOn === "blur" && e._pendingChange && Uf(e, t),
      e.updateOn !== "submit" && e.markAsTouched();
  });
}
function Uf(e, t) {
  e._pendingDirty && e.markAsDirty(),
    e.setValue(e._pendingValue, { emitModelToViewChange: !1 }),
    t.viewToModelUpdate(e._pendingValue),
    (e._pendingChange = !1);
}
function GD(e, t) {
  let n = (r, o) => {
    t.valueAccessor.writeValue(r), o && t.viewToModelUpdate(r);
  };
  e.registerOnChange(n),
    t._registerOnDestroy(() => {
      e._unregisterOnChange(n);
    });
}
function zD(e, t) {
  e == null, ec(e, t);
}
function WD(e, t) {
  return di(e, t);
}
function qD(e, t) {
  if (!e.hasOwnProperty("model")) return !1;
  let n = e.model;
  return n.isFirstChange() ? !0 : !Object.is(t, n.currentValue);
}
function ZD(e) {
  return Object.getPrototypeOf(e.constructor) === wD;
}
function YD(e, t) {
  e._syncPendingControls(),
    t.forEach((n) => {
      let r = n.control;
      r.updateOn === "submit" &&
        r._pendingChange &&
        (n.viewToModelUpdate(r._pendingValue), (r._pendingChange = !1));
    });
}
function QD(e, t) {
  if (!t) return null;
  Array.isArray(t);
  let n, r, o;
  return (
    t.forEach((i) => {
      i.constructor === fi ? (n = i) : ZD(i) ? (r = i) : (o = i);
    }),
    o || r || n || null
  );
}
function KD(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function vf(e, t) {
  let n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}
function Df(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    Object.keys(e).length === 2 &&
    "value" in e &&
    "disabled" in e
  );
}
var _n = class extends ci {
  constructor(t = null, n, r) {
    super(jf(n), Bf(r, n)),
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
        (Df(t) ? (this.defaultValue = t.value) : (this.defaultValue = t));
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
    vf(this._onChange, t);
  }
  registerOnDisabledChange(t) {
    this._onDisabledChange.push(t);
  }
  _unregisterOnDisabledChange(t) {
    vf(this._onDisabledChange, t);
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
    Df(t)
      ? ((this.value = this._pendingValue = t.value),
        t.disabled
          ? this.disable({ onlySelf: !0, emitEvent: !1 })
          : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = t);
  }
};
var JD = (e) => e instanceof _n;
var Hf = (() => {
  class e {
    static {
      this.ɵfac = function (r) {
        return new (r || e)();
      };
    }
    static {
      this.ɵdir = Me({
        type: e,
        selectors: [["form", 3, "ngNoForm", "", 3, "ngNativeValidate", ""]],
        hostAttrs: ["novalidate", ""],
      });
    }
  }
  return e;
})();
var Gf = new C("");
var XD = { provide: En, useExisting: ln(() => tc) },
  tc = (() => {
    class e extends En {
      get submitted() {
        return Ke(this._submittedReactive);
      }
      set submitted(n) {
        this._submittedReactive.set(n);
      }
      constructor(n, r, o) {
        super(),
          (this.callSetDisabledState = o),
          (this._submitted = Xn(() => this._submittedReactive())),
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
          mf(r, n, this.callSetDisabledState),
          r.updateValueAndValidity({ emitEvent: !1 }),
          this.directives.push(n),
          r
        );
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        yf(n.control || null, n, !1), KD(this.directives, n);
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
          YD(this.form, this.directives),
          this.ngSubmit.emit(n),
          this.form._events.next(new Ka(this.control)),
          n?.target?.method === "dialog"
        );
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n),
          this._submittedReactive.set(!1),
          this.form._events.next(new Ja(this.form));
      }
      _updateDomValue() {
        this.directives.forEach((n) => {
          let r = n.control,
            o = this.form.get(n.path);
          r !== o &&
            (yf(r || null, n),
            JD(o) && (mf(o, n, this.callSetDisabledState), (n.control = o)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(n) {
        let r = this.form.get(n.path);
        zD(r, n), r.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let r = this.form.get(n.path);
          r && WD(r, n) && r.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        ec(this.form, this), this._oldForm && di(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
      static {
        this.ɵfac = function (r) {
          return new (r || e)($(_f, 10), $(bf, 10), $($f, 8));
        };
      }
      static {
        this.ɵdir = Me({
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
          features: [jo([XD]), dt, Gn],
        });
      }
    }
    return e;
  })();
var eC = { provide: gr, useExisting: ln(() => nc) },
  nc = (() => {
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
          (this.valueAccessor = QD(this, i));
      }
      ngOnChanges(n) {
        this._added || this._setUpControl(),
          qD(n, this.viewModel) &&
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
        return BD(
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
            $(En, 13),
            $(_f, 10),
            $(bf, 10),
            $(wf, 10),
            $(Gf, 8)
          );
        };
      }
      static {
        this.ɵdir = Me({
          type: e,
          selectors: [["", "formControlName", ""]],
          inputs: {
            name: [0, "formControlName", "name"],
            isDisabled: [0, "disabled", "isDisabled"],
            model: [0, "ngModel", "model"],
          },
          outputs: { update: "ngModelChange" },
          features: [jo([eC]), dt, Gn],
        });
      }
    }
    return e;
  })();
var tC = (() => {
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
          { provide: Gf, useValue: n.warnOnNgModelWithFormControl ?? "always" },
          { provide: $f, useValue: n.callSetDisabledState ?? Xa },
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
      this.ɵinj = qe({ imports: [tC] });
    }
  }
  return e;
})();
var gi = class e {
  contactForm = new ui({
    username: new _n("", [Dt.required]),
    email: new _n("", [Dt.required, Dt.email]),
    subject: new _n("", [Dt.required]),
    message: new _n("", [Dt.required]),
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
        ff
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
  static ɵcmp = re({
    type: e,
    selectors: [["app-formular"]],
    outputs: { navigate: "navigate" },
    standalone: !0,
    features: [oe],
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
        j(5),
        G(6, "translate"),
        y(),
        m(7, "div", 5),
        K(8, "input", 6),
        G(9, "translate"),
        y()(),
        m(10, "div", 7)(11, "label", 8),
        j(12),
        G(13, "translate"),
        y(),
        m(14, "div", 5),
        K(15, "input", 9),
        G(16, "translate"),
        y()(),
        m(17, "div", 3)(18, "label", 10),
        j(19),
        G(20, "translate"),
        y(),
        m(21, "div", 5),
        K(22, "input", 11),
        G(23, "translate"),
        y()(),
        m(24, "div", 3)(25, "label", 12),
        j(26),
        G(27, "translate"),
        y(),
        K(28, "textarea", 13),
        G(29, "translate"),
        y(),
        m(30, "div", 14)(31, "button", 15),
        j(32),
        G(33, "translate"),
        y()()(),
        m(34, "div", 16)(35, "img", 17),
        O("click", function (i) {
          return r.goNextSection("projects", i);
        }),
        y()()()()),
        n & 2 &&
          (N(2),
          xe("formGroup", r.contactForm),
          N(3),
          Se(z(6, 12, "username")),
          N(3),
          Qn("placeholder", z(9, 14, "username")),
          N(4),
          Se(z(13, 16, "email")),
          N(3),
          Qn("placeholder", z(16, 18, "email")),
          N(4),
          Se(z(20, 20, "subject")),
          N(3),
          Qn("placeholder", z(23, 22, "subject")),
          N(4),
          Se(z(27, 24, "message")),
          N(2),
          Vo("placeholder", "", z(29, 26, "message"), "..."),
          N(3),
          xe("disabled", r.contactForm.invalid),
          N(),
          we(" ", z(33, 28, "send Message"), " "));
    },
    dependencies: [pi, Hf, fi, Lf, Vf, tc, nc, Ra, Ve, yt],
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
    return new (n || e)(T(kt));
  };
  static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var zf = (e, t) => t.name;
function rC(e, t) {
  if ((e & 1 && (m(0, "li"), K(1, "img", 2), y()), e & 2)) {
    let n = t.$implicit;
    N(), xe("src", n == null ? null : n.link, Wn);
  }
}
function oC(e, t) {
  if ((e & 1 && (m(0, "li"), K(1, "img", 2), y()), e & 2)) {
    let n = t.$implicit;
    N(), xe("src", n == null ? null : n.link, Wn);
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
  static ɵcmp = re({
    type: e,
    selectors: [["app-carrousel"]],
    standalone: !0,
    features: [oe],
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
        Zn(2, rC, 2, 1, "li", null, zf),
        y(),
        m(4, "ul", 1),
        Zn(5, oC, 2, 1, "li", null, zf),
        y()()),
        n & 2 && (N(2), Yn(r.technologies), N(3), Yn(r.technologies));
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
  static ɵcmp = re({
    type: e,
    selectors: [["app-about"]],
    outputs: { navigate: "navigate" },
    standalone: !0,
    features: [oe],
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
        j(2),
        G(3, "translate"),
        y(),
        m(4, "p", 2),
        j(5),
        G(6, "translate"),
        y(),
        m(7, "h1", 3),
        j(8),
        G(9, "translate"),
        y(),
        K(10, "app-carrousel", 4),
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
          we(" ", z(3, 3, "about"), " "),
          N(3),
          we(" ", z(6, 5, "text"), " "),
          N(3),
          we(" ", z(9, 7, "technologies"), " "));
    },
    dependencies: [yi, Ve, yt],
  });
};
function iC(e, t) {
  if (e & 1) {
    let n = ke();
    m(0, "div", 2)(1, "nav", 3)(2, "a", 4),
      O("click", function (o) {
        ae(n);
        let i = ue();
        return ce(i.goToSection("home", o));
      }),
      j(3),
      G(4, "translate"),
      y(),
      m(5, "a", 5),
      O("click", function (o) {
        ae(n);
        let i = ue();
        return ce(i.goToSection("about", o));
      }),
      j(6),
      G(7, "translate"),
      y(),
      m(8, "a", 6),
      O("click", function (o) {
        ae(n);
        let i = ue();
        return ce(i.goToSection("projects", o));
      }),
      j(9),
      G(10, "translate"),
      y(),
      m(11, "a", 7),
      O("click", function (o) {
        ae(n);
        let i = ue();
        return ce(i.goToSection("contact", o));
      }),
      j(12),
      G(13, "translate"),
      y(),
      m(14, "div", 8)(15, "a", 9),
      O("click", function () {
        ae(n);
        let o = ue();
        return ce(o.setLanguage("en"));
      }),
      j(16, "EN"),
      y(),
      m(17, "a", 9),
      O("click", function () {
        ae(n);
        let o = ue();
        return ce(o.setLanguage("es"));
      }),
      j(18, "ES"),
      y()(),
      m(19, "div", 10)(20, "a", 11),
      K(21, "img", 12),
      y(),
      m(22, "a", 13),
      K(23, "img", 14),
      y()()()();
  }
  e & 2 &&
    (N(3),
    Se(z(4, 4, "home")),
    N(3),
    Se(z(7, 6, "about")),
    N(3),
    Se(z(10, 8, "projects")),
    N(3),
    Se(z(13, 10, "contact")));
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
    return new (n || e)($(Vt));
  };
  static ɵcmp = re({
    type: e,
    selectors: [["app-menu"]],
    outputs: { navigate: "navigate" },
    standalone: !0,
    features: [oe],
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
      ["src", "assets/img/github.webp", 1, "size-6"],
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
        Rt(2, iC, 24, 12, "div", 2)),
        n & 2 && (N(2), Pt(r.visibleMenu ? 2 : -1));
    },
    dependencies: [Ve, yt],
  });
};
function sC(e, t) {
  if (e & 1) {
    let n = ke();
    m(0, "img", 7),
      O("click", function () {
        ae(n);
        let o = ue();
        return ce(o.goToProject(o.linkLive));
      }),
      y();
  }
}
function aC(e, t) {
  if (e & 1) {
    let n = ke();
    m(0, "img", 8),
      O("click", function () {
        ae(n);
        let o = ue();
        return ce(o.goToProject(o.linkCode));
      }),
      y();
  }
}
var Ci = class e {
  title;
  image;
  linkCode;
  linkLive;
  goToProject(t) {
    window.location.href = t;
  }
  static ɵfac = function (n) {
    return new (n || e)();
  };
  static ɵcmp = re({
    type: e,
    selectors: [["app-card"]],
    inputs: {
      title: "title",
      image: "image",
      linkCode: "linkCode",
      linkLive: "linkLive",
    },
    standalone: !0,
    features: [oe],
    decls: 8,
    vars: 4,
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
      [1, "absolute", "inset-0", "bg-black", "opacity-70"],
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
      [1, "z-20", "flex", "flex-row", "gap-1"],
      ["src", "assets/img/play.webp", 1, "size-10", "cursor-pointer"],
      [
        "src",
        "assets/img/github.webp",
        1,
        "size-10",
        "cursor-pointer",
        "invert",
      ],
      [
        "src",
        "assets/img/play.webp",
        1,
        "size-10",
        "cursor-pointer",
        3,
        "click",
      ],
      [
        "src",
        "assets/img/github.webp",
        1,
        "size-10",
        "cursor-pointer",
        "invert",
        3,
        "click",
      ],
    ],
    template: function (n, r) {
      n & 1 &&
        (m(0, "div", 0),
        K(1, "img", 1)(2, "div", 2),
        m(3, "h3", 3),
        j(4),
        y(),
        m(5, "div", 4),
        Rt(6, sC, 1, 0, "img", 5)(7, aC, 1, 0, "img", 6),
        y()()),
        n & 2 &&
          (N(),
          xe("src", r.image, Wn),
          N(3),
          we(" ", r.title, " "),
          N(2),
          Pt(r.linkLive && r.linkLive.trim() !== "" ? 6 : -1),
          N(),
          Pt(r.linkCode && r.linkCode.trim() !== "" ? 7 : -1));
    },
  });
};
var wi = class e {
  constructor(t) {
    this.http = t;
  }
  dataUrl = "assets/data/cards/card.json";
  getCards() {
    return this.http.get(this.dataUrl);
  }
  static ɵfac = function (n) {
    return new (n || e)(T(kt));
  };
  static ɵprov = _({ token: e, factory: e.ɵfac, providedIn: "root" });
};
var cC = (e, t) => t.title;
function uC(e, t) {
  if ((e & 1 && K(0, "app-card", 3), e & 2)) {
    let n = t.$implicit;
    xe("title", n.title)("image", n.image)("linkCode", n.linkCode)(
      "linkLive",
      n.linkLive
    );
  }
}
var Ei = class e {
  cards = [];
  cardsService = v(wi);
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
  static ɵcmp = re({
    type: e,
    selectors: [["app-projects"]],
    outputs: { navigate: "navigate" },
    standalone: !0,
    features: [oe],
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
      [3, "title", "image", "linkCode", "linkLive"],
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
        j(2),
        G(3, "translate"),
        y(),
        m(4, "div", 2),
        Zn(5, uC, 1, 4, "app-card", 3, cC),
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
        n & 2 && (N(2), we(" ", z(3, 1, "projects"), " "), N(3), Yn(r.cards));
    },
    dependencies: [Ci, Ve, yt],
    styles: [
      ".container[_ngcontent-%COMP%]{-ms-overflow-style:none;scrollbar-width:none}.container[_ngcontent-%COMP%]::-webkit-scrollbar{display:none}",
    ],
  });
};
function lC(e, t) {
  if (e & 1) {
    let n = ke();
    m(0, "section", 2)(1, "app-intro", 1),
      O("navigate", function (o) {
        ae(n);
        let i = ue();
        return ce(i.showSection(o));
      }),
      y()();
  }
}
function dC(e, t) {
  if (e & 1) {
    let n = ke();
    m(0, "section", 3)(1, "app-about", 1),
      O("navigate", function (o) {
        ae(n);
        let i = ue();
        return ce(i.showSection(o));
      }),
      y()();
  }
}
function fC(e, t) {
  if (e & 1) {
    let n = ke();
    m(0, "section", 4)(1, "app-projects", 1),
      O("navigate", function (o) {
        ae(n);
        let i = ue();
        return ce(i.showSection(o));
      }),
      y()();
  }
}
function hC(e, t) {
  if (e & 1) {
    let n = ke();
    m(0, "section", 5)(1, "app-formular", 1),
      O("navigate", function (o) {
        ae(n);
        let i = ue();
        return ce(i.showSection(o));
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
  static ɵcmp = re({
    type: e,
    selectors: [["app-root"]],
    standalone: !0,
    features: [oe],
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
        Rt(2, lC, 2, 0, "section", 2)(3, dC, 2, 0, "section", 3)(
          4,
          fC,
          2,
          0,
          "section",
          4
        )(5, hC, 2, 0, "section", 5),
        y()),
        n & 2 &&
          (N(2),
          Pt(
            r.current() === "home"
              ? 2
              : r.current() === "about"
              ? 3
              : r.current() === "projects"
              ? 4
              : 5
          ));
    },
    dependencies: [gi, ei, vi, Di, pi, Ei],
    styles: [".hidden[_ngcontent-%COMP%]{display:none}"],
  });
};
rf(_i, cf).catch((e) => console.error(e));
