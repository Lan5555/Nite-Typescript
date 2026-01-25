# Nite

The official **Nite** package – a lightweight, reactive JavaScript utility for building dynamic user interfaces.

For full documentation, visit: [Nite Documentation](http://nite-documentation.vercel.app)

---

## Features

- **Reactive State Management**: Track changes to variables and automatically update the DOM.
- **Simple DOM Utilities**: Create nodes, update text, and handle events without external frameworks.
- **Lightweight and Fast**: Minimal overhead for small projects or prototyping.

---

## Installation

```bash
npm install nite-typescript
Or via CDN:


// Initialize a reactive variable
const [count, setCount, observe] = Watch(0);

// Create a button element
const button = createNode('button');
Text(button, `Count ${count()}`);
SetChild(document.body,button);

// Automatically update the button text whenever `count` changes
observe(() => {
    Text(button, `Count ${count()}`);
});

// Increment count when button is clicked
HandleEvent(button, 'click', () => setCount(count() + 1));
How it works:

Watch(initialValue) returns [getter, setter, observer].

getter() → gets the current value.

setter(newValue) → updates the value.

observer(callback) → runs the callback whenever the value changes.

createNode(tag) → creates a new DOM element of the given tag.

Text(node, string) → updates the text content of a node.

listenForEvent(node, event, callback) → adds event listeners easily.

Advanced Usage
You can use Watch for multiple reactive variables and more complex UI updates:

ts
Copy code
const [countA, setCountA, observeA] = Watch(0);
const [countB, setCountB, observeB] = Watch(10);

const display = createNode('div');
document.body.appendChild(display);

// Automatically update display when any reactive variable changes
observeA(() => Text(display, `A: ${countA()}, B: ${countB()}`));
observeB(() => Text(display, `A: ${countA()}, B: ${countB()}`));

listenForEvent(display, 'click', () => {
    setCountA(countA() + 1);
    setCountB(countB() + 2);
});
Any reactive variable change automatically updates all observers.

Perfect for counters, forms, or small dynamic components.

Why Use Nite?
Reactive without frameworks: No need for React, Vue, or Svelte.

Easy to learn: Minimal API surface.

Direct DOM access: No virtual DOM overhead.

Composable: Combine multiple reactive variables and observers for complex interactions.

Links
Documentation: http://nite-documentation.vercel.app

NPM Package: https://www.npmjs.com/package/nite-typescript

Contributing
Fork the repository.

Create a new branch: git checkout -b feature-name.

Make your changes and test.

Submit a pull request describing your changes.

FAQ
Q: Why doesn’t my DOM update automatically?
A: Make sure you’re using observe() on reactive variables created with Watch(). Only variables wrapped in Watch() are reactive.

Q: Can I use multiple reactive variables together?
A: Yes! Simply create multiple Watch() variables and use their observers. All observers will update when their respective variables change.

Q: Does Nite work with frameworks like React?
A: Nite is framework-agnostic and works best with vanilla JS or small projects. You can integrate it with frameworks, but it’s designed for direct DOM manipulation.