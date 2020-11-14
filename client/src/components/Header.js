import {
    Accordion,
    Button, Container,
    Dropdown,
    Form,
    Grid,
    Icon,
    Image,
    Input,
    Popup,
    Segment,
    Transition
} from "semantic-ui-react";
import {useHistory, useLocation} from "react-router-dom";
import images from "../config/images";
import MenuCustom from "./MenuCustom";
import genres from "../config/movieGenres";
import rating from "../config/ratings";
import React, {useEffect, useState} from "react";
import {getUserInfo, isAuthenticated} from "../config/session";

const Header = ({setVisible, setActiveIndex}) => {

    const history = useHistory()
    const location = useLocation()
    const [user, setUser] = useState({
        id: '',
        firstName: '',
        url: ''
    })
    const [isLogin, setIsLogin] = useState(false)
    const [filterVisible, setFilterVisible] = useState(false)
    const [open, setOpen] = React.useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [filter, setFilter] = useState({
        title: false,
        description: false,
        cast: false,
        wishList: false,
        genres: [],
        yearFrom: '',
        yearTo: '',
        ratingFrom: null,
        ratingTo: null
    })
    const [yearError, setYearError] = useState(false)
    const [ratingError, setRatingError] = useState(false)
    const handleTab = (visible, index) => {
        setVisible(visible)
        setActiveIndex(index)
    }

    const pageType = history.location.pathname.slice(1)

    const handleSearch = () => {
        //send search keyword to home
        if (parseInt(filter.yearFrom) > parseInt(filter.yearTo)) {
            setYearError(true)
        } else if (parseInt(filter.ratingFrom) > parseInt(filter.ratingTo)) {
            setRatingError(true)
        } else if (searchInput !== '' && !yearError && !ratingError) {
            history.push({
                pathname: '/search',
                isSearch: true,
                keyword: searchInput,
                filter: filter
            })
        } else {
            alert("Please enter a keyword...")
        }

        // alert("title: " + filter.title + "\ndes: " + filter.description + "\ncast: " + filter.cast + "\nwishlist: " + filter.wishList +
        //     "\ngenres: " + filter.genres + "\nyear from: " + filter.yearFrom + "\nyear to: " + filter.yearTo + "\nrating from: " + filter.ratingFrom +
        //     "\nrating to: " + filter.ratingTo +
        //     "\npath is: " + location.pathname
        // )
    }

    const clearFilter = () => {
        setFilterVisible(!filterVisible)
        setFilter({
            title: false,
            description: false,
            cast: false,
            wishList: false,
            genres: [],
            yearFrom: '',
            yearTo: '',
            ratingFrom: null,
            ratingTo: null
        })

        if (pageType === 'search') {
            history.push('/')
        }
    }

    const yearPattern = new RegExp(/^\d+$/)

    useEffect(() => {
        setIsLogin(isAuthenticated())
        setUser(getUserInfo())
        setFilterVisible(false)
    }, [location])

    return (
        <Segment vertical className='header-segment'>
            <Accordion>
                <Container className='header-container'>
                <Accordion.Title active={filterVisible} index={0}>
                        <Grid columns={3} verticalAlign='middle'>
                            <Grid.Column width={2}>
                                {/*-------------------------Logo-----------------------*/}
                                    <Image className='logo' src={images.logo} floated='left' size={"small"} onClick={() => history.push('/')}/>
                                {/*---------------------Search Bar----------------------*/}
                            </Grid.Column>
                            <Grid.Column width={9}>
                                <Input fluid className='header-search' type='text' placeholder='Search...' action
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
                                            onClick={() => setFilterVisible(!filterVisible)}>
                                        <Icon className='filter-icon' name='filter'/>Filter
                                    </Button>
                                    <Button className='header-button' type='submit'
                                            onClick={handleSearch}>Search</Button>
                                </Input>
                            </Grid.Column>
                            <Grid.Column width={5}>
                                {!isLogin ?

                                    /*---------------Login or Register Button----------------*/

                                    <Button.Group size='medium' floated='right'>
                                        <Button className='custom-menu header-button' attached='left'
                                                onClick={() => handleTab(true, 0)}>Login</Button>
                                        {/*<Button.Or className='custom-menu'/>*/}
                                        <Button className='custom-menu header-button' attached='right'
                                                onClick={() => handleTab(true, 1)}>Register</Button>
                                    </Button.Group>
                                    :

                                    /*--------------------User Menu Button-------------------*/

                                    <Grid className='menu-div' verticalAlign='middle'>
                                    <Grid.Column width={14} textAlign='right'>
                                        <span className='menu-text'><h3>{user.firstName}</h3></span>
                                    </Grid.Column>
                                        <Grid.Column width={2} className='header-profile-url'>
                                        <Popup wide
                                               position='bottom right'
                                               trigger={
                                                   <Image src={user.url === '' ? images.no_profile : user.url} circular
                                                          floated='right' size='medium'
                                                   />
                                               }
                                               on='click'
                                               open={open}
                                               onOpen={() => setOpen(true)}
                                               onClose={() => setOpen(false)}
                                        >
                                            <MenuCustom setOpen={setOpen}/>
                                        </Popup>
                                        </Grid.Column>
                                    </Grid>
                                }
                            </Grid.Column>
                        </Grid>
                </Accordion.Title>
                {/*---------------------slide down Filter ----------------------*/}

                <Transition.Group animation='slide down' duration={200}>
                    {filterVisible && (
                        <Accordion.Content active={filterVisible}>

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
                                                    label='Description'
                                                    value='d'
                                                    checked={filter.description}
                                                    onClick={() => setFilter({
                                                        ...filter,
                                                        description: !filter.description
                                                    })}
                                                />
                                                <Form.Radio
                                                    label='Cast'
                                                    value='c'
                                                    checked={filter.cast}
                                                    onClick={() => setFilter({...filter, cast: !filter.cast})}
                                                />
                                                <Form.Radio
                                                    label='Wishlist'
                                                    value='w'
                                                    checked={filter.wishList}
                                                    onClick={() => setFilter({...filter, wishList: !filter.wishList})}
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
                                                  value={filter.genres}
                                                  onChange={(e, {value}) => setFilter({...filter, genres: value})}
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
                                                <Form.Input placeholder='From YYYY'
                                                            onChange={(e, {value}) => setFilter({
                                                                ...filter,
                                                                yearFrom: value
                                                            })}
                                                />
                                                <Form.Input placeholder='To YYYY'
                                                            onChange={(e, {value}) => setFilter({
                                                                ...filter,
                                                                yearTo: value
                                                            })}
                                                />
                                            </Form.Group>
                                            {parseInt(filter.yearFrom) > parseInt(filter.yearTo) || !yearPattern.test(filter.yearFrom) || !yearPattern.test(filter.yearTo)
                                                ? (filter.yearFrom === '' && filter.yearTo === ''
                                                    ? null :
                                                    <div className='errMsg'>Please enter correct year range...</div>)
                                                : null}
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
                                                              value={filter.ratingFrom}
                                                              onChange={(e, {value}) => setFilter({
                                                                  ...filter,
                                                                  ratingFrom: value
                                                              })}
                                                    />
                                                </Form.Field>
                                                <Form.Field>
                                                    <Dropdown search selection clearable
                                                              options={rating}
                                                              placeholder='To'
                                                              value={filter.ratingTo}
                                                              onChange={(e, {value}) => setFilter({
                                                                  ...filter,
                                                                  ratingTo: value
                                                              })}
                                                    />
                                                </Form.Field>
                                            </Form.Group>
                                            {parseInt(filter.ratingFrom) > parseInt(filter.ratingTo) ?
                                                <div className='errMsg'>Please enter correct rating
                                                    range...</div> : null}
                                        </Form>

                                    </Grid.Column>

                                </Grid.Row>
                                <Grid.Row verticalAlign={'middle'} centered>
                                    <Grid.Column width={11}>
                                        <Button floated='right' color='violet' onClick={handleSearch}>Search</Button>
                                        <Button floated='right' onClick={clearFilter}>Clear
                                            Filters</Button>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                        </Accordion.Content>
                    )}
                </Transition.Group>
                </Container>
            </Accordion>

        </Segment>
    )
}
export default Header
