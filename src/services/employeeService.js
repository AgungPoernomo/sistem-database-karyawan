// src/services/employeeService.js
import { APP_CONFIG } from '../config/api.js';

export const EmployeeService = {
    async getAllEmployees() {
        const savedUserId = localStorage.getItem('nexus_user');
        
        try {
            const response = await fetch(APP_CONFIG.GAS_URL, {
                method: 'POST',
                body: JSON.stringify({ 
                    action: 'READ',
                    // SISIPKAN PAYLOAD BERISI USERID UNTUK BACKEND FILTERING
                    payload: { userId: savedUserId } 
                })
            });
            const result = await response.json();
            if (result.status === 'success') {
                return result.data;
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }
};