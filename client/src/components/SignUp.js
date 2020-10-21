import React, {useState} from 'react';
import '../style/SignUp.css';
import {Form, Container, Grid, Divider, Message} from "semantic-ui-react";

const SignUp = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleEmail = (e) => {
        var pattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!pattern.test(e.target.value)) {
            console.log("Please enter valid email address.")
        } else {
            setEmail(e.target.value)
        }
    }
    const handlePassword = (e) => {
        //TODO: Password Validation
        setPassword(e.target.value)
    }
    const handleSubmit = () => {
        console.log('hello')
    }
    return (
        <Container>
            <Grid padded className='signup-container'>
                <Grid.Column>
                    <Form size='large' onSubmit={handleSubmit}>
                        <Message
                            error
                            header='Action Forbidden'
                            content='You can only sign up for an account once with a given e-mail address.'
                        />
                        <Message
                            warning
                            header='Could you check something!'
                            list={[
                                'That e-mail has been subscribed, but you have not yet clicked the verification link in your e-mail.',
                            ]}
                        />
                        <Message
                            success
                            header='Form Completed'
                            content="You're all signed up for the newsletter"
                        />
                        <Form.Input fluid placeholder='First name' name='firstName'
                                    defaultValue={firstName}
                                    onChange={(e, {v}) => setFirstName(v)}
                        />
                        <Form.Input fluid placeholder='Last Name' name='lastName'
                                    defaultValue={lastName}
                                    onChange={(e, {v}) => setLastName(v)}
                        />
                        <Form.Input control={'input'} placeholder='Email' name='email' defaultValue={email} onBlur={handleEmail}/>
                        <Form.Input control={'input'} placeholder='Password' type='password' name='password' defaultValue={password}
                                    onBlur={handlePassword}/>
                        <Form.Button fluid size='large'>Submit</Form.Button>
                    </Form>
                </Grid.Column>
            </Grid>
            <Divider/>
        </Container>
    );
}

export default SignUp;
