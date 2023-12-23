/* eslint-disable react-hooks/exhaustive-deps */

import NetflixLogo from 'src/assets/images/logos/netflix-logo.png'
import AmazonPrimeLogo from 'src/assets/images/logos/amazon-prime-logo.png'
import YoutubeLogo from 'src/assets/images/logos/youtube-logo.png'
import './ThrustedBySection.styles.css'

const ITEMS = [
    {
        name: 'Netflix',
        imageUrl: NetflixLogo,
    },
    {
        name: 'Amazon Prime',
        imageUrl: AmazonPrimeLogo,
    },
    {
        name: 'Youtube',
        imageUrl: YoutubeLogo,
    },
]

const ThrustedBySection = () => {
    return (
        <div className='ThrustedBySection'>
            <h2 initial='hidden'>trusted by people who watch</h2>
            <div className='ThrustedBySectionLogoContainer'>
                {ITEMS.map((x, index) => (
                    <div className='ThrustedBySectionItem'>
                        <img src={x.imageUrl} alt={x.name} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ThrustedBySection
