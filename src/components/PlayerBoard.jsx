


export const PlayerBoard = ({ height_p, icon_src }) => {
	const container_style = {
		overflow: 'hidden',
		height: height_p,
		width: '100%',
	}

	return (
		<div style={container_style}>
			{/* creatures */}
			<Row height_p={"33.3%"} scryfall_card_json_arr={[seven]}/>

			<div style={{ display: 'flex', height: "33.3%", flexDirection: 'row' }}>
				{/* lands */}
				<Row height_p={"100%"}/>
				{/* player icon */}
				<PlayerIcon icon_src={icon_src}/>
				{/* artifacts / enchantment */}
				<Row height_p={"100%"}/>
			</div>

			<div style={{ display: 'flex', height: "33.3%", flexDirection: 'row' }}>
				{/* library, graveyard, exile */}
				<LibraryGraveyardExile width_p={'30%'}/>

				{/* hand row */}
				<Row width_p={"60%"}/>

				{/* stack */}
				<div style={{ width: '30%', border: '1px solid red'}}>
					Spell Stack
				</div>
			</div>


		</div>
	)

}







