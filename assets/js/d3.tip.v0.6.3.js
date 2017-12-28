d3.tip = function() {
  function t(t) {
    v = d(t), w = v.createSVGPoint(), document.body.appendChild(x)
  }

  function e() {
    return "n"
  }

  function n() {
    return [0, 0]
  }

  function r() {
    return " "
  }

  function o() {
    var t = y();
    return {
      top: t.n.y - x.offsetHeight,
      left: t.n.x - x.offsetWidth / 2
    }
  }

  function l() {
    var t = y();
    return {
      top: t.s.y,
      left: t.s.x - x.offsetWidth / 2
    }
  }

  function s() {
    var t = y();
    return {
      top: t.e.y - x.offsetHeight / 2,
      left: t.e.x
    }
  }

  function f() {
    var t = y();
    return {
      top: t.w.y - x.offsetHeight / 2,
      left: t.w.x - x.offsetWidth
    }
  }

  function i() {
    var t = y();
    return {
      top: t.nw.y - x.offsetHeight,
      left: t.nw.x - x.offsetWidth
    }
  }

  function u() {
    var t = y();
    return {
      top: t.ne.y - x.offsetHeight,
      left: t.ne.x
    }
  }

  function a() {
    var t = y();
    return {
      top: t.sw.y,
      left: t.sw.x - x.offsetWidth
    }
  }

  function c() {
    var t = y();
    return {
      top: t.se.y,
      left: t.e.x
    }
  }

  function p() {
    var t = d3.select(document.createElement("div"));
    return t.style({
      position: "absolute",
      opacity: 0,
      pointerEvents: "none",
      boxSizing: "border-box"
    }), t.node()
  }

  function d(t) {
    return t = t.node(), "svg" == t.tagName.toLowerCase() ? t : t.ownerSVGElement
  }

  function y() {
    var t = T || d3.event.target,
      e = {},
      n = t.getScreenCTM(),
      r = t.getBBox(),
      o = r.width,
      l = r.height,
      s = r.x,
      f = r.y,
      i = document.documentElement.scrollTop || document.body.scrollTop,
      u = document.documentElement.scrollLeft || document.body.scrollLeft;
    return w.x = s + u, w.y = f + i, e.nw = w.matrixTransform(n), w.x += o, e.ne = w.matrixTransform(n), w.y += l, e.se = w.matrixTransform(n), w.x -= o, e.sw = w.matrixTransform(n), w.y -= l / 2, e.w = w.matrixTransform(n), w.x += o, e.e = w.matrixTransform(n), w.x -= o / 2, w.y -= l / 2, e.n = w.matrixTransform(n), w.y += l, e.s = w.matrixTransform(n), e
  }
  var m = e,
    g = n,
    h = r,
    x = p(),
    v = null,
    w = null,
    T = null;
  t.show = function() {
    var e = Array.prototype.slice.call(arguments);
    e[e.length - 1] instanceof SVGElement && (T = e.pop());
    var n, r = h.apply(this, e),
      o = g.apply(this, e),
      l = m.apply(this, e),
      s = d3.select(x),
      f = 0;
    for (s.html(r).style({
        opacity: 1,
        "pointer-events": "all"
      }); f--;) s.classed(E[f], !1);
    return n = b.get(l).apply(this), s.classed(l, !0).style({
      top: n.top + o[0] + "px",
      left: n.left + o[1] + "px"
    }), t
  }, t.hide = function() {
    return nodel = d3.select(x), nodel.style({
      opacity: 0,
      "pointer-events": "none"
    }), t
  }, t.attr = function(e, n) {
    if (arguments.length < 2 && "string" == typeof e) return d3.select(x).attr(e);
    var r = Array.prototype.slice.call(arguments);
    return d3.selection.prototype.attr.apply(d3.select(x), r), t
  }, t.style = function(e, n) {
    if (arguments.length < 2 && "string" == typeof e) return d3.select(x).style(e);
    var r = Array.prototype.slice.call(arguments);
    return d3.selection.prototype.style.apply(d3.select(x), r), t
  }, t.direction = function(e) {
    return arguments.length ? (m = null == e ? e : d3.functor(e), t) : m
  }, t.offset = function(e) {
    return arguments.length ? (g = null == e ? e : d3.functor(e), t) : g
  }, t.html = function(e) {
    return arguments.length ? (h = null == e ? e : d3.functor(e), t) : h
  };
  var b = d3.map({
      n: o,
      s: l,
      e: s,
      w: f,
      nw: i,
      ne: u,
      sw: a,
      se: c
    }),
    E = b.keys();
  return t
};
