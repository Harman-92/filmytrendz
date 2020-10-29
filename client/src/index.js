import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css'
import Header from './components/Header';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import MovieDetails from "./components/MovieDetails";
import Home from "./components/Home";
import Profile from "./components/Profile";
import searchResult from "./components/searchResult";

const routing = (
    <Router>
        <Header>
            <Switch>
                <Route exact path="/" render={(props) => <Home {...props}/>}/>
                <Route exact path="/movie/:id" component={MovieDetails}/>
                <Route exact path="/profile" component={Profile}/>
                <Route exact path="/search" component={searchResult}/>
            </Switch>
        </Header>
    </Router>
)

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
