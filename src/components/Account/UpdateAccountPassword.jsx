import { useState } from "react";

function UpdateAccountPassword({updateAccountPassword}) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    return (
        <div>
           <form onSubmit={(e) => updateAccountPassword(e, oldPassword, newPassword)}>
                <div>
                    Введите старый пароль: <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </div>
                <div>
                    Повторите новый пароль пароль: <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <button type="submit">Изменить пароль</button>
            </form>
        </div>
    );
}
export default UpdateAccountPassword;