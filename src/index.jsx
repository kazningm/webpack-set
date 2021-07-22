// import css from "./style.css";

import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";

import ReactDOM from "react-dom";
import React from "react";
import FirstComponent from "./components/FirstComponent.jsx";

ReactDOM.render(<FirstComponent />, document.getElementById('app'));

console.log("hello world")

const prom = Promise.resolve("Promis is working");

prom.then(a => console.log(a))