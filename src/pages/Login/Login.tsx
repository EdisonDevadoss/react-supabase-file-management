import React, { useState, useEffect } from 'react';

import { Button, Form } from 'react-bootstrap';

const Login = (props: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    console.log(email, password);
    props.onLogin({ email, password });
  };

  return (
    <Form className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </Form.Group>

      <Button variant="primary" onClick={onLogin}>
        Submit
      </Button>
    </Form>
  );
};

export default Login;
