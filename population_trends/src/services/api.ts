import axios from 'axios';

const API_BASE_URL = 'https://opendata.resas-portal.go.jp/api/v1';

export const fetchPrefectures = async () => {
    const response = await axios.get(`${API_BASE_URL}/prefectures`, {
        headers: {
            'X-API-KEY': 'YOUR_API_KEY' // ここにあなたのAPIキーを入力
        }
    });
    return response.data;
};

export const fetchPopulationData = async (prefCode: number) => {
    const response = await axios.get(`${API_BASE_URL}/population/composition?prefCode=${prefCode}`, {
        headers: {
            'X-API-KEY': 'YOUR_API_KEY' // ここにあなたのAPIキーを入力
        }
    });
    return response.data;
};
