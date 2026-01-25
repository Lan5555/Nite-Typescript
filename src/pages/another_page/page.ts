/* eslint-disable indent */
import { Button, CreateNode, HandleEvent, route, SetChild, Style,Text, Vanilla } from "../../../lib/state";
import { NITEStyle } from "../../../lib/types";
import { routeToPage } from "../routes";

export const AnotherPage = () => {
    // Page 2
  const page = CreateNode("div") as HTMLElement;

  Style(page, "fixed top-0 bottom-0 left-0 right-0 w-100 h-screen-full bg-black flex-container flex-col space");

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
  SetChild(page, back);

  HandleEvent(back, "click", () => {
    routeToPage(0);
  });

  SetChild(page, h4);
  return page;
};