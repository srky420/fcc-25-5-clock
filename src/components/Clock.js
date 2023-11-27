import React, { useState, useEffect } from "react";

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
                timer: setInterval(reduceTimer, 100)
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

    const handleIncrement = (timerName) => {
        if (timerName === 'break') {
            setState((state) => ({
                ...state,
                breakLength: state.breakLength < 60 ? state.breakLength + 1 : state.breakLength,
                minutes: state.currentTimer === 'Break' ? state.breakLength < 60 ? state.breakLength + 1 : state.breakLength : state.minutes,
                seconds: 0
            }));
        }
        if (timerName === 'session') {
            setState((state) => ({
                ...state,
                sessionLength: state.sessionLength < 60 ? state.sessionLength + 1 : state.sessionLength,
                minutes: state.currentTimer === 'Session' ? state.sessionLength < 60 ? state.sessionLength + 1 : state.sessionLength : state.minutes,
                seconds: 0
            }));
        }
    }

    const handleDecrement = (timerName) => {
        if (timerName === 'break') {
            setState((state) => ({
                ...state,
                breakLength: state.breakLength > 1 ? state.breakLength - 1 : state.breakLength,
                minutes: state.currentTimer === 'Break' ? state.breakLength > 1 ? state.breakLength - 1 : state.breakLength : state.minutes,
                seconds: 0
            }));
        }
        if (timerName === 'session') {
            setState((state) => ({
                ...state,
                sessionLength: state.sessionLength > 1 ? state.sessionLength - 1 : state.sessionLength,
                minutes: state.currentTimer === 'Session' ? state.sessionLength > 1 ? state.sessionLength - 1 : state.sessionLength : state.minutes,
                seconds: 0
            }));
        }
    }

    return (
        <div>
            <div>
                <p>Break Length: { state.breakLength }</p>
                <button disabled={state.active} onClick={() => handleIncrement('break')}>+</button>
                <button disabled={state.active} onClick={() => handleDecrement('break')}>-</button>
            </div>
            <div>
                <p>Session Length: { state.sessionLength }</p>
                <button disabled={state.active} onClick={() => handleIncrement('session')}>+</button>
                <button disabled={state.active} onClick={() => handleDecrement('session')}>-</button>
            </div>
            <div>
                <p>{ state.currentTimer }</p>
                <p><span>{ state.minutes < 10 ? `0${state.minutes}` : state.minutes }</span>:<span>{ state.seconds < 10 ? `0${state.seconds}` : state.seconds }</span></p>
                <button onClick={handleActivation}>Play/Pause</button>
            </div>
        </div>
    )
}