
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const { document } = new JSDOM("<!doctype html><html><body></body></html>")
  .window;
global.document = document;
global.window = document.defaultView;
global.navigator = global.window.navigator;

// require("react-native-mock/mock");
//

Enzyme.configure({ adapter: new Adapter() });
