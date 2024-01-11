import { getClientIp, v4, v6 } from './request-ip';

describe('getClientIp', () => {
    it('returns the first valid IP address from the X-Forwarded-For header', () => {
        const forwardedFor = '203.0.113.195, 70.41.3.18, 150.172.238.178';
        const result = getClientIp(forwardedFor);
        expect(result).toBe('203.0.113.195');
    });

    it('returns undefined when the X-Forwarded-For header is undefined', () => {
        const result = getClientIp(undefined);
        expect(result).toBeUndefined();
    });

    it('returns undefined when the X-Forwarded-For header does not contain a valid IP address', () => {
        const forwardedFor = 'not an IP address';
        const result = getClientIp(forwardedFor);
        expect(result).toBeUndefined();
    });
});

describe('v4', () => {
    it('matches valid IPv4 addresses', () => {
        const ip = '203.0.113.195';
        expect(v4.test(ip)).toBe(true);
    });

    it('does not match invalid IPv4 addresses', () => {
        const ip = '203.0.113.256';
        expect(v4.test(ip)).toBe(false);
    });
});

describe('v6', () => {
    it('matches valid IPv6 addresses', () => {
        const ip = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
        expect(v6.test(ip)).toBe(true);
    });

    it('does not match invalid IPv6 addresses', () => {
        const ip = '2001:0db8:85a3:0000:0000:8a2e:0370:733g';
        expect(v6.test(ip)).toBe(false);
    });
});