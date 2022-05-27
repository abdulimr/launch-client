import { Map as PigeonMap, Marker } from "pigeon-maps"

export default function Map({ savedLaunches }) {
	return (
		<PigeonMap defaultCenter={[0, 0]} defaultZoom={1}>
			{savedLaunches.map(launch => (
				<Marker
					key={launch.id}
					width={50}
					anchor={[launch.latitude, launch.longitude]}
					color="#1e40af"
				/>
			))}
		</PigeonMap>
	)
}
