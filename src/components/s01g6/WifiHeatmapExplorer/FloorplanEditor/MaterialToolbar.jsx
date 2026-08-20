import { Trash2, Radio } from 'lucide-react';
import { Button } from '../../ui/button';
import { CELL_TYPE, CELL_CONFIGS } from '../lib/CellTypes.js';

const MATERIALS = [
    CELL_CONFIGS[CELL_TYPE.EMPTY],
    CELL_CONFIGS[CELL_TYPE.DRYWALL],
    CELL_CONFIGS[CELL_TYPE.CONCRETE],
    CELL_CONFIGS[CELL_TYPE.METAL],
];

/**
 * @param {{
 *   state: object,
 *   dispatch: Function,
 *   onClearAll: () => void,
 *   showOverlay: boolean,
 *   onToggleOverlay: () => void,
 * }} props
 */
export default function MaterialToolbar({
                                            state,
                                            dispatch,
                                            onClearAll,
                                            showOverlay,
                                            onToggleOverlay,
                                        }) {
    const handleMaterialSelect = (materialType) => {
        dispatch({ type: 'SET_MATERIAL', material: materialType });
    };

    return (
        <div className="flex flex-col gap-3 w-full min-w-0 sm:flex-row sm:items-center sm:justify-between sm:gap-2">

            {/* Material Selector Grid */}
            <div className="grid grid-cols-2 gap-1.5 w-full min-w-0 xs:grid-cols-4 sm:flex sm:items-center sm:w-auto">
                {MATERIALS.map((config) => {
                    const isActive = state.activeMaterial === config.type;
                    return (
                        <Button
                            key={config.type}
                            variant={isActive ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleMaterialSelect(config.type)}
                            className="gap-1.5 w-full justify-center text-xs px-2 h-9 sm:w-auto sm:min-w-[75px]"
                        >
                            <span
                                className="inline-block w-3 h-3 rounded-s01g6-sm border border-s01g6-border shrink-0"
                                style={{ backgroundColor: config.color }}
                            />
                            <span className="truncate">
                                {config.type === CELL_TYPE.EMPTY ? 'Eraser' : config.label}
                            </span>
                        </Button>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 w-full min-w-0 sm:w-auto">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearAll}
                    className="gap-1.5 flex-1 justify-center text-xs whitespace-nowrap h-9 sm:flex-initial"
                >
                    <Trash2 size={14} className="shrink-0" />
                    <span>Clear</span>
                </Button>

                <Button
                    variant={showOverlay ? 'default' : 'outline'}
                    size="sm"
                    onClick={onToggleOverlay}
                    className="gap-1.5 flex-1 justify-center text-xs whitespace-nowrap h-9 sm:flex-initial"
                >
                    <Radio size={14} className="shrink-0" />
                    <span>Signal</span>
                </Button>
            </div>

        </div>
    );
}
