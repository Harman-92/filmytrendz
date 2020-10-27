import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './components/Header';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import MovieDetails from "./components/MovieDetails";
import Home from "./components/Home";
const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

const routing = (
    <Router>
        <Header>
            <Switch>
                <Route exact path="/" render={(props) => <Home {...props}/>}/>
                <Route exact path="/movie/:id" component={MovieDetails}/>
            </Switch>
        </Header>
    </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
