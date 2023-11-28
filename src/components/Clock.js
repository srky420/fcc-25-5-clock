import React, { useState, useEffect, useRef } from "react";
import { Button, Card, CardHeader, CardBody, Row, Col } from "react-bootstrap";

// Define component
export default function Clock() {

    // Reference for audio clip
    const audio = useRef(null);

    // Define state
    const [state, setState] = useState({
        breakLength: 5,
        sessionLength: 25,
        seconds: 0,
        minutes: 25,
        currentTimer: 'Session',
        active: false,
        timer: null,
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
                if (audio.current.currentTime > 0) {
                    audio.current.currentTime = 0;
                }
                audio.current.play().catch(err => console.log(err));
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
        audio.current.currentTime = 0;
        audio.current.pause();
        setState((state) => {
            clearInterval(state.timer);
            return {
                breakLength: 5,
                sessionLength: 25,
                seconds: 0,
                minutes: 25,
                currentTimer: 'Session',
                active: false,
                timer: null,
            }
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
        <div className="text-center">
            <Card style={{ width: 350, fontFamily: 'Times New Roman, Times, serif' }}>
                <CardHeader>
                    <h1 className="my-2">25 + 5 Clock</h1>
                </CardHeader>
                <CardBody className="text-center">
                    <Row>
                        {/* Break length */}
                        <Col className="text-center mt-2">
                     
                            <h5 id="break-label">Break Length</h5>
                            <Button variant="light" className="rounded-5" id="break-decrement" disabled={state.active} onClick={() => handleDecrement('break')}>
                                <i className="fa fa-minus"></i>
                            </Button>
                            <span className="px-2 h5" id="break-length">{ state.breakLength }</span>
                            <Button variant="light" className="rounded-5" id="break-increment" disabled={state.active} onClick={() => handleIncrement('break')}>
                                <i className="fa fa-plus"></i>
                            </Button>
                        </Col>
                        
                        {/* Session length */}
                        <Col className="text-center mt-2">
                            <h5 id="session-label">Session Length</h5>
                            <Button variant="light" className="rounded-5" id="session-decrement" disabled={state.active} onClick={() => handleDecrement('session')}>
                                <i className="fa fa-minus"></i>
                            </Button>
                            <span className="px-2 h5" id="session-length">{ state.sessionLength }</span>
                            <Button variant="light" className="rounded-5" id="session-increment" disabled={state.active} onClick={() => handleIncrement('session')}>
                                <i className="fa fa-plus"></i>
                            </Button>
                        </Col>
                    </Row>

                    {/* Timer */}
                    <h2 className="my-3" id="timer-label">{ state.currentTimer }</h2>
                    <h1 className={ state.minutes <= 0 ? "text-danger" : "" } id="time-left">
                        <span>{ state.minutes < 10 ? `0${state.minutes}` : state.minutes }</span>
                        : 
                        <span>{ state.seconds < 10 ? `0${state.seconds}` : state.seconds }</span>
                    </h1>

                    {/* Timer buttons */}
                    <Button variant="dark" size="lg" className="my-4 mx-1" id="start_stop" onClick={handleActivation}>
                        <i className={state.active ? "fa fa-pause" : "fa fa-play"}></i>
                    </Button>
                    <Button variant="dark" size="lg" className="my-4 mx-1" id="reset" onClick={handleReset}>
                        <i className="fa fa-refresh"></i>
                    </Button>
                </CardBody>
            </Card>

            {/* Audio clip */}
            <audio src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav" ref={audio} id="beep" /> 
            <p className="my-2 text-light">
                By <a href="https://github.com/srky420/" target="_blank" className="link-light text-decoration-none" style={{ fontWeight: 'bold' }}>Shahrukh</a>
            </p>
        </div>
    )
}