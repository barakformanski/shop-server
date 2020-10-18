import React, { useContext } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";
import { Link } from "react-router-dom";
import Context from '../../component/Context.js';

function Login() {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    const { PREFIX,email, setEmail, password, setPassword, name, setName, userLogin, setUserLogin } = useContext(Context);

    function validateForm() {

        return email.length > 0 && password.length > 0;

    }

    function changeName() {
        setUserLogin(true)
    }

    function handleSubmit(event) {

        event.preventDefault();

    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
                <FormGroup controlId="name" bsSize="large">
                    <ControlLabel>Name</ControlLabel>
                    <FormControl
                        autoFocus
                        type="string"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        autoFocus
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                </FormGroup>
                <Link to={`${PREFIX}/`}>

                    <Button block bsSize="large" disabled={!validateForm()} type="submit" onClick={changeName}>
                        Login
        </Button>
                </Link>

            </form>
        </div >
    );
}
export default Login;