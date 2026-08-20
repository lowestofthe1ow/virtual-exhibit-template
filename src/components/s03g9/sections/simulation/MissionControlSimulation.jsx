import { useEffect, useRef, useState } from 'react'; //state-> for changing values

const STAGES = { //game flow
    MENU: 'menu',
    BRIEFING: 'briefing',
    ALARM: 'alarm',
    TASK1: 'task1',
    STATUS1: 'status1',
    TASK2: 'task2',
    STATUS2: 'status2',
    TASK3: 'task3',
    FINAL: 'finalStatus',
    END_ABORT: 'ending-aborted',
    END_SUCCESS: 'ending-success',
    END_DANGER: 'ending-danger',
    END_VICTORY: 'ending-victory',
};

const briefingSlides = [
    {
        mode: 'MISSION BRIEFING',
        text: [
            'Hello, Engineer.',
            "You are entering Mission Control during Apollo 11's powered descent.",
            'The Lunar Module Eagle has separated from Columbia and is now dropping toward the Moon.',
            'Neil Armstrong and Buzz Aldrin are inside Eagle. Michael Collins remains in lunar orbit above them.',
            'The landing is already in motion.'
        ]
    },
    {
        mode: 'REAL-TIME GUIDANCE',
        text: [
            'Eagle is not simply falling.',
            "The Apollo Guidance Computer is guiding the descent, reading data, updating navigation, and helping control the Lunar Module's movement.",
            'But this computer has limited memory and processing power.',
            'It must decide which tasks matter most while the landing continues in real time.'
        ]
    },
    {
        mode: '1202 PROGRAM ALARM',
        text: [
            'A few minutes before landing, the display flashes a 1202 program alarm.',
            'The alarm does not mean I am dead.',
            'It means I am overloaded.',
            'Too many jobs are demanding attention, and I must protect the tasks needed for guidance, navigation, and control.'
        ]
    },
    {
        mode: 'MISSION CONTROL DECISION',
        text: [
            'Mission Control has only seconds to decide what this alarm means.',
            'If critical tasks are still protected, Eagle may continue.',
            'If the overload threatens landing control, the safe call is ABORT.',
            'Your task is to read my status, choose which tasks to protect, and decide whether the mission remains GO.'
        ]
    },
    {
        mode: 'SYSTEM PRINCIPLE',
        text: [
            'Remember this, Engineer:',
            'A real-time system does not survive by doing everything.',
            'It survives by doing the most important things first.',
            'Stand by for the 1202 alarm.'
        ]
    }
];

/* ------------ SYSTEM STATUS ------------ */
function getRiskLevel(computerLoad) {
    if (computerLoad > 110) {
        return 'Critical Overload';
    }
    if (computerLoad > 100) {
        return 'Overloaded';
    }
    if (computerLoad === 100) {
        return 'Controlled';
    }
    return 'Stable';
}

function computeRecommendation(computerLoad) {
    return computerLoad <= 100 ? 'GO' : 'ABORT';
}

function getSystemStatus(stage) {
    switch (stage) {
        case STAGES.MENU:
        case STAGES.ALARM:
            return '1202 Alarm On';
        case STAGES.TASK1:
        case STAGES.STATUS1:
        case STAGES.TASK2:
        case STAGES.STATUS2:
        case STAGES.TASK3:
            return 'Prioritizing Tasks';
        case STAGES.FINAL:
            return 'Finalizing Mission';
        case STAGES.END_ABORT:
            return 'MISSION ABORTED';
        case STAGES.END_SUCCESS:
            return 'MISSION DESCENT SUCCESSFUL';
        case STAGES.END_DANGER:
            return 'MISSION DANGEROUS OUTCOME';
        case STAGES.END_VICTORY:
            return 'LUNAR LANDING SUCCESSFUL';
        default:
            return '1202 ALARM';
    }
}

function getStageHeader(stage) {
    switch (stage) {
        case STAGES.ALARM:
            return 'ALARM DETECTED';
        case STAGES.TASK1:
        case STAGES.TASK2:
        case STAGES.TASK3:
            return 'TASK PRIORITY REVIEW';
        case STAGES.STATUS1:
        case STAGES.STATUS2:
            return 'STATUS CHECK';
        case STAGES.FINAL:
            return 'FINAL DECISION';
        case STAGES.END_ABORT:
        case STAGES.END_SUCCESS:
        case STAGES.END_DANGER:
            return 'MISSION OUTCOME';
        case STAGES.END_VICTORY:
            return 'TOUCHDOWN CONFIRMED';
        default:
            return '';
    }
}

/* ------------ TEXT DIALOG ------------ */
function getComputerText(stage, context) {
    const { alarmDecision, finalRecommendation, endingMode } = context;

    switch (stage) {
        case STAGES.ALARM:
            return 'Greetings, Engineer. Warning. 1202 Program Alarm detected. The guidance computer is overloaded. Awaiting your decision.';

        case STAGES.TASK1:
            return alarmDecision === 'continue'
                ? 'You continued without checking task priority. Computer load has increased. Select a task to stabilize the system.'
                : 'Task priority status opened. Critical and lower-priority tasks are now visible. Select a task to prioritize.';

        case STAGES.STATUS1:
            return 'System check complete. Review the updated computer load and decide your next action.';

        case STAGES.TASK2:
            return 'Additional system check requested. The computer is still processing descent tasks. Choose the next task priority.';

        case STAGES.STATUS2:
            return 'Another system check complete. Review the updated system condition before making a decision.';

        case STAGES.TASK3:
            return 'Final task-priority check. Choose carefully. This will determine my final GO or ABORT recommendation.';

        case STAGES.FINAL:
            return `Final analysis complete. Recommendation: ${finalRecommendation}. Awaiting your final command.`;

        case STAGES.END_ABORT:
            return endingMode === 'abortAfterGo'
                ? 'Abort confirmed. The system was still within manageable limits, but your command is final.'
                : 'Abort confirmed. Descent sequence terminated. Crew safety is preserved.';

        case STAGES.END_SUCCESS:
            return 'GO confirmed. Guidance remains active. Eagle continues descent under controlled load.';

        case STAGES.END_DANGER:
            return endingMode === 'dangerBeforeFinal'
                ? 'GO confirmed too early. Warning: system verification was incomplete.'
                : 'GO confirmed against recommendation. Warning: overload risk remains unresolved.';

        case STAGES.END_VICTORY:
            return 'Excellent work, Engineer. You kept the system focused under overload and gave Mission Control enough confidence to continue the descent. ';

        default:
            return '';
    }
}

function getDetailText(stage, context) {
    const { alarmDecision, endingMode } = context;

    switch (stage) {
        case STAGES.ALARM:
            return 'The alarm indicates an overload condition during lunar descent. The next decision determines whether the system is checked or left under uncertain load.';

        case STAGES.TASK1:
            return 'Task notes: Guidance keeps descent path; Display refreshes screens; Radar adds sensor data.';

        case STAGES.STATUS1:
            return 'The current load reflects the effect of the first task-priority decision.';

        case STAGES.TASK2:
            return "Task notes: Background runs support calculations; Interface updates crew prompts; Navigation tracks Eagle's motion.";

        case STAGES.STATUS2:
            return 'The system condition has shifted again based on the selected task priority.';

        case STAGES.TASK3:
            return 'Task notes: Telemetry sends extra readings; Attitude controls orientation; Logging records system behavior.';

        case STAGES.FINAL:
            return 'Final analysis is based on the remaining computer load. Manageable load supports GO; unresolved overload supports ABORT.';

        case STAGES.END_ABORT:
            return endingMode === 'abortAfterGo'
                ? 'The Lunar Module pulls away from the landing attempt even though the computer had recovered to a manageable state. The crew remains safe, but the Moon landing is lost.'
                : 'The Lunar Module exits the descent sequence and the landing attempt is called off. The crew remains safe, but the mission objective is not completed.';

        case STAGES.END_SUCCESS:
            return 'The GO decision allows Eagle to continue toward the lunar surface. With critical guidance, navigation, and control tasks protected, the landing sequence remains stable.';

        case STAGES.END_DANGER:
            return endingMode === 'dangerBeforeFinal'
                ? 'The descent continues before the computer status is fully verified. Under unresolved overload, critical landing tasks may lose processing priority.'
                : 'The descent continues despite the ABORT recommendation. The computer remains overloaded, increasing the risk that critical landing functions cannot be maintained.';

        case STAGES.END_VICTORY:
            return 'TRANSMISSION RECEIVED: "The Eagle has landed."';

        default:
            return '';
    }
}

/* ------------ DECISION BUTTONS ------------ */
function getStageButtons(stage) {
    switch (stage) {
        case STAGES.ALARM:
            return [
                { label: 'Abort Mission', action: 'abort' },
                { label: 'Continue Mission', action: 'continue' },
                { label: 'Check Tasks First', action: 'check' },
            ];
        case STAGES.TASK1:
            return [
                { label: 'Landing Guidance', action: 'landing-guidance' },
                { label: 'Display Updates', action: 'display-updates' },
                { label: 'Extra Radar Data', action: 'extra-radar-data' },
            ];
        case STAGES.STATUS1:
            return [
                { label: 'Go Descent', action: 'go-descent' },
                { label: 'Abort Descent', action: 'abort' },
                { label: 'Continue Task Priority', action: 'continue-tasks' },
            ];
        case STAGES.TASK2:
            return [
                { label: 'Background Calculations', action: 'background-calculations' },
                { label: 'Crew Interface Updates', action: 'crew-interface-updates' },
                { label: 'Navigation Updates', action: 'navigation-updates' },
            ];
        case STAGES.STATUS2:
            return [
                { label: 'Go Descent', action: 'go-descent' },
                { label: 'Abort Descent', action: 'abort' },
                { label: 'Continue Task Priority', action: 'continue-tasks' },
            ];
        case STAGES.TASK3:
            return [
                { label: 'Non-Essential Telemetry', action: 'non-essential-telemetry' },
                { label: 'Attitude Control', action: 'attitude-control' },
                { label: 'Diagnostic Logging', action: 'diagnostic-logging' },
            ];
        case STAGES.FINAL:
            return [
                { label: 'Go Descent', action: 'go-descent' },
                { label: 'Abort Descent', action: 'abort' },
            ];
        case STAGES.END_ABORT:
        case STAGES.END_DANGER:
            return [{ label: 'Restart Simulation', action: 'restart' }];
        case STAGES.END_SUCCESS:
            return [{ label: 'Continue', action: 'victory' }];
        case STAGES.END_VICTORY:
            return [{ label: 'Restart Simulation', action: 'restart' }];
        default:
            return [];
    }
}

export default function MissionControlSimulation() {
    /* ------------ INITIAL STATE ------------ */
    const [currentStage, setCurrentStage] = useState(STAGES.MENU);
    const [screenPhase, setScreenPhase] = useState('menu');
    const [computerLoad, setComputerLoad] = useState(105);
    const [loadDirection, setLoadDirection] = useState(0);
    const [alarmDecision, setAlarmDecision] = useState(null);
    const [finalRecommendation, setFinalRecommendation] = useState(null);
    const [endingMode, setEndingMode] = useState('abortEarly');
    const [computerTargetText, setComputerTargetText] = useState('');
    const [computerDisplayText, setComputerDisplayText] = useState('');
    const [detailTargetText, setDetailTargetText] = useState('');
    const [detailDisplayText, setDetailDisplayText] = useState('');
    const [userTargetText, setUserTargetText] = useState('...');
    const [userDisplayText, setUserDisplayText] = useState('...');
    const [pendingNextStage, setPendingNextStage] = useState(null);
    const [pendingLoadDelta, setPendingLoadDelta] = useState(0);
    const [pendingEndingMode, setPendingEndingMode] = useState(null);
    const [briefingIndex, setBriefingIndex] = useState(0);
    const [briefingTargetText, setBriefingTargetText] = useState('');
    const [briefingDisplayText, setBriefingDisplayText] = useState('');
    const lastTapRef = useRef(0);
    const [isMobileFullscreen, setIsMobileFullscreen] = useState(false);

    const riskLevel = getRiskLevel(computerLoad);
    const systemStatus = getSystemStatus(currentStage);
    const buttonConfigs = getStageButtons(currentStage);
    const stageHeader = getStageHeader(currentStage);

    /* ------------ SCREEN SHOW ------------ */
    useEffect(() => {
        if (screenPhase !== 'computerTyping') {
            return;
        }

        let index = 0;
        let nextPhaseTimer;

        setComputerDisplayText('');
        setDetailDisplayText('');

        const intervalId = window.setInterval(() => {
            index += 1;
            setComputerDisplayText(computerTargetText.slice(0, index));

            if (index >= computerTargetText.length) {
                window.clearInterval(intervalId);
                nextPhaseTimer = window.setTimeout(() => {
                    setScreenPhase('detailTyping');
                }, 1000);
            }
        }, 26);

        return () => {
            window.clearInterval(intervalId);
            if (nextPhaseTimer) {
                window.clearTimeout(nextPhaseTimer);
            }
        };
    }, [computerTargetText, screenPhase]);

    useEffect(() => {
        if (screenPhase !== 'detailTyping') {
            return;
        }

        let index = 0;
        let nextPhaseTimer;

        setDetailDisplayText('');

        const intervalId = window.setInterval(() => {
            index += 1;
            setDetailDisplayText(detailTargetText.slice(0, index));

            if (index >= detailTargetText.length) {
                window.clearInterval(intervalId);
                nextPhaseTimer = window.setTimeout(() => {
                    setScreenPhase('ready');
                }, 500);
            }
        }, 20);

        return () => {
            window.clearInterval(intervalId);
            if (nextPhaseTimer) {
                window.clearTimeout(nextPhaseTimer);
            }
        };
    }, [detailTargetText, screenPhase]);

    useEffect(() => {
        if (screenPhase !== 'userTyping') {
            return;
        }

        let index = 0;
        setUserDisplayText('');

        const intervalId = window.setInterval(() => {
            index += 1;
            setUserDisplayText(userTargetText.slice(0, index));

            if (index >= userTargetText.length) {
                window.clearInterval(intervalId);
                setScreenPhase('awaitAdvance');
            }
        }, 24);

        return () => window.clearInterval(intervalId);
    }, [screenPhase, userTargetText]);

    useEffect(() => {
        if (screenPhase !== 'briefingTyping') {
            return;
        }

        let index = 0;
        setBriefingDisplayText('');

        const intervalId = window.setInterval(() => {
            index += 1;
            setBriefingDisplayText(briefingTargetText.slice(0, index));

            if (index >= briefingTargetText.length) {
                window.clearInterval(intervalId);
                setScreenPhase('briefingReady');
            }
        }, 22);

        return () => window.clearInterval(intervalId);
    }, [briefingTargetText, screenPhase]);

    useEffect(() => {
        // Only lock body scroll on actual mobile viewports (≤700px).
        // On desktop/normal screens the page should stay scrollable.
        if (isMobileFullscreen && window.innerWidth <= 700) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMobileFullscreen]);

    /* ------------ SCORING METRIC ------------ */
    function applyPendingMetrics() {
        const nextLoad = computerLoad + pendingLoadDelta;

        setComputerLoad(nextLoad);
        setLoadDirection(pendingLoadDelta > 0 ? 1 : pendingLoadDelta < 0 ? -1 : 0);
        setPendingLoadDelta(0);

        return { nextLoad };
    }

    /* ------------ STAGES ------------ */
    function openStage(nextStage, computerText, detailText) {
        setCurrentStage(nextStage);
        setComputerTargetText(computerText);
        setComputerDisplayText('');
        setDetailTargetText(detailText);
        setDetailDisplayText('');
        setUserTargetText('...');
        setUserDisplayText('...');
        setPendingNextStage(null);
        setPendingEndingMode(null);
        setScreenPhase(nextStage === STAGES.MENU ? 'menu' : 'computerTyping');
    }

    function startSimulation() {
        setComputerLoad(105);
        setLoadDirection(0);
        setAlarmDecision(null);
        setFinalRecommendation(null);
        setEndingMode('abortEarly');
        setPendingNextStage(null);
        setPendingLoadDelta(0);
        setPendingEndingMode(null);
        setBriefingIndex(0);
        setBriefingDisplayText('');
        setBriefingTargetText(briefingSlides[0].text.join('\n'));
        setCurrentStage(STAGES.BRIEFING);
        setScreenPhase('briefingTyping');
        setIsMobileFullscreen(true);
    }

    function restartSimulation() {
        setComputerLoad(105);
        setLoadDirection(0);
        setAlarmDecision(null);
        setFinalRecommendation(null);
        setEndingMode('abortEarly');
        setPendingNextStage(null);
        setPendingLoadDelta(0);
        setPendingEndingMode(null);
        setUserTargetText('...');
        setUserDisplayText('...');
        setBriefingIndex(0);
        setBriefingDisplayText('');
        setBriefingTargetText('');
        setIsMobileFullscreen(false);
        openStage(STAGES.MENU, '', '');
    }

    /* ------------ BRIEFING ADVANCE ------------ */
    function handleBriefingAdvance() {
        if (briefingIndex < briefingSlides.length - 1) {
            const nextIndex = briefingIndex + 1;
            setBriefingIndex(nextIndex);
            setBriefingDisplayText('');
            setBriefingTargetText(briefingSlides[nextIndex].text.join('\n'));
            setScreenPhase('briefingTyping');
        } else {
            openStage(
                STAGES.ALARM,
                getComputerText(STAGES.ALARM, { alarmDecision: null, finalRecommendation: null }),
                getDetailText(STAGES.ALARM, { alarmDecision: null, endingMode: 'abortEarly' })
            );
        }
    }

    /* ------------ NEXT GAME FLOW ------------ */
    function handleAdvance() {
        if (!pendingNextStage) {
            return;
        }

        const nextStage = pendingNextStage;
        const nextEndingMode = pendingEndingMode;
        const { nextLoad } = applyPendingMetrics();
        setPendingNextStage(null);
        setPendingEndingMode(null);

        if (nextStage === STAGES.FINAL) {
            const nextRecommendation = computeRecommendation(nextLoad);
            setFinalRecommendation(nextRecommendation);
            openStage(
                nextStage,
                getComputerText(nextStage, { alarmDecision, finalRecommendation: nextRecommendation }),
                getDetailText(nextStage, { alarmDecision, endingMode })
            );
            return;
        }

        if (nextStage === STAGES.END_ABORT || nextStage === STAGES.END_SUCCESS || nextStage === STAGES.END_DANGER) {
            if (nextEndingMode) {
                setEndingMode(nextEndingMode);
            }

            const nextContext = {
                alarmDecision,
                finalRecommendation,
                endingMode: nextEndingMode ?? endingMode,
            };

            openStage(nextStage, getComputerText(nextStage, nextContext), getDetailText(nextStage, nextContext));
            return;
        }

        const nextContext = {
            alarmDecision,
            finalRecommendation,
            endingMode,
        };

        openStage(nextStage, getComputerText(nextStage, nextContext), getDetailText(nextStage, nextContext));
    }

    /* ------------ GAME FLOW DECISIONS ------------ */
    function handleDecision(action) {
        if (currentStage === STAGES.ALARM) {
            if (action === 'abort') {
                setEndingMode('abortEarly');
                setUserTargetText('Abort the landing.');
                setPendingNextStage(STAGES.END_ABORT);
                setPendingLoadDelta(0);
                setPendingEndingMode('abortEarly');
                setScreenPhase('userTyping');
                return;
            }

            if (action === 'continue') {
                setAlarmDecision('continue');
                setUserTargetText('Continue without checking.');
                setPendingNextStage(STAGES.TASK1);
                setPendingLoadDelta(5);
                setPendingEndingMode(null);
                setScreenPhase('userTyping');
                return;
            }

            if (action === 'check') {
                setAlarmDecision('check');
                setUserTargetText('Check Tasks.');
                setPendingNextStage(STAGES.TASK1);
                setPendingLoadDelta(0);
                setPendingEndingMode(null);
                setScreenPhase('userTyping');
                return;
            }
        }

        if (currentStage === STAGES.TASK1) {
            if (action === 'landing-guidance') {
                setUserTargetText('Landing Guidance.');
                setPendingLoadDelta(-5);
            } else if (action === 'display-updates') {
                setUserTargetText('Display Updates.');
                setPendingLoadDelta(5);
            } else if (action === 'extra-radar-data') {
                setUserTargetText('Extra Radar Data.');
                setPendingLoadDelta(5);
            } else {
                return;
            }

            setPendingNextStage(STAGES.STATUS1);
            setPendingEndingMode(null);
            setScreenPhase('userTyping');
            return;
        }

        if (currentStage === STAGES.STATUS1) {
            if (action === 'go-descent') {
                setEndingMode('dangerBeforeFinal');
                setUserTargetText('Go Descent.');
                setPendingNextStage(STAGES.END_DANGER);
                setPendingLoadDelta(0);
                setPendingEndingMode('dangerBeforeFinal');
                setScreenPhase('userTyping');
                return;
            }

            if (action === 'abort') {
                setEndingMode('abortEarly');
                setUserTargetText('Abort.');
                setPendingNextStage(STAGES.END_ABORT);
                setPendingLoadDelta(0);
                setPendingEndingMode('abortEarly');
                setScreenPhase('userTyping');
                return;
            }

            if (action === 'continue-tasks') {
                setUserTargetText('Continue Tasks.');
                setPendingNextStage(STAGES.TASK2);
                setPendingLoadDelta(0);
                setPendingEndingMode(null);
                setScreenPhase('userTyping');
                return;
            }
        }

        if (currentStage === STAGES.TASK2) {
            if (action === 'background-calculations') {
                setUserTargetText('Background Calculations.');
                setPendingLoadDelta(5);
            } else if (action === 'crew-interface-updates') {
                setUserTargetText('Crew Interface Updates.');
                setPendingLoadDelta(5);
            } else if (action === 'navigation-updates') {
                setUserTargetText('Navigation Updates.');
                setPendingLoadDelta(-5);
            } else {
                return;
            }

            setPendingNextStage(STAGES.STATUS2);
            setPendingEndingMode(null);
            setScreenPhase('userTyping');
            return;
        }

        if (currentStage === STAGES.STATUS2) {
            if (action === 'go-descent') {
                setEndingMode('dangerBeforeFinal');
                setUserTargetText('Go Descent.');
                setPendingNextStage(STAGES.END_DANGER);
                setPendingLoadDelta(0);
                setPendingEndingMode('dangerBeforeFinal');
                setScreenPhase('userTyping');
                return;
            }

            if (action === 'abort') {
                setEndingMode('abortEarly');
                setUserTargetText('Abort.');
                setPendingNextStage(STAGES.END_ABORT);
                setPendingLoadDelta(0);
                setPendingEndingMode('abortEarly');
                setScreenPhase('userTyping');
                return;
            }

            if (action === 'continue-tasks') {
                setUserTargetText('Continue Tasks.');
                setPendingNextStage(STAGES.TASK3);
                setPendingLoadDelta(0);
                setPendingEndingMode(null);
                setScreenPhase('userTyping');
                return;
            }
        }

        if (currentStage === STAGES.TASK3) {
            if (action === 'non-essential-telemetry') {
                setUserTargetText('Non-Essential Telemetry.');
                setPendingLoadDelta(5);
            } else if (action === 'attitude-control') {
                setUserTargetText('Attitude Control.');
                setPendingLoadDelta(-5);
            } else if (action === 'diagnostic-logging') {
                setUserTargetText('Diagnostic Logging.');
                setPendingLoadDelta(5);
            } else {
                return;
            }

            setPendingNextStage(STAGES.FINAL);
            setPendingEndingMode(null);
            setScreenPhase('userTyping');
            return;
        }

        if (currentStage === STAGES.FINAL) {
            if (action === 'go-descent') {
                if (finalRecommendation === 'GO') {
                    setEndingMode('success');
                    setPendingNextStage(STAGES.END_SUCCESS);
                    setPendingEndingMode('success');
                } else {
                    setEndingMode('dangerAfterFinal');
                    setPendingNextStage(STAGES.END_DANGER);
                    setPendingEndingMode('dangerAfterFinal');
                }

                setUserTargetText('Go Descent.');
                setPendingLoadDelta(0);
                setScreenPhase('userTyping');
                return;
            }

            if (action === 'abort') {
                const nextEndingMode = finalRecommendation === 'GO' ? 'abortAfterGo' : 'abortRecommendedAbort';
                setEndingMode(nextEndingMode);
                setPendingNextStage(STAGES.END_ABORT);
                setPendingEndingMode(nextEndingMode);
                setUserTargetText('Abort.');
                setPendingLoadDelta(0);
                setScreenPhase('userTyping');
                return;
            }
        }

        if (
            currentStage === STAGES.END_ABORT ||
            currentStage === STAGES.END_DANGER ||
            currentStage === STAGES.END_VICTORY
        ) {
            if (action === 'restart') {
                restartSimulation();
            }
        }

        if (currentStage === STAGES.END_SUCCESS) {
            if (action === 'victory') {
                openStage(
                    STAGES.END_VICTORY,
                    getComputerText(STAGES.END_VICTORY, { alarmDecision, finalRecommendation, endingMode }),
                    getDetailText(STAGES.END_VICTORY, { alarmDecision, finalRecommendation, endingMode })
                );
            }
            if (action === 'restart') {
                restartSimulation();
            }
        }
    }

    const showTitle = currentStage === STAGES.MENU;
    const showBody = currentStage !== STAGES.MENU;
    const showMenuPrompt = currentStage === STAGES.MENU;
    const showStageText =
        screenPhase === 'detailTyping' || screenPhase === 'ready' || screenPhase === 'userTyping' || screenPhase === 'awaitAdvance';
    const showStatus = screenPhase === 'ready' || screenPhase === 'userTyping' || screenPhase === 'awaitAdvance';
    const showWaitingPrompt = showStatus;
    const showDecisionButtons = screenPhase === 'ready';
    const showEnterButton = screenPhase === 'awaitAdvance';
    const detailText = detailDisplayText || '';

    return (
        <section className={`mc-wrapper${isMobileFullscreen ? ' mc-fullscreen' : ''}`}>
            {isMobileFullscreen && (
                <button
                    className="mc-close-btn"
                    onClick={() => setIsMobileFullscreen(false)}
                    aria-label="Exit simulation"
                >×</button>
            )}
            <div className={`mc-monitor${currentStage === STAGES.END_VICTORY ? ' mc-victory-glow' : ''}`}>
                <div
                    className="mc-screen"
                    onDoubleClick={() => {
                        if (screenPhase === 'briefingTyping') {
                            setBriefingDisplayText(briefingTargetText);
                            setScreenPhase('briefingReady');
                        } else if (screenPhase === 'computerTyping') {
                            setComputerDisplayText(computerTargetText);
                            setDetailDisplayText(detailTargetText);
                            setScreenPhase('ready');
                        } else if (screenPhase === 'detailTyping') {
                            setDetailDisplayText(detailTargetText);
                            setScreenPhase('ready');
                        }
                    }}
                    onTouchEnd={(e) => {
                        const now = Date.now();
                        if (now - lastTapRef.current < 300) {
                            e.preventDefault();
                            if (screenPhase === 'briefingTyping') {
                                setBriefingDisplayText(briefingTargetText);
                                setScreenPhase('briefingReady');
                            } else if (screenPhase === 'computerTyping') {
                                setComputerDisplayText(computerTargetText);
                                setDetailDisplayText(detailTargetText);
                                setScreenPhase('ready');
                            } else if (screenPhase === 'detailTyping') {
                                setDetailDisplayText(detailTargetText);
                                setScreenPhase('ready');
                            }
                            lastTapRef.current = 0;
                        } else {
                            lastTapRef.current = now;
                        }
                    }}
                >
                    <div className="mc-stage-layout">
                        <div className="mc-stage-body">
                            {currentStage !== STAGES.MENU && (currentStage === STAGES.BRIEFING || stageHeader) && (
                                <div className="mc-stage-header">
                                    <span className="mc-stage-header-label">
                                        {currentStage === STAGES.BRIEFING
                                            ? briefingSlides[briefingIndex].mode
                                            : stageHeader}
                                    </span>
                                </div>
                            )}
                            {currentStage === STAGES.MENU ? (
                                <div className="mc-menu-stage">
                                    <header className="mc-header">
                                        <h2 className="mc-title">MISSION CONTROL</h2>
                                        <h2 className="mc-title">TERMINAL READY</h2>
                                    </header>

                                    <p className="mc-menu-copy">
                                        Ready to act as a Mission Control Engineer?
                                    </p>

                                    <div className="mc-actions mc-actions-single">
                                        <button onClick={startSimulation}>Start</button>
                                    </div>
                                </div>
                            ) : currentStage === STAGES.BRIEFING ? (
                                <div className="mc-briefing-stage" key={briefingIndex}>
                                    <div className="mc-computer-line">
                                        <span className="mc-label">COMPUTER:</span>
                                    </div>
                                    <div className="mc-briefing-text">
                                        {briefingDisplayText.split('\n').map((line, i) => (
                                            <p key={i}>{line}</p>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="mc-main-text" key={currentStage}>
                                    <div className="mc-computer-line">
                                        <span className="mc-label">COMPUTER:</span>
                                        <span>{computerDisplayText}</span>
                                    </div>

                                    {showStageText && (
                                        <>
                                            <div className="mc-detail-text">
                                                <p>{detailText}</p>
                                            </div>

                                            {showStatus && (
                                                <div className="mc-status-lines">
                                                    {currentStage === STAGES.END_VICTORY ? (
                                                        <>
                                                            <p>System Status: LUNAR LANDING SUCCESSFUL</p>
                                                            <p>Computer Load: STABLE</p>
                                                            <p>Risk Level: CLEARED</p>
                                                            <p>Mission Result: MISSION COMPLETE</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p>System Status: {systemStatus}</p>
                                                                <p className="mc-load-line">
                                                                    <span>Computer Load: {computerLoad}%</span>
                                                                    {loadDirection !== 0 && (
                                                                        <span
                                                                            className={`mc-load-arrow mc-load-arrow-${
                                                                                loadDirection > 0 ? 'up' : 'down'
                                                                            }`}
                                                                            aria-hidden="true"
                                                                        >
                                                                            {loadDirection > 0 ? '↑' : '↓'}
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            <p>Risk Level: {riskLevel}</p>
                                                            {currentStage === STAGES.FINAL && <p>Recommendation: {finalRecommendation ?? 'PENDING'}</p>}
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {showWaitingPrompt && (
                                                <div className="mc-user-line">
                                                    <span className="mc-label">{'>'}</span>
                                                    <span className={showDecisionButtons && currentStage !== STAGES.END_VICTORY ? 'mc-waiting-dots' : ''}>
                                                        {currentStage === STAGES.END_VICTORY ? 'Mission cleared.' : (showDecisionButtons ? '...' : userDisplayText)}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {currentStage !== STAGES.MENU && (
                            <footer className="mc-footer">
                                {currentStage === STAGES.BRIEFING && screenPhase === 'briefingReady' ? (
                                <div className="mc-actions mc-actions-single">
                                    <button onClick={handleBriefingAdvance}>
                                        {briefingIndex < briefingSlides.length - 1 ? 'Continue' : 'Begin Decision'}
                                    </button>
                                </div>
                            ) : currentStage === STAGES.BRIEFING ? (
                                <div className="mc-actions mc-actions-single">
                                    <p className="mc-skip-hint">[ double-click to skip animation ]</p>
                                </div>
                            ) : showDecisionButtons ? (
                                <div className="mc-actions">
                                    {buttonConfigs.map((button) => (
                                        <button key={button.action} onClick={() => handleDecision(button.action)}>
                                            {button.label}
                                        </button>
                                    ))}
                                </div>
                            ) : showEnterButton ? (
                                <div className="mc-actions mc-actions-single">
                                    <button onClick={handleAdvance}>Enter</button>
                                </div>
                            ) : screenPhase === 'computerTyping' || screenPhase === 'detailTyping' ? (
                                <div className="mc-actions mc-actions-single">
                                    <p className="mc-skip-hint">[ double-click to skip animation ]</p>
                                </div>
                            ) : (
                                <div className="mc-actions mc-actions-empty" aria-hidden="true" />
                            )}
                        </footer>
                        )}
                    </div>
                </div>
            </div>

            <style>
                {`@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap");

.mc-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 2.5rem 1rem 3rem;
    position: relative;
}

.mc-close-btn {
    display: none;
}

.mc-monitor {
    width: min(1000px, 88vw);
    height: min(680px, 84vh);
    border: 1px solid color-mix(in srgb, var(--primary-light) 22%, var(--border));
    border-radius: 28px;
    padding: 1.75rem;
    box-shadow:
        0 0 28px rgba(124, 255, 178, 0.06),
        inset 0 0 22px rgba(20, 30, 35, 0.08);
    transition: border-color 0.8s ease, box-shadow 0.8s ease;
}

.mc-victory-glow {
    border-color: rgba(245, 200, 0, 0.45) !important;
    box-shadow:
        0 0 32px rgba(245, 200, 0, 0.14),
        0 0 64px rgba(245, 200, 0, 0.06),
        inset 0 0 22px rgba(20, 30, 35, 0.08) !important;
    animation: victoryPulse 2.2s ease-in-out infinite;
}

@keyframes victoryPulse {
    0%, 100% {
        box-shadow:
            0 0 32px rgba(245, 200, 0, 0.14),
            0 0 64px rgba(245, 200, 0, 0.06),
            inset 0 0 22px rgba(20, 30, 35, 0.08);
    }
    50% {
        box-shadow:
            0 0 52px rgba(245, 200, 0, 0.26),
            0 0 96px rgba(245, 200, 0, 0.10),
            inset 0 0 22px rgba(20, 30, 35, 0.08);
    }
}

.mc-screen {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 2.3rem 2.1rem 1.8rem;
    box-sizing: border-box;
    touch-action: manipulation;
    background:
        radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05), transparent 18%),
        radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.03), transparent 16%),
        repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.02) 0,
            rgba(255, 255, 255, 0.02) 1px,
            transparent 1px,
            transparent 4px
        ),
        linear-gradient(180deg, #05181A 0%, #030F11 100%);
    border-radius: 18px;
    padding: 2.3rem 2.1rem 1.8rem;
    box-shadow:
        inset 0 0 24px rgba(0, 0, 0, 0.16),
        0 0 18px rgba(49, 21, 67, 0.18);
}

.mc-screen::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
        linear-gradient(rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)),
        repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.01) 0,
            rgba(255, 255, 255, 0.01) 2px,
            transparent 2px,
            transparent 7px
        );
    mix-blend-mode: screen;
    opacity: 0.22;
    pointer-events: none;
}

.mc-screen > * {
    position: relative;
    z-index: 1;
}

.mc-screen,
.mc-screen * {
    font-family: "VT323", "Courier New", monospace;
    color: #7CFFB2;
    text-shadow:
        0 0 2px rgba(124, 255, 178, 0.60),
        0 0 8px rgba(124, 255, 178, 0.20);
    font-size: clamp(1.05rem, 1.8vw, 1.45rem);
    font-weight: 400;
}

.mc-title {
    margin: 0 0 0.35rem;
    font-size: clamp(3rem, 6vw, 5rem);
    line-height: 1;
    text-align: center;
}

.mc-menu-copy {
    margin: 0;
    font-size: clamp(2rem, 2vw, 2rem);
    line-height: 1.4;
    text-align: center;
}

.mc-briefing-stage {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    animation: mc-stage-enter 0.35s ease-out;
}

.mc-briefing-text {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    margin-left: 2rem;
}

.mc-briefing-text p {
    margin: 0;
    line-height: 1.55;
}

@keyframes mc-stage-enter {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
}

.mc-skip-hint {
    margin: 0;
    font-size: 0.8em;
    letter-spacing: 0.08em;
    text-shadow: none;
    text-align: center;
    animation: skip-hint-fade 2.8s ease-in-out infinite;
}

@keyframes skip-hint-fade {
    0%, 100% { opacity: 0.08; }
    50%       { opacity: 0.38; }
}

.mc-stage-header {
    display: flex;
    align-items: center;
    padding-bottom: 0.55rem;
    margin-bottom: 1.2rem;
    border-bottom: 1px solid rgba(0, 255, 65, 0.22);
}

.mc-stage-header-label {
    font-size: clamp(0.85rem, 1.5vw, 1.05rem);
    letter-spacing: 0.2em;
    opacity: 0.75;
}

.mc-stage-header-label::before {
    content: "> ";
    opacity: 0.55;
}
    
.mc-stage-layout {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.mc-stage-body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.mc-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: auto;
    margin: 0;
    text-align: center;
    }

.mc-menu-stage {
    flex: 1;
    width: 100%;
    min-height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;
    gap: 2.5rem;
    padding: 1rem;
    box-sizing: border-box;
}

.mc-menu-stage .mc-actions,
.mc-menu-stage .mc-buttons {
    margin-top: 1.5rem;
}

.mc-main-text {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    animation: mc-stage-enter 0.3s ease-out;
}

.mc-computer-line {
    display: block;
    line-height: 1.6;
}

.mc-computer-line .mc-label {
    display: inline;
    white-space: nowrap;
    margin-right: 1rem;
}

.mc-computer-line span:last-child {
    display: inline;
    min-width: 0;
}

.mc-user-line {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    min-height: 1.5em;
    margin-top: 0;
    color: #8DFCF2;
    text-shadow: 0 0 8px rgba(141, 252, 242, 0.45);
}

.mc-label {
    white-space: nowrap;
}

.mc-detail-text,
.mc-status-lines {
    margin-left: 2rem;
}

.mc-detail-text p,
.mc-status-lines p {
    margin: 0;
    line-height: 1.35;
    margin-top: 0.2rem;
}

.mc-status-lines {
    display: grid;
    gap: 0.7rem;
    margin-top: 0.2rem;
    margin-bottom: 0;
}

.mc-load-line {
    display: flex;
    align-items: center;
    gap: 0.55rem;
}

.mc-load-arrow {
    display: inline-block;
    font-size: 0.9em;
    line-height: 1;
    animation: mc-arrow-bob 0.9s ease-in-out infinite;
}

.mc-load-arrow-up {
    animation-name: mc-arrow-up;
}

.mc-load-arrow-down {
    animation-name: mc-arrow-down;
}

    
.mc-waiting-dots {
    animation: mc-pulse 1.1s ease-in-out infinite;
}

.mc-footer {
    min-height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0;
    transform: translateY(-3rem);
}

.mc-actions {
    display: flex;
    justify-content: center;
    gap: 0.85rem;
    flex-wrap: wrap;
    width: 100%;
}

.mc-actions-single {
    justify-content: center;
}

.mc-actions-empty {
    min-height: 3.4rem;
}

.mc-actions button {
    background: #041A1C;
    border: 1px solid #7CFFB2;
    padding: 0.9rem 1rem;
    line-height: 1.2;
    cursor: pointer;
    box-shadow:
        0 0 10px rgba(124, 255, 178, 0.12),
        inset 0 0 10px rgba(124, 255, 178, 0.06);
}

.mc-actions button::before {
    content: "> ";
    margin-right: 0.2rem;
}

.mc-actions button:hover {
    background: #7CFFB2;
    color: #03111A;
}

@keyframes mc-pulse {
    0%,
    100% {
        opacity: 0.35;
    }
    50% {
        opacity: 1;
    }
}

@keyframes mc-arrow-up {
    0%,
    100% {
        transform: translateY(2px);
    }
    50% {
        transform: translateY(-2px);
    }
}

@keyframes mc-arrow-down {
    0%,
    100% {
        transform: translateY(-2px);
    }
    50% {
        transform: translateY(2px);
    }
}

@keyframes mc-arrow-bob {
    0%,
    100% {
        opacity: 0.85;
    }
    50% {
        opacity: 1;
    }
}

@media (max-width: 900px) {
    .mc-wrapper {
        padding: 1.5rem 0.75rem 2rem;
    }

    .mc-monitor {
        width: min(96vw, 900px);
        padding: 1rem;
    }

    .mc-screen {
        padding: 1.35rem 1rem 1rem;
    }
}

@media (max-width: 700px) {
    .mc-wrapper.mc-fullscreen {
        position: fixed;
        inset: 0;
        z-index: 9999;
        padding: 0;
        background: #030D10;
        overflow-y: auto;
        align-items: flex-start;
    }

    .mc-wrapper.mc-fullscreen .mc-monitor {
        width: 100%;
        height: 100dvh;
        min-height: unset;
        border-radius: 0;
        border: none;
    }

    .mc-wrapper.mc-fullscreen .mc-screen {
        border-radius: 0;
        padding-bottom: clamp(1.2rem, 3vh, 2rem);
    }

    .mc-close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0.6rem;
        right: 0.7rem;
        z-index: 10000;
        width: 2rem;
        height: 2rem;
        background: rgba(3, 18, 20, 0.9);
        border: 1px solid rgba(124, 255, 178, 0.42);
        border-radius: 50%;
        color: #7CFFB2;
        font-family: "VT323", monospace;
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        opacity: 0.7;
        text-shadow: 0 0 6px rgba(124, 255, 178, 0.55);
    }

    .mc-close-btn:active {
        opacity: 1;
        background: rgba(124, 255, 178, 0.12);
    }

    .mc-monitor {
        width: min(92vw, 430px);
        height: 76vh;
        min-height: 560px;
        padding: 1rem;
        border-radius: 22px;
    }

    .mc-screen {
        height: 100%;
        padding: 1.4rem 1rem;
        border-radius: 16px;
        overflow-y: auto;
        box-sizing: border-box;
    }

    .mc-menu-stage {
        gap: 1.6rem;
        padding: 0.5rem;
    }

    .mc-title {
        font-size: clamp(1.7rem, 9vw, 3rem);
        line-height: 1.25;
    }

    .mc-menu-copy {
        font-size: clamp(1.1rem, 5vw, 1.5rem);
        line-height: 1.5;
    }

    .mc-main-text {
        gap: 1rem;
    }

    .mc-computer-line,
    .mc-detail-text,
    .mc-status-lines,
    .mc-user-line {
        font-size: clamp(1.05rem, 4.5vw, 1.35rem);
        line-height: 1.5;
    }

    .mc-user-line {
        margin-top: 0.75rem;
        margin-bottom: 0.5rem;
    }

    .mc-status-lines {
        margin-bottom: 0.5rem;
    }

    .mc-footer {
        margin-top: 0.75rem;
    }

    .mc-detail-text,
    .mc-briefing-text,
    .mc-status-lines {
        margin-left: 1rem;
    }

    .mc-footer {
        transform: none;
        margin-top: 1.5rem;
    }

    .mc-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;
    }

    .mc-actions button {
        width: 100%;
    }
}`}
            </style>
        </section>
    );
}
