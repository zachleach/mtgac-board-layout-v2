import { useRef, useState, useEffect } from 'react'

export const PlayerIcon = ({ health = "20", icon_src }) => {

	const ref = useRef(null)
	const [icon_width, set_icon_width] = useState(0)


	useEffect(() => {
		const update_size = () => {
			if (ref.current) {
				set_icon_width(ref.current.offsetWidth)
			}
		}

		/* on mount setup resize observer */
		const resize_observer = new ResizeObserver(update_size)
		if (ref.current) {
			resize_observer.observe(ref.current)
		}

		/* unmount remove observer */
		return () => {
			if (ref.current) {
				resize_observer.unobserve(ref.current)
			}
			resize_observer.disconnect()
		}
	}, [])

	const scale_factor = icon_width
	const compute_font_size_multiplier = (num_digits) => {
		return num_digits <= 2 ? 0.15 : 0.35 / num_digits
	}
	const num_digits = health.length
	const font_size = compute_font_size_multiplier(num_digits) * scale_factor

	const container_style = {
		border: '1px solid red',
		overflow: 'hidden',
		height: '100%',
		flexShrink: 0,
		aspectRatio: 1,
		position: 'relative',
	}

	/* rounded image */
	const image_style = {
		height: '100%',
		width: '100%',
		borderRadius: '50%',
		objectFit: 'cover',
	}

	const text_style = {
		position: 'absolute',
		right: '2%',
		bottom: '2%',
		height: '20%',
		width: '25%',
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
		<div ref={ref} style={container_style}>
			<img style={image_style} 
				src={icon_src}
			/>
			
			<div style={text_style}>
				{health}
			</div>

		</div>
	)
}

