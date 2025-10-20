import {App} from "../app";
import {render} from "../lib/state";
import '../lib/style.css';
import '../global.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


const rootElement = document.getElementById('app');

render(App,rootElement);

