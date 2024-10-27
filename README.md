# LumeoJS

## Overview

**LumeoJS** is a lightweight JavaScript library that provides reactive data binding for web applications. It allows you to easily bind variables to HTML elements, enabling dynamic updates in response to user input or changes in data.

## Features

- **Reactive Data Binding**: Automatically updates HTML elements when data changes.
- **Simple Syntax**: Easy to use with intuitive conventions.
- **Event Handling**: Bind event handlers directly in HTML.
- **Conditional Rendering**: Show or hide elements based on variable values.
- **Template Binding**: Use `{{ }}` syntax for dynamic content.

## Installation

You can install LumeoJS using npm:

```bash
npm install lumeojs
```

### CDN Access

You can also include LumeoJS via a CDN. Use one of the following URLs:

- jsDelivr:

  ```html
  <script src="https://cdn.jsdelivr.net/npm/lumeojs"></script>
  ```

- unpkg:
  ```html
  <script src="https://unpkg.com/lumeojs"></script>
  ```

## Usage

### Basic Example

1. Include the package in your HTML file:

   ```html
   <script src="https://cdn.jsdelivr.net/npm/lumeojs"></script>
   ```

2. Use the library in your JavaScript code:

   ```html
   <script>
     // Initialize Lumeo with your state
     Lumeo((state) => {
       state.name = "World";
       state.isVisible = true;
       state.message = "Welcome to LumeoJS!";
     });
   </script>
   ```

3. Bind elements in your HTML:

   ```html
   <input type="text" l-model="name" placeholder="Enter your name" />
   <p>Hello, {{ name }}!</p>
   <p l-show="isVisible">This is visible!</p>
   <p title=":message">Hover over me!</p>
   ```

### Attribute Examples

#### Binding Variables

To bind a variable to an HTML element, use the `l-model` attribute:

```html
<input type="text" l-model="myVariable" />
```

#### Event Handling

You can bind event handlers using the `on-` prefix:

```html
<button on-click="handleClick">Click Me</button>
```

In your JavaScript:

```html
<script>
  Lumeo((state) => {
    state.handleClick = () => {
      alert("Button clicked!");
    };
  });
</script>
```

#### Conditional Rendering

To conditionally show or hide elements, use the `l-show` attribute:

```html
<div l-show="isVisible">This is visible!</div>
```

In your JavaScript:

```html
<script>
  Lumeo((state) => {
    state.isVisible = true; // or false to hide
  });
</script>
```

#### Template Binding

Use double curly braces `{{ }}` to display dynamic content:

```html
<p>Hello, {{ name }}!</p>
```

#### Dynamic Attribute Binding

To bind attributes dynamically using a colon (`:`):

```html
<p title=":message">Hover over me!</p>
```

In your JavaScript:

```html
<script>
  Lumeo((state) => {
    state.message = "Welcome to LumeoJS!";
  });
</script>
```

## API

- `Lumeo(callback)`: Initializes the reactive system with the provided callback. Use this to define your state and functions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Support

If you have any questions or need support, feel free to open an issue on the [GitHub repository](https://github.com/vaddisiva5034/lumeojs).

---
