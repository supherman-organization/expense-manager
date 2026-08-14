import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import { type UserRole } from '../types';

interface Props {
    children: ReactNode;
    roles?: UserRole[];
}

export default function ProtectedRoute({ children, roles }: Props) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Chargement...</div>;
    }
    if (!user){
        return <Navigate to="/connexion" replace />;
    }
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }
    return <>{ children }</>;
}