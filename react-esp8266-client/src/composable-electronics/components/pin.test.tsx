import * as React from 'react';
import { mount } from 'enzyme';
import { PinApi } from '../api/PinApi';
import * as CompElec from '../';

const { Pin, PinMode } = CompElec;
import { actionPin } from './pin';

beforeAll(() => {
    window.fetch = jest.fn(() => Promise.resolve({ ok: true }));
});

it('should default to an output pin', () => {
    const component = mount(<Pin pin={13} value={1} mode={PinMode.OUTPUT} />);
    expect(component.prop('mode')).toEqual(PinMode.OUTPUT);
});

it('calls digital write when mode is set to one', () => {
    const spy = jest.spyOn(PinApi.prototype, 'digitalWrite');
    actionPin({pin: 1, value: 13, mode: PinMode.OUTPUT});
    expect(spy).toBeCalledWith(1, 13);
    expect(spy).toHaveBeenCalledTimes(1);
});

it('calls digital write when mode is set to one', () => {
    const spy = jest.spyOn(PinApi.prototype, 'analogWrite');
    actionPin({pin: 1, value: 13, mode: PinMode.PWM});
    expect(spy).toBeCalledWith(1, 13);
    expect(spy).toHaveBeenCalledTimes(1);
});
