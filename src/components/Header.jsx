
import Logo from '../assets/logo/logo.png';
import './header.css'

const Header = () => {
  return (
    <header className="header">
      <img src={Logo} alt="SportSee Logo" className='header__logo'/>
      <nav className='header__nav'>
        <ul className='header__list'>
          <li className='header__item'>Accueil</li>
          <li className='header__item'>Profil</li>
          <li className='header__item'>Réglage</li>
          <li className='header__item'>Communauté</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;