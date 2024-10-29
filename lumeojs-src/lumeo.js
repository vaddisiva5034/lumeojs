const watcherDep = {};

// Create a proxy to watch changes on the object and trigger callbacks
const createReactiveObject = (target) =>
  new Proxy(target, {
    set(obj, prop, value) {
      if (obj[prop] !== value) {
        obj[prop] = value;
        // Trigger watcher callbacks
        watcherDep[prop]?.forEach((cb) => cb(value));
      }
      return true;
    },
  });
const variables = createReactiveObject({});

const lumeo = (fn) => fn(variables);

const handleBootstrap = () => {
  try {
    initializeBindings(document.body);
  } catch (err) {
    console.log("errr ", err.message);
  }
};

const bindReactivity = (condition, cb, onLoadValue) => {
  onLoadValue ? cb(onLoadValue) : cb();
  watcherDep[condition] = watcherDep[condition] || [];
  watcherDep[condition].push(cb);
};

const evaluateExpression = (expression) => {
  const func = new Function(...Object.keys(variables), `return ${expression};`);
  return func(...Object.values(variables));
};

// Initialize bindings on all elements
const initializeBindings = (element) => {
  Array.from(element.children).forEach((child) => {
    bindModel(child);
    bindTemplate(child);
    bindEventHandlers(child);
    bindConditionalRendering(child);
    bindAttributes(child);
  });
};

// Bind input elements using l-model
const bindModel = (element) => {
  if (element.tagName === "INPUT" && element.hasAttribute("l-model")) {
    const modelName = element.getAttribute("l-model");
    element.value = variables[modelName] || "";
    element.addEventListener("input", (e) => {
      variables[modelName] = e.target.value;
    });
  }
};

// Bind {{ }} templates in the element’s inner text
const bindTemplate = (element) => {
  const originalTemplate = element.innerText;
  const regex = /\{\{(.*?)\}\}/g;
  const matches = [...originalTemplate.matchAll(regex)];

  if (matches.length) {
    const updateTemplate = () => {
      element.innerText = matches.reduce((text, match) => {
        const key = match[1].trim();
        let tempKey = key.replace("(", "\\(").replace(")", "\\)");
        return text.replace(
          new RegExp(`\\{\\{\\s*${tempKey}\\s*\\}\\}`, "g"),
          evaluateExpression(key) || ""
        );
      }, originalTemplate);
    };
    matches.forEach((match) => {
      bindReactivity(match[1].trim(), updateTemplate);
    });
  }
};

// Bind events like on-click, on-change, etc.
const bindEventHandlers = (element) => {
  element.getAttributeNames().forEach((attr) => {
    if (attr.startsWith("on-")) {
      const eventType = attr.slice(3);
      const callbackName = element.getAttribute(attr);
      if (typeof variables[callbackName] === "function") {
        element.addEventListener(eventType, (event) => {
          variables[callbackName](event);
        });
      }
    }
  });
};

// Handle l-show for conditional rendering
const bindConditionalRendering = (element) => {
  if (element.hasAttribute("l-show")) {
    const condition = element.getAttribute("l-show");
    bindReactivity(
      condition,
      (newValue) => {
        element.style.display = newValue ? "block" : "none";
      },
      variables[condition] || false
    );
  }
};

// Handle other attributes starting with l- but not on- for binding values
const bindAttributes = (element) => {
  element.getAttributeNames().forEach((attr) => {
    if (
      !attr.startsWith("l-") &&
      !attr.startsWith("on-") &&
      element.getAttribute(attr).startsWith(":")
    ) {
      const key = element.getAttribute(attr).slice(1);
      bindReactivity(key, () => {
        element.setAttribute(attr, evaluateExpression(key));
      });
    }
  });
};

document.addEventListener("DOMContentLoaded", handleBootstrap);

// Exporting the Lumeo function
module.exports = lumeo;
