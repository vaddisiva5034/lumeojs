/*! For license information please see lumeo.bundle.js.LICENSE.txt */
!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.Lumeo=n():e.Lumeo=n()}(self,(()=>(()=>{var __webpack_modules__={"./lumeo.js":module=>{eval('const watcherDep = {};\n\n// Create a proxy to watch changes on the object and trigger callbacks\nconst createReactiveObject = (target) =>\n  new Proxy(target, {\n    set(obj, prop, value) {\n      if (obj[prop] !== value) {\n        obj[prop] = value;\n        // Trigger watcher callbacks\n        watcherDep[prop]?.forEach((cb) => cb(value));\n      }\n      return true;\n    },\n  });\nconst variables = createReactiveObject({});\n\nconst lumeo = (fn) => fn(variables);\n\nconst handleBootstrap = () => {\n  try {\n    initializeBindings(document.body);\n  } catch (err) {\n    console.log("errr ", err.message);\n  }\n};\n\nconst bindReactivity = (condition, cb, onLoadValue) => {\n  onLoadValue ? cb(onLoadValue) : cb();\n  watcherDep[condition] = watcherDep[condition] || [];\n  watcherDep[condition].push(cb);\n};\n\nconst evaluateExpression = (expression) => {\n  const func = new Function(...Object.keys(variables), `return ${expression};`);\n  return func(...Object.values(variables));\n};\n\n// Initialize bindings on all elements\nconst initializeBindings = (element) => {\n  Array.from(element.children).forEach((child) => {\n    bindModel(child);\n    bindTemplate(child);\n    bindEventHandlers(child);\n    bindConditionalRendering(child);\n    bindAttributes(child);\n  });\n};\n\n// Bind input elements using l-model\nconst bindModel = (element) => {\n  if (element.tagName === "INPUT" && element.hasAttribute("l-model")) {\n    const modelName = element.getAttribute("l-model");\n    element.value = variables[modelName] || "";\n    element.addEventListener("input", (e) => {\n      variables[modelName] = e.target.value;\n    });\n  }\n};\n\n// Bind {{ }} templates in the element’s inner text\nconst bindTemplate = (element) => {\n  const originalTemplate = element.innerText;\n  const regex = /\\{\\{(.*?)\\}\\}/g;\n  const matches = [...originalTemplate.matchAll(regex)];\n\n  if (matches.length) {\n    const updateTemplate = () => {\n      element.innerText = matches.reduce((text, match) => {\n        const key = match[1].trim();\n        let tempKey = key.replace("(", "\\\\(").replace(")", "\\\\)");\n        return text.replace(\n          new RegExp(`\\\\{\\\\{\\\\s*${tempKey}\\\\s*\\\\}\\\\}`, "g"),\n          evaluateExpression(key) || ""\n        );\n      }, originalTemplate);\n    };\n    matches.forEach((match) => {\n      bindReactivity(match[1].trim(), updateTemplate);\n    });\n  }\n};\n\n// Bind events like on-click, on-change, etc.\nconst bindEventHandlers = (element) => {\n  element.getAttributeNames().forEach((attr) => {\n    if (attr.startsWith("on-")) {\n      const eventType = attr.slice(3);\n      const callbackName = element.getAttribute(attr);\n      if (typeof variables[callbackName] === "function") {\n        element.addEventListener(eventType, (event) => {\n          variables[callbackName](event);\n        });\n      }\n    }\n  });\n};\n\n// Handle l-show for conditional rendering\nconst bindConditionalRendering = (element) => {\n  if (element.hasAttribute("l-show")) {\n    const condition = element.getAttribute("l-show");\n    bindReactivity(\n      condition,\n      (newValue) => {\n        element.style.display = newValue ? "block" : "none";\n      },\n      variables[condition] || false\n    );\n  }\n};\n\n// Handle other attributes starting with l- but not on- for binding values\nconst bindAttributes = (element) => {\n  element.getAttributeNames().forEach((attr) => {\n    if (\n      !attr.startsWith("l-") &&\n      !attr.startsWith("on-") &&\n      element.getAttribute(attr).startsWith(":")\n    ) {\n      const key = element.getAttribute(attr).slice(1);\n      bindReactivity(key, () => {\n        element.setAttribute(attr, evaluateExpression(key));\n      });\n    }\n  });\n};\n\ndocument.addEventListener("DOMContentLoaded", handleBootstrap);\n\n// Exporting the Lumeo function\nmodule.exports = lumeo;\n\n\n//# sourceURL=webpack://Lumeo/./lumeo.js?')}},__webpack_module_cache__={};function __webpack_require__(e){var n=__webpack_module_cache__[e];if(void 0!==n)return n.exports;var t=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](t,t.exports,__webpack_require__),t.exports}var __webpack_exports__=__webpack_require__("./lumeo.js");return __webpack_exports__})()));