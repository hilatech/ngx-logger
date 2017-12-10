import { ILogEvent } from './log-types';

export function namespaceIsValid(namespace: string) {
    if (namespace === null) {
        return false;
    }
    const namespaceExpression = new RegExp('^[a-zA-Z0-9\:\*]{1,}$');
    const passed = namespaceExpression.test(namespace);
    return passed;
}

export function logMessageIsValid(msg: string) {
    return (msg !== null);
}
