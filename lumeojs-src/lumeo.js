const watcherDep = {};

// Create a proxy to watch changes on the object and trigger callbacks
const createReactiveObject = (target, callback) =>
  new Proxy(target, {
    set(obj, prop, value) {
      if (obj[prop] !== value) {
        const oldValue = obj[prop];
        obj[prop] = value;
        callback(prop, oldValue, value);
        // Trigger watcher callbacks
        watcherDep[prop]?.forEach((cb) => cb(value));
      }
      return true;
    },
  });

const variables = createReactiveObject({}, () => {});

const lumeo = (fn) => fn(variables);

const handleBootstrap = () => initializeBindings(document.body);

const evalueExpression = (key) => {
  const expression = variables[key];
  return typeof expression === "function" ? expression() : expression;
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
        return text.replace(
          new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"),
          evalueExpression(key) || ""
        );
      }, originalTemplate);
    };

    // Register dependencies for reactivity
    matches.forEach((match) => {
      const key = match[1].trim();
      watcherDep[key] = watcherDep[key] || [];
      watcherDep[key].push(updateTemplate);
    });

    // Initial rendering
    updateTemplate();
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
          try {
            variables[callbackName](event);
          } catch (error) {
            console.error(`Error in event handler for ${eventType}:`, error);
          }
        });
      }
    }
  });
};

// Handle l-show for conditional rendering
const bindConditionalRendering = (element) => {
  if (element.hasAttribute("l-show")) {
    const condition = element.getAttribute("l-show");
    const updateDisplay = (newValue) => {
      element.style.display = newValue ? "block" : "none";
    };

    updateDisplay(variables[condition] || false);
    watcherDep[condition] = watcherDep[condition] || [];
    watcherDep[condition].push(updateDisplay);
  }
};

// Handle other attributes starting with l- but not on- for binding values
const bindAttributes = (element) => {
  element.getAttributeNames().forEach((attr) => {
    if (!attr.startsWith("l-") && !attr.startsWith("on-")) {
      const attributeValue = element.getAttribute(attr);
      if (attributeValue.startsWith(":")) {
        const key = attributeValue.slice(1);
        const updateAttribute = () => {
          element.setAttribute(
            attr,
            typeof variables[key] === "function"
              ? variables[key]()
              : variables[key]
          );
        };
        updateAttribute();
        watcherDep[key] = watcherDep[key] || [];
        watcherDep[key].push(updateAttribute);
      }
    }
  });
};

document.addEventListener("DOMContentLoaded", handleBootstrap);

// Exporting the Lumeo function
module.exports = lumeo;
