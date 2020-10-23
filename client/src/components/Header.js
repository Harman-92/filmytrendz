import React, {useEffect, useState} from 'react';
import {Sidebar, Menu, Container, Tab, Image, Input, Button, Icon, Popup, Segment} from 'semantic-ui-react';
import SignUp from "./SignUp";
import Login from "./Login";
import images from "../config/images";
import MenuCustom from "./MenuCustom";
import {Link, useLocation, useHistory} from "react-router-dom";
import '../style/Header.css';

function Header(props) {
    const history = useHistory()
    const location = useLocation()
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [activeIndex, setActiveIndex] = useState(1)
    const [isLogin, setIsLogin] = useState(false)
    const [name, setName] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const handleTab = (visible, index) => {
        setVisible(visible)
        setActiveIndex(index)
    }
    const handleSearch = () => {
        //send search keyword to home
        if(searchInput !== '') {
            history.push({
                pathname: location.pathname,
                isSearch : true,
                keyword : searchInput
            })
        }
    }
    useEffect(() => {
        if (location.isLogin) {
            setIsLogin(true)
            setName(location.email)
        }
    }, [location])
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
                >

                    {/*---------------Side Menu Tabs for Login and Register----------------*/}

                    <Tab menu={{pointing: true}} panes={
                        [
                            {
                                menuItem: 'Login',
                                render: () => <Tab.Pane as={'div'}><Login setVisible={setVisible}/></Tab.Pane>
                            },
                            {menuItem: 'Register', render: () => <Tab.Pane as={'div'}><SignUp/></Tab.Pane>},
                        ]
                    }
                         activeIndex={activeIndex}
                         onTabChange={(e, {value}) => setActiveIndex(value)}/>
                </Sidebar>
                <Sidebar.Pusher>

                    {/*-------------------------Logo-----------------------*/}

                    <Segment vertical className='header-segment'>
                        <Link to={{
                            pathname: '/',
                            email: name,
                            isLogin: isLogin
                        }}>
                            <Image className='logo' src={images.logo} floated='left' size={"small"}/>
                        </Link>

                        {/*---------------------Search Bar----------------------*/}

                        <Input className='header-search' type='text' placeholder='Search...' action
                               onChange={(e, {value}) => {
                                   setSearchInput(value)
                               }}
                        >
                            <input
                                onKeyPress={event => {
                                    if (event.key === 'Enter') {
                                        handleSearch()
                                    }
                                }}
                            />
                            <Button icon basic className='filter-button' labelPosition='right'
                                    onClick={() => setVisible2(true)}>
                                filter
                                <Icon className='filter-icon' name='down arrow'/>
                            </Button>
                            <Button className='header-button' type='submit' onClick={handleSearch}>Search</Button>
                        </Input>
                        {!isLogin ?

                            /*---------------Login or Register Button----------------*/

                            <Button.Group size='medium' floated='right'>
                                <Button className='custom-menu header-button'
                                        onClick={() => handleTab(true, 0)}>Login</Button>
                                <Button.Or className='custom-menu'/>
                                <Button className='custom-menu header-button'
                                        onClick={() => handleTab(true, 1)}>Register</Button>
                            </Button.Group>
                            :

                            /*--------------------User Menu Button-------------------*/

                            <div className='custom-menu menu-div'>
                                <span className='menu-text'>Hey, {name}</span>
                                <Popup wide
                                       position='bottom right'
                                       trigger={<Image className='menu-image' src={images.no_profile} circular
                                                       floated='right'/>} on='click'>
                                    <MenuCustom/>
                                </Popup>
                            </div>
                        }
                    </Segment>

                    <Sidebar.Pushable>
                        <Sidebar
                            as={Menu}
                            animation='overlay'
                            icon='labeled'
                            onHide={() => setVisible2(false)}
                            vertical
                            visible={visible2}
                            width='very wide'
                            direction='top'
                        >

                            {/*------------------Search Filters--------------------*/}

                            <Container>
                                Filters to be added
                            </Container>
                        </Sidebar>
                        <Sidebar.Pusher>
                            {props.children}
                        </Sidebar.Pusher>
                    </Sidebar.Pushable>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    );
}

export default Header;
