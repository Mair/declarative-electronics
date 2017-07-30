import { compElFetch } from './compElFetch';
import { PinMode } from '../index';

// by convention this class will map the method name to firmata's method name which is also the api endpoint
export class PinApi {

    async pinMode(pin: number, mode: PinMode) {
        try {
            const response = await compElFetch('pinmode', 'POST', { pin, mode });
            if (!response.ok) {throw(response.status); }
            return;           
        } catch (err) {console.error('error in API ', err); }
    }

    async digitalWrite(pin: number, value: number) {
        try {
            const response = await compElFetch('digitalwrite', 'POST', { pin, value });
            if (!response.ok) {throw(response.status); }
            return;           
        } catch (err) {console.error('error in API ', err); }
    }

   async analogWrite(pin: number, value: number) {
        try {
            const response = await compElFetch('analogwrite', 'POST', { pin, value });
            if (!response.ok) {throw(response.status); }
            return;           
        } catch (err) {console.error('error in API ', err); }
    }
} 