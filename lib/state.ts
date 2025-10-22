import {NITEStyle} from "./types";
import {prefersDark} from './theme';
let stateIndex = 0;
const stateStore: any[] = [];
let globalRender: (() => void) | null = null;

/**
 * Custom implementation of applyState.
 * @param {any} initialValue - The initial state value.
 * @returns {[any, Function]} - Current state and function to update it.
 * @deprecated- use Watch() instead
 */
export function ApplyState(initialValue: any) {
  const currentIndex = stateIndex;

  if (stateStore[currentIndex] === undefined) {
    stateStore[currentIndex] = initialValue;
  }

  const setState = (newValue: (arg0: any) => any) => {
    stateStore[currentIndex] =
      typeof newValue === "function"
        ? newValue(stateStore[currentIndex])
        : newValue;

    if (typeof globalRender === "function") {
      globalRender(); // Trigger re-render
    }
  };

  stateIndex++;
  return [stateStore[currentIndex], setState];
}

/**
 * Resets the state index for the next render cycle.
 */
export function resetStateIndex() {
  stateIndex = 0;
}

/**
 * Main render function to render the app.
 * @param {Function} App - The main app function to render.
 * @param {HTMLElement} rootElement - The root DOM element to render into.
 */
export function render(App: () => HTMLElement, rootElement: HTMLElement) {
  globalRender = () => {
    resetStateIndex(); // Reset the state index before rendering
    rootElement.innerHTML = ""; // Clear existing content
    const app = App();
    if(app !== null) rootElement.appendChild(app);
  };

  globalRender(); // Initial render
}

/**
 * Append element to body
 * @param {function} node
 */
export const renderBody = (node: HTMLElement) => {
  document.body.innerHTML = ""; // Clear the body content
  document.body.appendChild(node); // Append the new node
};

/**
 * Append child to container
 * @param {HTMLElement} prev
 * @param {...Node} nodes
 */
export const SetChild = (prev: Node, ...nodes: Node[]) => {
  if (!(prev instanceof HTMLElement)) {
    throw new Error("The first parameter must be a valid DOM element.");
  }

  for (const node of nodes) {
    if (!(node instanceof Node)) {
      throw new Error("All additional parameters must be valid DOM nodes.");
    }

    prev.appendChild(node);
  }
};
/**@deprecated Use SetChild() instead */
export const setChild = (prev: { appendChild: (arg0: HTMLElement) => void; }, ...nodes: any[]) => {
  if (!(prev instanceof HTMLElement)) {
    throw new Error("The first parameter must be a valid DOM element.");
  }

  for (const node of nodes) {
    if (!(node instanceof Node)) {
      throw new Error("All additional parameters must be valid DOM nodes.");
    }

    prev.appendChild(node);
  }
};


/**
 * Adds styling to element
 * @param {HTMLElement} node
 * @param {string} className
 */
export const Style = (node: HTMLElement, className: string) => {
  const classes = className.trim().split(/\s+/).filter(Boolean);
  node.classList.add(...classes);
};

/**@deprecated- Use Style() instead */
export const style = (node:HTMLElement, className:string) => {
  const classes = className.trim().split(/\s+/).filter(Boolean);
  node.classList.add(...classes);
};


/**
 * Creates a new element
 * @param {string} name
 */
export const CreateNode = (name: string) => {
  const element = document.createElement(`${name}`);
  return element;
};

/**
 * Watches for events
 * @param {HTMLElement} node
 * @param {string} type
 * @param {Function} run
 */

/**@deprecated Use HandleEvent() instead*/
export const ListenForEvent = (node: { addEventListener: (arg0: string, arg1: () => void) => void; }, type: any, run = () => {}) => {
  node.addEventListener(`${type}`, () => {
    run();
  });
};

export const HandleEvent = (node: { addEventListener: (arg0: any, arg1: () => void) => void; }, type: any, run = () => {}) => {
  node.addEventListener(type, run);
};


/**
 * Inner HTML of element
 * @param {HTMLElement} node
 * @param {string} content
 */
export const SetInner = (node: { innerHTML: any; }, content: any) => {
  node.innerHTML = content;
};


/**
 * Text Element
 * @param {HTMLElement} node
 * @param {String} content
 */
export const Text = (node: HTMLElement, text: string) => {
  node.textContent = text;
};


 
export function CreateKeyframes() {
  let styleSheet;

  if (document.styleSheets.length > 0) {
    styleSheet = document.styleSheets[0];
  } else {
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);
    styleSheet = styleElement.sheet;
  }

  // Define keyframes
  const fadeOutKeyframes = `
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `;

  const fadeInKeyframes = `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;

  try {
    styleSheet!.insertRule(fadeOutKeyframes, styleSheet!.cssRules.length);
    styleSheet!.insertRule(fadeInKeyframes, styleSheet!.cssRules.length);
  } catch (error:any) {
    console.error('Error adding keyframes:', error.message);
  }
}

CreateKeyframes();
 
 
/**
 * Routes to pages From and To.
 * @param {HTMLElement} page
 * @param {any} location
 * @param {String} locationName - Specifies the link to be shown on your browser
 */

export const route = {
  type: "page",
  routes: {} as Record<string, HTMLElement>, // Map of routeName -> DOM Node

  register(routeName: string, element: HTMLElement) {
    if (!(element instanceof Node)) {
      throw new Error('Element must be a valid DOM Node.');
    }
    this.routes[routeName] = element;
  },

  move(currentPage: HTMLElement, newPage: HTMLElement | string, routeName = 'page') {
    if (this.type === "page") {
      if (!(currentPage instanceof Node) || !(newPage instanceof Node)) {
        throw new Error('Both current and new pages must be valid DOM nodes.');
      }

      currentPage.style.animation = "fadeOut 0.1s forwards";
      currentPage.addEventListener("animationend", () => {
        currentPage.remove();
        newPage.style.animation = "fadeIn 0.1s";
        const target = document.getElementById("app") as HTMLDivElement;
        target.appendChild(newPage);
        history.pushState({ routeName }, '', `/${routeName}`);
      }, { once: true });

      // Save route for back/forward use
      this.routes[routeName] = newPage;
    } else {
      // In case type !== "page", redirect by URL string
      if (typeof newPage !== 'string') {
        throw new Error('Location must be a valid URL string.');
      }
      window.location.href = newPage;
    }
  },

  handlePopState(event: PopStateEvent) {
    const routeName = event.state?.routeName || window.location.pathname.slice(1);
    const page = this.routes[routeName];

    if (page) {
      // Clear current body content and show the saved page
      document.body.innerHTML = '';
      page.style.animation = "fadeIn 0.1s";
      document.body.appendChild(page);
    } else {
      console.warn(`No registered route found for: ${routeName}`);
    }
  },

  start() {
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }
};

 
 
 
 
 
/**
  * Adds vanilla style
  * @param {HTMLElement} node
  * @param {any} name
  */


  
export const Vanilla = (node: HTMLElement, styles:NITEStyle) => {
  Object.entries(styles).forEach(([property, value]) => {
    // Cast to any to allow dynamic property assignment on CSSStyleDeclaration
    (node.style as any)[property as any] = value;
  });
};
  
  
  
/**
 * Takes a class name and an array of CSS rules, then creates a CSS class dynamically
 * @param {string} resourceName - The class name (without dot)
 * @param {string[]} resources - Array of CSS declarations like ['color: red', 'font-weight: bold']
 */
export const CreateClass = (resourceName: string, resources: string[] = []) => {
  const newStyle = document.createElement('style');
  newStyle.type = 'text/css';

  // Make sure each rule ends with a semicolon and trim whitespace
  const rules = resources.map(rule => rule.trim().endsWith(';') ? rule.trim() : rule.trim() + ';').join(' ');

  const className = `.${resourceName} { ${rules} }`;

  newStyle.appendChild(document.createTextNode(className));
  document.head.appendChild(newStyle);
};


/**
 * Places elements in a row with given alignment and optional click callbacks.
 * @param {string} axis - justify-content value for flexbox (e.g., 'center', 'space-between')
 * @param {Object} options
 * @param {HTMLElement[]} options.children - Elements to place inside the row
 * @param {Array<(() => void) | null>} [options.callback=[]] - Optional click event handlers for each child
 * @returns {HTMLDivElement} - The container div with children appended
 */
export const Row = (
  axis: string,
  { children = [], callback = [] }: { children: HTMLElement[]; callback?: Array<(() => void) | null> }
): HTMLDivElement => {
  const div = document.createElement('div');
  div.style.display = 'flex';
  div.style.justifyContent = axis;
  div.style.alignItems = 'center';

  children.forEach((element, index) => {
    div.appendChild(element);

    const cb = callback[index];
    if (typeof cb === 'function') {
      element.addEventListener('click', cb);
    }
  });

  return div;
};


/**
 * Places elements in a column with given alignment and optional click callbacks.
 * @param {string} axis - place-content value for CSS Grid (e.g., 'center', 'start', 'end', 'space-between')
 * @param {Object} options
 * @param {HTMLElement[]} options.children - Elements to place inside the column
 * @param {Array<(() => void) | null>} [options.callback=[]] - Optional click event handlers for each child
 * @returns {HTMLDivElement} - The container div with children appended
 */
export const Column = (
  axis: string,
  { children = [], callback = [] }: { children: HTMLElement[]; callback?: Array<(() => void) | null> }
): HTMLDivElement => {
  const div = document.createElement('div');
  div.style.display = 'grid';
  div.style.placeContent = axis;
  div.style.placeItems = 'center';

  children.forEach((element, index) => {
    div.appendChild(element);

    const cb = callback[index];
    if (typeof cb === 'function') {
      element.addEventListener('click', cb);
    }
  });

  return div;
};


/**
 * Loads a sprite sheet as an image element with styling and position.
 * @param {string[]} items - Array of image URLs (sprite frames).
 * @param {Record<string, string>} design - CSS styles to apply to the image.
 * @param {[number, number]} position - Position as percentages [left%, top%].
 * @returns {HTMLImageElement} - The created image element.
 */
export const SpriteSheet = (
  items: string[] = [],
  design: Record<string, string> = {
    width: '20px',
    height: '20px',
  },
  position: [number, number] = [50, 50]
): HTMLImageElement => {
  const img = document.createElement('img');
  
  if (items.length === 0 || !items[0]) {
    throw new Error('SpriteSheet requires at least one image URL in items.');
  }

  img.src = items[0];

  // Apply design styles to the image
  Object.entries(design).forEach(([property, value]) => {
    (img.style as any)[property] = value;
  });

  // Set position styles if valid
  img.style.position = 'absolute';
  img.style.left = `${position[0]}%`;
  img.style.top = `${position[1]}%`;

  return img;
};


/**
 * A Timer.. Use to create a delay or an interval
 * @param {Number} Duration
 * @Callback {Function} callback
 * @param {String} type
 */
 
type TimerType = "single" | "constant";

interface TimerOptions {
  Duration?: number; // Duration in milliseconds, default 1000
  type: TimerType;
  callback: () => void;
}

/**
 * Timer utility that can run a single delayed callback or a repeating interval.
 * @param {TimerOptions} options
 * @returns {() => void | void} - Returns a cancel function for "constant" timers, otherwise void.
 */
export const Timer = ({ Duration = 1000, type, callback }: TimerOptions): (() => void) | void => {
  if (typeof callback !== "function") {
    throw new Error("Callback must be a function");
  }

  if (type === "single") {
    const timeoutId = setTimeout(() => {
      callback();
      clearTimeout(timeoutId);
    }, Duration);
  } else if (type === "constant") {
    const intervalId = setInterval(callback, Duration);
    // Return a function to clear the interval when called
    return () => clearInterval(intervalId);
  } else {
    throw new Error(`Invalid timer type: ${type}. Expected "single" or "constant".`);
  }
};


/**
 * Renders the inner and updates state. This is used to control the position of a Sprite.. Usually used in games
 * @param {Node} node
 * @Param {any} initialState
 * @Param {any} axis
 */
export const RenderInner = (node:HTMLElement, initialValue: any, axis: string) => {
  if (!(node instanceof Node)) {
    throw new Error('Must be a valid node');
  }

  let initialState = initialValue;
  const setState = (newValue: any) => {
    initialState = newValue;
    if (axis === 'x') {
      node.style.left = `${initialState}%`;
    } else if (axis === 'y') {
      node.style.top = `${initialState}%`;
    }
  };
  return [initialState, setState];
};

type EffectCallback<T> = (value: T) => void;

/**
 * Creates a state manager with side effects applied to a target node.
 * @param initialValue Initial state value
 * @param effect Callback to run whenever state changes
 * @returns [getter, setter]
 */
export const StateWithEffect = <T>(
  initialValue: T,
  effect: EffectCallback<T>
): [() => T, (newValue: T) => void] => {
  let state = initialValue;

  const getState = () => state;

  const setState = (newValue: T) => {
    if (newValue !== state) {
      state = newValue;
      effect(state);
    }
  };

  // Run effect initially
  effect(state);

  return [getState, setState];
};



/**
 * Removes a CSS class from an HTMLElement
 * @param {HTMLElement} node - Target element
 * @param {string} className - Class name to remove
 */
export const RemoveClass = (node: HTMLElement, className: string): void => {
  node.classList.remove(className);
};

/**
 * Creates a state manager that updates the innerHTML of an HTMLElement whenever the state changes.
 * @param {HTMLElement} node - Target element
 * @param {string} initialValue - Initial innerHTML value
 * @returns {[() => string, (newValue: string) => void]} - Getter and setter for the state
 */
export const UpdateState = (
  node: HTMLElement,
  initialValue: string
): [() => string, (newValue: string) => void] => {
  let state = initialValue;

  const getState = () => state;

  const setState = (newValue: string) => {
    if (newValue !== state) {
      state = newValue;
      node.innerHTML = state;
    }
  };

  // Initialize node innerHTML with initial value
  node.innerHTML = state;

  return [getState, setState];
};


/**
 * Logs to terminal
 * @param {any} parameter
 */
 
export const Print = (parameter: any) => {
  console.log(parameter);
};
 
/**
 * Logs error to terminal
 * @param {any} error
 */
 
 
export const Err = (error: any) => {
  console.error(error);
};
 
/** Creates a snackbar
  * @param {Function} SnackBar
  */
interface snackProps{
    text:string,
    duration:number,
    color:string,
    page:HTMLElement
}
export const SnackBar = {
  ShowNiteSnackBar: ({ Snackbar }:Record<any,any>) => {
    // Define Snackbar function inside showNiteSnackBar
    const innerSnackbar = ({ text, duration, color, page }:snackProps) => {
      // Create the snack bar container
      const bar = document.createElement('div');
      const textItem = document.createElement('p');



      // Style the snack bar itself
      Vanilla(bar, {
        position: 'fixed',
        bottom: '0',
        width: '100%',
        height: '30px',
        padding: '10px',
        backgroundColor: color ?? 'black',
        zIndex: '30',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      });

      // Style the text inside the snack bar
      Vanilla(textItem, {
        color: 'white',
      });
      // Apply additional styles and animations (if necessary)
      Style(bar, 'slideUp');

      // Set the text inside the snack bar
      Text(textItem, text ?? 'Static text');

      // Add the text item as a child of the snack bar
      SetChild(bar, textItem);

      // Append the snack bar to the provided page element
      page.appendChild(bar);

      // Automatically remove the snack bar after the set duration
      setTimeout(() => {
        // Trigger slide-out animation
        RemoveClass(bar, 'slide-in');
        Style(bar, 'slide-out-bottom');

        // Once the slide-out animation ends, remove the snack bar
        bar.addEventListener('animationend', () => {
          bar.remove();
        });
      }, duration ?? 3000);

    };

    // Call the Snackbar function with the provided arguments
    Snackbar(innerSnackbar);
  },
};




interface Props {
  variant?: 'default' | 'contained' | 'outlined';
  text?: string;
  icon?: string;
}

const darkShadow = '0 2px 5px rgba(0, 0, 0, 0.4)';
const lightShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';

export const Button = ({ variant = 'default', text = 'Click Me', icon }: Props): HTMLButtonElement => {
  const button = document.createElement('button');

  // ========== ICON ==========
  if (icon) {
    const iconNode = CreateNode('i');
    Style(iconNode, `fa-solid fa-${icon}`);
    button.appendChild(iconNode);

    if (text) button.appendChild(document.createTextNode(' '));
  }

  if (text) {
    button.appendChild(document.createTextNode(text));
  }

  // ========== BASE STYLE ==========
  Object.assign(button.style, {
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'Roboto, sans-serif',
    lineHeight: '20px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    outline: 'none',
  });

  // ========== VARIANT STYLES ==========
  const setVariantStyles = (mode: 'dark' | 'light') => {
    const isDark = mode === 'dark';

    if (variant === 'contained') {
      Object.assign(button.style, {
        backgroundColor: '#1976d2',
        color: 'white',
        boxShadow: isDark ? darkShadow : lightShadow,
      });

      button.onmouseover = () => {
        button.style.backgroundColor = isDark ? '#63a4ff' : '#1565c0';
      };

      button.onmouseout = () => {
        button.style.backgroundColor = '#1976d2';
      };

    } else if (variant === 'outlined') {
      Object.assign(button.style, {
        backgroundColor: 'transparent',
        border: '2px solid #1976d2',
        color: '#1976d2',
        boxShadow: 'none',
      });

      button.onmouseover = () => {
        button.style.backgroundColor = isDark ? 'rgba(255,255,255,0.05)' : '#e3f2fd';
      };

      button.onmouseout = () => {
        button.style.backgroundColor = 'transparent';
      };

    } else {
      // default
      Object.assign(button.style, {
        backgroundColor: isDark ? '#424242' : '#f5f5f5',
        color: isDark ? '#e0e0e0' : '#333',
        boxShadow: isDark ? darkShadow : lightShadow,
      });

      button.onmouseover = () => {
        button.style.backgroundColor = isDark ? '#616161' : '#e0e0e0';
      };

      button.onmouseout = () => {
        button.style.backgroundColor = isDark ? '#424242' : '#f5f5f5';
      };
    }
  };

  // ========== INIT BASED ON PREFERS ==========
  setVariantStyles(prefersDark ? 'dark' : 'light');

  // ========== OBSERVE MODE CHANGES ==========
  observeMode(() => {
    setVariantStyles(darkMode());
  });

  return button;
};

/**
 * Creates and renders a spriteSheet
 * @param {Function} useSpriteSheet
 * 
 */
 
export const UseSpriteSheet = () => {
  // Create and add canvas dynamically
  const canvas = document.createElement("canvas");
  canvas.width = 400; // Set canvas size
  canvas.height = 400;
  

  const ctx = canvas.getContext("2d") as any;

  const createSprite = ({ spriteSrc, placement = { width: 64, height: 64, columns: 6, rows: 5 }, time = 100 }: { spriteSrc: string, placement?: { width: number, height: number, columns: number, rows: number }, time?: number }) => {
    const { width, height, columns, rows } = placement; // Destructure placement

    const spriteSheet = new Image();
    spriteSheet.src = spriteSrc;

    const totalFrames = columns * rows; // Total frames in the sheet
    let currentFrame = 0;

    // Function to render a specific frame
    function renderSprite(x: number, y: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

      const column = currentFrame % columns; // Get column index
      const row = Math.floor(currentFrame / columns); // Get row index

      ctx.drawImage(
        spriteSheet,
        column * width, row * height, // Source X, Y
        width, height, // Source width & height
        x, y, // Destination X, Y
        width, height // Destination width & height
      );

      // Update frame
      currentFrame = (currentFrame + 1) % totalFrames;
    }

    // Animation loop
    function animate() {
      renderSprite(50, 50); // Draw sprite at (50, 50)
      setTimeout(animate, time); // Adjust speed
    }

    // Start animation when image loads
    spriteSheet.onload = () => {
      animate();
    };
  };

  return {canvas, createSprite };
};



/**
 * Creates a reactive state with observer support.
 * 
 * @template T The type of the reactive state.
 * @param initialValue - The initial value of the state.
 * @returns A tuple:
 * - A getter function to access the current value.
 * - A setter function to update the value.
 * - An observer function to register callbacks when the value changes.
 */

type Observer = () => void;

export const Watch = <T>(
  initialValue: T
): [() => T, (newValueOrUpdater: T | ((prev: T) => T)) => void, (observer: Observer) => void] => {
  let value: T = initialValue;
  const observers: Observer[] = [];

  const set = (newValueOrUpdater: T | ((prev: T) => T)): void => {
    const newValue = typeof newValueOrUpdater === 'function'
      ? (newValueOrUpdater as (prev: T) => T)(value)
      : newValueOrUpdater;

    if (newValue !== value) {
      value = newValue;
      notify();
    }
  };

  const notify = (): void => {
    observers.forEach((observer) => observer());
  };

  const observe = (observer: Observer): void => {
    observers.push(observer);
  };

  return [() => value, set, observe];
};



/**
   * Creates a switch toggler
   * @param {String} activeColor 
   * 
   */

type SwitchBarProps = {
  activeColor?: string;
  inactiveColor?: string;
  activeTrackColor?: string;
  inActiveTrackColor?: string;
  isClicked: (value: boolean) => void;
};

export const SwitchBar = ({
  activeColor,
  inactiveColor,
  activeTrackColor,
  inActiveTrackColor,
  isClicked,
}: SwitchBarProps): HTMLDivElement => {
  const Switch1 = CreateNode('div') as HTMLDivElement;
  const switchTrack = CreateNode('div') as HTMLDivElement;

  const [value, setValue] = Watch<boolean>(false);
  const [condition, setCondition, observer] = Watch<boolean>(false);

  Vanilla(Switch1, {
    width: '40px',
    backgroundColor: inactiveColor ?? 'white',
  });

  CreateClass('rounded-sm', ['border-radius:8px;']);
  Style(Switch1, 'shadowXl rounded relative right-5 h-auto');
  Style(switchTrack, 'circle w-60 cursor-pointer hover transition');

  Vanilla(switchTrack, {
    height: '25px',
    backgroundColor: inActiveTrackColor ?? 'plum',
  });

  observer(() => {
    Vanilla(switchTrack, {
      height: '25px',
      backgroundColor: condition() ? activeTrackColor ?? '' : inActiveTrackColor ?? '',
      marginLeft: condition() ? '20px' : '',
    });
    Vanilla(Switch1, {
      width: '40px',
      backgroundColor: condition() ? activeColor ?? '' : inactiveColor ?? '',
    });
  });

  switchTrack.addEventListener('click', () => {
    setCondition(!condition());
    setValue(!value());
    isClicked(value());
  });

  SetChild(Switch1, switchTrack);

  return Switch1;
};



/**
   * @param {Animate} Animate
   * Animates target component
   */
class Animate {
  animate(item: any) {
    return item;
  }
}
  
class Animation extends Animate {
  animateWithDuration(node: { classList: { add: (arg0: any) => void; remove: (arg0: any) => void; }; style: { animationDuration: string; animationIterationCount: string; }; addEventListener: (arg0: string, arg1: () => void) => void; removeEventListener: (arg0: string, arg1: () => void) => void; }, animationClass: string, duration = 1, infinite = false) {
    node.classList.add(animationClass);
    node.style.animationDuration = `${duration}s`;
    node.style.animationIterationCount = infinite ? "infinite" : "1"; // Handle infinite animations
      
    if (!infinite) {
      // Auto-remove class after animation ends
      node.addEventListener("animationend", function removeAnimation() {
        node.classList.remove(animationClass);
        node.style.animationDuration = ""; // Reset duration
        node.style.animationIterationCount = ""; // Reset iteration count
        node.removeEventListener("animationend", removeAnimation); // Clean up event listener
      });
    }
  }
    
  fadeIn(node: HTMLElement, duration = 1, infinite = false) {
    this.animateWithDuration(node, "fade-in", duration, infinite);
  }
  fadeOut(node: HTMLElement, duration = 1, infinite = false) {
    this.animateWithDuration(node, "fade-out", duration, infinite);
  }
    
  slideIn(node: any, duration = 1, infinite = false) {
    this.animateWithDuration(node, "slide-in", duration, infinite);
  }
    
  slideInLeft(node: any, duration = 1, infinite = false) {
    this.animateWithDuration(node, "slide-in-left", duration, infinite);
  }
  slideInRight(node: any, duration = 1, infinite = false) {
    this.animateWithDuration(node, "slide-in-right", duration, infinite);
  }
  slideInTop(node: any, duration = 1, infinite = false) {
    this.animateWithDuration(node, "slide-in-top", duration, infinite);
  }
  slideInBottom(node: any, duration = 1, infinite = false) {
    this.animateWithDuration(node, "slide-in-bottom", duration, infinite);
  }
    
    
  bounce(node: HTMLElement, duration = 1, infinite = false) {
    this.animateWithDuration(node, "bounce", duration, infinite);
  }
    
  shake(node: any, duration = 1, infinite = false) {
    this.animateWithDuration(node, "shake", duration, infinite);
  }
    
  pulse(node: any, duration = 1, infinite = false) {
    this.animateWithDuration(node, "pulse", duration, infinite);
  }
}
  
export const animate = new Animation();

export const Loader = ({position}:{position:'center'|'absolute'}) => {
  const div = CreateNode('div');
  if(position === 'center'){
    Style(div,'loader-spinner centered z-20');
  }else{
    Style(div,'loader-spinner z-20');
  }
   
  return div;
};

/**
 * Handles asynchronous operations with a suspense/loading state.
 *
 * @param options - The options object.
 * @param {Function|Promise<any>} options.future - The async function or promise to await.
 * @param {Function|Node} [options.suspense] - A function returning a Node or a Node to show while loading.
 * @param {Function} options.output - Callback to handle the result after future resolves.
 * @param {Node} options.target - The DOM node where suspense and output will be rendered.
 *
 * @throws Will throw if `target` is not a valid DOM Node or if `suspense` does not return a Node.
 */
export const FutureCreator = async ({
  future,
  suspense,
  output,
  target,
}: {
  future: (() => Promise<any>) | Promise<any>;
  suspense?: (() => Node) | Node;
  output: (result: any) => void;
  target: Node;
}) => {
  if (!(target instanceof Node)) {
    throw new Error('Must be a valid Page (Node)');
  }

  const suspenseNode = (typeof suspense === 'function' ? suspense() : suspense) ?? Loader({ position: 'center' });

  if (!(suspenseNode instanceof Node)) {
    throw new Error('Suspense must return a valid Node');
  }

  SetChild(target, suspenseNode);

  try {
    const result = typeof future === 'function' ? await future() : await future;
    target.removeChild(suspenseNode);
    output(result);
  } catch (err: any) {
    Print(err.message);
  }
};



interface AlertDialogProps {
  icon?: HTMLElement | null;
  message?: string;
  page: HTMLElement;
}

export const AlertDialog = ({ icon, message, page }: AlertDialogProps) => {
  if (!(page instanceof HTMLElement)) throw new Error('Alert needs a valid HTMLElement page to display on');

  const overlay = CreateNode('div');
  Style(overlay, 'w-100 h-screen-full bg-grey fixed top-0 bottom-0 left-0 right-0 z-20');
  animate.fadeIn(overlay, 0.5, false);
  SetChild(page, overlay);

  const bar = CreateNode('div');
  animate.bounce(bar, 1, false);
  Style(bar, 'centered bg-white justify-evenly rounded shadowXl p-1 z-20 relative');

  const mediaQuery = window.matchMedia('(min-width:1024px)');
  Vanilla(bar, {
    width: mediaQuery.matches ? '30%' : '50%',
    height: '30vh',
  });

  // Icon holder
  const iconHolder = CreateNode('div');
  Style(iconHolder, 'flex justify-center');
  const fallbackIcon = CreateNode('h1');
  Text(fallbackIcon, '!');
  Vanilla(fallbackIcon, { fontWeight: 'bold', color: 'green' });
  const iconBar = icon ?? fallbackIcon;
  SetChild(iconHolder, iconBar);
  SetChild(bar, iconHolder);

  // Message holder
  const messageHolder = CreateNode('div');
  Style(messageHolder, 'flex justify-center');
  const messageBar = CreateNode('h3');
  Vanilla(messageBar, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    whiteSpace: 'pre-line',
  });
  Text(messageBar, message ?? 'This is just a test');
  SetChild(messageHolder, messageBar);
  SetChild(bar, messageHolder);

  // Action holder with button
  const actionHolder = CreateNode('div');
  Style(actionHolder, 'flex justify-between');
  Vanilla(actionHolder, {
    paddingLeft: '10px',
    paddingRight: '10px',
  });

  const button = Button({
    variant: 'contained',
    text: 'Ok',
  });
  SetChild(actionHolder, button);
  Vanilla(button, {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
  });

  button.addEventListener('click', () => {
    bar.remove();
    animate.fadeOut(overlay, 0.5, false);
    setTimeout(() => {
      if (page.contains(overlay)) {
        page.removeChild(overlay);
      }
    }, 500);
  });

  SetChild(bar, actionHolder);
  SetChild(page, bar);
};


interface MediaQueryProps {
  output: (value: 'desktop' | 'tablet' | 'mobile') => void;
}

/**
 * Sets runtime media query and calls output with the current device type.
 * @param {function} output - Callback receiving 'desktop', 'tablet', or 'mobile'.
 */
export const MediaQuery = ({ output }: MediaQueryProps) => {
  const desktop = window.matchMedia('(min-width:1024px)');
  const tablet = window.matchMedia('(min-width:542px) and (max-width:1023px)');
  const mobile = window.matchMedia('(max-width:600px)');

  function checkMedia() {
    if (desktop.matches) {
      output('desktop');
    } else if (tablet.matches) {
      output('tablet');
    } else if (mobile.matches) {
      output('mobile');
    }
  }

  window.addEventListener('load', checkMedia);
  window.addEventListener('resize', checkMedia);
};

/** 
 * Used to set font awesome icons 
 * @param {String} iconStyle - Specify the icon name and style
 * */
export const UseFontAwesomeIcon = ({iconStyle}:{iconStyle:string}) => {
  const icon = CreateNode('i');
  Style(icon,iconStyle ?? 'fa fa-user');
  return icon;
};

interface GetDocumentProps {
  type: 'class' | 'id';
  value: string;
}

/**
 * Gets the document element by class or id
 * @param {('class'|'id')} type - The type of selector
 * @param {string} value - The class or id value
 * @returns {Element | null}
 */
export const GetDocument = ({ type, value }: GetDocumentProps): Element | null => {
  if (typeof value !== 'string') throw new Error('value must be a string');

  let doc: Element | null = null;

  if (type === 'class') {
    doc = document.querySelector(`.${value}`);
  } else if (type === 'id') {
    doc = document.getElementById(value);
  }

  return doc;
};



/**
 * @param {AnimatedText} AnimatedText - Creates a typing effect 
 */

// Optional: Blinking cursor effect
const styler = document.createElement("style");
styler.textContent = `
.typing-text::after {
  content: '|';
  animation: blink 0.7s step-end infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}
`;
document.head.appendChild(styler);



class AnimatedText {
  protected _textValue: string = "Static";
  protected _node: string = "p";
  protected _textItem: HTMLElement = CreateNode(this._node);
  protected _targetNode: HTMLElement = document.body;

  // Styles for the text element
  protected styles: Partial<CSSStyleDeclaration> = {
    color: 'red',
    textShadow: '1px 1px 1px black',
    fontWeight: 'bold',
    fontFamily: 'Orbitron, serif',
    fontSize: '2rem',
    letterSpacing: '1.5px',
  };

  animateText() {
    return this._textItem;
  }

  setText(node: string, text: string, targetNode: HTMLElement) {
    this._node = node;
    this._textValue = text;
    this._targetNode = targetNode;
    this._textItem = CreateNode(this._node); // recreate node
  }

  setStyle() {
    Vanilla(this._textItem, this.styles);
  }
}

class TypingText extends AnimatedText {
  animation() {
    this.setStyle();
    this._textItem.innerHTML = ""; // clear previous content
    this._textItem.classList.add("typing-text");

    let i = 0;
    const interval = setInterval(() => {
      if (i < this._textValue.length) {
        this._textItem.innerHTML += this._textValue[i];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
  }

  Style(style: Partial<CSSStyleDeclaration> = {}) {
    this.styles = style;
    Vanilla(this._textItem, this.styles);
  }

  animate() {
    this._targetNode.appendChild(this._textItem);
    this.animation();
  }

  remove() {
    this._textItem.remove();
  }
}

export const _Text = new TypingText();


/**
 * Smoothly scrolls to a specific element or Y position on the page
 * @param {HTMLElement | number} target - Element or vertical pixel value
 */
export const SmoothScrollTo = (target: HTMLElement | number): void => {
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
};


/**
 * Returns a debounced version of a function that delays execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} - Debounced function
 */
export const Debounce = <T extends (...args: any[]) => any>(func: T, delay: number): T => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  } as T;
};

/**
 * Adds a one-time click event listener to an element
 * @param {HTMLElement} node - Element to attach to
 * @param {(event: MouseEvent) => void} callback - Callback function
 */
export const OnClickOnce = (node: HTMLElement, callback: (event: MouseEvent) => void): void => {
  const handler = (event: MouseEvent) => {
    callback(event);
    node.removeEventListener('click', handler);
  };
  node.addEventListener('click', handler);
};


/**
 * Creates an HTMLElement with given tag, class, and attributes
 * @param {string} tag - Tag name of element to create
 * @param {string[]} classes - Array of classes to add
 * @param {Record<string, string>} [attributes] - Optional attributes to set
 * @returns {HTMLElement} - Created element
 */
export const CreateElementWithClass = (
  tag: string,
  classes: string[] = [],
  attributes?: Record<string, string>
): HTMLElement => {
  const el = document.createElement(tag);
  el.classList.add(...classes);
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }
  return el;
};


/**
 * Controls the visibility of an element with fade animations.
 * @param {HTMLElement} element - The element to show/hide
 * @param {number} duration - Animation duration in milliseconds (default 300ms)
 */
export const VisibilityToggle = (element: HTMLElement, duration = 300) => {
  if (!(element instanceof HTMLElement)) {
    throw new Error("VisibilityToggle requires a valid HTMLElement.");
  }

  // Initial setup: hide element but keep in DOM
  element.style.transition = `opacity ${duration}ms ease`;
  element.style.opacity = '0';
  element.style.pointerEvents = 'none';
  element.style.visibility = 'hidden';

  let visible = false;

  const show = () => {
    if (visible) return;
    visible = true;
    element.style.visibility = 'visible';
    element.style.pointerEvents = 'auto';
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  };

  const hide = () => {
    if (!visible) return;
    visible = false;
    element.style.opacity = '0';
    element.style.pointerEvents = 'none';
    // Wait for transition to end before hiding visibility
    setTimeout(() => {
      if (!visible) {
        element.style.visibility = 'hidden';
      }
    }, duration);
  };

  const toggle = () => {
    visible ? hide() : show();
  };

  const isVisible = () => visible;

  return { show, hide, toggle, isVisible };
};


interface AppBarOptions {
  title?: string | HTMLElement;
  leading?: HTMLElement | null;  // e.g. back button
  actions?: HTMLElement[];       // right side icons/buttons
  backgroundColor?: string;
  color?: string;                // text & icons color
  height?: string;               // e.g. '56px'
  elevation?: number;            // shadow depth
  onLeadingClick?: () => void;
}

/**
 * Creates a Flutter-like AppBar for the web
 */
export const AppBar = (options: AppBarOptions = {}) => {
  const {
    title = '',
    leading = null,
    actions = [],
    backgroundColor = '#6200ee',
    color = 'white',
    height = '56px',
    elevation = 4,
    onLeadingClick,
  } = options;

  // Container div
  const bar = document.createElement('header');
  bar.style.position = 'fixed';
  bar.style.top = '0';
  bar.style.left = '0';
  bar.style.right = '0';
  bar.style.height = height;
  bar.style.backgroundColor = backgroundColor;
  bar.style.color = color;
  bar.style.display = 'flex';
  bar.style.alignItems = 'center';
  bar.style.padding = '0 16px';
  bar.style.boxShadow = `0 ${elevation}px ${elevation * 2}px rgba(0,0,0,0.24)`;
  bar.style.zIndex = '1000';

  // Leading (left)
  const leadingContainer = document.createElement('div');
  leadingContainer.style.display = 'flex';
  leadingContainer.style.alignItems = 'center';
  leadingContainer.style.justifyContent = 'center';
  leadingContainer.style.width = '56px';
  leadingContainer.style.height = '100%';
  leadingContainer.style.cursor = onLeadingClick ? 'pointer' : 'default';

  if (leading) {
    leadingContainer.appendChild(leading);
  } else {
    // If no leading, keep empty space for layout consistency
    leadingContainer.innerHTML = ''; 
  }

  if (onLeadingClick) {
    leadingContainer.addEventListener('click', () => onLeadingClick());
  }

  // Title (center)
  const titleContainer = document.createElement('div');
  titleContainer.style.flex = '1';
  titleContainer.style.textAlign = 'center';
  titleContainer.style.fontSize = '20px';
  titleContainer.style.fontWeight = '500';
  titleContainer.style.userSelect = 'none';
  titleContainer.style.overflow = 'hidden';
  titleContainer.style.textOverflow = 'ellipsis';
  titleContainer.style.whiteSpace = 'nowrap';

  if (typeof title === 'string') {
    titleContainer.textContent = title;
  } else if (title instanceof HTMLElement) {
    titleContainer.appendChild(title);
  }

  // Actions (right)
  const actionsContainer = document.createElement('div');
  actionsContainer.style.display = 'flex';
  actionsContainer.style.alignItems = 'center';
  actionsContainer.style.gap = '8px';
  actionsContainer.style.minWidth = '56px';
  actionsContainer.style.height = '100%';

  actions.forEach(action => {
    action.style.cursor = 'pointer';
    actionsContainer.appendChild(action);
  });

  // Assemble
  bar.appendChild(leadingContainer);
  bar.appendChild(titleContainer);
  bar.appendChild(actionsContainer);

  return bar;
};


/**
 * Handles test cases and runs them.
 */
export class TestRunner {
  tests: { name: string; testFn: () => boolean }[] = [];

  /**
   * Add a new test case.
   * @param name Test case name.
   * @param testFn Test function that returns true if the test passes.
   */
  addTest(name: string, testFn: () => boolean): void {
    this.tests.push({ name, testFn });
  }

  /**
   * Run all tests and log results.
   */
  run(): void {
    this.tests.forEach(({ name, testFn }) => {
      try {
        const passed = testFn();
        if (passed) {
          console.log(`Passed: ${name}`);
        } else {
          console.error(`Failed: ${name}`);
        }
      } catch (error) {
        console.error(`Error in test: ${name}`, error);
      }
    });
  }
}



type TestResult = {
  name: string;
  passed: boolean;
  message?: string;
};

type TestFn = () => boolean | void | Promise<boolean | void>;

interface Suite {
  name: string;
  tests: { name: string; fn: TestFn }[];
  beforeEach?: () => void | Promise<void>;
  afterEach?: () => void | Promise<void>;
}

export class Test {
  private suites: Suite[] = [];
  private results: TestResult[] = [];
  private currentSuite?: Suite | undefined;

  // Start a new test suite
  suite(name: string, callback: () => void) {
    const suite: Suite = { name, tests: [] };
    this.suites.push(suite);
    this.currentSuite = suite;
    callback();
    this.currentSuite = undefined;
  }

  // Add test to current suite
  addTest(name: string, fn: TestFn) {
    if (!this.currentSuite) {
      throw new Error('No active suite. Use test.suite(...) to create a suite first.');
    }
    this.currentSuite.tests.push({ name, fn });
  }

  // Setup hooks
  beforeEach(fn: () => void | Promise<void>) {
    if (!this.currentSuite) {
      throw new Error('No active suite. Use test.suite(...) first.');
    }
    this.currentSuite.beforeEach = fn;
  }

  afterEach(fn: () => void | Promise<void>) {
    if (!this.currentSuite) {
      throw new Error('No active suite. Use test.suite(...) first.');
    }
    this.currentSuite.afterEach = fn;
  }

  // Run all suites & tests async
  async run(container?: HTMLElement) {
    this.results = [];

    for (const suite of this.suites) {
      for (const test of suite.tests) {
        try {
          if (suite.beforeEach) await suite.beforeEach();

          const result = await test.fn();
          const passed = result === undefined ? true : Boolean(result);
          this.results.push({ name: `${suite.name}: ${test.name}`, passed });

          if (suite.afterEach) await suite.afterEach();
        } catch (err: any) {
          this.results.push({
            name: `${suite.name}: ${test.name}`,
            passed: false,
            message: err.message || String(err),
          });
        }
      }
    }

    this.report(container);
  }

  // Console + optional DOM reporting
  report(container?: HTMLElement) {
    const passedCount = this.results.filter(r => r.passed).length;
    const failedCount = this.results.length - passedCount;

    console.group(`Test Results: ${passedCount} passed, ${failedCount} failed`);
    this.results.forEach(({ name, passed, message }) => {
      if (passed) {
        console.log(`✅ ${name}`);
      } else {
        console.error(`❌ ${name}`, message || '');
      }
    });
    console.groupEnd();

    if (container) {
      container.innerHTML = '';
      const header = document.createElement('h3');
      header.textContent = `Test Results: ${passedCount} passed, ${failedCount} failed`;
      container.appendChild(header);

      this.results.forEach(({ name, passed, message }) => {
        const div = document.createElement('div');
        div.style.color = passed ? 'green' : 'red';
        div.textContent = passed ? `✅ ${name}` : `❌ ${name} — ${message || ''}`;
        container.appendChild(div);
      });
    }
  }

  // Assertion helpers (same as before, but async-safe)
  assertEqual<T>(actual: T, expected: T, message?: string): boolean {
    if (actual !== expected) {
      throw new Error(message || `Expected "${expected}" but got "${actual}"`);
    }
    return true;
  }

  assertTrue(value: boolean, message?: string): boolean {
    if (!value) {
      throw new Error(message || `Expected true but got ${value}`);
    }
    return true;
  }

  assertFalse(value: boolean, message?: string): boolean {
    if (value) {
      throw new Error(message || `Expected false but got ${value}`);
    }
    return true;
  }
}


//Mode

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

const [darkMode, setDarkMode, observeMode] = Watch<'light' | 'dark'>(getInitialTheme());

observeMode(() => {
  const current = darkMode();
  localStorage.setItem('theme', current);
});

export { darkMode, setDarkMode, observeMode };