import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-gray-900 text-white p-5">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Votix</h1>
                <nav>
                    <Link to="/login" className="mr-4 hover:underline">Login</Link>
                    <Link to="/register" className="hover:underline">Register</Link>
                </nav>
            </div>
        </header>
    );
}