const readline = require("readline");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const tsContent = `
import { applyState, Column, createClass, removeClass, Row, Watch } from "./lib/state.js";
import { renderBody } from "./lib/state.js";
import { setChild } from "./lib/state.js";
import { Style } from "./lib/state.js";
import { createNode, route, vanilla, setInner } from "./lib/state.js";
import { listenForEvent } from "./lib/state.js";
import { nJFloatingActionButton as FAB } from "./lib/main.js";
import { Text } from "./lib/state.js";
import { SwitchBar } from "./lib/state.js";

type WatchFunction<T> = [() => T, (value: T) => void, () => void];

export const App = () => {
  const page = createNode('div');
  const text = createNode('h1');
  const navbar = createNode('div');
  const title = createNode('h2');
  const mode = createNode('small');

  Style(page, "flex-container w-100 h-screen-full space flex-col transition bg-image");
  Style(text, 'font-bold');
  Style(navbar, "navbar shadowXl");
  Style(title, "ml-3");
  Style(mode, 'relative right-8');

  const [count, setCount, observeCount]: WatchFunction<number> = Watch(0);
  const [isDark, setDark, observe]: WatchFunction<boolean> = Watch(false);

  const handleValue = (value: boolean) => {
    setDark(!isDark());
  };

  const switchBar = SwitchBar({
    activeColor: 'grey',
    activeTrackColor: 'white',
    inactiveColor: 'white',
    inActiveTrackColor: 'plum',
    isClicked: (value: boolean) => handleValue(value),
  });

  Text(mode, 'Light mode');

  observe(() => {
    vanilla(page, { backgroundColor: isDark() ? 'black' : 'white' });
    vanilla(text, { color: isDark() ? 'white' : 'black' });
    vanilla(title, { color: isDark() ? 'white' : 'black' });
    vanilla(navbar, { boxShadow: isDark() ? '2px 4px 8px rgba(222, 214, 214, 0.1)' : '' });
    vanilla(mode, { color: isDark() ? 'white' : 'black' });
    Text(mode, isDark() ? 'Dark mode' : 'Light mode');

    if (isDark()) {
      removeClass(page, 'bg-image');
      page.classList.add('bg-image2');
      vanilla(navbar, { backdropFilter: 'blur(5px)' });
    } else {
      removeClass(page, 'bg-image2');
      page.classList.add('bg-image');
    }
  });

  const [dropBarState, setDropBarState, observeDropbarState]: WatchFunction<boolean> = Watch(false);
  Text(text, \`\${count()}\`);
  Text(title, "My App");

  const row = Row('space-evenly', { children: [mode, switchBar] });

  setChild(page, text);
  setChild(page, navbar);
  setChild(navbar, title);
  setChild(navbar, row);

  const dropDown = createNode('div');
  const dropDownHead = createNode('a');
  Style(dropDownHead, 'text-center, font-bold');
  Text(dropDownHead, 'Toolkit');
  setChild(dropDown, dropDownHead);

  Style(dropDown, 'w-auto h-auto rounded absolute bottom-10 right-10 shadowXl p-1 flex flex-col space');
  observe(() => {
    vanilla(dropDown, { border: isDark() ? '1px solid white' : '' });
    vanilla(dropDownHead, { color: isDark() ? 'white' : '' });
  });

  observeCount(() => { Text(text, \`\${count()}\`); });

  const handleClick = (index: number) => {
    index === 0 ? setCount(count() + 1) : route.move(page, page2);
  };

  ['Increment count', 'Next page'].map((element, index) => {
    const container = createNode('div');
    Style(container, 'border-bottom');

    const text = createNode('a');
    Style(text, 'font-xs text-grey shadow-dynamic cursor-pointer');
    Text(text, element);
    setChild(container, text);
    setChild(dropDown, container);

    listenForEvent(text, 'click', () => handleClick(index));
  });

  setChild(page, dropDown);

  renderBody(page);

  vanilla(document.body, { margin: 0, padding: 0 });
  vanilla(dropDown, { display: dropBarState() ? 'flex' : 'none' });

  observeDropbarState(() => {
    vanilla(dropDown, { display: dropBarState() ? 'flex' : 'none' });
  });

  FAB.FloatingActionButton({ onclick: () => setDropBarState(!dropBarState()) });

  const page2 = createNode('div');
  Style(page2, 'fixed top-0 bottom-0 left-0 right-0 w-100 h-screen-full bg-black flex-container flex-col space');

  const h4 = createNode('h4');
  Text(h4, "Routing between pages is easy");
  Style(h4, "text-white");

  const back = createNode('button');
  Style(back, 'p-1 absolute bottom-8 right-3 rounded pulse text-black bg-white border-none');
  Text(back, 'Back');
  setChild(page2, back);
  listenForEvent(back, 'click', () => route.move(page2, page));

  setChild(page2, h4);
};
`;



rl.question("Would you like to use TypeScript? (y/n) ", (answer) => {
  const useTypeScript = answer.toLowerCase() === "y";
  console.log("Installing please wait...");
  if (useTypeScript) {
    exec("npm install typescript @types/node --save-dev", (error, stdout, stderr) => {
      if (error) {
        console.error(`Error installing TypeScript: ${error.message}`);
        rl.close();
        return;
      }
      if (stderr) {
        console.error(`stderr installing TypeScript: ${stderr}`);
        rl.close();
        return;
      }
      console.log(stdout);

           
      createTsConfigFile();
      createTypeScriptFile('./app.ts',tsContent);
      rl.close();
    });
  } else {
    exec("npm install",(error, stdout,stderr) => {
      if(error){
        console.error(`Error installing: ${error.message}`);
        rl.close();
        return;
      }

      if (stderr) {
        console.error(`stderr installing: ${stderr}`);
        rl.close();
        return;
      }
      console.log(stdout);
      rl.close(); // Close immediately
    });
       
  }
});


function createTsConfigFile() {
  const tsConfigPath = path.join(process.cwd(), "tsconfig.json");

  // Check if tsconfig.json already exists
  if (fs.existsSync(tsConfigPath)) {
    console.log("tsconfig.json already exists, skipping creation.");
    return;
  }

  const tsConfig = {
    compilerOptions: {
      target: "es6", // Or your preferred target
      module: "commonjs", // Or "esnext"
      strict: true,
      esModuleInterop: true,
      rootDir: "./",
      sourceMap: true, // Recommended
    },
    include: ["**/*.ts"],
    exclude: ["node_modules"]
  };

  fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2));
  console.log("tsconfig.json created.");
}


function createTypeScriptFile(filePath,content = ""){
  try {
    // 1. Create the directory if it doesn't exist
    const dir = path.dirname(filePath); // Extract the directory part of the path
    fs.mkdirSync(dir, { recursive: true }); // Create directory and any necessary parent directories
  
    // 2. Write the content to the file
    fs.writeFileSync(filePath, content);
  
    console.log(`TypeScript file created successfully at: ${filePath}`);
    return true; // Indicate success
  
  } catch (error) {
    console.error(`Error creating TypeScript file at ${filePath}:`, error);
    return false; // Indicate failure
  }
}
  
  
  
