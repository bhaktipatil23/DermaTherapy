import { useState } from 'react';

const DetectCond = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetect = async () => {
    setLoading(true);
    try {
        const response = await fetch('https://serverless.roboflow.com/infer/workflows/eczema-veixh/custom-workflow-26', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: 'GEMINNI_API_KEY',
              inputs: {
                image: {
                  type: 'url',
                  value: imageUrl,
                }
              }
            }),
          });

        const text = await response.text();
        console.log("Raw Roboflow response:", text);
        throw new Error(`Roboflow API error: ${response.status}`);
          

    //   const data = await response.json();
    //   setResult(data);
    } catch (error) {
      console.error('Detection error:', error);
      setResult({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Skin Condition Detector</h2>

      <input
        type="text"
        placeholder="Enter image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleDetect}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Detecting...' : 'Detect Condition'}
      </button>

      {result && (
        <pre className="mt-4 bg-gray-100 p-4 rounded overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DetectCond;
