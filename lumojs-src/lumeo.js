const watcherDep = {};
// Create a proxy to watch changes on the object and trigger callbacks
const createReactiveObject = (target, callback) =>
  new Proxy(target, {
    set(obj, prop, value) {
      const oldValue = obj[prop];
      if (oldValue !== value) {
        obj[prop] = value;
        callback(prop, oldValue, value);
        // Trigger watcher callbacks
        if (watcherDep[prop]) {
          watcherDep[prop].forEach((cb) => cb(value));
        }
      }
      return true;
    },
  });

const variables = createReactiveObject({}, (key) => {
  // Not needed here as it's handled in the setter
});

const lumeo = (fn) => fn(variables);

const handleBootstrap = () => {
  const bodyElement = document.body;
  initializeBindings(bodyElement);
};

// Initialize bindings on all elements
const initializeBindings = (element) => {
  for (const child of element.children) {
    bindModel(child);
    bindTemplate(child);
    bindEventHandlers(child);
    bindConditionalRendering(child);
    bindAttributes(child);
  }
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

  if (matches.length > 0) {
    const updateTemplate = () => {
      let updatedText = originalTemplate;

      matches.forEach((match) => {
        const key = match[1].trim();
        updatedText = updatedText.replace(
          new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g"),
          variables[key] || ""
        );
      });

      element.innerText = updatedText;
    };

    // Register dependencies for reactivity
    matches.forEach((match) => {
      const key = match[1].trim();
      if (!watcherDep[key]) watcherDep[key] = [];
      watcherDep[key].push(updateTemplate);
    });

    // Initial rendering
    updateTemplate();
  }
};

// Bind events like on-click, on-change, etc.
const bindEventHandlers = (element) => {
  const attributes = element.getAttributeNames();
  attributes.forEach((attr) => {
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

    if (!watcherDep[condition]) watcherDep[condition] = [];
    watcherDep[condition].push(updateDisplay);
  }
};

// Handle other attributes starting with l- but not on- for binding values
const bindAttributes = (element) => {
  const attributes = element.getAttributeNames();

  attributes.forEach((attr) => {
    if (!attr.startsWith("l-") && !attr.startsWith("on-")) {
      const attributeValue = element.getAttribute(attr);
      if (attributeValue.startsWith(":")) {
        const key = attributeValue.slice(1);
        element.setAttribute(
          attr,
          typeof variables[key] === "function"
            ? variables[key]()
            : variables[key]
        );

        if (!watcherDep[key]) watcherDep[key] = [];
        watcherDep[key].push((newValue) => {
          element.setAttribute(
            attr,
            typeof variables[key] === "function"
              ? variables[key]()
              : variables[key]
          );
          element.setAttribute(attr, newValue);
        });
      }
    }
  });
};

document.addEventListener("DOMContentLoaded", handleBootstrap);

// Exporting the Lumeo function
module.exports = lumeo;
