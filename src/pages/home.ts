import {
  Button,
  RemoveClass,
  Row,
  Watch,
  SetChild,
  Style,
  CreateNode,
  route,
  Vanilla,
  HandleEvent,
  Text,
  SwitchBar,
  UseFontAwesomeIcon,
} from "../../lib/state";
import { FloatingActionButton as FAB } from "../../lib/components";
import { NITEStyle } from "../../lib/types";


export const Homepage = ():HTMLElement => {
  // Page 1
  const page = CreateNode("div") as HTMLDivElement;
  const text = CreateNode("h1") as HTMLHeadElement;
  const navbar = CreateNode("div") as HTMLDivElement;
  const title = CreateNode("h2") as HTMLHeadElement;
  const mode = CreateNode("small") as HTMLElement;

  Style(page, "flex-container w-100 h-screen-full space flex-col transition bg-image");
  Style(text, `font-bold`);
  Style(navbar, "navbar shadowXl");
  Style(title, "ml-3");
  Style(mode, "relative right-8");

  // Rendered state of count
  const [count, setCount, observeCount] = Watch<number>(0);

  // Toggle view Mode
  const [isDark, setDark, observe] = Watch<boolean>(false);

  const handleValue = (): void => {
    setDark(!isDark());
  };

  const switchBar = SwitchBar({
    activeColor: "grey",
    activeTrackColor: "white",
    inactiveColor: "white",
    inActiveTrackColor: "plum",
    isClicked: (value: boolean) => handleValue(),
  });

  Text(mode, "Light mode");

  observe(() => {
    Vanilla(page, {
      backgroundColor: isDark() ? "black" : "white",
    });
    Vanilla(text, {
      color: isDark() ? "white" : "black",
    });
    Vanilla(title, {
      color: isDark() ? "white" : "black",
    });
    Vanilla(navbar, {
      boxShadow: isDark() ? "2px 4px 8px rgba(222, 214, 214, 0.1)" : "",
    });
    Vanilla(mode, {
      color: isDark() ? "white" : "black",
    });
    Text(mode, isDark() ? "Dark mode" : "Light mode");

    if (isDark()) {
      RemoveClass(page, "bg-image");
      page.classList.add("bg-image2");
      Vanilla(navbar, {
        backdropFilter: "blur(5px)",
      });
    } else {
      RemoveClass(page, "bg-image2");
      page.classList.add("bg-image");
    }
  });

  // State controlling dropbar
  const [dropBarState, setDropBarState, observeDropbarState] = Watch<boolean>(false);

  // Sets Text to the respective nodes
  Text(text, `${count()}`);
  Text(title, "My App");

  const row = Row("space-evenly", {
    children: [mode, switchBar],
  });

  SetChild(page, text);
  SetChild(page, navbar);
  SetChild(navbar, title);
  SetChild(navbar, row);

  // Drop down
  const dropDown = CreateNode("div") as HTMLElement;
  const dropDownHead = CreateNode("a") as HTMLElement;

  Style(dropDownHead, "text-center font-bold");
  Text(dropDownHead, "Toolkit");
  SetChild(dropDown, dropDownHead);

  Style(dropDown, "w-auto h-auto rounded absolute bottom-10 right-10 shadowXl p-1 flex flex-col space");

  observe(() => {
    Vanilla(dropDown, {
      border: isDark() ? "0.5px solid white" : "",
      backdropFilter: "blur(3px)",
      boxShadow: isDark() ? "2px 4px 8px rgba(0,0,0,0.1)" : "",
    });
    Vanilla(dropDownHead, {
      color: isDark() ? "white" : "",
    });
  });

  observeCount(() => {
    Text(text, `${count()}`);
  });

  // Drop down Toolkit
  const handleClick = (index: number): void => {
    if (index === 0) {
      setCount(prev => prev + 1);
    } else {
      route.move(page, page2);
    }
  };

  ["Increment count", "Next page"].forEach((element:string, index:number) => {
    const container = CreateNode("div");
    Style(container, "border-bottom");

    const linkText = CreateNode("a");
    Style(linkText, "font-xs text-grey shadow-dynamic cursor-pointer");
    Text(linkText, element);
    SetChild(container, linkText);
    SetChild(dropDown, container);

    HandleEvent(linkText, "click", () => handleClick(index));
  });

  SetChild(page, dropDown);


  /**
   * Rendered page, this displays the initial page created.
   */

  Vanilla(document.body, {
    margin: "0",
    padding: "0",
  });

  Vanilla(dropDown, {
    display: dropBarState() ? "flex" : "none",
  });

  observeDropbarState(() => {
    Vanilla(dropDown, {
      display: dropBarState() ? "flex" : "none",
    });
  });

  FAB.create({
    target:page,
    position:"bottomRight",
    icon:UseFontAwesomeIcon({
      iconStyle:'fa fa-sign-out'
    }),
    onclick: () => {
      setDropBarState(!dropBarState());
    },
  });

  
  // Page 2
  const page2 = CreateNode("div") as HTMLElement;

  Style(page2, "fixed top-0 bottom-0 left-0 right-0 w-100 h-screen-full bg-black flex-container flex-col space");

  const h4 = CreateNode("h4") as HTMLElement;
  Text(h4, "Routing between pages is easy");
  Style(h4, "text-white float");

  const back = Button({
    variant: "contained",
    text: "Back",
    icon:'sign-out'
  });
  const style:NITEStyle = {
    position:'fixed',
    bottom:'20px',
    right:'20px'
  };
  Vanilla(back,{...style});
  SetChild(page2, back);

  HandleEvent(back, "click", () => {
    route.move(page2, page);
  });

  SetChild(page2, h4);
  return page;
};