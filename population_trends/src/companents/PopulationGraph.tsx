import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fetchPopulationData } from '../services/api';

interface PopulationGraphProps {
    selectedPrefCodes: number[];
}

// データの型を定義
interface PopulationData {
    year: number;
    value: number;
}

const PopulationGraph: React.FC<PopulationGraphProps> = ({ selectedPrefCodes }) => {
    const [data, setData] = useState<PopulationData[]>([]);
    const [populationType, setPopulationType] = useState<'total' | 'young' | 'working' | 'old'>('total');

    useEffect(() => {
        const loadPopulationData = async () => {
            try {
                const fetchedData = await Promise.all(
                    selectedPrefCodes.map((code) => fetchPopulationData(code))
                );

                const combinedData: PopulationData[] = fetchedData.reduce((acc: PopulationData[], curr: any) => {
                    if (curr && curr.result && curr.result.data) {
                        curr.result.data.forEach((item: any) => {
                            item.data.forEach((d: any) => {
                                const value = populationType === 'total' ? d.value :
                                              populationType === 'young' ? d.youth :
                                              populationType === 'working' ? d.working :
                                              d.old;

                                acc.push({ year: d.year, value });
                            });
                        });
                    }
                    return acc;
                }, []);

                // 年ごとにデータを集約
                const aggregatedData = aggregatedDataByYear(combinedData);
                setData(aggregatedData);
            } catch (error) {
                console.error('Error loading population data:', error);
            }
        };

        if (selectedPrefCodes.length) {
            loadPopulationData();
        }
    }, [selectedPrefCodes, populationType]);

    // 年ごとにデータを集約する関数
    const aggregatedDataByYear = (data: PopulationData[]) => {
        const result: { [key: number]: number } = {};
        data.forEach(({ year, value }) => {
            const yearNum = Number(year); // yearをNumber型に変換
            if (!result[yearNum]) {
                result[yearNum] = 0;
            }
            result[yearNum] += value;
        });
        return Object.keys(result).map(year => ({ year: Number(year), value: result[Number(year)] }));
    };
    

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
