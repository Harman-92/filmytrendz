import React from 'react';
import '../style/Login.css';
import {Button, Container, Divider, Form, Grid, Message} from "semantic-ui-react";

const Login = () => (
    <Container>
        <Grid padded className='signup-container'>
            <Grid.Column>
                <Form size='large'>
                    <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address'/>
                    <Form.Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                    />

                    <Button fluid size='large'>
                        Login
                    </Button>
                </Form>
                <Message>
                    New to us? <a href='#'>Sign Up</a>
                </Message>
            </Grid.Column>
        </Grid>
        <Divider/>
    </Container>
);

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
