/**
 * Generations.js
 * Per-generation WiFi router specs that feed into the propagation model.
 *
 * @typedef {Object} Generation
 * @property {string} id
 * @property {string} label
 * @property {string} standard
 * @property {string} year
 * @property {number} maxStrength
 * @property {'2.4GHz'|'5GHz'|'dual'} frequencyBand
 * @property {number} wallPenetration
 * @property {string} description   - Short summary shown below the floor plan editor
 */

/** @type {Generation[]} */
export const GENERATIONS = [
    {
        id:              'wifi1',
        label:           'WiFi 1',
        standard:        '802.11b',
        year:            '1999',
        maxStrength:     60,
        frequencyBand:   '2.4GHz',
        wallPenetration: 1.0,
        description:     'Wide 2.4 GHz coverage with reasonable wall penetration, but a hard 11 Mbps ceiling and a crowded band made real-world performance unreliable.',
    },
    {
        id:              'wifi2',
        label:           'WiFi 2',
        standard:        '802.11a',
        year:            '1999',
        maxStrength:     55,
        frequencyBand:   '5GHz',
        wallPenetration: 1.4,
        description:     'Faster speeds and less interference on 5 GHz — but that same band means noticeably shorter range and walls hit it much harder than 2.4 GHz.',
    },
    {
        id:              'wifi3',
        label:           'WiFi 3',
        standard:        '802.11g',
        year:            '2003',
        maxStrength:     70,
        frequencyBand:   '2.4GHz',
        wallPenetration: 1.0,
        description:     'OFDM on 2.4 GHz: better speeds than WiFi 1 with the same range and full backward compatibility. The crowd-pleaser of its era.',
    },
    {
        id:              'wifi4',
        label:           'WiFi 4',
        standard:        '802.11n',
        year:            '2009',
        maxStrength:     85,
        frequencyBand:   'dual',
        wallPenetration: 0.85,
        description:     'MIMO changed everything. Dual-band support and multiple antennas made this the first standard that felt genuinely reliable across most homes and offices.',
    },
    {
        id:              'wifi5',
        label:           'WiFi 5',
        standard:        '802.11ac',
        year:            '2013',
        maxStrength:     95,
        frequencyBand:   '5GHz',
        wallPenetration: 1.1,
        description:     'Gigabit speeds at last — but 5 GHz only. Excellent throughput in open spaces; expect a significant drop through walls and over distance.',
    },
    {
        id:              'wifi6',
        label:           'WiFi 6',
        standard:        '802.11ax',
        year:            '2019',
        maxStrength:     110,
        frequencyBand:   'dual',
        wallPenetration: 0.7,
        description:     'Built for dense environments. OFDMA, better wall penetration, and dual-band efficiency mean coverage holds up where earlier standards fade.',
    },
    {
        id:              'wifi6e',
        label:           'WiFi 6E',
        standard:        '802.11ax (6 GHz)',
        year:            '2021',
        maxStrength:     120,
        frequencyBand:   'dual',
        wallPenetration: 1.3,
        description:     'Fresh, uncongested 6 GHz spectrum and the best peak speeds — but the highest frequency means the worst wall penetration of any generation here.',
    },
];