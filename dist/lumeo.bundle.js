!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Lumeo=e():t.Lumeo=e()}(self,(()=>{return t={859:t=>{const e={},o=new Proxy({},{set(t,o,r){const n=t[o];return n!==r&&(t[o]=r,e[o]&&e[o].forEach((t=>t(r)))),!0}});const r=t=>{if("INPUT"===t.tagName&&t.hasAttribute("l-model")){const e=t.getAttribute("l-model");t.value=o[e]||"",t.addEventListener("input",(t=>{o[e]=t.target.value}))}},n=t=>{const r=t.innerText,n=[...r.matchAll(/\{\{(.*?)\}\}/g)];if(n.length>0){const s=()=>{let e=r;n.forEach((t=>{const r=t[1].trim();e=e.replace(new RegExp(`\\{\\{\\s*${r}\\s*\\}\\}`,"g"),o[r]||"")})),t.innerText=e};n.forEach((t=>{const o=t[1].trim();e[o]||(e[o]=[]),e[o].push(s)})),s()}},s=t=>{t.getAttributeNames().forEach((e=>{if(e.startsWith("on-")){const r=e.slice(3),n=t.getAttribute(e);"function"==typeof o[n]&&t.addEventListener(r,(t=>{try{o[n](t)}catch(t){console.error(`Error in event handler for ${r}:`,t)}}))}}))},i=t=>{if(t.hasAttribute("l-show")){const r=t.getAttribute("l-show"),n=e=>{t.style.display=e?"block":"none"};n(o[r]||!1),e[r]||(e[r]=[]),e[r].push(n)}},c=t=>{t.getAttributeNames().forEach((r=>{if(!r.startsWith("l-")&&!r.startsWith("on-")){const n=t.getAttribute(r);if(n.startsWith(":")){const s=n.slice(1);t.setAttribute(r,o[s]),e[s]||(e[s]=[]),e[s].push((e=>{t.setAttribute(r,e)}))}}}))};document.addEventListener("DOMContentLoaded",(()=>{(t=>{for(const e of t.children)r(e),n(e),s(e),i(e),c(e)})(document.body)})),t.exports={Lumeo:t=>t(o)}}},e={},function o(r){var n=e[r];if(void 0!==n)return n.exports;var s=e[r]={exports:{}};return t[r](s,s.exports,o),s.exports}(859);var t,e}));