import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const base10UnitPrefixes = ['', 'K', 'M', 'G', 'T'];
const base2UnitPrefixes = ['', 'Ki', 'Mi', 'Gi', 'Ti'];

const niceNumber = (f: number) => Math.round(f * 10) / 10.0 + '';

const toDecimalUnitString = (
    num: number,
    divisor: number,
    prefixes: string[],
    suffix: string
) => {
    for (var i = 0; i < prefixes.length; i++) {
        if (num < 0.9 * divisor) {
            return niceNumber(num) + ' ' + prefixes[i] + suffix;
        }
        num /= divisor;
    }

    return niceNumber(num) + ' ' + prefixes[prefixes.length - 1] + suffix;
};

export const sizeDisplayName = (size?: number, bytesStringBase2?: boolean) => {
    if (size === undefined) return '';

    if (bytesStringBase2)
        return toDecimalUnitString(size, 1024, base2UnitPrefixes, 'B');

    return toDecimalUnitString(size, 1000, base10UnitPrefixes, 'B');
};

type Error = {
	path: string;
	error: string;
}
type Summary = {
	errors: Error[];
	numFailed: number;
}
export const sizeWithFailures = (
    size?: number,
    summ?: Summary,
    bytesStringBase2?: boolean
) => {
    if (size === undefined) return '';

    if (!summ || !summ.errors || !summ.numFailed)
        return <span>{sizeDisplayName(size, bytesStringBase2)}</span>;

    let caption = 'Encountered ' + summ.numFailed + ' errors:\n\n';
    let prefix = '- ';
    if (summ.numFailed === 1) {
        caption = 'Error: ';
        prefix = '';
    }

    caption += summ.errors
        .map((err: Error) => prefix + err.path + ': ' + err.error)
        .join('\n');

    return (
        <span>
            {sizeDisplayName(size, bytesStringBase2)}&nbsp;
            <FontAwesomeIcon
                color="red"
                icon={faExclamationTriangle}
                title={caption}
            />
        </span>
    );
};
