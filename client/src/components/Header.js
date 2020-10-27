import React, {useEffect, useState} from 'react';
import {
    Sidebar,
    Menu,
    Tab,
    Image,
    Input,
    Button,
    Icon,
    Popup,
    Segment,
    Dropdown,
    Accordion,
    Grid, Form
} from 'semantic-ui-react';
import SignUp from "./SignUp";
import Login from "./Login";
import images from "../config/images";
import MenuCustom from "./MenuCustom";
import {Link, useLocation, useHistory} from "react-router-dom";
import '../style/Header.css';
import genres from "../config/movieGenres";
import rating from "../config/ratings";

function Header(props) {
    const history = useHistory()
    const location = useLocation()
    const [visible, setVisible] = useState(false)
    const [visible2, setVisible2] = useState(false)
    const [activeIndex, setActiveIndex] = useState(1)
    const [isLogin, setIsLogin] = useState(false)
    const [name, setName] = useState('')
    const [searchInput, setSearchInput] = useState('')

    const [searchByTitle, setSearchByTitle] = useState(false)
    const [searchByDescription, setSearchByDescription] = useState(false)
    const [searchByCast, setSearchByCast] = useState(false)
    const [searchByWishlist, setSearchByWishlist] = useState(false)

    const [genresKey, setGenresKey] = useState([])
    const [yearFrom, setYearFrom] = useState(null)
    const [yearTo, setYearTo] = useState(null)
    const [yearError, setYearError] = useState(false)
    const [ratingFrom, setRatingFrom] = useState(null)
    const [ratingTo, setRatingTo] = useState(null)
    const [ratingError, setRatingError] = useState(false)

    const handleTab = (visible, index) => {
        setVisible(visible)
        setActiveIndex(index)
    }
    const handleSearch = () => {
        //send search keyword to home
        if (parseInt(yearFrom) > parseInt(yearTo)) {
            setYearError(true)
        } else if (parseInt(ratingFrom) > parseInt(ratingTo)) {
            setRatingError(true)
        } else if (searchInput !== '') {
            history.push({
                pathname: location.pathname,
                isSearch: true,
                keyword: searchInput,
                filters: {
                    genresKey: genresKey,
                    yearFrom: yearFrom,
                    yearTo: yearTo,
                    ratingFrom: ratingFrom,
                    ratingTo: ratingTo,
                }
            })
        }

        alert("title: " + searchByTitle + "\ndes: " + searchByDescription + "\ncast: " + searchByCast + "\nwishlist: " + searchByWishlist +
            "\ngenres: " + genresKey + "\nyear from: " + yearFrom + "\nyear to: " + yearTo + "\nrating from: " + ratingFrom +
            "\nrating to: " + ratingTo
        )
    }

    const clearFilter = () => {
        setVisible2(!visible2)
        setGenresKey([])
        setYearFrom(null)
        setYearTo(null)
        setYearError(false)
        setRatingFrom(null)
        setRatingTo(null)
        setRatingError(false)
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

                    <Segment vertical className='header-segment'>
                        <Accordion>
                            <Accordion.Title active={visible2} index={0}>

                                {/*-------------------------Logo-----------------------*/}
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
                                    <input onKeyPress={event => {
                                        if (event.key === 'Enter') {
                                            handleSearch()
                                        }
                                    }}
                                    />
                                    <Button icon basic className='filter-button' labelPosition='right'
                                            onClick={() => setVisible2(!visible2)}>
                                        <Icon className='filter-icon' name='filter'/>Filter
                                    </Button>
                                    <Button className='header-button' type='submit'
                                            onClick={handleSearch}>Search</Button>
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

                            </Accordion.Title>
                            {/*---------------------Search Bar Filter ----------------------*/}
                            <Accordion.Content active={visible2}>

                                <Grid className='filter-grid'>
                                    {/*---------------------- Keywords -------------------------*/}
                                    <Grid.Row centered verticalAlign={'middle'}>
                                        <Grid.Column width={2} textAlign={'center'}>
                                            <label className='filterHeader'>Keyword:</label>
                                        </Grid.Column>
                                        <Grid.Column width={9}>
                                            <Form>
                                                <Form.Group widths={'equal'} className='filter-form-group'>
                                                    <Form.Radio
                                                        label='Title'
                                                        value='t'
                                                        checked={searchByTitle}
                                                        onClick={() => setSearchByTitle(!searchByTitle)}
                                                    />
                                                    <Form.Radio
                                                        label='Description'
                                                        value='d'
                                                        checked={searchByDescription}
                                                        onClick={() => setSearchByDescription(!searchByDescription)}
                                                    />
                                                    <Form.Radio
                                                        label='Cast'
                                                        value='c'
                                                        checked={searchByCast}
                                                        onClick={() => setSearchByCast(!searchByCast)}
                                                    />
                                                    <Form.Radio
                                                        label='Wishlist'
                                                        value='w'
                                                        checked={searchByWishlist}
                                                        onClick={() => setSearchByWishlist(!searchByWishlist)}
                                                    />

                                                </Form.Group>
                                            </Form>
                                        </Grid.Column>
                                    </Grid.Row>
                                    {/*---------------------- Genre, Year and Rating -------------------------*/}
                                    <Grid.Row verticalAlign={'middle'} centered>
                                        <Grid.Column width={2} textAlign={'center'}>
                                            <div className='filterHeader'>Genre:</div>
                                        </Grid.Column>
                                        <Grid.Column width={9} className='filter-genre-container'>
                                            <Dropdown search selection multiple clearable fluid className='filter-genre'
                                                      options={genres}
                                                      placeholder="-- Select Genres --"
                                                      value={genresKey}
                                                      onChange={(e, {value}) => setGenresKey(value)}
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row verticalAlign={'middle'} centered>
                                        <Grid.Column width={2} textAlign={'center'}>
                                            <div className='filterHeader'>Year:</div>
                                        </Grid.Column>
                                        <Grid.Column width={9}>
                                            <Form>
                                                <Form.Group widths='equal' className='filter-form-group'>
                                                    <Form.Input placeholder='From'
                                                                onChange={(e, {value}) => setYearFrom(value)}/>
                                                    <Form.Input placeholder='To'
                                                                onChange={(e, {value}) => setYearTo(value)}/>
                                                </Form.Group>
                                                {parseInt(yearFrom) > parseInt(yearTo) ?
                                                    <div className='errMsg'>Please enter correct year
                                                        range...</div> : null}
                                            </Form>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row verticalAlign={'middle'} centered>
                                        <Grid.Column width={2} textAlign={'center'}>
                                            <div className='filterHeader'>Rating:</div>
                                        </Grid.Column>
                                        <Grid.Column width={9}>
                                            <Form>
                                                <Form.Group widths='equal' className='filter-form-group'>
                                                    <Form.Field>
                                                        <Dropdown search selection clearable
                                                                  options={rating}
                                                                  placeholder='From'
                                                                  value={ratingFrom}
                                                                  onChange={(e, {value}) => setRatingFrom(value)}
                                                        />
                                                    </Form.Field>
                                                    <Form.Field>
                                                        <Dropdown search selection clearable
                                                                  options={rating}
                                                                  placeholder='To'
                                                                  value={ratingTo}
                                                                  onChange={(e, {value}) => setRatingTo(value)}
                                                        />
                                                    </Form.Field>
                                                </Form.Group>
                                                {parseInt(ratingFrom) > parseInt(ratingTo) ?
                                                    <div className='errMsg'>Please enter correct rating
                                                        range...</div> : null}
                                            </Form>

                                        </Grid.Column>

                                    </Grid.Row>
                                    <Grid.Row verticalAlign={'middle'} centered>
                                        <Grid.Column width={11}>
                                            <Button floated='right' color='violet' onClick={clearFilter}>Clear Filters</Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>

                            </Accordion.Content>
                        </Accordion>

                    </Segment>

                    <Sidebar.Pushable>
                        {/*<Sidebar*/}
                        {/*    as={Menu}*/}
                        {/*    animation='overlay'*/}
                        {/*    icon='labeled'*/}
                        {/*    onHide={() => setVisible2(false)}*/}
                        {/*    vertical*/}
                        {/*    visible={visible2}*/}
                        {/*    width='very wide'*/}
                        {/*    direction='top'*/}
                        {/*>*/}

                        {/*    /!*------------------Search Filters--------------------*!/*/}

                        {/*    <Container>*/}
                        {/*        <span>Genre:*/}
                        {/*            <Dropdown search selection multiple clearable*/}
                        {/*                inline*/}
                        {/*                options={genres}*/}
                        {/*                placeholder="--Select--"*/}
                        {/*            />*/}
                        {/*        </span>*/}
                        {/*        <span>Genre:*/}
                        {/*            <Dropdown search selection multiple*/}
                        {/*                      inline*/}
                        {/*                      options={genres}*/}
                        {/*                      placeholder="--Select--"*/}
                        {/*            />*/}
                        {/*        </span>*/}
                        {/*        <span>Genre:*/}
                        {/*            <Dropdown search selection multiple*/}
                        {/*                      inline*/}
                        {/*                      options={genres}*/}
                        {/*                      placeholder="--Select--"*/}
                        {/*            />*/}
                        {/*        </span>*/}
                        {/*    </Container>*/}
                        {/*</Sidebar>*/}
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
