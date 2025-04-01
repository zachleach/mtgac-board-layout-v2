

export const LibraryGraveyardExile = ({ height_p = '100%', width_p = '100%' }) => {

	const container_style = {
		border: '1px solid red',
		overflow: 'hidden',
		width: width_p,
		height: height_p,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	}

	return (
		<div style={container_style}>
			Library, Graveyard, Exile (need refactor)
		</div>
	)
}

