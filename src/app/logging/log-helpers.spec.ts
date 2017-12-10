import { inject } from '@angular/core/testing';
import { namespaceIsValid, logMessageIsValid, ILogEvent, LogLevel } from './log-service';

describe('Functions: namespaceIsValid', () => {
    it('namespaceIsValid(null) returns false ...', () => {
        const actual = namespaceIsValid(null);
        expect(actual).toBeFalsy();
    });

    it('namespaceIsValid("") returns false ...', () => {
        const actual = namespaceIsValid('');
        expect(actual).toBeFalsy();
    });

    it('namespaceIsValid("test:asdfasdf:adsfasdf") returns true ...', () => {
        const actual = namespaceIsValid('test:asdfasdf:adsfasdf');
        expect(actual).toBeTruthy();
    });

    it('namespaceIsValid("test:*") returns true ...', () => {
        const actual = namespaceIsValid('test:*');
        expect(actual).toBeTruthy();
    });

    it('namespaceIsValid("test*") returns true ...', () => {
        const actual = namespaceIsValid('test*');
        expect(actual).toBeTruthy();
    });

});

describe('Functions: logMessageIsValid', () => {
    it('logMessageIsValid(null) returns false ...', () => {
        const actual = logMessageIsValid(null);
        expect(actual).toBeFalsy();
    });

    it('logMessageIsValid("") returns true ...', () => {
        const actual = logMessageIsValid('');
        expect(actual).toBeTruthy();
    });
});
