import React from 'react';
import logo from '../logo.svg';
import '../style/Home.css';
import {Header, Button, Divider, Form, Grid, Segment, Sidebar, Card, Menu, Input, Image, Container, Tab} from 'semantic-ui-react'
import {Link} from "react-router-dom";
const panes = [
    { menuItem: 'Register', render: () => <Tab.Pane as={'div'}>Tab 1 Content</Tab.Pane> },
    { menuItem: 'Login', render: () => <Tab.Pane as={'div'}>Tab 2 Content</Tab.Pane> },
]

function Home() {
    const [visible, setVisible] = React.useState(false)
    const [activeItem, setActiveItem] = React.useState('signup')
    const handleItemClick = (e, { name }) => setActiveItem(name)
    const src = '/empty_image.png'
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
                    <Tab panes={panes} />
                </Sidebar>
                <Sidebar.Pusher>
                    <Segment vertical className='header-segment'>
                        <Image className='logo' src='/logo_2.jpg' floated='left' size={"small"}/>
                        <Input className='search' action={{ icon: 'search' }} placeholder='Search...' />
                        <Header as='div' className='header' floated='right'>
                            <span className='button' onClick={() => setVisible(true)}>Register or Login</span>
                        </Header>

                    </Segment>
                    <Container className='container'>
                        <h2>Latest Movies</h2>
                        <Card.Group itemsPerRow={4}>
                            <Card raised image={src} />
                            <Card raised image={src} />
                            <Card raised image={src} />
                            <Card raised image={src} />
                            <Card raised image={src} />
                            <Card raised image={src} />
                            <Card raised image={src} />
                            <Card raised image={src} />
                            <Card raised image={src} />
                            <Card raised image={src} />
                            <Card raised image={src} />
                            <Card raised image={src} />
                        </Card.Group>
                    </Container>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    );
}

export default Home;
