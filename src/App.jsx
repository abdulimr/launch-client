import { useEffect, useState, useRef, useMemo } from "react"
import { getLaunches } from "./api"
import BarGraph from "./components/BarGraph"
import Map from "./components/Map"

export default function App() {
	const initialStartDate = new Date()
	const initialEndDate = new Date()
	initialEndDate.setMonth(initialEndDate.getMonth() + 1)

	const initialStartDateString = initialStartDate.toISOString().slice(0, 10)
	const initialEndDateString = initialEndDate.toISOString().slice(0, 10)

	const [startDate, setStartDate] = useState(initialStartDateString)
	const [endDate, setEndDate] = useState(initialEndDateString)
	const [launches, setLaunches] = useState([])
	const [maxLaunchesCount, setMaxLaunchesCount] = useState(0)
	const [savedLaunches, setSavedLaunches] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState()
	const scrollRef = useRef()

	const dataLabels = useMemo(() => {
		return savedLaunches.reduce((labels, savedLaunch) => {
			if (!labels.includes(savedLaunch.country)) {
				labels.push(savedLaunch.country)
			}

			return labels
		}, [])
	}, [savedLaunches])

	const data = useMemo(() => {
		return {
			labels: dataLabels,
			datasets: [
				{
					backgroundColor: "#1e40af",
					data: (() => {
						const data = []

						dataLabels.map(country => {
							let count = 0

							for (const savedLaunch of savedLaunches) {
								if (savedLaunch.country == country) {
									count += 1
								}
							}

							data.push(count)
						})

						return data
					})(),
				},
			],
		}
	}, [savedLaunches])

	useEffect(() => {
		initialLoad()
	}, [])

	function sortLaunchesByCountry(launches) {
		return launches.sort((a, b) => a.country.localeCompare(b.country))
	}

	function initialLoad() {
		setError(false)
		setLaunches([])
		setIsLoading(true)

		getLaunches(startDate, endDate)
			.then(response => {
				setLaunches(response.launches)
				setSavedLaunches(sortLaunchesByCountry(response.launches))
				setMaxLaunchesCount(response.count)
			})
			.catch(err => setError(err))
			.finally(() => setIsLoading(false))
	}

	function loadMoreLaunches() {
		if (launches.length != maxLaunchesCount) {
			setIsLoading(true)
			getLaunches(startDate, endDate, launches.length)
				.then(response => {
					setLaunches([...launches, ...response.launches])
					setSavedLaunches(
						sortLaunchesByCountry([...savedLaunches, ...response.launches])
					)
				})
				.finally(() => setIsLoading(false))
		}
	}

	function isSavedLaunch(launch) {
		return savedLaunches.includes(launch)
	}

	function dateChangeLoad(newStartDate, newEndDate) {
		setSavedLaunches([])
		setError(false)
		setLaunches([])
		setIsLoading(true)

		getLaunches(newStartDate, newEndDate)
			.then(response => {
				setLaunches(response.launches)
				setSavedLaunches(sortLaunchesByCountry(response.launches))
				setMaxLaunchesCount(response.count)
			})
			.catch(err => setError(err))
			.finally(() => setIsLoading(false))
	}

	function handleSaveLaunchButtonClick(launch) {
		if (isSavedLaunch(launch)) {
			setSavedLaunches(
				savedLaunches
					.filter(savedLaunch => {
						return savedLaunch !== launch
					})
					.sort((a, b) => a.country.localeCompare(b.country))
			)
		} else {
			setSavedLaunches(
				[...savedLaunches, launch].sort((a, b) =>
					a.country.localeCompare(b.country)
				)
			)
		}
	}

	return (
		<div className="flex">
			<div className="flex flex-col w-full h-screen p-2 mx-auto gap-y-2 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
				<p className="text-xs font-bold text-center text-slate-500">
					MADE BY ABDUL ANWAR
				</p>
				<div className="flex p-2 bg-white border gap-x-2 border-slate-300">
					<div className="flex-1">
						<label
							className="block text-xs font-bold text-slate-700"
							htmlFor="start"
						>
							START DATE
						</label>
						<input
							className="w-full p-1 mt-1 border border-slate-200"
							type="date"
							id="start"
							value={startDate}
							onChange={event => {
								const newStartDate = event.target.value
								setStartDate(newStartDate)

								dateChangeLoad(newStartDate, endDate)
							}}
						/>
					</div>
					<div className="flex-1">
						<label
							className="block text-xs font-bold text-slate-700"
							htmlFor="end"
						>
							END DATE
						</label>
						<input
							className="w-full p-1 mt-1 border border-slate-200"
							type="date"
							id="end"
							value={endDate}
							onChange={event => {
								const newEndDate = event.target.value

								setEndDate(newEndDate)
								dateChangeLoad(startDate, newEndDate)
							}}
						/>
					</div>
				</div>
				<div className="h-56 overflow-y-scroll bg-white border border-slate-300 md:flex-1">
					<div
						ref={scrollRef}
						className="flex flex-col h-full overflow-x-scroll"
						onScroll={() => {
							if (!isLoading && !error) {
								var trueDivHeight = scrollRef.current.scrollHeight
								var divHeight = scrollRef.current.clientHeight
								var scrollLeft = trueDivHeight - divHeight

								const scrollTop = scrollRef.current.scrollTop
								if (scrollTop - scrollLeft == 0) {
									loadMoreLaunches()
								}
							}
						}}
					>
						<table className="w-full text-sm text-left bg-white text-slate-500">
							<thead className="sticky top-0 text-xs uppercase shadow text-slate-700 bg-slate-50">
								<tr>
									<th className="px-2 py-3 whitespace-nowrap">Name</th>
									<th className="px-2 py-3 whitespace-nowrap">Location</th>
									<th className="px-2 py-3 whitespace-nowrap">
										Launch Window Start
									</th>
									<th className="px-2 py-3 whitespace-nowrap">
										Launch Window End
									</th>
									<th className="px-2 py-3 whitespace-nowrap">Rocket Name</th>
									<th className="px-2 py-3 whitespace-nowrap">Save Launch</th>
								</tr>
							</thead>
							{launches.map((launch, index) => (
								<tbody key={launch["id"]}>
									<tr
										className={index != launches.length - 1 ? "border-b" : ""}
									>
										<th className="px-2 py-2 font-medium text-slate-900 whitespace-nowrap xl:whitespace-normal">
											{launch.name}
										</th>
										<td className="px-2 py-2 whitespace-nowrap">
											{launch.location}
										</td>
										<td className="px-2 py-2 whitespace-nowrap">
											{launch.windowStart}
										</td>
										<td className="px-2 py-2 whitespace-nowrap">
											{launch.windowEnd}
										</td>
										<td className="px-2 py-2 whitespace-nowrap">
											{launch.rocketName}
										</td>
										<td className="px-2 py-2 text-center whitespace-nowrap">
											<button
												className="px-3 py-2 border rounded-full border-slate-300 hover:bg-slate-50 text-slate-700"
												onClick={() => handleSaveLaunchButtonClick(launch)}
											>
												{!isSavedLaunch(launch) ? "Save" : "Unsave"}
											</button>
										</td>
									</tr>
								</tbody>
							))}
						</table>
						{error && (
							<div className="flex items-center justify-center flex-1">
								<div className="flex flex-col">
									<p>ERROR: Could not fetch data...</p>
									<button
										className="px-3 py-2 mx-auto mt-2 border rounded-full border-slate-300 hover:bg-slate-50 text-slate-700"
										onClick={initialLoad}
									>
										Retry
									</button>
								</div>
							</div>
						)}
						{isLoading && (
							<div className="flex items-center justify-center flex-1">
								<svg
									role="status"
									className="w-8 h-8 my-6 md:h-10 md:w-10 text-slate-200 animate-spin fill-blue-800"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-col flex-1 gap-y-2 md:flex-row md:gap-x-2">
					<div className="flex-1">
						<div className="relative h-full border border-slate-300">
							<Map savedLaunches={savedLaunches} />
						</div>
					</div>
					<div className="flex-1 md:w-1/2">
						<div className="flex items-center justify-center h-full p-2 bg-white border border-slate-300">
							<BarGraph data={data} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
