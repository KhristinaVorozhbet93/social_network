import { useNavigate } from 'react-router-dom';
import { useAccountApi } from '../../App';

function Account() {
    const
        accountApiClient = useAccountApi(),
        navigate = useNavigate();

    //здесь подгружаем информацию о пользователе в какой-то div через бд по id аккаунта

    const updateAccountData = async (e) => {
        e.preventDefault();
        navigate("/account/update");
        //здесь подгружаем UpdateAccountData
    }

    return (
        <div>
            <div>
                {/* Фотография */}
            </div>
            <div>
                <div>
                    {/* Личная инфомрация */}
                </div>
                <div>
                    {/* Контактные данные */}
                </div>
                <div>
                    {/* Интересы */}
                </div>
                <button onClick={updateAccountData}>Редактировать профиль</button>
            </div>
        </div>
    );
}
export default Account; 