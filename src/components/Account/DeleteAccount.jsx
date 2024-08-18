function DeleteAccount({deleteAccount}) {
    return (
        <div>
            <button onClick={(e) => deleteAccount(e)}>Удалить аккаунт</button>
        </div>
    );
}
export default DeleteAccount;