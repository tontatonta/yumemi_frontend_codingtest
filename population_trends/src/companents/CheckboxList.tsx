import React, { useEffect, useState } from 'react';
import { fetchPrefectures } from '../services/api';

interface Prefecture {
    prefCode: number;
    prefName: string;
}

interface CheckboxListProps {
    onSelect: (selectedPrefCodes: number[]) => void;
}

const CheckboxList: React.FC<CheckboxListProps> = ({ onSelect }) => {
    const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
    const [selectedPrefCodes, setSelectedPrefCodes] = useState<number[]>([]);

    useEffect(() => {
        const loadPrefectures = async () => {
            const data = await fetchPrefectures();
            setPrefectures(data.result);
        };

        loadPrefectures();
    }, []);

    const handleChange = (prefCode: number) => {
        setSelectedPrefCodes((prev) => {
            if (prev.includes(prefCode)) {
                return prev.filter((code) => code !== prefCode);
            } else {
                return [...prev, prefCode];
            }
        });
    };

    useEffect(() => {
        onSelect(selectedPrefCodes);
    }, [selectedPrefCodes, onSelect]);

    return (
        <div>
            {prefectures.map((pref) => (
                <div key={pref.prefCode}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedPrefCodes.includes(pref.prefCode)}
                            onChange={() => handleChange(pref.prefCode)}
                        />
                        {pref.prefName}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default CheckboxList;
