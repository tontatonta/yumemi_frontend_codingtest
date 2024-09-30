import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fetchPopulationData } from '../services/api';

interface PopulationGraphProps {
    selectedPrefCodes: number[];
}

const PopulationGraph: React.FC<PopulationGraphProps> = ({ selectedPrefCodes }) => {
    const [data, setData] = useState<any[]>([]);
    const [populationType, setPopulationType] = useState<'total' | 'young' | 'working' | 'old'>('total');

    useEffect(() => {
        const loadPopulationData = async () => {
            const fetchedData = await Promise.all(
                selectedPrefCodes.map((code) => fetchPopulationData(code))
            );

            const combinedData = fetchedData.reduce((acc, curr) => {
                curr.result.data.forEach((item: any) => {
                    const yearData = item.data.map((d: any) => ({
                        year: d.year,
                        value: populationType === 'total' ? d.value : populationType === 'young' ? d.youth : populationType === 'working' ? d.working : d.old,
                    }));
                    acc.push(...yearData);
                });
                return acc;
            }, []);
            setData(combinedData);
        };

        if (selectedPrefCodes.length) {
            loadPopulationData();
        }
    }, [selectedPrefCodes, populationType]);

    return (
        <div>
            <select value={populationType} onChange={(e) => setPopulationType(e.target.value as any)}>
                <option value="total">総人口</option>
                <option value="young">年少人口</option>
                <option value="working">生産年齢人口</option>
                <option value="old">老年人口</option>
            </select>
            <LineChart width={600} height={300} data={data}>
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
        </div>
    );
};

export default PopulationGraph;
