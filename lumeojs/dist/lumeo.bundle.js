!(function (t, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define([], e)
    : "object" == typeof exports
    ? (exports.Lumeo = e())
    : (t.Lumeo = e());
})(self, () => {
  return (
    (t = {
      859: (t) => {
        const e = {},
          r = new Proxy(
            {},
            {
              set: (t, r, o) => (
                t[r] !== o && ((t[r] = o), e[r]?.forEach((t) => t(o))), !0
              ),
            }
          ),
          o = (t, r, o) => {
            o ? r(o) : r(), (e[t] = e[t] || []), e[t].push(r);
          },
          n = (t) =>
            new Function(...Object.keys(r), `return ${t};`)(
              ...Object.values(r)
            ),
          s = (t) => {
            Array.from(t.children).forEach((t) => {
              i(t), c(t), a(t), u(t), l(t);
            });
          },
          i = (t) => {
            if ("INPUT" === t.tagName && t.hasAttribute("l-model")) {
              const e = t.getAttribute("l-model");
              (t.value = r[e] || ""),
                t.addEventListener("input", (t) => {
                  r[e] = t.target.value;
                });
            }
          },
          c = (t) => {
            const e = t.innerText,
              r = [...e.matchAll(/\{\{(.*?)\}\}/g)];
            if (r.length) {
              const s = () => {
                t.innerText = r.reduce((t, e) => {
                  const r = e[1].trim();
                  let o = r.replace("(", "\\(").replace(")", "\\)");
                  return t.replace(
                    new RegExp(`\\{\\{\\s*${o}\\s*\\}\\}`, "g"),
                    n(r) || ""
                  );
                }, e);
              };
              r.forEach((t) => {
                o(t[1].trim(), s);
              });
            }
          },
          a = (t) => {
            t.getAttributeNames().forEach((e) => {
              if (e.startsWith("on-")) {
                const o = e.slice(3),
                  n = t.getAttribute(e);
                "function" == typeof r[n] &&
                  t.addEventListener(o, (t) => {
                    r[n](t);
                  });
              }
            });
          },
          u = (t) => {
            if (t.hasAttribute("l-show")) {
              const e = t.getAttribute("l-show");
              o(
                e,
                (e) => {
                  t.style.display = e ? "block" : "none";
                },
                r[e] || !1
              );
            }
          },
          l = (t) => {
            t.getAttributeNames().forEach((e) => {
              if (
                !e.startsWith("l-") &&
                !e.startsWith("on-") &&
                t.getAttribute(e).startsWith(":")
              ) {
                const r = t.getAttribute(e).slice(1);
                o(r, () => {
                  t.setAttribute(e, n(r));
                });
              }
            });
          };
        document.addEventListener("DOMContentLoaded", () => {
          try {
            s(document.body);
          } catch (t) {}
        }),
          (t.exports = (t) => t(r));
      },
    }),
    (e = {}),
    (function r(o) {
      var n = e[o];
      if (void 0 !== n) return n.exports;
      var s = (e[o] = { exports: {} });
      return t[o](s, s.exports, r), s.exports;
    })(859)
  );
  var t, e;
});
