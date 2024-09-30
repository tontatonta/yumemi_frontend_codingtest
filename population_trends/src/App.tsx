import React, { useState } from 'react';
import CheckboxList from './companents/CheckboxList';
import PopulationGraph from './companents/PopulationGraph';

const App: React.FC = () => {
    const [selectedPrefCodes, setSelectedPrefCodes] = useState<number[]>([]);

    return (
        <div>
            <h1>都道府県別の総人口推移</h1>
            <CheckboxList onSelect={setSelectedPrefCodes} />
            {selectedPrefCodes.length > 0 && <PopulationGraph selectedPrefCodes={selectedPrefCodes} />}
        </div>
    );
};

export default App;