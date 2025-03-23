import './App.css'
import 'mana-font/css/mana.css'
import { sol_ring, dfc_cr_cr, adv_cr, transform, dfc, adventure, seven, three } from './test_cards'
import { Card } from './components'



const App = () => {

	const belerin_font = new FontFace('belerin', 'url(mplantin.woff)')
	belerin_font.load().then((font) => {
		document.fonts.add(font)
		console.log('belerin font loaded successfully')
	}).catch((error) => {
		console.error('failed to load font:', error)
	})

	return (
		<div style={{ height: '100vh', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
			<Card scryfall_json={adv_cr} />
			<Card scryfall_json={seven} />
			<Card scryfall_json={dfc_cr_cr} />
			<Card scryfall_json={three} />
			<Card scryfall_json={sol_ring} />
		</div>
	)
}



export default App
