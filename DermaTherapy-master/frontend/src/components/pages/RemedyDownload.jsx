import React from "react";

const RemedyDownload = ({ result }) => {
  const handleDownload = () => {
    // Create a temporary DOM element to extract plain text
    const tempElement = document.createElement("div");
    tempElement.innerHTML = result;

    // Get plain text
    const plainText = tempElement.innerText;

    // Create and download as .txt
    const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "remedy.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleDownload}
        className="inline-block mt-2 px-4 py-2 bg-[#CAF0F8] text-[#03045E] hover:bg-[#0077B6] hover:text-white rounded-md transition-colors"
      >
        Download Remedy 
      </button>
    </div>
  );
};

export default RemedyDownload;
