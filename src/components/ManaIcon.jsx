export const ManaIcon = ({ tailwind, scale_factor }) => {

	const size = 0.15 * scale_factor

	const container_style = {
		fontSize: size,
	}

	return (
		<i style={container_style} 
			className={tailwind}> 
		</i>
	)
}


