import React, { useRef, useImperativeHandle, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";


const Timer = forwardRef(({ expiryTimestamp }, ref) => {
    let navigate = useNavigate();
    const {
        seconds,
        minutes,
    } = useTimer({
        expiryTimestamp, onExpire: () => {
            alert('Session Expired!! Login again!!');
            sessionStorage.removeItem("api_CloudBoltToken");
<<<<<<< HEAD
            sessionStorage.removeItem("currentUser");
=======
>>>>>>> a1938710be3a105b5143f81c8efabb4f515332ab
            navigate("/login");
        }
    });

    const totalSecondsRef = useRef(0);

    const returnTotalSeconds = () => {
        const totalSeconds = minutes * 60 + seconds;
        totalSecondsRef.current = totalSeconds;
        return totalSeconds;
    };

    useImperativeHandle(ref, () => ({
        returnTotalSeconds,
    }));
    const formatTime = (time) => {
        return time < 10 ? `0${time}` : time;
    }

    return (
        <div>
            <h4 className="text-white my-auto" style={{ marginRight: "0px" }}>{`${formatTime(minutes)} : ${formatTime(seconds)}`}</h4>
        </div>
    );
});

export default Timer;
