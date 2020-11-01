import React, {useState} from 'react';
import {
    Sidebar,
    Menu,
    Tab
} from 'semantic-ui-react';
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import {Switch, Route} from "react-router-dom";
import './style/Header.css';
import Header from './components/Header'
import Home from "./components/Home";
import MovieDetails from "./components/MovieDetails";
import Profile from "./components/Profile";
import SearchResult from "./components/SearchResult";
import WishList from "./components/WishList";

function App() {
    const [visible, setVisible] = useState(false)
    const [activeIndex, setActiveIndex] = useState(1)

    return (
        <div className="App">
            <Sidebar.Pushable as='div'>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    icon='labeled'
                    onHide={() => setVisible(false)}
                    vertical
                    visible={visible}
                    width='very wide'
                    direction='right'
                    className='header-menu-tab'
                >

                    {/*---------------Side Menu Tabs for Login and Register----------------*/}

                    <Tab menu={{pointing: true}} panes={
                        [
                            {
                                menuItem: 'Login',
                                render: () => <Tab.Pane as={'div'}><Login setVisible={setVisible}/></Tab.Pane>
                            },
                            {
                                menuItem: 'Register',
                                render: () => <Tab.Pane as={'div'}><SignUp/></Tab.Pane>
                            },
                        ]
                    }
                         activeIndex={activeIndex}
                         onTabChange={(e, {value}) => setActiveIndex(value)}/>
                </Sidebar>
                <Sidebar.Pusher>
                    <Header setVisible={setVisible} setActiveIndex={setActiveIndex}/>
                    <Switch>
                        <Route exact path="/" render={(props) => <Home {...props}/>}/>
                        <Route path="/movie/:id" component={MovieDetails}/>
                        <Route path="/profile" component={Profile}/>
                        <Route path="/search" component={SearchResult}/>
                        <Route path="/wishlist" component={WishList}/>
                        <Route path="/wishlist/:id" component={WishList}/>
                    </Switch>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    );
}

export default App;
