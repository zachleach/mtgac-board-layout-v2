import './App.css'
import 'mana-font/css/mana.css'
import { sol_ring, dfc_cr_cr, adv_cr, transform, dfc, adventure, seven, three } from './test_cards'
import { Card, PlayerBoard, OpponentBoard } from './components'



const App = () => {

	const belerin_font = new FontFace('belerin', 'url(mplantin.woff)')
	belerin_font.load().then((font) => {
		document.fonts.add(font)
		console.log('belerin font loaded successfully')
	}).catch((error) => {
		console.error('failed to load font:', error)
	})

	return (
		<div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
			<div style={{ height: '40%', width: '100%', display: 'flex', flexDirection: 'row' }}>
				<OpponentBoard/>
			</div>
			<div style={{ height: '60%', width: '100%', display: 'flex', flexDirection: 'row' }}>
				<PlayerBoard />
			</div>
		</div>
	)
}



export default App
