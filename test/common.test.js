'use strict';

const { hasProperty, hasTypeOfProperty, getObjectValueFrom, getValidNumber } = require('../lib/common');

describe('common', () => {
    it('Has a property at object', () => {
        expect(hasProperty({ test_key: 'test_value' }, 'test_key')).toBeTruthy();
    });

    it('Has not a property at object', () => {
        expect(hasProperty({ test_key: 'test_value' }, 'not_test_key')).toBeFalsy();
    });

    it('Has a property at object which string type', () => {
        expect(hasTypeOfProperty({ test_key: 'test_value' }, 'test_key', 'string')).toBeTruthy();
    });

    it('Has a property at object which except for string type', () => {
        expect(hasTypeOfProperty({ test_key: 1234 }, 'test_key', 'string')).toBeFalsy();
    });

    it('Get a value of property at object which string type successfully', () => {
        expect(getObjectValueFrom({ test_key: 'test_value' }, 'test_key', 'string', 'default_value')).toStrictEqual('test_value');
    });

    it('Get a default value which specified because fail to get a value of object property', () => {
        expect(getObjectValueFrom({ test_key: 1234 }, 'test_key', 'string', 'default_value')).toStrictEqual('default_value');
    });

    it('Get a valid number from specified value successfully', () => {
        expect(getValidNumber(1234, 9876)).toStrictEqual(1234);
    });

    it('Get a default number which specified because value is not valid number', () => {
        expect(getValidNumber('test_value', 9876)).toStrictEqual(9876);
    });
});
