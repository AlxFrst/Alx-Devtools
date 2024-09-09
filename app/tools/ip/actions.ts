'use server'

import axios from 'axios';

interface IpInfo {
    ip: string;
    country: string;
    city: string;
    isp: string;
}

export async function getIpInfo(ip: string): Promise<IpInfo> {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const data = response.data;

        return {
            ip: data.query,
            country: data.country,
            city: data.city,
            isp: data.isp,
        };
    } catch (error) {
        console.error('Error fetching IP info:', error);
        throw new Error('Failed to fetch IP information');
    }
}