import React from 'react';
import PipelineSimulator from './PipelineSimulator.jsx';
import HeroCover from './HeroCover.jsx';

export default function PipelineSimulatorWrapper() {
    return (
        <HeroCover>
            <PipelineSimulator />
        </HeroCover>
    );
}