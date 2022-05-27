const ENDPOINT = "https://lldev.thespacedevs.com/2.2.0/launch"

function convertISOStringToReadableString(isoString) {
	const providedDate = new Date(isoString)

	const year = providedDate.getFullYear()
	const month = providedDate.toLocaleString("default", { month: "long" })
	const date = providedDate.getDate()

	const hour = providedDate.toLocaleString("en-US", {
		hour: "numeric",
		hour12: false,
	})
	var minute = providedDate.getMinutes()
	if (minute < 10) {
		minute = `${0}${minute.toString()}`
	}

	return `${hour}:${minute} • ${date} ${month}, ${year}`
}

export function getLaunches(startDate, endDate, offset = 0) {
	const windowStart = new Date(startDate).toISOString()
	const windowEndDate = new Date(endDate)
	windowEndDate.setHours(23)
	windowEndDate.setMinutes(59)

	const windowEnd = windowEndDate.toISOString()

	return fetch(
		`${ENDPOINT}?limit=9999&offset=${offset}&window_start__gte=${windowStart}&window_end__lte=${windowEnd}`
	)
		.then(res => res.json())
		.then(data => {
			const count = data["count"]
			const launches = data["results"]

			const modifiedLaunches = launches.map(launch => {
				const id = launch["id"]
				const name = launch["name"]
				const location = launch["pad"]["location"]["name"]
				const windowStart = convertISOStringToReadableString(
					launch["window_start"]
				)
				const windowEnd = convertISOStringToReadableString(launch["window_end"])
				const rocketName = launch["rocket"]["configuration"]["name"]
				const latitude = Number(launch["pad"]["latitude"])
				const longitude = Number(launch["pad"]["longitude"])
				const country = location.split(",").pop()

				return {
					id,
					name,
					location,
					windowStart,
					windowEnd,
					rocketName,
					latitude,
					longitude,
					country,
				}
			})

			return {
				launches: modifiedLaunches,
				count: count,
			}
		})
}
