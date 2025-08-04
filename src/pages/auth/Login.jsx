import { useState } from 'react';
import { loginUser } from '../../api/auth';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await loginUser(form);
            // redirect to /vote or /admin
            window.location.href = '/vote';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue-800 to-gray-800 p-3">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md  max-w-5xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Login to Votix</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full mb-3 px-4 py-2 border rounded"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full mb-4 px-4 py-2 border rounded"
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Login
                </button>
            </form>
        </div>
    );
}
