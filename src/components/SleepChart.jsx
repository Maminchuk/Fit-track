import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SleepChart({ data }) {
  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Sleep Hours',
        data: data.map(item => item.hours),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sleep Duration' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Hours' } }
    }
  };

  return <Bar data={chartData} options={options} />;
}

export default SleepChart;
