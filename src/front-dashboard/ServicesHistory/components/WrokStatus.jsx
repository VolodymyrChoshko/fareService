import { useState, useEffect, memo } from "react";
import moment from "moment";

const WorkStatus = memo(({ serviceRequest }) => {
    const [state, setState] = useState({});
    useEffect(() => {
        const interval = setInterval(() => {
            setState((state) => ({ ...state, second: state.second + 1 }));
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <>
            {
                (() => {
                    if (serviceRequest.status === "PENDING") {
                        return "Pending";
                    }
                    if (serviceRequest.working_status == null) {
                        return "Not Started yet!";
                    }

                    if (serviceRequest.working_status == "STARTED") {
                        if (serviceRequest?.worked_times?.length > 0) {
                            let breakTime = 0;
                            let started = moment(
                                serviceRequest.worked_times[0].created_at
                            );
                            serviceRequest?.worked_times?.forEach((time) => {
                                if (time.is_pause && time.updated_at != null) {
                                    breakTime = moment(time.created_at).diff(
                                        time.updated_at,
                                        "seconds"
                                    );
                                }
                            });
                            let now = moment();
                            let duration = moment.duration(now.diff(started));
                            duration = duration.subtract(
                                moment(breakTime),
                                "seconds"
                            );
                            // `${ duration.asDays().toFixed( 0 ) > 0 ? duration.asDays().toFixed(0) + "d" : ""}`
                            return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
                        }
                        return "Started";
                    }

                    if (serviceRequest.working_status == "PAUSED") {
                        return "Paused";
                    }

                    if (
                        serviceRequest.working_status == "ENDED" &&
                        serviceRequest.is_completed == true
                    ) {
                        return "Completed";
                    }
                })()
                // serviceRequest?.payable_amount != null ? "$"+(parseInt(serviceRequest?.payable_amount) + parseInt(serviceRequest?.paid_amount)) : "$"+serviceRequest?.paid_amount
            }
        </>
    );
});

export { WorkStatus };
