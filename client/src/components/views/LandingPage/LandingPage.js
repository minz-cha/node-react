import React, { useEffect, useState } from 'react'
import axios from 'axios'

function LandingPage() {

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (e) => {
        setEmail(e.target.value);
    };

    const onPasswordHandler = (e) => {
        setPassword(e.target.value);
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();

        console.log('Email', Email)
        console.log('Password', Password)
    };


    useEffect(() => {
        axios.get('/api/hello')
            .then(response => console.log(response))
    }, [])

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type='email' value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type='password' value={Password} onChange={onPasswordHandler} />

                <br />
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LandingPage
