
export const PowerToughness = ({ p = '99', t = '9', scale_factor }) => {
	const compute_font_size_multiplier = (num_digits) => {
		return num_digits === 2 ? 0.15 : 0.35 / num_digits
	}
	const num_digits = (p + t).length
	const font_size = compute_font_size_multiplier(num_digits) * scale_factor

	const container_style = {
		position: 'absolute',
		right: '2%',
		bottom: '2%',
		width: '26%',
		height: '12%',
		backgroundColor: 'rgba(240, 240, 240, .9)',
		borderRadius: '10%',
    boxShadow: '0px 0px 2% rgba(0, 0, 0, .5)',
		zIndex: 2,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		outline: '1px solid rgba(240, 240, 240, 1)',
		whiteSpace: 'nowrap',

		fontFamily: 'belerin',
		fontSize: font_size,
		color: 'rgba(68, 68, 68, 1)',
		fontWeight: 'bold',
	}

	return (
		<div style={container_style}>
			{p}/{t}
		</div>
	)
}
