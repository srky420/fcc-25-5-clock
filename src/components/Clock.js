import React, { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardBody, Row, Col } from "react-bootstrap";

// Define component
export default function Clock() {

    // Define state
    const [state, setState] = useState({
        breakLength: 5,
        sessionLength: 25,
        seconds: 0,
        minutes: 25,
        currentTimer: 'Session',
        active: false,
        timer: null
    });

    // Define effect
    useEffect(() => {
        if (state.active) {
            setState((state) => ({
                ...state,
                timer: setInterval(reduceTimer, 1000)
            }))
        }
        else {
            clearInterval(state.timer);
        }
    }, [state.active]);

    // Reduce timer
    const reduceTimer = () => {
        setState((state) => {
            // Toggle timer between break and session
            if (state.minutes === 0 && state.seconds === 0) {
                return {
                    ...state,
                    seconds: 0,
                    minutes: state.currentTimer === 'Session' ? state.breakLength : state.sessionLength,
                    currentTimer: state.currentTimer === 'Session' ? 'Break' : 'Session'
                }
            }
            return {
                ...state,
                seconds: state.seconds <= 0 ? 59 : state.seconds - 1,
                minutes: state.seconds <= 0 ? state.minutes - 1 : state.minutes
            };
        });
    }

    // Handle timer play/pause
    const handleActivation = () => {
        setState((state) => ({
            ...state,
            active: !state.active
        }))
    }

    // Handle reset to default values
    const handleReset = () => {
        clearInterval(state.timer);
        setState({
            breakLength: 5,
            sessionLength: 25,
            seconds: 0,
            minutes: 25,
            currentTimer: 'Session',
            active: false,
            timer: null
        });
    }

    // Handle increment for both Session and Break
    const handleIncrement = (timerName) => {
        if (timerName === 'break') {
            setState((state) => ({
                ...state,
                breakLength: state.breakLength < 60 ? state.breakLength + 1 : state.breakLength,
                minutes: state.currentTimer === 'Break' ? state.breakLength < 60 ? state.breakLength + 1 : state.breakLength : state.minutes,
                seconds: state.currentTimer === 'Break' ? 0 : state.seconds
            }));
        }
        if (timerName === 'session') {
            setState((state) => ({
                ...state,
                sessionLength: state.sessionLength < 60 ? state.sessionLength + 1 : state.sessionLength,
                minutes: state.currentTimer === 'Session' ? state.sessionLength < 60 ? state.sessionLength + 1 : state.sessionLength : state.minutes,
                seconds: state.currentTimer === 'Session' ? 0 : state.seconds
            }));
        }
    }

    // Handle decrement for both Session and Break
    const handleDecrement = (timerName) => {
        if (timerName === 'break') {
            setState((state) => ({
                ...state,
                breakLength: state.breakLength > 1 ? state.breakLength - 1 : state.breakLength,
                minutes: state.currentTimer === 'Break' ? state.breakLength > 1 ? state.breakLength - 1 : state.breakLength : state.minutes,
                seconds: state.currentTimer === 'Break' ? 0 : state.seconds
            }));
        }
        if (timerName === 'session') {
            setState((state) => ({
                ...state,
                sessionLength: state.sessionLength > 1 ? state.sessionLength - 1 : state.sessionLength,
                minutes: state.currentTimer === 'Session' ? state.sessionLength > 1 ? state.sessionLength - 1 : state.sessionLength : state.minutes,
                seconds: state.currentTimer === 'Session' ? 0 : state.seconds
            }));
        }
    }

    return (
        <Card style={{ width: 340, fontFamily: 'times-new-roman' }}>
            <CardHeader>
                <Row>
                    <Col className="text-center mt-2">
                        <h5>Break Length</h5>
                        <Button variant="light" className="rounded-5" disabled={state.active} onClick={() => handleDecrement('break')}><i className="fa fa-minus"></i></Button>
                        <span className="px-2 h5">{ state.breakLength }</span>
                        <Button variant="light" className="rounded-5"  disabled={state.active} onClick={() => handleIncrement('break')}><i className="fa fa-plus"></i></Button>
                    </Col>
                    <Col className="text-center mt-2">
                        <h5>Session Length</h5>
                        <Button variant="light" className="rounded-5" disabled={state.active} onClick={() => handleDecrement('session')}><i className="fa fa-minus"></i></Button>
                        <span className="px-2 h5">{ state.sessionLength }</span>
                        <Button variant="light" className="rounded-5" disabled={state.active} onClick={() => handleIncrement('session')}><i className="fa fa-plus"></i></Button>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody className="text-center">
                <h2 className="my-3">{ state.currentTimer }</h2>
                <h1 className={ state.minutes <= 0 ? "text-danger" : "" }>
                    <span>{ state.minutes < 10 ? `0${state.minutes}` : state.minutes }</span>
                     : 
                    <span>{ state.seconds < 10 ? `0${state.seconds}` : state.seconds }</span>
                </h1>
                <Button variant="dark" className="my-4 mx-1" onClick={handleActivation}>
                    <i className={state.active ? "fa fa-pause" : "fa fa-play"}></i>
                </Button>
                <Button variant="dark" className="my-4 mx-1" onClick={handleReset}>
                    <i className="fa fa-refresh"></i>
                </Button>
            </CardBody>
        </Card>
    )
}