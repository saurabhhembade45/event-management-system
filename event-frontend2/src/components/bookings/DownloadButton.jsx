import { Download } from 'lucide-react';
import Papa from 'papaparse';

const DownloadButton = ({ data }) => {
  const handleDownload = () => {
    // Format data first if necessary, making sure it only has required fields
    const formattedData = data.map(item => ({
      'Event Name': item.title,
      'Date': item.date,
      'Time': item.time,
      'Status': item.status
    }));
    
    const csv = Papa.unparse(formattedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'my_event_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!data || data.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
    >
      <Download size={16} />
      <span>Download My Data</span>
    </button>
  );
};

export default DownloadButton;
