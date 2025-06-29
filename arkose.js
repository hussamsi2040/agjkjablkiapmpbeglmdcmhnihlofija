/* eslint-disable */
'use strict'
;(() => {
  var ee = Object.create
  var I = Object.defineProperty
  var re = Object.getOwnPropertyDescriptor
  var se = Object.getOwnPropertyNames
  var ge = Object.getPrototypeOf,
    ne = Object.prototype.hasOwnProperty
  var te = (A, m) => () => (
    m ||
      A(
        (m = {
          exports: {},
        }).exports,
        m,
      ),
    m.exports
  )
  var ae = (A, m, h, k) => {
    if ((m && typeof m == 'object') || typeof m == 'function')
      for (let w of se(m))
        !ne.call(A, w) &&
          w !== h &&
          I(A, w, {
            get: () => m[w],
            enumerable: !(k = re(m, w)) || k.enumerable,
          })
    return A
  }
  var D = (A, m, h) => (
    (h = A != null ? ee(ge(A)) : {}),
    ae(
      m || !A || !A.__esModule
        ? I(h, 'default', {
            value: A,
            enumerable: !0,
          })
        : h,
      A,
    )
  )
  var N = te(() => {
    'use strict'
    globalThis &&
      (globalThis.__c4g_envvars__ = {
        dev: !1,
        prod: !0,
        host: 'https://webapp.chatgpt4google.com',
        browser: 'chrome',
      })
  })
  var Ae = D(N(), 1)
  ;(() => {
    var A = Object.create,
      m = Object.defineProperty,
      h = Object.getOwnPropertyDescriptor,
      k = Object.getOwnPropertyNames,
      w = Object.getPrototypeOf,
      U = Object.prototype.hasOwnProperty,
      q = (n, a) => () => (
        a ||
          n(
            (a = {
              exports: {},
            }).exports,
            a,
          ),
        a.exports
      ),
      W = (n, a, i, f) => {
        if ((a && typeof a == 'object') || typeof a == 'function')
          for (let x of k(a))
            !U.call(n, x) &&
              x !== i &&
              m(n, x, {
                get: () => a[x],
                enumerable: !(f = h(a, x)) || f.enumerable,
              })
        return n
      },
      F = (n, a, i) => (
        (i = n != null ? A(w(n)) : {}),
        W(
          a || !n || !n.__esModule
            ? m(i, 'default', {
                value: n,
                enumerable: !0,
              })
            : i,
          n,
        )
      ),
      $ = q((n, a) => {
        ;(function (i, f) {
          if (typeof define == 'function' && define.amd)
            define('webextension-polyfill', ['module'], f)
          else if (typeof n < 'u') f(a)
          else {
            var x = {
              exports: {},
            }
            f(x), (i.browser = x.exports)
          }
        })(typeof globalThis < 'u' ? globalThis : typeof self < 'u' ? self : n, function (i) {
          'use strict'
          if (!globalThis.chrome?.runtime?.id)
            throw new Error('This script should only be loaded in a browser extension.')
          if (
            typeof globalThis.browser > 'u' ||
            Object.getPrototypeOf(globalThis.browser) !== Object.prototype
          ) {
            let f = 'The message port closed before a response was received.',
              x = (v) => {
                let T = {
                  alarms: {
                    clear: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    clearAll: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    get: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    getAll: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                  },
                  bookmarks: {
                    create: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    get: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getChildren: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getRecent: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getSubTree: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getTree: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    move: {
                      minArgs: 2,
                      maxArgs: 2,
                    },
                    remove: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    removeTree: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    search: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    update: {
                      minArgs: 2,
                      maxArgs: 2,
                    },
                  },
                  browserAction: {
                    disable: {
                      minArgs: 0,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                    enable: {
                      minArgs: 0,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                    getBadgeBackgroundColor: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getBadgeText: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getPopup: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getTitle: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    openPopup: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    setBadgeBackgroundColor: {
                      minArgs: 1,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                    setBadgeText: {
                      minArgs: 1,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                    setIcon: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    setPopup: {
                      minArgs: 1,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                    setTitle: {
                      minArgs: 1,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                  },
                  browsingData: {
                    remove: {
                      minArgs: 2,
                      maxArgs: 2,
                    },
                    removeCache: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    removeCookies: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    removeDownloads: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    removeFormData: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    removeHistory: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    removeLocalStorage: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    removePasswords: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    removePluginData: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    settings: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                  },
                  commands: {
                    getAll: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                  },
                  contextMenus: {
                    remove: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    removeAll: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    update: {
                      minArgs: 2,
                      maxArgs: 2,
                    },
                  },
                  cookies: {
                    get: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getAll: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getAllCookieStores: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    remove: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    set: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                  },
                  devtools: {
                    inspectedWindow: {
                      eval: {
                        minArgs: 1,
                        maxArgs: 2,
                        singleCallbackArg: !1,
                      },
                    },
                    panels: {
                      create: {
                        minArgs: 3,
                        maxArgs: 3,
                        singleCallbackArg: !0,
                      },
                      elements: {
                        createSidebarPane: {
                          minArgs: 1,
                          maxArgs: 1,
                        },
                      },
                    },
                  },
                  downloads: {
                    cancel: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    download: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    erase: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getFileIcon: {
                      minArgs: 1,
                      maxArgs: 2,
                    },
                    open: {
                      minArgs: 1,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                    pause: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    removeFile: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    resume: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    search: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    show: {
                      minArgs: 1,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                  },
                  extension: {
                    isAllowedFileSchemeAccess: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    isAllowedIncognitoAccess: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                  },
                  history: {
                    addUrl: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    deleteAll: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    deleteRange: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    deleteUrl: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getVisits: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    search: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                  },
                  i18n: {
                    detectLanguage: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getAcceptLanguages: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                  },
                  identity: {
                    launchWebAuthFlow: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                  },
                  idle: {
                    queryState: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                  },
                  management: {
                    get: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getAll: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    getSelf: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    setEnabled: {
                      minArgs: 2,
                      maxArgs: 2,
                    },
                    uninstallSelf: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                  },
                  notifications: {
                    clear: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    create: {
                      minArgs: 1,
                      maxArgs: 2,
                    },
                    getAll: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    getPermissionLevel: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    update: {
                      minArgs: 2,
                      maxArgs: 2,
                    },
                  },
                  pageAction: {
                    getPopup: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getTitle: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    hide: {
                      minArgs: 1,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                    setIcon: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    setPopup: {
                      minArgs: 1,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                    setTitle: {
                      minArgs: 1,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                    show: {
                      minArgs: 1,
                      maxArgs: 1,
                      fallbackToNoCallback: !0,
                    },
                  },
                  permissions: {
                    contains: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getAll: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    remove: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    request: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                  },
                  runtime: {
                    getBackgroundPage: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    getPlatformInfo: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    openOptionsPage: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    requestUpdateCheck: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    sendMessage: {
                      minArgs: 1,
                      maxArgs: 3,
                    },
                    sendNativeMessage: {
                      minArgs: 2,
                      maxArgs: 2,
                    },
                    setUninstallURL: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                  },
                  sessions: {
                    getDevices: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    getRecentlyClosed: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    restore: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                  },
                  storage: {
                    local: {
                      clear: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      get: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      getBytesInUse: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      remove: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      set: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                    },
                    managed: {
                      get: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      getBytesInUse: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                    },
                    sync: {
                      clear: {
                        minArgs: 0,
                        maxArgs: 0,
                      },
                      get: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      getBytesInUse: {
                        minArgs: 0,
                        maxArgs: 1,
                      },
                      remove: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                      set: {
                        minArgs: 1,
                        maxArgs: 1,
                      },
                    },
                  },
                  tabs: {
                    captureVisibleTab: {
                      minArgs: 0,
                      maxArgs: 2,
                    },
                    create: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    detectLanguage: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    discard: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    duplicate: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    executeScript: {
                      minArgs: 1,
                      maxArgs: 2,
                    },
                    get: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getCurrent: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                    getZoom: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    getZoomSettings: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    goBack: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    goForward: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    highlight: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    insertCSS: {
                      minArgs: 1,
                      maxArgs: 2,
                    },
                    move: {
                      minArgs: 2,
                      maxArgs: 2,
                    },
                    query: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    reload: {
                      minArgs: 0,
                      maxArgs: 2,
                    },
                    remove: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    removeCSS: {
                      minArgs: 1,
                      maxArgs: 2,
                    },
                    sendMessage: {
                      minArgs: 2,
                      maxArgs: 3,
                    },
                    setZoom: {
                      minArgs: 1,
                      maxArgs: 2,
                    },
                    setZoomSettings: {
                      minArgs: 1,
                      maxArgs: 2,
                    },
                    update: {
                      minArgs: 1,
                      maxArgs: 2,
                    },
                  },
                  topSites: {
                    get: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                  },
                  webNavigation: {
                    getAllFrames: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    getFrame: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                  },
                  webRequest: {
                    handlerBehaviorChanged: {
                      minArgs: 0,
                      maxArgs: 0,
                    },
                  },
                  windows: {
                    create: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    get: {
                      minArgs: 1,
                      maxArgs: 2,
                    },
                    getAll: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    getCurrent: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    getLastFocused: {
                      minArgs: 0,
                      maxArgs: 1,
                    },
                    remove: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    update: {
                      minArgs: 2,
                      maxArgs: 2,
                    },
                  },
                }
                if (Object.keys(T).length === 0)
                  throw new Error('api-metadata.json has not been included in browser-polyfill')
                class _ extends WeakMap {
                  constructor(r, g = void 0) {
                    super(g), (this.createItem = r)
                  }
                  get(r) {
                    return this.has(r) || this.set(r, this.createItem(r)), super.get(r)
                  }
                }
                let J = (e) => e && typeof e == 'object' && typeof e.then == 'function',
                  B =
                    (e, r) =>
                    (...g) => {
                      v.runtime.lastError
                        ? e.reject(new Error(v.runtime.lastError.message))
                        : r.singleCallbackArg || (g.length <= 1 && r.singleCallbackArg !== !1)
                        ? e.resolve(g[0])
                        : e.resolve(g)
                    },
                  y = (e) => (e == 1 ? 'argument' : 'arguments'),
                  K = (e, r) =>
                    function (g, ...t) {
                      if (t.length < r.minArgs)
                        throw new Error(
                          `Expected at least ${r.minArgs} ${y(r.minArgs)} for ${e}(), got ${
                            t.length
                          }`,
                        )
                      if (t.length > r.maxArgs)
                        throw new Error(
                          `Expected at most ${r.maxArgs} ${y(r.maxArgs)} for ${e}(), got ${
                            t.length
                          }`,
                        )
                      return new Promise((l, c) => {
                        if (r.fallbackToNoCallback)
                          try {
                            g[e](
                              ...t,
                              B(
                                {
                                  resolve: l,
                                  reject: c,
                                },
                                r,
                              ),
                            )
                          } catch {
                            g[e](...t), (r.fallbackToNoCallback = !1), (r.noCallback = !0), l()
                          }
                        else
                          r.noCallback
                            ? (g[e](...t), l())
                            : g[e](
                                ...t,
                                B(
                                  {
                                    resolve: l,
                                    reject: c,
                                  },
                                  r,
                                ),
                              )
                      })
                    },
                  L = (e, r, g) =>
                    new Proxy(r, {
                      apply(t, l, c) {
                        return g.call(l, e, ...c)
                      },
                    }),
                  P = Function.call.bind(Object.prototype.hasOwnProperty),
                  C = (e, r = {}, g = {}) => {
                    let t = Object.create(null),
                      l = {
                        has(p, s) {
                          return s in e || s in t
                        },
                        get(p, s, b) {
                          if (s in t) return t[s]
                          if (!(s in e)) return
                          let o = e[s]
                          if (typeof o == 'function')
                            if (typeof r[s] == 'function') o = L(e, e[s], r[s])
                            else if (P(g, s)) {
                              let u = K(s, g[s])
                              o = L(e, e[s], u)
                            } else o = o.bind(e)
                          else if (typeof o == 'object' && o !== null && (P(r, s) || P(g, s)))
                            o = C(o, r[s], g[s])
                          else if (P(g, '*')) o = C(o, r[s], g['*'])
                          else
                            return (
                              Object.defineProperty(t, s, {
                                configurable: !0,
                                enumerable: !0,
                                get() {
                                  return e[s]
                                },
                                set(u) {
                                  e[s] = u
                                },
                              }),
                              o
                            )
                          return (t[s] = o), o
                        },
                        set(p, s, b, o) {
                          return s in t ? (t[s] = b) : (e[s] = b), !0
                        },
                        defineProperty(p, s, b) {
                          return Reflect.defineProperty(t, s, b)
                        },
                        deleteProperty(p, s) {
                          return Reflect.deleteProperty(t, s)
                        },
                      },
                      c = Object.create(e)
                    return new Proxy(c, l)
                  },
                  j = (e) => ({
                    addListener(r, g, ...t) {
                      r.addListener(e.get(g), ...t)
                    },
                    hasListener(r, g) {
                      return r.hasListener(e.get(g))
                    },
                    removeListener(r, g) {
                      r.removeListener(e.get(g))
                    },
                  }),
                  Q = new _((e) =>
                    typeof e != 'function'
                      ? e
                      : function (r) {
                          let g = C(
                            r,
                            {},
                            {
                              getContent: {
                                minArgs: 0,
                                maxArgs: 0,
                              },
                            },
                          )
                          e(g)
                        },
                  ),
                  M = new _((e) =>
                    typeof e != 'function'
                      ? e
                      : function (r, g, t) {
                          let l = !1,
                            c,
                            p = new Promise((u) => {
                              c = function (d) {
                                ;(l = !0), u(d)
                              }
                            }),
                            s
                          try {
                            s = e(r, g, c)
                          } catch (u) {
                            s = Promise.reject(u)
                          }
                          let b = s !== !0 && J(s)
                          return s !== !0 && !b && !l
                            ? !1
                            : (((u) => {
                                u.then(
                                  (d) => {
                                    t(d)
                                  },
                                  (d) => {
                                    let O
                                    d && (d instanceof Error || typeof d.message == 'string')
                                      ? (O = d.message)
                                      : (O = 'An unexpected error occurred'),
                                      t({
                                        __mozWebExtensionPolyfillReject__: !0,
                                        message: O,
                                      })
                                  },
                                ).catch((d) => {})
                              })(b ? s : p),
                              !0)
                        },
                  ),
                  X = ({ reject: e, resolve: r }, g) => {
                    v.runtime.lastError
                      ? v.runtime.lastError.message === f
                        ? r()
                        : e(new Error(v.runtime.lastError.message))
                      : g && g.__mozWebExtensionPolyfillReject__
                      ? e(new Error(g.message))
                      : r(g)
                  },
                  R = (e, r, g, ...t) => {
                    if (t.length < r.minArgs)
                      throw new Error(
                        `Expected at least ${r.minArgs} ${y(r.minArgs)} for ${e}(), got ${
                          t.length
                        }`,
                      )
                    if (t.length > r.maxArgs)
                      throw new Error(
                        `Expected at most ${r.maxArgs} ${y(r.maxArgs)} for ${e}(), got ${t.length}`,
                      )
                    return new Promise((l, c) => {
                      let p = X.bind(null, {
                        resolve: l,
                        reject: c,
                      })
                      t.push(p), g.sendMessage(...t)
                    })
                  },
                  Y = {
                    devtools: {
                      network: {
                        onRequestFinished: j(Q),
                      },
                    },
                    runtime: {
                      onMessage: j(M),
                      onMessageExternal: j(M),
                      sendMessage: R.bind(null, 'sendMessage', {
                        minArgs: 1,
                        maxArgs: 3,
                      }),
                    },
                    tabs: {
                      sendMessage: R.bind(null, 'sendMessage', {
                        minArgs: 2,
                        maxArgs: 3,
                      }),
                    },
                  },
                  S = {
                    clear: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    get: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                    set: {
                      minArgs: 1,
                      maxArgs: 1,
                    },
                  }
                return (
                  (T.privacy = {
                    network: {
                      '*': S,
                    },
                    services: {
                      '*': S,
                    },
                    websites: {
                      '*': S,
                    },
                  }),
                  C(v, Y, T)
                )
              }
            i.exports = x(chrome)
          } else i.exports = globalThis.browser
        })
      }),
      Z = F($()),
      z = F($()),
      E = null,
      V = class {
        constructor() {
          ;(this.enforcement = void 0),
            (this.pendingPromises = []),
            (window.useArkoseSetupEnforcement = this.useArkoseSetupEnforcement.bind(this)),
            (this.enforcementPromise = new Promise((n) => {
              E = n
            })),
            this.injectScript()
        }
        useArkoseSetupEnforcement(n) {
          ;(this.enforcement = n),
            n.setConfig({
              onCompleted: (a) => {
                this.pendingPromises.forEach((i) => {
                  i.resolve(a.token)
                }),
                  (this.pendingPromises = [])
              },
              onReady: () => {
                E?.(), (E = null)
              },
              onError: (a) => {},
              onFailed: (a) => {
                this.pendingPromises.forEach((i) => {
                  i.reject(new Error('Failed to generate arkose token'))
                })
              },
            })
        }
        injectScript() {
          let n = document.createElement('script')
          ;(n.src = z.default.runtime.getURL(
            '/static/js/v2/35536E1E-65B4-4D96-9D97-6ADB7EFF8147/api.js',
          )),
            (n.async = !0),
            (n.defer = !0),
            n.setAttribute('data-callback', 'useArkoseSetupEnforcement'),
            document.body.appendChild(n)
        }
        async generate() {
          let n = !1,
            a = setTimeout(() => {
              n = !0
            }, 1e4)
          try {
            await this.enforcementPromise
          } catch {
            throw new Error('Failed to generate arkose token')
          }
          if ((clearTimeout(a), n)) throw new Error('Generate arkose token timeout')
          return new Promise((i) => {
            ;(this.pendingPromises = [
              {
                resolve: i,
              },
            ]),
              this.enforcement.run()
          })
        }
      },
      G = new V()
    async function H() {
      return (await G.generate()) || null
    }
    Z.default.runtime.onMessage.addListener((n) => {
      if (n.type === 'getArkoseToken') return H().then((a) => a)
    })
  })()
})()
