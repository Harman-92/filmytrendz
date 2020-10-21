import React from 'react';
import '../style/Home.css';
import {Sidebar, Card, Menu, Container, Tab} from 'semantic-ui-react';
import HeaderCustom from "./HeaderCustom";
import SignUp from "./SignUp";
import Login from "./Login";
const panes = [
    { menuItem: 'Login', render: () => <Tab.Pane as={'div'}><Login/></Tab.Pane> },
    { menuItem: 'Register', render: () => <Tab.Pane as={'div'}><SignUp/></Tab.Pane> },
]

function Home() {
    const [visible, setVisible] = React.useState(false)
    const [visible2, setVisible2] = React.useState(false)
    const [activeIndex, setActiveIndex] = React.useState(1)
    const src = '/empty_image.png'
    const handleTab = (visible, index) => {
        setVisible(visible)
        setActiveIndex(index)
    }
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
                    <Tab menu={{pointing:true}} panes={panes}
                         activeIndex={activeIndex}
                         onTabChange={(e,{activeIndex}) => setActiveIndex(activeIndex)}/>
                </Sidebar>
                <Sidebar.Pusher>
                    <HeaderCustom handleTab={handleTab} setVisible2={setVisible2} isLogin={false}/>

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
                            <Container>
                                Filters to be added
                            </Container>
                        </Sidebar>
                        <Sidebar.Pusher>
                            <Container className='container'>
                                <h2>Latest Movies</h2>
                                <Card.Group itemsPerRow={5}>
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
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        </div>
    );
}

export default Home;
