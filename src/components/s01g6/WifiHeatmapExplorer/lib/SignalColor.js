/**
 * SignalColor.js
 * Shared heatmap color scale + legend, used by any canvas that overlays
 * computed signal strength on top of the floor plan.
 * Dark Blue = no signal, red = weak, yellow = medium, green = strong.
 */

export const COLOR_STOPS = [
    [239, 68,  68],  // red:    weak   (0.0)
    [234, 179,  8],  // yellow: medium (0.5)
    [ 34, 197, 94],  // green:  strong (1.0)
];

export const NO_SIGNAL_COLOR = '#0f172a';

export function signalToColor(value) {
    if (value <= 0) return NO_SIGNAL_COLOR;

    const t = Math.max(0, Math.min(1, value));
    const [a, b, f] = t <= 0.5
        ? [COLOR_STOPS[0], COLOR_STOPS[1], t / 0.5]
        : [COLOR_STOPS[1], COLOR_STOPS[2], (t - 0.5) / 0.5];

    return `rgb(${Math.round(a[0]+(b[0]-a[0])*f)},${Math.round(a[1]+(b[1]-a[1])*f)},${Math.round(a[2]+(b[2]-a[2])*f)})`;
}

export const LEGEND = [
    { label: 'No signal', color: NO_SIGNAL_COLOR,                       border: true },
    { label: 'Weak',      color: `rgb(${COLOR_STOPS[0].join(',')})`,  border: false },
    { label: 'Medium',    color: `rgb(${COLOR_STOPS[1].join(',')})`,  border: false },
    { label: 'Strong',    color: `rgb(${COLOR_STOPS[2].join(',')})`,  border: false },
];
