export const findAllProductsWebService = async (refreshToken) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/product/find/all`, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        const data = await response.json();
        if (data?.statusCode === 401) {
            window.location.href = '/signin';
            return;
        }
        return data.result;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

export const saveProfitHistoryWebService = async (data, refreshToken) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/profit-history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            },
            body: JSON.stringify(data),
        });
        const dataResponse = await response.json();
        if (dataResponse?.statusCode === 401) {
            window.location.href = '/signin';
            return;
        }
        return dataResponse;
    } catch (error) {
        console.error('Error saving profit history:', error);
        throw error;
    }
}