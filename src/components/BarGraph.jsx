import "chart.js/auto"
import { Bar } from "react-chartjs-2"

export default function BarGraph({ data }) {
	return (
		<Bar
			data={data}
			options={{
				animations: false,
				plugins: {
					legend: {
						display: false,
					},
				},
				scales: {
					x: {
						ticks: {
							color: "#1e293b",
							font: {
								family: "Barlow",
								weight: "500",
							},
						},
						title: {
							display: true,
							text: "COUNTRY",
							font: {
								family: "Barlow",
								weight: "500",
							},
						},
					},
					y: {
						ticks: {
							color: "#1e293b",
							font: {
								family: "Barlow",
								weight: "500",
							},
							precision: 0,
						},
						title: {
							display: true,
							text: "NUMBER OF LAUNCHES",
							font: {
								family: "Barlow",
								weight: "500",
							},
						},
						beginAtZero: true,
					},
				},
			}}
		/>
	)
}
