function SignIn({ setIsLoggedIn }) {
  return (
    <div className="p-4">
      <button
        onClick={() => setIsLoggedIn(true)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Sign In
      </button>
    </div>
  );
}

export default SignIn;
