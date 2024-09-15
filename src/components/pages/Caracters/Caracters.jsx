import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, deleteCaracter } from '../../../store/store'; // Adjust the imports based on your slice
import ConnectedNavbar from '../../templates/connectedNavBar/ConnectedNavbar';
import Footer from '../../UI/organisms/footer/Footer';
import { useNavigate } from 'react-router-dom';
import './caracters.css';

const CaractersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Assuming user profile including caracters is stored in state.caracters.profile
  const userProfile = useSelector((state) => state.caracters.profile);
  const caracters = userProfile ? userProfile.Caracters : [];
  const profileStatus = useSelector((state) => state.caracters.status);

  useEffect(() => {
    if (profileStatus === 'idle') {
      dispatch(fetchUserProfile()); // Fetches the user profile including caracters
    }
  }, [profileStatus, dispatch]);

  const handleEditCaracter = (id) => {
    navigate(`/caracters/edit/${id}`);
  };

  const handleDeleteCaracter = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce personnage ?")) {
      dispatch(deleteCaracter(id));
    }
  };

  return (
    <div className="background-hexa image caracters-list-page">
      <div className="background-edition">
        <ConnectedNavbar />
        <div className="main-container">
          <h1>Mes Personnages</h1>
          <div className="caracters-list">
            {caracters.length > 0 ? (
              caracters.map((caracter) => (
                <div key={caracter.id} className="caracter-card">
                  <h3>{caracter.Name}</h3>
                  {caracter.imageFile ? (
                    <img src={caracter.imageFile} alt={caracter.Name} className="caracter-image" />
                  ) : (
                    <p>Aucune image</p>
                  )}
                  <button onClick={() => handleEditCaracter(caracter.id)}>Éditer</button>
                  <button onClick={() => handleDeleteCaracter(caracter.id)}>Supprimer</button>
                </div>
              ))
            ) : (
              <p>Vous n'avez aucun personnage pour le moment.</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CaractersList;
