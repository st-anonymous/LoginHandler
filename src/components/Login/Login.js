import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context'
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
  if(action.type === 'USER_INPUT'){
    return {value: action.val, isValid: action.val.includes('@')}
  }
  if(action.type === 'INPUT_BLUR'){
    return {value: state.value, isValid: state.value.includes('@')}
  }
  return {value: '', isValid: false}
}

const passwordReducer = (state, action) => {
  if(action.type === 'USER_INPUT'){
    return {value: action.val, isValid: action.val.trim().length > 6}
  }
  if(action.type === 'INPUT_BLUR'){
    return {value: state.value, isValid: state.value.trim().length > 6}
  }
  return {value: '', isValid: false}
}

const Login = () => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailStatus, dispatchedEmail] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  })

  const [passwordStatus, dispatchedPassword] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  })

  const ctx = useContext(AuthContext)

  const {isValid: isEmailValid} = emailStatus
  const {isValid: isPasswordValid} = passwordStatus

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!');
      setFormIsValid(
        emailStatus.value.includes('@') && passwordStatus.value.trim().length > 6
      );
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [isEmailValid, isPasswordValid]);

  const emailChangeHandler = (event) => {
    dispatchedEmail({type: 'USER_INPUT', val: event.target.value});
  };

  const passwordChangeHandler = (event) => {
    dispatchedPassword({type: 'USER_INPUT', val: event.target.value})
  };

  const validateEmailHandler = () => {
    dispatchedEmail({type: 'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    dispatchedPassword({type: 'INPUT_BLUR'})
  };

  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const submitHandler = (event) => {
    event.preventDefault();
    if(formIsValid) ctx.onLogin(emailStatus.value, passwordStatus.value);
    else if (!isEmailValid) {
      emailInputRef.current.focus()
    }
    else if (!isPasswordValid) {
      passwordInputRef.current.focus()
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
          ref={emailInputRef}
          id='email' 
          label='E-Mail'
          type='email'
          isValid={isEmailValid}
          onBlur={validateEmailHandler}
          onChange={emailChangeHandler}
          value={emailStatus.value}
        ></Input>
        <Input 
          ref={passwordInputRef}
          id='password' 
          label='Password'
          type='password'
          isValid={isPasswordValid}
          onBlur={validatePasswordHandler}
          onChange={passwordChangeHandler}
          value={passwordStatus.value}
        ></Input>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
