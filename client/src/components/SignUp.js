import React, {useEffect, useState} from 'react';
import '../style/SignUp.css';
import {Form, Container, Grid, Divider, Message} from "semantic-ui-react";

const SignUp = () => {
    const [firstName, setFirstName] = useState({
        v: '',
        e: false
    })
    const [lastName, setLastName] = useState({
        v: '',
        e: false
    })
    const [email, setEmail] = useState({
        v: '',
        e: false
    })
    const [password, setPassword] = useState({
        v: '',
        e: false
    })
    const [submit, setSubmit] = useState({
        formError: false,
        loginError: false,
        success: false
    })
    const handleFirstName = (e, {value}) => {
        const pattern = new RegExp(/^[a-zA-Z ]+$/)
        if (pattern.test(value) || value === "") {
            setFirstName({
                v: value,
                e: false
            })
        } else {
            setFirstName({
                v: value,
                e: true
            })
        }
    }
    const handleLastName = (e, {value}) => {
        const pattern = new RegExp(/^[a-zA-Z ]+$/)
        if (pattern.test(value) || value === "") {
            setLastName({
                v: value,
                e: false
            })
        } else {
            setLastName({
                v: value,
                e: true
            })
        }
    }
    const handleEmail = (e, {value}) => {
        const pattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (pattern.test(value) || value === "") {
            setEmail({
                v: value,
                e: false
            })
        } else {
            setEmail({
                v: value,
                e: true
            })
        }
    }
    const handleSubmit = () => {
        if (firstName.e || lastName.e || email.e || firstName.v === "" || lastName.v === "" || email.v === "" || password.v === "") {
            if (firstName.v === "") {
                setFirstName({
                    v: firstName.v,
                    e: true
                })
            }
            if (lastName.v === "") {
                setLastName({
                    v: '',
                    e: true
                })
            }
            if (email.v === "") {
                setEmail({
                    v: '',
                    e: true
                })
            }
            if (password.v === "") {
                setPassword({
                    v: '',
                    e: true
                })
            }
            setSubmit({
                formError: true,
                loginError: false,
                success: false
            })

        }
        //TODO: API call to Register
    }
    useEffect(() => {
        setSubmit({
            formError: false,
            loginError: false,
            success: false
        })
    }, [firstName.v, lastName.v, email.v, password.v])
    return (
        <Container>
            <Grid padded className='signup-container'>
                <Grid.Column>
                    <Form size='large' onSubmit={handleSubmit} warning={submit.formError}>
                        <Message
                            className={(submit.formError || submit.loginError || submit.success) ?
                                'message-space-hide' : 'message-space-show'}
                            header='handle space'
                        />
                        <Message
                            warning
                            header='Please give a valid input!'
                        />
                        <Message
                            error
                            header='Failed to Register!'
                        />
                        <Message
                            success
                            header='Register Success'
                        />
                        <Form.Input fluid placeholder='First name' name='firstName'
                                    value={firstName.v}
                                    onChange={handleFirstName}
                                    error={firstName.e}
                        />
                        <Form.Input fluid placeholder='Last Name' name='lastName'
                                    value={lastName.v}
                                    onChange={handleLastName}
                                    error={lastName.e}
                        />
                        <Form.Input placeholder='Email' name='email'
                                    value={email.v}
                                    onChange={handleEmail}
                                    error={email.e}
                        />
                        <Form.Input placeholder='Password' type='password' name='password'
                                    value={password.v}
                                    onChange={(e, {value}) => setPassword({v:value,e:false})}
                                    error={password.e}
                        />
                        <Form.Button fluid size='large'>Submit</Form.Button>
                    </Form>
                </Grid.Column>
            </Grid>
            <Divider/>
        </Container>
    );
}

export default SignUp;
